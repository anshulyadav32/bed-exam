import React, { useState, useEffect } from "react";
import { readJsonSafely } from "@shared/utils/api";
import { Skeleton, SkeletonCard } from "@shared/components/Skeleton";

export default function AdminSubjectsPage({ authToken, navigate }) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: "", name: "", description: "", color: "#3498db" });

    useEffect(() => {
        async function loadSubjects() {
            setLoading(true);
            try {
                const res = await fetch("/api/subjects"); // Use public API for list
                const data = await readJsonSafely(res);
                setSubjects(data || []);
            } catch (err) {
                setError("Failed to load subjects.");
            } finally {
                setLoading(false);
            }
        }
        loadSubjects();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing ? `/api/admin/subjects/${formData.id}` : "/api/admin/subjects";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const saved = await readJsonSafely(res);
                if (isEditing) {
                    setSubjects(prev => prev.map(s => s.id === saved.id ? saved : s));
                } else {
                    setSubjects(prev => [...prev, saved]);
                }
                setFormData({ id: "", name: "", description: "", color: "#3498db" });
                setIsEditing(false);
            } else {
                alert("Save failed.");
            }
        } catch (err) {
            alert("Error saving subject.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Delete subject ${id}? All associated sections will be lost.`)) return;
        try {
            const res = await fetch(`/api/admin/subjects/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${authToken}` }
            });
            if (res.ok) {
                setSubjects(prev => prev.filter(s => s.id !== id));
            }
        } catch (err) {
            alert("Delete failed.");
        }
    };

    return (
        <section className="container">
            <button className="btn-alt" onClick={() => navigate("admin")}>← Back to Dashboard</button>
            <h2 className="section-title">Subject Management</h2>

            <div className="content-box" style={{ marginBottom: '2rem' }}>
                <h3>{isEditing ? "Edit Subject" : "Create New Subject"}</h3>
                <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <label>
                        ID (slug)
                        <input type="text" value={formData.id} disabled={isEditing} onChange={e => setFormData({...formData, id: e.target.value})} required />
                    </label>
                    <label>
                        Name
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </label>
                    <label style={{ gridColumn: 'span 2' }}>
                        Description
                        <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </label>
                    <label>
                        Theme Color
                        <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                    </label>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button className="btn" type="submit">{isEditing ? "Update Subject" : "Create Subject"}</button>
                        {isEditing && <button className="btn-alt" type="button" onClick={() => { setIsEditing(false); setFormData({ id: "", name: "", description: "", color: "#3498db" }); }}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="db-scores-table">
                <div className="db-scores-head" style={{ gridTemplateColumns: '80px 1.5fr 2fr 100px 150px' }}>
                    <span>ID</span>
                    <span>Name</span>
                    <span>Description</span>
                    <span>Color</span>
                    <span>Actions</span>
                </div>
                {loading ? (
                    <SkeletonCard count={4} />
                ) : (
                    subjects.map(s => (
                        <div className="db-scores-row" key={s.id} style={{ gridTemplateColumns: '80px 1.5fr 2fr 100px 150px' }}>
                            <span data-label="ID"><code>{s.id}</code></span>
                            <span data-label="Name" style={{ fontWeight: 600 }}>{s.name}</span>
                            <span data-label="Desc" style={{ fontSize: '0.8rem', opacity: 0.8 }}>{s.description}</span>
                            <span data-label="Color"><div style={{ width: '20px', height: '20px', borderRadius: '4px', background: s.color }}></div></span>
                            <span data-label="Actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-alt" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => { setIsEditing(true); setFormData(s); }}>Edit</button>
                                <button className="btn" style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#e74c3c' }} onClick={() => handleDelete(s.id)}>Delete</button>
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
