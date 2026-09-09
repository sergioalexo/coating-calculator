import type { ReactNode } from "react";

type Props = {
  title: string;
  accent?: string;
  action?: ReactNode;
  children: ReactNode;
  note?: ReactNode;
};

export default function Section({ title, accent = "bg-zinc-500", action, children, note }: Props) {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur">
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className={`h-2 w-2 rounded-full ${accent}`} />
        <h2 className="flex-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">{title}</h2>
        {action}
      </header>
      <div className="p-2">{children}</div>
      {note ? <div className="border-t border-white/10 px-4 py-2.5 text-[11px] leading-relaxed text-zinc-500">{note}</div> : null}
    </section>
  );
}
