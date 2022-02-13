import DM from '../../dm.js';
import styles from "./landing-page.style.css";
import html from "./landing-page.html";

const template = document.createElement('template');
template.innerHTML = html;


class LandingPage extends HTMLElement {
    static get is() { return 'landing-page'; }
    constructor() {
        super();
		this._pages = [
			{ order: 1, pageId: 'gotoCards', pageTitle: 'Card List', eventNm: 'cards' },
			{ order: 2, pageId: 'gotoTabs', pageTitle: 'Tabs Page', eventNm: 'tabs' },
			{ order: 3, pageId: 'gotoIcons', pageTitle: 'Icon Samples', eventNm: 'icons' },
			{ order: 4, pageId: 'gotoAbout', pageTitle: 'About', eventNm: 'about' },
		];

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `<style>${styles}</style>`;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

	render() {
		const self = this,
		siteNav = this.shadowRoot.getElementById("siteNav"),
		sn = DM.Target(siteNav);
		sn.clear();

		this._pages.forEach(page => {
			sn.append('div').append('a')
			.attr('id', page.pageId)
			.attr('href','#')
			.text(page.pageTitle)
			.listen('click', e => { self.gotoPage(e, page.eventNm) })
		});
	}
	gotoPage(e, pageName) {
		this.dispatchEvent(new CustomEvent('select', {
			bubbles: true,
			composed: true,
			detail: pageName
		}));
		e.stopPropagation();
	}

    connectedCallback() {
		this.render();
    }



}  // END LandingPage

customElements.define(LandingPage.is, LandingPage);
// export default LandingPage;
