import { SEED_REQUESTS } from "./seed";
import type { CreateRequestInput, ServiceRequest, TimelineEvent } from "./types";
import { computeSlaDueAt } from "./sla";

export function initialRequests(): ServiceRequest[] {
  return structuredClone(SEED_REQUESTS);
}

function nextId(store: ServiceRequest[]): string {
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

export function listRequests(store: ServiceRequest[]): ServiceRequest[] {
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getRequest(store: ServiceRequest[], id: string): ServiceRequest | undefined {
  return store.find((r) => r.id === id);
}

export function createRequest(
  store: ServiceRequest[],
  input: CreateRequestInput,
): { store: ServiceRequest[]; request: ServiceRequest } {
  const createdAt = new Date().toISOString();
  const request: ServiceRequest = {
    id: nextId(store),
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

  return { store: [request, ...store], request };
}

export function triageRequest(
  store: ServiceRequest[],
  id: string,
  note?: string,
): ServiceRequest[] {
  return store.map((request) => {
    if (request.id !== id) return request;
    if (request.status !== "submitted") {
      throw new Error("Only submitted requests can be triaged");
    }
    const next = structuredClone(request);
    appendEvent(next, {
      type: "triaged",
      actor: "Ops Analyst (demo)",
      label: `Triaged as ${next.priority} — ${next.category}`,
      note,
    });
    appendEvent(next, {
      type: "routed",
      actor: "System",
      label: "Routed to line manager approval",
    });
    next.status = "pending_manager";
    return next;
  });
}

export function approveRequest(
  store: ServiceRequest[],
  id: string,
  actor: string,
  note?: string,
): ServiceRequest[] {
  return store.map((request) => {
    if (request.id !== id) return request;
    const next = structuredClone(request);

    if (next.status === "pending_manager") {
      appendEvent(next, {
        type: "approved",
        actor,
        label: "Manager approved",
        note,
      });
      next.status = "pending_director";
      appendEvent(next, {
        type: "routed",
        actor: "System",
        label: "Routed to director approval",
      });
      return next;
    }

    if (next.status === "pending_director") {
      appendEvent(next, {
        type: "approved",
        actor,
        label: "Director approved — ready for fulfillment",
        note,
      });
      next.status = "approved";
      return next;
    }

    throw new Error("Request is not awaiting approval");
  });
}

export function rejectRequest(
  store: ServiceRequest[],
  id: string,
  actor: string,
  note?: string,
): ServiceRequest[] {
  return store.map((request) => {
    if (request.id !== id) return request;
    if (request.status !== "pending_manager" && request.status !== "pending_director") {
      throw new Error("Request is not awaiting approval");
    }
    const next = structuredClone(request);
    appendEvent(next, {
      type: "rejected",
      actor,
      label: "Approval rejected",
      note,
    });
    next.status = "rejected";
    return next;
  });
}
