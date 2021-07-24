// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

let valgtKlasse = ""; // Husker valgt klasse ved redigering, brukes som sjekk om det er ny klasse eller redigering

window.onload = () => {
    oppdaterTabell();

    $("#btnLeggTil").onclick = leggTilKlasse;

    $("#btnLagreKlasse").onclick = lagreKlasse;

    // Lukk modal ved trykk utenfor innholdet
    window.onmousedown = (evt) => {
        if (evt.target == $("#wholeModal")) {
            $("#wholeModal").style.display = "none";
        }
        else if (evt.target == $("#warning_modal")) {
            $("#warning_modal").style.display = "none";
        }
        else if (evt.target == $("#error_modal")) {
            $("#error_modal").style.display = "none";
        }
    }
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
        elever.innerHTML = data[klassekode]["elever"].length;

        let rediger_celle = document.createElement("td");
        let btnRediger = document.createElement("p");
        btnRediger.innerHTML = "Rediger";
        btnRediger.className = 'btn';
        btnRediger.onclick = () => {
            redigerKlasse(klassekode);   // åpne modal
        };
        rediger_celle.appendChild(btnRediger);

        let slett_celle = document.createElement("td");
        let btnSlett = document.createElement("p");
        btnSlett.innerHTML = "Slett";
        btnSlett.className = 'btn btn-danger';
        btnSlett.onclick = () => {
            slett_advarsel(klassekode); // åpne modal
        };
        slett_celle.appendChild(btnSlett);

        radKlasse.append(kode, elever, rediger_celle, slett_celle);
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

function slett_advarsel(klassekode) {
    $("#warning_modal").style.display = "block";
    $("#warning_header").innerHTML = "Er du sikker på at du vil slette " + klassekode + '?';
    $('#warning_confirm').innerHTML = 'Slett';
    $('#warning_confirm').className = 'btn btn-danger';
    $('#warning_confirm').onclick = () => {
        slettKlasse(klassekode);
    }
}

function rediger_advarsel(klassekode) {
    $("#warning_modal").style.display = "block";
    $("#warning_header").innerHTML = "Er du sikker på at du vil endre " + klassekode + '?';
    $('#warning_confirm').innerHTML = 'Lagre';
    $('#warning_confirm').className = 'btn btn-success';
    $('#warning_confirm').onclick = () => {
        $("#warning_modal").style.display = "none";
        lagreKlasse();
    }
}

// Sletter klassa fra objektet data
function slettKlasse(klassekode) {
    delete data[klassekode];
    $("#warning_modal").style.display = "none";
    $("#wholeModal").style.display = "none";
    oppdaterData();
    oppdaterTabell();
}

function leggTilKlasse() {
    $("#wholeModal").style.display = "block";
    $("#modalHeaderText").innerHTML = "Ny klasse";
    $("#btnLagreKlasse").onclick = lagreKlasse;

    $("#inpKlassekode").value = "";
    $("#inpElever").value = "";

    $("#inpKlassekode").placeholder = "Eks.: 2MATR";
    $("#inpElever").placeholder = "Skill elevene med komma";
    valgtKlasse = "";  // fjerner valgt klasse
}

function redigerKlasse(klassekode) {
    $("#wholeModal").style.display = "block";
    $("#modalHeaderText").innerHTML = "Rediger - " + klassekode;
    $("#btnLagreKlasse").onclick = () => {
        rediger_advarsel(klassekode);
    }

    $("#inpKlassekode").value = klassekode;
    let elever = data[klassekode]["elever"];
    let txt = elever[0];    // streng som alle elevene legges til i med komma og mellomrom mellom
    for (let index = 1; index < elever.length; index++) {
        const elev = elever[index];
        txt += ', ' + elev;
    }
    $("#inpElever").value = txt;

    valgtKlasse = klassekode;
}

function lagreKlasse() {
    // Henter data på nytt for at ting skal funke
    data = JSON.parse(fs.readFileSync(dataFilename));

    // Henter verdier fra inputfeltene
    let nyKlassekode = $("#inpKlassekode").value;
    if (!nyKlassekode) return;  // hvis klassekode ikke er skrevet inn
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
        delete data[valgtKlasse];   // fjerner klasse, for så å legge til igjen med oppdatert data
    }

    // Sjekker om klassa finnes fra før
    for (klassekode in data) {
        if (klassekode === nyKlassekode) {
            $("#error_modal").style.display = "block";
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

// Takk til Jon for kreativt innslag                // bare hyggelig :) -Jon       //Jon er flink og søt! -Erik     // <3 -Jon
function tekstbehandling(nye_elever) {
    let elever = nye_elever.split(',');             // deler opp på komma
    let i = 0;
    while (i < elever.length) {
        elever[i] = elever[i].split('\n').join(''); // tar bort linjeskift
        elever[i] = elever[i].split(' ');           // deler opp på mellomrom
        let j = 0;
        while (j < elever[i].length) {
            if (elever[i][j] === '') {
                elever[i].splice(j, 1);             // sletter tomme elementer
            } else j++;
        }
        elever[i] = elever[i].join(' ');            // setter de sammen igjen med mellomrom mellom

        if (elever[i] === '') {
            elever.splice(i, 1);                    // sletter tomme elev-elementer
        } else i++;
    }
    // elever.sort((a, b) => {                         // sorterer alfabetisk
    //     return a.localeCompare(b);
    // })

    return elever;
}