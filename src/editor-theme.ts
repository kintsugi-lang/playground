import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const bg = "#070e3a";
const gutterBg = "#0a1548";
const cursor = "#e8b84b";
const selection = "rgba(40, 85, 217, 0.35)";
const cream = "#f4f1e8";
const slate = "#8899cc";
const gold = "#e8b84b";
const blue = "#6eb4ff";
const green = "#7fdb8a";
const orange = "#f0a66e";
const pink = "#e78fbf";
const dimCream = "#c4c0b4";

export const kintsugiTheme = EditorView.theme(
  {
    "&": {
      color: cream,
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
      color: slate,
      border: "none",
      borderRight: "1px solid rgba(184, 196, 232, 0.06)",
      minWidth: "3.5em",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(40, 85, 217, 0.15)",
      color: cream,
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(40, 85, 217, 0.08)",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(232, 184, 75, 0.2)",
      outline: "1px solid rgba(232, 184, 75, 0.4)",
    },
  },
  { dark: true },
);

export const kintsugiHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: pink, fontWeight: "500" },
    { tag: tags.variableName, color: cream },
    { tag: [tags.definition(tags.variableName)], color: gold },
    { tag: [tags.special(tags.variableName)], color: blue },
    { tag: tags.typeName, color: orange },
    { tag: tags.atom, color: green },
    { tag: tags.number, color: orange },
    { tag: tags.string, color: green },
    { tag: tags.meta, color: pink, fontStyle: "italic" },
    { tag: tags.lineComment, color: slate, fontStyle: "italic" },
    { tag: tags.bracket, color: dimCream },
    { tag: tags.operator, color: cream },
  ]),
);
