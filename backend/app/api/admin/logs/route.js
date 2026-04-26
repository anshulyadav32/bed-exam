import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";
import { noStore, jsonError } from "../../../../lib/apiHelpers.js";

export async function GET(request) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get("limit") || 50), 200);

        const logs = await prisma.auditLog.findMany({
            take: limit,
            orderBy: { createdAt: "desc" }
        });

        return noStore(NextResponse.json(logs));
    } catch (error) {
        return jsonError("Failed to fetch logs", 500);
    }
}
