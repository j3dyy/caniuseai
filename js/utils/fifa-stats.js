/**
 * CanIUse.ai - FIFA 6-Clash Points Attribute Normalizer & Battle Referee Engine
 * Structured around the iconic 2-column FIFA format: 3 Stats Left, 3 Stats Right
 */

export const FIFA_CLASH_STATS = [
  // Left Column
  { key: "sjs", acronym: "SJS", label: "Strict JSON Schema", col: "left", row: 1 },
  { key: "prc", acronym: "PRC", label: "Prompt Caching", col: "left", row: 2 },
  { key: "thk", acronym: "THK", label: "Thinking Budget", col: "left", row: 3 },
  // Right Column
  { key: "ctx", acronym: "CTX", label: "Context Window", col: "right", row: 1 },
  { key: "cex", acronym: "CEX", label: "Code Execution", col: "right", row: 2 },
  { key: "pdf", acronym: "PDF", label: "Native PDF Layout", col: "right", row: 3 }
];

export const MODEL_FIFA_CARDS = {
  "claude-fable-5-1": {
    ovr: 99,
    position: "RSN",
    positionName: "Reasoning Apex",
    tier: "SUPREME ICON",
    badgeLabel: "Reasoning Apex",
    stats: { sjs: 94, prc: 99, thk: 99, ctx: 98, cex: 92, pdf: 99 },
    snippets: {
      sjs: "output_format: { type: 'json_schema', schema: ... } (zero syntax errors)",
      prc: "cache_control: { type: 'ephemeral' } ($2.50/M read vs $10.00/M write)",
      thk: "thinking: { type: 'adaptive', budget_tokens: 32768 } (autonomous reasoning)",
      ctx: "1,000,000 tokens context window (99.8% needle-in-haystack accuracy)",
      cex: "tools: [{ name: 'bash', input_schema: ... }] (client hosted sandbox)",
      pdf: "media_type: 'application/pdf' (100-page visual layout & table parser)"
    }
  },
  "gpt-6-astra": {
    ovr: 99,
    position: "AGT",
    positionName: "Autonomous Agent",
    tier: "SUPREME ICON",
    badgeLabel: "Autonomous Agent",
    stats: { sjs: 99, prc: 94, thk: 98, ctx: 96, cex: 98, pdf: 95 },
    snippets: {
      sjs: "response_format: { type: 'json_schema', strict: true } (100% adherence)",
      prc: "Automatic prefix caching ($2.50/M cached input)",
      thk: "reasoning_effort: 'ultra' | 'high' (self-correcting environment inspection)",
      ctx: "500,000 tokens context, 32,768 output ceiling",
      cex: "tools: [{ type: 'computer_2026' }] (native terminal, filesystem & GUI)",
      pdf: "Native document & chart visual understanding"
    }
  },
  "gemini-3-8-flash": {
    ovr: 98,
    position: "MMD",
    positionName: "Speed & Multimodal",
    tier: "TOTY",
    badgeLabel: "Speed & Multimodal Flagship",
    stats: { sjs: 97, prc: 98, thk: 97, ctx: 98, cex: 96, pdf: 98 },
    snippets: {
      sjs: "response_mime_type: 'application/json', response_schema: PydanticModel",
      prc: "Cached input: $0.075 / 1M (-90% effective read discount, 32k min)",
      thk: "thinking_config: { thinking_budget: 8192 } at 130+ T/s",
      ctx: "1,048,576 tokens native input window ($0.75/M)",
      cex: "tools: [{ code_execution: {} }] (Free Google serverless Python sandbox)",
      pdf: "inlineData: { mimeType: 'application/pdf' } (Direct PDF byte stream ingestion)"
    }
  },
  "claude-opus-5": {
    ovr: 98,
    position: "COD",
    positionName: "Master Code Architect",
    tier: "TOTY",
    badgeLabel: "Master Code Architect",
    stats: { sjs: 95, prc: 98, thk: 98, ctx: 98, cex: 94, pdf: 98 },
    snippets: {
      sjs: "tool_choice: { type: 'tool', name: 'json_output' }",
      prc: "cache_control: { type: 'ephemeral' } ($1.25/M read, ideal for refactors)",
      thk: "thinking: { type: 'enabled', budget_tokens: 16384 }",
      ctx: "1,000,000 tokens context, 16,384 output ceiling",
      cex: "Client orchestrator with automated error recovery",
      pdf: "Direct PDF layout parsing with table coordinate retention"
    }
  },
  "gemini-2-5-pro": {
    ovr: 98,
    position: "CTX",
    positionName: "2M Context King",
    tier: "TOTY",
    badgeLabel: "2M Context King",
    stats: { sjs: 98, prc: 97, thk: 98, ctx: 99, cex: 96, pdf: 99 },
    snippets: {
      sjs: "Strict Pydantic enforcement across entire 2M context window",
      prc: "Hourly context caching ($4.50/M/hr storage, $0.31/M read)",
      thk: "thinking_config: { thinking_budget: 16384 } across massive corpora",
      ctx: "2,097,152 tokens context window (industry peak depth)",
      cex: "tools: [{ code_execution: {} }] (Serverless Python sandbox included)",
      pdf: "Parses 1,000+ page filings and legal books with complete diagrams"
    }
  },
  "gpt-5-6-sol": {
    ovr: 98,
    position: "RSN",
    positionName: "STEM Reasoner",
    tier: "TOTY",
    badgeLabel: "STEM Reasoner",
    stats: { sjs: 99, prc: 95, thk: 99, ctx: 93, cex: 98, pdf: 93 },
    snippets: {
      sjs: "response_format: { type: 'json_schema', strict: true }",
      prc: "Automatic prefix caching ($1.00/M cached input)",
      thk: "reasoning_effort: 'high' (up to 32,768 output tokens for formal proofs)",
      ctx: "256,000 tokens context, 32,768 output ceiling",
      cex: "tools: [{ type: 'code_interpreter' }] (Formal execution verification)",
      pdf: "Perceives math formulas; complex visual layouts require rasterization"
    }
  },
  "deepseek-v4-pro": {
    ovr: 98,
    position: "FRN",
    positionName: "1.6T MoE Titan",
    tier: "TOTY",
    badgeLabel: "1.6T MoE Titan",
    stats: { sjs: 96, prc: 99, thk: 98, ctx: 94, cex: 88, pdf: 88 },
    snippets: {
      sjs: "response_format: { type: 'json_object', schema: ... }",
      prc: "Cached input: $0.07 / 1M (-90% discount, 64-token chunking)",
      thk: "thinking: { type: 'enabled' } (Integrated reasoning inside MoE)",
      ctx: "128,000 tokens context, 16,384 output ceiling ($0.27/M in)",
      cex: "Client sandbox runner required for emitted Python blocks",
      pdf: "Client text extraction required; raw text parsing"
    }
  },
  "claude-sonnet-5": {
    ovr: 97,
    position: "COD",
    positionName: "Everyday Standard",
    tier: "Gold Rare",
    badgeLabel: "Everyday Standard",
    stats: { sjs: 93, prc: 97, thk: 95, ctx: 98, cex: 90, pdf: 98 },
    snippets: {
      sjs: "tool_choice: { type: 'tool', name: 'schema' }",
      prc: "cache_control: { type: 'ephemeral' } ($0.75/M read)",
      thk: "thinking: { type: 'enabled', budget_tokens: 8192 }",
      ctx: "1,000,000 tokens context, 16,384 output ceiling",
      cex: "Client sandbox runner required",
      pdf: "media_type: 'application/pdf' (100-page visual layout parser)"
    }
  },
  "gemini-2-5-flash": {
    ovr: 95,
    position: "SPD",
    positionName: "High-Volume Value",
    tier: "Gold Rare",
    badgeLabel: "High-Volume Value",
    stats: { sjs: 96, prc: 96, thk: 92, ctx: 98, cex: 95, pdf: 96 },
    snippets: {
      sjs: "response_mime_type: 'application/json', response_schema: PydanticModel",
      prc: "Cached input: $0.0375 / 1M (-75% discount at $0.15 base)",
      thk: "thinking_config: { thinking_budget: 2048 }",
      ctx: "1,048,576 tokens native input window ($0.15/M)",
      cex: "tools: [{ code_execution: {} }] (Zero-cost Python sandbox)",
      pdf: "inlineData: { mimeType: 'application/pdf' } (Fast multimodal vision)"
    }
  },
  "llama-3-3-70b": {
    ovr: 94,
    position: "SPD",
    positionName: "Hardware LPU Sprinter",
    tier: "Gold Rare",
    badgeLabel: "300+ T/s Hardware LPU",
    stats: { sjs: 85, prc: 40, thk: 82, ctx: 90, cex: 70, pdf: 30 },
    snippets: {
      sjs: "Groq CFG-constrained schema sampling natively",
      prc: "No prompt caching on Groq LPUs (billed full input every turn)",
      thk: "Prompt-based chain-of-thought at 300+ Tokens/sec",
      ctx: "128,000 tokens context, 8,192 output ceiling",
      cex: "Client execution required",
      pdf: "Text-only tokens; requires multimodal vision frontend"
    }
  }
};

/**
 * Returns complete card data for a model
 */
export function getModelFifaCard(model) {
  if (!model) return null;
  const cardData = MODEL_FIFA_CARDS[model.id] || {
    ovr: 90,
    position: "AGI",
    positionName: "General AI",
    tier: "Gold Rare",
    badgeLabel: model.badge || "AI Model",
    stats: { sjs: 85, prc: 80, thk: 70, ctx: 84, cex: 70, pdf: 60 },
    snippets: {
      sjs: "Standard structured output",
      prc: "Standard caching",
      thk: "Standard reasoning",
      ctx: model.contextWindow || "128k",
      cex: "Standard tool use",
      pdf: "Standard multimodal"
    }
  };

  return {
    id: model.id,
    name: model.name,
    provider: model.provider,
    providerName: model.providerName,
    contextWindow: model.contextWindow,
    maxOutput: model.maxOutput,
    ...cardData
  };
}

/**
 * Resolves a 1v1 Battle Duel across the 6 clash points:
 * Returns round-by-round results, deltas, winners, and developer verdict
 */
export function resolveDuel(modelA, modelB) {
  const cardA = getModelFifaCard(modelA);
  const cardB = getModelFifaCard(modelB);

  let scoreA = 0;
  let scoreB = 0;
  let criticalA = 0;
  let criticalB = 0;

  const rounds = FIFA_CLASH_STATS.map((stat, idx) => {
    const valA = cardA.stats[stat.key];
    const valB = cardB.stats[stat.key];
    const delta = valA - valB;
    const isCritical = Math.abs(delta) >= 20;

    let winner = "tie";
    if (delta > 0) {
      winner = "A";
      scoreA += 1;
      if (isCritical) criticalA += 1;
    } else if (delta < 0) {
      winner = "B";
      scoreB += 1;
      if (isCritical) criticalB += 1;
    } else {
      scoreA += 0.5;
      scoreB += 0.5;
    }

    return {
      round: idx + 1,
      key: stat.key,
      acronym: stat.acronym,
      label: stat.label,
      col: stat.col,
      valA,
      valB,
      delta,
      winner,
      isCritical,
      snippetA: cardA.snippets[stat.key],
      snippetB: cardB.snippets[stat.key]
    };
  });

  // Calculate overall winner
  let matchWinner = "tie";
  let winningCard = null;
  let losingCard = null;

  if (scoreA > scoreB) {
    matchWinner = "A";
    winningCard = cardA;
    losingCard = cardB;
  } else if (scoreB > scoreA) {
    matchWinner = "B";
    winningCard = cardB;
    losingCard = cardA;
  } else {
    // Tiebreaker: Sum of stats, then OVR
    const sumA = Object.values(cardA.stats).reduce((a, b) => a + b, 0);
    const sumB = Object.values(cardB.stats).reduce((a, b) => a + b, 0);
    if (sumA > sumB) {
      matchWinner = "A";
      winningCard = cardA;
      losingCard = cardB;
    } else if (sumB > sumA) {
      matchWinner = "B";
      winningCard = cardB;
      losingCard = cardA;
    } else if (cardA.ovr > cardB.ovr) {
      matchWinner = "A";
      winningCard = cardA;
      losingCard = cardB;
    } else {
      matchWinner = "B";
      winningCard = cardB;
      losingCard = cardA;
    }
  }

  // Developer Recommendation Verdict
  const verdict = generateVerdict(cardA, cardB, matchWinner, rounds);

  return {
    cardA,
    cardB,
    scoreA,
    scoreB,
    matchWinner,
    winningCard,
    losingCard,
    rounds,
    verdict
  };
}

/**
 * Synthesizes actionable engineering recommendation based on clash outcome
 */
function generateVerdict(cardA, cardB, matchWinner, rounds) {
  if (matchWinner === "tie") {
    return `Evenly matched across reasoning and latency. Choose ${cardA.name} for strict syntax or ${cardB.name} for specific pricing economics.`;
  }

  const winner = matchWinner === "A" ? cardA : cardB;
  const loser = matchWinner === "A" ? cardB : cardA;
  const wonRounds = rounds.filter(r => (matchWinner === "A" ? r.winner === "A" : r.winner === "B"));
  const criticalRounds = wonRounds.filter(r => r.isCritical);

  if (criticalRounds.length > 0) {
    const topBlowout = criticalRounds[0];
    return `${winner.name} delivered a decisive knockout in ${topBlowout.label} (${topBlowout.acronym} +${Math.abs(topBlowout.delta)} delta), establishing an overwhelming technical advantage for agentic pipelines.`;
  }

  if (wonRounds.some(r => r.key === "sjs" || r.key === "cex")) {
    return `${winner.name} secured victory through superior deterministic schema compliance and autonomous Python code execution. Ideal for mission-critical enterprise production.`;
  }

  return `${winner.name} edged out ${loser.name} across core capability benchmarks, offering higher performance density and lower long-horizon operating cost.`;
}
