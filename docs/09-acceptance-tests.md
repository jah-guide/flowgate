# FlowGate — Acceptance Tests

## Purpose

Manual test checklist to validate the demo against requirements. Execute after `npm run dev`.

## Test environment

| Item | Value |
|------|-------|
| Node | 20+ recommended |
| URL | http://localhost:3000 |
| Data | In-memory seed + user-created requests |
| Reset | Footer **Reset demo data** |

## Test cases

### AT-01 Create service request (FR-01)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/requests/new` | Form with required fields |
| 2 | Submit valid P2 request | Redirect to detail |
| 3 | Inspect detail | Status **Submitted**, timeline has create event |
| 4 | Check SLA panel | Due ≈ created + 24h |

**Result:** ☐ Pass ☐ Fail

---

### AT-02 List and navigate (FR-02, FR-09)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/requests` | Table with seed IDs |
| 2 | Click SR-1042 | Detail loads with title |
| 3 | Sort implicit | Newest requests appear first |

**Result:** ☐ Pass ☐ Fail

---

### AT-03 SLA due calculation (FR-03)

| Priority | Expected due offset |
|----------|---------------------|
| P1 | +4 hours from created |
| P2 | +24 hours |
| P3 | +72 hours |

Verify on a newly created request for each priority.

**Result:** ☐ Pass ☐ Fail

---

### AT-04 SLA posture visibility (FR-04, FR-12)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/` | Stat cards for open / approval / at risk / breached |
| 2 | Open `/requests` | Each row shows On Track, At Risk, or Breached |
| 3 | Open SR-0975 | **Breached** (submitted > 4h ago at P1) |

**Result:** ☐ Pass ☐ Fail

---

### AT-05 Triage flow (FR-05, FR-08)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Create new request (submitted) | Triage panel visible |
| 2 | Submit triage | Status **Manager approval** |
| 3 | Timeline | Triage + routed events present |

**Result:** ☐ Pass ☐ Fail

---

### AT-06 Manager approval (FR-06)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open SR-1038 or post-triage request | Manager panel |
| 2 | Approve with note | Status **Director approval** |
| 3 | Timeline | Manager approved + routed events |

**Result:** ☐ Pass ☐ Fail

---

### AT-07 Rejection reason (FR-06, FR-11)

| Step | Action | Expected |
|------|--------|----------|
| 1 | On manager gate, attempt reject without reason | Browser validation prevents submit |
| 2 | Reject with reason | Status **Rejected**, note on timeline |

**Result:** ☐ Pass ☐ Fail

---

### AT-08 Director approval (FR-07)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open SR-1021 | Director panel |
| 2 | Approve | Status **Approved**, workflow closed |

**Result:** ☐ Pass ☐ Fail

---

### AT-09 Closed request SLA readout (FR-04)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open SR-0997 (approved) | SLA shows On Track (resolved before due) |
| 2 | Open SR-0988 (rejected) | SLA panel still rendered |

**Result:** ☐ Pass ☐ Fail

---

### AT-11 Queue search and filters (FR-13, FR-14)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/requests` | Search box and status/priority/SLA filters visible |
| 2 | Search `SR-0975` | Single breached row |
| 3 | Filter SLA **At risk** or **Breached** | Rows match posture; summary updates |
| 4 | Apply impossible combo | Filtered empty state with **Clear all filters** |

**Result:** ☐ Pass ☐ Fail

---

### AT-12 Export CSV (FR-15)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Filter queue to 2+ rows | Summary shows filtered count |
| 2 | Click **Export CSV** | File downloads with header row |
| 3 | Open file | Columns include ID, Status, SLA Posture, SLA Due |

**Result:** ☐ Pass ☐ Fail

---

### AT-13 SLA countdown (FR-16)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/requests` | **SLA clock** column shows remaining or overdue text |
| 2 | Open any open request detail | SLA panel shows live countdown (updates ~30s) |

**Result:** ☐ Pass ☐ Fail

---

### AT-14 Confirmations and keyboard (FR-17, FR-18)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Start triage/approve/reject | Browser confirm appears; cancel keeps page |
| 2 | On manager gate, press **A** (not in a field) | Approve confirm appears |
| 3 | Footer **Reset demo data** | Confirm before seed restore |

**Result:** ☐ Pass ☐ Fail

---

### AT-15 Activity and preferences (FR-19, FR-20)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/` | **Recent activity** lists latest timeline events |
| 2 | Change density to **Compact** | Table padding tightens; persists on reload |
| 3 | Enable **High contrast** | Theme tokens brighten; persists on reload |

**Result:** ☐ Pass ☐ Fail

---

### AT-16 Queue presets and URL (FR-21, FR-22, FR-23)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Click **Needs attention** preset | Only open at-risk/breached rows; URL contains `quick=attention` |
| 2 | Reload page | Filters restore from URL |
| 3 | Sort **SLA due soonest** | Nearest due dates rise to top |
| 4 | Press **/** (outside a field) | Search input focuses |

**Result:** ☐ Pass ☐ Fail

---

### AT-17 Detail utilities (FR-24, FR-25)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open any open request | SLA progress bar shows elapsed % |
| 2 | **Copy ID** / **Copy link** | Clipboard receives values; button shows **Copied** briefly |

**Result:** ☐ Pass ☐ Fail

---

### AT-18 Intake draft and nav badge (FR-26, FR-27)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Partially fill `/requests/new`, navigate away, return | Fields restored from local draft |
| 2 | **Clear draft** | Fields reset to defaults |
| 3 | With at-risk/breached open tickets | **Requests** nav shows count badge |

**Result:** ☐ Pass ☐ Fail

---

### AT-10 Reset demo data (FR-10)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Create a throwaway request | Appears in list |
| 2 | Click **Reset demo data** | List returns to six seed items |
| 3 | Throwaway gone | SR-1042 etc. restored |

**Result:** ☐ Pass ☐ Fail

## Regression smoke (build)

```bash
npm install
npm run build
npm run dev
```

Expect production build to succeed with zero type errors.

## Sign-off template

| Role | Name | Date | Result |
|------|------|------|--------|
| Analyst | | | |
| Reviewer | | | |

## Traceability

All test IDs map to `08-traceability-matrix.md` requirement rows.
