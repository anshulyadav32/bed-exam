"use client";
import ClientShell from "./_shell";
import HomePage from "./_spa/pages/HomePage";

export default function RootPage() {
    return (
        <ClientShell>
            {({ navigate }) => <HomePage navigate={navigate} />}
        </ClientShell>
    );
}
