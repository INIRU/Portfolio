"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project, Skill, Profile, Contact } from "@/lib/types";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import ImageUploader from "@/components/ui/ImageUploader";
import {
  getProfile,
  updateProfile,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "./actions";

// ─── Types ───────────────────────────────────────────────────────────────────

type Section = "profile" | "projects" | "skills" | "contacts";

// ─── Skill Categories ────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Language",
  "Database",
  "Tool",
  "Design",
  "Deploy",
  "Style",
  "Graphics",
] as const;

const CONTACT_TYPES = ["email", "github", "discord"] as const;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  input:
    "w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 text-sm outline-none transition-colors focus:border-[#3b82f6] focus:bg-white/[0.06]",
  textarea:
    "w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 text-sm outline-none transition-colors focus:border-[#3b82f6] focus:bg-white/[0.06] resize-y min-h-[80px]",
  select:
    "w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none transition-colors focus:border-[#3b82f6] focus:bg-white/[0.06] appearance-none cursor-pointer",
  btnPrimary:
    "px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  btnDanger:
    "px-3 py-1.5 rounded-md bg-[#ef4444]/10 text-[#ef4444] text-xs font-medium hover:bg-[#ef4444]/20 transition-colors",
  btnGhost:
    "px-3 py-1.5 rounded-md bg-white/[0.04] text-white/70 text-xs font-medium hover:bg-white/[0.08] hover:text-white transition-colors",
  label: "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider",
  th: "text-left text-xs font-medium text-white/40 uppercase tracking-wider px-4 py-3",
  td: "px-4 py-3 text-sm text-white/80",
} as const;

// ═════════════════════════════════════════════════════════════════════════════
// MODAL
// ═════════════════════════════════════════════════════════════════════════════

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.08] p-6 animate-[scaleIn_0.2s_ease-out]"
        style={{ background: "#0d1220" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TOAST
// ═════════════════════════════════════════════════════════════════════════════

function Toast({ message, type, onDone }: { message: string; type: "success" | "error"; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-[slideUp_0.3s_ease-out]">
      <div
        className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
          type === "success"
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PROFILE SECTION
// ═════════════════════════════════════════════════════════════════════════════

function ProfileSection({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getProfile()
      .then((p) => { setProfile(p); setAvatarUrl(p?.avatar_url || ""); })
      .catch(() => showToast("Failed to load profile", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("id", profile!.id);
    startTransition(async () => {
      try {
        await updateProfile(formData);
        const updated = await getProfile();
        setProfile(updated);
        showToast("Profile updated", "success");
      } catch {
        showToast("Failed to update profile", "error");
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="text-white/40 text-sm">No profile found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <ImageUploader
          value={avatarUrl}
          onChange={(url) => setAvatarUrl(url)}
          folder="avatars"
          aspectRatio={1}
          label="Avatar"
          maxWidth={400}
        />
        <input type="hidden" name="avatar_url" value={avatarUrl} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={styles.label}>Display Name</label>
            <input name="display_name" defaultValue={profile.display_name} className={styles.input} />
          </div>
          <div>
            <label className={styles.label}>Job Title</label>
            <input name="job_title" defaultValue={profile.job_title || ""} className={styles.input} />
          </div>
        </div>

        <div>
          <label className={styles.label}>Bio</label>
          <textarea name="bio" defaultValue={profile.bio || ""} className={styles.textarea} rows={3} />
        </div>

        <div>
          <label className={styles.label}>Quote</label>
          <input name="quote" defaultValue={profile.quote || ""} className={styles.input} />
        </div>

        <div className="pt-2">
          <div className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Social Links</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={styles.label}>GitHub</label>
              <input name="github" defaultValue={profile.social_links?.github || ""} className={styles.input} placeholder="username" />
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <input name="email" defaultValue={profile.social_links?.email || ""} className={styles.input} placeholder="you@example.com" />
            </div>
            <div>
              <label className={styles.label}>Discord</label>
              <input name="discord" defaultValue={profile.social_links?.discord || ""} className={styles.input} placeholder="username" />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Stats</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={styles.label}>Projects Count</label>
              <input name="stat_projects" defaultValue={profile.stats?.projects || ""} className={styles.input} placeholder="e.g. 12" />
            </div>
            <div>
              <label className={styles.label}>Years</label>
              <input name="stat_years" defaultValue={profile.stats?.years || ""} className={styles.input} placeholder="e.g. 3" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isPending} className={styles.btnPrimary}>
            {isPending ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PROJECTS SECTION
// ═════════════════════════════════════════════════════════════════════════════

function ProjectsSection({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    getProjects()
      .then(setProjects)
      .catch(() => showToast("Failed to load projects", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (editing) {
          await updateProject(editing.id, formData);
          showToast("Project updated", "success");
        } else {
          await createProject(formData);
          showToast("Project created", "success");
        }
        setModalOpen(false);
        setEditing(null);
        load();
      } catch {
        showToast("Failed to save project", "error");
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteProject(id);
        showToast("Project deleted", "success");
        load();
      } catch {
        showToast("Failed to delete project", "error");
      }
    });
  };

  const openCreate = () => { setEditing(null); setThumbnailUrl(""); setModalOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setThumbnailUrl(p.thumbnail_url || ""); setModalOpen(true); };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <button onClick={openCreate} className={styles.btnPrimary}>Add Project</button>
      </div>

      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Featured</th>
              <th className={styles.th}>Order</th>
              <th className={`${styles.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-white/30 text-sm">
                  No projects yet
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className={styles.td}>
                    <div className="font-medium text-white">{p.title}</div>
                    <div className="text-xs text-white/30 mt-0.5">
                      {p.tech_stack?.slice(0, 3).join(", ")}
                      {p.tech_stack?.length > 3 && ` +${p.tech_stack.length - 3}`}
                    </div>
                  </td>
                  <td className={styles.td}>
                    {p.featured ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6]">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-white/20">&mdash;</span>
                    )}
                  </td>
                  <td className={`${styles.td} font-mono text-white/40`}>{p.sort_order}</td>
                  <td className={`${styles.td} text-right`}>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className={styles.btnGhost}>Edit</button>
                      <button onClick={() => handleDelete(p.id, p.title)} className={styles.btnDanger}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Project" : "New Project"} onClose={() => { setModalOpen(false); setEditing(null); }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={styles.label}>Title</label>
              <input name="title" defaultValue={editing?.title || ""} className={styles.input} required />
            </div>
            <div>
              <label className={styles.label}>Description</label>
              <textarea name="description" defaultValue={editing?.description || ""} className={styles.textarea} rows={3} />
            </div>
            <ImageUploader
              value={thumbnailUrl}
              onChange={(url) => setThumbnailUrl(url)}
              folder="thumbnails"
              aspectRatio={0}
              label="Thumbnail"
              maxWidth={1200}
            />
            <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.label}>Demo URL</label>
                <input name="demo_url" defaultValue={editing?.demo_url || ""} className={styles.input} />
              </div>
              <div>
                <label className={styles.label}>GitHub URL</label>
                <input name="github_url" defaultValue={editing?.github_url || ""} className={styles.input} />
              </div>
            </div>
            <div>
              <label className={styles.label}>Tech Stack (comma-separated)</label>
              <input name="tech_stack" defaultValue={editing?.tech_stack?.join(", ") || ""} className={styles.input} placeholder="React, TypeScript, Supabase" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.label}>Sort Order</label>
                <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className={styles.input} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="featured" type="checkbox" defaultChecked={editing?.featured || false} className="w-4 h-4 rounded border-white/20 bg-white/[0.04] accent-[#3b82f6]" />
                  <span className="text-sm text-white/70">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className={styles.btnGhost}>
                Cancel
              </button>
              <button type="submit" disabled={isPending} className={styles.btnPrimary}>
                {isPending ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SKILLS SECTION
// ═════════════════════════════════════════════════════════════════════════════

function SkillsSection({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    getSkills()
      .then(setSkills)
      .catch(() => showToast("Failed to load skills", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (editing) {
          await updateSkill(editing.id, formData);
          showToast("Skill updated", "success");
        } else {
          await createSkill(formData);
          showToast("Skill created", "success");
        }
        setModalOpen(false);
        setEditing(null);
        load();
      } catch {
        showToast("Failed to save skill", "error");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    startTransition(async () => {
      try {
        await deleteSkill(id);
        showToast("Skill deleted", "success");
        load();
      } catch {
        showToast("Failed to delete skill", "error");
      }
    });
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (s: Skill) => { setEditing(s); setModalOpen(true); };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Skills</h2>
        <button onClick={openCreate} className={styles.btnPrimary}>Add Skill</button>
      </div>

      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Order</th>
              <th className={`${styles.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-white/30 text-sm">
                  No skills yet
                </td>
              </tr>
            ) : (
              skills.map((s) => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className={styles.td}>
                    <div className="flex items-center gap-2">
                      {s.icon_url && (
                        <img src={s.icon_url} alt="" className="w-5 h-5 rounded" />
                      )}
                      <span className="font-medium text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">
                      {s.category}
                    </span>
                  </td>
                  <td className={`${styles.td} font-mono text-white/40`}>{s.sort_order}</td>
                  <td className={`${styles.td} text-right`}>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(s)} className={styles.btnGhost}>Edit</button>
                      <button onClick={() => handleDelete(s.id, s.name)} className={styles.btnDanger}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Skill" : "New Skill"} onClose={() => { setModalOpen(false); setEditing(null); }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={styles.label}>Name</label>
              <input name="name" defaultValue={editing?.name || ""} className={styles.input} required />
            </div>
            <div>
              <label className={styles.label}>Icon URL</label>
              <input name="icon_url" defaultValue={editing?.icon_url || ""} className={styles.input} placeholder="https://..." />
            </div>
            <div>
              <label className={styles.label}>Category</label>
              <select name="category" defaultValue={editing?.category || SKILL_CATEGORIES[0]} className={styles.select}>
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0d1220]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Sort Order</label>
              <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className={styles.input} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className={styles.btnGhost}>
                Cancel
              </button>
              <button type="submit" disabled={isPending} className={styles.btnPrimary}>
                {isPending ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTACTS SECTION
// ═════════════════════════════════════════════════════════════════════════════

function ContactsSection({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    getContacts()
      .then(setContacts)
      .catch(() => showToast("Failed to load contacts", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (editing) {
          await updateContact(editing.id, formData);
          showToast("Contact updated", "success");
        } else {
          await createContact(formData);
          showToast("Contact created", "success");
        }
        setModalOpen(false);
        setEditing(null);
        load();
      } catch {
        showToast("Failed to save contact", "error");
      }
    });
  };

  const handleDelete = (id: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return;
    startTransition(async () => {
      try {
        await deleteContact(id);
        showToast("Contact deleted", "success");
        load();
      } catch {
        showToast("Failed to delete contact", "error");
      }
    });
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c: Contact) => { setEditing(c); setModalOpen(true); };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Contacts</h2>
        <button onClick={openCreate} className={styles.btnPrimary}>Add Contact</button>
      </div>

      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <th className={styles.th}>Label</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Value</th>
              <th className={styles.th}>Order</th>
              <th className={`${styles.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/30 text-sm">
                  No contacts yet
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className={`${styles.td} font-medium text-white`}>{c.label}</td>
                  <td className={styles.td}>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">
                      {c.type}
                    </span>
                  </td>
                  <td className={`${styles.td} font-mono text-xs text-white/50`}>{c.value}</td>
                  <td className={`${styles.td} font-mono text-white/40`}>{c.sort_order}</td>
                  <td className={`${styles.td} text-right`}>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className={styles.btnGhost}>Edit</button>
                      <button onClick={() => handleDelete(c.id, c.label)} className={styles.btnDanger}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Contact" : "New Contact"} onClose={() => { setModalOpen(false); setEditing(null); }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={styles.label}>Type</label>
              <select name="type" defaultValue={editing?.type || CONTACT_TYPES[0]} className={styles.select}>
                {CONTACT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#0d1220]">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Label</label>
              <input name="label" defaultValue={editing?.label || ""} className={styles.input} required />
            </div>
            <div>
              <label className={styles.label}>Value</label>
              <input name="value" defaultValue={editing?.value || ""} className={styles.input} required />
            </div>
            <div>
              <label className={styles.label}>Icon (optional)</label>
              <input name="icon" defaultValue={editing?.icon || ""} className={styles.input} placeholder="URL or icon name" />
            </div>
            <div>
              <label className={styles.label}>Sort Order</label>
              <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className={styles.input} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className={styles.btnGhost}>
                Cancel
              </button>
              <button type="submit" disabled={isPending} className={styles.btnPrimary}>
                {isPending ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LOADING SPINNER
// ═════════════════════════════════════════════════════════════════════════════

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin" />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SIDEBAR NAV ITEMS
// ═════════════════════════════════════════════════════════════════════════════

const NAV_ITEMS: { key: Section; label: string; icon: string }[] = [
  { key: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "projects", label: "Projects", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
  { key: "skills", label: "Skills", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { key: "contacts", label: "Contacts", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
];

// ═════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═════════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const [section, setSection] = useState<Section>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#060a14" }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col border-r border-white/[0.06]"
        style={{ background: "#0a0e1a" }}
      >
        <div className="px-5 py-6 border-b border-white/[0.06]">
          <div className="text-xs font-mono text-[#3b82f6] tracking-[0.2em] uppercase">Admin</div>
          <div className="text-lg font-bold text-white mt-0.5">INIRU</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                section === key
                  ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/30 hover:text-[#ef4444] hover:bg-[#ef4444]/5 transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {section === "profile" && <ProfileSection showToast={showToast} />}
        {section === "projects" && <ProjectsSection showToast={showToast} />}
        {section === "skills" && <SkillsSection showToast={showToast} />}
        {section === "contacts" && <ContactsSection showToast={showToast} />}
      </main>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}

    </div>
  );
}
