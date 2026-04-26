import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/session.js";
import { isValidEmail, validatePasswordStrength } from "../../../../lib/auth.js";
import { ensureStarted } from "../../../../lib/startup.js";
import { parseUniqueConstraintError } from "../../../../lib/apiHelpers.js";
import { logger } from "../../../../lib/logger.js";
import { authService } from "../../../../services/index.js";

export async function PATCH(request) {
    await ensureStarted();

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const username = String(body?.username || "").trim().toLowerCase();
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (!name || !isValidEmail(email) || !username) {
        return NextResponse.json({ message: "Name, valid email, and username are required" }, { status: 400 });
    }
    if (username.length < 3 || username.length > 20) {
        return NextResponse.json({ message: "Username must be 3-20 characters" }, { status: 400 });
    }
    if (name.length > 80 || email.length > 254 || currentPassword.length > 128 || newPassword.length > 128) {
        return NextResponse.json({ message: "Input exceeds allowed length" }, { status: 400 });
    }
    if ((currentPassword || newPassword) && !validatePasswordStrength(newPassword).valid) {
        return NextResponse.json({ message: validatePasswordStrength(newPassword).message }, { status: 400 });
    }

    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const result = await authService.updateProfile(user.id, { name, email, username, currentPassword, newPassword });

        if (result.error) {
            return NextResponse.json({ message: result.error }, { status: result.status || 400 });
        }

        logger.info("PROFILE_UPDATE_SUCCESS", { userId: result.user.id, username: result.user.username });

        return NextResponse.json({ message: "Profile updated successfully.", user: result.user });
    } catch (error) {
        const uniqueMsg = parseUniqueConstraintError(error);
        if (uniqueMsg) return NextResponse.json({ message: uniqueMsg }, { status: 409 });
        return NextResponse.json({ message: "Profile update failed" }, { status: 500 });
    }
}
