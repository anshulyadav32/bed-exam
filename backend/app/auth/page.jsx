"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ClientShell from "../_shell";
import AuthPage from "../_spa/pages/AuthPage";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";

export default function Page() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                        onGoogleAuth={auth.onGoogleAuth}
                        onGitHubAuth={auth.onGitHubAuth}
                        onLogout={auth.onLogout}
                        onProfileSubmit={auth.onProfileSubmit}
                        onAvatarChange={auth.onAvatarChange}
                        navigate={navigate}
                    />
                )}
            </ClientShell>
        </GoogleOAuthProvider>
    );
}
