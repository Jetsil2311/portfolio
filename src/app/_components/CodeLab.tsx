// CODEHER's language, playable. The editor is built here; everything behind it
// is the production interpreter (_lib/pseudo), running in a Web Worker exactly
// as it does for students: compile errors while you type, a run with a step
// and time budget (try "Never ends"), statement-by-statement stepping with live
// variables, Leer asking for input, and errors explained in Spanish.

"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, StepForward } from "lucide-react";
import { lex } from "@/app/_lib/pseudo/lexer";
import { PSEUDO_ERRORS, fillTemplate } from "@/app/_lib/pseudo/errors_es";
import type { Diagnostic, RawError, VariableSnapshot } from "@/app/_lib/pseudo/core";
import type { PseudoWorkerRequest, PseudoWorkerResponse } from "@/app/_lib/pseudo/worker-handler";

const PRESETS = [
  {
    id: "futuro",
    label: "Hello",
    file: "mi_futuro.pseudo",
    hint: "The program from CODEHER's home page.",
    code: `Proceso MiFuturo
    Definir sueno Como Caracter;
    sueno <- "crear tecnología";
    Si sueno <> "" Entonces
        Escribir "Yo puedo ", sueno;
    FinSi
FinProceso`,
  },
  {
    id: "suma",
    label: "Loop",
    file: "suma.pseudo",
    hint: "Press Step and watch total change.",
    code: `Proceso Suma
    Definir total, i Como Entero;
    total <- 0;
    Para i <- 1 Hasta 5 Hacer
        total <- total + i;
    FinPara
    Escribir "La suma es ", total;
FinProceso`,
  },
  {
    id: "leer",
    label: "Asks you",
    file: "saludo.pseudo",
    hint: "Leer stops the program and waits for you.",
    code: `Proceso Saludo
    Definir nombre Como Caracter;
    Escribir "¿Cómo te llamas?";
    Leer nombre;
    Escribir "Hola, ", nombre, ". Tú puedes.";
FinProceso`,
  },
  {
    id: "error",
    label: "Broken",
    file: "con_error.pseudo",
    hint: "A missing FinSi. See how it's explained to a 12-year-old.",
    code: `Proceso ConError
    Definir edad Como Entero;
    edad <- 13;
    Si edad >= 12 Entonces
        Escribir "Ya puedes entrar";
FinProceso`,
  },
  {
    id: "infinito",
    label: "Never ends",
    file: "sin_fin.pseudo",
    hint: "An endless loop can't freeze the page. It runs off the main thread, with a budget.",
    code: `Proceso SinFin
    Definir n Como Entero;
    n <- 0;
    Mientras n >= 0 Hacer
        n <- n + 1;
    FinMientras
FinProceso`,
  },
];

const TOKEN_COLOR: Record<string, string> = {
  kw: "#c9a7ff",
  str: "#00f5d4",
  num: "#fee440",
  op: "#f15bb5",
};

type Status = "idle" | "running" | "stepping" | "input" | "done" | "error";

// One array of colored spans per source line, from CODEHER's own lexer.
function highlight(code: string) {
  const lines = code.split("\n");
  const { tokens } = lex(code);
  return lines.map((text, index) => {
    const spans: { text: string; color?: string }[] = [];
    let cursor = 0;
    for (const token of tokens) {
      if (token.line !== index + 1 || token.t === "nl" || token.t === "eof") continue;
      const start = token.col - 1;
      const end = token.endCol - 1;
      if (start < cursor) continue;
      if (start > cursor) spans.push({ text: text.slice(cursor, start) });
      spans.push({ text: text.slice(start, end), color: TOKEN_COLOR[token.t] });
      cursor = end;
    }
    if (cursor < text.length) spans.push({ text: text.slice(cursor), color: text.slice(cursor).trimStart().startsWith("//") ? "#8f86ad" : undefined });
    return spans;
  });
}

// While typing, the linter only reports the line, not every template value. A
// sentence with a value we don't have is left out rather than shown with a gap.
function explain(error: RawError) {
  const template = PSEUDO_ERRORS[error.type];
  if (!template) return null;
  const params = { ...(error.line ? { line: error.line } : {}), ...error.params };
  const fill = (text: string) =>
    [...text.matchAll(/\{(\w+)\}/g)].every((match) => match[1] in params) ? fillTemplate(text, params) : null;
  return { explanation: fill(template.explanation), suggestion: fill(template.suggestion) };
}

function show(value: unknown) {
  if (typeof value === "boolean") return value ? "Verdadero" : "Falso";
  if (value === undefined || value === null) return "sin valor";
  return typeof value === "string" ? `"${value}"` : String(value);
}

export default function CodeLab() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [code, setCode] = useState(PRESETS[0].code);
  const [status, setStatus] = useState<Status>("idle");
  const [output, setOutput] = useState("");
  const [line, setLine] = useState<number | null>(null);
  const [variables, setVariables] = useState<VariableSnapshot>({});
  const [error, setError] = useState<RawError | null>(null);
  const [lint, setLint] = useState<Diagnostic[]>([]);
  const [answer, setAnswer] = useState("");

  const root = useRef<HTMLDivElement>(null);
  const worker = useRef<Worker | null>(null);
  const runId = useRef("");
  const lintId = useRef("");
  const counter = useRef(0);
  const highlightLayer = useRef<HTMLDivElement>(null);
  const answerInput = useRef<HTMLInputElement>(null);
  const editorId = useId();

  const preset = PRESETS.find((p) => p.id === presetId);
  const lines = useMemo(() => highlight(code), [code]);
  const nextId = () => `r${++counter.current}`;

  const onMessage = useCallback((event: MessageEvent<PseudoWorkerResponse>) => {
    const message = event.data;
    if (message.type === "linted" && message.id === lintId.current) {
      setLint(message.diagnostics);
      return;
    }
    if (message.type !== "event" || message.id !== runId.current) return;
    const ev = message.event;
    switch (ev.type) {
      case "compileError":
        setError(ev.error);
        setLine(ev.error.line);
        setStatus("error");
        break;
      case "paused":
        setOutput(ev.output);
        setLine(ev.line);
        break;
      case "step":
        setOutput(ev.output);
        setLine(ev.line);
        setVariables(ev.variables);
        setStatus("stepping");
        break;
      case "needInput":
        setOutput(ev.output);
        setLine(ev.line);
        setVariables(ev.variables);
        setStatus("input");
        break;
      case "done":
        setOutput(ev.output);
        setVariables(ev.variables);
        setLine(null);
        setStatus("done");
        break;
      case "error":
        setOutput(ev.output);
        setVariables(ev.variables);
        setError(ev.error);
        setLine(ev.error.line);
        setStatus("error");
        break;
    }
  }, []);

  const send = useCallback(
    (message: PseudoWorkerRequest) => {
      if (!worker.current) {
        worker.current = new Worker(new URL("../_lib/pseudo/worker.ts", import.meta.url));
        worker.current.onmessage = onMessage;
      }
      worker.current.postMessage(message);
    },
    [onMessage],
  );

  const start = useCallback(
    (type: "run" | "debug", source: string) => {
      const id = nextId();
      runId.current = id;
      setError(null);
      setOutput("");
      setVariables({});
      setLine(null);
      setAnswer("");
      setStatus("running");
      send({ type, id, code: source, ...(type === "run" ? { timeoutMs: 3000 } : {}) });
    },
    [send],
  );

  // First run when it nears the screen, so the worker only loads for people who get here.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start("run", PRESETS[0].code);
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      worker.current?.terminate();
      worker.current = null;
    };
  }, [start]);

  // Checks the code while typing, like the real editor.
  useEffect(() => {
    if (!worker.current) return;
    const timer = window.setTimeout(() => {
      const id = nextId();
      lintId.current = id;
      send({ type: "lint", id, code });
    }, 220);
    return () => window.clearTimeout(timer);
  }, [code, send]);

  useEffect(() => {
    if (status === "input") answerInput.current?.focus({ preventScroll: true });
  }, [status]);

  function choose(id: string) {
    const next = PRESETS.find((p) => p.id === id);
    if (!next) return;
    setPresetId(id);
    setCode(next.code);
    setLint([]);
    start("run", next.code);
  }

  function edit(value: string) {
    setCode(value);
    setPresetId("");
    runId.current = "";
    setStatus("idle");
    setLine(null);
    setError(null);
  }

  function step() {
    if (status === "stepping") send({ type: "step", id: runId.current });
    else start("debug", code);
  }

  function submitAnswer(event: React.FormEvent) {
    event.preventDefault();
    send({ type: "input", id: runId.current, value: answer });
    setAnswer("");
    setStatus("running");
  }

  const lintLines = new Set(lint.map((d) => d.line));
  const errorLine = error?.line ?? null;
  const shownError = error ?? (status === "idle" && lint[0] ? { type: lint[0].code, message: lint[0].message, line: lint[0].line } : null);
  const help = shownError ? explain(shownError) : null;
  const names = Object.keys(variables);

  return (
    <div ref={root} className="grid gap-4 lg:grid-cols-12">
      {/* editor */}
      <div className="glass-panel overflow-hidden rounded-[1.5rem] bg-[#1a1036] [--glass-fill:#1a1036f0] lg:col-span-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-[#f15bb5]" />
            <span className="size-3 rounded-full bg-[#fee440]" />
            <span className="size-3 rounded-full bg-[#00f5d4]" />
          </div>
          <label htmlFor={editorId} className="font-ch-mono text-xs text-white/70">
            {preset?.file ?? "tu_programa.pseudo"}
          </label>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={step} className="glass glass-faux inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 font-ch text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <StepForward className="size-4" aria-hidden />
              {status === "stepping" ? "Next step" : "Step"}
            </button>
            <button type="button" onClick={() => start("run", code)} className="glass glass-faux glass-tint inline-flex h-10 items-center gap-1.5 rounded-full px-4 font-ch text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Play className="size-4" aria-hidden />
              Run
            </button>
          </div>
        </div>

        <div className="relative h-72 overflow-hidden font-ch-mono text-[0.8125rem] leading-6 sm:h-80 sm:text-sm sm:leading-6">
          <div ref={highlightLayer} aria-hidden className="pointer-events-none absolute top-0 left-0 min-w-full py-4 whitespace-pre text-white">
            {lines.map((spans, i) => {
              const number = i + 1;
              const isError = errorLine === number || (status === "idle" && lintLines.has(number));
              const isActive = !isError && line === number;
              return (
                <div key={i} className={`flex h-6 pr-5 ${isError ? "bg-[#ff5c7a33]" : isActive ? "bg-[#f15bb540]" : ""}`}>
                  <span className={`w-10 shrink-0 pr-3 text-right select-none ${isError ? "text-[#ff8fa3]" : isActive ? "text-[#f15bb5]" : "text-white/35"}`}>{number}</span>
                  <span>
                    {spans.map((span, j) => (
                      <span key={j} style={span.color ? { color: span.color } : undefined}>{span.text}</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
          <textarea
            id={editorId}
            value={code}
            onChange={(event) => edit(event.target.value)}
            onScroll={(event) => {
              const { scrollTop, scrollLeft } = event.currentTarget;
              if (highlightLayer.current) highlightLayer.current.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            className="absolute inset-0 size-full resize-none overflow-auto bg-transparent py-4 pr-5 pl-10 whitespace-pre text-transparent caret-white outline-none selection:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-inset"
          />
        </div>
      </div>

      {/* output */}
      <div className="flex flex-col gap-4 lg:col-span-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Example programs">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={presetId === p.id}
              onClick={() => choose(p.id)}
              className={`glass inline-flex h-10 items-center rounded-full px-3.5 font-ch text-sm font-semibold focus-ring ${presetId === p.id ? "glass-tint" : "text-ink"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="min-h-[1.5em] font-ch text-[0.9375rem] text-muted">{preset?.hint ?? "Your code. It's checked as you type."}</p>

        <div className="glass-dark flex min-h-48 flex-1 flex-col gap-3 rounded-[1.5rem] p-5 font-ch-mono text-sm leading-relaxed text-white" aria-live="polite">
          <div>
            <p className="mb-1 text-xs text-white/55">salida</p>
            <pre className="font-ch-mono break-words whitespace-pre-wrap text-[#00f5d4]">{output || (status === "running" ? "…" : " ")}</pre>
          </div>

          {status === "input" && (
            <form onSubmit={submitAnswer} className="flex gap-2">
              <label className="sr-only" htmlFor={`${editorId}-answer`}>Your answer</label>
              <input
                ref={answerInput}
                id={`${editorId}-answer`}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Escribe aquí"
                className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 font-ch text-white ring-1 ring-white/25 outline-none placeholder:text-white/55 focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="glass glass-faux glass-tint inline-flex h-10 items-center rounded-full px-4 font-ch font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Send
              </button>
            </form>
          )}

          {names.length > 0 && !shownError && (
            <dl className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-xs sm:grid-cols-3">
              {names.map((name) => (
                <div key={name} className="min-w-0">
                  <dt className="truncate text-white/55">{name} <span className="text-white/35">{variables[name].type}</span></dt>
                  <dd className="mt-0.5 truncate text-sm text-[#fee440]">{show(variables[name].value)}</dd>
                </div>
              ))}
            </dl>
          )}

          {shownError && (
            <div className="rounded-2xl bg-[#ff5c7a24] p-4 font-ch ring-1 ring-[#ff8fa366] ring-inset">
              <p className="font-bold">{shownError.message}</p>
              {help && (
                <>
                  {help.explanation && <p className="mt-1.5 text-[0.9375rem] text-white/85">{help.explanation}</p>}
                  {help.suggestion && <p className="mt-1.5 text-[0.9375rem] text-[#fee440]">{help.suggestion}</p>}
                </>
              )}
            </div>
          )}

          {status === "done" && !output && <p className="text-white/70">Listo, sin salida.</p>}
        </div>

        {presetId === "" && (
          <button
            type="button"
            onClick={() => choose(PRESETS[0].id)}
            className="glass inline-flex h-10 items-center gap-2 self-start rounded-full px-3.5 font-ch text-sm font-semibold text-ink focus-ring"
          >
            <RotateCcw className="size-4" aria-hidden />
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
