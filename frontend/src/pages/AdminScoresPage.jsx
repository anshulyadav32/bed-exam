import React, { useState, useEffect } from "react";
import { readJsonSafely } from "@shared/utils/api.js";
import { Skeleton, SkeletonCard } from "@shared/components/Skeleton.jsx";

export default function AdminScoresPage({ authToken, navigate }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAllScores() {
            setLoading(true);
            try {
                const res = await fetch("/api/admin/scores", {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                if (res.status === 401) {
                    setError("Unauthorized.");
                    return;
                }
                const data = await readJsonSafely(res);
                setScores(data || []);
            } catch (err) {
                setError("Failed to load scores.");
            } finally {
                setLoading(false);
            }
        }
        if (authToken) loadAllScores();
    }, [authToken]);

    return (
        <section className="container">
            <button className="btn-alt" onClick={() => navigate("admin")}>← Back to Dashboard</button>
            <h2 className="section-title">All Mock Test Attempts</h2>

            {error && <p className="status-msg" style={{ color: 'red' }}>{error}</p>}

            <div className="db-scores-table">
                <div className="db-scores-head" style={{ gridTemplateColumns: '1.5fr 1fr 100px 100px 1fr' }}>
                    <span>Candidate</span>
                    <span>Date</span>
                    <span>Score</span>
                    <span>Total</span>
                    <span>Accuracy</span>
                </div>
                {loading ? (
                    <SkeletonCard count={8} />
                ) : (
                    scores.map(s => {
                        const accuracy = s.totalQuestions > 0 ? Math.round((s.score / s.totalQuestions) * 100) : 0;
                        return (
                            <div className="db-scores-row" key={s.id} style={{ gridTemplateColumns: '1.5fr 1fr 100px 100px 1fr' }}>
                                <span data-label="Candidate" style={{ fontWeight: 600 }}>{s.candidateName}</span>
                                <span data-label="Date" style={{ fontSize: '0.8rem' }}>{new Date(s.createdAt).toLocaleDateString()}</span>
                                <span data-label="Score"><strong>{s.score}</strong></span>
                                <span data-label="Total">{s.totalQuestions}</span>
                                <span data-label="Accuracy">
                                    <span className={`db-badge ${accuracy >= 70 ? 'db-badge--done' : 'db-badge--pending'}`}>
                                        {accuracy}%
                                    </span>
                                </span>
                            </div>
                        );
                    })
                )}
                {!loading && scores.length === 0 && <div className="db-scores-row">No records found.</div>}
            </div>
        </section>
    );
}
