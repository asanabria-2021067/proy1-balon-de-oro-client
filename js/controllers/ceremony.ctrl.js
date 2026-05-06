import { getCeremonyByYear, getCeremonies } from '../core/api.js';
import { setState, getState } from '../core/state.js';
import { transformCeremony } from '../models/ceremony.model.js';
import { renderHero, renderYearSelector, renderTop10Grid, showErrorState } from '../views/ceremony.view.js';

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

export async function handleYearChange(year) {
    setState('selectedYear', year);
    const availableYears = getState().availableYears || [];
    renderYearSelector(availableYears, year, handleYearChange);
    await loadCeremony(year);
}

export function handleCardClick(nominationId) {
}

export async function initCeremoniesView() {
    try {
        const ceremonies = await getCeremonies();
        const years = ceremonies
            .map(ceremony => ceremony.year)
            .sort((a, b) => a - b);

        setState('availableYears', years);
        const selectedYear = getState().selectedYear || 2025;

        renderYearSelector(years, selectedYear, handleYearChange);
        await loadCeremony(selectedYear);
    } catch (error) {
        console.error('Error loading ceremonies:', error);
        showErrorState();
    }
}
