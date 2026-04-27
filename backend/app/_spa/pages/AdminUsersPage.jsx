import React, { useState, useEffect } from "react";
import { readJsonSafely } from "@shared/utils/api";
import { Skeleton, SkeletonCard } from "@shared/components/Skeleton";

export default function AdminUsersPage({ authToken, navigate }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            setLoading(true);
            try {
                const res = await fetch("/api/admin/users", {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                if (res.status === 401) {
                    setError("Unauthorized.");
                    return;
                }
                const data = await readJsonSafely(res);
                setUsers(data || []);
            } catch (err) {
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        }
        if (authToken) loadUsers();
    }, [authToken]);

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        setBusyId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role.");
            }
        } catch (err) {
            alert("Error updating role.");
        } finally {
            setBusyId(null);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`PERMANENTLY DELETE user @${username}? This cannot be undone.`)) return;

        setBusyId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${authToken}` }
            });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                alert("Failed to delete user.");
            }
        } catch (err) {
            alert("Error deleting user.");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className="container">
            <button className="btn-alt" onClick={() => navigate("admin")}>← Back to Dashboard</button>
            <h2 className="section-title">User Management</h2>

            {error && <p className="status-msg" style={{ color: 'red' }}>{error}</p>}

            <div className="db-scores-table">
                <div className="db-scores-head" style={{ gridTemplateColumns: '1fr 1fr 1.5fr 100px 200px' }}>
                    <span>Name</span>
                    <span>Username</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Actions</span>
                </div>
                {loading ? (
                    <div style={{ padding: '1rem' }}><SkeletonCard count={5} /></div>
                ) : (
                    users.map(u => (
                        <div className="db-scores-row" key={u.id} style={{ gridTemplateColumns: '1fr 1fr 1.5fr 100px 200px' }}>
                            <span data-label="Name" style={{ fontWeight: '600' }}>{u.name}</span>
                            <span data-label="Username">@{u.username}</span>
                            <span data-label="Email">{u.email}</span>
                            <span data-label="Role">
                                <span className={`db-badge ${u.role === 'ADMIN' ? 'db-badge--done' : 'db-badge--pending'}`}>
                                    {u.role}
                                </span>
                            </span>
                            <span data-label="Actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    className="btn-alt" 
                                    style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                                    onClick={() => handleRoleChange(u.id, u.role)}
                                    disabled={busyId === u.id}
                                >
                                    Toggle Role
                                </button>
                                <button 
                                    className="btn" 
                                    style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#e74c3c' }}
                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                    disabled={busyId === u.id}
                                >
                                    Delete
                                </button>
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
