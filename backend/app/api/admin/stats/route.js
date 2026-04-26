import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";
import { noStore, jsonError } from "../../../../lib/apiHelpers.js";
import { logger } from "../../../../lib/logger.js";

export async function GET(request) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
        return jsonError("Unauthorized", 401);
    }

    logger.info("ADMIN_ACTION", { userId: user.id, username: user.username, action: "VIEW_STATS", resource: "stats" });

    try {
        const [userCount, subjectCount, scoreCount] = await Promise.all([
            prisma.user.count(),
            prisma.subject.count(),
            prisma.mockScore.count()
        ]);

        return noStore(NextResponse.json({
            users: userCount,
            subjects: subjectCount,
            scores: scoreCount
        }));
    } catch (error) {
        return jsonError("Failed to load stats", 500);
    }
}
