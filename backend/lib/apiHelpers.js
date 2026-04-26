/**
 * Shared API route helpers used across multiple route handlers.
 *
 * Centralises: IP extraction, rate-limit responses, security event emission,
 * Prisma unique-constraint error parsing, and Cache-Control utility.
 */

import { NextResponse } from "next/server";
import { recordSecurityEvent } from "./securityEvents.js";

// ── IP Extraction ─────────────────────────────────────────────────────────────

/**
 * Extract the client IP address from a Next.js request, honouring common
 * reverse-proxy headers before falling back to "unknown".
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

// ── Rate Limit ────────────────────────────────────────────────────────────────

/**
 * Build a standardised 429 Too Many Requests response from a rateCheck result.
 * @param {{ retryAfterMs: number }} rateCheck
 * @returns {NextResponse}
 */
export function tooManyAttemptsResponse(rateCheck) {
    const retryAfterSec = Math.ceil(rateCheck.retryAfterMs / 1000);
    return NextResponse.json(
        { message: `Too many login attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).` },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
}

// ── Security Events ───────────────────────────────────────────────────────────

/**
 * Record a security event in the in-memory telemetry buffer and print a
 * warning to the server console for real-time visibility.
 * @param {Request} request
 * @param {string} eventName
 * @param {Record<string, unknown>} [details]
 */
export function emitSecurityEvent(request, eventName, details = {}) {
    const payload = recordSecurityEvent({
        event: eventName,
        at: new Date().toISOString(),
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || "unknown",
        ...details
    });
    console.warn("[security]", JSON.stringify(payload));
}

// ── Prisma Error Helpers ──────────────────────────────────────────────────────

/**
 * Parse a Prisma unique constraint violation and return a human-readable
 * message, or null if the error is not a unique constraint failure.
 * @param {Error} error
 * @returns {string | null}
 */
export function parseUniqueConstraintError(error) {
    const msg = String(error?.message || "");
    if (!msg.includes("Unique constraint failed")) return null;
    if (msg.includes("email")) return "Email already registered";
    if (msg.includes("username")) return "Username already taken";
    return "Duplicate field";
}

// ── Response Helpers ──────────────────────────────────────────────────────────

/**
 * Attach `Cache-Control: no-store` to a response and return it.
 * @param {NextResponse} response
 * @returns {NextResponse}
 */
export function noStore(response) {
    response.headers.set("Cache-Control", "no-store");
    return response;
}

/**
 * Create a JSON error response.
 * @param {string} message
 * @param {number} status
 * @returns {NextResponse}
 */
export function jsonError(message, status) {
    return NextResponse.json({ message }, { status });
}
