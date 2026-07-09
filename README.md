# Guild of Cards

> Juego de cartas por turnos de fantasía, desarrollado en JavaScript vanilla.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Tech](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)

---

## 🎮 ¿Qué es?

Guild of Cards es un juego de cartas por turnos inspirado en Hearthstone y Slay the Spire. El jugador construye un mazo, invoca criaturas en un tablero, lanza hechizos y combate contra enemigos controlados por IA.

El proyecto está siendo construido desde cero como proyecto personal, priorizando la profundidad de mecánicas sobre la complejidad gráfica.

---

## 🚀 Cómo jugarlo

### Opción 1 — Servidor local (recomendado para desarrollo)
```bash
npx serve src
```
Luego abre `http://localhost:3000` en el navegador.

### Opción 2 — Abrir directo
Abre `src/index.html` en cualquier navegador moderno.

---

## ⚔️ Mecánicas implementadas

- **Sistema de gemas** que crece +1 por turno (como el maná de Hearthstone)
- **Cargas Mágicas** como recurso secundario generado por el Orbe Mágico
- **Sacrificio de vida** como costo adicional para cartas especiales
- **Combustible de cementerio** para invocar criaturas que requieren cartas descartadas
- **Campo de batalla** con hasta 6 criaturas por lado
- **Sistema de armadura** que absorbe daño antes de la vida
- **Keywords:** Provocar, Perforante, Oculto, Aturdido, Veneno, Incendio, Petrificado, Crecimiento, Rush
- **Equipamiento:** armas con durabilidad y armaduras
- **IA básica** del enemigo con intención visible
- **Cementerio** con mecánicas de resurrección y combustible

---

## 🃏 Base de cartas

41 cartas diseñadas, clasificadas por:

| Formato | Cantidad |
|---|---|
| Criaturas | 24 |
| Hechizos | 13 |
| Equipos (armas y armaduras) | 6 |

| Rareza | Cantidad |
|---|---|
| Común | 35 |
| Rara | 5 |
| Épica | 2 |
| Legendaria | 1 |

---

## 🗺️ Modos de juego (roadmap)

- [x] Motor de combate base
- [x] Invocar criaturas y atacar
- [x] Turno del enemigo con IA básica
- [ ] Hechizos y equipos con targeting completo
- [ ] Estados (veneno, incendio, aturdido, petrificado)
- [ ] Mapa de exploración con jefes
- [ ] Taberna con mazos de IA variados
- [ ] Tienda con sobres de cartas
- [ ] Guardado de progreso con localStorage

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| Lenguaje | JavaScript ES6+ |
| Interfaz | HTML5 + CSS3 |
| Lógica | JavaScript puro (sin frameworks) |
| Guardado | localStorage (próximamente) |
| Hosting | GitHub Pages (próximamente) |

---

## 📁 Estructura del proyecto

```
Card-Game/
├── docs/
│   ├── gdd.md            # Documento de diseño del juego
│   └── architecture.md   # Arquitectura técnica
├── src/
│   ├── index.html        # Estructura principal
│   ├── style.css         # Estilos
│   ├── main.js           # Navegación y renderizado
│   ├── cards.js          # Base de datos de las 41 cartas
│   ├── combat.js         # Motor de combate
│   └── enemies.js        # Definición de enemigos
└── README.md
```

---

## 👤 Autor

**Sebastián** — Estudiante de Ingeniería en Informática, mención en programacion DUOC UC.

Proyecto personal desarrollado fuera del contexto universitario como práctica de diseño de sistemas, arquitectura de software y desarrollo frontend.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.