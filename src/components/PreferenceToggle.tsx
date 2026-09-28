"use client";

import { usePreferences, type DensityPreference, type ThemePreference } from "@/lib/preferences";

const DENSITY: { value: DensityPreference; label: string }[] = [
  { value: "comfortable", label: "Comfort" },
  { value: "compact", label: "Compact" },
];

const THEME: { value: ThemePreference; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "high-contrast", label: "Contrast" },
];

export function PreferenceToggle() {
  const { preferences, setDensity, setTheme } = usePreferences();

  return (
    <div className="pref-toggle" role="group" aria-label="Display preferences">
      <div className="pref-segment" role="group" aria-label="Table density">
        {DENSITY.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`pref-segment-btn${preferences.density === option.value ? " pref-segment-btn-active" : ""}`}
            aria-pressed={preferences.density === option.value}
            onClick={() => setDensity(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="pref-segment" role="group" aria-label="Theme contrast">
        {THEME.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`pref-segment-btn${preferences.theme === option.value ? " pref-segment-btn-active" : ""}`}
            aria-pressed={preferences.theme === option.value}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
