import { getRankStyle, renderStarsString } from '../models/ceremony.model.js';

export function renderHero(ceremonyData) {
    const heroContainer = document.getElementById('hero-section');
    const { winner, year } = ceremonyData;

    heroContainer.style.backgroundImage = `url(${winner.photoUrl || 'assets/placeholder-hero.svg'})`;
    heroContainer.innerHTML = `
        <div class="hero__content">
            <span class="badge badge--fwd" style="margin-bottom: 1rem; display: inline-block;"> Balón de Oro ${year}</span>
            <h1 class="hero__title">${winner.name}</h1>
            <p class="hero__subtitle">${winner.club} | ${winner.nationality}</p>
        </div>
    `;
}

export function renderYearSelector(years, activeYear, onYearClick) {
    const yearTabsContainer = document.getElementById('year-selector');
    yearTabsContainer.innerHTML = '';

    years.forEach(year => {
        const tab = document.createElement('div');
        tab.className = `year-tabs__tab ${year === activeYear ? 'year-tabs__tab--active' : ''}`;
        tab.textContent = year;
        tab.onclick = () => onYearClick(year);
        yearTabsContainer.appendChild(tab);

        if (year === activeYear) {
            tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });
}

export function renderTop10Grid(nominations, onCardClick) {
    const gridContainer = document.getElementById('top-10-grid');
    gridContainer.innerHTML = '';

    if (nominations && nominations.length > 0) {
        nominations.sort((a, b) => a.rank - b.rank).forEach(nom => {
            const cardEl = document.createElement('div');
            cardEl.innerHTML = renderNominationCard(nom);
            cardEl.onclick = () => onCardClick(nom.nominationId);
            gridContainer.appendChild(cardEl.firstElementChild);
        });
    } else {
        showEmptyState('No hay nominaciones para este año.');
    }
}

export function renderNominationCard(nomination) {
    const { nominationId, rank, player, averageRating } = nomination;
    const rankStyle = getRankStyle(rank);

    return `
        <div class="card ${rankStyle.className}" style="cursor: pointer;">
            <div class="card__badge">${rankStyle.badge}</div>
            <div class="card__content">
                <img src="${player.photoUrl || 'assets/silhouette.svg'}" alt="${player.name}" class="card__photo" onerror="this.src='assets/silhouette.svg'">
                <h3 class="card__name">${player.name}</h3>
                <p class="card__info">${player.club} | ${player.nationality}</p>
                <span class="badge badge--${player.position.toLowerCase()}">${player.position}</span>
                <div class="card__rating">
                    ${renderStarsString(averageRating)} <span>${averageRating ? averageRating.toFixed(1) : '0.0'}</span>
                </div>
            </div>
        </div>
    `;
}

export function showEmptyState(message) {
    const gridContainer = document.getElementById('top-10-grid');
    gridContainer.innerHTML = `<p style="color: var(--color-muted); text-align: center; grid-column: 1 / -1; padding: 3rem;">${message}</p>`;
}

export function showErrorState() {
    const heroContainer = document.getElementById('hero-section');
    const gridContainer = document.getElementById('top-10-grid');

    heroContainer.innerHTML = '<div class="hero__content"><p style="color: var(--color-muted);">Error al cargar la ceremonia</p></div>';
    gridContainer.innerHTML = '<p style="color: var(--color-muted); text-align: center; grid-column: 1 / -1; padding: 3rem;">No se pudo cargar la información. Verifica tu conexión.</p>';
}
