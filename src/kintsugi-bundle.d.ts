declare global {
  interface Window {
    kintsugiCompile(source: string, target: string): string;
    kintsugiRun(source: string): string;
    kintsugiVersion(): string;
    kintsugiCodename(): string;
  }
}
export {};
