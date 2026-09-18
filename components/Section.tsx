import type { ReactNode } from "react";

type Props = {
  title: string;
  accent?: string;
  action?: ReactNode;
  children?: ReactNode;
  note?: ReactNode;
};

export default function Section({ title, accent = "bg-zinc-500", action, children, note }: Props) {
  return (
    <section className="rounded-xl border border-line bg-surface">
      <header className="flex items-center gap-2.5 border-b border-line px-3 py-2">
        <span className={`h-1.5 w-1.5 rounded-full ${accent}`} />
        <h2 className="flex-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
          {title}
        </h2>
        {action}
      </header>
      {children ? <div className="p-1.5">{children}</div> : null}
      {note ? (
        <div className="border-t border-line px-3 py-1.5 text-[10px] leading-snug text-fg-dim">
          {note}
        </div>
      ) : null}
    </section>
  );
}
