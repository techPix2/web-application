const filePathdroplist = document.currentScript.src.split('/')
const cssNamedroplist = filePathdroplist[filePathdroplist.length - 1].replace('js', 'css')

filePathdroplist.pop()
filePathdroplist.push(cssNamedroplist)

const cssPathdroplist = filePathdroplist.join('/')

class droplist extends HTMLElement {
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
        <div class="droplist">
            <slot></slot>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathdroplist;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('drop-list', droplist);