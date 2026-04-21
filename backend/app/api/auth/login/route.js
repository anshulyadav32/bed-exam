import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { verifyPassword, isValidEmail, sha256 } from "../../../../lib/auth.js";
import crypto from "crypto";

const SESSION_TTL_DAYS = 7;

export async function POST(request) {
    await ensureStarted();

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
            return NextResponse.json({ message: "Invalid email/username or password" }, { status: 401 });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = sha256(token);
        const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

        await prisma.userSession.create({
            data: { userId: user.id, tokenHash, expiresAt }
        });

        return NextResponse.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, username: user.username }
        });
    } catch (error) {
        return NextResponse.json({ message: "Login failed", error: error.message }, { status: 500 });
    }
}
