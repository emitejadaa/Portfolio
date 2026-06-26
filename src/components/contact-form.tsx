"use client";

import { FormEvent, useRef, useState } from "react";

type Form = { name: string; email: string; message: string };
type Errs = Partial<Record<keyof Form, string>>;
type Status = "idle" | "sending" | "sent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const empty: Form = { name: "", email: "", message: "" };

export function ContactForm({ emailTo }: { emailTo: string }) {
  const [form, setForm] = useState<Form>(empty);
  const [errs, setErrs] = useState<Errs>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [key]: v }));
    setErrs((er) => ({ ...er, [key]: "" }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const next: Errs = {};
    if (!form.name.trim()) next.name = "Ingresá tu nombre";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Ingresá un email válido";
    if (form.message.trim().length < 10) next.message = "Contame un poco más (mín. 10 caracteres)";
    if (Object.keys(next).length) {
      setErrs(next);
      return;
    }

    // Open the user's mail client with the message prefilled (real, no backend).
    const subject = encodeURIComponent("Nuevo contacto desde el portfolio");
    const body = encodeURIComponent(
      `Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;

    const first = form.name.trim().split(" ")[0];
    setErrs({});
    setStatus("sending");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSentName(first);
      setStatus("sent");
    }, 700);
  };

  const reset = () => {
    setForm(empty);
    setErrs({});
    setStatus("idle");
    setSentName("");
  };

  if (status === "sent") {
    return (
      <div
        className="et-detail-in"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: 340,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "color-mix(in srgb, var(--accent) 18%, transparent)",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            fontSize: 30,
            marginBottom: 20,
          }}
        >
          ✓
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 21, fontWeight: 600 }}>Casi listo, {sentName}</h3>
        <p style={{ margin: "0 0 22px", color: "var(--muted)", fontSize: 15, lineHeight: 1.55, maxWidth: "32ch" }}>
          Abrí tu cliente de correo con el mensaje cargado. Revisalo y tocá enviar; te respondo en
          menos de 48 horas.
        </p>
        <button
          data-cursor=""
          onClick={reset}
          className="et-btn et-btn-ghost font-mono"
          style={{ padding: "11px 20px", borderRadius: 11, fontSize: 13, fontWeight: 500 }}
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="font-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 2 }}>
        // FORMULARIO
      </div>

      <Field
        label="NOMBRE"
        error={errs.name}
        input={
          <input
            className="et-field"
            value={form.name}
            onChange={update("name")}
            placeholder="Tu nombre"
            autoComplete="name"
            aria-invalid={!!errs.name}
          />
        }
      />
      <Field
        label="EMAIL"
        error={errs.email}
        input={
          <input
            className="et-field"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="tu@email.com"
            autoComplete="email"
            aria-invalid={!!errs.email}
          />
        }
      />
      <Field
        label="MENSAJE"
        error={errs.message}
        input={
          <textarea
            className="et-field"
            rows={4}
            value={form.message}
            onChange={update("message")}
            placeholder="Contame sobre tu proyecto o idea…"
            aria-invalid={!!errs.message}
            style={{ resize: "vertical", minHeight: 108 }}
          />
        }
      />

      <button
        data-cursor=""
        type="submit"
        disabled={status === "sending"}
        className="et-btn et-btn-primary"
        style={{ marginTop: 4, width: "100%", opacity: status === "sending" ? 0.85 : 1 }}
      >
        {status === "sending" ? "Enviando…" : "Enviar mensaje →"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted)" }}>
        {label}
      </span>
      {input}
      {error && (
        <span className="font-mono" style={{ fontSize: 11, color: "var(--danger)" }}>
          {error}
        </span>
      )}
    </label>
  );
}
