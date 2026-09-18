"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * useState that starts from the last explicitly *saved* value in localStorage
 * but never persists on its own: edits stay in memory until `save()` is called,
 * so a reload always drops unsaved deviations. `reset()` returns to `initial`
 * and forgets the saved copy.
 */
export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [saved, setSaved] = useState<T | null>(null);

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
        setSaved(merged);
      }
    } catch {
      /* ignore corrupt or blocked storage */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked */
    }
    setSaved(value);
  }, [key, value]);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* blocked storage */
    }
    setValue(initial);
    setSaved(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const dirty = JSON.stringify(value) !== JSON.stringify(saved ?? initial);
  const isDefault = JSON.stringify(value) === JSON.stringify(initial);

  return { value, setValue, save, reset, dirty, isDefault, hasSaved: saved !== null };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
