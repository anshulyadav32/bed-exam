import { describe, expect, it, vi } from "vitest";
import { createAccessToken, getUserFromRequest, ACCESS_TOKEN_COOKIE } from "../../backend/lib/session.js";

// Mock prisma
vi.mock("../../backend/lib/prisma.js", () => ({
    prisma: {
        userSession: { findFirst: vi.fn() }
    }
}));

// Mock auth.js to avoid crypto issues during pure logic tests
vi.mock("../../backend/lib/auth.js", () => ({
    jwtSign: vi.fn((payload) => `signed:${JSON.stringify(payload)}`),
    jwtVerify: vi.fn((token) => {
        if (token.startsWith("signed:")) {
            try { return JSON.parse(token.slice(7)); } catch { return null; }
        }
        return null;
    }),
    parseBearerToken: (h) => (h?.startsWith("Bearer ") ? h.slice(7) : null),
    sha256: (s) => `sha:${s}`,
}));

describe("Session Management Logic", () => {
    const mockUser = {
        id: 123,
        name: "Admin User",
        email: "admin@example.com",
        username: "admin1",
        role: "ADMIN"
    };

    it("createAccessToken should include the user role in the payload", () => {
        const token = createAccessToken(mockUser);
        expect(token).toContain('"role":"ADMIN"');
        expect(token).toContain('"sub":"123"');
    });

    it("getUserFromRequest should extract user with role from Bearer token", async () => {
        const token = createAccessToken(mockUser);
        const request = {
            headers: {
                get: (name) => (name === "authorization" ? `Bearer ${token}` : null)
            },
            cookies: {
                get: () => null
            }
        };

        const user = await getUserFromRequest(request);
        expect(user).not.toBeNull();
        expect(user.id).toBe(123);
        expect(user.role).toBe("ADMIN");
        expect(user.name).toBe("Admin User");
    });

    it("getUserFromRequest should extract user with role from cookie", async () => {
        const token = createAccessToken(mockUser);
        const request = {
            headers: {
                get: () => null
            },
            cookies: {
                get: (name) => (name === ACCESS_TOKEN_COOKIE ? { value: token } : null)
            }
        };

        const user = await getUserFromRequest(request);
        expect(user).not.toBeNull();
        expect(user.role).toBe("ADMIN");
    });

    it("getUserFromRequest should return null for invalid token", async () => {
        const request = {
            headers: {
                get: (name) => (name === "authorization" ? `Bearer invalid-token` : null)
            },
            cookies: {
                get: () => null
            }
        };

        const user = await getUserFromRequest(request);
        expect(user).toBeNull();
    });
});
