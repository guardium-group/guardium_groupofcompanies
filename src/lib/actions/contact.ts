"use server";

import { headers } from "next/headers";
import { type ContactFormData } from "@/lib/validations/contact";
import {
  checkRateLimit,
  getRateLimitKey,
  RATE_LIMITS,
} from "@/lib/security/rate-limiter";
import {
  validateHoneypot,
  validateFormTiming,
  performSpamCheck,
  sanitizeFormData,
} from "@/lib/security/spam-detection";
import { verifyTurnstileToken } from "@/components/ui/turnstile";

const BREVO_API_URL = "https://api.brevo.com/v3";

export interface ContactSubmission extends ContactFormData {
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

async function getClientIP(): Promise<string> {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = headersList.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = headersList.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return "unknown";
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

export async function submitContact(
  rawData: ContactSubmission
): Promise<ContactResponse> {
  const clientIP = await getClientIP();

  try {
    // ==========================================
    // LAYER 1: Honeypot Check
    // ==========================================
    if (!validateHoneypot(rawData._honeypot)) {
      logSecurityEvent("HONEYPOT_TRIGGERED", { ip: clientIP, form: "contact" });
      return {
        success: true,
        message: "Message sent successfully!",
      };
    }

    // ==========================================
    // LAYER 2: Timing Validation
    // ==========================================
    const timingResult = validateFormTiming(
      rawData._formToken,
      rawData._timestamp
    );
    if (!timingResult.valid) {
      logSecurityEvent("TIMING_VIOLATION", {
        ip: clientIP,
        form: "contact",
        reason: timingResult.reason,
      });
      return {
        success: false,
        message: timingResult.reason || "Please try again",
        code: "TIMING_ERROR",
      };
    }

    // ==========================================
    // LAYER 3: Rate Limiting by IP
    // ==========================================
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

    // ==========================================
    // LAYER 4: Sanitize Input
    // ==========================================
    const data = sanitizeFormData(rawData);

    // ==========================================
    // LAYER 5: Rate Limiting by Email
    // ==========================================
    const emailRateLimit = checkRateLimit(
      getRateLimitKey("contact_email", data.email.toLowerCase()),
      RATE_LIMITS.contactByEmail
    );

    if (!emailRateLimit.allowed) {
      logSecurityEvent("RATE_LIMIT_EMAIL", {
        ip: clientIP,
        form: "contact",
        email: data.email,
      });
      return {
        success: false,
        message: "A message was recently sent from this email. Please wait or call us directly.",
        code: "RATE_LIMIT",
      };
    }

    // ==========================================
    // LAYER 6: Turnstile CAPTCHA Verification
    // ==========================================
    if (process.env.TURNSTILE_SECRET_KEY && data._turnstileToken) {
      const turnstileResult = await verifyTurnstileToken(data._turnstileToken);
      if (!turnstileResult.success) {
        logSecurityEvent("TURNSTILE_FAILED", {
          ip: clientIP,
          form: "contact",
          error: turnstileResult.error,
        });
        return {
          success: false,
          message: "Security verification failed. Please refresh and try again.",
          code: "CAPTCHA_FAILED",
        };
      }
    }

    // ==========================================
    // LAYER 7: Spam Content Analysis
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

      checkRateLimit(
        getRateLimitKey("suspicious", clientIP),
        RATE_LIMITS.suspicious
      );

      return {
        success: false,
        message: "Your message could not be sent. Please call us directly at 780-809-7860.",
        code: "VALIDATION_ERROR",
      };
    }

    // ==========================================
    // LAYER 8: Environment Check
    // ==========================================
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY not configured");
      return {
        success: false,
        message: "Contact service temporarily unavailable. Please call us directly.",
        code: "CONFIG_ERROR",
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

    const servicesHtml = data.services && data.services.length > 0
      ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #6b7280;">Services Interested:</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            ${data.services.join(", ")}
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
                  ${data.name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #6b7280;">Email:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <a href="mailto:${data.email}" style="color: #511010;">${data.email}</a>
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
                ${data.message.replace(/\n/g, "<br>")}
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
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Brevo email error:", errorData);
      return {
        success: false,
        message: "Unable to send message. Please try again or call us directly.",
        code: "EMAIL_ERROR",
      };
    }

    console.log(`[CONTACT] Message sent from ${data.email}`);

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
    };
  } catch (error) {
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
