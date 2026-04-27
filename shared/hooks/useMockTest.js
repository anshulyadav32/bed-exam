import { useState, useCallback } from "react";

export function useMockTest({ candidateName, onScoreSaved }) {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const onAnswer = useCallback((qIdx, val) => {
        setAnswers((prev) => ({ ...prev, [qIdx]: val }));
    }, []);

    const onSubmit = async () => {
        const totalQuestions = 50;
        let score = 0;
        const attempted = Object.keys(answers).length;

        // Note: Correct answers should ideally come from backend or shared data
        // For simplicity, using dummy logic if questions aren't passed
        // This is where real validation would happen
        
        // This is a placeholder for actual scoring logic
        score = Math.floor(Math.random() * attempted); 

        const payload = {
            candidateName: candidateName || "Anonymous",
            score,
            attempted,
            totalQuestions
        };

        try {
            const res = await fetch("/api/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setResult(payload);
                if (onScoreSaved) onScoreSaved();
            }
        } catch {
            alert("Failed to submit score.");
        }
    };

    const onReset = () => {
        setAnswers({});
        setResult(null);
    };

    return { answers, result, onAnswer, onSubmit, onReset };
}
