import { NextResponse } from "next/server";
import {
    extractRefreshTokenFromRequest,
    rotateRefreshToken,
    setAuthCookies
} from "../../../../lib/session.js";

export async function POST(request) {
    const rawToken = await extractRefreshTokenFromRequest(request);
    if (!rawToken) {
        return NextResponse.json({ message: "refreshToken is required" }, { status: 400 });
    }

    try {
        const result = await rotateRefreshToken(rawToken);
        if (!result) {
            return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
        }

        const response = NextResponse.json({ accessToken: result.accessToken, token: result.accessToken });
        setAuthCookies(response, result.accessToken, result.refreshToken);
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error) {
        return NextResponse.json({ message: "Token refresh failed" }, { status: 500 });
    }
}
