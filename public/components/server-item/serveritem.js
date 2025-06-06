const filePathserverelement = document.currentScript.src.split('/')
const cssNameserverelement = filePathserverelement[filePathserverelement.length - 1].replace('js', 'css')

filePathserverelement.pop()
filePathserverelement.push(cssNameserverelement)

const cssPathserverelement = filePathserverelement.join('/')

class serverelement extends HTMLElement {
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
        <div class="serverElement">
            <span class="serverInfo" style="width: 30%">${this.getAttribute('hostName')}</span>
            <span class="serverInfo" style="width: 30%; text-align: center">${this.getAttribute('macAddress')}</span>
            <span class="serverInfo" style="width: 30%; text-align: center">${this.getAttribute('mobuId') ?? 'Não coletado'}</span>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathserverelement;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('server-element', serverelement);