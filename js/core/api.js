const API_URL = "https://proy1-balon-de-oro-api.vercel.app/api";

export async function getCeremonies() {
    try {
        const response = await fetch(`${API_URL}/ceremonies`);
        if (!response.ok) throw new Error('Error al obtener ceremonias');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCeremonyByYear(year) {
    try {
        const response = await fetch(`${API_URL}/ceremonies/${year}`);
        if (!response.ok) throw new Error(`Error al obtener ceremonia de ${year}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getPlayers({page = 1, limit = 10, q = '', nationality = '', sort = '', order = ''} = {}) {
    try {
        const params = new URLSearchParams({ page, limit, q, nationality, sort, order });
        const response = await fetch(`${API_URL}/players?${params.toString()}`);
        if (!response.ok) throw new Error('Error al obtener jugadores');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getPlayerById(id) {
    try {
        const response = await fetch(`${API_URL}/players/${id}`);
        if (!response.ok) throw new Error('Error al obtener jugador');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createPlayer(formData) {
    try {
        const response = await fetch(`${API_URL}/players`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al crear jugador');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updatePlayer(id, formData) {
    try {
        const response = await fetch(`${API_URL}/players/${id}`, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al actualizar jugador');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deletePlayer(id) {
    try {
        const response = await fetch(`${API_URL}/players/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar jugador');
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCountryStats() {
    try {
        const res = await fetch(`${API_URL}/stats/countries`);
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Error al obtener estadísticas');
        }
        return res.json();
    } catch (err) {
        throw err;
    }
}
