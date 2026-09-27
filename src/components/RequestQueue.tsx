"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { downloadCsv, requestsToCsv } from "@/lib/export-csv";
import {
  countActiveFilters,
  DEFAULT_QUEUE_FILTERS,
  filterRequests,
  filtersFromSearchParams,
  filtersToSearchParams,
  QUEUE_PRESETS,
  type QueueFilters,
} from "@/lib/queue-filters";
import type { ServiceRequest } from "@/lib/types";
import { RequestTable } from "./RequestTable";

export function RequestQueue({ requests }: { requests: ServiceRequest[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<QueueFilters>(() =>
    filtersFromSearchParams(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    setFilters(filtersFromSearchParams(new URLSearchParams(searchParams.toString())));
  }, [searchParams]);

  useEffect(() => {
    const params = filtersToSearchParams(filters);
    const next = params.toString();
    const current = searchParams.toString();
    if (next === current) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [filters, pathname, router, searchParams]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => filterRequests(requests, filters), [requests, filters]);
  const activeFilterCount = countActiveFilters(filters);

  function patch(partial: Partial<QueueFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function applyPreset(key: keyof typeof QUEUE_PRESETS) {
    setFilters({ ...QUEUE_PRESETS[key].filters });
  }

  function clearFilters() {
    setFilters(DEFAULT_QUEUE_FILTERS);
  }

  function exportQueue() {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`flowgate-queue-${stamp}.csv`, requestsToCsv(filtered));
  }

  return (
    <>
      <div className="queue-toolbar">
        <div className="queue-toolbar-row">
          <label className="search-field">
            <span className="visually-hidden">Search requests</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search ID, title, requester… (press /)"
              value={filters.query}
              onChange={(e) => patch({ query: e.target.value, quick: "none" })}
              autoComplete="off"
            />
          </label>
          <div className="queue-toolbar-actions">
            <button type="button" className="button button-ghost" onClick={exportQueue}>
              Export CSV
            </button>
            <Link href="/requests/new" className="button">
              New request
            </Link>
          </div>
        </div>
        <div className="preset-row" role="group" aria-label="Quick queue views">
          {(Object.keys(QUEUE_PRESETS) as Array<keyof typeof QUEUE_PRESETS>).map((key) => (
            <button
              key={key}
              type="button"
              className={`chip-button${filters.quick === key ? " chip-button-active" : ""}`}
              onClick={() => applyPreset(key)}
            >
              {QUEUE_PRESETS[key].label}
            </button>
          ))}
        </div>
        <div className="filter-chips" role="group" aria-label="Queue filters">
          <select
            aria-label="Filter by workflow status"
            value={filters.status}
            onChange={(e) =>
              patch({ status: e.target.value as QueueFilters["status"], quick: "none" })
            }
          >
            <option value="all">All statuses</option>
            <option value="open">Open only</option>
            <option value="submitted">Submitted</option>
            <option value="triaged">Triaged</option>
            <option value="pending_manager">Manager approval</option>
            <option value="pending_director">Director approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(e) =>
              patch({ priority: e.target.value as QueueFilters["priority"], quick: "none" })
            }
          >
            <option value="all">All priorities</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
          <select
            aria-label="Filter by SLA posture"
            value={filters.sla}
            onChange={(e) => patch({ sla: e.target.value as QueueFilters["sla"], quick: "none" })}
          >
            <option value="all">All SLA</option>
            <option value="on_track">On track</option>
            <option value="at_risk">At risk</option>
            <option value="breached">Breached</option>
          </select>
          <select
            aria-label="Sort queue"
            value={filters.sort}
            onChange={(e) => patch({ sort: e.target.value as QueueFilters["sort"] })}
          >
            <option value="newest">Newest first</option>
            <option value="sla_urgency">SLA due soonest</option>
          </select>
          {activeFilterCount > 0 && (
            <button type="button" className="link-button" onClick={clearFilters}>
              Clear filters ({activeFilterCount})
            </button>
          )}
        </div>
        <p className="muted queue-summary">
          Showing {filtered.length} of {requests.length} requests
        </p>
      </div>
      <RequestTable
        requests={filtered}
        emptyVariant={activeFilterCount > 0 ? "filtered" : "none"}
        onClearFilters={activeFilterCount > 0 ? clearFilters : undefined}
      />
    </>
  );
}
