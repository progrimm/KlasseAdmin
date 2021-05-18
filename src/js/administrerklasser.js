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

    for (let klasseKode in data) {
        let radKlasse = document.createElement("tr");

        let kode = document.createElement("td");
        kode.innerHTML = klasseKode;

        let elever = document.createElement("td");
        let arrElever = data[klasseKode]["elever"]
        elever.innerHTML = arrElever;

        let btnRediger = document.createElement("td");
        btnRediger.innerHTML = "Rediger";
        btnRediger.onclick = () => {
            valgtKlasse = klasseKode;
            addAndEdit(arrElever)
        };

        let btnSlett = document.createElement("td");
        btnSlett.innerHTML = "Slett";
        btnSlett.onclick = () => { 
            slettKlasse(klasseKode) 
        };

        radKlasse.appendChild(kode);
        radKlasse.appendChild(elever);
        radKlasse.appendChild(btnRediger);
        radKlasse.appendChild(btnSlett);

        $("#tableOversiktKlasser").appendChild(radKlasse);
    }
}

function slettKlasse(klasseKode) {
    console.log("Slett: " + klasseKode);
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