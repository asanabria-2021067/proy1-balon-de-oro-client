import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, getCeremonies } from '../core/api.js';
import { setState, getState } from '../core/state.js';
import { renderPlayerGrid, renderPlayerModal, renderPagination, showErrorState } from '../views/player.view.js';
import { showToast } from '../views/toast.view.js';
import { loadCeremony } from './ceremony.ctrl.js';

const pagination = { page: 1, limit: 12, total: 0, totalPages: 0 };
let searchQuery = '';
let sortBy = '';
let availableCeremonies = [];
let allPlayers = [];
let playerWins = {};

async function loadPlayerWins() {
    if (Object.keys(playerWins).length > 0) return;

    try {
        const ceremonies = await getCeremonies();
        ceremonies.forEach(c => {
            if (c.winner && c.winner.id) {
                playerWins[c.winner.id] = (playerWins[c.winner.id] || 0) + 1;
            }
        });
    } catch (err) {
        console.error('Error loading player wins:', err);
    }
}

function sortPlayers(players) {
    const sorted = [...players];

    switch (sortBy) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'wins-desc':
            return sorted.sort((a, b) => {
                const winsA = playerWins[a.id] || 0;
                const winsB = playerWins[b.id] || 0;
                return winsB - winsA;
            });
        default:
            return sorted;
    }
}

export async function loadPlayers(query = searchQuery) {
    searchQuery = query;
    try {
        if (allPlayers.length === 0) {
            const response = await getPlayers({ limit: 10000 });
            allPlayers = response.players || [];
        }

        if (sortBy === 'wins-desc' && Object.keys(playerWins).length === 0) {
            await loadPlayerWins();
        }

        let filtered = searchQuery
            ? allPlayers.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.position.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : allPlayers;

        filtered = sortPlayers(filtered);

        pagination.total = filtered.length;
        pagination.totalPages = Math.ceil(filtered.length / pagination.limit);

        const start = (pagination.page - 1) * pagination.limit;
        const end = start + pagination.limit;
        const players = filtered.slice(start, end);

        setState('players', players);
        setState('searchQuery', searchQuery);

        renderPlayerGrid(players, handleEdit, handleDelete);
        renderPagination(
            pagination,
            (newPage) => {
                pagination.page = newPage;
                loadPlayers();
            },
            (newLimit) => {
                pagination.limit = newLimit;
                pagination.page = 1;
                loadPlayers();
            }
        );
    } catch (error) {
        console.error(error);
        showToast('Error al cargar jugadores', 'error');
        showErrorState();
    }
}

export async function handleCreatePlayer(formData) {
    try {
        await createPlayer(formData);
        showToast('Jugador creado con éxito', 'success');
        closeModal();
        allPlayers = [];
        loadPlayers();

        const state = getState();
        if (state.currentView === 'ceremonies' && state.selectedYear) {
            await loadCeremony(state.selectedYear);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

export async function handleUpdatePlayer(id, formData) {
    try {
        await updatePlayer(id, formData);
        showToast('Jugador actualizado con éxito', 'success');
        closeModal();
        allPlayers = [];
        loadPlayers();

        const state = getState();
        if (state.currentView === 'ceremonies' && state.selectedYear) {
            await loadCeremony(state.selectedYear);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

export async function handleDeletePlayer(id, name) {
    if (confirm(`¿Estás seguro de eliminar a ${name}?`)) {
        try {
            await deletePlayer(id);
            showToast('Jugador eliminado', 'success');
            allPlayers = [];
            loadPlayers();
        } catch (error) {
            showToast('Error al eliminar jugador', 'error');
        }
    }
}

export async function handleEdit(playerId) {
    try {
        if (availableCeremonies.length === 0) {
            availableCeremonies = await getCeremonies();
        }
        const player = await getPlayerById(playerId);
        renderPlayerModal(player, availableCeremonies, async (formData) => {
            await handleUpdatePlayer(playerId, formData);
        });
    } catch (error) {
        showToast('Error al cargar jugador', 'error');
    }
}

export function handleDelete(playerId, playerName) {
    handleDeletePlayer(playerId, playerName);
}

export async function openPlayerModal() {
    try {
        if (availableCeremonies.length === 0) {
            availableCeremonies = await getCeremonies();
        }
        renderPlayerModal(null, availableCeremonies, async (formData) => {
            await handleCreatePlayer(formData);
        });
    } catch (error) {
        showToast('Error al preparar el formulario', 'error');
    }
}

let debounceTimer;
export function handleSearch(query) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        pagination.page = 1;
        loadPlayers(query);
    }, 300);
}

export function handleSort(value) {
    sortBy = value;
    pagination.page = 1;
    loadPlayers();
}

export function initPlayersView() {
    const searchInput = document.getElementById('player-search');
    if (searchInput) {
        searchInput.oninput = (e) => handleSearch(e.target.value);
    }

    const sortSelect = document.getElementById('player-sort');
    if (sortSelect) {
        sortSelect.onchange = (e) => handleSort(e.target.value);
    }

    const addBtn = document.getElementById('btn-add-player');
    if (addBtn) {
        addBtn.onclick = () => openPlayerModal();
    }

    loadPlayers();
}

function closeModal() {
    const modal = document.getElementById('modal-container');
    if (modal) {
        modal.classList.add('modal--hidden');
    }
}
