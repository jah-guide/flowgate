import { approveAction, rejectAction, triageAction } from "@/lib/actions";
import type { RequestStatus } from "@/lib/types";

export function RequestActions({ id, status }: { id: string; status: RequestStatus }) {
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
        <form action={triageAction.bind(null, id)} className="stack-form">
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
      <div className="action-grid">
        <form action={approveAction.bind(null, id)} className="stack-form">
          <input type="hidden" name="role" value={role} />
          <label>
            Approval note
            <textarea name="note" rows={3} placeholder="Optional comment…" />
          </label>
          <button type="submit" className="button button-approve">
            Approve
          </button>
        </form>
        <form action={rejectAction.bind(null, id)} className="stack-form">
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
