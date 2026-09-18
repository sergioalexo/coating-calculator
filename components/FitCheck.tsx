"use client";

import { MaxSize, fitsEnvelope } from "@/lib/calc";
import CopyButton from "./CopyButton";

type Props = {
  /** Fixed equipment envelope — static, not user-editable. */
  max: MaxSize;
  part: MaxSize;
  onPartChange: (p: MaxSize) => void;
};

const KEYS: (keyof MaxSize)[] = ["W", "H", "L"];
const KEY_LABELS: Record<keyof MaxSize, string> = { W: "Width", H: "Height", L: "Length" };

export default function FitCheck({ max, part, onPartChange }: Props) {
  const result = fitsEnvelope(part, max);

  return (
    <section className="rounded-xl border border-line bg-surface">
      <header className="flex items-center gap-2.5 border-b border-line px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
        <h2 className="flex-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
          Max size for powder coating
        </h2>
        <CopyButton
          value={`${max.W} x ${max.H} x ${max.L} in`}
          label="Envelope"
          title={`Copy ${max.W} x ${max.H} x ${max.L} in`}
        />
      </header>

      <div className="grid gap-3 p-3 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-fg-dim">
            Envelope limits (in)
          </div>
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <div key={k}>
                <span className="mb-0.5 block text-[10px] text-fg-faint">{KEY_LABELS[k]}</span>
                <div className="rounded-lg border border-line/60 bg-raised px-2 py-1.5 font-mono text-[13px] tabular-nums text-fg-faint">
                  {max[k]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-fg-dim">
            Your part (in)
          </div>
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <label key={k} className="block">
                <span className="mb-0.5 block text-[10px] text-fg-faint">{KEY_LABELS[k]}</span>
                <input
                  type="number"
                  value={part[k] ? String(part[k]) : ""}
                  placeholder="0"
                  onChange={(e) => onPartChange({ ...part, [k]: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-line bg-field px-2 py-1.5 font-mono text-[13px] tabular-nums text-fg outline-none focus:border-violet-500/70"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {result ? (
        <div
          className={`border-t px-3 py-1.5 text-[11px] font-medium ${
            result.fits
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300"
          }`}
        >
          {result.fits
            ? "Fits — the part can be oriented inside the envelope."
            : "Too large — no orientation fits the envelope."}
        </div>
      ) : (
        <div className="border-t border-line px-3 py-1.5 text-[11px] text-fg-dim">
          Enter part W / H / L to check the fit.
        </div>
      )}
    </section>
  );
}
