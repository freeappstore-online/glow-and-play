import { useState, type ReactNode } from "react";

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
}

interface ShellProps {
  children: ReactNode;
  navItems?: NavItem[];
  title?: string;
}

export function Shell({ children, navItems = [], title = "Glow & Play" }: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleDockItems = navItems.slice(0, 5);

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen">
        <aside
          className="flex flex-col border-r h-full shrink-0 overflow-y-auto"
          style={{ width: "17rem", borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <div className="p-6 font-bold text-xl" style={{ fontFamily: "Fraunces, serif", color: "#a855f7" }}>
            ✨ {title}
          </div>
          <nav className="flex-1 px-3 pb-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[0.75rem] text-sm font-medium text-left transition-all"
                style={{
                  background: item.active ? "#f5f3ff" : "transparent",
                  color: item.active ? "#a855f7" : "var(--ink)",
                  fontWeight: item.active ? 700 : 500,
                }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 text-xs" style={{ color: "var(--muted)" }}>
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--muted)" }}
            >
              Part of FreeAppStore — free forever
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center justify-between px-4 h-14 border-b shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <span className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "#a855f7" }}>
            ✨ {title}
          </span>
          {navItems.length > 5 && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl"
              style={{ color: "var(--ink)" }}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          )}
        </header>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            className="border-b px-3 py-2 flex flex-col gap-1 shrink-0"
            style={{ borderColor: "var(--line)", background: "var(--panel)" }}
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-[0.75rem] text-sm font-medium text-left"
                style={{
                  background: item.active ? "#f5f3ff" : "transparent",
                  color: item.active ? "#a855f7" : "var(--ink)",
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-auto p-4">{children}</main>

        {/* Bottom dock - show first 5 items */}
        <nav
          className="flex items-center justify-around h-16 border-t shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--dock)" }}
        >
          {visibleDockItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex flex-col items-center gap-0.5 px-2"
              style={{ color: item.active ? "#a855f7" : "var(--muted)" }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium truncate max-w-[4rem]">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
