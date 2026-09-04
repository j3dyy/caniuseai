/**
 * CanIUse.ai - Main Application Bootstrap
 */
import { store } from "./state.js";
import { renderHeader } from "./components/header.js";
import { renderMatrix } from "./components/matrix.js";
import { renderModelDiff } from "./components/model-diff.js";

function renderAll(currentStore) {
  renderHeader(currentStore);
  renderMatrix(currentStore);
  renderModelDiff(currentStore);
}

document.addEventListener("DOMContentLoaded", async () => {
  store.subscribe(renderAll);

  // Global keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    const input = document.getElementById("global-search-input");
    
    // Quick search shortcut: '/' or 'Cmd+K'
    if (
      (e.key === "/" && document.activeElement !== input && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) ||
      ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
    ) {
      e.preventDefault();
      input?.focus();
      input?.select();
    }

    // Escape clears search or closes modal
    if (e.key === "Escape") {
      if (store.diffOpen) {
        store.closeDiffModal();
      } else if (document.activeElement === input) {
        input?.blur();
      }
    }

    // Compare mode shortcut: 'c' or 'C'
    if (
      (e.key === "c" || e.key === "C") &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName) &&
      !e.metaKey && !e.ctrlKey
    ) {
      e.preventDefault();
      store.diffOpen ? store.closeDiffModal() : store.openDiffModal();
    }
  });

  // Boot application
  await store.init();

  // Check URL parameters for shareable battle links (e.g. ?battle=1&m1=claude-3-5-sonnet&m2=deepseek-v3)
  const urlParams = new URLSearchParams(window.location.search);
  const isBattle = urlParams.get("battle") === "1" || urlParams.has("m1");
  if (isBattle) {
    const m1 = urlParams.get("m1");
    const m2 = urlParams.get("m2");
    store.openDiffModal(m1 || undefined, m2 || undefined);
    store.setDiffViewMode("battle");
  }
});
