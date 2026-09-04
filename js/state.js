/**
 * CanIUse.ai - Reactive State Store
 */
export class StateStore {
  constructor() {
    this.data = null;
    this.searchQuery = "";
    this.activeCategory = "all";
    this.expandedFeatureId = null;
    this.activeCodeLang = "python"; // "python" | "typescript" | "go" | "php"
    this.theme = localStorage.getItem("caniuse_theme") || "dark";
    this.activeModelTarget = null;
    
    // Model Diff Mode state
    this.diffOpen = false;
    this.diffModelA = "gpt-4o";
    this.diffModelB = "claude-3-5-sonnet";

    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  async init() {
    // Set theme on root
    document.documentElement.setAttribute("data-theme", this.theme);

    // Read URL hash for deep-linking
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      if (hash.startsWith("cat-")) {
        this.activeCategory = hash.replace("cat-", "");
      } else {
        this.expandedFeatureId = hash;
      }
    }

    try {
      const res = await fetch(`./data/capabilities.json?_t=${Date.now()}`);
      if (res.ok) {
        this.data = await res.json();
      }
    } catch (err) {
      console.error("[CanIUse.ai] Failed to load capabilities dataset:", err);
    }

    this.notify();
  }

  setSearchQuery(q) {
    this.searchQuery = q.trim().toLowerCase();
    this.notify();
  }

  setCategory(catId) {
    this.activeCategory = catId;
    window.location.hash = catId === "all" ? "" : `cat-${catId}`;
    this.notify();
  }

  toggleExpandFeature(featureId, modelId = null) {
    if (this.expandedFeatureId === featureId && (!modelId || this.activeModelTarget === modelId)) {
      this.expandedFeatureId = null;
      this.activeModelTarget = null;
      window.location.hash = "";
    } else {
      this.expandedFeatureId = featureId;
      this.activeModelTarget = modelId;
      window.location.hash = featureId;
    }
    this.notify();
  }

  setCodeLang(lang) {
    this.activeCodeLang = lang;
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    localStorage.setItem("caniuse_theme", this.theme);
    document.documentElement.setAttribute("data-theme", this.theme);
    this.notify();
  }

  openDiffModal(modelA = null, modelB = null) {
    this.diffOpen = true;
    if (modelA) this.diffModelA = modelA;
    if (modelB) this.diffModelB = modelB;
    this.notify();
  }

  closeDiffModal() {
    this.diffOpen = false;
    this.notify();
  }

  setDiffModels(modelA, modelB) {
    this.diffModelA = modelA;
    this.diffModelB = modelB;
    this.notify();
  }

  getFilteredFeatures() {
    if (!this.data || !this.data.features) return [];
    let features = this.data.features;

    // Filter by Category
    if (this.activeCategory !== "all") {
      features = features.filter(f => f.categoryId === this.activeCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      features = features.filter(f => {
        const matchName = f.name.toLowerCase().includes(this.searchQuery);
        const matchSummary = f.summary.toLowerCase().includes(this.searchQuery);
        const matchGotchas = (f.gotchas || []).some(g => g.toLowerCase().includes(this.searchQuery));
        
        // Also match if user types a model name (e.g. "gemini")
        const matchModelSupport = Object.entries(f.support || {}).some(([mId, s]) => {
          return mId.includes(this.searchQuery) || (s.label && s.label.toLowerCase().includes(this.searchQuery));
        });

        return matchName || matchSummary || matchGotchas || matchModelSupport;
      });
    }

    return features;
  }
}

export const store = new StateStore();
