import { renderCeremonyView } from './ceremony.js';
import { renderPlayersView, openPlayerModal } from './player.js';
import { exportToCSV, exportToExcel } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCeremonyView(2024);

    const navCeremonies = document.getElementById('nav-ceremonies');
    const navPlayers = document.getElementById('nav-players');
    const viewCeremonies = document.getElementById('view-ceremonies');
    const viewPlayers = document.getElementById('view-players');

    navCeremonies.onclick = () => {
        navCeremonies.classList.add('navbar__link--active');
        navPlayers.classList.remove('navbar__link--active');
        viewCeremonies.classList.remove('view--hidden');
        viewPlayers.classList.add('view--hidden');
        renderCeremonyView(2024);
    };

    navPlayers.onclick = () => {
        navPlayers.classList.add('navbar__link--active');
        navCeremonies.classList.remove('navbar__link--active');
        viewPlayers.classList.remove('view--hidden');
        viewCeremonies.classList.add('view--hidden');
        renderPlayersView();
    };

    document.getElementById('btn-add-player').onclick = () => openPlayerModal();

    let debounceTimer;
    document.getElementById('player-search').oninput = (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            renderPlayersView(e.target.value);
        }, 300);
    };

    document.getElementById('btn-export-csv').onclick = exportToCSV;
    document.getElementById('btn-export-excel').onclick = exportToExcel;

    const modalContainer = document.getElementById('modal-container');
    document.getElementById('modal-close').onclick = () => {
        modalContainer.classList.add('modal--hidden');
    };
    modalContainer.onclick = (e) => {
        if (e.target === modalContainer || e.target.classList.contains('modal__backdrop')) {
            modalContainer.classList.add('modal--hidden');
        }
    };
});

export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
