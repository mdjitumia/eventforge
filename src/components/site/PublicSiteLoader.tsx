"use client";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { Lock, SearchX, Wrench } from "lucide-react";
import { useMounted, useOrgBySlug, useSession } from "@/lib/store";
import { trackVisit } from "@/lib/api";
import type { Snapshot } from "@/lib/types";
import { PLATFORM_NAME } from "@/lib/config";
import { Spinner } from "@/components/ui";
import { SiteFrame } from "./SiteFrame";

const noop = () => () => {};
const usePreviewFlag = () => useSyncExternalStore(noop, () => new URLSearchParams(window.location.search).get("preview") === "1", () => false);

function Notice({ icon: Icon, title, text, cta }: { icon: any; title: string; text: string; cta?: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-500"><Icon size={26} /></div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{text}</p>
        <div className="mt-5 flex justify-center gap-2">{cta}</div>
        <p className="mt-6 text-xs text-slate-400">{PLATFORM_NAME}</p>
      </div>
    </div>
  );
}

/** Resolves an organization by slug and decides what a visitor may see (published, draft preview, or a notice). */
export function PublicSiteLoader({ slug, children }: { slug: string; children: (snapshot: Snapshot, preview: boolean) => ReactNode }) {
  const mounted = useMounted();
  const org = useOrgBySlug(slug);
  const session = useSession();
  const wantsPreview = usePreviewFlag();
  const canPreview = !!org && session?.role === "org" && session.orgId === org.id;
  const showDraft = wantsPreview && canPreview;
  const snapshot = showDraft ? org?.draft : org?.published;

  useEffect(() => {
    if (snapshot) document.title = snapshot.site.seo.title || snapshot.site.branding.orgName;
    if (mounted && org?.published && !showDraft && org.status === "active") trackVisit(slug);
  }, [mounted, org, showDraft, slug, snapshot]);

  if (!mounted || org === undefined) return <Spinner />;
  if (!org) return <Notice icon={SearchX} title="Site not found" text="We could not find an event site at this address." cta={<Link href="/" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Go to home</Link>} />;
  if (org.status === "suspended") return <Notice icon={Wrench} title="This site is unavailable" text="The organization's site is temporarily unavailable." />;
  if (wantsPreview && !canPreview) return <Notice icon={Lock} title="Sign in to preview" text="Draft previews are only visible to the organization's admin." cta={<Link href="/login" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Sign in</Link>} />;
  if (!snapshot) return <Notice icon={Lock} title="Not published yet" text="This event website has not been published. Please check back soon." />;

  return (
    <SiteFrame snapshot={snapshot} slug={slug} preview={showDraft}>
      {showDraft && <div className="sticky top-0 z-50 bg-amber-400 px-4 py-1.5 text-center text-xs font-bold text-amber-950">Draft preview · only you can see this</div>}
      {children(snapshot, showDraft)}
    </SiteFrame>
  );
}
