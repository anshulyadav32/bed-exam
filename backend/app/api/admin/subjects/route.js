import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";
import { jsonError, noStore } from "../../../../lib/apiHelpers.js";
import { logger } from "../../../../lib/logger.js";

/**
 * Create a new subject
 */
export async function POST(request) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    let body;
    try { body = await request.json(); } catch { body = {}; }
    
    const { id, name, description, color, title, subtitle, overview, notesLink, examTotalQuestions, examType, examDifficulty } = body;

    if (!id || !name) return jsonError("ID and Name are required", 400);

    try {
        const subject = await prisma.subject.create({
            data: {
                id: id.toLowerCase(),
                name,
                description: description || "",
                color: color || "#3498db",
                title: title || name,
                subtitle: subtitle || "",
                overview: overview || "",
                notesLink: notesLink || "",
                examTotalQuestions: examTotalQuestions || "20",
                examType: examType || "MCQ",
                examDifficulty: examDifficulty || "Moderate"
            }
        });

        logger.info("ADMIN_SUBJECT_CREATE", { adminId: user.id, subjectId: subject.id });

        return noStore(NextResponse.json(subject), { status: 201 });
    } catch (error) {
        return jsonError("Failed to create subject. Ensure ID is unique.", 500);
    }
}
