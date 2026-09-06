import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** What the user has chosen: light, dark, or "follow system". */
  preference: ThemePreference;
  /** The theme actually applied to the document right now. */
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const STORAGE_KEY = "happystore-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    readStoredPreference,
  );
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(
    getSystemTheme,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const resolvedTheme: ResolvedTheme =
    preference === "system" ? systemTheme : preference;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setPreference]);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference, toggle }),
    [preference, resolvedTheme, setPreference, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
