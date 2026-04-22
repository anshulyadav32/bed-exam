import { useState, useEffect, useCallback } from "react";

const ACCESS_TOKEN_KEY  = "bed_exam_auth_token";    // JWT access token (15 min)
const REFRESH_TOKEN_KEY = "bed_exam_refresh_token"; // Opaque refresh token (7 days)

async function readJsonSafely(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    try { return await response.json(); } catch { return null; }
}

export function useAuth() {
    const [authMode, setAuthMode] = useState("login");
    const [authUser, setAuthUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_KEY) || "");
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(REFRESH_TOKEN_KEY) || "");
    const [authMessage, setAuthMessage] = useState("");
    const [authForm, setAuthForm] = useState({ name: "", username: "", email: "", password: "" });
    const [profileForm, setProfileForm] = useState({ name: "", username: "", email: "", currentPassword: "", newPassword: "" });
    const [authBusy, setAuthBusy] = useState(false);

    // Persist tokens to localStorage whenever they change
    useEffect(() => {
        if (authToken) localStorage.setItem(ACCESS_TOKEN_KEY, authToken);
        else localStorage.removeItem(ACCESS_TOKEN_KEY);
    }, [authToken]);

    useEffect(() => {
        if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        else localStorage.removeItem(REFRESH_TOKEN_KEY);
    }, [refreshToken]);

    /** Try to get a new access token using the stored refresh token. */
    const tryRefresh = useCallback(async (currentRefreshToken) => {
        if (!currentRefreshToken) return null;
        try {
            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: currentRefreshToken })
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data?.accessToken || null;
        } catch {
            return null;
        }
    }, []);

    const clearAuth = useCallback(() => {
        setAuthToken("");
        setRefreshToken("");
        setAuthUser(null);
    }, []);

    const loadAuthUser = useCallback(async (token, currentRefreshToken) => {
        if (!token) { setAuthUser(null); return; }
        try {
            let res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });

            // Access token expired — try to refresh
            if (res.status === 401 && currentRefreshToken) {
                const newAccessToken = await tryRefresh(currentRefreshToken);
                if (newAccessToken) {
                    setAuthToken(newAccessToken);
                    res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${newAccessToken}` } });
                }
            }

            if (!res.ok) { clearAuth(); return; }
            const data = await res.json();
            setAuthUser(data.user || null);
        } catch {
            setAuthUser(null);
        }
    }, [tryRefresh, clearAuth]);

    useEffect(() => {
        if (authToken) loadAuthUser(authToken, refreshToken);
        else setAuthUser(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only on mount — token changes handle subsequent updates

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
                body: JSON.stringify(payload)
            });
            const data = await readJsonSafely(res);
            if (!res.ok) { setAuthMessage(data?.message || "Authentication failed."); return; }

            const newAccessToken = data?.accessToken || "";
            const newRefreshToken = data?.refreshToken || "";
            setAuthToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            setAuthUser(data?.user || null);
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
            if (refreshToken) {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                    keepalive: true
                });
            }
            clearAuth();
            setAuthMessage("Logged out.");
        } catch {
            setAuthMessage("Could not log out from the server. Try again.");
        } finally {
            setAuthBusy(false);
        }
    };

    const onProfileSubmit = async (e) => {
        e.preventDefault();
        if (!authToken) { setAuthMessage("Please login again."); return; }
        setAuthMessage("");
        setAuthBusy(true);
        try {
            let token = authToken;
            let res = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: profileForm.name.trim(),
                    username: profileForm.username.trim(),
                    email: profileForm.email.trim(),
                    currentPassword: profileForm.currentPassword,
                    newPassword: profileForm.newPassword
                })
            });

            // Retry once after refresh if access token expired
            if (res.status === 401 && refreshToken) {
                const newAccessToken = await tryRefresh(refreshToken);
                if (newAccessToken) {
                    setAuthToken(newAccessToken);
                    token = newAccessToken;
                    res = await fetch("/api/auth/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
            if (!res.ok) { setAuthMessage(data?.message || "Could not update profile."); return; }
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
        onProfileSubmit
    };
}
