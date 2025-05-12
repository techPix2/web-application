const filePathcustommain = document.currentScript.src.split('/')
const cssNamecustommain = filePathcustommain[filePathcustommain.length - 1].replace('js', 'css')

filePathcustommain.pop()
filePathcustommain.push(cssNamecustommain)

const cssPathcustommain = filePathcustommain.join('/')

class custommain extends HTMLElement {
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
            <div class="customMain">
                <slot></slot>
            </div>`;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathcustommain;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('custom-main', custommain);