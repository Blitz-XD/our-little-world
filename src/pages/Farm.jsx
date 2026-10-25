import { useEffect, useRef, useState } from "react";

const SAVE_KEY = "farm-save-v1";
const MAX_LOVE = 10; // pets needed to fill an animal's hearts
const WALK_MS = 3600;

// ✏️ EDIT THESE: names (she can rename them), sounds, and YOUR notes.
// region = where the animal's feet wander, in % of the field (x: [min, max], y: [min, max])
const ANIMALS = [
  {
    id: "sheep",
    name: "Fluffy",
    sounds: ["baaa~", "baa!"],
    note: "You're the softest part of my day.",
    region: { x: [50, 88], y: [52, 68] },
  },
  {
    id: "cow",
    name: "Daisy",
    sounds: ["mooo~", "moo!"],
    note: "I'm so proud of you, always.",
    region: { x: [42, 80], y: [60, 76] },
  },
  {
    id: "pig",
    name: "Pinky",
    sounds: ["oink!", "snort~"],
    note: "Nobody makes me laugh like you do.",
    region: { x: [55, 90], y: [72, 87] },
  },
  {
    id: "chicken",
    name: "Nugget",
    sounds: ["bok bok!", "cluck~"],
    note: "Every day with you is my favourite.",
    region: { x: [8, 38], y: [50, 64] },
  },
  {
    id: "bunny",
    name: "Biscuit",
    sounds: ["♡", "*nose wiggle*"],
    note: "I'd hop all the way to you if I could.",
    region: { x: [40, 68], y: [48, 58] },
  },
  {
    id: "duck",
    name: "Quackers",
    sounds: ["quack!", "quack quack~"],
    note: "Even far apart, you're my person.",
    region: { x: [14, 30], y: [78, 88] },
  },
];


const FINALE = "I'd build you a whole farm if I could. Happy anniversary ♡";

/* ---------- little helpers ---------- */

const rand = (min, max) => min + Math.random() * (max - min);

const randomPos = (a) => ({
  x: rand(a.region.x[0], a.region.x[1]),
  y: rand(a.region.y[0], a.region.y[1]),
});

function loadSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
  } catch {
    return {};
  }
}

/* ---------- animal art (front-facing, drawn in SVG) ---------- */

function Face({ y = 56, gap = 8, mouth = true }) {
  return (
    <g>
      <g className="farm-eyes">
        <circle cx={50 - gap} cy={y} r="2.7" fill="#43405e" />
        <circle cx={50 + gap} cy={y} r="2.7" fill="#43405e" />
        <circle cx={50 - gap + 0.9} cy={y - 0.9} r="0.9" fill="#fff" />
        <circle cx={50 + gap + 0.9} cy={y - 0.9} r="0.9" fill="#fff" />
      </g>

      <ellipse cx={50 - gap - 6} cy={y + 6} rx="3.6" ry="2.3" fill="#f6a9c6" opacity=".55" />
      <ellipse cx={50 + gap + 6} cy={y + 6} rx="3.6" ry="2.3" fill="#f6a9c6" opacity=".55" />

      {mouth && (
        <path
          d={`M47.5 ${y + 6.5} Q50 ${y + 9} 52.5 ${y + 6.5}`}
          stroke="#43405e"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
}

function Sheep() {
  const wool = { fill: "#fbf8ff", stroke: "#d9cff0", strokeWidth: 1.2 };

  return (
    <g>
      <rect x="35" y="86" width="8" height="10" rx="4" fill="#cdbfe8" />
      <rect x="57" y="86" width="8" height="10" rx="4" fill="#cdbfe8" />
      <ellipse cx="50" cy="76" rx="26" ry="17" {...wool} />
      <circle cx="30" cy="48" r="10" {...wool} />
      <circle cx="70" cy="48" r="10" {...wool} />
      <circle cx="38" cy="36" r="12" {...wool} />
      <circle cx="62" cy="36" r="12" {...wool} />
      <circle cx="50" cy="32" r="12" {...wool} />
      <ellipse cx="30" cy="60" rx="6.5" ry="3.6" fill="#e3d6f5" transform="rotate(-18 30 60)" />
      <ellipse cx="70" cy="60" rx="6.5" ry="3.6" fill="#e3d6f5" transform="rotate(18 70 60)" />
      <ellipse cx="50" cy="56" rx="19" ry="17" fill="#ece1f8" />
      <Face y={56} />
    </g>
  );
}

function Cow() {
  return (
    <g>
      <rect x="33" y="88" width="9" height="9" rx="4" fill="#e9dff7" />
      <rect x="58" y="88" width="9" height="9" rx="4" fill="#e9dff7" />
      <ellipse cx="50" cy="78" rx="27" ry="16" fill="#fffaf6" stroke="#e6dcf3" strokeWidth="1.2" />
      <ellipse cx="66" cy="76" rx="9" ry="7" fill="#b8c9e9" />
      <ellipse cx="25" cy="42" rx="9" ry="5.5" fill="#c9b8ec" transform="rotate(-28 25 42)" />
      <ellipse cx="75" cy="42" rx="9" ry="5.5" fill="#c9b8ec" transform="rotate(28 75 42)" />
      <path d="M36 32 Q33 24 38 22" stroke="#e8d7a8" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M64 32 Q67 24 62 22" stroke="#e8d7a8" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <ellipse cx="50" cy="52" rx="24" ry="20" fill="#fffaf6" stroke="#e6dcf3" strokeWidth="1.2" />
      <ellipse cx="62" cy="40" rx="9" ry="7" fill="#b8c9e9" />
      <ellipse cx="50" cy="63" rx="14" ry="9.5" fill="#f8d2e2" />
      <ellipse cx="45.5" cy="63" rx="1.6" ry="2.1" fill="#d58aa9" />
      <ellipse cx="54.5" cy="63" rx="1.6" ry="2.1" fill="#d58aa9" />
      <Face y={50} gap={11} mouth={false} />
    </g>
  );
}

function Pig() {
  return (
    <g>
      <rect x="34" y="88" width="9" height="9" rx="4" fill="#f3b8d0" />
      <rect x="57" y="88" width="9" height="9" rx="4" fill="#f3b8d0" />
      <ellipse cx="50" cy="80" rx="25" ry="15" fill="#f9d0e1" />
      <path d="M27 38 Q23 24 38 30 Q36 38 27 38Z" fill="#f3b3cc" />
      <path d="M73 38 Q77 24 62 30 Q64 38 73 38Z" fill="#f3b3cc" />
      <circle cx="50" cy="52" r="25" fill="#f9d0e1" />
      <ellipse cx="50" cy="62" rx="12" ry="8.5" fill="#f3b3cc" />
      <ellipse cx="46" cy="62" rx="1.7" ry="2.4" fill="#c9769a" />
      <ellipse cx="54" cy="62" rx="1.7" ry="2.4" fill="#c9769a" />
      <Face y={49} gap={10} mouth={false} />
    </g>
  );
}

function Chicken() {
  return (
    <g>
      <path
        d="M42 90 v7 M42 97 l-4 2 M42 97 l4 2 M58 90 v7 M58 97 l-4 2 M58 97 l4 2"
        stroke="#f6c177"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="50" cy="58" r="30" fill="#fffdf8" stroke="#eee6f7" strokeWidth="1.2" />
      <ellipse cx="22" cy="66" rx="6.5" ry="12" fill="#f4eefb" transform="rotate(12 22 66)" />
      <ellipse cx="78" cy="66" rx="6.5" ry="12" fill="#f4eefb" transform="rotate(-12 78 66)" />
      <circle cx="43" cy="29" r="5.5" fill="#f4a3b8" />
      <circle cx="50" cy="26" r="6.5" fill="#f4a3b8" />
      <circle cx="57" cy="29" r="5.5" fill="#f4a3b8" />
      <path d="M45 58 L55 58 L50 66 Z" fill="#f8c97a" stroke="#f8c97a" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="50" cy="69" rx="3" ry="3.4" fill="#f4a3b8" />
      <Face y={52} gap={11} mouth={false} />
    </g>
  );
}

function Bunny() {
  return (
    <g>
      <ellipse cx="50" cy="86" rx="20" ry="11" fill="#f6f2fb" stroke="#e4daf3" strokeWidth="1.2" />
      <ellipse cx="38" cy="26" rx="7.5" ry="19" fill="#f6f2fb" stroke="#e4daf3" strokeWidth="1.2" transform="rotate(-8 38 26)" />
      <ellipse cx="62" cy="26" rx="7.5" ry="19" fill="#f6f2fb" stroke="#e4daf3" strokeWidth="1.2" transform="rotate(8 62 26)" />
      <ellipse cx="38" cy="27" rx="3.6" ry="12" fill="#f8c5d8" transform="rotate(-8 38 27)" />
      <ellipse cx="62" cy="27" rx="3.6" ry="12" fill="#f8c5d8" transform="rotate(8 62 27)" />
      <circle cx="50" cy="60" r="25" fill="#f6f2fb" stroke="#e4daf3" strokeWidth="1.2" />
      <path d="M48 63 Q50 61 52 63 Q50 66 48 63Z" fill="#f09ab9" />
      <Face y={56} gap={10} mouth={false} />
    </g>
  );
}

function Duck() {
  return (
    <g>
      <ellipse cx="50" cy="72" rx="29" ry="20" fill="#fff3b9" stroke="#f3e08f" strokeWidth="1.2" />
      <ellipse cx="26" cy="72" rx="8" ry="12" fill="#ffe99a" transform="rotate(14 26 72)" />
      <ellipse cx="74" cy="72" rx="8" ry="12" fill="#ffe99a" transform="rotate(-14 74 72)" />
      <circle cx="50" cy="42" r="21" fill="#fff3b9" stroke="#f3e08f" strokeWidth="1.2" />
      <ellipse cx="50" cy="51" rx="10" ry="6" fill="#f9c978" />
      <Face y={40} gap={9} mouth={false} />
    </g>
  );
}

const ART = {
  sheep: Sheep,
  cow: Cow,
  pig: Pig,
  chicken: Chicken,
  bunny: Bunny,
  duck: Duck,
};

/* ---------- the page ---------- */

export default function Farm() {
  const [save] = useState(loadSave);

  const [names, setNames] = useState(save.names || {});
  const [love, setLove] = useState(save.love || {});
  const [read, setRead] = useState(save.read || {});

  const [pos, setPos] = useState(() =>
    Object.fromEntries(ANIMALS.map((a) => [a.id, randomPos(a)]))
  );
  const [walking, setWalking] = useState({});
  const [squish, setSquish] = useState({});
  const [hearts, setHearts] = useState([]);
  const [bubble, setBubble] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [openNote, setOpenNote] = useState(null);

  const lastPet = useRef({});
  const frozen = useRef({});
  const uid = useRef(0);
  const timers = useRef(new Set());
  const bubbleTimer = useRef(null);

  const later = (fn, ms) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);

    timers.current.add(t);
    return t;
  };

  // Save progress on this device
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ names, love, read }));
    } catch {
      /* storage unavailable: that's fine */
    }
  }, [names, love, read]);

  // Let the animals wander
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!calm) {
      ANIMALS.forEach((a) => {
        const step = () => {
          if (Date.now() > (frozen.current[a.id] || 0)) {
            setPos((p) => ({ ...p, [a.id]: randomPos(a) }));
            setWalking((w) => ({ ...w, [a.id]: true }));
            later(() => setWalking((w) => ({ ...w, [a.id]: false })), WALK_MS);
          }

          later(step, 4800 + Math.random() * 5200);
        };

        later(step, 700 + Math.random() * 2600);
      });
    }

    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
      clearTimeout(bubbleTimer.current);
    };
  }, []);

  function pet(a) {
    const now = Date.now();
    if (now - (lastPet.current[a.id] || 0) < 300) return;

    lastPet.current[a.id] = now;
    frozen.current[a.id] = now + 2600;

    setLove((l) => ({
      ...l,
      [a.id]: Math.min(MAX_LOVE, (l[a.id] || 0) + 1),
    }));
    setSquish((s) => ({ ...s, [a.id]: (s[a.id] || 0) + 1 }));

    const base = ++uid.current * 10;
    const batch = [0, 1].map((k) => ({
      id: base + k,
      animal: a.id,
      dx: rand(-26, 26),
      delay: k * 140,
    }));

    setHearts((h) => [...h, ...batch]);
    later(
      () =>
        setHearts((h) => h.filter((x) => !batch.some((b) => b.id === x.id))),
      1500
    );

    setBubble({
      animal: a.id,
      text: a.sounds[Math.floor(Math.random() * a.sounds.length)],
    });
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 1300);
  }

  function startEdit(a) {
    setEditing(a.id);
    setDraft(names[a.id] ?? a.name);
  }

  function commitEdit() {
    const value = draft.trim().slice(0, 12);

    if (editing && value) {
      setNames((n) => ({ ...n, [editing]: value }));
    }

    setEditing(null);
  }

  function openNoteFor(a) {
    setOpenNote(a.id);
    setRead((r) => ({ ...r, [a.id]: true }));
  }

  const found = ANIMALS.filter((a) => read[a.id]).length;
  const allFound = found === ANIMALS.length;
  const noteAnimal = ANIMALS.find((a) => a.id === openNote);

  return (
    <main className="farm-page">
      <header className="farm-heading">
        <p className="farm-eyebrow">A FARM JUST FOR YOU</p>
        <h1>
          Our little <span>farm</span>
        </h1>
      </header>

      <section className="farm-field">
        <div className="farm-sun" />
        <span className="farm-cloud c1" />
        <span className="farm-cloud c2" />

        <div className="farm-hill back" />
        <div className="farm-hill front" />

        <svg className="farm-barn" viewBox="0 0 120 100" aria-hidden="true">
          <path
            d="M10 98 V44 L60 14 L110 44 V98 Z"
            fill="#f2c4d6"
            stroke="#e2a8c0"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4 46 L60 10 L116 46"
            fill="none"
            stroke="#b9a7e0"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="38" y="56" width="44" height="42" rx="3" fill="#fff7fb" stroke="#e2a8c0" strokeWidth="2" />
          <path d="M38 56 L82 98 M82 56 L38 98" stroke="#e2a8c0" strokeWidth="2" />
          <circle cx="60" cy="38" r="6" fill="#fff7fb" stroke="#e2a8c0" strokeWidth="2" />
        </svg>

        <div className="farm-fence" />
        <div className="farm-pond" />

        {ANIMALS.map((a, i) => {
          const Art = ART[a.id];
          const p = pos[a.id];
          const lv = love[a.id] || 0;
          const full = lv >= MAX_LOVE;
          const name = names[a.id] ?? a.name;

          return (
            <div
              key={a.id}
              className={`animal ${walking[a.id] ? "walking" : ""}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                zIndex: Math.round(p.y * 10),
                "--s": 0.72 + (p.y / 100) * 0.5,
                "--blink": `-${(i * 1.7).toFixed(1)}s`,
              }}
            >
              {full && (
                <button
                  type="button"
                  className={`animal-note ${read[a.id] ? "read" : ""}`}
                  onClick={() => openNoteFor(a)}
                  aria-label={`Open ${name}'s note`}
                >
                  ✉
                </button>
              )}

              {bubble?.animal === a.id && (
                <span className="animal-bubble" key={bubble.text + lv}>
                  {bubble.text}
                </span>
              )}

              {hearts
                .filter((h) => h.animal === a.id)
                .map((h) => (
                  <span
                    key={h.id}
                    className="farm-heart"
                    style={{
                      "--dx": `${h.dx}px`,
                      animationDelay: `${h.delay}ms`,
                    }}
                  >
                    ♥
                  </span>
                ))}

              <div
                className="animal-hit"
                role="button"
                tabIndex={0}
                aria-label={`Pet ${name}`}
                onPointerDown={() => pet(a)}
                onPointerMove={(event) => {
                  if (event.buttons > 0) pet(a);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    pet(a);
                  }
                }}
              >
                <div className="animal-bob">
                  <div
                    key={squish[a.id] || 0}
                    className={`animal-squish ${squish[a.id] ? "go" : ""}`}
                  >
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <Art />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="animal-tag">
                {editing === a.id ? (
                  <input
                    className="animal-name-input"
                    value={draft}
                    maxLength={12}
                    autoFocus
                    onChange={(event) => setDraft(event.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") commitEdit();
                      if (event.key === "Escape") setEditing(null);
                    }}
                    aria-label="Rename animal"
                  />
                ) : (
                  <button
                    type="button"
                    className="animal-name"
                    onClick={() => startEdit(a)}
                  >
                    {name}
                  </button>
                )}

                <span className="animal-meter">
                  <i style={{ width: `${(lv / MAX_LOVE) * 100}%` }} />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <div className="farm-stats">
        Notes found <b>{found}</b> of {ANIMALS.length}
      </div>

      <p className="farm-hint">
        tap or stroke the animals · tap a name to rename · fill their hearts
        for a surprise
      </p>

      <p className={`farm-message ${allFound ? "show" : ""}`}>{FINALE}</p>

      {noteAnimal && (
        <div className="farm-modal" onClick={() => setOpenNote(null)}>
          <div
            className="farm-note-card"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="farm-note-from">
              {names[noteAnimal.id] ?? noteAnimal.name} brought you a note
            </p>
            <p className="farm-note-text">{noteAnimal.note}</p>
            <button
              type="button"
              className="farm-note-close"
              onClick={() => setOpenNote(null)}
            >
              ♡ close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}