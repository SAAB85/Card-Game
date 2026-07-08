// ===========================
// NAVEGACIÓN ENTRE PANTALLAS
// ===========================

function showScreen(screenId) {
  // Oculta todas las pantallas
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  // Muestra la pantalla solicitada
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
// INICIALIZACIÓN
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  updateGoldDisplay();
});