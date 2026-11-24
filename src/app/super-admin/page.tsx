"use client";
import { useState } from "react";
import Link from "next/link";
import { Building2, CalendarDays, ClipboardList, Database, Eye, Globe, RotateCcw, ShieldAlert } from "lucide-react";
import { useDB } from "@/lib/store";
import { PLAN_LIMITS } from "@/lib/types";
import { Badge, Button, Card, Confirm, PageTitle } from "@/components/ui";
import { fmtDate } from "@/lib/utils";

export default function SuperOverview() {
  const db = useDB();
  const total = db.orgs.length;
  const published = db.orgs.filter((o) => o.published).length;
  const suspended = db.orgs.filter((o) => o.status === "suspended").length;
  const events = db.orgs.reduce((s, o) => s + o.draft.events.length, 0);
  const regs = db.orgs.reduce((s, o) => s + o.registrations.length, 0);
  const views = db.orgs.reduce((s, o) => s + o.visits, 0);

  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (13 - i)); return d; });
  const counts = days.map((d) => db.orgs.filter((o) => { const c = new Date(o.createdAt); c.setHours(0, 0, 0, 0); return c.getTime() === d.getTime(); }).length);
  const max = Math.max(1, ...counts);
  const top = [...db.orgs].sort((a, b) => b.registrations.length - a.registrations.length).slice(0, 5);

  const kpis = [
    { l: "Organizations", v: total, i: Building2 }, { l: "Published sites", v: published, i: Globe }, { l: "Suspended", v: suspended, i: ShieldAlert },
    { l: "Events", v: events, i: CalendarDays }, { l: "Registrations", v: regs, i: ClipboardList }, { l: "Site visits", v: views.toLocaleString(), i: Eye },
  ];
  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Platform overview" desc="Track every organization on your platform. You see usage and status, never another organization's private content."/>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => <Card key={k.l} className="p-4"><div className="flex items-center justify-between text-slate-400"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k.l}</span><k.i size={18} /></div><p className="mt-2 text-3xl font-bold text-slate-900">{k.v}</p></Card>)}
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-bold text-slate-900">New organizations · last 14 days</h2>
          <div className="mt-4 flex h-40 items-end gap-1.5">
            {counts.map((c, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1"><span className="text-[10px] text-slate-400">{c || ""}</span><div className="w-full rounded-t bg-indigo-500" style={{ height: `${(c / max) * 100}%`, minHeight: c ? 6 : 2, opacity: c ? 1 : 0.2 }} /><span className="text-[10px] text-slate-400">{days[i].getDate()}</span></div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold text-slate-900">Plans</h2>
          <div className="mt-4 space-y-3">{(Object.keys(PLAN_LIMITS) as (keyof typeof PLAN_LIMITS)[]).map((p) => { const n = db.orgs.filter((o) => o.plan === p).length; return <div key={p}><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-700">{PLAN_LIMITS[p].label}</span><span className="text-slate-500">{n}</span></div><div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-indigo-500" style={{ width: `${total ? (n / total) * 100 : 0}%` }} /></div></div>; })}</div>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-bold text-slate-900">Most active organizations</h2>
          <ul className="mt-3 divide-y divide-slate-100">{top.map((o) => <li key={o.id} className="flex items-center justify-between py-2.5 text-sm"><span className="truncate font-medium text-slate-800">{o.draft.site.branding.orgName}</span><span className="text-slate-500">{o.registrations.length} registrations</span></li>)}</ul>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between"><h2 className="font-bold text-slate-900">Recent activity</h2><Link href="/super-admin/activity" className="text-sm font-semibold text-indigo-600">View all</Link></div>
          <ul className="mt-3 divide-y divide-slate-100">{db.audit.slice(0, 6).map((a) => <li key={a.id} className="py-2.5 text-sm"><p className="font-medium text-slate-800">{a.detail} {a.orgName && <span className="text-slate-400">· {a.orgName}</span>}</p><p className="text-xs text-slate-400">{a.actor} · {fmtDate(a.at)}</p></li>)}</ul>
        </Card>
      </div>
      <Badge tone="slate" className="hidden">x</Badge>
    </div>
  );
}
