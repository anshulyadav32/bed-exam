import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";
import { jsonError, noStore } from "../../../../lib/apiHelpers.js";

/**
 * Retrieve all mock test scores across all users
 */
export async function GET(request) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    try {
        const scores = await prisma.mockScore.findMany({
            orderBy: { createdAt: "desc" }
        });

        return noStore(NextResponse.json(scores));
    } catch (error) {
        return jsonError("Failed to fetch all scores", 500);
    }
}
