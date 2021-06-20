// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));
// henter klasse fra session storage
const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
const klasse = valgtKlasse.klassekode;
const elever = valgtKlasse.elever;
const alle_elever = data[klasse].elever;

document.title = valgtKlasse.klassekode + " - Tilfeldig elevvalg";
window.onload = () => {
    $('#klasse').innerHTML =`Klasse: ${klasse}`;
    antall_elever = $('#antall_elever');
    antall_elever.focus();  // fokuserer på inputfeltet
    $('#btn_elever').onclick = velg_elever;
    onkeydown = function (evt) {    // hvis brukeren trykker på enter
        if (evt.keyCode === 13 && antall_elever === document.activeElement) velg_elever();
    }
}

function velg_elever() {
    let jobbe_liste_elever = alle_elever.slice(0);      // liste som det kan slettes elever fra under utvalg
    if ($('#bare_tilstedevaerende').checked) {        // hvis bare tilstedeværende elever skal velges
        jobbe_liste_elever = elever.slice(0);
    }
    let em = $('#elev_utvalg');
    while (em.lastChild) em.removeChild(em.lastChild);  // sletter alle child-elements
    let antall = (+antall_elever.value < jobbe_liste_elever.length ? +antall_elever.value : jobbe_liste_elever.length);

    for (var i=0; i<antall; i++) {
        let tilfeldig_index = Math.floor((Math.random() * jobbe_liste_elever.length));  // tilfeldig valg av 
        let tilfeldig_valgt_elev = jobbe_liste_elever[tilfeldig_index];                 // elev fra klasse
        jobbe_liste_elever.splice(tilfeldig_index,1);
        // genererer nytt element
        let nytt_em = document.createElement('div');
        nytt_em.innerHTML = "<h3>"+tilfeldig_valgt_elev+"</h3>";   
        $('#elev_utvalg').appendChild(nytt_em);
    }
}
