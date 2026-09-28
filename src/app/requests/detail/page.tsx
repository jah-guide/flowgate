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
import { STATUS_LABELS } from "@/lib/types";

function RequestDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const { getRequest } = useFlowgate();
  const request = id ? getRequest(id) : undefined;

  if (!id) {
    return (
      <AppShell eyebrow="Detail">
        <div className="empty empty-filtered">
          <h3>Missing request id</h3>
          <p className="muted">Open a ticket from the queue to view timeline and actions.</p>
          <Link href="/requests" className="button">
            Back to queue
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!request) {
    return (
      <AppShell eyebrow={id}>
        <div className="empty empty-filtered">
          <h3>Request not found</h3>
          <p className="muted">This id is not in the browser-local store for this session.</p>
          <Link href="/requests" className="button">
            Back to queue
          </Link>
        </div>
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
        <div className="detail-title-block">
          <h1>{request.title}</h1>
          <p className="detail-meta-line">
            {request.category} · <StatusBadge status={request.status} /> ·{" "}
            <span className={`priority priority-${request.priority}`}>{request.priority}</span>
          </p>
        </div>
        <div className="detail-header-actions">
          <CopyButton value={request.id} label="Copy ID" />
          <CopyRequestLink id={request.id} />
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack-form detail-stack">
          <section className="card detail-card">
            <h2>Request details</h2>
            <p className="detail-description">{request.description}</p>
            <dl className="detail-facts">
              <div>
                <dt>Requester</dt>
                <dd>
                  {request.requester} · {request.department}
                </dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>
                  <span className={`priority priority-${request.priority}`}>{request.priority}</span>
                </dd>
              </div>
              <div>
                <dt>Workflow</dt>
                <dd>{STATUS_LABELS[request.status]}</dd>
              </div>
              <div>
                <dt>Opened</dt>
                <dd>{new Date(request.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </section>

          <section className="card detail-card">
            <h2>Audit timeline</h2>
            <p className="muted detail-card-sub">
              Immutable events for triage, routing, and approvals.
            </p>
            <Timeline events={request.timeline} />
          </section>
        </div>

        <div className="stack-form detail-stack detail-rail">
          <section aria-label="SLA posture" className="detail-sla-wrap">
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
    <Suspense
      fallback={
        <AppShell eyebrow="Detail">
          <div className="loading-bar" aria-hidden>
            <span />
          </div>
          <p className="muted">Loading request…</p>
        </AppShell>
      }
    >
      <RequestDetailContent />
    </Suspense>
  );
}
