/**
 * CanIUse.ai - Core Compatibility Matrix Component
 */
import { icons } from "../utils/icons.js";
import { renderStatusBadge } from "../utils/formatters.js";
import { renderFeatureDrawer } from "./feature-drawer.js";
import { attachCodeViewerEvents } from "./code-viewer.js";
import { getModelFifaCard } from "../utils/fifa-stats.js";

export function renderMatrix(store) {
  const mount = document.getElementById("matrix-mount");
  if (!mount) return;

  const data = store.data;
  if (!data) {
    mount.innerHTML = `<div class="container" style="padding: 40px 0; text-align: center; color: var(--text-muted);">Loading capability matrix...</div>`;
    return;
  }

  const models = data.models || [];
  const categories = data.categories || [];
  const features = store.getFilteredFeatures();

  if (features.length === 0) {
    mount.innerHTML = `
      <div class="container">
        <div style="background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-lg); padding: 48px 24px; text-align: center;">
          <p style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">No matching capabilities found</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Try a different search query or click "All Capabilities" above.</p>
        </div>
      </div>
    `;
    return;
  }

  // Group features by category
  const categorized = categories.map(cat => {
    return {
      ...cat,
      features: features.filter(f => f.categoryId === cat.id)
    };
  }).filter(cat => cat.features.length > 0);

  // Preserve horizontal scroll position before updating innerHTML
  const prevTableWrap = mount.querySelector(".matrix-table-wrap");
  const prevScrollLeft = prevTableWrap ? prevTableWrap.scrollLeft : 0;

  mount.innerHTML = `
    <div class="container">
      <div class="matrix-container-card">
        <div class="matrix-table-wrap">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="th-feature">
                  <span>Capability / Feature</span>
                </th>
                ${models.map(m => {
                  const fifa = getModelFifaCard(m);
                  return `
                    <th class="th-model" data-model-id="${m.id}">
                      <div class="model-header-cell">
                        <span class="model-header-name">${m.name}</span>
                        <span class="model-header-provider">${m.providerName}</span>
                        <span class="model-header-badge">${m.contextWindow}</span>
                        <div class="model-fifa-header-badge" data-model-id="${m.id}" title="Enter FIFA Battle Arena with ${m.name}">
                          ${fifa.ovr >= 97 ? '<span class="fifa-badge-crown">👑</span>' : ''}
                          <span class="fifa-badge-ovr">${fifa.ovr}</span>
                          <span class="fifa-badge-pos">${fifa.position}</span>
                        </div>
                      </div>
                    </th>
                  `;
                }).join("")}
              </tr>
            </thead>
            <tbody>
              ${categorized.map(cat => `
                <tr class="category-divider-row">
                  <td colspan="${models.length + 1}">
                    <div class="category-divider-inner">
                      ${icons[cat.icon] ? icons[cat.icon](14) : icons.layers(14)}
                      <span>${cat.name}</span>
                    </div>
                  </td>
                </tr>
                ${cat.features.map(f => {
                  const isExpanded = store.expandedFeatureId === f.id;
                  return `
                    <tr class="feature-row ${isExpanded ? "expanded" : ""}" data-feature-id="${f.id}">
                      <td class="td-feature-name">
                        <div class="feature-name-inner">
                          <div class="feature-title-wrap">
                            <span class="feature-chevron">${icons.chevronRight(14)}</span>
                            <span class="feature-title">${f.name}</span>
                          </div>
                          <span class="feature-summary">${f.summary}</span>
                        </div>
                      </td>
                      ${models.map(m => {
                        const s = f.support ? f.support[m.id] : null;
                        return `
                          <td class="td-model-cell" data-model-id="${m.id}">
                            ${renderStatusBadge(s)}
                          </td>
                        `;
                      }).join("")}
                    </tr>
                    ${isExpanded ? renderFeatureDrawer(f, models, store) : ""}
                  `;
                }).join("")}
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Restore horizontal scroll position
  const newTableWrap = mount.querySelector(".matrix-table-wrap");
  if (newTableWrap && prevScrollLeft > 0) {
    newTableWrap.scrollLeft = prevScrollLeft;
  }

  // Smooth scroll to expanded feature and target model tab
  if (store.expandedFeatureId) {
    requestAnimationFrame(() => {
      const expandedRow = mount.querySelector(`.feature-row[data-feature-id="${store.expandedFeatureId}"]`);
      const drawerRow = mount.querySelector(`#drawer-${store.expandedFeatureId}`);

      if (expandedRow) {
        expandedRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // If user clicked on a specific model cell, horizontally scroll to that model column
      if (store.activeModelTarget && newTableWrap) {
        const targetCell = expandedRow?.querySelector(`.td-model-cell[data-model-id="${store.activeModelTarget}"]`);
        if (targetCell) {
          const cellLeft = targetCell.offsetLeft;
          const cellWidth = targetCell.offsetWidth;
          const wrapWidth = newTableWrap.clientWidth;
          const targetScroll = Math.max(0, cellLeft - 280 - (wrapWidth - 280 - cellWidth) / 2);
          newTableWrap.scrollTo({ left: targetScroll, behavior: "smooth" });
        }

        // Also scroll to that model's parameter item inside the drawer
        const targetParam = drawerRow?.querySelector(`#param-${store.expandedFeatureId}-${store.activeModelTarget}`);
        if (targetParam) {
          targetParam.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    });
  }

  // Attach Row Expansion Handlers (detect if specific model cell was clicked)
  mount.querySelectorAll(".feature-row").forEach(row => {
    row.addEventListener("click", (e) => {
      const fId = row.getAttribute("data-feature-id");
      const modelCell = e.target.closest(".td-model-cell");
      const modelId = modelCell ? modelCell.getAttribute("data-model-id") : null;
      store.toggleExpandFeature(fId, modelId);
    });
  });

  // Attach Code Viewer Snippet Events
  attachCodeViewerEvents(mount, store);

  // Attach FIFA Badge click handler to jump straight into Battle Arena
  mount.querySelectorAll(".model-fifa-header-badge").forEach(badge => {
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      const modelId = badge.getAttribute("data-model-id");
      store.openDiffModal(modelId);
      store.setDiffViewMode("battle");
    });
  });
}
