import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RequestTable } from "@/components/RequestTable";
import { getSlaStatus } from "@/lib/sla";
import { listRequests } from "@/lib/store";

export default function RequestsPage() {
  const requests = listRequests();
  const open = requests.filter((r) => r.status !== "approved" && r.status !== "rejected");
  const atRisk = open.filter((r) => getSlaStatus(r) === "at_risk" || getSlaStatus(r) === "breached");

  return (
    <AppShell
      eyebrow="Queue"
      title="Service requests"
      subtitle="Newest first. SLA posture updates on each refresh — open a row for timeline and approval actions."
    >
      <div className="table-toolbar">
        <p className="muted" style={{ margin: 0 }}>
          {requests.length} total · {open.length} open · {atRisk.length} need attention
        </p>
        <Link href="/requests/new" className="button">
          New request
        </Link>
      </div>
      <RequestTable requests={requests} />
    </AppShell>
  );
}
