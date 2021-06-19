let perBord, rader, kolonner;  // Globale variabler

// Hører til byttPlass
let antallKlikk = 0;
let elev1ID;

let snudd = false; // Om kartet er snudd eller ikke

// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse")); // Henter valgte klassa
let klasse = data[valgtKlasse.klassekode]; // Henter objektet fra data
let elever = klasse["elever"]; // Henter elevene
let klassekart = klasse["klassekart"]; // Henter klassekartet

document.title = valgtKlasse.klassekode + " - Klassekart";

window.onload = () => {
    hentKlasse();

    // Vise modal
    $("#btnVisModalStruktur").onclick = () => {
        $("#modalStrukturKlassekart").style.display = "block";
    }

    $("#btnNyttKlassekart").onclick = nyttKlassekart;

    $("#btnLukkModal").onclick = () => {
        $("#modalStrukturKlassekart").style.display = "none";
    }

    $("#btnSnuKlassekart").onclick = snuKlassekart;

    // Lukk modal ved trykk utenfor innholdet
    window.onclick = (evt) => {
        let modal = $("#modalStrukturKlassekart");
        if (evt.target == modal) {
            modal.style.display = "none";
        }
    }

    $("#btnLagreEndringer").onclick = lagrePlassbytter;

    $("#btnFjerneEndringer").onclick = () => {
        $("#btnFjerneEndringer").disabled = true;
        $("#btnLagreEndringer").disabled = true;
        visKlassekart();
    }
}

// Henter info om valgt klasse og viser eventuelt eksisterende kart, samt initialiserer noen variabler
function hentKlasse() {

    // let eleverKlassekartKunNavn = klassekart.filter(navn => navn !== "."); // Filtrerer ut de tomme plassene

    // Sjekker om valgt klasse har klassekart fra før, eller om det må lages nytt
    if (klassekart.length === 0) {
        $("#tableKlassekart").innerHTML = "Klassekart ikke lagd";
    }
    // else if (eleverKlassekartKunNavn.length !== elever.length) {
    //     $("#tableKlassekart").innerHTML = "Det har skjedd en endring i klassa, lag nytt kart";
    // }

    // Viser klassekart om det finnes fra før
    else {
        visKlassekart();
    }
}

// Funksjon som lager det nye klassekartet
function nyttKlassekart() {

    // Henter strukturen klassekartet skal genereres på fra input-felt
    perBord = parseInt($("#inputEleverPerBord").value);
    rader = parseInt($("#inputAntallRader").value);
    kolonner = parseInt($("#inputAntallKolonner").value);

    elever = elever.filter(navn => navn !== "."); // Fjerner de tomme plassene, slik at bare navnene gjenstår

    // Sjekker om strukturen oppgitt er gyldig
    if (rader * kolonner * perBord < elever.length) {
        alert("Klassekart for lite i forhold til antall elever.")
    }
    else {
        elever = stokkElever(elever);  // Stokker elevene tilfeldig til klassekartet
        // Endrer data 
        klasse["klassekart"] = elever;
        klasse["klassekart_oppsett"]["per_bord"] = perBord + "";
        klasse["klassekart_oppsett"]["rader"] = rader + "";
        klasse["klassekart_oppsett"]["kolonner"] = kolonner + "";
        lagreKlassekart(); // Lagrer ny data om klassekartet i data.json
    }
    $("#modalStrukturKlassekart").style.display = "none"; // Skjuler modalen
    visKlassekart();  // Viser det nye klassekartet
}

// Viser klassekartet i form av en tabell med knapper
function visKlassekart() {

    // Henter strukturen
    perBord = klasse["klassekart_oppsett"]["per_bord"];
    rader = klasse["klassekart_oppsett"]["rader"];
    kolonner = klasse["klassekart_oppsett"]["kolonner"];

    $("#tableKlassekart").innerHTML = ""; // Rensker tidligere kart

    let laererbord = lagLaererbord(); // Lager plassen til læreren
    $("#tableKlassekart").appendChild(laererbord);

    let elevID = 0;  // Løpetall for elevene

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
                if (elevNavn === undefined) {
                    elevNavn = ".";
                }

                btnElev.innerHTML = elevNavn;
                btnElev.addEventListener("click", byttePlass);  // Legger til hendelseslytter på elevene så man kan bytte plasser
                elevID++
                $("#rad" + i + "kolonne" + j).appendChild(btnElev);
            }
        }
    }
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
        antallKlikk--;
        // Bytt kun hvis det er forskjellige personer og ikke to tomme plasser
        if (elev1ID !== evt.target.id && !(elev1 === "." && elev2 === ".")) {
            $("#" + elev1ID).innerHTML = elev2;
            evt.target.innerHTML = elev1;
            $("#btnLagreEndringer").disabled = false; // Gjør knapp for lagring og knapp for å fjerne endringer klikkbar
            $("#btnFjerneEndringer").disabled = false;
        }
    }
    else {
        elev1ID = evt.target.id;
        $("#" + elev1ID).style.backgroundColor = "var(--darkColor)";
        antallKlikk++
    }
}

// Funksjon som henter de nye elevplasseringene etter plassbytte, for deretter å lagre det.
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
    $("#btnLagreEndringer").disabled = true;
    $("#btnFjerneEndringer").disabled = true;
    lagreKlassekart(); // Skriver til fil
}

// Funksjon for å lagre de endringene som er gjort til data.js, og oppdatere variabler
function lagreKlassekart() {

    let dataOppdatert = JSON.stringify(data, null, '\t');

    fs.writeFileSync(dataFilename, dataOppdatert, function (err) {
        if (err) throw err;
        console.log("Oppdatert kart!");
    });

    // Oppdaterer variablene våre for sikkerhets skyld
    data = JSON.parse(fs.readFileSync(dataFilename));
    console.log(data);
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



