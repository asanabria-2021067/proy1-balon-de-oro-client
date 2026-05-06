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
  const totalWins = countries.reduce((acc, c) => acc + c.wins, 0);

  container.innerHTML = `
    <div class="container">
      <div class="stats-header">
        <h2 class="stats-title">Estadísticas Globales</h2>
        <p class="stats-subtitle">Análisis detallado de los premios Balón de Oro por nacionalidad desde 1956.</p>
      </div>

      <div class="stats-ranking-container">
        <div class="ranking-header">
          <h3 class="ranking-title">
            Ranking de Nacionalidades
          </h3>
        </div>
        
        <div class="stats-grid">
          ${countries.map((c, i) => `
            <div class="stat-row" data-country="${c.country}">
              <div class="stat-rank">${i + 1}</div>
              <div class="stat-country">${c.country}</div>
              <div class="stat-bar-wrapper">
                <div class="stat-bar" style="width: ${(c.wins / maxWins) * 100}%"></div>
              </div>
              <div class="stat-wins">
                ${c.wins} ${c.wins === 1 ? 'Balón de Oro' : 'Balones de Oro'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-top: 3rem; text-align: center; color: var(--color-muted); font-size: 0.85rem; padding-bottom: 3rem;">
        * Haz clic en cualquier país para ver su lista detallada de ganadores.
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
    if (!ceremoniesCache) {
      ceremoniesCache = await getCeremonies();
    }

    const ceremonies = ceremoniesCache;

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
                ${p.years.length} ${p.years.length === 1 ? 'Balón de Oro' : 'Balones de Oro'} - ${p.years.sort((a, b) => a - b).join(', ')}
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