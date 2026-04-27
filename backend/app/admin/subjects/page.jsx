"use client";
import ClientShell from "../../_shell";
import AdminSubjectsPage from "../../_spa/pages/AdminSubjectsPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate, auth }) => (
                <AdminSubjectsPage 
                    navigate={navigate} 
                    authUser={auth.authUser} 
                    authToken={auth.authToken} 
                />
            )}
        </ClientShell>
    );
}
