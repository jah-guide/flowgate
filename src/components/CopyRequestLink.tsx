"use client";

import { useState } from "react";

function detailUrl(id: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = `${base}/requests/detail`.replace(/\/{2,}/g, "/");
  return `${window.location.origin}${path}?id=${encodeURIComponent(id)}`;
}

export function CopyRequestLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const value = detailUrl(id);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy to clipboard:", value);
    }
  }

  return (
    <button type="button" className="button button-ghost button-sm" onClick={onCopy}>
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
