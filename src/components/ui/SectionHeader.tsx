"use client";

import { useTheme } from "@/lib/theme";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeader({ label, title, subtitle, center }: SectionHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={center ? "text-center" : ""}>
      <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
        <div style={{ width: 20, height: 1, background: "var(--color-primary)", opacity: 0.6 }} />
        <p
          className="text-[11px] font-semibold tracking-[5px] uppercase"
          style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}
        >
          {label}
        </p>
      </div>
      <h2
        className="text-[36px] md:text-[42px] font-extrabold tracking-tight mb-4"
        style={{
          fontFamily: "var(--font-display)",
          backgroundImage: isDark
            ? "linear-gradient(180deg, #f1f5f9 40%, #64748b 100%)"
            : "linear-gradient(180deg, #0f172a 40%, #475569 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
