"use client";

import { useState } from "react";
import { Constants, DEFAULT_CONSTANTS, deriveCover, effectiveCover } from "@/lib/calc";

type Props = {
  constants: Constants;
  onChange: (c: Constants) => void;
};

const FIELDS: { key: keyof Constants; label: string; desc: string; step?: number }[] = [
  { key: "STAIN", label: "STAIN", desc: "sqft per gallon" },
  { key: "OIL", label: "OIL", desc: "sqft per gallon" },
  { key: "GRAV", label: "GRAV", desc: "specific gravity", step: 0.001 },
  { key: "EFFIC", label: "EFFIC", desc: "transfer efficiency", step: 0.05 },
  { key: "THICKNESS", label: "THICKNESS", desc: "mil thickness", step: 0.1 },
  { key: "PAIL", label: "PAIL", desc: "pail size (gal)", step: 1 },
  { key: "CUTEK_ML_PER_GAL", label: "CUTEK/GAL", desc: "ml Colortone per gal", step: 5 },
  { key: "RESYSTA_PRIMER_ML", label: "RESYSTA_PRIMER_ML", desc: "sqft per ml", step: 0.00001 },
  { key: "RESYSTA_PRIMER_GAL", label: "RESYSTA_PRIMER_GAL", desc: "sqft per US gal", step: 10 },
  { key: "RESYSTA_STAIN_ML", label: "RESYSTA_STAIN_ML", desc: "sqft per ml", step: 0.00001 },
  { key: "RESYSTA_STAIN_GAL", label: "RESYSTA_STAIN_GAL", desc: "sqft per US gal", step: 10 },
];

export default function ConstantsPanel({ constants, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const set = (key: keyof Constants, value: number | boolean) =>
    onChange({ ...constants, [key]: value });

  const derived = deriveCover(constants);

  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        <h2 className="flex-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">Constants</h2>
        <span className="font-mono text-[11px] text-zinc-500">
          COVER {effectiveCover(constants).toFixed(3)} sqft/lb
        </span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="border-t border-white/10 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="mb-1 block font-mono text-[11px] text-zinc-400">{f.label}</span>
                <input
                  type="number"
                  step={f.step ?? 1}
                  value={String(constants[f.key] as number)}
                  onChange={(e) => set(f.key, parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm tabular-nums text-zinc-100 outline-none focus:border-amber-400/60"
                />
                <span className="mt-1 block text-[10px] text-zinc-600">{f.desc}</span>
              </label>
            ))}

            <label className="block">
              <span className="mb-1 block font-mono text-[11px] text-zinc-400">COVER</span>
              <input
                type="number"
                step={0.001}
                disabled={constants.coverAuto}
                value={constants.coverAuto ? derived.toFixed(4) : String(constants.COVER)}
                onChange={(e) => set("COVER", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm tabular-nums text-zinc-100 outline-none focus:border-amber-400/60 disabled:text-zinc-500"
              />
              <span className="mt-1 block text-[10px] text-zinc-600">sqft per lb</span>
            </label>
          </div>

          <label className="mt-4 flex cursor-pointer flex-wrap items-center gap-2 text-[11px] text-zinc-400">
            <input
              type="checkbox"
              checked={constants.coverAuto}
              onChange={(e) => set("coverAuto", e.target.checked)}
              className="h-3.5 w-3.5 accent-amber-500"
            />
            Derive COVER from GRAV / THICKNESS / EFFIC
            <span className="font-mono text-zinc-600">
              = 192.3 / (GRAV x THICKNESS) x EFFIC = {derived.toFixed(4)}
            </span>
          </label>

          <button
            type="button"
            onClick={() => onChange(DEFAULT_CONSTANTS)}
            className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
          >
            Reset to Onshape defaults
          </button>
        </div>
      ) : null}
    </section>
  );
}
