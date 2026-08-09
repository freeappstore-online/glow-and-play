import { useState } from "react";

const COLORS = [
  "#ff6b9d", "#ff8fab", "#ffb3c6", "#ffc8dd",
  "#c77dff", "#9d4edd", "#7b2d8b", "#e040fb",
  "#ff6b6b", "#ff9f43", "#ffd43b", "#69db7c",
  "#4dabf7", "#74c0fc", "#a9e34b", "#ffffff",
  "#1a1a2e", "#16213e", "#0f3460", "#e94560",
  "#f8bbd9", "#ce93d8", "#80deea", "#a5d6a7",
];

const NAIL_ART = [
  { label: "Plain", pattern: "" },
  { label: "Glitter ✨", pattern: "✨" },
  { label: "Stars 🌟", pattern: "🌟" },
  { label: "Hearts 💕", pattern: "💕" },
  { label: "Flowers 🌸", pattern: "🌸" },
  { label: "Dots", pattern: "●" },
  { label: "Stripes", pattern: "▬" },
  { label: "Bows 🎀", pattern: "🎀" },
  { label: "Gems 💎", pattern: "💎" },
  { label: "Moon 🌙", pattern: "🌙" },
];

const NAIL_SHAPES = ["rounded", "square", "oval", "stiletto"];

interface NailState {
  color: string;
  art: string;
}

const DEFAULT_NAILS: NailState[] = Array(10).fill(null).map(() => ({ color: "#ff6b9d", art: "" }));

export function NailArt() {
  const [nails, setNails] = useState<NailState[]>(DEFAULT_NAILS);
  const [selectedColor, setSelectedColor] = useState("#ff6b9d");
  const [selectedArt, setSelectedArt] = useState("");
  const [selectedNail, setSelectedNail] = useState<number | null>(null);
  const [shape, setShape] = useState("rounded");
  const [applyAll, setApplyAll] = useState(false);

  const applyToNail = (index: number) => {
    if (applyAll) {
      setNails(nails.map(() => ({ color: selectedColor, art: selectedArt })));
    } else {
      const updated = [...nails];
      updated[index] = { color: selectedColor, art: selectedArt };
      setNails(updated);
      setSelectedNail(index);
    }
  };

  const randomize = () => {
    setNails(
      Array(10).fill(null).map(() => ({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        art: NAIL_ART[Math.floor(Math.random() * NAIL_ART.length)].pattern,
      }))
    );
  };

  const reset = () => setNails(DEFAULT_NAILS);

  const getNailStyle = (shape: string) => {
    switch (shape) {
      case "square": return "0.25rem";
      case "oval": return "50% 50% 40% 40% / 60% 60% 40% 40%";
      case "stiletto": return "50% 50% 30% 30% / 80% 80% 20% 20%";
      default: return "0.75rem 0.75rem 0.5rem 0.5rem";
    }
  };

  const Hand = ({ start, label }: { start: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>{label}</div>
      <div className="flex gap-2 items-end">
        {[0, 1, 2, 3, 4].map((i) => {
          const idx = start + i;
          const heights = [48, 60, 64, 58, 44];
          const widths = [22, 26, 28, 26, 20];
          return (
            <button
              key={idx}
              onClick={() => applyToNail(idx)}
              className="relative flex flex-col items-center transition hover:scale-110 active:scale-95"
              style={{ gap: "2px" }}
            >
              {/* Nail */}
              <div
                style={{
                  width: `${widths[i]}px`,
                  height: `${heights[i] * 0.45}px`,
                  background: nails[idx].color,
                  borderRadius: getNailStyle(shape),
                  border: selectedNail === idx ? "2px solid #a855f7" : "1px solid rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3)",
                  transition: "all 0.2s",
                }}
              >
                {nails[idx].art && <span style={{ fontSize: "9px" }}>{nails[idx].art}</span>}
              </div>
              {/* Finger */}
              <div
                style={{
                  width: `${widths[i]}px`,
                  height: `${heights[i]}px`,
                  background: "linear-gradient(180deg, #fdbcb4, #f4a29a)",
                  borderRadius: "0.5rem 0.5rem 0.25rem 0.25rem",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {/* Hands display */}
      <div
        className="rounded-[1.25rem] p-6 mb-6 flex justify-center gap-8 flex-wrap"
        style={{ background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)", border: "2px solid #ec489922" }}
      >
        <Hand start={0} label="Left Hand 🤚" />
        <Hand start={5} label="Right Hand 🤚" />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Color picker */}
        <div className="rounded-[1.25rem] p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <h3 className="font-bold mb-3 text-sm" style={{ fontFamily: "Fraunces, serif", color: "#db2777" }}>
            🎨 Pick Color
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className="rounded-full transition hover:scale-110"
                style={{
                  width: "28px",
                  height: "28px",
                  background: c,
                  border: selectedColor === c ? "3px solid #a855f7" : "2px solid rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Art picker */}
        <div className="rounded-[1.25rem] p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <h3 className="font-bold mb-3 text-sm" style={{ fontFamily: "Fraunces, serif", color: "#db2777" }}>
            ✨ Nail Art
          </h3>
          <div className="flex flex-wrap gap-2">
            {NAIL_ART.map((art) => (
              <button
                key={art.label}
                onClick={() => setSelectedArt(art.pattern)}
                className="px-2 py-1 rounded-[0.5rem] text-xs font-medium transition"
                style={{
                  background: selectedArt === art.pattern ? "#fdf2f8" : "var(--paper)",
                  border: `1px solid ${selectedArt === art.pattern ? "#ec4899" : "var(--line)"}`,
                  color: selectedArt === art.pattern ? "#ec4899" : "var(--ink)",
                }}
              >
                {art.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shape + Options */}
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>Shape:</span>
          {NAIL_SHAPES.map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className="px-3 py-1 rounded-[0.75rem] text-xs font-semibold capitalize transition"
              style={{
                background: shape === s ? "#db2777" : "var(--panel)",
                color: shape === s ? "white" : "var(--ink)",
                border: "1px solid var(--line)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={applyAll}
            onChange={(e) => setApplyAll(e.target.checked)}
            className="w-4 h-4 accent-pink-500"
          />
          <span style={{ color: "var(--ink)" }}>Apply to all nails</span>
        </label>
        <button
          onClick={randomize}
          className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold text-white ml-auto"
          style={{ background: "#a855f7" }}
        >
          🎲 Random
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold"
          style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-xs text-center" style={{ color: "var(--muted)" }}>
        💡 Pick a color & art, then tap a nail to apply!
      </p>
    </div>
  );
}
