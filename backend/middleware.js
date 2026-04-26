import { NextResponse } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isCrossOriginWrite(request) {
    if (!MUTATING_METHODS.has(request.method)) return false;

    const origin = request.headers.get("origin");
    if (!origin) return false;

    try {
        return new URL(origin).origin !== request.nextUrl.origin;
    } catch {
        return true;
    }
}

export function middleware(request) {
    if (isCrossOriginWrite(request)) {
        return NextResponse.json({ message: "Cross-origin write requests are blocked" }, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"]
};
