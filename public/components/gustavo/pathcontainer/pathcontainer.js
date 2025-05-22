const filePathpathcontainer = document.currentScript.src.split('/')
const cssNamepathcontainer = filePathpathcontainer[filePathpathcontainer.length - 1].replace('js', 'css')

filePathpathcontainer.pop()
filePathpathcontainer.push(cssNamepathcontainer)

const cssPathpathcontainer = filePathpathcontainer.join('/')

class pathcontainer extends HTMLElement {
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
        <div class="pathcontainer">
            <slot></slot>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathpathcontainer;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('path-container', pathcontainer);