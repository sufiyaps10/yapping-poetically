// src/PoemView.jsx
import React, { useEffect, useState, useRef } from "react";

export default function PoemView({ language, poem, index, total, onBack, onPrev, onNext }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const abortRef = useRef(null);
  const [key, setKey] = useState(0); // for fade-in

  useEffect(() => {
    if (!poem) return;
    setLoading(true);
    setText("");
    setKey(k => k + 1);

    // cancel previous if any
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch(e) {}
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const file = poem.file ?? poem.title; // poem.file should be exact filename (with extension)
    const basePath = `/poems/${language}/`;

    // build candidate filename variants (plain, encoded, underscores, lowercased)
    const candidates = [
      file,
      encodeURIComponent(file),
      file.replace(/\s+/g, "_"),
      encodeURIComponent(file.replace(/\s+/g, "_")),
      file.toLowerCase(),
      encodeURIComponent(file.toLowerCase()),
    ].filter((v, i, arr) => v && arr.indexOf(v) === i);

    (async () => {
      let succeeded = false;
      for (const cand of candidates) {
        if (!cand) continue;
        const url = basePath + cand;
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) {
            // show status in console; keep trying others
            console.warn(`Poem fetch ${url} -> ${res.status}`);
            continue;
          }
          const t = await res.text();
          setText(t);
          setLoading(false);
          succeeded = true;
          break;
        } catch (err) {
          if (err.name === "AbortError") {
            // aborted — exit quietly
            return;
          }
          console.warn("poem fetch error", url, err);
        }
      }

      if (!succeeded) {
        setText("Sorry — could not load this poem. Check console for fetch paths and errors.");
        setLoading(false);
      }
    })();

    return () => {
      try { controller.abort(); } catch (e) {}
      abortRef.current = null;
    };
  }, [poem, language]);

  return (
    <div className="poem-modal-overlay" role="dialog" aria-modal="true">
      <div className="poem-modal">
        <h2 className="poem-title">{poem?.title || "Untitled"}</h2>

        <div className={`poem-body fade-in`} key={key}>
          {loading ? (
            <div className="poem-loading">Loading...</div>
          ) : (
            <pre className="poem-text" aria-label={poem?.title}>{text}</pre>
          )}
        </div>

        <div className="poem-footer">
          <button
            className="btn ghost"
            onClick={() => { if (index > 0) onPrev(); }}
            disabled={index === 0}
            aria-disabled={index === 0}
          >
            ← Previous
          </button>

          <button className="btn primary" onClick={onBack}>← Back</button>

          <button
            className="btn ghost"
            onClick={() => { if (index < total - 1) onNext(); }}
            disabled={index >= total - 1}
            aria-disabled={index >= total - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
