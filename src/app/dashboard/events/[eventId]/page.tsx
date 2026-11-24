"use client";
import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RotateCcw, Save } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { updateEvent } from "@/lib/api";
import { EVENT_FIELDS } from "@/lib/schemas";
import type { OrgEvent } from "@/lib/types";
import { Badge, Button, Card, Empty, Field, inputCls, PageTitle, useRun } from "@/components/ui";
import { SchemaForm } from "@/components/form/SchemaForm";
import { slugify } from "@/lib/utils";

export default function EventEditorPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const org = useCurrentOrg()!;
  const ev = org.draft.events.find((e) => e.id === eventId);
  if (!ev) return <Empty title="Event not found" action={<Link href="/dashboard/events"><Button>Back to events</Button></Link>} />;
  return <Editor key={ev.id} ev={ev} slug={org.slug} />;
}

function Editor({ ev, slug }: { ev: OrgEvent; slug: string }) {
  const run = useRun();
  const [data, setData] = useState<OrgEvent>(() => structuredClone(ev));
  const dirty = JSON.stringify(data) !== JSON.stringify(ev);
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/events" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"><ArrowLeft size={14} /> All events</Link>
      <PageTitle title={ev.title || "Event"} desc="Everything visitors see on this event's page." actions={<>
        {ev.isSample && <Badge tone="amber">Sample content</Badge>}{dirty && <Badge tone="indigo">Unsaved changes</Badge>}
        <Link href={`/o/${slug}/events/${ev.slug}?preview=1`} target="_blank"><Button variant="secondary"><ExternalLink size={15} /> Preview</Button></Link>
        <Button variant="secondary" disabled={!dirty} onClick={() => setData(structuredClone(ev))}><RotateCcw size={15} /> Reset</Button>
        <Button disabled={!dirty && !ev.isSample} onClick={() => run(() => updateEvent(ev.id, data), "Event saved to draft")}><Save size={15} /> Save</Button>
      </>} />
      <Card className="space-y-4 p-5">
        <Field label="Page address" help={`Visitors open /o/${slug}/events/${data.slug || "…"}`}>
          <input className={inputCls} value={data.slug} onChange={(e) => setData({ ...data, slug: slugify(e.target.value) })} />
        </Field>
        <Field label="Event code (optional)"><input className={inputCls} value={data.code} onChange={(e) => setData({ ...data, code: e.target.value })} placeholder="EVT-01" /></Field>
        <SchemaForm fields={EVENT_FIELDS} value={data as unknown as Record<string, any>} onChange={(v) => setData(v as unknown as OrgEvent)} />
      </Card>
    </div>
  );
}
