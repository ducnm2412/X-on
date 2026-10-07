"use client";

import { useState } from "react";
import { Sparkle } from "./Nail";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "password" | "textarea" | "select" | "checkbox" | "rating";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: string[];
  half?: boolean;
  match?: string; // must equal the value of this other field
  minLength?: number;
  hint?: string;
  value?: string;
  readOnly?: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FieldDef[], values: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const v = (values[f.name] ?? "").trim();
    const what = f.label.toLowerCase();
    if (f.required && !v) errors[f.name] = f.type === "checkbox" ? "Tick this box to continue." : f.type === "rating" ? "Choose a rating from 1 to 5." : `Enter your ${what}.`;
    else if (v && f.type === "email" && !EMAIL.test(v)) errors[f.name] = "Enter an email address like name@example.com.";
    else if (v && f.type === "tel" && v.replace(/\D/g, "").length < 10) errors[f.name] = "Enter a 10-digit phone number.";
    else if (v && f.minLength && v.length < f.minLength) errors[f.name] = `Use at least ${f.minLength} characters.`;
    else if (f.match && v !== (values[f.match] ?? "").trim()) errors[f.name] = "The two passwords do not match.";
  }
  return errors;
}

/**
 * A front-end only form: validates, shows a loading state, then success.
 * To preview the failure state, submit with an email ending in "@fail.test".
 */
export function DemoForm({
  id,
  fields,
  submitLabel,
  loadingLabel,
  successTitle,
  successBody,
  again = "Send another",
  footer,
  onSuccess,
  check,
}: {
  id: string;
  fields: FieldDef[];
  submitLabel: string;
  loadingLabel: string;
  successTitle: string;
  successBody: string;
  again?: string;
  footer?: React.ReactNode;
  /** Runs once the form has been accepted, for example to move to another page. */
  onSuccess?: () => void;
  /** Runs after validation. Return a [title, detail] pair to reject the values, or null to accept. */
  check?: (values: Record<string, string>) => [string, string] | null;
}) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.value ?? ""]));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const [problem, setProblem] = useState<[string, string] | null>(null);

  const change = (name: string, v: string) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(fields, values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus("loading");
    const fail = Object.values(values).some((v) => v.endsWith("@fail.test"));
    setTimeout(() => {
      const rejected = fail ? null : (check?.(values) ?? null);
      setProblem(rejected);
      const ok = !fail && !rejected;
      setStatus(ok ? "success" : "failed");
      if (ok) onSuccess?.();
    }, 1000);
  }

  if (status === "success")
    return (
      <div role="status" className="rounded-xl bg-blush p-7 md:p-9 animate-rise">
        <Sparkle className="size-6 text-lacquer mb-3" />
        <p className="d3">{successTitle}</p>
        <p className="mt-2 text-mauve max-w-md">{successBody}</p>
        <button
          className="link mt-5"
          onClick={() => {
            setValues(initial);
            setStatus("idle");
          }}
        >
          {again}
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      {status === "failed" && (
        <div role="alert" className="sm:col-span-2 rounded-lg border-[1.5px] border-lacquer bg-blush px-5 py-4">
          <p className="font-semibold">{problem ? problem[0] : "Not sent. We could not reach the server."}</p>
          <p className="text-sm text-mauve">{problem ? problem[1] : "Your details are still in the form. Check your connection and send again, or call 689-212-8888."}</p>
        </div>
      )}
      {fields.map((f) => {
        const fid = `${id}-${f.name}`;
        const err = errors[f.name];
        const common = {
          id: fid,
          name: f.name,
          "aria-invalid": !!err,
          "aria-describedby": err ? `${fid}-err` : f.hint ? `${fid}-hint` : undefined,
        };
        const span = f.half ? "" : "sm:col-span-2";
        const message = err ? (
          <p id={`${fid}-err`} className="mt-1.5 text-sm font-semibold text-lacquer">
            {err}
          </p>
        ) : f.hint ? (
          <p id={`${fid}-hint`} className="mt-1.5 text-sm text-mauve">
            {f.hint}
          </p>
        ) : null;

        if (f.type === "checkbox")
          return (
            <div key={f.name} className={span}>
              <label className="flex gap-3 text-sm">
                <input type="checkbox" className="check" {...common} checked={values[f.name] === "yes"} onChange={(e) => change(f.name, e.target.checked ? "yes" : "")} />
                <span>{f.label}</span>
              </label>
              {message}
            </div>
          );

        if (f.type === "rating")
          return (
            <fieldset key={f.name} className={span}>
              <legend className="label">{f.label}</legend>
              <div className="flex gap-1" id={fid} tabIndex={-1}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="cursor-pointer p-1 rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lacquer">
                    <input type="radio" name={f.name} value={n} className="sr-only" checked={values[f.name] === String(n)} onChange={() => change(f.name, String(n))} />
                    <span className="sr-only">
                      {n} {n === 1 ? "star" : "stars"}
                    </span>
                    <Sparkle className={`size-7 transition-colors ${n <= Number(values[f.name] || 0) ? "text-rose" : "text-petal hover:text-rose/60"}`} />
                  </label>
                ))}
              </div>
              {message}
            </fieldset>
          );

        return (
          <div key={f.name} className={span}>
            <label htmlFor={fid} className="label">
              {f.label} {!f.required && !f.readOnly && <span className="font-normal text-mauve">(optional)</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={5} className="input" placeholder={f.placeholder} value={values[f.name]} onChange={(e) => change(f.name, e.target.value)} />
            ) : f.type === "select" ? (
              <select {...common} className="input" value={values[f.name]} disabled={f.readOnly} onChange={(e) => change(f.name, e.target.value)}>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input {...common} type={f.type ?? "text"} className="input" placeholder={f.placeholder} autoComplete={f.autoComplete} value={values[f.name]} onChange={(e) => change(f.name, e.target.value)} />
            )}
            {message}
          </div>
        );
      })}
      <div className="sm:col-span-2 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button className="btn" disabled={status === "loading"}>
          {status === "loading" ? loadingLabel : submitLabel}
        </button>
        {footer}
      </div>
    </form>
  );
}
