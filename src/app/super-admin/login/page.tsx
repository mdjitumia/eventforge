"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { loginSuper } from "@/lib/api";
import { Button, Field, inputCls, useRun } from "@/components/ui";
import { PLATFORM_NAME } from "@/lib/config";

export default function SuperLogin() {
  const router = useRouter();
  const run = useRun();
  const [email, setEmail] = useState("admin@platform.dev");
  const [password, setPassword] = useState("super123");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await run(async () => { await loginSuper(email, password); return true; });
    setBusy(false);
    if (ok) router.push("/super-admin");
  }
  return (
    <div className="grid min-h-screen place-items-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-indigo-300"><ShieldCheck /></div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{PLATFORM_NAME} platform</p>
        <h1 className="mt-1 text-2xl font-bold">Super admin sign in</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email"><input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
          <Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500"><Link href="/" className="hover:underline">← Back to home</Link></p>
      </div>
    </div>
  );
}
