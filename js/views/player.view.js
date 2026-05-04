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
                <img src="${player.photoUrl || 'assets/silhouette.svg'}" alt="${player.name}" class="card__photo" onerror="this.src='assets/silhouette.svg'">
                <h3 class="card__name">${player.name}</h3>
                <p class="card__info">${player.club} | ${player.nationality}</p>
                <span class="badge badge--${player.position.toLowerCase()}">${player.position}</span>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn--edit" title="Editar">Editar</button>
                    <button class="btn btn--delete" title="Eliminar">Eliminar</button>
                </div>
            </div>
        </div>
    `;
}

export function renderPlayerModal(player, ceremonies, onSubmit) {
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');

    const years = ceremonies ? ceremonies.map(c => c.year).sort((a, b) => b - a) : [];

    modalBody.innerHTML = `
        <h2 style="margin-bottom: 1.5rem; color: var(--color-primary);">${player ? 'Editar Jugador' : 'Agregar Jugador'}</h2>
        <form id="player-form" class="form">
            <div class="form-grid-responsive">
                <div class="form__group">
                    <label class="form__label">Nombre</label>
                    <input type="text" name="name" class="form__input" value="${player ? player.name : ''}" required>
                </div>
                <div class="form__group">
                    <label class="form__label">Nacionalidad</label>
                    <input type="text" name="nationality" class="form__input" value="${player ? player.nationality : ''}" required>
                </div>
            </div>

            <div class="form-grid-responsive">
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
            </div>

            <div class="form__group">
                <label class="form__label">Foto (URL o Archivo)</label>
                <input type="text" name="photoUrl" class="form__input" placeholder="https://..." value="${player?.photoUrl || ''}" style="margin-bottom: 10px;">
                <input type="file" name="photo" class="form__input" accept="image/*" id="photo-input">
                <div id="photo-preview" class="form__preview">
                    ${player?.photoUrl ? `<img src="${player.photoUrl}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" onerror="this.src='assets/silhouette.svg'">` : ''}
                </div>
            </div>

            <div style="background: rgba(245, 197, 24, 0.05); padding: 15px; border-radius: 8px; border: 1px dashed var(--color-primary); margin-top: 10px;">
                <h3 style="font-size: 0.9rem; color: var(--color-primary); margin-bottom: 10px;">Asignar Nominación</h3>
                <div class="form-grid-responsive">
                    <div class="form__group" style="margin-bottom: 0;">
                        <label class="form__label">Año</label>
                        <select name="nominationYear" class="form__select">
                            <option value="">-- No asignar --</option>
                            ${years.map(y => `<option value="${y}">${y}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form__group" style="margin-bottom: 0;">
                        <label class="form__label">Puesto (1-10)</label>
                        <input type="number" name="nominationRank" class="form__input" min="1" max="10">
                    </div>
                </div>
                <p style="font-size: 0.75rem; color: var(--color-muted); margin-top: 8px;">* Si el jugador ya está en este año, se actualizará su puesto. Si el puesto está ocupado por otro, verás un error.</p>
            </div>

            ${player?.nominations && player.nominations.length > 0 ? `
                <div style="margin-top: 15px;">
                    <h3 style="font-size: 0.9rem; color: var(--color-muted); margin-bottom: 10px;">Nominaciones Actuales</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${player.nominations.map(n => `
                            <span class="badge" style="background: var(--bg-card); border: 1px solid var(--color-border);">
                                ${n.year}: #${n.rank}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <button type="submit" class="btn btn--primary" style="width: 100%; margin-top: 1.5rem;">Guardar Jugador</button>
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
                photoPreview.innerHTML = `<img src="${re.target.result}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">`;
            };
            reader.readAsDataURL(file);
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        // Si no hay año seleccionado, borrar los campos de nominación del formData
        if (!formData.get('nominationYear')) {
            formData.delete('nominationYear');
            formData.delete('nominationRank');
        }
        await onSubmit(formData);
    };

    modalContainer.classList.remove('modal--hidden');
}

export function renderPagination(pagination, onPageChange, onLimitChange) {
    const container = document.getElementById('players-pagination');
    if (!container) return;

    const { page, limit, total, totalPages } = pagination;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    let paginationHtml = `
        <div class="pagination-container" style="display: flex; flex-direction: column; align-items: center; gap: 15px; margin-top: 2rem;">
            <div class="pagination-info-text" style="color: var(--color-muted); font-size: 0.9rem;">
                Mostrando <span style="color: var(--color-text); font-weight: 600;">${total > 0 ? start : 0}-${end}</span> de <span style="color: var(--color-text); font-weight: 600;">${total}</span> jugadores
            </div>
            
            <div class="pagination" style="display: flex; align-items: center; gap: 8px;">
                <button class="pagination-btn" ${page <= 1 ? 'disabled' : ''} data-page="${page - 1}">
                    &larr; Anterior
                </button>
    `;

    // Lógica para mostrar números de página
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHtml += `<button class="pagination-btn" data-page="1">1</button>`;
        if (startPage > 2) paginationHtml += `<span style="color: var(--color-muted)">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <button class="pagination-btn ${i === page ? 'pagination-btn--active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHtml += `<span style="color: var(--color-muted)">...</span>`;
        paginationHtml += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    paginationHtml += `
                <button class="pagination-btn" ${page >= totalPages ? 'disabled' : ''} data-page="${page + 1}">
                    Siguiente &rarr;
                </button>
            </div>

            <div class="pagination-limit" style="display: flex; align-items: center; gap: 10px;">
                <label style="color: var(--color-muted); font-size: 0.85rem;">Jugadores por página:</label>
                <select class="form__select" id="page-limit-select" style="width: auto; padding: 4px 10px; font-size: 0.85rem;">
                    ${[12, 25, 50, 100].map(l => `<option value="${l}" ${l === limit ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
            </div>
        </div>
    `;

    container.innerHTML = paginationHtml;

    container.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.onclick = () => {
            const newPage = parseInt(btn.dataset.page);
            if (newPage && newPage !== page) {
                onPageChange(newPage);
            }
        };
    });

    const limitSelect = document.getElementById('page-limit-select');
    if (limitSelect) {
        limitSelect.onchange = (e) => {
            onLimitChange(parseInt(e.target.value));
        };
    }
}

export function showEmptyState(message) {
    const gridContainer = document.getElementById('players-grid');
    gridContainer.innerHTML = `<p style="color: var(--color-muted); text-align: center; grid-column: 1 / -1; padding: 3rem;">${message}</p>`;
}

export function showErrorState() {
    const gridContainer = document.getElementById('players-grid');
    gridContainer.innerHTML = '<p style="color: var(--color-muted); text-align: center; grid-column: 1 / -1; padding: 3rem;">Error al cargar jugadores. Verifica tu conexión.</p>';
}
