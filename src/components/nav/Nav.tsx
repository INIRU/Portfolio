"use client";

import { useEffect, useRef } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useTheme } from "@/lib/theme";
import { gsap } from "@/lib/gsap-init";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const hidden = useScrollDirection();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 opacity-0"
      style={{
        transform: `translateX(-50%) translateY(${hidden ? "-120%" : "0"})`,
        transition: "transform 0.3s ease",
      }}
    >
      <div
        className="flex items-center gap-0.5 px-1.5 py-1.5 rounded-full"
        style={{
          background: theme === "dark" ? "rgba(4, 8, 16, 0.7)" : "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(24px) saturate(1.5)",
          border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: theme === "dark"
            ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.03)"
            : "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-4 py-2 text-[13px] font-bold tracking-wide"
          style={{ color: theme === "dark" ? "#f1f5f9" : "#0f172a", fontFamily: "var(--font-display)" }}
        >
          INIRU
        </a>

        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => scrollTo(e, item.href)}
            className="px-3.5 py-2 text-[12px] font-medium rounded-full transition-all duration-200"
            style={{ color: theme === "dark" ? "#64748b" : "#64748b", fontFamily: "var(--font-display)" }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = theme === "dark" ? "#e2e8f0" : "#0f172a";
              (e.target as HTMLElement).style.background = theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "#64748b";
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            {item.label}
          </a>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="px-2.5 py-2 rounded-full transition-all duration-200"
          style={{ color: theme === "dark" ? "#64748b" : "#94a3b8" }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = theme === "dark" ? "#e2e8f0" : "#0f172a";
            (e.target as HTMLElement).style.background = theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = theme === "dark" ? "#64748b" : "#94a3b8";
            (e.target as HTMLElement).style.background = "transparent";
          }}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <a
          href="#contact"
          onClick={(e) => scrollTo(e, "#contact")}
          className="px-4 py-2 text-[12px] font-semibold rounded-full transition-all duration-200"
          style={{
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.2)",
            color: "#60a5fa",
            fontFamily: "var(--font-display)",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "rgba(59,130,246,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "rgba(59,130,246,0.15)";
          }}
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
