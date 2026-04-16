import "./styles.css";
import { examples } from "./examples";

let activeTab = 0;

function $(id: string) {
  return document.getElementById(id)!;
}

function initTabs() {
  const tabContainer = $("example-tabs");
  const codeBlock = $("example-code");

  examples.forEach((ex, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (i === 0 ? " active" : "");
    btn.textContent = ex.label;
    btn.addEventListener("click", () => {
      tabContainer
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      codeBlock.textContent = ex.source;
      activeTab = i;
    });
    tabContainer.appendChild(btn);
  });

  codeBlock.textContent = examples[0].source;
}

function initLoadButton() {
  $("load-example").addEventListener("click", () => {
    const ex = examples[activeTab];
    (document.getElementById("source") as HTMLTextAreaElement).value = ex.source;
    (document.getElementById("target-select") as HTMLSelectElement).value =
      ex.target;
    (document.getElementById("output") as HTMLTextAreaElement).value = "";
    document.getElementById("try")?.scrollIntoView({ behavior: "smooth" });
  });
}

function initCompile() {
  $("compile-btn").addEventListener("click", () => {
    const source = (document.getElementById("source") as HTMLTextAreaElement)
      .value;
    const target = (document.getElementById("target-select") as HTMLSelectElement)
      .value;
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
  initTabs();
  initLoadButton();
  initCompile();
  initVersion();
  seedEditor();
});
