"use client";
import ClientShell from "../_shell";
import SubjectsPage from "../_spa/pages/SubjectsPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate }) => <SubjectsPage navigate={navigate} />}
        </ClientShell>
    );
}
