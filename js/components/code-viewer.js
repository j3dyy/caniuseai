/**
 * CanIUse.ai - Code Viewer Component
 */
import { icons } from "../utils/icons.js";
import { showToast, escapeHtml } from "../utils/formatters.js";

export function renderCodeViewer(codeExamples = {}, store) {
  const currentLang = store.activeCodeLang || "python";
  const codeText = codeExamples[currentLang] || "# No code example available";

  return `
    <div class="code-viewer-wrap">
      <div class="code-viewer-topbar">
        <div class="code-lang-tabs">
          <button class="code-tab-btn ${currentLang === "python" ? "active" : ""}" data-lang="python">Python</button>
          <button class="code-tab-btn ${currentLang === "typescript" ? "active" : ""}" data-lang="typescript">TypeScript</button>
        </div>
        <button class="code-copy-btn" data-copy-code="${encodeURIComponent(codeText)}">
          ${icons.copy(13)}
          <span>Copy Snippet</span>
        </button>
      </div>
      <pre class="code-pre"><code>${escapeHtml(codeText)}</code></pre>
    </div>
  `;
}

export function attachCodeViewerEvents(container, store) {
  container.querySelectorAll(".code-tab-btn").forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = tab.getAttribute("data-lang");
      store.setCodeLang(lang);
    });
  });

  container.querySelectorAll(".code-copy-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const code = decodeURIComponent(btn.getAttribute("data-copy-code") || "");
      try {
        await navigator.clipboard.writeText(code);
        showToast("Code copied to clipboard!");
      } catch (err) {
        console.error("Clipboard copy error:", err);
      }
    });
  });
}
