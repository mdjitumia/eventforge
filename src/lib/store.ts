"use client";
import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "./supabase";
import type { AuditEntry, DB, Org, Registration, Snapshot } from "./types";

/**
 * Supabase-backed store. Same hook names as the old mock (useDB, useCurrentOrg, ...),
 * so pages need almost no change. Writes live in api.ts.
 */
export interface LiveOrg { id: string; slug: string; name: string }
interface Store { ready: boolean; db: DB; pub: Record<string, Org | null>; live: LiveOrg[] }

const NO_SNAPSHOT = {} as Snapshot;
const EMPTY_DB: DB = { orgs: [], audit: [], session: null };
const SERVER: Store = { ready: false, db: EMPTY_DB, pub: {}, live: [] };

let store: Store = SERVER;
let started = false;
const listeners = new Set<() => void>();

function set(patch: Partial<Store>) {
  store = { ...store, ...patch };
  listeners.forEach((l) => l());
}
export const getStore = () => store;

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  // do not call supabase inside this callback directly (can deadlock), so use setTimeout
  supabase.auth.onAuthStateChange(() => { setTimeout(() => { void refresh(); }, 0); });
  void refresh();
}
function subscribe(cb: () => void) {
  start();
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
const useStore = () => useSyncExternalStore(subscribe, getStore, () => SERVER);

// ---------------------------------------------------------------- helpers
function ok(r: { data: any; error: { message: string } | null }): any {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

const mapReg = (r: any): Registration => ({
  id: r.id, eventId: r.event_id, eventTitle: r.event_title, teamName: r.team_name, members: r.members,
  paymentMethod: r.payment_method, senderNumber: r.sender_number, txnId: r.txn_id, amount: r.amount,
  status: r.status, createdAt: r.created_at,
});

const mapAudit = (a: any): AuditEntry => ({
  id: a.id, at: a.at, actor: a.actor, orgId: a.org_id ?? undefined, orgName: a.org_name ?? undefined,
  action: a.action, detail: a.detail,
});

// ---------------------------------------------------------------- loading
async function loadOrgAdmin(uid: string): Promise<DB> {
  const o = ok(await supabase.from("organizations").select("*").eq("owner_id", uid).maybeSingle());
  if (!o) return EMPTY_DB;
  const [d, m, r] = await Promise.all([
    supabase.from("org_drafts").select("draft").eq("org_id", o.id).single(),
    supabase.from("org_members").select("name,email").eq("org_id", o.id).eq("role", "owner").single(),
    supabase.from("registrations").select("*").eq("org_id", o.id).order("created_at", { ascending: false }),
  ]);
  const draft = ok(d).draft as Snapshot;
  const owner = ok(m);
  const regs = (ok(r) as any[]).map(mapReg);
  const org: Org = {
    id: o.id, slug: o.slug, owner: { name: owner.name, email: owner.email }, plan: o.plan, status: o.status,
    createdAt: o.created_at, publishedAt: o.published_at ?? undefined, version: o.version, visits: o.visits,
    draft, published: o.published ?? undefined, registrations: regs,
  };
  return { orgs: [org], audit: [], session: { role: "org", orgId: org.id } };
}

/** Super admin only sees counts and status, never an organization's private content. */
async function loadSuper(): Promise<DB> {
  const [ov, au] = await Promise.all([
    supabase.rpc("admin_overview"),
    supabase.from("audit_logs").select("*").order("at", { ascending: false }).limit(400),
  ]);
  const stub = (n: number): any[] => Array.from({ length: n }, () => null);
  const orgs: Org[] = (ok(ov) as any[]).map((x) => ({
    id: x.id, slug: x.slug, owner: { name: x.owner_name ?? "", email: x.owner_email ?? "" }, plan: x.plan, status: x.status,
    createdAt: x.created_at, publishedAt: x.published_at ?? undefined, version: x.version, visits: x.visits,
    draft: { site: { branding: { orgName: x.org_name } }, events: stub(x.events_count) } as any,
    published: x.is_published ? ({} as Snapshot) : undefined,
    registrations: stub(x.registrations_count),
  }));
  return { orgs, audit: (ok(au) as any[]).map(mapAudit), session: { role: "super" } };
}

async function doRefresh() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    let db: DB = EMPTY_DB;
    if (session) {
      const adm = ok(await supabase.from("platform_admins").select("user_id").eq("user_id", session.user.id).maybeSingle());
      db = adm ? await loadSuper() : await loadOrgAdmin(session.user.id);
    }
    set({ ready: true, db });
  } catch (e) {
    console.error("refresh failed", e);
    set({ ready: true });
  }
}

// single-flight: parallel callers share one run; a call during a run triggers one more run after it
let inflight: Promise<void> | null = null;
let again = false;
export function refresh(): Promise<void> {
  if (inflight) { again = true; return inflight; }
  inflight = (async () => {
    do { again = false; await doRefresh(); } while (again);
  })().finally(() => { inflight = null; });
  return inflight;
}

/** Update one org in the cache after a successful write. */
export function patchOrg(id: string, fn: (o: Org) => Org) {
  set({ db: { ...store.db, orgs: store.db.orgs.map((o) => (o.id === id ? fn(o) : o)) } });
}

export async function loadPublicOrg(slug: string) {
  if (slug in store.pub) return;
  const r = await supabase.from("organizations")
    .select("id,slug,plan,status,version,visits,published,published_at,created_at")
    .eq("slug", slug.toLowerCase()).maybeSingle();
  const o = r.error ? null : r.data;
  const org: Org | null = o ? {
    id: o.id, slug: o.slug, owner: { name: "", email: "" }, plan: o.plan, status: o.status,
    createdAt: o.created_at, publishedAt: o.published_at ?? undefined, version: o.version, visits: o.visits,
    draft: o.published ?? NO_SNAPSHOT, published: o.published ?? undefined, registrations: [],
  } : null;
  set({ pub: { ...store.pub, [slug]: org } });
}

async function loadLive() {
  const r = await supabase.from("organizations").select("id,slug,org_name")
    .not("published", "is", null).eq("status", "active").order("visits", { ascending: false }).limit(6);
  if (!r.error) set({ live: (r.data as any[]).map((x) => ({ id: x.id, slug: x.slug, name: x.org_name })) });
}

// ---------------------------------------------------------------- hooks (same names as before)
export const useDB = () => useStore().db;
/** true once the first sign-in check has finished (replaces the old "hydrated" flag). */
export const useMounted = () => useStore().ready;
export const useSession = () => useStore().db.session;

export function useCurrentOrg(): Org | null {
  const { db } = useStore();
  if (db.session?.role !== "org") return null;
  const id = db.session.orgId;
  return db.orgs.find((o) => o.id === id) ?? null;
}

/** undefined = still loading, null = not found. */
export function useOrgBySlug(slug: string): Org | null | undefined {
  const s = useStore();
  useEffect(() => { void loadPublicOrg(slug); }, [slug]);
  return s.db.orgs.find((o) => o.slug === slug) ?? s.pub[slug];
}

export function useLiveOrgs(): LiveOrg[] {
  const s = useStore();
  useEffect(() => { void loadLive(); }, []);
  return s.live;
}