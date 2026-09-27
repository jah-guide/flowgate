"use server";

import { revalidatePath } from "next/cache";
import {
  approveRequest,
  createRequest,
  rejectRequest,
  resetDemoData,
  triageRequest,
} from "./store";
import type { CreateRequestInput, Priority } from "./types";

export async function createRequestAction(formData: FormData) {
  const input: CreateRequestInput = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "General"),
    priority: String(formData.get("priority") ?? "P3") as Priority,
    requester: String(formData.get("requester") ?? "Demo User"),
    department: String(formData.get("department") ?? "Unassigned"),
  };

  const request = createRequest(input);
  revalidatePath("/requests");
  revalidatePath(`/requests/${request.id}`);
  return request.id;
}

export async function triageAction(id: string, formData: FormData) {
  const note = String(formData.get("note") ?? "").trim() || undefined;
  triageRequest(id, note);
  revalidatePath("/requests");
  revalidatePath(`/requests/${id}`);
}

export async function approveAction(id: string, formData: FormData) {
  const role = String(formData.get("role") ?? "Approver");
  const note = String(formData.get("note") ?? "").trim() || undefined;
  const actor =
    role === "manager" ? "Line Manager (demo)" : role === "director" ? "Director (demo)" : role;
  approveRequest(id, actor, note);
  revalidatePath("/requests");
  revalidatePath(`/requests/${id}`);
}

export async function rejectAction(id: string, formData: FormData) {
  const role = String(formData.get("role") ?? "Approver");
  const note = String(formData.get("note") ?? "").trim() || undefined;
  const actor =
    role === "manager" ? "Line Manager (demo)" : role === "director" ? "Director (demo)" : role;
  rejectRequest(id, actor, note);
  revalidatePath("/requests");
  revalidatePath(`/requests/${id}`);
}

export async function resetDemoAction() {
  resetDemoData();
  revalidatePath("/");
  revalidatePath("/requests");
}
