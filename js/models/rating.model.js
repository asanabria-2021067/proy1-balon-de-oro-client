export function calculateStars(average) {
    const filled = Math.floor(average || 0);
    const empty = 5 - filled;
    return { filled, empty };
}

export function formatRating(average, count) {
    const avg = average ? average.toFixed(1) : '0.0';
    return `Promedio actual: ${avg} ★ (${count || 0} votos)`;
}

export function formatRatingDisplay(average) {
    return average ? average.toFixed(1) : '0.0';
}
