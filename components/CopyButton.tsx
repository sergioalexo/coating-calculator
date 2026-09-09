"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

type Props = {
  value: string;
  label?: string;
  className?: string;
  title?: string;
  /** "icon" is the bare copy glyph; "chip" renders the value and unit as the button itself. */
  variant?: "icon" | "chip";
  unit?: string;
  emphasis?: boolean;
};

type State = "idle" | "copied" | "failed";

export default function CopyButton({
  value,
  label,
  className = "",
  title,
  variant = "icon",
  unit,
  emphasis,
}: Props) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onClick = useCallback(async () => {
    const ok = await copyText(value);
    if (timer.current) clearTimeout(timer.current);
    if (ok) {
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), 1200);
      return;
    }
    // Clipboard blocked by the browser: expose the value pre-selected so Ctrl+C works.
    setState("failed");
    requestAnimationFrame(() => {
      const el = fallbackRef.current;
      if (el) {
        el.focus();
        el.select();
      }
    });
  }, [value]);

  const tone =
    state === "copied"
      ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
      : state === "failed"
        ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
        : variant === "chip"
          ? "cursor-pointer border-white/10 bg-white/[0.04] text-zinc-100 hover:border-sky-400/60 hover:bg-sky-500/10 hover:text-white"
          : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-100";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        title={title ?? `Copy ${value}`}
        aria-label={title ?? `Copy ${value}`}
        className={
          variant === "chip"
            ? `inline-flex shrink-0 items-baseline gap-1 rounded-md border px-2 py-1 transition-colors ${tone} ${className}`
            : `inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${tone} ${className}`
        }
      >
        {variant === "chip" ? (
          <>
            <span
              className={`tabular-nums ${emphasis ? "text-sm font-semibold" : "text-[13px] font-medium"}`}
            >
              {value}
            </span>
            {state === "copied" ? (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium">
                <CheckIcon size={10} />
                Copied
              </span>
            ) : unit ? (
              <span className="text-[10px] text-zinc-500">{unit}</span>
            ) : null}
          </>
        ) : (
          <>
            {state === "copied" ? <CheckIcon /> : <CopyIcon />}
            {label ? <span>{state === "copied" ? "Copied" : label}</span> : null}
          </>
        )}
      </button>

      {state === "failed" ? (
        <span className="absolute right-0 top-full z-20 mt-1 w-60 rounded-lg border border-amber-500/40 bg-zinc-900 p-2 shadow-xl">
          <span className="mb-1 block text-[10px] leading-tight text-amber-300">
            Clipboard blocked by the browser — press Ctrl+C to copy:
          </span>
          <textarea
            ref={fallbackRef}
            readOnly
            rows={value.includes("\n") ? 5 : 1}
            value={value}
            onBlur={() => setState("idle")}
            onKeyDown={(e) => { if (e.key === "Escape") setState("idle"); }}
            className="w-full resize-none rounded border border-white/10 bg-black/50 px-2 py-1 font-mono text-[11px] text-zinc-100 outline-none"
          />
        </span>
      ) : null}
    </span>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
