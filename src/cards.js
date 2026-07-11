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
    description: "Una criatura viscosa sin habilidades especiales. Perfecta para turno 1.",
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
    description: "Un humilde aldeano dispuesto a luchar. Sin efectos especiales.",
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
    description: "Cuesta 2 de tu propia vida para invocarlo. Útil en turno 1 si necesitas un bloqueador resistente.",
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
    description: "Provocar: el enemigo está obligado a atacar a esta unidad antes que a otras o al héroe.",
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
    description: "Añade +1 Carga Mágica permanente. Las Cargas Mágicas se recargan al inicio de cada turno y permiten lanzar hechizos especiales.",
    effect: "addMagicCharge"
  },
  {
    id: "incendio",
    name: "Incendio",
    format: "spell",
    rarity: "common",
    cost: { gems: 1, charges: 1, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "Inflige 1 de daño inmediato al objetivo. Lo deja Incendiado: recibe 1 de daño adicional al final de los próximos 2 turnos.",
    effect: "applyBurn"
  },
  {
    id: "vendaje",
    name: "Vendaje",
    format: "spell",
    rarity: "common",
    cost: { gems: 1, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "Recupera 2 de salud a una criatura aliada o a tu héroe.",
    effect: "heal2"
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
    durability: null,
    description: "Equipa a una criatura aliada: otorga +1 de vida y +1 de Armadura. La armadura absorbe daño antes de la vida.",
    effect: "equipArmor1hp1"
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
    description: "Equipa a una criatura: otorga +1 de ataque. Si el objetivo no tiene armadura, otorga +2 en su lugar. Durabilidad: 2 usos.",
    effect: "equipSwordBasic"
  },
  {
    id: "herrero",
    name: "Herrero de la Aldea",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: 1, health: 2,
    keywords: [],
    description: "Al entrar al campo, agrega una Espada Básica o una Armadura Básica (al azar) a tu mano.",
    effect: "drawEquipment"
  },
  {
    id: "necrofago",
    name: "Necrófago Hambriento",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 1 },
    attack: 3, health: 2,
    keywords: [],
    description: "Para invocarlo debes consumir 1 carta de tu cementerio. Esa carta queda desterrada permanentemente.",
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
    description: "Perforante: su daño ignora por completo la armadura del objetivo y golpea directo a la vida.",
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
    description: "Equipa a una criatura aliada: otorga 3 de Armadura. La armadura absorbe daño antes de la vida.",
    effect: "equipArmor3"
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
    description: "Equipa a una criatura: otorga +2 de daño Perforante. Su daño ignora la armadura. Durabilidad: 2 usos.",
    effect: "equipDaggerBasic"
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
    description: "Crecimiento: entra con 0/3. Tras 2 turnos en mesa evoluciona a 3/3.",
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
    description: "Inflige 2 de daño al objetivo y lo deja Aturdido: pierde la capacidad de atacar durante su próximo turno.",
    effect: "damage2Stun"
  },
  {
    id: "conejo_loco",
    name: "Conejo Loco",
    format: "creature",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: 2, health: 1,
    keywords: ["rush"],
    description: "Rush: puede atacar el mismo turno en que es invocado.",
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
    description: "Al final de cada turno propio, gana +1 de Armadura de forma permanente.",
    effect: "gainArmorEachTurn"
  },
  {
    id: "elixir",
    name: "Elixir",
    format: "spell",
    rarity: "common",
    cost: { gems: 2, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "Elige un objetivo: otorga +2 de ataque O +2 de vida (tú decides al jugarlo).",
    effect: "chooseAtkOrHp2"
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
    description: "Requiere 2 Cargas Mágicas. Elige: invocar 2 Slimes (1/1) en el campo O dar +2/+2 a un Slime aliado ya en mesa.",
    effect: "slimeDominator"
  },
  {
    id: "golem",
    name: "Gólem de Chatarra",
    format: "creature",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: 2, health: 2,
    keywords: [],
    description: "Entra al campo con 2 de Armadura incluidos.",
    effect: "enterWith2Armor"
  },
  {
    id: "pocion",
    name: "Poción",
    format: "spell",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "Recupera 3 de vida a una criatura aliada o a tu héroe.",
    effect: "heal3"
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
    description: "Crecimiento: entra con 0/2. Al siguiente turno evoluciona a 3/2. Inflige +2 de daño extra a objetivos sin armadura.",
    effect: "bonusDamageNoArmor"
  },
  {
    id: "lobo",
    name: "Lobo",
    format: "creature",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: 3, health: 2,
    keywords: [],
    description: "Una bestia feroz. Sin efectos especiales pero con buenas estadísticas para su costo.",
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
    description: "Elimina todos los estados negativos del objetivo: veneno, aturdimiento, incendio, petrificado y otros.",
    effect: "cleanse"
  },
  {
    id: "pocima_locura",
    name: "Pócima de Locura",
    format: "spell",
    rarity: "rare",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "El objetivo puede atacar 2 veces por turno durante los próximos 2 turnos.",
    effect: "doubleAttack2Turns"
  },
  {
    id: "rito_nigromante",
    name: "Rito del Nigromante",
    format: "spell",
    rarity: "common",
    cost: { gems: 3, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "Revive la criatura aliada muerta más reciente que no haya sido consumida como combustible. Si no hay ninguna elegible, no se puede jugar.",
    effect: "reviveLastCreature"
  },

  // ─── COSTE 4 ───────────────────────────────────────────

  {
    id: "luke",
    name: "Luke",
    format: "creature",
    rarity: "epic",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: 2, health: 2,
    keywords: ["dodge"],
    description: "Esquiva el primer golpe recibido por turno rival. Inflige +1 de daño extra a objetivos sin armadura.",
    effect: "bonusDamageNoArmor1"
  },
  {
    id: "gran_lobo",
    name: "Gran Lobo",
    format: "creature",
    rarity: "common",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: 4, health: 3,
    keywords: [],
    description: "Una versión mayor y más peligrosa del Lobo. Sin efectos especiales.",
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
    description: "Veneno: cada vez que ataca, envenena al objetivo (2 de daño al final de su turno, dura 2 turnos).",
    effect: "poisonOnAttack"
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
    description: "Equipa a una criatura aliada: otorga 5 de Armadura.",
    effect: "equipArmor5"
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
    description: "Equipa a una criatura: otorga +3 de daño Perforante que ignora la armadura. Durabilidad: 2 usos.",
    effect: "equipKatana"
  },
  {
    id: "gran_slime",
    name: "Gran Slime",
    format: "creature",
    rarity: "common",
    cost: { gems: 4, charges: 0, life: 0, graveyard: 0 },
    attack: 3, health: 3,
    keywords: ["immunePoison"],
    description: "Inmune a Veneno: no puede ser envenenado por ningún efecto.",
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
    description: "Requiere 3 Cargas Mágicas. Inflige 7 de daño a un objetivo.",
    effect: "damage7"
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
    description: "Crecimiento: entra con 0/5. Tras 2 turnos evoluciona a 5/5. Al final de cada turno golpea a un enemigo al azar.",
    effect: "hitRandomEnemyEachTurn"
  },
  {
    id: "pocion_acida",
    name: "Poción Ácida",
    format: "spell",
    rarity: "common",
    cost: { gems: 5, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "Destruye toda la armadura del objetivo al instante.",
    effect: "destroyArmor"
  },
  {
    id: "petrificar",
    name: "Petrificar",
    format: "spell",
    rarity: "rare",
    cost: { gems: 5, charges: 0, life: 0, graveyard: 0 },
    attack: null, health: null,
    keywords: [],
    description: "Petrifica al objetivo: su ataque pasa a 0, pierde todos sus efectos y habilidades. Conserva su vida actual.",
    effect: "petrify"
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
    description: "Al entrar: ataca inmediatamente a un enemigo. Si lo mata, entra en Oculto (no puede ser seleccionado). Si no lo mata, lo envenena (3 de daño por 2 turnos).",
    effect: "ninjaEntry"
  },
  {
    id: "carnicero",
    name: "Carnicero",
    format: "creature",
    rarity: "common",
    cost: { gems: 6, charges: 0, life: 0, graveyard: 0 },
    attack: 3, health: 6,
    keywords: [],
    description: "Si tiene un arma equipada, puede atacar 2 veces por turno.",
    effect: "doubleAttackWithWeapon"
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
    description: "Inmune a Veneno, Incendio y Aturdimiento. Una bestia imparable.",
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
    description: "El rival pierde por completo su siguiente turno — solo puede pasar. Requiere 10 gemas, 5 Cargas Mágicas y 5 de vida propia.",
    effect: "skipEnemyTurn"
  }

];

// ===========================
// FUNCIONES DE UTILIDAD
// ===========================

function getCard(id) {
  return CARD_DEFINITIONS.find(card => card.id === id) || null;
}

function createInstance(cardId) {
  const def = getCard(cardId);
  if (!def) return null;

  return {
    instanceId: crypto.randomUUID(),
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
    description: def.description || '',
    statusEffects: [],
    canAttackThisTurn: false,
    equipment: null,
    isBanished: false
  };
}