import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";

export async function GET(request) {
    await ensureStarted();

    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Fetch full user row so we include avatarBase64 and role
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, name: true, email: true, username: true, avatarBase64: true, role: true }
        });

        console.log("[me] Fetched user:", fullUser?.username, "Role:", fullUser?.role);

        const response = NextResponse.json({ user: fullUser || user });
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
    }
}
