import "./styles.css";
import { examples } from "./examples";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, StreamLanguage, LanguageSupport } from "@codemirror/language";
import { kintsugi } from "./lang-kintsugi";
import { kintsugiTheme, kintsugiHighlight } from "./editor-theme";
// @ts-ignore - vendored CodeMirror legacy mode
import { lua as luaMode } from "../vendor/lua.js";

function $(id: string) {
  return document.getElementById(id)!;
}

let sourceEditor: EditorView;
let outputEditor: EditorView;
let preludeEditor: EditorView;

function createSourceEditor(parent: HTMLElement, doc: string): EditorView {
  return new EditorView({
    state: EditorState.create({
      doc,
      extensions: [
        lineNumbers(),
        history(),
        bracketMatching(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        kintsugi(),
        kintsugiTheme,
        kintsugiHighlight,
        EditorView.lineWrapping,
      ],
    }),
    parent,
  });
}

const luaLang = new LanguageSupport(StreamLanguage.define(luaMode));

function createOutputEditor(parent: HTMLElement): EditorView {
  return new EditorView({
    state: EditorState.create({
      doc: "",
      extensions: [
        lineNumbers(),
        EditorState.readOnly.of(true),
        luaLang,
        kintsugiTheme,
        kintsugiHighlight,
        EditorView.lineWrapping,
      ],
    }),
    parent,
  });
}

function setEditorContent(view: EditorView, content: string) {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: content },
  });
}

function initEditors() {
  const sourceMount = $("source-editor");
  const outputMount = $("output-editor");
  const preludeMount = $("prelude-editor");

  sourceEditor = createSourceEditor(sourceMount, examples[0].source);
  outputEditor = createOutputEditor(outputMount);
  preludeEditor = createOutputEditor(preludeMount);
}

function createSnippetEditor(parent: HTMLElement, doc: string): EditorView {
  return new EditorView({
    state: EditorState.create({
      doc,
      extensions: [
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        kintsugi(),
        kintsugiTheme,
        kintsugiHighlight,
      ],
    }),
    parent,
  });
}

function initExamples() {
  const grid = $("example-grid");
  const cards: HTMLElement[] = [];

  // Build the mobile dropdown
  const select = document.createElement("select");
  select.className = "example-mobile-select";
  examples.forEach((ex, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = ex.label;
    select.appendChild(opt);
  });
  grid.parentElement!.insertBefore(select, grid);

  examples.forEach((ex, i) => {
    const card = document.createElement("div");
    card.className = "example-card" + (i === 0 ? " mobile-active" : "");
    card.dataset.index = String(i);
    cards.push(card);

    const header = document.createElement("div");
    header.className = "example-card-header";

    const dot = document.createElement("span");
    dot.className = "pane-dot dot-gold";

    const titleWrap = document.createElement("div");
    titleWrap.className = "example-card-title";

    const title = document.createElement("span");
    title.className = "pane-title";
    title.textContent = ex.label;

    titleWrap.appendChild(dot);
    titleWrap.appendChild(title);

    const badge = document.createElement("span");
    badge.className = "example-badge";
    badge.textContent =
      ex.target === "love2d"
        ? "LÖVE"
        : ex.target === "playdate"
          ? "Playdate"
          : "Lua 5.4";

    const headerRight = document.createElement("div");
    headerRight.className = "example-card-actions";

    const playBtn = document.createElement("a");
    playBtn.href = "#try";
    playBtn.className = "example-play";
    playBtn.title = "Try in playground";
    playBtn.textContent = "\u25B6";
    playBtn.addEventListener("click", () => {
      setEditorContent(sourceEditor, ex.source);
      (document.getElementById("target-select") as HTMLSelectElement).value =
        ex.target;
      setEditorContent(outputEditor, "");
      setEditorContent(preludeEditor, "");
    });

    headerRight.appendChild(badge);
    headerRight.appendChild(playBtn);

    header.appendChild(titleWrap);
    header.appendChild(headerRight);

    const codeMount = document.createElement("div");
    codeMount.className = "example-cm";

    card.appendChild(header);
    card.appendChild(codeMount);

    grid.appendChild(card);

    createSnippetEditor(codeMount, ex.snippet);
  });

  select.addEventListener("change", () => {
    const idx = parseInt(select.value, 10);
    cards.forEach((c, i) => {
      c.classList.toggle("mobile-active", i === idx);
    });
  });
}

function initCompile() {
  $("compile-btn").addEventListener("click", () => {
    const source = sourceEditor.state.doc.toString();
    const target = (
      document.getElementById("target-select") as HTMLSelectElement
    ).value;
    setEditorContent(outputEditor, "");
    setEditorContent(preludeEditor, "");
    try {
      const raw = window.kintsugiCompile(source, target);
      const result = JSON.parse(raw) as KintsugiCompileResult;
      if (result.error) {
        setEditorContent(outputEditor, "-- Error: " + result.error);
        return;
      }
      setEditorContent(
        preludeEditor,
        result.prelude || "-- (empty - program uses no helpers)",
      );
      setEditorContent(outputEditor, result.source);
    } catch (e) {
      setEditorContent(
        outputEditor,
        "-- JS Error: " + (e instanceof Error ? e.message : String(e)),
      );
    }
  });
}

function initVersion() {
  try {
    const ver = window.kintsugiVersion();
    const codename = window.kintsugiCodename();
    const buildDate = window.kintsugiBuildDate();
    let s = ver;
    if (codename) s += ' - "' + codename + '"';
    if (buildDate) {
      const [y, m, d] = buildDate.split("-");
      s += " - released " + m + "/" + d + "/" + y;
    }
    $("version").textContent = s;
  } catch {
    $("version").textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initEditors();
  initExamples();
  initCompile();
  initVersion();
});
