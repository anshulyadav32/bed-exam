import { NextResponse } from "next/server";
import { subjectService } from "../../../../services/index.js";

export async function GET(_request, { params }) {
    const { id: rawId } = await params;
    const id = String(rawId || "").trim().toLowerCase();
    if (!id) return NextResponse.json({ message: "Subject ID is required" }, { status: 400 });

    try {
        const subject = await subjectService.getSubjectById(id);
        if (!subject) return NextResponse.json({ message: "Subject not found" }, { status: 404 });

        return NextResponse.json(subject);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch subject", error: error.message }, { status: 500 });
    }
}
