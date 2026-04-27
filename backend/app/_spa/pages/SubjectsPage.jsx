import React from "react";
import { useSubjects } from "../hooks/useSubjects.js";

export default function SubjectsPage({ navigate }) {
    const { subjects, loading, error } = useSubjects();

    if (loading) return <section><p className="intro-text">Loading subjects…</p></section>;
    if (error) return <section><p className="intro-text">Failed to load subjects: {error}</p></section>;

    return (
        <section>
            <h2 className="section-title">Select Subject to Practice</h2>
            <p className="intro-text">Choose from 4 main subjects with curated tests and questions.</p>
            <div className="subjects-grid-large">
                {subjects.map((subject) => (
                    <article
                        key={subject.id}
                        className="subject-card-large"
                        style={{ backgroundColor: subject.color + "10", borderLeft: `5px solid ${subject.color}` }}
                    >
                        <h3>{subject.name}</h3>
                        <p>{subject.description}</p>
                        <button className="btn" onClick={() => navigate("subject-detail", subject.id)}>
                            View Tests →
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}
