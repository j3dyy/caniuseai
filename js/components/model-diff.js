/**
 * CanIUse.ai - Side-by-Side Model Diff Comparison Modal
 */
import { icons } from "../utils/icons.js";
import { renderStatusBadge } from "../utils/formatters.js";

export function renderModelDiff(store) {
  let modalMount = document.getElementById("diff-modal-mount");
  if (!modalMount) {
    modalMount = document.createElement("div");
    modalMount.id = "diff-modal-mount";
    document.body.appendChild(modalMount);
  }

  if (!store.diffOpen) {
    modalMount.innerHTML = "";
    return;
  }

  const data = store.data;
  if (!data) return;

  const models = data.models || [];
  const modelA = models.find(m => m.id === store.diffModelA) || models[0];
  const modelB = models.find(m => m.id === store.diffModelB) || models[3];
  const features = data.features || [];

  modalMount.innerHTML = `
    <div class="diff-modal-backdrop open" id="diff-backdrop">
      <div class="diff-modal" id="diff-modal-box">
        <div class="diff-modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${icons.diff(20)}
            <h2 class="diff-modal-title">Side-by-Side Capability Diff</h2>
          </div>
          <button class="icon-btn" id="btn-close-diff" title="Close modal (Esc)">
            ${icons.x(16)}
          </button>
        </div>

        <!-- Selectors -->
        <div class="diff-selectors-row">
          <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">MODEL A</label>
            <select class="model-select" id="select-model-a">
              ${models.map(m => `
                <option value="${m.id}" ${m.id === modelA.id ? "selected" : ""}>${m.name} (${m.providerName})</option>
              `).join("")}
            </select>
          </div>

          <div style="font-size: 1.1rem; font-weight: 850; color: var(--text-muted); padding-top: 14px;">VS</div>

          <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">MODEL B</label>
            <select class="model-select" id="select-model-b">
              ${models.map(m => `
                <option value="${m.id}" ${m.id === modelB.id ? "selected" : ""}>${m.name} (${m.providerName})</option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Diff Body -->
        <div class="diff-body">
          <div style="margin-bottom: 14px; font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>FEATURE</span>
            <span>${modelA.name}</span>
            <span>${modelB.name}</span>
          </div>

          ${features.map(f => {
            const sA = f.support ? f.support[modelA.id] : null;
            const sB = f.support ? f.support[modelB.id] : null;
            return `
              <div class="diff-row">
                <div>
                  <strong style="font-size: 0.85rem; color: var(--text-primary); display: block;">${f.name}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${f.summary}</span>
                </div>
                <div style="text-align: center;">
                  ${renderStatusBadge(sA)}
                </div>
                <div style="text-align: center;">
                  ${renderStatusBadge(sB)}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  // Attach Events
  document.getElementById("btn-close-diff")?.addEventListener("click", () => {
    store.closeDiffModal();
  });

  document.getElementById("diff-backdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "diff-backdrop") {
      store.closeDiffModal();
    }
  });

  document.getElementById("select-model-a")?.addEventListener("change", (e) => {
    store.setDiffModels(e.target.value, store.diffModelB);
  });

  document.getElementById("select-model-b")?.addEventListener("change", (e) => {
    store.setDiffModels(store.diffModelA, e.target.value);
  });
}
