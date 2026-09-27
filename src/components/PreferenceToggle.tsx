"use client";

import { usePreferences, type DensityPreference, type ThemePreference } from "@/lib/preferences";

export function PreferenceToggle() {
  const { preferences, setDensity, setTheme } = usePreferences();

  return (
    <div className="pref-toggle" role="group" aria-label="Display preferences">
      <label className="pref-field">
        <span className="visually-hidden">Table density</span>
        <select
          aria-label="Table density"
          value={preferences.density}
          onChange={(e) => setDensity(e.target.value as DensityPreference)}
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </select>
      </label>
      <label className="pref-field">
        <span className="visually-hidden">Theme</span>
        <select
          aria-label="Theme contrast"
          value={preferences.theme}
          onChange={(e) => setTheme(e.target.value as ThemePreference)}
        >
          <option value="default">Default</option>
          <option value="high-contrast">High contrast</option>
        </select>
      </label>
    </div>
  );
}
