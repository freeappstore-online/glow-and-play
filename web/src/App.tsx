import { useState } from "react";
import { Shell } from "./components/Shell";
import { EmojiDressUp } from "./components/games/EmojiDressUp";
import { StarCatcher } from "./components/games/StarCatcher";
import { CupcakeClicker } from "./components/games/CupcakeClicker";
import { Magic8Ball } from "./components/games/Magic8Ball";
import { NailArt } from "./components/games/NailArt";
import { UnicornQuiz } from "./components/games/UnicornQuiz";
import { WordScramble } from "./components/games/WordScramble";
import { ColorMixer } from "./components/games/ColorMixer";

type GameId =
  | "home"
  | "dress-up"
  | "star-catcher"
  | "cupcake"
  | "magic8"
  | "nail-art"
  | "unicorn-quiz"
  | "word-scramble"
  | "color-mixer";

interface Game {
  id: GameId;
  emoji: string;
  name: string;
  desc: string;
  color: string;
  bg: string;
}

const GAMES: Game[] = [
  { id: "dress-up", emoji: "👗", name: "Emoji Dress-Up", desc: "Mix & match your perfect outfit!", color: "#ec4899", bg: "#fdf2f8" },
  { id: "star-catcher", emoji: "⭐", name: "Star Catcher", desc: "Tap the falling stars before they vanish!", color: "#f59e0b", bg: "#fffbeb" },
  { id: "cupcake", emoji: "🧁", name: "Cupcake Clicker", desc: "Bake as many cupcakes as you can!", color: "#f97316", bg: "#fff7ed" },
  { id: "magic8", emoji: "🔮", name: "Magic 8 Ball", desc: "Ask the magic ball anything!", color: "#8b5cf6", bg: "#f5f3ff" },
  { id: "nail-art", emoji: "💅", name: "Nail Art Studio", desc: "Design your dream nail look!", color: "#db2777", bg: "#fdf2f8" },
  { id: "unicorn-quiz", emoji: "🦄", name: "Unicorn Quiz", desc: "Which mythical creature are you?", color: "#a855f7", bg: "#faf5ff" },
  { id: "word-scramble", emoji: "🔤", name: "Word Scramble", desc: "Unscramble the mystery words!", color: "#06b6d4", bg: "#ecfeff" },
  { id: "color-mixer", emoji: "🎨", name: "Color Mixer", desc: "Mix colors to match the target!", color: "#10b981", bg: "#ecfdf5" },
];

export default function App() {
  const [activeGame, setActiveGame] = useState<GameId>("home");

  const currentGame = GAMES.find((g) => g.id === activeGame);

  const navItems = [
    { id: "home" as GameId, emoji: "🏠", label: "Home" },
    ...GAMES.map((g) => ({ id: g.id, emoji: g.emoji, label: g.name })),
  ];

  return (
    <Shell
      navItems={navItems.map((n) => ({
        label: n.label,
        icon: n.emoji,
        active: activeGame === n.id,
        onClick: () => setActiveGame(n.id),
      }))}
      title="✨ Glow & Play"
    >
      {activeGame === "home" && (
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div
            className="rounded-[1.25rem] p-8 mb-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 50%, #ecfeff 100%)",
              border: "1px solid var(--line)",
            }}
          >
            <div className="text-6xl mb-3">✨🦄✨</div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "Fraunces, serif", color: "#a855f7" }}
            >
              Glow & Play
            </h1>
            <p className="text-lg" style={{ color: "#6b7280" }}>
              Your mini-game wonderland! Pick a game and let's go! 🎉
            </p>
          </div>

          {/* Game Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="rounded-[1.25rem] p-5 text-left transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                style={{
                  background: game.bg,
                  border: `2px solid ${game.color}22`,
                }}
              >
                <div className="text-4xl mb-3">{game.emoji}</div>
                <div
                  className="font-bold text-sm mb-1 leading-tight"
                  style={{ fontFamily: "Fraunces, serif", color: game.color }}
                >
                  {game.name}
                </div>
                <div className="text-xs leading-snug" style={{ color: "#6b7280" }}>
                  {game.desc}
                </div>
              </button>
            ))}
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: "var(--muted)" }}>
            8 games • No ads • 100% free 💖
          </p>
        </div>
      )}

      {activeGame !== "home" && (
        <div className="max-w-2xl mx-auto">
          {/* Back button + title */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setActiveGame("home")}
              className="rounded-[0.75rem] px-4 py-2 font-semibold text-sm transition hover:opacity-80"
              style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
            >
              ← Back
            </button>
            {currentGame && (
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "Fraunces, serif", color: currentGame.color }}
              >
                {currentGame.emoji} {currentGame.name}
              </h2>
            )}
          </div>

          {activeGame === "dress-up" && <EmojiDressUp />}
          {activeGame === "star-catcher" && <StarCatcher />}
          {activeGame === "cupcake" && <CupcakeClicker />}
          {activeGame === "magic8" && <Magic8Ball />}
          {activeGame === "nail-art" && <NailArt />}
          {activeGame === "unicorn-quiz" && <UnicornQuiz />}
          {activeGame === "word-scramble" && <WordScramble />}
          {activeGame === "color-mixer" && <ColorMixer />}
        </div>
      )}
    </Shell>
  );
}
