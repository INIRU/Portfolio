import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Project } from "@/lib/types";
import type { Metadata } from "next";
import ProjectDetail from "@/components/projects/ProjectDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Project Not Found" };

  return {
    title: `${data.title} — INIRU`,
    description: data.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  return <ProjectDetail project={project as Project} />;
}
