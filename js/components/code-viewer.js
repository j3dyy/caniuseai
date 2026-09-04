/**
 * CanIUse.ai - Code Viewer Component
 */
import { icons } from "../utils/icons.js";
import { showToast, escapeHtml } from "../utils/formatters.js";

export function renderCodeViewer(codeExamples = {}, store, featureId = "") {
  const currentLang = store.activeCodeLang || "python";
  const codeText = codeExamples[currentLang] || `# No ${currentLang} code example available`;

  return `
    <div class="code-viewer-wrap" data-feature-id="${featureId}">
      <div class="code-viewer-topbar">
        <div class="code-lang-tabs">
          <button type="button" class="code-tab-btn ${currentLang === "python" ? "active" : ""}" data-lang="python">Python</button>
          <button type="button" class="code-tab-btn ${currentLang === "typescript" ? "active" : ""}" data-lang="typescript">TypeScript</button>
          <button type="button" class="code-tab-btn ${currentLang === "go" ? "active" : ""}" data-lang="go">Go</button>
          <button type="button" class="code-tab-btn ${currentLang === "php" ? "active" : ""}" data-lang="php">PHP</button>
        </div>
        <button type="button" class="code-copy-btn" data-copy-code="${encodeURIComponent(codeText)}">
          ${icons.copy(13)}
          <span>Copy Snippet</span>
        </button>
      </div>
      <pre class="code-pre"><code class="code-content language-${currentLang}">${escapeHtml(codeText)}</code></pre>
    </div>
  `;
}

export function attachCodeViewerEvents(container, store) {
  container.querySelectorAll(".code-tab-btn").forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lang = tab.getAttribute("data-lang");
      if (!lang) return;

      store.setCodeLang(lang);

      // In-place update: Find all open code viewers and switch language seamlessly without re-rendering the page
      document.querySelectorAll(".code-viewer-wrap").forEach(viewer => {
        // Update tab buttons active state
        viewer.querySelectorAll(".code-tab-btn").forEach(btn => {
          btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
        });

        // Fetch the corresponding code snippet
        const featId = viewer.getAttribute("data-feature-id");
        const feature = store.data?.features?.find(f => f.id === featId);
        const newCode = (feature?.codeExamples && feature.codeExamples[lang]) || `# No ${lang} code example available`;

        // Update code display in-place
        const codeEl = viewer.querySelector("code");
        if (codeEl) {
          codeEl.textContent = newCode;
          codeEl.className = `code-content language-${lang}`;
        }

        // Update copy button data
        const copyBtn = viewer.querySelector(".code-copy-btn");
        if (copyBtn) {
          copyBtn.setAttribute("data-copy-code", encodeURIComponent(newCode));
        }
      });
    });
  });

  container.querySelectorAll(".code-copy-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
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
