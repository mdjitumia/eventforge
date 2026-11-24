"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDB } from "@/lib/store";
import { Badge, Card, inputCls, PageTitle } from "@/components/ui";
import { fmtDate } from "@/lib/utils";

const tone = (a: string) => (a.includes("deleted") || a.includes("suspended") ? "red" : a.includes("published") ? "green" : a.includes("created") ? "indigo" : a.includes("plan") ? "purple" : "slate") as "red" | "green" | "indigo" | "purple" | "slate";

export default function ActivityPage() {
  const db = useDB();
  const [q, setQ] = useState("");
  const rows = useMemo(() => db.audit.filter((a) => !q || `${a.action} ${a.detail} ${a.actor} ${a.orgName ?? ""}`.toLowerCase().includes(q.toLowerCase())), [db.audit, q]);
  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title="Activity log" desc="Important actions across the platform: sign-ins, publishing, plan changes and suspensions." />
      <div className="relative mb-4 max-w-md"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input className={inputCls + " pl-9"} placeholder="Filter activity" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">When</th><th className="p-3">Action</th><th className="p-3">Details</th><th className="p-3">Organization</th><th className="p-3">Actor</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.slice(0, 200).map((a) => <tr key={a.id}><td className="whitespace-nowrap p-3 text-slate-500">{fmtDate(a.at)}</td><td className="p-3"><Badge tone={tone(a.action)}>{a.action}</Badge></td><td className="p-3 text-slate-700">{a.detail}</td><td className="p-3 text-slate-600">{a.orgName ?? "-"}</td><td className="p-3 text-slate-500">{a.actor}</td></tr>)}</tbody>
        </table>
        {rows.length === 0 && <p className="p-8 text-center text-sm text-slate-500">Nothing here yet.</p>}
      </Card>
    </div>
  );
}
