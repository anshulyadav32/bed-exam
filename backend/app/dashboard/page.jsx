"use client";
import ClientShell from "../_shell";
import DashboardPage from "../_spa/pages/DashboardPage";

export default function Page() {
    return (
        <ClientShell>
            {({ navigate, auth }) => (
                <DashboardPage 
                    navigate={navigate} 
                    authUser={auth.authUser} 
                    authToken={auth.authToken} 
                />
            )}
        </ClientShell>
    );
}
