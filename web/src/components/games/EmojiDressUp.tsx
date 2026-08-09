import { useState } from "react";

const CATEGORIES = {
  Hair: ["👱‍♀️", "👩", "👩‍🦰", "👩‍🦱", "👩‍🦳", "🧑‍🦲", "💇‍♀️", "👸"],
  Top: ["👚", "👕", "🧥", "👗", "🥻", "👘", "🩱", "🎽"],
  Bottom: ["👖", "🩲", "🩳", "👙", "🩴", "🧣", "🩰", "🩺"],
  Shoes: ["👟", "👠", "👡", "👢", "🥿", "🩴", "👞", "🥾"],
  Accessories: ["👜", "💍", "💄", "🕶️", "🎀", "💎", "👒", "🌂"],
  Mood: ["😊", "😎", "🥳", "😍", "🤩", "😜", "🥰", "✨"],
};

type Category = keyof typeof CATEGORIES;

export function EmojiDressUp() {
  const [outfit, setOutfit] = useState<Record<Category, string>>({
    Hair: "👱‍♀️",
    Top: "👗",
    Bottom: "👖",
    Shoes: "👟",
    Accessories: "🎀",
    Mood: "😊",
  });
  const [activeCategory, setActiveCategory] = useState<Category>("Hair");
  const [saved, setSaved] = useState<Record<Category, string>[]>(() => {
    try { return JSON.parse(localStorage.getItem("glowplay_outfits") || "[]"); } catch { return []; }
  });

  const saveOutfit = () => {
    const newSaved = [outfit, ...saved].slice(0, 6);
    setSaved(newSaved);
    localStorage.setItem("glowplay_outfits", JSON.stringify(newSaved));
  };

  const randomize = () => {
    const random: Record<string, string> = {};
    for (const [cat, items] of Object.entries(CATEGORIES)) {
      random[cat] = items[Math.floor(Math.random() * items.length)];
    }
    setOutfit(random as Record<Category, string>);
  };

  return (
    <div>
      {/* Avatar display */}
      <div
        className="rounded-[1.25rem] p-6 text-center mb-6"
        style={{ background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)", border: "2px solid #ec489922" }}
      >
        <div className="text-7xl mb-2">{outfit.Hair}</div>
        <div className="flex justify-center gap-2 text-5xl flex-wrap">
          <span>{outfit.Top}</span>
          <span>{outfit.Bottom}</span>
        </div>
        <div className="flex justify-center gap-2 text-4xl mt-2 flex-wrap">
          <span>{outfit.Shoes}</span>
          <span>{outfit.Accessories}</span>
          <span>{outfit.Mood}</span>
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={randomize}
            className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold text-white"
            style={{ background: "#ec4899" }}
          >
            🎲 Randomize
          </button>
          <button
            onClick={saveOutfit}
            className="px-4 py-2 rounded-[0.75rem] text-sm font-semibold text-white"
            style={{ background: "#a855f7" }}
          >
            💾 Save Look
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-[0.75rem] text-sm font-semibold transition"
            style={{
              background: activeCategory === cat ? "#ec4899" : "var(--panel)",
              color: activeCategory === cat ? "white" : "var(--ink)",
              border: "1px solid var(--line)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Emoji picker */}
      <div
        className="rounded-[1.25rem] p-4 grid grid-cols-4 gap-3 mb-6"
        style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
      >
        {CATEGORIES[activeCategory].map((emoji) => (
          <button
            key={emoji}
            onClick={() => setOutfit((prev) => ({ ...prev, [activeCategory]: emoji }))}
            className="text-4xl p-2 rounded-[0.75rem] transition hover:scale-110 active:scale-95"
            style={{
              background: outfit[activeCategory] === emoji ? "#fdf2f8" : "transparent",
              border: outfit[activeCategory] === emoji ? "2px solid #ec4899" : "2px solid transparent",
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Saved looks */}
      {saved.length > 0 && (
        <div>
          <h3 className="font-bold mb-3" style={{ fontFamily: "Fraunces, serif", color: "#ec4899" }}>
            💾 Saved Looks
          </h3>
          <div className="flex gap-3 flex-wrap">
            {saved.map((look, i) => (
              <button
                key={i}
                onClick={() => setOutfit(look)}
                className="rounded-[1.25rem] p-3 text-center hover:scale-105 transition"
                style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
              >
                <div className="text-2xl">{look.Hair}</div>
                <div className="text-xl">{look.Top}{look.Accessories}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
