import styles from "./tabs-page.style.css";
import html from "./tabs-page.html";

const template = document.createElement('template');
template.innerHTML = html;


// let template = document.createElement('template');
// template.innerHTML = /*html*/`
// 	<style>
//         :host {display:block;}
//         h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
//     </style>
//     <h1 id="elmTitle">Tabs Sample</h1>
// 	<div>
// 		<bm-tabs id="testElm" elm-title="test">
// 			<bm-tab tab-value="one" tab-caption="Test One">One</bm-tab>
// 			<bm-tab tab-value="two" tab-caption="Test Two" selected="true">Two</bm-tab>
// 			<bm-tab tab-value="three" tab-caption="Test Three">Three</bm-tab>
// 		</bm-tabs>
// 		<div id="pageOne" class="page-content" hidden>This is page one</div>
// 		<div id="pageTwo" class="page-content" >This is page two</div>
// 		<div id="pageThree" class="page-content" hidden>This is page three</div>
// 	</div>
// `;

class TabsPage extends HTMLElement {
    static get is() { return 'tabs-page'; }
    constructor() {
        super();
        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `<style>${styles}</style>`;
        shadowRoot.appendChild(template.content.cloneNode(true));
	}

	_switchPage(tab) {
		this.shadowRoot.getElementById('pageOne').hidden = (tab.value !== "one");
		this.shadowRoot.getElementById('pageTwo').hidden = (tab.value !== "two");
		this.shadowRoot.getElementById('pageThree').hidden = (tab.value !== "three");
	}
	

    connectedCallback() {
		let tabs = this.shadowRoot.getElementById('testElm')
		tabs.addEventListener('changed', evt => {
			//console.log('changed', evt.detail)
			this._switchPage(evt.detail);
		}, this);
	}

}  // END TabsPage

customElements.define(TabsPage.is, TabsPage);
    
//export default TabsPage;    