import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { setAuthCookies } from "../../../../lib/session.js";
import { checkRateLimit, recordFailedAttempt, clearAttempts, MAX_ATTEMPTS } from "../../../../lib/rateLimit.js";
import { getClientIp, tooManyAttemptsResponse, emitSecurityEvent } from "../../../../lib/apiHelpers.js";
import { sha256 } from "../../../../lib/auth.js";
import { logger } from "../../../../lib/logger.js";
import { authService } from "../../../../services/index.js";

export async function POST(request) {
    await ensureStarted();

    // ── Rate limiting ─────────────────────────────────────────
    const ip = getClientIp(request);
    const ipKey = `login:${ip}`;
    const ipRateCheck = checkRateLimit(ipKey);
    if (!ipRateCheck.allowed) {
        emitSecurityEvent(request, "login_rate_limited_ip", {
            attempts: ipRateCheck.count,
            retryAfterMs: ipRateCheck.retryAfterMs
        });
        return tooManyAttemptsResponse(ipRateCheck);
    }

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const emailOrUsername = String(body?.emailOrUsername || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!emailOrUsername || !password) {
        return NextResponse.json({ message: "Email or username and password are required" }, { status: 400 });
    }
    if (emailOrUsername.length > 254 || password.length > 128) {
        return NextResponse.json({ message: "Invalid credential format" }, { status: 400 });
    }

    const credentialFingerprint = sha256(emailOrUsername).slice(0, 16);
    const identifierKey = `login-id:${credentialFingerprint}`;
    const idRateCheck = checkRateLimit(identifierKey);
    if (!idRateCheck.allowed) {
        emitSecurityEvent(request, "login_rate_limited_identifier", {
            credentialHashPrefix: credentialFingerprint,
            attempts: idRateCheck.count,
            retryAfterMs: idRateCheck.retryAfterMs
        });
        return tooManyAttemptsResponse(idRateCheck);
    }

    try {
        const result = await authService.login(emailOrUsername, password);

        if (!result) {
            const ipAttempt = recordFailedAttempt(ipKey);
            const idAttempt = recordFailedAttempt(identifierKey);
            if (ipAttempt.locked || idAttempt.locked) {
                emitSecurityEvent(request, "login_lockout_threshold_reached", {
                    credentialHashPrefix: credentialFingerprint,
                    ipAttempts: ipAttempt.count,
                    identifierAttempts: idAttempt.count,
                    threshold: MAX_ATTEMPTS,
                    retryAfterMs: Math.max(ipAttempt.retryAfterMs, idAttempt.retryAfterMs)
                });
            }
            logger.warn("LOGIN_FAILED", { ip, identifierHash: credentialFingerprint, emailOrUsername });
            return NextResponse.json({ message: "Invalid email/username or password" }, { status: 401 });
        }

        clearAttempts(ipKey);
        clearAttempts(identifierKey);

        const { user, accessToken, refreshToken } = result;

        const response = NextResponse.json({
            accessToken,
            token: accessToken,
            user
        });
        setAuthCookies(response, accessToken, refreshToken);
        logger.info("LOGIN_SUCCESS", { userId: user.id, username: user.username, ip });
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error) {
        return NextResponse.json({ message: "Login failed" }, { status: 500 });
    }
}
