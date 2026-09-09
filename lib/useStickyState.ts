"use client";

import { useEffect, useState } from "react";

/** useState that rehydrates from localStorage after mount (SSR-safe). */
export function useStickyState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const stored = JSON.parse(raw);
        // Merge over the defaults so settings saved before a new key existed stay valid.
        const merged =
          isPlainObject(stored) && isPlainObject(initial)
            ? ({ ...initial, ...stored } as T)
            : (stored as T);
        setValue(merged);
      }
    } catch {
      /* ignore corrupt or blocked storage */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
