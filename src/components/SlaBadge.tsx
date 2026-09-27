import { formatSlaRemaining, getSlaStatus } from "@/lib/sla";
import type { ServiceRequest } from "@/lib/types";

const LABELS = {
  on_track: "On Track",
  at_risk: "At Risk",
  breached: "Breached",
} as const;

export function SlaBadge({ request }: { request: ServiceRequest }) {
  const status = getSlaStatus(request);
  return (
    <span className={`sla sla-${status}`} title={formatSlaRemaining(request)}>
      {LABELS[status]}
    </span>
  );
}

export function SlaDetail({ request }: { request: ServiceRequest }) {
  const status = getSlaStatus(request);
  const remaining = formatSlaRemaining(request);
  return (
    <div className={`sla-panel sla-panel-${status}`}>
      <div className="sla-panel-head">
        <span className={`sla sla-${status}`}>{LABELS[status]}</span>
        <span className="sla-meta">{remaining}</span>
      </div>
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
