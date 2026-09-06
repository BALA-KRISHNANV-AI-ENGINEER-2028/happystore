// =============================================================================
// Happy Store — useLocalStorage Hook
// =============================================================================

import { useState, useCallback } from "react";

/**
 * A state hook that persists its value to localStorage.
 * Falls back to `defaultValue` if the key is missing or corrupted.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  return [stored, setValue];
}
