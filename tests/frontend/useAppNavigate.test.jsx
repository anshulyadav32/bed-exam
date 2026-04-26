import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";

const navigateSpy = vi.fn();
let subjectIdParam = "";

vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateSpy,
    useParams: () => ({ subjectId: subjectIdParam })
}));

import { SubjectDetailRoute, useAppNavigate } from "../../frontend/src/hooks/useAppNavigate.js";

beforeEach(() => {
    navigateSpy.mockReset();
    subjectIdParam = "";
    window.location.hash = "";
});

describe("useAppNavigate", () => {
    it("routes known pages and specialized paths", () => {
        const { result } = renderHook(() => useAppNavigate());

        result.current("about");
        result.current("subject-detail", "ta");
        result.current("mock-tests", "reasoning");
        result.current("dashboard");

        expect(navigateSpy).toHaveBeenNthCalledWith(1, "/about");
        expect(navigateSpy).toHaveBeenNthCalledWith(2, "/subjects/ta");
        expect(navigateSpy).toHaveBeenNthCalledWith(3, "/mock-tests?subject=reasoning");
        expect(navigateSpy).toHaveBeenNthCalledWith(4, "/dashboard");
    });

    it("falls back to home for unknown page keys", () => {
        const { result } = renderHook(() => useAppNavigate());
        result.current("not-a-real-page");
        expect(navigateSpy).toHaveBeenCalledWith("/");
    });
});

describe("SubjectDetailRoute", () => {
    it("uses URL param when present", () => {
        subjectIdParam = "  TA  ";

        function Stub({ subjectId }) {
            return <div data-testid="subject-id">{subjectId}</div>;
        }

        render(<SubjectDetailRoute SubjectDetailPage={Stub} navigate={vi.fn()} />);
        expect(screen.getByTestId("subject-id")).toHaveTextContent("ta");
    });

    it("falls back to hash fragment when URL param is empty", () => {
        subjectIdParam = "";
        window.location.hash = "#/subjects/Reasoning?from=home";

        function Stub({ subjectId }) {
            return <div data-testid="subject-id">{subjectId}</div>;
        }

        render(<SubjectDetailRoute SubjectDetailPage={Stub} navigate={vi.fn()} />);
        expect(screen.getByTestId("subject-id")).toHaveTextContent("reasoning");
    });
});
