import DM from '../dm.js'
import SessionManager from '../managers/sessionManager.js'
import Amplify, { API, graphqlOperation } from "aws-amplify";

import awsconfig from "../aws-exports";
import { createSession } from "../graphql/mutations";
import { listSessions } from "../graphql/queries";
import { onCreateSession } from "../graphql/subscriptions";

(function() { 


Amplify.configure(awsconfig);

let template = document.createElement('template');
template.innerHTML = /*html*/`
<style>
    /*@import url("/style/main.css");*/
    :host {display: block}
    display-card { width: 32vw; height: 150px;}
</style>

<div class="app-body">
    <h1>Create Session</h1>
    Session Name: <input id="sessName" placeholder="Session Name" />
    <br />
    Session Description: <input id="sessDesc" placeholder="Session Description" />
    <br />
    <button id="addSessionButton">Add Session</button>
    <div id="addSessionResult"></div>
    <hr />

    <h1>Available Sessions</h1>
    <div id="SessionListResult"></div>
</div>
`;

class LandingPage extends HTMLElement {
    static get is() { return 'landing-page'; }
    constructor() {
        super();
        this._sessionData = []

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async createNewSession(name, desc = 'Session Description') {
        const session = {
            title: name,
            description: desc,
            groups: JSON.stringify(SessionManager.defaultGroups)
        };
        return await API.graphql(graphqlOperation(createSession, { input: session }));
    }
    
    async getData() {
        let self = this;
        API.graphql(graphqlOperation(listSessions)).then((evt) => {
            self._sessionData = [];
            evt.data.listSessions.items.map((session, i) => {
                session.groupsJson = JSON.parse(session.groups)
                self._sessionData.push(session)
            });
            self.renderSessions();
        });
    }

    renderSessions() {
        const SessionListResult = this.shadowRoot.getElementById("SessionListResult");
        let self = this, container = DM.Target(SessionListResult).clear()
        self._sessionData.forEach(sess => {
            container.append('display-card')
            .attr('card-id', sess.id)
            .attr('card-title', sess.title)
            .attr('card-desc', sess.description)
            .listen('click', e=>{
                self.dispatchEvent(new CustomEvent('select', {
                    bubbles: true,
                    composed: true,
                    detail: sess
                }));
                e.stopPropagation();
            })
            //console.log(sess);
        });
    }
    

    connectedCallback() {
        let self = this;
        const NewSessionButton = this.shadowRoot.getElementById("addSessionButton");
        const NewSessionName = this.shadowRoot.getElementById("sessName");
        const NewSessionDesc = this.shadowRoot.getElementById("sessDesc");

        NewSessionButton.addEventListener("click", (evt) => {
            let sName = NewSessionName.value, sDesc = NewSessionDesc.value;
            if ((sName && sName.length > 0) === false) {
                AddSessionResult.innerHTML = `<p>Session Name is a required field</p>`;
                evt.stopPropagation();
                return;
            }
            this.createNewSession(sName,sDesc);
        });

        API.graphql(graphqlOperation(onCreateSession)).subscribe({
            next: (evt) => {
                const session = evt.value.data.onCreateSession;
                self._sessionData.push(session);
                self.renderSessions();
            },
        });

        this.getData();
    }


}  // END LandingPage

customElements.define(LandingPage.is, LandingPage);
// export default LandingPage;

})();