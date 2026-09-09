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

/**
 * Total surface area, entered in either unit. Both fields are live inputs:
 * type in one and the other follows, so there is no unit toggle.
 */
export default function AreaInput({ sqin, onChange, decimals }: Props) {
  // While a field is focused its raw text wins, so reformatting never fights typing.
  const [draft, setDraft] = useState<{ unit: Unit; text: string } | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const sqft = sqin / SQ_IN_PER_SQ_FT;
  const formatted = (unit: Unit) =>
    (unit === "in" ? sqin : sqft).toFixed(decimals);
  const shown = (unit: Unit) => (draft?.unit === unit ? draft.text : formatted(unit));

  const commit = useCallback(
    (unit: Unit, raw: string) => {
      setDraft({ unit, text: raw });
      const n = parseFloat(raw.replace(/,/g, ""));
      const val = isFinite(n) && n >= 0 ? n : 0;
      onChange(unit === "in" ? val : val * SQ_IN_PER_SQ_FT);
    },
    [onChange],
  );

  const applyPasted = useCallback(
    (text: string, fallback: Unit) => {
      const { value, unit } = parseNumeric(text);
      if (value === null) {
        setHint(`No number found in "${text.slice(0, 24)}"`);
        setTimeout(() => setHint(null), 3000);
        return false;
      }
      const useUnit = unit ?? fallback;
      setDraft(null);
      onChange(useUnit === "in" ? value : value * SQ_IN_PER_SQ_FT);
      setHint(
        unit
          ? `Pasted ${value} as ${unit === "in" ? "in²" : "ft²"} (detected)`
          : `Pasted ${value} as ${useUnit === "in" ? "in²" : "ft²"}`,
      );
      setTimeout(() => setHint(null), 2500);
      return true;
    },
    [onChange],
  );

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text === null) {
      setHint("Clipboard blocked — press Ctrl+V in a field instead.");
      setTimeout(() => setHint(null), 3500);
      return;
    }
    applyPasted(text, "in");
  }, [applyPasted]);

  return (
    <section className="rounded-xl border border-sky-500/25 bg-gradient-to-b from-sky-500/[0.09] to-transparent p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
          Total surface area
        </h2>
        <button
          type="button"
          onClick={handlePaste}
          title="Paste surface area from clipboard"
          className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-200 transition-colors hover:border-sky-400 hover:bg-sky-500/25 hover:text-white"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
          </svg>
          Paste
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field
          unit="in"
          caption="Square inches"
          suffix="in²"
          value={shown("in")}
          copyValue={formatted("in")}
          onChange={commit}
          onBlur={() => setDraft(null)}
          onPasteText={(t) => applyPasted(t, "in")}
        />
        <Field
          unit="ft"
          caption="Square feet"
          suffix="ft²"
          value={shown("ft")}
          copyValue={formatted("ft")}
          onChange={commit}
          onBlur={() => setDraft(null)}
          onPasteText={(t) => applyPasted(t, "ft")}
        />
      </div>

      <p className="mt-1.5 h-3.5 text-[10px] text-sky-300/80">{hint ?? ""}</p>
    </section>
  );
}

function Field({
  unit,
  caption,
  suffix,
  value,
  copyValue,
  onChange,
  onBlur,
  onPasteText,
}: {
  unit: Unit;
  caption: string;
  suffix: string;
  value: string;
  copyValue: string;
  onChange: (unit: Unit, raw: string) => void;
  onBlur: () => void;
  onPasteText: (text: string) => boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 focus-within:border-sky-400/70">
      <div className="mb-0.5 flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">{caption}</span>
        <CopyButton value={copyValue} title={`Copy ${copyValue} ${suffix}`} />
      </div>
      <div className="flex items-baseline gap-1">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(unit, e.target.value)}
          onBlur={onBlur}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (onPasteText(text)) e.preventDefault();
          }}
          placeholder="0"
          aria-label={`Total surface area in square ${unit === "in" ? "inches" : "feet"}`}
          className="w-full min-w-0 bg-transparent font-mono text-lg tabular-nums text-white outline-none"
        />
        <span className="shrink-0 text-[11px] text-zinc-500">{suffix}</span>
      </div>
    </div>
  );
}
