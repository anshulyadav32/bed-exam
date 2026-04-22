import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";

export async function GET(_request, { params }) {
    const { id: rawId } = await params;
    const id = String(rawId || "").trim().toLowerCase();
    if (!id) return NextResponse.json({ message: "Subject ID is required" }, { status: 400 });

    try {
        const subject = await prisma.subject.findUnique({
            where: { id },
            include: {
                sections: {
                    orderBy: { position: "asc" },
                    select: { heading: true, notesLink: true, images: true, topics: true, explanation: true }
                },
                tests: {
                    orderBy: { id: "asc" },
                    select: { id: true, name: true, duration: true, questions: true }
                }
            }
        });

        if (!subject) return NextResponse.json({ message: "Subject not found" }, { status: 404 });

        const { examTotalQuestions, examType, examDifficulty, sections, tests, ...rest } = subject;
        return NextResponse.json({
            ...rest,
            examPattern: { totalQuestions: examTotalQuestions, type: examType, difficulty: examDifficulty },
            sections,
            tests
        });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch subject", error: error.message }, { status: 500 });
    }
}
