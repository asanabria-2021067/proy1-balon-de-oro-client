export function transformCeremony(data) {
    return {
        year: data.year,
        winner: data.winner,
        nominations: data.nominations || []
    };
}

export function filterNominations(nominations, rank) {
    return nominations.filter(n => n.rank === rank);
}

export function getRankStyle(rank) {
    if (rank === 1) {
        return {
            borderColor: 'var(--color-primary)',
            badge: `#${rank}`,
            className: 'card--rank-1'
        };
    }
    if (rank === 2) {
        return {
            borderColor: '#C0C0C0',
            badge: `#${rank}`,
            className: 'card--rank-2'
        };
    }
    if (rank === 3) {
        return {
            borderColor: '#CD7F32',
            badge: `#${rank}`,
            className: 'card--rank-3'
        };
    }
    return {
        borderColor: 'var(--color-border)',
        badge: `#${rank}`,
        className: ''
    };
}

export function generateYearRange() {
    const years = [];
    for (let y = 1998; y <= 2025; y++) {
        if (y !== 2020) years.push(y);
    }
    return years;
}
