"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { NewRequestForm } from "@/components/NewRequestForm";
import { useFlowgate } from "@/lib/flowgate-store";
import type { Priority } from "@/lib/types";

export default function NewRequestPage() {
  const router = useRouter();
  const { createRequest } = useFlowgate();

  function onSubmit(formData: FormData) {
    const request = createRequest({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? "General"),
      priority: String(formData.get("priority") ?? "P3") as Priority,
      requester: String(formData.get("requester") ?? "Demo User"),
      department: String(formData.get("department") ?? "Unassigned"),
    });
    router.push(`/requests/detail?id=${encodeURIComponent(request.id)}`);
  }

  return (
    <AppShell
      eyebrow="Intake"
      title="New service request"
      subtitle="Structured capture starts the SLA clock immediately from the selected priority."
    >
      <div className="intake-layout">
        <aside className="card intake-aside" aria-label="Intake guidance">
          <h2>Before you submit</h2>
          <ul className="intake-checklist">
            <li>State business impact and any hard deadlines.</li>
            <li>Pick priority to set the resolution SLA window.</li>
            <li>After submit, triage and approvals run on the detail page.</li>
          </ul>
          <p className="muted intake-aside-note">
            P1 · 4h · P2 · 24h · P3 · 72h — all tracked live on the control board.
          </p>
        </aside>
        <NewRequestForm onSubmit={onSubmit} />
      </div>
    </AppShell>
  );
}
