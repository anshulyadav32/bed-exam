import { NextResponse } from "next/server";
import { ensureStarted } from "../../../lib/startup.js";
import { prisma } from "../../../lib/prisma.js";

export async function GET() {
    await ensureStarted();

    try {
        const subjects = await prisma.subject.findMany({
            select: { id: true, name: true, description: true, color: true },
            orderBy: { id: "asc" }
        });
        return NextResponse.json(subjects);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch subjects", error: error.message }, { status: 500 });
    }
}
