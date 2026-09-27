export type Priority = "P1" | "P2" | "P3";

export type RequestStatus =
  | "submitted"
  | "triaged"
  | "pending_manager"
  | "pending_director"
  | "approved"
  | "rejected";

export type SlaStatus = "on_track" | "at_risk" | "breached";

export type TimelineEventType =
  | "created"
  | "triaged"
  | "routed"
  | "approved"
  | "rejected"
  | "comment";

export interface TimelineEvent {
  id: string;
  at: string;
  type: TimelineEventType;
  actor: string;
  label: string;
  note?: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  requester: string;
  department: string;
  status: RequestStatus;
  createdAt: string;
  slaDueAt: string;
  timeline: TimelineEvent[];
}

export interface CreateRequestInput {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  requester: string;
  department: string;
}

export const SLA_HOURS: Record<Priority, number> = {
  P1: 4,
  P2: 24,
  P3: 72,
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "Submitted",
  triaged: "Triaged",
  pending_manager: "Manager approval",
  pending_director: "Director approval",
  approved: "Approved",
  rejected: "Rejected",
};
