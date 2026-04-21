import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { parseBearerToken, sha256 } from "../../../../lib/auth.js";

export async function POST(request) {
    const token = parseBearerToken(request.headers.get("authorization") || "");
    if (!token) return new NextResponse(null, { status: 204 });

    try {
        await prisma.userSession.deleteMany({ where: { tokenHash: sha256(token) } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: "Logout failed", error: error.message }, { status: 500 });
    }
}
