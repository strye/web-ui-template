import styles from './icon-page.style.css';
import html from './icon-page.html';
import Icons from "./icons.js";

const template = document.createElement('template');
template.innerHTML = html;

class IconPage extends HTMLElement {
	static get is() { return 'icon-page'; }

	constructor() {
		super();

		// Attach a shadow root to the element.
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `<style>${styles}</style>`;
		shadowRoot.appendChild(template.content.cloneNode(true));
	}

	render() {
		let sr = this.shadowRoot,
		iconDiv = sr.getElementById("iconCntr"),
        group = "";
        Icons.forEach(ico => {
            if (ico.group !== group) {
                group = ico.group;
                let hdr = document.createElement('h1');
                hdr.innerText = `${group} Icons`;
				hdr.classList.toggle('clearfix', true)
                iconDiv.append(hdr);
            }
            let spn = document.createElement('span');
            spn.classList.toggle("icon", true);
            spn.classList.toggle("icon-64", true);
            spn.classList.toggle(ico.name, true);
            spn.setAttribute("title", ico.name)

            iconDiv.append(spn);
		})
	}

	connectedCallback() {
		this.render()
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName === 'elm-title') { this._title = newVal; this.render(); }
	}

	setAtProp(attrName, val) {
		if (val) { this.setAttribute(attrName, val); }
		else { this.removeAttribute(attrName); }
		this.render()
	}

	get title(){ return this._title; }
	set title(val){ this.setAtProp('elm-title', val) }
}  // END IconPage

customElements.define(IconPage.is, IconPage);
export default IconPage;