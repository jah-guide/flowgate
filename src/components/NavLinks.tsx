"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function requestsActive(pathname: string) {
  if (pathname === "/requests") return true;
  if (pathname.startsWith("/requests/") && !pathname.startsWith("/requests/new")) return true;
  return false;
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Primary">
      <Link href="/" className={pathname === "/" ? "nav-active" : undefined}>
        Control board
      </Link>
      <Link href="/requests" className={requestsActive(pathname) ? "nav-active" : undefined}>
        Requests
      </Link>
      <Link
        href="/requests/new"
        className={`nav-cta${pathname === "/requests/new" ? " nav-active" : ""}`}
      >
        New request
      </Link>
    </nav>
  );
}
