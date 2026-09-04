/**
 * CanIUse.ai - FIFA Ultimate Team (FUT) Card Component
 * 2-Column 6-Clash Points Architecture (3 Left, 3 Right) with Upward Hover Tooltips
 */

import { getProviderLogoSvg, renderFutShieldSvg } from "../utils/provider-logos.js";
import { getModelFifaCard, FIFA_CLASH_STATS } from "../utils/fifa-stats.js";

/**
 * Renders an authentic 2-column FIFA Card HTML string
 */
export function renderFifaCard(model, opponentModel = null, options = {}) {
  const card = getModelFifaCard(model);
  const opponentCard = opponentModel ? getModelFifaCard(opponentModel) : null;
  const isWinner = options.isWinner || false;
  const slot = options.slot || "A";

  const providerLogoSmall = getProviderLogoSvg(card.provider, 20, "fifa-provider-icon");
  const futShieldMarkup = renderFutShieldSvg({
    provider: card.provider,
    isWinner: isWinner,
    width: 170,
    height: 160
  });

  // Split the 6 clash points into Left Column (3) and Right Column (3)
  const leftStats = FIFA_CLASH_STATS.filter(s => s.col === "left");
  const rightStats = FIFA_CLASH_STATS.filter(s => s.col === "right");

  let winCount = 0;
  let lossCount = 0;

  // Helper to render a stat item block
  const renderStatItem = (stat) => {
    const val = card.stats[stat.key];
    const oppVal = opponentCard ? opponentCard.stats[stat.key] : null;
    let stateClass = "";
    let chipMarkup = "";
    let deltaText = "";

    if (oppVal !== null) {
      const delta = val - oppVal;
      if (delta > 0) {
        stateClass = "is-winner";
        chipMarkup = `<span class="fifa-stat-item__chip fifa-stat-item__chip--win">+WIN</span>`;
        deltaText = `<span class="delta-tag delta-tag--win">Ahead (+${delta})</span> vs ${opponentCard.name}`;
        winCount++;
      } else if (delta < 0) {
        stateClass = "is-loser";
        chipMarkup = `<span class="fifa-stat-item__chip fifa-stat-item__chip--loss">-LOSS</span>`;
        deltaText = `<span class="delta-tag delta-tag--loss">Behind (${delta})</span> vs ${opponentCard.name}`;
        lossCount++;
      } else {
        chipMarkup = `<span class="fifa-stat-item__chip" style="opacity:0.7;color:#fbbf24;background:rgba(245,158,11,0.2);">=TIE</span>`;
        deltaText = `<span class="delta-tag" style="color:#fbbf24;">Parity (0)</span> vs ${opponentCard.name}`;
      }
    }

    const snippet = card.snippets[stat.key] || "";

    return `
      <div class="fifa-stat-item ${stateClass}" tabindex="0" data-stat-key="${stat.key}" data-stat-val="${val}">
        <div class="fifa-stat-item__row">
          <span class="fifa-stat-item__val">${val}</span>
          <span class="fifa-stat-item__key">${stat.acronym}</span>
          ${chipMarkup}
        </div>
        <!-- Upward-Popping Interactive Popover -->
        <div class="fifa-stat-popover" role="tooltip">
          <div class="fifa-stat-popover__header">
            <span class="fifa-stat-popover__title">${stat.label}</span>
            <span class="fifa-stat-popover__score">${val}/99</span>
          </div>
          <div class="fifa-stat-popover__code">
            <code>${snippet}</code>
          </div>
          ${deltaText ? `<div class="fifa-stat-popover__delta">${deltaText}</div>` : ""}
        </div>
      </div>
    `;
  };

  return `
    <div class="fifa-card-container" data-slot="${slot}" data-model-id="${card.id}">
      <article class="fifa-card ${isWinner ? "is-winner" : ""}" id="fifa-card-${slot}">
        <!-- Card Header: Rating, Position, Provider Logo, Shield Crest -->
        <header class="fifa-card__header">
          <div class="fifa-card__badge-cluster">
            <span class="fifa-card__ovr">${card.ovr}</span>
            <span class="fifa-card__pos">${card.position}</span>
            <div class="fifa-card__provider-badge" title="${card.providerName}">
              ${providerLogoSmall}
            </div>
          </div>
          <div class="fifa-card__crest-wrap">
            ${futShieldMarkup}
          </div>
        </header>

        <!-- Player / Model Name Banner -->
        <div class="fifa-card__identity">
          <h3 class="fifa-card__name">${card.name}</h3>
          <div class="fifa-card__sublabel">${card.providerName} &bull; ${card.badgeLabel}</div>
        </div>

        <!-- Metallic Gold Separator Line -->
        <div class="fifa-card__gold-band"></div>

        <!-- 6-Clash Points Stat Board (3 Left / 3 Right) -->
        <section class="fifa-clash-board" aria-label="${card.name} Capability Clash Stats">
          <!-- Left Column (SJS, PRC, THK) -->
          <div class="fifa-clash-board__column fifa-clash-board__column--left">
            ${leftStats.map(renderStatItem).join("")}
          </div>

          <!-- Vertical Metallic Gold Hairline Divider -->
          <div class="fifa-clash-board__divider" aria-hidden="true"></div>

          <!-- Right Column (CTX, CEX, PDF) -->
          <div class="fifa-clash-board__column fifa-clash-board__column--right">
            ${rightStats.map(renderStatItem).join("")}
          </div>
        </section>

        <!-- Card Footer -->
        <footer class="fifa-card__footer">
          <div class="fifa-card__record">
            ${opponentCard ? `
              <span class="record-score win">${winCount}W</span> - <span class="record-score loss">${lossCount}L</span>
            ` : `
              <span style="color: var(--fifa-gold-text);">${card.contextWindow} CTX</span>
            `}
          </div>
          <div class="fifa-card__tier">FUT FRONTIER '26</div>
        </footer>
      </article>
    </div>
  `;
}

/**
 * Attaches interactive 3D perspective mouse tilt with specular glint
 */
export function attachFifaCardTilt(cardContainerEl) {
  if (!cardContainerEl) return;
  const card = cardContainerEl.querySelector(".fifa-card");
  if (!card) return;

  function onMouseMove(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rotY = ((x - centerX) / centerX) * 10;

    card.style.transition = "transform 0.06s ease-out, box-shadow 0.2s ease";
    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function onMouseLeave() {
    card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease";
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }

  cardContainerEl.addEventListener("mousemove", onMouseMove);
  cardContainerEl.addEventListener("mouseleave", onMouseLeave);
}
