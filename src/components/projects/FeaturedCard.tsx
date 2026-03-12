"use client";

import Link from "next/link";
import Tag from "@/components/ui/Tag";
import type { Project } from "@/lib/types";
import { useTheme } from "@/lib/theme";
import { ExternalLink, GithubIcon } from "lucide-react";

export default function FeaturedCard({ project }: { project: Project }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const detailHref = project.slug ? `/projects/${project.slug}` : null;

  return (
    <div
      className="featured-card group grid grid-cols-1 md:grid-cols-[1.2fr_1fr] rounded-[20px] overflow-hidden transition-all duration-500 cursor-pointer"
      onClick={() => detailHref && (window.location.href = detailHref)}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(59,130,246,0.02) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(59,130,246,0.03) 100%)",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = isDark
          ? "0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(59,130,246,0.05)"
          : "0 20px 60px rgba(0,0,0,0.08), 0 0 40px rgba(59,130,246,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="featured-thumb aspect-[16/10] overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.04))" }}
      >
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[40px] opacity-10">&#9733;</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: isDark ? "linear-gradient(to top, rgba(4,8,16,0.5) 0%, transparent 50%)" : "linear-gradient(to top, rgba(248,250,252,0.5) 0%, transparent 50%)" }}
        />
      </div>

      <div className="p-8 md:p-10 flex flex-col justify-center">
        <span
          className="text-[10px] font-bold tracking-[3px] uppercase mb-4 inline-block"
          style={{ color: "#3b82f6", fontFamily: "var(--font-display)" }}
        >
          Featured
        </span>
        <h3
          className="text-[22px] md:text-[26px] font-bold mb-3 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tech_stack.map((tech) => (
            <Tag key={tech} label={tech} />
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {detailHref && (
            <Link
              href={detailHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: isDark ? "#60a5fa" : "#2563eb",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.15)",
                color: "#60a5fa",
              }}
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                color: "var(--color-text-secondary)",
              }}
            >
              <GithubIcon size={12} />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
