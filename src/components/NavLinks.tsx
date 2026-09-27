"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function navClass(pathname: string, href: string, exact?: boolean) {
  const active = exact ? pathname === href : pathname.startsWith(href);
  return active ? "nav-active" : undefined;
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Primary">
      <Link href="/" className={navClass(pathname, "/", true)}>
        Control board
      </Link>
      <Link href="/requests" className={navClass(pathname, "/requests")}>
        Requests
      </Link>
      <Link href="/requests/new" className={`nav-cta ${navClass(pathname, "/requests/new") ?? ""}`}>
        New request
      </Link>
    </nav>
  );
}
