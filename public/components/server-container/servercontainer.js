const filePathservercontainer = document.currentScript.src.split('/')
const cssNameservercontainer = filePathservercontainer[filePathservercontainer.length - 1].replace('js', 'css')

filePathservercontainer.pop()
filePathservercontainer.push(cssNameservercontainer)

const cssPathservercontainer = filePathservercontainer.join('/')

class servercontainer extends HTMLElement {
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
        <div class="servercontainer">
        <div class="serverHeader">
            <span class="columnName" style="width: 30%">Hostname</span>
            <span class="columnName" style="width: 30%">MacAddress</span>
            <span class="columnName" style="width: 30%">MobuId</span>
        </div>
        <div class="serverContent">
            <slot></slot>
        </div>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathservercontainer;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('server-container', servercontainer);