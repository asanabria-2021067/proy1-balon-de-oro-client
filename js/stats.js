import { getCountryStats } from './core/api.js';

export function initStatsView() {
  loadStats();
}

async function loadStats() {
  const container = document.getElementById('stats-view');
  container.innerHTML = '<p class="loading">Cargando estadísticas...</p>';
  try {
    const data = await getCountryStats();
    renderStats(data);
  } catch (err) {
    container.innerHTML =
      '<p class="empty-state">Error al cargar estadísticas.</p>';
  }
}

function renderStats(countries) {
  const container = document.getElementById('stats-view');
  const maxWins = countries[0]?.wins || 1;

  container.innerHTML = `
    <div class="container">
      <div class="stats-header" style="margin-bottom: 2rem; margin-top: 2rem;">
        <h2 class="stats-title">Países con más Balones de Oro</h2>
        <p class="stats-subtitle">Histórico 1956 – 2025</p>
      </div>
      <div class="stats-grid">
        ${countries.map((c, i) => `
          <div class="stat-row">
            <div class="stat-rank">${i + 1}</div>
            <div class="stat-country">${c.country}</div>
            <div class="stat-bar-wrapper">
              <div class="stat-bar"
                style="width: ${(c.wins / maxWins) * 100}%">
              </div>
            </div>
            <div class="stat-wins">
              ${c.wins} ${c.wins === 1 ? 'victoria' : 'victorias'}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="stats-cards" style="padding-bottom: 3rem;">
        <div class="stat-card">
          <span class="stat-card-number">${countries.length}</span>
          <span class="stat-card-label">Países distintos</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-number">${countries[0]?.country || '-'}</span>
          <span class="stat-card-label">País dominante</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-number">${countries[0]?.wins || 0}</span>
          <span class="stat-card-label">Máximo de victorias</span>
        </div>
      </div>
    </div>
  `;
}
