// ===========================
// MOTOR DE COMBATE
// combat.js — Parte 1: Estado del combate
// ===========================

// ───────────────────────────────────────────
// ESTADO GLOBAL DEL COMBATE
// Contiene todo lo que ocurre durante una batalla
// ───────────────────────────────────────────

var combatState = null;

function getCombatState() {
  return combatState;
}

// ───────────────────────────────────────────
// INICIAR UN COMBATE
// Recibe un array de IDs de cartas (mazo del jugador)
// y un objeto enemigo de enemies.js
// ───────────────────────────────────────────

function startCombat(playerDeckIds, enemy) {

  // Construye el mazo del jugador como instancias
  const fullDeck = playerDeckIds.map(id => createInstance(id)).filter(Boolean);

  // Mezcla el mazo aleatoriamente
  shuffleArray(fullDeck);

  // Estado inicial del jugador
  const player = {
    hero: {
      health: 30,
      maxHealth: 30,
      armor: 0
    },
    gems: {
      current: 1,
      max: 1
    },
    magicCharges: {
      current: 0,
      max: 0
    },
    hand: [],       // Cartas en mano (máx 10)
    deck: fullDeck, // Cartas restantes por robar
    field: [],      // Criaturas en el campo (máx 7)
    graveyard: []   // Cartas destruidas/usadas
  };

  // Estado inicial del enemigo
  const enemyState = {
    id: enemy.id,
    name: enemy.name,
    hero: {
      health: enemy.health,
      maxHealth: enemy.health,
      armor: enemy.armor || 0
    },
    field: [],
    graveyard: [],
    deck: (enemy.deck || []).map(id => createInstance(id)).filter(Boolean),
    hand: [],
    intent: { ...enemy.intent }   // Lo que hará el próximo turno
  };

  // Estado global del combate
  combatState = {
    player,
    enemy: enemyState,
    turn: 1,              // Número de turno actual
    phase: "player",      // "player" o "enemy"
    isOver: false,
    winner: null,         // "player" | "enemy" | null
    log: []               // Historial de acciones del combate
  };

  // Roba las primeras 4 cartas al inicio
  for (let i = 0; i < 4; i++) {
    drawCard();
  }

  addLog(`⚔️ Combate iniciado contra ${enemy.name}.`);
  return combatState;
}

// ───────────────────────────────────────────
// ROBAR CARTA
// Mueve la carta del tope del mazo a la mano
// ───────────────────────────────────────────

function drawCard() {
  const { player } = combatState;

  if (player.deck.length === 0) {
    addLog("⚠️ No quedan cartas en el mazo.");
    return;
  }
  if (player.hand.length >= 10) {
    addLog("⚠️ La mano está llena, la carta se pierde.");
    player.deck.shift(); // La carta se descarta sin efecto
    return;
  }

  const card = player.deck.shift();
  player.hand.push(card);
}

// ───────────────────────────────────────────
// VERIFICAR CONDICIÓN DE VICTORIA
// ───────────────────────────────────────────

function checkWinCondition() {
  const { player, enemy } = combatState;

  if (enemy.hero.health <= 0) {
    combatState.isOver = true;
    combatState.winner = "player";
    addLog("🏆 ¡Ganaste el combate!");
    return true;
  }
  if (player.hero.health <= 0) {
    combatState.isOver = true;
    combatState.winner = "enemy";
    addLog("💀 Has sido derrotado.");
    return true;
  }
  return false;
}

// ───────────────────────────────────────────
// APLICAR DAÑO A UN OBJETIVO
// Respeta la armadura antes de restar vida
// ───────────────────────────────────────────

function applyDamage(target, amount, piercing = false) {
  if (amount <= 0) return;

  if (!piercing && target.armor > 0) {
    const absorbed = Math.min(target.armor, amount);
    target.armor -= absorbed;
    amount -= absorbed;
  }

  target.health -= amount;
  if (target.health < 0) target.health = 0;
}

// ───────────────────────────────────────────
// AÑADIR ENTRADA AL LOG DE COMBATE
// ───────────────────────────────────────────

function addLog(message) {
  combatState.log.push(message);
  console.log(`[COMBATE] ${message}`);
}

// ───────────────────────────────────────────
// UTILIDAD: MEZCLAR ARRAY (Fisher-Yates)
// ───────────────────────────────────────────

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}