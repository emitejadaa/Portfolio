import { Github, Linkedin, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { contactContent, socialLinks } from "@/data/portfolio";

export function Contact() {
  return (
    <section
      id="contact"
      className="grid gap-10 rounded-3xl border border-black/5 bg-white/70 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.03] lg:grid-cols-2"
    >
      <div className="space-y-6">
        <SectionHeading label="Contacto" eyebrow="Construyamos algo" />
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          {contactContent.copy}
        </p>
        <div className="rounded-2xl border border-black/5 bg-white/60 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300">
          <p className="font-semibold text-zinc-900 dark:text-white">
            {contactContent.responseTime}
          </p>
          <p className="mt-1">También podés escribirme por cualquiera de estos canales:</p>
        </div>
        <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <Mail size={17} />
            </span>
            <a
              href={`mailto:${socialLinks.email}`}
              className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
            >
              {socialLinks.email}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-500/10 text-zinc-700 dark:text-zinc-100">
              <Github size={17} />
            </span>
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
            >
              github.com/emitejadaa
            </a>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300">
              <Linkedin size={17} />
            </span>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-lg dark:border-white/10 dark:bg-white/[0.02]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
          Enviar mensaje
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">
          Contame sobre tu proyecto
        </h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Recibirás un correo para confirmar el envío. Podés continuar el hilo en
          el canal que prefieras.
        </p>
        <div className="mt-6">
          <ContactForm emailTo={socialLinks.email} />
        </div>
      </div>
    </section>
  );
}
