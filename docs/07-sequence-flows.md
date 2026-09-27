# FlowGate — Sequence Flows

## Purpose

How the UI, server actions, and in-memory store interact at runtime.

## Intake → triage → approval

```mermaid
sequenceDiagram
  participant U as User
  participant UI as Next.js pages
  participant SA as Server actions
  participant ST as store

  U->>UI: Submit new request
  UI->>SA: createRequestAction
  SA->>ST: persist + SLA due
  ST-->>UI: redirect to detail

  U->>UI: Triage (submitted)
  UI->>SA: triageAction
  SA->>ST: events + pending_manager

  U->>UI: Manager approve
  UI->>SA: approveAction (manager)
  SA->>ST: pending_director

  U->>UI: Director approve
  UI->>SA: approveAction (director)
  SA->>ST: approved
```

## Reject path

```mermaid
sequenceDiagram
  participant U as Approver
  participant SA as rejectAction
  participant ST as store

  U->>SA: reason required
  SA->>ST: rejected + timeline
```

## SLA on list / detail

```mermaid
sequenceDiagram
  participant UI as Requests UI
  participant ST as listRequests
  participant SLA as getSlaStatus

  UI->>ST: load requests
  loop each row
    UI->>SLA: compute posture
  end
```

## Reset demo

Visitor uses footer **Reset demo data** → `resetDemoAction` → `store.resetDemoData()` → seed restored.
