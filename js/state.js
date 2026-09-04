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
    
    // Model Diff Mode state (supports 2 or 3 models dynamically)
    this.diffOpen = false;
    this.diffModels = ["gpt-4o", "claude-3-5-sonnet"];

    this.listeners = [];
  }

  get diffModelA() {
    return this.diffModels[0] || "gpt-4o";
  }

  set diffModelA(val) {
    this.diffModels[0] = val;
  }

  get diffModelB() {
    return this.diffModels[1] || "claude-3-5-sonnet";
  }

  set diffModelB(val) {
    this.diffModels[1] = val;
  }

  get diffModelC() {
    return this.diffModels[2] || null;
  }

  set diffModelC(val) {
    if (val) {
      this.diffModels[2] = val;
    } else if (this.diffModels.length > 2) {
      this.diffModels.splice(2, 1);
    }
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

  openDiffModal(modelA = null, modelB = null, modelC = null) {
    this.diffOpen = true;
    if (modelA) this.diffModels[0] = modelA;
    if (modelB) this.diffModels[1] = modelB;
    if (modelC) {
      this.diffModels[2] = modelC;
    }
    this.notify();
  }

  closeDiffModal() {
    this.diffOpen = false;
    this.notify();
  }

  setDiffModels(modelA, modelB, modelC = null) {
    if (modelC) {
      this.diffModels = [modelA, modelB, modelC];
    } else if (this.diffModels.length === 3) {
      this.diffModels = [modelA, modelB, this.diffModels[2]];
    } else {
      this.diffModels = [modelA, modelB];
    }
    this.notify();
  }

  setDiffModelAt(index, modelId) {
    if (index >= 0 && index < this.diffModels.length) {
      this.diffModels[index] = modelId;
      this.notify();
    }
  }

  addDiffModel(modelId = null) {
    if (this.diffModels.length >= 3) return;
    if (!modelId && this.data && this.data.models) {
      const unused = this.data.models.find(m => !this.diffModels.includes(m.id));
      modelId = unused ? unused.id : this.data.models[0].id;
    }
    this.diffModels.push(modelId || "gemini-2.0-flash");
    this.notify();
  }

  removeDiffModel(index = 2) {
    if (this.diffModels.length > 2 && index >= 0 && index < this.diffModels.length) {
      this.diffModels.splice(index, 1);
      this.notify();
    }
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
