import React from "react";

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
    onLogout,
    onProfileSubmit
}) {
    return (
        <section id="auth">
            <h2 className="section-title">Login / Signup</h2>
            <article className="auth-wrap">
                {authUser ? (
                    <div className="auth-logged-in">
                        <p>Signed in as <b>{authUser.name}</b> (@{authUser.username})</p>
                        <form className="auth-form" onSubmit={onProfileSubmit}>
                            <label>
                                Name
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Your name"
                                    required
                                    disabled={authBusy}
                                />
                            </label>
                            <label>
                                Username
                                <input
                                    type="text"
                                    value={profileForm.username}
                                    onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                                    placeholder="Username (3-20 characters)"
                                    minLength={3}
                                    maxLength={20}
                                    required
                                    disabled={authBusy}
                                />
                            </label>
                            <label>
                                Email
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="name@example.com"
                                    required
                                    disabled={authBusy}
                                />
                            </label>
                            <label>
                                Current Password (only if changing password)
                                <input
                                    type="password"
                                    value={profileForm.currentPassword}
                                    onChange={(e) => setProfileForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="Current password"
                                    disabled={authBusy}
                                />
                            </label>
                            <label>
                                New Password (min 6 chars)
                                <input
                                    type="password"
                                    value={profileForm.newPassword}
                                    onChange={(e) => setProfileForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="Leave blank to keep current password"
                                    minLength={6}
                                    disabled={authBusy}
                                />
                            </label>
                            <button className="btn" type="submit" disabled={authBusy}>
                                {authBusy ? "Please wait..." : "Update Profile"}
                            </button>
                        </form>
                        <button className="btn-alt" type="button" onClick={onLogout} disabled={authBusy}>Logout</button>
                    </div>
                ) : (
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
                )}
                {authMessage && <p className="status-msg">{authMessage}</p>}
            </article>
        </section>
    );
}
