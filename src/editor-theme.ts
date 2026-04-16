import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const bg = "#f4f1e8";
const gutterBg = "#ece8db";
const gutterText = "#9a9585";
const cursor = "#1a3eb8";
const selection = "rgba(26, 62, 184, 0.15)";
const ink = "#2a2520";
const comment = "#9a9585";
const keyword = "#9b2c8a";
const builtin = "#1a3eb8";
const setWord = "#b87514";
const typeName = "#c44b1a";
const atom = "#2a7d3f";
const str = "#2a7d3f";
const number = "#c44b1a";
const bracket = "#7a7568";
const operator = "#2a2520";

export const kintsugiTheme = EditorView.theme(
  {
    "&": {
      color: ink,
      backgroundColor: bg,
      fontSize: "0.82rem",
      fontFamily: '"IBM Plex Mono", "SF Mono", Menlo, monospace',
    },
    ".cm-content": {
      caretColor: cursor,
      lineHeight: "1.75",
      padding: "1rem 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: cursor,
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: selection },
    ".cm-gutters": {
      backgroundColor: gutterBg,
      color: gutterText,
      border: "none",
      borderRight: "1px solid rgba(42, 37, 32, 0.08)",
      minWidth: "3.5em",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(26, 62, 184, 0.08)",
      color: ink,
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(26, 62, 184, 0.04)",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(232, 184, 75, 0.3)",
      outline: "1px solid rgba(200, 149, 38, 0.5)",
    },
  },
  { dark: false },
);

export const kintsugiHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: keyword, fontWeight: "500" },
    { tag: tags.variableName, color: ink },
    { tag: [tags.definition(tags.variableName)], color: setWord },
    { tag: [tags.special(tags.variableName)], color: builtin },
    { tag: tags.typeName, color: typeName },
    { tag: tags.atom, color: atom },
    { tag: tags.number, color: number },
    { tag: tags.string, color: str },
    { tag: tags.meta, color: keyword, fontStyle: "italic" },
    { tag: tags.lineComment, color: comment, fontStyle: "italic" },
    { tag: tags.bracket, color: bracket },
    { tag: tags.operator, color: operator },
  ]),
);
