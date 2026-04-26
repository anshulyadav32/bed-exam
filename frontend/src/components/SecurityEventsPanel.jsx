import React, { useCallback, useEffect, useMemo, useState } from "react";
import { readJsonSafely } from "../utils/api.js";

export default function SecurityEventsPanel({ authToken = "", enabled = false }) {
    const [events, setEvents] = useState([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [ipFilter, setIpFilter] = useState("");
    const [windowFilter, setWindowFilter] = useState("60");
    const [sortOrder, setSortOrder] = useState("newest");

    const loadEvents = useCallback(async () => {
        if (!enabled) return;
        setBusy(true);
        setError("");

        try {
            const res = await fetch("/api/security/events?limit=100", {
                method: "GET",
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                credentials: "include",
                cache: "no-store"
            });

            if (!res.ok) {
                const data = await readJsonSafely(res);
                setError(data?.message || "Could not load security events.");
                setEvents([]);
                return;
            }

            const data = await readJsonSafely(res);
            setEvents(Array.isArray(data?.events) ? data.events : []);
        } catch {
            setError("Could not load security events.");
            setEvents([]);
        } finally {
            setBusy(false);
        }
    }, [authToken, enabled]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const eventTypes = useMemo(() => {
        const set = new Set();
        for (const event of events) {
            if (event?.event) set.add(event.event);
        }
        return ["all", ...Array.from(set)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        const now = Date.now();
        const ipNeedle = ipFilter.trim().toLowerCase();
        const minutes = windowFilter === "all" ? null : Number(windowFilter);

        const filtered = events.filter((event) => {
            if (typeFilter !== "all" && event?.event !== typeFilter) return false;

            if (ipNeedle) {
                const ip = String(event?.ip || "").toLowerCase();
                if (!ip.includes(ipNeedle)) return false;
            }

            if (minutes !== null) {
                const timestamp = Date.parse(event?.at || "");
                if (!Number.isFinite(timestamp)) return false;
                const ageMs = now - timestamp;
                if (ageMs < 0 || ageMs > minutes * 60 * 1000) return false;
            }

            return true;
        });

        filtered.sort((a, b) => {
            const ta = Date.parse(a?.at || "") || 0;
            const tb = Date.parse(b?.at || "") || 0;
            return sortOrder === "newest" ? tb - ta : ta - tb;
        });

        return filtered;
    }, [events, typeFilter, ipFilter, windowFilter, sortOrder]);

    if (!enabled) return null;

    return (
        <section className="security-events-panel" aria-live="polite">
            <div className="security-events-panel__head">
                <h3>Security Events (Dev)</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        type="button"
                        className={sortOrder === "newest" ? "btn" : "btn-alt"}
                        onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                        title="Toggle sort order"
                    >
                        {sortOrder === "newest" ? "↓ Newest" : "↑ Oldest"}
                    </button>
                    <button type="button" className="btn-alt" onClick={loadEvents} disabled={busy}>
                        {busy ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            <div className="security-event-chips">
                {eventTypes.map((type) => (
                    <button
                        key={type}
                        type="button"
                        className={`security-event-chip${typeFilter === type ? " security-event-chip--active" : ""}`}
                        onClick={() => setTypeFilter(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="security-events-filters">
                <label>
                    Event
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        {eventTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Sort
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </label>
                <label>
                    IP contains
                    <input
                        type="text"
                        value={ipFilter}
                        onChange={(e) => setIpFilter(e.target.value)}
                        placeholder="127.0.0.1"
                    />
                </label>
                <label>
                    Time window
                    <select value={windowFilter} onChange={(e) => setWindowFilter(e.target.value)}>
                        <option value="15">Last 15 min</option>
                        <option value="60">Last 1 hour</option>
                        <option value="360">Last 6 hours</option>
                        <option value="1440">Last 24 hours</option>
                        <option value="all">All</option>
                    </select>
                </label>
            </div>

            <p className="muted-text">Showing {filteredEvents.length} of {events.length} events.</p>

            {error && <p className="status-msg">{error}</p>}
            {!error && filteredEvents.length === 0 && <p className="muted-text">No events match the current filters.</p>}

            {filteredEvents.length > 0 && (
                <div className="security-events-list" role="list">
                    {filteredEvents.map((event, index) => (
                        <article className="security-event-item" role="listitem" key={`${event.at || "no-time"}-${index}`}>
                            <p className="security-event-item__line">
                                <b>{event.event || "unknown_event"}</b> at {event.at || "unknown time"}
                            </p>
                            <p className="security-event-item__meta">
                                IP: {event.ip || "unknown"} | Agent: {event.userAgent || "unknown"}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
