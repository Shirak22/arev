export const toaster = {
    timeoutId: null,
    show: (message, type, duration=3000, actions = []) => {
        const toasterEl = document.querySelector('.toaster');
        if (!toasterEl) return;
        
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
        toasterEl.innerHTML = '';

        const messageEl = document.createElement('p');
        messageEl.className = 'toaster-message';
        messageEl.textContent = message;
        toasterEl.appendChild(messageEl);

        if (Array.isArray(actions) && actions.length > 0) {
            const actionsEl = document.createElement('div');
            actionsEl.className = 'toaster-actions';

            actions.forEach((action) => {
                if (!action?.label || typeof action.onClick !== 'function') return;
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'toaster-action-btn';
                button.textContent = action.label;
                button.addEventListener('click', () => {
                    action.onClick();
                    toaster.hide();
                });
                actionsEl.appendChild(button);
            });

            if (actionsEl.childElementCount > 0) {
                toasterEl.appendChild(actionsEl);
            }
        }
        
        if (duration > 0) {
            toaster.timeoutId = setTimeout(() => {
                toaster.hide();
            }, duration);
        }
    },
    hide: () => {
        const toasterEl = document.querySelector('.toaster');
        if (!toasterEl) return;
        if (toaster.timeoutId) {
            clearTimeout(toaster.timeoutId);
            toaster.timeoutId = null;
        }
        toasterEl.classList.remove('show', 'error', 'success', 'info');
        toasterEl.innerHTML = '';
    }
}