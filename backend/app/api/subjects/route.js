import { NextResponse } from "next/server";
import { ensureStarted } from "../../../lib/startup.js";
import { subjectService } from "../../../services/index.js";

export async function GET() {
    await ensureStarted();

    try {
        const subjects = await subjectService.getAllSubjects();
        return NextResponse.json(subjects);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch subjects", error: error.message }, { status: 500 });
    }
}
