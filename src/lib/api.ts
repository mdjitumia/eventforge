/**
 * API layer (Supabase). Same function names as the mock. The browser never sends an
 * organization id for writes: the database finds it from the signed-in user (RLS + RPC).
 */
import { supabase } from "./supabase";
import { baseTemplate, DEFAULT_THEME } from "./seed";
import { SECTION_META } from "./schemas";
import { PLAN_LIMITS } from "./types";
import type { Branding, FooterConfig, Member, Org, OrgEvent, Plan, Registration, Section, SectionType, Snapshot } from "./types";
import { compressImage, slugify, uid, validateSlug } from "./utils";
import { getStore, patchOrg, refresh } from "./store";

const fail = (m: string): never => { throw new Error(m); };

function unwrap(r: { data: any; error: { message: string } | null }): any {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

function activeOrg(): Org {
  const { db } = getStore();
  const s = db.session;
  const org = s?.role === "org" ? db.orgs.find((o) => o.id === s.orgId) : undefined;
  if (!org) return fail("Please sign in again.");
  if (org.status === "suspended") return fail("This organization is suspended.");
  return org;
}

/** Change the draft locally, validate on the server (save_draft), then update the cache. */
async function editDraft<T>(fn: (d: Snapshot, org: Org) => T): Promise<T> {
  const org = activeOrg();
  const d = structuredClone(org.draft);
  const out = fn(d, org);
  unwrap(await supabase.rpc("save_draft", { p_draft: d }));
  patchOrg(org.id, (o) => ({ ...o, draft: d }));
  return out;
}

// ---------------------------------------------------------------- auth
export async function signupOrg(i: { orgName: string; slug: string; ownerName: string; email: string; password: string }) {
  const email = i.email.trim().toLowerCase();
  const slug = i.slug.trim().toLowerCase();
  if (i.orgName.trim().length < 3) fail("Organization name must be at least 3 characters.");
  const slugErr = validateSlug(slug); if (slugErr) fail(slugErr!);
  if (!/^\S+@\S+\.\S+$/.test(email)) fail("Enter a valid email address.");
  if (i.password.length < 8) fail("Password must be at least 8 characters.");

  const free = unwrap(await supabase.rpc("is_slug_available", { p_slug: slug }));
  if (!free) fail("This site address is already taken.");

  const { data, error } = await supabase.auth.signUp({ email, password: i.password });
  if (error) fail(error.message);
  if (!data.session) fail("Email confirmation is ON in Supabase. Turn off 'Confirm email' (Authentication > Providers > Email) while developing.");

  unwrap(await supabase.rpc("create_organization", {
    p_org_name: i.orgName.trim(), p_slug: slug, p_owner_name: i.ownerName.trim(), p_draft: baseTemplate(i.orgName.trim()),
  }));
  await refresh();
}

export async function loginOrg(emailIn: string, password: string) {
  const email = emailIn.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) fail("Wrong email or password.");
  await refresh();
  const { db } = getStore();
  const s = db.session;
  if (s?.role !== "org") {
    await supabase.auth.signOut(); await refresh();
    return fail("No organization is linked to this account.");
  }
  if (db.orgs.find((o) => o.id === s.orgId)?.status === "suspended") {
    await supabase.auth.signOut(); await refresh();
    return fail("This organization has been suspended. Please contact platform support.");
  }
  await supabase.rpc("log_login");
}

export async function loginSuper(emailIn: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: emailIn.trim().toLowerCase(), password });
  if (error) fail("Wrong email or password.");
  await refresh();
  if (getStore().db.session?.role !== "super") {
    await supabase.auth.signOut(); await refresh();
    return fail("Wrong email or password.");
  }
  await supabase.rpc("log_login");
}

export async function logout() {
  await supabase.auth.signOut();
  await refresh();
}

// ---------------------------------------------------------------- branding & site (draft)
export async function updateBranding(patch: Partial<Branding>) {
  await editDraft((d) => { d.site.branding = { ...d.site.branding, ...patch }; });
}

export async function updateTheme(patch: Partial<Branding["theme"]>) {
  await editDraft((d) => { d.site.branding.theme = { ...d.site.branding.theme, ...patch }; });
}

export async function updateSection(id: string, patch: Partial<Pick<Section, "data" | "visible" | "navLabel">>, markEdited = true) {
  await editDraft((d) => {
    const s = d.site.sections.find((x) => x.id === id) ?? fail("Section not found.");
    if (patch.data !== undefined) s.data = patch.data;
    if (patch.visible !== undefined) s.visible = patch.visible;
    if (patch.navLabel !== undefined) s.navLabel = patch.navLabel;
    if (markEdited && patch.data !== undefined) s.isSample = false;
  });
}

export async function moveSection(id: string, dir: -1 | 1) {
  await editDraft((d) => {
    const a = d.site.sections;
    const i = a.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
  });
}

export async function addSection(type: SectionType): Promise<string> {
  return editDraft((d) => {
    const meta = SECTION_META[type];
    const s: Section = { id: uid("sec"), type, visible: true, isSample: false, navLabel: meta.defaultNav, data: meta.blank() };
    const contactIdx = d.site.sections.findIndex((x) => x.type === "contact");
    if (contactIdx >= 0) d.site.sections.splice(contactIdx, 0, s); else d.site.sections.push(s);
    return s.id;
  });
}

export async function deleteSection(id: string) {
  await editDraft((d) => { d.site.sections = d.site.sections.filter((s) => s.id !== id); });
}

export async function updateFooter(patch: Partial<FooterConfig>) {
  await editDraft((d) => { d.site.footer = { ...d.site.footer, ...patch }; });
}

export async function updateSeo(patch: Partial<{ title: string; description: string }>) {
  await editDraft((d) => { d.site.seo = { ...d.site.seo, ...patch }; });
}

// ---------------------------------------------------------------- events (draft)
export const blankEvent = (title = "New Event"): OrgEvent => ({
  id: uid("evt"), slug: slugify(title) || "event", code: "", title, tagline: "", description: "", about: "", banner: "", date: "", time: "", location: "",
  startDate: "", tags: [], registrationFee: "Free", feeAmount: 0, prizes: [], totalPrizePool: "-", eligibility: "", teamSize: "Individual", maxMembers: 1,
  perks: [], whyJoin: [], process: [], resources: [], registrationOpen: true, featured: false, isSample: false,
});

function uniqueSlug(events: OrgEvent[], base: string, selfId?: string) {
  let s = slugify(base) || "event", n = 2;
  while (events.some((e) => e.slug === s && e.id !== selfId)) s = `${slugify(base) || "event"}-${n++}`;
  return s;
}

export async function createEvent(title = "New Event"): Promise<string> {
  return editDraft((d, o) => {
    const limit = PLAN_LIMITS[o.plan].events;
    if (d.events.length >= limit) fail(`Your ${PLAN_LIMITS[o.plan].label} plan allows ${limit} events. Ask the platform owner to upgrade your plan.`);
    const e = blankEvent(title);
    e.slug = uniqueSlug(d.events, title);
    d.events.push(e);
    return e.id;
  });
}

export async function duplicateEvent(id: string): Promise<string> {
  return editDraft((d, o) => {
    const src = d.events.find((e) => e.id === id) ?? fail("Event not found.");
    const limit = PLAN_LIMITS[o.plan].events;
    if (d.events.length >= limit) fail(`Your plan allows ${limit} events.`);
    const copy: OrgEvent = { ...structuredClone(src), id: uid("evt"), title: `${src.title} (copy)`, isSample: false };
    copy.slug = uniqueSlug(d.events, copy.title);
    d.events.push(copy);
    return copy.id;
  });
}

export async function updateEvent(id: string, next: OrgEvent) {
  await editDraft((d) => {
    const i = d.events.findIndex((e) => e.id === id);
    if (i < 0) fail("Event not found.");
    if (!next.title.trim()) fail("Event title is required.");
    next.slug = uniqueSlug(d.events, next.slug || next.title, id);
    next.isSample = false;
    next.maxMembers = Math.max(1, Math.min(10, Number(next.maxMembers) || 1));
    next.feeAmount = Math.max(0, Number(next.feeAmount) || 0);
    d.events[i] = next;
  });
}

export async function deleteEvent(id: string) {
  await editDraft((d) => { d.events = d.events.filter((e) => e.id !== id); });
}

// ---------------------------------------------------------------- publish
export async function publishSite() {
  activeOrg();
  unwrap(await supabase.rpc("publish_site"));
  await refresh();
}

export async function unpublishSite() {
  activeOrg();
  unwrap(await supabase.rpc("unpublish_site"));
  await refresh();
}

export async function changeSlug(slugIn: string) {
  const slug = slugIn.trim().toLowerCase();
  const err = validateSlug(slug); if (err) fail(err!);
  activeOrg();
  unwrap(await supabase.rpc("change_slug", { p_slug: slug }));
  await refresh();
}

// ---------------------------------------------------------------- registrations
/** Public (visitors). All rules are enforced inside the database function submit_registration. */
export async function submitRegistration(slug: string, eventId: string, input: { teamName: string; members: Member[]; paymentMethod: string; senderNumber: string; txnId: string }): Promise<string> {
  return unwrap(await supabase.rpc("submit_registration", {
    p_slug: slug, p_event_id: eventId, p_team_name: input.teamName, p_members: input.members,
    p_payment_method: input.paymentMethod, p_sender_number: input.senderNumber, p_txn_id: input.txnId,
  })) as string;
}

export async function setRegistrationStatus(id: string, status: Registration["status"]) {
  const org = activeOrg();
  const r = await supabase.from("registrations").update({ status }).eq("id", id).eq("org_id", org.id).select("id");
  if (r.error) throw new Error(r.error.message);
  if (!r.data?.length) fail("Registration not found.");
  patchOrg(org.id, (o) => ({ ...o, registrations: o.registrations.map((x) => (x.id === id ? { ...x, status } : x)) }));
}

export async function deleteRegistration(id: string) {
  const org = activeOrg();
  const r = await supabase.from("registrations").delete().eq("id", id).eq("org_id", org.id).select("id");
  if (r.error) throw new Error(r.error.message);
  if (!r.data?.length) fail("Registration not found.");
  patchOrg(org.id, (o) => ({ ...o, registrations: o.registrations.filter((x) => x.id !== id) }));
}

export function trackVisit(slug: string) {
  const key = `eventforge.visit.${slug}`;
  if (typeof window === "undefined" || sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  void Promise.resolve(supabase.rpc("track_visit", { p_slug: slug })).catch(() => { /* ignore */ });
}

// ---------------------------------------------------------------- images (Supabase Storage)
export async function uploadImage(file: File): Promise<string> {
  const org = activeOrg();
  const blob = await compressImage(file);
  const ext = blob.type === "image/png" ? "png" : "jpg";
  const path = `${org.id}/${crypto.randomUUID()}.${ext}`;
  const up = await supabase.storage.from("media").upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
  if (up.error) fail(up.error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

// ---------------------------------------------------------------- super admin
export async function setOrgStatus(orgId: string, status: Org["status"]) {
  unwrap(await supabase.rpc("admin_set_status", { p_org: orgId, p_status: status }));
  await refresh();
}

export async function setOrgPlan(orgId: string, plan: Plan) {
  unwrap(await supabase.rpc("admin_set_plan", { p_org: orgId, p_plan: plan }));
  await refresh();
}

export async function deleteOrg(orgId: string) {
  unwrap(await supabase.rpc("admin_delete_org", { p_org: orgId }));
  await refresh();
}

export { DEFAULT_THEME };