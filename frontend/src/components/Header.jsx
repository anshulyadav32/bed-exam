import React from "react";

export default function Header({ brand, lang, setLang, authUser, authToken, navigate }) {
    return (
        <header>
            <div className="container nav-wrap">
                <div className="brand" onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
                    {brand}
                </div>
                <div className="nav-links">
                    <button className="nav-btn" onClick={() => navigate("home")}>Home</button>
                    <button className="nav-btn" onClick={() => navigate("subjects")}>Subjects</button>
                    <button className="nav-btn" onClick={() => navigate("about")}>About Us</button>
                    {!authUser ? (
                        <button className="nav-btn" onClick={() => navigate("auth")}>Login</button>
                    ) : (
                        <>
                            <button className="nav-btn" onClick={() => navigate("dashboard")}>Dashboard</button>
                            <button className="nav-btn" onClick={() => navigate("mock-tests")}>Mock Test</button>
                            {authUser.role === "ADMIN" && (
                                <button className="nav-btn" onClick={() => navigate("admin")} style={{ color: '#d35400', fontWeight: 'bold' }}>Admin</button>
                            )}
                        </>
                    )}
                    {authUser && <button className="nav-btn user-menu" onClick={() => navigate("auth")}>{authUser.name} ▼</button>}
                    <button className="lang-btn" onClick={() => setLang((v) => (v === "en" ? "hi" : "en"))}>
                        {lang === "en" ? "हिंदी" : "English"}
                    </button>
                </div>
            </div>
        </header>
    );
}
