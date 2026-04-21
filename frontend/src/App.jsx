import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";

import { text } from "./data/text";
import { useAuth } from "./hooks/useAuth";
import { useScores } from "./hooks/useScores";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import MockTestPage from "./pages/MockTestPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

function SubjectDetailRoute({ navigate }) {
  const { subjectId: paramSubjectId = "" } = useParams();
  const hashSubjectId = window.location.hash.split("/").pop()?.split("?")[0] || "";
  const subjectId = (paramSubjectId || hashSubjectId || "").trim().toLowerCase();

  return <SubjectDetailPage subjectId={subjectId} navigate={navigate} />;
}

function AppRoutes() {
  const [lang, setLang] = useState("en");
  const [candidateName, setCandidateName] = useState("");

  const content = text[lang];
  const auth = useAuth();
  const { recentScores, statusMessage, loadRecentScores } = useScores();
  const routerNavigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mockSubjectId = searchParams.get("subject") || "";

  useEffect(() => {
    if (auth.authUser && !candidateName) {
      setCandidateName(auth.authUser.name || "");
    }
  }, [auth.authUser, candidateName]);

  useEffect(() => {
    loadRecentScores();
  }, [loadRecentScores]);

  const navigate = (page, nextSubjectId = null) => {
    const routes = {
      home: "/",
      subjects: "/subjects",
      about: "/about",
      auth: "/auth",
      contact: "/contact",
      privacy: "/privacy",
      terms: "/terms"
    };

    if (page === "subject-detail") {
      routerNavigate(nextSubjectId ? `/subjects/${nextSubjectId}` : "/subjects");
      return;
    }

    if (page === "mock-tests") {
      routerNavigate(nextSubjectId ? `/mock-tests?subject=${nextSubjectId}` : "/mock-tests");
      return;
    }

    routerNavigate(routes[page] || "/");
  };

  return (
    <>
      <div className="blob one" />
      <div className="blob two" />

      <Header
        brand={content.brand}
        lang={lang}
        setLang={setLang}
        authUser={auth.authUser}
        navigate={navigate}
      />

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage navigate={navigate} />} />
          <Route path="/subjects" element={<SubjectsPage navigate={navigate} />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetailRoute navigate={navigate} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/auth"
            element={(
              <AuthPage
                authUser={auth.authUser}
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
                onLogout={auth.onLogout}
                onProfileSubmit={auth.onProfileSubmit}
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
          <Route path="/contact" element={<ContactPage navigate={navigate} />} />
          <Route path="/privacy" element={<PrivacyPage navigate={navigate} />} />
          <Route path="/terms" element={<TermsPage navigate={navigate} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer navigate={navigate} />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
