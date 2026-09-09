"use client";

import { MaxSize, fitsEnvelope } from "@/lib/calc";
import CopyButton from "./CopyButton";

type Props = {
  max: MaxSize;
  onMaxChange: (m: MaxSize) => void;
  part: MaxSize;
  onPartChange: (p: MaxSize) => void;
};

const KEYS: (keyof MaxSize)[] = ["W", "H", "L"];
const KEY_LABELS: Record<keyof MaxSize, string> = { W: "Width", H: "Height", L: "Length" };

export default function FitCheck({ max, onMaxChange, part, onPartChange }: Props) {
  const result = fitsEnvelope(part, max);

  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/50">
      <header className="flex items-center gap-2.5 border-b border-white/10 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
        <h2 className="flex-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
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
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-500">Envelope limits (in)</div>
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <label key={k} className="block">
                <span className="mb-0.5 block text-[10px] text-zinc-400">{KEY_LABELS[k]}</span>
                <input
                  type="number"
                  value={String(max[k])}
                  onChange={(e) => onMaxChange({ ...max, [k]: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 font-mono text-[13px] tabular-nums text-zinc-100 outline-none focus:border-violet-400/60"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-500">Your part (in)</div>
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <label key={k} className="block">
                <span className="mb-0.5 block text-[10px] text-zinc-400">{KEY_LABELS[k]}</span>
                <input
                  type="number"
                  value={part[k] ? String(part[k]) : ""}
                  placeholder="0"
                  onChange={(e) => onPartChange({ ...part, [k]: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 font-mono text-[13px] tabular-nums text-zinc-100 outline-none focus:border-violet-400/60"
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
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {result.fits
            ? "Fits — the part can be oriented inside the envelope."
            : "Too large — no orientation fits the envelope."}
        </div>
      ) : (
        <div className="border-t border-white/10 px-3 py-1.5 text-[11px] text-zinc-500">
          Enter part W / H / L to check the fit.
        </div>
      )}
    </section>
  );
}
