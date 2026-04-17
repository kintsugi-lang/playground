import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// doom-one-dark palette
const bg = "#282c34";
const bgAlt = "#21242b";
const base4 = "#3f444a";
const base5 = "#5B6268";
const fg = "#bbc2cf";
const cursor = "#51afef";
const selection = "rgba(81, 175, 239, 0.2)";

const blue = "#51afef";
const magenta = "#c678dd";
const green = "#98be65";
const yellow = "#ECBE7B";
const orange = "#da8548";
const violet = "#a9a1e1";
const cyan = "#46D9FF";
const darkCyan = "#5699AF";

export const kintsugiTheme = EditorView.theme(
  {
    "&": {
      color: fg,
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
      backgroundColor: bgAlt,
      color: base5,
      border: "none",
      borderRight: "1px solid " + base4,
      minWidth: "3.5em",
    },
    ".cm-activeLineGutter": {
      backgroundColor: base4,
      color: fg,
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(81, 175, 239, 0.06)",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(81, 175, 239, 0.2)",
      outline: "1px solid rgba(81, 175, 239, 0.4)",
    },
  },
  { dark: true },
);

export const kintsugiHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: blue, fontWeight: "500" },
    { tag: tags.variableName, color: fg },
    { tag: [tags.definition(tags.variableName)], color: "#dcaeea" },
    { tag: [tags.special(tags.variableName)], color: magenta },
    { tag: tags.typeName, color: yellow },
    { tag: tags.atom, color: violet },
    { tag: tags.number, color: orange },
    { tag: tags.string, color: green },
    { tag: tags.meta, color: cyan, fontStyle: "italic" },
    { tag: tags.lineComment, color: darkCyan, fontStyle: "italic" },
    { tag: tags.bracket, color: base5 },
    { tag: tags.operator, color: blue },
  ]),
);
