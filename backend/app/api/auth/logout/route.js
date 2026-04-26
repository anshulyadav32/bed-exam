import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma.js";
import { sha256 } from "../../../../lib/auth.js";
import { clearAuthCookies, extractRefreshTokenFromRequest, getUserFromRequest } from "../../../../lib/session.js";
import { logger } from "../../../../lib/logger.js";

export async function POST(request) {
    const refreshToken = await extractRefreshTokenFromRequest(request);

    try {
        if (refreshToken) {
            await prisma.userSession.deleteMany({ where: { tokenHash: sha256(refreshToken) } });
        }

        const response = new NextResponse(null, { status: 204 });
        clearAuthCookies(response);

        const user = await getUserFromRequest(request);
        if (user) logger.info("LOGOUT_SUCCESS", { userId: user.id, username: user.username });

        return response;
    } catch (error) {
        return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
}
