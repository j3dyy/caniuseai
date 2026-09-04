/**
 * CanIUse.ai - Topbar Navigation & Quick Category Filter Component
 */
import { icons } from "../utils/icons.js";

export function renderHeader(store) {
  const mount = document.getElementById("header-mount");
  if (!mount) return;

  const data = store.data;
  const isDark = store.theme === "dark";
  const categories = data?.categories || [];

  // Check if header is already rendered in DOM.
  // If so, update in-place without blowing away mount.innerHTML to preserve input focus.
  const existingHeader = mount.querySelector(".site-header");
  if (existingHeader) {
    const searchInput = document.getElementById("global-search-input");
    const clearBtn = document.getElementById("search-clear-btn");
    const kbdHint = document.getElementById("search-kbd-hint");

    // Only update value if the user is not actively typing in it
    if (searchInput && document.activeElement !== searchInput) {
      searchInput.value = store.searchQuery || "";
    }
    if (clearBtn) {
      clearBtn.style.display = store.searchQuery ? "flex" : "none";
    }
    if (kbdHint) {
      kbdHint.style.display = store.searchQuery ? "none" : "inline-block";
    }

    // Sync active category pill
    mount.querySelectorAll(".cat-pill").forEach(pill => {
      const catId = pill.getAttribute("data-category");
      pill.classList.toggle("active", catId === store.activeCategory);
    });

    // Sync theme toggle icon
    const themeBtn = document.getElementById("btn-theme-toggle");
    if (themeBtn) {
      themeBtn.innerHTML = isDark ? icons.sun(18) : icons.moon(18);
    }
    return;
  }

  mount.innerHTML = `
    <!-- Top Site Nav -->
    <header class="site-header">
      <div class="container site-header-inner">
        <div class="brand-group">
          <div class="brand-logo-wrap" title="CanAI">
            ${icons.logo(38)}
          </div>
          <div class="brand-text">
            <span class="brand-title">CanAI</span>
            <span class="brand-subtitle">AI Model &amp; SDK Capability Matrix</span>
          </div>
        </div>

        <!-- Global Instant Search Input -->
        <div class="header-search-wrap">
          <div class="header-search-box">
            <span class="search-icon">${icons.search(16)}</span>
            <input
              type="text"
              role="searchbox"
              id="global-search-input"
              class="search-input"
              placeholder="Filter capabilities or models... (e.g. prompt caching, gpt-4o)"
              value="${store.searchQuery || ""}"
              aria-label="Filter capabilities or models"
              autocomplete="off"
              spellcheck="false"
            />
            <button type="button" class="search-clear-btn" id="search-clear-btn" style="display: ${store.searchQuery ? "flex" : "none"};" title="Clear filter">
              ${icons.x(12)}
            </button>
            <kbd class="search-kbd" id="search-kbd-hint" style="display: ${store.searchQuery ? "none" : "inline-block"};">/</kbd>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="header-actions">
          <button class="header-btn btn-diff" id="btn-open-diff" title="Side-by-side model diff comparison">
            ${icons.diff(15)}
            <span>Compare Models</span>
          </button>
          
          <button class="icon-btn" id="btn-theme-toggle" title="Toggle Theme" aria-label="Toggle light or dark theme">
            ${isDark ? icons.sun(18) : icons.moon(18)}
          </button>

          <a href="https://github.com/j3dyy/caniuseai" target="_blank" rel="noopener" class="icon-btn" title="Contribute on GitHub">
            ${icons.code(18)}
          </a>
        </div>
      </div>
    </header>

    <!-- Hero & Category Navigation Strip -->
    <div class="container hero-radar-strip">
      <div class="hero-stats-row">
        <div class="hero-heading">
          <h1>AI Capability Radar</h1>
          <span class="hero-badge-pill">
            <span class="live-pulse-dot"></span>
            <span>Live Verified</span>
          </span>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
          <span>Tracking <strong>${data?.models?.length || 10} Models</strong></span>
          <span>&bull;</span>
          <span><strong>${data?.features?.length || 7} Core Capabilities</strong></span>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <nav class="category-pills-row" aria-label="Category navigation">
        <button class="cat-pill ${store.activeCategory === "all" ? "active" : ""}" data-category="all">
          ${icons.layers(14)}
          <span>All Capabilities</span>
        </button>
        ${categories.map(cat => {
          const isActive = store.activeCategory === cat.id;
          const iconSvg = icons[cat.icon] ? icons[cat.icon](14) : icons.layers(14);
          return `
            <button class="cat-pill ${isActive ? "active" : ""}" data-category="${cat.id}">
              ${iconSvg}
              <span>${cat.name}</span>
            </button>
          `;
        }).join("")}
      </nav>
    </div>
  `;

  // Attach search listeners
  const searchInput = document.getElementById("global-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  const kbdHint = document.getElementById("search-kbd-hint");

  searchInput?.addEventListener("input", (e) => {
    const val = e.target.value;
    if (clearBtn) clearBtn.style.display = val ? "flex" : "none";
    if (kbdHint) kbdHint.style.display = val ? "none" : "inline-block";
    store.setSearchQuery(val);
  });

  clearBtn?.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    if (clearBtn) clearBtn.style.display = "none";
    if (kbdHint) kbdHint.style.display = "inline-block";
    store.setSearchQuery("");
  });

  // Attach theme listener
  document.getElementById("btn-theme-toggle")?.addEventListener("click", () => {
    store.toggleTheme();
  });

  // Attach diff modal listener
  document.getElementById("btn-open-diff")?.addEventListener("click", () => {
    store.openDiffModal();
  });

  // Attach category filter pills
  mount.querySelectorAll(".cat-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const catId = pill.getAttribute("data-category");
      store.setCategory(catId);
    });
  });
}
