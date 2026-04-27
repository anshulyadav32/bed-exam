"use client";
import ClientShell from "../../_shell";
import AdminScoresPage from "../../_spa/pages/AdminScoresPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate, auth }) => (
                <AdminScoresPage 
                    navigate={navigate} 
                    authUser={auth.authUser} 
                    authToken={auth.authToken} 
                />
            )}
        </ClientShell>
    );
}
