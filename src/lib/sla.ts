import type { Priority, ServiceRequest, SlaStatus } from "./types";
import { SLA_HOURS } from "./types";

export function computeSlaDueAt(createdAt: string, priority: Priority): string {
  const due = new Date(createdAt);
  due.setHours(due.getHours() + SLA_HOURS[priority]);
  return due.toISOString();
}

export function getSlaStatus(request: ServiceRequest, now = new Date()): SlaStatus {
  if (request.status === "approved" || request.status === "rejected") {
    const resolvedAt = new Date(
      request.timeline[request.timeline.length - 1]?.at ?? request.createdAt,
    );
    return resolvedAt <= new Date(request.slaDueAt) ? "on_track" : "breached";
  }

  const due = new Date(request.slaDueAt).getTime();
  const start = new Date(request.createdAt).getTime();
  const current = now.getTime();

  if (current >= due) return "breached";

  const total = due - start;
  const remaining = due - current;
  const ratio = remaining / total;

  return ratio <= 0.25 ? "at_risk" : "on_track";
}

export function formatSlaRemaining(request: ServiceRequest, now = new Date()): string {
  const due = new Date(request.slaDueAt).getTime();
  const diffMs = due - now.getTime();

  if (diffMs <= 0) {
    const over = Math.abs(diffMs);
    const hours = Math.floor(over / (1000 * 60 * 60));
    const mins = Math.floor((over % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m overdue`;
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m remaining`;
}
