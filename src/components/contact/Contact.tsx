import { supabase } from "@/lib/supabase";
import ContactClient from "./ContactClient";
import type { Contact } from "@/lib/types";

export default async function Contact() {
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <section id="contact" className="py-[120px] px-6">
      <div className="max-w-[900px] mx-auto">
        <ContactClient contacts={(contacts as Contact[]) || []} />
      </div>
    </section>
  );
}
