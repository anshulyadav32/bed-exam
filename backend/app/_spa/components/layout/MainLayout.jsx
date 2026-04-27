import React from "react";
import Header from "@shared/components/Header.jsx";
import Footer from "@shared/components/Footer.jsx";

/**
 * Shared layout component that wraps every page with a Header and Footer.
 */
export default function MainLayout({ children, lang, setLang, authUser, authToken, navigate, brand }) {
  return (
    <>
      <div className="blob one" />
      <div className="blob two" />

      <Header
        brand={brand}
        lang={lang}
        setLang={setLang}
        authUser={authUser}
        authToken={authToken}
        navigate={navigate}
      />

      <main className="container">
        {children}
      </main>

      <Footer navigate={navigate} />
    </>
  );
}
