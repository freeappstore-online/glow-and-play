import { useState, useRef } from "react";

const ANSWERS = [
  { text: "It is certain! ✨", type: "yes" },
  { text: "Definitely YES! 💖", type: "yes" },
  { text: "Without a doubt! 🌟", type: "yes" },
  { text: "Yes, absolutely! 🦄", type: "yes" },
  { text: "Signs point to YES! 🎀", type: "yes" },
  { text: "You can rely on it! 💫", type: "yes" },
  { text: "As I see it, yes! 🌸", type: "yes" },
  { text: "Most likely YES! 🍀", type: "yes" },
  { text: "Outlook is good! ☀️", type: "yes" },
  { text: "Yes! Go for it! 🚀", type: "yes" },
  { text: "Reply hazy... try again 🌫️", type: "maybe" },
  { text: "Ask again later 🔄", type: "maybe" },
  { text: "Better not tell you now 🤫", type: "maybe" },
  { text: "Cannot predict now ⏳", type: "maybe" },
  { text: "Concentrate and ask again 🧘", type: "maybe" },
  { text: "Don't count on it 😬", type: "no" },
  { text: "My reply is no 🙅‍♀️", type: "no" },
  { text: "My sources say NO ❌", type: "no" },
  { text: "Outlook not so good 🌧️", type: "no" },
  { text: "Very doubtful... 💭", type: "no" },
];

const QUESTION_PROMPTS = [
  "Will I become famous? 🌟",
  "Does my crush like me? 💕",
  "Will I ace my next test? 📚",
  "Should I get a pet? 🐱",
  "Will today be amazing? ✨",
  "Will I travel somewhere cool? ✈️",
];

export function Magic8Ball() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<typeof ANSWERS[0] | null>(null);
  const [shaking, setShaking] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: typeof ANSWERS[0] }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const shake = () => {
    if (!question.trim() || shaking) return;
    setShaking(true);
    setAnswer(null);
    setTimeout(() => {
      const ans = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      setAnswer(ans);
      setShaking(false);
      setHistory((h) => [{ q: question, a: ans }, ...h].slice(0, 5));
    }, 1000);
  };

  const colorMap = { yes: "#16a34a", maybe: "#d97706", no: "#dc2626" };
  const bgMap = { yes: "#f0fdf4", maybe: "#fffbeb", no: "#fef2f2" };

  return (
    <div>
      {/* 8 Ball */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`relative w-52 h-52 rounded-full flex items-center justify-center mb-6 transition-all duration-200 ${shaking ? "animate-bounce" : ""}`}
          style={{
            background: "radial-gradient(circle at 35% 35%, #4a4a4a, #000000)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 -4px 12px rgba(255,255,255,0.1)",
          }}
        >
          {/* Inner circle */}
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center p-3 text-center"
            style={{
              background: answer
                ? bgMap[answer.type as keyof typeof bgMap]
                : "rgba(255,255,255,0.08)",
              transition: "all 0.5s ease",
            }}
          >
            {shaking ? (
              <span className="text-3xl animate-spin">🔮</span>
            ) : answer ? (
              <span
                className="text-xs font-bold leading-tight"
                style={{ color: colorMap[answer.type as keyof typeof colorMap] }}
              >
                {answer.text}
              </span>
            ) : (
              <span className="text-white text-3xl font-bold opacity-40" style={{ fontFamily: "Fraunces, serif" }}>8</span>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="w-full max-w-sm flex gap-2">
          <input
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && shake()}
            placeholder="Ask the Magic 8 Ball..."
            className="flex-1 px-4 py-3 rounded-[0.75rem] text-sm font-medium outline-none"
            style={{
              background: "var(--panel)",
              border: "2px solid #a855f7",
              color: "var(--ink)",
            }}
          />
          <button
            onClick={shake}
            disabled={!question.trim() || shaking}
            className="px-5 py-3 rounded-[0.75rem] font-bold text-white transition"
            style={{
              background: question.trim() && !shaking ? "#a855f7" : "var(--line)",
              color: question.trim() && !shaking ? "white" : "var(--muted)",
            }}
          >
            🔮 Ask
          </button>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {QUESTION_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => { setQuestion(p); inputRef.current?.focus(); }}
              className="text-xs px-3 py-1.5 rounded-full transition hover:opacity-80"
              style={{ background: "#f5f3ff", color: "#a855f7", border: "1px solid #a855f733" }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="font-bold mb-3" style={{ fontFamily: "Fraunces, serif", color: "#a855f7" }}>
            📜 Recent Questions
          </h3>
          <div className="flex flex-col gap-2">
            {history.map((item, i) => (
              <div
                key={i}
                className="rounded-[0.75rem] p-3 flex items-start gap-3"
                style={{ background: bgMap[item.a.type as keyof typeof bgMap], border: `1px solid ${colorMap[item.a.type as keyof typeof colorMap]}22` }}
              >
                <span className="text-xl">🔮</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{item.q}</div>
                  <div className="text-xs mt-0.5 font-bold" style={{ color: colorMap[item.a.type as keyof typeof colorMap] }}>
                    {item.a.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
