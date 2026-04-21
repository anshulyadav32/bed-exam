import React from "react";

export default function AboutPage() {
    return (
        <>
            <section>
                <h2 className="section-title">About Us</h2>
                <div className="content-box">
                    <p>
                        Welcome to the B.Ed Entrance Exam Preparation Platform. We are an educational technology company
                        dedicated to helping aspiring teachers prepare for B.Ed entrance exams with confidence and clarity.
                    </p>
                    <p>
                        Our platform provides comprehensive mock tests, detailed syllabus coverage, performance analytics,
                        and personalized learning paths to ensure your success.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="section-title">Our Mission</h2>
                <div className="mission-vision">
                    <div className="mv-card">
                        <h4>🎯 Mission</h4>
                        <p>To empower aspiring teachers with high-quality preparation resources and guidance for B.Ed entrance exams.</p>
                    </div>
                    <div className="mv-card">
                        <h4>✨ Vision</h4>
                        <p>To create a generation of well-prepared, confident educators who can make a positive impact in the classroom.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="section-title">Why Choose Us?</h2>
                <div className="features-grid">
                    {[
                        ["📝 Real Exam Questions", "Mock tests based on actual exam patterns and difficulty levels"],
                        ["📊 Instant Analysis", "Get detailed performance reports and improvement suggestions"],
                        ["👥 Expert Content", "Curated by experienced educators and exam specialists"],
                        ["🔓 Free Access", "Start practicing for free with no hidden charges"]
                    ].map(([title, desc]) => (
                        <div className="feature-card" key={title}>
                            <h4>{title}</h4>
                            <p>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="section-title">Contact Us</h2>
                <div className="contact-info">
                    <p><b>Email:</b> support@bedexamhub.com</p>
                    <p><b>Phone:</b> +91-XXXX-XXXX-XXXX</p>
                    <p><b>Address:</b> Education Hub, Delhi, India</p>
                </div>
            </section>
        </>
    );
}
