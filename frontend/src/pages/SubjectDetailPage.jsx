import React, { useEffect, useMemo, useState } from "react";
import { useSubjectDetail } from "../hooks/useSubjects.js";

function ChapterAccordion({ sections }) {
    const [openIndex, setOpenIndex] = useState(0);

    const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i));

    return (
        <div className="chapter-accordion">
            {sections.map((sec, i) => {
                const isOpen = openIndex === i;
                const topics = Array.isArray(sec.topics) ? sec.topics : [];
                return (
                    <article key={sec.heading} className={`chapter-card${isOpen ? " chapter-card--open" : ""}`}>
                        <button
                            className="chapter-header"
                            onClick={() => toggle(i)}
                            aria-expanded={isOpen}
                        >
                            <span className="chapter-num">{i + 1}</span>
                            <span className="chapter-title">{sec.heading}</span>
                            <span className="chapter-meta">{topics.length} topics</span>
                            <span className="chapter-chevron">{isOpen ? "▲" : "▼"}</span>
                        </button>

                        {isOpen && (
                            <div className="chapter-body">
                                {sec.explanation && (
                                    <p className="chapter-explanation">{sec.explanation}</p>
                                )}

                                <div className="chapter-topics">
                                    {topics.map((t) => (
                                        <span key={t} className="chapter-topic-chip">{t}</span>
                                    ))}
                                </div>

                                {Array.isArray(sec.images) && sec.images.length > 0 && (
                                    <div className="chapter-images-grid">
                                        {sec.images.map((img, idx) => (
                                            <img
                                                key={`${sec.heading}-${idx}`}
                                                src={img}
                                                alt={`${sec.heading} visual ${idx + 1}`}
                                                loading="lazy"
                                            />
                                        ))}
                                    </div>
                                )}

                                {sec.notesLink && (
                                    <a className="chapter-notes-link" href={sec.notesLink} download>
                                        📄 Download {sec.heading} Notes
                                    </a>
                                )}
                            </div>
                        )}
                    </article>
                );
            })}
        </div>
    );
}

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
                <h3 className="section-title">📚 Chapters &amp; Syllabus</h3>
                <ChapterAccordion sections={subject.sections} />
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
                <h3 className="section-title">🧪 Practice Tests</h3>
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
