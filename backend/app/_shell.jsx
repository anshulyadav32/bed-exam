"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { text } from "./_spa/data/text";
import { useAuth } from "./_spa/hooks/useAuth";
import { useScores } from "./_spa/hooks/useScores";
import Header from "./_spa/components/Header";
import Footer from "./_spa/components/Footer";

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
        const routes = { home: "/", subjects: "/subjects", about: "/about", auth: "/auth", contact: "/contact", privacy: "/privacy", terms: "/terms" };
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
