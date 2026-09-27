"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DensityPreference = "comfortable" | "compact";
export type ThemePreference = "default" | "high-contrast";

export interface UiPreferences {
  density: DensityPreference;
  theme: ThemePreference;
}

const STORAGE_KEY = "flowgate-ui-preferences";

const DEFAULT_PREFERENCES: UiPreferences = {
  density: "comfortable",
  theme: "default",
};

interface PreferencesContextValue {
  preferences: UiPreferences;
  setDensity: (density: DensityPreference) => void;
  setTheme: (theme: ThemePreference) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function readStored(): UiPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<UiPreferences>;
    return {
      density: parsed.density === "compact" ? "compact" : "comfortable",
      theme: parsed.theme === "high-contrast" ? "high-contrast" : "default",
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function applyDocumentPrefs(prefs: UiPreferences) {
  document.documentElement.dataset.density = prefs.density;
  document.documentElement.dataset.theme = prefs.theme;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UiPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const stored = readStored();
    setPreferences(stored);
    applyDocumentPrefs(stored);
  }, []);

  const setDensity = useCallback(
    (density: DensityPreference) => {
      setPreferences((prev) => {
        const next = { ...prev, density };
        applyDocumentPrefs(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const setTheme = useCallback(
    (theme: ThemePreference) => {
      setPreferences((prev) => {
        const next = { ...prev, theme };
        applyDocumentPrefs(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ preferences, setDensity, setTheme }),
    [preferences, setDensity, setTheme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
