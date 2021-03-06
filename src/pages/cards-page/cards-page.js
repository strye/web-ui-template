import styles from "./cards-page.style.css";
import html from "./cards-page.html";

const template = document.createElement('template');
template.innerHTML = html;

// let template = document.createElement('template');
// template.innerHTML = /*html*/`
// 	<style>
//         /*@import url("/style/main.css");*/
//         :host {display:block;}
//         h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
//     </style>
//     <h1>Display Cards Sample</h1>
// 	<div>
// 		<display-card card-title="Test One" card-desc="This is a card that describes something and links to something else."></display-card>
// 		<display-card card-title="Test Two" card-desc="This is a card that describes something and links to something else."></display-card>
// 	</div>
// `;

class CardsPage extends HTMLElement {
    static get is() { return 'cards-page'; }
    constructor() {
        super();
        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `<style>${styles}</style>`;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
}  // END CardsPage

customElements.define(CardsPage.is, CardsPage);
    
export default CardsPage;    