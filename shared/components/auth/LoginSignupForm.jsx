import React from "react";
import { GoogleLogin } from "@react-oauth/google";

/**
 * Login / signup form shown when the user is not authenticated.
 * Displays a mode toggle (Login / Signup) and the appropriate form fields.
 */
export default function LoginSignupForm({
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    authBusy,
    onAuthSubmit,
    onGoogleAuth,
    setAuthMessage
}) {
    return (
        <>
            <div className="auth-switch">
                <button
                    type="button"
                    className={authMode === "login" ? "btn" : "btn-alt"}
                    disabled={authBusy}
                    onClick={() => { setAuthMode("login"); setAuthMessage(""); }}
                >Login</button>
                <button
                    type="button"
                    className={authMode === "signup" ? "btn" : "btn-alt"}
                    disabled={authBusy}
                    onClick={() => { setAuthMode("signup"); setAuthMessage(""); }}
                >Signup</button>
            </div>

            <form className="auth-form" onSubmit={onAuthSubmit}>
                {authMode === "signup" && (
                    <>
                        <label>
                            Name
                            <input
                                type="text"
                                value={authForm.name}
                                onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Your name"
                                required
                            />
                        </label>
                        <label>
                            Username
                            <input
                                type="text"
                                value={authForm.username}
                                onChange={(e) => setAuthForm((prev) => ({ ...prev, username: e.target.value }))}
                                placeholder="Your username"
                                required
                            />
                        </label>
                    </>
                )}
                <label>
                    {authMode === "signup" ? "Email" : "Email or Username"}
                    <input
                        type={authMode === "signup" ? "email" : "text"}
                        value={authForm.email}
                        onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder={authMode === "signup" ? "name@example.com" : "Email or username"}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={authForm.password}
                        onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Minimum 6 characters"
                        minLength={6}
                        required
                    />
                </label>
                <button className="btn" type="submit" disabled={authBusy}>
                    {authBusy ? <><span className="spinner" style={{ marginRight: '0.5rem', width: '16px', height: '16px' }}></span> Please wait...</> : authMode === "signup" ? "Create Account" : "Login"}
                </button>

                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            onGoogleAuth(credentialResponse.credential);
                        }}
                        onError={() => {
                            setAuthMessage("Google Login Failed");
                        }}
                        useOneTap
                        theme="filled_blue"
                        shape="pill"
                    />

                    <button
                        type="button"
                        className="btn-alt"
                        style={{ 
                            width: "100%", 
                            maxWidth: "240px", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            gap: "0.5rem",
                            fontSize: "0.9rem",
                            background: "#24292e",
                            color: "#fff"
                        }}
                        onClick={() => {
                            const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "";
                            if (!clientId) {
                                setAuthMessage("GitHub Client ID not configured.");
                                return;
                            }
                            const redirectUri = window.location.origin + window.location.pathname;
                            window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&redirect_uri=${encodeURIComponent(redirectUri)}`;
                        }}
                        disabled={authBusy}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Sign in with GitHub
                    </button>
                </div>
            </form>
        </>
    );
}
