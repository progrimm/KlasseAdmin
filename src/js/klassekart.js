let perBord, rader, kolonner;  // Globale variabler

// Hører til byttPlass
let antallKlikk = 0;
let elev1ID;

let snudd = false; // Om kartet er snudd eller ikke
let fullskjerm = false // Om kartet er i fullskjerm eller ikke

const { start } = require("repl"); // Husker ikke hva den gjør, men tørr ikke å fjerne den

// Henter lagret data
const Store = require('electron-store');
const store = new Store();
let data = store.store.data_klasser;

const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse")); // Henter valgte klassa
let klasse = data[valgtKlasse.klassekode]; // Henter objektet fra data
let elever = klasse["elever"]; // Henter elevene
let klassekart = klasse["klassekart"]; // Henter klassekartet

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

window.onload = () => {
    includeHTML();

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
        $("#warning_modal").style.display = "block";
        $("#warning_header").innerHTML = "Er du sikker på at du vil lage nytt klassekart for " + valgtKlasse.klassekode + "?";
    }

    $("#warning_confirm").onclick = () => {
        $("#warning_modal").style.display = "none";
        nyttKlassekart();
    }

    $("#btnSnuKlassekart").onclick = aktiverSnuKlassekart;

    // Lukk modal ved trykk utenfor innholdet
    window.onmousedown = (evt) => {
        if (evt.target == $("#modalStrukturKlassekart")) {
            $("#modalStrukturKlassekart").style.display = "none";
        }
        else if (evt.target == $("#warning_modal")) {
            $("#warning_modal").style.display = "none";
        }
        else if (evt.target == $("#error_modal")) {
            $("#error_modal").style.display = "none";
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

function aktiverSnuKlassekart() {
    $("#tableKlassekart").style.transform = "scaleY(0)";
    // Deaktiverer knappen og all trykking
    $('#btnSnuKlassekart').className = 'btn btn-disabled';
    setTimeout(() => {
        if (snudd === true) {
            $("#tableKlassekart").style.paddingTop = "initial";
            $("#tableKlassekart").style.paddingBottom = "61px";
        } else {
            $("#tableKlassekart").style.paddingTop = "61px";
            $("#tableKlassekart").style.paddingBottom = "initial";
        }
        $("#tableKlassekart").style.transform = "";
        $('#btnSnuKlassekart').className = 'btn';
        snuKlassekart();
    }, 750);
}

// Henter info om valgt klasse og viser eventuelt eksisterende kart, samt initialiserer noen variabler
function hentKlasse() {

    // Sjekker om valgt klasse har klassekart fra før, eller om det må lages nytt
    if (klassekart.length === 0) {
        for (btn of [...$(".knapper")]) {
            btn.style.display = "none"
        };
        $("#tableKlassekart").style.display = "none";
        $("#byttetips").style.display = "none";
        $("#btnVisModalStrukturNyttKart").style.display = "initial";
    }

    // Viser klassekart om det finnes fra før
    else {
        visKlassekart();
    }
}

// Funksjon som lager det nye klassekartet
function nyttKlassekart() {
    for (btn of [...$(".knapper")]) {
        btn.style.display = "flex"
    };
    $("#tableKlassekart").style.display = "initial";
    $("#byttetips").style.display = "initial";
    $("#btnVisModalStrukturNyttKart").style.display = "none";

    // Henter strukturen klassekartet skal genereres på fra input-felt
    perBord = parseInt($("#inputEleverPerBord").value);
    rader = parseInt($("#inputAntallRader").value);
    kolonner = parseInt($("#inputAntallKolonner").value);

    elever = elever.filter(navn => navn !== "."); // Fjerner de tomme plassene, slik at bare navnene gjenstår

    // Sjekker om strukturen oppgitt er gyldig
    if (rader * kolonner * perBord < elever.length) {
        $("#warning_modal").style.display = "none";
        $("#error_modal").style.display = "block";
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
    visKlassekart(true);  // Viser/lager det nye klassekartet ved default oppsett (derav nyGenerering = true)
    lagrePlassbytter(); // Lagrer kartet via lagrePlassbytter funksjonen (for å få med ".")
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
                        elevNavn = ".";
                    } else {
                        elevID++
                    }
                }
                // Ved allerede eksisterende kart
                else {
                    if (elevNavn === undefined) {
                        elevNavn = ".";
                    }
                    elevID++
                }
                btnElev.innerHTML = elevNavn;
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
    let scaleValue = 1;
    let scaleDt = 0.005;

    let btnsElever = [...document.querySelectorAll("button.elev")]; // Legger alle elevene i en array

    for (btn of btnsElever) { // Gjør alle elevene gjennomsiktige og uttrykkbare
        btn.style.opacity = 0;
        btn.style.backgroundColor = "var(--linkColor)";
        document.body.style.pointerEvents = "none";
    }

    btnsElever = stokkElever(btnsElever); // Stokker elevene så de vises tilfeldig

    $("#tableKlassekart").style.zIndex = "678";
    $("#div_skygge").style.display = "block"; // Setter på mørk bakgrunn

    let iLoveErikAndJon = setInterval(() => { // 0.2 sekunder mellom hver elev som vises

        let btn = btnsElever.slice(-1)[0]
        btn.style.backgroundColor = "var(--lightColor)";
        btn.style.opacity = 1;
        btnsElever.pop();

        $("#tableKlassekart").style.transform = `scale(${scaleValue})`;
        scaleValue += scaleDt;

        if (btnsElever.length === 0) {

            // Animasjonen, kan gjøres om til css animasjon
            setTimeout(() => {
                $("#tableKlassekart").style.transform = `scale(${scaleValue + 0.2})`;
            }, 2300);
            setTimeout(() => {
                $("#tableKlassekart").style.transform = `scale(1.0)`;
                $("#tableKlassekart").style.zIndex = "0";
            }, 2700);
            setTimeout(() => {
                aktiverAnimasjon(`Nytt klassekart for ${valgtKlasse.klassekode}`);
            }, 3000);

            clearInterval(iLoveErikAndJon); // stopper animasjonen
            // Gjør knappene trykkbare igjen når animasjonen er ferdig
        }
    }, 300 - klassekart.length * 5);
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
        let elev1 = $("#" + elev1ID).innerHTML;
        let elev2 = evt.target.innerHTML;
        $("#" + elev1ID).style.backgroundColor = "";
        $("#" + elev1ID).style.color = "";
        antallKlikk--;
        // Bytt kun hvis det er forskjellige personer og ikke to tomme plasser
        if (elev1ID !== evt.target.id && !(elev1 === "." && elev2 === ".")) {
            $("#" + elev1ID).innerHTML = elev2;
            evt.target.innerHTML = elev1;
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

    // Looper gjennom navnene, og fjerner alle "." under siste navn på kartet. Lagrer resten.
    for (let i = 0; i < elever.length; i++) {
        if (elever[i] !== ".") {
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

function fullskjermKart() {
    let tableKlassekart = $("#tableKlassekart");
    if (fullskjerm === false) {
        let kartBredde = tableKlassekart.offsetWidth;
        let vinduBredde = window.innerWidth;
        if (kartBredde >= vinduBredde) return // Ikke zoom hvis kartet allerede er større enn vinduet
        let scaleTo = vinduBredde / kartBredde; // Forholdet mellom kart og vindu
        tableKlassekart.style.transform = `scale(${scaleTo})`;

        tableKlassekart.style.zIndex = "648";
        $("#div_skygge").style.display = "block";
        $("#btnFullskjermKart").style.transform = "rotate(180deg)"; // Roter knappen

        document.body.style.pointerEvents = "none";
        $("#btnFullskjermKart").style.pointerEvents = "auto"; // Kan kun trykke på knappen

        fullskjerm = !fullskjerm; // Toggler fullskjerm
    }
    else {
        tableKlassekart.style.transform = "scale(1)";
        $("#div_skygge").style.display = "none";
        $("#btnFullskjermKart").style.transform = "none";

        document.body.style.pointerEvents = "auto";

        fullskjerm = !fullskjerm;
    }
}



