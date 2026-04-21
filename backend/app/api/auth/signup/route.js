import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { hashPassword, isValidEmail, sha256 } from "../../../../lib/auth.js";
import crypto from "crypto";

const SESSION_TTL_DAYS = 7;

export async function POST(request) {
    await ensureStarted();

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const username = String(body?.username || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!name || !username || !isValidEmail(email) || password.length < 6) {
        return NextResponse.json(
            { message: "Name, username, valid email, and password (min 6 chars) are required" },
            { status: 400 }
        );
    }
    if (username.length < 3 || username.length > 20) {
        return NextResponse.json(
            { message: "Username must be 3-20 characters" },
            { status: 400 }
        );
    }

    try {
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: { name, email, username, passwordHash },
            select: { id: true, name: true, email: true, username: true }
        });

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = sha256(token);
        const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

        await prisma.userSession.create({
            data: { userId: user.id, tokenHash, expiresAt }
        });

        return NextResponse.json({ token, user }, { status: 201 });
    } catch (error) {
        if (String(error.message).includes("Unique constraint failed")) {
            if (String(error.message).includes("email")) {
                return NextResponse.json({ message: "Email already registered" }, { status: 409 });
            } else if (String(error.message).includes("username")) {
                return NextResponse.json({ message: "Username already taken" }, { status: 409 });
            }
            return NextResponse.json({ message: "Registration failed: duplicate field" }, { status: 409 });
        }
        return NextResponse.json({ message: "Signup failed", error: error.message }, { status: 500 });
    }
}
