import { useState, useEffect, useCallback } from "react";

const COMPLETED_KEY = "bed_exam_completed_tests";

function loadCompleted() {
    try {
        return JSON.parse(localStorage.getItem(COMPLETED_KEY) || "{}");
    } catch {
        return {};
    }
}

export function useDashboard(authToken) {
    const [subjects, setSubjects] = useState([]);
    const [scores, setScores] = useState([]);
    const [completed, setCompleted] = useState(loadCompleted);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [subRes, scoreRes] = await Promise.all([
                fetch("/api/subjects"),
                fetch("/api/scores", { headers }),
            ]);
            if (subRes.ok) setSubjects(await subRes.json());
            if (scoreRes.ok) setScores(await scoreRes.json());
        } catch (e) {
            setError(e.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Mark a test id as completed with its result
    const markCompleted = useCallback((testKey, result) => {
        setCompleted((prev) => {
            const next = { ...prev, [testKey]: result };
            localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    // Clear completion for a test (try again)
    const clearCompleted = useCallback((testKey) => {
        setCompleted((prev) => {
            const next = { ...prev };
            delete next[testKey];
            localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    // Build a flat list of test cards
    const testCards = [
        // Global 50-question mock test
        {
            key: "mock-global",
            label: "50-Question Full Mock Test",
            subLabel: "All Subjects · 50 Questions",
            subjectId: null,
            color: "#0b6e4f",
            completed: completed["mock-global"] ?? null,
        },
        // Subject-level tests from API
        ...subjects.map((s) => ({
            key: `subject-${s.id}`,
            label: s.name,
            subLabel: s.description || "Subject Mock Test",
            subjectId: s.id,
            color: s.color || "#0b6e4f",
            completed: completed[`subject-${s.id}`] ?? null,
        })),
    ];

    const stats = {
        total: testCards.length,
        done: Object.keys(completed).length,
        bestScore: scores.length
            ? Math.max(...scores.map((s) => Math.round((s.score / s.totalQuestions) * 100)))
            : null,
        recentScores: scores.slice(0, 5),
    };

    return { testCards, stats, loading, error, markCompleted, clearCompleted, refetch: fetchAll };
}
