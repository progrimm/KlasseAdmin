// Henter data fra fil
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

document.title = 'KlasseAdmin - ' + valgtKlasse.klassekode + " - Tilfeldig elevvalg";
window.onload = () => {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);
    
    initialiser();
    bunke = $('#bunkekort');
    antall_elever = $('#antall_elever');
    antall_elever.focus();  // fokuserer på inputfeltet
    $('#klasse').innerHTML = klasse;
    // lyttere
    $('#btn_elever').onclick = valg;
    antall_elever.oninput = bare2siffer;
    onkeydown = function (evt) {    // hvis brukeren trykker på enter
        if (evt.keyCode === 13 && antall_elever === document.activeElement) {
            if( ! $('#btn_elever').disabled) {
                valg()
            }
        }
    }
    $('#bare_tilstedevaerende').onclick = 
    $('#uten_tilbakelegging').onclick = 
        tilbakestill;
    $('#nytt_valg').onclick = () => {
        // $('#elev_utvalg').innerHTML='';
        tilbakestill();
    }
    onresize = flytt_elever;
}

function initialiser() {
    if( ! $('#uten_tilbakelegging').checked) {      // valg med tilbakelegging
        // oppdaterer liste for hvert valg
        if ($('#bare_tilstedevaerende').checked) {  // hvis bare tilstedeværende elever skal velges
            jobbeliste_elever = elever.slice(0);
        } else jobbeliste_elever = alle_elever.slice(0);
    }
    $('#elevantall').innerHTML = jobbeliste_elever.length;
}

function tilbakestill() {
    $('#nytt_valg').hidden = true;
    if ($('#bare_tilstedevaerende').checked) {  // hvis bare tilstedeværende elever skal velges
        jobbeliste_elever = elever.slice(0);
    } else jobbeliste_elever = alle_elever.slice(0);
    $('#elevantall').innerHTML = jobbeliste_elever.length;
    
    if($('#uten_tilbakelegging').checked) {
        $('#elevantall').style.color = 'black';
    } else $('#elevantall').style.color = 'gray';   // viser at antall er fast
    // if ($('#elev_utvalg').innerHTML ==='<div><h3>Tomt for elever!</h3></div>') {
    //     $('#elev_utvalg').innerHTML ='';
    // }
}

function valg() {
    if(+antall_elever.value === 0) return;
    $('#btn_elever').disabled = true;   // deaktiverer valgknapp
    // finner posisjon til bunke
    let x_bunke = bunke.offsetLeft;
    let y_bunke = bunke.offsetTop;
    // trekker inn eventuelle elever
    trekk_inn(x_bunke, y_bunke);    
    // trekker nye elever
    if ($('#elev_utvalg').innerHTML === '') { // hvis bordet er tomt
        velg_elever(x_bunke, y_bunke);
        setTimeout(() => {
            $('#btn_elever').disabled = false;  // reaktiverer valgknapp
        }, 1000);
    } else {    // hvis det er elever å trekke inn
        setTimeout(() => {
            $('#elev_utvalg').innerHTML ='';
        }, 1000);
        setTimeout(() => {
            velg_elever(x_bunke, y_bunke);
        }, 1010);
        setTimeout(() => {
            $('#btn_elever').disabled = false;  // reaktiverer valgknapp
        }, 1900);
    }
}

function velg_elever(x_bunke, y_bunke) {

    // let em = $('#elev_utvalg');
    // em.innerHTML ='';
    // if (jobbeliste_elever.length === 0) {
    //     em.innerHTML ='<div><h3>Tomt for elever!</h3></div>';
    //     return;
    // }


    // hvis valgt antall overskrider antall elever, blir antallet maks antall elever
    let antall = (+antall_elever.value < jobbeliste_elever.length ? +antall_elever.value : jobbeliste_elever.length);
    for (var i=0; i<antall; i++) {
        // tilfeldig valg av elev fra klasse
        let tilfeldig_index = Math.floor((Math.random() * jobbeliste_elever.length));
        let tilfeldig_valgt_elev = jobbeliste_elever[tilfeldig_index];
        jobbeliste_elever.splice(tilfeldig_index,1);
        
        // generer elevkort
        let elevkort = document.createElement('div');
        elevkort.innerHTML = tilfeldig_valgt_elev;
        elevkort.className = 'elevkort';
        elevkort.style.left = (x_bunke-26)+'px';
        elevkort.style.top = (y_bunke+26)+'px';
        elevkort.style.transform = 'rotate(-90deg)';
        $('#elev_utvalg').appendChild(elevkort);
        // finner avstand som kortet skal flyttes
        let flytt_x = -ett_hakk_x;  // første kolonne
        let nr = i+1;
        if((nr+1) % 3 === 0) flytt_x = 0;   // andre kolonne
        else if (nr % 3 === 0) flytt_x = ett_hakk_x;    // tredje

        let rad_nr = Math.floor((nr-1) /3) + 1;
        let flytt_y = ett_hakk_y * rad_nr + 30; // 30: klarering fra bunke
        
        setTimeout(() => {
            elevkort.style.transform = 'translate('+flytt_x+'px, '+flytt_y+'px)';
        }, 100);
    }
    if (jobbeliste_elever.length === 0 && $('#uten_tilbakelegging').checked)
        $('#nytt_valg').hidden = false;

    initialiser();  // reinitialiserer
}

function trekk_inn(x, y) {
    let elevkort = $('.elevkort');
    if($('#uten_tilbakelegging').checked) {
        for (const elev of elevkort) {
            elev.style.left = '-330px';
            elev.style.opacity = '0'; 
        }
    } else {
        for (const elev of elevkort) {
            elev.style.left = (x-26)+'px';
            elev.style.top = (y+26)+'px';
            elev.style.transform = 'rotate(90deg)'; 
        }
    }
}

function flytt_elever() {
    // finner posisjon til bunke
    let x_bunke = bunke.offsetLeft;

    let elevkort =$('.elevkort');
    for (const elev of elevkort) {
        elev.style.left = (x_bunke-26)+'px';
    }
}

function bare2siffer() {  // lar det til en hver tid bare være to siffer i input
    let antall = antall_elever.value;
    if (antall.length > 2) {
        antall_elever.value = antall.substr(antall.length - 2);
    }
}
