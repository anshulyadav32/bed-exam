import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from '../../frontend/src/App';

describe('App Component', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input || "");

      if (url.includes("/api/subjects")) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => "application/json" },
          json: async () => []
        };
      }

      if (url.includes("/api/scores")) {
        return {
          ok: true,
          status: 200,
          headers: { get: () => "application/json" },
          json: async () => []
        };
      }

      if (url.includes("/api/auth/me")) {
        return {
          ok: false,
          status: 401,
          headers: { get: () => "application/json" },
          json: async () => ({ message: "Unauthorized" })
        };
      }

      if (url.includes("/api/auth/refresh")) {
        return {
          ok: false,
          status: 401,
          headers: { get: () => "application/json" },
          json: async () => ({ message: "Invalid or expired refresh token" })
        };
      }

      return {
        ok: false,
        status: 404,
        headers: { get: () => "application/json" },
        json: async () => ({ message: "Not Found" })
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the brand name', async () => {
    render(<App />);

    const brandElement = await screen.findByText(/B\.Ed Exam Hub/i);
    expect(brandElement).toBeDefined();
  });
});
