"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Activity, Building2, LayoutDashboard } from "lucide-react";
import { Guard, PanelShell, type NavItem } from "@/components/panel/PanelShell";

const nav: NavItem[] = [
  { href: "/super-admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/super-admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/super-admin/activity", label: "Activity log", icon: Activity },
];

export default function SuperLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  if (path === "/super-admin/login") return <>{children}</>;
  return <Guard role="super"><PanelShell nav={nav} title="Platform Admin" subtitle="Super administrator" accent="slate">{children}</PanelShell></Guard>;
}
