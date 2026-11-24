import type { SectionType } from "./types";

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "url" | "datetime" | "number"; placeholder?: string; help?: string; rows?: number }
  | { key: string; label: string; type: "image"; help?: string; wide?: boolean }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; help?: string }
  | { key: string; label: string; type: "toggle"; help?: string }
  | { key: string; label: string; type: "strings"; placeholder?: string; help?: string }
  | { key: string; label: string; type: "list"; itemLabel: string; titleKey: string; fields: FieldDef[]; help?: string }
  | { key: string; label: string; type: "heading" };

const H = (label: string): FieldDef => ({ key: "_" + label, label, type: "heading" });
const t = (key: string, label: string, placeholder = ""): FieldDef => ({ key, label, type: "text", placeholder });
const ta = (key: string, label: string, rows = 4): FieldDef => ({ key, label, type: "textarea", rows });
const img = (key: string, label: string, help = ""): FieldDef => ({ key, label, type: "image", help });
const kicker: FieldDef[] = [t("kicker", "Small label above the heading", "e.g. About"), t("heading", "Heading")];
const sub = ta("subtitle", "Sub-heading", 2);
const logoFields: FieldDef[] = [t("name", "Name"), img("logo", "Logo"), { key: "url", label: "Website link (optional)", type: "url" }];

export interface SectionMeta {
  label: string;
  desc: string;
  icon: string;
  defaultNav: string;
  fields: FieldDef[];
  blank: () => Record<string, any>;
}

export const SECTION_META: Record<SectionType, SectionMeta> = {
  hero: {
    label: "Hero banner", desc: "Top banner with title, date, buttons and countdown.", icon: "Sparkles", defaultNav: "",
    fields: [
      H("Headline"), t("badge", "Badge text"), t("title", "Main title"), t("highlight", "Highlighted text (gradient)"), ta("subtitle", "Subtitle", 2),
      H("Date & place"), t("dateText", "Date and time text"), t("locationText", "Location text"),
      H("Background"), img("banner", "Banner image", "Wide image (recommended 1600x800)."),
      H("Buttons"), t("ctaPrimaryLabel", "Primary button label"), t("ctaPrimaryLink", "Primary button link", "#events or /events/your-event"),
      t("ctaSecondaryLabel", "Secondary button label"), t("ctaSecondaryLink", "Secondary button link", "#schedule"),
      H("Countdown"), { key: "showCountdown", label: "Show countdown timer", type: "toggle" }, { key: "countdownTarget", label: "Countdown target", type: "datetime" },
      H("Key numbers"), { key: "stats", label: "Stats", type: "list", itemLabel: "stat", titleKey: "label", fields: [t("value", "Value", "e.g. 2,000+"), t("label", "Label")] },
    ],
    blank: () => ({ badge: "", title: "Your Event Name", highlight: "", subtitle: "", dateText: "", locationText: "", banner: "", ctaPrimaryLabel: "Register now", ctaPrimaryLink: "#events", ctaSecondaryLabel: "", ctaSecondaryLink: "", showCountdown: false, countdownTarget: "", stats: [] }),
  },
  about: {
    label: "About", desc: "Describe your event with an image and highlights.", icon: "Info", defaultNav: "About",
    fields: [...kicker, ta("body", "Description", 6), img("image", "Image"), { key: "highlights", label: "Highlights", type: "list", itemLabel: "highlight", titleKey: "title", fields: [t("title", "Title"), ta("text", "Text", 2)] }, { key: "stats", label: "Numbers", type: "list", itemLabel: "number", titleKey: "label", fields: [t("value", "Value"), t("label", "Label")] }],
    blank: () => ({ kicker: "About", heading: "About us", body: "", image: "", highlights: [], stats: [] }),
  },
  events: {
    label: "Events & competitions", desc: "Cards for the events you manage in the Events page.", icon: "CalendarDays", defaultNav: "Events",
    fields: [...kicker, sub, { key: "layout", label: "Layout", type: "select", options: [{ value: "grid", label: "Cards grid" }, { value: "list", label: "Compact list" }] }],
    blank: () => ({ kicker: "Competitions", heading: "Our events", subtitle: "", layout: "grid" }),
  },
  schedule: {
    label: "Schedule", desc: "Day-by-day program with times and venues.", icon: "Clock", defaultNav: "Schedule",
    fields: [...kicker, sub, { key: "days", label: "Days", type: "list", itemLabel: "day", titleKey: "label", fields: [t("label", "Day label", "e.g. Day 1 - Sunday"), { key: "items", label: "Sessions", type: "list", itemLabel: "session", titleKey: "title", fields: [t("start", "Start", "09:00 AM"), t("end", "End", "10:00 AM"), t("title", "Title"), ta("description", "Description", 2), t("venue", "Venue"), t("track", "Track / type", "Main, Competition, Session")] }] }],
    blank: () => ({ kicker: "Program", heading: "Schedule", subtitle: "", days: [{ label: "Day 1", items: [] }] }),
  },
  speakers: {
    label: "Speakers & guests", desc: "Photos, titles and groups of guests.", icon: "Mic2", defaultNav: "Speakers",
    fields: [...kicker, sub, { key: "people", label: "People", type: "list", itemLabel: "person", titleKey: "name", fields: [t("name", "Name"), t("title", "Designation"), t("organization", "Organization"), t("category", "Group name", "Chief Guests / Speakers / Judges"), t("topic", "Talk topic (optional)"), img("photo", "Photo", "Square photo.")] }],
    blank: () => ({ kicker: "Guests", heading: "Guests & Speakers", subtitle: "", people: [] }),
  },
  workshop: {
    label: "Featured session", desc: "Spotlight one workshop or talk.", icon: "Presentation", defaultNav: "",
    fields: [...kicker, t("title", "Session title"), ta("description", "Description", 4), img("image", "Image"), H("Speaker"), t("speakerName", "Speaker name"), t("speakerTitle", "Speaker title"), img("speakerPhoto", "Speaker photo"), H("Details"), t("date", "Date"), t("time", "Time"), t("location", "Location"), { key: "points", label: "Key takeaways", type: "strings", placeholder: "Add a takeaway" }, t("ctaLabel", "Button label"), t("ctaLink", "Button link", "/events/your-event")],
    blank: () => ({ kicker: "Featured", heading: "Workshop spotlight", title: "", description: "", image: "", speakerName: "", speakerTitle: "", speakerPhoto: "", date: "", time: "", location: "", points: [], ctaLabel: "", ctaLink: "" }),
  },
  sponsors: {
    label: "Sponsors", desc: "Sponsor tiers with logos and a call to become a sponsor.", icon: "Handshake", defaultNav: "Sponsors",
    fields: [...kicker, sub, { key: "tiers", label: "Sponsor tiers", type: "list", itemLabel: "tier", titleKey: "name", fields: [t("name", "Tier name", "Title Partner"), t("blurb", "Short text"), { key: "logos", label: "Logos", type: "list", itemLabel: "sponsor", titleKey: "name", fields: logoFields }] }, t("reach", "Reach text", "e.g. 2,000+ attendees"), t("ctaLabel", "Become-a-sponsor button label"), { key: "ctaLink", label: "Button link", type: "url" }],
    blank: () => ({ kicker: "Partners", heading: "Sponsors", subtitle: "", tiers: [{ name: "Sponsors", blurb: "", logos: [] }], reach: "", ctaLabel: "", ctaLink: "" }),
  },
  partners: {
    label: "Partners & communities", desc: "A logo wall for clubs, communities or media partners.", icon: "Users", defaultNav: "",
    fields: [...kicker, sub, { key: "logos", label: "Logos", type: "list", itemLabel: "partner", titleKey: "name", fields: logoFields }],
    blank: () => ({ kicker: "Community", heading: "Partners", subtitle: "", logos: [] }),
  },
  venue: {
    label: "Venue", desc: "Address, map link, facilities and directions.", icon: "MapPin", defaultNav: "Venue",
    fields: [...kicker, t("name", "Venue name"), t("line1", "Address line 1"), t("line2", "Address line 2"), ta("description", "Description", 3), img("image", "Venue image"), { key: "mapLink", label: "Map link (Google Maps)", type: "url" }, { key: "mapEmbed", label: "Map embed URL (optional)", type: "url", help: "Paste the src of a Google Maps embed iframe." }, { key: "facilities", label: "Facilities", type: "strings", placeholder: "e.g. Parking" }, { key: "directions", label: "How to reach", type: "strings", placeholder: "Add a direction" }],
    blank: () => ({ kicker: "Location", heading: "Venue", name: "", line1: "", line2: "", description: "", image: "", mapLink: "", mapEmbed: "", facilities: [], directions: [] }),
  },
  previous: {
    label: "Previous editions", desc: "Past events with photos and numbers.", icon: "History", defaultNav: "",
    fields: [...kicker, sub, { key: "editions", label: "Editions", type: "list", itemLabel: "edition", titleKey: "title", fields: [t("title", "Title"), t("year", "Year"), t("date", "Date"), ta("description", "Description", 3), img("image", "Photo"), t("participants", "Participants"), t("speakers", "Speakers"), t("sessions", "Sessions")] }],
    blank: () => ({ kicker: "History", heading: "Previous editions", subtitle: "", editions: [] }),
  },
  gallery: {
    label: "Photo gallery", desc: "A grid of photos with captions.", icon: "Images", defaultNav: "Gallery",
    fields: [...kicker, sub, { key: "images", label: "Photos", type: "list", itemLabel: "photo", titleKey: "caption", fields: [img("image", "Photo"), t("caption", "Caption")] }],
    blank: () => ({ kicker: "Moments", heading: "Gallery", subtitle: "", images: [] }),
  },
  faq: {
    label: "FAQ", desc: "Questions and answers.", icon: "HelpCircle", defaultNav: "FAQ",
    fields: [...kicker, sub, { key: "items", label: "Questions", type: "list", itemLabel: "question", titleKey: "q", fields: [t("q", "Question"), ta("a", "Answer", 3)] }],
    blank: () => ({ kicker: "Help", heading: "FAQ", subtitle: "", items: [] }),
  },
  contact: {
    label: "Contact", desc: "How people can reach you.", icon: "Mail", defaultNav: "Contact",
    fields: [...kicker, sub, t("email", "Email"), t("phone", "Phone"), t("address", "Address"), t("hours", "Office hours")],
    blank: () => ({ kicker: "Contact", heading: "Get in touch", subtitle: "", email: "", phone: "", address: "", hours: "" }),
  },
  cta: {
    label: "Call to action", desc: "A highlighted banner with a button.", icon: "Megaphone", defaultNav: "",
    fields: [t("heading", "Heading"), ta("text", "Text", 3), t("buttonLabel", "Button label"), t("buttonLink", "Button link", "#events"), t("secondaryLabel", "Second button label (optional)"), t("secondaryLink", "Second button link")],
    blank: () => ({ heading: "Join us", text: "", buttonLabel: "Register", buttonLink: "#events", secondaryLabel: "", secondaryLink: "" }),
  },
  text: {
    label: "Text + image", desc: "A free content block with optional image.", icon: "AlignLeft", defaultNav: "",
    fields: [...kicker, ta("body", "Content", 8), img("image", "Image"), { key: "imagePosition", label: "Image position", type: "select", options: [{ value: "right", label: "Right" }, { value: "left", label: "Left" }] }],
    blank: () => ({ kicker: "", heading: "New section", body: "", image: "", imagePosition: "right" }),
  },
};

export const EVENT_FIELDS: FieldDef[] = [
  H("Basics"), t("title", "Event title"), t("tagline", "Tagline"), ta("description", "Short description", 3), ta("about", "About this event (long)", 5), img("banner", "Banner image", "Wide image (recommended 1200x500)."),
  H("When & where"), t("date", "Date text", "12.07.2026"), t("time", "Time text", "10:00 AM – 03:00 PM"), t("location", "Location"), { key: "startDate", label: "Start date & time (for countdown)", type: "datetime" },
  H("Registration"), { key: "registrationOpen", label: "Registration open", type: "toggle" }, t("registrationFee", "Fee text", "৳1,000 per team"), { key: "feeAmount", label: "Fee amount (number, 0 = free)", type: "number" },
  t("teamSize", "Team size text", "Up to 2 members"), { key: "maxMembers", label: "Maximum members per team", type: "number" }, ta("eligibility", "Eligibility", 2),
  H("Prizes & perks"), t("totalPrizePool", "Total prize pool"), { key: "prizes", label: "Prizes", type: "list", itemLabel: "prize", titleKey: "place", fields: [t("place", "Place", "1st Place"), t("amount", "Amount")] }, { key: "perks", label: "Perks", type: "strings", placeholder: "e.g. T-shirt" },
  H("Content"), { key: "tags", label: "Tags", type: "strings", placeholder: "e.g. AI" }, { key: "whyJoin", label: "Why join", type: "strings", placeholder: "Add a reason" },
  { key: "process", label: "Process / stages", type: "list", itemLabel: "stage", titleKey: "title", fields: [t("title", "Stage title"), ta("detail", "Details", 2)] },
  { key: "resources", label: "Resources & links", type: "list", itemLabel: "resource", titleKey: "label", fields: [t("label", "Label"), { key: "url", label: "Link", type: "url" }, t("type", "Type", "guide, link, template")] },
  H("Visibility"), { key: "featured", label: "Featured event", type: "toggle" },
];

export const FOOTER_FIELDS: FieldDef[] = [
  ta("about", "About text", 3), t("email", "Email"), t("phone", "Phone"), t("address", "Address"),
  { key: "socials", label: "Social links", type: "list", itemLabel: "link", titleKey: "platform", fields: [t("platform", "Platform", "Facebook"), { key: "url", label: "URL", type: "url" }] },
  t("copyright", "Copyright line"),
];

export const SEO_FIELDS: FieldDef[] = [t("title", "Browser tab title"), ta("description", "Search description", 2)];
