import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { verifyPassword } from "../../../../lib/auth.js";
import { createTokenPair } from "../../../../lib/session.js";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "../../../../lib/rateLimit.js";

function getClientIp(request) {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

export async function POST(request) {
    await ensureStarted();

    // ── Rate limiting ─────────────────────────────────────────
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`login:${ip}`);
    if (!rateCheck.allowed) {
        const retryAfterSec = Math.ceil(rateCheck.retryAfterMs / 1000);
        return NextResponse.json(
            { message: `Too many login attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).` },
            { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
        );
    }

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const emailOrUsername = String(body?.emailOrUsername || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!emailOrUsername || !password) {
        return NextResponse.json({ message: "Email or username and password are required" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            },
            select: { id: true, name: true, email: true, username: true, passwordHash: true }
        });

        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            recordFailedAttempt(`login:${ip}`);
            // Constant-time response to prevent user enumeration
            return NextResponse.json({ message: "Invalid email/username or password" }, { status: 401 });
        }

        clearAttempts(`login:${ip}`);

        const { accessToken, refreshToken } = await createTokenPair(user.id, {
            name: user.name, email: user.email, username: user.username
        });

        return NextResponse.json({
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, username: user.username }
        });
    } catch (error) {
        return NextResponse.json({ message: "Login failed", error: error.message }, { status: 500 });
    }
}
