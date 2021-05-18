// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

window.onload = () => {
    lagSelKlasse();
    $("#btnVelgKlasse").onclick = () => {
        let klasse = {
            klassekode: $("#selKlasse").value,
            elever: data[$("#selKlasse").value].elever
        }
        sessionStorage.setItem("valgtKlasse", JSON.stringify(klasse));
        window.location = "klassebehandling.html";
    }
}

// Midlertidig valg av klasse, fyller select-elementet
function lagSelKlasse() {
    $("#selKlasse").innerHTML = "";

    let options = "<option disabled selected>Velg Klasse</option>";

    for (klasseKode in data) {
        options += "<option value'" + klasseKode + "'>" + klasseKode + "</option>";
    }

    $("#selKlasse").innerHTML = options;
}