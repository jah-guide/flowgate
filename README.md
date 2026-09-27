# FlowGate — SLA service-request workflow

**Systems Analyst case study · Next.js prototype**

FlowGate models how a shared-services desk should handle **intake → triage → multi-step approval** with **live SLA posture** (On Track / At Risk / Breached).

> Analysis first: full artefacts in **[`docs/`](./docs/)** (context, RACI, requirements, use cases, as-is/to-be process, data model, sequences, traceability, acceptance tests).

---

## Problem

Service requests arrive by email and chat. Approvals live in spreadsheets. Leadership discovers SLA misses only after escalations. FlowGate demonstrates a governed path from structured intake to dual approval with an explicit resolution clock.

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
| [06-data-model.md](./docs/06-data-model.md) | Request, approval, SLA entities |
| [07-sequence-flows.md](./docs/07-sequence-flows.md) | Intake through dual approval |
| [08-traceability-matrix.md](./docs/08-traceability-matrix.md) | Requirements → tests |
| [09-acceptance-tests.md](./docs/09-acceptance-tests.md) | Acceptance checklist |

## Working demo

In-memory Next.js App Router prototype (no production auth or database).

```bash
git clone https://github.com/jah-guide/flowgate.git
cd flowgate
npm install
npm run dev
```

Open the URL shown by Next.js (typically `http://localhost:3000`).

**Suggested walkthrough**

1. Create a P1 request from **New request**
2. Open it, triage, then approve as manager and director
3. Open an overdue seeded ticket to see **Breached** SLA

## Tech stack

- Next.js 15 (App Router) + TypeScript
- React Server Components + server actions for workflow transitions
- CSS (no heavy UI kit) — operational control-board aesthetic

## Portfolio note

Built to show **requirements → runnable validation**. Not a production ITSM replacement.
