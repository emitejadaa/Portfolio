"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { identity } from "@/content/profile";
import { ReadmeContext } from "../readme-context";
import { useLocale } from "../i18n";
import { useOS, useOSStore } from "../store";
import { complete, prettyPath, runLine, type Ctx, type Line } from "./commands";

type Entry = { id: number; kind: "out"; line: Line } | { id: number; kind: "cmd"; prompt: string; text: string };
type Mode = { type: "shell" } | { type: "password"; onDone: (pw: string) => void } | { type: "editor"; name: string };

const HOME = "/home/visitante";
let entryId = 0;
// Doc: "exit repetido 3 veces". Counted across terminal sessions, not per window.
const exitCounter = { count: 0 };

function welcome(locale: "es" | "en"): Entry[] {
  return [
    { id: ++entryId, kind: "out", line: { text: `${identity.systemName} · terminal`, tone: "muted" } },
    {
      id: ++entryId,
      kind: "out",
      line: {
        text: locale === "es" ? "Escribí `help` para ver los comandos. Tab autocompleta." : "Type `help` to see the commands. Tab completes.",
        tone: "muted",
      },
    },
  ];
}

/** X·01 Terminal secreta: se abre con ` o escribiendo "tejada" en cualquier lado. */
export function TerminalApp() {
  const store = useOSStore();
  const locale = useLocale();
  const focused = useOS((s) => s.focused === "terminal");
  const readme = useContext(ReadmeContext);
  const [entries, setEntries] = useState<Entry[]>(() => welcome(locale));
  const [value, setValue] = useState("");
  const [cwd, setCwd] = useState(HOME);
  const [mode, setMode] = useState<Mode>({ type: "shell" });
  const [busy, setBusy] = useState(false);
  const history = useRef<string[]>([]);
  const histIdx = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prompt = `visitante@${identity.systemName} ${prettyPath(cwd)} %`;

  const print = useCallback((lines: Line | Line[]) => {
    const list = Array.isArray(lines) ? lines : [lines];
    setEntries((e) => [...e, ...list.map((line) => ({ id: ++entryId, kind: "out" as const, line }))]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, mode]);

  useEffect(() => {
    if (focused && mode.type !== "editor") inputRef.current?.focus({ preventScroll: true });
  }, [focused, mode]);

  const ctx: Ctx = useMemo(
    () => ({
      store,
      locale,
      cwd,
      setCwd,
      history: () => history.current,
      print,
      clear: () => setEntries([]),
      close: () => store.getState().closeWindow("terminal"),
      openEditor: (name) => setMode({ type: "editor", name }),
      askPassword: (onDone) => setMode({ type: "password", onDone }),
      exits: () => exitCounter,
      readme: readme?.markdown ?? null,
    }),
    [store, locale, cwd, print, readme],
  );

  const submit = async () => {
    if (mode.type === "password") {
      const done = mode.onDone;
      setEntries((e) => [...e, { id: ++entryId, kind: "out", line: { text: `[sudo] ${locale === "es" ? "contraseña para" : "password for"} visitante: ••••••`, tone: "muted" } }]);
      setValue("");
      setMode({ type: "shell" });
      done(value);
      return;
    }
    const line = value;
    setValue("");
    histIdx.current = null;
    setEntries((e) => [...e, { id: ++entryId, kind: "cmd", prompt, text: line }]);
    if (!line.trim()) return;
    history.current.push(line);
    setBusy(true);
    try {
      await runLine(line, ctx);
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Async commands (git log, ping) finish first; the input keeps focus meanwhile.
      if (!busy) void submit();
    } else if (e.key === "ArrowUp" && mode.type === "shell") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      histIdx.current = histIdx.current === null ? h.length - 1 : Math.max(0, histIdx.current - 1);
      setValue(h[histIdx.current] ?? "");
    } else if (e.key === "ArrowDown" && mode.type === "shell") {
      e.preventDefault();
      const h = history.current;
      if (histIdx.current === null) return;
      histIdx.current = histIdx.current + 1;
      if (histIdx.current >= h.length) {
        histIdx.current = null;
        setValue("");
      } else setValue(h[histIdx.current] ?? "");
    } else if (e.key === "Tab" && mode.type === "shell") {
      e.preventDefault();
      const r = complete(value, cwd);
      setValue(r.line);
      if (r.options.length > 1) {
        setEntries((en) => [
          ...en,
          { id: ++entryId, kind: "cmd", prompt, text: value },
          { id: ++entryId, kind: "out", line: { text: r.options.join("  "), tone: "muted" } },
        ]);
      }
    } else if ((e.key === "l" || e.key === "L") && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if ((e.key === "c" || e.key === "C") && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      setEntries((en) => [...en, { id: ++entryId, kind: "cmd", prompt, text: `${value}^C` }]);
      setValue("");
      if (mode.type === "password") setMode({ type: "shell" });
    } else if (e.key === "`" && value === "") {
      e.preventDefault();
      store.getState().closeWindow("terminal");
    }
  };

  if (mode.type === "editor") {
    return <FakeEditor name={mode.name} locale={locale} onExit={() => setMode({ type: "shell" })} />;
  }

  return (
    <div
      ref={scrollRef}
      className="terminal scroll-area h-full cursor-text px-4 py-3 font-mono text-[13px] leading-[1.6]"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      {entries.map((en) =>
        en.kind === "cmd" ? (
          <div key={en.id} className="break-all whitespace-pre-wrap">
            <span className="text-accent daylight:text-[var(--klein)]">{en.prompt}</span> <span>{en.text}</span>
          </div>
        ) : (
          <OutLine key={en.id} line={en.line} />
        ),
      )}
      <div className="flex items-baseline gap-2">
        {mode.type === "password" ? (
          <span className="text-text-2">[sudo] {locale === "es" ? "contraseña para" : "password for"} visitante:</span>
        ) : (
          <span className="shrink-0 text-accent daylight:text-[var(--klein)]">{prompt}</span>
        )}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          type={mode.type === "password" ? "password" : "text"}
          aria-busy={busy}
          aria-label={locale === "es" ? "Comando" : "Command"}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-text caret-accent outline-none focus-visible:outline-none daylight:caret-[var(--klein)]"
        />
      </div>
    </div>
  );
}

function OutLine({ line }: { line: Line }) {
  const tone =
    line.tone === "muted"
      ? "text-text-2"
      : line.tone === "error"
        ? "text-danger"
        : line.tone === "accent"
          ? "text-accent daylight:text-[var(--klein)]"
          : line.tone === "ok"
            ? "text-ok"
            : "text-text";
  if (line.href) {
    return (
      <a href={line.href} target="_blank" rel="noopener noreferrer" className={`block break-all whitespace-pre-wrap hover:underline ${tone}`}>
        {line.text}
      </a>
    );
  }
  if (line.action) {
    return (
      <button type="button" onClick={line.action} className={`block w-full text-left break-all whitespace-pre-wrap hover:underline ${tone}`}>
        {line.text}
      </button>
    );
  }
  return <div className={`break-words whitespace-pre-wrap ${tone}`}>{line.text}</div>;
}

/** vim / nano falsos: no se puede salir hasta escribir :q */
function FakeEditor({ name, locale, onExit }: { name: string; locale: "es" | "en"; onExit: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cmd, setCmd] = useState<string | null>(null);
  const [msg, setMsg] = useState(
    locale === "es" ? "Tip: para salir hay que escribir :q (como en la vida real)." : "Tip: to quit you have to type :q (just like real life).",
  );

  useEffect(() => ref.current?.focus(), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation(); // ni Esc ni ⌘K salen de acá
    if (e.metaKey && e.key.toLowerCase() !== "k") return;
    e.preventDefault();
    if (e.ctrlKey && e.key.toLowerCase() === "x") {
      setMsg(locale === "es" ? "Ja. Acá se sale con :q" : "Ha. Here you quit with :q");
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      setMsg(locale === "es" ? "Escribí :q y Enter para salir." : "Type :q and Enter to quit.");
      return;
    }
    if (cmd === null) {
      if (e.key === ":") setCmd("");
      else if (e.key === "Escape") setMsg("-- NORMAL --");
      else if (e.key.length === 1) setMsg(locale === "es" ? "-- SOLO LECTURA -- (escribí :q para salir)" : "-- READ ONLY -- (type :q to quit)");
      return;
    }
    if (e.key === "Escape") setCmd(null);
    else if (e.key === "Backspace") setCmd((c) => (c && c.length ? c.slice(0, -1) : null));
    else if (e.key === "Enter") {
      const c = cmd.trim();
      if (["q", "q!", "wq", "x", "wq!", "qa", "qa!"].includes(c)) {
        onExit();
        return;
      }
      setMsg(`E492: ${locale === "es" ? "No es un comando del editor" : "Not an editor command"}: ${c}`);
      setCmd(null);
    } else if (e.key.length === 1) setCmd((c) => (c ?? "") + e.key);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="flex h-full flex-col font-mono text-[13px] leading-[1.6] outline-none"
      aria-label={name}
      role="textbox"
      aria-readonly="true"
    >
      {name === "nano" ? (
        <div className="flex justify-between bg-text px-3 text-bg">
          <span>GNU nano 8.1</span>
          <span>sobre-mi.txt</span>
          <span />
        </div>
      ) : null}
      <div className="flex-1 overflow-hidden px-3 pt-1">
        {name === "nano" ? (
          <p className="text-text">{locale === "es" ? "Soy Emiliano Tejada. Este archivo es de solo lectura." : "I'm Emiliano Tejada. This file is read-only."}</p>
        ) : (
          <p className="text-text">
            ~ <span className="text-text-2">{locale === "es" ? "VIM — Vi IMproved · tejada.os" : "VIM — Vi IMproved · tejada.os"}</span>
          </p>
        )}
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i} className="text-accent/70 daylight:text-[var(--klein)]">
            ~
          </p>
        ))}
      </div>
      {name === "nano" ? (
        <div className="grid grid-cols-4 gap-x-4 px-3 py-1 text-[12px] text-text-2">
          <span>^X {locale === "es" ? "Salir" : "Exit"}</span>
          <span>^O {locale === "es" ? "Guardar" : "Write Out"}</span>
          <span>^W {locale === "es" ? "Buscar" : "Where Is"}</span>
          <span>^K {locale === "es" ? "Cortar" : "Cut"}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-line px-3 py-1 daylight:border-[var(--tinta)]">
        <span className={cmd !== null ? "text-text" : "text-text-2"}>{cmd !== null ? `:${cmd}` : msg}</span>
        <span className="text-text-2">{name === "nano" ? "" : "0,0-1  All"}</span>
      </div>
    </div>
  );
}
