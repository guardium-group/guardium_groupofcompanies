"use server";

import { headers } from "next/headers";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import {
  checkRateLimit,
  isRateLimited,
  getRateLimitKey,
  RATE_LIMITS,
} from "@/lib/security/rate-limiter";
import {
  validateHoneypot,
  validateFormTiming,
  consumeFormToken,
  releaseFormToken,
  performSpamCheck,
  sanitizeFormData,
  escapeHtml,
  generateFormToken,
} from "@/lib/security/spam-detection";
import {
  isTurnstileConfigured,
  verifyTurnstileToken,
} from "@/lib/security/turnstile-server";

const BREVO_API_URL = "https://api.brevo.com/v3";
const PHONE_DISPLAY = "+1 780-809-7860";

// Local testing only: run every check but skip the Brevo call. Set as a
// process env var on a test server, never in an .env file.
const DRY_RUN = process.env.CONTACT_DRY_RUN === "1";
if (DRY_RUN) {
  console.warn(
    "[CONTACT] *** DRY RUN MODE — contact form submissions will NOT be emailed (CONTACT_DRY_RUN=1) ***"
  );
}

// Untrusted input shape: services are validated against serviceOptions on the server.
export interface ContactSubmission extends Omit<ContactFormData, "services"> {
  services?: string[];
  _honeypot?: string;
  _formToken?: string;
  _timestamp?: number;
  _turnstileToken?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
  code?: string;
}

let warnedNoTrustedIp = false;

/**
 * Client IP from the single header named by TRUSTED_IP_HEADER (e.g.
 * "cf-connecting-ip" behind Cloudflare, "x-real-ip" behind a proxy that sets
 * it). Any other forwarding header can be set by the client, so without that
 * configuration we return null and skip per-IP limits rather than put every
 * visitor in one shared bucket.
 */
async function getClientIP(): Promise<string | null> {
  const headerName = process.env.TRUSTED_IP_HEADER?.trim().toLowerCase();
  if (headerName) {
    const headersList = await headers();
    const value = headersList.get(headerName)?.split(",")[0]?.trim();
    if (value) return value.slice(0, 64);
  }

  if (!warnedNoTrustedIp) {
    warnedNoTrustedIp = true;
    console.warn(
      "[SECURITY] TRUSTED_IP_HEADER is not set or the header is missing; per-IP rate limiting is disabled."
    );
  }
  return null;
}

/**
 * Issue a server-signed anti-bot token. Must be called from the client via
 * this server action (rather than generated locally) so the timestamp it
 * signs is one the server actually issued, not one the client made up.
 */
export async function getFormToken(): Promise<{ token: string; timestamp: number }> {
  return generateFormToken();
}

function logSecurityEvent(
  event: string,
  details: Record<string, unknown>
): void {
  console.warn(`[SECURITY] ${event}:`, {
    ...details,
    timestamp: new Date().toISOString(),
  });
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

export async function submitContact(
  rawData: ContactSubmission
): Promise<ContactResponse> {
  const clientIP = await getClientIP();

  try {
    if (!rawData || typeof rawData !== "object") {
      return { success: false, message: "Please check your input and try again.", code: "VALIDATION_ERROR" };
    }

    // ==========================================
    // LAYER 1: Honeypot Check
    // ==========================================
    if (!validateHoneypot(typeof rawData._honeypot === "string" ? rawData._honeypot : undefined)) {
      logSecurityEvent("HONEYPOT_TRIGGERED", { ip: clientIP, form: "contact" });
      return {
        success: true,
        message: "Message sent successfully!",
      };
    }

    // ==========================================
    // LAYER 2: Signed form token + timing
    // ==========================================
    const timingResult = validateFormTiming(rawData._formToken, rawData._timestamp);
    if (!timingResult.valid) {
      logSecurityEvent("TIMING_VIOLATION", {
        ip: clientIP,
        form: "contact",
        reason: timingResult.reason,
      });
      return {
        success: false,
        message: timingResult.reason || "Please try again",
        code: timingResult.expired ? "TOKEN_EXPIRED" : "TIMING_ERROR",
      };
    }

    // ==========================================
    // LAYER 3: Rate Limiting by IP (only with a trusted IP source)
    // ==========================================
    if (clientIP) {
      if (isRateLimited(getRateLimitKey("suspicious", clientIP), RATE_LIMITS.suspicious)) {
        logSecurityEvent("SUSPICIOUS_BLOCKED", { ip: clientIP, form: "contact" });
        return {
          success: false,
          message: `Your message could not be sent. Please call us directly at ${PHONE_DISPLAY}.`,
          code: "RATE_LIMIT",
        };
      }

      const ipRateLimit = checkRateLimit(
        getRateLimitKey("contact_ip", clientIP),
        RATE_LIMITS.contact
      );
      if (!ipRateLimit.allowed) {
        logSecurityEvent("RATE_LIMIT_IP", {
          ip: clientIP,
          form: "contact",
          retryAfter: ipRateLimit.retryAfter,
        });
        return {
          success: false,
          message: `Too many requests. Please wait ${Math.ceil((ipRateLimit.retryAfter || 60) / 60)} minutes.`,
          code: "RATE_LIMIT",
        };
      }
    }

    // ==========================================
    // LAYER 4: Sanitize + Schema Validation
    // ==========================================
    const sanitized = sanitizeFormData({
      name: rawData.name,
      email: rawData.email,
      message: rawData.message,
      services: rawData.services,
    });
    const parsed = contactSchema.safeParse(sanitized);
    if (!parsed.success) {
      logSecurityEvent("VALIDATION_FAILED", {
        ip: clientIP,
        form: "contact",
        issues: parsed.error.issues.map((issue) => issue.message),
      });
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Please check your input and try again.",
        code: "VALIDATION_ERROR",
      };
    }
    const data = parsed.data;
    const emailKey = data.email.toLowerCase();

    if (isRateLimited(getRateLimitKey("suspicious", emailKey), RATE_LIMITS.suspicious)) {
      logSecurityEvent("SUSPICIOUS_BLOCKED", { ip: clientIP, form: "contact", email: maskEmail(emailKey) });
      return {
        success: false,
        message: `Your message could not be sent. Please call us directly at ${PHONE_DISPLAY}.`,
        code: "RATE_LIMIT",
      };
    }

    // ==========================================
    // LAYER 5: Turnstile CAPTCHA Verification
    // ==========================================
    if (isTurnstileConfigured()) {
      const turnstileResult = await verifyTurnstileToken(
        typeof rawData._turnstileToken === "string" ? rawData._turnstileToken : "",
        clientIP
      );
      if (!turnstileResult.success) {
        logSecurityEvent("TURNSTILE_FAILED", {
          ip: clientIP,
          form: "contact",
          error: turnstileResult.error,
        });
        return {
          success: false,
          message: "Security verification failed. Please complete the check and try again.",
          code: "CAPTCHA_FAILED",
        };
      }
    } else if (process.env.NODE_ENV === "production") {
      // Fail closed: without CAPTCHA the form is an open relay to our inbox.
      logSecurityEvent("TURNSTILE_NOT_CONFIGURED", { ip: clientIP, form: "contact" });
      return {
        success: false,
        message: `The contact form is temporarily unavailable. Please call us directly at ${PHONE_DISPLAY}.`,
        code: "CONFIG_ERROR",
      };
    }

    // ==========================================
    // LAYER 6: Spam Content Analysis
    // ==========================================
    const spamCheck = performSpamCheck({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (spamCheck.isSpam) {
      logSecurityEvent("SPAM_DETECTED", {
        ip: clientIP,
        form: "contact",
        score: spamCheck.score,
        reasons: spamCheck.reasons,
      });

      // Block this sender for a while (enforced at layers 3 and 4).
      checkRateLimit(getRateLimitKey("suspicious", emailKey), RATE_LIMITS.suspicious);
      if (clientIP) {
        checkRateLimit(getRateLimitKey("suspicious", clientIP), RATE_LIMITS.suspicious);
      }

      return {
        success: false,
        message: `Your message could not be sent. Please call us directly at ${PHONE_DISPLAY}.`,
        code: "VALIDATION_ERROR",
      };
    }

    // ==========================================
    // LAYER 7: Rate Limiting by Email
    // (after CAPTCHA/spam checks so forged submissions can't use up a real
    // person's allowance)
    // ==========================================
    const emailRateLimit = checkRateLimit(
      getRateLimitKey("contact_email", emailKey),
      RATE_LIMITS.contactByEmail
    );

    if (!emailRateLimit.allowed) {
      logSecurityEvent("RATE_LIMIT_EMAIL", {
        ip: clientIP,
        form: "contact",
        email: maskEmail(emailKey),
      });
      return {
        success: false,
        message: "A message was recently sent from this email. Please wait or call us directly.",
        code: "RATE_LIMIT",
      };
    }

    // ==========================================
    // LAYER 8: Environment Check
    // ==========================================
    if (!DRY_RUN && !process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY not configured");
      return {
        success: false,
        message: "Contact service temporarily unavailable. Please call us directly.",
        code: "CONFIG_ERROR",
      };
    }

    // ==========================================
    // LAYER 9: Single-use form token
    // (synchronous check-and-set, so concurrent replays can't both pass)
    // ==========================================
    if (!consumeFormToken(rawData._formToken as string, rawData._timestamp as number)) {
      logSecurityEvent("TOKEN_REPLAY", { ip: clientIP, form: "contact" });
      return {
        success: false,
        message: "This form was already submitted. Please refresh and try again.",
        code: "TOKEN_EXPIRED",
      };
    }

    if (DRY_RUN) {
      console.log(`[CONTACT] DRY RUN — would send message from ${maskEmail(emailKey)}`);
      return {
        success: true,
        message: "Message sent successfully! We'll get back to you within 24 hours.",
      };
    }

    // ==========================================
    // SEND EMAIL TO DISPATCH
    // ==========================================
    const submittedAt = new Date().toLocaleString("en-CA", {
      timeZone: "America/Edmonton",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Escape everything that gets interpolated into htmlContent below —
    // sanitizeFormData() strips control characters but does not HTML-escape,
    // so this is the only guard against HTML/script injection into the
    // outbound email.
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br>");

    const servicesHtml = data.services && data.services.length > 0
      ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #6b7280;">Services Interested:</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            ${data.services.map(escapeHtml).join(", ")}
          </td>
        </tr>
      `
      : "";

    const emailPayload = {
      sender: {
        name: "Guardium Group Website",
        email: "noreply@guardiumgroup.com",
      },
      to: [
        {
          email: "info@guardiumgroup.com",
          name: "Guardium Group",
        },
      ],
      replyTo: {
        email: data.email,
        name: data.name,
      },
      subject: `New Contact Form Submission - ${data.name}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #511010; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>

          <div style="padding: 30px; background-color: #f9fafb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #6b7280;">Name:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  ${safeName}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #6b7280;">Email:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <a href="mailto:${safeEmail}" style="color: #511010;">${safeEmail}</a>
                </td>
              </tr>
              ${servicesHtml}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #6b7280;">Submitted:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  ${submittedAt}
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px;">
              <strong style="color: #6b7280;">Message:</strong>
              <div style="background-color: white; padding: 16px; border-radius: 8px; margin-top: 8px; border: 1px solid #e5e7eb;">
                ${safeMessage}
              </div>
            </div>
          </div>

          <div style="padding: 20px; background-color: #1f2937; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              This message was sent from the Guardium Group website contact form.
            </p>
          </div>
        </div>
      `,
    };

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY as string,
      },
      body: JSON.stringify(emailPayload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      releaseFormToken(rawData._formToken as string);
      const errorData = await response.json().catch(() => ({}));
      console.error("Brevo email error:", errorData);
      return {
        success: false,
        message: "Unable to send message. Please try again or call us directly.",
        code: "EMAIL_ERROR",
      };
    }

    console.log(`[CONTACT] Message sent from ${maskEmail(emailKey)}`);

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
    };
  } catch (error) {
    if (rawData && typeof rawData._formToken === "string") {
      releaseFormToken(rawData._formToken);
    }
    console.error("Contact submission error:", error);

    logSecurityEvent("SUBMISSION_ERROR", {
      ip: clientIP,
      form: "contact",
      error: error instanceof Error ? error.message : "Unknown",
    });

    return {
      success: false,
      message: "Unable to send message. Please try again or call us directly.",
      code: "SERVER_ERROR",
    };
  }
}
