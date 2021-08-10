// Henter lagret data
const Store = require('electron-store');
const store = new Store();
let data = store.store.data_klasser;
let vis_varsel = store.store.data_varsel.fravaer_varsel;

const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse")); // Henter valgt klasse
const tilstede_elever = valgtKlasse.elever; // henter elever som er tilstede
const alle_elever = data[valgtKlasse.klassekode].elever; // Henter alle elevene i klassa

document.title = 'KlasseAdmin - ' + valgtKlasse.klassekode;


window.onload = () => {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);
    
    document.getElementById("overskrift").innerHTML = (valgtKlasse["klassekode"]);
    // gjør at man ikke kan trykke tilbake med nettleser-navigering
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
        history.pushState(null, null, document.URL);
    });
    
    $('#h2-msg').innerHTML = 'Gå ut av '+valgtKlasse.klassekode+'?';
    // lyttere
    $('#warning-confirm').onclick = () => {
        if ($('#ikke_vis_varsel').checked) {
            vis_varsel = false; // momentan endring, strengt tatt ikke nødvendig her
            store.set('data_varsel.fravaer_varsel', false); // viser ikke varsler lenger hvis bruker krysser av for det
        }
        $('#ikke_vis_varsel').checked = false;
        window.location = 'index.html';
    }
    if (!(tilstede_elever.length === alle_elever.length) && vis_varsel) {   // hvis det er ført fravær og varselet ikke har blitt deaktivert
        $('#back').onclick = () => {
            $("#warning-shade").style.display = "block";
        }
    }
}

