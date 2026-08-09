import { useState, useEffect, useRef, useCallback } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
  points: number;
}

const EMOJIS = [
  { e: "⭐", p: 1 },
  { e: "🌟", p: 2 },
  { e: "💫", p: 3 },
  { e: "✨", p: 5 },
  { e: "☄️", p: -2 },
  { e: "💣", p: -3 },
];

export function StarCatcher() {
  const [stars, setStars] = useState<Star[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem("glowplay_starhigh") || "0")
  );
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const nextId = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endGame = useCallback((finalScore: number) => {
    setRunning(false);
    setGameOver(true);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem("glowplay_starhigh", String(finalScore));
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (fallRef.current) clearInterval(fallRef.current);
  }, [highScore]);

  const startGame = () => {
    setStars([]);
    setScore(0);
    setLives(3);
    setCombo(0);
    setGameOver(false);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;

    // Spawn stars
    intervalRef.current = setInterval(() => {
      const pick = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const star: Star = {
        id: nextId.current++,
        x: Math.random() * 80 + 5,
        y: 0,
        emoji: pick.e,
        speed: 0.4 + Math.random() * 0.6,
        points: pick.p,
      };
      setStars((prev) => [...prev, star]);
    }, 900);

    // Move stars down
    fallRef.current = setInterval(() => {
      setStars((prev) => {
        const updated = prev.map((s) => ({ ...s, y: s.y + s.speed }));
        const escaped = updated.filter((s) => s.y > 100);
        if (escaped.length > 0) {
          setLives((l) => {
            const newLives = l - escaped.length;
            if (newLives <= 0) {
              setScore((sc) => { endGame(sc); return sc; });
            }
            return Math.max(0, newLives);
          });
          setCombo(0);
        }
        return updated.filter((s) => s.y <= 100);
      });
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (fallRef.current) clearInterval(fallRef.current);
    };
  }, [running, endGame]);

  const catchStar = (id: number, points: number) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
    if (points > 0) {
      setCombo((c) => c + 1);
      const bonus = combo >= 3 ? 2 : 1;
      setScore((s) => s + points * bonus);
      setFlash(combo >= 3 ? "🔥 COMBO!" : "✨ +"+points);
    } else {
      setCombo(0);
      setScore((s) => Math.max(0, s + points));
      setFlash("💥 Oops!");
    }
    setTimeout(() => setFlash(null), 600);
  };

  return (
    <div>
      {/* Stats bar */}
      <div className="flex gap-4 mb-4 items-center">
        <div className="rounded-[0.75rem] px-4 py-2 font-bold text-lg" style={{ background: "#fffbeb", color: "#f59e0b" }}>
          ⭐ {score}
        </div>
        <div className="rounded-[0.75rem] px-4 py-2 font-bold text-lg" style={{ background: "#fdf2f8", color: "#ec4899" }}>
          🏆 {highScore}
        </div>
        <div className="rounded-[0.75rem] px-4 py-2 font-bold text-lg" style={{ background: "#fef2f2", color: "#ef4444" }}>
          {"❤️".repeat(lives) || "💀"}
        </div>
        {combo >= 3 && (
          <div className="rounded-[0.75rem] px-3 py-2 font-bold text-sm animate-bounce" style={{ background: "#fff7ed", color: "#f97316" }}>
            🔥 x{combo}
          </div>
        )}
      </div>

      {/* Game area */}
      <div
        className="relative rounded-[1.25rem] overflow-hidden"
        style={{
          height: "380px",
          background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
          border: "2px solid #a855f7",
        }}
      >
        {/* Stars background */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs opacity-30"
            style={{ left: `${(i * 5.3) % 100}%`, top: `${(i * 7.1) % 100}%` }}
          >
            ·
          </div>
        ))}

        {/* Flash message */}
        {flash && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 font-bold text-lg px-4 py-1 rounded-full z-10"
            style={{ background: "rgba(255,255,255,0.9)", color: "#a855f7" }}
          >
            {flash}
          </div>
        )}

        {/* Falling stars */}
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => catchStar(star.id, star.points)}
            className="absolute text-4xl transition-none cursor-pointer hover:scale-125"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: "translate(-50%, -50%)",
              background: "none",
              border: "none",
              padding: 0,
              lineHeight: 1,
            }}
          >
            {star.emoji}
          </button>
        ))}

        {/* Start / Game Over overlay */}
        {(!running || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-[1.25rem]">
            {gameOver ? (
              <>
                <div className="text-5xl mb-3">🎮</div>
                <div className="text-white font-bold text-2xl mb-1" style={{ fontFamily: "Fraunces, serif" }}>
                  Game Over!
                </div>
                <div className="text-yellow-300 font-bold text-xl mb-4">Score: {score}</div>
                {score >= highScore && score > 0 && (
                  <div className="text-pink-300 font-bold mb-4">🏆 New High Score!</div>
                )}
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">⭐</div>
                <div className="text-white font-bold text-2xl mb-2" style={{ fontFamily: "Fraunces, serif" }}>
                  Star Catcher
                </div>
                <div className="text-purple-200 text-sm mb-6 text-center px-8">
                  Tap the stars before they fall!<br />
                  Avoid ☄️ and 💣
                </div>
              </>
            )}
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-[0.75rem] font-bold text-white text-lg"
              style={{ background: "#f59e0b" }}
            >
              {gameOver ? "Play Again" : "Start Game"} ⭐
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-center" style={{ color: "var(--muted)" }}>
        💡 Tip: Catch 3+ in a row for a combo bonus! ✨ = 5 pts, 🌟 = 2 pts
      </div>
    </div>
  );
}
