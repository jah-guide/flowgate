"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { CopyRequestLink } from "@/components/CopyRequestLink";
import { RequestWorkflowPanel } from "@/components/RequestWorkflowPanel";
import { SlaDetail } from "@/components/SlaBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { useFlowgate } from "@/lib/flowgate-store";

function RequestDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const { getRequest } = useFlowgate();
  const request = id ? getRequest(id) : undefined;

  if (!id) {
    return (
      <AppShell eyebrow="Detail">
        <p className="muted">Missing request id. Open a ticket from the queue.</p>
        <Link href="/requests" className="button">
          Back to queue
        </Link>
      </AppShell>
    );
  }

  if (!request) {
    return (
      <AppShell eyebrow={id}>
        <p className="muted">Request not found in this browser session.</p>
        <Link href="/requests" className="button">
          Back to queue
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow={request.id}>
      <div className="breadcrumb">
        <Link href="/requests">Requests</Link>
        <span aria-hidden>/</span>
        <span>{request.id}</span>
      </div>

      <div className="page-header detail-header">
        <div>
          <h1>{request.title}</h1>
          <p>
            {request.category} · <StatusBadge status={request.status} />
          </p>
        </div>
        <div className="detail-header-actions">
          <CopyButton value={request.id} label="Copy ID" />
          <CopyRequestLink id={request.id} />
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack-form" style={{ gap: "1rem" }}>
          <section className="card">
            <h2>Request details</h2>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{request.description}</p>
            <dl className="sla-dl" style={{ marginTop: "1rem" }}>
              <div>
                <dt>Requester</dt>
                <dd>
                  {request.requester} · {request.department}
                </dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{request.priority}</dd>
              </div>
              <div>
                <dt>Workflow</dt>
                <dd>{request.status.replaceAll("_", " ")}</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <h2>Audit timeline</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Immutable events for triage, routing, and approvals.
            </p>
            <Timeline events={request.timeline} />
          </section>
        </div>

        <div className="stack-form" style={{ gap: "1rem" }}>
          <section aria-label="SLA posture">
            <SlaDetail request={request} />
          </section>
          <RequestWorkflowPanel id={request.id} status={request.status} />
        </div>
      </div>
    </AppShell>
  );
}

export default function RequestDetailPage() {
  return (
    <Suspense fallback={<p className="muted">Loading request…</p>}>
      <RequestDetailContent />
    </Suspense>
  );
}
