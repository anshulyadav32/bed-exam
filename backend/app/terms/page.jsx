"use client";
import ClientShell from "../_shell";
import TermsPage from "../_spa/pages/TermsPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate }) => <TermsPage navigate={navigate} />}
        </ClientShell>
    );
}
