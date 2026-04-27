import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../../lib/session.js";
import { jsonError, noStore } from "../../../../../lib/apiHelpers.js";
import { logger } from "../../../../../lib/logger.js";

/**
 * Update user role (Promote/Demote)
 */
export async function PATCH(request, { params }) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    const { id: rawId } = await params;
    const targetUserId = parseInt(rawId);
    if (isNaN(targetUserId)) return jsonError("Invalid User ID", 400);

    let body;
    try { body = await request.json(); } catch { body = {}; }
    const { role } = body;

    if (!["ADMIN", "USER"].includes(role)) {
        return jsonError("Invalid role", 400);
    }

    try {
        // Prevent self-demotion to ensure at least one admin exists
        if (targetUserId === user.id && role !== "ADMIN") {
            return jsonError("You cannot demote yourself.", 403);
        }

        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: { role },
            select: { id: true, username: true, role: true }
        });

        logger.info("ADMIN_USER_UPDATE", { adminId: user.id, targetUserId, newRole: role });

        return noStore(NextResponse.json(updatedUser));
    } catch (error) {
        return jsonError("Failed to update user role", 500);
    }
}

/**
 * Delete a user account
 */
export async function DELETE(request, { params }) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    const { id: rawId } = await params;
    const targetUserId = parseInt(rawId);
    if (isNaN(targetUserId)) return jsonError("Invalid User ID", 400);

    try {
        if (targetUserId === user.id) {
            return jsonError("You cannot delete your own account.", 403);
        }

        await prisma.user.delete({
            where: { id: targetUserId }
        });

        logger.info("ADMIN_USER_DELETE", { adminId: user.id, targetUserId });

        return noStore(NextResponse.json({ message: "User deleted successfully" }));
    } catch (error) {
        return jsonError("Failed to delete user", 500);
    }
}
