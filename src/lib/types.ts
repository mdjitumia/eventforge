export type Plan = "free" | "pro" | "enterprise";

export const PLAN_LIMITS: Record<Plan, { label: string; events: number; registrations: number }> = {
  free: { label: "Free", events: 3, registrations: 100 },
  pro: { label: "Pro", events: 20, registrations: 2000 },
  enterprise: { label: "Enterprise", events: 999, registrations: 100000 },
};

export type SectionType =
  | "hero" | "about" | "events" | "schedule" | "speakers" | "workshop" | "sponsors"
  | "partners" | "venue" | "previous" | "gallery" | "faq" | "contact" | "cta" | "text";

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;
  isSample: boolean;
  navLabel: string; // empty = not shown in navbar
  data: Record<string, any>;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  mode: "light" | "dark";
  font: "modern" | "elegant" | "tech" | "friendly";
  radius: "sharp" | "soft" | "round";
}

export interface Branding {
  orgName: string;
  shortName: string;
  tagline: string;
  logo: string;
  announcement: string;
  theme: Theme;
}

export interface FooterConfig {
  about: string;
  email: string;
  phone: string;
  address: string;
  socials: { platform: string; url: string }[];
  copyright: string;
}

export interface SiteConfig {
  branding: Branding;
  sections: Section[];
  footer: FooterConfig;
  seo: { title: string; description: string };
}

export interface Prize { place: string; amount: string }
export interface Resource { label: string; url: string; type: string }

export interface OrgEvent {
  id: string;
  slug: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  about: string;
  banner: string;
  date: string;
  time: string;
  location: string;
  startDate: string; // ISO local datetime, for countdown
  tags: string[];
  registrationFee: string;
  feeAmount: number;
  prizes: Prize[];
  totalPrizePool: string;
  eligibility: string;
  teamSize: string;
  maxMembers: number;
  perks: string[];
  whyJoin: string[];
  process: { title: string; detail: string }[];
  resources: Resource[];
  registrationOpen: boolean;
  featured: boolean;
  isSample: boolean;
}

export interface Snapshot {
  site: SiteConfig;
  events: OrgEvent[];
}

export interface Member { name: string; email: string; phone: string; institution: string; studentId: string }

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  teamName: string;
  members: Member[];
  paymentMethod: string;
  senderNumber: string;
  txnId: string;
  amount: number;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

export interface Org {
  id: string;
  slug: string;
  owner: { name: string; email: string };
  plan: Plan;
  status: "active" | "suspended";
  createdAt: string;
  publishedAt?: string;
  version: number;
  visits: number;
  draft: Snapshot;
  published?: Snapshot;
  registrations: Registration[];
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  orgId?: string;
  orgName?: string;
  action: string;
  detail: string;
}

export type Session = { role: "super" } | { role: "org"; orgId: string } | null;

export interface DB {
  orgs: Org[];
  audit: AuditEntry[];
  session: Session;
}
