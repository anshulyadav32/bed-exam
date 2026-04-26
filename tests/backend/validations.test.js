import { describe, expect, it } from "vitest";
import { isValidEmail, validatePasswordStrength } from "../../backend/lib/auth.js";

describe("Input Validations", () => {
    describe("isValidEmail", () => {
        it("returns true for valid emails", () => {
            expect(isValidEmail("user@example.com")).toBe(true);
            expect(isValidEmail("first.last@domain.co.in")).toBe(true);
        });

        it("returns false for invalid emails", () => {
            expect(isValidEmail("plainText")).toBe(false);
            expect(isValidEmail("@no-user.com")).toBe(false);
            expect(isValidEmail("user@no-domain")).toBe(false);
            expect(isValidEmail("user@domain.")).toBe(false);
        });
    });

    describe("validatePasswordStrength", () => {
        it("returns valid=true for strong passwords", () => {
            const res = validatePasswordStrength("StrongPass123");
            expect(res.valid).toBe(true);
        });

        it("returns error for short passwords", () => {
            const res = validatePasswordStrength("Short1");
            expect(res.valid).toBe(false);
            expect(res.message).toContain("8 characters");
        });

        it("returns error for no uppercase", () => {
            const res = validatePasswordStrength("lowercase123");
            expect(res.valid).toBe(false);
            expect(res.message).toContain("uppercase letter");
        });

        it("returns error for no lowercase", () => {
            const res = validatePasswordStrength("UPPERCASE123");
            expect(res.valid).toBe(false);
            expect(res.message).toContain("lowercase letter");
        });

        it("returns error for no numbers", () => {
            const res = validatePasswordStrength("NoNumberPass");
            expect(res.valid).toBe(false);
            expect(res.message).toContain("number");
        });
    });
});
