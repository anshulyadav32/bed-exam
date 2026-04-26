import React from "react";

const SECTIONS = [
    ["1. Information We Collect", "We collect information you provide when creating an account (name, email, password) and usage data such as test scores and activity logs to improve your learning experience."],
    ["2. How We Use Your Information", "Your data is used solely to provide and improve our platform — including personalised practice recommendations, result tracking, and account management. We do not sell your personal information to third parties."],
    ["3. Data Storage & Security", "All data is stored securely in encrypted databases. Passwords are hashed and never stored in plain text. We use industry-standard security measures to protect your information."],
    ["4. Cookies", "We use secure, HTTP-only session cookies to keep you logged in. No third-party tracking cookies are used on this platform."],
    ["5. Your Rights", "You may request deletion of your account and associated data at any time by contacting us at support@bedexamhub.com. We will process your request within 7 business days."],
    ["6. Changes to This Policy", "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes acceptance."],
    ["7. Contact", <>For any privacy-related questions, contact us at <a href="mailto:support@bedexamhub.com">support@bedexamhub.com</a>.</>]
];

export default function PrivacyPage({ navigate }) {
    return (
        <>
            <section>
                <button className="btn-alt" onClick={() => navigate("home")}>← Back to Home</button>
                <h2 className="section-title">Privacy Policy</h2>
                <p className="muted-text">Last updated: April 2026</p>
            </section>
            <section>
                <div className="policy-wrap">
                    {SECTIONS.map(([heading, body]) => (
                        <div className="policy-block" key={heading}>
                            <h4>{heading}</h4>
                            <p>{body}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
