import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RequestTable } from "@/components/RequestTable";
import { getSlaStatus } from "@/lib/sla";
import { listRequests } from "@/lib/store";

export default function HomePage() {
  const requests = listRequests();
  const open = requests.filter((r) => r.status !== "approved" && r.status !== "rejected");
  const breached = open.filter((r) => getSlaStatus(r) === "breached");
  const atRisk = open.filter((r) => getSlaStatus(r) === "at_risk");
  const awaitingApproval = open.filter(
    (r) => r.status === "pending_manager" || r.status === "pending_director",
  );

  return (
    <AppShell
      title="Operations control board"
      subtitle="Track service requests from intake through triage and dual approval, with live SLA posture for open work."
    >
      <div className="hero-grid">
        <section className="card">
          <h2>Today&apos;s posture</h2>
          <p className="muted">
            FlowGate models a shared-services intake desk where every ticket carries a priority-based
            resolution clock and explicit approval gates.
          </p>
          <div className="stat-grid">
            <div className="stat">
              <strong>{open.length}</strong>
              <span>Open requests</span>
            </div>
            <div className="stat">
              <strong>{awaitingApproval.length}</strong>
              <span>Awaiting approval</span>
            </div>
            <div className="stat">
              <strong>{atRisk.length}</strong>
              <span>SLA at risk</span>
            </div>
            <div className="stat">
              <strong>{breached.length}</strong>
              <span>SLA breached</span>
            </div>
          </div>
        </section>
        <section className="card">
          <h2>Demo paths</h2>
          <p className="muted">Walk the happy path or stress-test breach visibility.</p>
          <ol className="muted" style={{ paddingLeft: "1.1rem", margin: 0 }}>
            <li>Create a P1 request and triage it from the detail page.</li>
            <li>Approve as manager, then director.</li>
            <li>Open SR-0975 to see an overdue submitted ticket.</li>
          </ol>
          <p style={{ marginTop: "0.85rem" }}>
            <Link href="/requests/new" className="button">
              Start new request
            </Link>
          </p>
        </section>
      </div>

      <section>
        <div className="page-header" style={{ marginBottom: "0.75rem" }}>
          <h1 style={{ fontSize: "1.15rem" }}>Recent requests</h1>
        </div>
        <RequestTable requests={requests.slice(0, 6)} />
        <p style={{ marginTop: "0.75rem" }}>
          <Link href="/requests" className="row-link">
            View all requests →
          </Link>
        </p>
      </section>
    </AppShell>
  );
}
