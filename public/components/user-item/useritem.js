const filePathuserelement = document.currentScript.src.split('/')
const cssNameuserelement = filePathuserelement[filePathuserelement.length - 1].replace('js', 'css')

filePathuserelement.pop()
filePathuserelement.push(cssNameuserelement)

const cssPathuserelement = filePathuserelement.join('/')

class userelement extends HTMLElement {
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
        <div class="userElement">
            <span class="userInfo" style="width: 25%">${this.getAttribute('userName')}</span>
            <span class="userInfo" style="width: 25%; text-align: center">${this.getAttribute('email')}</span>
            <span class="userInfo" style="width: 25%; text-align: center">${this.getAttribute('role') ?? '1'}</span>
            <span class="userInfo" style="width: 25%; text-align: center">${this.getAttribute('lastAccess') ?? '1'}</span>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathuserelement;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('user-element', userelement);