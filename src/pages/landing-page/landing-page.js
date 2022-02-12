import styles from "./landing-page.style.css";
import html from "./landing-page.html";

const template = document.createElement('template');
template.innerHTML = html;


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
        const gotoIcons = this.shadowRoot.getElementById("gotoIcons");
        const gotoAbout = this.shadowRoot.getElementById("gotoAbout");

        gotoCards.addEventListener("click", (e) => { self.gotoPage(e,'cards') });
        gotoTabs.addEventListener("click", (e) => { self.gotoPage(e,'tabs') });
        gotoIcons.addEventListener("click", (e) => { self.gotoPage(e,'icons') });
		gotoAbout.addEventListener("click", (e) => { self.gotoPage(e,'about') });
    }
	gotoPage(e, pageName) {
		this.dispatchEvent(new CustomEvent('select', {
			bubbles: true,
			composed: true,
			detail: pageName
		}));
		e.stopPropagation();
	}


}  // END LandingPage

customElements.define(LandingPage.is, LandingPage);
// export default LandingPage;
