import React, { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";

import { text } from "@shared/data/text.js";
import { useAuth } from "@shared/hooks/useAuth.js";
import { useScores } from "@shared/hooks/useScores.js";
import { useAppNavigate } from "./hooks/useAppNavigate";

import MainLayout from "./components/layout/MainLayout";
import AppRoutes from "./routes/AppRoutes";

/**
 * Main application entry point.
 * Coordinates shared state (auth, scores, language) and delegates layout and routing.
 */
function AppContent() {
  const [lang, setLang] = useState("en");
  const [candidateName, setCandidateName] = useState("");

  const content = text[lang];
  const auth = useAuth();
  const { recentScores, statusMessage, loadRecentScores } = useScores();
  const navigate = useAppNavigate();

  // Keep candidate name in sync with authenticated user
  useEffect(() => {
    if (auth.authUser && !candidateName) {
      setCandidateName(auth.authUser.name || "");
    }
  }, [auth.authUser, candidateName]);

  // Initial data load
  useEffect(() => {
    loadRecentScores();
  }, [loadRecentScores]);

  return (
    <MainLayout
      brand={content.brand}
      lang={lang}
      setLang={setLang}
      authUser={auth.authUser}
      authToken={auth.authToken}
      onAuthSubmit={auth.onAuthSubmit}
      onGoogleAuth={auth.onGoogleAuth}
      onGitHubAuth={auth.onGitHubAuth}
      onLogout={auth.onLogout}
      navigate={navigate}
    >
      <AppRoutes
        auth={auth}
        navigate={navigate}
        candidateName={candidateName}
        setCandidateName={setCandidateName}
        recentScores={recentScores}
        statusMessage={statusMessage}
        loadRecentScores={loadRecentScores}
      />
    </MainLayout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
