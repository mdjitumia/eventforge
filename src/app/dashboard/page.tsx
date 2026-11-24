"use client";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Eye, ExternalLink, Globe } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { Badge, Button, Card, PageTitle } from "@/components/ui";
import { CopyButton, useOrigin } from "@/components/panel/hooks";
import { SECTION_META } from "@/lib/schemas";
import { PLAN_LIMITS } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

export default function Overview() {
  const org = useCurrentOrg()!;
  const origin = useOrigin();
  const url = `${origin}/o/${org.slug}`;
  const isLive = !!org.published;
  const changed = isLive && JSON.stringify(org.draft) !== JSON.stringify(org.published);
  const sampleSections = org.draft.site.sections.filter((s) => s.isSample && s.visible);
  const sampleEvents = org.draft.events.filter((e) => e.isSample);
  const pending = org.registrations.filter((r) => r.status === "pending").length;
  const limits = PLAN_LIMITS[org.plan];

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title={`Welcome, ${org.owner.name.split(" ")[0]}`} desc="Customize the base website with your own content, then publish it to get a shareable link." />

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={isLive ? "green" : "amber"}>{isLive ? `Published · v${org.version}` : "Draft - not public"}</Badge>
              {changed && <Badge tone="indigo">Unpublished changes</Badge>}
              <Badge tone="slate">{limits.label} plan</Badge>
            </div>
            <p className="mt-3 flex items-center gap-2 break-all text-sm font-medium text-slate-800"><Globe size={16} className="shrink-0 text-slate-400" />{url}</p>
            {org.publishedAt && <p className="mt-1 text-xs text-slate-500">Last published {fmtDate(org.publishedAt)}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={url} label="Copy link" />
            <Link href={`/o/${org.slug}?preview=1`} target="_blank"><Button variant="secondary" size="sm"><Eye size={14} /> Preview draft</Button></Link>
            {isLive && <Link href={`/o/${org.slug}`} target="_blank"><Button variant="secondary" size="sm"><ExternalLink size={14} /> Open live site</Button></Link>}
            <Link href="/dashboard/publish"><Button size="sm">{isLive ? "Publish changes" : "Publish site"}</Button></Link>
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Events", v: `${org.draft.events.length} / ${limits.events > 900 ? "∞" : limits.events}`, i: CalendarDays },
          { l: "Registrations", v: org.registrations.length, i: ClipboardList },
          { l: "Pending verification", v: pending, i: AlertTriangle },
          { l: "Site visits", v: org.visits, i: Eye },
        ].map((s) => (
          <Card key={s.l} className="p-4"><div className="flex items-center justify-between text-slate-400"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.l}</span><s.i size={18} /></div><p className="mt-2 text-3xl font-bold text-slate-900">{s.v}</p></Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="font-bold text-slate-900">Replace the sample content</h2>
        <p className="mt-1 text-sm text-slate-500">Your site starts from a complete base template. These parts still contain sample content. Edit and save a section to mark it as yours.</p>
        {sampleSections.length + sampleEvents.length === 0 ? (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 size={18} /> All sample content has been replaced.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {sampleSections.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2.5 text-sm"><span className="font-medium text-slate-800">{SECTION_META[s.type].label} <Badge tone="amber" className="ml-1">Sample</Badge></span><Link className="inline-flex items-center gap-1 font-semibold text-indigo-600" href={`/dashboard/website/${s.id}`}>Edit <ArrowRight size={14} /></Link></li>
            ))}
            {sampleEvents.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-2.5 text-sm"><span className="font-medium text-slate-800">Event: {e.title} <Badge tone="amber" className="ml-1">Sample</Badge></span><Link className="inline-flex items-center gap-1 font-semibold text-indigo-600" href={`/dashboard/events/${e.id}`}>Edit <ArrowRight size={14} /></Link></li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
