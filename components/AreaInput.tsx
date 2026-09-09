"use client";

import { useCallback, useState } from "react";
import CopyButton from "./CopyButton";
import { readText } from "@/lib/clipboard";
import { parseNumeric, SQ_IN_PER_SQ_FT } from "@/lib/calc";

type Unit = "in" | "ft";

type Props = {
  sqin: number;
  onChange: (sqin: number) => void;
  decimals: number;
};

export default function AreaInput({ sqin, onChange, decimals }: Props) {
  const [unit, setUnit] = useState<Unit>("in");
  const [draft, setDraft] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const sqft = sqin / SQ_IN_PER_SQ_FT;
  const shown = unit === "in" ? sqin : sqft;
  const display = draft ?? (shown ? String(Number(shown.toFixed(6))) : "");

  const commit = useCallback(
    (raw: string, asUnit: Unit) => {
      const n = parseFloat(raw.replace(/,/g, ""));
      const val = isFinite(n) && n >= 0 ? n : 0;
      onChange(asUnit === "in" ? val : val * SQ_IN_PER_SQ_FT);
    },
    [onChange],
  );

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text === null) {
      setHint("Clipboard blocked — press Ctrl+V in the field instead.");
      setTimeout(() => setHint(null), 3500);
      return;
    }
    const { value, unit: detected } = parseNumeric(text);
    if (value === null) {
      setHint(`No number found in "${text.slice(0, 24)}"`);
      setTimeout(() => setHint(null), 3000);
      return;
    }
    const useUnit = detected ?? unit;
    setUnit(useUnit);
    setDraft(null);
    onChange(useUnit === "in" ? value : value * SQ_IN_PER_SQ_FT);
    setHint(detected ? `Pasted ${value} as ${detected === "in" ? "in²" : "ft²"} (detected)` : `Pasted ${value}`);
    setTimeout(() => setHint(null), 2500);
  }, [onChange, unit]);

  const onFieldPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text");
      const { value, unit: detected } = parseNumeric(text);
      if (value === null) return;
      e.preventDefault();
      const useUnit = detected ?? unit;
      setUnit(useUnit);
      setDraft(null);
      onChange(useUnit === "in" ? value : value * SQ_IN_PER_SQ_FT);
    },
    [onChange, unit],
  );

  const switchUnit = (next: Unit) => {
    setDraft(null);
    setUnit(next);
  };

  return (
    <section className="rounded-xl border border-sky-500/25 bg-gradient-to-b from-sky-500/[0.09] to-transparent p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Total surface area</h2>
        <div className="flex rounded-lg border border-white/10 bg-black/30 p-0.5">
          {(["in", "ft"] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => switchUnit(u)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                unit === u ? "bg-sky-500 text-white" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {u === "in" ? "in²" : "ft²"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            inputMode="decimal"
            value={display}
            onChange={(e) => {
              setDraft(e.target.value);
              commit(e.target.value, unit);
            }}
            onBlur={() => setDraft(null)}
            onPaste={onFieldPaste}
            placeholder="0"
            aria-label={`Total surface area in square ${unit === "in" ? "inches" : "feet"}`}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-3 pr-14 font-mono text-2xl tabular-nums text-white outline-none transition-colors focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/20"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
            {unit === "in" ? "in²" : "ft²"}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePaste}
          title="Paste surface area from clipboard"
          className="flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/15 px-4 text-sm font-semibold text-sky-200 transition-colors hover:border-sky-400 hover:bg-sky-500/25 hover:text-white"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
          </svg>
          Paste
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Converted label="Square inches" value={sqin.toFixed(decimals)} />
        <Converted label="Square feet" value={sqft.toFixed(decimals)} />
      </div>

      <p className="mt-2 h-4 text-[11px] text-sky-300/80">{hint ?? ""}</p>
    </section>
  );
}

function Converted({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
        <div className="truncate font-mono text-sm tabular-nums text-zinc-100">{value}</div>
      </div>
      <CopyButton value={value} title={`Copy ${value} ${label}`} />
    </div>
  );
}
