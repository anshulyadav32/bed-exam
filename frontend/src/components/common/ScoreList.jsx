import React from "react";

/**
 * Reusable component to display a list of recent mock test scores.
 */
export default function ScoreList({ recentScores, title = "Recent Results (PostgreSQL)" }) {
    return (
        <div className="leaderboard">
            <h4>{title}</h4>
            <ul>
                {recentScores.length === 0 ? (
                    <li>No records yet.</li>
                ) : (
                    recentScores.map((item) => (
                        <li key={item.id}>
                            <span>{item.candidateName}</span>
                            <strong>{item.score}/{item.totalQuestions}</strong>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
