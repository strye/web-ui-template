import DM from './dm.js'
import './components/elementImports.js'


document.addEventListener('DOMContentLoaded', event => {
    let pageManager = document.getElementById('pageManager'),
    homeElm = DM.Target(pageManager.pages.home.elm),
    sessionElm = DM.Target(pageManager.pages.session.elm);

    homeElm.listen('select', e=>{
        let sess = e.detail;
        //console.log(`session seleceted: "${sess.title}"`)
        pageManager.switchPage('session');
        sessionElm.elm.sessionData = sess;
    })

    sessionElm.listen('nav:home', e=>{
        //console.log('nav:home', e)
        pageManager.switchPage('home');
    });

})

