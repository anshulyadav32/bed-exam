import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { parseBearerToken, sha256 } from "../../../../lib/auth.js";

export async function POST(request) {
    // Accept refreshToken in body (preferred) or as Bearer token (backward compat)
    let refreshToken = null;
    try {
        const body = await request.json();
        refreshToken = String(body?.refreshToken || "").trim() || null;
    } catch { /* ignore */ }

    if (!refreshToken) {
        refreshToken = parseBearerToken(request.headers.get("authorization") || "");
    }

    if (!refreshToken) return new NextResponse(null, { status: 204 });

    try {
        await prisma.userSession.deleteMany({ where: { tokenHash: sha256(refreshToken) } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: "Logout failed", error: error.message }, { status: 500 });
    }
}
