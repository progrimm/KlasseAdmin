// Henter data fra fil
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require("constants");
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));
// henter klasse fra session storage
const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
const klasse = valgtKlasse.klassekode;
const elever = valgtKlasse.elever;
const alle_elever = data[klasse].elever;
let jobbeliste_elever = elever.slice(0);  // liste som det kan slettes elever fra under utvalg

const ett_hakk_x = 170;
const ett_hakk_y = 120;
let justering = 26;

document.title = 'KlasseAdmin - ' + valgtKlasse.klassekode + " - Tilfeldig elevtrekk";
window.onload = () => {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);
    
    initialiser();
    bunke = $('#bunkekort');
    antall_elever = $('#antall_elever');
    antall_elever.focus();  // fokuserer på inputfeltet
    $('#klasse').innerHTML = klasse;
    // lyttere
    $('#btn_elever').onclick = () => {
        if ($('#btn_elever').className === 'btn') trekk()
    };
    antall_elever.oninput = bare2siffer;
    onkeydown = function (evt) {    // hvis brukeren trykker på enter
        if (evt.keyCode === 13 && antall_elever === document.activeElement) {
            if ($('#btn_elever').className === 'btn') {
                trekk()
            }
        }
    }
    $('#bare_tilstedevaerende').onclick = 
    $('#uten_tilbakelegging').onclick = 
        tilbakestill;
    $('#nytt_trekk').onclick = () => {
        // $('#elev_utvalg').innerHTML='';
        tilbakestill();
    }
    onresize = flytt_elever;
}

function initialiser() {
    if ( ! $('#uten_tilbakelegging').checked) {      // trekk med tilbakelegging
        // oppdaterer liste for hvert trekk
        if ($('#bare_tilstedevaerende').checked) {  // hvis bare tilstedeværende elever skal trekkes
            jobbeliste_elever = elever.slice(0);
        } else jobbeliste_elever = alle_elever.slice(0);
    }
    setTimeout(() => {
        $('#elevantall').innerHTML = jobbeliste_elever.length;        
        if (jobbeliste_elever.length === 0 && $('#uten_tilbakelegging').checked) {
            $('#elevantall').style.color = 'var(--red)';
            $('#nytt_trekk').hidden = false;
            // viser at bunken er tom;
            bunke.innerHTML = '<span>Tomt!</span>';
            bunke.style.backgroundColor = '#e6e5ec';    // backgroundColor
            bunke.style.borderStyle = 'dashed';
            bunke.style.color = 'black';
            bunke.style.fontSize = '24px';
            bunke.style.zIndex = '-100';
        }
    }, 100);
}

function tilbakestill() {
    // tilbakestiller kortbunke
    bunke.innerHTML = '<span>?</span>';
    bunke.style.backgroundColor = '#557a95';    // headerColor
    bunke.style.borderStyle = 'solid';
    bunke.style.color = 'white';
    bunke.style.fontSize = '48px';
    bunke.style.zIndex = '100';
    // trekker inn eventuelle elever
    trekk_inn(bunke.offsetLeft, bunke.offsetTop, false);    
    
    $('#nytt_trekk').hidden = true;
    $('#btn_elever').className = 'btn';  // reaktiverer trekknapp
    if ($('#bare_tilstedevaerende').checked) {  // hvis bare tilstedeværende elever skal trekkes
        jobbeliste_elever = elever.slice(0);
    } else jobbeliste_elever = alle_elever.slice(0);
    $('#elevantall').innerHTML = jobbeliste_elever.length;
    
    if ($('#uten_tilbakelegging').checked) {
        $('#elevantall').style.color = 'black';
    } else $('#elevantall').style.color = '#bbb';   // viser at antall er fast
}

function trekk() {
    if (+antall_elever.value === 0) return;
    $('#btn_elever').className = 'btn btn-disabled';   // deaktiverer trekknapp
    // finner posisjon til bunke
    let x_bunke = bunke.offsetLeft;
    let y_bunke = bunke.offsetTop;
    // trekker inn eventuelle elever og trekker nye
    if (trekk_inn(x_bunke, y_bunke)) { // hvis det var elevkort på bordet
        setTimeout(() => {
            trekk_elever(x_bunke, y_bunke);
        }, 1010);
        setTimeout(() => {
            if (jobbeliste_elever.length > 0)
                $('#btn_elever').className = 'btn';  // reaktiverer trekknapp
        }, 1900);
    } else {    // hvis bordet var tomt
        trekk_elever(x_bunke, y_bunke);
        setTimeout(() => {
            if (jobbeliste_elever.length > 0)
                $('#btn_elever').className = 'btn';  // reaktiverer trekknapp
        }, 1000);
    }
}

function trekk_elever(x_bunke, y_bunke) {
    let em = $('#elev_utvalg');
    if (jobbeliste_elever.length === 0) {
        em.innerHTML ='<div><h3>Tomt for elever!</h3></div>';   // bare unntaksvis
        return;
    }

    // hvis valgt antall overskrider antall elever, blir antallet maks antall elever
    let antall = (+antall_elever.value < jobbeliste_elever.length ? +antall_elever.value : jobbeliste_elever.length);
    for (var i=0; i<antall; i++) {
        // tilfeldig trekk av elev fra klasse
        let tilfeldig_index = Math.floor((Math.random() * jobbeliste_elever.length));
        let tilfeldig_trukket_elev = jobbeliste_elever[tilfeldig_index];
        jobbeliste_elever.splice(tilfeldig_index,1);
        
        // generer elevkort
        let elevkort = document.createElement('div');
        elevkort.innerHTML = tilfeldig_trukket_elev;
        elevkort.className = 'elevkort';
        elevkort.style.left = (x_bunke - justering)+'px';
        elevkort.style.top = (y_bunke + justering)+'px';
        elevkort.style.transform = 'rotate(-90deg)';
        em.appendChild(elevkort);
        // finner avstand som kortet skal flyttes
        let flytt_x = -ett_hakk_x;  // første kolonne
        let nr = i+1;
        if ((nr+1) % 3 === 0) flytt_x = 0;   // andre kolonne
        else if (nr % 3 === 0) flytt_x = ett_hakk_x;    // tredje
        // hvis elevkortene er de siste til å bli trukket ut, sentrerer dem riktig
        if (nr+1 === antall && (nr+2) % 3 === 0) flytt_x = -ett_hakk_x / 2
        else if (nr === antall) {
            if ((nr+2) % 3 === 0) flytt_x = 0;
            else if ((nr+1) % 3 === 0) flytt_x = ett_hakk_x / 2;
        }
        let rad_nr = Math.floor((nr-1) /3) + 1;
        let flytt_y = ett_hakk_y * rad_nr + 100; // 30: klarering fra bunke
        
        setTimeout(() => {  // for å være sikker på at elementet er 'etablert'
            elevkort.style.transform = 'translate('+flytt_x+'px, '+flytt_y+'px)';
        }, 100);
    }
    initialiser();  // reinitialiserer
}

function trekk_inn(x, y, ut = true) {   // x, y = x_bunke, y_bunke
    let elevkort = $('.elevkort');
    if ($('#uten_tilbakelegging').checked && ut) {  // kortet går til siden hvis det er uten tilbakelegging
        for (const elev of elevkort) {
            elev.style.left = '-330px';
            elev.style.opacity = '0'; 
        }
    } else {    // tilbake til bunken
        for (const elev of elevkort) {
            elev.style.left = (x - justering)+'px';
            elev.style.top = (y + justering)+'px';
            elev.style.transform = 'rotate(90deg)'; 
        }
    }
    // sjekker om det var elever som måtte trekkes inn
    if ($('#elev_utvalg').innerHTML === '') return false;
    else {
        setTimeout(() => {
            $('#elev_utvalg').innerHTML ='';
        }, 1000);
        return true;
    }
}

function flytt_elever() {
    let x_bunke = bunke.offsetLeft; // finner posisjon til bunke
    let elevkort = $('.elevkort');
    for (const elev of elevkort) elev.style.left = (x_bunke - justering)+'px';
}

function bare2siffer() {  // lar det til en hver tid bare være to siffer i input
    let antall = antall_elever.value;
    if (antall.length > 2) {
        antall_elever.value = antall.substr(antall.length - 2);
    }
}
