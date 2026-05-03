import { getPlayers, createPlayer, updatePlayer, deletePlayer, getPlayerById } from './api.js';
import { showToast } from './app.js';

export async function renderPlayersView(query = '') {
    const gridContainer = document.getElementById('players-grid');
    try {
        const players = await getPlayers({ q: query });
        gridContainer.innerHTML = '';
        players.forEach(player => {
            const card = createPlayerCard(player);
            gridContainer.appendChild(card);
        });
    } catch (error) {
        showToast('Error al cargar jugadores', 'error');
    }
}

function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card__content">
            <img src="${player.photoUrl || 'assets/silhouette.svg'}" alt="${player.name}" class="card__photo">
            <h3 class="card__name">${player.name}</h3>
            <p class="card__info">${player.club} | ${player.nationality}</p>
            <span class="badge badge--${player.position.toLowerCase()}">${player.position}</span>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn btn--edit" title="Editar">✏️</button>
                <button class="btn btn--delete" title="Eliminar">🗑️</button>
            </div>
        </div>
    `;

    card.querySelector('.btn--edit').onclick = (e) => {
        e.stopPropagation();
        openPlayerModal(player.id);
    };

    card.querySelector('.btn--delete').onclick = (e) => {
        e.stopPropagation();
        confirmDeletePlayer(player.id, player.name);
    };

    return card;
}

export async function openPlayerModal(playerId = null) {
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    let player = null;

    if (playerId) {
        player = await getPlayerById(playerId);
    }

    modalBody.innerHTML = `
        <h2 style="margin-bottom: 1.5rem; color: var(--color-primary);">${playerId ? 'Editar Jugador' : 'Agregar Jugador'}</h2>
        <form id="player-form" class="form">
            <div class="form__group">
                <label class="form__label">Nombre</label>
                <input type="text" name="name" class="form__input" value="${player ? player.name : ''}" required>
            </div>
            <div class="form__group">
                <label class="form__label">Nacionalidad</label>
                <input type="text" name="nationality" class="form__input" value="${player ? player.nationality : ''}" required>
            </div>
            <div class="form__group">
                <label class="form__label">Club</label>
                <input type="text" name="club" class="form__input" value="${player ? player.club : ''}" required>
            </div>
            <div class="form__group">
                <label class="form__label">Posición</label>
                <select name="position" class="form__select" required>
                    <option value="GK" ${player?.position === 'GK' ? 'selected' : ''}>GK</option>
                    <option value="DEF" ${player?.position === 'DEF' ? 'selected' : ''}>DEF</option>
                    <option value="MID" ${player?.position === 'MID' ? 'selected' : ''}>MID</option>
                    <option value="FWD" ${player?.position === 'FWD' ? 'selected' : ''}>FWD</option>
                </select>
            </div>
            <div class="form__group">
                <label class="form__label">Foto</label>
                <input type="file" name="photo" class="form__input" accept="image/*" id="photo-input">
                <div id="photo-preview" class="form__preview">
                    ${player?.photoUrl ? `<img src="${player.photoUrl}" style="width: 100px; border-radius: 50%;">` : ''}
                </div>
            </div>
            <button type="submit" class="btn btn--primary" style="width: 100%; margin-top: 1rem;">Guardar</button>
        </form>
    `;

    const form = document.getElementById('player-form');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');

    photoInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
                photoPreview.innerHTML = `<img src="${re.target.result}" style="width: 100px; border-radius: 50%;">`;
            };
            reader.readAsDataURL(file);
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
            if (playerId) {
                await updatePlayer(playerId, formData);
                showToast('Jugador actualizado con éxito', 'success');
            } else {
                await createPlayer(formData);
                showToast('Jugador creado con éxito', 'success');
            }
            modalContainer.classList.add('modal--hidden');
            renderPlayersView();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    modalContainer.classList.remove('modal--hidden');
}

async function confirmDeletePlayer(id, name) {
    if (confirm(`¿Estás seguro de eliminar a ${name}?`)) {
        try {
            await deletePlayer(id);
            showToast('Jugador eliminado', 'success');
            renderPlayersView();
        } catch (error) {
            showToast('Error al eliminar jugador', 'error');
        }
    }
}
