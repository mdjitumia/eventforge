"use client";
import { useState, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui";

const noop = () => () => {};
export const useOrigin = () => useSyncExternalStore(noop, () => window.location.origin, () => "");

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button variant="secondary" size="sm" onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* ignore */ } }}>
      {done ? <Check size={14} /> : <Copy size={14} />} {done ? "Copied" : label}
    </Button>
  );
}
