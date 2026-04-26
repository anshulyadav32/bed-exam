import { NextResponse } from "next/server";
import { ensureStarted } from "../../../lib/startup.js";
import { logger } from "../../../lib/logger.js";
import { scoreService } from "../../../services/index.js";

export async function GET() {
    await ensureStarted();

    try {
        const scores = await scoreService.getRecentScores();
        return NextResponse.json(scores);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch scores", error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    let body;
    try { body = await request.json(); } catch { body = {}; }

    const { candidateName, score, attempted, totalQuestions } = body;

    if (typeof score !== "number" || typeof attempted !== "number" || typeof totalQuestions !== "number") {
        return NextResponse.json({ message: "Invalid score payload" }, { status: 400 });
    }

    try {
        const mockScore = await scoreService.saveScore({ candidateName, score, attempted, totalQuestions });

        logger.info("SCORE_SUBMITTED", { candidateName: mockScore.candidateName, score: mockScore.score });

        return NextResponse.json(mockScore, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to save score", error: error.message }, { status: 500 });
    }
}
