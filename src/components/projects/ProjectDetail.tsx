"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap-init";
import { useTheme } from "@/lib/theme";
import { ArrowLeft, ExternalLink, GithubIcon, Calendar, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Tag from "@/components/ui/Tag";
import type { Project } from "@/lib/types";

export default function ProjectDetail({ project }: { project: Project }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Back button
      tl.fromTo(".detail-back", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0);

      // Hero image
      tl.fromTo(
        ".detail-hero-img",
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
        0.1
      );

      // Hero overlay content
      tl.fromTo(".detail-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.4);
      tl.fromTo(".detail-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.6);

      // Meta cards
      tl.fromTo(
        ".detail-meta-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        0.7
      );

      // Content
      tl.fromTo(".detail-content", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.9);

      // Highlights
      tl.fromTo(
        ".detail-highlight",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.06 },
        1.0
      );

      // Links
      tl.fromTo(
        ".detail-link",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        1.1
      );

      // Parallax on hero image
      gsap.to(".detail-hero-img", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ".detail-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formattedDate = new Date(project.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => router.push("/#projects")}
          className="detail-back flex items-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-semibold opacity-0 transition-all duration-200"
          style={{
            background: isDark ? "rgba(4, 8, 16, 0.7)" : "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(24px) saturate(1.5)",
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.08)",
            color: isDark ? "#94a3b8" : "#64748b",
            fontFamily: "var(--font-display)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDark ? "#f1f5f9" : "#0f172a";
            e.currentTarget.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDark ? "#94a3b8" : "#64748b";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      {/* Hero */}
      <section
        className="detail-hero relative w-full overflow-hidden"
        style={{ height: "70vh", minHeight: 500 }}
      >
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="detail-hero-img absolute inset-0 w-full h-full object-cover opacity-0"
          />
        ) : (
          <div
            className="detail-hero-img absolute inset-0 opacity-0"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))"
                : "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.08))",
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? "linear-gradient(to top, #040810 0%, rgba(4,8,16,0.6) 40%, rgba(4,8,16,0.2) 100%)"
              : "linear-gradient(to top, #f8fafc 0%, rgba(248,250,252,0.6) 40%, rgba(248,250,252,0.1) 100%)",
          }}
        />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <Tag key={tech} label={tech} />
              ))}
            </div>
            <h1
              className="detail-title text-[42px] md:text-[56px] font-extrabold tracking-tight opacity-0"
              style={{
                fontFamily: "var(--font-display)",
                backgroundImage: isDark
                  ? "linear-gradient(180deg, #ffffff 30%, #94a3b8 100%)"
                  : "linear-gradient(180deg, #0f172a 30%, #475569 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {project.title}
            </h1>
            <p
              className="detail-desc text-[16px] mt-3 opacity-0"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-display)" }}
            >
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content area */}
      <div className="px-6 pb-32">
        <div className="max-w-[1100px] mx-auto">
          {/* Meta cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 -mt-8 relative z-10 mb-16">
            {project.role && (
              <div
                className="detail-meta-card p-5 rounded-[16px] opacity-0"
                style={{
                  background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
                  border: "1px solid var(--color-border)",
                  backdropFilter: "blur(20px)",
                  boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User size={12} style={{ color: "#3b82f6" }} />
                  <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
                    Role
                  </span>
                </div>
                <p className="text-[13px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {project.role}
                </p>
              </div>
            )}
            {project.period && (
              <div
                className="detail-meta-card p-5 rounded-[16px] opacity-0"
                style={{
                  background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
                  border: "1px solid var(--color-border)",
                  backdropFilter: "blur(20px)",
                  boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={12} style={{ color: "#3b82f6" }} />
                  <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
                    Period
                  </span>
                </div>
                <p className="text-[13px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {project.period}
                </p>
              </div>
            )}
            <div
              className="detail-meta-card p-5 rounded-[16px] opacity-0"
              style={{
                background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
                border: "1px solid var(--color-border)",
                backdropFilter: "blur(20px)",
                boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={12} style={{ color: "#3b82f6" }} />
                <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
                  Stack
                </span>
              </div>
              <p className="text-[13px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {project.tech_stack.length} Technologies
              </p>
            </div>
            <div
              className="detail-meta-card p-5 rounded-[16px] opacity-0"
              style={{
                background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
                border: "1px solid var(--color-border)",
                backdropFilter: "blur(20px)",
                boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={12} style={{ color: "#3b82f6" }} />
                <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
                  Created
                </span>
              </div>
              <p className="text-[13px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Two-column: content + sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
            {/* Main content */}
            <div>
              {project.content && (
                <div className="detail-content opacity-0 mb-16">
                  <h2
                    className="text-[11px] font-semibold tracking-[5px] uppercase mb-6 flex items-center gap-3"
                    style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}
                  >
                    <span style={{ width: 20, height: 1, background: "var(--color-primary)", opacity: 0.6, display: "inline-block" }} />
                    Overview
                  </h2>
                  <div
                    className="prose-custom text-[15px] leading-[1.9]"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({ children }) => (
                          <h2
                            className="text-[20px] font-bold mt-10 mb-4 tracking-tight"
                            style={{
                              fontFamily: "var(--font-display)",
                              backgroundImage: isDark
                                ? "linear-gradient(180deg, #f1f5f9 40%, #94a3b8 100%)"
                                : "linear-gradient(180deg, #0f172a 40%, #475569 100%)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3
                            className="text-[16px] font-bold mt-8 mb-3"
                            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
                          >
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-4 leading-[1.9]" style={{ color: "var(--color-text-secondary)" }}>
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontWeight: 600 }}>
                            {children}
                          </strong>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-200"
                            style={{ color: "#3b82f6", textDecoration: "underline", textUnderlineOffset: "3px" }}
                          >
                            {children}
                          </a>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote
                            className="my-6 pl-5 py-3 rounded-r-lg"
                            style={{
                              borderLeft: "3px solid #3b82f6",
                              background: isDark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.04)",
                              color: isDark ? "#94a3b8" : "#64748b",
                              fontStyle: "italic",
                            }}
                          >
                            {children}
                          </blockquote>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-4 flex flex-col gap-2 pl-1">{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-2.5">
                            <span
                              className="flex-shrink-0 mt-[10px] w-1.5 h-1.5 rounded-full"
                              style={{ background: "#3b82f6" }}
                            />
                            <span>{children}</span>
                          </li>
                        ),
                        hr: () => (
                          <hr
                            className="my-8 border-none"
                            style={{ height: 1, background: "var(--color-border)" }}
                          />
                        ),
                        table: ({ children }) => (
                          <div className="my-6 rounded-[12px] overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                            <table className="w-full text-[13px]">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead
                            style={{
                              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                            }}
                          >
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th
                            className="text-left px-4 py-3 font-semibold"
                            style={{
                              color: "var(--color-text-primary)",
                              fontFamily: "var(--font-display)",
                              borderBottom: "1px solid var(--color-border)",
                            }}
                          >
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td
                            className="px-4 py-3"
                            style={{
                              color: "var(--color-text-secondary)",
                              borderBottom: "1px solid var(--color-border)",
                            }}
                          >
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {project.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Screenshots gallery */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div className="detail-content opacity-0 mb-16">
                  <h2
                    className="text-[11px] font-semibold tracking-[5px] uppercase mb-6 flex items-center gap-3"
                    style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}
                  >
                    <span style={{ width: 20, height: 1, background: "var(--color-primary)", opacity: 0.6, display: "inline-block" }} />
                    Gallery
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {project.screenshots.map((url, i) => (
                      <div
                        key={i}
                        className="rounded-[16px] overflow-hidden"
                        style={{ border: "1px solid var(--color-border)" }}
                      >
                        <img
                          src={url}
                          alt={`${project.title} screenshot ${i + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div
                  className="p-6 rounded-[18px]"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
                    border: "1px solid var(--color-border)",
                    boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <h3
                    className="text-[11px] font-semibold tracking-[4px] uppercase mb-5"
                    style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}
                  >
                    Highlights
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {project.highlights.map((item, i) => (
                      <li
                        key={i}
                        className="detail-highlight flex items-start gap-3 opacity-0"
                      >
                        <span
                          className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                          style={{ background: "#3b82f6" }}
                        />
                        <span className="text-[13px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              <div
                className="p-6 rounded-[18px]"
                style={{
                  background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
                  border: "1px solid var(--color-border)",
                  boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <h3
                  className="text-[11px] font-semibold tracking-[4px] uppercase mb-5"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)" }}
                >
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <Tag key={tech} label={tech} />
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-3">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[14px] text-[13px] font-semibold opacity-0 transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: "rgba(59,130,246,0.12)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      color: isDark ? "#60a5fa" : "#2563eb",
                      fontFamily: "var(--font-display)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(59,130,246,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(59,130,246,0.12)";
                    }}
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[14px] text-[13px] font-semibold opacity-0 transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
                      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-display)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
                    }}
                  >
                    <GithubIcon size={14} />
                    View Source
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
