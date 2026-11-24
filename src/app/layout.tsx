import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/config";

export const metadata: Metadata = { title: `${PLATFORM_NAME} — ${PLATFORM_TAGLINE}`, description: PLATFORM_TAGLINE };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900"><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
