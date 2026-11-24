"use client";
import { createContext, useContext, type AnchorHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import type { Snapshot } from "@/lib/types";

export interface SiteCtxValue { slug: string; preview: boolean; snapshot: Snapshot; interactive: boolean }
export const SiteCtx = createContext<SiteCtxValue | null>(null);
export const useSite = () => {
  const v = useContext(SiteCtx);
  if (!v) throw new Error("SiteCtx missing");
  return v;
};

/** Turn a link typed by an organizer into a real href inside this organization's site. */
export function useHref() {
  const { slug, preview } = useSite();
  return (raw: string) => {
    const l = (raw || "").trim();
    if (!l) return "#";
    if (/^(https?:|mailto:|tel:)/i.test(l)) return l;
    const q = preview ? "?preview=1" : "";
    if (l.startsWith("#")) return `/o/${slug}${q}${l}`;
    if (l.startsWith("/")) return `/o/${slug}${l}${q}`;
    return `https://${l}`;
  };
}

export function SLink({ href, children, ...p }: { href: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { interactive } = useSite();
  const h = useHref()(href);
  if (!interactive) return <a {...p} href="#" onClick={(e) => e.preventDefault()}>{children}</a>;
  if (/^(https?:|mailto:|tel:)/i.test(h)) return <a {...p} href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>;
  return <Link {...p} href={h}>{children}</Link>;
}

export const Img = ({ src, alt, className }: { src?: string; alt: string; className?: string }) =>
  src ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={src} alt={alt} className={className} loading="lazy" /> : null;
