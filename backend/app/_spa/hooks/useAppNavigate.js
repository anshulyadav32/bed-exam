import { createElement, useCallback } from "react";
import { useNavigate as useRouterNavigate, useParams } from "react-router-dom";

/**
 * Encapsulates the application's page-navigation logic behind a single
 * stable `navigate(page, subjectId?)` function, keeping App.jsx thin.
 */
export function useAppNavigate() {
    const routerNavigate = useRouterNavigate();

    const navigate = useCallback((page, nextSubjectId = null) => {
        const routes = {
            home: "/",
            subjects: "/subjects",
            about: "/about",
            auth: "/auth",
            contact: "/contact",
            privacy: "/privacy",
            terms: "/terms",
            admin: "/admin",
            "admin-users": "/admin/users",
            "admin-subjects": "/admin/subjects",
            "admin-scores": "/admin/scores"
        };

        if (page === "subject-detail") {
            routerNavigate(nextSubjectId ? `/subjects/${nextSubjectId}` : "/subjects");
            return;
        }

        if (page === "mock-tests") {
            routerNavigate(nextSubjectId ? `/mock-tests?subject=${nextSubjectId}` : "/mock-tests");
            return;
        }

        if (page === "dashboard") {
            routerNavigate("/dashboard");
            return;
        }

        routerNavigate(routes[page] || "/");
    }, [routerNavigate]);

    return navigate;
}

/**
 * Route wrapper that resolves the subject ID from URL params or the hash
 * fragment, then renders SubjectDetailPage with it.
 */
export function SubjectDetailRoute({ SubjectDetailPage, navigate }) {
    const { subjectId: paramSubjectId = "" } = useParams();
    const hashSubjectId = window.location.hash.split("/").pop()?.split("?")[0] || "";
    const subjectId = (paramSubjectId || hashSubjectId || "").trim().toLowerCase();

    return createElement(SubjectDetailPage, { subjectId, navigate });
}
