const filePathlistitem = document.currentScript.src.split('/');
const cssNamelistitem = filePathlistitem[filePathlistitem.length - 1].replace('js', 'css');

filePathlistitem.pop();
filePathlistitem.push(cssNamelistitem);

const cssPathlistitem = filePathlistitem.join('/');

class listitem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadStyles();

        const button = this.shadowRoot.querySelector('.itemButton');
        button.addEventListener('click', () => {
            if (typeof this.remover === 'function') {
                this.remover();
            } else {
                console.warn('Função de remoção não definida.');
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div class="listitem">
                <span class="itemName">${this.getAttribute('fileName')}</span>
                <span class="itemDate">${this.getAttribute('fileDate')}</span>
                <button class="itemButton">Remover</button>
            </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathlistitem;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('list-item', listitem);
