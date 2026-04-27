"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { text } from "@shared/data/text.js";
import { useAuth } from "@shared/hooks/useAuth.js";
import { useScores } from "@shared/hooks/useScores.js";
import Header from "@shared/components/Header.jsx";
import Footer from "@shared/components/Footer.jsx";

export default function ClientShell({ children }) {
    const [lang, setLang] = useState("en");
    const content = text[lang];
    const auth = useAuth();
    const { loadRecentScores } = useScores();
    const router = useRouter();

    useEffect(() => { loadRecentScores(); }, []);

    const navigate = (page, subjectId = null) => {
        if (page === "subject-detail") { router.push(subjectId ? `/subjects/${subjectId}` : "/subjects"); return; }
        if (page === "mock-tests") { router.push(subjectId ? `/mock-tests?subject=${subjectId}` : "/mock-tests"); return; }
        const routes = {
            home: "/",
            subjects: "/subjects",
            about: "/about",
            auth: "/auth",
            contact: "/contact",
            privacy: "/privacy",
            terms: "/terms",
            dashboard: "/dashboard",
            admin: "/admin",
            "admin-users": "/admin/users",
            "admin-subjects": "/admin/subjects",
            "admin-scores": "/admin/scores"
        };
        router.push(routes[page] || "/");
    };

    const childrenWithNav = typeof children === "function" ? children({ navigate, auth, lang }) : children;

    return (
        <>
            <div className="blob one" />
            <div className="blob two" />
            <Header brand={content.brand} lang={lang} setLang={setLang} authUser={auth.authUser} navigate={navigate} />
            <main className="container">
                {childrenWithNav}
            </main>
            <Footer navigate={navigate} />
        </>
    );
}
