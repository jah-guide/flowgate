import Link from "next/link";
import { collectRecentActivity } from "@/lib/activity";
import type { ServiceRequest } from "@/lib/types";

export function ActivityFeed({ requests }: { requests: ServiceRequest[] }) {
  const items = collectRecentActivity(requests, 8);

  if (!items.length) {
    return (
      <section className="card activity-panel">
        <h2>Recent activity</h2>
        <p className="muted">Timeline events from triage and approvals will appear here.</p>
      </section>
    );
  }

  return (
    <section className="card activity-panel">
      <h2>Recent activity</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Latest audit events across the queue — newest first.
      </p>
      <ul className="activity-list">
        {items.map((item) => (
          <li key={item.id}>
            <div className="activity-meta">
              <Link
                href={`/requests/detail?id=${encodeURIComponent(item.requestId)}`}
                className="row-link"
              >
                {item.requestId}
              </Link>
              <time dateTime={item.event.at}>{new Date(item.event.at).toLocaleString()}</time>
            </div>
            <p className="activity-label">{item.event.label}</p>
            <p className="muted activity-sub">
              {item.requestTitle} · {item.event.actor}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
