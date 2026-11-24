"use client";
import { createContext, useCallback, useContext, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------ Button
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" | "success"; size?: "sm" | "md" | "lg" };
export function Button({ variant = "primary", size = "md", className, ...p }: BtnProps) {
  const v = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  }[variant];
  const s = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" }[size];
  return <button {...p} className={cn("inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50", v, s, className)} />;
}

// ------------------------------------------------------------ Layout bits
export const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>
);

export function Badge({ children, tone = "slate", className }: { children: ReactNode; tone?: "slate" | "green" | "amber" | "red" | "indigo" | "purple" | "blue"; className?: string }) {
  const t = { slate: "bg-slate-100 text-slate-700", green: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-800", red: "bg-red-100 text-red-700", indigo: "bg-indigo-100 text-indigo-700", purple: "bg-purple-100 text-purple-700", blue: "bg-blue-100 text-blue-700" }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", t, className)}>{children}</span>;
}

export const PageTitle = ({ title, desc, actions }: { title: string; desc?: string; actions?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {desc && <p className="mt-1 max-w-2xl text-sm text-slate-500">{desc}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Empty = ({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
    <p className="font-semibold text-slate-800">{title}</p>
    {desc && <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{desc}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export function Spinner() {
  return <div className="grid min-h-[40vh] place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" /></div>;
}

// ------------------------------------------------------------ Form controls
export const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export function Field({ label, help, children, className }: { label: string; help?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
      {children}
      {help && <span className="mt-1 block text-xs text-slate-400">{help}</span>}
    </label>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition", checked ? "bg-indigo-600" : "bg-slate-300")}>
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}

// ------------------------------------------------------------ Modal
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-[8vh]" onMouseDown={onClose}>
      <div className={cn("w-full rounded-xl bg-white shadow-2xl animate-fadeUp", wide ? "max-w-3xl" : "max-w-lg")} onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Confirm({ open, title, message, confirmLabel = "Confirm", danger, onCancel, onConfirm }: { open: boolean; title: string; message: ReactNode; confirmLabel?: string; danger?: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="text-sm text-slate-600">{message}</div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------ Toasts
type ToastItem = { id: number; type: "success" | "error" | "info"; text: string };
const ToastCtx = createContext<{ push: (type: ToastItem["type"], text: string) => void }>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((type: ToastItem["type"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((a) => [...a, { id, type, text }]);
    setTimeout(() => setItems((a) => a.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className={cn("pointer-events-auto flex items-start gap-2 rounded-lg border bg-white p-3 text-sm shadow-lg animate-fadeUp", t.type === "error" ? "border-red-200" : t.type === "success" ? "border-emerald-200" : "border-slate-200")}>
            {t.type === "error" ? <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" /> : t.type === "success" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /> : <Info size={18} className="mt-0.5 shrink-0 text-indigo-600" />}
            <span className="text-slate-700">{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const { push } = useContext(ToastCtx);
  return { success: (m: string) => push("success", m), error: (m: string) => push("error", m), info: (m: string) => push("info", m) };
}

/** Run an api call, show a toast on success/failure. Returns the result or undefined on error. */
export function useRun() {
  const toast = useToast();
  return useCallback(async <T,>(fn: () => Promise<T>, ok?: string): Promise<T | undefined> => {
    try {
      const r = await fn();
      if (ok) toast.success(ok);
      return r;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
