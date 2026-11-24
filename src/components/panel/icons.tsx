import * as L from "lucide-react";
import type { LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = {
  Sparkles: L.Sparkles, Info: L.Info, CalendarDays: L.CalendarDays, Clock: L.Clock, Mic2: L.Mic, Presentation: L.Presentation,
  Handshake: L.Handshake, Users: L.Users, MapPin: L.MapPin, History: L.History, Images: L.Images, HelpCircle: L.CircleHelp,
  Mail: L.Mail, Megaphone: L.Megaphone, AlignLeft: L.AlignLeft,
};
export const SectionIcon = ({ name, size = 18, className }: { name: string; size?: number; className?: string }) => {
  const I = map[name] ?? L.Layers;
  return <I size={size} className={className} />;
};
