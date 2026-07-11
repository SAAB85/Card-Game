// ===========================
// NAVEGACIÓN ENTRE PANTALLAS
// main.js
// ===========================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ===========================
// ESTADO GLOBAL DEL JUGADOR
// ===========================
const playerData = {
  gold: 0
};

function updateGoldDisplay() {
  document.getElementById('player-gold').textContent = `🪙 ${playerData.gold} monedas`;
}

// ===========================
// RENDERIZADO DEL TABLERO
// ===========================

// Crea el HTML de una carta (para campo o mano)
function createCardElement(instance, side, inHand = false, animate = false) {
  const div = document.createElement('div');
  div.className = 'card';
  if (animate) {
    div.classList.add('card-draw');
    setTimeout(() => div.classList.remove('card-draw'), 400);
  }
  div.dataset.instanceId = instance.instanceId;
  attachTooltip(div, instance);

  // Nombre
  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = instance.name;
  div.appendChild(name);

  // Badge gema (siempre visible en mano, opcional en campo)
  if (inHand) {
    const gemBadge = document.createElement('div');
    gemBadge.className = 'card-badge badge-gem';
    gemBadge.textContent = instance.cost.gems;
    div.appendChild(gemBadge);

    // Badge carga mágica
    if (instance.cost.charges > 0) {
      const chargeBadge = document.createElement('div');
      chargeBadge.className = 'card-badge badge-charge';
      chargeBadge.textContent = instance.cost.charges;
      div.appendChild(chargeBadge);
    }

    // Badge sacrificio de vida
    if (instance.cost.life > 0) {
      const lifeBadge = document.createElement('div');
      lifeBadge.className = 'card-badge badge-lifecost';
      lifeBadge.textContent = instance.cost.life;
      div.appendChild(lifeBadge);
    }
  }

  // Badge ataque (solo criaturas)
  if (instance.format === 'creature') {
    if (instance.equipment) {
      const weaponBadge = document.createElement('div');
      weaponBadge.className = 'card-badge badge-weapon';
      weaponBadge.textContent = '+?';
      div.appendChild(weaponBadge);
    }
    const atkBadge = document.createElement('div');
    atkBadge.className = 'card-badge badge-attack';
    atkBadge.textContent = instance.attack;
    div.appendChild(atkBadge);

    if (instance.armor > 0) {
      const armorBadge = document.createElement('div');
      armorBadge.className = 'card-badge badge-armor';
      armorBadge.textContent = instance.armor;
      div.appendChild(armorBadge);
    }

    const hpBadge = document.createElement('div');
    hpBadge.className = 'card-badge badge-hp';
    hpBadge.textContent = instance.health;
    div.appendChild(hpBadge);
  }

  return div;
}

// Renderiza el campo de batalla completo
function renderField(side) {
  const state = getCombatState();
  if (!state) return;

  const fieldEl = document.getElementById(`${side}-field`);
  const slots = fieldEl.querySelectorAll('.field-slot');
  const creatures = side === 'player' ? state.player.field : state.enemy.field;

  slots.forEach((slot, i) => {
    slot.innerHTML = '';
    slot.classList.remove('occupied');

    if (creatures[i]) {
      const cardEl = createCardElement(creatures[i], side, false);

      // Clases de estado
      if (side === 'player' && creatures[i].canAttackThisTurn) {
        cardEl.classList.add('can-attack');
      }
      if (creatures[i].statusEffects.includes('stunned')) {
        cardEl.classList.add('stunned');
      }

      // Click para seleccionar/atacar
      cardEl.addEventListener('click', () => onFieldCardClick(side, i));
      slot.appendChild(cardEl);
      slot.classList.add('occupied');
    }
  });
}

// Renderiza la mano del jugador
function renderHand() {
  const state = getCombatState();
  if (!state) return;

  const handEl = document.getElementById('player-hand');
  handEl.innerHTML = '';

  state.player.hand.forEach((card, i) => {
    const cardEl = createCardElement(card, 'player', true, card._isNew);
    card._isNew = false;

    // ¿Se puede jugar?
    const canPlay = canPlayCard(card, state);

    cardEl.addEventListener('click', () => {
      if (canPlay) onHandCardClick(i);
    });

    handEl.appendChild(cardEl);
  });
}

// Renderiza los stats del héroe
function renderHeroStats() {
  const state = getCombatState();
  if (!state) return;

  document.getElementById('player-hp').textContent    = `❤ ${state.player.hero.health}`;
  document.getElementById('player-armor').textContent = `🛡 ${state.player.hero.armor}`;
  document.getElementById('enemy-hp').textContent     = `❤ ${state.enemy.hero.health}`;
  document.getElementById('enemy-armor').textContent  = `🛡 ${state.enemy.hero.armor}`;
  document.getElementById('enemy-name').textContent   = state.enemy.name;
  document.getElementById('enemy-intent').textContent = `intención: atacar ${state.enemy.intent.value}`;
  document.getElementById('player-deck-count').textContent  = state.player.deck.length;
  document.getElementById('enemy-deck-count').textContent   = state.enemy.deck ? state.enemy.deck.length : 0;
  document.getElementById('player-graveyard-count').textContent = state.player.graveyard.length;
  document.getElementById('enemy-graveyard-count').textContent  = state.enemy.graveyard.length;

  const gems = state.player.gems;
  const charges = state.player.magicCharges;
  document.getElementById('turn-label').textContent = `turno ${state.turn}`;
  document.getElementById('player-gems').textContent = `💎 ${gems.current}/${gems.max}`;
  document.getElementById('player-charges').textContent = `⚡ ${charges.current}/${charges.max}`;
}

// Renderiza todo el tablero
function renderAll() {
  renderField('player');
  renderField('enemy');
  renderHand();
  renderHeroStats();
}

// ===========================
// VERIFICAR SI SE PUEDE JUGAR
// ===========================
function canPlayCard(card, state) {
  if (!state) return false;
  if (!state.player) return false;
  if (!state.player.gems) return false;
  if (state.player.gems.current < card.cost.gems) return false;
  if (state.player.magicCharges.current < card.cost.charges) return false;
  if (state.player.hero.health <= card.cost.life) return false;
  if (card.cost.graveyard > 0 && state.player.graveyard.filter(c => !c.isBanished).length < card.cost.graveyard) return false;
  if (card.format === 'creature' && state.player.field.length >= 6) return false;
  return true;
}
// ===========================
// LOG VISUAL
// ===========================
function showLog(msg) {
  const log = document.getElementById('combat-log');
  log.textContent = msg;
  clearTimeout(log._timeout);
  log._timeout = setTimeout(() => { log.textContent = ''; }, 3000);
}

// ===========================
// SISTEMA DE SELECCIÓN
// ===========================
let selectedAttacker = null; // instancia seleccionada para atacar

function clearSelection() {
  selectedAttacker = null;
  document.querySelectorAll('.card.selected').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.card.targetable').forEach(c => c.classList.remove('targetable'));
  document.querySelectorAll('.field-slot.targetable').forEach(c => c.classList.remove('targetable'));
}

function onHandCardClick(index) {
  const state = getCombatState();
  if (!state || state.phase !== 'player' || state.isOver) return;

  clearSelection();
  const card = state.player.hand[index];

  // Criaturas y hechizos sin target: jugar directo
  if (card.format === 'creature' || (card.format === 'spell' && !needsTarget(card))) {
    const ok = playCard(index);
    if (ok) renderAll();
  }
  // Hechizos/equipos que necesitan target: marcar targetables
  else {
    selectedAttacker = { type: 'hand', index, card };
    showLog(`Selecciona un objetivo para ${card.name}.`);
    markTargetables(card);
    renderAll();
  }
}

function onFieldCardClick(side, index) {
  const state = getCombatState();
  if (!state || state.phase !== 'player' || state.isOver) return;

  const creature = side === 'player'
    ? state.player.field[index]
    : state.enemy.field[index];

  if (!creature) return;

  // Si hay un atacante seleccionado → atacar esta criatura
  if (selectedAttacker && selectedAttacker.type === 'attacker') {
    const ok = attackWith(selectedAttacker.instanceId, creature.instanceId);
    clearSelection();
    if (ok) renderAll();
    return;
  }

  // Si hay carta de mano seleccionada que necesita target
  if (selectedAttacker && selectedAttacker.type === 'hand') {
    const ok = playCard(selectedAttacker.index, creature.instanceId);
    clearSelection();
    if (ok) renderAll();
    return;
  }

  // Seleccionar criatura propia para atacar
  if (side === 'player' && creature.canAttackThisTurn
    && !creature.statusEffects.find(e => e.type === 'stunned')
    && !creature.statusEffects.find(e => e.type === 'petrified')) {
    selectedAttacker = { type: 'attacker', instanceId: creature.instanceId };
    showLog(`${creature.name} listo para atacar — selecciona un objetivo.`);
    markAttackTargets();
    renderAll();
    // Marcar carta seleccionada visualmente
    const slots = document.querySelectorAll('#player-field .field-slot');
    if (slots[index]) {
      const cardEl = slots[index].querySelector('.card');
      if (cardEl) cardEl.classList.add('selected');
    }
  }
}

function onHeroClick(side) {
  const state = getCombatState();
  if (!state || state.phase !== 'player' || state.isOver) return;

  // Atacar héroe enemigo con criatura seleccionada
  if (selectedAttacker && selectedAttacker.type === 'attacker' && side === 'enemy') {
    const ok = attackWith(selectedAttacker.instanceId, 'enemy-hero');
    clearSelection();
    if (ok) renderAll();
    return;
  }

  // Curar héroe propio con hechizo seleccionado
  if (selectedAttacker && selectedAttacker.type === 'hand' && side === 'player') {
    const ok = playCard(selectedAttacker.index, 'player-hero');
    clearSelection();
    if (ok) renderAll();
    return;
  }
}

function onEndTurn() {
  const state = getCombatState();
  if (!state || state.phase !== 'player' || state.isOver) return;
  clearSelection();
  endPlayerTurn();
  renderAll();
  // Esperar turno enemigo y re-renderizar
  setTimeout(() => renderAll(), 1200);
}

// ===========================
// HELPERS DE TARGETING
// ===========================

function needsTarget(card) {
  const targetEffects = [
    'heal2','heal3','applyBurn','damage2Stun','damage7',
    'petrify','cleanse','destroyArmor','equipArmor1hp1',
    'equipArmor3','equipArmor5','equipSwordBasic',
    'equipDaggerBasic','equipKatana'
  ];
  return targetEffects.includes(card.effect);
}

function markTargetables(card) {
  // Para equipos solo criaturas aliadas
  // Para hechizos de daño/debuff solo criaturas enemigas
  // Para hechizos de curación criaturas aliadas
  const healEffects = ['heal2','heal3','cleanse','equipArmor1hp1','equipArmor3','equipArmor5','equipSwordBasic','equipDaggerBasic','equipKatana'];
  const side = healEffects.includes(card.effect) ? 'player' : 'enemy';
  const slots = document.querySelectorAll(`#${side}-field .field-slot.occupied`);
  slots.forEach(slot => slot.classList.add('targetable'));
}

function markAttackTargets() {
  // Marcar héroe enemigo y criaturas enemigas como targetables
  document.getElementById('enemy-avatar').style.cursor = 'crosshair';
  const slots = document.querySelectorAll('#enemy-field .field-slot.occupied');
  slots.forEach(slot => {
    const card = slot.querySelector('.card');
    if (card) card.classList.add('targetable');
  });
}

// ===========================
// INICIAR COMBATE DE PRUEBA
// ===========================
function startTestCombat() {
  const testDeck = [
    "slime","aldeano","lobo","arquero","guerrero",
    "conejo_loco","arbol","vendaje","escudero","golem",
    "pocion","zarzas","elixir","herrero","daga_basica"
  ];
  const testEnemy = {
    id: "slime_boss",
    name: "Slime Jefe",
    health: 30,
    armor: 0,
    deck: ["slime","slime","aldeano","lobo"],
    intent: { type: "attack", value: 6 }
  };
  startCombat(testDeck, testEnemy);
  showScreen('screen-combat');
  renderAll();
}

// ===========================
// INICIALIZACIÓN
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  updateGoldDisplay();
  // Botón temporal de prueba en Taberna
  document.getElementById('screen-tavern').querySelector('.placeholder-container').innerHTML += `
    <button class="back-btn" style="margin-top:8px; border-color: var(--gold); color: var(--gold);"
      onclick="startTestCombat()">⚔️ Probar combate</button>
  `;
});


// ===========================
// TOOLTIP DE CARTA
// ===========================

const tooltip = document.getElementById('card-tooltip');

function showTooltip(instance, x, y) {
  document.getElementById('tooltip-name').textContent = instance.name;
  document.getElementById('tooltip-rarity').textContent = instance.rarity;
  document.getElementById('tooltip-rarity').className = `tooltip-rarity ${instance.rarity}`;

  // Stats según formato
  let stats = '';
  if (instance.format === 'creature') {
    stats = `⚔️ ${instance.attack}  ❤️ ${instance.health}`;
    if (instance.armor > 0) stats += `  🛡 ${instance.armor}`;
  } else if (instance.format === 'equipment') {
    if (instance.durability) stats = `Durabilidad: ${instance.durability}`;
  }

  // Costo
  let cost = `💎 ${instance.cost.gems}`;
  if (instance.cost.charges > 0) cost += `  ⚡ ${instance.cost.charges}`;
  if (instance.cost.life > 0) cost += `  💔 ${instance.cost.life}`;
  if (instance.cost.graveyard > 0) cost += `  💀 ${instance.cost.graveyard}`;
  stats = cost + (stats ? '\n' + stats : '');

  document.getElementById('tooltip-stats').textContent = stats;
  document.getElementById('tooltip-desc').textContent = instance.description || '';

  // Posición — evitar que se salga de la pantalla
  const tw = 180, th = 160;
  let tx = x + 16;
  let ty = y - 20;
  if (tx + tw > window.innerWidth) tx = x - tw - 16;
  if (ty + th > window.innerHeight) ty = window.innerHeight - th - 10;

  tooltip.style.left = tx + 'px';
  tooltip.style.top  = ty + 'px';
  tooltip.classList.add('visible');
}

function hideTooltip() {
  tooltip.classList.remove('visible');
}

// Agregar tooltip a una carta recién creada
function attachTooltip(cardEl, instance) {
  cardEl.addEventListener('mouseenter', e => showTooltip(instance, e.clientX, e.clientY));
  cardEl.addEventListener('mousemove',  e => showTooltip(instance, e.clientX, e.clientY));
  cardEl.addEventListener('mouseleave', hideTooltip);
}