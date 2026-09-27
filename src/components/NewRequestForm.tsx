"use client";

import { useEffect, useState } from "react";

const DRAFT_KEY = "flowgate-new-request-draft";

type DraftFields = {
  title: string;
  description: string;
  category: string;
  priority: string;
  requester: string;
  department: string;
};

const DEFAULT_DRAFT: DraftFields = {
  title: "",
  description: "",
  category: "Access",
  priority: "P2",
  requester: "Demo User",
  department: "Corporate Services",
};

function readDraft(): DraftFields {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return DEFAULT_DRAFT;
    return { ...DEFAULT_DRAFT, ...(JSON.parse(raw) as Partial<DraftFields>) };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export function NewRequestForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const [draft, setDraft] = useState<DraftFields>(DEFAULT_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(readDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(DEFAULT_DRAFT);
  }

  return (
    <section className="card form-card card-accent">
      <div className="form-card-head">
        <h2>Intake form</h2>
        <p className="muted form-draft-hint">
          Draft fields save locally in this browser until you submit or clear the draft.
        </p>
      </div>
      <form
        className="stack-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }}
      >
        <div className="form-section">
          <h3>What &amp; why</h3>
          <div className="form-grid">
            <label className="full">
              Title
              <span className="field-hint">One line summary (max 120 characters)</span>
              <input
                name="title"
                required
                maxLength={120}
                placeholder="Short summary of the need"
                value={draft.title}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              />
            </label>
            <label className="full">
              Description
              <span className="field-hint">Impact, timing, systems affected</span>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Business impact, timing constraints, systems involved…"
                value={draft.description}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Classification</h3>
          <div className="form-grid">
            <label>
              Category
              <select
                name="category"
                value={draft.category}
                onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
              >
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
              <select
                name="priority"
                value={draft.priority}
                onChange={(e) => setDraft((prev) => ({ ...prev, priority: e.target.value }))}
              >
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
              <input
                name="requester"
                required
                value={draft.requester}
                onChange={(e) => setDraft((prev) => ({ ...prev, requester: e.target.value }))}
              />
            </label>
            <label>
              Department
              <input
                name="department"
                required
                value={draft.department}
                onChange={(e) => setDraft((prev) => ({ ...prev, department: e.target.value }))}
              />
            </label>
          </div>
        </div>

        <div className="form-actions-row">
          <button type="submit" className="button">
            Submit request
          </button>
          <button type="button" className="button button-ghost" onClick={clearDraft}>
            Clear draft
          </button>
        </div>
      </form>
    </section>
  );
}
