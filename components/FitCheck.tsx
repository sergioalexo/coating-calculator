"use client";

import { MaxSize } from "@/lib/calc";
import CopyButton from "./CopyButton";

type Props = {
  /** Fixed equipment envelope — static, not user-editable. */
  max: MaxSize;
};

const KEYS: (keyof MaxSize)[] = ["W", "H", "L"];
const KEY_LABELS: Record<keyof MaxSize, string> = { W: "Width", H: "Height", L: "Length" };

/** The powder-coating envelope, read-only: three limits, each its own copy chip. */
export default function FitCheck({ max }: Props) {
  return (
    <section className="rounded-xl border border-line bg-surface">
      <header className="flex items-center gap-2.5 border-b border-line px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
        <h2 className="flex-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
          Max size for powder coating
        </h2>
        <CopyButton
          value={`${max.W} x ${max.H} x ${max.L} in`}
          label="Copy"
          title={`Copy ${max.W} x ${max.H} x ${max.L} in`}
        />
      </header>

      <div className="grid grid-cols-3 gap-1.5 p-1.5">
        {KEYS.map((k) => (
          <div
            key={k}
            className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-raised"
          >
            <span className="text-[13px] font-medium text-fg">{KEY_LABELS[k]}</span>
            <CopyButton
              variant="chip"
              value={String(max[k])}
              unit="in"
              emphasis
              title={`Copy ${KEY_LABELS[k].toLowerCase()} limit (${max[k]} in)`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
