"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

type Props = {
  value: string;
  label?: string;
  className?: string;
  title?: string;
};

type State = "idle" | "copied" | "failed";

export default function CopyButton({ value, label, className = "", title }: Props) {
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
        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-100";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        title={title ?? `Copy ${value}`}
        aria-label={title ?? `Copy ${value}`}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${tone} ${className}`}
      >
        {state === "copied" ? <CheckIcon /> : <CopyIcon />}
        {label ? <span>{state === "copied" ? "Copied" : label}</span> : null}
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
