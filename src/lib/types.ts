export interface Project {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  content: string | null;
  thumbnail_url: string | null;
  screenshots: string[] | null;
  highlights: string[] | null;
  role: string | null;
  period: string | null;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  icon_url: string | null;
  category: string;
  sort_order: number;
}

export interface Profile {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  job_title: string | null;
  social_links: {
    github?: string;
    email?: string;
    discord?: string;
  };
  stats: {
    projects?: string;
    years?: string;
  };
  quote: string | null;
  updated_at: string;
}

export interface Contact {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string | null;
  sort_order: number;
}
