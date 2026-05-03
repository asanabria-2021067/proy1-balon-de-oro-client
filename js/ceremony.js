import { getCeremonyByYear } from './api.js';
import { renderNominationModal } from './rating.js';

export async function renderCeremonyView(year) {
    const heroContainer = document.getElementById('hero-section');
    const gridContainer = document.getElementById('top-10-grid');

    try {
        const data = await getCeremonyByYear(year);
        const { winner, nominations } = data;

        heroContainer.style.backgroundImage = `url(${winner.photoUrl || 'assets/placeholder-hero.jpg'})`;
        heroContainer.innerHTML = `
            <div class="hero__content">
                <span class="badge badge--fwd" style="margin-bottom: 1rem; display: inline-block;">👑 Balón de Oro ${year}</span>
                <h1 class="hero__title">${winner.name}</h1>
                <p class="hero__subtitle">${winner.club} | ${winner.nationality}</p>
            </div>
        `;

        renderYearSelector(year);

        gridContainer.innerHTML = '';
        nominations.sort((a, b) => a.rank - b.rank).forEach(nom => {
            const card = createNominationCard(nom);
            gridContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error rendering ceremony view:', error);
    }
}

function renderYearSelector(activeYear) {
    const yearTabsContainer = document.getElementById('year-selector');
    const years = [];
    for (let y = 1998; y <= 2025; y++) {
        if (y !== 2020) years.push(y);
    }

    yearTabsContainer.innerHTML = '';
    years.forEach(year => {
        const tab = document.createElement('div');
        tab.className = `year-tabs__tab ${year === activeYear ? 'year-tabs__tab--active' : ''}`;
        tab.textContent = year;
        tab.onclick = () => renderCeremonyView(year);
        yearTabsContainer.appendChild(tab);
        
        if (year === activeYear) {
            tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });
}

function createNominationCard(nom) {
    const { nominationId, rank, player, averageRating } = nom;
    const card = document.createElement('div');
    card.className = `card card--rank-${rank > 3 ? 'standard' : rank}`;

    card.innerHTML = `
        <div class="card__badge">#${rank}</div>
        <div class="card__content">
            <img src="${player.photoUrl || 'assets/silhouette.svg'}" alt="${player.name}" class="card__photo">
            <h3 class="card__name">${player.name}</h3>
            <p class="card__info">${player.club} | ${player.nationality}</p>
            <span class="badge badge--${player.position.toLowerCase()}">${player.position}</span>
            <div class="card__rating">
                ${renderStars(averageRating)} <span>${averageRating ? averageRating.toFixed(1) : '0.0'}</span>
            </div>
        </div>
    `;

    card.onclick = () => renderNominationModal(nominationId);
    return card;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating || 0);
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += i <= fullStars ? '★' : '☆';
    }
    return starsHtml;
}
