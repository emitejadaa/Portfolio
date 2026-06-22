import { Github, Linkedin, Mail } from "lucide-react";
import { socialLinks } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  const items = [
    { href: `mailto:${socialLinks.email}`, label: "Email", Icon: Mail },
    { href: socialLinks.github, label: "GitHub", Icon: Github },
    { href: socialLinks.linkedin, label: "LinkedIn", Icon: Linkedin },
  ];

  return (
    <footer className="mx-auto mt-8 max-w-6xl px-6 pb-12 lg:px-10">
      <div className="flex flex-col items-center justify-between gap-6 border-t border-black/5 pt-8 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:flex-row">
        <p>
          © {year} Emiliano Tejada · Hardware · Backend · IA
        </p>
        <div className="flex items-center gap-2">
          {items.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-zinc-600 transition hover:border-emerald-400/60 hover:text-emerald-600 dark:border-white/10 dark:text-zinc-300 dark:hover:text-emerald-300"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
