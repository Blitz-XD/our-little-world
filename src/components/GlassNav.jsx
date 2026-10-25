
import { useState } from "react";

const items = [
  { id: "home", label: "Home", icon: "home" },
  { id: "music", label: "Music", icon: "music" },
  { id: "moments", label: "Moments", icon: "heart" },
  { id: "letter", label: "Letter", icon: "mail" },
  { id: "adore", label: "Adore", icon: "sparkles" },
      { id: "farm", label: "Farm", icon: "paw" },
];

function NavIcon({ name }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
    sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
          paw: (
      <>
        <ellipse cx="12" cy="16.2" rx="4.4" ry="3.6" />
        <ellipse cx="5.6" cy="11.4" rx="1.9" ry="2.4" />
        <ellipse cx="9.4" cy="6.9" rx="1.9" ry="2.5" />
        <ellipse cx="14.6" cy="6.9" rx="1.9" ry="2.5" />
        <ellipse cx="18.4" cy="11.4" rx="1.9" ry="2.4" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

export default function GlassNav({ page, setPage }) {
  const [hovered, setHovered] = useState(null);
  const activeIndex = items.findIndex((item) => item.id === page);

  return (
    <header className="nav-wrap">
      <nav className="glass-nav" aria-label="Main navigation">
        <div
          className="nav-indicator"
          style={{
                transform: `translateX(calc(${Math.max(0, activeIndex)} * (100% + var(--nav-gap))))`,         
         }}
        />

        {items.map((item) => {
          const active = page === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item ${active ? "active" : ""} ${
                hovered === item.id ? "hovered" : ""
              }`}
              onClick={() => setPage(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
            >
              <span className="nav-icon">
                <NavIcon name={item.icon} />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
