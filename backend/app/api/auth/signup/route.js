import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { hashPassword, isValidEmail, validatePasswordStrength } from "../../../../lib/auth.js";
import { createTokenPair } from "../../../../lib/session.js";

export async function POST(request) {
    await ensureStarted();

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const username = String(body?.username || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!name || !username || !isValidEmail(email)) {
        return NextResponse.json(
            { message: "Name, username, and a valid email are required" },
            { status: 400 }
        );
    }
    if (username.length < 3 || username.length > 20) {
        return NextResponse.json(
            { message: "Username must be 3-20 characters" },
            { status: 400 }
        );
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
        return NextResponse.json(
            { message: "Username may only contain lowercase letters, numbers, and underscores" },
            { status: 400 }
        );
    }

    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.valid) {
        return NextResponse.json({ message: pwCheck.message }, { status: 400 });
    }

    try {
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: { name, email, username, passwordHash },
            select: { id: true, name: true, email: true, username: true }
        });

        const { accessToken, refreshToken } = await createTokenPair(user.id, {
            name: user.name, email: user.email, username: user.username
        });

        return NextResponse.json({ accessToken, refreshToken, user }, { status: 201 });
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
