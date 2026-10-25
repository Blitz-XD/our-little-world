import { Counter, MadeWith } from "../components/Extras";
export default function Home({ setPage }) {
  return (
    <main className="home-page">
      <div className="home-glow glow-one" />
      <div className="home-glow glow-two" />

      <section className="hero-content">
        <p className="eyebrow">A LITTLE WORLD, JUST FOR YOU</p>

        <div className="hero-title">
          <h1 className="happy">Happy</h1>
          <h1 className="anniversary">anniversary</h1>
          <p className="princess">my princess<span> ♡</span></p>
        </div>

        <div className="subtitle">
          <span className="subtitle-line" />
          <p><Counter /></p>
          <span className="subtitle-line" />
        </div>

        <button
          className="enter-button"
          onClick={() => setPage("music")}
        >
          <span>Enter our little world</span>
          <span className="enter-arrow">↗</span>
        </button>

        <p className="hero-footnote">
            <MadeWith />
        </p>
      </section>

      <div className="bottom-decoration" aria-hidden="true">
        <span>✿</span>
        <span>✧</span>
        <span>❀</span>
      </div>
    </main>
  );
}
