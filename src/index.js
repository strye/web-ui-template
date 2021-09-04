import DM from './dm.js'
import './components/elementImports.js'


document.addEventListener('DOMContentLoaded', event => {
    let pageManager = document.getElementById('pageManager'),
    homeElm = DM.Target(pageManager.pages.home.elm),
    homeLnk = document.getElementById('gotoHome');

    homeElm.listen('select', e=>{
        let page = e.detail;
        pageManager.switchPage(page);
    })

    homeLnk.listen('click', e=>{
        pageManager.switchPage('home');
    });

})

