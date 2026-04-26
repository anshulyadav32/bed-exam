/**
 * In-memory rate limiter.
 * Resets on server restart — suitable for single-process deployments.
 * For multi-instance production, replace the store with Redis.
 *
 * Default: 5 failed attempts per IP per 15-minute window.
 */

const store = new Map(); // key -> { count, resetAt }

export const MAX_ATTEMPTS = 5;
export const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getEntry(key) {
    const now = Date.now();
    const entry = store.get(key);
    if (!entry || entry.resetAt <= now) {
        const fresh = { count: 0, resetAt: now + WINDOW_MS };
        store.set(key, fresh);
        return fresh;
    }
    return entry;
}

/**
 * Check if a key is within the allowed rate.
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number, count: number }}
 */
export function checkRateLimit(key) {
    const entry = getEntry(key);
    if (entry.count >= MAX_ATTEMPTS) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: entry.resetAt - Date.now(),
            count: entry.count
        };
    }
    return {
        allowed: true,
        remaining: MAX_ATTEMPTS - entry.count,
        retryAfterMs: 0,
        count: entry.count
    };
}

/**
 * Record one failed attempt for a key.
 * @returns {{ count: number, remaining: number, retryAfterMs: number, locked: boolean }}
 */
export function recordFailedAttempt(key) {
    const entry = getEntry(key);
    entry.count += 1;
    return {
        count: entry.count,
        remaining: Math.max(0, MAX_ATTEMPTS - entry.count),
        retryAfterMs: entry.resetAt - Date.now(),
        locked: entry.count >= MAX_ATTEMPTS
    };
}

/** Clear attempts for a key on successful authentication. */
export function clearAttempts(key) {
    store.delete(key);
}
