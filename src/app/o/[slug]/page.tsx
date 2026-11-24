"use client";
import { use } from "react";
import { PublicSiteLoader } from "@/components/site/PublicSiteLoader";
import { SiteSections } from "@/components/site/SiteFrame";

export default function OrgHome({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <PublicSiteLoader slug={slug}>{(snap) => <SiteSections snapshot={snap} />}</PublicSiteLoader>;
}
