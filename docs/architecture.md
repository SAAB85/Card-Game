# ARQUITECTURA TÉCNICA: CARD GAME

> Versión: 1.0 | Última revisión: Julio 2026

---

## 1. STACK TECNOLÓGICO

| Capa | Tecnología | Razón |
|---|---|---|
| Lenguaje | JavaScript (ES6+) | Nativo en navegador, sin instalación extra |
| Interfaz | HTML5 + CSS3 | Sin frameworks, máximo control y aprendizaje |
| Lógica de juego | JavaScript puro | El juego corre 100% en el cliente, sin servidor |
| Guardado | localStorage | Persiste el progreso sin backend |
| Hosting | GitHub Pages | Gratis, publicación directa desde el repo |

---

## 2. ESTRUCTURA DE ARCHIVOS

```
Card-Game/
├── docs/
│   ├── gdd.md               # Documento de diseño del juego
│   └── architecture.md      # Este documento
├── src/
│   ├── index.html           # Punto de entrada, estructura HTML base
│   ├── style.css            # Estilos globales y componentes visuales
│   ├── main.js              # Inicialización, navegación entre pantallas
│   ├── cards.js             # Base de datos de las 41 cartas
│   ├── combat.js            # Motor de combate (turnos, ataques, efectos)
│   └── enemies.js           # Definición de enemigos y su comportamiento IA
├── .gitignore
├── LICENSE
└── README.md
```

---

## 3. ESTRUCTURAS DE DATOS

### 3.1 Carta base (CardDefinition)
Definición estática de cada carta. Vive en `cards.js`. No cambia durante el juego.

```javascript
{
  id: "slime",                  // Identificador único (string)
  name: "Slime",                // Nombre visible
  format: "creature",           // "creature" | "spell" | "equipment"
  rarity: "common",             // "common" | "rare" | "epic" | "legendary"
  cost: {
    gems: 1,                    // Gemas normales requeridas
    charges: 0,                 // Cargas Mágicas requeridas
    life: 0,                    // Vida del héroe que cuesta
    graveyard: 0                // Cartas del cementerio a consumir
  },
  attack: 1,                    // Solo criaturas (null en hechizos/equipos)
  health: 1,                    // Solo criaturas (null en hechizos/equipos)
  keywords: [],                 // ["taunt","pierce","stealth","poison","growth"]
  growthTurns: null,            // Turnos para evolucionar (solo si tiene "growth")
  growthStats: null,            // { attack: X, health: Y } al evolucionar
  durability: null,             // Solo armas: número de ataques antes de romperse
  effect: null                  // Referencia a función de efecto (ver combat.js)
}
```

### 3.2 Instancia de carta en juego (CardInstance)
Copia de una carta cuando está en campo, mano o cementerio. Tiene estado mutable.

```javascript
{
  instanceId: "uuid-unico",     // ID único de esta instancia específica
  definitionId: "slime",        // Referencia a la CardDefinition original
  attack: 1,                    // Ataque actual (puede ser modificado por buffs)
  health: 1,                    // Vida actual
  armor: 0,                     // Armadura actual
  durability: null,             // Usos restantes (solo armas)
  statusEffects: [],            // Estados activos: ["poisoned", "stunned", etc.]
  turnsInField: 0,              // Turnos que lleva en mesa (para Crecimiento)
  canAttackThisTurn: false,     // Si ya atacó este turno
  equipment: null,              // ID de instancia del equipo adjunto (si tiene)
  isBanished: false             // Si fue consumida como combustible (no revivible)
}
```

### 3.3 Estado del jugador (PlayerState)

```javascript
{
  hero: {
    health: 30,                 // Vida actual del héroe
    maxHealth: 30,              // Vida máxima
    armor: 0                    // Armadura del héroe
  },
  gems: {
    current: 1,                 // Gemas disponibles este turno
    max: 1                      // Gemas máximas este turno (sube +1 por turno)
  },
  magicCharges: {
    current: 0,                 // Cargas Mágicas disponibles este turno
    max: 0                      // Cargas Mágicas máximas (sube con Orbe Mágico)
  },
  hand: [],                     // Array de CardInstance (máx. 10 cartas)
  deck: [],                     // Array de CardInstance (cartas restantes)
  field: [],                    // Array de CardInstance en el campo (máx. 7)
  graveyard: []                 // Array de CardInstance destruidas/usadas
}
```

### 3.4 Estado del enemigo (EnemyState)

```javascript
{
  id: "slime_boss",             // ID del enemigo
  name: "Gran Slime",           // Nombre visible
  health: 30,                   // Vida actual
  maxHealth: 30,
  armor: 0,
  field: [],                    // Criaturas del enemigo en campo
  graveyard: [],
  intent: {                     // Lo que va a hacer el próximo turno (visible para el jugador)
    type: "attack",             // "attack" | "defend" | "buff" | "special"
    value: 8                    // Valor del ataque/efecto
  },
  aiPattern: "aggressive"       // Patrón de IA: "aggressive" | "defensive" | "combo"
}
```

---

## 4. MÓDULOS Y RESPONSABILIDADES

### main.js — Navegación y arranque
- Inicializa el juego al cargar la página
- Controla qué pantalla se muestra (menú, combate, tienda, exploración)
- Carga y guarda el estado global desde localStorage

### cards.js — Base de datos de cartas
- Exporta el array `CARD_DEFINITIONS` con las 41 cartas definidas
- Exporta función `getCard(id)` para obtener una definición por ID
- Exporta función `createInstance(cardId)` para crear una CardInstance a partir de una definición

### combat.js — Motor de combate
- Controla el flujo de turnos (turno jugador → turno enemigo)
- Funciones principales:
  - `startCombat(playerDeck, enemy)` — inicializa un combate
  - `playCard(cardInstance, target)` — juega una carta desde la mano
  - `attackWith(attacker, target)` — una criatura ataca a un objetivo
  - `endTurn()` — termina el turno del jugador, ejecuta turno del enemigo
  - `applyEffect(effect, source, target)` — aplica efectos de carta
  - `checkStatusEffects()` — procesa veneno, incendio y otros al final de turno
  - `checkWinCondition()` — verifica si alguien ganó o perdió

### enemies.js — Enemigos e IA
- Exporta `ENEMY_DEFINITIONS` con los enemigos disponibles
- Función `getEnemyAction(enemyState, playerState)` — decide qué hace el enemigo este turno según su patrón de IA

---

## 5. FLUJO DE UN TURNO (referencia para programar)

```
INICIO DE TURNO DEL JUGADOR
  ├── gems.max += 1
  ├── gems.current = gems.max
  ├── magicCharges.current = magicCharges.max
  ├── Robar 1 carta (deck → hand)
  ├── Procesar Crecimiento (turnsInField++ en criaturas con "growth")
  └── canAttackThisTurn = true en todas las criaturas (excepto recién invocadas)

ACCIONES DEL JUGADOR (puede repetir hasta terminar turno)
  ├── Jugar carta → playCard(card, target)
  └── Atacar con criatura → attackWith(attacker, target)

FIN DE TURNO DEL JUGADOR
  ├── Procesar efectos de fin de turno (Sauce Golpeador, Guerrero +armadura)
  ├── Procesar estados activos (Veneno, Incendio sobre criaturas/héroe enemigo)
  └── canAttackThisTurn = false en todas las criaturas

TURNO DEL ENEMIGO
  ├── getEnemyAction() decide la acción
  ├── Ejecuta ataque o efecto especial
  ├── Procesar estados activos sobre el jugador
  └── Verificar condición de victoria → checkWinCondition()
```

---

## 6. ORDEN DE IMPLEMENTACIÓN (por fases del GDD)

| Fase | Archivos principales a tocar |
|---|---|
| Fase 1: Motor base | `cards.js` (primeras criaturas simples) + `combat.js` (turno, atacar, morir) + `index.html` + `style.css` |
| Fase 2: Hechizos y equipos | `cards.js` (añadir hechizos/equipos) + `combat.js` (playCard para no-criaturas, Provocar, Perforante) |
| Fase 3: Estados | `combat.js` (checkStatusEffects: veneno, incendio, aturdido, petrificado, oculto) |
| Fase 4: Mecánicas avanzadas | `combat.js` (crecimiento, durabilidad, sacrificio de vida) |
| Fase 5: IA y modos de juego | `enemies.js` + `main.js` (taberna, exploración, tienda) |