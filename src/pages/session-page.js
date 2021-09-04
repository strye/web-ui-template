import SessionManager from '../managers/sessionManager.js'

let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
		@import url("/styles/main.css");
		@import url("/styles/active-icons.css");
        /*@import url("styles/session.css");*/
		:host {display: block;width: 100%; height: 100%; }
		.hidden { display: none}
		#canvas { width: 100%; height: calc(100% - 40px); /*border: 2px solid #ff9900;*/ }

		#se {position: fixed; right:10px; top:10px ;width: 225px; z-index: 999; border: 3px solid #333; padding: 4px;}
	</style>
	<sticky-editor id="se"></sticky-editor>
	<session-toolbar id="toolbar"></session-toolbar>
	<board-canvas id="canvas"></board-canvas>
<!--
	<div id="main">
        <canvas id="canvas" width="200" height="200"></canvas>
	</div>
-->
`;

class SessionPage extends HTMLElement {
    static get is() { return 'session-page'; }
    constructor() {
        super();
        this._sessionManager = null;
        this._sessionData = null;

        this._showGrid = true;

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));

        this._canvasElm = shadowRoot.getElementById('canvas');
        //this._mainElm = shadowRoot.getElementById('main');
        this._editElm = shadowRoot.getElementById('se');
        this._toolbar = shadowRoot.getElementById('toolbar');
    }
    get sessionData() { return this._sessionData; }
    set sessionData(val) { 
        this._sessionData = val;
        this._setSessionManager();
    }
    get containerClientHeight() { return this._canvasElm.containerClientHeight; }
    get containerClientWidth() { return this._canvasElm.containerClientWidth; }

    _setSessionManager() {
        const self = this;
        self._sessionManager = null;
        self._sessionManager= new SessionManager(self._sessionData.id, self._sessionData);

        // self._sessionManager.subscribe("sessionUpdated", evt => { })

        self._sessionManager.subscribe("stickiesLoaded", evt => { 
			this._sessionManager.iterator(note => {
				//this.drawSticky(note, note.id, note.content, note.left, note.top, note.angle);
				this._canvasElm.addNote(note)
			})
            //self.refresh();
        })
        self._sessionManager.subscribe("stickyAdded", sticky => { 
			this._canvasElm.addNote(sticky)
            //self.refresh();
        })
        self._sessionManager.subscribe("stickyUpdated", stickyData => { 
			this._canvasElm.updateNote(stickyData)
            //self.refresh();
        })
        self._sessionManager.subscribe("stickyDeleted", stickyData => { 
			this._canvasElm.removeNote(stickyData.id)
            //self.refresh();
        })
        // self._sessionManager.subscribe("stickyMoved", evt => { 
        //     // Animate move to new location
        // })

        
        self._sessionManager.loadStickies();
    }


    async addSticky(content, color='#999', notes) {
        const stickyData = {
            content: content,
            published: true,
            color: color,
			left: this._cMidX,
			top: this._cMidY
        };
        if (notes) stickyData.notes = notes;
        //if (group) stickyData.groupID = group;
        this._sessionManager.addSticky(stickyData)
    }
    async updateSticky(id, content, color, notes) {
		let stickyNote = this._sessionManager.get(id), update=false;
		if (!stickyNote) {
			throw new Error('Cannot update. Sticky Note note found.');
		}

        const stickyData = { id: id };
        if (content && content !== stickyNote.content) {
			stickyData.content = content;
			update = true;
		}
        if (color && color !== stickyNote.color) {
			stickyData.color = color;
			update = true;
		}
        if (notes && notes !== stickyNote.notes) {
			stickyData.notes = notes;
			update = true;
		}
		//console.log('updateSticky', content, color, stickyData)

		if (update) this._sessionManager.updateSticky(stickyData)
	}
    async changeStickyColor(id, color) {
        const stickyData = {
			id: id,
            color: color
        };
		this._sessionManager.updateSticky(stickyData)
	}
    async moveSticky(id, top, left) {
        const stickyData = {
			id: id,
            top: top,
            left: left
        };
		this._sessionManager.updateSticky(stickyData).then(res => {
            let sticky = res.data.updateSticky
			console.log("moveSticky",sticky)
		})
		.catch(err => {
			console.log("moveSticky",err)
		})
	}

    refresh() { this._canvasElm.refresh() }

	setCanvasListeners() {
		const self = this;

		this._canvasElm.addEventListener('selection:cleared', opt => {
			this._toolbar.itemsSelected = false;
		})
		this._canvasElm.addEventListener('selection:updated', opt => {
			this._toolbar.itemsSelected = true;
		})
		this._canvasElm.addEventListener('selection:created', opt => {
			this._toolbar.itemsSelected = true;
		})


		this._canvasElm.addEventListener('object:moved', opt => {
			self.moveSticky(opt.detail.id, opt.detail.top, opt.detail.left);
		})

		this._canvasElm.addEventListener('note:selected', opt => {
			let stickyNote = self._sessionManager.get(opt.detail.stickyData.id);
			console.log(stickyNote)
			
			this._editElm.sticky = stickyNote;
			this._editElm.mode = 1;
			this._editElm.classList.toggle('hidden', false)
		})
		
    }

	setToolbarListeners() {
		const self = this,
		sessionToolbar = this.shadowRoot.getElementById("toolbar");

		sessionToolbar.addEventListener('nav:home', e=>{
			self.dispatchEvent(new Event ('nav:home', { bubbles: true,  cancelable: false }));
			self._canvasElm.clear();
		})
		sessionToolbar.addEventListener('view:reset', e=>{
			self._canvasElm.centerViewport();
		})
		sessionToolbar.addEventListener('view:zoomin', e=>{
			self._canvasElm.zoom(1.05)
            // let zoom = self._canvas.getZoom(), 
			// centerPoint = self._canvas.getCenter();
            // zoom *= 1.05;
            // if (zoom > 20) zoom = 20;
            // if (zoom < 0.01) zoom = 0.01;
			// self._canvas.zoomToPoint({ x: centerPoint.left, y: centerPoint.top }, zoom);
		})
		sessionToolbar.addEventListener('view:zoomout', e=>{
			self._canvasElm.zoom(1.05 ** -1);
            // let zoom = self._canvas.getZoom(), centerPoint = self._canvas.getCenter();
            // zoom *= 1.05 ** -1;
            // if (zoom > 20) zoom = 20;
            // if (zoom < 0.01) zoom = 0.01;
			// self._canvas.zoomToPoint({ x: centerPoint.left, y: centerPoint.top }, zoom);
		})
		sessionToolbar.addEventListener('view:grid', e=>{
			self._showGrid = !self._showGrid;
			self._canvasElm.showGrid = self._showGrid;
			self._canvasElm.refresh();
			sessionToolbar.gridOn = self._showGrid
		})

		sessionToolbar.addEventListener('session:refresh', e=>{
			self._canvasElm.clear();
			self._sessionManager.loadStickies();
		})

		sessionToolbar.addEventListener('sticky:add', e=>{
			self._editElm.mode = 0;
			self._editElm.classList.toggle('hidden', false)
		})

		sessionToolbar.addEventListener('sticky:color', e=>{
			let selected = self._canvasElm.selected;
			selected.forEach(grp => {
				self.changeStickyColor(grp.id, e.detail.color);
			});
			//console.log('single', self._canvas.getActiveObject().id) // undefied if more than one
		})
		sessionToolbar.addEventListener('sticky:delete', e=>{
			let selected = self._canvasElm.selected;
			selected.forEach(grp => {
				self._sessionManager.deleteSticky(grp.id)
			});
			//console.log('single', self._canvas.getActiveObject().id) // undefied if more than one
		})

	}

	setEditorListeners() {
		const self = this,
		StickyEditElem = this.shadowRoot.getElementById("se");

		StickyEditElem.addEventListener('cancel', e=>{
			self._hideEditor();
        })
		StickyEditElem.addEventListener('add', e=>{
			let sticky = e.detail;
			//console.log('add', sticky);
			self.addSticky(sticky.content, sticky.color);
        })
		StickyEditElem.addEventListener('save', e=>{
			let sticky = e.detail;
			//console.log('save', sticky);
			self.updateSticky(sticky.id, sticky.content, sticky.color);

			self._hideEditor();
        })
		StickyEditElem.addEventListener('delete', e=>{
			let sticky = e.detail;
			self._sessionManager.deleteSticky(sticky.id);
			self._hideEditor();
        })
	}

	_hideEditor() {
		this._editElm.classList.toggle('hidden', true)
	}

    connectedCallback() {
		//this.refresh()

		this.setCanvasListeners();
		this.setToolbarListeners();
		this.setEditorListeners();
		this._hideEditor();
    }


}  // END SessionPage

customElements.define(SessionPage.is, SessionPage);
    
export default SessionPage;    