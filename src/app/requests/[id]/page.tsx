import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RequestActions } from "@/components/RequestActions";
import { SlaDetail } from "@/components/SlaBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { getRequest } from "@/lib/store";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = getRequest(id);
  if (!request) notFound();

  return (
    <AppShell>
      <div className="breadcrumb">
        <Link href="/requests">Requests</Link>
        <span>/</span>
        <span>{request.id}</span>
      </div>

      <div className="page-header">
        <h1>{request.title}</h1>
        <p>
          {request.id} · {request.category} · <StatusBadge status={request.status} />
        </p>
      </div>

      <div className="detail-grid">
        <div className="stack-form" style={{ gap: "1rem" }}>
          <section className="card">
            <h2>Description</h2>
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{request.description}</p>
            <dl className="sla-dl" style={{ marginTop: "0.85rem" }}>
              <div>
                <dt>Requester</dt>
                <dd>
                  {request.requester} ({request.department})
                </dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{request.priority}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{request.status.replaceAll("_", " ")}</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <h2>Status timeline</h2>
            <Timeline events={request.timeline} />
          </section>
        </div>

        <div className="stack-form" style={{ gap: "1rem" }}>
          <SlaDetail request={request} />
          <RequestActions id={request.id} status={request.status} />
        </div>
      </div>
    </AppShell>
  );
}
