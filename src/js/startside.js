// Henter data fra fil
const Store = require('electron-store');
const store = new Store();
let data = store.store.data_klasser;

window.onload = () => {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);

    sjekkStartanimasjon();
    klasseliste();

    // Lukk modal ved trykk utenfor innholdet
    window.onclick = (evt) => {
        if (evt.target == $("#wholeModal")) {
            $("#wholeModal").style.display = "none";
        }
    }
    // gjør at man ikke kan trykke tilbake med nettleser-navigering
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
        history.pushState(null, null, document.URL);
    });
}

function klasseliste() {
    let klasseliste = document.getElementById("klasseliste");
    if (JSON.stringify(data) === '{}') {   // hvis det ikke er lagt inn noen klasser
        klasseliste.innerHTML = 'Trykk på tannhjulet nede til høyre for å legge til klasser!';
        return;
    }
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
    if (sessionStorage.getItem("besokt") === null) { // sjekker i sessionstorage om startsiden har blitt besøkt tidligere
        sessionStorage.setItem("besokt", true); // setter at startsiden har blitt besøkt

        // starter animasjoner om startsiden ikke er besøkt tidligere
        document.body.classList = "body_aniclass";
        $("#header").classList.add("header_aniclass");
        $("#introcredz").classList = "introcredz_aniclass"
        $("#header_hr").classList = "hr_aniclass";
        $("#content").classList = "content_aniclass";
    }
    else {
        // Rensker klasselistene for sikkerhets skyld
        document.body.classList = "";
        $("#header").classList = "header";
        $("#introcredz").classList = ""
        $("#header_hr").classList = "";
        $("#content").classList = "";
    }
}