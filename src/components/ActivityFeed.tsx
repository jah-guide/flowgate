import Link from "next/link";
import { collectRecentActivity } from "@/lib/activity";
import type { ServiceRequest } from "@/lib/types";

function activityTone(type: string): string {
  if (type.includes("reject")) return "activity-dot-danger";
  if (type.includes("approv")) return "activity-dot-accent";
  if (type.includes("triage")) return "activity-dot-amber";
  return "activity-dot-muted";
}

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
      <div className="activity-panel-head">
        <div>
          <h2>Recent activity</h2>
          <p className="muted activity-panel-sub">Latest audit events — newest first</p>
        </div>
        <span className="activity-live-pill">
          <span className="status-pill-dot" aria-hidden />
          Live
        </span>
      </div>
      <ul className="activity-list">
        {items.map((item) => (
          <li key={item.id}>
            <span
              className={`activity-dot ${activityTone(item.event.type)}`}
              aria-hidden
            />
            <div className="activity-body">
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
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
