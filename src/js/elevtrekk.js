const { SSL_OP_NETSCAPE_CA_DN_BUG } = require("constants");

// Henter lagret data
const Store = require('electron-store');
const store = new Store();
let data = store.store.data_klasser;

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
    bunke.onclick = () => {
        if (!(bunke.classList.contains('disabled'))) trekk();
    };
    bunke.onmouseover = () => { $('#spm_tegn').style.height = '88px' };
    bunke.onmouseout = () => { $('#spm_tegn').style.height = '80px' };
    antall_elever.oninput = () => {
        bare2siffer();
        if (antall_elever.value == 1) $('#elevertxt').innerHTML = 'elev';
        else $('#elevertxt').innerHTML = 'elever';
    }
    onkeydown = (evt) => {    // hvis brukeren trykker på enter
        if (evt.keyCode === 13 && !(bunke.classList.contains('disabled'))) {
                trekk();
        }
    }
    $('#bare_tilstedevaerende').onclick =
        $('#uten_tilbakelegging').onclick =
        $('#nytt_trekk').onclick =
        tilbakestill;

    onresize = flytt_elever;    // midtstiller elever 
    // gjør at man ikke kan trykke tilbake med nettleser-navigering
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
        history.pushState(null, null, document.URL);
    });
}

function initialiser() {
    if (!$('#uten_tilbakelegging').checked) {      // trekk med tilbakelegging
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
            bunke.classList.remove('full');
            bunke.classList.add('tom');
        }
    }, 100);
}

function tilbakestill() {
    // tilbakestiller kortbunke
    bunke.innerHTML = '<span id="spm_tegn">?</span>';
    bunke.classList.remove('tom');
    bunke.classList.add('full');
    // trekker inn eventuelle elever
    trekk_inn(bunke.offsetLeft, bunke.offsetTop, false);

    $('#nytt_trekk').hidden = true;
    bunke.classList.remove('disabled');     // reaktiverer trekknapp
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
    else if (+antall_elever.value > jobbeliste_elever.length) {
        antall_elever.value = jobbeliste_elever.length; // ved overskridelse
    }
    bunke.classList.add('disabled');    // deaktiverer trekknapp
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
                bunke.classList.remove('disabled');  // reaktiverer trekknapp
        }, 1900);
    } else {    // hvis bordet var tomt
        trekk_elever(x_bunke, y_bunke);
        setTimeout(() => {
            if (jobbeliste_elever.length > 0)
                bunke.classList.remove('disabled');  // reaktiverer trekknapp
        }, 1000);
    }
}

function trekk_elever(x_bunke, y_bunke) {
    let em = $('#elev_utvalg');
    if (jobbeliste_elever.length === 0) {
        em.innerHTML = '<div><h3>Tomt for elever!</h3></div>';   // bare unntaksvis
        return;
    }
    let antall = +antall_elever.value;
    for (var i = 0; i < antall; i++) {
        // tilfeldig trekk av elev fra klasse
        let tilfeldig_index = Math.floor((Math.random() * jobbeliste_elever.length));
        let tilfeldig_trukket_elev = jobbeliste_elever[tilfeldig_index];
        jobbeliste_elever.splice(tilfeldig_index, 1);

        // generer elevkort
        let elevkort = document.createElement('div');
        elevkort.innerHTML = tilfeldig_trukket_elev;
        elevkort.className = 'elevkort';
        elevkort.style.left = (x_bunke - justering) + 'px';
        elevkort.style.top = (y_bunke + justering) + 'px';
        elevkort.style.transform = 'rotate(-90deg)';
        elevkort.title = tilfeldig_trukket_elev;
        em.appendChild(elevkort);
        let [flytt_x, flytt_y] = posisjon_og_sentrering(i + 1, antall, elevkort);

        setTimeout(() => {  // venter for å være sikker på at elementet er 'etablert'
            elevkort.style.transform = 'translate(' + flytt_x + 'px, ' + flytt_y + 'px)';
        }, 100);
    }
    // for margin nederst, legger til usynlig element
    let margin_y = (Math.floor((antall-1) / 3) + 3) * ett_hakk_y - 45;
    let margin = document.createElement('div');
    margin.className = 'elevkort';
    margin.style.left = x_bunke + 'px';
    margin.style.top = (y_bunke + margin_y) + 'px';
    margin.style.height = '50px';
    margin.style.zIndex = -1000;
    margin.style.backgroundColor = margin.style.color = 'transparent';
    margin.style.border = 'none';
    em.appendChild(margin);

    initialiser();  // reinitialiserer
}

function posisjon_og_sentrering(nr, antall, elev) {
    // finner hvilken rad og kolonne elevkortene skal til
    let flytt_x = -ett_hakk_x;  // første kolonne
    if ((nr + 1) % 3 === 0) flytt_x = 0;   // andre kolonne
    else if (nr % 3 === 0) flytt_x = ett_hakk_x;    // tredje
    // hvis elevkortene er de siste til å bli trukket ut, sentrerer dem riktig
    if (nr + 1 === antall && (nr + 2) % 3 === 0) flytt_x = -ett_hakk_x / 2 // nest siste, første kolonne
    else if (nr === antall) {
        if ((nr + 2) % 3 === 0) flytt_x = 0;  // siste, første kolonne
        else if ((nr + 1) % 3 === 0) flytt_x = ett_hakk_x / 2;    // siste, andre kolonne
    }
    let rad_nr = Math.floor((nr - 1) / 3) + 1;
    let flytt_y = ett_hakk_y * rad_nr + 100; // 100: klarering fra bunke og knapp

    return [flytt_x, flytt_y];
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
            elev.style.left = (x - justering) + 'px';
            elev.style.top = (y + justering) + 'px';
            elev.style.transform = 'rotate(90deg)';
        }
    }
    // sjekker om det var elever som måtte trekkes inn
    if ($('#elev_utvalg').innerHTML === '') return false;
    else {
        setTimeout(() => {
            $('#elev_utvalg').innerHTML = '';
        }, 1000);
        return true;
    }
}

function flytt_elever() {
    let x_bunke = bunke.offsetLeft; // finner posisjon til bunke
    let elevkort = $('.elevkort');
    for (const elev of elevkort) elev.style.left = (x_bunke - justering) + 'px';
}

function bare2siffer() {  // lar det til en hver tid bare være to siffer i input
    let antall = antall_elever.value;
    if (antall.length > 2) {
        antall_elever.value = antall.substr(antall.length - 2);
    }
}
