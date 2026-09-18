"use client";

import CopyButton from "./CopyButton";

export type ValueItem = {
  /** Onshape variable name — used for copying and shown in #name mode. */
  name: string;
  value: string;
  unit?: string;
  formula?: string;
};

type Props = {
  /** Shown once, no matter how many units the quantity is expressed in. */
  label: string;
  items: ValueItem[];
  emphasis?: boolean;
  showVars?: boolean;
};

/** The unit chips on their own — used when a section holds a single quantity
 *  and the chips sit in the section header instead of in a labelled row. */
export function ValueChips({
  label,
  items,
  emphasis,
}: {
  label: string;
  items: ValueItem[];
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {items.map((item) => (
        <CopyButton
          key={item.name}
          variant="chip"
          value={item.value}
          unit={item.unit}
          emphasis={emphasis}
          title={`Copy ${label} — #${item.name} (${item.value}${item.unit ? " " + item.unit : ""})`}
        />
      ))}
    </div>
  );
}

/**
 * One quantity, one label. The same number in several units becomes several
 * chips on the same row instead of repeating the label. Every value is itself
 * the copy button. In #name mode the group expands to one row per variable.
 */
export default function ValueGroup({ label, items, emphasis, showVars = false }: Props) {
  if (showVars) {
    return (
      <>
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-raised"
          >
            <div className="min-w-0 flex-1">
              <div className={`truncate font-mono text-[11px] ${emphasis ? "text-fg" : "text-fg-faint"}`}>
                #{item.name}
              </div>
              {item.formula ? (
                <div className="truncate font-mono text-[10px] text-fg-dim">{item.formula}</div>
              ) : null}
            </div>
            <CopyButton
              variant="chip"
              value={item.value}
              unit={item.unit}
              emphasis={emphasis}
              title={`Copy ${label} — #${item.name} (${item.value})`}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-raised">
      <div
        className={`min-w-0 shrink truncate text-[13px] ${emphasis ? "font-medium text-fg" : "text-fg-muted"}`}
        title={items.map((i) => `#${i.name}`).join("  ")}
      >
        {label}
      </div>
      <div className="flex flex-wrap justify-end gap-1.5">
        {items.map((item) => (
          <CopyButton
            key={item.name}
            variant="chip"
            value={item.value}
            unit={item.unit}
            emphasis={emphasis}
            title={`Copy ${label} — #${item.name} (${item.value}${item.unit ? " " + item.unit : ""})`}
          />
        ))}
      </div>
    </div>
  );
}
