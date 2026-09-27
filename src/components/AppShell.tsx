import Link from "next/link";
import { resetDemoAction } from "@/lib/actions";

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden />
            <span>
              <strong>FlowGate</strong>
              <small>Ops &amp; SLA workflow</small>
            </span>
          </Link>
          <nav className="nav">
            <Link href="/requests">Requests</Link>
            <Link href="/requests/new" className="nav-cta">
              New request
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">
        {(title || subtitle) && (
          <div className="page-header">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
      <footer className="footer">
        <span>Portfolio demo — in-memory data, no production auth</span>
        <form action={resetDemoAction}>
          <button type="submit" className="link-button">
            Reset demo data
          </button>
        </form>
      </footer>
    </div>
  );
}
