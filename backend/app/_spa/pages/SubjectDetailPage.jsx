import React, { useEffect, useMemo, useState } from "react";
import { useSubjectDetail } from "../hooks/useSubjects.js";

export default function SubjectDetailPage({ subjectId, navigate }) {
    const { subject, loading, error } = useSubjectDetail(subjectId);
    const bookmarkKey = useMemo(() => `bed-bookmarked-${subjectId || "subject"}`, [subjectId]);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        if (!subject) {
            setBookmarked(false);
            return;
        }
        const saved = localStorage.getItem(bookmarkKey);
        setBookmarked(saved === "true");
    }, [bookmarkKey, subject]);

    if (loading) {
        return (
            <section>
                <button className="btn-alt" onClick={() => navigate("subjects")}>← Back to Subjects</button>
                <p className="intro-text">Loading subject…</p>
            </section>
        );
    }

    if (error || !subject) {
        return (
            <section>
                <button className="btn-alt" onClick={() => navigate("subjects")}>← Back to Subjects</button>
                <h2 className="section-title">Subject details are not available</h2>
                <p className="intro-text">Please select another subject from the subjects page.</p>
            </section>
        );
    }

    const onToggleBookmark = () => {
        const next = !bookmarked;
        setBookmarked(next);
        localStorage.setItem(bookmarkKey, String(next));
    };

    return (
        <>
            <section>
                <button className="btn-alt" onClick={() => navigate("subjects")}>← Back to Subjects</button>
                <h2 className="section-title">{subject.title}</h2>
                <p className="intro-text">{subject.subtitle}</p>
            </section>

            <section>
                <h3 className="section-title">🎯 Overview</h3>
                <div className="content-box">
                    <p>{subject.overview}</p>
                </div>
            </section>

            <section>
                <h3 className="section-title">📚 Detailed Syllabus</h3>
                <div className="syllabus-sections">
                    {subject.sections.map((sec, i) => (
                        <article key={sec.heading} className="syllabus-section-card">
                            <h4>{i + 1}. {sec.heading}</h4>
                            {Array.isArray(sec.images) && sec.images.length > 0 ? (
                                <div className="syllabus-images-grid">
                                    {sec.images.map((img, idx) => (
                                        <img key={`${sec.heading}-${idx}`} src={img} alt={`${sec.heading} reference ${idx + 1}`} loading="lazy" />
                                    ))}
                                </div>
                            ) : null}
                            <ul>
                                {(Array.isArray(sec.topics) ? sec.topics : []).map((t) => <li key={t}>{t}</li>)}
                            </ul>
                            {sec.notesLink && (
                                <a className="section-notes-link" href={sec.notesLink} download>
                                    📄 Download {sec.heading} Notes
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="section-title">📝 Exam Pattern (Typical)</h3>
                <div className="content-box">
                    <ul className="exam-pattern-list">
                        <li><b>Total Questions:</b> {subject.examPattern.totalQuestions}</li>
                        <li><b>Type:</b> {subject.examPattern.type}</li>
                        <li><b>Difficulty:</b> {subject.examPattern.difficulty}</li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="section-title">🚀 Actions</h3>
                <div className="subject-actions">
                    <button className="btn" onClick={() => navigate("mock-tests", subjectId)}>▶ Start Mock Test</button>
                    <button className="btn-alt" onClick={onToggleBookmark}>{bookmarked ? "★ Bookmarked" : "⭐ Bookmark Topic"}</button>
                </div>
            </section>

            <section>
                <h3 className="section-title">🔄 Same Layout for Other Subjects</h3>
                <div className="tests-grid">
                    {(subject.tests || []).map((test) => (
                        <article key={test.id} className="test-card">
                            <h4>{test.name}</h4>
                            <p className="test-meta">
                                <span>⏱️ {test.duration}</span>
                                <span>❓ {test.questions} Qs</span>
                            </p>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
