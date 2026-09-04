/**
 * CanIUse.ai - Feature Detail Drawer Component
 */
import { icons } from "../utils/icons.js";
import { renderCodeViewer, attachCodeViewerEvents } from "./code-viewer.js";

export function renderFeatureDrawer(feature, models = [], store) {
  const gotchas = feature.gotchas || [];
  const support = feature.support || {};

  return `
    <tr class="drawer-row expanded" id="drawer-${feature.id}">
      <td colspan="${models.length + 1}">
        <div class="drawer-content">
          <div class="drawer-grid">
            <!-- Left: Gotchas & Model Parameter Breakdown -->
            <div>
              <h3 class="drawer-title">
                ${icons.cpu(18)}
                <span>${feature.name}</span>
              </h3>
              <p class="drawer-desc">${feature.summary}</p>

              ${gotchas.length > 0 ? `
                <div class="drawer-gotchas-box">
                  <div class="drawer-gotchas-heading">
                    ${icons.alertTriangle(14)}
                    <span>Key Gotchas &amp; Differences</span>
                  </div>
                  <ul class="drawer-gotchas-list">
                    ${gotchas.map(g => `<li>${g}</li>`).join("")}
                  </ul>
                </div>
              ` : ""}

              <div style="font-size: 0.78rem; font-weight: 750; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px;">
                SDK Parameter Mapping
              </div>
              <div class="sdk-params-list">
                ${models.map(m => {
                  const s = support[m.id];
                  if (!s || s.status === "unsupported") return "";
                  const isTargeted = store.activeModelTarget === m.id;
                  return `
                    <div class="sdk-param-item ${isTargeted ? "active-model-target" : ""}" id="param-${feature.id}-${m.id}" data-model-id="${m.id}">
                      <div class="sdk-param-header">
                        <span class="sdk-model-title">${m.name} (${m.providerName})</span>
                        <span class="status-badge ${s.status}" style="font-size: 0.68rem; padding: 2px 6px;">${s.label}</span>
                      </div>
                      <code class="sdk-param-code">${s.sdkParam || "N/A"}</code>
                      ${s.notes ? `<p class="sdk-param-notes">${s.notes}</p>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Right: Ready-to-Run Code Example -->
            <div>
              <div style="font-size: 0.78rem; font-weight: 750; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px;">
                Ready-To-Run Implementation Snippet
              </div>
              ${renderCodeViewer(feature.codeExamples || {}, store, feature.id)}
            </div>
          </div>
        </div>
      </td>
    </tr>
  `;
}
