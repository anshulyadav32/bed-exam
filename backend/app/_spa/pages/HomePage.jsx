import React from "react";
import { useSubjects } from "../hooks/useSubjects.js";

export default function HomePage({ navigate }) {
    const { subjects, loading } = useSubjects();

    return (
        <>
            <section className="hero">
                <div>
                    <h1>Prepare for B.Ed Entrance Exam 2026</h1>
                    <p>Get subject-wise practice, latest syllabus, and real exam-level mock tests to crack B.Ed 2026.</p>
                    <button className="btn" onClick={() => navigate("mock-tests")}>Start Free Mock Test</button>
                    <div className="hero-meta">
                        <span className="pill">2-Year Program</span>
                        <span className="pill">100+ Mock Questions</span>
                        <span className="pill">Real Exam Pattern</span>
                    </div>
                </div>
                <aside className="hero-card">
                    <h3>Quick Facts</h3>
                    <ul>
                        <li><b>Duration:</b> 2–3 Hours</li>
                        <li><b>Total Qs:</b> 100 Questions</li>
                        <li><b>Topics:</b> 4 Main Subjects</li>
                        <li><b>Passing:</b> Required for teaching</li>
                    </ul>
                </aside>
            </section>

            <section>
                <h2 className="section-title">About B.Ed Exam 2026</h2>
                <div className="content-box">
                    <p>
                        The Bachelor of Education (B.Ed) is a professional teaching degree required to become a school teacher in India.
                        Admission is done through entrance exams conducted by states and universities. The course duration is typically
                        <b> 2 years</b> after graduation.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="section-title">Important Dates (B.Ed 2026)</h2>
                <div className="dates-table">
                    {[
                        ["Application Start", "February – March 2026"],
                        ["Last Date to Apply", "March – April 2026"],
                        ["Admit Card Release", "April – May 2026"],
                        ["Exam Date", "May – June 2026"],
                        ["Result Declaration", "June – July 2026"],
                        ["Counselling Begins", "July – August 2026"]
                    ].map(([label, value]) => (
                        <div className="date-row" key={label}>
                            <span className="date-label">{label}</span>
                            <span className="date-value">{value}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="section-title">Popular B.Ed Entrance Exams</h2>
                <ul className="exams-ul">
                    <li>UP B.Ed JEE</li>
                    <li>Rajasthan PTET</li>
                    <li>CUET PG</li>
                </ul>
            </section>

            <section>
                <h2 className="section-title">Important Links</h2>
                <ul className="links-ul">
                    {[
                        ["https://mjpru.ac.in", "UP B.Ed Official Website"],
                        ["https://ptetvmou2024.com", "Rajasthan PTET Official Website"],
                        ["https://cuet.nta.nic.in", "CUET PG Official Website"],
                        ["https://examinationservices.nic.in", "Download Admit Card"],
                        ["https://results.nic.in", "Check Results"]
                    ].map(([href, label]) => (
                        <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="section-title">Exam Pattern</h2>
                <div className="exam-pattern">
                    <div className="pattern-card">
                        <h4>📊 Exam Structure</h4>
                        <ul>
                            <li><b>Total Questions:</b> 100</li>
                            <li><b>Duration:</b> 2–3 Hours</li>
                            <li><b>Marking:</b> +1 per correct answer</li>
                            <li><b>Type:</b> Multiple Choice</li>
                        </ul>
                    </div>
                    <div className="pattern-card">
                        <h4>📋 Subjects</h4>
                        <ul>
                            <li>General Knowledge</li>
                            <li>Teaching Aptitude</li>
                            <li>Reasoning</li>
                            <li>Language (Hindi/English)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="section-title">Subjects</h2>
                <div className="subjects-grid">
                    {loading ? (
                        <p className="intro-text">Loading…</p>
                    ) : subjects.map((subject) => (
                        <button
                            key={subject.id}
                            className="subject-card"
                            onClick={() => navigate("subject-detail", subject.id)}
                            style={{ borderLeft: `4px solid ${subject.color}` }}
                        >
                            <h4>{subject.name}</h4>
                            <p>{subject.description}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="section-title">Practice Section</h2>
                <div className="content-box">
                    <p>Practice with real exam-level questions. Attempt subject-wise tests with timer and get instant results.</p>
                    <button className="btn" style={{ marginTop: "1rem" }} onClick={() => navigate("mock-tests")}>Start Mock Test</button>
                </div>
            </section>

            <section>
                <h2 className="section-title">Features</h2>
                <div className="features-grid">
                    {[
                        ["⏱️ Timed Mock Tests", "Simulate real exam conditions with countdown timers"],
                        ["📊 Instant Result & Analysis", "Get your score and detailed answer review immediately"],
                        ["📘 Subject-wise Practice", "Focus on GK, Reasoning, Teaching Aptitude, or Language"],
                        ["📱 Mobile Friendly", "Practice anywhere, anytime on any device"]
                    ].map(([title, desc]) => (
                        <div className="feature-card" key={title}>
                            <h4>{title}</h4>
                            <p>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="section-title">About Us</h2>
                <div className="content-box">
                    <p>
                        We provide a smart learning platform for B.Ed aspirants with subject-wise practice, detailed syllabus,
                        and performance tracking to help students succeed in entrance exams.
                    </p>
                </div>
            </section>
        </>
    );
}
