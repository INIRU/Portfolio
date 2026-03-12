"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/lib/theme";
import { gsap } from "@/lib/gsap-init";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Mouse-reactive glow
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mousePos.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cx = 0.5, cy = 0.5;
    const animate = () => {
      cx += (mousePos.current.x - cx) * 0.04;
      cy += (mousePos.current.y - cy) * 0.04;
      if (glowRef.current) {
        glowRef.current.style.background = isDark
          ? `radial-gradient(600px circle at ${cx * 100}% ${cy * 100}%, rgba(59,130,246,0.07) 0%, transparent 60%)`
          : `radial-gradient(600px circle at ${cx * 100}% ${cy * 100}%, rgba(59,130,246,0.06) 0%, transparent 60%)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, handleMouseMove]);

  // GSAP entrance
  useEffect(() => {
    setMounted(true);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Name glow pulse
      tl.fromTo(
        ".hero-name-glow",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" },
        0.1
      );

      // Characters entrance
      tl.fromTo(
        ".hero-char",
        { y: 100, opacity: 0, rotateX: -80, scale: 0.6 },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.4, ease: "elastic.out(1, 0.5)", stagger: 0.08 },
        0.3
      );

      // Accent line
      tl.fromTo(
        ".hero-line",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
        0.8
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.0
      );

      // Floating particles
      tl.fromTo(
        ".hero-particle",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: { amount: 0.8, from: "random" } },
        0.5
      );

      // Scroll indicator
      tl.fromTo(scrollRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.4);

      // Continuous particle float
      gsap.utils.toArray<HTMLElement>(".hero-particle").forEach((el) => {
        gsap.to(el, {
          y: `+=${8 + Math.random() * 16}`,
          x: `+=${-6 + Math.random() * 12}`,
          duration: 3 + Math.random() * 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
        });
      });

      // Scroll bounce
      gsap.to(".scroll-arrow", { y: 6, duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Parallax
      gsap.to(nameRef.current, {
        y: -100, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.5 },
      });
      gsap.to(subtitleRef.current, {
        y: -50, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.5 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Deterministic particle positions
  const particles = Array.from({ length: 10 }, (_, i) => ({
    x: 12 + (i * 73 + 31) % 76,
    y: 8 + (i * 47 + 19) % 84,
    size: 2 + (i % 3) * 1.5,
    opacity: 0.08 + (i % 4) * 0.06,
  }));

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Mouse-reactive glow */}
      <div ref={glowRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Background gradient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900,
          height: 900,
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          background: isDark
            ? "radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(59,130,246,0.02) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbDrift1 12s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: "15%",
          right: "-5%",
          background: isDark
            ? "radial-gradient(circle, rgba(139,92,246,0.035) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbDrift2 15s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          bottom: "10%",
          left: "5%",
          background: isDark
            ? "radial-gradient(circle, rgba(14,165,233,0.03) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "orbDrift2 18s ease-in-out infinite reverse",
          zIndex: 0,
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: isDark
            ? `linear-gradient(rgba(59,130,246,0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(59,130,246,0.02) 1px, transparent 1px)`
            : `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
               linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 45%, black, transparent)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {particles.map((p, i) => (
          <div
            key={i}
            className="hero-particle absolute rounded-full opacity-0"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: isDark
                ? `rgba(59,130,246,${p.opacity})`
                : `rgba(59,130,246,${p.opacity * 1.8})`,
              boxShadow: isDark
                ? `0 0 ${p.size * 4}px rgba(59,130,246,${p.opacity * 0.6})`
                : `0 0 ${p.size * 4}px rgba(59,130,246,${p.opacity * 0.4})`,
            }}
          />
        ))}
      </div>

      {/* Name glow (behind text) */}
      <div
        className="hero-name-glow absolute pointer-events-none opacity-0"
        style={{
          width: 700,
          height: 250,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          background: isDark
            ? "radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.03) 50%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)",
          filter: "blur(50px)",
          zIndex: 5,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center" style={{ transformStyle: "preserve-3d" }}>
        {/* Name */}
        <div ref={nameRef} className="flex justify-center items-center">
          {"INIRU".split("").map((char, i) => (
            <span
              key={i}
              className="hero-char inline-block opacity-0"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(80px, 18vw, 200px)",
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                backgroundImage: isDark
                  ? (i === 4
                    ? "linear-gradient(135deg, #ffffff 25%, #cbd5e1 50%, #60a5fa 100%)"
                    : "linear-gradient(180deg, #ffffff 30%, #cbd5e1 100%)")
                  : (i === 4
                    ? "linear-gradient(135deg, #0f172a 25%, #334155 50%, #2563eb 100%)"
                    : "linear-gradient(180deg, #0f172a 30%, #475569 100%)"),
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: isDark
                  ? "drop-shadow(0 0 40px rgba(59,130,246,0.1))"
                  : "drop-shadow(0 0 40px rgba(59,130,246,0.08))",
                willChange: "transform, opacity",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Accent line */}
        <div className="flex justify-center mt-8 mb-8">
          <div
            className="hero-line opacity-0"
            style={{
              width: 50,
              height: 2,
              borderRadius: 1,
              background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
              transformOrigin: "center",
            }}
          />
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="opacity-0">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: isDark ? "#64748b" : "#94a3b8",
            }}
          >
            Full-Stack Developer
          </p>
          <p
            className="mt-5 max-w-md mx-auto"
            style={{
              fontSize: "14px",
              lineHeight: 1.9,
              color: isDark ? "rgba(148,163,184,0.5)" : "rgba(71,85,105,0.7)",
              letterSpacing: "0.02em",
            }}
          >
            Crafting interactive experiences with
            <span style={{ color: isDark ? "#60a5fa" : "#2563eb" }}> React</span>,
            <span style={{ color: isDark ? "#60a5fa" : "#2563eb" }}> Next.js</span> &
            <span style={{ color: isDark ? "#60a5fa" : "#2563eb" }}> TypeScript</span>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
        style={{ zIndex: 10 }}
      >
        <span style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: isDark ? "#475569" : "#94a3b8" }}>
          Scroll
        </span>
        <div className="scroll-arrow" style={{ color: isDark ? "#3b82f6" : "#2563eb", opacity: 0.6 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v10m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 200, background: isDark ? "linear-gradient(to bottom, transparent, #040810)" : "linear-gradient(to bottom, transparent, #f8fafc)", zIndex: 10 }}
      />
    </section>
  );
}
