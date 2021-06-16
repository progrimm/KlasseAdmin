// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

window.onload = () => {
    klasseliste();
    $("#btnVelgKlasse").onclick = () => {
        let klasse = {
            klassekode: $("#selKlasse").value,
            elever: data[$("#selKlasse").value].elever
        }
        sessionStorage.setItem("valgtKlasse", JSON.stringify(klasse));
        window.location = "fravaer.html";
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
    data[klasseKode].elever.length
}

function klasseliste() {
    let klasseliste = document.getElementById("klasseliste");

    for (klasseKode in data) {
        let card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-klassekode",klasseKode);
        card.onclick = (evt) => {
            let klasse = {
                klassekode: evt.target.getAttribute("data-klassekode"),
                elever: data[evt.target.getAttribute("data-klassekode")].elever
            }
            sessionStorage.setItem("valgtKlasse", JSON.stringify(klasse));
            window.location = "fravaer.html";
        } 
        
        let textArea = document.createElement("div");
        textArea.className = "textArea";
        textArea.innerHTML = "<h2>" + klasseKode + "</h2>";
        textArea.innerHTML += "<p>Antall elever: " + data[klasseKode].elever.length + "</p>";

        let arrowRight = document.createElement("div");
        arrowRight.className = "arrowRight";
        arrowRight.innerHTML = "<img src='multimedia/angle-right-solid.svg' alt='arrow'>"

        klasseliste.appendChild(card);
        card.appendChild(textArea);
        card.appendChild(arrowRight);

    }
}