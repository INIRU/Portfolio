"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-init";
import { useTheme } from "@/lib/theme";
import { GithubIcon, Mail, ExternalLink } from "lucide-react";
import type { Profile } from "@/lib/types";

interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-header",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      const cards = cardsRef.current!.querySelectorAll(".bento-card");
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)", stagger: 0.1,
          scrollTrigger: { trigger: cardsRef.current, start: "top 75%" },
        }
      );

      const statEls = cardsRef.current!.querySelectorAll(".stat-number");
      statEls.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target") || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => { el.textContent = Math.round(obj.val) + "+"; },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bio = profile.bio || "";
  const accentColor = isDark ? "#60a5fa" : "#2563eb";
  const highlightedBio = bio
    .replace(/INIRU/g, `<span style="color: ${accentColor}; font-weight: 700">INIRU</span>`)
    .replace(/(React|Next\.js|TypeScript)/g, `<span style="color: ${accentColor}">$1</span>`);

  return (
    <section ref={sectionRef} id="about" className="relative py-[120px] px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="about-header mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 20, height: 1, background: "#3b82f6", opacity: 0.6 }} />
            <p className="text-[11px] font-semibold tracking-[5px] uppercase" style={{ color: "#3b82f6", fontFamily: "var(--font-display)" }}>About</p>
          </div>
          <h2
            className="text-[36px] md:text-[42px] font-extrabold tracking-tight"
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
            About Me
          </h2>
        </div>

        <div ref={cardsRef} className="grid gap-4 grid-cols-1 md:grid-cols-3" style={{ gridTemplateRows: "auto auto auto" }}>
          {/* Bio card */}
          <div
            className="bento-card col-span-1 md:col-span-2 p-8 rounded-[18px]"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <p
              className="text-[15px] leading-[1.9]"
              style={{ color: "var(--color-text-secondary)" }}
              dangerouslySetInnerHTML={{ __html: highlightedBio }}
            />
          </div>

          {/* Avatar card */}
          <div
            className="bento-card row-span-1 md:row-span-2 rounded-[18px] overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.04))",
              border: "1px solid var(--color-border)",
              minHeight: 280,
            }}
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[48px] opacity-10">?</span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
            <div
              className="bento-card p-6 rounded-[18px] text-center"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div
                className="stat-number text-[34px] font-extrabold mb-1"
                data-target={parseInt(profile.stats?.projects || "10")}
                style={{
                  fontFamily: "var(--font-display)",
                  backgroundImage: isDark
                    ? "linear-gradient(180deg, #f1f5f9 40%, #3b82f6 100%)"
                    : "linear-gradient(180deg, #0f172a 40%, #2563eb 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                0+
              </div>
              <div className="text-[11px] font-medium tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>Projects</div>
            </div>
            <div
              className="bento-card p-6 rounded-[18px] text-center"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div
                className="stat-number text-[34px] font-extrabold mb-1"
                data-target={parseInt(profile.stats?.years || "3")}
                style={{
                  fontFamily: "var(--font-display)",
                  backgroundImage: isDark
                    ? "linear-gradient(180deg, #f1f5f9 40%, #3b82f6 100%)"
                    : "linear-gradient(180deg, #0f172a 40%, #2563eb 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                0+
              </div>
              <div className="text-[11px] font-medium tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>Years</div>
            </div>
          </div>

          {/* Quote card */}
          <div
            className="bento-card col-span-1 md:col-span-2 p-8 rounded-[18px] flex items-center gap-5"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <span className="text-[40px] font-bold leading-none flex-shrink-0" style={{ color: "rgba(59,130,246,0.3)" }}>&ldquo;</span>
            <p className="text-[14px] italic leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {profile.quote || "Code is poetry written in logic."}
            </p>
          </div>

          {/* Social links card */}
          <div
            className="bento-card p-6 rounded-[18px] flex flex-col gap-2.5 justify-center"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            {profile.social_links?.github && (
              <a
                href={profile.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2.5 rounded-full text-[12px] font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={{ background: "rgba(59, 130, 246, 0.06)", border: "1px solid rgba(59, 130, 246, 0.1)", color: "#60a5fa" }}
              >
                <GithubIcon size={14} />
                <span className="flex-1">GitHub</span>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
            )}
            {profile.social_links?.email && (
              <a
                href={profile.social_links.email}
                className="group flex items-center gap-3 px-4 py-2.5 rounded-full text-[12px] font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={{ background: "rgba(59, 130, 246, 0.06)", border: "1px solid rgba(59, 130, 246, 0.1)", color: "#60a5fa" }}
              >
                <Mail size={14} />
                <span className="flex-1">Email</span>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
