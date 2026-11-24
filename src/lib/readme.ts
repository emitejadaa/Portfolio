import "server-only";
import { Marked, type Tokens } from "marked";
import type { ReadmeResponse } from "./api-types";

const README_URL = "https://raw.githubusercontent.com/emitejadaa/emitejadaa/main/README.md";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const safeUrl = (href: string) => (/^(https?:|mailto:|#)/i.test(href.trim()) ? href.trim() : "#");

/** Markdown → HTML with raw HTML escaped and only http(s)/mailto URLs. */
const md = new Marked({
  gfm: true,
  async: false,
  renderer: {
    html(token: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(token.text);
    },
    link(token: Tokens.Link) {
      const text = this.parser.parseInline(token.tokens);
      const href = safeUrl(token.href);
      const external = /^https?:/i.test(href);
      return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
    },
    image(token: Tokens.Image) {
      const href = safeUrl(token.href);
      if (!/^https:/i.test(href)) return "";
      return `<img src="${escapeHtml(href)}" alt="${escapeHtml(token.text)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`;
    },
  },
});

export type Readme = ReadmeResponse | null;

/** Read from raw.githubusercontent.com and kept in the data cache for a day (served by /api/readme). */
export async function getReadme(): Promise<Readme> {
  try {
    const res = await fetch(README_URL, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const markdown = await res.text();
    const html = md.parse(markdown) as string;
    return { html, markdown };
  } catch {
    return null;
  }
}
