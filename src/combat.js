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
  card._isNew = true;
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

// ===========================
// PARTE 2: ACCIONES DE COMBATE
// ===========================

// ───────────────────────────────────────────
// JUGAR CARTA DESDE LA MANO
// ───────────────────────────────────────────

function playCard(handIndex, targetInstanceId = null) {
  const state = combatState;
  if (!state || state.phase !== 'player' || state.isOver) return false;

  const card = state.player.hand[handIndex];
  if (!card) return false;

  // Verificar costos
  if (state.player.gems.current < card.cost.gems) {
    addLog(`⚠️ No tienes suficientes gemas para jugar ${card.name}.`);
    return false;
  }
  if (state.player.magicCharges.current < card.cost.charges) {
    addLog(`⚠️ No tienes suficientes cargas mágicas para ${card.name}.`);
    return false;
  }
  if (card.cost.life > 0 && state.player.hero.health <= card.cost.life) {
    addLog(`⚠️ No tienes suficiente vida para pagar el costo de ${card.name}.`);
    return false;
  }
  if (card.cost.graveyard > 0) {
    const eligible = state.player.graveyard.filter(c => !c.isBanished);
    if (eligible.length < card.cost.graveyard) {
      addLog(`⚠️ No hay suficientes cartas en el cementerio para ${card.name}.`);
      return false;
    }
    // Consumir cartas del cementerio
    for (let i = 0; i < card.cost.graveyard; i++) {
      const consumed = eligible[i];
      consumed.isBanished = true;
      addLog(`🔥 ${consumed.name} fue consumida como combustible.`);
    }
  }

  // Pagar costos
  state.player.gems.current -= card.cost.gems;
  state.player.magicCharges.current -= card.cost.charges;
  if (card.cost.life > 0) {
    state.player.hero.health -= card.cost.life;
    addLog(`💔 Pagaste ${card.cost.life} de vida para invocar ${card.name}.`);
  }

  // Sacar carta de la mano
  state.player.hand.splice(handIndex, 1);

  // Ejecutar según formato
  if (card.format === 'creature') {
    if (state.player.field.length >= 6) {
      addLog(`⚠️ El campo está lleno, no puedes invocar más criaturas.`);
      state.player.hand.splice(handIndex, 0, card); // devolver a la mano
      return false;
    }
    // Las criaturas no pueden atacar el turno que entran (excepto rush)
    card.canAttackThisTurn = card.keywords.includes('rush');
    card.turnsInField = 0;
    state.player.field.push(card);
    addLog(`🐾 Invocaste ${card.name} (${card.attack}/${card.health}).`);

    // Efecto de entrada si tiene
    if (card.effect) applyEffect(card.effect, card, targetInstanceId, 'player');

  } else if (card.format === 'spell') {
    addLog(`✨ Lanzaste ${card.name}.`);
    if (card.effect) applyEffect(card.effect, card, targetInstanceId, 'player');
    state.player.graveyard.push(card);

  } else if (card.format === 'equipment') {
    const target = findCreatureByInstanceId(targetInstanceId, 'player');
    if (!target) {
      addLog(`⚠️ Selecciona una criatura aliada para equipar ${card.name}.`);
      state.player.hand.splice(handIndex, 0, card);
      return false;
    }
    applyEffect(card.effect, card, targetInstanceId, 'player');
    addLog(`⚙️ Equipaste ${card.name} a ${target.name}.`);
    state.player.graveyard.push(card);
  }

  checkWinCondition();
  return true;
}

// ───────────────────────────────────────────
// ATACAR CON UNA CRIATURA
// attacker: instanceId de tu criatura
// targetId: instanceId de criatura enemiga O "enemy-hero"
// ───────────────────────────────────────────

function attackWith(attackerInstanceId, targetId) {
  const state = combatState;
  if (!state || state.phase !== 'player' || state.isOver) return false;

  const attacker = findCreatureByInstanceId(attackerInstanceId, 'player');
  if (!attacker) { addLog('⚠️ Criatura atacante no encontrada.'); return false; }
  if (!attacker.canAttackThisTurn) { addLog(`⚠️ ${attacker.name} ya atacó este turno.`); return false; }
  if (attacker.statusEffects.includes('stunned')) { addLog(`⚠️ ${attacker.name} está aturdido.`); return false; }
  if (attacker.statusEffects.includes('petrified')) { addLog(`⚠️ ${attacker.name} está petrificado.`); return false; }

  // Verificar si hay criaturas con Provocar en el campo enemigo
  const taunters = state.enemy.field.filter(c => c.keywords.includes('taunt'));
  if (taunters.length > 0 && targetId !== taunters[0].instanceId) {
    const targetCreature = findCreatureByInstanceId(targetId, 'enemy');
    if (!targetCreature || !targetCreature.keywords.includes('taunt')) {
      addLog(`⚠️ Debes atacar a la criatura con Provocar primero.`);
      return false;
    }
  }

  const piercing = attacker.keywords.includes('pierce');

  if (targetId === 'enemy-hero') {
    // Atacar héroe enemigo directamente
    applyDamage(state.enemy.hero, attacker.attack, piercing);
    addLog(`⚔️ ${attacker.name} atacó al héroe enemigo por ${attacker.attack} de daño.`);
  } else {
    // Atacar criatura enemiga
    const target = findCreatureByInstanceId(targetId, 'enemy');
    if (!target) { addLog('⚠️ Objetivo no encontrado.'); return false; }
    if (target.statusEffects.includes('stealth')) { addLog(`⚠️ Ese objetivo no puede ser seleccionado.`); return false; }

    applyDamage(target, attacker.attack, piercing);
    applyDamage(attacker, target.attack);

    addLog(`⚔️ ${attacker.name} atacó a ${target.name}.`);

    // Aplicar veneno si el atacante tiene poisonOnAttack
    if (attacker.effect === 'poisonOnAttack') {
      applyStatusEffect(target, 'poisoned', 2, 2);
      addLog(`☠️ ${target.name} fue envenenado.`);
    }

    // Verificar muertes
    checkDeaths();
  }

  attacker.canAttackThisTurn = false;
  checkWinCondition();
  return true;
}

// ───────────────────────────────────────────
// TERMINAR TURNO DEL JUGADOR
// ───────────────────────────────────────────

function endPlayerTurn() {
  const state = combatState;
  if (!state || state.phase !== 'player' || state.isOver) return;

  addLog(`— Fin del turno ${state.turn} del jugador —`);

  // Efectos de fin de turno del jugador
  state.player.field.forEach(creature => {
    // Guerrero gana +1 armadura
    if (creature.effect === 'gainArmorEachTurn') {
      creature.armor += 1;
      addLog(`🛡 ${creature.name} ganó +1 de armadura.`);
    }
    // Sauce golpea enemigo al azar
    if (creature.effect === 'hitRandomEnemyEachTurn' && creature.attack > 0) {
      const targets = [...state.enemy.field];
      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        applyDamage(t, creature.attack);
        addLog(`🌿 ${creature.name} golpeó a ${t.name} por ${creature.attack}.`);
      }
    }
    // Procesar estados negativos del jugador
    processStatusEffects(creature);
    // Crecimiento
    if (creature.keywords.includes('growth')) {
      creature.turnsInField++;
      if (creature.turnsInField >= creature.growthTurns && creature.growthStats) {
        creature.attack = creature.growthStats.attack;
        creature.health = creature.growthStats.health;
        creature.keywords = creature.keywords.filter(k => k !== 'growth');
        addLog(`🌱 ${creature.name} evolucionó a ${creature.attack}/${creature.health}.`);
      }
    }
  });

  checkDeaths();
  checkWinCondition();
  if (state.isOver) return;

  // Procesar estados del enemigo al final del turno del jugador
  state.enemy.field.forEach(c => processStatusEffects(c));
  processStatusEffects(state.enemy.hero);

  checkDeaths();
  checkWinCondition();
  if (state.isOver) return;

  // Cambiar fase a enemigo
  state.phase = 'enemy';
  setTimeout(() => enemyTurn(), 800);
}

// ───────────────────────────────────────────
// TURNO DEL ENEMIGO (IA básica)
// ───────────────────────────────────────────

function enemyTurn() {
  const state = combatState;
  if (!state || state.isOver) return;

  addLog(`👾 Turno del enemigo.`);

  // El enemigo ataca directamente al héroe del jugador
  const dmg = state.enemy.intent.value;
  applyDamage(state.player.hero, dmg);
  addLog(`👾 ${state.enemy.name} atacó por ${dmg} de daño.`);

  checkWinCondition();
  if (state.isOver) return;

  // Inicio del siguiente turno del jugador
  state.turn++;
  state.phase = 'player';

  // Subir gemas
  if (state.player.gems.max < 10) state.player.gems.max++;
  state.player.gems.current = state.player.gems.max;

  // Recargar cargas mágicas
  state.player.magicCharges.current = state.player.magicCharges.max;

  // Habilitar ataque de todas las criaturas
  state.player.field.forEach(c => { c.canAttackThisTurn = true; });

  // Robar carta
  drawCard();

  // Nueva intención del enemigo
  state.enemy.intent.value = 4 + Math.floor(Math.random() * 6);

  addLog(`— Turno ${state.turn} —`);
}

// ───────────────────────────────────────────
// APLICAR EFECTOS DE CARTA
// ───────────────────────────────────────────

function applyEffect(effectId, source, targetInstanceId, side) {
  const state = combatState;
  const target = targetInstanceId ? findCreatureByInstanceId(targetInstanceId, side) : null;

  switch(effectId) {
    case 'addMagicCharge':
      state.player.magicCharges.max++;
      state.player.magicCharges.current++;
      addLog(`🔵 Cargas Mágicas aumentadas a ${state.player.magicCharges.max}.`);
      break;

    case 'heal2':
      if (target) { target.health = Math.min(target.health + 2, target.maxHealth); addLog(`💚 ${target.name} recuperó 2 de vida.`); }
      else { state.player.hero.health = Math.min(state.player.hero.health + 2, state.player.hero.maxHealth); addLog(`💚 Recuperaste 2 de vida.`); }
      break;

    case 'heal3':
      if (target) { target.health = Math.min(target.health + 3, target.maxHealth); addLog(`💚 ${target.name} recuperó 3 de vida.`); }
      else { state.player.hero.health = Math.min(state.player.hero.health + 3, state.player.hero.maxHealth); addLog(`💚 Recuperaste 3 de vida.`); }
      break;

    case 'applyBurn':
      if (target) {
        applyDamage(target, 1);
        applyStatusEffect(target, 'burned', 1, 2);
        addLog(`🔥 ${target.name} recibió 1 de daño y quedó Incendiado.`);
      }
      break;

    case 'damage2Stun':
      if (target) {
        applyDamage(target, 2);
        applyStatusEffect(target, 'stunned', 0, 1);
        addLog(`⚡ ${target.name} recibió 2 de daño y quedó Aturdido.`);
      }
      break;

    case 'damage7':
      if (target) { applyDamage(target, 7); addLog(`☄️ Meteoro impactó a ${target.name} por 7 de daño.`); }
      else { applyDamage(state.enemy.hero, 7); addLog(`☄️ Meteoro impactó al héroe enemigo por 7.`); }
      break;

    case 'petrify':
      if (target) {
        target.attack = 0;
        target.effect = null;
        target.keywords = [];
        applyStatusEffect(target, 'petrified', 0, 999);
        addLog(`🪨 ${target.name} fue Petrificado.`);
      }
      break;

    case 'cleanse':
      if (target) { target.statusEffects = []; addLog(`✨ ${target.name} fue curado de todos los estados.`); }
      break;

    case 'destroyArmor':
      if (target) { target.armor = 0; addLog(`💥 La armadura de ${target.name} fue destruida.`); }
      else { state.enemy.hero.armor = 0; addLog(`💥 La armadura del enemigo fue destruida.`); }
      break;

    case 'enterWith2Armor':
      source.armor = 2;
      break;

    case 'equipArmor1hp1':
      if (target) { target.armor += 1; target.health += 1; target.maxHealth += 1; }
      break;

    case 'equipArmor3':
      if (target) { target.armor += 3; }
      break;

    case 'equipArmor5':
      if (target) { target.armor += 5; }
      break;

    case 'equipSwordBasic':
      if (target) {
        const bonus = target.armor === 0 ? 2 : 1;
        target.attack += bonus;
        target.equipment = source.instanceId;
      }
      break;

    case 'equipDaggerBasic':
      if (target) {
        target.attack += 2;
        target.keywords.push('pierce');
        target.equipment = source.instanceId;
      }
      break;

    case 'equipKatana':
      if (target) {
        target.attack += 3;
        target.keywords.push('pierce');
        target.equipment = source.instanceId;
      }
      break;

    case 'reviveLastCreature': {
      const eligible = state.player.graveyard.filter(c => c.format === 'creature' && !c.isBanished);
      if (eligible.length === 0) { addLog(`⚠️ No hay criaturas elegibles para revivir.`); break; }
      const revived = eligible[eligible.length - 1];
      revived.health = Math.ceil(revived.maxHealth / 2);
      revived.canAttackThisTurn = false;
      revived.statusEffects = [];
      state.player.field.push(revived);
      state.player.graveyard = state.player.graveyard.filter(c => c.instanceId !== revived.instanceId);
      addLog(`💀 ${revived.name} fue revivido.`);
      break;
    }

    case 'skipEnemyTurn':
      state.enemy.skipNextTurn = true;
      addLog(`🛑 STOP — El enemigo pierde su próximo turno.`);
      break;

    case 'drawEquipment': {
      const options = ['espada_basica', 'armadura_basica'];
      const chosen = options[Math.floor(Math.random() * options.length)];
      const newCard = createInstance(chosen);
      if (state.player.hand.length < 10) {
        state.player.hand.push(newCard);
        addLog(`🔨 El Herrero agregó ${newCard.name} a tu mano.`);
      }
      break;
    }

    case 'ninjaEntry': {
      const enemies = state.enemy.field;
      if (enemies.length > 0) {
        const t = enemies[0];
        applyDamage(t, source.attack);
        if (t.health <= 0) {
          addLog(`🥷 Ninja mató a ${t.name} y entró en Oculto.`);
          source.keywords.push('stealth');
        } else {
          applyStatusEffect(t, 'poisoned', 3, 2);
          addLog(`🥷 Ninja atacó a ${t.name} y lo envenenó.`);
        }
        checkDeaths();
      }
      break;
    }
  }
}

// ───────────────────────────────────────────
// APLICAR ESTADO A UNA CRIATURA
// ───────────────────────────────────────────

function applyStatusEffect(target, type, damagePerTurn, duration) {
  target.statusEffects.push({ type, damagePerTurn, duration });
}

// ───────────────────────────────────────────
// PROCESAR ESTADOS AL FINAL DE TURNO
// ───────────────────────────────────────────

function processStatusEffects(target) {
  if (!target.statusEffects) return;
  target.statusEffects = target.statusEffects.filter(effect => {
    if (effect.damagePerTurn > 0) {
      target.health -= effect.damagePerTurn;
      if (target.health < 0) target.health = 0;
    }
    effect.duration--;
    return effect.duration > 0;
  });
}

// ───────────────────────────────────────────
// VERIFICAR Y ELIMINAR CRIATURAS MUERTAS
// ───────────────────────────────────────────

function checkDeaths() {
  const state = combatState;

  state.player.field = state.player.field.filter(c => {
    if (c.health <= 0) {
      state.player.graveyard.push(c);
      addLog(`💀 ${c.name} murió.`);
      return false;
    }
    return true;
  });

  state.enemy.field = state.enemy.field.filter(c => {
    if (c.health <= 0) {
      state.enemy.graveyard.push(c);
      addLog(`💀 ${c.name} (enemigo) murió.`);
      return false;
    }
    return true;
  });
}

// ───────────────────────────────────────────
// BUSCAR CRIATURA POR INSTANCE ID
// ───────────────────────────────────────────

function findCreatureByInstanceId(instanceId, side) {
  const state = combatState;
  if (!instanceId) return null;
  const field = side === 'player' ? state.player.field : state.enemy.field;
  return field.find(c => c.instanceId === instanceId) || null;
}