"use client"
import { useState } from "react";

const WORDS = [
  "apple", "banana", "orange", "grape", "strawberry", "watermelon", "pineapple", "mango", "lemon", "coconut",
  "potato", "carrot", "broccoli", "onion", "garlic", "pepper", "cucumber", "mushroom", "corn", "pumpkin",
  "dog", "cat", "elephant", "lion", "tiger", "bear", "wolf", "rabbit", "horse", "cow",
  "pig", "sheep", "chicken", "eagle", "penguin", "flamingo", "dolphin", "whale", "shark", "octopus",
  "crab", "salmon", "turtle", "frog", "snake", "butterfly", "spider", "pizza", "burger", "sushi",
  "pasta", "tacos", "sandwich", "salad", "soup", "steak", "croissant", "waffle", "pancake", "donut",
  "chocolate", "ice cream", "cookie", "popcorn", "airplane", "helicopter", "rocket", "submarine", "sailboat", "motorcycle",
  "bicycle", "ambulance", "firetruck", "bulldozer", "crane", "spaceship", "doctor", "teacher", "lawyer", "chef",
  "pilot", "astronaut", "firefighter", "detective", "carpenter", "architect", "scientist", "photographer", "painter", "castle",
  "lighthouse", "pyramid", "cathedral", "igloo", "windmill", "skyscraper", "bridge", "stadium", "aquarium", "mansion",
  "beach", "jungle", "desert", "mountain", "volcano", "forest", "ocean", "river", "lake", "waterfall",
  "cave", "island", "valley", "canyon", "glacier", "tornado", "hurricane", "earthquake", "avalanche", "tsunami",
  "blizzard", "rainbow", "snowflake", "diamond", "gold", "silver", "sword", "shield", "cannon", "dagger",
  "ghost", "vampire", "werewolf", "zombie", "witch", "dragon", "unicorn", "mermaid", "phoenix", "fairy",
  "troll", "elf", "dwarf", "mirror", "crown", "throne", "candle", "map", "key", "lantern",
  "compass", "pharmacy", "bakery", "barbershop", "gymnasium", "courthouse", "prison", "airport", "hospital", "museum",
  "library", "supermarket", "restaurant", "hotel", "school", "church", "bank", "park", "zoo", "cinema",
  "police station", "fire station", "train station", "birthday", "wedding", "graduation", "funeral", "concert", "parade", "festival",
  "carnival", "election", "chess", "poker", "bowling", "surfing", "skiing", "boxing", "wrestling", "swimming",
  "cycling", "marathon", "camping", "fishing", "hunting", "painting", "cooking", "gardening", "reading", "dancing",
  "singing", "acting", "juggling", "magic", "karate", "soccer", "basketball", "baseball", "tennis", "golf",
  "hockey", "rugby", "volleyball",
];

export default function Home() {
  const [phase, setPhase] = useState("setup");
  const [players, setPlayers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [numImposters, setNumImposters] = useState(1);

  const [word, setWord] = useState(null);
  const [imposterIndexes, setImposterIndexes] = useState([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [showingWord, setShowingWord] = useState(false);

  function addPlayer() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setPlayers((prev) => [...prev, trimmed]);
    setInputValue("");
  }

  function removePlayer(index) {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addPlayer();
  }

  function startGame() {
    if (players.length < 2) return;
    const max = players.length - 1;
    const count = Math.min(Math.max(1, numImposters), max);
    const picked = WORDS[Math.floor(Math.random() * WORDS.length)];
    const shuffled = [...Array(players.length).keys()].sort(() => Math.random() - 0.5);
    const imposters = shuffled.slice(0, count);
    setWord(picked);
    setImposterIndexes(imposters);
    setRevealIndex(0);
    setShowingWord(false);
    setPhase("reveal");
  }

  function handleNextPlayer() {
    if (revealIndex + 1 >= players.length) {
      setPhase("discussion");
    } else {
      setRevealIndex((i) => i + 1);
      setShowingWord(false);
    }
  }

  function playAgain() {
    setPhase("setup");
    setWord(null);
    setImposterIndexes([]);
    setRevealIndex(0);
    setShowingWord(false);
  }

  const isImposter = imposterIndexes.includes(revealIndex);

  return (
    <div style={styles.page}>

      {/* ── SETUP ── */}
      {phase === "setup" && (
        <div style={styles.card}>
          <h1 style={styles.title}>🕵️ Imposter</h1>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="Player name…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button style={styles.addButton} onClick={addPlayer}>Add</button>
          </div>

          {players.length > 0 ? (
            <ul style={styles.list}>
              {players.map((name, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.playerName}>{name}</span>
                  <button style={styles.removeButton} onClick={() => removePlayer(i)}>✕</button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.empty}>No players yet.</p>
          )}

          <div style={styles.imposterRow}>
            <span style={styles.imposterLabel}>Imposters</span>
            <div style={styles.counter}>
              <button
                style={{
                  ...styles.counterBtn,
                  opacity: numImposters <= 1 ? 0.3 : 1,
                  cursor: numImposters <= 1 ? "not-allowed" : "pointer",
                }}
                onClick={() => setNumImposters((n) => Math.max(1, n - 1))}
                disabled={numImposters <= 1}
              >−</button>
              <span style={styles.counterValue}>{numImposters}</span>
              <button
                style={{
                  ...styles.counterBtn,
                  opacity: players.length < 3 || numImposters >= players.length - 2 ? 0.3 : 1,
                  cursor: players.length < 3 || numImposters >= players.length - 2 ? "not-allowed" : "pointer",
                }}
                onClick={() => setNumImposters((n) => Math.min(players.length - 2, n + 1))}
                disabled={players.length < 3 || numImposters >= players.length - 2}
              >+</button>
            </div>
          </div>

          <button
            style={{
              ...styles.primaryButton,
              marginTop: "1.25rem",
              opacity: players.length < 2 ? 0.4 : 1,
              cursor: players.length < 2 ? "not-allowed" : "pointer",
            }}
            onClick={startGame}
            disabled={players.length < 2}
          >
            Start Game
          </button>
        </div>
      )}

      {/* ── REVEAL ── */}
      {phase === "reveal" && (
        <div style={styles.card}>
          <p style={styles.turnLabel}>📱 Pass the phone to</p>
          <h2 style={styles.playerTitle}>{players[revealIndex]}</h2>

          {!showingWord ? (
            <button style={styles.revealButton} onClick={() => setShowingWord(true)}>
              Tap to see your word
            </button>
          ) : (
            <div style={styles.wordBox}>
              {isImposter ? (
                <span style={styles.imposterTag}>🎭 YOU ARE THE IMPOSTER</span>
              ) : (
                <span style={styles.bigWord}>{word}</span>
              )}
            </div>
          )}

          {showingWord && (
            <button style={styles.nextButton} onClick={handleNextPlayer}>
              {revealIndex + 1 >= players.length
                ? "Everyone's ready →"
                : `Done — pass to ${players[revealIndex + 1]} →`}
            </button>
          )}

          <p style={styles.progress}>
            {revealIndex + 1} / {players.length} players
          </p>
        </div>
      )}

      {/* ── DISCUSSION ── */}
      {phase === "discussion" && (
        <div style={styles.card}>
          <button style={styles.primaryButton} onClick={() => setPhase("result")}>
            Reveal the Imposters
          </button>
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === "result" && (
        <div style={styles.card}>
          <h2 style={styles.title}>
            {imposterIndexes.length > 1 ? "The imposters were…" : "The imposter was…"}
          </h2>
          <div style={styles.resultBox}>
            {imposterIndexes.map((idx) => (
              <span key={idx} style={styles.resultName}>🎭 {players[idx]}</span>
            ))}
          </div>
          <div style={styles.wordsReveal}>
            <div style={styles.wordRevealItem}>
              <span style={styles.wordRevealLabel}>The word</span>
              <span style={styles.wordRevealValue}>{word}</span>
            </div>
          </div>
          <button style={{ ...styles.primaryButton, marginTop: "1.5rem" }} onClick={playAgain}>
            Play Again
          </button>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "1rem",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "1.25rem",
    padding: "2rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    color: "#fff",
  },
  title: {
    margin: "0 0 1.5rem",
    fontSize: "1.8rem",
    fontWeight: 700,
    textAlign: "center",
    color: "#fff",
  },
  inputRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.65rem 0.9rem",
    fontSize: "1rem",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "0.5rem",
    color: "#fff",
    outline: "none",
  },
  addButton: {
    padding: "0.65rem 1.1rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    background: "#38a169",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.55rem 0.9rem",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.5rem",
  },
  playerName: {
    fontSize: "1rem",
    color: "#e2e8f0",
    fontWeight: 500,
  },
  removeButton: {
    background: "none",
    border: "none",
    color: "#fc8181",
    fontSize: "1rem",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 0.2rem",
  },
  empty: {
    textAlign: "center",
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.95rem",
    margin: "0.5rem 0",
  },
  imposterRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1.25rem",
    padding: "0.75rem 1rem",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.75rem",
  },
  imposterLabel: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#e2e8f0",
  },
  counter: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  counterBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "1.3rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transition: "opacity 0.15s",
  },
  counterValue: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#ffd700",
    minWidth: "24px",
    textAlign: "center",
  },
  primaryButton: {
    display: "block",
    width: "100%",
    padding: "1rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  turnLabel: {
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.9rem",
    margin: "0 0 0.3rem",
  },
  playerTitle: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 1.5rem",
  },
  revealButton: {
    display: "block",
    width: "100%",
    padding: "1.2rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1a1a2e",
    background: "#ffd700",
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
  },
  wordBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "0.75rem",
    minHeight: "110px",
    marginBottom: "0.5rem",
  },
  bigWord: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#ffd700",
    letterSpacing: "0.02em",
  },
  imposterTag: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#fc8181",
    textAlign: "center",
  },
  nextButton: {
    display: "block",
    width: "100%",
    padding: "0.85rem",
    marginTop: "1rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "0.6rem",
    cursor: "pointer",
  },
  progress: {
    textAlign: "center",
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.8rem",
    marginTop: "1rem",
  },
  resultBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1.5rem",
    background: "rgba(252,129,129,0.12)",
    border: "1px solid rgba(252,129,129,0.3)",
    borderRadius: "0.75rem",
    margin: "1rem 0",
  },
  resultName: {
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#fc8181",
  },
  wordsReveal: {
    display: "flex",
    background: "rgba(255,255,255,0.07)",
    borderRadius: "0.75rem",
    overflow: "hidden",
  },
  wordRevealItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    gap: "0.4rem",
  },
  wordRevealLabel: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  wordRevealValue: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#ffd700",
  },
};
