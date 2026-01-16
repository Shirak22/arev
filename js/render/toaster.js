export const toaster = {
    timeoutId: null,
    show: (message, type, duration=3000) => {
        const toasterEl = document.querySelector('.toaster');
        
        // Clear any existing timeout
        if (toaster.timeoutId) {
            clearTimeout(toaster.timeoutId);
        }
        
        // Remove all previous type classes before adding the new one
        toasterEl.classList.remove('error', 'success', 'info');
        if(type === 'error') {
            toasterEl.classList.add('error');
        } else if(type === 'success') {
            toasterEl.classList.add('success');
        } else if(type === 'info') {
            toasterEl.classList.add('info');
        }
        toasterEl.classList.add('show');
        toasterEl.innerHTML = message;
        
        // Store timeout ID and remove both show and type classes when hiding
        toaster.timeoutId = setTimeout(() => {
            toasterEl.classList.remove('show', 'error', 'success', 'info');
            toaster.timeoutId = null;
        }, duration);
    }
}