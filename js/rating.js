import { addRating, getNominationRating } from './api.js';
import { showToast } from './app.js';

export async function renderNominationModal(nominationId) {
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');

    try {
        const ratingData = await getNominationRating(nominationId);
        
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
                
                <div style="margin-top: 1.5rem; color: var(--color-muted);">
                    Promedio actual: <span id="avg-rating">${ratingData.averageRating ? ratingData.averageRating.toFixed(1) : '0.0'}</span> ★ 
                    (${ratingData.ratingCount || 0} votos)
                </div>
            </div>
        `;

        setupStarRatingWidget(nominationId);
        modalContainer.classList.remove('modal--hidden');

    } catch (error) {
        showToast('Error al cargar detalle', 'error');
    }
}

function setupStarRatingWidget(nominationId) {
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
            showToast('Por favor selecciona una puntuación', 'error');
            return;
        }
        try {
            await addRating(nominationId, { score: selectedScore, comment: commentArea.value });
            showToast('¡Gracias por tu voto!', 'success');
            document.getElementById('modal-container').classList.add('modal--hidden');
        } catch (error) {
            showToast(error.message, 'error');
        }
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
