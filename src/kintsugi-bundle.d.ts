declare global {
  /**
   * Result of a Kintsugi compile call. The compiler returns a JSON
   * string from `kintsugiCompile`; the playground parses it into this
   * shape. `prelude` and `source` are the two Lua chunks; `error` is
   * a string when compilation failed and null otherwise.
   */
  interface KintsugiCompileResult {
    prelude: string;
    source: string;
    error: string | null;
  }

  interface Window {
    /** Returns a JSON string parseable as `KintsugiCompileResult`. */
    kintsugiCompile(source: string, target: string): string;
    kintsugiRun(source: string): string;
    kintsugiVersion(): string;
    kintsugiCodename(): string;
    kintsugiBuildDate(): string;
  }
}
export {};
