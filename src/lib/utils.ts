import clsx, { type ClassValue } from "clsx";

export const cn = (...v: ClassValue[]) => clsx(v);

export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30);

export const RESERVED_SLUGS = ["admin", "api", "www", "app", "dashboard", "login", "signup", "super-admin", "o", "static", "support", "help", "billing", "platform"];

export function validateSlug(slug: string): string | null {
  if (!/^[a-z0-9](?:[a-z0-9-]{1,28})[a-z0-9]$/.test(slug)) return "Use 3-30 lowercase letters, numbers or hyphens (no hyphen at the ends).";
  if (RESERVED_SLUGS.includes(slug)) return "This address is reserved. Try another one.";
  return null;
}

export const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

export const fmtDay = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "-";

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Resize + compress an image file to a data URL so it fits in localStorage. */
export function fileToDataUrl(file: File, maxW = 1100, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    if (file.size > 8 * 1024 * 1024) return reject(new Error("Image is larger than 8 MB."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      if (file.type === "image/svg+xml") return resolve(String(reader.result));
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image."));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const ctx = c.getContext("2d")!;
        const png = file.type === "image/png";
        if (!png) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL(png ? "image/png" : "image/jpeg", quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** Resize + compress an image to a Blob for upload to Supabase Storage. */
export function compressImage(file: File, maxW = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return reject(new Error("Please choose a JPG, PNG or WebP image."));
    if (file.size > 8 * 1024 * 1024) return reject(new Error("Image is larger than 8 MB."));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Invalid image.")); };
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext("2d")!;
      const png = file.type === "image/png";
      if (!png) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process the image."))), png ? "image/png" : "image/jpeg", quality);
    };
    img.src = url;
  });
}