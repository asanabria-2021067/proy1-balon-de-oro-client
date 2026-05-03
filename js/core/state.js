const state = {
    currentView: 'ceremonies',
    selectedYear: 2025,
    ceremonies: [],
    currentCeremony: null,
    players: [],
    searchQuery: '',
};

export function getState() {
    return state;
}

export function setState(key, value) {
    state[key] = value;
}

export default state;
