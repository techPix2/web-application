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
            <span class="columnName"></span>
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