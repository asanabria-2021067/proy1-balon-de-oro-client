import { getNominationRating, addRating } from '../core/api.js';
import { renderRatingModal as renderModal, updateRatingStats } from '../views/rating.view.js';
import { showToast } from '../views/toast.view.js';

export async function loadRating(nominationId) {
    try {
        const ratingData = await getNominationRating(nominationId);
        return ratingData;
    } catch (error) {
        showToast('Error al cargar detalle', 'error');
        throw error;
    }
}

export async function handleSubmitRating(nominationId, score, comment) {
    if (score === 0) {
        showToast('Por favor selecciona una puntuación', 'error');
        return;
    }

    try {
        await addRating(nominationId, { score, comment });
        showToast('¡Gracias por tu voto!', 'success');

        const updatedRating = await getNominationRating(nominationId);
        updateRatingStats(updatedRating.averageRating, updatedRating.ratingCount);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

export async function renderRatingModal(nominationId) {
    try {
        const ratingData = await loadRating(nominationId);

        renderModal(ratingData, async (score, comment) => {
            await handleSubmitRating(nominationId, score, comment);
        });
    } catch (error) {
        console.error('Error rendering rating modal:', error);
    }
}
