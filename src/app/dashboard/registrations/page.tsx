"use client";
import { useMemo, useState } from "react";
import { Check, Download, Eye, Search, Trash2, X } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { deleteRegistration, setRegistrationStatus } from "@/lib/api";
import type { Registration } from "@/lib/types";
import { Badge, Button, Card, Confirm, Empty, inputCls, Modal, PageTitle, useRun } from "@/components/ui";
import { downloadCsv, fmtDate } from "@/lib/utils";

const tone = { pending: "amber", verified: "green", rejected: "red" } as const;

export default function RegistrationsPage() {
  const org = useCurrentOrg()!;
  const run = useRun();
  const [q, setQ] = useState("");
  const [ev, setEv] = useState("all");
  const [st, setSt] = useState("all");
  const [view, setView] = useState<Registration | null>(null);
  const [del, setDel] = useState<string | null>(null);

  const rows = useMemo(() => org.registrations
    .filter((r) => (ev === "all" || r.eventId === ev) && (st === "all" || r.status === st))
    .filter((r) => !q || (r.teamName + r.members.map((m) => m.name + m.email).join(" ")).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [org.registrations, q, ev, st]);

  const verifiedAmount = org.registrations.filter((r) => r.status === "verified").reduce((s, r) => s + r.amount, 0);

  function exportCsv() {
    downloadCsv(`${org.slug}-registrations.csv`, [
      ["ID", "Event", "Team", "Status", "Amount", "Method", "Sender", "TxnID", "Members", "Emails", "Created"],
      ...rows.map((r) => [r.id, r.eventTitle, r.teamName, r.status, r.amount, r.paymentMethod, r.senderNumber, r.txnId, r.members.map((m) => m.name).join("; "), r.members.map((m) => m.email).join("; "), r.createdAt]),
    ]);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Registrations" desc="Teams and participants who registered through your public site." actions={<Button variant="secondary" onClick={exportCsv} disabled={rows.length === 0}><Download size={15} /> Export CSV</Button>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        {[["Total", org.registrations.length], ["Pending", org.registrations.filter((r) => r.status === "pending").length], ["Verified", org.registrations.filter((r) => r.status === "verified").length], ["Verified revenue", `৳${verifiedAmount.toLocaleString()}`]].map(([l, v]) => (
          <Card key={l as string} className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{l}</p><p className="mt-1 text-2xl font-bold text-slate-900">{v}</p></Card>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input className={inputCls + " pl-9"} placeholder="Search team, name or email" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className={inputCls + " !w-auto"} value={ev} onChange={(e) => setEv(e.target.value)}><option value="all">All events</option>{org.draft.events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select>
        <select className={inputCls + " !w-auto"} value={st} onChange={(e) => setSt(e.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select>
      </div>
      {rows.length === 0 ? <Empty title="No registrations found" desc="When visitors register on your published site they will appear here." /> : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Team / participant</th><th className="p-3">Event</th><th className="p-3">Members</th><th className="p-3">Fee</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 font-medium text-slate-900">{r.teamName}</td><td className="p-3 text-slate-600">{r.eventTitle}</td><td className="p-3 text-slate-600">{r.members.length}</td>
                  <td className="p-3 text-slate-600">{r.amount ? `৳${r.amount}` : "Free"}</td><td className="p-3"><Badge tone={tone[r.status]}>{r.status}</Badge></td><td className="p-3 text-slate-500">{fmtDate(r.createdAt)}</td>
                  <td className="p-3"><div className="flex justify-end gap-1">
                    <button onClick={() => setView(r)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" title="Details"><Eye size={16} /></button>
                    <button onClick={() => run(() => setRegistrationStatus(r.id, "verified"))} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50" title="Verify"><Check size={16} /></button>
                    <button onClick={() => run(() => setRegistrationStatus(r.id, "rejected"))} className="rounded p-1.5 text-amber-600 hover:bg-amber-50" title="Reject"><X size={16} /></button>
                    <button onClick={() => setDel(r.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <Modal open={!!view} onClose={() => setView(null)} title={view ? `${view.teamName} · ${view.eventTitle}` : ""} wide>
        {view && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-2 sm:grid-cols-2"><p><b>ID:</b> {view.id}</p><p><b>Status:</b> {view.status}</p><p><b>Fee:</b> {view.amount ? `৳${view.amount}` : "Free"}</p><p><b>Payment:</b> {view.paymentMethod ? `${view.paymentMethod} · ${view.senderNumber} · ${view.txnId}` : "-"}</p></div>
            <div className="space-y-2">{view.members.map((m, i) => <div key={i} className="rounded-lg border border-slate-200 p-3"><p className="font-semibold">{m.name} {i === 0 && <Badge tone="indigo">Leader</Badge>}</p><p className="text-slate-600">{m.email} · {m.phone}</p><p className="text-slate-500">{m.institution} {m.studentId && `· ID ${m.studentId}`}</p></div>)}</div>
          </div>
        )}
      </Modal>
      <Confirm open={!!del} danger title="Delete this registration?" message="This permanently removes the registration." confirmLabel="Delete" onCancel={() => setDel(null)} onConfirm={async () => { const id = del!; setDel(null); await run(() => deleteRegistration(id), "Registration deleted"); }} />
    </div>
  );
}
