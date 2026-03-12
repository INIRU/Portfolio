import { supabase } from "@/lib/supabase";
import ProjectsClient from "./ProjectsClient";
import type { Project } from "@/lib/types";

export default async function Projects() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const allProjects = (projects as Project[]) || [];
  const featured = allProjects.filter((p) => p.featured);
  const others = allProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-[120px] px-6">
      <div className="max-w-[1100px] mx-auto">
        <ProjectsClient featured={featured} others={others} />
      </div>
    </section>
  );
}
