import type { Skill } from "@/lib/types";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss,
  SiNodedotjs, SiPython, SiGit, SiGithub, SiDocker,
  SiPostgresql, SiMongodb, SiRedis, SiFigma, SiVercel,
  SiSupabase, SiPrisma, SiVite, SiHtml5, SiCss, SiSass,
  SiGraphql, SiFirebase, SiLinux, SiRust, SiGo, SiSwift,
  SiKotlin, SiFlutter, SiDart, SiVuedotjs, SiSvelte, SiAngular,
  SiDjango, SiExpress, SiNestjs, SiMysql, SiSqlite, SiElectron,
  SiWebpack, SiJest, SiStorybook, SiNpm, SiYarn, SiPnpm,
  SiCloudflare, SiNetlify, SiJira, SiNotion, SiDiscord,
  SiBlender, SiUnity, SiCplusplus, SiC, SiPhp, SiLaravel,
  SiRuby, SiRubyonrails, SiSpring, SiKubernetes, SiTerraform,
  SiNginx, SiApache, SiGrafana, SiJenkins, SiGitlab, SiBitbucket,
  SiMarkdown, SiSketch, SiCanvas, SiThreedotjs, SiStripe,
  SiShopify, SiWordpress,
} from "@icons-pack/react-simple-icons";

type IconComponent = React.ComponentType<{ size?: number; color?: string; className?: string }>;

const iconMap: Record<string, IconComponent> = {
  react: SiReact, "next.js": SiNextdotjs, nextjs: SiNextdotjs, next: SiNextdotjs,
  typescript: SiTypescript, javascript: SiJavascript,
  tailwind: SiTailwindcss, "tailwind css": SiTailwindcss, tailwindcss: SiTailwindcss,
  "node.js": SiNodedotjs, nodejs: SiNodedotjs, node: SiNodedotjs,
  python: SiPython, git: SiGit, github: SiGithub, docker: SiDocker,
  postgresql: SiPostgresql, postgres: SiPostgresql, mongodb: SiMongodb, mongo: SiMongodb,
  redis: SiRedis, figma: SiFigma, vercel: SiVercel, supabase: SiSupabase,
  prisma: SiPrisma, vite: SiVite, html: SiHtml5, html5: SiHtml5,
  css: SiCss, css3: SiCss, sass: SiSass, scss: SiSass,
  graphql: SiGraphql, firebase: SiFirebase, linux: SiLinux,
  rust: SiRust, go: SiGo, golang: SiGo, swift: SiSwift, kotlin: SiKotlin,
  flutter: SiFlutter, dart: SiDart,
  vue: SiVuedotjs, "vue.js": SiVuedotjs, vuejs: SiVuedotjs,
  svelte: SiSvelte, angular: SiAngular, django: SiDjango,
  express: SiExpress, "express.js": SiExpress, nestjs: SiNestjs, "nest.js": SiNestjs,
  mysql: SiMysql, sqlite: SiSqlite, electron: SiElectron, webpack: SiWebpack,
  jest: SiJest, storybook: SiStorybook, npm: SiNpm, yarn: SiYarn, pnpm: SiPnpm,
  cloudflare: SiCloudflare, netlify: SiNetlify, jira: SiJira, notion: SiNotion,
  discord: SiDiscord, blender: SiBlender, unity: SiUnity,
  "c++": SiCplusplus, cpp: SiCplusplus, c: SiC, php: SiPhp, laravel: SiLaravel,
  ruby: SiRuby, rails: SiRubyonrails, "ruby on rails": SiRubyonrails,
  spring: SiSpring, "spring boot": SiSpring,
  kubernetes: SiKubernetes, k8s: SiKubernetes, terraform: SiTerraform,
  nginx: SiNginx, apache: SiApache, grafana: SiGrafana, jenkins: SiJenkins,
  gitlab: SiGitlab, bitbucket: SiBitbucket, markdown: SiMarkdown,
  sketch: SiSketch, canva: SiCanvas, "three.js": SiThreedotjs, threejs: SiThreedotjs,
  stripe: SiStripe, shopify: SiShopify, wordpress: SiWordpress,
  webgl: SiThreedotjs,
};

const categoryColors: Record<string, { bg: string; border: string; accent: string }> = {
  Frontend:  { bg: "rgba(59,130,246,0.06)",  border: "rgba(59,130,246,0.1)",  accent: "#60a5fa" },
  Backend:   { bg: "rgba(16,185,129,0.06)",  border: "rgba(16,185,129,0.1)",  accent: "#34d399" },
  Language:  { bg: "rgba(245,158,11,0.06)",   border: "rgba(245,158,11,0.1)",  accent: "#fbbf24" },
  Database:  { bg: "rgba(168,85,247,0.06)",   border: "rgba(168,85,247,0.1)",  accent: "#c084fc" },
  Tool:      { bg: "rgba(148,163,184,0.06)",  border: "rgba(148,163,184,0.1)", accent: "#94a3b8" },
  Design:    { bg: "rgba(236,72,153,0.06)",   border: "rgba(236,72,153,0.1)",  accent: "#f472b6" },
  Deploy:    { bg: "rgba(6,182,212,0.06)",    border: "rgba(6,182,212,0.1)",   accent: "#22d3ee" },
  Style:     { bg: "rgba(99,102,241,0.06)",   border: "rgba(99,102,241,0.1)",  accent: "#818cf8" },
  Graphics:  { bg: "rgba(251,146,60,0.06)",   border: "rgba(251,146,60,0.1)",  accent: "#fb923c" },
};

function getIcon(name: string): IconComponent | null {
  return iconMap[name.toLowerCase()] || null;
}

export default function SkillCard({ skill }: { skill: Skill }) {
  const IconComponent = getIcon(skill.name);
  const colors = categoryColors[skill.category] || categoryColors.Tool;

  return (
    <div
      className="skill-card p-6 rounded-[16px] text-center transition-all duration-300 cursor-pointer group"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.background = colors.bg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "var(--color-surface)";
      }}
    >
      <div
        className="w-11 h-11 rounded-[12px] mx-auto mb-3 flex items-center justify-center transition-colors duration-300"
        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
      >
        {IconComponent ? (
          <IconComponent size={20} color={colors.accent} />
        ) : skill.icon_url ? (
          <img src={skill.icon_url} alt={skill.name} className="w-5 h-5" />
        ) : (
          <span className="text-[13px] font-bold" style={{ color: colors.accent }}>
            {skill.name.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="text-[12px] font-semibold mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
        {skill.name}
      </div>
      <div className="text-[10px] font-medium" style={{ color: colors.accent, opacity: 0.7 }}>
        {skill.category}
      </div>
    </div>
  );
}
