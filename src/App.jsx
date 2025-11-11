// src/App.jsx
import React, { useState } from "react";
import PoemView from "./PoemView";
import { englishPoems, urduPoems } from "./poems";

export default function App() {
  const [lang, setLang] = useState("english");
  const [showIntro, setShowIntro] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  const poemList = lang === "english" ? englishPoems : urduPoems;

  const latestId = poemList.length > 0 ? poemList[0].id : null;

  function openPoem(i) {
    setOpenIndex(i);
  }
  function closePoem() {
    setOpenIndex(null);
  }
  function prevPoem() {
    setOpenIndex((v) => Math.max(0, v - 1));
  }
  function nextPoem() {
    setOpenIndex((v) => Math.min(poemList.length - 1, v + 1));
  }

  return (
    <div className="site">
      {/* Intro overlay - fixed and fullscreen */}
      {showIntro && (
        <div className="intro-overlay" role="dialog" aria-modal="true">
          <div className="intro-inner">
            <h1 className="intro-title">Yapping Poetically</h1>
            <p className="intro-sub">every poem is my untold wound<br />everytime it's you who I write</p>
            <p className="intro-ig">- @sufiyaps_10</p>
            <button
              className="btn enter"
              onClick={() => {
                setShowIntro(false);
                // ensure no leftover scroll position
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }}
            >
              Enter
            </button>
          </div>
        </div>
      )}

      {/* Site header (shown under intro but intro covers it visually) */}
      <div className="site-header">
        <div className="logo">Yapping Poetically</div>

        <div className="controls">
          <div className="lang-switch">
            <button className={`pill ${lang === "english" ? "active" : ""}`} onClick={() => setLang("english")}>English</button>
            <button className={`pill ${lang === "urdu" ? "active" : ""}`} onClick={() => setLang("urdu")}>Urdu (roman)</button>
          </div>
          <div className="ig">@sufiyaps_10</div>
        </div>
      </div>

      <main className="main">
        <section className="grid poems-grid">
          {poemList.map((p, i) => (
            <article key={p.id} className="poem-card" onClick={() => openPoem(i)}>
              <h3 className="card-title">{p.title}</h3>
              <div className="card-sub">Click to read</div>
              {p.id === latestId && <span className="badge">Latest</span>}
            </article>
          ))}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-left">Yapping Poetically</div>
        <div className="footer-right">@sufiyaps_10</div>
      </footer>

      {openIndex !== null && (
        <PoemView
          poemList={poemList}
          currentIndex={openIndex}
          onClose={closePoem}
          onPrev={prevPoem}
          onNext={nextPoem}
        />
      )}
    </div>
  );
}
