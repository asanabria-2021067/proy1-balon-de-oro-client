import { initCeremoniesView } from './controllers/ceremony.ctrl.js';
import { initPlayersView } from './controllers/player.ctrl.js';
import { initStatsView } from './stats.js';
import { exportToCSV, exportToExcel } from './utils/export.js';
import { setState } from './core/state.js';

document.addEventListener('DOMContentLoaded', () => {
    const navCeremonies = document.getElementById('nav-ceremonies');
    const navPlayers = document.getElementById('nav-players');
    const navStats = document.getElementById('nav-stats');
    const viewCeremonies = document.getElementById('view-ceremonies');
    const viewPlayers = document.getElementById('view-players');
    const viewStats = document.getElementById('stats-view');
    const logo = document.querySelector('.navbar__logo');
    const modalContainer = document.getElementById('modal-container');

    const switchToCeremonies = () => {
        navCeremonies.classList.add('navbar__link--active');
        navPlayers.classList.remove('navbar__link--active');
        navStats.classList.remove('navbar__link--active');
        viewCeremonies.classList.remove('view--hidden');
        viewPlayers.classList.add('view--hidden');
        viewStats.classList.add('view--hidden');
        setState('currentView', 'ceremonies');
        initCeremoniesView();
    };

    const switchToPlayers = () => {
        navPlayers.classList.add('navbar__link--active');
        navCeremonies.classList.remove('navbar__link--active');
        navStats.classList.remove('navbar__link--active');
        viewPlayers.classList.remove('view--hidden');
        viewCeremonies.classList.add('view--hidden');
        viewStats.classList.add('view--hidden');
        setState('currentView', 'players');
        initPlayersView();
    };

    const switchToStats = () => {
        navStats.classList.add('navbar__link--active');
        navCeremonies.classList.remove('navbar__link--active');
        navPlayers.classList.remove('navbar__link--active');
        viewStats.classList.remove('view--hidden');
        viewCeremonies.classList.add('view--hidden');
        viewPlayers.classList.add('view--hidden');
        setState('currentView', 'stats');
        initStatsView();
    };

    navCeremonies.onclick = switchToCeremonies;
    logo.onclick = switchToCeremonies;
    logo.style.cursor = 'pointer';

    navPlayers.onclick = switchToPlayers;
    navStats.onclick = switchToStats;

    document.getElementById('btn-export-csv').onclick = exportToCSV;
    document.getElementById('btn-export-excel').onclick = exportToExcel;

    document.getElementById('modal-close').onclick = () => {
        modalContainer.classList.add('modal--hidden');
    };

    modalContainer.onclick = (e) => {
        if (e.target === modalContainer || e.target.classList.contains('modal__backdrop')) {
            modalContainer.classList.add('modal--hidden');
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalContainer.classList.contains('modal--hidden')) {
            modalContainer.classList.add('modal--hidden');
        }
    });

    initCeremoniesView();
});
