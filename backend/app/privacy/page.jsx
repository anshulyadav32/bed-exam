"use client";
import ClientShell from "../_shell";
import PrivacyPage from "../_spa/pages/PrivacyPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate }) => <PrivacyPage navigate={navigate} />}
        </ClientShell>
    );
}
