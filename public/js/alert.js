

class AlertComponent {
    constructor() {
        this.init();
    }

    init() {
        if (!document.querySelector('.alert-container')) {
            const alertContainer = document.createElement('div');
            alertContainer.className = 'alert-container';
            
            const alertOverlay = document.createElement('div');
            alertOverlay.className = 'alert-overlay';
            
            const alertBox = document.createElement('div');
            alertBox.className = 'alert-box';
            
            alertContainer.appendChild(alertOverlay);
            alertContainer.appendChild(alertBox);
            document.body.appendChild(alertContainer);

            alertOverlay.addEventListener('click', () => {
                this.close();
            });
        }
        
        this.container = document.querySelector('.alert-container');
        this.overlay = document.querySelector('.alert-overlay');
        this.box = document.querySelector('.alert-box');
    }

    /**
     * @param {Object} options -
     * @param {string} options.type -
     * @param {string} options.title -
     * @param {string} options.message -
     * @param {string} options.icon -
     * @param {Array} options.buttons -
     * @param {boolean} options.closeOnOverlayClick -
     */
    show(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            icon = null,
            buttons = [{ text: 'OK', class: 'primary', onClick: () => this.close() }],
            closeOnOverlayClick = true
        } = options;

        this.box.innerHTML = '';

        this.box.className = 'alert-box';
        this.box.classList.add(type);

        if (icon) {
            const iconElement = document.createElement('div');
            iconElement.className = 'alert-icon';
            iconElement.innerHTML = `<img src="${icon}" alt="${type} icon">`;
            this.box.appendChild(iconElement);
        }

        const contentElement = document.createElement('div');
        contentElement.className = 'alert-content';
        
        if (title) {
            const titleElement = document.createElement('div');
            titleElement.className = 'alert-title';
            titleElement.textContent = title;
            contentElement.appendChild(titleElement);
        }
        
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'alert-message';
            messageElement.textContent = message;
            contentElement.appendChild(messageElement);
        }
        
        this.box.appendChild(contentElement);

        if (buttons && buttons.length > 0) {
            const buttonsElement = document.createElement('div');
            buttonsElement.className = 'alert-buttons';
            
            buttons.forEach(button => {
                const buttonElement = document.createElement('button');
                buttonElement.className = `alert-button ${button.class || ''}`;
                buttonElement.textContent = button.text;
                buttonElement.addEventListener('click', (e) => {
                    if (button.onClick) {
                        button.onClick(e);
                    } else {
                        this.close();
                    }
                });
                buttonsElement.appendChild(buttonElement);
            });
            
            this.box.appendChild(buttonsElement);
        }

        this.container.style.display = 'block';

        if (closeOnOverlayClick) {
            this.overlay.addEventListener('click', () => this.close());
        } else {
            this.overlay.removeEventListener('click', () => this.close());
        }
        
        return this;
    }

    close() {
        this.container.style.display = 'none';
        return this;
    }

    /**
     * @param {string} title - Alert title
     * @param {string} message - Alert message
     * @param {Object} options - Additional options
     */
    success(title, message, options = {}) {
        return this.show({
            type: 'success',
            title,
            message,
            icon: options.icon || '../assets/icon/verified.gif',
            ...options
        });
    }

    /**
     * @param {string} title - Alert title
     * @param {string} message - Alert message
     * @param {Object} options - Additional options
     */
    error(title, message, options = {}) {
        return this.show({
            type: 'error',
            title,
            message,
            icon: options.icon || '../assets/icon/stop.gif',
            ...options
        });
    }

    /**
     * @param {string} title - Alert title
     * @param {string} message - Alert message
     * @param {Object} options - Additional options
     */
    warning(title, message, options = {}) {
        return this.show({
            type: 'warning',
            title,
            message,
            ...options
        });
    }

    /**
     * @param {string} title - Alert title
     * @param {string} message - Alert message
     * @param {Object} options - Additional options
     */
    info(title, message, options = {}) {
        return this.show({
            type: 'info',
            title,
            message,
            ...options
        });
    }

    /**
     * @param {string} title - Alert title
     * @param {string} message - Alert message
     * @param {Function} onConfirm - Function to call when confirmed
     * @param {Function} onCancel - Function to call when canceled
     * @param {Object} options - Additional options
     */
    confirm(title, message, onConfirm, onCancel = () => {}, options = {}) {
        return this.show({
            type: 'warning',
            title,
            message,
            closeOnOverlayClick: false,
            buttons: [
                {
                    text: options.confirmText || 'Confirmar',
                    class: 'primary',
                    onClick: () => {
                        this.close();
                        onConfirm();
                    }
                },
                {
                    text: options.cancelText || 'Cancelar',
                    onClick: () => {
                        this.close();
                        onCancel();
                    }
                }
            ],
            ...options
        });
    }
}

const Alert = new AlertComponent();

