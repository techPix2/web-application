/**
 * Alert Component
 * A reusable alert/popup component for displaying messages to users
 */

class AlertComponent {
    constructor() {
        this.init();
    }

    init() {
        // Create alert container if it doesn't exist
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
            
            // Close alert when clicking on overlay
            alertOverlay.addEventListener('click', () => {
                this.close();
            });
        }
        
        this.container = document.querySelector('.alert-container');
        this.overlay = document.querySelector('.alert-overlay');
        this.box = document.querySelector('.alert-box');
    }

    /**
     * Show an alert
     * @param {Object} options - Alert options
     * @param {string} options.type - Alert type: 'success', 'error', 'warning', 'info'
     * @param {string} options.title - Alert title
     * @param {string} options.message - Alert message
     * @param {string} options.icon - URL to icon image (optional)
     * @param {Array} options.buttons - Array of button objects (optional)
     * @param {boolean} options.closeOnOverlayClick - Whether to close when clicking overlay (default: true)
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

        // Reset box content
        this.box.innerHTML = '';
        
        // Set alert type class
        this.box.className = 'alert-box';
        this.box.classList.add(type);
        
        // Add icon if provided
        if (icon) {
            const iconElement = document.createElement('div');
            iconElement.className = 'alert-icon';
            iconElement.innerHTML = `<img src="${icon}" alt="${type} icon">`;
            this.box.appendChild(iconElement);
        }
        
        // Add content
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
        
        // Add buttons
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
        
        // Show alert
        this.container.style.display = 'block';
        
        // Set overlay click behavior
        if (closeOnOverlayClick) {
            this.overlay.addEventListener('click', () => this.close());
        } else {
            this.overlay.removeEventListener('click', () => this.close());
        }
        
        return this;
    }

    /**
     * Close the alert
     */
    close() {
        this.container.style.display = 'none';
        return this;
    }

    /**
     * Show a success alert
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
     * Show an error alert
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
     * Show a warning alert
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
     * Show an info alert
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
     * Show a confirmation alert
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

// Create a global instance
const Alert = new AlertComponent();

// Example usage:
// Alert.success('Sucesso!', 'Operação realizada com sucesso.');
// Alert.error('Erro!', 'Ocorreu um erro ao processar sua solicitação.');
// Alert.warning('Atenção!', 'Esta ação não pode ser desfeita.');
// Alert.info('Informação', 'O sistema será atualizado em breve.');
// Alert.confirm('Confirmação', 'Tem certeza que deseja excluir este item?', 
//     () => console.log('Confirmado'), 
//     () => console.log('Cancelado')
// );