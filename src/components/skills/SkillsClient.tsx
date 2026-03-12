"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-init";
import SectionHeader from "@/components/ui/SectionHeader";
import SkillCard from "./SkillCard";
import type { Skill } from "@/lib/types";

export default function SkillsClient({ skills }: { skills: Skill[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".skills-header", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });

      gsap.fromTo(".skill-card", { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)", stagger: 0.08, scrollTrigger: { trigger: ".skills-grid", start: "top 80%" } });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="skills-header mb-12">
        <SectionHeader label="Skills" title="Tech Stack" />
      </div>
      <div className="skills-grid grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill) => (<SkillCard key={skill.id} skill={skill} />))}
      </div>
    </div>
  );
}
