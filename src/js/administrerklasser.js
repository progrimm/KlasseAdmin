// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

let valgtKlasse = ""; // Husker valgt klasse ved redigering, brukes som sjekk om det er ny klasse eller redigering

window.onload = () => {
    oppdaterTabell();

    $("#btnLeggTil").onclick = leggTilKlasse;

    $("#btnLagreKlasse").onclick = lagreKlasse;
}

function oppdaterTabell() {
    valgtKlasse = "";
    $("#tableOversiktKlasser").innerHTML = "";

    // Fyller ut tabellen med klassene
    for (let klassekode in data) {
        let radKlasse = document.createElement("tr");

        let kode = document.createElement("td");
        kode.innerHTML = klassekode;

        let elever = document.createElement("td");
        let arrElever = data[klassekode]["elever"].length;
        elever.innerHTML = arrElever;

        let btnRediger = document.createElement("td");
        btnRediger.innerHTML = "<p class='btn'>Rediger</p>";
        btnRediger.onclick = () => {
            redigerKlasse(klassekode);
        };

        let btnSlett = document.createElement("td");
        btnSlett.innerHTML = "<p class='btn btn-danger'>Slett</p>";
        // Må lage en ny modal med bekrefting osv... Dette er dritt...
        // btnSlett.onclick = "Er du sikker på at du vil slette " + klassekode + "? Denne handlingen kan ikke angres."

        radKlasse.appendChild(kode);
        radKlasse.appendChild(elever);
        radKlasse.appendChild(btnRediger);
        radKlasse.appendChild(btnSlett);

        $("#tableOversiktKlasser").appendChild(radKlasse);
    }
}

function oppdaterData() {
    // flytter data over i liste for å sortere
    let klasseliste = [];
    for (const klassekode in data) {
        klasseliste.push([klassekode, data[klassekode]]);   // [klassekode, klasseobjekt]
    }
    // sorterer klasser alfabetisk ut fra klassekode, som er element [0]
    klasseliste.sort((a, b) => {
        return b[0].localeCompare(a[0]);
    })
    // legger til objektene i data igjen, nå i alfabetisk rekkefølge
    data = {};
    for (const klasse of klasseliste) {
        data = Object.assign({
            [klasse[0]]: klasse[1]
        }, data);
    }

    let dataOppdatert = JSON.stringify(data, null, '\t');

    fs.writeFileSync(dataFilename, dataOppdatert, function (err) {
        if (err) throw err;
    });

    data = JSON.parse(fs.readFileSync(dataFilename));
}

// Sletter klassa fra objektet data
function slettKlasse(klassekode) {
    delete data[klassekode];
    oppdaterData();
    oppdaterTabell();
}

function leggTilKlasse() {
    $("#wholeModal").style.display = "block";
    $("#modalHeaderText").innerHTML = "Legg til klasse";

    $("#inpKlassekode").value = "";
    $("#inpElever").value = "";

    $("#inpKlassekode").placeholder = "Eks.: 2MATR";
    $("#inpElever").placeholder = "Skill elevene med komma";
}

function redigerKlasse(klassekode) {
    $("#wholeModal").style.display = "block";
    $("#modalHeaderText").innerHTML = "Rediger - " + klassekode;

    $("#inpKlassekode").value = klassekode;
    $("#inpElever").value = data[klassekode]["elever"];

    valgtKlasse = klassekode;
}

function lagreKlasse() {
    // Henter verdier fra inputfeltene
    let nyKlassekode = $("#inpKlassekode").value;
    if (!nyKlassekode) return   // hvis klassekode ikke er skrevet inn
    let nyeElever = $("#inpElever").value;
    nyeElever = tekstbehandling(nyeElever); // Formaterer input-tekst, returnerer array

    // klassekart til den nye klassa
    let klassekart = [];
    let klassekart_oppsett = {
        per_bord: 0,
        rader: 0,
        kolonner: 0
    };

    if (valgtKlasse !== "") {   // hvis klassen redigeres
        klassekart = data[valgtKlasse].klassekart   // tar vare på klassekartet
        klassekart_oppsett = data[valgtKlasse].klassekart_oppsett
        delete data[valgtKlasse];
    }

    // Sjekker om klassa finnes fra før
    for (klassekode in data) {
        if (klassekode === nyKlassekode) {
            console.log("Klassen finnes fra før")
            return
        }
    }

    // Lager objekt for den nye klassa
    let nyKlasse = {
        [nyKlassekode]: {
            elever: nyeElever,
            klassekart: klassekart,
            klassekart_oppsett: klassekart_oppsett
        }
    };

    data = Object.assign(nyKlasse, data);

    valgtKlasse = "";
    $("#wholeModal").style.display = "none";
    oppdaterData();
    oppdaterTabell();

    // 
    // gi link til klassekart
    // 
}

// Takk til Jon for kreativt innslag                // bare hyggelig :) -Jon       //Jon er flink og søt! -Erik
function tekstbehandling(nye_elever) {
    let elever = nye_elever.split(',');             // deler opp på komma
    let i =0;
    while (i<elever.length) {
        elever[i] = elever[i].split('\n').join(''); // tar bort linjeskift
        elever[i] = elever[i].split(' ');           // deler opp på mellomrom
        let j =0;
        while (j<elever[i].length) {
            if (elever[i][j] === ''){
                elever[i].splice(j,1);              // sletter tomme elementer
            } else j++;
        }
        elever[i] = elever[i].join(' ');            // setter de sammen igjen med mellomrom mellom
        
        if (elever[i] === ''){
            elever.splice(i,1);                     // sletter tomme elev-elementer
        } else i++;
    }
    elever.sort((a, b) => {                         // sorterer alfabetisk
        return a.localeCompare(b);
    })

    return elever;
}