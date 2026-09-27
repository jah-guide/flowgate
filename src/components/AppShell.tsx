import Link from "next/link";
import { resetDemoAction } from "@/lib/actions";
import { NavLinks } from "./NavLinks";

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
          <NavLinks />
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
        <form action={resetDemoAction}>
          <button type="submit" className="link-button">
            Reset demo data
          </button>
        </form>
      </footer>
    </div>
  );
}
