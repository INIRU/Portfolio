export const dynamic = "force-dynamic";

import Nav from "@/components/nav/Nav";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Projects from "@/components/projects/Projects";
import Skills from "@/components/skills/Skills";
import Contact from "@/components/contact/Contact";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

export default async function Home() {
  const { data: profiles } = await supabase.from("profiles").select("*").limit(1);
  const profile = (profiles?.[0] as Profile) || {
    id: "",
    display_name: "INIRU",
    bio: null,
    avatar_url: null,
    job_title: "Full-Stack Developer",
    social_links: {},
    stats: { projects: "10+", years: "3+" },
    quote: "Code is poetry written in logic.",
    updated_at: "",
  };

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About profile={profile} />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <footer className="py-16 text-center border-t" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-[11px] tracking-wider" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-display)" }}>
          &copy; 2026 INIRU
        </p>
      </footer>
    </>
  );
}
