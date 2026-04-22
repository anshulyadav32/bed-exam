import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";
import { hashPassword, isValidEmail, verifyPassword, validatePasswordStrength } from "../../../../lib/auth.js";

export async function PATCH(request) {
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
    if ((currentPassword || newPassword) && !validatePasswordStrength(newPassword).valid) {
        return NextResponse.json({ message: validatePasswordStrength(newPassword).message }, { status: 400 });
    }

    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const existing = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, passwordHash: true }
        });
        if (!existing) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const updateData = { name, email, username };
        if (currentPassword || newPassword) {
            const matched = await verifyPassword(currentPassword, existing.passwordHash);
            if (!matched) return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });
            updateData.passwordHash = await hashPassword(newPassword);
        }

        const updatedUser = await prisma.user.update({
            where: { id: existing.id },
            data: updateData,
            select: { id: true, name: true, email: true, username: true }
        });

        return NextResponse.json({ message: "Profile updated successfully.", user: updatedUser });
    } catch (error) {
        if (String(error.message).includes("Unique constraint failed")) {
            if (String(error.message).includes("email")) {
                return NextResponse.json({ message: "Email already registered" }, { status: 409 });
            } else if (String(error.message).includes("username")) {
                return NextResponse.json({ message: "Username already taken" }, { status: 409 });
            }
            return NextResponse.json({ message: "Update failed: duplicate field" }, { status: 409 });
        }
        return NextResponse.json({ message: "Profile update failed", error: error.message }, { status: 500 });
    }
}
