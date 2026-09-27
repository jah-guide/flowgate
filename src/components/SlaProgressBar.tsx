"use client";

import { useEffect, useState } from "react";
import { getSlaStatus } from "@/lib/sla";
import type { ServiceRequest } from "@/lib/types";

function elapsedRatio(request: ServiceRequest, now: Date): number {
  const start = new Date(request.createdAt).getTime();
  const due = new Date(request.slaDueAt).getTime();
  const total = due - start;
  if (total <= 0) return 1;
  const elapsed = now.getTime() - start;
  return Math.min(1, Math.max(0, elapsed / total));
}

export function SlaProgressBar({ request }: { request: ServiceRequest }) {
  const status = getSlaStatus(request);
  const closed = request.status === "approved" || request.status === "rejected";
  const [ratio, setRatio] = useState(() => elapsedRatio(request, new Date()));

  useEffect(() => {
    if (closed) return;
    setRatio(elapsedRatio(request, new Date()));
    const id = window.setInterval(() => {
      setRatio(elapsedRatio(request, new Date()));
    }, 30_000);
    return () => window.clearInterval(id);
  }, [request, closed]);

  const pct = Math.round(ratio * 100);

  return (
    <div className="sla-progress" aria-hidden={closed}>
      <div className="sla-progress-track">
        <div
          className={`sla-progress-fill sla-progress-fill-${status}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="muted sla-progress-label">
        {closed ? "Resolution window (closed ticket)" : `${pct}% of SLA window elapsed`}
      </p>
    </div>
  );
}
