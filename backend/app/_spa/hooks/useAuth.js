import { useState, useEffect } from "react";
import { readJsonSafely } from "../utils/api.js";

const AUTH_TOKEN_KEY = "bed_exam_auth_token";

export function useAuth() {
    const [authMode, setAuthMode] = useState("login");
    const [authUser, setAuthUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem(AUTH_TOKEN_KEY) || "";
    });
    const [authMessage, setAuthMessage] = useState("");
    const [authForm, setAuthForm] = useState({ name: "", username: "", email: "", password: "" });
    const [profileForm, setProfileForm] = useState({ name: "", username: "", email: "", currentPassword: "", newPassword: "" });
    const [authBusy, setAuthBusy] = useState(false);

    const tryRefresh = async () => {
        try {
            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({})
            });
            if (!res.ok) return null;
            const data = await readJsonSafely(res);
            return data?.accessToken || data?.token || null;
        } catch {
            return null;
        }
    };

    const loadAuthUser = async (token) => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            let res = await fetch("/api/auth/me", { headers, credentials: "include" });
            if (res.status === 401) {
                const refreshed = await tryRefresh();
                if (refreshed) {
                    setAuthToken(refreshed);
                    res = await fetch("/api/auth/me", {
                        headers: { Authorization: `Bearer ${refreshed}` },
                        credentials: "include"
                    });
                }
            }
            if (!res.ok) {
                if (typeof window !== "undefined") localStorage.removeItem(AUTH_TOKEN_KEY);
                setAuthToken("");
                setAuthUser(null);
                return;
            }
            const data = await res.json();
            setAuthUser(data.user || null);
        } catch {
            setAuthUser(null);
        }
    };

    useEffect(() => {
        if (authToken) {
            if (typeof window !== "undefined") localStorage.setItem(AUTH_TOKEN_KEY, authToken);
            loadAuthUser(authToken);
        } else {
            if (typeof window !== "undefined") localStorage.removeItem(AUTH_TOKEN_KEY);
            setAuthUser(null);
        }
    }, [authToken]);

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

    const onAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthMessage("");
        setAuthBusy(true);

        let payload;
        if (authMode === "signup") {
            payload = {
                name: authForm.name.trim(),
                username: authForm.username.trim(),
                email: authForm.email.trim(),
                password: authForm.password
            };
        } else {
            payload = {
                emailOrUsername: authForm.email.trim(),
                password: authForm.password
            };
        }

        const endpoint = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            const data = await readJsonSafely(res);
            if (!res.ok) { setAuthMessage(data.message || "Authentication failed."); return; }
            setAuthToken(data.accessToken || data.token || "");
            setAuthUser(data.user || null);
            setAuthForm({ name: "", username: "", email: authForm.email.trim(), password: "" });
            setAuthMessage(authMode === "signup" ? "Signup successful." : "Login successful.");
        } catch {
            setAuthMessage("Auth service is unavailable right now.");
        } finally {
            setAuthBusy(false);
        }
    };

    const onLogout = async () => {
        setAuthBusy(true);
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: { Authorization: authToken ? `Bearer ${authToken}` : "" },
                credentials: "include",
                keepalive: true
            });

            if (!res.ok) {
                setAuthMessage("Could not log out from the server. Try again.");
                return;
            }
            setAuthToken("");
            setAuthUser(null);
            setAuthMessage("Logged out.");
        } catch {
            setAuthMessage("Could not log out from the server. Try again.");
        } finally {
            setAuthBusy(false);
        }
    };

    const onProfileSubmit = async (e) => {
        e.preventDefault();
        if (!authToken) {
            setAuthMessage("Please login again.");
            return;
        }

        setAuthMessage("");
        setAuthBusy(true);
        try {
            let token = authToken;
            let res = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    name: profileForm.name.trim(),
                    username: profileForm.username.trim(),
                    email: profileForm.email.trim(),
                    currentPassword: profileForm.currentPassword,
                    newPassword: profileForm.newPassword
                })
            });

            if (res.status === 401) {
                const refreshed = await tryRefresh();
                if (refreshed) {
                    setAuthToken(refreshed);
                    token = refreshed;
                    res = await fetch("/api/auth/profile", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            name: profileForm.name.trim(),
                            username: profileForm.username.trim(),
                            email: profileForm.email.trim(),
                            currentPassword: profileForm.currentPassword,
                            newPassword: profileForm.newPassword
                        })
                    });
                }
            }

            const data = await readJsonSafely(res);
            if (!res.ok) {
                setAuthMessage(data?.message || "Could not update profile.");
                return;
            }

            setAuthUser(data?.user || null);
            setProfileForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
            setAuthMessage(data?.message || "Profile updated successfully.");
        } catch {
            setAuthMessage("Profile service is unavailable right now.");
        } finally {
            setAuthBusy(false);
        }
    };

    return {
        authMode,
        setAuthMode,
        authUser,
        authToken,
        authMessage,
        setAuthMessage,
        authForm,
        setAuthForm,
        profileForm,
        setProfileForm,
        authBusy,
        onAuthSubmit,
        onLogout,
        onProfileSubmit,
        onAvatarChange: (newAvatar) => {
            setAuthUser((prev) => prev ? { ...prev, avatarBase64: newAvatar } : prev);
        }
    };
}
