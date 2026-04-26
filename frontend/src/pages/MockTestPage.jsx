import React from "react";
import { mockQuestions } from "../data/questions";
import { useMockTest } from "../hooks/useMockTest";
import ScoreList from "../components/common/ScoreList";

export default function MockTestPage({ candidateName, setCandidateName, recentScores, statusMessage, loadRecentScores, navigate, subjectId }) {
    const { answers, result, onAnswer, onSubmit, onReset } = useMockTest({
        candidateName,
        onScoreSaved: loadRecentScores
    });

    const scoreText = result
        ? `Score: ${result.score} / 50 | Attempted: ${result.attempted} / 50`
        : "Score: -- / 50";

    return (
        <section id="mock-test">
            <button className="btn-alt" onClick={() => navigate(subjectId ? "subject-detail" : "subjects", subjectId || null)}>
                {subjectId ? "← Back to Subject" : "← Back to Subjects"}
            </button>
            <h2 className="section-title">50-Question Mock Test</h2>
            <article className="mock-wrap">
                <label className="name-field">
                    Candidate Name
                    <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </label>

                <div className="mock-grid">
                    {mockQuestions.map((item, idx) => (
                        <article key={item[0]} className="mock-q">
                            <p>{idx + 1}) {item[0]}</p>
                            {item[1].map((opt, optIdx) => (
                                <label key={opt}>
                                    <input
                                        type="radio"
                                        name={`q-${idx}`}
                                        value={optIdx}
                                        checked={String(answers[idx]) === String(optIdx)}
                                        onChange={(e) => onAnswer(idx, e.target.value)}
                                    />
                                    {" "}{String.fromCharCode(65 + optIdx)}. {opt}
                                </label>
                            ))}
                        </article>
                    ))}
                </div>

                <div className="mock-actions">
                    <button className="btn" type="button" onClick={onSubmit}>Submit Mock Test</button>
                    <button className="btn-alt" type="button" onClick={onReset}>Reset</button>
                    <div className="score-box">{scoreText}</div>
                </div>

                {statusMessage && <p className="status-msg">{statusMessage}</p>}

                <ScoreList recentScores={recentScores} />
            </article>
        </section>
    );
}
