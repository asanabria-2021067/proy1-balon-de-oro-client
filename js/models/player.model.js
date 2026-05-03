export function transformPlayer(data) {
    return {
        id: data.id,
        name: data.name,
        nationality: data.nationality,
        club: data.club,
        position: data.position,
        photoUrl: data.photoUrl || null
    };
}

export function getPositionColor(position) {
    const colors = {
        'GK': '#3b82f6',
        'DEF': '#22c55e',
        'MID': '#eab308',
        'FWD': '#a855f7'
    };
    return colors[position.toUpperCase()] || '#888899';
}

export function validatePlayerForm(fields) {
    const errors = [];

    if (!fields.name || fields.name.trim() === '') {
        errors.push('Nombre es requerido');
    }

    if (!fields.nationality || fields.nationality.trim() === '') {
        errors.push('Nacionalidad es requerida');
    }

    if (!fields.club || fields.club.trim() === '') {
        errors.push('Club es requerido');
    }

    if (!fields.position || !['GK', 'DEF', 'MID', 'FWD'].includes(fields.position)) {
        errors.push('Posición inválida');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
