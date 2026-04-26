import { NextResponse } from "next/server";
import { listSecurityEvents } from "../../../../lib/securityEvents.js";
import { getUserFromRequest } from "../../../../lib/session.js";

function isDevelopment() {
    return process.env.NODE_ENV !== "production";
}

export async function GET(request) {
    if (!isDevelopment()) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const user = await getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";
    const events = listSecurityEvents(limit);

    const response = NextResponse.json({
        count: events.length,
        events
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
}
