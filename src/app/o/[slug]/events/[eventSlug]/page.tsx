"use client";
import { use } from "react";
import { PublicSiteLoader } from "@/components/site/PublicSiteLoader";
import { EventDetail } from "@/components/site/EventPages";
import { SLink } from "@/components/site/ctx";

export default function EventPage({ params }: { params: Promise<{ slug: string; eventSlug: string }> }) {
  const { slug, eventSlug } = use(params);
  return (
    <PublicSiteLoader slug={slug}>
      {(snap) => {
        const e = snap.events.find((x) => x.slug === eventSlug);
        if (!e) return <div className="mx-auto max-w-xl py-24 text-center"><h1 className="font-heading text-2xl font-bold">Event not found</h1><SLink href="#events" className="mt-4 inline-block text-site-primary underline">Back to events</SLink></div>;
        return <EventDetail event={e} />;
      }}
    </PublicSiteLoader>
  );
}
