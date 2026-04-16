import {
  LanguageSupport,
  StreamLanguage,
  type StreamParser,
} from "@codemirror/language";

const keywords = new Set([
  "if", "either", "unless", "loop", "break", "return",
  "function", "does", "try", "match", "attempt", "scope",
  "not", "and", "or", "all?", "any?",
  "for", "in", "from", "to", "by", "when", "do", "it",
  "source", "then", "fallback", "retries", "catch",
  "default",
  "fields", "required", "optional",
  "bindings", "import",
  "assert",
]);

const builtins = new Set([
  "print", "probe", "reduce", "apply",
  "select", "first", "second", "last", "pick", "find", "reverse",
  "append", "insert", "remove", "copy", "sort",
  "has?", "is?",
  "length", "empty?", "type",
  "odd?", "even?", "number?", "function?",
  "min", "max", "abs", "negate", "round", "sqrt",
  "sin", "cos", "tan", "asin", "acos", "atan2",
  "pow", "exp", "log", "log10",
  "floor", "ceil", "to-degrees", "to-radians",
  "random", "pi",
  "join", "rejoin", "replace", "split", "trim",
  "uppercase", "lowercase",
  "starts-with?", "ends-with?", "subset",
  "byte", "char",
  "context", "object", "freeze", "frozen?", "words", "set", "merge",
  "make", "to", "using",
  "charset", "union", "intersect",
  "load", "save", "exports",
  "read", "write", "dir?", "file?", "exit",
  "error", "rethrow", "now", "time", "date", "system",
  "pad", "capture", "emit", "raw",
  "integer?", "float?", "money?", "string?", "logic?", "none?",
  "pair?", "tuple?", "date?", "time?", "file?",
  "block?", "context?", "object?", "map?", "set?",
]);

const constants = new Set([
  "true", "false", "on", "off", "yes", "no", "none",
]);

const kintsugiParser: StreamParser<Record<string, never>> = {
  startState() { return {}; },

  token(stream) {
    // Whitespace
    if (stream.eatSpace()) return null;

    // Line comment
    if (stream.match(";")) {
      stream.skipToEnd();
      return "lineComment";
    }

    // Multi-line string / comment { ... }
    if (stream.match("{")) {
      let depth = 1;
      while (depth > 0 && !stream.eol()) {
        const ch = stream.next();
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
      }
      return "string";
    }

    // String
    if (stream.match('"')) {
      let escaped = false;
      while (!stream.eol()) {
        const ch = stream.next();
        if (escaped) { escaped = false; continue; }
        if (ch === "^") { escaped = true; continue; }
        if (ch === '"') break;
      }
      return "string";
    }

    // Meta-word (@word)
    if (stream.match(/@[A-Za-z][A-Za-z0-9_?!~/-]*/)) {
      return "meta";
    }

    // Money literal ($19.99)
    if (stream.match(/-?\$[0-9]+(\.[0-9]+)?/)) {
      return "number";
    }

    // Pair literal (100x200)
    if (stream.match(/-?[0-9]+(\.[0-9]+)?x-?[0-9]+(\.[0-9]+)?/)) {
      return "number";
    }

    // Number
    if (stream.match(/-?[0-9]+\.[0-9]+/) || stream.match(/-?[0-9]+/)) {
      return "number";
    }

    // File literal (%path)
    if (stream.match(/%"[^"]*"/)) return "string";
    if (stream.match(/%[^ \t\n\[\](){}]+/)) return "string";

    // URL literal
    if (stream.match(/[A-Za-z][A-Za-z0-9+-]*:\/\/[^ \t\n\[\]()]+/)) {
      return "string";
    }

    // Set-word (word:)
    if (stream.match(/[A-Za-z][A-Za-z0-9_?!~/-]*:/)) {
      return "variableName.definition";
    }

    // Type name (word!)
    if (stream.match(/[A-Za-z][A-Za-z0-9_-]*!/)) {
      return "typeName";
    }

    // Lit-word ('word)
    if (stream.match(/'[A-Za-z][A-Za-z0-9_?!~/-]*/)) {
      return "atom";
    }

    // Get-word (:word)
    if (stream.match(/:[A-Za-z][A-Za-z0-9_?!~/-]*/)) {
      return "variableName.special";
    }

    // Chain operator
    if (stream.match("->")) return "keyword";

    // Field declaration
    if (stream.match(/field\/(?:required|optional)/)) return "keyword";

    // Header keyword
    if (stream.match(/^Kintsugi\b/)) return "keyword";

    // Regular word
    if (stream.match(/[A-Za-z][A-Za-z0-9_?!~/-]*/)) {
      const word = stream.current();
      if (keywords.has(word)) return "keyword";
      if (builtins.has(word)) return "variableName.special";
      if (constants.has(word)) return "atom";
      return null;
    }

    // Operators
    if (stream.match(/[+\-*/<>=|]/)) return "operator";

    // Brackets
    if (stream.match(/[\[\]()]/)) return "bracket";

    // Skip unknown
    stream.next();
    return null;
  },
};

const kintsugiLang = StreamLanguage.define(kintsugiParser);

export function kintsugi() {
  return new LanguageSupport(kintsugiLang);
}
