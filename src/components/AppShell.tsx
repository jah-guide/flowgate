"use client";

import Link from "next/link";
import { countAttentionRequests } from "@/lib/queue-filters";
import { useFlowgate } from "@/lib/flowgate-store";
import { NavLinks } from "./NavLinks";
import { PreferenceToggle } from "./PreferenceToggle";
import { ResetDemoButton } from "./ResetDemoButton";

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
  const attentionCount = countAttentionRequests(listRequests());
  const openCount = listRequests().filter(
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
            <span>
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
        {(title || subtitle) && (
          <div className="page-header">
            {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
      <footer className="footer">
        <span>Portfolio demo — browser-local store, no production auth</span>
        <ResetDemoButton />
      </footer>
    </div>
  );
}
