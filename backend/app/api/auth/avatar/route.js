import { NextResponse } from "next/server";
import { ensureStarted } from "../../../../lib/startup.js";
import { prisma } from "../../../../lib/prisma.js";
import { getUserFromRequest } from "../../../../lib/session.js";
import { noStore, jsonError } from "../../../../lib/apiHelpers.js";

// Max ~600KB base64 string → ~450KB decoded → adequate for a 256×256 JPEG
const MAX_AVATAR_B64_LENGTH = 600_000;

/**
 * GET /api/auth/avatar
 * Returns { avatarBase64 } for the authenticated user.
 */
export async function GET(request) {
    await ensureStarted();
    const user = await getUserFromRequest(request);
    if (!user) return jsonError("Unauthorized", 401);

    const row = await prisma.user.findUnique({
        where: { id: user.id },
        select: { avatarBase64: true }
    });

    return noStore(NextResponse.json({ avatarBase64: row?.avatarBase64 || null }));
}

/**
 * POST /api/auth/avatar
 * Body: { avatarBase64: string } — a data-URL encoded image.
 * Validates mime type (jpeg/png/webp) and size, then stores it.
 */
export async function POST(request) {
    await ensureStarted();
    const user = await getUserFromRequest(request);
    if (!user) return jsonError("Unauthorized", 401);

    let body;
    try { body = await request.json(); } catch { body = {}; }

    const raw = String(body?.avatarBase64 || "");

    if (!raw) return jsonError("avatarBase64 is required", 400);

    // Accept data URLs: data:image/(jpeg|png|webp);base64,...
    const dataUrlPattern = /^data:image\/(jpeg|png|webp);base64,/;
    if (!dataUrlPattern.test(raw)) {
        return jsonError("Invalid image format. Only JPEG, PNG, and WebP are supported.", 400);
    }

    if (raw.length > MAX_AVATAR_B64_LENGTH) {
        return jsonError("Image is too large. Please use an image under 450 KB.", 400);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { avatarBase64: raw }
    });

    return noStore(NextResponse.json({ message: "Avatar updated." }));
}

/**
 * DELETE /api/auth/avatar
 * Clears the stored avatar.
 */
export async function DELETE(request) {
    await ensureStarted();
    const user = await getUserFromRequest(request);
    if (!user) return jsonError("Unauthorized", 401);

    await prisma.user.update({
        where: { id: user.id },
        data: { avatarBase64: null }
    });

    return noStore(NextResponse.json({ message: "Avatar removed." }));
}
