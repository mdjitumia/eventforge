"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { createEvent, deleteEvent, duplicateEvent } from "@/lib/api";
import { PLAN_LIMITS } from "@/lib/types";
import { Badge, Button, Card, Confirm, Empty, PageTitle, useRun } from "@/components/ui";

export default function EventsPage() {
  const org = useCurrentOrg()!;
  const router = useRouter();
  const run = useRun();
  const [del, setDel] = useState<string | null>(null);
  const limit = PLAN_LIMITS[org.plan].events;
  const events = org.draft.events;

  async function create() {
    const id = await run(() => createEvent());
    if (id) router.push(`/dashboard/events/${id}`);
  }
  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title="Events & competitions" desc={`These appear in the Events section of your website. ${events.length} of ${limit > 900 ? "unlimited" : limit} events used on your ${PLAN_LIMITS[org.plan].label} plan.`} actions={<Button onClick={create}><Plus size={16} /> New event</Button>} />
      {events.length === 0 && <Empty title="No events yet" desc="Create your first competition or session." action={<Button onClick={create}>Create event</Button>} />}
      <div className="space-y-3">
        {events.map((e) => {
          const regs = org.registrations.filter((r) => r.eventId === e.id).length;
          return (
            <Card key={e.id} className="flex flex-wrap items-center gap-4 p-3 sm:p-4">
              <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">{e.banner && /* eslint-disable-next-line @next/next/no-img-element */ <img src={e.banner} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{e.title}</p>
                <p className="truncate text-sm text-slate-500">{[e.date, e.time, e.location].filter(Boolean).join(" · ") || "No date or location yet"}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge tone={e.registrationOpen ? "green" : "slate"}>{e.registrationOpen ? "Registration open" : "Closed"}</Badge>
                  <Badge tone="blue">{e.feeAmount > 0 ? e.registrationFee : "Free"}</Badge><Badge>{regs} registrations</Badge>
                  {e.featured && <Badge tone="purple">Featured</Badge>}{e.isSample && <Badge tone="amber">Sample</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/o/${org.slug}/events/${e.slug}?preview=1`} target="_blank" className="rounded p-2 text-slate-500 hover:bg-slate-100" title="Preview page"><ExternalLink size={16} /></Link>
                <button onClick={async () => { const id = await run(() => duplicateEvent(e.id), "Event duplicated"); if (id) router.push(`/dashboard/events/${id}`); }} className="rounded p-2 text-slate-500 hover:bg-slate-100" title="Duplicate"><Copy size={16} /></button>
                <Link href={`/dashboard/events/${e.id}`}><Button size="sm" variant="secondary"><Pencil size={14} /> Edit</Button></Link>
                <button onClick={() => setDel(e.id)} className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
              </div>
            </Card>
          );
        })}
      </div>
      <Confirm open={!!del} danger title="Delete this event?" message="It will be removed from your draft. Existing registrations stay in the registrations list." confirmLabel="Delete" onCancel={() => setDel(null)} onConfirm={async () => { const id = del!; setDel(null); await run(() => deleteEvent(id), "Event deleted"); }} />
    </div>
  );
}
