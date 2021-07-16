// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));
// henter klasse fra session storage
const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
const klasse = valgtKlasse.klassekode;
const elever = valgtKlasse.elever;
const alle_elever = data[klasse].elever;
jobbeliste_elever = elever.slice(0);  // liste som det kan slettes elever fra under utvalg

document.title = 'KlasseAdmin - ' + valgtKlasse.klassekode + " - Tilfeldig elevvalg";
window.onload = () => {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);
    
    $('#klasse').innerHTML = klasse;
    antall_elever = $('#antall_elever');
    antall_elever.focus();  // fokuserer på inputfeltet
    // lyttere
    $('#btn_elever').onclick = velg_elever;
    onkeydown = function (evt) {    // hvis brukeren trykker på enter
        if (evt.keyCode === 13 && antall_elever === document.activeElement) velg_elever();
    }
    $('#bare_tilstedevaerende').onclick = 
    $('#uten_tilbakelegging').onclick = 
    $('#nytt_valg').onclick = 
        reinitialiser;
}

function reinitialiser() {
    $('#elev_utvalg').innerHTML='';
    $('#nytt_valg').hidden = true;
    jobbeliste_elever = alle_elever.slice(0);
        if ($('#bare_tilstedevaerende').checked) {      // hvis bare tilstedeværende elever skal velges
            jobbeliste_elever = elever.slice(0);
        }
    if($('#uten_tilbakelegging').checked) {
        // ved valg uten tilbakelegging, skriver ut antall elever igjen
        $('#elevantall').innerHTML='Antall elever igjen: '+jobbeliste_elever.length;
    } else $('#elevantall').innerHTML='';
}

function velg_elever() {
    let em = $('#elev_utvalg');
    em.innerHTML ='';
    if (jobbeliste_elever.length === 0) {
        em.innerHTML ='Tomt for elever!';
        $('#nytt_valg').hidden = false;
        return;
    }
    // hvis valgt antall overskrider antall elever, blir antallet maks antall elever
    let antall = (+antall_elever.value < jobbeliste_elever.length ? +antall_elever.value : jobbeliste_elever.length);
    for (var i=0; i<antall; i++) {
        let tilfeldig_index = Math.floor((Math.random() * jobbeliste_elever.length));  // tilfeldig valg av 
        let tilfeldig_valgt_elev = jobbeliste_elever[tilfeldig_index];                 // elev fra klasse
        jobbeliste_elever.splice(tilfeldig_index,1);
        // genererer nytt element
        let nytt_em = document.createElement('div');
        nytt_em.innerHTML = "<h3>"+tilfeldig_valgt_elev+"</h3>";   
        em.appendChild(nytt_em);
    }
    
    // MÅ SMELTES SAMMEN MED INIT FUNC
    // valg uten tilbakelegging
    if ($('#uten_tilbakelegging').checked) {
        $('#elevantall').innerHTML='Antall elever igjen: '+jobbeliste_elever.length;
    } else {    // med tilbakelegging
        // oppdaterer liste for hvert valg
        jobbeliste_elever = alle_elever.slice(0);
        if ($('#bare_tilstedevaerende').checked) {      // hvis bare tilstedeværende elever skal velges
            jobbeliste_elever = elever.slice(0);
        }
    }
}
