import { useEffect, useState } from "react";

/**
 * useSubjects — fetches the subjects list from /api/subjects
 * Returns: { subjects: Array, loading: boolean, error: string|null }
 */
export function useSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch("/api/subjects")
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setSubjects(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Failed to load subjects");
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, []);

    return { subjects, loading, error };
}

/**
 * useSubjectDetail — fetches full detail for a single subject from /api/subjects/:id
 * Returns: { subject: Object|null, loading: boolean, error: string|null }
 */
export function useSubjectDetail(subjectId) {
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!subjectId) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);
        setSubject(null);

        fetch(`/api/subjects/${encodeURIComponent(subjectId)}`)
            .then((r) => {
                if (r.status === 404) return null;
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setSubject(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Failed to load subject");
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [subjectId]);

    return { subject, loading, error };
}
