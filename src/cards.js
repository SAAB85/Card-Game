// ===========================
// BASE DE DATOS DE CARTAS
// cards.js
// ===========================

const CARD_DEFINITIONS = [

  // ─── COSTE 1 ───────────────────────────────────────────

  {
    id: "slime",
    name: "Slime",
    format: "creature",
    rarity: "common",
    cost: { gems: 1, charges: 0, life: 0, graveyard: 0 },
    attack: 1, health: 1,
    keywords: [],
    effect: null
  },
  {
    id: "aldeano",
    name: "Aldeano",
    format: "creature",
    rarity: "common",
    cost: { gems: 1, charges: 0, life: 0, graveyard: 0 },
    attack: 1, health: 1,
    keywords: [],
    effect: null
  },
  {
    id: "diablillo",
    name: "Diablillo",
    format: "creature",
    rarity: "common",
    cost: { gems: 1, charges: 0, life: 2, graveyard: 0 },
    attack: 1, health: 2,
    keywords: [],
    effect: null
  },
  {
    id: "escudero",
    name: "Escudero de la Guardia",
    format: "creature",
    rarity: "common",
    cost: { gems: 1, charges: 0, life: 0, graveyard: 0 },
    attack: 1, health: 3,
    keywords: ["taunt"],
    effect: null
  },
  {
    id: "orbe_magico",
    name: "Orbe Mágico",
    format: "spell",
    rarity: "common",
    cost: { gems: 1, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "addMagicCharge"       // Añade +1 Carga Mágica permanente
  },
  {
    id: "incendio",
    name: "Incendio",
    format: "spell",
    rarity: "common",
    cost: { gems: 1, charges: 1, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "applyBurn"            // 1 daño inmediato + estado Incendiado 2 turnos
  },
  {
    id: "vendaje",
    name: "Vendaje",
    format: "spell",
    rarity: "common",
    cost: { gems: 1, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "heal2"                // Recupera 2 de salud al objetivo
  },

  // ─── COSTE 2 ───────────────────────────────────────────

  {
    id: "armadura_basica",
    name: "Armadura Básica",
    format: "equipment",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    durability: null,              // Armaduras no tienen durabilidad
    effect: "equipArmor1hp1"       // +1 vida y +1 armadura al objetivo
  },
  {
    id: "espada_basica",
    name: "Espada Básica",
    format: "equipment",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    durability: 2,
    effect: "equipSwordBasic"      // +1 ataque (o +2 si objetivo sin armadura)
  },
  {
    id: "herrero",
    name: "Herrero de la Aldea",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: 1, health: 2,
    keywords: [],
    effect: "drawEquipment"        // Al entrar: agrega Espada Básica o Armadura Básica a la mano
  },
  {
    id: "necrofago",
    name: "Necrófago Hambriento",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 1 },
    attack: 3, health: 2,
    keywords: [],
    effect: null
  },
  {
    id: "arquero",
    name: "Arquero Novato",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: 2, health: 1,
    keywords: ["pierce"],
    effect: null
  },
  {
    id: "armadura_bronce",
    name: "Armadura de Bronce",
    format: "equipment",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    durability: null,
    effect: "equipArmor3"          // +3 armadura al objetivo
  },
  {
    id: "daga_basica",
    name: "Daga Básica",
    format: "equipment",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    durability: 2,
    effect: "equipDaggerBasic"     // +2 daño Perforante al objetivo
  },
  {
    id: "arbol",
    name: "Árbol",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: 0, health: 3,
    keywords: ["growth"],
    growthTurns: 2,
    growthStats: { attack: 3, health: 3 },
    effect: null
  },
  {
    id: "zarzas",
    name: "Zarzas",
    format: "spell",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "damage2Stun"          // 2 daño + Aturdido 1 turno
  },
  {
    id: "conejo_loco",
    name: "Conejo Loco",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: 2, health: 1,
    keywords: ["rush"],            // Puede atacar el mismo turno que entra
    effect: null
  },
  {
    id: "guerrero",
    name: "Guerrero",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: 1, health: 1,
    keywords: [],
    effect: "gainArmorEachTurn"    // Al final de cada turno propio: +1 armadura permanente
  },
  {
    id: "elixir",
    name: "Elixir",
    format: "spell",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "chooseAtkOrHp2"       // Elige: +2 ataque O +2 vida al objetivo
  },

  // ─── COSTE 3 ───────────────────────────────────────────

  {
    id: "domador_slime",
    name: "Domador de Slime",
    format: "spell",
    rarity: "rare",
    cost: { gems: 2, charges: 2, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "slimeDominator"       // Elige: invocar 2 Slimes O dar +2/+2 a un Slime aliado
  },
  {
    id: "golem",
    name: "Gólem de Chatarra",
    format: "creature",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: 2, health: 2,
    keywords: [],
    effect: "enterWith2Armor"      // Entra con 2 de armadura
  },
  {
    id: "pocion",
    name: "Poción",
    format: "spell",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "heal3"                // Recupera 3 de vida al objetivo
  },
  {
    id: "rosa_mortifera",
    name: "Rosa Mortífera",
    format: "creature",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: 0, health: 2,
    keywords: ["growth"],
    growthTurns: 1,
    growthStats: { attack: 3, health: 2 },
    effect: "bonusDamageNoArmor"   // +2 daño extra a objetivos sin armadura
  },
  {
    id: "lobo",
    name: "Lobo",
    format: "creature",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: 3, health: 2,
    keywords: [],
    effect: null
  },
  {
    id: "pocima_ro",
    name: "Pócima de Ro",
    format: "spell",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "cleanse"              // Elimina todos los estados negativos del objetivo
  },
  {
    id: "pocima_locura",
    name: "Pócima de Locura",
    format: "spell",
    rarity: "rare",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "doubleAttack2Turns"   // Objetivo ataca 2 veces por turno durante 2 turnos
  },
  {
    id: "rito_nigromante",
    name: "Rito del Nigromante",
    format: "spell",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "reviveLastCreature"   // Revive la última criatura aliada muerta no consumida
  },

  // ─── COSTE 4 ───────────────────────────────────────────

  {
    id: "luke",
    name: "Luke",
    format: "creature",
    rarity: "epic",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: 2, health: 2,
    keywords: ["dodge"],           // Esquiva el primer golpe por turno rival
    effect: "bonusDamageNoArmor1"  // +1 daño extra a objetivos sin armadura
  },
  {
    id: "gran_lobo",
    name: "Gran Lobo",
    format: "creature",
    rarity: "common",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: 4, health: 3,
    keywords: [],
    effect: null
  },
  {
    id: "raneji",
    name: "Raneji",
    format: "creature",
    rarity: "rare",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: 1, health: 4,
    keywords: [],
    effect: "poisonOnAttack"       // Cada ataque envenena al objetivo (2 dmg por 2 turnos)
  },
  {
    id: "gran_armadura",
    name: "Gran Armadura",
    format: "equipment",
    rarity: "common",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    durability: null,
    effect: "equipArmor5"          // +5 armadura al objetivo
  },
  {
    id: "katana",
    name: "Katana",
    format: "equipment",
    rarity: "common",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    durability: 2,
    effect: "equipKatana"          // +3 daño Perforante, durabilidad 2
  },
  {
    id: "gran_slime",
    name: "Gran Slime",
    format: "creature",
    rarity: "common",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: 3, health: 3,
    keywords: ["immunePoison"],    // Inmune a Veneno
    effect: null
  },
  {
    id: "meteoro",
    name: "Meteoro",
    format: "spell",
    rarity: "rare",
    cost: { gems: 4, charges: 3, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "damage7"              // 7 de daño al objetivo
  },

  // ─── COSTE 5 ───────────────────────────────────────────

  {
    id: "sauce",
    name: "Sauce Golpeador",
    format: "creature",
    rarity: "common",
    cost: { gems: 5, charges: 0, life: 0, graveyard: 0 },
    attack: 0, health: 5,
    keywords: ["growth"],
    growthTurns: 2,
    growthStats: { attack: 5, health: 5 },
    effect: "hitRandomEnemyEachTurn" // Al final de cada turno golpea a un enemigo al azar
  },
  {
    id: "pocion_acida",
    name: "Poción Ácida",
    format: "spell",
    rarity: "common",
    cost: { gems: 5, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "destroyArmor"         // Destruye toda la armadura del objetivo
  },
  {
    id: "petrificar",
    name: "Petrificar",
    format: "spell",
    rarity: "rare",
    cost: { gems: 5, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "petrify"              // Objetivo: ataque pasa a 0, pierde efectos, conserva vida
  },

  // ─── COSTE 6 ───────────────────────────────────────────

  {
    id: "ninja",
    name: "Ninja",
    format: "creature",
    rarity: "epic",
    cost: { gems: 6, charges: 0, life: 0, graveyard: 0 },
    attack: 3, health: 2,
    keywords: [],
    effect: "ninjaEntry"           // Al entrar: ataca. Si mata → Oculto. Si no → Venena (3 dmg x2 turnos)
  },
  {
    id: "carnicero",
    name: "Carnicero",
    format: "creature",
    rarity: "common",
    cost: { gems: 6, charges: 0, life: 0, graveyard: 0 },
    attack: 3, health: 6,
    keywords: [],
    effect: "doubleAttackWithWeapon" // Si tiene arma equipada: ataca 2 veces por turno
  },

  // ─── COSTE 7 ───────────────────────────────────────────

  {
    id: "slamin",
    name: "Slamin",
    format: "creature",
    rarity: "common",
    cost: { gems: 7, charges: 0, life: 0, graveyard: 0 },
    attack: 5, health: 5,
    keywords: ["immunePoison", "immuneBurn", "immuneStun"],
    effect: null
  },

  // ─── LEGENDARIA ────────────────────────────────────────

  {
    id: "stop",
    name: "Stop",
    format: "spell",
    rarity: "legendary",
    cost: { gems: 10, charges: 5, life: 5, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    effect: "skipEnemyTurn"        // El rival pierde completamente su siguiente turno
  }

];

// ===========================
// FUNCIONES DE UTILIDAD
// ===========================

// Obtiene la definición de una carta por su ID
function getCard(id) {
  return CARD_DEFINITIONS.find(card => card.id === id) || null;
}

// Crea una instancia jugable a partir de una definición
function createInstance(cardId) {
  const def = getCard(cardId);
  if (!def) return null;

  return {
    instanceId: crypto.randomUUID(),  // ID único de esta instancia
    definitionId: def.id,
    name: def.name,
    format: def.format,
    rarity: def.rarity,
    cost: { ...def.cost },
    attack: def.attack,
    health: def.health,
    maxHealth: def.health,
    armor: 0,
    keywords: [...(def.keywords || [])],
    growthTurns: def.growthTurns || null,
    growthStats: def.growthStats ? { ...def.growthStats } : null,
    turnsInField: 0,
    durability: def.durability || null,
    effect: def.effect,
    statusEffects: [],              // ["poisoned", "burned", "stunned", "petrified", "stealth"]
    canAttackThisTurn: false,       // False al invocar (excepto "rush")
    equipment: null,                // ID de instancia del equipo adjunto
    isBanished: false               // True si fue consumida como combustible
  };
}