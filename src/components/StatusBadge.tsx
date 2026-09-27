import { STATUS_LABELS, type RequestStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <span className={`status status-${status}`}>{STATUS_LABELS[status]}</span>;
}
