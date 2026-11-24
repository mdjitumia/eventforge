"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2, X } from "lucide-react";
import type { FieldDef } from "@/lib/schemas";
import { Field, inputCls } from "@/components/ui";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";

type Obj = Record<string, any>;

function blankFor(fields: FieldDef[]): Obj {
  const o: Obj = {};
  for (const f of fields) {
    if (f.type === "heading") continue;
    o[f.key] = f.type === "list" || f.type === "strings" ? [] : f.type === "toggle" ? false : f.type === "number" ? 0 : "";
  }
  return o;
}

export function SchemaForm({ fields, value, onChange }: { fields: FieldDef[]; value: Obj; onChange: (v: Obj) => void }) {
  const set = (k: string, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-4">
      {fields.map((f) => {
        if (f.type === "heading") return <h4 key={f.key} className="border-b border-slate-200 pb-1 pt-3 text-sm font-bold text-slate-800">{f.label}</h4>;
        const v = value?.[f.key];
        switch (f.type) {
          case "text":
          case "url":
            return <Field key={f.key} label={f.label} help={(f as any).help}><input className={inputCls} type="text" value={v ?? ""} placeholder={(f as any).placeholder} onChange={(e) => set(f.key, e.target.value)} /></Field>;
          case "number":
            return <Field key={f.key} label={f.label}><input className={inputCls} type="number" min={0} value={v ?? 0} onChange={(e) => set(f.key, e.target.value === "" ? 0 : Number(e.target.value))} /></Field>;
          case "datetime":
            return <Field key={f.key} label={f.label}><input className={inputCls} type="datetime-local" value={v ?? ""} onChange={(e) => set(f.key, e.target.value)} /></Field>;
          case "textarea":
            return <Field key={f.key} label={f.label}><textarea className={inputCls} rows={f.rows ?? 4} value={v ?? ""} onChange={(e) => set(f.key, e.target.value)} /></Field>;
          case "select":
            return <Field key={f.key} label={f.label}><select className={inputCls} value={v ?? ""} onChange={(e) => set(f.key, e.target.value)}>{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field>;
          case "toggle":
            return (
              <label key={f.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="text-sm font-medium text-slate-700">{f.label}</span>
                <input type="checkbox" className="h-4 w-4 accent-indigo-600" checked={!!v} onChange={(e) => set(f.key, e.target.checked)} />
              </label>
            );
          case "image":
            return <Field key={f.key} label={f.label} help={f.help}><ImageUpload value={v ?? ""} onChange={(x) => set(f.key, x)} label={f.label} /></Field>;
          case "strings":
            return <StringsField key={f.key} def={f} value={(v as string[]) ?? []} onChange={(x) => set(f.key, x)} />;
          case "list":
            return <ListField key={f.key} def={f} value={(v as Obj[]) ?? []} onChange={(x) => set(f.key, x)} />;
        }
      })}
    </div>
  );
}

function StringsField({ def, value, onChange }: { def: Extract<FieldDef, { type: "strings" }>; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => { const t = draft.trim(); if (t) { onChange([...value, t]); setDraft(""); } };
  return (
    <Field label={def.label} help={def.help}>
      <div className="space-y-1.5">
        {value.map((s, i) => (
          <div key={i} className="flex gap-1.5">
            <input className={inputCls} value={s} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded-lg px-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove"><X size={16} /></button>
          </div>
        ))}
        <div className="flex gap-1.5">
          <input className={inputCls} value={draft} placeholder={def.placeholder ?? "Add item and press Enter"} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
          <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 text-xs font-medium hover:bg-slate-50"><Plus size={14} /> Add</button>
        </div>
      </div>
    </Field>
  );
}

function ListField({ def, value, onChange }: { def: Extract<FieldDef, { type: "list" }>; value: Obj[]; onChange: (v: Obj[]) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= value.length) return;
    const a = [...value]; [a[i], a[j]] = [a[j], a[i]]; onChange(a);
    setOpen((o) => (o === i ? j : o));
  };
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{def.label} <span className="font-normal normal-case text-slate-400">({value.length})</span></span>
        <button type="button" onClick={() => { onChange([...value, blankFor(def.fields)]); setOpen(value.length); }} className="inline-flex h-7 items-center gap-1 rounded-lg bg-indigo-50 px-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"><Plus size={14} /> Add {def.itemLabel}</button>
      </div>
      <div className="space-y-2">
        {value.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">No {def.itemLabel}s yet.</p>}
        {value.map((item, i) => {
          const isOpen = open === i;
          const title = String(item?.[def.titleKey] || "").trim() || `${def.itemLabel} ${i + 1}`;
          return (
            <div key={i} className={cn("rounded-lg border bg-white", isOpen ? "border-indigo-300" : "border-slate-200")}>
              <div className="flex items-center gap-1 px-2 py-1.5">
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-sm font-medium text-slate-800">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<span className="truncate">{title}</span>
                </button>
                <button type="button" onClick={() => move(i, -1)} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Move up"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Move down"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => { onChange(value.filter((_, j) => j !== i)); setOpen(null); }} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 size={14} /></button>
              </div>
              {isOpen && (
                <div className="border-t border-slate-100 p-3">
                  <SchemaForm fields={def.fields} value={item} onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : x)))} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
