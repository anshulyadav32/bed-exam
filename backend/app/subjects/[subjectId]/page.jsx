"use client";
import { use } from "react";
import ClientShell from "../../_shell";
import SubjectDetailPage from "../../_spa/pages/SubjectDetailPage";

export default function Page({ params }) {
    const { subjectId } = use(params);
    return (
        <ClientShell>
            {({ navigate }) => <SubjectDetailPage subjectId={subjectId} navigate={navigate} />}
        </ClientShell>
    );
}
