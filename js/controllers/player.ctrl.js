import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, getCeremonies } from '../core/api.js';
import { setState, getState } from '../core/state.js';
import { renderPlayerGrid, renderPlayerModal, renderPagination, showErrorState } from '../views/player.view.js';
import { showToast } from '../views/toast.view.js';
import { loadCeremony } from './ceremony.ctrl.js';

const pagination = { page: 1, limit: 12, total: 0, totalPages: 0 };
let searchQuery = '';
let availableCeremonies = [];

export async function loadPlayers(query = searchQuery) {
    searchQuery = query;
    try {
        const response = await getPlayers({
            q: searchQuery,
            nationality: searchQuery,
            page: pagination.page,
            limit: pagination.limit
        });

        const players = response.players || [];
        pagination.total = response.total || 0;
        pagination.totalPages = response.totalPages || 1;

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

export function initPlayersView() {
    // Escuchar búsqueda
    const searchInput = document.getElementById('player-search');
    if (searchInput) {
        searchInput.oninput = (e) => handleSearch(e.target.value);
    }

    // Botón agregar
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
