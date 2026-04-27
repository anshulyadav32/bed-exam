import React from "react";

/**
 * Flexible Skeleton component for loading states.
 */
export function Skeleton({ className = "", style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function SkeletonCard({ count = 1 }) {
  return Array(count).fill(0).map((_, i) => (
    <div key={i} className="skeleton-card skeleton" style={{ marginBottom: "1rem" }} />
  ));
}

export function SkeletonText({ lines = 3 }) {
  return Array(lines).fill(0).map((_, i) => (
    <div key={i} className="skeleton-text skeleton" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
  ));
}

export function SkeletonSubject() {
    return (
        <div className="subject-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Skeleton className="skeleton-title" />
            <SkeletonText lines={2} />
        </div>
    );
}
