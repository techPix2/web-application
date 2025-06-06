const filePathusercontainer = document.currentScript.src.split('/')
const cssNameusercontainer = filePathusercontainer[filePathusercontainer.length - 1].replace('js', 'css')

filePathusercontainer.pop()
filePathusercontainer.push(cssNameusercontainer)

const cssPathusercontainer = filePathusercontainer.join('/')

class usercontainer extends HTMLElement {
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
        <div class="usercontainer">
        <div class="userHeader">
            <span class="columnName" style="width: 25%">Nome</span>
            <span class="columnName" style="width: 25%">email</span>
            <span class="columnName" style="width: 25%">Cargo</span>
            <span class="columnName" style="width: 25%">Ultimo Acesso</span>
        </div>
        <div class="userContent">
            <slot></slot>
        </div>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathusercontainer;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('user-container', usercontainer);