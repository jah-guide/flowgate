import { STATUS_LABELS, type RequestStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`badge status status-${status}`}>
      <span className="badge-dot" aria-hidden />
      <span className="badge-label">{STATUS_LABELS[status]}</span>
    </span>
  );
}
