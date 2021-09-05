import DM from './dm.js'
import './components/elementImports.js'
import css from "./styles/app.css";

document.addEventListener('DOMContentLoaded', event => {
    let pageManager = document.getElementById('pageManager'),
    homeElm = DM.Target(pageManager.pages.home.elm),
    homeLnk = document.getElementById('gotoHome');

    homeElm.listen('select', e=>{
        let page = e.detail;
        pageManager.switchPage(page);
    })

    homeLnk.addEventListener('click', e=>{
        pageManager.switchPage('home');
    });

})

