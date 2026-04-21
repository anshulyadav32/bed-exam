import { prisma } from "./prisma.js";
import { parseBearerToken, sha256 } from "./auth.js";

export const SESSION_TTL_DAYS = 7;

export async function getUserByToken(rawToken) {
    if (!rawToken) return null;
    const tokenHash = sha256(rawToken);
    const session = await prisma.userSession.findFirst({
        where: {
            tokenHash,
            expiresAt: { gt: new Date() }
        },
        include: {
            user: { select: { id: true, name: true, email: true, username: true } }
        }
    });
    return session?.user || null;
}

export async function getUserFromRequest(request) {
    const token = parseBearerToken(request.headers.get("authorization") || "");
    return getUserByToken(token);
}
