// src/App.jsx
import React from "react";
import poemsData from "./poems"; // keep your poems.js
import "./index.css";

/*
  Changes in this version:
  - Default site theme = 'sepia'
  - Theme selector uses 3 buttons (Light / Dark / Sepia)
  - Clicking poem title (h3) opens poem (not only "Click to read")
  - Intro is shown first (showIntro default true) and locks page scroll until Enter pressed
*/

const SITE_DEFAULT = "sepia"; // changed default to sepia as requested

const ROMANTIC_TITLES = new Set([
  "Affection", "Affection pt2", "Her", "A Way", "As I Breathe", "Heart full of poems",
  "Chaand si haseen", "Manzar", "Kya tum sunogi"
]);
const SAD_TITLES = new Set([
  "Coward Poet", "Eleventh Hour", "Aakhir Kyun", "Kyu nahi", "Mukhtalif"
]);
const CHILL_TITLES = new Set([
  "If I Were To Write One Last Poem On You", "Rant Fest", "11th February", "Intezaar", "Untitled", "Yaad"
]);

function resolveTheme(title, explicit) {
  if (explicit) return explicit;
  if (ROMANTIC_TITLES.has(title)) return "romantic";
  if (SAD_TITLES.has(title)) return "sad";
  if (CHILL_TITLES.has(title)) return "chill";
  return "chill";
}

export default function App() {
  const [lang, setLang] = React.useState("english");
  const poems = React.useMemo(() => poemsData[lang] || [], [lang]);

  // Site theme state with persistence
  const [siteTheme, setSiteTheme] = React.useState(() => {
    try {
      return localStorage.getItem("site-theme") || SITE_DEFAULT;
    } catch {
      return SITE_DEFAULT;
    }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute("data-site-theme", siteTheme);
    try { localStorage.setItem("site-theme", siteTheme); } catch {}
  }, [siteTheme]);

  // Intro shown by default (first page)
  const [showIntro, setShowIntro] = React.useState(true);

  // Prevent background scroll while intro visible
  React.useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showIntro]);

  // Search
  const [query, setQuery] = React.useState("");

  // Poem modal state
  const [openPoemId, setOpenPoemId] = React.useState(null);
  const [poemText, setPoemText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // compute filtered list
  const filtered = React.useMemo(() => {
    return poems.filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase()));
  }, [poems, query]);

  // ensure each poem has theme property
  const poemsWithTheme = React.useMemo(() => {
    return poems.map(p => ({ ...p, theme: resolveTheme(p.title, p.theme) }));
  }, [poems]);

  const openPoem = async (id) => {
    const p = poemsWithTheme.find(x => x.id === id);
    if (!p) return;
    setOpenPoemId(id);
    setError(null);
    setPoemText("");
    setLoading(true);
    document.documentElement.setAttribute("data-theme-poem", p.theme || "chill");
    try {
      const res = await fetch(p.file, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch poem file");
      const txt = await res.text();
      setPoemText(txt.replace(/\r\n/g, "\n"));
    } catch (err) {
      console.error(err);
      setError("Could not load poem. Check the poem file path.");
    } finally {
      setLoading(false);
    }
  };

  const closePoem = () => {
    setOpenPoemId(null);
    setPoemText("");
    setError(null);
    document.documentElement.removeAttribute("data-theme-poem");
  };

  const navigateRelative = async (delta) => {
    if (!openPoemId) return;
    const currentIdx = filtered.findIndex(f => f.id === openPoemId);
    const nextIdx = currentIdx + delta;
    if (nextIdx < 0 || nextIdx >= filtered.length) return;
    const nextId = filtered[nextIdx].id;
    await openPoem(nextId);
  };

  const goInstagram = () => {
    window.open("https://instagram.com/sufiyaps_10", "_blank");
  };

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">Yapping Poetically</div>

        <div className="controls">
          <div className="lang-toggle">
            <button onClick={() => setLang("english")} className={lang === "english" ? "active" : ""}>English</button>
            <button onClick={() => setLang("urdu")} className={lang === "urdu" ? "active" : ""}>Urdu</button>
          </div>

          {/* Three aesthetic theme buttons */}
          <div className="theme-buttons">
            <button
              className={`theme-btn ${siteTheme === "light" ? "on" : ""}`}
              onClick={() => setSiteTheme("light")}
            >Light</button>
            <button
              className={`theme-btn ${siteTheme === "dark" ? "on" : ""}`}
              onClick={() => setSiteTheme("dark")}
            >Dark</button>
            <button
              className={`theme-btn ${siteTheme === "sepia" ? "on" : ""}`}
              onClick={() => setSiteTheme("sepia")}
            >Sepia</button>
          </div>

          <div className="insta" onClick={goInstagram}>@sufiyaps_10</div>
        </div>
      </header>

      {/* Intro - large centered, not scrollable until user enters */}
      {showIntro && (
        <div className="intro-wrap intro-large" role="dialog" aria-modal>
          <div className="intro-card">
            <h1 className="intro-title">Yapping Poetically</h1>
            <p className="intro-quote">every poem is my untold wound<br/>everytime it's you who I write</p>
            <div className="intro-handle" onClick={goInstagram}>- @sufiyaps_10</div>
            <div className="intro-actions">
              <button className="enter-btn" onClick={() => setShowIntro(false)}>Enter</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="search-row">
          <input
            placeholder="Search poems..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <section className="grid">
          {filtered.length === 0 && <div className="no-results">No poems found.</div>}
          {filtered.map((p) => (
            <article className="card" key={p.id}>
              {/* Title clickable to open poem */}
              <h3 className="poem-title-click" onClick={() => openPoem(p.id)}>{p.title}</h3>
              <div className="card-sub">
                {/* small "Click to read" kept visually but not required */}
                <div className="read-under" onClick={() => openPoem(p.id)} role="button" tabIndex={0}>
                  Click to read
                </div>
                {p.latest && <span className="badge">Latest</span>}
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* poem overlay/modal */}
      {openPoemId && (
        <div className="poem-overlay" onMouseDown={(e) => { if (e.target.classList.contains("poem-overlay")) closePoem(); }}>
          <div className="poem-card">
            <h2 className="poem-title">{(poems.find(x => x.id === openPoemId) || {}).title}</h2>

            <div className="poem-body">
              {loading && <div className="loading">Loading...</div>}
              {error && <div className="error">{error}</div>}
              {!loading && !error && <pre className="poem-text">{poemText}</pre>}
            </div>

            <div className="poem-footer">
              <div className="pager">
                <button className="btn small" onClick={() => navigateRelative(-1)}>← Previous</button>
                <button className="btn small" onClick={closePoem}>← Back</button>
                <button className="btn small" onClick={() => navigateRelative(1)}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">© {new Date().getFullYear()} Yapping Poetically</footer>
    </div>
  );
}
