import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { createTokenPair, setAuthCookies } from "../../../../lib/session.js";
import { noStore, jsonError } from "../../../../lib/apiHelpers.js";
import { logger } from "../../../../lib/logger.js";

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

        const { sub: googleId, email, name, picture } = payload;

        // 1. Try to find by googleId
        let user = await prisma.user.findUnique({
            where: { googleId }
        });

        // 2. If not found by googleId, try to find by email
        if (!user) {
            user = await prisma.user.findUnique({
                where: { email }
            });

            if (user) {
                // Link account
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        }

        // 3. Still not found? Create a new user
        if (!user) {
            // Generate a unique username from email
            let baseUsername = email.split("@")[0].replace(/[^a-z0-9_]/g, "_").toLowerCase();
            let username = baseUsername;
            let counter = 1;

            // Simple retry loop for unique username
            while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}_${counter++}`;
            }

            user = await prisma.user.create({
                data: {
                    name: name || email,
                    email,
                    username,
                    googleId,
                    // passwordHash is optional
                },
                select: { id: true, name: true, email: true, username: true }
            });
        }

        const { accessToken, refreshToken } = await createTokenPair(user.id, {
            name: user.name, email: user.email, username: user.username
        });

        const response = NextResponse.json({
            accessToken,
            token: accessToken,
            user: { id: user.id, name: user.name, email: user.email, username: user.username }
        });
        
        setAuthCookies(response, accessToken, refreshToken);
        logger.info("SOCIAL_LOGIN_SUCCESS", { provider: "google", userId: user.id, username: user.username });
        return noStore(response);
    } catch (error) {
        console.error("[google-auth] Error:", error.message);
        return jsonError("Google authentication failed", 401);
    }
}
