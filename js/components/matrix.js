/**
 * CanIUse.ai - Core Compatibility Matrix Component
 */
import { icons } from "../utils/icons.js";
import { renderStatusBadge } from "../utils/formatters.js";
import { renderFeatureDrawer } from "./feature-drawer.js";
import { attachCodeViewerEvents } from "./code-viewer.js";

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
                ${models.map(m => `
                  <th class="th-model">
                    <div class="model-header-cell">
                      <span class="model-header-name">${m.name}</span>
                      <span class="model-header-provider">${m.providerName}</span>
                      <span class="model-header-badge">${m.contextWindow}</span>
                    </div>
                  </th>
                `).join("")}
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
                          <td class="td-model-cell">
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

  // Attach Row Expansion Handlers
  mount.querySelectorAll(".feature-row").forEach(row => {
    row.addEventListener("click", () => {
      const fId = row.getAttribute("data-feature-id");
      store.toggleExpandFeature(fId);
    });
  });

  // Attach Code Viewer Snippet Events
  attachCodeViewerEvents(mount, store);
}
