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
            <div class="dropHeader">
                <span class="dropText">Arquivos Selecionados</span>
                <span class="SelectValue">${this.getAttribute('qtdSelects')} DE 10</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-caret-down" viewBox="0 0 16 16">
                  <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659"/>
                </svg>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathdroplist;
        this.shadowRoot.appendChild(link);
    }

    expandir(){
        const imagem = this.shadowRoot.querySelector('.bi').style
        const header = this.shadowRoot.querySelector('.dropHeader').style
        this.shadowRoot.querySelector('.droplist').classList.toggle('expandida');
        const content = this.shadowRoot.querySelector('.content').style

        if(content.display == 'flex'){
            content.display = 'none';
            header.borderBottom = 'none';
            header.boxShadow = 'none';
            imagem.transform = 'rotate(0deg)';
        }else{
            content.display = 'flex';
            header.borderBottom = 'rgba(0, 0, 0, 0.37) 1px solid';
            header.boxShadow = 'rgba(0, 0, 0, 0.10) 0px 4px 4px 0px';
            imagem.transform = 'rotate(180deg)';
        }

        console.log('click')
    }

}

customElements.define('drop-list', droplist);