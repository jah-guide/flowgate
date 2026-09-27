"use client";

import { useFlowgate } from "@/lib/flowgate-store";

export function ResetDemoButton() {
  const { resetDemoData } = useFlowgate();

  return (
    <button
      type="button"
      className="link-button"
      onClick={() => {
        if (
          !window.confirm(
            "Reset all demo data to the seeded queue? User-created requests will be removed.",
          )
        ) {
          return;
        }
        resetDemoData();
      }}
    >
      Reset demo data
    </button>
  );
}
