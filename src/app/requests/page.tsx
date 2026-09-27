import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { RequestQueue } from "@/components/RequestQueue";
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
      subtitle="Search and filter the queue, export CSV, and open a row for timeline and approval actions."
    >
      <p className="muted queue-page-summary">
        {requests.length} total · {open.length} open · {atRisk.length} need attention
      </p>
      <Suspense fallback={<p className="muted">Loading queue filters…</p>}>
        <RequestQueue requests={requests} />
      </Suspense>
    </AppShell>
  );
}
