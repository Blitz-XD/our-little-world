import { useEffect, useLayoutEffect, useRef, useState } from "react";

// ✏️ CHANGE THESE THREE
const START = new Date("2024-12-10T06:48:00"); // the day (and time) you got together
const MY_NAME = "abhiram";
const NOTE = "and every second with you is my favourite.";

function timeSince(from, to) {
  if (to <= from) {
    return { years: 0, months: 0, days: 0, hours: 0, mins: 0, secs: 0 };
  }

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let mins = to.getMinutes() - from.getMinutes();
  let secs = to.getSeconds() - from.getSeconds();

  if (secs < 0) { secs += 60; mins -= 1; }
  if (mins < 0) { mins += 60; hours -= 1; }
  if (hours < 0) { hours += 24; days -= 1; }
  if (days < 0) {
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  return { years, months, days, hours, mins, secs };
}

function Unit({ value, label, pad = false }) {
  return (
    <span className="lc-unit">
      <span className="lc-num">
        {pad ? String(value).padStart(2, "0") : value}
      </span>
      <span className="lc-name">{label}</span>
    </span>
  );
}

export function Counter() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = timeSince(START, now);
  const plural = (n, word) => (n === 1 ? word : `${word}s`);

  return (
    <div className="love-counter">
      <p className="love-counter-label">YOU'VE BEEN AMAZING FOR</p>

      <div className="love-counter-row">
        <div className="lc-group">
          <Unit value={t.years} label={plural(t.years, "year")} />
          <Unit value={t.months} label={plural(t.months, "month")} />
          <Unit value={t.days} label={plural(t.days, "day")} />
        </div>

        <div className="lc-group lc-time">
          <Unit value={t.hours} label="hrs" pad />
          <Unit value={t.mins} label="min" pad />
          <Unit value={t.secs} label="sec" pad />
        </div>
      </div>

      <p className="love-counter-note">{NOTE}</p>
    </div>
  );
}

const WORDS = [MY_NAME, " your sunshine"];

function Letters({ word }) {
  return [...word].map((ch, k) => (
    <span
      key={k}
      className="wave-letter"
      style={{ "--i": k }}
      aria-hidden="true"
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

export function MadeWith() {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  const [widths, setWidths] = useState({});
  const swap = useRef(null);
  const measureRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setOut(true);

      swap.current = setTimeout(() => {
        setI((n) => (n + 1) % WORDS.length);
        setOut(false);
      }, 380);
    }, 3600);

    return () => {
      clearInterval(id);
      clearTimeout(swap.current);
    };
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const next = {};

      measureRef.current
        ?.querySelectorAll("[data-word]")
        .forEach((el) => {
          next[el.dataset.word] = el.getBoundingClientRect().width;
        });

      setWidths(next);
    };

    measure();
    document.fonts?.ready.then(measure);
  }, []);

  const word = WORDS[i];

  return (
    <p className="made-with">
      made with{" "}
      <span className="made-heart" aria-hidden="true">♥</span> by{" "}
      <span
        className="name-slot"
        style={widths[word] ? { width: widths[word] } : undefined}
      >
        <span
          key={word}
          className={`flip-word ${out ? "out" : ""}`}
          aria-label={word}
        >
          <Letters word={word} />
        </span>
      </span>

      <span className="name-measure" ref={measureRef} aria-hidden="true">
        {WORDS.map((w) => (
          <span key={w} data-word={w}>
            <Letters word={w} />
          </span>
        ))}
      </span>
    </p>
  );
}