"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/profile";
import { ui } from "@/content/ui";
import type { ContactResponse } from "@/lib/api-types";
import { copyText } from "../hooks";
import { Icon } from "../icons";
import { useLocale, useT } from "../i18n";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactApp() {
  const t = useT();
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [errorKind, setErrorKind] = useState<"rate" | "send" | null>(null);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const copyEmail = async () => {
    if (await copyText(contact.email)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      website: String(form.get("website") ?? ""),
      locale,
      page: window.location.pathname,
      startedAt: startedAt.current,
    };
    const local: string[] = [];
    if (!payload.name) local.push("name");
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) local.push("email");
    if (payload.message.length < 10) local.push("message");
    setErrors(local);
    setErrorKind(null);
    if (local.length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ContactResponse;
      if (data.ok) {
        setStatus("sent");
        return;
      }
      if (data.error === "validation") setErrors(data.fields ?? []);
      setErrorKind(data.error === "rate" ? "rate" : data.error === "send" ? "send" : null);
      setStatus("error");
    } catch {
      setErrorKind("send");
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-[10px] border border-line bg-[var(--hover-fill)] px-3.5 py-2.5 text-[15px] text-text outline-none transition-colors placeholder:text-text-2/60 hover:border-line-strong focus:border-accent aria-[invalid=true]:border-danger daylight:rounded-none daylight:border-[var(--tinta)] daylight:bg-[var(--blanco-roto)] daylight:focus:border-[var(--klein)] daylight:focus:outline daylight:focus:outline-1 daylight:focus:outline-[var(--klein)]";

  return (
    <div className="scroll-area h-full">
      <div className="mx-auto flex max-w-[560px] flex-col gap-6 p-6 max-[820px]:p-4">
        <header className="flex flex-col gap-3">
          <h1 className="t-h1">{t(contact.title)}</h1>
          <p className="text-[16px] leading-[1.6] text-text-2">{t(contact.text)}</p>
        </header>

        <div className="card flex items-center justify-between gap-3 p-3 pl-4">
          <a href={`mailto:${contact.email}`} className="min-w-0 truncate font-mono text-[14px] hover:underline">
            {contact.email}
          </a>
          <div className="flex shrink-0 gap-2">
            <button type="button" className="btn h-9 px-3 text-[13px]" onClick={copyEmail} aria-live="polite">
              <Icon name="copy" size={14} />
              {copied ? t(ui.contactForm.copied) : t(ui.contactForm.copy)}
            </button>
            <a href={`mailto:${contact.email}`} className="btn btn-primary h-9 px-3 text-[13px]">
              {t(ui.contactForm.write)}
            </a>
          </div>
        </div>

        <div className="flex gap-5 text-[14px]">
          <a href={contact.github.url} target="_blank" rel="noopener noreferrer" className="link flex items-center gap-1.5">
            <Icon name="github" size={15} /> {contact.github.handle}
          </a>
          <a href={contact.linkedin.url} target="_blank" rel="noopener noreferrer" className="link flex items-center gap-1.5">
            <Icon name="linkedin" size={15} /> {contact.linkedin.name}
          </a>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex items-start gap-3 p-5"
              role="status"
            >
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
              <p className="text-[16px] leading-[1.5]">{t(contact.sent)}</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4" exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
                <label className="flex flex-col gap-1.5">
                  <span className="t-label text-text-2">{t(ui.contactForm.name)}</span>
                  <input name="name" autoComplete="name" maxLength={80} aria-invalid={errors.includes("name")} className={fieldClass} />
                  {errors.includes("name") ? <span className="text-[12.5px] text-danger">{t(ui.contactForm.errors.name)}</span> : null}
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="t-label text-text-2">{t(ui.contactForm.email)}</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    aria-invalid={errors.includes("email")}
                    className={fieldClass}
                  />
                  {errors.includes("email") ? <span className="text-[12.5px] text-danger">{t(ui.contactForm.errors.email)}</span> : null}
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="t-label text-text-2">{t(ui.contactForm.message)}</span>
                <textarea
                  name="message"
                  rows={6}
                  maxLength={4000}
                  aria-invalid={errors.includes("message")}
                  className={`${fieldClass} resize-y leading-[1.55]`}
                />
                {errors.includes("message") ? <span className="text-[12.5px] text-danger">{t(ui.contactForm.errors.message)}</span> : null}
              </label>
              {/* Campo trampa para bots: invisible para personas. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              {status === "error" && errorKind ? (
                <p className="text-[14px] text-danger" role="alert">
                  {errorKind === "rate" ? (
                    t(ui.contactForm.errors.rate)
                  ) : (
                    <>
                      {t(ui.contactForm.errors.generic)}{" "}
                      <a className="underline" href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                      .
                    </>
                  )}
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary w-max" disabled={status === "sending"}>
                {status === "sending" ? t(ui.contactForm.sending) : t(ui.contactForm.send)}
                <span aria-hidden="true">→</span>
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
