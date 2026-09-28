"use client";

import Link from "next/link";
import { countAttentionRequests } from "@/lib/queue-filters";
import { useFlowgate } from "@/lib/flowgate-store";
import { NavLinks } from "./NavLinks";
import { PreferenceToggle } from "./PreferenceToggle";
import { ResetDemoButton } from "./ResetDemoButton";
import { StatusStripClock } from "./StatusStripClock";

export function AppShell({
  children,
  title,
  subtitle,
  eyebrow,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  const { listRequests } = useFlowgate();
  const requests = listRequests();
  const attentionCount = countAttentionRequests(requests);
  const openCount = requests.filter(
    (r) => r.status !== "approved" && r.status !== "rejected",
  ).length;

  return (
    <div className="shell">
      <div className="shell-backdrop" aria-hidden />
      <header className="topbar">
        <div className="topbar-status">
          <div className="topbar-status-inner">
            <span className="status-pill">
              <span className="status-pill-dot" aria-hidden />
              Local store · SLA engine live
            </span>
            <span className="topbar-status-meta">
              <StatusStripClock />
              <span className="status-meta-divider" aria-hidden>
                ·
              </span>
              {openCount} open ticket{openCount === 1 ? "" : "s"}
              {attentionCount > 0 && (
                <>
                  {" "}
                  · <strong>{attentionCount}</strong> need attention
                </>
              )}
            </span>
          </div>
        </div>
        <div className="topbar-inner">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden />
            <span className="brand-copy">
              <strong>FlowGate</strong>
              <small>Ops control board</small>
            </span>
          </Link>
          <div className="topbar-actions">
            <PreferenceToggle />
            <NavLinks attentionCount={attentionCount} />
          </div>
        </div>
      </header>
      <main className="main page-enter">
        {(title || subtitle || eyebrow) && (
          <header className="page-header">
            {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
            <div className="page-header-rule" aria-hidden />
          </header>
        )}
        {children}
      </main>
      <footer className="footer">
        <div className="footer-copy">
          <span>Portfolio demo — browser-local store, no production auth</span>
          <span className="footer-hints muted">
            Shortcuts: <kbd>/</kbd> search queue · <kbd>T</kbd> triage · <kbd>A</kbd> approve
          </span>
        </div>
        <ResetDemoButton />
      </footer>
    </div>
  );
}
