import { describe, expect, it, vi } from "vitest";
import { readJsonSafely } from "@shared/utils/api.js";
import * as authApi from "@shared/utils/authApi.js";

describe("Frontend Utilities", () => {
    describe("readJsonSafely", () => {
        it("parses valid JSON", async () => {
            const res = { 
                headers: { get: () => "application/json" },
                json: async () => ({ ok: true }) 
            };
            expect(await readJsonSafely(res)).toEqual({ ok: true });
        });

        it("returns null on invalid JSON", async () => {
            const res = { 
                headers: { get: () => "application/json" },
                json: async () => { throw new Error("bad json"); } 
            };
            expect(await readJsonSafely(res)).toBeNull();
        });
    });

    describe("authApi", () => {
        global.fetch = vi.fn();

        it("loginUser calls fetch with POST", async () => {
            await authApi.loginUser("user", "pass");
            expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", expect.objectContaining({
                method: "POST"
            }));
        });

        it("logoutUser calls fetch with POST", async () => {
            await authApi.logoutUser();
            expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", expect.objectContaining({
                method: "POST"
            }));
        });
    });
});
