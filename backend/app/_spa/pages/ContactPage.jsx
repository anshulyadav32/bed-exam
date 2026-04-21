import React from "react";
import { useContactForm } from "../hooks/useContactForm";

export default function ContactPage({ navigate }) {
    const { values, status, isSubmitting, updateValue, submit } = useContactForm();

    return (
        <>
            <section>
                <button className="btn-alt" onClick={() => navigate("home")}>← Back to Home</button>
                <h2 className="section-title">Contact Us</h2>
                <p className="intro-text">We'd love to hear from you. Reach out with questions, feedback, or support requests.</p>
            </section>

            <section>
                <div className="contact-grid">
                    <div className="contact-card">
                        <div className="contact-icon">📧</div>
                        <h4>Email</h4>
                        <p>support@bedexamhub.com</p>
                        <a href="mailto:support@bedexamhub.com" className="btn" style={{ display: "inline-block", marginTop: "0.75rem" }}>
                            Send Email
                        </a>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">📞</div>
                        <h4>Phone</h4>
                        <p>+91-9999-999-999</p>
                        <p className="muted-text">Mon – Sat, 9 AM – 6 PM IST</p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">📍</div>
                        <h4>Address</h4>
                        <p>Education Hub,<br />New Delhi – 110001,<br />India</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="section-title">Send a Message</h3>
                <div className="contact-form-wrap">
                    <form className="contact-form" onSubmit={submit}>
                        <label>
                            Name
                            <input
                                type="text"
                                value={values.name}
                                onChange={(e) => updateValue("name", e.target.value)}
                                placeholder="Your full name"
                                required
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                value={values.email}
                                onChange={(e) => updateValue("email", e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </label>
                        <label>
                            Subject
                            <input
                                type="text"
                                value={values.subject}
                                onChange={(e) => updateValue("subject", e.target.value)}
                                placeholder="How can we help?"
                                required
                            />
                        </label>
                        <label>
                            Message
                            <textarea
                                rows={5}
                                value={values.message}
                                onChange={(e) => updateValue("message", e.target.value)}
                                placeholder="Write your message here..."
                                required
                            />
                        </label>
                        {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
                        <button className="btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
