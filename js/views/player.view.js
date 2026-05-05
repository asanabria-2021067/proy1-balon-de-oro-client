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
        <div class="modal__header">
            <h2 class="modal__title">${player ? 'Editar Jugador' : 'Agregar Jugador'}</h2>
            <p class="modal__subtitle">Completa los datos del jugador</p>
        </div>

        <form id="player-form" class="form">
            <div class="form__section">
                <h3 class="form__section-title">Información Básica</h3>
                <div class="form-grid-responsive">
                    <div class="form__group">
                        <label class="form__label">Nombre <span class="form__required">*</span></label>
                        <input type="text" name="name" class="form__input" placeholder="Ej: Lionel Messi" value="${player ? player.name : ''}" required>
                    </div>
                    <div class="form__group">
                        <label class="form__label">Nacionalidad <span class="form__required">*</span></label>
                        <input type="text" name="nationality" class="form__input" placeholder="Ej: Argentina" value="${player ? player.nationality : ''}" required>
                    </div>
                </div>

                <div class="form-grid-responsive">
                    <div class="form__group">
                        <label class="form__label">Club <span class="form__required">*</span></label>
                        <input type="text" name="club" class="form__input" placeholder="Ej: Inter Miami" value="${player ? player.club : ''}" required>
                    </div>
                    <div class="form__group">
                        <label class="form__label">Posición <span class="form__required">*</span></label>
                        <select name="position" class="form__select" required>
                            <option value="" disabled ${!player ? 'selected' : ''}>Seleccionar posición</option>
                            <option value="GK" ${player?.position === 'GK' ? 'selected' : ''}>Portero (GK)</option>
                            <option value="DEF" ${player?.position === 'DEF' ? 'selected' : ''}>Defensa (DEF)</option>
                            <option value="MID" ${player?.position === 'MID' ? 'selected' : ''}>Mediocampista (MID)</option>
                            <option value="FWD" ${player?.position === 'FWD' ? 'selected' : ''}>Delantero (FWD)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form__section">
                <h3 class="form__section-title">Fotografía</h3>
                <div class="form__group">
                    <label class="form__label">URL de la foto</label>
                    <input type="text" name="photoUrl" class="form__input" placeholder="https://ejemplo.com/foto.jpg" value="${player?.photoUrl || ''}">
                </div>
                <div class="form__divider">
                    <span>o</span>
                </div>
                <div class="form__group">
                    <label class="form__label">Subir archivo</label>
                    <div class="file-input-wrapper">
                        <input type="file" name="photo" class="file-input" accept="image/*" id="photo-input">
                        <label for="photo-input" class="file-input-label">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <span>Seleccionar imagen</span>
                        </label>
                    </div>
                </div>
                <div id="photo-preview" class="form__preview">
                    ${player?.photoUrl ? `<img src="${player.photoUrl}" class="preview-image" onerror="this.src='assets/silhouette.svg'">` : ''}
                </div>
            </div>

            <div class="form__section form__section--nomination">
                <div class="nomination-header">
                    <h3 class="form__section-title">Asignar Nominación</h3>
                </div>
                <p class="nomination-description">Opcional: agrega al jugador a una ceremonia del Balón de Oro</p>

                <div class="form-grid-responsive">
                    <div class="form__group">
                        <label class="form__label">Año de ceremonia</label>
                        <select name="nominationYear" class="form__select">
                            <option value="">Sin nominación</option>
                            ${years.map(y => `<option value="${y}">${y}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form__group">
                        <label class="form__label">Puesto en ranking</label>
                        <input type="number" name="nominationRank" class="form__input" placeholder="1-10" min="1" max="10">
                    </div>
                </div>
                <div class="nomination-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Si el jugador ya existe en ese año, se actualizará su posición</span>
                </div>
            </div>

            ${player?.nominations && player.nominations.length > 0 ? `
                <div class="form__section form__section--current-nominations">
                    <h3 class="form__section-title">Nominaciones Actuales</h3>
                    <div class="nominations-list">
                        ${player.nominations.map(n => `
                            <span class="nomination-badge">
                                <span class="nomination-badge__year">${n.year}</span>
                                <span class="nomination-badge__rank">#${n.rank}</span>
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <button type="submit" class="btn btn--primary btn--submit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                ${player ? 'Actualizar Jugador' : 'Guardar Jugador'}
            </button>
        </form>
    `;

    const form = document.getElementById('player-form');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    const fileLabel = document.querySelector('.file-input-label span');

    photoInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            fileLabel.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (re) => {
                photoPreview.innerHTML = `<img src="${re.target.result}" class="preview-image">`;
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
