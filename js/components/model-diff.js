/**
 * CanIUse.ai - Side-by-Side Model Diff Comparison Modal
 * Supports both "FIFA Card Battle" mode and "Classic Matrix Diff" mode
 */
import { icons } from "../utils/icons.js";
import { renderStatusBadge } from "../utils/formatters.js";
import { renderBattleArena, attachBattleArenaEvents } from "./battle-arena.js";

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
  const diffModelIds = store.diffModels || ["claude-3-5-sonnet", "gemini-2-0-flash"];
  const isThree = diffModelIds.length >= 3;
  const isBattleMode = store.diffViewMode === "battle";

  // Resolve active model objects
  const selectedModels = diffModelIds.map((id, idx) => {
    return models.find(m => m.id === id) || models[idx] || models[0];
  });

  const allFeatures = data.features || [];

  // Preserve scroll position if re-rendering while open in matrix mode
  const prevScrollTop = modalMount.querySelector(".diff-body")?.scrollTop || 0;

  modalMount.innerHTML = `
    <div class="diff-modal-backdrop open" id="diff-backdrop">
      <div class="diff-modal ${isThree ? "has-3-models" : ""} ${isBattleMode ? "diff-modal--battle" : ""}" id="diff-modal-box">
        <!-- Modal Header -->
        <div class="diff-modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="diff-icon-badge" style="${isBattleMode ? "background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(212, 175, 55, 0.35)); color: #ffd700;" : ""}">
              ${isBattleMode ? icons.zap(20) : icons.diff(20)}
            </div>
            <div>
              <h2 class="diff-modal-title">${isBattleMode ? "AI Agent FIFA Card Battle" : "Side-by-Side Capability Diff"}</h2>
              <div class="diff-modal-subtitle">
                ${isBattleMode
                  ? `6-Clash Points Showdown: ${selectedModels[0]?.name} vs ${selectedModels[1]?.name}`
                  : `Comparing ${selectedModels.length} models across ${allFeatures.length} capabilities`}
              </div>
            </div>
          </div>

          <!-- Segmented View Switcher: FIFA Battle vs Matrix Diff -->
          <div class="diff-view-switcher" role="tablist" aria-label="Comparison View Mode">
            <button 
              class="diff-view-tab ${isBattleMode ? "active" : ""}" 
              id="btn-diff-view-battle" 
              role="tab" 
              aria-selected="${isBattleMode}"
              title="FIFA Card Battle Arena"
            >
              ${icons.zap(14)}
              <span>FIFA Battle</span>
            </button>
            <button 
              class="diff-view-tab ${!isBattleMode ? "active" : ""}" 
              id="btn-diff-view-matrix" 
              role="tab" 
              aria-selected="${!isBattleMode}"
              title="Classic Capability Matrix Diff"
            >
              ${icons.diff(14)}
              <span>Matrix Diff</span>
            </button>
          </div>

          <button class="icon-btn" id="btn-close-diff" title="Close modal (Esc)">
            ${icons.x(16)}
          </button>
        </div>

        ${isBattleMode ? `
          <!-- FIFA Card Battle Arena View -->
          ${renderBattleArena(store)}
        ` : `
          <!-- Classic Matrix Diff View -->
          <!-- Dynamic Selectors Row -->
          <div class="diff-selectors-row">
            <!-- Model A -->
            <div class="diff-selector-card">
              <div class="diff-slot-label">MODEL A</div>
              <select class="model-select" data-slot="0">
                ${models.map(m => `
                  <option value="${m.id}" ${m.id === selectedModels[0].id ? "selected" : ""}>
                    ${m.name} (${m.providerName})
                  </option>
                `).join("")}
              </select>
            </div>

            <div class="diff-vs-badge">VS</div>

            <!-- Model B -->
            <div class="diff-selector-card">
              <div class="diff-slot-label">MODEL B</div>
              <select class="model-select" data-slot="1">
                ${models.map(m => `
                  <option value="${m.id}" ${m.id === selectedModels[1].id ? "selected" : ""}>
                    ${m.name} (${m.providerName})
                  </option>
                `).join("")}
              </select>
            </div>

            <div class="diff-vs-badge">VS</div>

            <!-- Model C or Dynamic Add Button -->
            ${isThree ? `
              <div class="diff-selector-card slot-c">
                <div class="diff-slot-label-wrap">
                  <span class="diff-slot-label">MODEL C</span>
                  <button class="btn-remove-diff-model" id="btn-remove-model-c" title="Remove 3rd model">
                    ${icons.x(12)} <span>Remove</span>
                  </button>
                </div>
                <select class="model-select" data-slot="2">
                  ${models.map(m => `
                    <option value="${m.id}" ${m.id === selectedModels[2].id ? "selected" : ""}>
                      ${m.name} (${m.providerName})
                    </option>
                  `).join("")}
                </select>
              </div>
            ` : `
              <div class="diff-selector-card add-card">
                <button class="btn-add-model-diff" id="btn-add-diff-model" title="Add a third model to compare side-by-side">
                  ${icons.plus(15)}
                  <span>+ Add 3rd Model</span>
                </button>
              </div>
            `}
          </div>

          <!-- Diff Body Table -->
          <div class="diff-body">
            <div class="diff-table-container ${isThree ? "cols-3" : "cols-2"}">
              <!-- Table Header -->
              <div class="diff-table-header ${isThree ? "cols-3" : "cols-2"}">
                <div class="diff-th-feature">FEATURE / CAPABILITY</div>
                ${selectedModels.map(m => `
                  <div class="diff-th-model">
                    <div class="diff-th-model-name">${m.name}</div>
                    <div class="diff-th-model-provider">${m.providerName}</div>
                  </div>
                `).join("")}
              </div>

              <!-- Table Rows -->
              ${allFeatures.map(f => {
                const supports = selectedModels.map(m => (f.support ? f.support[m.id] : null));
                const statuses = supports.map(s => s?.status);
                const isDiff = !statuses.every(s => s === statuses[0]);

                return `
                  <div class="diff-row ${isThree ? "cols-3" : "cols-2"} ${isDiff ? "has-diff" : ""}">
                    <div class="diff-cell-feature">
                      <div class="diff-feature-title">${f.name}</div>
                      <div class="diff-feature-summary">${f.summary}</div>
                    </div>
                    ${supports.map(s => `
                      <div class="diff-cell-badge">
                        ${renderStatusBadge(s)}
                        ${s && s.notes ? `<div class="diff-cell-notes" title="${s.notes}">${s.notes}</div>` : ""}
                      </div>
                    `).join("")}
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `}
      </div>
    </div>
  `;

  // Restore scroll position in matrix diff mode
  const newBody = modalMount.querySelector(".diff-body");
  if (newBody && prevScrollTop > 0) {
    newBody.scrollTop = prevScrollTop;
  }

  // --- Attach Event Listeners ---
  document.getElementById("btn-close-diff")?.addEventListener("click", () => {
    store.closeDiffModal();
  });

  document.getElementById("diff-backdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "diff-backdrop") {
      store.closeDiffModal();
    }
  });

  // Switcher listeners
  document.getElementById("btn-diff-view-battle")?.addEventListener("click", () => {
    store.setDiffViewMode("battle");
  });

  document.getElementById("btn-diff-view-matrix")?.addEventListener("click", () => {
    store.setDiffViewMode("matrix");
  });

  if (isBattleMode) {
    attachBattleArenaEvents(modalMount, store);
  } else {
    // Model select dropdowns in matrix mode
    modalMount.querySelectorAll(".model-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const slot = parseInt(e.target.getAttribute("data-slot"), 10);
        store.setDiffModelAt(slot, e.target.value);
      });
    });

    // Add 3rd model button
    document.getElementById("btn-add-diff-model")?.addEventListener("click", () => {
      store.addDiffModel();
    });

    // Remove 3rd model button
    document.getElementById("btn-remove-model-c")?.addEventListener("click", () => {
      store.removeDiffModel(2);
    });
  }
}
