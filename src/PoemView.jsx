import React, { useEffect, useState } from "react";

export default function PoemView({ poemList, currentIndex, onClose, onPrev, onNext }) {
  const poem = poemList[currentIndex];
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);
    setText("");

    // fetch poem file from public folder
    fetch(poem.file)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load poem");
        return r.text();
      })
      .then((t) => {
        if (!mounted) return;
        // normalize newlines and keep paragraphs
        setText(t.replace(/\r\n/g, "\n"));
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr("Couldn't load poem.");
        setLoading(false);
      });

    // handle escape to close
    const onKey = (ev) => {
      if (ev.key === "Escape") onClose();
      if (ev.key === "ArrowLeft") onPrev();
      if (ev.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      mounted = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [poem.file]);

  // ensure underlying page can't be scrolled while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  return (
    <div className="poem-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <h2 className="poem-title">{poem.title}</h2>

          {loading && <div className="poem-loading">Loading…</div>}
          {err && <div className="poem-error">{err}</div>}

          {!loading && !err && (
            <div className="poem-content" aria-live="polite">
              {text.split("\n").map((line, idx) =>
                line.trim() === "" ? <p key={idx} className="poem-para">&nbsp;</p> : <p key={idx}>{line}</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="modal-left">
            <button className="nav-btn" onClick={onPrev} aria-label="Previous poem">← Previous</button>
          </div>

          <div className="modal-center">
            <button className="nav-btn" onClick={onClose} aria-label="Back">← Back</button>
          </div>

          <div className="modal-right">
            <button className="nav-btn" onClick={onNext} aria-label="Next poem">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
