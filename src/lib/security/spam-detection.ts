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

function signTimestamp(timestamp: number): string {
  return createHmac("sha256", FORM_TOKEN_SECRET).update(String(timestamp)).digest("hex");
}

// Suspicious patterns in text
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
  /\b(click here|act now|limited time|free money)\b/i,
  /(http|https):\/\/[^\s]+/g, // URLs in notes
  /(.)\1{4,}/g, // Repeated characters (aaaaa)
  /[A-Z]{10,}/g, // All caps sequences
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
  return { token: signTimestamp(timestamp), timestamp };
}

/**
 * Validate form token and timing. Confirms the token is a valid signature
 * for the given timestamp (not just "present") before applying the timing
 * window checks.
 */
export function validateFormTiming(
  token: string | undefined,
  timestamp: number | undefined
): { valid: boolean; reason?: string } {
  if (!token || !timestamp) {
    return { valid: false, reason: "Missing security token" };
  }

  const expected = Buffer.from(signTimestamp(timestamp));
  const actual = Buffer.from(token);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { valid: false, reason: "Invalid security token" };
  }

  const now = Date.now();
  const elapsed = now - timestamp;

  // Too fast - definitely a bot
  if (elapsed < MIN_SUBMISSION_TIME) {
    return { valid: false, reason: "Form submitted too quickly" };
  }

  // Token expired
  if (elapsed > MAX_SUBMISSION_TIME) {
    return { valid: false, reason: "Form session expired" };
  }

  return { valid: true };
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
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, "")
    // Remove control characters except newlines
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    // Limit length
    .slice(0, 5000);
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
export function sanitizeFormData<T extends object>(data: T): T {
  const sanitized = { ...data } as Record<string, unknown>;

  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    }
  }

  return sanitized as T;
}
