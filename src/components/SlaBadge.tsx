import { formatSlaRemaining, getSlaStatus } from "@/lib/sla";
import type { ServiceRequest } from "@/lib/types";
import { SlaCountdown } from "./SlaCountdown";
import { SlaProgressBar } from "./SlaProgressBar";

const LABELS = {
  on_track: "On Track",
  at_risk: "At Risk",
  breached: "Breached",
} as const;

export function SlaBadge({ request }: { request: ServiceRequest }) {
  const status = getSlaStatus(request);
  return (
    <span
      className={`badge sla sla-${status}`}
      title={formatSlaRemaining(request)}
      aria-label={`SLA ${LABELS[status]}: ${formatSlaRemaining(request)}`}
    >
      <span className="badge-dot" aria-hidden />
      <span className="badge-label">{LABELS[status]}</span>
    </span>
  );
}

export function SlaDetail({ request }: { request: ServiceRequest }) {
  const status = getSlaStatus(request);
  const remaining = formatSlaRemaining(request);
  return (
    <div className={`sla-panel sla-panel-${status}`} aria-live="polite">
      <div className="sla-panel-head">
        <SlaBadge request={request} />
        <SlaCountdown request={request} className="sla-meta sla-meta-live" />
        <span className="visually-hidden">Static readout: {remaining}</span>
      </div>
      <SlaProgressBar request={request} />
      <dl className="sla-dl">
        <div>
          <dt>Priority</dt>
          <dd>{request.priority}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>{new Date(request.slaDueAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt>Opened</dt>
          <dd>{new Date(request.createdAt).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
}
