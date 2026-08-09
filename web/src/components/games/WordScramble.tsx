import { useState, useEffect, useCallback } from "react";

const WORD_BANK = [
  { word: "SPARKLE", hint: "To shine with tiny flashes of light ✨", category: "Magic" },
  { word: "UNICORN", hint: "A magical horse with a horn 🦄", category: "Mythical" },
  { word: "GLITTER", hint: "Tiny shiny bits used for decoration 💫", category: "Craft" },
  { word: "RAINBOW", hint: "Colorful arc in the sky 🌈", category: "Nature" },
  { word: "MERMAID", hint: "Half human, half fish creature 🧜‍♀️", category: "Mythical" },
  { word: "BLOSSOM", hint: "A flower on a plant 🌸", category: "Nature" },
  { word: "CRYSTAL", hint: "Clear shiny mineral 💎", category: "Gems" },
  { word: "DOLPHIN", hint: "Playful ocean mammal 🐬", category: "Animals" },
  { word: "FLUTTER", hint: "To move lightly like a butterfly 🦋", category: "Movement" },
  { word: "GALAXY", hint: "A huge system of stars 🌌", category: "Space" },
  { word: "CUPCAKE", hint: "Small individual cake 🧁", category: "Food" },
  { word: "FANTASY", hint: "An imaginative world 🔮", category: "Magic" },
  { word: "PEBBLES", hint: "Small smooth stones 🪨", category: "Nature" },
  { word: "TWINKLE", hint: "To shine with a flickering light ⭐", category: "Magic" },
  { word: "JOURNEY", hint: "A long trip or adventure 🗺️", category: "Adventure" },
  { word: "STARFISH", hint: "A star-shaped sea creature 🌟", category: "Ocean" },
  { word: "BUBBLE", hint: "A round ball of air in liquid 🫧", category: "Fun" },
  { word: "WONDER", hint: "A feeling of amazement 😮", category: "Feelings" },
  { word: "BREEZE", hint: "A gentle wind 🌬️", category: "Nature" },
  { word: "DAZZLE", hint: "To impress with brilliance 💥", category: "Magic" },
];

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === word ? scramble(word) : result;
}

export function WordScramble() {
  const [wordIndex, setWordIndex] = useState(() => Math.floor(Math.random() * WORD_BANK.length));
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"playing" | "correct" | "wrong" | "hint">("playing");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem("glowplay_wordhigh") || "0")
  );
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const currentWord = WORD_BANK[wordIndex];

  const newWord = useCallback(() => {
    let idx = Math.floor(Math.random() * WORD_BANK.length);
    let tries = 0;
    while (usedIndices.has(idx) && tries < 20) {
      idx = Math.floor(Math.random() * WORD_BANK.length);
      tries++;
    }
    if (tries >= 20) setUsedIndices(new Set());
    setWordIndex(idx);
    setUsedIndices((prev) => new Set([...prev, idx]));
    setScrambled(scramble(WORD_BANK[idx].word));
    setGuess("");
    setStatus("playing");
    setShowHint(false);
  }, [usedIndices]);

  useEffect(() => {
    setScrambled(scramble(currentWord.word));
  }, []);

  const checkGuess = () => {
    if (guess.toUpperCase() === currentWord.word) {
      const points = showHint ? 5 : 10;
      const newScore = score + points + (streak >= 2 ? 5 : 0);
      setScore(newScore);
      setStreak((s) => s + 1);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("glowplay_wordhigh", String(newScore));
      }
      setStatus("correct");
    } else {
      setStreak(0);
      setStatus("wrong");
      setTimeout(() => setStatus("playing"), 800);
    }
  };

  const skip = () => {
    setStreak(0);
    newWord();
  };

  const statusColors = {
    playing: "var(--panel)",
    correct: "#f0fdf4",
    wrong: "#fef2f2",
    hint: "var(--panel)",
  };

  return (
    <div>
      {/* Score bar */}
      <div className="flex gap-3 mb-6 items-center flex-wrap">
        <div className="rounded-[0.75rem] px-4 py-2 font-bold" style={{ background: "#ecfeff", color: "#06b6d4" }}>
          🔤 {score} pts
        </div>
        <div className="rounded-[0.75rem] px-4 py-2 font-bold" style={{ background: "#fdf2f8", color: "#ec4899" }}>
          🏆 Best: {highScore}
        </div>
        {streak >= 2 && (
          <div className="rounded-[0.75rem] px-3 py-2 font-bold text-sm animate-bounce" style={{ background: "#fff7ed", color: "#f97316" }}>
            🔥 {streak} streak!
          </div>
        )}
        <div className="ml-auto text-xs px-3 py-2 rounded-[0.75rem]" style={{ background: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}>
          {currentWord.category}
        </div>
      </div>

      {/* Word card */}
      <div
        className="rounded-[1.25rem] p-8 text-center mb-6 transition-all"
        style={{
          background: status === "correct" ? "#f0fdf4" : status === "wrong" ? "#fef2f2" : "linear-gradient(135deg, #ecfeff, #f5f3ff)",
          border: `2px solid ${status === "correct" ? "#16a34a" : status === "wrong" ? "#dc2626" : "#06b6d433"}`,
        }}
      >
        {status === "correct" ? (
          <div>
            <div className="text-5xl mb-2">🎉</div>
            <div className="font-bold text-2xl mb-1" style={{ fontFamily: "Fraunces, serif", color: "#16a34a" }}>
              Correct! +{showHint ? 5 : 10}{streak >= 2 ? " +5 streak bonus" : ""} pts
            </div>
            <div className="text-lg font-bold mb-4" style={{ color: "#374151" }}>{currentWord.word}</div>
            <button
              onClick={newWord}
              className="px-6 py-3 rounded-[0.75rem] font-bold text-white"
              style={{ background: "#06b6d4" }}
            >
              Next Word →
            </button>
          </div>
        ) : (
          <>
            <div className="text-sm font-semibold mb-3" style={{ color: "var(--muted)" }}>
              Unscramble this word:
            </div>
            <div
              className="text-5xl font-bold tracking-widest mb-2"
              style={{
                fontFamily: "Fraunces, serif",
                color: "#06b6d4",
                letterSpacing: "0.15em",
              }}
            >
              {scrambled}
            </div>
            {showHint && (
              <div
                className="mt-3 text-sm px-4 py-2 rounded-[0.75rem] inline-block"
                style={{ background: "#fffbeb", color: "#d97706" }}
              >
                💡 Hint: {currentWord.hint}
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      {status !== "correct" && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && checkGuess()}
              placeholder="Type your answer..."
              maxLength={currentWord.word.length + 2}
              className="flex-1 px-4 py-3 rounded-[0.75rem] text-lg font-bold uppercase tracking-widest outline-none"
              style={{
                background: "var(--panel)",
                border: `2px solid ${status === "wrong" ? "#dc2626" : "#06b6d4"}`,
                color: "var(--ink)",
              }}
            />
            <button
              onClick={checkGuess}
              disabled={!guess.trim()}
              className="px-5 py-3 rounded-[0.75rem] font-bold text-white transition"
              style={{ background: guess.trim() ? "#06b6d4" : "var(--line)" }}
            >
              ✓
            </button>
          </div>

          {/* Letter tiles */}
          <div className="flex gap-2 flex-wrap justify-center mb-4">
            {scrambled.split("").map((letter, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-[0.5rem] flex items-center justify-center font-bold text-lg"
                style={{ background: "#ecfeff", color: "#06b6d4", border: "2px solid #06b6d433" }}
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold"
                style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #d9770633" }}
              >
                💡 Hint (-5 pts)
              </button>
            )}
            <button
              onClick={() => setScrambled(scramble(currentWord.word))}
              className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold"
              style={{ background: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}
            >
              🔀 Re-shuffle
            </button>
            <button
              onClick={skip}
              className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold"
              style={{ background: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}
            >
              ⏭ Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
}
