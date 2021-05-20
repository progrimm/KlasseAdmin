// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

let valgtKlasse;

window.onload = () => {
    oppdaterTabell();

    $("#btnStartside").onclick = () => {
        window.location = "index.html";
    }

    $("#btnLeggTil").onclick = () => { addAndEdit([]) };
}

function oppdaterTabell() {
    $("#tableOversiktKlasser").innerHTML = "";

    for (let klassekode in data) {
        let radKlasse = document.createElement("tr");

        let kode = document.createElement("td");
        kode.innerHTML = klassekode;

        let elever = document.createElement("td");
        let arrElever = data[klasseKode]["elever"]
        elever.innerHTML = arrElever;

        let btnRediger = document.createElement("td");
        btnRediger.innerHTML = "Rediger";
        btnRediger.onclick = () => {
            valgtKlasse = klassekode;
            addAndEdit(arrElever)
        };

        let btnSlett = document.createElement("td");
        btnSlett.innerHTML = "Slett";
        btnSlett.onclick = () => { 
            slettKlasse(klassekode) 
        };

        radKlasse.appendChild(kode);
        radKlasse.appendChild(elever);
        radKlasse.appendChild(btnRediger);
        radKlasse.appendChild(btnSlett);

        $("#tableOversiktKlasser").appendChild(radKlasse);
    }
}

function slettKlasse(klassekode) {
    console.log("Slett: " + klassekode);
    oppdaterTabell();
}

function addAndEdit(elever) {
    if (elever.length === 0) {
        console.log("Legg til");
    }

    else {
        console.log("Rediger " + valgtKlasse);
    }
}