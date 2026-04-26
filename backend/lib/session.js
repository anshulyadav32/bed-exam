import crypto from "crypto";
import { prisma } from "./prisma.js";
import { parseBearerToken, sha256, jwtSign, jwtVerify } from "./auth.js";

export const ACCESS_TOKEN_TTL = 15 * 60;     // 15 minutes (seconds)
export const REFRESH_TOKEN_TTL_DAYS = 7;
export const ACCESS_TOKEN_COOKIE = "bed_access_token";
export const REFRESH_TOKEN_COOKIE = "bed_refresh_token";

function isSecureCookie() {
    return process.env.NODE_ENV === "production";
}

function cookieMaxAgeFromDays(days) {
    return days * 24 * 60 * 60;
}

export function getAccessCookieOptions() {
    return {
        httpOnly: true,
        secure: isSecureCookie(),
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_TTL
    };
}

export function getRefreshCookieOptions() {
    return {
        httpOnly: true,
        secure: isSecureCookie(),
        sameSite: "lax",
        path: "/api/auth",
        maxAge: cookieMaxAgeFromDays(REFRESH_TOKEN_TTL_DAYS)
    };
}

export function setAuthCookies(response, accessToken, refreshToken) {
    if (accessToken) {
        response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessCookieOptions());
    }
    if (refreshToken) {
        response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, getRefreshCookieOptions());
    }
}

export function clearAuthCookies(response) {
    response.cookies.set(ACCESS_TOKEN_COOKIE, "", { ...getAccessCookieOptions(), maxAge: 0 });
    response.cookies.set(REFRESH_TOKEN_COOKIE, "", { ...getRefreshCookieOptions(), maxAge: 0 });
}

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
        { sub: String(user.id), name: user.name, email: user.email, username: user.username, role: user.role },
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

/**
 * Rotate a refresh token: invalidate old token and mint a new token pair.
 * Returns { user, accessToken, refreshToken } or null.
 */
export async function rotateRefreshToken(rawToken) {
    if (!rawToken) return null;
    const tokenHash = sha256(rawToken);
    const now = new Date();

    return prisma.$transaction(async (tx) => {
        const session = await tx.userSession.findFirst({
            where: { tokenHash, expiresAt: { gt: now } },
            include: {
                user: { select: { id: true, name: true, email: true, username: true, role: true } }
            }
        });

        if (!session) return null;

        await tx.userSession.delete({ where: { id: session.id } });

        const nextRefreshToken = crypto.randomBytes(32).toString("hex");
        const nextTokenHash = sha256(nextRefreshToken);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

        await tx.userSession.create({
            data: { userId: session.user.id, tokenHash: nextTokenHash, expiresAt }
        });

        const accessToken = createAccessToken(session.user);
        return { user: session.user, accessToken, refreshToken: nextRefreshToken };
    });
}

/** Look up a refresh token in the DB. Returns { user, session } or null. */
export async function getUserByRefreshToken(rawToken) {
    if (!rawToken) return null;
    const tokenHash = sha256(rawToken);
    const session = await prisma.userSession.findFirst({
        where: { tokenHash, expiresAt: { gt: new Date() } },
        include: {
            user: { select: { id: true, name: true, email: true, username: true, role: true } }
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
        username: payload.username,
        role: payload.role
    };
}

/** Opaque-token lookup (backward-compat + refresh token path). */
export async function getUserByToken(rawToken) {
    if (!rawToken) return null;
    const tokenHash = sha256(rawToken);
    const session = await prisma.userSession.findFirst({
        where: { tokenHash, expiresAt: { gt: new Date() } },
        include: {
            user: { select: { id: true, name: true, email: true, username: true, role: true } }
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
    const bearer = parseBearerToken(request.headers.get("authorization") || "");
    const cookieToken = request.cookies?.get(ACCESS_TOKEN_COOKIE)?.value || "";
    const token = bearer || cookieToken;
    if (!token) return null;

    const jwtUser = getUserFromJwt(token);
    if (jwtUser) return jwtUser;

    return getUserByToken(token);
}

/**
 * Extract refresh token from cookie first, then body, then Bearer fallback.
 */
export async function extractRefreshTokenFromRequest(request) {
    const cookieToken = request.cookies?.get(REFRESH_TOKEN_COOKIE)?.value || "";
    if (cookieToken) return cookieToken;

    try {
        const body = await request.json();
        const fromBody = String(body?.refreshToken || "").trim();
        if (fromBody) return fromBody;
    } catch {
        // no-op
    }

    return parseBearerToken(request.headers.get("authorization") || "");
}

