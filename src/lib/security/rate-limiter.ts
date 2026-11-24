/**
 * In-memory fixed-window rate limiter.
 *
 * State lives in this process only: limits are per server instance and reset
 * on restart. For multi-instance deployments, replace with a shared store
 * (e.g. Redis/Upstash).
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  expiresAt: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// Hard cap so a flood of unique keys can't grow memory without bound.
const MAX_ENTRIES = 10_000;

const rateLimitStore = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  // Each entry carries its own expiry, so entries from different limiters
  // (15-minute IP window, 1-hour email window, ...) are evicted correctly.
  for (const [key, entry] of rateLimitStore) {
    if (entry.expiresAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function setEntry(identifier: string, entry: RateLimitEntry): void {
  if (!rateLimitStore.has(identifier) && rateLimitStore.size >= MAX_ENTRIES) {
    // Map iterates in insertion order, so the first key is the oldest.
    const oldest = rateLimitStore.keys().next().value;
    if (oldest !== undefined) rateLimitStore.delete(oldest);
  }
  rateLimitStore.set(identifier, entry);
}

function getLiveEntry(identifier: string, now: number): RateLimitEntry | undefined {
  const entry = rateLimitStore.get(identifier);
  if (!entry) return undefined;
  if (entry.expiresAt <= now) {
    rateLimitStore.delete(identifier);
    return undefined;
  }
  return entry;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
  retryAfter?: number; // seconds to wait (for headers)
}

/**
 * Count a request against the limit and report whether it is allowed.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const entry = getLiveEntry(identifier, now);

  if (!entry) {
    setEntry(identifier, {
      count: 1,
      firstRequest: now,
      expiresAt: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  const resetIn = entry.expiresAt - now;

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
      retryAfter: Math.ceil(resetIn / 1000),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn,
  };
}

/**
 * Report whether an identifier has already used up its limit, without
 * counting this call against it.
 */
export function isRateLimited(identifier: string, config: RateLimitConfig): boolean {
  const entry = getLiveEntry(identifier, Date.now());
  return !!entry && entry.count >= config.maxRequests;
}

// Preset configurations
export const RATE_LIMITS = {
  // Contact form: 5 submissions per 15 minutes per IP
  contact: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  },
  // Strict limit for same email: 3 per hour
  contactByEmail: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
  },
  // Sender flagged as spam: blocked for 30 minutes
  suspicious: {
    windowMs: 30 * 60 * 1000,
    maxRequests: 1,
  },
} as const;

/**
 * Generate rate limit key for an identifier
 */
export function getRateLimitKey(type: string, identifier: string): string {
  return `${type}:${identifier}`;
}
