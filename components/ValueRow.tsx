"use client";

import CopyButton from "./CopyButton";

type Props = {
  /** Human-readable title shown by default. */
  label: string;
  /** Onshape variable name, shown when variable mode is on and used for copying. */
  name: string;
  value: string;
  unit?: string;
  formula?: string;
  emphasis?: boolean;
  showVars?: boolean;
};

export default function ValueRow({
  label,
  name,
  value,
  unit,
  formula,
  emphasis,
  showVars = false,
}: Props) {
  return (
    <div
      title={showVars ? formula : `#${name}`}
      className="group flex items-center gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/[0.04]"
    >
      <div className="min-w-0 flex-1">
        {showVars ? (
          <div className={`truncate font-mono text-[11px] ${emphasis ? "text-zinc-200" : "text-zinc-400"}`}>
            #{name}
          </div>
        ) : (
          <div className={`truncate text-[13px] ${emphasis ? "font-medium text-zinc-100" : "text-zinc-300"}`}>
            {label}
          </div>
        )}
        {showVars && formula ? (
          <div className="truncate font-mono text-[10px] text-zinc-600">{formula}</div>
        ) : null}
      </div>
      <span
        className={`select-all tabular-nums ${
          emphasis ? "text-base font-semibold text-white" : "text-[13px] font-medium text-zinc-100"
        }`}
      >
        {value}
      </span>
      <span className="w-8 text-[10px] text-zinc-500">{unit ?? ""}</span>
      <CopyButton value={value} title={`Copy ${label} — #${name} (${value})`} />
    </div>
  );
}
