import React, { useEffect, useState } from "react";
import { englishPoems, urduPoems } from "./poems";
import PoemView from "./PoemView";

function ThemeButton({ onToggle, current }) {
  return (
    <button className="theme-btn" onClick={onToggle} title="Toggle theme">
      {current === "dark" ? "🌞" : "🌙"}
    </button>
  );
}

export default function App() {
  const [lang, setLang] = useState("urdu"); // default to urdu
  const [openIndex, setOpenIndex] = useState(null);
  const [introVisible, setIntroVisible] = useState(true);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const list = lang === "english" ? englishPoems : urduPoems;
  const latestId = list.length ? list[0].id : null;

  useEffect(() => {
    document.body.style.overflow = introVisible ? "hidden" : "";
  }, [introVisible]);

  function openPoem(i) { setOpenIndex(i); }
  function closePoem() { setOpenIndex(null); }
  function prevPoem() { setOpenIndex(v => (v > 0 ? v - 1 : v)); }
  function nextPoem() { setOpenIndex(v => (v < list.length - 1 ? v + 1 : v)); }

  return (
    <div className="site">
      {introVisible && (
        <div className="intro-overlay" role="dialog" aria-modal="true">
          {/* Intro is now minimal: transparent inner — looks like your second screenshot */}
          <div className="intro-inner minimal">
            <h1 className="intro-title large">Yapping Poetically</h1>
            <p className="intro-sub quote-italic">
              every poem is my untold wound<br />
              everytime it's you who I write
            </p>
            <p className="intro-ig">- @sufiyaps_10</p>
            <button className="enter-btn small" onClick={() => setIntroVisible(false)}>Enter</button>
          </div>
        </div>
      )}

      <header className="site-header">
        <div className="left">
          <div className="brand">Yapping Poetically</div>
        </div>

        <div className="right">
          <div className="lang-switch">
            <button className={`lang ${lang === "english" ? "active" : ""}`} onClick={() => setLang("english")}>English</button>
            <button className={`lang ${lang === "urdu" ? "active" : ""}`} onClick={() => setLang("urdu")}>Urdu (roman)</button>
          </div>

          <ThemeButton onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} current={theme} />
        </div>
      </header>

      <main className="main">
        <section className="cards-grid">
          {list.map((p, i) => (
            <article key={p.id} className="card" onClick={() => openPoem(i)} tabIndex={0}>
              <h3 className="card-title">{p.title}</h3>
              <div className="card-sub">Click to read</div>
              {p.id === latestId && <span className="badge">Latest</span>}
            </article>
          ))}
        </section>
      </main>

      <footer className="site-footer">
        <div>Yapping Poetically</div>
        <div className="ig">@sufiyaps_10</div>
      </footer>

      {openIndex !== null && (
        <PoemView poemList={list} currentIndex={openIndex} onClose={closePoem} onPrev={prevPoem} onNext={nextPoem} />
      )}
    </div>
  );
}
