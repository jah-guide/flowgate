import Link from "next/link";
import { countAttentionRequests } from "@/lib/queue-filters";
import { listRequests } from "@/lib/store";
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
  const attentionCount = countAttentionRequests(listRequests());

  return (
    <div className="shell">
      <header className="topbar">
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
      <main className="main">
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
        <span>Portfolio demo — in-memory store, no production auth</span>
        <ResetDemoButton />
      </footer>
    </div>
  );
}
