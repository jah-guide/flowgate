"use client";

import { useEffect, useRef } from "react";
import { approveAction, rejectAction, triageAction } from "@/lib/actions";
import type { RequestStatus } from "@/lib/types";

function confirmOrCancel(message: string): boolean {
  return window.confirm(message);
}

export function RequestWorkflowPanel({ id, status }: { id: string; status: RequestStatus }) {
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
          action={triageAction.bind(null, id)}
          className="stack-form"
          onSubmit={(e) => {
            if (
              !confirmOrCancel(
                "Complete triage and route this request to manager approval?",
              )
            ) {
              e.preventDefault();
            }
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
          action={approveAction.bind(null, id)}
          className="stack-form"
          onSubmit={(e) => {
            if (!confirmOrCancel(`Approve as ${role} and advance this request?`)) {
              e.preventDefault();
            }
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
          action={rejectAction.bind(null, id)}
          className="stack-form"
          onSubmit={(e) => {
            if (!confirmOrCancel(`Reject this request as ${role}? This cannot be undone.`)) {
              e.preventDefault();
            }
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
