import { NextResponse } from "next/server";
import { getUserByRefreshToken, createAccessToken } from "../../../../lib/session.js";

export async function POST(request) {
    let body;
    try { body = await request.json(); } catch { body = {}; }

    const rawToken = String(body?.refreshToken || "").trim();
    if (!rawToken) {
        return NextResponse.json({ message: "refreshToken is required" }, { status: 400 });
    }

    try {
        const result = await getUserByRefreshToken(rawToken);
        if (!result) {
            return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
        }

        const accessToken = createAccessToken(result.user);
        return NextResponse.json({ accessToken });
    } catch (error) {
        return NextResponse.json({ message: "Token refresh failed", error: error.message }, { status: 500 });
    }
}
