"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginOrg } from "@/lib/api";
import { Button, Card, Field, inputCls, useRun } from "@/components/ui";
import { PLATFORM_NAME } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const run = useRun();
  const [email, setEmail] = useState("admin@ndss.demo");
  const [password, setPassword] = useState("demo1234");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await run(async () => { await loginOrg(email, password); return true; });
    setBusy(false);
    if (ok) router.push("/dashboard");
  }
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 to-white p-4">
      <Card className="w-full max-w-md p-8">
        <Link href="/" className="text-sm font-bold text-indigo-600">{PLATFORM_NAME}</Link>
        <h1 className="mt-2 text-2xl font-bold">Organization sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your event website and registrations.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email"><input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
          <Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">New here? <Link href="/signup" className="font-semibold text-indigo-600">Create your organization</Link></p>
      </Card>
    </div>
  );
}
