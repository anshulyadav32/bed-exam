import { describe, expect, it, vi, beforeEach } from "vitest";

// ── shared hoisted mocks ──────────────────────────────────────────────────────
const { prisma, getUserFromRequest } = vi.hoisted(() => ({
    prisma: {
        user: { count: vi.fn(), findMany: vi.fn() },
        subject: { count: vi.fn() },
        mockScore: { count: vi.fn() },
    },
    getUserFromRequest: vi.fn(),
}));

vi.mock("../../backend/lib/prisma.js", () => ({ prisma }));
vi.mock("../../backend/lib/session.js", () => ({ getUserFromRequest }));

import { GET as getStats } from "../../backend/app/api/admin/stats/route.js";
import { GET as getUsers } from "../../backend/app/api/admin/users/route.js";

function makeRequest(headers = {}) {
    return {
        headers: { get: (k) => headers[k] ?? null },
    };
}

describe("Admin API Endpoints", () => {
    beforeEach(() => vi.clearAllMocks());

    describe("GET /api/admin/stats", () => {
        it("returns 401 if user is not an admin", async () => {
            getUserFromRequest.mockResolvedValueOnce({ id: 1, role: "USER" });
            const res = await getStats(makeRequest());
            expect(res.status).toBe(401);
        });

        it("returns counts if user is an admin", async () => {
            getUserFromRequest.mockResolvedValueOnce({ id: 1, role: "ADMIN" });
            prisma.user.count.mockResolvedValueOnce(10);
            prisma.subject.count.mockResolvedValueOnce(5);
            prisma.mockScore.count.mockResolvedValueOnce(100);

            const res = await getStats(makeRequest());
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data).toEqual({ users: 10, subjects: 5, scores: 100 });
        });
    });

    describe("GET /api/admin/users", () => {
        it("returns 401 if user is not an admin", async () => {
            getUserFromRequest.mockResolvedValueOnce({ id: 1, role: "USER" });
            const res = await getUsers(makeRequest());
            expect(res.status).toBe(401);
        });

        it("returns user list if user is an admin", async () => {
            const users = [{ id: 1, name: "Admin", role: "ADMIN" }, { id: 2, name: "User", role: "USER" }];
            getUserFromRequest.mockResolvedValueOnce({ id: 1, role: "ADMIN" });
            prisma.user.findMany.mockResolvedValueOnce(users);

            const res = await getUsers(makeRequest());
            expect(res.status).toBe(200);
            expect(await res.json()).toEqual(users);
        });
    });
});
