"use client";

import { useState } from "react";

export function CopyRequestLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const value = `${window.location.origin}/requests/${id}`;
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
