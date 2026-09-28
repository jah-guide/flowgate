"use client";

import { useEffect, useState } from "react";

export function StatusStripClock() {
  const [stamp, setStamp] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setStamp(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className="status-strip-clock" dateTime={stamp ?? undefined} suppressHydrationWarning>
      {stamp ?? "—:—:—"}
    </time>
  );
}
