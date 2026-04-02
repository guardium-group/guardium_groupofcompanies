/**
 * In-memory rate limiter with sliding window algorithm
 * For production with multiple servers, replace with Redis-based solution
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  const cutoff = now - windowMs;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.lastRequest < cutoff) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
  retryAfter?: number; // seconds to wait (for headers)
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  cleanup(config.windowMs);

  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    // First request from this identifier
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  const windowStart = now - config.windowMs;

  // Reset if window has passed
  if (entry.firstRequest < windowStart) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Within window - check limit
  if (entry.count >= config.maxRequests) {
    const resetIn = entry.firstRequest + config.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetIn,
      retryAfter: Math.ceil(resetIn / 1000),
    };
  }

  // Increment counter
  entry.count++;
  entry.lastRequest = now;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.firstRequest + config.windowMs - now,
  };
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
  // Very strict for suspected abuse: 1 per 30 minutes
  suspicious: {
    windowMs: 30 * 60 * 1000,
    maxRequests: 1,
  },
} as const;

/**
 * Generate rate limit key for IP
 */
export function getRateLimitKey(type: string, identifier: string): string {
  return `${type}:${identifier}`;
}
