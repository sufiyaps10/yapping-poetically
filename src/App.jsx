// src/App.jsx
import React, { useEffect, useState } from "react";
import PoemView from "./PoemView";
import "./index.css"; // ensure css import

// replace or import your existing poem lists if you already have them
const poemsEnglish = [
  { title: "A Way", file: "A Way.txt" },
  { title: "Affection", file: "Affection.txt" },
  { title: "Affection pt2", file: "Affection pt2.txt" },
  { title: "Eleventh Hour", file: "Eleventh Hour.txt" },
  { title: "Heart Full Of Poems", file: "Heart Full Of Poems.txt" },
  { title: "If I Were To Write One Last Poem On You", file: "If I Were To Write One Last Poem On You.txt" },
  { title: "Rant Fest", file: "Rant Fest.txt" },
];

const poemsUrdu = [
  { title: "11th February", file: "11th February.txt" },
  { title: "Aakhir Kyun", file: "Aakhir Kyun.txt" },
  { title: "Chaand si haseen", file: "Chaand si haseen.txt" },
  { title: "Intezaar", file: "Intezaar.txt" },
  { title: "Kya tum sunogi", file: "Kya tum sunogi.txt" },
  { title: "Kyu nahi", file: "Kyu nahi.txt" },
  { title: "Manzar", file: "Manzar.txt" },
  { title: "Mukhtalif", file: "Mukhtalif.txt" },
  { title: "Yaad", file: "Yaad.txt" },
];

export default function App() {
  const [language, setLanguage] = useState("english");
  const [poems, setPoems] = useState(poemsEnglish);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // set poems depending on language
    setPoems(language === "english" ? poemsEnglish : poemsUrdu);
    setSelectedIndex(null);
  }, [language]);

  useEffect(() => {
    // prevent background scroll while intro visible
    if (showIntro) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [showIntro]);

  function openPoem(i) {
    setSelectedIndex(i);
  }

  function onPrev() {
    if (selectedIndex > 0) setSelectedIndex(s => s - 1);
  }
  function onNext() {
    if (selectedIndex < poems.length - 1) setSelectedIndex(s => s + 1);
  }

  return (
    <div className="site">
      {/* Intro overlay */}
      {showIntro && (
        <div className="intro-overlay" role="dialog" aria-modal="true">
          <div className="intro-card">
            <h1 className="intro-title">Yapping Poetically</h1>
            <p className="intro-quote">
              every poem is my untold wound<br />
              everytime it's you who I write
            </p>
            <p className="intro-ig">- @sufiyaps_10</p>
            <button
              className="btn enter"
              onClick={() => setShowIntro(false)}
              aria-label="Enter site"
            >
              Enter
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT (hidden visually while intro active) */}
      <div className={`main-wrap ${showIntro ? "hidden-while-intro" : ""}`}>
        <header className="site-header">
          <div className="brand">Yapping Poetically</div>
          <div className="lang-controls">
            <button className={`lang ${language === "english" ? "active" : ""}`} onClick={() => setLanguage("english")}>English</button>
            <button className={`lang ${language === "urdu" ? "active" : ""}`} onClick={() => setLanguage("urdu")}>Urdu (roman)</button>
          </div>
        </header>

        <main className="content">
          <section className="poems-grid">
            {poems.map((p, i) => (
              <article className="poem-card" key={i} onClick={() => openPoem(i)}>
                <h3>{p.title}</h3>
                <p className="meta">Click to read</p>
                {/* example: label latest if index 0 */}
                {i === 0 && <span className="badge">Latest</span>}
              </article>
            ))}
          </section>
        </main>
      </div>

      {/* Poem modal */}
      {selectedIndex !== null && (
        <PoemView
          language={language}
          poem={poems[selectedIndex]}
          index={selectedIndex}
          total={poems.length}
          onBack={() => setSelectedIndex(null)}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </div>
  );
}
