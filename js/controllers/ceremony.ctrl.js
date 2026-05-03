import { getCeremonyByYear } from '../core/api.js';
import { setState, getState } from '../core/state.js';
import { transformCeremony, generateYearRange } from '../models/ceremony.model.js';
import { renderHero, renderYearSelector, renderTop10Grid, showErrorState } from '../views/ceremony.view.js';
import { renderRatingModal } from '../controllers/rating.ctrl.js';

export async function loadCeremony(year) {
    try {
        const data = await getCeremonyByYear(year);
        const ceremony = transformCeremony(data);

        setState('selectedYear', year);
        setState('currentCeremony', ceremony);

        renderHero(ceremony);
        renderTop10Grid(ceremony.nominations, handleCardClick);

    } catch (error) {
        console.error('Error loading ceremony:', error);
        showErrorState();
    }
}

export function handleYearChange(year) {
    loadCeremony(year);
}

export function handleCardClick(nominationId) {
    renderRatingModal(nominationId);
}

export function initCeremoniesView() {
    const years = generateYearRange();
    const selectedYear = getState().selectedYear;

    renderYearSelector(years, selectedYear, handleYearChange);
    loadCeremony(selectedYear);
}
