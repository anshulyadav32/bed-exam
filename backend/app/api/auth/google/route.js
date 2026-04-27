import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { ensureStarted } from "../../../../lib/startup.js";
import { setAuthCookies } from "../../../../lib/session.js";
import { noStore, jsonError } from "../../../../lib/apiHelpers.js";
import { logger } from "../../../../lib/logger.js";
import { authService } from "../../../../services/index.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request) {
    await ensureStarted();

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const credential = body?.credential;
    if (!credential) return jsonError("Google credential is required", 400);

    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        if (!payload || !payload.email) {
            return jsonError("Invalid Google token payload", 400);
        }

        const { sub: googleId, email, name } = payload;

        const result = await authService.socialLogin({
            provider: "google",
            providerId: googleId,
            email,
            name
        });

        const { user, accessToken, refreshToken } = result;

        const response = NextResponse.json({
            accessToken,
            token: accessToken,
            user
        });
        
        setAuthCookies(response, accessToken, refreshToken);
        logger.info("SOCIAL_LOGIN_SUCCESS", { provider: "google", userId: user.id, username: user.username });
        return noStore(response);
    } catch (error) {
        console.error("[google-auth] Error:", error.message);
        return jsonError("Google authentication failed", 401);
    }
}
