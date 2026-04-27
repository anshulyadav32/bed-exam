"use client";
import ClientShell from "../../_shell";
import AdminUsersPage from "../../_spa/pages/AdminUsersPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate, auth }) => (
                <AdminUsersPage 
                    navigate={navigate} 
                    authUser={auth.authUser} 
                    authToken={auth.authToken} 
                />
            )}
        </ClientShell>
    );
}
