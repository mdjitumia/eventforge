"use client";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import type { Section, Snapshot } from "@/lib/types";
import { themeVars } from "@/lib/theme";
import { PLATFORM_NAME } from "@/lib/config";
import { Img, SiteCtx, SLink, useSite } from "./ctx";
import { SectionRenderer } from "./sections";

/** Anchor id for each section: its type, or its unique id when the type repeats. */
export function anchors(sections: Section[]) {
  const seen = new Set<string>();
  const map = new Map<string, string>();
  for (const s of sections) {
    const a = seen.has(s.type) ? s.id : s.type;
    seen.add(s.type);
    map.set(s.id, a);
  }
  return map;
}

function Navbar() {
  const { snapshot } = useSite();
  const { branding, sections } = snapshot.site;
  const [open, setOpen] = useState(false);
  const map = anchors(sections);
  const items = sections.filter((s) => s.visible && s.navLabel);
  const firstOpen = snapshot.events.find((e) => e.registrationOpen);
  return (
    <header className="sticky top-0 z-40 border-b border-site-fg/10 bg-site-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <SLink href="#hero" className="flex min-w-0 items-center gap-2.5">
          {branding.logo && <Img src={branding.logo} alt={branding.orgName} className="h-9 w-9 shrink-0 rounded-site object-cover" />}
          <span className="truncate font-heading text-base font-bold text-site-fg">{branding.shortName || branding.orgName}</span>
        </SLink>
        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((s) => <SLink key={s.id} href={`#${map.get(s.id)}`} className="rounded-site px-3 py-2 text-sm font-medium text-site-muted transition hover:bg-site-fg/5 hover:text-site-fg">{s.navLabel}</SLink>)}
        </nav>
        <div className="flex items-center gap-2">
          {firstOpen && <SLink href={`/register/${firstOpen.slug}`} className="hidden rounded-site bg-site-primary px-4 py-2 text-sm font-semibold text-site-ink hover:opacity-90 sm:inline-flex">Register</SLink>}
          <button className="rounded-site p-2 text-site-fg lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-site-fg/10 bg-site-bg px-4 pb-4 lg:hidden" onClick={() => setOpen(false)}>
          {items.map((s) => <SLink key={s.id} href={`#${map.get(s.id)}`} className="block rounded-site px-3 py-2.5 text-sm font-medium text-site-fg hover:bg-site-fg/5">{s.navLabel}</SLink>)}
          {firstOpen && <SLink href={`/register/${firstOpen.slug}`} className="mt-2 block rounded-site bg-site-primary px-3 py-2.5 text-center text-sm font-semibold text-site-ink">Register</SLink>}
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { snapshot } = useSite();
  const { branding, footer, sections } = snapshot.site;
  const map = anchors(sections);
  const items = sections.filter((s) => s.visible && s.navLabel);
  return (
    <footer className="border-t border-site-fg/10 bg-site-bg2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">{branding.logo && <Img src={branding.logo} alt="" className="h-9 w-9 rounded-site object-cover" />}<span className="font-heading text-lg font-bold text-site-fg">{branding.orgName}</span></div>
          <p className="mt-3 text-sm text-site-muted">{footer.about}</p>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-site-fg">Explore</h4>
          <ul className="space-y-1.5 text-sm">{items.map((s) => <li key={s.id}><SLink href={`#${map.get(s.id)}`} className="text-site-muted hover:text-site-primary">{s.navLabel}</SLink></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-site-fg">Contact</h4>
          <ul className="space-y-1.5 text-sm text-site-muted">
            {footer.email && <li><SLink href={`mailto:${footer.email}`} className="hover:text-site-primary">{footer.email}</SLink></li>}
            {footer.phone && <li>{footer.phone}</li>}{footer.address && <li>{footer.address}</li>}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">{footer.socials.map((s, i) => <SLink key={i} href={s.url} className="text-sm font-medium text-site-primary hover:underline">{s.platform}</SLink>)}</div>
        </div>
      </div>
      <div className="border-t border-site-fg/10 py-4 text-center text-xs text-site-muted">{footer.copyright} · Built with {PLATFORM_NAME}</div>
    </footer>
  );
}

/** Themed shell used by the published site, the preview, and the dashboard live-previews. */
export function SiteFrame({ snapshot, slug, preview = false, interactive = true, chrome = true, children }: { snapshot: Snapshot; slug: string; preview?: boolean; interactive?: boolean; chrome?: boolean; children: ReactNode }) {
  const { branding } = snapshot.site;
  return (
    <SiteCtx.Provider value={{ slug, preview, snapshot, interactive }}>
      <div style={themeVars(branding.theme)} className="min-h-full bg-site-bg font-body text-site-fg">
        {chrome && branding.announcement && <div className="bg-site-primary px-4 py-2 text-center text-xs font-semibold text-site-ink sm:text-sm">{branding.announcement}</div>}
        {chrome && <Navbar />}
        {children}
        {chrome && <Footer />}
      </div>
    </SiteCtx.Provider>
  );
}

export function SiteSections({ snapshot }: { snapshot: Snapshot }) {
  const sections = snapshot.site.sections.filter((s) => s.visible);
  const map = anchors(snapshot.site.sections);
  let n = 0;
  return (
    <>
      {sections.map((s) => {
        const alt = s.type !== "hero" && s.type !== "cta" ? n++ % 2 === 1 : false;
        return <SectionRenderer key={s.id} section={s} id={map.get(s.id)!} alt={alt} />;
      })}
    </>
  );
}
