"use client";
import ClientShell from "../_shell";
import AboutPage from "../_spa/pages/AboutPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate }) => <AboutPage navigate={navigate} />}
        </ClientShell>
    );
}
