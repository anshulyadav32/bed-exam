import { useState } from "react";
import { mockQuestions } from "../data/questions";

export function useMockTest({ candidateName, onScoreSaved }) {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const onAnswer = (idx, val) => setAnswers((prev) => ({ ...prev, [idx]: val }));

    const onSubmit = async () => {
        let score = 0;
        let attempted = 0;
        mockQuestions.forEach((q, idx) => {
            if (answers[idx] !== undefined) {
                attempted++;
                if (Number(answers[idx]) === q[2]) score++;
            }
        });

        const payload = {
            candidateName: candidateName.trim() || "Anonymous",
            score,
            attempted,
            totalQuestions: 50
        };

        setResult({ score, attempted });

        try {
            const res = await fetch("/api/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok && onScoreSaved) onScoreSaved();
        } catch {
            // silent – result still shown locally
        }
    };

    const onReset = () => { setAnswers({}); setResult(null); };

    return { answers, result, onAnswer, onSubmit, onReset };
}
