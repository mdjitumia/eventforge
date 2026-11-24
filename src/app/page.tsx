"use client";
import Link from "next/link";
import { ArrowRight, Eye, Globe, Layers, Palette, Rocket, ShieldCheck, Trophy } from "lucide-react";
import { useLiveOrgs, useMounted } from "@/lib/store";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/config";
import { Card } from "@/components/ui";

const features = [
  { icon: Palette, t: "Branding in a few clicks", d: "Logo, name, colors, fonts and corner style, all from simple forms." },
  { icon: Layers, t: "Every section editable", d: "Hero, schedule, speakers, sponsors, venue, FAQ and more. Show, hide, reorder or delete." },
  { icon: Trophy, t: "Events & registration", d: "Create competitions, collect team registrations and verify payments." },
  { icon: Eye, t: "Preview, then publish", d: "Work on a private draft. Publish when ready and get a shareable link." },
  { icon: ShieldCheck, t: "Separate workspaces", d: "Each organization only ever sees its own data." },
  { icon: Globe, t: "Your own link", d: "Every organization gets its own address for visitors and participants." },
];

export default function Home() {
  const live = useLiveOrgs();
  const mounted = useMounted();
  return (
    <div className="bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-slate-900"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white"><Rocket size={18} /></span>{PLATFORM_NAME}</Link>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link href="/login" className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100">Sign in</Link>
          <Link href="/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700">Create your site</Link>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <p className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-indigo-700">Event websites without code</p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">{PLATFORM_TAGLINE}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">Start from a complete, ready-made event website. Replace the sample content with yours, preview it, publish it and share the link. Manage events and registrations from your own admin panel.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700">Get started free <ArrowRight size={18} /></Link>
            {mounted && live[0] && <Link href={`/o/${live[0].slug}`} className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">See a live example</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">Everything an event organizer needs</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.t} className="p-6"><div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><f.icon size={22} /></div><h3 className="font-bold text-slate-900">{f.t}</h3><p className="mt-1 text-sm text-slate-600">{f.d}</p></Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {["Create your organization", "Customize the base website", "Preview and publish", "Share your link"].map((s, i) => (
              <div key={s} className="text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-indigo-600 text-lg font-bold text-white">{i + 1}</div><p className="font-semibold text-slate-800">{s}</p></div>
            ))}
          </div>
        </div>
      </section>

      {mounted && live.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">Live event sites</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((o) => (
              <Link key={o.id} href={`/o/${o.slug}`} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
                <p className="font-bold text-slate-900">{o.name}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">/o/{o.slug} <ArrowRight size={14} className="transition group-hover:translate-x-1" /></p>
              </Link>
            ))}
          </div>
        </section>
      )}

      
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} {PLATFORM_NAME} · <Link href="/super-admin/login" className="hover:underline">Platform admin</Link></footer>
    </div>
  );
}
