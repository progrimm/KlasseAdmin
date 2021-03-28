let klasse, elever, perBord, rader, kolonner;  // Globale variabler
let antallKlikk = 0;  // Hører til byttPlass

// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));


window.onload = () => {
    lagSelKlasse();
    $("#selKlasse").onchange = function () {  // Når en klasse blir valgt
        $("#btnVisModalStruktur").disabled = false;  // Gjør knappene trykkbare
        $("#btnSnuKlassekart").disabled = false;

        klasse = data[$("#selKlasse").value];  // Hent klassekode
        elever = klasse["elever"];  // Hent elevene i valgt klasse

        // Sjekker om klassa har klassekart fra før, eller om det må lages nytt
        if (klasse["klassekart"].length === 0) {
            $("#tableKlassekart").innerHTML = "Klassekart ikke lagd";
        }

        else if (klasse["klassekart"].length !== klasse["elever"].length) {
            $("#tableKlassekart").innerHTML = "Det har skjedd en endring i klassa, lag nytt kart";
        }

        // Viser klassekart om det finnes fra før
        else {
            perBord = klasse["klassekart_oppsett"]["per_bord"];
            rader = klasse["klassekart_oppsett"]["rader"];
            kolonner = klasse["klassekart_oppsett"]["kolonner"];
            lagKlassekart("eksisterende");
        }
    }

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
}


// Midlertidig valg av klasse
function lagSelKlasse() {
    $("#selKlasse").innerHTML = "";

    let options = "<option disabled selected>Velg Klasse</option>";

    for (klasse in data) {
        options += "<option value'" + klasse + "'>" + klasse + "</option>";
    }

    $("#selKlasse").innerHTML = options;
}

function nyttKlassekart() {
    
    // Henter strukturen klassekartet skal genereres på
    perBord = parseInt($("#inputEleverPerBord").value);    
    rader = parseInt($("#inputAntallRader").value);
    kolonner = parseInt($("#inputAntallKolonner").value);

    if (rader * kolonner * perBord < elever.length) {
        alert("Klasserommet er for lite i forhold til antall elever.")
    }
    else {
        elever = stokkElever(elever);  // Stokker elevene
        lagKlassekart("nytt");  // Kaller funksjonen
    }
    $("#modalStrukturKlassekart").style.display = "none";
}



// Fyller inn tabellen for klassekartet
function lagKlassekart(status) {

    $("#tableKlassekart").innerHTML = "";

    // let klasse = testKlasse.map((elev) => elev); // kopierer elevene i klassa

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

                if (status === "nytt") {
                    var elevNavn = (elever[elevID] !== undefined ? elever[elevID] : ".");
                    // READ TO FILE kode skal legges til
                }
                else if (status === "eksisterende") {
                    var elevNavn = (klasse["klassekart"][elevID] !== undefined ? klasse["klassekart"][elevID] : ".");
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
    for (var i = arr.length - 1; i > 0; i--) {
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
        $("#" + elev1ID).innerHTML = elev2;
        $("#" + elev1ID).style.backgroundColor = "";
        evt.target.innerHTML = elev1;
        antallKlikk--;
    }
    else {
        elev1ID = evt.target.id;
        $("#" + elev1ID).style.backgroundColor = "lime";
        antallKlikk++
    }
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
}



