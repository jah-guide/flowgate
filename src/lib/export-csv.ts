import { getSlaStatus } from "./sla";
import { STATUS_LABELS } from "./types";
import type { ServiceRequest } from "./types";

function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function requestsToCsv(requests: ServiceRequest[]): string {
  const headers = [
    "ID",
    "Title",
    "Category",
    "Priority",
    "Status",
    "SLA Posture",
    "Requester",
    "Department",
    "Created",
    "SLA Due",
  ];

  const rows = requests.map((r) => {
    const sla = getSlaStatus(r);
    return [
      r.id,
      r.title,
      r.category,
      r.priority,
      STATUS_LABELS[r.status],
      sla.replace("_", " "),
      r.requester,
      r.department,
      new Date(r.createdAt).toISOString(),
      new Date(r.slaDueAt).toISOString(),
    ].map(escapeCell);
  });

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
