import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { createRequestAction } from "@/lib/actions";

async function submit(formData: FormData) {
  "use server";
  const id = await createRequestAction(formData);
  redirect(`/requests/${id}`);
}

export default function NewRequestPage() {
  return (
    <AppShell
      title="New service request"
      subtitle="Capture intake details. SLA clock starts immediately based on selected priority."
    >
      <section className="card form-card">
        <form action={submit} className="stack-form">
          <div className="form-grid">
            <label className="full">
              Title
              <input name="title" required maxLength={120} placeholder="Short summary of the need" />
            </label>
            <label className="full">
              Description
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Business impact, timing constraints, systems involved…"
              />
            </label>
            <label>
              Category
              <select name="category" defaultValue="Access">
                <option>Access</option>
                <option>Infrastructure</option>
                <option>Integration</option>
                <option>Hardware</option>
                <option>Security</option>
                <option>General</option>
              </select>
            </label>
            <label>
              Priority
              <select name="priority" defaultValue="P2">
                <option value="P1">P1 — 4 hour SLA</option>
                <option value="P2">P2 — 24 hour SLA</option>
                <option value="P3">P3 — 72 hour SLA</option>
              </select>
            </label>
            <label>
              Requester
              <input name="requester" required defaultValue="Demo User" />
            </label>
            <label>
              Department
              <input name="department" required defaultValue="Corporate Services" />
            </label>
          </div>
          <div>
            <button type="submit" className="button">
              Submit request
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
