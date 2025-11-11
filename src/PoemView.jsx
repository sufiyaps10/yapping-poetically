// src/PoemView.jsx
import React, { useEffect, useState, useRef } from "react";

export default function PoemView({ poemList, currentIndex, onClose, onPrev, onNext }) {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const mounted = useRef(true);

  // fetch poem whenever currentIndex changes
  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setText("");
    const file = poemList[currentIndex]?.file;
    if (!file) {
      setText("Poem not found.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error("Fetch failed");
        const txt = await res.text();
        if (cancelled) return;
        setText(txt);
      } catch (e) {
        if (!cancelled) setText("Could not load poem.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentIndex, poemList]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  return (
    <div className="poem-modal-overlay" role="dialog" aria-modal="true">
      <div className="poem-modal fade-in" aria-live="polite">
        <h2 className="poem-title">{poemList[currentIndex].title}</h2>

        <div className="poem-body" tabIndex={0}>
          {loading ? (
            <div className="poem-text poem-loading">Loading...</div>
          ) : (
            <div className="poem-text" style={{ whiteSpace: "pre-line" }}>
              {text}
            </div>
          )}
        </div>

        {/* sticky footer inside modal so it's always visible */}
        <div className="poem-footer sticky-footer">
          <button className="btn ghost" onClick={onPrev} disabled={currentIndex === 0}>
            ← Previous
          </button>

          <button className="btn ghost" onClick={onClose}>
            ← Back
          </button>

          <button className="btn primary" onClick={onNext} disabled={currentIndex === poemList.length - 1}>
            Next →
          </button>
        </div>

        <div className="modal-counter">{`${currentIndex + 1}/${poemList.length}`}</div>
      </div>
    </div>
  );
}
