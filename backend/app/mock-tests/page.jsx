"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useScores } from "../_spa/hooks/useScores";
import ClientShell from "../_shell";
import MockTestPage from "../_spa/pages/MockTestPage";
import { useState, useEffect } from "react";
import { useAuth } from "../_spa/hooks/useAuth";

function MockTestInner({ navigate }) {
    const { recentScores, statusMessage, loadRecentScores } = useScores();
    const auth = useAuth();
    const searchParams = useSearchParams();
    const subjectId = searchParams.get("subject") || "";
    const [candidateName, setCandidateName] = useState("");

    useEffect(() => {
        if (auth.authUser && !candidateName) {
            setCandidateName(auth.authUser.name || "");
        }
    }, [auth.authUser]);

    useEffect(() => { loadRecentScores(); }, []);

    return (
        <MockTestPage
            candidateName={candidateName}
            setCandidateName={setCandidateName}
            recentScores={recentScores}
            statusMessage={statusMessage}
            loadRecentScores={loadRecentScores}
            navigate={navigate}
            subjectId={subjectId}
        />
    );
}

export default function Page() {
    return (
        <ClientShell>
            {({ navigate }) => (
                <Suspense fallback={null}>
                    <MockTestInner navigate={navigate} />
                </Suspense>
            )}
        </ClientShell>
    );
}
