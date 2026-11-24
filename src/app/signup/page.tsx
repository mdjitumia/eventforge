"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupOrg } from "@/lib/api";
import { Button, Card, Field, inputCls, useRun } from "@/components/ui";
import { PLATFORM_NAME } from "@/lib/config";
import { slugify, validateSlug } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const run = useRun();
  const [f, setF] = useState({ orgName: "", slug: "", ownerName: "", email: "", password: "" });
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const slugErr = f.slug ? validateSlug(f.slug) : null;
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v, ...(k === "orgName" && !slugTouched ? { slug: slugify(v) } : {}) }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await run(async () => { await signupOrg(f); return true; });
    setBusy(false);
    if (ok) router.push("/dashboard");
  }
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 to-white p-4">
      <Card className="w-full max-w-lg p-8">
        <Link href="/" className="text-sm font-bold text-indigo-600">{PLATFORM_NAME}</Link>
        <h1 className="mt-2 text-2xl font-bold">Create your organization</h1>
        <p className="mt-1 text-sm text-slate-500">You get a complete base event website with sample content, ready to customize.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Organization / event name"><input className={inputCls} value={f.orgName} onChange={(e) => set("orgName", e.target.value)} placeholder="e.g. Tech Innovators Club" required /></Field>
          <Field label="Your site address" help={slugErr ?? undefined}>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
              <span className="pl-3 text-sm text-slate-400">/o/</span>
              <input className="w-full rounded-lg bg-transparent px-1 py-2 text-sm focus:outline-none" value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }} required />
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name"><input className={inputCls} value={f.ownerName} onChange={(e) => set("ownerName", e.target.value)} required /></Field>
            <Field label="Email"><input className={inputCls} type="email" value={f.email} onChange={(e) => set("email", e.target.value)} required /></Field>
          </div>
          <Field label="Password" help="At least 8 characters."><input className={inputCls} type="password" value={f.password} onChange={(e) => set("password", e.target.value)} required minLength={8} /></Field>
          <Button className="w-full" disabled={busy || !!slugErr}>{busy ? "Creating…" : "Create organization"}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-semibold text-indigo-600">Sign in</Link></p>
      </Card>
    </div>
  );
}
