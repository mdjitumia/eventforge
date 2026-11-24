"use client";
import type { ReactNode } from "react";
import { CalendarDays, ClipboardList, LayoutDashboard, Layers, Palette, Rocket } from "lucide-react";
import { Guard, PanelShell, type NavItem } from "@/components/panel/PanelShell";
import { useCurrentOrg } from "@/lib/store";

const nav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/branding", label: "Branding", icon: Palette },
  { href: "/dashboard/website", label: "Website sections", icon: Layers },
  { href: "/dashboard/events", label: "Events", icon: CalendarDays },
  { href: "/dashboard/registrations", label: "Registrations", icon: ClipboardList },
  { href: "/dashboard/publish", label: "Publish & Export", icon: Rocket },
];

function Inner({ children }: { children: ReactNode }) {
  const org = useCurrentOrg();
  return <PanelShell nav={nav} title={org?.draft.site.branding.orgName ?? "Dashboard"} subtitle={org?.owner.email ?? ""}>{children}</PanelShell>;
}
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Guard role="org"><Inner>{children}</Inner></Guard>;
}
