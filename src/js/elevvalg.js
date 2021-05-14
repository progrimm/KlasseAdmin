// se 'kodehjelp.js' for forklaring på skriving/lesing av fil
const valgtKlasse = sessionStorage.getItem("valgtKlasse");
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
var data = JSON.parse(fs.readFileSync(dataFilename));
elever = data[valgtKlasse].elever;

window.onload = () => {
    antall_elever = document.getElementById('antall_elever');
    antall_elever.focus();  // fokuserer på inputfeltet
    document.getElementById('btn_elever').onclick = velg_elever;
    onkeydown = function (evt) {    // hvis brukeren trykker på enter
        if (evt.keyCode === 13 && antall_elever === document.activeElement) velg_elever();
    }
}

function velg_elever() {
    let em = document.getElementById('elev_utvalg');
    while (em.lastChild) em.removeChild(em.lastChild);   // sletter alle child-elements
    // lager egen liste av elever til å hente og slette elementer fra
    let jobbe_liste_elever = elever.slice(0);    // liste som det kan slettes elever fra under utvalg
    let antall = (+antall_elever.value < elever.length ? +antall_elever.value : elever.length);

    for (var i=0; i<antall; i++) {
        let tilfeldig_index = Math.floor((Math.random() * jobbe_liste_elever.length));  // tilfeldig valg av 
        let tilfeldig_valgt_elev = jobbe_liste_elever[tilfeldig_index];                 // elev fra klasse
        jobbe_liste_elever.splice(tilfeldig_index,1);
        // genererer nytt element
        let nytt_em = document.createElement('div');
        nytt_em.innerHTML = "<h3>"+tilfeldig_valgt_elev+"</h3>";   
        document.getElementById('elev_utvalg').appendChild(nytt_em);
    }
}
