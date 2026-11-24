"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { addSection, deleteSection, moveSection, updateSection } from "@/lib/api";
import { SECTION_META } from "@/lib/schemas";
import type { SectionType } from "@/lib/types";
import { Badge, Button, Card, Confirm, Modal, PageTitle, useRun } from "@/components/ui";
import { SectionIcon } from "@/components/panel/icons";
import { cn } from "@/lib/utils";

export default function WebsitePage() {
  const org = useCurrentOrg()!;
  const router = useRouter();
  const run = useRun();
  const [adding, setAdding] = useState(false);
  const [del, setDel] = useState<string | null>(null);
  const sections = org.draft.site.sections;

  async function add(t: SectionType) {
    const id = await run(() => addSection(t));
    if (id) { setAdding(false); router.push(`/dashboard/website/${id}`); }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Website sections" desc="Your public site is built from these sections, top to bottom. Show, hide, reorder, edit or delete any of them." actions={<Button onClick={() => setAdding(true)}><Plus size={16} /> Add section</Button>} />
      <div className="space-y-2.5">
        {sections.map((s, i) => {
          const m = SECTION_META[s.type];
          return (
            <Card key={s.id} className={cn("flex flex-wrap items-center gap-3 p-3 sm:p-4", !s.visible && "opacity-60")}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><SectionIcon name={m.icon} /></div>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">{m.label}{s.data.heading && s.type !== "hero" ? <span className="truncate text-sm font-normal text-slate-500">· {String(s.data.heading)}</span> : null}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">{s.isSample && <Badge tone="amber">Sample content</Badge>}{!s.visible && <Badge>Hidden</Badge>}{s.navLabel && <Badge tone="blue">Nav: {s.navLabel}</Badge>}</div>
              </div>
              <div className="flex items-center gap-1">
                <button disabled={i === 0} onClick={() => run(() => moveSection(s.id, -1))} className="rounded p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up"><ArrowUp size={16} /></button>
                <button disabled={i === sections.length - 1} onClick={() => run(() => moveSection(s.id, 1))} className="rounded p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down"><ArrowDown size={16} /></button>
                <button onClick={() => run(() => updateSection(s.id, { visible: !s.visible }, false))} className="rounded p-2 text-slate-500 hover:bg-slate-100" aria-label="Toggle visibility" title={s.visible ? "Hide section" : "Show section"}>{s.visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                <Link href={`/dashboard/website/${s.id}`}><Button size="sm" variant="secondary"><Pencil size={14} /> Edit</Button></Link>
                <button onClick={() => setDel(s.id)} className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 size={16} /></button>
              </div>
            </Card>
          );
        })}
        <Card className="flex items-center gap-3 border-dashed p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600"><Settings2 size={18} /></div>
          <div className="flex-1"><p className="font-semibold text-slate-900">Footer, contact info &amp; SEO</p><p className="text-sm text-slate-500">Footer text, social links, browser title and search description.</p></div>
          <Link href="/dashboard/website/footer"><Button size="sm" variant="secondary"><Pencil size={14} /> Edit</Button></Link>
        </Card>
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a section" wide>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(SECTION_META) as SectionType[]).map((t) => (
            <button key={t} onClick={() => add(t)} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-indigo-400 hover:bg-indigo-50/40">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><SectionIcon name={SECTION_META[t].icon} /></span>
              <span><span className="block text-sm font-semibold text-slate-900">{SECTION_META[t].label}</span><span className="text-xs text-slate-500">{SECTION_META[t].desc}</span></span>
            </button>
          ))}
        </div>
      </Modal>
      <Confirm open={!!del} danger title="Delete this section?" message="The section and all of its content will be removed from your draft. This cannot be undone." confirmLabel="Delete" onCancel={() => setDel(null)} onConfirm={async () => { const id = del!; setDel(null); await run(() => deleteSection(id), "Section deleted"); }} />
    </div>
  );
}
