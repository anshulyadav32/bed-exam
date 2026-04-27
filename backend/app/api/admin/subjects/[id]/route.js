import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../../lib/session.js";
import { jsonError, noStore } from "../../../../../lib/apiHelpers.js";
import { logger } from "../../../../../lib/logger.js";

/**
 * Update an existing subject
 */
export async function PUT(request, { params }) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    const { id: targetId } = await params;
    if (!targetId) return jsonError("Subject ID is required", 400);

    let body;
    try { body = await request.json(); } catch { body = {}; }
    
    const { name, description, color, title, subtitle, overview, notesLink, examTotalQuestions, examType, examDifficulty } = body;

    try {
        const updated = await prisma.subject.update({
            where: { id: targetId },
            data: {
                name,
                description,
                color,
                title,
                subtitle,
                overview,
                notesLink,
                examTotalQuestions,
                examType,
                examDifficulty
            }
        });

        logger.info("ADMIN_SUBJECT_UPDATE", { adminId: user.id, subjectId: targetId });

        return noStore(NextResponse.json(updated));
    } catch (error) {
        return jsonError("Failed to update subject", 500);
    }
}

/**
 * Delete a subject
 */
export async function DELETE(request, { params }) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    const { id: targetId } = await params;
    if (!targetId) return jsonError("Subject ID is required", 400);

    try {
        await prisma.subject.delete({
            where: { id: targetId }
        });

        logger.info("ADMIN_SUBJECT_DELETE", { adminId: user.id, subjectId: targetId });

        return noStore(NextResponse.json({ message: "Subject deleted successfully" }));
    } catch (error) {
        return jsonError("Failed to delete subject", 500);
    }
}
