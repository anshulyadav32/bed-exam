import React from "react";
import SecurityEventsPanel from "../SecurityEventsPanel";
import AvatarUploader from "../AvatarUploader";

/**
 * Profile editing form shown when the user is already authenticated.
 * Handles name/username/email update and optional password change.
 */
export default function ProfileForm({
    authUser,
    profileForm,
    setProfileForm,
    authBusy,
    onProfileSubmit,
    onLogout,
    onAvatarChange,
    authToken,
    isDev
}) {
    return (
        <div className="auth-logged-in">
            <div className="profile-header">
                <AvatarUploader
                    currentAvatar={authUser.avatarBase64 || null}
                    authToken={authToken}
                    onAvatarChange={onAvatarChange}
                    disabled={authBusy}
                />
                <p className="profile-header__name">
                    <b>{authUser.name}</b>
                    <span className="profile-header__username">@{authUser.username}</span>
                </p>
            </div>

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

            <button className="btn-alt" type="button" onClick={onLogout} disabled={authBusy}>
                Logout
            </button>

            <SecurityEventsPanel authToken={authToken} enabled={Boolean(authUser) && isDev} />
        </div>
    );
}
