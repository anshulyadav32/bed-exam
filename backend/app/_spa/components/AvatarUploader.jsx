import React, { useRef, useState } from "react";
import { fileToDataUrl, resizeAndCrop, applyAnimeFilter } from "../utils/imageUtils";

const ACCEPTED = "image/jpeg,image/png,image/webp";

/**
 * AvatarUploader — profile picture widget with optional anime-style recreation.
 *
 * Props:
 *  - currentAvatar  {string|null}  existing avatarBase64 data URL
 *  - authToken      {string}       JWT for Authorization header
 *  - onAvatarChange {Function}     called with the new data URL after save
 *  - disabled       {boolean}
 */
export default function AvatarUploader({ currentAvatar, authToken, onAvatarChange, disabled }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(currentAvatar || null);
    const [animePreview, setAnimePreview] = useState(null);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState("");
    const [activeTab, setActiveTab] = useState("original"); // "original" | "anime"

    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

    // ── File selection ────────────────────────────────────────────────────────

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setStatus("Please select a JPEG, PNG, or WebP image.");
            return;
        }

        setStatus("");
        setBusy(true);
        try {
            const raw = await fileToDataUrl(file);
            const cropped = await resizeAndCrop(raw);
            setPreview(cropped);
            setAnimePreview(null); // reset anime version when a new photo is picked
            setActiveTab("original");
        } catch {
            setStatus("Could not read the image. Try another file.");
        } finally {
            setBusy(false);
        }
    }

    // ── Anime generation ──────────────────────────────────────────────────────

    async function handleGenerateAnime() {
        if (!preview) return;
        setBusy(true);
        setStatus("");
        try {
            const result = await applyAnimeFilter(preview);
            setAnimePreview(result);
            setActiveTab("anime");
        } catch {
            setStatus("Anime filter failed. Try again.");
        } finally {
            setBusy(false);
        }
    }

    // ── Save ──────────────────────────────────────────────────────────────────

    async function handleSave() {
        const toSave = activeTab === "anime" && animePreview ? animePreview : preview;
        if (!toSave) return;

        setBusy(true);
        setStatus("");
        try {
            const res = await fetch("/api/auth/avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...headers },
                credentials: "include",
                body: JSON.stringify({ avatarBase64: toSave })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setStatus(data?.message || "Could not save avatar."); return; }
            setStatus("Avatar saved!");
            onAvatarChange?.(toSave);
        } catch {
            setStatus("Network error. Try again.");
        } finally {
            setBusy(false);
        }
    }

    // ── Remove ────────────────────────────────────────────────────────────────

    async function handleRemove() {
        setBusy(true);
        setStatus("");
        try {
            const res = await fetch("/api/auth/avatar", {
                method: "DELETE",
                headers,
                credentials: "include"
            });
            if (!res.ok) { setStatus("Could not remove avatar."); return; }
            setPreview(null);
            setAnimePreview(null);
            setStatus("Avatar removed.");
            onAvatarChange?.(null);
        } catch {
            setStatus("Network error. Try again.");
        } finally {
            setBusy(false);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    const displaySrc = activeTab === "anime" && animePreview ? animePreview : preview;

    return (
        <div className="avatar-uploader">
            {/* Avatar display */}
            <div className="avatar-uploader__display">
                {displaySrc ? (
                    <img
                        src={displaySrc}
                        alt="Profile avatar"
                        className="avatar-uploader__img"
                    />
                ) : (
                    <div className="avatar-uploader__placeholder" aria-label="No avatar">
                        <span>?</span>
                    </div>
                )}
            </div>

            {/* Tab switcher (only shown when both versions exist) */}
            {preview && animePreview && (
                <div className="avatar-tabs">
                    <button
                        type="button"
                        className={activeTab === "original" ? "avatar-tab avatar-tab--active" : "avatar-tab"}
                        onClick={() => setActiveTab("original")}
                    >Original</button>
                    <button
                        type="button"
                        className={activeTab === "anime" ? "avatar-tab avatar-tab--active" : "avatar-tab"}
                        onClick={() => setActiveTab("anime")}
                    >Anime</button>
                </div>
            )}

            {/* Action buttons */}
            <div className="avatar-uploader__actions">
                <button
                    type="button"
                    className="btn-alt"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy || disabled}
                >
                    {preview ? "Change Photo" : "Upload Photo"}
                </button>

                {preview && (
                    <button
                        type="button"
                        className="btn-alt"
                        onClick={handleGenerateAnime}
                        disabled={busy || disabled}
                        title="Recreate your photo in anime / cartoon style"
                    >
                        {busy ? "Processing..." : "✦ Anime Style"}
                    </button>
                )}

                {displaySrc && (
                    <button
                        type="button"
                        className="btn"
                        onClick={handleSave}
                        disabled={busy || disabled}
                    >
                        Save Avatar
                    </button>
                )}

                {(preview || currentAvatar) && (
                    <button
                        type="button"
                        className="btn-alt btn--danger"
                        onClick={handleRemove}
                        disabled={busy || disabled}
                    >
                        Remove
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {status && (
                <p className={`avatar-uploader__status${status.includes("saved") ? " avatar-uploader__status--ok" : ""}`}>
                    {status}
                </p>
            )}
        </div>
    );
}
