const filePathexplorercontainer = document.currentScript.src.split('/')
const cssNameexplorercontainer = filePathexplorercontainer[filePathexplorercontainer.length - 1].replace('js', 'css')

filePathexplorercontainer.pop()
filePathexplorercontainer.push(cssNameexplorercontainer)

const cssPathexplorercontainer = filePathexplorercontainer.join('/')

class explorercontainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
        this.loadStyles();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <div class="explorercontainer">
        <div class="explorerHeader">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
            </svg>
            <span class="columnName" style="width: 20%">Nome</span>
            <span class="columnName" style="width: 15%">Data de criação</span>
            <span class="columnName" style="width: 20%">Número de registros</span>
            <span class="columnName" style="width: 10%">Tamanho</span>
        </div>
            <slot></slot>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathexplorercontainer;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('explorer-container', explorercontainer);