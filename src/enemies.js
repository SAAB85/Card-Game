// ===========================
// DEFINICIÓN DE ENEMIGOS
// enemies.js
// ===========================

const ENEMY_DEFINITIONS = [

  // ─── JEFE 1: SLIME REY ─────────────────────────────────
  {
    id: "slime_rey",
    name: "Slime Rey",
    avatar: "👑",
    health: 45,
    armor: 0,
    description: "El monarca de todos los Slimes. Invoca hordas interminables de sus súbditos.",
    intent: { type: "summon", value: 0 },
    aiPattern: "slime_swarm",
    deck: [
      "slime", "slime", "slime",
      "gran_slime", "gran_slime",
      "slime_venenoso", "slime_venenoso",
      "slime_explosivo", "slime_explosivo",
      "slime_duplicado",
      "slime_amigo", "slime_amigo",
      "slime_anciano",
      "mimetismo", "mimetismo",
      "marea_slimes",
      "reproduccion",
      "triunfo",
      "absorber",
      "vendaje"
    ],
    // Mecánica especial: invoca un Slime al inicio de cada turno
    specialMechanic: "summonSlimeEachTurn"
  }

];

// ===========================
// OBTENER ENEMIGO POR ID
// ===========================

function getEnemy(id) {
  return ENEMY_DEFINITIONS.find(e => e.id === id) || null;
}

// ===========================
// IA DEL ENEMIGO
// Decide qué hacer en su turno
// ===========================

function getEnemyAction(combatState) {
  const enemy = combatState.enemy;
  const player = combatState.player;

  // Roba carta si tiene menos de 4 en mano
  while (enemy.hand.length < 4 && enemy.deck.length > 0) {
    const card = enemy.deck.shift();
    card._isNew = false;
    enemy.hand.push(card);
  }

  // Mecánica especial: invocar Slime al inicio del turno
  if (enemy.specialMechanic === "summonSlimeEachTurn" && enemy.field.length < 6) {
    const slime = createInstance("slime");
    slime.canAttackThisTurn = false;
    enemy.field.push(slime);
    addLog(`👾 ${enemy.name} invocó un Slime.`);
  }

  // Jugar cartas de la mano según gemas disponibles
  playEnemyCards(combatState);

  // Atacar con criaturas
  attackWithEnemyCreatures(combatState);
}

// ===========================
// JUGAR CARTAS DEL ENEMIGO
// ===========================

function playEnemyCards(combatState) {
  const enemy = combatState.enemy;

  enemy.hand.sort((a, b) => a.cost.gems - b.cost.gems);

  // Recolectar cartas que puede jugar
  const toPlay = [];
  let gemsCopy = enemy.gems.current;
  let chargesCopy = enemy.magicCharges.current;

  for (const card of enemy.hand) {
    if (gemsCopy < card.cost.gems) continue;
    if (chargesCopy < card.cost.charges) continue;
    if (card.format === 'creature' && enemy.field.length + toPlay.filter(c => c.format === 'creature').length >= 6) continue;
    toPlay.push(card);
    gemsCopy -= card.cost.gems;
    chargesCopy -= card.cost.charges;
  }

  // Jugar cada carta con delay para dar sensación de turno real
  toPlay.forEach((card, index) => {
    setTimeout(() => {
      // Verificar que aún puede jugarse
      if (enemy.gems.current < card.cost.gems) return;
      if (enemy.magicCharges.current < card.cost.charges) return;

      enemy.gems.current -= card.cost.gems;
      enemy.magicCharges.current -= card.cost.charges;
      enemy.hand = enemy.hand.filter(c => c.instanceId !== card.instanceId);

      if (card.format === 'creature' && enemy.field.length < 6) {
        card.canAttackThisTurn = false;
        card.turnsInField = 0;
        enemy.field.push(card);
        addLog(`👾 ${enemy.name} invocó ${card.name}.`);
        applyEnemyCardEffect(card, combatState);
      } else if (card.format === 'spell') {
        enemy.graveyard.push(card);
        addLog(`👾 ${enemy.name} lanzó ${card.name}.`);
        applyEnemySpellEffect(card, combatState);
      }

      checkDeaths();
      checkWinCondition();

      // Re-renderizar después de cada carta
      if (typeof renderAll === 'function') renderAll();

    }, index * 800); // 800ms entre cada carta
  });

  // Esperar a que terminen todas las cartas antes de atacar
  return toPlay.length * 800;
}


// ===========================
// ATACAR CON CRIATURAS ENEMIGAS
// ===========================

function attackWithEnemyCreatures(combatState) {
  const enemy = combatState.enemy;
  const player = combatState.player;

  enemy.field.forEach(creature => {
    if (!creature.canAttackThisTurn) return;
    if (creature.statusEffects && creature.statusEffects.find(e => e.type === 'stunned')) return;

    // Efecto especial Slime Alfa: absorber un Slime aliado
    if (creature.effect === 'absorbSlimeEachTurn') {
      const slimes = enemy.field.filter(c =>
        c.instanceId !== creature.instanceId &&
        (c.definitionId.includes('slime') || c.name.toLowerCase().includes('slime'))
      );
      if (slimes.length > 0) {
        const absorbed = slimes[0];
        creature.attack += absorbed.attack;
        creature.health += absorbed.health;
        creature.maxHealth += absorbed.health;
        enemy.field = enemy.field.filter(c => c.instanceId !== absorbed.instanceId);
        enemy.graveyard.push(absorbed);
        addLog(`👾 Slime Alfa absorbió a ${absorbed.name} (+${absorbed.attack}/+${absorbed.health}).`);
      }
    }

    // Atacar al héroe si no hay criaturas con Provocar
    const taunters = player.field.filter(c => c.keywords && c.keywords.includes('taunt'));

    if (taunters.length > 0) {
      // Atacar al provocador
      const target = taunters[0];
      const piercing = creature.keywords && creature.keywords.includes('pierce');
      applyDamage(target, creature.attack, piercing);
      applyDamage(creature, target.attack);
      addLog(`👾 ${creature.name} atacó a ${target.name}.`);
    } else if (player.field.length > 0 && Math.random() < 0.4) {
      // 40% chance de atacar una criatura aleatoria del jugador
      const target = player.field[Math.floor(Math.random() * player.field.length)];
      const piercing = creature.keywords && creature.keywords.includes('pierce');
      applyDamage(target, creature.attack, piercing);
      applyDamage(creature, target.attack);
      addLog(`👾 ${creature.name} atacó a ${target.name}.`);
    } else {
      // Atacar directo al héroe
      applyDamage(player.hero, creature.attack);
      addLog(`👾 ${creature.name} atacó al héroe por ${creature.attack}.`);
    }

    creature.canAttackThisTurn = false;
  });

  checkDeaths();
}

// ===========================
// TURNO COMPLETO DEL ENEMIGO
// (reemplaza la función en combat.js)
// ===========================
function enemyTurnFull(combatState) {
  if (!combatState || combatState.isOver) return;

  // Subir gemas del enemigo
  if (combatState.enemy.gems.max < 10) combatState.enemy.gems.max++;
  combatState.enemy.gems.current = combatState.enemy.gems.max;
  combatState.enemy.magicCharges.current = combatState.enemy.magicCharges.max;

  // Habilitar ataque de criaturas enemigas
  combatState.enemy.field.forEach(c => { c.canAttackThisTurn = true; });

  // Ejecutar IA y obtener delay total de animaciones
  const delay = getEnemyAction(combatState) || 0;

  // Esperar a que terminen todas las animaciones de cartas
  setTimeout(() => {
    checkWinCondition();
    if (combatState.isOver) {
      if (typeof renderAll === 'function') renderAll();
      if (typeof showResult === 'function') showResult(combatState.winner);
      return;
    }

    // Procesar estados
    combatState.enemy.field.forEach(c => processStatusEffects(c));
    combatState.player.field.forEach(c => processStatusEffects(c));
    processStatusEffects(combatState.player.hero);
    checkDeaths();
    checkWinCondition();

    // Iniciar siguiente turno del jugador
    combatState.turn++;
    combatState.phase = 'player';
    if (combatState.player.gems.max < 10) combatState.player.gems.max++;
    combatState.player.gems.current = combatState.player.gems.max;
    combatState.player.magicCharges.current = combatState.player.magicCharges.max;
    combatState.player.field.forEach(c => { c.canAttackThisTurn = true; });
    drawCard();
    combatState.enemy.intent = { type: "invocando", value: 0 };
    addLog(`— Turno ${combatState.turn} —`);

    if (typeof renderAll === 'function') renderAll();
  }, delay + 1000);
}