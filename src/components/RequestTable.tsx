import Link from "next/link";
import { SlaBadge } from "./SlaBadge";
import { StatusBadge } from "./StatusBadge";
import type { ServiceRequest } from "@/lib/types";

export function RequestTable({ requests }: { requests: ServiceRequest[] }) {
  if (!requests.length) {
    return (
      <div className="empty">
        <p>No service requests yet.</p>
        <Link href="/requests/new" className="button">
          Create the first request
        </Link>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>SLA</th>
            <th>Requester</th>
            <th>Opened</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>
                <Link href={`/requests/${r.id}`} className="row-link">
                  {r.id}
                </Link>
              </td>
              <td>
                <Link href={`/requests/${r.id}`} className="row-link title-cell">
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
              <td>
                {r.requester}
                <span className="muted">{r.department}</span>
              </td>
              <td className="nowrap">{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
