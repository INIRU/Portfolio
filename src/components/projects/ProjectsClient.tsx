"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-init";
import SectionHeader from "@/components/ui/SectionHeader";
import FeaturedCard from "./FeaturedCard";
import ProjectListItem from "./ProjectListItem";
import type { Project } from "@/lib/types";

interface ProjectsClientProps {
  featured: Project[];
  others: Project[];
}

export default function ProjectsClient({ featured, others }: ProjectsClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".projects-header", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });

      gsap.fromTo(".featured-card", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".featured-card", start: "top 80%" } });

      gsap.fromTo(".featured-thumb", { scale: 1 }, { scale: 1.03, ease: "none", scrollTrigger: { trigger: ".featured-card", start: "top bottom", end: "bottom top", scrub: 0.5 } });

      gsap.fromTo(".project-item", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.15, scrollTrigger: { trigger: ".project-item", start: "top 85%" } });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="projects-header mb-12">
        <SectionHeader label="Projects" title="My Projects" />
      </div>
      {featured.map((project) => (
        <div key={project.id} className="mb-6"><FeaturedCard project={project} /></div>
      ))}
      <div className="flex flex-col gap-3 mt-6">
        {others.map((project) => (<ProjectListItem key={project.id} project={project} />))}
      </div>
    </div>
  );
}
