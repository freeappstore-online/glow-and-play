import { useState } from "react";

interface Question {
  q: string;
  options: { text: string; type: string }[];
}

const QUESTIONS: Question[] = [
  {
    q: "What's your ideal Friday night? 🌙",
    options: [
      { text: "Dance party with all my friends! 💃", type: "phoenix" },
      { text: "Cozy movie night at home 🎬", type: "dragon" },
      { text: "Star-gazing in the backyard ⭐", type: "unicorn" },
      { text: "Exploring somewhere mysterious 🗺️", type: "mermaid" },
    ],
  },
  {
    q: "Choose your dream superpower! ✨",
    options: [
      { text: "Flying through the sky 🦋", type: "phoenix" },
      { text: "Reading minds 🧠", type: "dragon" },
      { text: "Making wishes come true 🌟", type: "unicorn" },
      { text: "Breathing underwater 🌊", type: "mermaid" },
    ],
  },
  {
    q: "What's your go-to accessory? 💫",
    options: [
      { text: "Bold statement earrings 🔥", type: "phoenix" },
      { text: "Vintage leather jacket 🖤", type: "dragon" },
      { text: "Sparkly glitter headband ✨", type: "unicorn" },
      { text: "Shell necklace 🐚", type: "mermaid" },
    ],
  },
  {
    q: "Pick your dream vacation! 🌍",
    options: [
      { text: "Volcano hiking in Hawaii 🌋", type: "phoenix" },
      { text: "Ancient castle in Scotland 🏰", type: "dragon" },
      { text: "Enchanted forest in Ireland 🍀", type: "unicorn" },
      { text: "Tropical coral reef diving 🐠", type: "mermaid" },
    ],
  },
  {
    q: "Your fave school subject is... 📚",
    options: [
      { text: "Drama / Theatre 🎭", type: "phoenix" },
      { text: "Science & Biology 🔬", type: "dragon" },
      { text: "Art & Music 🎨", type: "unicorn" },
      { text: "Geography & Nature 🌿", type: "mermaid" },
    ],
  },
  {
    q: "What's your vibe in the morning? ☀️",
    options: [
      { text: "Bursting with energy! 🔥", type: "phoenix" },
      { text: "Slow and thoughtful 🐢", type: "dragon" },
      { text: "Happy and humming 🎵", type: "unicorn" },
      { text: "Dreamy and floaty 💭", type: "mermaid" },
    ],
  },
];

const RESULTS = {
  phoenix: {
    name: "Phoenix",
    emoji: "🔥",
    color: "#f97316",
    bg: "#fff7ed",
    desc: "You're fierce, passionate, and unstoppable! Like the Phoenix, you rise from any challenge stronger than before. You're a natural leader who lights up every room. Your fire inspires everyone around you! 🔥✨",
    traits: ["Fearless", "Creative", "Inspiring", "Bold"],
  },
  dragon: {
    name: "Dragon",
    emoji: "🐉",
    color: "#7c3aed",
    bg: "#f5f3ff",
    desc: "Wise, powerful, and fiercely loyal — you're a Dragon! You see through everything with sharp eyes and a brilliant mind. People trust you because you're honest and real. Your strength comes from within! 🐉💜",
    traits: ["Wise", "Loyal", "Strong", "Mysterious"],
  },
  unicorn: {
    name: "Unicorn",
    emoji: "🦄",
    color: "#ec4899",
    bg: "#fdf2f8",
    desc: "Pure magic — that's you! You're a Unicorn through and through: kind, sparkly, and totally one-of-a-kind. You make the world more beautiful just by being in it. Your positivity is your superpower! 🦄💕",
    traits: ["Kind", "Creative", "Unique", "Magical"],
  },
  mermaid: {
    name: "Mermaid",
    emoji: "🧜‍♀️",
    color: "#06b6d4",
    bg: "#ecfeff",
    desc: "Mysterious, free-spirited, and deeply connected to the world around you — you're a Mermaid! You feel things deeply and have an amazing sense of adventure. You're drawn to beauty in unexpected places! 🧜‍♀️🌊",
    traits: ["Adventurous", "Empathetic", "Free", "Dreamy"],
  },
};

export function UnicornQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ phoenix: 0, dragon: 0, unicorn: 0, mermaid: 0 });
  const [result, setResult] = useState<keyof typeof RESULTS | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const answer = (type: string, idx: number) => {
    setSelected(idx);
    setTimeout(() => {
      const newScores = { ...scores, [type]: scores[type] + 1 };
      setScores(newScores);
      if (currentQ + 1 >= QUESTIONS.length) {
        const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof RESULTS;
        setResult(winner);
      } else {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      }
    }, 500);
  };

  const restart = () => {
    setCurrentQ(0);
    setScores({ phoenix: 0, dragon: 0, unicorn: 0, mermaid: 0 });
    setResult(null);
    setSelected(null);
  };

  if (result) {
    const r = RESULTS[result];
    return (
      <div>
        <div
          className="rounded-[1.25rem] p-8 text-center mb-6"
          style={{ background: r.bg, border: `2px solid ${r.color}33` }}
        >
          <div className="text-7xl mb-4">{r.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: r.color }}>
            You're a {r.name}!
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#374151" }}>
            {r.desc}
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {r.traits.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ background: r.color + "22", color: r.color }}
              >
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={restart}
            className="px-6 py-3 rounded-[0.75rem] font-bold text-white"
            style={{ background: r.color }}
          >
            🔄 Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #ec4899, #a855f7)" }}
          />
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          {currentQ + 1}/{QUESTIONS.length}
        </span>
      </div>

      {/* Question */}
      <div
        className="rounded-[1.25rem] p-6 mb-6"
        style={{ background: "linear-gradient(135deg, #fdf2f8, #f5f3ff)", border: "1px solid #ec489922" }}
      >
        <h2
          className="text-xl font-bold text-center"
          style={{ fontFamily: "Fraunces, serif", color: "#a855f7" }}
        >
          {q.q}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(opt.type, i)}
            disabled={selected !== null}
            className="p-4 rounded-[0.75rem] text-left font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: selected === i ? "#f5f3ff" : "var(--panel)",
              border: `2px solid ${selected === i ? "#a855f7" : "var(--line)"}`,
              color: selected === i ? "#a855f7" : "var(--ink)",
              cursor: selected !== null ? "default" : "pointer",
            }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
