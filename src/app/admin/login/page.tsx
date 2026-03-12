"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const inputStyle =
    "w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 text-sm outline-none transition-colors focus:border-[#3b82f6] focus:bg-white/[0.06]";

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#060a14" }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 rounded-2xl border border-white/[0.06]"
        style={{ background: "#0a0e1a" }}
      >
        <div className="text-center mb-8">
          <div className="text-xs font-mono text-[#3b82f6] tracking-[0.3em] uppercase mb-2">
            Admin Panel
          </div>
          <h1 className="text-2xl font-bold text-white">INIRU</h1>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyle}
            placeholder="you@example.com"
            autoFocus
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyle}
            placeholder="Enter password"
            required
          />
        </div>

        {error && (
          <div className="mb-4 text-xs text-[#ef4444] bg-[#ef4444]/10 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
