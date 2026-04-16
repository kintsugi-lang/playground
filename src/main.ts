import "./styles.css";
import { examples } from "./examples";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching } from "@codemirror/language";
import { kintsugi } from "./lang-kintsugi";
import { kintsugiTheme, kintsugiHighlight } from "./editor-theme";

function $(id: string) {
  return document.getElementById(id)!;
}

let sourceEditor: EditorView;
let outputEditor: EditorView;

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

function createOutputEditor(parent: HTMLElement): EditorView {
  return new EditorView({
    state: EditorState.create({
      doc: "",
      extensions: [
        lineNumbers(),
        EditorState.readOnly.of(true),
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

  sourceEditor = createSourceEditor(sourceMount, examples[0].source);
  outputEditor = createOutputEditor(outputMount);
}

function initExamples() {
  const grid = $("example-grid");

  examples.forEach((ex) => {
    const card = document.createElement("div");
    card.className = "example-card";

    const header = document.createElement("div");
    header.className = "example-card-header";

    const title = document.createElement("h3");
    title.textContent = ex.label;

    const desc = document.createElement("p");
    desc.textContent = ex.desc;

    const badge = document.createElement("span");
    badge.className = "example-badge";
    badge.textContent =
      ex.target === "love2d"
        ? "LOVE2D"
        : ex.target === "playdate"
          ? "Playdate"
          : "Lua 5.4";

    header.appendChild(title);
    header.appendChild(badge);

    const code = document.createElement("pre");
    code.className = "example-code";
    const codeInner = document.createElement("code");
    codeInner.textContent = ex.source;
    code.appendChild(codeInner);

    const footer = document.createElement("div");
    footer.className = "example-card-footer";
    const tryLink = document.createElement("a");
    tryLink.href = "#try";
    tryLink.className = "example-try";
    tryLink.textContent = "Try in playground";
    tryLink.addEventListener("click", () => {
      setEditorContent(sourceEditor, ex.source);
      (document.getElementById("target-select") as HTMLSelectElement).value =
        ex.target;
      setEditorContent(outputEditor, "");
    });
    footer.appendChild(tryLink);

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(code);
    card.appendChild(footer);

    grid.appendChild(card);
  });
}

function initCompile() {
  $("compile-btn").addEventListener("click", () => {
    const source = sourceEditor.state.doc.toString();
    const target = (
      document.getElementById("target-select") as HTMLSelectElement
    ).value;
    setEditorContent(outputEditor, "");
    try {
      setEditorContent(outputEditor, window.kintsugiCompile(source, target));
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
    $("version").textContent = "v" + window.kintsugiVersion();
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
