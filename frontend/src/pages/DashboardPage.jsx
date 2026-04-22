import React from "react";
import { useDashboard } from "../hooks/useDashboard";

function ProgressBar({ value, max }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="db-progress-track">
            <div className="db-progress-fill" style={{ width: `${pct}%` }} />
        </div>
    );
}

function TestCard({ card, onStart, onTryAgain }) {
    const isCompleted = card.completed !== null;
    const pct = isCompleted
        ? Math.round((card.completed.score / card.completed.totalQuestions) * 100)
        : null;

    return (
        <article className={`db-test-card ${isCompleted ? "db-test-card--done" : ""}`}>
            <div className="db-test-card__color-bar" style={{ background: card.color }} />
            <div className="db-test-card__body">
                <h4 className="db-test-card__title">{card.label}</h4>
                <p className="db-test-card__sub">{card.subLabel}</p>

                {isCompleted && (
                    <div className="db-test-card__result">
                        <span className="db-badge db-badge--done">Completed</span>
                        <span className="db-score-text">
                            {card.completed.score}/{card.completed.totalQuestions} &nbsp;
                            <strong>({pct}%)</strong>
                        </span>
                        <ProgressBar value={card.completed.score} max={card.completed.totalQuestions} />
                    </div>
                )}

                {!isCompleted && (
                    <span className="db-badge db-badge--pending">Not Started</span>
                )}
            </div>
            <div className="db-test-card__actions">
                {isCompleted ? (
                    <button className="btn-alt" onClick={() => onTryAgain(card)}>Try Again</button>
                ) : (
                    <button className="btn" onClick={() => onStart(card)}>Start Test</button>
                )}
            </div>
        </article>
    );
}

export default function DashboardPage({ authUser, authToken, navigate }) {
    const { testCards, stats, loading, error } = useDashboard(authToken);

    const handleStart = (card) => {
        if (card.subjectId) {
            navigate("mock-tests", card.subjectId);
        } else {
            navigate("mock-tests");
        }
    };

    const handleTryAgain = (card) => {
        handleStart(card);
    };

    return (
        <section id="dashboard">
            <h2 className="section-title">
                {authUser ? `Welcome back, ${authUser.name.split(" ")[0]}!` : "Dashboard"}
            </h2>

            {/* Stats row */}
            <div className="db-stats-row">
                <div className="db-stat-card">
                    <span className="db-stat-value">{stats.total}</span>
                    <span className="db-stat-label">Total Tests</span>
                </div>
                <div className="db-stat-card">
                    <span className="db-stat-value">{stats.done}</span>
                    <span className="db-stat-label">Completed</span>
                </div>
                <div className="db-stat-card">
                    <span className="db-stat-value">{stats.total - stats.done}</span>
                    <span className="db-stat-label">Remaining</span>
                </div>
                <div className="db-stat-card">
                    <span className="db-stat-value">
                        {stats.bestScore !== null ? `${stats.bestScore}%` : "—"}
                    </span>
                    <span className="db-stat-label">Best Score</span>
                </div>
            </div>

            {/* Test listing */}
            <h3 className="db-section-heading">Mock Tests</h3>

            {loading && <p className="muted-text">Loading tests…</p>}
            {error && <p className="muted-text">Could not load subjects: {error}</p>}

            {!loading && (
                <div className="db-test-grid">
                    {testCards.map((card) => (
                        <TestCard
                            key={card.key}
                            card={card}
                            onStart={handleStart}
                            onTryAgain={handleTryAgain}
                        />
                    ))}
                </div>
            )}

            {/* Recent scores */}
            {stats.recentScores.length > 0 && (
                <>
                    <h3 className="db-section-heading">Recent Results</h3>
                    <div className="db-scores-table">
                        <div className="db-scores-head">
                            <span>Name</span>
                            <span>Score</span>
                            <span>Attempted</span>
                            <span>%</span>
                        </div>
                        {stats.recentScores.map((s) => (
                            <div className="db-scores-row" key={s.id}>
                                <span>{s.candidateName}</span>
                                <span>{s.score}/{s.totalQuestions}</span>
                                <span>{s.attempted}</span>
                                <span>{Math.round((s.score / s.totalQuestions) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
