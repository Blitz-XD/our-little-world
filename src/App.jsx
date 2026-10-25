
import { useState, useRef, useEffect } from "react";
import PetalCanvas from "./components/PetalCanvas";
import GlassNav from "./components/GlassNav";
import Home from "./pages/Home";
import Music from "./pages/Music";
import "./index.css";
import Farm from "./pages/Farm";

const pageInfo = {
  moments: {
    eyebrow: "THE LITTLE THINGS",
    title: "Favourite Moments",
    description: "All the memories I wish I could keep in a little jar.",
  },
  letter: {
    eyebrow: "JUST FOR YOU",
    title: "A Letter",
    description: "A few things I want you to know, always.",
  },
  adore: {
    eyebrow: "A THOUSAND LITTLE REASONS",
    title: "Things I Adore",
    description: "Little things about you that make you, you.",
  },
};

function ComingPage({ page, setPage }) {
  const info = pageInfo[page];

  return (
    <main className="coming-page" key={page}>
      <span className="eyebrow">{info.eyebrow}</span>

      <h1 className="coming-title">{info.title}</h1>

      <p className="coming-description">{info.description}</p>

      <div className="coming-heart" aria-hidden="true">
        ♡
      </div>

      <button
        className="back-button"
        type="button"
        onClick={() => setPage("home")}
      >
        <span aria-hidden="true">←</span> Back home
      </button>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [shown, setShown] = useState("home");
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);

  function go(next) {
    if (next === page) return;
    setPage(next);
    setLeaving(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setShown(next);
      setLeaving(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 220);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="app-shell">
      <PetalCanvas />

      <GlassNav page={page} setPage={go} />

      <div className={`page-stage ${leaving ? "leaving" : ""}`}>
        {shown === "home" && <Home setPage={go} />}

        {shown === "music" && <Music />}
        {shown === "farm" && <Farm />}

        {["moments", "letter", "adore"].includes(shown) && (
          <ComingPage page={shown} setPage={go} />
        )}
      </div>
    </div>
  );
}
