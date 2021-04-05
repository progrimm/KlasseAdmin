var antall_elever;
var nytt_em;
var tilfeldig_valgt_elev;
var tilfeldig_index;
var jobbe_liste_elever;     // liste som det kan slettes elever fra under utvalg
var em;

function oppstart_velg_elev() {
    antall_elever = document.getElementById('antall_elever');
    antall_elever.focus();  // fokuserer på inputfeltet
    document.getElementById('btn_elever').onclick = velg_elever;
    onkeydown = function (evt) {    // hvis brukeren trykker på enter
        if (evt.keyCode === 13 && antall_elever === document.activeElement) velg_elever();
    }
}

function velg_elever() {
    em = document.getElementById('elev_utvalg');
    while (em.lastChild) em.removeChild(em.lastChild);   // sletter alle child-elements
    // lager egen liste av elever til å hente og slette elementer fra
    jobbe_liste_elever = testClass.slice(0);
    antall = (+antall_elever.value < testClass.length ? +antall_elever.value : testClass.length);

    for (var i=0; i<antall; i++) {
        tilfeldig_index = Math.floor((Math.random() * jobbe_liste_elever.length));  // tilfeldig valg av 
        tilfeldig_valgt_elev = jobbe_liste_elever[tilfeldig_index];                 // elev fra klasse
        jobbe_liste_elever.splice(tilfeldig_index,1);
        // genererer nytt element
        nytt_em = document.createElement('div');
        nytt_em.innerHTML = "<h3 class='text-primary mb-3'>"+tilfeldig_valgt_elev+"</h3>";   
        nytt_em.className = 'col-3 p-1';
        document.getElementById('elev_utvalg').appendChild(nytt_em);
    }
}
