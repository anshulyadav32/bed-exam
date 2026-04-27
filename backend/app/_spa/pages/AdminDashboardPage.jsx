import React, { useState, useEffect } from "react";
import { readJsonSafely } from "@shared/utils/api";
import { Skeleton, SkeletonCard } from "@shared/components/Skeleton";
import SecurityEventsPanel from "@shared/components/SecurityEventsPanel";

export default function AdminDashboardPage({ authToken, navigate }) {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAdminData() {
            setLoading(true);
            try {
                const [statsRes, usersRes, logsRes] = await Promise.all([
                    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${authToken}` } }),
                    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${authToken}` } }),
                    fetch("/api/admin/logs", { headers: { Authorization: `Bearer ${authToken}` } })
                ]);

                if (statsRes.status === 401 || usersRes.status === 401) {
                    setError("Unauthorized: Admin access required.");
                    return;
                }

                const statsData = await readJsonSafely(statsRes);
                const usersData = await readJsonSafely(usersRes);
                const logsData = await readJsonSafely(logsRes);

                setStats(statsData);
                setUsers(usersData);
                setLogs(logsData || []);
            } catch (err) {
                setError("Failed to connect to admin services.");
            } finally {
                setLoading(false);
            }
        }

        if (authToken) loadAdminData();
    }, [authToken]);

    if (error) return (
        <section className="container">
            <h2 className="section-title">Admin Dashboard</h2>
            <div className="content-box" style={{ border: '1px solid #ff4d4d', background: '#fffafa' }}>
                <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>{error}</p>
                <button className="btn" onClick={() => navigate("home")}>Go Home</button>
            </div>
        </section>
    );

    return (
        <section id="admin-dashboard" className="container">
            <h2 className="section-title">Admin Command Center</h2>
            
            {/* Stats Overview */}
            <div className="db-stats-row" style={{ marginBottom: '2rem' }}>
                {loading ? (
                    <>
                        <Skeleton style={{ height: '100px', borderRadius: '18px' }} />
                        <Skeleton style={{ height: '100px', borderRadius: '18px' }} />
                        <Skeleton style={{ height: '100px', borderRadius: '18px' }} />
                    </>
                ) : (
                    <>
                        <div className="db-stat-card" style={{ borderTop: '4px solid #3498db' }}>
                            <span className="db-stat-value" style={{ color: '#3498db' }}>{stats?.users || 0}</span>
                            <span className="db-stat-label">Registered Users</span>
                        </div>
                        <div className="db-stat-card" style={{ borderTop: '4px solid #9b59b6' }}>
                            <span className="db-stat-value" style={{ color: '#9b59b6' }}>{stats?.subjects || 0}</span>
                            <span className="db-stat-label">Active Subjects</span>
                        </div>
                        <div className="db-stat-card" style={{ borderTop: '4px solid #f1c40f' }}>
                            <span className="db-stat-value" style={{ color: '#f1c40f' }}>{stats?.scores || 0}</span>
                            <span className="db-stat-label">Total Mock Attempts</span>
                        </div>
                    </>
                )}
            </div>

            {/* User Management Table */}
            <h3 className="db-section-heading">User Directory</h3>
            <div className="db-scores-table">
                <div className="db-scores-head" style={{ gridTemplateColumns: '1fr 1fr 1fr 100px' }}>
                    <span>Name</span>
                    <span>Username</span>
                    <span>Email</span>
                    <span>Role</span>
                </div>
                {loading ? (
                    <div style={{ padding: '1rem' }}><SkeletonCard count={5} /></div>
                ) : (
                    users.map(u => (
                        <div className="db-scores-row" key={u.id} style={{ gridTemplateColumns: '1fr 1fr 1fr 100px' }}>
                            <span data-label="Name" style={{ fontWeight: '600' }}>{u.name}</span>
                            <span data-label="Username">@{u.username}</span>
                            <span data-label="Email">{u.email}</span>
                            <span data-label="Role">
                                <span className={`db-badge ${u.role === 'ADMIN' ? 'db-badge--done' : 'db-badge--pending'}`} style={{ fontSize: '0.7rem' }}>
                                    {u.role}
                                </span>
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Audit Logs */}
            <h3 className="db-section-heading" style={{ marginTop: '3rem' }}>Recent Security & System Logs</h3>
            <div className="db-scores-table">
                <div className="db-scores-head" style={{ gridTemplateColumns: '180px 150px 1fr' }}>
                    <span>Timestamp</span>
                    <span>Action</span>
                    <span>Details</span>
                </div>
                {loading ? (
                    <div style={{ padding: '1rem' }}><SkeletonCard count={3} /></div>
                ) : (
                    logs.map(log => (
                        <div className="db-scores-row" key={log.id} style={{ gridTemplateColumns: '180px 150px 1fr', fontSize: '0.85rem' }}>
                            <span data-label="Time">{new Date(log.createdAt).toLocaleString()}</span>
                            <span data-label="Action">
                                <code style={{ color: log.level === 'ERROR' ? '#e74c3c' : '#2980b9', fontWeight: 'bold' }}>{log.action}</code>
                            </span>
                            <span data-label="Metadata" style={{ fontFamily: 'monospace', opacity: 0.8 }}>
                                {log.metadata || "-"}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <SecurityEventsPanel authToken={authToken} />

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button className="btn" onClick={() => navigate("admin-users")}>User Directory</button>
                <button className="btn-alt" onClick={() => navigate("admin-subjects")}>Manage Subjects</button>
                <button className="btn-alt" onClick={() => navigate("admin-scores")}>Full Scoreboard</button>
            </div>
        </section>
    );
}
