import React from "react";

export default function Footer({ navigate }) {
    return (
        <footer>
            <p>© 2026 B.Ed Prep Platform. All rights reserved.</p>
            <div className="footer-links">
                <button className="footer-link-btn" onClick={() => navigate("contact")}>Contact Us</button>
                <button className="footer-link-btn" onClick={() => navigate("privacy")}>Privacy Policy</button>
                <button className="footer-link-btn" onClick={() => navigate("terms")}>Terms of Service</button>
            </div>
        </footer>
    );
}
