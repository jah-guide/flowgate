import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { NewRequestForm } from "@/components/NewRequestForm";
import { createRequestAction } from "@/lib/actions";

async function submit(formData: FormData) {
  "use server";
  const id = await createRequestAction(formData);
  redirect(`/requests/${id}`);
}

export default function NewRequestPage() {
  return (
    <AppShell
      eyebrow="Intake"
      title="New service request"
      subtitle="Structured capture starts the SLA clock immediately from the selected priority."
    >
      <NewRequestForm action={submit} />
    </AppShell>
  );
}
