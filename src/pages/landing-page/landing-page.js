import styles from "./landing-page.style.css";
import html from "./landing-page.html";

const template = document.createElement('template');
template.innerHTML = html;


// let template = document.createElement('template');
// template.innerHTML = /*html*/`
// <style>
//     /*@import url("/style/main.css");*/
//     :host {display: block}
//     h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
// </style>

// <div class="app-body">
//     <h1>Home</h1>
//     <div><a id="gotoCards" href="#">Card List</a></div>
//     <div><a id="gotoTabs" href="#">Tabs Page</a></div>
//     <div><a id="gotoAbout" href="#">About</a></div>
// </div>
// `;

class LandingPage extends HTMLElement {
    static get is() { return 'landing-page'; }
    constructor() {
        super();

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `<style>${styles}</style>`;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        let self = this;
        const gotoCards = this.shadowRoot.getElementById("gotoCards");
        const gotoTabs = this.shadowRoot.getElementById("gotoTabs");
        const gotoAbout = this.shadowRoot.getElementById("gotoAbout");

        gotoCards.addEventListener("click", (e) => {
            self.dispatchEvent(new CustomEvent('select', {
                bubbles: true,
                composed: true,
                detail: 'cards'
            }));
            e.stopPropagation();
        });
        gotoTabs.addEventListener("click", (e) => {
            self.dispatchEvent(new CustomEvent('select', {
                bubbles: true,
                composed: true,
                detail: 'tabs'
            }));
            e.stopPropagation();
        });
        gotoAbout.addEventListener("click", (e) => {
            self.dispatchEvent(new CustomEvent('select', {
                bubbles: true,
                composed: true,
                detail: 'about'
            }));
            e.stopPropagation();
        });
    }


}  // END LandingPage

customElements.define(LandingPage.is, LandingPage);
// export default LandingPage;
