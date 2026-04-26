import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";
import { noStore, jsonError } from "../../../../lib/apiHelpers.js";

export async function GET(request) {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") return jsonError("Unauthorized", 401);

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                role: true,
                createdAt: true
            },
            orderBy: { createdAt: "desc" }
        });

        return noStore(NextResponse.json(users));
    } catch (error) {
        return jsonError("Failed to fetch users", 500);
    }
}
