"use client";
import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { updateFooter, updateSection, updateSeo } from "@/lib/api";
import { FOOTER_FIELDS, SECTION_META, SEO_FIELDS } from "@/lib/schemas";
import { Badge, Button, Card, Empty, Field, inputCls, PageTitle, Switch, useRun } from "@/components/ui";
import { SchemaForm } from "@/components/form/SchemaForm";
import { SiteFrame, SiteSections } from "@/components/site/SiteFrame";

export default function SectionEditor({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = use(params);
  const org = useCurrentOrg()!;
  if (sectionId === "footer") return <FooterEditor />;
  const section = org.draft.site.sections.find((s) => s.id === sectionId);
  if (!section) return <Empty title="Section not found" desc="It may have been deleted." action={<Link href="/dashboard/website"><Button>Back to sections</Button></Link>} />;
  return <Editor key={section.id} sectionId={section.id} />;
}

function Editor({ sectionId }: { sectionId: string }) {
  const org = useCurrentOrg()!;
  const run = useRun();
  const section = org.draft.site.sections.find((s) => s.id === sectionId)!;
  const meta = SECTION_META[section.type];
  const [data, setData] = useState(() => structuredClone(section.data));
  const [navLabel, setNavLabel] = useState(section.navLabel);
  const [visible, setVisible] = useState(section.visible);
  const dirty = JSON.stringify(data) !== JSON.stringify(section.data) || navLabel !== section.navLabel || visible !== section.visible;

  const preview = useMemo(() => ({ site: { ...org.draft.site, sections: [{ ...section, data, visible: true }] }, events: org.draft.events }), [org, section, data]);

  async function save() {
    await run(async () => {
      await updateSection(sectionId, { data, navLabel, visible });
      return true;
    }, "Saved to draft");
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/dashboard/website" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"><ArrowLeft size={14} /> All sections</Link>
      <PageTitle title={meta.label} desc={meta.desc} actions={<>
        {section.isSample && <Badge tone="amber">Sample content</Badge>}{dirty && <Badge tone="indigo">Unsaved changes</Badge>}
        <Button variant="secondary" disabled={!dirty} onClick={() => { setData(structuredClone(section.data)); setNavLabel(section.navLabel); setVisible(section.visible); }}><RotateCcw size={15} /> Reset</Button>
        <Button disabled={!dirty && !section.isSample} onClick={save}><Save size={15} /> Save</Button>
      </>} />
      <div className="grid gap-6 xl:grid-cols-[480px_1fr]">
        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">Visible on website</p><p className="text-xs text-slate-500">Hidden sections stay saved but are not shown.</p></div><Switch checked={visible} onChange={setVisible} label="Visible" /></div>
            {section.type !== "hero" && <Field label="Navbar link text" help="Leave empty to keep this section out of the navigation."><input className={inputCls} value={navLabel} onChange={(e) => setNavLabel(e.target.value)} /></Field>}
          </Card>
          <Card className="p-5"><SchemaForm fields={meta.fields} value={data} onChange={setData} /></Card>
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Live preview</p>
          <div className="max-h-[calc(100vh-9rem)] overflow-auto rounded-xl border border-slate-300 bg-white shadow-sm xl:sticky xl:top-6">
            <SiteFrame snapshot={preview} slug={org.slug} preview interactive={false} chrome={false}><SiteSections snapshot={preview} /></SiteFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterEditor() {
  const org = useCurrentOrg()!;
  const run = useRun();
  const [footer, setFooter] = useState(() => structuredClone(org.draft.site.footer));
  const [seo, setSeo] = useState(() => structuredClone(org.draft.site.seo));
  const dirty = JSON.stringify(footer) !== JSON.stringify(org.draft.site.footer) || JSON.stringify(seo) !== JSON.stringify(org.draft.site.seo);
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/website" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"><ArrowLeft size={14} /> All sections</Link>
      <PageTitle title="Footer, contact info & SEO" actions={<Button disabled={!dirty} onClick={() => run(async () => { await updateFooter(footer); await updateSeo(seo); return true; }, "Saved to draft")}><Save size={15} /> Save</Button>} />
      <Card className="mb-5 p-5"><h2 className="mb-4 font-bold">Footer</h2><SchemaForm fields={FOOTER_FIELDS} value={footer} onChange={(v) => setFooter(v as typeof footer)} /></Card>
      <Card className="p-5"><h2 className="mb-4 font-bold">SEO</h2><SchemaForm fields={SEO_FIELDS} value={seo} onChange={(v) => setSeo(v as typeof seo)} /></Card>
    </div>
  );
}
