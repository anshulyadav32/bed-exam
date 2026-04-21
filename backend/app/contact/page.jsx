"use client";
import ClientShell from "../_shell";
import ContactPage from "../_spa/pages/ContactPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate }) => <ContactPage navigate={navigate} />}
        </ClientShell>
    );
}
