"use client";

import CopyButton from "./CopyButton";

type Props = {
  name: string;
  value: string;
  unit?: string;
  formula?: string;
  emphasis?: boolean;
};

export default function ValueRow({ name, value, unit, formula, emphasis }: Props) {
  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]">
      <div className="min-w-0 flex-1">
        <div className={`truncate font-mono text-[11px] tracking-wide ${emphasis ? "text-zinc-200" : "text-zinc-400"}`}>
          #{name}
        </div>
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
        {unit ? <span className="w-8 text-[11px] text-zinc-500">{unit}</span> : <span className="w-8" />}
        <CopyButton value={value} title={`Copy #${name} (${value})`} />
      </div>
    </div>
  );
}
