import crypto from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(crypto.scrypt);

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePasswordStrength(password) {
    if (!password || password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters" };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    return { valid: true, message: null };
}

export function sha256(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derived = await scryptAsync(password, salt, 64);
    return `${salt}:${Buffer.from(derived).toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
    const [salt, keyHex] = String(storedHash).split(":");
    if (!salt || !keyHex) return false;
    const derived = await scryptAsync(password, salt, 64);
    const key = Buffer.from(keyHex, "hex");
    if (key.length !== derived.length) return false;
    return crypto.timingSafeEqual(key, Buffer.from(derived));
}

export function parseBearerToken(authHeader = "") {
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) return null;
    return token.trim();
}

// ── JWT (HMAC-SHA256) — no external dependencies ──────────────

function b64url(data) {
    const buf = typeof data === "string" ? Buffer.from(data) : data;
    return buf.toString("base64url");
}

/**
 * Sign a JWT with HMAC-SHA256.
 * @param {object} payload   - Claims to embed (sub, name, email, username, …)
 * @param {string} secret    - Signing secret from JWT_SECRET env var
 * @param {number} expiresInSec - TTL in seconds (default 15 min)
 */
export function jwtSign(payload, secret, expiresInSec = 900) {
    const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const claims = { ...payload, iat: now, exp: now + expiresInSec };
    const body = b64url(JSON.stringify(claims));
    const sig = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest();
    return `${header}.${body}.${b64url(sig)}`;
}

/**
 * Verify a JWT and return its payload, or null if invalid/expired.
 */
export function jwtVerify(token, secret) {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    try {
        const expectedSig = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest();
        const sigBuf = Buffer.from(signature, "base64url");
        if (sigBuf.length !== expectedSig.length) return null;
        if (!crypto.timingSafeEqual(sigBuf, expectedSig)) return null;
        const payload = JSON.parse(Buffer.from(body, "base64url").toString());
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch {
        return null;
    }
}

