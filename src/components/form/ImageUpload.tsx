"use client";
import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { uploadImage } from "@/lib/api";
import { useToast } from "@/components/ui";

export function ImageUpload({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function pick(f?: File | null) {
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadImage(f)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed."); }
    finally { setBusy(false); if (ref.current) ref.current.value = ""; }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {value ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={value} alt={label ?? "preview"} className="h-full w-full object-cover" /> : <ImagePlus className="text-slate-300" />}
      </div>
      <div className="flex flex-col gap-1.5">
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50">
          <Upload size={14} /> {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-red-600 hover:bg-red-50">
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>
    </div>
  );
}
