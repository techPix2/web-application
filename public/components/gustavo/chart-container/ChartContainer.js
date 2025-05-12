const filePathChartContainer = document.currentScript.src.split('/')
const cssNameChartContainer = filePathChartContainer[filePathChartContainer.length - 1].replace('js', 'css')

filePathChartContainer.pop()
filePathChartContainer.push(cssNameChartContainer)

const cssPathChartContainer = filePathChartContainer.join('/')

class ChartContainer extends HTMLElement {
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
        <div class="ChartContainer">
            <slot></slot>
        </div>
        `;
    }

    loadStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPathChartContainer;
        this.shadowRoot.appendChild(link);
    }
}

customElements.define('chart-container', ChartContainer);