"use client";

import { resetDemoAction } from "@/lib/actions";

export function ResetDemoButton() {
  return (
    <form
      action={resetDemoAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Reset all demo data to the seeded queue? User-created requests will be removed.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="link-button">
        Reset demo data
      </button>
    </form>
  );
}
