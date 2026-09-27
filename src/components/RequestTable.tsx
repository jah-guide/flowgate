"use client";

import Link from "next/link";
import { SlaBadge } from "./SlaBadge";
import { StatusBadge } from "./StatusBadge";
import type { ServiceRequest } from "@/lib/types";

import { SlaCountdown } from "./SlaCountdown";

export function RequestTable({
  requests,
  compact,
  caption = "Service request queue — newest first",
  emptyVariant = "none",
  onClearFilters,
}: {
  requests: ServiceRequest[];
  compact?: boolean;
  caption?: string;
  emptyVariant?: "none" | "filtered";
  onClearFilters?: () => void;
}) {
  if (!requests.length) {
    if (emptyVariant === "filtered") {
      return (
        <div className="empty empty-filtered">
          <div className="empty-icon" aria-hidden>
            ⌕
          </div>
          <h3>No matches for current filters</h3>
          <p className="muted">Try clearing search text or widening status and SLA filters.</p>
          {onClearFilters && (
            <button type="button" className="button button-ghost" onClick={onClearFilters}>
              Clear all filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="empty">
        <div className="empty-icon" aria-hidden>
          ◇
        </div>
        <p>No service requests in the queue yet.</p>
        <Link href="/requests/new" className="button">
          Create the first request
        </Link>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>SLA posture</th>
            {!compact && <th>SLA clock</th>}
            {!compact && (
              <>
                <th>Requester</th>
                <th>Opened</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>
                <Link href={`/requests/detail?id=${encodeURIComponent(r.id)}`} className="row-link">
                  {r.id}
                </Link>
              </td>
              <td>
                <Link
                  href={`/requests/detail?id=${encodeURIComponent(r.id)}`}
                  className="row-link title-cell"
                >
                  {r.title}
                </Link>
                <span className="muted">{r.category}</span>
              </td>
              <td>
                <span className={`priority priority-${r.priority}`}>{r.priority}</span>
              </td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>
                <SlaBadge request={r} />
              </td>
              {!compact && (
                <>
                  <td className="nowrap">
                    <SlaCountdown request={r} />
                  </td>
                  <td>
                    {r.requester}
                    <span className="muted">{r.department}</span>
                  </td>
                  <td className="nowrap">{new Date(r.createdAt).toLocaleString()}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
