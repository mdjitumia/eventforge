"use client";
import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useCurrentOrg, useMounted, useSession } from "@/lib/store";
import { logout } from "@/lib/api";
import { PLATFORM_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui";

export interface NavItem { href: string; label: string; icon: LucideIcon; exact?: boolean }

/** Client-side route guard. (The real backend must enforce the same rule on the server.) */
export function Guard({ role, children }: { role: "super" | "org"; children: ReactNode }) {
  const mounted = useMounted();
  const session = useSession();
  const org = useCurrentOrg();
  const router = useRouter();
  const ok = role === "super" ? session?.role === "super" : session?.role === "org" && !!org && org.status === "active";
  useEffect(() => {
    if (!mounted) return;
    if (!ok) router.replace(role === "super" ? "/super-admin/login" : "/login");
  }, [mounted, ok, role, router]);
  if (!mounted || !ok) return <Spinner />;
  return <>{children}</>;
}

export function PanelShell({ nav, title, subtitle, children, accent = "indigo" }: { nav: NavItem[]; title: string; subtitle: string; children: ReactNode; accent?: "indigo" | "slate" }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dark = accent === "slate";
  const side = (
    <div className={cn("flex h-full flex-col", dark ? "bg-slate-900 text-slate-300" : "bg-white text-slate-600 border-r border-slate-200")}>
      <div className={cn("px-5 py-5", dark ? "border-b border-slate-800" : "border-b border-slate-200")}>
        <p className={cn("text-xs font-semibold uppercase tracking-widest", dark ? "text-indigo-300" : "text-indigo-600")}>{PLATFORM_NAME}</p>
        <p className={cn("mt-1 truncate font-bold", dark ? "text-white" : "text-slate-900")}>{title}</p>
        <p className="truncate text-xs text-slate-400">{subtitle}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((n) => {
          const active = n.exact ? path === n.href : path === n.href || path.startsWith(n.href + "/");
          return (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition", active ? (dark ? "bg-indigo-500/20 text-white" : "bg-indigo-50 text-indigo-700") : dark ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
              <n.icon size={18} />{n.label}
            </Link>
          );
        })}
      </nav>
      <div className={cn("p-3", dark ? "border-t border-slate-800" : "border-t border-slate-200")}>
        <button onClick={async () => { await logout(); router.replace("/"); }} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium", dark ? "hover:bg-slate-800" : "hover:bg-slate-100")}><LogOut size={18} /> Sign out</button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block"><div className="sticky top-0 h-screen">{side}</div></aside>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <p className="font-bold">{title}</p>
        <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64"><button className="absolute right-2 top-2 z-10 rounded bg-white/90 p-1" onClick={() => setOpen(false)}><X size={18} /></button>{side}</div>
        </div>
      )}
      <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
