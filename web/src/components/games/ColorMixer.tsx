import { useState, useEffect } from "react";

interface Color {
  r: number;
  g: number;
  b: number;
}

function toHex({ r, g, b }: Color): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function colorDiff(a: Color, b: Color): number {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

function scoreToStars(diff: number): number {
  if (diff < 15) return 3;
  if (diff < 40) return 2;
  if (diff < 80) return 1;
  return 0;
}

const NAMED_COLORS: { name: string; color: Color; emoji: string }[] = [
  { name: "Cherry Red", color: { r: 220, g: 38, b: 38 }, emoji: "🍒" },
  { name: "Ocean Blue", color: { r: 37, g: 99, b: 235 }, emoji: "🌊" },
  { name: "Sunshine Yellow", color: { r: 234, g: 179, b: 8 }, emoji: "☀️" },
  { name: "Forest Green", color: { r: 22, g: 163, b: 74 }, emoji: "🌲" },
  { name: "Lavender", color: { r: 167, g: 139, b: 250 }, emoji: "💜" },
  { name: "Hot Pink", color: { r: 236, g: 72, b: 153 }, emoji: "💗" },
  { name: "Tangerine", color: { r: 249, g: 115, b: 22 }, emoji: "🍊" },
  { name: "Mint", color: { r: 52, g: 211, b: 153 }, emoji: "🌿" },
  { name: "Sky Blue", color: { r: 56, g: 189, b: 248 }, emoji: "☁️" },
  { name: "Coral", color: { r: 251, g: 113, b: 133 }, emoji: "🪸" },
  { name: "Violet", color: { r: 139, g: 92, b: 246 }, emoji: "🫐" },
  { name: "Lime", color: { r: 132, g: 204, b: 22 }, emoji: "🍋" },
];

export function ColorMixer() {
  const [r, setR] = useState(128);
  const [g, setG] = useState(128);
  const [b, setB] = useState(128);
  const [target, setTarget] = useState<typeof NAMED_COLORS[0]>(NAMED_COLORS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState<{ stars: number; diff: number; name: string }[]>([]);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    pickTarget();
  }, []);

  const pickTarget = () => {
    const t = NAMED_COLORS[Math.floor(Math.random() * NAMED_COLORS.length)];
    setTarget(t);
    setR(128); setG(128); setB(128);
    setSubmitted(false);
  };

  const submit = () => {
    const diff = colorDiff({ r, g, b }, target.color);
    const stars = scoreToStars(diff);
    const pts = stars * 10;
    setScore((s) => s + pts);
    setTotalStars((s) => s + stars);
    setHistory((h) => [{ stars, diff: Math.round(diff), name: target.name }, ...h].slice(0, 5));
    setSubmitted(true);
  };

  const next = () => {
    setRound((r) => r + 1);
    pickTarget();
  };

  const mixed: Color = { r, g, b };
  const diff = colorDiff(mixed, target.color);
  const accuracy = Math.max(0, Math.round(100 - (diff / 441) * 100));

  const sliders = [
    { label: "Red 🔴", value: r, set: setR, color: "#ef4444" },
    { label: "Green 🟢", value: g, set: setG, color: "#22c55e" },
    { label: "Blue 🔵", value: b, set: setB, color: "#3b82f6" },
  ];

  return (
    <div>
      {/* Score */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <div className="rounded-[0.75rem] px-4 py-2 font-bold" style={{ background: "#ecfdf5", color: "#10b981" }}>
          🎨 {score} pts
        </div>
        <div className="rounded-[0.75rem] px-4 py-2 font-bold" style={{ background: "#fffbeb", color: "#f59e0b" }}>
          ⭐ {totalStars} stars
        </div>
        <div className="rounded-[0.75rem] px-3 py-2 text-sm" style={{ background: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}>
          Round {round}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Target color */}
        <div className="rounded-[1.25rem] p-5" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <h3 className="font-bold mb-3 text-sm" style={{ fontFamily: "Fraunces, serif", color: "#10b981" }}>
            🎯 Target Color
          </h3>
          <div
            className="rounded-[0.75rem] h-24 mb-3 flex items-center justify-center text-3xl font-bold"
            style={{
              background: submitted ? toHex(target.color) : toHex(target.color),
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {target.emoji}
          </div>
          <div className="text-center font-bold" style={{ color: "var(--ink)" }}>
            {target.name}
          </div>
          {submitted && (
            <div className="text-center text-xs mt-1" style={{ color: "var(--muted)" }}>
              RGB({target.color.r}, {target.color.g}, {target.color.b})
            </div>
          )}
        </div>

        {/* Your mix */}
        <div className="rounded-[1.25rem] p-5" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <h3 className="font-bold mb-3 text-sm" style={{ fontFamily: "Fraunces, serif", color: "#10b981" }}>
            🖌️ Your Mix
          </h3>
          <div
            className="rounded-[0.75rem] h-24 mb-3 transition-all duration-150"
            style={{
              background: toHex(mixed),
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
          <div className="text-center text-xs font-mono" style={{ color: "var(--muted)" }}>
            RGB({r}, {g}, {b}) · {toHex(mixed)}
          </div>
        </div>
      </div>

      {/* Sliders */}
      {!submitted && (
        <div className="mt-6 rounded-[1.25rem] p-5" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <div className="flex flex-col gap-4">
            {sliders.map(({ label, value, set, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span style={{ color }}>{label}</span>
                  <span style={{ color: "var(--muted)" }}>{value}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: color }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={submit}
            className="mt-5 w-full py-3 rounded-[0.75rem] font-bold text-white text-lg"
            style={{ background: "#10b981" }}
          >
            🎯 Submit Mix!
          </button>
        </div>
      )}

      {/* Result */}
      {submitted && (
        <div
          className="mt-6 rounded-[1.25rem] p-6 text-center"
          style={{
            background: scoreToStars(diff) === 3 ? "#f0fdf4" : scoreToStars(diff) === 2 ? "#fffbeb" : "#fef2f2",
            border: `2px solid ${scoreToStars(diff) === 3 ? "#16a34a" : scoreToStars(diff) === 2 ? "#d97706" : "#dc2626"}33`,
          }}
        >
          <div className="text-4xl mb-2">
            {"⭐".repeat(scoreToStars(diff))}{"☆".repeat(3 - scoreToStars(diff))}
          </div>
          <div className="font-bold text-xl mb-1" style={{ fontFamily: "Fraunces, serif" }}>
            {scoreToStars(diff) === 3 ? "Perfect Match! 🎉" : scoreToStars(diff) === 2 ? "Great Job! 😊" : scoreToStars(diff) === 1 ? "Not Bad! 👍" : "Keep Practicing! 💪"}
          </div>
          <div className="text-sm mb-1" style={{ color: "var(--muted)" }}>
            Accuracy: {accuracy}% · Difference: {Math.round(diff)}
          </div>
          <div className="text-sm font-bold mb-4" style={{ color: "#10b981" }}>
            +{scoreToStars(diff) * 10} points
          </div>
          <button
            onClick={next}
            className="px-6 py-3 rounded-[0.75rem] font-bold text-white"
            style={{ background: "#10b981" }}
          >
            Next Color →
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "Fraunces, serif", color: "var(--muted)" }}>
            Recent Rounds
          </h3>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <div
                key={i}
                className="rounded-[0.75rem] px-3 py-2 text-xs font-medium"
                style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--muted)" }}
              >
                {h.name}: {"⭐".repeat(h.stars)}{"☆".repeat(3 - h.stars)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
