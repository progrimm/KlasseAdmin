let klokka_gaar = false


window.onload = () => {
    nedteller =$('#nedteller');
    start_stopp = $('#start_stopp');
    start_stopp.onlick = start_eller_stopp;
    
}

function start_eller_stopp() {
    if (klokka_gaar) {
        // sette nedtelling på pause

        klokka_gaar = false;
    } else {
        // starte/fortsette nedtelling
        
        klokka_gaar = true;
    }
}