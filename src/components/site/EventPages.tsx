"use client";
import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Gift, MapPin, Plus, Trash2, Trophy, Users } from "lucide-react";
import type { Member, OrgEvent } from "@/lib/types";
import { submitRegistration } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Img, SLink, useSite } from "./ctx";
import { useRun } from "@/components/ui";

const Info = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) =>
  value ? (
    <div className="flex items-start gap-3 rounded-site border border-site-fg/10 bg-site-surface p-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-site-primary/15 text-site-primary"><Icon size={17} /></div>
      <div><p className="text-[11px] font-semibold uppercase tracking-wide text-site-muted">{label}</p><p className="text-sm font-medium text-site-fg">{value}</p></div>
    </div>
  ) : null;

export function EventDetail({ event: e }: { event: OrgEvent }) {
  return (
    <div className="bg-site-bg">
      <div className="relative isolate overflow-hidden">
        {e.banner ? <Img src={e.banner} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" /> : <div className="absolute inset-0 -z-20 bg-gradient-to-br from-site-primary to-site-secondary" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/60 to-site-bg" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6">
          <SLink href="#events" className="text-sm text-white/80 hover:text-white">← All events</SLink>
          {e.code && <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/70">{e.code}</p>}
          <h1 className="mt-1 max-w-3xl font-heading text-4xl font-extrabold text-white sm:text-5xl">{e.title}</h1>
          {e.tagline && <p className="mt-2 text-lg text-white/85">{e.tagline}</p>}
          <div className="mt-4 flex flex-wrap gap-2">{e.tags.map((t) => <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30">{t}</span>)}</div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <div><h2 className="font-heading text-xl font-bold text-site-fg">Overview</h2><p className="mt-2 text-site-muted">{e.description}</p>{e.about && <p className="mt-3 text-site-muted">{e.about}</p>}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={CalendarDays} label="Date" value={e.date} /><Info icon={Clock} label="Time" value={e.time} /><Info icon={MapPin} label="Location" value={e.location} />
            <Info icon={Users} label="Team size" value={e.teamSize} /><Info icon={Gift} label="Eligibility" value={e.eligibility} /><Info icon={Trophy} label="Prize pool" value={e.totalPrizePool !== "-" ? e.totalPrizePool : ""} />
          </div>
          {e.prizes.length > 0 && (
            <div><h2 className="font-heading text-xl font-bold text-site-fg">Prizes</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">{e.prizes.map((p, i) => <div key={i} className="rounded-site bg-gradient-to-br from-site-primary/15 to-site-secondary/15 p-4 text-center ring-1 ring-site-fg/10"><p className="text-xs font-semibold uppercase text-site-muted">{p.place}</p><p className="font-heading text-2xl font-bold text-site-fg">{p.amount}</p></div>)}</div>
            </div>
          )}
          {e.whyJoin.length > 0 && <div><h2 className="font-heading text-xl font-bold text-site-fg">Why join</h2><ul className="mt-3 space-y-2">{e.whyJoin.map((w, i) => <li key={i} className="flex gap-2 text-site-muted"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-site-primary" />{w}</li>)}</ul></div>}
          {e.process.length > 0 && (
            <div><h2 className="font-heading text-xl font-bold text-site-fg">How it works</h2>
              <ol className="mt-3 space-y-3">{e.process.map((p, i) => <li key={i} className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-site-primary text-sm font-bold text-site-ink">{i + 1}</span><div><p className="font-semibold text-site-fg">{p.title}</p><p className="text-sm text-site-muted">{p.detail}</p></div></li>)}</ol>
            </div>
          )}
          {e.resources.length > 0 && <div><h2 className="font-heading text-xl font-bold text-site-fg">Resources</h2><div className="mt-3 flex flex-wrap gap-2">{e.resources.map((r, i) => <SLink key={i} href={r.url} className="rounded-site border border-site-fg/15 px-3 py-2 text-sm font-medium text-site-fg hover:bg-site-fg/5">{r.label}</SLink>)}</div></div>}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-site border border-site-fg/10 bg-site-surface p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-site-muted">Registration fee</p>
            <p className="font-heading text-2xl font-bold text-site-fg">{e.feeAmount > 0 ? e.registrationFee : "Free"}</p>
            {e.perks.length > 0 && <ul className="mt-3 space-y-1 text-sm text-site-muted">{e.perks.map((p, i) => <li key={i} className="flex gap-2"><Gift size={14} className="mt-1 shrink-0 text-site-accent" />{p}</li>)}</ul>}
            <div className="mt-5">
              {e.registrationOpen ? <SLink href={`/register/${e.slug}`} className="block rounded-site bg-site-primary py-3 text-center text-sm font-bold text-site-ink hover:opacity-90">Register now</SLink> : <p className="rounded-site bg-site-fg/10 py-3 text-center text-sm font-semibold text-site-muted">Registration closed</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const blankMember = (): Member => ({ name: "", email: "", phone: "", institution: "", studentId: "" });
const inp = "w-full rounded-site border border-site-fg/20 bg-site-bg px-3 py-2 text-sm text-site-fg placeholder:text-site-muted/60 focus:border-site-primary focus:outline-none focus:ring-2 focus:ring-site-primary/30";
const Lbl = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-site-muted">{t}</span>{children}</label>;

export function RegisterForm({ event: e }: { event: OrgEvent }) {
  const { slug, preview } = useSite();
  const run = useRun();
  const [team, setTeam] = useState("");
  const [members, setMembers] = useState<Member[]>([blankMember()]);
  const [method, setMethod] = useState("bkash");
  const [sender, setSender] = useState("");
  const [txn, setTxn] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const setM = (i: number, k: keyof Member, v: string) => setMembers(members.map((m, j) => (j === i ? { ...m, [k]: v } : m)));

  if (preview) return <div className="rounded-site border border-site-fg/10 bg-site-surface p-8 text-center text-site-muted">Registration is disabled in draft preview. Publish the site to test it.</div>;
  if (!e.registrationOpen) return <div className="rounded-site border border-site-fg/10 bg-site-surface p-8 text-center text-site-muted">Registration for this event is closed.</div>;
  if (done) {
    return (
      <div className="rounded-site border border-site-primary/40 bg-site-surface p-8 text-center shadow-lg">
        <CheckCircle2 size={44} className="mx-auto text-site-primary" />
        <h2 className="mt-3 font-heading text-2xl font-bold text-site-fg">Registration received</h2>
        <p className="mt-1 text-site-muted">Your registration ID is <span className="font-mono font-semibold text-site-fg">{done}</span>. The organizers will verify it and contact you by email.</p>
        <div className="mt-5"><SLink href={`/events/${e.slug}`} className="rounded-site bg-site-primary px-5 py-2.5 text-sm font-semibold text-site-ink">Back to event</SLink></div>
      </div>
    );
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setBusy(true);
    const id = await run(() => submitRegistration(slug, e.id, { teamName: team, members, paymentMethod: method, senderNumber: sender, txnId: txn }));
    setBusy(false);
    if (id) setDone(id);
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-site border border-site-fg/10 bg-site-surface p-5 shadow-lg sm:p-8">
      {e.maxMembers > 1 && <Lbl t="Team name"><input className={inp} value={team} onChange={(x) => setTeam(x.target.value)} placeholder="e.g. Byte Benders" required /></Lbl>}
      {members.map((m, i) => (
        <fieldset key={i} className="rounded-site border border-site-fg/10 p-4">
          <legend className="px-2 text-sm font-bold text-site-fg">{i === 0 ? (e.maxMembers > 1 ? "Team leader" : "Your details") : `Member ${i + 1}`}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Lbl t="Full name"><input className={inp} value={m.name} onChange={(x) => setM(i, "name", x.target.value)} required /></Lbl>
            <Lbl t="Email"><input type="email" className={inp} value={m.email} onChange={(x) => setM(i, "email", x.target.value)} required /></Lbl>
            <Lbl t="Phone"><input className={inp} value={m.phone} onChange={(x) => setM(i, "phone", x.target.value)} required /></Lbl>
            <Lbl t="Institution"><input className={inp} value={m.institution} onChange={(x) => setM(i, "institution", x.target.value)} /></Lbl>
            <Lbl t="Student ID"><input className={inp} value={m.studentId} onChange={(x) => setM(i, "studentId", x.target.value)} /></Lbl>
          </div>
          {i > 0 && <button type="button" onClick={() => setMembers(members.filter((_, j) => j !== i))} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-red-500"><Trash2 size={13} /> Remove member</button>}
        </fieldset>
      ))}
      {members.length < e.maxMembers && <button type="button" onClick={() => setMembers([...members, blankMember()])} className="inline-flex items-center gap-1.5 rounded-site border border-dashed border-site-fg/30 px-4 py-2 text-sm font-medium text-site-fg hover:bg-site-fg/5"><Plus size={15} /> Add team member ({members.length}/{e.maxMembers})</button>}
      {e.feeAmount > 0 && (
        <fieldset className="rounded-site border border-site-fg/10 p-4">
          <legend className="px-2 text-sm font-bold text-site-fg">Payment · {e.registrationFee}</legend>
          <p className="mb-3 text-xs text-site-muted">Send the fee with your preferred mobile banking service and enter the transaction details. The organizers verify it manually.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Lbl t="Method"><select className={inp} value={method} onChange={(x) => setMethod(x.target.value)}><option value="bkash">bKash</option><option value="rocket">Rocket</option><option value="nagad">Nagad</option></select></Lbl>
            <Lbl t="Sender number"><input className={inp} value={sender} onChange={(x) => setSender(x.target.value)} required /></Lbl>
            <Lbl t="Transaction ID"><input className={inp} value={txn} onChange={(x) => setTxn(x.target.value)} required /></Lbl>
          </div>
        </fieldset>
      )}
      <button disabled={busy} className={cn("w-full rounded-site bg-site-primary py-3 text-sm font-bold text-site-ink transition hover:opacity-90", busy && "opacity-60")}>{busy ? "Submitting…" : "Submit registration"}</button>
    </form>
  );
}
