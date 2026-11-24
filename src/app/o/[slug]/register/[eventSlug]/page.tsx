"use client";
import { use } from "react";
import { PublicSiteLoader } from "@/components/site/PublicSiteLoader";
import { RegisterForm } from "@/components/site/EventPages";
import { SLink } from "@/components/site/ctx";

export default function RegisterPage({ params }: { params: Promise<{ slug: string; eventSlug: string }> }) {
  const { slug, eventSlug } = use(params);
  return (
    <PublicSiteLoader slug={slug}>
      {(snap) => {
        const e = snap.events.find((x) => x.slug === eventSlug);
        if (!e) return <div className="mx-auto max-w-xl py-24 text-center"><h1 className="font-heading text-2xl font-bold">Event not found</h1></div>;
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <SLink href={`/events/${e.slug}`} className="text-sm text-site-muted hover:text-site-primary">← {e.title}</SLink>
            <h1 className="mb-1 mt-3 font-heading text-3xl font-bold text-site-fg">Register for {e.title}</h1>
            <p className="mb-6 text-site-muted">{[e.date, e.time].filter(Boolean).join(" · ")}</p>
            <RegisterForm event={e} />
          </div>
        );
      }}
    </PublicSiteLoader>
  );
}
