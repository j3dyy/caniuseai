# CanAI ⚡
> **[canai.usectl.com](https://canai.usectl.com)** &bull; The **[caniuse.com](https://caniuse.com)** for AI models & SDKs.

Instantly answers: **"Can this model do X, and what is the exact SDK parameter?"** across OpenAI, Anthropic Claude, Google Gemini, DeepSeek, and Groq.

---

## 🌟 Key Features

- **Strict Schema Matrix**: Instantly check which models support strict JSON Schema (`strict: true`) vs tool-calling workarounds.
- **Prompt Caching Economics**: Compare minimum tokens (1,024 vs 32,768), write penalties (1.25x vs 1.0x), and read discounts (50% to 90%).
- **Reasoning Budgets**: Exact parameter syntax for reasoning tokens (`budget_tokens` vs `reasoning_effort`).
- **Multimodal Audio/Video/PDF**: Which models natively accept raw audio/video vs requiring Whisper/OCR pipelines.
- **1-Click Ready-to-Run Code**: Copy production Python (`google-genai`, `openai`, `anthropic`, `php`, `go`) and TypeScript snippets.
- **Side-by-Side Model Diff**: Compare up to 3 models (e.g. `GPT-4o` vs `Claude 3.5 Sonnet` vs `Gemini 2.0 Flash`) in a clean comparison table.
- **Fast & Zero Friction**: No signup, no auth, loads in <250ms, 100% responsive, dark mode by default with keyboard navigation (`/`, `Esc`, `C`).

---

## 🚀 Running Locally

### Option 1: Python (Zero Dependency)
```bash
python3 server.py
```

### Option 2: Docker
```bash
# Build the Docker image
docker build -t canai .

# Run container
docker run -d -p 8081:8081 --name canai canai
```

Open **http://localhost:8081** in your browser.

---

## 🧪 Automated Capability Verification Prober

Run the synthetic prober to verify parameter mappings:
```bash
# Dry-run validation
python3 scripts/probe.py

# Write updated timestamps
python3 scripts/probe.py --write
```

---

## 🤝 Contributing

Contributions are welcomed via pull requests!
1. Add new models or parameters to `data/capabilities.json`.
2. Ensure it conforms to `data/schema.json`.
3. Submit a PR.
