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
      title={`#${name}`}
      className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]"
    >
      <div className="min-w-0 flex-1">
        {showVars ? (
          <div className={`truncate font-mono text-[11px] tracking-wide ${emphasis ? "text-zinc-200" : "text-zinc-400"}`}>
            #{name}
          </div>
        ) : (
          <div className={`truncate text-sm ${emphasis ? "font-medium text-zinc-100" : "text-zinc-300"}`}>
            {label}
          </div>
        )}
        {formula ? (
          <div className="truncate font-mono text-[10px] text-zinc-600">{formula}</div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`select-all tabular-nums ${
            emphasis ? "text-lg font-semibold text-white" : "text-sm font-medium text-zinc-100"
          }`}
        >
          {value}
        </span>
        {unit ? (
          <span className="w-9 text-[11px] text-zinc-500">{unit}</span>
        ) : (
          <span className="w-9" />
        )}
        <CopyButton value={value} title={`Copy ${label} — #${name} (${value})`} />
      </div>
    </div>
  );
}
