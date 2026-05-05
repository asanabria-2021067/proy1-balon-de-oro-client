import { getCountryStats, getCeremonies } from './core/api.js';

let ceremoniesCache = null;

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
          <div class="stat-row" style="cursor: pointer;" data-country="${c.country}">
            <div class="stat-rank">${i + 1}</div>
            <div class="stat-country">${c.country}</div>
            <div class="stat-bar-wrapper">
              <div class="stat-bar" style="width: ${(c.wins / maxWins) * 100}%"></div>
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

  container.querySelectorAll('.stat-row').forEach(row => {
    row.addEventListener('click', () => {
      const country = row.getAttribute('data-country');
      showCountryWinners(country);
    });
  });
}

async function showCountryWinners(country) {
  const modalContainer = document.getElementById('modal-container');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
    <div class="modal__header">
      <h2 class="modal__title">Ganadores de ${country}</h2>
      <p class="modal__subtitle">Histórico de Balón de Oro</p>
    </div>
    <div id="country-winners-list" class="winners-mini-grid">
      <p class="loading">Cargando...</p>
    </div>
  `;

  modalContainer.classList.remove('modal--hidden');

  const listContainer = document.getElementById('country-winners-list');

  try {
    // ✅ CACHE (solo 1 request en toda la app)
    if (!ceremoniesCache) {
      ceremoniesCache = await getCeremonies();
    }

    const ceremonies = ceremoniesCache;

    // ✅ FILTRAR GANADORES POR PAÍS (SIN MÁS REQUESTS)
    const winnersMap = {};

    ceremonies.forEach(c => {
      const winner = c.winner;

      if (!winner || winner.nationality !== country) return;

      if (!winnersMap[winner.id]) {
        winnersMap[winner.id] = {
          ...winner,
          years: [c.year]
        };
      } else {
        winnersMap[winner.id].years.push(c.year);
      }
    });

    const winners = Object.values(winnersMap);

    if (winners.length === 0) {
      listContainer.innerHTML =
        '<p class="empty-state">No se encontraron ganadores.</p>';
      return;
    }

    listContainer.innerHTML = `
      <div class="mini-players-grid">
        ${winners.map(p => `
          <div class="mini-player-card">
            <img 
              src="${p.photoUrl || 'assets/silhouette.svg'}" 
              alt="${p.name}" 
              class="mini-player-card__photo"
              onerror="this.src='assets/silhouette.svg'"
            >
            <div class="mini-player-card__info">
              <h4 class="mini-player-card__name">${p.name}</h4>
              <p class="mini-player-card__club">${p.club || 'N/A'}</p>
              <p class="mini-player-card__years">
                ${p.years.length} ${p.years.length === 1 ? 'vez' : 'veces'}
                (${p.years.sort((a, b) => a - b).join(', ')})
              </p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error(err);
    listContainer.innerHTML =
      '<p class="empty-state">Error al cargar ganadores.</p>';
  }
}