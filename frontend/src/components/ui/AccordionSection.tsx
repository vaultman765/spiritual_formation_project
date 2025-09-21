// /src/components/ui/AccordionSection.tsx
import React from "react";

interface AccordionSectionProps {
  readonly id?: string;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly defaultOpen?: boolean;
}

export default function AccordionSection({ id, title, children, defaultOpen = false }: AccordionSectionProps) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group mb-4 rounded-2xl border border-white/15 bg-[var(--bg-card)]/75 p-4 shadow-sm shadow-black/20"
    >
      <summary className="cursor-pointer select-none list-none font-display text-xl text-[var(--text-light)]">
        <span
          aria-hidden="true"
          className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-primary-dark)]/90 text-black"
        >
          <span className="text-lg leading-none pb-0.5 group-open:hidden">+</span>
          <span className="text-lg leading-none pb-0.5 hidden group-open:inline">–</span>
        </span>
        <h2 className="inline">{title}</h2>
      </summary>
      <div className="mt-3 space-y-3 text-[var(--text-main)]">{children}</div>
    </details>
  );
}
