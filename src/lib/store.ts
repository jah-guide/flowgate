import { SEED_REQUESTS } from "./seed";
import type { CreateRequestInput, ServiceRequest, TimelineEvent } from "./types";
import { computeSlaDueAt } from "./sla";

const globalStore = globalThis as typeof globalThis & {
  __flowgateRequests?: ServiceRequest[];
};

function getStore(): ServiceRequest[] {
  if (!globalStore.__flowgateRequests) {
    globalStore.__flowgateRequests = structuredClone(SEED_REQUESTS);
  }
  return globalStore.__flowgateRequests;
}

function nextId(): string {
  const store = getStore();
  const nums = store
    .map((r) => parseInt(r.id.replace("SR-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `SR-${max + 1}`;
}

function appendEvent(
  request: ServiceRequest,
  event: Omit<TimelineEvent, "id" | "at"> & { at?: string },
): void {
  request.timeline.push({
    id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: event.at ?? new Date().toISOString(),
    type: event.type,
    actor: event.actor,
    label: event.label,
    note: event.note,
  });
}

export function listRequests(): ServiceRequest[] {
  return [...getStore()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getRequest(id: string): ServiceRequest | undefined {
  return getStore().find((r) => r.id === id);
}

export function createRequest(input: CreateRequestInput): ServiceRequest {
  const createdAt = new Date().toISOString();
  const request: ServiceRequest = {
    id: nextId(),
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    priority: input.priority,
    requester: input.requester.trim(),
    department: input.department.trim(),
    status: "submitted",
    createdAt,
    slaDueAt: computeSlaDueAt(createdAt, input.priority),
    timeline: [],
  };

  appendEvent(request, {
    type: "created",
    actor: input.requester.trim(),
    label: "Request submitted",
  });

  getStore().unshift(request);
  return request;
}

export function triageRequest(id: string, note?: string): ServiceRequest {
  const request = getRequest(id);
  if (!request) throw new Error("Request not found");
  if (request.status !== "submitted") {
    throw new Error("Only submitted requests can be triaged");
  }

  appendEvent(request, {
    type: "triaged",
    actor: "Ops Analyst (demo)",
    label: `Triaged as ${request.priority} — ${request.category}`,
    note,
  });
  appendEvent(request, {
    type: "routed",
    actor: "System",
    label: "Routed to line manager approval",
  });
  request.status = "pending_manager";

  return request;
}

export function approveRequest(id: string, actor: string, note?: string): ServiceRequest {
  const request = getRequest(id);
  if (!request) throw new Error("Request not found");

  if (request.status === "pending_manager") {
    appendEvent(request, {
      type: "approved",
      actor,
      label: "Manager approved",
      note,
    });
    request.status = "pending_director";
    appendEvent(request, {
      type: "routed",
      actor: "System",
      label: "Routed to director approval",
    });
    return request;
  }

  if (request.status === "pending_director") {
    appendEvent(request, {
      type: "approved",
      actor,
      label: "Director approved — ready for fulfillment",
      note,
    });
    request.status = "approved";
    return request;
  }

  throw new Error("Request is not awaiting approval");
}

export function rejectRequest(id: string, actor: string, note?: string): ServiceRequest {
  const request = getRequest(id);
  if (!request) throw new Error("Request not found");

  if (request.status !== "pending_manager" && request.status !== "pending_director") {
    throw new Error("Request is not awaiting approval");
  }

  appendEvent(request, {
    type: "rejected",
    actor,
    label: "Approval rejected",
    note,
  });
  request.status = "rejected";
  return request;
}

export function resetDemoData(): void {
  globalStore.__flowgateRequests = structuredClone(SEED_REQUESTS);
}
