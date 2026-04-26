import React from "react";
import { Route, Routes, Navigate, useSearchParams } from "react-router-dom";

import HomePage from "../pages/HomePage";
import SubjectsPage from "../pages/SubjectsPage";
import SubjectDetailPage from "../pages/SubjectDetailPage";
import AboutPage from "../pages/AboutPage";
import AuthPage from "../pages/AuthPage";
import MockTestPage from "../pages/MockTestPage";
import DashboardPage from "../pages/DashboardPage";
import ContactPage from "../pages/ContactPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";

import { SubjectDetailRoute } from "../hooks/useAppNavigate";

/**
 * Component that manages all application routes.
 */
export default function AppRoutes({
  auth,
  navigate,
  candidateName,
  setCandidateName,
  recentScores,
  statusMessage,
  loadRecentScores
}) {
  const [searchParams] = useSearchParams();
  const mockSubjectId = searchParams.get("subject") || "";

  return (
    <Routes>
      <Route path="/" element={<HomePage navigate={navigate} />} />
      <Route path="/subjects" element={<SubjectsPage navigate={navigate} />} />
      <Route
        path="/subjects/:subjectId"
        element={<SubjectDetailRoute SubjectDetailPage={SubjectDetailPage} navigate={navigate} />}
      />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/auth"
        element={(
          <AuthPage
            authUser={auth.authUser}
            authToken={auth.authToken}
            authMode={auth.authMode}
            setAuthMode={auth.setAuthMode}
            authForm={auth.authForm}
            setAuthForm={auth.setAuthForm}
            profileForm={auth.profileForm}
            setProfileForm={auth.setProfileForm}
            authMessage={auth.authMessage}
            setAuthMessage={auth.setAuthMessage}
            authBusy={auth.authBusy}
            onAuthSubmit={auth.onAuthSubmit}
            onGoogleAuth={auth.onGoogleAuth}
            onGitHubAuth={auth.onGitHubAuth}
            onLogout={auth.onLogout}
            onProfileSubmit={auth.onProfileSubmit}
            onAvatarChange={auth.onAvatarChange}
          />
        )}
      />
      <Route
        path="/mock-tests"
        element={(
          <MockTestPage
            candidateName={candidateName}
            setCandidateName={setCandidateName}
            recentScores={recentScores}
            statusMessage={statusMessage}
            loadRecentScores={loadRecentScores}
            navigate={navigate}
            subjectId={mockSubjectId}
          />
        )}
      />
      <Route
        path="/dashboard"
        element={(
          <DashboardPage
            authUser={auth.authUser}
            authToken={auth.authToken}
            navigate={navigate}
          />
        )}
      />
      <Route path="/contact" element={<ContactPage navigate={navigate} />} />
      <Route path="/privacy" element={<PrivacyPage navigate={navigate} />} />
      <Route path="/terms" element={<TermsPage navigate={navigate} />} />
      <Route
        path="/admin"
        element={(
          <AdminDashboardPage
            authUser={auth.authUser}
            authToken={auth.authToken}
            navigate={navigate}
          />
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
