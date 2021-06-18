// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

window.onload = () => {
    sjekkStartanimasjon();
    klasseliste();
}

function klasseliste() {
    let klasseliste = document.getElementById("klasseliste");

    for (klasseKode in data) {
        let card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-klassekode", klasseKode);
        card.onclick = (evt) => {
            let klasse = {
                klassekode: evt.target.getAttribute("data-klassekode"),
                elever: data[evt.target.getAttribute("data-klassekode")].elever
            }
            sessionStorage.setItem("valgtKlasse", JSON.stringify(klasse));
            window.location = "klassebehandling.html";
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

function sjekkStartanimasjon() {
    if (sessionStorage.getItem("besokt") === null) {
        sessionStorage.setItem("besokt", true);
        console.log("first");
        $("#header").classList.add("header_aniclass");
        $("#content").classList = "content_aniclass";
    } else {
        $("#header").classList = "header";
        $("#content").classList = "";
    }
}