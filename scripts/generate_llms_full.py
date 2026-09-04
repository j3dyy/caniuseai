#!/usr/bin/env python3
"""
Generate llms-full.txt from data/capabilities.json
"""
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "capabilities.json")
OUTPUT_PATH = os.path.join(BASE_DIR, "llms-full.txt")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

lines = []
lines.append("# CanAI — Complete AI Model & SDK Compatibility Reference")
lines.append("> Source: https://canai.usectl.com | Dataset: https://canai.usectl.com/data/capabilities.json")
lines.append(f"> Last Updated: {data.get('lastUpdated', '2026-09-04')}\n")

lines.append("## 1. Models & Context Specifications\n")
lines.append("| Model | Provider | Context Window | Max Output | Input Price / 1M | Output Price / 1M | Cached Read |")
lines.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
for m in data.get("models", []):
    p = m.get("pricing", {})
    lines.append(f"| **{m['name']}** | {m['providerName']} | {m['contextWindow']} | {m['maxOutput']} | {p.get('input', '-')} | {p.get('output', '-')} | {p.get('cachedInput', '-')} |")

lines.append("\n---\n")
lines.append("## 2. Capabilities Matrix & Exact SDK Parameters\n")

for feat in data.get("features", []):
    lines.append(f"### {feat['name']}")
    lines.append(f"**ID**: `{feat['id']}` | **Category**: {feat.get('categoryId', '')}")
    lines.append(f"{feat.get('description', '')}\n")
    
    lines.append("#### Model Support Breakdown:")
    support = feat.get("support", {})
    for m in data.get("models", []):
        mid = m["id"]
        if mid in support:
            info = support[mid]
            status_icon = "✅" if info.get("status") == "supported" else ("⚠️" if info.get("status") == "partial" else "❌")
            note_str = f" — *{info.get('notes')}*" if info.get("notes") else ""
            lines.append(f"- {status_icon} **{m['name']}**: **{info.get('label')}** (`{info.get('status')}`){note_str}")
    
    lines.append("\n#### Implementation Details:")
    impl = feat.get("implementation", {})
    if "syntax" in impl:
        lines.append(f"- **Syntax Reference**: `{impl['syntax']}`")
    if "paramName" in impl:
        lines.append(f"- **Key Parameter**: `{impl['paramName']}`")
    if "apiDocsUrl" in impl:
        lines.append(f"- **Official Documentation**: {impl['apiDocsUrl']}")
    
    snippets = impl.get("snippets", {})
    if snippets:
        lines.append("\n#### Code Examples:")
        for lang in ["python", "typescript", "php", "go"]:
            if lang in snippets:
                lines.append(f"##### {lang.title()}")
                lines.append(f"```{lang}")
                lines.append(snippets[lang].strip())
                lines.append("```\n")
    
    lines.append("\n---\n")

content = "\n".join(lines)
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print(f"[OK] Generated {OUTPUT_PATH} ({len(content)} bytes)")
