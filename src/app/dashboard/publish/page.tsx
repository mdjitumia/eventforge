"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, ExternalLink, Eye, Globe, Lock, PackageOpen, Rocket } from "lucide-react";
import { useCurrentOrg } from "@/lib/store";
import { changeSlug, publishSite, unpublishSite } from "@/lib/api";
import { Badge, Button, Card, Confirm, Field, inputCls, PageTitle, useRun } from "@/components/ui";
import { CopyButton, useOrigin } from "@/components/panel/hooks";
import { fmtDate, validateSlug } from "@/lib/utils";

export default function PublishPage() {
  const org = useCurrentOrg()!;
  const run = useRun();
  const origin = useOrigin();
  const [slug, setSlug] = useState(org.slug);
  const [confirmUnpub, setConfirmUnpub] = useState(false);
  const url = `${origin}/o/${org.slug}`;
  const isLive = !!org.published;
  const changed = isLive && JSON.stringify(org.draft) !== JSON.stringify(org.published);
  const slugErr = slug !== org.slug ? validateSlug(slug) : null;

  const sampleSections = org.draft.site.sections.filter((s) => s.isSample && s.visible).length;
  const sampleEvents = org.draft.events.filter((e) => e.isSample).length;
  const checks = [
    { ok: org.draft.events.length > 0, label: "At least one event exists", must: true },
    { ok: !!org.draft.site.branding.logo, label: "A logo is uploaded", must: false },
    { ok: sampleSections === 0, label: sampleSections ? `${sampleSections} section(s) still contain sample content` : "All sections customized", must: false },
    { ok: sampleEvents === 0, label: sampleEvents ? `${sampleEvents} event(s) still contain sample content` : "All events customized", must: false },
  ];
  const blocked = checks.some((c) => c.must && !c.ok);

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Publish & Export" desc="Preview your draft, publish it and share the link with participants." />
      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2"><Badge tone={isLive ? "green" : "amber"}>{isLive ? `Live · v${org.version}` : "Not published"}</Badge>{changed && <Badge tone="indigo">Unpublished changes</Badge>}{org.publishedAt && <span className="text-xs text-slate-500">Published {fmtDate(org.publishedAt)}</span>}</div>
          <Link href={`/o/${org.slug}?preview=1`} target="_blank"><Button variant="secondary" size="sm"><Eye size={14} /> Preview draft</Button></Link>
        </div>
        <ul className="mt-4 space-y-2">
          {checks.map((c) => <li key={c.label} className="flex items-center gap-2 text-sm">{c.ok ? <CheckCircle2 size={17} className="text-emerald-600" /> : <AlertTriangle size={17} className={c.must ? "text-red-500" : "text-amber-500"} />}<span className={c.ok ? "text-slate-700" : "text-slate-900"}>{c.label}{!c.ok && !c.must && <span className="text-slate-400"> (you can still publish)</span>}</span></li>)}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button disabled={blocked || (isLive && !changed)} onClick={() => run(publishSite, "Site published")}><Rocket size={16} /> {isLive ? (changed ? "Publish changes" : "Up to date") : "Publish site"}</Button>
          {isLive && <Button variant="secondary" onClick={() => setConfirmUnpub(true)}><Lock size={15} /> Unpublish</Button>}
        </div>
      </Card>

      <Card className="mb-6 p-5">
        <h2 className="font-bold text-slate-900">Your public link</h2>
        <p className="mt-1 text-sm text-slate-500">{isLive ? "Anyone with this link can see your published site." : "This link shows a 'not published yet' page until you publish."}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 p-3"><Globe size={16} className="text-slate-400" /><span className="min-w-0 flex-1 break-all text-sm font-medium text-slate-800">{url}</span><CopyButton text={url} />{isLive && <Link href={`/o/${org.slug}`} target="_blank"><Button size="sm" variant="secondary"><ExternalLink size={14} /> Open</Button></Link>}</div>
        <div className="mt-5 grid items-end gap-3 sm:grid-cols-[1fr_auto]">
          <Field label="Site address" help={slugErr ?? "Changing it breaks links you already shared."}>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white"><span className="pl-3 text-sm text-slate-400">/o/</span><input className="w-full rounded-lg bg-transparent px-1 py-2 text-sm focus:outline-none" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} /></div>
          </Field>
          <Button variant="secondary" disabled={slug === org.slug || !!slugErr} onClick={() => run(() => changeSlug(slug), "Address updated")}>Update address</Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2"><h2 className="font-bold text-slate-900">Export & self-hosting</h2><Badge tone="purple">Coming Soon</Badge></div>
        <p className="mt-1 text-sm text-slate-500">Download your site or run the whole system on your own server. This feature is still under development.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[{ i: Download, t: "Static website export", d: "Public HTML, CSS, JavaScript and images as a ZIP." }, { i: PackageOpen, t: "Full system export", d: "Frontend, backend, database setup and Docker files." }].map((x) => (
            <div key={x.t} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-700"><x.i size={18} /> {x.t}</div>
              <p className="mt-1 text-sm text-slate-500">{x.d}</p>
              <button disabled title="This feature is under development" className="mt-3 inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-lg bg-slate-200 px-4 text-sm font-medium text-slate-500">Export <Badge tone="purple">Coming Soon</Badge></button>
            </div>
          ))}
        </div>
      </Card>
      <Confirm open={confirmUnpub} title="Unpublish your site?" message="Your public link will show a 'not published yet' page. Your draft stays safe." confirmLabel="Unpublish" danger onCancel={() => setConfirmUnpub(false)} onConfirm={async () => { setConfirmUnpub(false); await run(unpublishSite, "Site unpublished"); }} />
    </div>
  );
}
