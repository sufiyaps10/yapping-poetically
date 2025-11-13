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
  - Language buttons and Instagram handle moved below the search bar, centered.
  - Entire poem card is clickable.
  - ADDED: fadeKey state to trigger transition when changing poems.
  - UPDATED: The 'Back' button is now placed in the top-left corner of the poem card.
  - UPDATED: Navigation buttons moved to the left and right sides of the poem card as transparent arrows.
*/

const SITE_DEFAULT = "sepia"; 

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
  
  // NEW: Key to trigger CSS transition when content changes
  const [fadeKey, setFadeKey] = React.useState(0);

  // compute filtered list
  const filtered = React.useMemo(() => {
    return poems.filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase()));
  }, [poems, query]);

  // ensure each poem has theme property
  const poemsWithTheme = React.useMemo(() => {
    return poems.map(p => ({ ...p, theme: resolveTheme(p.title, p.theme) }));
  }, [poems]);

  // Calculate current poem index for navigation
  const currentIdx = openPoemId ? filtered.findIndex(f => f.id === openPoemId) : -1;
  const isFirstPoem = currentIdx === 0;
  const isLastPoem = currentIdx === filtered.length - 1;


  const openPoem = async (id) => {
    const p = poemsWithTheme.find(x => x.id === id);
    if (!p) return;
    setOpenPoemId(id);
    setError(null);
    setPoemText("");
    setLoading(true);
    // Increment fadeKey to trigger transition
    setFadeKey(k => k + 1);
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
    setFadeKey(0); // Reset key
  };

  const navigateRelative = async (delta) => {
    if (!openPoemId) return;
    const nextIdx = currentIdx + delta;
    if (nextIdx < 0 || nextIdx >= filtered.length) return;
    const nextId = filtered[nextIdx].id;
    
    // Before loading the next poem, increment the key for fade out
    setFadeKey(k => k + 1);
    
    // Increased timeout to 200ms (matches CSS transition) for smoother fade-out before loading new content
    setTimeout(() => {
      openPoem(nextId);
    }, 200); 
  };

  const goInstagram = () => {
    window.open("https://instagram.com/sufiyaps_10", "_blank");
  };

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">Yapping Poetically</div>

        <div className="controls">
          {/* Theme buttons remain in the header */}
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
        
        {/* NEW METADATA ROW BELOW SEARCH BAR */}
        <div className="metadata-row">
          <button 
            onClick={() => setLang("english")} 
            className={`lang-meta-btn ${lang === "english" ? "active" : ""}`}
          >
            English
          </button>
          <div className="insta-meta" onClick={goInstagram}>
            @sufiyaps_10
          </div>
          <button 
            onClick={() => setLang("urdu")} 
            className={`lang-meta-btn ${lang === "urdu" ? "active" : ""}`}
          >
            Urdu
          </button>
        </div>

        <section className="grid">
          {filtered.length === 0 && <div className="no-results">No poems found.</div>}
          {filtered.map((p) => (
            <article 
              className="card" 
              key={p.id} 
              onClick={() => openPoem(p.id)} 
              role="button" 
              tabIndex={0}
            >
              <h3 className="poem-title-click">{p.title}</h3>
              <div className="card-sub">
                <div className="read-under" role="button" tabIndex={-1}>
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
            
            {/* Back button remains in top-left */}
            <div className="poem-header-controls">
                <button className="btn small" onClick={closePoem}>← Back</button>
            </div>

            {/* Left navigation arrow (Previous) */}
            <button 
                className="nav-arrow left" 
                onClick={(e) => { e.stopPropagation(); navigateRelative(-1); }}
                disabled={isFirstPoem}
                aria-label="Previous Poem"
            >
                &lt;
            </button>


            <h2 className="poem-title">{(poems.find(x => x.id === openPoemId) || {}).title}</h2>

            <div className="poem-body">
              {loading && <div className="loading">Loading...</div>}
              {error && <div className="error">{error}</div>}
              {/* Added key={fadeKey} to force re-render and trigger transition */}
              {!loading && !error && <pre key={fadeKey} className="poem-text fade-transition">{poemText}</pre>}
            </div>

            {/* Right navigation arrow (Next) */}
            <button 
                className="nav-arrow right" 
                onClick={(e) => { e.stopPropagation(); navigateRelative(1); }}
                disabled={isLastPoem}
                aria-label="Next Poem"
            >
                &gt;
            </button>
            
            {/* The poem-footer is now removed */}
          </div>
        </div>
      )}

      <footer className="footer">© {new Date().getFullYear()} Yapping Poetically</footer>
    </div>
  );
}