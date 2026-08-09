import { useState, useEffect } from "react";

interface Upgrade {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  cost: number;
  cps: number; // cupcakes per second
  count: number;
}

const INITIAL_UPGRADES: Upgrade[] = [
  { id: "oven", name: "Mini Oven", emoji: "🔥", desc: "+1 cupcake/sec", cost: 15, cps: 1, count: 0 },
  { id: "mixer", name: "Mixer", emoji: "🥄", desc: "+5 cupcakes/sec", cost: 100, cps: 5, count: 0 },
  { id: "bakery", name: "Bakery", emoji: "🏪", desc: "+20 cupcakes/sec", cost: 500, cps: 20, count: 0 },
  { id: "factory", name: "Cupcake Factory", emoji: "🏭", desc: "+100 cupcakes/sec", cost: 2000, cps: 100, count: 0 },
  { id: "magic", name: "Magic Wand", emoji: "🪄", desc: "+500 cupcakes/sec", cost: 10000, cps: 500, count: 0 },
];

interface SaveData {
  cupcakes: number;
  totalBaked: number;
  upgrades: Upgrade[];
}

function loadSave(): SaveData {
  try {
    const d = JSON.parse(localStorage.getItem("glowplay_cupcake") || "null");
    if (d) return d;
  } catch {}
  return { cupcakes: 0, totalBaked: 0, upgrades: INITIAL_UPGRADES };
}

const FLOATING = ["✨", "🧁", "💖", "⭐", "🌸"];

interface FloatParticle { id: number; x: number; y: number; text: string }

export function CupcakeClicker() {
  const [data, setData] = useState<SaveData>(loadSave);
  const [clickPower, setClickPower] = useState(1);
  const [particles, setParticles] = useState<FloatParticle[]>([]);
  const [bigClick, setBigClick] = useState(false);
  let particleId = 0;

  // Auto-save
  useEffect(() => {
    const t = setInterval(() => {
      localStorage.setItem("glowplay_cupcake", JSON.stringify(data));
    }, 3000);
    return () => clearInterval(t);
  }, [data]);

  // CPS ticker
  useEffect(() => {
    const cps = data.upgrades.reduce((sum, u) => sum + u.cps * u.count, 0);
    if (cps === 0) return;
    const t = setInterval(() => {
      setData((d) => ({
        ...d,
        cupcakes: d.cupcakes + cps / 10,
        totalBaked: d.totalBaked + cps / 10,
      }));
    }, 100);
    return () => clearInterval(t);
  }, [data.upgrades]);

  // Click power based on upgrades
  useEffect(() => {
    const cp = 1 + Math.floor(data.upgrades.reduce((s, u) => s + u.count * 0.5, 0));
    setClickPower(cp);
  }, [data.upgrades]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setData((d) => ({
      ...d,
      cupcakes: d.cupcakes + clickPower,
      totalBaked: d.totalBaked + clickPower,
    }));
    setBigClick(true);
    setTimeout(() => setBigClick(false), 100);
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const p: FloatParticle = {
      id: particleId++,
      x: px,
      y: py,
      text: FLOATING[Math.floor(Math.random() * FLOATING.length)],
    };
    setParticles((prev) => [...prev, p]);
    setTimeout(() => setParticles((prev) => prev.filter((x) => x.id !== p.id)), 1000);
  };

  const buyUpgrade = (id: string) => {
    setData((d) => {
      const upg = d.upgrades.find((u) => u.id === id);
      if (!upg || d.cupcakes < upg.cost) return d;
      return {
        ...d,
        cupcakes: d.cupcakes - upg.cost,
        upgrades: d.upgrades.map((u) =>
          u.id === id ? { ...u, count: u.count + 1, cost: Math.ceil(u.cost * 1.15) } : u
        ),
      };
    });
  };

  const reset = () => {
    const fresh = { cupcakes: 0, totalBaked: 0, upgrades: INITIAL_UPGRADES };
    setData(fresh);
    localStorage.setItem("glowplay_cupcake", JSON.stringify(fresh));
  };

  const cps = data.upgrades.reduce((sum, u) => sum + u.cps * u.count, 0);
  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
    n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` :
    Math.floor(n).toString();

  return (
    <div>
      {/* Stats */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="rounded-[0.75rem] px-4 py-2 font-bold" style={{ background: "#fff7ed", color: "#f97316" }}>
          🧁 {fmt(data.cupcakes)} cupcakes
        </div>
        <div className="rounded-[0.75rem] px-4 py-2 text-sm font-medium" style={{ background: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}>
          {cps}/sec · {fmt(data.totalBaked)} total
        </div>
      </div>

      <div className="flex gap-6 flex-col sm:flex-row">
        {/* Big cupcake button */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <button
              onClick={handleClick}
              className="text-8xl transition-transform select-none"
              style={{
                transform: bigClick ? "scale(0.92)" : "scale(1)",
                background: "none",
                border: "none",
                cursor: "pointer",
                filter: "drop-shadow(0 4px 12px rgba(249,115,22,0.4))",
              }}
            >
              🧁
            </button>
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute text-xl pointer-events-none animate-bounce"
                style={{
                  left: p.x,
                  top: p.y,
                  transform: "translate(-50%,-50%)",
                  animation: "floatUp 1s ease-out forwards",
                }}
              >
                {p.text}
              </div>
            ))}
          </div>
          <div className="text-sm font-semibold" style={{ color: "#f97316" }}>
            +{clickPower} per tap 👆
          </div>
          <button
            onClick={reset}
            className="text-xs px-3 py-1.5 rounded-[0.75rem]"
            style={{ background: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}
          >
            Reset
          </button>
        </div>

        {/* Upgrades */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="font-bold mb-1" style={{ fontFamily: "Fraunces, serif", color: "#f97316" }}>
            🛒 Upgrades
          </h3>
          {data.upgrades.map((upg) => (
            <button
              key={upg.id}
              onClick={() => buyUpgrade(upg.id)}
              disabled={data.cupcakes < upg.cost}
              className="flex items-center gap-3 p-3 rounded-[0.75rem] text-left transition hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: data.cupcakes >= upg.cost ? "#fff7ed" : "var(--panel)",
                border: `1px solid ${data.cupcakes >= upg.cost ? "#f97316" : "var(--line)"}`,
                opacity: data.cupcakes < upg.cost ? 0.6 : 1,
                cursor: data.cupcakes < upg.cost ? "not-allowed" : "pointer",
              }}
            >
              <span className="text-3xl">{upg.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-sm" style={{ color: "#f97316" }}>
                  {upg.name} {upg.count > 0 && <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full ml-1">x{upg.count}</span>}
                </div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{upg.desc}</div>
              </div>
              <div className="font-bold text-sm" style={{ color: "#f97316" }}>
                🧁 {fmt(upg.cost)}
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -200%); }
        }
      `}</style>
    </div>
  );
}
