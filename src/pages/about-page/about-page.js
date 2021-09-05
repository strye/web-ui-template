import styles from "./about-page.style.css";
import html from "./about-page.html";

const template = document.createElement('template');
template.innerHTML = html;


// let template = document.createElement('template');
// template.innerHTML = /*html*/`
// 	<style>
//         /*@import url("/style/main.css");*/
//         :host {display:block;}
//         h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
//     </style>
//     <h1>About</h1>
// 	<div>
//         This is the about page.
//     </div>
// `;

class AboutPage extends HTMLElement {
    static get is() { return 'about-page'; }
    constructor() {
        super();
        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `<style>${styles}</style>`;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
}  // END AboutPage

customElements.define(AboutPage.is, AboutPage);
    
//export default PageCards;    