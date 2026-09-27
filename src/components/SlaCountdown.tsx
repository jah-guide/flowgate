"use client";

import { useEffect, useState } from "react";
import { formatSlaRemaining, getSlaStatus } from "@/lib/sla";
import type { ServiceRequest } from "@/lib/types";

export function SlaCountdown({
  request,
  className = "",
}: {
  request: ServiceRequest;
  className?: string;
}) {
  const [label, setLabel] = useState(() => formatSlaRemaining(request));
  const status = getSlaStatus(request);

  useEffect(() => {
    setLabel(formatSlaRemaining(request));
    const id = window.setInterval(() => {
      setLabel(formatSlaRemaining(request));
    }, 30_000);
    return () => window.clearInterval(id);
  }, [request]);

  return (
    <span className={`sla-countdown sla-countdown-${status} ${className}`.trim()} title={label}>
      {label}
    </span>
  );
}
