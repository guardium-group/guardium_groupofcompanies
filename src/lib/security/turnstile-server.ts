/**
 * Server-side Cloudflare Turnstile verification.
 * Only import this from server code (server actions / route handlers): it
 * reads TURNSTILE_SECRET_KEY.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileConfigured(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return { success: false, error: "Turnstile secret key not configured" };
  }
  if (!token) {
    return { success: false, error: "missing-input-response" };
  }

  try {
    const body = new URLSearchParams({ secret: secretKey, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
    });

    const data = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: data["error-codes"]?.join(", ") || "Verification failed",
    };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Verification service unavailable" };
  }
}
