/**
 * Multi-layer spam detection system
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Minimum time (ms) for a human to fill out the form
const MIN_SUBMISSION_TIME = 5000; // 5 seconds

// Maximum time (ms) before form token expires
const MAX_SUBMISSION_TIME = 30 * 60 * 1000; // 30 minutes

// Secret used to sign the anti-bot timing token so it can't be forged by a
// client sending an arbitrary timestamp. Falls back to a per-process random
// secret when FORM_TOKEN_SECRET isn't set — tokens just won't survive a
// server restart, matching the existing rate-limiter's in-memory tradeoff.
const FORM_TOKEN_SECRET = process.env.FORM_TOKEN_SECRET || randomBytes(32).toString("hex");

function sign(timestamp: number, nonce: string): string {
  return createHmac("sha256", FORM_TOKEN_SECRET)
    .update(`${timestamp}.${nonce}`)
    .digest("hex");
}

// Nonces of tokens that have already been used for a sent message, kept until
// the token would have expired anyway. In-memory, like the rate limiter.
const usedNonces = new Map<string, number>();
const MAX_USED_NONCES = 10_000;

function pruneUsedNonces(now: number): void {
  for (const [nonce, expiresAt] of usedNonces) {
    if (expiresAt <= now) usedNonces.delete(nonce);
  }
  while (usedNonces.size >= MAX_USED_NONCES) {
    const oldest = usedNonces.keys().next().value;
    if (oldest === undefined) break;
    usedNonces.delete(oldest);
  }
}

function parseToken(token: string): { nonce: string; signature: string } | null {
  const [nonce, signature, extra] = token.split(".");
  if (!nonce || !signature || extra !== undefined) return null;
  return { nonce, signature };
}

// Suspicious patterns in text. No /g flag: these are reused with .test(),
// and a global regex keeps lastIndex between calls and misses matches.
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
  /\b(click here|act now|limited time|free money)\b/i,
  /(http|https):\/\/[^\s]+/, // URLs in notes
  /(.)\1{4,}/, // Repeated characters (aaaaa)
  /[A-Z]{10,}/, // All caps sequences
];

// Suspicious email patterns
const SUSPICIOUS_EMAIL_PATTERNS = [
  /^test@/i,
  /^admin@/i,
  /^info@/i,
  /\.ru$/i,
  /\.cn$/i,
  /tempmail/i,
  /throwaway/i,
  /mailinator/i,
  /guerrillamail/i,
  /10minutemail/i,
];

export interface SpamCheckResult {
  isSpam: boolean;
  score: number; // 0-100, higher = more likely spam
  reasons: string[];
}

export interface FormSecurityData {
  honeypot?: string;
  formToken?: string;
  timestamp?: number;
}

/**
 * Generate a server-signed form token. Must be called server-side (e.g. from
 * a server action) so the timestamp it signs is trustworthy — a client can
 * still claim any timestamp it wants, but it can no longer produce a
 * signature that validates against a timestamp the server didn't actually
 * hand out.
 */
export function generateFormToken(): { token: string; timestamp: number } {
  const timestamp = Date.now();
  const nonce = randomBytes(16).toString("hex");
  return { token: `${nonce}.${sign(timestamp, nonce)}`, timestamp };
}

/**
 * Validate form token and timing. Confirms the token is a valid signature
 * for the given timestamp (not just "present"), that it hasn't already been
 * used to send a message, and that it falls inside the timing window.
 */
export function validateFormTiming(
  token: string | undefined,
  timestamp: number | undefined
): { valid: boolean; reason?: string; expired?: boolean } {
  if (typeof token !== "string" || typeof timestamp !== "number" || !token || !timestamp) {
    return { valid: false, reason: "Missing security token", expired: true };
  }

  const parsed = parseToken(token);
  const expected = parsed ? Buffer.from(sign(timestamp, parsed.nonce)) : null;
  const actual = parsed ? Buffer.from(parsed.signature) : null;
  if (
    !parsed ||
    !expected ||
    !actual ||
    expected.length !== actual.length ||
    !timingSafeEqual(expected, actual)
  ) {
    return { valid: false, reason: "Invalid security token. Please refresh and try again.", expired: true };
  }

  const now = Date.now();
  const usedUntil = usedNonces.get(parsed.nonce);
  if (usedUntil !== undefined && usedUntil > now) {
    return { valid: false, reason: "This form was already submitted. Please refresh and try again.", expired: true };
  }

  const elapsed = now - timestamp;

  // Too fast - definitely a bot
  if (elapsed < MIN_SUBMISSION_TIME) {
    return { valid: false, reason: "Form submitted too quickly" };
  }

  // Token expired
  if (elapsed > MAX_SUBMISSION_TIME) {
    return { valid: false, reason: "Form session expired. Please try again.", expired: true };
  }

  return { valid: true };
}

/**
 * Mark a validated form token as used so it can't send a second message.
 * Call synchronously right before sending: Node runs it without interleaving,
 * so two concurrent requests with the same token can't both pass.
 * Returns false if the token was already used.
 */
export function consumeFormToken(token: string, timestamp: number): boolean {
  const parsed = parseToken(token);
  if (!parsed) return false;

  const now = Date.now();
  const usedUntil = usedNonces.get(parsed.nonce);
  if (usedUntil !== undefined && usedUntil > now) return false;

  pruneUsedNonces(now);
  usedNonces.set(parsed.nonce, timestamp + MAX_SUBMISSION_TIME);
  return true;
}

/** Undo consumeFormToken when sending failed, so the visitor can retry. */
export function releaseFormToken(token: string): void {
  const parsed = parseToken(token);
  if (parsed) usedNonces.delete(parsed.nonce);
}

/**
 * Check if honeypot field was filled (bots fill hidden fields)
 */
export function validateHoneypot(honeypotValue: string | undefined): boolean {
  // Honeypot should be empty - bots fill it
  return !honeypotValue || honeypotValue.trim() === "";
}

/**
 * Analyze text content for spam patterns
 */
function analyzeContent(text: string): { score: number; reasons: string[] } {
  if (!text) return { score: 0, reasons: [] };

  let score = 0;
  const reasons: string[] = [];

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      score += 20;
      reasons.push("Suspicious content pattern detected");
      break; // Don't over-penalize
    }
  }

  // Check for excessive special characters
  const specialCharRatio = (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length;
  if (specialCharRatio > 0.3) {
    score += 15;
    reasons.push("Unusual character ratio");
  }

  // Check for very short or very long content
  if (text.length < 3) {
    score += 10;
    reasons.push("Content too short");
  }

  return { score, reasons };
}

/**
 * Check email for suspicious patterns
 */
function analyzeEmail(email: string): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  for (const pattern of SUSPICIOUS_EMAIL_PATTERNS) {
    if (pattern.test(email)) {
      score += 25;
      reasons.push("Suspicious email domain");
      break;
    }
  }

  // Check for random-looking email
  const localPart = email.split("@")[0];
  if (localPart && /^[a-z0-9]{15,}$/i.test(localPart)) {
    score += 15;
    reasons.push("Possibly auto-generated email");
  }

  return { score, reasons };
}

/**
 * Comprehensive spam check
 */
export function performSpamCheck(data: {
  name: string;
  email: string;
  message?: string;
}): SpamCheckResult {
  let totalScore = 0;
  const allReasons: string[] = [];

  // Analyze each field
  const nameCheck = analyzeContent(data.name);
  totalScore += nameCheck.score;
  allReasons.push(...nameCheck.reasons);

  const emailCheck = analyzeEmail(data.email);
  totalScore += emailCheck.score;
  allReasons.push(...emailCheck.reasons);

  if (data.message) {
    const messageCheck = analyzeContent(data.message);
    totalScore += messageCheck.score;
    allReasons.push(...messageCheck.reasons);
  }

  // Cap score at 100
  totalScore = Math.min(100, totalScore);

  return {
    isSpam: totalScore >= 50,
    score: totalScore,
    reasons: [...new Set(allReasons)], // Deduplicate
  };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string, options: { multiline?: boolean } = {}): string {
  if (!input) return "";

  const cleaned = input
    // Normalize line endings
    .replace(/\r\n?/g, "\n")
    // Remove control characters (including null bytes) except newlines
    .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "");

  const normalized = options.multiline
    ? cleaned
        // Collapse runs of spaces/tabs but keep line breaks
        .replace(/[^\S\n]+/g, " ")
        .replace(/ *\n */g, "\n")
        // At most one blank line in a row
        .replace(/\n{3,}/g, "\n\n")
    : // Single-line fields (name, email, subject) must never contain newlines
      cleaned.replace(/\s+/g, " ");

  return normalized.trim().slice(0, 5000);
}

/**
 * Escape a string for safe interpolation into HTML content (e.g. outbound
 * transactional emails). Sanitizing/trimming input is not the same as
 * escaping it — this must be applied at the point of HTML interpolation.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitize all form data
 */
const MULTILINE_FIELDS = new Set(["message"]);

export function sanitizeFormData<T extends object>(data: T): T {
  const sanitized = { ...data } as Record<string, unknown>;

  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value, { multiline: MULTILINE_FIELDS.has(key) });
    } else if (Array.isArray(value)) {
      sanitized[key] = value
        .slice(0, 20)
        .map((item) => (typeof item === "string" ? sanitizeInput(item) : item));
    }
  }

  return sanitized as T;
}
