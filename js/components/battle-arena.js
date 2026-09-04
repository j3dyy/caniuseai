/**
 * CanIUse.ai - FIFA Card Battle Arena Component
 * 6-Round Double Cascade Laser Clash, Confetti Physics, & Victory Crowning
 */

import { renderFifaCard, attachFifaCardTilt } from "./fifa-card.js";
import { resolveDuel, FIFA_CLASH_STATS, getModelFifaCard } from "../utils/fifa-stats.js";
import { icons } from "../utils/icons.js";
import { getProviderLogoSvg } from "../utils/provider-logos.js";

let currentClashAnimation = null;

function renderSearchableDropdown(slot, currentModel, models, opponentModel) {
  const currentFifa = getModelFifaCard(currentModel);
  const currentLogo = getProviderLogoSvg(currentModel.provider, 18, "dropdown-trigger-logo");

  return `
    <div class="arena-selector-group">
      <span class="arena-selector-label">FIGHTER ${slot + 1}:</span>
      <div class="arena-searchable-dropdown" data-slot="${slot}">
        <button type="button" class="arena-dropdown-trigger" id="dropdown-trigger-${slot}" aria-expanded="false" aria-haspopup="listbox" title="Select Fighter ${slot + 1}">
          <span class="dropdown-trigger-left">
            <span class="dropdown-trigger-icon">${currentLogo}</span>
            <span class="dropdown-trigger-name">${currentModel.name}</span>
          </span>
          <span class="dropdown-trigger-right">
            <span class="dropdown-trigger-ovr">${currentFifa.ovr} ${currentFifa.position}</span>
            <span class="dropdown-chevron">${icons.chevronDown(14)}</span>
          </span>
        </button>

        <div class="arena-dropdown-popover" id="dropdown-popover-${slot}">
          <div class="arena-search-box">
            <span class="arena-search-icon">${icons.search(14)}</span>
            <input type="text" class="arena-search-input" placeholder="Search models, providers, roles..." autocomplete="off" />
            <button type="button" class="arena-search-clear" title="Clear search" style="display:none;">&times;</button>
          </div>

          <div class="arena-dropdown-list" role="listbox">
            ${models.map(m => {
              const fifa = getModelFifaCard(m);
              const logo = getProviderLogoSvg(m.provider, 20, "dropdown-item-logo");
              const isSelected = m.id === currentModel.id;
              const isOpponent = m.id === opponentModel.id;

              return `
                <div class="arena-dropdown-item ${isSelected ? "is-selected" : ""} ${isOpponent ? "is-opponent" : ""}"
                     role="option"
                     aria-selected="${isSelected}"
                     data-model-id="${m.id}"
                     data-name="${m.name.toLowerCase()}"
                     data-provider="${m.providerName.toLowerCase()}"
                     data-position="${fifa.position.toLowerCase()}"
                     data-role="${fifa.positionName.toLowerCase()}">
                  <span class="item-left">
                    <span class="item-logo">${logo}</span>
                    <span class="item-details">
                      <span class="item-name">${m.name}</span>
                      <span class="item-provider">${m.providerName} &bull; ${m.contextWindow}</span>
                    </span>
                  </span>
                  <span class="item-right">
                    <span class="item-ovr-badge ${fifa.ovr >= 98 ? "badge-top" : ""}">
                      ${fifa.ovr >= 98 ? '👑 ' : ''}${fifa.ovr} ${fifa.position}
                    </span>
                    ${isSelected ? '<span class="item-status-check">✓</span>' : (isOpponent ? '<span class="item-opponent-tag">Opponent</span>' : '')}
                  </span>
                </div>
              `;
            }).join("")}
            <div class="arena-dropdown-empty" style="display: none;">
              No models found matching "<span class="empty-query"></span>"
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderBattleArena(store) {
  const data = store.data;
  if (!data) return "";

  const models = data.models || [];
  const modelIdA = store.diffModels[0] || "claude-3-5-sonnet";
  const modelIdB = store.diffModels[1] || "gemini-2-0-flash";

  const modelA = models.find(m => m.id === modelIdA) || models[0];
  const modelB = models.find(m => m.id === modelIdB) || models[1] || models[0];

  const duel = resolveDuel(modelA, modelB);
  const initialWinnerName = duel.winningCard ? duel.winningCard.name : modelA.name;
  const initialLoserName = duel.losingCard ? duel.losingCard.name : modelB.name;
  const initialShareUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?battle=1&m1=${modelA.id}&m2=${modelB.id}`
    : `?battle=1&m1=${modelA.id}&m2=${modelB.id}`;
  const initialTweetText = duel.matchWinner === "tie"
    ? `⚡ FIFA Card Clash: ${modelA.name} vs ${modelB.name} ended in a draw (${duel.scoreA}-${duel.scoreB}) on CanIUse.ai! Check it out:`
    : `👑 ${initialWinnerName} defeated ${initialLoserName} (${duel.scoreA}-${duel.scoreB}) in the CanIUse.ai FIFA Card Battle Arena! See the clash breakdown:`;
  const initialTweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(initialTweetText)}&url=${encodeURIComponent(initialShareUrl)}`;

  return `
    <div class="battle-arena" id="battle-arena-stage">
      <!-- Arena Top HUD: Scoreboard & Round Indicator -->
      <div class="arena-hud">
        <div class="arena-round-indicator" id="arena-round-tag">Ready for Clash</div>
        <div class="arena-scoreboard">
          <span class="arena-score-num" id="hud-score-a">0</span>
          <span class="arena-score-divider">:</span>
          <span class="arena-score-num" id="hud-score-b">0</span>
        </div>
      </div>

      <!-- Arena Dynamic Selector Deck -->
      <div class="arena-selector-deck">
        ${renderSearchableDropdown(0, modelA, models, modelB)}
        ${renderSearchableDropdown(1, modelB, models, modelA)}
      </div>

      <!-- Arena Main Stage: Left Card - Center Clash - Right Card -->
      <div class="arena-stage" id="arena-main-stage">
        <!-- Card A (Left) -->
        <div class="card-fighter card-left idle-floating" id="fighter-container-a" data-slot="A">
          ${renderFifaCard(modelA, modelB, { slot: "A", isWinner: false })}
        </div>

        <!-- Center Clash Controls -->
        <div class="arena-center-clash">
          <button class="btn-trigger-clash" id="btn-start-clash" title="Trigger head-to-head capability clash">
            <span>${icons.zap(20)}</span>
            <span>BATTLE</span>
          </button>
          <div class="arena-vs-badge" id="arena-vs-bolt">VS</div>
        </div>

        <!-- Card B (Right) -->
        <div class="card-fighter card-right idle-floating-alt" id="fighter-container-b" data-slot="B">
          ${renderFifaCard(modelB, modelA, { slot: "B", isWinner: false })}
        </div>

        <!-- Dynamic Laser Beam Canvas Overlay -->
        <canvas class="arena-laser-canvas" id="stat-laser-canvas"></canvas>

        <!-- Fullscreen Flash & Screen Shake Overlay -->
        <div class="arena-flash-overlay" id="arena-flash"></div>

        <!-- Confetti Canvas Overlay -->
        <canvas class="arena-confetti-canvas" id="confetti-canvas"></canvas>
      </div>

      <!-- Victory Banner Plaque (Crowning) -->
      <div class="victory-banner" id="victory-banner">
        <div class="victory-banner__trophy">🏆</div>
        <h3 class="victory-banner__title" id="victory-banner-title">MATCH WINNER</h3>
        <div class="victory-banner__score" id="victory-banner-score">4 - 2</div>
        <p class="victory-banner__verdict" id="victory-banner-verdict">
          ${duel.verdict}
        </p>
        <div class="victory-share-row">
          <button class="btn-share-match" id="btn-share-match" title="Copy shareable link for this battle">
            <span>🔗</span>
            <span>Copy Match Link</span>
          </button>
          <a class="btn-share-x" id="btn-share-x" href="${initialTweetHref}" target="_blank" rel="noopener noreferrer" title="Share result on X / Twitter">
            <span>𝕏</span>
            <span>Share on X</span>
          </a>
        </div>
      </div>

      <!-- Post-Battle Action Deck -->
      <div class="arena-post-controls" id="arena-post-controls" style="display: none;">
        <button class="btn-replay-clash" id="btn-replay-clash">
          <span>${icons.refresh ? icons.refresh(15) : "↻"}</span>
          <span>Replay Clash</span>
        </button>
      </div>

      <!-- Toast Notification -->
      <div class="share-toast" id="share-toast">
        <span>✓</span>
        <span id="share-toast-text">Link copied!</span>
      </div>
    </div>
  `;
}

/**
 * Attaches events and orchestrates the 6-round clash animation
 */
export function attachBattleArenaEvents(mount, store) {
  const arenaEl = mount.querySelector("#battle-arena-stage");
  if (!arenaEl) return;

  // 3D Mouse Tilt on both cards
  const containerA = arenaEl.querySelector("#fighter-container-a");
  const containerB = arenaEl.querySelector("#fighter-container-b");
  attachFifaCardTilt(containerA);
  attachFifaCardTilt(containerB);

  // Searchable Fighter Dropdowns inside arena
  const dropdownEls = arenaEl.querySelectorAll(".arena-searchable-dropdown");

  const closeAllDropdowns = () => {
    dropdownEls.forEach(dd => {
      dd.classList.remove("is-open");
      const trigger = dd.querySelector(".arena-dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  };

  dropdownEls.forEach(dd => {
    const slot = parseInt(dd.getAttribute("data-slot"), 10);
    const trigger = dd.querySelector(".arena-dropdown-trigger");
    const popover = dd.querySelector(".arena-dropdown-popover");
    const searchInput = dd.querySelector(".arena-search-input");
    const clearBtn = dd.querySelector(".arena-search-clear");
    const items = dd.querySelectorAll(".arena-dropdown-item");
    const emptyEl = dd.querySelector(".arena-dropdown-empty");
    const emptyQueryEl = dd.querySelector(".empty-query");

    // Toggle popover on trigger click
    trigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains("is-open");
      closeAllDropdowns();
      if (!isOpen) {
        dd.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        if (searchInput) {
          searchInput.value = "";
          if (clearBtn) clearBtn.style.display = "none";
          items.forEach(it => it.style.display = "flex");
          if (emptyEl) emptyEl.style.display = "none";
          setTimeout(() => searchInput.focus(), 60);
        }
      }
    });

    // Don't close popover when clicking inside search box
    popover?.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Live search filter
    searchInput?.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = q ? "block" : "none";

      let matchCount = 0;
      items.forEach(it => {
        const name = it.getAttribute("data-name") || "";
        const provider = it.getAttribute("data-provider") || "";
        const position = it.getAttribute("data-position") || "";
        const role = it.getAttribute("data-role") || "";
        const id = it.getAttribute("data-model-id") || "";

        const matches = !q || name.includes(q) || provider.includes(q) || position.includes(q) || role.includes(q) || id.includes(q);
        it.style.display = matches ? "flex" : "none";
        if (matches) matchCount++;
      });

      if (emptyEl) {
        emptyEl.style.display = matchCount === 0 ? "block" : "none";
        if (emptyQueryEl) emptyQueryEl.textContent = searchInput.value;
      }
    });

    // Clear search button
    clearBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.focus();
      }
    });

    // Option item select
    items.forEach(it => {
      it.addEventListener("click", (e) => {
        e.stopPropagation();
        const modelId = it.getAttribute("data-model-id");
        closeAllDropdowns();
        store.setDiffModelAt(slot, modelId);
      });
    });
  });

  // Global document click to close dropdowns
  const handleDocClick = (e) => {
    if (!e.target.closest(".arena-searchable-dropdown")) {
      closeAllDropdowns();
    }
  };
  document.addEventListener("click", handleDocClick);

  // Escape key to close dropdowns
  const handleDocKeydown = (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  };
  document.addEventListener("keydown", handleDocKeydown);

  // Battle ignition button
  const clashBtn = arenaEl.querySelector("#btn-start-clash");
  const replayBtn = arenaEl.querySelector("#btn-replay-clash");

  const startClash = () => {
    const data = store.data;
    if (!data) return;
    const modelA = data.models.find(m => m.id === store.diffModels[0]) || data.models[0];
    const modelB = data.models.find(m => m.id === store.diffModels[1]) || data.models[1];

    runChoreographedClash(arenaEl, modelA, modelB);
  };

  clashBtn?.addEventListener("click", startClash);
  replayBtn?.addEventListener("click", startClash);

  // Share Match button listener
  arenaEl.querySelector("#btn-share-match")?.addEventListener("click", () => {
    const data = store.data;
    if (!data) return;
    const modelA = data.models.find(m => m.id === store.diffModels[0]) || data.models[0];
    const modelB = data.models.find(m => m.id === store.diffModels[1]) || data.models[1];
    const duel = resolveDuel(modelA, modelB);
    const winnerName = duel.winningCard ? duel.winningCard.name : modelA.name;
    const loserName = duel.losingCard ? duel.losingCard.name : modelB.name;

    const shareUrl = `${window.location.origin}${window.location.pathname}?battle=1&m1=${modelA.id}&m2=${modelB.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      const toast = arenaEl.querySelector("#share-toast");
      const toastText = arenaEl.querySelector("#share-toast-text");
      if (toast && toastText) {
        toastText.textContent = `👑 ${winnerName} vs ${loserName} (${duel.scoreA}-${duel.scoreB}) link copied!`;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2800);
      }
    }).catch(() => {
      prompt("Copy battle link:", shareUrl);
    });
  });
}

/**
 * Runs the 6-Round double cascade clash animation timeline
 */
async function runChoreographedClash(arenaEl, modelA, modelB) {
  const duel = resolveDuel(modelA, modelB);

  const cardContainerA = arenaEl.querySelector("#fighter-container-a");
  const cardContainerB = arenaEl.querySelector("#fighter-container-b");
  const cardA = cardContainerA?.querySelector(".fifa-card");
  const cardB = cardContainerB?.querySelector(".fifa-card");
  const vsBolt = arenaEl.querySelector("#arena-vs-bolt");
  const clashBtn = arenaEl.querySelector("#btn-start-clash");
  const roundTag = arenaEl.querySelector("#arena-round-tag");
  const scoreElA = arenaEl.querySelector("#hud-score-a");
  const scoreElB = arenaEl.querySelector("#hud-score-b");
  const laserCanvas = arenaEl.querySelector("#stat-laser-canvas");
  const flashOverlay = arenaEl.querySelector("#arena-flash");
  const victoryBanner = arenaEl.querySelector("#victory-banner");
  const postControls = arenaEl.querySelector("#arena-post-controls");

  if (!cardA || !cardB) return;

  // Reset states
  clashBtn.style.display = "none";
  if (postControls) postControls.style.display = "none";
  if (victoryBanner) victoryBanner.classList.remove("active");

  cardContainerA.classList.remove("idle-floating", "winner-crowning", "loser-dimmed");
  cardContainerB.classList.remove("idle-floating-alt", "winner-crowning", "loser-dimmed");
  cardA.classList.remove("is-winner");
  cardB.classList.remove("is-winner");

  // Reset individual stat winner/loser markers
  arenaEl.querySelectorAll(".fifa-stat-item").forEach(item => {
    item.classList.remove("is-winner", "is-loser");
  });

  if (scoreElA) scoreElA.textContent = "0";
  if (scoreElB) scoreElB.textContent = "0";

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // --------------------------------------------------------------------------
  // Stage 1: Entrance Slide & Float
  // --------------------------------------------------------------------------
  if (roundTag) roundTag.textContent = "Igniting Arena...";
  cardContainerA.classList.add("sliding-in");
  cardContainerB.classList.add("sliding-in");

  await sleep(750);
  cardContainerA.classList.remove("sliding-in");
  cardContainerB.classList.remove("sliding-in");
  cardContainerA.classList.add("idle-floating");
  cardContainerB.classList.add("idle-floating-alt");

  // --------------------------------------------------------------------------
  // Stage 2: Battle Ignition
  // --------------------------------------------------------------------------
  if (vsBolt) {
    vsBolt.style.animation = "vsBoltCharge 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
  }
  await sleep(650);

  // --------------------------------------------------------------------------
  // Stage 3: Sequential 6-Round Clash Cascade
  // (Left column: SJS -> PRC -> THK, Right column: CTX -> CEX -> PDF)
  // --------------------------------------------------------------------------
  let currentScoreA = 0;
  let currentScoreB = 0;

  for (const round of duel.rounds) {
    if (roundTag) {
      roundTag.textContent = `Round ${round.round}/6: ${round.acronym} (${round.label})`;
    }

    const statItemA = cardA.querySelector(`.fifa-stat-item[data-stat-key="${round.key}"]`);
    const statItemB = cardB.querySelector(`.fifa-stat-item[data-stat-key="${round.key}"]`);

    // Draw Laser Beam across the arena
    drawLaserBeam(laserCanvas, arenaEl, statItemA, statItemB);

    await sleep(250);

    // Apply round winner/loser indicators
    if (round.winner === "A") {
      currentScoreA++;
      statItemA?.classList.add("is-winner");
      statItemB?.classList.add("is-loser");
      if (scoreElA) {
        scoreElA.textContent = String(currentScoreA);
        scoreElA.style.transform = "scale(1.35)";
        setTimeout(() => (scoreElA.style.transform = "scale(1)"), 200);
      }
    } else if (round.winner === "B") {
      currentScoreB++;
      statItemB?.classList.add("is-winner");
      statItemA?.classList.add("is-loser");
      if (scoreElB) {
        scoreElB.textContent = String(currentScoreB);
        scoreElB.style.transform = "scale(1.35)";
        setTimeout(() => (scoreElB.style.transform = "scale(1)"), 200);
      }
    } else {
      currentScoreA += 0.5;
      currentScoreB += 0.5;
      if (scoreElA) scoreElA.textContent = String(currentScoreA);
      if (scoreElB) scoreElB.textContent = String(currentScoreB);
    }

    // Critical Blowout Flash
    if (round.isCritical) {
      if (flashOverlay) {
        flashOverlay.style.animation = "criticalHitFlash 0.35s ease-out forwards";
      }
      arenaEl.classList.add("arena-shaking");
      await sleep(350);
      arenaEl.classList.remove("arena-shaking");
    } else {
      await sleep(400);
    }

    clearLaserBeam(laserCanvas);
  }

  // --------------------------------------------------------------------------
  // Stage 4: Climax Impact Collision
  // --------------------------------------------------------------------------
  if (roundTag) roundTag.textContent = "Final Collision...";
  cardContainerA.classList.remove("idle-floating");
  cardContainerB.classList.remove("idle-floating-alt");

  // Anticipation pullback
  cardContainerA.style.transform = "translateX(-28px) scale(0.96)";
  cardContainerB.style.transform = "translateX(28px) scale(0.96)";
  await sleep(220);

  // Explosive forward surge
  cardContainerA.style.animation = "cardsSurgeLeft 0.32s cubic-bezier(0.12, 0.8, 0.32, 1) forwards";
  cardContainerB.style.animation = "cardsSurgeRight 0.32s cubic-bezier(0.12, 0.8, 0.32, 1) forwards";
  await sleep(250);

  // Screen trauma rumble & flash
  if (flashOverlay) flashOverlay.style.animation = "criticalHitFlash 0.4s ease-out forwards";
  arenaEl.classList.add("arena-shaking");
  await sleep(360);
  arenaEl.classList.remove("arena-shaking");

  cardContainerA.style.animation = "";
  cardContainerB.style.animation = "";
  cardContainerA.style.transform = "";
  cardContainerB.style.transform = "";

  // --------------------------------------------------------------------------
  // Stage 5: Winner Crowning & Loser Dim
  // --------------------------------------------------------------------------
  const winningCard = duel.winningCard;
  const losingCard = duel.losingCard;

  if (duel.matchWinner === "A") {
    cardContainerA.classList.add("winner-crowning");
    cardContainerB.classList.add("loser-dimmed");
    cardA.classList.add("is-winner");
  } else if (duel.matchWinner === "B") {
    cardContainerB.classList.add("winner-crowning");
    cardContainerA.classList.add("loser-dimmed");
    cardB.classList.add("is-winner");
  } else {
    cardContainerA.classList.add("idle-floating");
    cardContainerB.classList.add("idle-floating-alt");
  }

  // Fire celebratory confetti cannons
  fireConfettiCannon(arenaEl.querySelector("#confetti-canvas"), arenaEl);

  // Unfurl Victory Banner
  if (victoryBanner) {
    const titleEl = victoryBanner.querySelector("#victory-banner-title");
    const scoreTextEl = victoryBanner.querySelector("#victory-banner-score");
    const verdictEl = victoryBanner.querySelector("#victory-banner-verdict");
    const btnShareX = victoryBanner.querySelector("#btn-share-x");

    if (titleEl) {
      titleEl.textContent = duel.matchWinner === "tie" ? "HONORABLE DRAW" : `👑 ${winningCard.name.toUpperCase()} TRIUMPHS!`;
    }
    if (scoreTextEl) {
      scoreTextEl.textContent = `${duel.scoreA} - ${duel.scoreB}`;
    }
    if (verdictEl) {
      verdictEl.textContent = duel.verdict;
    }
    if (btnShareX) {
      const shareUrl = `${window.location.origin}${window.location.pathname}?battle=1&m1=${modelA.id}&m2=${modelB.id}`;
      const tweetText = duel.matchWinner === "tie"
        ? `⚡ FIFA Card Clash: ${modelA.name} vs ${modelB.name} ended in a draw (${duel.scoreA}-${duel.scoreB}) on CanIUse.ai! Check it out:`
        : `👑 ${winningCard.name} defeated ${losingCard.name} (${duel.scoreA}-${duel.scoreB}) in the CanIUse.ai FIFA Card Battle Arena! See the clash breakdown:`;
      btnShareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    }
    victoryBanner.classList.add("active");
    // Ensure the victory banner is fully visible without being cut off
    victoryBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (roundTag) roundTag.textContent = `Match Decided • 👑 ${winningCard ? winningCard.name : "Draw"}`;

  // Reveal replay controls
  if (postControls) postControls.style.display = "flex";
}

/**
 * Draws an energetic laser beam between two DOM elements on the canvas
 */
function drawLaserBeam(canvas, arenaEl, elA, elB) {
  if (!canvas || !elA || !elB) return;
  const ctx = canvas.getContext("2d");
  const arenaRect = arenaEl.getBoundingClientRect();
  const rectA = elA.getBoundingClientRect();
  const rectB = elB.getBoundingClientRect();

  canvas.width = arenaRect.width;
  canvas.height = arenaRect.height;

  const x1 = rectA.right - arenaRect.left;
  const y1 = rectA.top + rectA.height / 2 - arenaRect.top;
  const x2 = rectB.left - arenaRect.left;
  const y2 = rectB.top + rectB.height / 2 - arenaRect.top;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Outer plasma aura
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
  ctx.lineWidth = 10;
  ctx.stroke();

  // Inner core laser beam
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#ffd700";
  ctx.shadowBlur = 14;
  ctx.stroke();
}

function clearLaserBeam(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Zero-dependency HTML5 canvas confetti celebration engine
 */
function fireConfettiCannon(canvas, arenaEl) {
  if (!canvas || !arenaEl) return;
  const ctx = canvas.getContext("2d");
  const arenaRect = arenaEl.getBoundingClientRect();

  canvas.width = arenaRect.width;
  canvas.height = arenaRect.height;

  const colors = ["#ffd700", "#38bdf8", "#a855f7", "#10b981", "#ffffff"];
  const particles = Array.from({ length: 110 }, () => ({
    x: arenaRect.width / 2 + (Math.random() - 0.5) * 120,
    y: 120,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 1.2) * 13,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    vRot: (Math.random() - 0.5) * 16,
    alpha: 1
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.42; // gravity
      p.vx *= 0.97; // air drag
      p.rot += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }
    });

    frame++;
    if (frame < 85) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(animate);
}
