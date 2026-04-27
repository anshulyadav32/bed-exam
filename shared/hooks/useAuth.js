import { useState, useEffect, useCallback } from "react";
import { readJsonSafely } from "@shared/utils/api.js";
import * as api from "@shared/utils/authApi.js";

const ACCESS_TOKEN_KEY = "bed_exam_auth_token";

/**
 * Modular Hook: useAuth
 * Handles authentication state and provides handlers for login, signup, profile updates, and logout.
 */
export function useAuth() {
    const [authMode, setAuthMode] = useState("login");
    const [authUser, setAuthUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
        }
        return "";
    });
    const [authMessage, setAuthMessage] = useState("");
    const [authForm, setAuthForm] = useState({ name: "", username: "", email: "", password: "" });
    const [profileForm, setProfileForm] = useState({ name: "", username: "", email: "", currentPassword: "", newPassword: "" });
    const [authBusy, setAuthBusy] = useState(false);

    // Persist token
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (authToken) localStorage.setItem(ACCESS_TOKEN_KEY, authToken);
            else localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
    }, [authToken]);

    const clearAuth = useCallback(() => {
        setAuthToken("");
        setAuthUser(null);
    }, []);

    /** ── Session Management ──────────────────────────────────── */

    const tryRefresh = useCallback(async () => {
        try {
            const res = await api.refreshSession();
            if (!res.ok) return null;
            const data = await res.json();
            return data?.accessToken || data?.token || null;
        } catch { return null; }
    }, []);

    const loadAuthUser = useCallback(async (token) => {
        try {
            let res = await api.fetchMe(token);

            if (res.status === 401) {
                const newAccessToken = await tryRefresh();
                if (newAccessToken) {
                    setAuthToken(newAccessToken);
                    res = await api.fetchMe(newAccessToken);
                }
            }

            if (!res.ok) { clearAuth(); return; }
            const data = await res.json();
            setAuthUser(data.user || null);
        } catch { setAuthUser(null); }
    }, [tryRefresh, clearAuth]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            loadAuthUser(authToken);

            // Capture GitHub OAuth code if present
            const params = new URLSearchParams(window.location.hash.split("?")[1] || window.location.search);
            const code = params.get("code");
            if (code && !authUser) {
                onGitHubAuth(code);
                // Clear code from URL
                window.history.replaceState({}, document.title, window.location.pathname + window.location.hash.split("?")[0]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!authUser) {
            setProfileForm({ name: "", username: "", email: "", currentPassword: "", newPassword: "" });
            return;
        }
        setProfileForm((prev) => ({
            ...prev,
            name: authUser.name || "",
            username: authUser.username || "",
            email: authUser.email || ""
        }));
    }, [authUser]);

    /** ── Handlers ────────────────────────────────────────────── */

    const onAuthSubmit = async (e) => {
        if (e) e.preventDefault();
        setAuthMessage("");
        setAuthBusy(true);

        const isSignup = authMode === "signup";
        const payload = isSignup 
            ? { name: authForm.name.trim(), username: authForm.username.trim(), email: authForm.email.trim(), password: authForm.password }
            : { emailOrUsername: authForm.email.trim(), password: authForm.password };

        try {
            const res = isSignup ? await api.signupUser(payload) : await api.loginUser(payload);
            const data = await readJsonSafely(res);
            
            if (!res.ok) { 
                setAuthMessage(data?.message || "Authentication failed."); 
                return; 
            }

            const newAccessToken = data?.accessToken || data?.token || "";
            setAuthToken(newAccessToken);
            setAuthUser(data?.user || null);
            setAuthForm({ name: "", username: "", email: authForm.email.trim(), password: "" });
            setAuthMessage(isSignup ? "Signup successful." : "Login successful.");
        } catch {
            setAuthMessage("Auth service is unavailable.");
        } finally {
            setAuthBusy(false);
        }
    };

    const onGoogleAuth = async (credential) => {
        setAuthMessage("");
        setAuthBusy(true);
        try {
            const res = await api.googleLogin(credential);
            const data = await readJsonSafely(res);
            if (!res.ok) { 
                setAuthMessage(data?.message || "Google authentication failed."); 
                return; 
            }
            setAuthToken(data?.accessToken || data?.token || "");
            setAuthUser(data?.user || null);
            setAuthMessage("Signed in with Google.");
        } catch {
            setAuthMessage("Google Auth service is unavailable.");
        } finally {
            setAuthBusy(false);
        }
    };

    const onGitHubAuth = async (code) => {
        setAuthMessage("");
        setAuthBusy(true);
        try {
            const res = await api.githubLogin(code);
            const data = await readJsonSafely(res);
            if (!res.ok) { 
                setAuthMessage(data?.message || "GitHub authentication failed."); 
                return; 
            }
            setAuthToken(data?.accessToken || data?.token || "");
            setAuthUser(data?.user || null);
            setAuthMessage("Signed in with GitHub.");
        } catch {
            setAuthMessage("GitHub Auth service is unavailable.");
        } finally {
            setAuthBusy(false);
        }
    };

    const onLogout = async () => {
        setAuthBusy(true);
        try {
            await api.logoutUser();
            clearAuth();
            setAuthMessage("Logged out.");
        } catch {
            setAuthMessage("Logout failed.");
        } finally {
            setAuthBusy(false);
        }
    };

    const onProfileSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!authToken) { setAuthMessage("Please login again."); return; }
        setAuthMessage("");
        setAuthBusy(true);

        try {
            const payload = {
                name: profileForm.name.trim(),
                username: profileForm.username.trim(),
                email: profileForm.email.trim(),
                currentPassword: profileForm.currentPassword,
                newPassword: profileForm.newPassword
            };

            let res = await api.updateProfile(authToken, payload);

            if (res.status === 401) {
                const newAccessToken = await tryRefresh();
                if (newAccessToken) {
                    setAuthToken(newAccessToken);
                    res = await api.updateProfile(newAccessToken, payload);
                }
            }

            const data = await readJsonSafely(res);
            if (!res.ok) { setAuthMessage(data?.message || "Update failed."); return; }
            setAuthUser(data?.user || null);
            setProfileForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
            setAuthMessage(data?.message || "Profile updated.");
        } catch {
            setAuthMessage("Profile service is unavailable.");
        } finally {
            setAuthBusy(false);
        }
    };

    return {
        authMode, setAuthMode,
        authUser, authToken,
        authMessage, setAuthMessage,
        authForm, setAuthForm,
        profileForm, setProfileForm,
        authBusy,
        onAuthSubmit, onGoogleAuth, onGitHubAuth, onLogout, onProfileSubmit,
        onAvatarChange: (newAvatar) => {
            setAuthUser((prev) => prev ? { ...prev, avatarBase64: newAvatar } : prev);
        }
    };
}
