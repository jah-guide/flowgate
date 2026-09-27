import { AppShell } from "@/components/AppShell";
import { RequestTable } from "@/components/RequestTable";
import { listRequests } from "@/lib/store";

export default function RequestsPage() {
  const requests = listRequests();

  return (
    <AppShell
      title="Service requests"
      subtitle="Filter by SLA posture in the table; open a row for timeline history and approval actions."
    >
      <RequestTable requests={requests} />
    </AppShell>
  );
}
