"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-init";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactCard from "./ContactCard";
import type { Contact } from "@/lib/types";

export default function ContactClient({ contacts }: { contacts: Contact[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-header", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });

      gsap.fromTo(".contact-card", { y: 40, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)", stagger: 0.15, scrollTrigger: { trigger: ".contact-grid", start: "top 80%" } });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="contact-header text-center mb-12">
        <SectionHeader label="Contact" title="Let's Connect" subtitle="편한 방법으로 연락해주세요." center />
      </div>
      <div className="contact-grid grid grid-cols-1 md:grid-cols-3 gap-4">
        {contacts.map((contact) => (<ContactCard key={contact.id} contact={contact} />))}
      </div>
    </div>
  );
}
