"use client";

import { useEffect, useRef } from "react";
import { useFlowgate } from "@/lib/flowgate-store";
import type { RequestStatus } from "@/lib/types";

function confirmOrCancel(message: string): boolean {
  return window.confirm(message);
}

function actorForRole(role: string): string {
  return role === "manager"
    ? "Line Manager (demo)"
    : role === "director"
      ? "Director (demo)"
      : role;
}

export function RequestWorkflowPanel({ id, status }: { id: string; status: RequestStatus }) {
  const { triageRequest, approveRequest, rejectRequest } = useFlowgate();
  const triageRef = useRef<HTMLFormElement>(null);
  const approveRef = useRef<HTMLFormElement>(null);
  const rejectRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button")) return;

      if (status === "submitted" && event.key.toLowerCase() === "t") {
        event.preventDefault();
        triageRef.current?.requestSubmit();
      }
      if (
        (status === "pending_manager" || status === "pending_director") &&
        event.key.toLowerCase() === "a"
      ) {
        event.preventDefault();
        approveRef.current?.requestSubmit();
      }
      if (
        (status === "pending_manager" || status === "pending_director") &&
        event.key.toLowerCase() === "x"
      ) {
        event.preventDefault();
        rejectRef.current?.querySelector("textarea")?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status]);

  if (status === "approved" || status === "rejected") {
    return (
      <section className="card">
        <h2>Workflow</h2>
        <p className="muted">This request is closed — no further actions available.</p>
      </section>
    );
  }

  if (status === "submitted") {
    return (
      <section className="card card-accent">
        <h2>Triage</h2>
        <p className="muted">Validate category and priority, then route to manager approval.</p>
        <p className="kbd-hint muted">
          Keyboard: <kbd>T</kbd> complete triage (with confirmation)
        </p>
        <form
          ref={triageRef}
          className="stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !confirmOrCancel(
                "Complete triage and route this request to manager approval?",
              )
            ) {
              return;
            }
            const note =
              String(new FormData(e.currentTarget).get("note") ?? "").trim() || undefined;
            triageRequest(id, note);
          }}
        >
          <label>
            Triage note
            <span className="field-hint">Optional — captured on the timeline</span>
            <textarea name="note" rows={3} placeholder="Routing rationale, dependencies…" />
          </label>
          <button type="submit" className="button">
            Complete triage &amp; route to manager
          </button>
        </form>
      </section>
    );
  }

  const role = status === "pending_manager" ? "manager" : "director";
  const heading = status === "pending_manager" ? "Manager approval" : "Director approval";

  return (
    <section className="card">
      <h2>{heading}</h2>
      <p className="muted">Approve to advance, or reject with a required reason.</p>
      <p className="kbd-hint muted">
        Keyboard: <kbd>A</kbd> approve · <kbd>X</kbd> focus rejection reason
      </p>
      <div className="action-grid">
        <form
          ref={approveRef}
          className="stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!confirmOrCancel(`Approve as ${role} and advance this request?`)) {
              return;
            }
            const formData = new FormData(e.currentTarget);
            const note = String(formData.get("note") ?? "").trim() || undefined;
            approveRequest(id, actorForRole(role), note);
          }}
        >
          <input type="hidden" name="role" value={role} />
          <label>
            Approval note
            <textarea name="note" rows={3} placeholder="Optional comment…" />
          </label>
          <button type="submit" className="button button-approve">
            Approve
          </button>
        </form>
        <form
          ref={rejectRef}
          className="stack-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!confirmOrCancel(`Reject this request as ${role}? This cannot be undone.`)) {
              return;
            }
            const formData = new FormData(e.currentTarget);
            const note = String(formData.get("note") ?? "").trim() || undefined;
            rejectRequest(id, actorForRole(role), note);
          }}
        >
          <input type="hidden" name="role" value={role} />
          <label>
            Rejection reason
            <span className="field-hint">Required</span>
            <textarea name="note" rows={3} required placeholder="Why this request cannot proceed…" />
          </label>
          <button type="submit" className="button button-reject">
            Reject
          </button>
        </form>
      </div>
    </section>
  );
}
