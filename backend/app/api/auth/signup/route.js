import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { isValidEmail, validatePasswordStrength } from "../../../../lib/auth.js";
import { setAuthCookies } from "../../../../lib/session.js";
import { parseUniqueConstraintError, noStore } from "../../../../lib/apiHelpers.js";
import { logger } from "../../../../lib/logger.js";
import { authService } from "../../../../services/index.js";

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
    if (name.length > 80 || email.length > 254 || password.length > 128) {
        return NextResponse.json(
            { message: "Input exceeds allowed length" },
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
        const { user, accessToken, refreshToken } = await authService.signup({ name, email, username, password });

        const response = NextResponse.json({ accessToken, token: accessToken, user }, { status: 201 });
        setAuthCookies(response, accessToken, refreshToken);
        logger.info("SIGNUP_SUCCESS", { userId: user.id, username: user.username, email: user.email });
        return noStore(response);
    } catch (error) {
        const uniqueMsg = parseUniqueConstraintError(error);
        if (uniqueMsg) return NextResponse.json({ message: uniqueMsg }, { status: 409 });
        return NextResponse.json({ message: "Signup failed" }, { status: 500 });
    }
}
