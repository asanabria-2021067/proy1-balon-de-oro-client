import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } from '../core/api.js';
import { setState } from '../core/state.js';
import { transformPlayer } from '../models/player.model.js';
import { renderPlayerGrid, renderPlayerModal, showErrorState } from '../views/player.view.js';
import { showToast } from '../views/toast.view.js';

export async function loadPlayers(query = '') {
    try {
        const players = await getPlayers({ q: query });
        setState('players', players);
        setState('searchQuery', query);

        renderPlayerGrid(players, handleEdit, handleDelete);
    } catch (error) {
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
        const player = await getPlayerById(playerId);
        renderPlayerModal(player, async (formData) => {
            await handleUpdatePlayer(playerId, formData);
        });
    } catch (error) {
        showToast('Error al cargar jugador', 'error');
    }
}

export function handleDelete(playerId, playerName) {
    handleDeletePlayer(playerId, playerName);
}

export function openPlayerModal() {
    renderPlayerModal(null, async (formData) => {
        await handleCreatePlayer(formData);
    });
}

let debounceTimer;
export function handleSearch(query) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        loadPlayers(query);
    }, 300);
}

export function initPlayersView() {
    loadPlayers();
}

function closeModal() {
    document.getElementById('modal-container').classList.add('modal--hidden');
}
