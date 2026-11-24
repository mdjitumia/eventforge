"use client";
import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { updateBranding } from "@/lib/api";
import { Button, Card, Field, inputCls, PageTitle, useRun } from "@/components/ui";
import { ImageUpload } from "@/components/form/ImageUpload";
import { FONTS, PRESETS } from "@/lib/theme";
import type { Branding } from "@/lib/types";
import { SiteFrame, SiteSections } from "@/components/site/SiteFrame";
import { cn } from "@/lib/utils";

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <Field label={label}>
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-slate-300 bg-white p-1" />
      <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  </Field>
);

export default function BrandingPage() {
  const org = useCurrentOrg()!;
  const run = useRun();
  const [b, setB] = useState<Branding>(() => structuredClone(org.draft.site.branding));
  const dirty = JSON.stringify(b) !== JSON.stringify(org.draft.site.branding);
  const setT = (p: Partial<Branding["theme"]>) => setB((s) => ({ ...s, theme: { ...s.theme, ...p } }));

  const preview = useMemo(() => {
    const keep = org.draft.site.sections.filter((s) => s.type === "hero" || s.type === "events").map((s) => ({ ...s, visible: true }));
    return { site: { ...org.draft.site, branding: b, sections: keep }, events: org.draft.events.slice(0, 3) };
  }, [org, b]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle title="Branding" desc="Logo, name, colors, fonts and style. Changes apply to your whole website." actions={<Button disabled={!dirty} onClick={() => run(() => updateBranding(b), "Branding saved to draft")}><Save size={16} /> Save changes</Button>} />
      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <div className="space-y-5">
          <Card className="space-y-4 p-5">
            <h2 className="font-bold text-slate-900">Identity</h2>
            <Field label="Organization / event name"><input className={inputCls} value={b.orgName} onChange={(e) => setB({ ...b, orgName: e.target.value })} /></Field>
            <Field label="Short name (navbar)"><input className={inputCls} value={b.shortName} onChange={(e) => setB({ ...b, shortName: e.target.value })} /></Field>
            <Field label="Tagline"><input className={inputCls} value={b.tagline} onChange={(e) => setB({ ...b, tagline: e.target.value })} /></Field>
            <Field label="Logo" help="Square image works best."><ImageUpload value={b.logo} onChange={(v) => setB({ ...b, logo: v })} /></Field>
            <Field label="Announcement bar" help="Shown at the very top. Leave empty to hide."><input className={inputCls} value={b.announcement} onChange={(e) => setB({ ...b, announcement: e.target.value })} /></Field>
          </Card>
          <Card className="space-y-4 p-5">
            <h2 className="font-bold text-slate-900">Theme</h2>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Color presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button key={p.name} onClick={() => setT({ primary: p.primary, secondary: p.secondary, accent: p.accent })} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50">
                    <span className="flex"><i className="h-4 w-4 rounded-full" style={{ background: p.primary }} /><i className="-ml-1 h-4 w-4 rounded-full" style={{ background: p.secondary }} /><i className="-ml-1 h-4 w-4 rounded-full" style={{ background: p.accent }} /></span>{p.name}
                  </button>
                ))}
              </div>
            </div>
            <ColorInput label="Primary color" value={b.theme.primary} onChange={(v) => setT({ primary: v })} />
            <ColorInput label="Secondary color" value={b.theme.secondary} onChange={(v) => setT({ secondary: v })} />
            <ColorInput label="Accent color" value={b.theme.accent} onChange={(v) => setT({ accent: v })} />
            <Field label="Mode">
              <div className="grid grid-cols-2 gap-2">{(["light", "dark"] as const).map((m) => <button key={m} onClick={() => setT({ mode: m })} className={cn("rounded-lg border py-2 text-sm font-semibold capitalize", b.theme.mode === m ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-300")}>{m}</button>)}</div>
            </Field>
            <Field label="Font style"><select className={inputCls} value={b.theme.font} onChange={(e) => setT({ font: e.target.value as Branding["theme"]["font"] })}>{Object.entries(FONTS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}</select></Field>
            <Field label="Corner style"><select className={inputCls} value={b.theme.radius} onChange={(e) => setT({ radius: e.target.value as Branding["theme"]["radius"] })}><option value="sharp">Sharp</option><option value="soft">Soft</option><option value="round">Round</option></select></Field>
          </Card>
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Live preview</p>
          <div className="max-h-[calc(100vh-9rem)] overflow-auto rounded-xl border border-slate-300 bg-white shadow-sm xl:sticky xl:top-6">
            <SiteFrame snapshot={preview} slug={org.slug} preview interactive={false}><SiteSections snapshot={preview} /></SiteFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
