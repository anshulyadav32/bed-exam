import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { getUserFromRequest } from "../../../../lib/session.js";

export async function GET(request) {
    await ensureStarted();

    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch user", error: error.message }, { status: 500 });
    }
}
