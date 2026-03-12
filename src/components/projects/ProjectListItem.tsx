"use client";

import Tag from "@/components/ui/Tag";
import { ExternalLink, GithubIcon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import type { Project } from "@/lib/types";

export default function ProjectListItem({ project }: { project: Project }) {
  const link = project.demo_url || project.github_url;
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const detailHref = project.slug ? `/projects/${project.slug}` : null;

  return (
    <div
      className="project-item group flex items-center gap-5 p-5 rounded-[16px] transition-all duration-300 cursor-pointer"
      onClick={() => detailHref && (window.location.href = detailHref)}
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "var(--color-surface)";
      }}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-[12px] flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))",
          border: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <span className="text-[16px] font-bold" style={{ color: "#60a5fa", fontFamily: "var(--font-display)" }}>
          {project.title.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-bold mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
          {project.title}
        </h4>
        <p className="text-[12px] truncate" style={{ color: "var(--color-text-muted)" }}>
          {project.description}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0 items-center">
        {project.tech_stack.slice(0, 2).map((tech) => (
          <Tag key={tech} label={tech} />
        ))}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: "var(--color-text-muted)" }}
          >
            {project.demo_url ? <ExternalLink size={14} /> : <GithubIcon size={14} />}
          </a>
        )}
      </div>
    </div>
  );
}
