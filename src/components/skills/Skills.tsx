import { supabase } from "@/lib/supabase";
import SkillsClient from "./SkillsClient";
import type { Skill } from "@/lib/types";

export default async function Skills() {
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <section id="skills" className="py-[120px] px-6">
      <div className="max-w-[1100px] mx-auto">
        <SkillsClient skills={(skills as Skill[]) || []} />
      </div>
    </section>
  );
}
