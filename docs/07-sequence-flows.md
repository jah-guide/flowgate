# FlowGate — Sequence Flows

## Purpose

Illustrate runtime interactions between user, Next.js UI, server actions, and the in-memory store.

## Create request

```mermaid
sequenceDiagram
  actor U as Requester
  participant UI as New Request page
  participant SA as createRequestAction
  participant ST as store.createRequest
  participant SLA as sla.computeSlaDueAt

  U->>UI: Submit form
  UI->>SA: POST (server action)
  SA->>ST: validate + persist
  ST->>SLA: derive slaDueAt
  ST-->>SA: ServiceRequest id
  SA-->>UI: redirect /requests/{id}
  UI-->>U: Detail view with timeline
```

## Triage and route

```mermaid
sequenceDiagram
  actor A as Ops analyst
  participant UI as Detail page
  participant SA as triageAction
  participant ST as store.triageRequest

  A->>UI: Complete triage note
  UI->>SA: server action
  SA->>ST: assert status submitted
  ST->>ST: append triage + route events
  ST->>ST: status = pending_manager
  SA->>UI: revalidate paths
  UI-->>A: Manager approval panel
```

## Manager approve → director gate

```mermaid
sequenceDiagram
  actor M as Manager
  participant UI as Detail page
  participant SA as approveAction
  participant ST as store.approveRequest

  M->>UI: Approve with note
  UI->>SA: role=manager
  SA->>ST: pending_manager branch
  ST->>ST: timeline approved + routed
  ST->>ST: status = pending_director
  UI-->>M: Director panel shown
```

## Director approve (close happy path)

```mermaid
sequenceDiagram
  actor D as Director
  participant UI as Detail page
  participant SA as approveAction
  participant ST as store.approveRequest

  D->>UI: Approve
  UI->>SA: role=director
  SA->>ST: pending_director branch
  ST->>ST: timeline approved
  ST->>ST: status = approved
  UI-->>D: Workflow closed message
```

## Reject path

```mermaid
sequenceDiagram
  actor M as Manager/Director
  participant UI as Detail page
  participant SA as rejectAction
  participant ST as store.rejectRequest

  M->>UI: Reject + reason
  UI->>SA: server action
  SA->>ST: validate pending_* 
  ST->>ST: append rejected event
  ST->>ST: status = rejected
  UI-->>M: Actions hidden
```

## SLA read path (list/detail)

```mermaid
sequenceDiagram
  participant UI as Requests page
  participant SLA as getSlaStatus
  participant ST as store.listRequests

  UI->>ST: fetch requests
  ST-->>UI: ServiceRequest[]
  loop each row
    UI->>SLA: compute posture
    SLA-->>UI: on_track / at_risk / breached
  end
```

## Reset demo data

```mermaid
sequenceDiagram
  actor U as Visitor
  participant UI as Footer form
  participant SA as resetDemoAction
  participant ST as store.resetDemoData

  U->>UI: Reset demo data
  UI->>SA: server action
  SA->>ST: clone SEED_REQUESTS
  SA->>UI: revalidate /
  UI-->>U: Seed restored
```
