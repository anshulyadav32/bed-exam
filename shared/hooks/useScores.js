import { useState, useCallback } from "react";

export function useScores() {
    const [recentScores, setRecentScores] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");

    const loadRecentScores = useCallback(async () => {
        try {
            const res = await fetch("/api/scores");
            if (!res.ok) return;
            const data = await res.json();
            setRecentScores(data);
        } catch {
            setStatusMessage("API not reachable. Start backend to use PostgreSQL.");
        }
    }, []);

    return { recentScores, statusMessage, setStatusMessage, loadRecentScores };
}
