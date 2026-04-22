import crypto from "crypto";
import { prisma } from "./prisma.js";
import { parseBearerToken, sha256, jwtSign, jwtVerify } from "./auth.js";

export const ACCESS_TOKEN_TTL = 15 * 60;     // 15 minutes (seconds)
export const REFRESH_TOKEN_TTL_DAYS = 7;

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Warn once in dev; in production this should never be missing
        console.warn("[session] WARNING: JWT_SECRET not set — using insecure fallback. Set JWT_SECRET in your env file.");
        return "dev-fallback-secret-set-JWT_SECRET-in-env";
    }
    return secret;
}

/** Build a short-lived JWT access token for a user. */
export function createAccessToken(user) {
    return jwtSign(
        { sub: String(user.id), name: user.name, email: user.email, username: user.username },
        getJwtSecret(),
        ACCESS_TOKEN_TTL
    );
}

/**
 * Create an access JWT + a long-lived refresh token.
 * The refresh token is stored hashed in UserSession.
 */
export async function createTokenPair(userId, userData) {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await prisma.userSession.create({
        data: { userId, tokenHash, expiresAt }
    });

    const accessToken = createAccessToken({ id: userId, ...userData });
    return { accessToken, refreshToken };
}

/** Look up a refresh token in the DB. Returns { user, session } or null. */
export async function getUserByRefreshToken(rawToken) {
    if (!rawToken) return null;
    const tokenHash = sha256(rawToken);
    const session = await prisma.userSession.findFirst({
        where: { tokenHash, expiresAt: { gt: new Date() } },
        include: {
            user: { select: { id: true, name: true, email: true, username: true } }
        }
    });
    return session ? { user: session.user, session } : null;
}

/** Verify a JWT access token and return the embedded user object — no DB hit. */
function getUserFromJwt(token) {
    const payload = jwtVerify(token, getJwtSecret());
    if (!payload || !payload.sub) return null;
    return {
        id: Number(payload.sub),
        name: payload.name,
        email: payload.email,
        username: payload.username
    };
}

/** Opaque-token lookup (backward-compat + refresh token path). */
export async function getUserByToken(rawToken) {
    if (!rawToken) return null;
    const tokenHash = sha256(rawToken);
    const session = await prisma.userSession.findFirst({
        where: { tokenHash, expiresAt: { gt: new Date() } },
        include: {
            user: { select: { id: true, name: true, email: true, username: true } }
        }
    });
    return session?.user || null;
}

/**
 * Extract the authenticated user from a request.
 * 1. Try JWT access token (fast — no DB hit).
 * 2. Fall back to opaque/refresh token DB lookup (backward compat).
 */
export async function getUserFromRequest(request) {
    const token = parseBearerToken(request.headers.get("authorization") || "");
    if (!token) return null;

    const jwtUser = getUserFromJwt(token);
    if (jwtUser) return jwtUser;

    return getUserByToken(token);
}

