let perBord, rader, kolonner;  // Globale variabler

// Hører til byttPlass
let antallKlikk = 0;
let elev1ID;

let snudd = false; // Om kartet er snudd eller ikke
let fullskjerm = false // Om kartet er i fullskjerm eller ikke

// Henter lagret data
const Store = require('electron-store');
const store = new Store();
let data = store.store.data_klasser;
let vis_varsel = store.store.data_varsel.nytt_klassekart_varsel;

const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse")); // Henter valgte klassa
let klasse = data[valgtKlasse.klassekode]; // Henter objektet fra data
let elever = klasse["elever"]; // Henter elevene
let klassekart = klasse["klassekart"]; // Henter klassekartet
let utdatert_kart = klasse["utdatert_kart"];

document.title = 'KlasseAdmin - ' + valgtKlasse.klassekode + " - Klassekart";

// Løsning for når klassekart er større enn vinduet
window.onscroll = () => {
    let sLeft = this.scrollX; // Endrer leseretning når scrollbar er mot midten
    if (document.body.style.direction === "rtl") {
        if (sLeft >= 0) {
            // Alle elementer fra venstre til høyre
            // Scrollbar mot høyre fra midten
            for (element of [...document.getElementsByTagName("*")]) {
                element.style.direction = "ltr";
            };
            document.body.style.direction = "ltr";
        }
    }
    else {
        if (sLeft <= 0) {
            // Alle elementer utenom selve body (som inkluderer scrollbar) leses fra venstre til høyre
            // Scrollbar mot venstre fra midten
            for (element of [...document.getElementsByTagName("*")]) {
                element.style.direction = "ltr";
            };
            document.body.style.direction = "rtl";
        }
    }
}

// Hvis zooming av kartet er på, skaler automatisk
window.addEventListener("resize", () => {
    if (fullskjerm === true) {
        skalerKart();
    }
})

window.onload = () => {
    includeHTML();

    // Ikke vis NB om kart ikke er utdatert
    if (utdatert_kart === false) {
        $("#advarsel_utdatert").style.display = "none";
    }

    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);

    hentKlasse();

    // Vise modal
    $("#btnVisModalStruktur").onclick = () => {
        $("#modalStrukturKlassekart").style.display = "block";
    }

    $("#btnVisModalStrukturNyttKart").onclick = () => {
        $("#modalStrukturKlassekart").style.display = "block";
    }

    $("#btnLukkModal").onclick = () => {
        $("#modalStrukturKlassekart").style.display = "none";
    }

    $("#btnNyttKlassekart").onclick = () => {
        // Viser kun modal om klassekart finnes fra før eller bruker ikke har deaktivert varsel
        if (klassekart.length === 0 || !vis_varsel) {
            nyttKlassekart();
        }
        else {
            $("#warning-shade").style.display = "initial";
            $("#modalStrukturKlassekart").style.display = "none";
        }
    }

    $("#warning-confirm").onclick = () => {
        if ($('#ikke_vis_varsel').checked) {
            vis_varsel = false; // momentan endring
            store.set('data_varsel.nytt_klassekart_varsel', false)  // viser ikke varsler lenger hvis bruker krysser av for det
        }
        $('#ikke_vis_varsel').checked = false;
        $("#warning-shade").style.display = "none";
        nyttKlassekart();
    }

    $("#warning-deny").onclick = () => {
        $("#warning-shade").style.display = "none";
        $("#modalStrukturKlassekart").style.display = "block";
    }

    $("#btnSnuKlassekart").onclick = aktiverSnuKlassekart;

    // Lukk modal ved trykk utenfor innholdet
    window.onmousedown = (evt) => {
        if (evt.target == $("#modalStrukturKlassekart")) {
            $("#modalStrukturKlassekart").style.display = "none";
        }
    }

    $("#btnLagreEndringer").onclick = lagrePlassbytter;

    $("#btnFjerneEndringer").onclick = () => {
        $("#btnLagreEndringer").classList = "btn btn-disabled";
        $("#btnFjerneEndringer").classList = "btn btn-danger btn-disabled";
        visKlassekart();
    }
    // gjør at man ikke kan trykke tilbake med nettleser-navigering
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
        history.pushState(null, null, document.URL);
    });
}

function fjern_advarsel_utdatert() {
    $("#advarsel_utdatert").style.display = "none";
    klasse["utdatert_kart"] = false; // Midlertidig endring av data (venter på direkte endring gjennom egen funksjon). For funksjonen nyttKlassekart.
    store.set(`data_klasser.${valgtKlasse.klassekode}.utdatert_kart`, false); // Direkte endring (momentan)
}

function aktiverSnuKlassekart() {
    $("#tableKlassekart").style.transform = "scaleY(0)";

    // Deaktiverer knappen og all trykking
    $('#btnSnuKlassekart').className = 'btn btn-disabled';

    // Etter 750 ms, altså transitionstiden til klassekartet er skalert bort, snus kartet, før det blir skalert tilbake
    setTimeout(() => {
        // Endrer på litt verdier i css
        if (snudd === true) {
            $("#tableKlassekart").style.paddingTop = "initial";
            $("#tableKlassekart").style.paddingBottom = "61px";
        } else {
            $("#tableKlassekart").style.paddingTop = "61px";
            $("#tableKlassekart").style.paddingBottom = "initial";
        }

        snuKlassekart();

        $("#tableKlassekart").style.transform = "";
        $('#btnSnuKlassekart').className = 'btn';
    }, 750);
}

// Henter info om valgt klasse og viser eventuelt eksisterende kart, samt initialiserer noen variabler
function hentKlasse() {

    // Sjekker om valgt klasse har klassekart fra før, eller om det må lages nytt
    if (klassekart.length === 0) {
        for (btn of [...$(".knapper")]) {
            btn.style.display = "none"
        };
        for (element of [...$(".toHide")]) {
            element.style.display = "none"
        };
        $("#btnVisModalStrukturNyttKart").style.display = "initial"; // Viser kun egen knapp for første klassekartet
    }

    // Viser klassekart om det finnes fra før
    else {
        // Setter verdiene i select-elementene for struktur til det som eksisterende klassekart har
        $("#inputEleverPerBord").value = klasse["klassekart_oppsett"]["per_bord"];
        $("#inputAntallKolonner").value = klasse["klassekart_oppsett"]["kolonner"];
        $("#inputAntallRader").value = klasse["klassekart_oppsett"]["rader"];
        visKlassekart();
    }
}

// Funksjon som begynner produksjonen av det nye klassekartet
function nyttKlassekart() {

    // Snur kartet tilbake til default før animasjon (unngå tukling med lagringa)
    if (snudd === true) {
        snuKlassekart();
        $("#tableKlassekart").style.transition = "0s"; // Skrur av animasjon
        $("#tableKlassekart").style.paddingTop = "initial";
        $("#tableKlassekart").style.paddingBottom = "61px";
        setTimeout(() => { $("#tableKlassekart").style.transition = "0.3s ease-in-out"; }, 1); // Skrur på igjen animasjon
    }

    // Vis alle elementene på siden
    for (btn of [...$(".knapper")]) {
        btn.style.display = "flex"
    };
    for (element of [...$(".toHide")]) {
        element.style.display = "initial"
    };

    // Utenom NB om kart ikke er utdatert
    if (utdatert_kart === false) {
        $("#advarsel_utdatert").style.display = "none";
    }

    $("#btnVisModalStrukturNyttKart").style.display = "none";

    // Henter strukturen klassekartet skal genereres på fra input-felt
    perBord = parseInt($("#inputEleverPerBord").value);
    rader = parseInt($("#inputAntallRader").value);
    kolonner = parseInt($("#inputAntallKolonner").value);

    elever = elever.filter(navn => navn !== "&nbsp"); // Fjerner de tomme plassene, slik at bare navnene gjenstår

    // Sjekker om strukturen oppgitt er gyldig
    if (rader * kolonner * perBord < elever.length) {
        $("#warning-shade").style.display = "none";
        $("#error-shade").style.display = "initial";
        return
    }

    elever = stokkElever(elever);  // Stokker elevene tilfeldig til klassekartet
    // Endrer data 
    klasse["klassekart"] = elever;
    klassekart = klasse["klassekart"] // Oppdaterer den globale variabelen klassekart
    klasse["klassekart_oppsett"]["per_bord"] = perBord + "";
    klasse["klassekart_oppsett"]["rader"] = rader + "";
    klasse["klassekart_oppsett"]["kolonner"] = kolonner + "";

    $("#modalStrukturKlassekart").style.display = "none"; // Skjuler modalen

    fjern_advarsel_utdatert();
    visKlassekart(true);  // Viser/lager det nye klassekartet ved default oppsett (derav nyGenerering = true)
    lagrePlassbytter(); // Lagrer kartet via lagrePlassbytter funksjonen (for å få med "&nbsp")
}

// Viser klassekartet i form av en tabell med knapper
function visKlassekart(nyGenerering) {

    // Henter strukturen
    perBord = klasse["klassekart_oppsett"]["per_bord"];
    rader = klasse["klassekart_oppsett"]["rader"];
    kolonner = klasse["klassekart_oppsett"]["kolonner"];

    $("#tableKlassekart").innerHTML = `<img onclick='fullskjermKart()' draggable="false" src="multimedia/expand-arrows.svg" id="btnFullskjermKart"/>`; // Rensker tidligere kart

    let laererbord = lagLaererbord(); // Lager plassen til læreren
    $("#tableKlassekart").appendChild(laererbord);

    let elevID = 0;  // Løpetall for elevene

    // Variabler for midtplasseringsalgoritme
    let eleverPerRad = kolonner * perBord;
    let antallElever = elever.length;
    let restElever = antallElever % eleverPerRad;

    for (let i = 0; i < rader; i++) {    // Lager tabell-struktur og setter inn elevene
        // Først radene som tabellrader
        let rad = document.createElement("tr");
        rad.id = "rad" + i;
        $("#tableKlassekart").appendChild(rad);

        // Så bordene som tabellceller
        for (let j = 0; j < kolonner; j++) {
            let bord = document.createElement("td");
            bord.id = "rad" + i + "kolonne" + j;
            $("#rad" + i).appendChild(bord);

            // Så elevene som knapper i tabellcellene
            for (let k = 0; k < perBord; k++) {
                let btnElev = document.createElement("button");
                btnElev.id = "rad" + i + "kolonne" + j + "nr" + k;
                btnElev.classList.add("elev");

                let elevNavn = klassekart[elevID];
                // Ved nytt kart
                if (nyGenerering) {
                    if (elevID >= antallElever - restElever) {
                        elevNavn = "&nbsp";
                    } else {
                        elevID++
                    }
                }
                // Ved allerede eksisterende kart
                else {
                    if (elevNavn === undefined) {
                        elevNavn = "&nbsp";
                    }
                    elevID++
                }
                btnElev.innerHTML = elevNavn;
                if (elevNavn !== "&nbsp;" && elevNavn !== "&nbsp") {
                    btnElev.title = "" + elevNavn;
                }
                btnElev.addEventListener("click", byttePlass);  // Legger til hendelseslytter på elevene så man kan bytte plasser
                $("#rad" + i + "kolonne" + j).appendChild(btnElev);
            }
        }
    }

    //
    // Algoritme for fordeling av elever fra midten på bakerste rad
    //
    if (nyGenerering) {
        let kolonneHopper = 1;
        let sisteRadNr = Math.floor(antallElever / eleverPerRad); // raden som jobbes på
        let startKolonne = Math.floor(kolonner / 2); // midtbordet
        let nr; // plass på bord (0/1/2)
        let kjoreNr = 0;
        while (restElever > 0) {
            // Ved 1 elev per bord
            if (Number(perBord) === 1) {
                plasserElev(sisteRadNr, startKolonne, 0, elevID)
            }

            // Ved 2 elever per bord
            else if (Number(perBord) === 2) {

                // Bestemmer om første elev skal plasseres på bordets høyre eller venstre side avhengig av bordets plassering i forhold til midtbord
                if (kjoreNr % 2 === 0) { nr = 0; }
                else { nr = 1; }

                plasserElev(sisteRadNr, startKolonne, nr, elevID);

                elevID++ // Itererer til neste elev
                restElever--

                if (restElever === 0) break // Avslutt hvis alle elevene har fått plass

                // Neste elev ved siden av
                if (kjoreNr % 2 === 0) { nr++; }
                else { nr--; }

                plasserElev(sisteRadNr, startKolonne, nr, elevID);
            }

            // Ved 3 elever per bord
            // Mye av det samme som over
            else {
                if (kjoreNr % 2 === 0) { nr = 0; }
                else { nr = 2; }

                plasserElev(sisteRadNr, startKolonne, nr, elevID);

                elevID++
                restElever--

                if (restElever === 0) break

                if (kjoreNr % 2 === 0) { nr++; }
                else { nr--; }

                plasserElev(sisteRadNr, startKolonne, nr, elevID);

                elevID++
                restElever--

                if (restElever === 0) break

                if (kjoreNr % 2 === 0) { nr++; }
                else { nr--; }

                plasserElev(sisteRadNr, startKolonne, nr, elevID);
            }

            // Neste bord annenhver høyre og venstre side for midtbordet (venstre første) 
            startKolonne -= kolonneHopper;
            if (kolonneHopper < 0) { kolonneHopper--; }
            else { kolonneHopper++ }
            kolonneHopper *= -1;

            // Oppdaterer variabler
            elevID++
            restElever--
            kjoreNr++
        }
        nyttKlassekartAnimasjon();
    }
}

// Animasjon ved nytt klassekart hvor 1 og 1 elev vises
function nyttKlassekartAnimasjon() {
    let removeDelay = 0;
    let stopp = false;
    let scaleValue = 1;
    let scaleDt = 0.005;

    let btnsElever = [...document.querySelectorAll("button.elev")]; // Legger alle elevene i en array
    btnsElever = stokkElever(btnsElever); // Stokker elevene så de vises tilfeldig

    for (btn of btnsElever) { // Gjør alle elevene gjennomsiktige og uttrykkbare
        btn.style.opacity = 0;
        btn.style.backgroundColor = "var(--linkColor)";
        // btn.style.pointerEvents = "none";
    }
    document.body.style.pointerEvents = "none";

    // $("#btnFullskjermKart").style.pointerEvents = "none";
    $("#tableKlassekart").style.zIndex = "666";
    $("#div_skygge").style.display = "block"; // Setter på mørk bakgrunn

    // document.body.classList.add('pointer');
    // $("#meldingHoppOver").style.display = "initial";

    let iLoveErikAndJon = setInterval(() => { // 0.2 sekunder mellom hver elev som vises (ca.)

        let btn = btnsElever.slice(-1)[0];
        btn.style.backgroundColor = "var(--lightColor)";
        btn.style.opacity = 1;
        if (btn.innerHTML !== "&nbsp;" && btn.innerHTML !== "&nbsp") {
            btn.title = "" + btn.innerHTML;
        }
        btnsElever.pop();

        $("#tableKlassekart").style.transform = `scale(${scaleValue})`;
        scaleValue += scaleDt;

        if (btnsElever.length === 0 || stopp === true) {

            // $("#meldingHoppOver").style.display = "none";

            // Animasjonen, kan gjøres om til css animasjon
            setTimeout(() => {
                $("#tableKlassekart").style.transform = `scale(${scaleValue + 0.2})`;
            }, 2300 - removeDelay);
            setTimeout(() => {
                $("#tableKlassekart").style.transform = `scale(1.0)`;
                $("#tableKlassekart").style.zIndex = "0";
            }, 2700 - removeDelay);
            setTimeout(() => {
                // Må resette verdier for å unngå glitch
                elev1ID = "";
                antallKlikk = 0;
                aktiverAnimasjon(`Nytt klassekart for ${valgtKlasse.klassekode}`);
                // $("#btnFullskjermKart").style.pointerEvents = "auto";
            }, 3000 - removeDelay);

            clearInterval(iLoveErikAndJon); // stopper animasjonen
            // Gjør knappene trykkbare igjen når animasjonen er ferdig
        }
    }, 300 - klassekart.length * 5);

    // Avslutt animasjon ved trykk (tilgjengelig etter 0.5 sekund)
    // setTimeout(() => {
    //     document.body.onclick = (event) => {
    //         removeDelay = 2300;
    //         stopp = true;
    //         visKlassekart();
    //         $("#btnFullskjermKart").style.pointerEvents = "none";
    //         document.body.classList.add('pointer');
    //         $("#meldingHoppOver").style.display = "none";
    //         event.preventDefault()
    //     }
    // }, 500);
}

function plasserElev(rad, kolonne, nr, id) {
    $("#rad" + rad + "kolonne" + kolonne + "nr" + nr).innerHTML = klassekart[id];
}

// Durstenfelds sorteringsalgoritme
function stokkElever(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function lagLaererbord() {
    let laererbord = document.createElement("th");
    laererbord.innerHTML = "Lærer";
    laererbord.colSpan = "" + kolonner;
    let rad = document.createElement("tr");
    rad.appendChild(laererbord);
    return rad;
}

// Funksjon for å bytte plasser
function byttePlass(evt) {
    if (antallKlikk === 1) {
        let elev1 = $("#" + elev1ID);
        let elev1Navn = elev1.innerHTML;
        let elev2 = evt.target;
        let elev2Navn = elev2.innerHTML;
        elev1.style.backgroundColor = "";
        elev1.style.color = "";
        antallKlikk--;
        // Bytt kun hvis det er forskjellige personer og ikke to tomme plasser
        if (elev1ID !== evt.target.id && !(elev1Navn === "&nbsp;" && elev2Navn === "&nbsp;")) {
            elev1.innerHTML = elev2Navn;
            elev2.innerHTML = elev1Navn;
            // Tar hensyn til å bytte titlene
            if (elev1.innerHTML === "&nbsp;" || elev1.innerHTML === "&nbsp") {
                elev1.title = "";
            } else {
                elev1.title = "" + elev1.innerHTML;
            }
            if (elev2.innerHTML == "&nbsp;" || elev2.innerHTML == "&nbsp") {
                elev2.title = "";
            } else {
                elev2.title = "" + elev2.innerHTML;
            }
            $("#btnLagreEndringer").classList = "btn"; // Gjør knapp for lagring og knapp for å fjerne endringer klikkbar
            $("#btnFjerneEndringer").classList = "btn btn-danger";
        }
    }
    else {
        elev1ID = evt.target.id;
        $("#" + elev1ID).style.backgroundColor = "#02B345";
        $("#" + elev1ID).style.color = "white";
        antallKlikk++
    }
}

// Funksjon som henter de nye elevplasseringene etter plassbytte og nytt kart, for deretter å lagre det.
// Tar hensyn til at det er ledige pulter mellom elevene.
function lagrePlassbytter() {
    elever = [];
    let btnsElever = document.querySelectorAll("button.elev");
    for (btn of btnsElever) {
        elever.push(btn.innerHTML);
    }
    if (snudd === false) elever.reverse(); // Avhenger av om kartet er snudd eller ikke

    // Looper gjennom navnene, og fjerner alle "&nbsp" under siste navn på kartet. Lagrer resten.
    for (let i = 0; i < elever.length; i++) {
        if (elever[i] !== "&nbsp") {
            elever.splice(0, i);
            break;
        }
    }


    elever.reverse(); // Snur lista til riktig veg

    klasse["klassekart"] = elever; // Oppdaterer klassekartet
    $("#btnLagreEndringer").classList = "btn btn-disabled";
    $("#btnFjerneEndringer").classList = "btn btn-danger btn-disabled";
    lagreKlassekart(); // Skriver til fil
}

// Funksjon for å lagre de endringene som er gjort til data.js, og oppdatere variabler
function lagreKlassekart() {

    store.set("data_klasser", data);

    // Oppdaterer variablene våre for sikkerhets skyld
    data = store.store.data_klasser;
    console.log("Lagret");
    klasse = data[valgtKlasse.klassekode];
    elever = klasse["elever"];
    klassekart = klasse["klassekart"];
}

// Funksjon for å snu klassekartet
function snuKlassekart() {
    let tabell = $("#tableKlassekart");
    let rader = [];

    // Går gjennom radene
    for (let i = 0, rad; rad = tabell.rows[i]; i++) {

        let celler = [];

        // Går gjennom tabellcellene 
        for (let j = 0, celle; celle = rad.cells[j]; j++) {

            if (celle.nodeName !== "TH") { // Tar ikke med lærerplassen
                switch (celle.childNodes.length) {  // Bytter plass på knappene (elevene) per tabellcelle
                    case 2:
                        celle.insertBefore(celle.childNodes[1], celle.childNodes[0]);
                        break;
                    case 3:
                        celle.insertBefore(celle.childNodes[2], celle.childNodes[0]);
                        celle.insertBefore(celle.childNodes[2], celle.childNodes[1]);
                        break;
                    default:
                        break;
                }
            }

            celler.push(celle.innerHTML);
        }
        celler.reverse(); // Omvendt rekkefølge på tabellcellene (bordene) per rad
        for (let j = 0, celle; celle = rad.cells[j]; j++) {
            celle.innerHTML = celler[j];
        }

        rader.push(rad.innerHTML);
    }
    rader.reverse(); // Omvendt rekkefølge på radene
    for (let i = 0, rad; rad = tabell.rows[i]; i++) {
        rad.innerHTML = rader[i];
    }

    let btnsElever = document.querySelectorAll('button.elev');

    for (let i = 0; i < btnsElever.length; i++) {
        btnsElever[i].addEventListener('click', byttePlass); // Må legge til hendeleslyttere på nytt
    }

    snudd = !snudd; // Toggler snudd
}

// Setter i gang fullskjerm på klassekart
function fullskjermKart() {
    let tableKlassekart = $("#tableKlassekart");
    let skygge = $("#div_skygge");
    if (fullskjerm === false) {
        skalerKart();

        tableKlassekart.style.zIndex = "648";
        skygge.style.display = "block";
        $("#btnFullskjermKart").style.transform = "rotate(180deg)"; // Roter knappen

        document.body.style.pointerEvents = "none";
        $("#btnFullskjermKart").style.pointerEvents = "auto"; // Kan kun trykke på knappen

        fullskjerm = !fullskjerm; // Toggler fullskjerm
    }
    else {
        tableKlassekart.style.transform = "scale(1)";
        skygge.style.display = "none";
        $("#btnFullskjermKart").style.transform = "none";

        document.body.style.pointerEvents = "auto";

        fullskjerm = !fullskjerm;
    }
}

// Beregner hvor mye kartet skal skaleres
function skalerKart() {
    let tableKlassekart = $("#tableKlassekart");

    let kartBredde = tableKlassekart.offsetWidth;
    let kartHoyde = tableKlassekart.offsetHeight;
    let vinduBredde = window.innerWidth;
    let vinduHoyde = window.innerHeight - 20;

    let scaleTo;

    // Ikke zoom hvis kartet allerede er større enn vinduet
    if (kartBredde > kartHoyde) {
        if (kartBredde >= vinduBredde) scaleTo = 1;
        else scaleTo = vinduBredde / kartBredde; // Forholdet mellom kart og vindu
    }
    else {
        if (kartHoyde >= vinduHoyde) scaleTo = 1;
        else scaleTo = vinduHoyde / kartHoyde;
    }

    if (scaleTo > 2.5) scaleTo = 2.5; // Ikke skaler mer enn 2.5 ganger så mye

    tableKlassekart.style.transform = `scale(${scaleTo})`;
}

function lukkError() {
    document.getElementById('error-shade').style.display = 'none';
    document.getElementById('modalStrukturKlassekart').style.display = 'block';
}








//Hehe