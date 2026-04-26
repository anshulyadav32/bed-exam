import React from "react";

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
                                placeholder="Username (3-20 characters, no spaces)"
                                minLength={3}
                                maxLength={20}
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
                    {authBusy ? "Please wait..." : authMode === "signup" ? "Create Account" : "Login"}
                </button>
            </form>
        </>
    );
}
