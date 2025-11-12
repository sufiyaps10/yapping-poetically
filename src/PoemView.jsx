import React, { useEffect, useState } from "react";

export default function PoemView({ poemList, currentIndex, onClose, onPrev, onNext }) {
  const poem = poemList[currentIndex];
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);
    setText("");
    setFadeKey((k) => k + 1);

    fetch(`${poem.file}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load poem");
        return r.text();
      })
      .then((t) => {
        if (!mounted) return;
        setText(t.replace(/\r\n/g, "\n"));
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr("Couldn't load poem.");
        setLoading(false);
      });

    const onKey = (ev) => {
      if (ev.key === "Escape") onClose();
      if (ev.key === "ArrowLeft") onPrev();
      if (ev.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      mounted = false;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
  }, [poem.file]);

  return (
    <div className="poem-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <h2 className="poem-title">{poem.title}</h2>

          {loading && <div className="poem-loading">Loading…</div>}
          {err && <div className="poem-error">{err}</div>}

          {!loading && !err && (
            <div key={fadeKey} className="poem-content poem-fade">
              {text.split("\n").map((line, idx) =>
                line.trim() === "" ? <p key={idx} className="poem-para">&nbsp;</p> : <p key={idx}>{line}</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer small-footer">
          <button className="nav-btn small" onClick={onPrev} disabled={currentIndex === 0}>
            ← Previous
          </button>
          <button className="nav-btn small" onClick={onClose}>
            ← Back
          </button>
          <button className="nav-btn small" onClick={onNext} disabled={currentIndex === poemList.length - 1}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
