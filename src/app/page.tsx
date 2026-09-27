"use client";

import Link from "next/link";
import { ActivityFeed } from "@/components/ActivityFeed";
import { AppShell } from "@/components/AppShell";
import { RequestTable } from "@/components/RequestTable";
import { useFlowgate } from "@/lib/flowgate-store";
import { getSlaStatus } from "@/lib/sla";

export default function HomePage() {
  const { listRequests } = useFlowgate();
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
      <section className="board-hero" aria-label="Queue snapshot">
        <div className="board-hero-head">
          <div>
            <h2>Queue snapshot</h2>
            <p className="muted">
              Counts refresh from the browser-local store — same data as the requests list and
              detail actions.
            </p>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: "0.82rem", maxWidth: "28ch" }}>
            Demo path: intake → triage → dual approval → breach visibility on{" "}
            <Link href="/requests/detail?id=SR-0975" className="row-link">
              SR-0975
            </Link>
            .
          </p>
        </div>
        <div className="kpi-rail">
          <div className="kpi-cell kpi-cell-accent">
            <strong>{open.length}</strong>
            <span>Open requests</span>
          </div>
          <div className="kpi-cell">
            <strong>{awaitingApproval.length}</strong>
            <span>Awaiting approval</span>
          </div>
          <div className="kpi-cell kpi-cell-warn">
            <strong>{atRisk.length}</strong>
            <span>SLA at risk</span>
          </div>
          <div className="kpi-cell kpi-cell-danger">
            <strong>{breached.length}</strong>
            <span>SLA breached</span>
          </div>
        </div>
        <div className="board-hero-foot">
          <p className="quick-links muted" style={{ margin: 0 }}>
            Quick views:{" "}
            <Link href="/requests?quick=attention">Needs attention</Link>
            {" · "}
            <Link href="/requests?quick=approval">Awaiting approval</Link>
            {" · "}
            <Link href="/requests?quick=open_p1">Open P1</Link>
          </p>
          <div className="board-hero-actions">
            <Link href="/requests/new" className="button">
              Start new request
            </Link>
            <Link href="/requests" className="button button-ghost">
              Full queue
            </Link>
          </div>
        </div>
      </section>

      <div className="board-split">
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
