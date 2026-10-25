
import { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import { parseBlob } from "music-metadata-browser";
import { songCollections } from "../data/songs";

globalThis.Buffer = Buffer;

const initialCollections = Object.entries(songCollections);

function DiscArtwork({ song, large = false }) {
  return (
    <div
      className={`music-artwork ${large ? "music-artwork-large" : ""}`}
      style={{ "--art-color": song.color || "#d9d5f8" }}
    >
      <div className="artwork-fallback">
        <span className="artwork-flower">✿</span>
        <span className="artwork-album">{song.album}</span>
        <span className="artwork-small">{song.artist}</span>
      </div>

      {song.cover && (
        <img
          src={song.cover}
          alt={`${song.album} album cover`}
          onLoad={() =>
            console.log("✅ Cover displayed:", song.title)
          }
          onError={(event) => {
            console.error(
              "❌ Cover failed to display:",
              song.title,
              song.cover
            );
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="artwork-shine" />
    </div>
  );
}
function VinylStage({ song, playing }) {
  return (
    <div
      className={`turntable ${playing ? "playing" : ""}`}
      style={{ "--art-color": song.color || "#d9d5f8" }}
    >
      <div className="tt-platter">
        <div className="tt-disc">
          <div className="tt-label">
            {song.cover && (
              <img
                src={song.cover}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="tt-arm">
        <div className="tt-rod">
          <span className="tt-head" />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function Music() {
  const audioRef = useRef(null);
  const artworkUrls = useRef([]);

  const [collections, setCollections] = useState(() =>
    initialCollections.map(([key, collection]) => ({
      key,
      ...collection,
      songs: collection.songs.map((song) => ({ ...song })),
    }))
  );

  const [activeTab, setActiveTab] = useState("loved");
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playError, setPlayError] = useState("");

  // Extract the embedded artwork and metadata from every unique MP3.
  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];

    async function loadMetadata() {
      const uniqueSongs = new Map();

      for (const [, collection] of initialCollections) {
        for (const song of collection.songs) {
          if (song.audio) {
            uniqueSongs.set(song.audio, song);
          }
        }
      }

      const metadataByAudio = new Map();

      await Promise.all(
        [...uniqueSongs.entries()].map(
          async ([audioPath, song]) => {
            try {
              const response = await fetch(audioPath);

              if (!response.ok) {
                console.error(
                  `Failed to fetch ${audioPath}: ${response.status}`
                );
                return;
              }

              const blob = await response.blob();
              const metadata = await parseBlob(blob);
              const common = metadata.common;
              const picture = common.picture?.[0];

              console.log("🎵 Metadata:", audioPath, {
                title: common.title,
                picturesFound: common.picture?.length ?? 0,
                pictureFormat: picture?.format,
                pictureBytes: picture?.data?.length ?? 0,
              });

              let cover = "";

              if (picture?.data?.length) {
                const mimeType =
                  picture.format?.toLowerCase().includes("png")
                    ? "image/png"
                    : picture.format?.toLowerCase().includes("webp")
                      ? "image/webp"
                      : "image/jpeg";

                const imageBlob = new Blob([picture.data], {
                  type: mimeType,
                });

                cover = URL.createObjectURL(imageBlob);
                createdUrls.push(cover);
              }

              metadataByAudio.set(audioPath, {
                title: common.title || song.title,
                artist: common.artist || song.artist,
                album: common.album || song.album,
                cover,
              });
            } catch (error) {
              console.error(
                `Metadata extraction failed for ${audioPath}:`,
                error
              );
            }
          }
        )
      );

      if (cancelled) {
        createdUrls.forEach((url) => URL.revokeObjectURL(url));
        return;
      }

      setCollections((previous) =>
        previous.map((collection) => ({
          ...collection,
          songs: collection.songs.map((song) => {
            const metadata = metadataByAudio.get(song.audio);

            if (!metadata) return song;

            return {
              ...song,
              title: metadata.title,
              artist: metadata.artist,
              album: metadata.album,
              cover: metadata.cover || song.cover || "",
            };
          }),
        }))
      );

      artworkUrls.current = createdUrls;
    }

    loadMetadata();

    return () => {
      cancelled = true;

      artworkUrls.current.forEach((url) =>
        URL.revokeObjectURL(url)
      );

      artworkUrls.current = [];
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const activeCollection =
    collections.find((collection) => collection.key === activeTab) ||
    collections[0];

  // Songs can appear in both playlists, but each song has one identity.
  const allSongs = [
    ...new Map(
      collections
        .flatMap((collection) => collection.songs)
        .map((song) => [song.id, song])
    ).values(),
  ];

  const currentSong = allSongs.find(
    (song) => song.id === currentSongId
  );

  const featuredSong =
    activeCollection.songs.find(
      (song) => song.id === currentSongId
    ) || activeCollection.songs[0];

  const featuredIsPlaying =
    currentSongId === featuredSong?.id && isPlaying;

  async function playSong(song) {
    if (!song?.audio || !audioRef.current) return;

    const audio = audioRef.current;
    setPlayError("");

    if (currentSongId === song.id) {
      if (audio.paused) {
        try {
          await audio.play();
        } catch (error) {
          console.error("Playback failed:", error);
          setPlayError(
            "Couldn't play this song. Check that its audio file exists."
          );
        }
      } else {
        audio.pause();
      }

      return;
    }

    setCurrentSongId(song.id);
        const owner = collections.find((c) =>
      c.songs.some((s) => s.id === song.id)
    );
    if (owner && !activeCollection.songs.some((s) => s.id === song.id)) {
      setActiveTab(owner.key);
    }
    setProgress(0);
    setDuration(0);

    audio.src = song.audio;
    audio.load();

    try {
      await audio.play();
    } catch (error) {
      console.error("Playback failed:", error);
      setPlayError(
        "Couldn't play this song. Check that its audio file exists."
      );
    }
  }

  function skipSong(direction) {
    const playableSongs = allSongs.filter((song) => song.audio);

    if (!playableSongs.length) return;

    const currentIndex = playableSongs.findIndex(
      (song) => song.id === currentSongId
    );

    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + playableSongs.length) %
          playableSongs.length;

    playSong(playableSongs[nextIndex]);
  }

  return (
    <main className="music-page">
      <audio
        ref={audioRef}
        onTimeUpdate={(event) =>
          setProgress(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => skipSong(1)}
        onError={() => setIsPlaying(false)}
      />

      <header className="music-heading">
        <p className="music-eyebrow">
         
        </p>

        <h1>
          Play it <span>again</span>
        </h1>

        <p>Little songs, little memories, a little piece of us.</p>
      </header>

      <nav className="music-tabs" aria-label="Music playlists">
        {collections.map((collection) => (
          <button
            key={collection.key}
            type="button"
            className={`music-tab ${
              activeTab === collection.key ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab(collection.key);
              setPlayError("");
            }}
            aria-pressed={activeTab === collection.key}
          >
            {collection.title}
          </button>
        ))}
      </nav>

      <section className="music-layout">
        <div className="featured-player">
          <div className="featured-topline">
            <span>YOUR LITTLE SOUNDTRACK</span>
            <span className="sound-dot" />
          </div>

          <VinylStage song={featuredSong} playing={featuredIsPlaying} />

          <div className="featured-song-info"key={featuredSong.id}>
            <span className="featured-album">
              {featuredSong.album}
            </span>
            <h2>{featuredSong.title}</h2>
            <p>{featuredSong.artist}</p>
          </div>

          <div className="music-progress">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(progress, duration || 0)}
              style={{
                "--progress": duration
                  ? `${(progress / duration) * 100}%`
                  : "0%",
              }}
              disabled={
                currentSongId !== featuredSong.id || !duration
              }
              onChange={(event) => {
                const time = Number(event.target.value);
                audioRef.current.currentTime = time;
                setProgress(time);
              }}
              aria-label="Song progress"
            />

            <div className="time-labels">
              <span>
                {formatTime(
                  currentSongId === featuredSong.id ? progress : 0
                )}
              </span>
              <span>
                {formatTime(
                  currentSongId === featuredSong.id ? duration : 0
                )}
              </span>
            </div>
          </div>

          <div className="music-controls">
            <button
              className="transport-button skip-symbol"
              onClick={() => skipSong(-1)}
              aria-label="Previous song"
            >
              |◀
            </button>

            <button
              className="play-button"
              onClick={() => playSong(featuredSong)}
              disabled={!featuredSong.audio}
              aria-label={
                featuredIsPlaying ? "Pause song" : "Play song"
              }
            >
              {featuredIsPlaying ? "Ⅱ" : "▶"}
            </button>

            <button
              className="transport-button skip-symbol"
              onClick={() => skipSong(1)}
              aria-label="Next song"
            >
              ▶|
            </button>
          </div>

          <div className="volume-control">
            <span>♪</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              style={{ "--progress": `${volume * 100}%` }}
              onChange={(event) =>
                setVolume(Number(event.target.value))
              }
              aria-label="Volume"
            />
          </div>

          <p className="featured-note">{featuredSong.note}</p>

          {playError && (
            <p className="music-error">{playError}</p>
          )}
        </div>

        <div className="track-panel">
          <div className="track-heading">
            <div>
              <span className="track-overline">THE PLAYLIST</span>
              <h2>{activeCollection.title}</h2>
              <p>{activeCollection.subtitle}</p>
            </div>

            <span className="track-count">
              {activeCollection.songs.length} songs
            </span>
          </div>

          <div className="track-list" key={activeTab} >
            {activeCollection.songs.map((song, index) => {
              const selected = currentSongId === song.id;
              const playing = selected && isPlaying;

              return (
                <div
                  key={song.id}
                  className={`track-row ${
                    selected ? "selected" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => playSong(song)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      playSong(song);
                    }
                  }}
                  aria-label={`Play ${song.title}`}
                >
                  <span className="track-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <DiscArtwork song={song} />

                  <span className="track-copy">
                    <strong>{song.title}</strong>
                    <span>{song.artist}</span>
                  </span>

                  <span className="track-action">
                    {playing ? "Ⅱ" : "▶"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="playlist-footnote">
            <span>♡</span>
            <p>
              {activeTab === "loved"
                ? "A few songs straight from your world."
                : "Some songs will always remind me of you."}
            </p>
          </div>
        </div>
      </section>

      {currentSong && (
        <footer className="mini-player">
          <DiscArtwork song={currentSong} />

          <div className="mini-song">
            <strong>{currentSong.title}</strong>
            <span>{currentSong.artist}</span>
          </div>

          <button
            className="mini-play"
            onClick={() => playSong(currentSong)}
            aria-label={isPlaying ? "Pause song" : "Play song"}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>
        </footer>
      )}
    </main>
  );
}
