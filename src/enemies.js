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
  const player = combatState.player;

  // Ordenar mano por costo (jugar las más baratas primero)
  enemy.hand.sort((a, b) => a.cost.gems - b.cost.gems);

  let played = true;
  while (played) {
    played = false;
    for (let i = 0; i < enemy.hand.length; i++) {
      const card = enemy.hand[i];

      // Verificar si puede pagarlo
      if (enemy.gems.current < card.cost.gems) continue;
      if (enemy.magicCharges.current < card.cost.charges) continue;

      // Criaturas: jugar si hay espacio
      if (card.format === 'creature' && enemy.field.length < 6) {
        enemy.gems.current -= card.cost.gems;
        card.canAttackThisTurn = false;
        card.turnsInField = 0;
        enemy.field.push(card);
        enemy.hand.splice(i, 1);
        addLog(`👾 ${enemy.name} invocó ${card.name}.`);

        // Efectos de entrada del enemigo
        applyEnemyCardEffect(card, combatState);
        played = true;
        break;
      }

      // Hechizos
      if (card.format === 'spell') {
        enemy.gems.current -= card.cost.gems;
        enemy.magicCharges.current -= card.cost.charges;
        enemy.hand.splice(i, 1);
        enemy.graveyard.push(card);
        addLog(`👾 ${enemy.name} lanzó ${card.name}.`);
        applyEnemySpellEffect(card, combatState);
        played = true;
        break;
      }
    }
  }
}

// ===========================
// EFECTOS DE CARTA DEL ENEMIGO
// ===========================

function applyEnemyCardEffect(card, combatState) {
  const enemy = combatState.enemy;
  const player = combatState.player;

  switch(card.effect) {
    case 'spawnCopyOnEnter':
      if (enemy.field.length < 6) {
        const copy = createInstance(card.definitionId);
        copy.canAttackThisTurn = false;
        enemy.field.push(copy);
        addLog(`👾 ${card.name} invocó una copia de sí mismo.`);
      }
      break;

    case 'buffPerSlimeOnEnter': {
      const slimeCount = enemy.field.filter(c =>
        c.name.toLowerCase().includes('slime') ||
        c.definitionId.includes('slime')
      ).length;
      card.attack += slimeCount;
      card.health += slimeCount;
      card.maxHealth += slimeCount;
      if (slimeCount > 0) addLog(`👾 ${card.name} ganó +${slimeCount}/+${slimeCount}.`);
      break;
    }

    case 'drawOnEnterAndDeath':
      if (enemy.deck.length > 0 && enemy.hand.length < 10) {
        const drawn = enemy.deck.shift();
        enemy.hand.push(drawn);
        addLog(`👾 ${enemy.name} robó una carta.`);
      }
      break;

    case 'spawnSlimeAlfa': {
      const alfa = createInstance('slime_alfa');
      alfa.canAttackThisTurn = false;
      if (enemy.field.length < 6) {
        enemy.field.push(alfa);
        addLog(`👾 ${enemy.name} invocó al Slime Alfa.`);
      }
      break;
    }
  }
}

function applyEnemySpellEffect(card, combatState) {
  const enemy = combatState.enemy;
  const player = combatState.player;

  switch(card.effect) {
    case 'buffAllSlimes':
      enemy.field.forEach(c => {
        if (c.definitionId.includes('slime') || c.name.toLowerCase().includes('slime')) {
          c.attack += 1;
          c.health += 1;
          c.maxHealth += 1;
        }
      });
      addLog(`👾 Todos los Slimes del enemigo ganaron +1/+1.`);
      break;

    case 'buffAllAllies':
      enemy.field.forEach(c => {
        c.attack += 1;
        c.health += 1;
        c.maxHealth += 1;
      });
      addLog(`👾 Todas las criaturas enemigas ganaron +1/+1.`);
      break;

    case 'spawnThreeSlimes':
      for (let i = 0; i < 3 && enemy.field.length < 6; i++) {
        const s = createInstance('slime');
        s.canAttackThisTurn = false;
        enemy.field.push(s);
      }
      addLog(`👾 ${enemy.name} invocó 3 Slimes.`);
      break;

    case 'heal2':
      enemy.hero.health = Math.min(enemy.hero.health + 2, enemy.hero.maxHealth);
      addLog(`👾 ${enemy.name} recuperó 2 de vida.`);
      break;

    case 'controlUntilEndOfTurn': {
      // Tomar control de la criatura más fuerte del jugador
      if (player.field.length > 0) {
        const strongest = player.field.reduce((a, b) => a.attack > b.attack ? a : b);
        strongest._controlled = true;
        strongest.canAttackThisTurn = true;
        // Atacar con ella al héroe del jugador
        const dmg = Math.max(0, strongest.attack - player.hero.armor);
        player.hero.armor = Math.max(0, player.hero.armor - strongest.attack);
        player.hero.health -= dmg;
        addLog(`👾 ${enemy.name} controló a ${strongest.name} y atacó por ${dmg}.`);
        strongest._controlled = false;
      }
      break;
    }
  }
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

  // Ejecutar IA
  getEnemyAction(combatState);

  checkWinCondition();
  if (combatState.isOver) return;

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

  // Nueva intención del enemigo
  combatState.enemy.intent = { type: "summon", value: 0 };
  addLog(`— Turno ${combatState.turn} —`);
}