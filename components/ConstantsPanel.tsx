"use client";

import { useState } from "react";
import { Constants, deriveCover, effectiveCover } from "@/lib/calc";

type Props = {
  constants: Constants;
  onChange: (c: Constants) => void;
  /** Persist the current constants so they survive a reload. */
  onSave: () => void;
  /** Back to Onshape defaults (and forget any saved set); also zeroes coats. */
  onReset: () => void;
  /** Current constants differ from what is saved (or from defaults if nothing is saved). */
  dirty: boolean;
  isDefault: boolean;
  hasSaved: boolean;
  coats: number;
  onCoatsChange: (n: number) => void;
};

const FIELDS: { key: keyof Constants; label: string; desc: string; step?: number }[] = [
  { key: "STAIN", label: "Stain coverage", desc: "#STAIN — sqft per gallon" },
  { key: "OIL", label: "Oil coverage", desc: "#OIL — sqft per gallon" },
  { key: "GRAV", label: "Specific gravity", desc: "#GRAV", step: 0.001 },
  { key: "EFFIC", label: "Transfer efficiency", desc: "#EFFIC — 0 to 1", step: 0.05 },
  { key: "THICKNESS", label: "Film thickness", desc: "#THICKNESS — mil", step: 0.1 },
  { key: "CUTEK_ML_PER_GAL", label: "Colortone per gallon", desc: "ml per gallon of stain", step: 5 },
  { key: "RESYSTA_PRIMER_ML", label: "Resysta primer (ml)", desc: "sqft per ml", step: 0.00001 },
  { key: "RESYSTA_PRIMER_GAL", label: "Resysta primer (gal)", desc: "sqft per US gallon", step: 10 },
  { key: "RESYSTA_STAIN_ML", label: "Resysta stain (ml)", desc: "sqft per ml", step: 0.00001 },
  { key: "RESYSTA_STAIN_GAL", label: "Resysta stain (gal)", desc: "sqft per US gallon", step: 10 },
];

export default function ConstantsPanel({
  constants,
  onChange,
  onSave,
  onReset,
  dirty,
  isDefault,
  hasSaved,
  coats,
  onCoatsChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const set = (key: keyof Constants, value: number | boolean) =>
    onChange({ ...constants, [key]: value });

  const derived = deriveCover(constants);

  return (
    <section className="rounded-xl border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <h2 className="flex-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-muted">Constants</h2>
        <span className="flex items-center gap-1.5 text-[11px] text-fg-dim">
          {dirty ? (
            <span className="rounded-sm bg-amber-500/15 px-1 py-px text-[10px] font-semibold text-amber-700 dark:text-amber-300">
              unsaved
            </span>
          ) : !isDefault && hasSaved ? (
            <span className="rounded-sm bg-raised px-1 py-px text-[10px] font-semibold text-fg-faint">
              custom
            </span>
          ) : null}
          <span>
            <span className="font-mono">{coats}</span> coat{coats === 1 ? "" : "s"}
            <span className="mx-1.5 text-fg-dim/50">·</span>
            coverage <span className="font-mono">{effectiveCover(constants).toFixed(3)}</span> sqft/lb
          </span>
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
          className={`text-fg-dim transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="border-t border-line p-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] text-fg-muted">Coats</span>
              <input
                type="number"
                min={1}
                step={1}
                value={String(coats)}
                onChange={(e) => onCoatsChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-lg border border-line bg-field px-3 py-2 font-mono text-sm tabular-nums text-fg outline-none focus:border-amber-500/70"
              />
              <span className="mt-1 block text-[10px] text-fg-dim">#COATS — coats applied</span>
            </label>

            {FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="mb-1 block text-[11px] text-fg-muted">{f.label}</span>
                <input
                  type="number"
                  step={f.step ?? 1}
                  value={String(constants[f.key] as number)}
                  onChange={(e) => set(f.key, parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-line bg-field px-3 py-2 font-mono text-sm tabular-nums text-fg outline-none focus:border-amber-500/70"
                />
                <span className="mt-1 block text-[10px] text-fg-dim">{f.desc}</span>
              </label>
            ))}

            <label className="block">
              <span className="mb-1 block text-[11px] text-fg-muted">Powder coverage</span>
              <input
                type="number"
                step={0.001}
                disabled={constants.coverAuto}
                value={constants.coverAuto ? derived.toFixed(4) : String(constants.COVER)}
                onChange={(e) => set("COVER", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-line bg-field px-3 py-2 font-mono text-sm tabular-nums text-fg outline-none focus:border-amber-500/70 disabled:text-fg-dim"
              />
              <span className="mt-1 block text-[10px] text-fg-dim">#COVER — sqft per lb</span>
            </label>
          </div>

          <label className="mt-4 flex cursor-pointer flex-wrap items-center gap-2 text-[11px] text-fg-faint">
            <input
              type="checkbox"
              checked={constants.coverAuto}
              onChange={(e) => set("coverAuto", e.target.checked)}
              className="h-3.5 w-3.5 accent-amber-500"
            />
            Derive coverage from gravity / thickness / efficiency
            <span className="font-mono text-fg-dim">
              = 192.3 / (GRAV x THICKNESS) x EFFIC = {derived.toFixed(4)}
            </span>
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={!dirty}
              className="rounded-lg border border-accent/50 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent-strong transition-colors hover:border-accent hover:bg-accent/25 hover:text-fg disabled:cursor-default disabled:border-line disabled:bg-raised disabled:text-fg-dim"
            >
              {!dirty && hasSaved ? "Saved" : "Save constants"}
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={isDefault && !hasSaved && coats === 0}
              className="rounded-lg border border-line bg-raised px-3 py-1.5 text-xs text-fg-faint transition-colors hover:bg-raised-2 hover:text-fg disabled:cursor-default disabled:opacity-50 disabled:hover:bg-raised disabled:hover:text-fg-faint"
            >
              Reset to defaults
            </button>
            <span className="text-[10px] text-fg-dim">
              Unsaved changes and coats are dropped on reload.
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
