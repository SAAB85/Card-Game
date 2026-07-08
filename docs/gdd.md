# DOCUMENTO DE DISEÑO: CARD GAME (GDD v1.0)

> Estado: MVP en diseño | Última revisión: Julio 2026

---

## 1. CONCEPTO

Juego de cartas por turnos de fantasía, con tablero de criaturas estilo TCG (Hearthstone / Yu-Gi-Oh). El jugador construye un mazo, combate contra enemigos controlados por IA y desbloquea cartas nuevas comprando sobres en la tienda. El foco está en la profundidad de mecánicas, no en los gráficos.

---

## 2. MODOS DE JUEGO

- **Taberna:** Combates contra IA que usa mazos predefinidos de "jugador". Sin condicionantes especiales de combate. Fuente de monedas.
- **Exploración:** Misiones y mazmorras contra jefes y criaturas con mecánicas únicas (golpes especiales, condiciones de combate). Fuente principal de monedas y recompensas.
- **Tienda:** Compra sobres de cartas con las monedas ganadas en Taberna o Exploración.

---

## 3. SISTEMAS Y REGLAS BASE

### Sistema de recursos (híbrido)

| Recurso | Descripción |
|---|---|
| **Gemas Normales** | Aumentan +1 al inicio de cada turno (como el maná de Hearthstone). Máximo igual al turno actual. |
| **Cargas Mágicas** | Recurso secundario generado por el Orbe Mágico. Cada Orbe jugado suma +1 Carga permanente que se recarga al inicio de cada turno. |
| **Sacrificio de Vida** | Algunas cartas descuentan vida directamente al héroe como coste adicional para jugarse. |
| **Combustible de Cementerio** | Algunas cartas requieren consumir (desterrar) cartas del cementerio propio como coste adicional. |

### El Cementerio
- Las cartas de criatura destruidas y los hechizos/equipos usados van al cementerio.
- El cementerio puede usarse como recurso de coste (combustible) o como fuente para mecánicas de resurrección.
- **Regla crítica:** una carta consumida como combustible queda **desterrada permanentemente** y no puede ser revivida por ningún efecto.

### Armadura
- Escudo temporal por encima de la vida. Absorbe daño punto por punto antes de que llegue a la vida.
- Ejemplo: criatura con 2 de armadura recibe 3 de daño → pierde la armadura (0) y solo recibe 1 a su vida.
- Efecto visual: marco/borde especial sobre la carta en el campo.

### Equipamiento
- Los equipos se adjuntan a una criatura aliada y modifican sus stats.
- **Armaduras:** no tienen durabilidad propia — se gastan automáticamente al absorber daño hasta llegar a 0.
- **Armas:** sí tienen durabilidad (número de ataques antes de romperse). Ver tabla de cartas para valores por carta.

---

## 4. GLOSARIO DE MECÁNICAS Y ESTADOS

| Mecánica | Descripción |
|---|---|
| **Provocar** | Los enemigos están obligados a atacar a esta unidad antes que a cualquier otra o al héroe. |
| **Perforante** | El daño ignora por completo la armadura del objetivo y golpea directo a su vida. |
| **Oculto** | La unidad no puede ser seleccionada como objetivo de ataques ni hechizos rivales. |
| **Aturdido** | La unidad pierde la capacidad de atacar durante su siguiente turno. |
| **Evolución / Crecimiento** | La unidad entra al campo con stats bajas (o 0/0) y se transforma en una versión más poderosa tras una cantidad fija de turnos en mesa. |
| **Veneno** | Inflige daño fijo al final del turno del propietario de la unidad envenenada. Dura exactamente 2 turnos. |
| **Incendio** | Inflige 1 de daño inmediato al impactar. Luego inflige 1 de daño adicional al final del turno rival durante los siguientes 2 turnos. |
| **Petrificado** | El ataque de la unidad pasa a 0 y pierde todos sus efectos/habilidades. Conserva su vida actual. |
| **Durabilidad** | Solo aplica a armas. Número de ataques que puede realizar antes de romperse y desaparecer del campo. |

---

## 5. BASE DE DATOS DE CARTAS (41 CARTAS)

### Clasificación

Cada carta tiene dos campos de clasificación independientes:

- **Formato:** `Criatura` | `Hechizo` | `Equipo`
- **Rareza:** `Común` | `Rara` | `Épica` | `Legendaria`

El costo especial (vida, cargas mágicas, combustible de cementerio) es un dato de la carta, no una categoría.

---

### Tabla de cartas

| # | Nombre | Formato | Rareza | Coste | Atq / Vida | Efecto / Habilidad |
|---|---|---|---|---|:---:|---|
| 1 | **Slime** | Criatura | Común | 1 Gema | 1 / 1 | Sin efecto. |
| 2 | **Aldeano** | Criatura | Común | 1 Gema | 1 / 1 | Sin efecto. |
| 3 | **Diablillo** | Criatura | Común | 1 Gema + 2 Vida Player | 1 / 2 | Sin efecto. Invocación agresiva de turno 1. |
| 4 | **Orbe Mágico** | Hechizo | Común | 1 Gema | — / — | Añade +1 Carga Mágica permanente al jugador (se recarga al inicio de cada turno). |
| 5 | **Incendio** | Hechizo | Común | 1 Gema + 1 Carga Mágica | — / — | Inflige 1 de daño inmediato. Deja al objetivo Incendiado (1 daño al final de cada turno rival por 2 turnos). |
| 6 | **Vendaje** | Hechizo | Común | 1 Gema | — / — | Recupera 2 de salud a cualquier unidad aliada (criatura o héroe). |
| 7 | **Armadura Básica** | Equipo | Común | 2 Gemas | — / — | Otorga +1 de vida y +1 de Armadura a una criatura aliada. |
| 8 | **Espada Básica** | Equipo | Común | 2 Gemas | — / — | Otorga +1 de ataque. Si el objetivo no tiene armadura, otorga +2 en su lugar. Durabilidad: 2. |
| 9 | **Herrero de la Aldea** | Criatura | Común | 2 Gemas | 1 / 2 | Al entrar al campo, agrega una Espada Básica o una Armadura Básica (al azar) a tu mano. |
| 10 | **Necrófago Hambriento** | Criatura | Común | 2 Gemas + 1 Cementerio | 3 / 2 | Requiere consumir 1 carta del cementerio propio para poder invocarse. |
| 11 | **Arquero Novato** | Criatura | Común | 2 Gemas | 2 / 1 | **Perforante.** |
| 12 | **Armadura de Bronce** | Equipo | Común | 2 Gemas | — / — | Otorga 3 de Armadura a una criatura aliada. |
| 13 | **Daga Básica** | Equipo | Común | 2 Gemas | — / — | Otorga +2 de daño Perforante al objetivo. Durabilidad: 2. |
| 14 | **Árbol** | Criatura | Común | 2 Gemas | 0 / 3 | **Crecimiento:** se transforma en 3/3 tras 2 turnos en mesa. |
| 15 | **Zarzas** | Hechizo | Común | 2 Gemas | — / — | Inflige 2 de daño y deja **Aturdido** al objetivo por 1 turno. |
| 16 | **Conejo Loco** | Criatura | Común | 2 Gemas | 2 / 1 | Puede atacar el mismo turno en que es invocado. |
| 17 | **Guerrero** | Criatura | Común | 2 Gemas | 1 / 1 | Al final de cada turno propio, gana +1 de Armadura de forma permanente. |
| 18 | **Elixir** | Hechizo | Común | 2 Gemas | — / — | Elige: otorga +2 de ataque O +2 de vida al objetivo. |
| 19 | **Domador de Slime** | Hechizo | Rara | 2 Gemas + 2 Cargas Mágicas | — / — | Elige: invocar 2 Slimes (1/1) en el campo O dar +2/+2 a un Slime aliado ya en mesa. |
| 20 | **Gólem de Chatarra** | Criatura | Común | 3 Gemas | 2 / 2 | Entra al campo con 2 de Armadura incluidos. |
| 21 | **Poción** | Hechizo | Común | 3 Gemas | — / — | Recupera 3 de vida al objetivo (criatura o héroe). |
| 22 | **Rosa Mortífera** | Criatura | Común | 3 Gemas | 0 / 2 | **Crecimiento:** se transforma en 3/2 al siguiente turno. Inflige +2 de daño extra a objetivos sin armadura. |
| 23 | **Lobo** | Criatura | Común | 3 Gemas | 3 / 2 | Sin efecto. |
| 24 | **Pócima de Ro** | Hechizo | Común | 3 Gemas | — / — | Elimina todos los estados negativos activos del objetivo (veneno, aturdimiento, incendio, petrificado u otros). |
| 25 | **Pócima de Locura** | Hechizo | Rara | 3 Gemas | — / — | El objetivo puede atacar 2 veces por turno durante los próximos 2 turnos. |
| 26 | **Luke** | Criatura | Épica | 4 Gemas | 2 / 2 | Esquiva el primer golpe recibido por turno rival. Inflige +1 de daño extra a objetivos sin armadura. |
| 27 | **Gran Lobo** | Criatura | Común | 4 Gemas | 4 / 3 | Sin efecto. |
| 28 | **Raneji** | Criatura | Rara | 4 Gemas | 1 / 4 | Cada vez que ataca, envenena al objetivo (2 de daño al final de su turno, dura 2 turnos). |
| 29 | **Gran Armadura** | Equipo | Común | 4 Gemas | — / — | Otorga 5 de Armadura a una criatura aliada. |
| 30 | **Katana** | Equipo | Común | 4 Gemas | — / — | Otorga +3 de daño Perforante al objetivo. Durabilidad: 2. |
| 31 | **Gran Slime** | Criatura | Común | 4 Gemas | 3 / 3 | Inmune a Veneno. |
| 32 | **Meteoro** | Hechizo | Rara | 4 Gemas + 3 Cargas Mágicas | — / — | Inflige 7 de daño a un objetivo. |
| 33 | **Sauce Golpeador** | Criatura | Común | 5 Gemas | 0 / 5 | **Crecimiento:** se transforma en 5/5 tras 2 turnos. Al final de cada turno golpea a un enemigo al azar. |
| 34 | **Poción Ácida** | Hechizo | Común | 5 Gemas | — / — | Destruye toda la armadura del objetivo al instante. |
| 35 | **Petrificar** | Hechizo | Rara | 5 Gemas | — / — | Aplica el estado **Petrificado** al objetivo (Atq pasa a 0, pierde todos sus efectos, conserva vida actual). |
| 36 | **Ninja** | Criatura | Épica | 6 Gemas | 3 / 2 | Al entrar: ataca inmediatamente. Si mata al objetivo, entra en **Oculto**. Si no lo mata, lo **Envenena** (3 de daño por 2 turnos). |
| 37 | **Carnicero** | Criatura | Común | 6 Gemas | 3 / 6 | Si tiene un arma equipada, puede atacar 2 veces por turno. |
| 38 | **Slamin** | Criatura | Común | 7 Gemas | 5 / 5 | Inmune a Veneno, Incendio y Aturdimiento. |
| 39 | **Escudero de la Guardia** | Criatura | Común | 1 Gema | 1 / 3 | **Provocar.** |
| 40 | **Rito del Nigromante** | Hechizo | Común | 3 Gemas | — / — | Revive la criatura aliada muerta más reciente que no haya sido consumida como combustible de cementerio. Si no hay ninguna elegible, la carta no puede jugarse. |
| 41 | **Stop** | Hechizo | Legendaria | 10 Gemas + 5 Cargas + 5 Vida | — / — | El rival pierde por completo su siguiente turno (solo puede pasar). |

---

## 6. ROADMAP MVP

| Fase | Contenido |
|---|---|
| **Fase 1** | Motor de combate base: campo de batalla, criaturas, turno, gemas, atacar, morir |
| **Fase 2** | Hechizos y equipos, cementerio, Provocar, Perforante |
| **Fase 3** | Cargas Mágicas, estados (Veneno, Incendio, Aturdido, Petrificado, Oculto) |
| **Fase 4** | Crecimiento/Evolución, Durabilidad de armas, Sacrificio de vida |
| **Fase 5** | IA básica (Taberna), mapa de exploración, tienda y sobres |