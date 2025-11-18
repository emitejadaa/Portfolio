"use client";

import { FormEvent, useState } from "react";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  message: "",
};

type ContactFormProps = {
  emailTo: string;
};

export function ContactForm({ emailTo }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = `Nuevo contacto desde el portfolio`;
    const body = `Nombre: ${form.name}%0AEmail: ${form.email}%0AMensaje: ${form.message}`;
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
    setForm(initialState);
    setStatus("success");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nombre
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            placeholder="¿Cómo te llamás?"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            placeholder="tu@email.com"
          />
        </label>
      </div>
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Mensaje
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, message: event.target.value }))
          }
          className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          placeholder="Contame sobre tu proyecto o idea"
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 md:w-auto"
      >
        Enviar mensaje
      </button>
      {status === "success" && (
        <p className="text-sm text-emerald-500">
          ¡Gracias! Abrí tu cliente de correo para finalizar el envío.
        </p>
      )}
    </form>
  );
}
