/**
 * CanIUse.ai - Formatters & UI Utilities
 */
import { icons } from "./icons.js";

export function renderStatusBadge(supportObj) {
  if (!supportObj) {
    return `<span class="status-badge unsupported">Unsupported</span>`;
  }

  const status = supportObj.status || "unsupported";
  const label = supportObj.label || "Unsupported";

  let icon = "";
  if (status === "native" || status === "superpower") {
    icon = icons.check(12);
  } else if (status === "partial") {
    icon = icons.alertTriangle(12);
  } else {
    icon = icons.x(12);
  }

  return `
    <span class="status-badge ${status}" title="${supportObj.notes || label}">
      ${icon}
      <span>${label}</span>
    </span>
  `;
}

export function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function showToast(message = "Copied to clipboard!") {
  let toast = document.getElementById("global-copy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-copy-toast";
    toast.className = "copy-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `${icons.check(16)} <span>${message}</span>`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}
