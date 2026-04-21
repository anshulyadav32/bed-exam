import React from "react";

const SECTIONS = [
    ["1. Acceptance of Terms", "By accessing or using B.Ed Prep Platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform."],
    ["2. Use of the Platform", "This platform is intended for educational use by B.Ed entrance exam aspirants. You agree to use it only for lawful purposes and not to misuse, reverse-engineer, or disrupt any part of the service."],
    ["3. Accounts", "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account at support@bedexamhub.com."],
    ["4. Intellectual Property", "All content on this platform — including questions, explanations, design, and code — is the property of B.Ed Prep Platform. You may not reproduce, distribute, or create derivative works without explicit written permission."],
    ["5. Disclaimer", "The platform is provided \"as is\" for educational purposes. We do not guarantee exam results or admission outcomes. Practice scores are indicative only and may not reflect actual exam performance."],
    ["6. Limitation of Liability", "B.Ed Prep Platform shall not be liable for any direct, indirect, or consequential damages arising from use of this service. Use the platform at your own discretion."],
    ["7. Modifications", "We reserve the right to modify these terms at any time. Updated terms will be posted on this page. Continued use of the platform after any change constitutes acceptance of the new terms."],
    ["8. Contact", <>For any queries regarding these terms, contact us at <a href="mailto:support@bedexamhub.com">support@bedexamhub.com</a>.</>]
];

export default function TermsPage({ navigate }) {
    return (
        <>
            <section>
                <button className="btn-alt" onClick={() => navigate("home")}>← Back to Home</button>
                <h2 className="section-title">Terms of Service</h2>
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
