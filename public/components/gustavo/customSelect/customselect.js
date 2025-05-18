const filePathcustomselect = document.currentScript.src.split('/')
const cssNamecustomselect = filePathcustomselect[filePathcustomselect.length - 1].replace('js', 'css')

filePathcustomselect.pop()
filePathcustomselect.push(cssNamecustomselect)

const cssPathcustomselect = filePathcustomselect.join('/')

class customselect extends HTMLElement {
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
        <select class="customselect">
            <option class="customOption" value="">Selecione uma maquina</option>
            <slot></slot>
        </select>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathcustomselect;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('custom-select', customselect);