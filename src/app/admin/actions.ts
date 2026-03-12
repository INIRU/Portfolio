"use server";

import { supabase } from "@/lib/supabase";

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile(data: FormData) {
  const social_links = {
    github: data.get("github") as string,
    email: data.get("email") as string,
    discord: data.get("discord") as string,
  };
  const stats = {
    projects: data.get("stat_projects") as string,
    years: data.get("stat_years") as string,
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: data.get("display_name") as string,
      bio: data.get("bio") as string,
      avatar_url: (data.get("avatar_url") as string) || null,
      job_title: data.get("job_title") as string,
      quote: data.get("quote") as string,
      social_links,
      stats,
    })
    .eq("id", data.get("id") as string);

  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createProject(data: FormData) {
  const techStackRaw = data.get("tech_stack") as string;
  const tech_stack = techStackRaw
    ? techStackRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const { error } = await supabase.from("projects").insert({
    title: data.get("title") as string,
    description: data.get("description") as string,
    thumbnail_url: (data.get("thumbnail_url") as string) || null,
    demo_url: (data.get("demo_url") as string) || null,
    github_url: (data.get("github_url") as string) || null,
    tech_stack,
    featured: data.get("featured") === "on",
    sort_order: parseInt(data.get("sort_order") as string) || 0,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function updateProject(id: string, data: FormData) {
  const techStackRaw = data.get("tech_stack") as string;
  const tech_stack = techStackRaw
    ? techStackRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const { error } = await supabase
    .from("projects")
    .update({
      title: data.get("title") as string,
      description: data.get("description") as string,
      thumbnail_url: (data.get("thumbnail_url") as string) || null,
      demo_url: (data.get("demo_url") as string) || null,
      github_url: (data.get("github_url") as string) || null,
      tech_stack,
      featured: data.get("featured") === "on",
      sort_order: parseInt(data.get("sort_order") as string) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function getSkills() {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createSkill(data: FormData) {
  const { error } = await supabase.from("skills").insert({
    name: data.get("name") as string,
    icon_url: (data.get("icon_url") as string) || null,
    category: data.get("category") as string,
    sort_order: parseInt(data.get("sort_order") as string) || 0,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function updateSkill(id: string, data: FormData) {
  const { error } = await supabase
    .from("skills")
    .update({
      name: data.get("name") as string,
      icon_url: (data.get("icon_url") as string) || null,
      category: data.get("category") as string,
      sort_order: parseInt(data.get("sort_order") as string) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function getContacts() {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createContact(data: FormData) {
  const { error } = await supabase.from("contacts").insert({
    type: data.get("type") as string,
    label: data.get("label") as string,
    value: data.get("value") as string,
    icon: (data.get("icon") as string) || null,
    sort_order: parseInt(data.get("sort_order") as string) || 0,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function updateContact(id: string, data: FormData) {
  const { error } = await supabase
    .from("contacts")
    .update({
      type: data.get("type") as string,
      label: data.get("label") as string,
      value: data.get("value") as string,
      icon: (data.get("icon") as string) || null,
      sort_order: parseInt(data.get("sort_order") as string) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteContact(id: string) {
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}
