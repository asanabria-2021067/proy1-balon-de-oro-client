export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

export function showLoadingToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const id = 'toast-' + Date.now();
    toast.id = id;
    toast.className = 'toast toast--info';
    toast.textContent = message;
    container.appendChild(toast);
    return id;
}

export function hideLoadingToast(id, finalMessage = '', finalType = 'success') {
    const toast = document.getElementById(id);
    if (!toast) return;

    if (finalMessage) {
        toast.className = `toast toast--${finalType}`;
        toast.textContent = finalMessage;
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    } else {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }
}
