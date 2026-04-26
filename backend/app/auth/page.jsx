"use client";
import ClientShell from "../_shell";
import AuthPage from "../_spa/pages/AuthPage";

export default function Page() {
    return (
        <ClientShell>
            {({ auth, navigate }) => (
                <AuthPage
                    authUser={auth.authUser}
                    authToken={auth.authToken}
                    authMode={auth.authMode}
                    setAuthMode={auth.setAuthMode}
                    authForm={auth.authForm}
                    setAuthForm={auth.setAuthForm}
                    profileForm={auth.profileForm}
                    setProfileForm={auth.setProfileForm}
                    authMessage={auth.authMessage}
                    setAuthMessage={auth.setAuthMessage}
                    authBusy={auth.authBusy}
                    onAuthSubmit={auth.onAuthSubmit}
                    onLogout={auth.onLogout}
                    onProfileSubmit={auth.onProfileSubmit}
                    onAvatarChange={auth.onAvatarChange}
                    navigate={navigate}
                />
            )}
        </ClientShell>
    );
}
