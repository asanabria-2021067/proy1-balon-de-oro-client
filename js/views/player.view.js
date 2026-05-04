export function renderPlayerGrid(players, onEdit, onDelete) {
    const gridContainer = document.getElementById('players-grid');
    gridContainer.innerHTML = '';

    if (players && players.length > 0) {
        players.forEach(player => {
            const cardEl = document.createElement('div');
            cardEl.innerHTML = renderPlayerCard(player);
            const card = cardEl.firstElementChild;

            card.querySelector('.btn--edit').onclick = (e) => {
                e.stopPropagation();
                onEdit(player.id);
            };

            card.querySelector('.btn--delete').onclick = (e) => {
                e.stopPropagation();
                onDelete(player.id, player.name);
            };

            gridContainer.appendChild(card);
        });
    } else {
        showEmptyState('No se encontraron jugadores.');
    }
}

export function renderPlayerCard(player) {
    return `
        <div class="card">
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
        </div>
    `;
}

export function renderPlayerModal(player, onSubmit) {
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2 style="margin-bottom: 1.5rem; color: var(--color-primary);">${player ? 'Editar Jugador' : 'Agregar Jugador'}</h2>
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
        await onSubmit(formData);
    };

    modalContainer.classList.remove('modal--hidden');
}

export function showEmptyState(message) {
    const gridContainer = document.getElementById('players-grid');
    gridContainer.innerHTML = `<p style="color: var(--color-muted); text-align: center; grid-column: 1 / -1; padding: 3rem;">${message}</p>`;
}

export function showErrorState() {
    const gridContainer = document.getElementById('players-grid');
    gridContainer.innerHTML = '<p style="color: var(--color-muted); text-align: center; grid-column: 1 / -1; padding: 3rem;">Error al cargar jugadores. Verifica tu conexión.</p>';
}
