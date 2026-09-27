import { getSlaStatus } from "./sla";
import type { Priority, RequestStatus, ServiceRequest, SlaStatus } from "./types";

export type QueueSlaFilter = "all" | SlaStatus;
export type QueueStatusFilter = "all" | RequestStatus | "open";
export type QueueQuickView = "none" | "attention" | "approval" | "open_p1";
export type QueueSort = "newest" | "sla_urgency";

export interface QueueFilters {
  query: string;
  status: QueueStatusFilter;
  priority: Priority | "all";
  sla: QueueSlaFilter;
  quick: QueueQuickView;
  sort: QueueSort;
}

export const DEFAULT_QUEUE_FILTERS: QueueFilters = {
  query: "",
  status: "all",
  priority: "all",
  sla: "all",
  quick: "none",
  sort: "newest",
};

export const QUEUE_PRESETS: Record<
  Exclude<QueueQuickView, "none">,
  { label: string; filters: QueueFilters }
> = {
  attention: {
    label: "Needs attention",
    filters: {
      query: "",
      status: "open",
      priority: "all",
      sla: "all",
      quick: "attention",
      sort: "sla_urgency",
    },
  },
  approval: {
    label: "Awaiting approval",
    filters: {
      query: "",
      status: "all",
      priority: "all",
      sla: "all",
      quick: "approval",
      sort: "sla_urgency",
    },
  },
  open_p1: {
    label: "Open P1",
    filters: {
      query: "",
      status: "open",
      priority: "P1",
      sla: "all",
      quick: "open_p1",
      sort: "sla_urgency",
    },
  },
};

function matchesQuery(request: ServiceRequest, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    request.id,
    request.title,
    request.description,
    request.category,
    request.requester,
    request.department,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function isOpen(request: ServiceRequest): boolean {
  return request.status !== "approved" && request.status !== "rejected";
}

function matchesQuickView(request: ServiceRequest, quick: QueueQuickView): boolean {
  if (quick === "none") return true;
  if (quick === "attention") {
    if (!isOpen(request)) return false;
    const sla = getSlaStatus(request);
    return sla === "at_risk" || sla === "breached";
  }
  if (quick === "approval") {
    return request.status === "pending_manager" || request.status === "pending_director";
  }
  if (quick === "open_p1") {
    return isOpen(request) && request.priority === "P1";
  }
  return true;
}

export function filterRequests(
  requests: ServiceRequest[],
  filters: QueueFilters,
): ServiceRequest[] {
  const filtered = requests.filter((request) => {
    if (!matchesQuery(request, filters.query)) return false;
    if (!matchesQuickView(request, filters.quick)) return false;

    if (filters.status === "open") {
      if (!isOpen(request)) return false;
    } else if (filters.status !== "all" && request.status !== filters.status) {
      return false;
    }

    if (filters.priority !== "all" && request.priority !== filters.priority) {
      return false;
    }

    if (filters.sla !== "all" && getSlaStatus(request) !== filters.sla) {
      return false;
    }

    return true;
  });

  return sortRequests(filtered, filters.sort);
}

export function sortRequests(requests: ServiceRequest[], sort: QueueSort): ServiceRequest[] {
  if (sort === "newest") {
    return [...requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return [...requests].sort(
    (a, b) => new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime(),
  );
}

export function countActiveFilters(filters: QueueFilters): number {
  let n = 0;
  if (filters.query.trim()) n += 1;
  if (filters.status !== "all") n += 1;
  if (filters.priority !== "all") n += 1;
  if (filters.sla !== "all") n += 1;
  if (filters.quick !== "none") n += 1;
  if (filters.sort !== "newest") n += 1;
  return n;
}

export function filtersToSearchParams(filters: QueueFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.priority !== "all") params.set("priority", filters.priority);
  if (filters.sla !== "all") params.set("sla", filters.sla);
  if (filters.quick !== "none") params.set("quick", filters.quick);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params;
}

export function filtersFromSearchParams(params: URLSearchParams): QueueFilters {
  const next: QueueFilters = { ...DEFAULT_QUEUE_FILTERS };
  const q = params.get("q");
  if (q) next.query = q;

  const status = params.get("status");
  if (status) next.status = status as QueueStatusFilter;

  const priority = params.get("priority");
  if (priority === "P1" || priority === "P2" || priority === "P3") {
    next.priority = priority;
  }

  const sla = params.get("sla");
  if (sla === "on_track" || sla === "at_risk" || sla === "breached") {
    next.sla = sla;
  }

  const quick = params.get("quick");
  if (quick === "attention" || quick === "approval" || quick === "open_p1") {
    next.quick = quick;
  }

  const sort = params.get("sort");
  if (sort === "sla_urgency") next.sort = sort;

  return next;
}

export function countAttentionRequests(requests: ServiceRequest[]): number {
  return requests.filter((request) => matchesQuickView(request, "attention")).length;
}
