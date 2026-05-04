import { formatRating } from '../models/rating.model.js';

export function renderRatingModal(ratingData, onSubmit) {
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="nomination-detail">
            <h2 style="color: var(--color-primary); margin-bottom: 1rem;">Detalle de Nominación</h2>
            <div class="nomination-detail__player">
                <p>Cargando información del jugador...</p>
            </div>
            <hr style="border: none; border-top: 1px solid var(--color-border); margin: 1.5rem 0;">
            <h3>¿Mereció este puesto?</h3>
            <div class="star-rating" id="star-rating-widget">
                <span class="star-rating__star" data-value="1">☆</span>
                <span class="star-rating__star" data-value="2">☆</span>
                <span class="star-rating__star" data-value="3">☆</span>
                <span class="star-rating__star" data-value="4">☆</span>
                <span class="star-rating__star" data-value="5">☆</span>
            </div>
            <textarea id="rating-comment" class="form__textarea" placeholder="Opcional: Deja un comentario..."></textarea>
            <button id="btn-submit-rating" class="btn btn--primary" style="width: 100%; margin-top: 1rem;">Enviar calificación</button>

            <div id="rating-stats" style="margin-top: 1.5rem; color: var(--color-muted);">
                ${formatRating(ratingData.averageRating, ratingData.ratingCount)}
            </div>
        </div>
    `;

    setupStarRatingWidget(onSubmit);
    modalContainer.classList.remove('modal--hidden');
}

function setupStarRatingWidget(onSubmit) {
    const stars = document.querySelectorAll('.star-rating__star');
    const btnSubmit = document.getElementById('btn-submit-rating');
    const commentArea = document.getElementById('rating-comment');
    let selectedScore = 0;

    stars.forEach(star => {
        star.onmouseover = () => {
            const val = parseInt(star.dataset.value);
            highlightStars(val);
        };
        star.onmouseout = () => {
            highlightStars(selectedScore);
        };
        star.onclick = () => {
            selectedScore = parseInt(star.dataset.value);
            highlightStars(selectedScore);
        };
    });

    btnSubmit.onclick = async () => {
        if (selectedScore === 0) {
            return;
        }
        await onSubmit(selectedScore, commentArea.value);
        selectedScore = 0;
        highlightStars(0);
        commentArea.value = '';
    };
}

function highlightStars(score) {
    const stars = document.querySelectorAll('.star-rating__star');
    stars.forEach(star => {
        const val = parseInt(star.dataset.value);
        if (val <= score) {
            star.textContent = '★';
            star.style.color = 'var(--color-primary)';
        } else {
            star.textContent = '☆';
            star.style.color = 'var(--color-muted)';
        }
    });
}

export function updateRatingStats(averageRating, ratingCount) {
    const statsEl = document.getElementById('rating-stats');
    if (statsEl) {
        statsEl.innerHTML = formatRating(averageRating, ratingCount);
    }
}
