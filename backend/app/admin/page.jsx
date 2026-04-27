"use client";
import ClientShell from "../_shell";
import AdminDashboardPage from "../_spa/pages/AdminDashboardPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate, auth }) => (
                <AdminDashboardPage 
                    navigate={navigate} 
                    authUser={auth.authUser} 
                    authToken={auth.authToken} 
                />
            )}
        </ClientShell>
    );
}
