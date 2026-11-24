"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Ban, CheckCircle2, ExternalLink, Info, Search, Trash2 } from "lucide-react";
import { useDB } from "@/lib/store";
import { deleteOrg, setOrgPlan, setOrgStatus } from "@/lib/api";
import { PLAN_LIMITS, type Org, type Plan } from "@/lib/types";
import { Badge, Button, Card, Field, inputCls, Modal, PageTitle, useRun } from "@/components/ui";
import { fmtDate, fmtDay } from "@/lib/utils";

export default function OrganizationsPage() {
  const db = useDB();
  const run = useRun();
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<string | null>(null);
  const [del, setDel] = useState<Org | null>(null);
  const [typed, setTyped] = useState("");
  const rows = useMemo(() => db.orgs.filter((o) => !q || (o.slug + o.draft.site.branding.orgName + o.owner.email).toLowerCase().includes(q.toLowerCase())), [db.orgs, q]);
  const d = db.orgs.find((o) => o.id === detail);

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Organizations" desc="Manage plans and access. Suspending an organization takes its site offline and blocks its admin sign-in." />
      <div className="relative mb-4 max-w-md"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input className={inputCls + " pl-9"} placeholder="Search name, address or owner email" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Organization</th><th className="p-3">Owner</th><th className="p-3">Plan</th><th className="p-3">Site</th><th className="p-3">Events</th><th className="p-3">Regs</th><th className="p-3">Visits</th><th className="p-3">Created</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((o) => (
              <tr key={o.id} className={o.status === "suspended" ? "bg-red-50/40" : ""}>
                <td className="p-3"><p className="font-semibold text-slate-900">{o.draft.site.branding.orgName}</p><p className="text-xs text-slate-500">/o/{o.slug}</p></td>
                <td className="p-3 text-slate-600">{o.owner.email}</td>
                <td className="p-3"><select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs" value={o.plan} onChange={(e) => run(() => setOrgPlan(o.id, e.target.value as Plan), "Plan updated")}>{(Object.keys(PLAN_LIMITS) as Plan[]).map((p) => <option key={p} value={p}>{PLAN_LIMITS[p].label}</option>)}</select></td>
                <td className="p-3">{o.status === "suspended" ? <Badge tone="red">Suspended</Badge> : <Badge tone={o.published ? "green" : "amber"}>{o.published ? "Published" : "Draft"}</Badge>}</td>
                <td className="p-3 text-slate-600">{o.draft.events.length}</td><td className="p-3 text-slate-600">{o.registrations.length}</td><td className="p-3 text-slate-600">{o.visits}</td><td className="p-3 text-slate-500">{fmtDay(o.createdAt)}</td>
                <td className="p-3"><div className="flex justify-end gap-1">
                  <button onClick={() => setDetail(o.id)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" title="Details"><Info size={16} /></button>
                  {o.published && <Link href={`/o/${o.slug}`} target="_blank" className="rounded p-1.5 text-slate-500 hover:bg-slate-100" title="Open site"><ExternalLink size={16} /></Link>}
                  {o.status === "active" ? <button onClick={() => run(() => setOrgStatus(o.id, "suspended"), "Organization suspended")} className="rounded p-1.5 text-amber-600 hover:bg-amber-50" title="Suspend"><Ban size={16} /></button> : <button onClick={() => run(() => setOrgStatus(o.id, "active"), "Organization activated")} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50" title="Activate"><CheckCircle2 size={16} /></button>}
                  <button onClick={() => { setDel(o); setTyped(""); }} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No organizations match.</p>}
      </Card>

      <Modal open={!!d} onClose={() => setDetail(null)} title={d?.draft.site.branding.orgName ?? ""}>
        {d && (
          <div className="space-y-2 text-sm">
            {[["Site address", `/o/${d.slug}`], ["Owner", `${d.owner.name} · ${d.owner.email}`], ["Plan", PLAN_LIMITS[d.plan].label], ["Status", d.status], ["Published version", d.published ? `v${d.version} · ${fmtDate(d.publishedAt)}` : "Not published"], ["Created", fmtDate(d.createdAt)], ["Events", `${d.draft.events.length} / ${PLAN_LIMITS[d.plan].events > 900 ? "∞" : PLAN_LIMITS[d.plan].events}`], ["Registrations", `${d.registrations.length} / ${PLAN_LIMITS[d.plan].registrations}`], ["Visits", d.visits]].map(([k, v]) => <div key={k as string} className="flex justify-between gap-4 border-b border-slate-100 py-1.5"><span className="text-slate-500">{k}</span><span className="text-right font-medium text-slate-800">{v}</span></div>)}
            <p className="pt-2 text-xs text-slate-400">Registrant details and draft content are private to the organization and are not shown here.</p>
          </div>
        )}
      </Modal>
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete organization">
        {del && <div className="space-y-4"><p className="text-sm text-slate-600">This permanently deletes <b>{del.draft.site.branding.orgName}</b>, its site, events and registrations. Type <code className="rounded bg-slate-100 px-1">{del.slug}</code> to confirm.</p>
          <Field label="Site address"><input className={inputCls} value={typed} onChange={(e) => setTyped(e.target.value)} /></Field>
          <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setDel(null)}>Cancel</Button><Button variant="danger" disabled={typed !== del.slug} onClick={async () => { const id = del.id; setDel(null); await run(() => deleteOrg(id), "Organization deleted"); }}>Delete permanently</Button></div></div>}
      </Modal>
    </div>
  );
}
