import Link from "next/link";
import { ActivityFeed } from "@/components/ActivityFeed";
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
      eyebrow="Live posture"
      title="Operations control board"
      subtitle="Intake, triage, and dual approval with SLA badges on every open ticket."
    >
      <div className="hero-grid">
        <section className="card card-accent">
          <h2>Queue snapshot</h2>
          <p className="muted">
            Counts refresh from the in-memory store — same data as the requests list and detail
            actions.
          </p>
          <div className="stat-grid">
            <div className="stat stat-accent">
              <strong>{open.length}</strong>
              <span>Open requests</span>
            </div>
            <div className="stat">
              <strong>{awaitingApproval.length}</strong>
              <span>Awaiting approval</span>
            </div>
            <div className="stat stat-warn">
              <strong>{atRisk.length}</strong>
              <span>SLA at risk</span>
            </div>
            <div className="stat stat-danger">
              <strong>{breached.length}</strong>
              <span>SLA breached</span>
            </div>
          </div>
          <p className="quick-links muted">
            Quick views:{" "}
            <Link href="/requests?quick=attention">Needs attention</Link>
            {" · "}
            <Link href="/requests?quick=approval">Awaiting approval</Link>
            {" · "}
            <Link href="/requests?quick=open_p1">Open P1</Link>
          </p>
        </section>
        <section className="card">
          <h2>Demo walkthrough</h2>
          <p className="muted">Three minutes to show intake → approval → breach visibility.</p>
          <ol className="demo-steps">
            <li>Create a P1 from <strong>New request</strong>, then triage on the detail page.</li>
            <li>Approve as manager, then director.</li>
            <li>Open seeded <strong>SR-0975</strong> for a breached submitted ticket.</li>
          </ol>
          <p style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Link href="/requests/new" className="button">
              Start new request
            </Link>
            <Link href="/requests" className="button button-ghost">
              Full queue
            </Link>
          </p>
        </section>
      </div>

      <div className="dashboard-grid">
        <section>
          <div className="table-toolbar">
            <h2>Recent requests</h2>
            <Link href="/requests" className="row-link">
              View all →
            </Link>
          </div>
          <RequestTable requests={requests.slice(0, 6)} caption="Latest six tickets" compact />
        </section>
        <ActivityFeed requests={requests} />
      </div>
    </AppShell>
  );
}
