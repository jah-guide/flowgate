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
      eyebrow="Intake"
      title="New service request"
      subtitle="Structured capture starts the SLA clock immediately from the selected priority."
    >
      <section className="card form-card">
        <form action={submit} className="stack-form">
          <div className="form-section">
            <h3>What &amp; why</h3>
            <div className="form-grid">
              <label className="full">
                Title
                <span className="field-hint">One line summary (max 120 characters)</span>
                <input name="title" required maxLength={120} placeholder="Short summary of the need" />
              </label>
              <label className="full">
                Description
                <span className="field-hint">Impact, timing, systems affected</span>
                <textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Business impact, timing constraints, systems involved…"
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Classification</h3>
            <div className="form-grid">
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
            </div>
          </div>

          <div className="form-section">
            <h3>Requester</h3>
            <div className="form-grid">
              <label>
                Name
                <input name="requester" required defaultValue="Demo User" />
              </label>
              <label>
                Department
                <input name="department" required defaultValue="Corporate Services" />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="submit" className="button">
              Submit request
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
