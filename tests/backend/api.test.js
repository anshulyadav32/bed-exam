import { beforeEach, describe, expect, it, vi } from "vitest";

// ── shared hoisted mocks ──────────────────────────────────────────────────────
const { prisma, ensureStarted, getUserFromRequest } = vi.hoisted(() => ({
    prisma: {
        $queryRaw: vi.fn(),
        subject: { findMany: vi.fn(), findUnique: vi.fn() },
        mockScore: { findMany: vi.fn(), create: vi.fn() },
        user: { findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
        userSession: { findFirst: vi.fn(), create: vi.fn(), deleteMany: vi.fn() },
    },
    ensureStarted: vi.fn(),
    getUserFromRequest: vi.fn(),
}));

vi.mock("../../backend/lib/prisma.js", () => ({ prisma }));
vi.mock("../../backend/lib/startup.js", () => ({ ensureStarted }));
vi.mock("../../backend/lib/session.js", () => ({
    getUserFromRequest,
    createTokenPair: vi.fn(async (userId) => ({
        accessToken: `token-${userId}`,
        refreshToken: `refresh-${userId}`,
    })),
    setAuthCookies: vi.fn(),
    clearAuthCookies: vi.fn(),
    extractRefreshTokenFromRequest: vi.fn(async (request) => {
        const fromAuth = request?.headers?.get?.("authorization");
        if (typeof fromAuth === "string" && fromAuth.startsWith("Bearer ")) {
            return fromAuth.slice(7);
        }

        try {
            const body = await request.json();
            return String(body?.refreshToken || "").trim() || null;
        } catch {
            return null;
        }
    }),
}));
vi.mock("../../backend/lib/auth.js", () => ({
    hashPassword: vi.fn(async (p) => `hashed:${p}`),
    verifyPassword: vi.fn(async (plain, hash) => hash === `hashed:${plain}`),
    validatePasswordStrength: (p) => {
        if (!p || p.length < 8) return { valid: false, message: "Password must be at least 8 characters" };
        if (!/[A-Z]/.test(p)) return { valid: false, message: "Password must contain at least one uppercase letter" };
        if (!/[a-z]/.test(p)) return { valid: false, message: "Password must contain at least one lowercase letter" };
        if (!/[0-9]/.test(p)) return { valid: false, message: "Password must contain at least one number" };
        return { valid: true, message: null };
    },
    isValidEmail: (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
    parseBearerToken: (h) => (h?.startsWith("Bearer ") ? h.slice(7) : null),
    sha256: (s) => `sha:${s}`,
}));

import { GET as getHealth } from "../../backend/app/api/health/route.js";
import { GET as getSubjects } from "../../backend/app/api/subjects/route.js";
import { GET as getSubjectById } from "../../backend/app/api/subjects/[id]/route.js";
import { GET as getScores, POST as postScore } from "../../backend/app/api/scores/route.js";
import { POST as signup } from "../../backend/app/api/auth/signup/route.js";
import { POST as login } from "../../backend/app/api/auth/login/route.js";
import { GET as getMe } from "../../backend/app/api/auth/me/route.js";
import { POST as logout } from "../../backend/app/api/auth/logout/route.js";
import { PATCH as patchProfile } from "../../backend/app/api/auth/profile/route.js";
import { GET as getAvatar, POST as postAvatar, DELETE as deleteAvatar } from "../../backend/app/api/auth/avatar/route.js";
import { GET as getSecurityEvents } from "../../backend/app/api/security/events/route.js";
import { recordSecurityEvent } from "../../backend/lib/securityEvents.js";

function makeRequest(body, headers = {}) {
    return {
        json: async () => body,
        headers: { get: (k) => headers[k] ?? null },
    };
}

beforeEach(() => vi.clearAllMocks());

// ── /api/health ───────────────────────────────────────────────────────────────
describe("GET /api/health", () => {
    it("returns ok=true when db is reachable", async () => {
        prisma.$queryRaw.mockResolvedValueOnce([{ "?column?": 1 }]);
        const res = await getHealth();
        expect(res.status).toBe(200);
        expect(await res.json()).toMatchObject({ ok: true, db: "connected" });
    });

    it("returns ok=false when db throws", async () => {
        prisma.$queryRaw.mockRejectedValueOnce(new Error("connection refused"));
        const res = await getHealth();
        expect(res.status).toBe(500);
        expect((await res.json()).ok).toBe(false);
    });
});

// ── /api/subjects ─────────────────────────────────────────────────────────────
describe("GET /api/subjects", () => {
    it("returns subjects array", async () => {
        const subjects = [{ id: "ta", name: "Teaching Aptitude", description: "", color: "#f00" }];
        prisma.subject.findMany.mockResolvedValueOnce(subjects);
        const res = await getSubjects();
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(subjects);
        expect(ensureStarted).toHaveBeenCalledTimes(1);
    });

    it("returns 500 on db error", async () => {
        prisma.subject.findMany.mockRejectedValueOnce(new Error("fail"));
        const res = await getSubjects();
        expect(res.status).toBe(500);
    });
});

// ── /api/subjects/[id] ────────────────────────────────────────────────────────
describe("GET /api/subjects/[id]", () => {
    const mockSubject = {
        id: "ta",
        name: "Teaching Aptitude",
        description: "",
        color: "#f00",
        examTotalQuestions: 50,
        examType: "MCQ",
        examDifficulty: "Medium",
        sections: [],
        tests: [],
    };

    it("returns subject with examPattern", async () => {
        prisma.subject.findUnique.mockResolvedValueOnce(mockSubject);
        const res = await getSubjectById(null, { params: Promise.resolve({ id: "ta" }) });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.examPattern).toEqual({ totalQuestions: 50, type: "MCQ", difficulty: "Medium" });
        expect(data).not.toHaveProperty("examTotalQuestions");
    });

    it("returns 404 when subject not found", async () => {
        prisma.subject.findUnique.mockResolvedValueOnce(null);
        const res = await getSubjectById(null, { params: Promise.resolve({ id: "nope" }) });
        expect(res.status).toBe(404);
    });

    it("returns 400 when id is empty", async () => {
        const res = await getSubjectById(null, { params: Promise.resolve({ id: "" }) });
        expect(res.status).toBe(400);
    });
});

// ── /api/scores ───────────────────────────────────────────────────────────────
describe("GET /api/scores", () => {
    it("returns scores array", async () => {
        const scores = [{ id: 1, score: 80, attempted: 40, totalQuestions: 50 }];
        prisma.mockScore.findMany.mockResolvedValueOnce(scores);
        const res = await getScores();
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(scores);
    });

    it("returns 500 on db error", async () => {
        prisma.mockScore.findMany.mockRejectedValueOnce(new Error("fail"));
        const res = await getScores();
        expect(res.status).toBe(500);
    });
});

describe("POST /api/scores", () => {
    it("creates and returns a score", async () => {
        const created = { id: 1, candidateName: "Anshul", score: 90, attempted: 45, totalQuestions: 50 };
        prisma.mockScore.create.mockResolvedValueOnce(created);
        const req = makeRequest({ candidateName: "Anshul", score: 90, attempted: 45, totalQuestions: 50 });
        const res = await postScore(req);
        expect(res.status).toBe(201);
        expect(await res.json()).toEqual(created);
    });

    it("returns 400 when required numeric fields are missing", async () => {
        const req = makeRequest({ candidateName: "Test" });
        const res = await postScore(req);
        expect(res.status).toBe(400);
    });

    it("returns 400 when score is a string instead of number", async () => {
        const req = makeRequest({ score: "90", attempted: 45, totalQuestions: 50 });
        const res = await postScore(req);
        expect(res.status).toBe(400);
    });
});

// ── /api/auth/signup ──────────────────────────────────────────────────────────
describe("POST /api/auth/signup", () => {
    it("creates user and returns token", async () => {
        const user = { id: 1, name: "Anshul", email: "a@b.com", username: "anshul" };
        prisma.user.create.mockResolvedValueOnce(user);
        prisma.userSession.create.mockResolvedValueOnce({});
        const req = makeRequest({ name: "Anshul", email: "a@b.com", username: "anshul", password: "Secret123" });
        const res = await signup(req);
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data).toHaveProperty("token");
        expect(data.user).toEqual(user);
    });

    it("returns 400 when email is invalid", async () => {
        const req = makeRequest({ name: "X", email: "bad", username: "xyz", password: "pass123" });
        const res = await signup(req);
        expect(res.status).toBe(400);
    });

    it("returns 400 when password is too short", async () => {
        const req = makeRequest({ name: "X", email: "x@y.com", username: "xyz", password: "Ab1" });
        const res = await signup(req);
        expect(res.status).toBe(400);
    });

    it("returns 400 when username is too short", async () => {
        const req = makeRequest({ name: "X", email: "x@y.com", username: "xy", password: "Pass1234" });
        const res = await signup(req);
        expect(res.status).toBe(400);
    });

    it("returns 409 on duplicate email", async () => {
        prisma.user.create.mockRejectedValueOnce(new Error("Unique constraint failed on the fields: (`email`)"));
        const req = makeRequest({ name: "X", email: "dup@b.com", username: "dupuser", password: "Pass1234" });
        const res = await signup(req);
        expect(res.status).toBe(409);
        expect((await res.json()).message).toMatch(/email/i);
    });

    it("returns 409 on duplicate username", async () => {
        prisma.user.create.mockRejectedValueOnce(new Error("Unique constraint failed on the fields: (`username`)"));
        const req = makeRequest({ name: "X", email: "x2@b.com", username: "dupuser", password: "Pass1234" });
        const res = await signup(req);
        expect(res.status).toBe(409);
        expect((await res.json()).message).toMatch(/username/i);
    });
});

// ── /api/auth/login ───────────────────────────────────────────────────────────
describe("POST /api/auth/login", () => {
    const storedUser = { id: 1, name: "Anshul", email: "a@b.com", username: "anshul", passwordHash: "hashed:Secret123" };

    it("returns token on valid credentials", async () => {
        prisma.user.findFirst.mockResolvedValueOnce(storedUser);
        prisma.userSession.create.mockResolvedValueOnce({});
        const req = makeRequest({ emailOrUsername: "anshul", password: "Secret123" });
        const res = await login(req);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toHaveProperty("token");
        expect(data.user.username).toBe("anshul");
    });

    it("returns 401 when user not found", async () => {
        prisma.user.findFirst.mockResolvedValueOnce(null);
        const req = makeRequest({ emailOrUsername: "ghost", password: "Secret123" });
        const res = await login(req);
        expect(res.status).toBe(401);
    });

    it("returns 401 when password is wrong", async () => {
        prisma.user.findFirst.mockResolvedValueOnce(storedUser);
        const req = makeRequest({ emailOrUsername: "anshul", password: "Wrong123" });
        const res = await login(req);
        expect(res.status).toBe(401);
    });

    it("returns 400 when fields are missing", async () => {
        const req = makeRequest({});
        const res = await login(req);
        expect(res.status).toBe(400);
    });
});

// ── /api/auth/me ──────────────────────────────────────────────────────────────
describe("GET /api/auth/me", () => {
    it("returns user when authenticated", async () => {
        const user = { id: 1, name: "Anshul", email: "a@b.com", username: "anshul" };
        getUserFromRequest.mockResolvedValueOnce(user);
        const res = await getMe(makeRequest({}));
        expect(res.status).toBe(200);
        expect((await res.json()).user).toEqual(user);
    });

    it("returns 401 when not authenticated", async () => {
        getUserFromRequest.mockResolvedValueOnce(null);
        const res = await getMe(makeRequest({}));
        expect(res.status).toBe(401);
    });
});

// ── /api/auth/logout ──────────────────────────────────────────────────────────
describe("POST /api/auth/logout", () => {
    it("returns 204 and deletes session", async () => {
        prisma.userSession.deleteMany.mockResolvedValueOnce({ count: 1 });
        const req = makeRequest({}, { authorization: "Bearer mytoken" });
        const res = await logout(req);
        expect(res.status).toBe(204);
        expect(prisma.userSession.deleteMany).toHaveBeenCalledWith({ where: { tokenHash: "sha:mytoken" } });
    });

    it("returns 204 without deleting when no token present", async () => {
        const req = makeRequest({}, {});
        const res = await logout(req);
        expect(res.status).toBe(204);
        expect(prisma.userSession.deleteMany).not.toHaveBeenCalled();
    });
});

// ── /api/auth/profile ─────────────────────────────────────────────────────────
describe("PATCH /api/auth/profile", () => {
    const existing = { id: 1, passwordHash: "hashed:Oldpass1" };

    it("updates profile without password change", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1 });
        prisma.user.findUnique.mockResolvedValueOnce(existing);
        prisma.user.update.mockResolvedValueOnce({ id: 1, name: "New", email: "n@b.com", username: "newuser" });
        const req = makeRequest({ name: "New", email: "n@b.com", username: "newuser" });
        const res = await patchProfile(req);
        expect(res.status).toBe(200);
    });

    it("returns 400 when name is missing", async () => {
        const req = makeRequest({ email: "n@b.com", username: "newuser" });
        const res = await patchProfile(req);
        expect(res.status).toBe(400);
    });

    it("returns 401 when not authenticated", async () => {
        getUserFromRequest.mockResolvedValueOnce(null);
        const req = makeRequest({ name: "X", email: "x@b.com", username: "xyz" });
        const res = await patchProfile(req);
        expect(res.status).toBe(401);
    });

    it("returns 401 when current password is wrong", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1 });
        prisma.user.findUnique.mockResolvedValueOnce(existing);
        const req = makeRequest({ name: "X", email: "x@b.com", username: "xyz", currentPassword: "wrong", newPassword: "Newpass12" });
        const res = await patchProfile(req);
        expect(res.status).toBe(401);
    });

    it("returns 400 when new password is too short", async () => {
        const req = makeRequest({ name: "X", email: "x@b.com", username: "xyz", currentPassword: "Oldpass1", newPassword: "Ab1" });
        const res = await patchProfile(req);
        expect(res.status).toBe(400);
    });
});

// ── /api/auth/avatar ─────────────────────────────────────────────────────────
describe("/api/auth/avatar", () => {
    const avatar = "data:image/jpeg;base64,abc123";

    it("GET returns 401 when not authenticated", async () => {
        getUserFromRequest.mockResolvedValueOnce(null);
        const res = await getAvatar(makeRequest({}));
        expect(res.status).toBe(401);
    });

    it("GET returns avatarBase64 for authenticated user", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1 });
        prisma.user.findUnique.mockResolvedValueOnce({ avatarBase64: avatar });

        const res = await getAvatar(makeRequest({}));
        expect(res.status).toBe(200);
        expect((await res.json()).avatarBase64).toBe(avatar);
    });

    it("POST validates and stores avatar", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1 });
        prisma.user.update.mockResolvedValueOnce({ id: 1 });

        const res = await postAvatar(makeRequest({ avatarBase64: avatar }));
        expect(res.status).toBe(200);
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { avatarBase64: avatar }
        });
    });

    it("POST rejects invalid image format", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1 });
        const res = await postAvatar(makeRequest({ avatarBase64: "data:image/gif;base64,abc" }));
        expect(res.status).toBe(400);
        expect((await res.json()).message).toMatch(/Invalid image format/i);
    });

    it("POST rejects oversized payload", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1 });
        const tooLarge = `data:image/png;base64,${"a".repeat(600_001)}`;
        const res = await postAvatar(makeRequest({ avatarBase64: tooLarge }));
        expect(res.status).toBe(400);
        expect((await res.json()).message).toMatch(/too large/i);
    });

    it("DELETE clears avatar", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1 });
        prisma.user.update.mockResolvedValueOnce({ id: 1 });

        const res = await deleteAvatar(makeRequest({}));
        expect(res.status).toBe(200);
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { avatarBase64: null }
        });
    });
});

// ── /api/security/events (development) ──────────────────────────────────────
describe("GET /api/security/events", () => {
    it("returns 401 when not authenticated", async () => {
        getUserFromRequest.mockResolvedValueOnce(null);
        const req = { url: "http://localhost:4000/api/security/events?limit=5" };
        const res = await getSecurityEvents(req);
        expect(res.status).toBe(401);
    });

    it("returns recent in-memory security events", async () => {
        getUserFromRequest.mockResolvedValueOnce({ id: 1, email: "user@example.com" });
        recordSecurityEvent({ event: "test_security_event", ip: "127.0.0.1", userAgent: "vitest" });
        const req = { url: "http://localhost:4000/api/security/events?limit=5" };
        const res = await getSecurityEvents(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.count).toBeGreaterThan(0);
        expect(Array.isArray(data.events)).toBe(true);
        expect(data.events[0]).toHaveProperty("event");
    });
});
