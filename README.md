# FlowGate — SLA service-request workflow

**Live demo:** [jah-guide.github.io/flowgate](https://jah-guide.github.io/flowgate/)

**Systems Analyst case study · Next.js prototype**

FlowGate models **intake → triage → multi-step approval** with **live SLA posture** (On Track / At Risk / Breached) on a dark ops control-board UI.

> **Analysis pack:** [`docs/`](./docs/) — context, RACI, requirements, use cases, as-is/to-be process, data model, sequences, traceability, and acceptance tests. Diagrams are trimmed for quick recruiter review while staying traceable to the demo.

---

## Problem

Service requests arrive by email and chat. Approvals live in spreadsheets. Leadership discovers SLA misses only after escalations. FlowGate shows a governed path from structured intake to dual approval with an explicit resolution clock.

## Stakeholders & outcomes

| Stakeholder | Outcome |
|-------------|---------|
| Requester | Transparent status and timeline |
| Ops analyst | Triage queue with category and priority |
| Manager / Director | Ordered approval gates with audit events |
| Operations leadership | SLA posture without waiting for escalations |

## Documentation index

| Document | Contents |
|----------|----------|
| [01-context.md](./docs/01-context.md) | Business problem and scope |
| [02-stakeholders-raci.md](./docs/02-stakeholders-raci.md) | Stakeholders and RACI |
| [03-requirements.md](./docs/03-requirements.md) | Functional and non-functional requirements |
| [04-use-cases-stories.md](./docs/04-use-cases-stories.md) | Use cases and acceptance criteria |
| [05-process-as-is-to-be.md](./docs/05-process-as-is-to-be.md) | As-is vs to-be process (Mermaid) |
| [06-data-model.md](./docs/06-data-model.md) | Request, timeline, SLA entities |
| [07-sequence-flows.md](./docs/07-sequence-flows.md) | Intake through dual approval |
| [08-traceability-matrix.md](./docs/08-traceability-matrix.md) | Requirements → tests |
| [09-acceptance-tests.md](./docs/09-acceptance-tests.md) | Acceptance checklist |

## Working demo

Browser-local Next.js App Router prototype (static export on GitHub Pages — no production auth or database).

```bash
git clone https://github.com/jah-guide/flowgate.git
cd flowgate
npm install
npm run dev
```

Open the URL shown by Next.js (typically `http://localhost:3000`).

**Suggested walkthrough**

1. Review home **control board** stats and **Recent activity**, then open **Requests**
2. Search/filter the queue, export CSV if needed, create a P1 from **New request**
3. Triage and approve (confirm dialogs / keyboard **T** and **A** on detail)
4. Open seeded **SR-0975** to see **Breached** SLA and live countdown
5. Try **Compact** density or **High contrast** in the top bar (saved locally)

Production-style check before deploy:

```bash
npm run build
```

## Tech stack

- Next.js 15 (App Router) + TypeScript, static export for GitHub Pages
- Client-side in-memory store (localStorage) for workflow transitions
- Custom CSS — IBM Plex typography, deep ink control-board surfaces, subtle grid/noise atmosphere, teal + amber SLA accents

## Portfolio note

Built to show **requirements → runnable validation**. Not a production ITSM replacement.
