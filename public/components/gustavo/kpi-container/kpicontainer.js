const filePathkpicontainer = document.currentScript.src.split('/')
const cssNamekpicontainer = filePathkpicontainer[filePathkpicontainer.length -1].replace('js', 'css')

filePathkpicontainer.pop()
filePathkpicontainer.push(cssNamekpicontainer)

const cssPathkpicontainer = filePathkpicontainer.join('/')

class kpicontainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadStyles();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
        <div class="kpicontainer">
            <span class="tituloKpi">${this.getAttribute('titulo')}</span>
            <slot></slot>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathkpicontainer;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('kpi-container', kpicontainer);