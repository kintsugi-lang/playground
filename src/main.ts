import "./styles.css";
import { examples } from "./examples";

function $(id: string) {
  return document.getElementById(id)!;
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
    badge.textContent = ex.target === "love2d" ? "LOVE2D" : ex.target === "playdate" ? "Playdate" : "Lua 5.4";

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
      (document.getElementById("source") as HTMLTextAreaElement).value = ex.source;
      (document.getElementById("target-select") as HTMLSelectElement).value = ex.target;
      (document.getElementById("output") as HTMLTextAreaElement).value = "";
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
    const source = (document.getElementById("source") as HTMLTextAreaElement)
      .value;
    const target = (
      document.getElementById("target-select") as HTMLSelectElement
    ).value;
    const output = document.getElementById("output") as HTMLTextAreaElement;
    output.value = "";
    try {
      output.value = window.kintsugiCompile(source, target);
    } catch (e) {
      output.value =
        "-- JS Error: " + (e instanceof Error ? e.message : String(e));
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

function seedEditor() {
  const source = document.getElementById("source") as HTMLTextAreaElement;
  const target = document.getElementById(
    "target-select",
  ) as HTMLSelectElement;
  source.value = examples[0].source;
  target.value = examples[0].target;
}

document.addEventListener("DOMContentLoaded", () => {
  initExamples();
  initCompile();
  initVersion();
  seedEditor();
});
