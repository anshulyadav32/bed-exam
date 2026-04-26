import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { createTokenPair, setAuthCookies } from "../../../../lib/session.js";
import { noStore, jsonError } from "../../../../lib/apiHelpers.js";
import { logger } from "../../../../lib/logger.js";

export async function POST(request) {
    await ensureStarted();

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const code = body?.code;
    if (!code) return jsonError("GitHub code is required", 400);

    try {
        // 1. Exchange code for access token
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            })
        });

        const tokenData = await tokenRes.json();
        if (tokenData.error) {
            return jsonError(tokenData.error_description || "GitHub token exchange failed", 401);
        }

        const ghAccessToken = tokenData.access_token;

        // 2. Get user info
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `token ${ghAccessToken}`,
                "Accept": "application/json"
            }
        });

        const ghUser = await userRes.json();
        if (!ghUser || !ghUser.id) {
            return jsonError("Failed to fetch GitHub user info", 400);
        }

        const githubId = String(ghUser.id);
        const email = ghUser.email; // Note: may be null if private
        const name = ghUser.name || ghUser.login;

        // 3. Find or create user
        let user = await prisma.user.findUnique({
            where: { githubId }
        });

        if (!user && email) {
            user = await prisma.user.findUnique({
                where: { email }
            });

            if (user) {
                // Link account
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { githubId }
                });
            }
        }

        if (!user) {
            // Generate unique username
            let baseUsername = (ghUser.login || "gh_user").toLowerCase().replace(/[^a-z0-9_]/g, "_");
            let username = baseUsername;
            let counter = 1;

            while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}_${counter++}`;
            }

            user = await prisma.user.create({
                data: {
                    name,
                    email: email || `${githubId}@github.placeholder.com`, // GitHub doesn't always provide email
                    username,
                    githubId
                }
            });
        }

        const { accessToken, refreshToken } = await createTokenPair(user.id, {
            name: user.name, email: user.email, username: user.username
        });

        const response = NextResponse.json({
            accessToken,
            user: { id: user.id, name: user.name, email: user.email, username: user.username }
        });
        
        setAuthCookies(response, accessToken, refreshToken);
        logger.info("SOCIAL_LOGIN_SUCCESS", { provider: "github", userId: user.id, username: user.username });
        return noStore(response);
    } catch (error) {
        console.error("[github-auth] Error:", error.message);
        return jsonError("GitHub authentication failed", 401);
    }
}
