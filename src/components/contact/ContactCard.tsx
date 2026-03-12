"use client";

import type { Contact } from "@/lib/types";
import { useTheme } from "@/lib/theme";
import { Mail, GithubIcon, MessageCircle } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  email: Mail,
  github: GithubIcon,
  discord: MessageCircle,
};

const themeMapDark: Record<string, { accent: string; bg: string; border: string }> = {
  email:   { accent: "#60a5fa", bg: "rgba(59,130,246,0.06)",  border: "rgba(59,130,246,0.1)" },
  github:  { accent: "#e2e8f0", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.06)" },
  discord: { accent: "#818cf8", bg: "rgba(99,102,241,0.06)",  border: "rgba(99,102,241,0.1)" },
};

const themeMapLight: Record<string, { accent: string; bg: string; border: string }> = {
  email:   { accent: "#2563eb", bg: "rgba(59,130,246,0.06)",  border: "rgba(59,130,246,0.12)" },
  github:  { accent: "#1e293b", bg: "rgba(0,0,0,0.03)",       border: "rgba(0,0,0,0.06)" },
  discord: { accent: "#6366f1", bg: "rgba(99,102,241,0.06)",  border: "rgba(99,102,241,0.12)" },
};

export default function ContactCard({ contact }: { contact: Contact }) {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const descriptions: Record<string, string> = {
    email: "프로젝트 제안이나 협업 문의는 이메일로",
    github: "오픈소스 프로젝트와 코드를 확인하세요",
    discord: "가볍게 대화하고 싶다면",
  };

  const isLink = contact.value.startsWith("http") || contact.value.startsWith("mailto:");
  const IconComponent = iconMap[contact.type];
  const map = isDark ? themeMapDark : themeMapLight;
  const colorTheme = map[contact.type] || map.email;

  return (
    <a
      href={isLink ? contact.value : undefined}
      target={isLink ? "_blank" : undefined}
      rel={isLink ? "noopener noreferrer" : undefined}
      className="contact-card group block p-8 rounded-[18px] text-center transition-all duration-300 cursor-pointer"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colorTheme.border;
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.background = colorTheme.bg;
        e.currentTarget.style.boxShadow = isDark
          ? `0 20px 50px rgba(0,0,0,0.2), 0 0 30px ${colorTheme.bg}`
          : `0 20px 50px rgba(0,0,0,0.06), 0 0 30px ${colorTheme.bg}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "var(--color-surface)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="w-12 h-12 rounded-[14px] mx-auto mb-5 flex items-center justify-center transition-all duration-300"
        style={{ background: colorTheme.bg, border: `1px solid ${colorTheme.border}` }}
      >
        {IconComponent ? (
          <span className="transition-transform duration-300 group-hover:scale-110 inline-flex" style={{ color: colorTheme.accent }}>
            <IconComponent size={20} />
          </span>
        ) : (
          <span className="text-[14px] font-extrabold" style={{ color: colorTheme.accent }}>
            {contact.type.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <h3 className="text-[16px] font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
        {contact.label}
      </h3>
      <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--color-text-muted)" }}>
        {descriptions[contact.type] || ""}
      </p>
      <span
        className="text-[12px] font-semibold inline-flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2.5"
        style={{ color: colorTheme.accent }}
      >
        {contact.type === "discord"
          ? contact.label
          : contact.value.replace("mailto:", "").replace("https://", "")}
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
      </span>
    </a>
  );
}
