"use client";
import { useEffect, useState, type ReactNode } from "react";
import { CalendarDays, Clock, ExternalLink, Mail, MapPin, Phone, Trophy, Users, Check, ChevronDown } from "lucide-react";
import type { Section } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Img, SLink, useSite } from "./ctx";

type D = Record<string, any>;
const arr = <T,>(v: T[] | undefined): T[] => (Array.isArray(v) ? v : []);

export function Wrap({ children, alt, id, className }: { children: ReactNode; alt?: boolean; id?: string; className?: string }) {
  return (
    <section id={id} className={cn("scroll-mt-16 py-16 sm:py-20", alt ? "bg-site-bg2" : "bg-site-bg", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function Head({ kicker, heading, subtitle, center = true }: { kicker?: string; heading?: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={cn("mb-10", center && "text-center")}>
      {kicker && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-site-primary">{kicker}</p>}
      {heading && <h2 className="font-heading text-3xl font-bold text-site-fg sm:text-4xl">{heading}</h2>}
      {subtitle && <p className={cn("mt-3 max-w-2xl text-site-muted", center && "mx-auto")}>{subtitle}</p>}
    </div>
  );
}

const Btn = ({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "outline" | "light" }) => (
  <SLink href={href} className={cn("inline-flex items-center justify-center gap-2 rounded-site px-6 py-3 text-sm font-semibold transition hover:opacity-90",
    variant === "primary" && "bg-site-primary text-site-ink shadow-lg", variant === "outline" && "border border-site-fg/25 text-site-fg hover:bg-site-fg/5", variant === "light" && "bg-white/15 text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/25")}>
    {children}
  </SLink>
);

// ------------------------------------------------------------------ Countdown
function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const ts = target ? new Date(target).getTime() : NaN;
  if (now === null || Number.isNaN(ts)) return null;
  const diff = ts - now;
  if (diff <= 0) return <p className="inline-block rounded-site bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30">The event has started</p>;
  const s = Math.floor(diff / 1000);
  const parts: [number, string][] = [[Math.floor(s / 86400), "Days"], [Math.floor((s % 86400) / 3600), "Hours"], [Math.floor((s % 3600) / 60), "Minutes"], [s % 60, "Seconds"]];
  return (
    <div className="flex gap-2 sm:gap-3">
      {parts.map(([n, l]) => (
        <div key={l} className="w-16 rounded-site bg-white/15 py-2 text-center ring-1 ring-white/30 backdrop-blur sm:w-20 sm:py-3">
          <div className="font-heading text-2xl font-bold text-white sm:text-3xl">{String(n).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/70">{l}</div>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ Hero
function Hero({ d, id }: { d: D; id: string }) {
  return (
    <section id={id} className="relative isolate overflow-hidden bg-site-bg2">
      {d.banner ? <Img src={d.banner} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" /> : <div className="absolute inset-0 -z-20 bg-gradient-to-br from-site-primary to-site-secondary" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/55 to-site-bg" />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        {d.badge && <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold tracking-wide text-white ring-1 ring-white/30 backdrop-blur">{d.badge}</span>}
        <h1 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          {d.title} {d.highlight && <span className="bg-gradient-to-r from-site-primary to-site-accent bg-clip-text text-transparent">{d.highlight}</span>}
        </h1>
        {d.subtitle && <p className="mt-4 max-w-2xl text-lg text-white/85">{d.subtitle}</p>}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
          {d.dateText && <span className="inline-flex items-center gap-2"><CalendarDays size={16} />{d.dateText}</span>}
          {d.locationText && <span className="inline-flex items-center gap-2"><MapPin size={16} />{d.locationText}</span>}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {d.ctaPrimaryLabel && <Btn href={d.ctaPrimaryLink}>{d.ctaPrimaryLabel}</Btn>}
          {d.ctaSecondaryLabel && <Btn href={d.ctaSecondaryLink} variant="light">{d.ctaSecondaryLabel}</Btn>}
        </div>
        {d.showCountdown && d.countdownTarget && <div className="mt-10"><Countdown target={d.countdownTarget} /></div>}
        {arr<D>(d.stats).length > 0 && (
          <div className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {arr<D>(d.stats).map((s, i) => (
              <div key={i} className="rounded-site bg-white/10 p-4 ring-1 ring-white/25 backdrop-blur">
                <div className="font-heading text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs uppercase tracking-wide text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ About / Text
function About({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  const stats = arr<D>(d.stats);
  return (
    <Wrap id={id} alt={alt}>
      <div className={cn("grid items-center gap-10", d.image && "lg:grid-cols-2")}>
        <div>
          <Head center={false} kicker={d.kicker} heading={d.heading} />
          <p className="-mt-4 whitespace-pre-line leading-relaxed text-site-muted">{d.body}</p>
          {stats.length > 0 && <div className="mt-6 flex flex-wrap gap-6">{stats.map((s, i) => <div key={i}><div className="font-heading text-3xl font-bold text-site-primary">{s.value}</div><div className="text-xs uppercase tracking-wide text-site-muted">{s.label}</div></div>)}</div>}
        </div>
        {d.image && <Img src={d.image} alt={d.heading} className="aspect-[4/3] w-full rounded-site object-cover shadow-xl" />}
      </div>
      {arr<D>(d.highlights).length > 0 && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {arr<D>(d.highlights).map((h, i) => (
            <div key={i} className="rounded-site border border-site-fg/10 bg-site-surface p-5 shadow-sm">
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-site-primary/15 text-site-primary"><Check size={18} /></div>
              <h3 className="font-heading font-semibold text-site-fg">{h.title}</h3>
              <p className="mt-1 text-sm text-site-muted">{h.text}</p>
            </div>
          ))}
        </div>
      )}
    </Wrap>
  );
}

function TextBlock({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  return (
    <Wrap id={id} alt={alt}>
      <div className={cn("grid items-center gap-10", d.image && "lg:grid-cols-2")}>
        <div className={cn(d.imagePosition === "left" && "lg:order-2")}>
          <Head center={false} kicker={d.kicker} heading={d.heading} />
          <p className="-mt-4 whitespace-pre-line leading-relaxed text-site-muted">{d.body}</p>
        </div>
        {d.image && <Img src={d.image} alt={d.heading} className="aspect-[4/3] w-full rounded-site object-cover shadow-xl" />}
      </div>
    </Wrap>
  );
}

// ------------------------------------------------------------------ Events
function Events({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  const { snapshot } = useSite();
  const events = snapshot.events;
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      {events.length === 0 && <p className="text-center text-site-muted">No events yet.</p>}
      <div className={cn(d.layout === "list" ? "space-y-3" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
        {events.map((e) =>
          d.layout === "list" ? (
            <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-site border border-site-fg/10 bg-site-surface p-4">
              <div><h3 className="font-heading font-semibold text-site-fg">{e.title}</h3><p className="text-sm text-site-muted">{[e.date, e.time].filter(Boolean).join(" · ")}</p></div>
              <div className="flex gap-2"><Btn href={`/events/${e.slug}`} variant="outline">Details</Btn>{e.registrationOpen && <Btn href={`/register/${e.slug}`}>Register</Btn>}</div>
            </div>
          ) : (
            <article key={e.id} className="group flex flex-col overflow-hidden rounded-site border border-site-fg/10 bg-site-surface shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[16/8] overflow-hidden bg-site-bg2">
                {e.banner ? <Img src={e.banner} alt={e.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="h-full w-full bg-gradient-to-br from-site-primary to-site-secondary" />}
                {e.code && <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-semibold text-white">{e.code}</span>}
                {e.featured && <span className="absolute right-3 top-3 rounded-full bg-site-accent px-2.5 py-0.5 text-[11px] font-bold text-black">Featured</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-heading text-lg font-bold text-site-fg">{e.title}</h3>
                {e.tagline && <p className="text-sm font-medium text-site-primary">{e.tagline}</p>}
                <p className="mt-2 line-clamp-3 text-sm text-site-muted">{e.description}</p>
                <div className="mt-3 space-y-1 text-xs text-site-muted">
                  {(e.date || e.time) && <p className="flex items-center gap-1.5"><Clock size={13} />{[e.date, e.time].filter(Boolean).join(" · ")}</p>}
                  {e.teamSize && <p className="flex items-center gap-1.5"><Users size={13} />{e.teamSize}</p>}
                  {e.totalPrizePool && e.totalPrizePool !== "-" && <p className="flex items-center gap-1.5"><Trophy size={13} />Prize pool {e.totalPrizePool}</p>}
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-site-fg/10 pt-4">
                  <span className="text-sm font-semibold text-site-fg">{e.feeAmount > 0 ? e.registrationFee : "Free"}</span>
                  <div className="flex gap-2">
                    <SLink href={`/events/${e.slug}`} className="rounded-site px-3 py-1.5 text-xs font-semibold text-site-fg ring-1 ring-site-fg/20 hover:bg-site-fg/5">Details</SLink>
                    {e.registrationOpen ? <SLink href={`/register/${e.slug}`} className="rounded-site bg-site-primary px-3 py-1.5 text-xs font-semibold text-site-ink hover:opacity-90">Register</SLink> : <span className="rounded-site bg-site-fg/10 px-3 py-1.5 text-xs font-semibold text-site-muted">Closed</span>}
                  </div>
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </Wrap>
  );
}

// ------------------------------------------------------------------ Schedule
const TRACKS = ["bg-site-primary/15 text-site-primary", "bg-site-accent/20 text-site-accent", "bg-site-secondary/15 text-site-secondary"];
function Schedule({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  const days = arr<D>(d.days);
  const [tab, setTab] = useState(0);
  const day = days[Math.min(tab, Math.max(days.length - 1, 0))];
  const trackIdx = (t: string) => Math.abs([...(t || "x")].reduce((a, c) => a + c.charCodeAt(0), 0)) % TRACKS.length;
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      {days.length > 1 && <div className="mb-6 flex flex-wrap justify-center gap-2">{days.map((x, i) => <button key={i} onClick={() => setTab(i)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold transition", i === tab ? "bg-site-primary text-site-ink" : "bg-site-surface text-site-muted ring-1 ring-site-fg/10")}>{x.label}</button>)}</div>}
      {days.length === 1 && day?.label && <p className="mb-6 text-center font-heading font-semibold text-site-fg">{day.label}</p>}
      <div className="mx-auto max-w-3xl space-y-3">
        {arr<D>(day?.items).map((s, i) => (
          <div key={i} className="flex gap-4 rounded-site border border-site-fg/10 bg-site-surface p-4">
            <div className="w-24 shrink-0 text-sm"><div className="font-semibold text-site-fg">{s.start}</div>{s.end && <div className="text-xs text-site-muted">{s.end}</div>}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><h3 className="font-heading font-semibold text-site-fg">{s.title}</h3>{s.track && <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", TRACKS[trackIdx(s.track)])}>{s.track}</span>}</div>
              {s.description && <p className="mt-0.5 text-sm text-site-muted">{s.description}</p>}
              {s.venue && s.venue !== "-" && <p className="mt-1 flex items-center gap-1 text-xs text-site-muted"><MapPin size={12} />{s.venue}</p>}
            </div>
          </div>
        ))}
        {arr<D>(day?.items).length === 0 && <p className="text-center text-site-muted">Schedule coming soon.</p>}
      </div>
    </Wrap>
  );
}

// ------------------------------------------------------------------ Speakers
function Speakers({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  const groups: Record<string, D[]> = {};
  arr<D>(d.people).forEach((p) => { const k = p.category || "Guests"; (groups[k] ??= []).push(p); });
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      <div className="space-y-12">
        {Object.entries(groups).map(([g, list]) => (
          <div key={g}>
            <h3 className="mb-5 text-center font-heading text-sm font-bold uppercase tracking-widest text-site-muted">{g}</h3>
            <div className="flex flex-wrap justify-center gap-5">
              {list.map((p, i) => (
                <div key={i} className="w-44 text-center sm:w-48">
                  <Img src={p.photo} alt={p.name} className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-site-primary/20 sm:h-36 sm:w-36" />
                  <h4 className="mt-3 font-heading text-sm font-bold text-site-fg">{p.name}</h4>
                  <p className="text-xs text-site-muted">{p.title}</p>
                  {p.organization && <p className="text-xs font-medium text-site-primary">{p.organization}</p>}
                  {p.topic && <p className="mt-1 text-xs italic text-site-muted">“{p.topic}”</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

// ------------------------------------------------------------------ Workshop
function Workshop({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  return (
    <Wrap id={id} alt={alt}>
      <div className="overflow-hidden rounded-site border border-site-fg/10 bg-site-surface shadow-lg lg:grid lg:grid-cols-2">
        <Img src={d.image} alt={d.title} className="h-64 w-full object-cover lg:h-full" />
        <div className="p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-site-primary">{d.kicker}</p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-site-fg sm:text-3xl">{d.title}</h2>
          <p className="mt-3 text-site-muted">{d.description}</p>
          <div className="mt-5 flex items-center gap-3"><Img src={d.speakerPhoto} alt={d.speakerName} className="h-12 w-12 rounded-full object-cover" /><div><p className="font-semibold text-site-fg">{d.speakerName}</p><p className="text-xs text-site-muted">{d.speakerTitle}</p></div></div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-site-muted">
            {d.date && <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{d.date}</span>}{d.time && <span className="inline-flex items-center gap-1.5"><Clock size={14} />{d.time}</span>}{d.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{d.location}</span>}
          </div>
          <ul className="mt-5 space-y-1.5">{arr<string>(d.points).map((p, i) => <li key={i} className="flex gap-2 text-sm text-site-fg"><Check size={16} className="mt-0.5 shrink-0 text-site-primary" />{p}</li>)}</ul>
          {d.ctaLabel && <div className="mt-6"><Btn href={d.ctaLink}>{d.ctaLabel}</Btn></div>}
        </div>
      </div>
    </Wrap>
  );
}

// ------------------------------------------------------------------ Sponsors / Partners
const LogoTile = ({ l }: { l: D }) => {
  const inner = <div className="flex h-24 items-center justify-center rounded-site border border-site-fg/10 bg-white p-3 shadow-sm transition hover:shadow-md"><Img src={l.logo} alt={l.name} className="max-h-full max-w-full object-contain" /></div>;
  return l.url ? <SLink href={l.url}>{inner}</SLink> : inner;
};
function Sponsors({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      <div className="space-y-10">
        {arr<D>(d.tiers).map((t, i) => (
          <div key={i}>
            <div className="mb-4 text-center"><h3 className="font-heading text-lg font-bold text-site-fg">{t.name}</h3>{t.blurb && <p className="text-sm text-site-muted">{t.blurb}</p>}</div>
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{arr<D>(t.logos).map((l, j) => <LogoTile key={j} l={l} />)}</div>
          </div>
        ))}
      </div>
      {(d.ctaLabel || d.reach) && (
        <div className="mx-auto mt-10 max-w-3xl rounded-site bg-gradient-to-r from-site-primary/15 to-site-secondary/15 p-6 text-center ring-1 ring-site-fg/10">
          {d.reach && <p className="mb-3 font-heading font-semibold text-site-fg">Reach: {d.reach}</p>}
          {d.ctaLabel && <Btn href={d.ctaLink}>{d.ctaLabel}</Btn>}
        </div>
      )}
    </Wrap>
  );
}
function Partners({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{arr<D>(d.logos).map((l, i) => <LogoTile key={i} l={l} />)}</div>
    </Wrap>
  );
}

// ------------------------------------------------------------------ Venue
function Venue({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  const embedOk = typeof d.mapEmbed === "string" && d.mapEmbed.startsWith("https://www.google.com/maps/embed");
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-heading text-2xl font-bold text-site-fg">{d.name}</h3>
          <p className="mt-1 flex items-start gap-2 text-site-muted"><MapPin size={18} className="mt-0.5 shrink-0 text-site-primary" /><span>{d.line1}<br />{d.line2}</span></p>
          <p className="mt-4 text-site-muted">{d.description}</p>
          {arr<string>(d.facilities).length > 0 && <div className="mt-4 flex flex-wrap gap-2">{arr<string>(d.facilities).map((f, i) => <span key={i} className="rounded-full bg-site-primary/10 px-3 py-1 text-xs font-semibold text-site-primary">{f}</span>)}</div>}
          {arr<string>(d.directions).length > 0 && <ol className="mt-5 list-decimal space-y-1 pl-5 text-sm text-site-muted">{arr<string>(d.directions).map((x, i) => <li key={i}>{x}</li>)}</ol>}
          {d.mapLink && <div className="mt-6"><Btn href={d.mapLink}>Open in Maps <ExternalLink size={14} /></Btn></div>}
        </div>
        {embedOk ? <iframe src={d.mapEmbed} title="Map" className="h-80 w-full rounded-site border-0 shadow-lg lg:h-full" loading="lazy" /> : <Img src={d.image} alt={d.name} className="h-80 w-full rounded-site object-cover shadow-lg lg:h-full" />}
      </div>
    </Wrap>
  );
}

// ------------------------------------------------------------------ Previous / Gallery / FAQ / Contact / CTA
function Previous({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {arr<D>(d.editions).map((e, i) => (
          <article key={i} className="overflow-hidden rounded-site border border-site-fg/10 bg-site-surface shadow-sm">
            <Img src={e.image} alt={e.title} className="aspect-[16/10] w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between"><h3 className="font-heading font-bold text-site-fg">{e.title}</h3><span className="text-xs font-semibold text-site-primary">{e.year}</span></div>
              <p className="text-xs text-site-muted">{e.date}</p>
              <p className="mt-2 text-sm text-site-muted">{e.description}</p>
              <div className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
                {[["Participants", e.participants], ["Speakers", e.speakers], ["Sessions", e.sessions]].map(([l, v]) => <div key={l as string} className="rounded bg-site-bg2 py-1.5"><div className="font-bold text-site-fg">{v}</div><div className="text-[10px] text-site-muted">{l}</div></div>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Wrap>
  );
}

function Gallery({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  const [open, setOpen] = useState<D | null>(null);
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {arr<D>(d.images).map((g, i) => (
          <button key={i} onClick={() => setOpen(g)} className="group relative aspect-[4/3] overflow-hidden rounded-site">
            <Img src={g.image} alt={g.caption || "Gallery"} className="h-full w-full object-cover transition group-hover:scale-105" />
            {g.caption && <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-xs font-medium text-white">{g.caption}</span>}
          </button>
        ))}
      </div>
      {open && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4" onClick={() => setOpen(null)}><Img src={open.image} alt={open.caption} className="max-h-[85vh] max-w-full rounded-lg" /></div>}
    </Wrap>
  );
}

function Faq({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      <div className="mx-auto max-w-3xl space-y-3">
        {arr<D>(d.items).map((q, i) => (
          <details key={i} className="group rounded-site border border-site-fg/10 bg-site-surface p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading font-semibold text-site-fg">{q.q}<ChevronDown size={18} className="shrink-0 transition group-open:rotate-180" /></summary>
            <p className="mt-2 text-sm text-site-muted">{q.a}</p>
          </details>
        ))}
      </div>
    </Wrap>
  );
}

function Contact({ d, id, alt }: { d: D; id: string; alt: boolean }) {
  const items = [[Mail, "Email", d.email, d.email ? `mailto:${d.email}` : ""], [Phone, "Phone", d.phone, d.phone ? `tel:${d.phone}` : ""], [MapPin, "Address", d.address, ""], [Clock, "Hours", d.hours, ""]] as const;
  return (
    <Wrap id={id} alt={alt}>
      <Head kicker={d.kicker} heading={d.heading} subtitle={d.subtitle} />
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {items.filter(([, , v]) => v).map(([Icon, label, v, href]) => (
          <div key={label} className="flex items-start gap-3 rounded-site border border-site-fg/10 bg-site-surface p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-site-primary/15 text-site-primary"><Icon size={18} /></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-site-muted">{label}</p>{href ? <SLink href={href} className="font-medium text-site-fg hover:text-site-primary">{v}</SLink> : <p className="font-medium text-site-fg">{v}</p>}</div>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

function Cta({ d, id }: { d: D; id: string }) {
  return (
    <section id={id} className="scroll-mt-16 bg-site-bg py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-site bg-gradient-to-r from-site-primary to-site-secondary p-8 text-center shadow-xl sm:p-12">
          <h2 className="font-heading text-3xl font-bold text-white">{d.heading}</h2>
          {d.text && <p className="mx-auto mt-3 max-w-xl text-white/85">{d.text}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {d.buttonLabel && <SLink href={d.buttonLink} className="rounded-site bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow hover:opacity-90">{d.buttonLabel}</SLink>}
            {d.secondaryLabel && <SLink href={d.secondaryLink} className="rounded-site px-6 py-3 text-sm font-bold text-white ring-1 ring-white/60 hover:bg-white/10">{d.secondaryLabel}</SLink>}
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ Renderer
export function SectionRenderer({ section, id, alt }: { section: Section; id: string; alt: boolean }) {
  const d = section.data;
  switch (section.type) {
    case "hero": return <Hero d={d} id={id} />;
    case "about": return <About d={d} id={id} alt={alt} />;
    case "text": return <TextBlock d={d} id={id} alt={alt} />;
    case "events": return <Events d={d} id={id} alt={alt} />;
    case "schedule": return <Schedule d={d} id={id} alt={alt} />;
    case "speakers": return <Speakers d={d} id={id} alt={alt} />;
    case "workshop": return <Workshop d={d} id={id} alt={alt} />;
    case "sponsors": return <Sponsors d={d} id={id} alt={alt} />;
    case "partners": return <Partners d={d} id={id} alt={alt} />;
    case "venue": return <Venue d={d} id={id} alt={alt} />;
    case "previous": return <Previous d={d} id={id} alt={alt} />;
    case "gallery": return <Gallery d={d} id={id} alt={alt} />;
    case "faq": return <Faq d={d} id={id} alt={alt} />;
    case "contact": return <Contact d={d} id={id} alt={alt} />;
    case "cta": return <Cta d={d} id={id} />;
    default: return null;
  }
}
