import crypto from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(crypto.scrypt);

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
