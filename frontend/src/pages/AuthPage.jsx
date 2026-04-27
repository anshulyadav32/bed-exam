import React from "react";
import ProfileForm from "@shared/components/auth/ProfileForm.jsx";
import LoginSignupForm from "@shared/components/auth/LoginSignupForm.jsx";

export default function AuthPage({
    authUser,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    profileForm,
    setProfileForm,
    authMessage,
    setAuthMessage,
    authBusy,
    onAuthSubmit,
    onGoogleAuth,
    onGitHubAuth,
    onLogout,
    onProfileSubmit,
    authToken,
    onAvatarChange
}) {
    const isDev = typeof import.meta !== "undefined" ? Boolean(import.meta.env?.DEV) : false;

    return (
        <section id="auth">
            <h2 className="section-title">Login / Signup</h2>
            <article className="auth-wrap">
                {authUser ? (
                    <ProfileForm
                        authUser={authUser}
                        profileForm={profileForm}
                        setProfileForm={setProfileForm}
                        authBusy={authBusy}
                        onProfileSubmit={onProfileSubmit}
                        onLogout={onLogout}
                        onAvatarChange={onAvatarChange}
                        authToken={authToken}
                        isDev={isDev}
                    />
                ) : (
                    <LoginSignupForm
                        authMode={authMode}
                        setAuthMode={setAuthMode}
                        authForm={authForm}
                        setAuthForm={setAuthForm}
                        authBusy={authBusy}
                        onAuthSubmit={onAuthSubmit}
                        onGoogleAuth={onGoogleAuth}
                        onGitHubAuth={onGitHubAuth}
                        setAuthMessage={setAuthMessage}
                    />
                )}
                {authMessage && <p className="status-msg">{authMessage}</p>}
            </article>
        </section>
    );
}
