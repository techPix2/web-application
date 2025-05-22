const filePathpathelement = document.currentScript.src.split('/')
const cssNamepathelement = filePathpathelement[filePathpathelement.length - 1].replace('js', 'css')

filePathpathelement.pop()
filePathpathelement.push(cssNamepathelement)

const cssPathpathelement = filePathpathelement.join('/')

class pathelement extends HTMLElement {
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
        <div class="pathelement">
            ${this.getAttribute('pathPart')}
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathpathelement;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('path-element', pathelement);