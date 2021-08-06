// Henter data fra fil
const Store = require('electron-store');
const store = new Store();
let data = store.store.data_klasser;

// henter valgt klasse fra session storage
const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
// henter ut elever både fra fil og session
let elever = data[valgtKlasse.klassekode].elever
let elever_tilstede = valgtKlasse.elever;

document.title = 'KlasseAdmin - ' + valgtKlasse.klassekode + " - Fravær";
window.onload = oppstart;

let eleverFravaer = [];                                                                     //Lagrer de som ikke har vært tilstede for seinere bruk

function oppstart() {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);

    document.getElementById("elevListe").innerHTML = "";    // sletter alt i hoveddiven
    eleverFravaer = [];     // tømmer lista med fraværende elever

    let listeLengde = elever.length;
    for (let i = 0; i < listeLengde; i++) {                                                  //Lager en div til hver elev
        let elevDiv = document.createElement("div");
        elevDiv.id = elever[i];
        elevDiv.className = "elevDiv green";

        let nyElevNavn = document.createElement("p");
        nyElevNavn.innerHTML = elever[i];
        nyElevNavn.style.pointerEvents = "none";

        if (elever_tilstede.includes(elever[i])) {   // hvis eleven er tilstedeværende
            elevDiv.className = "elevDiv green";
        }
        else {  // hvis fraværende
            elevDiv.className = "elevDiv red";
            eleverFravaer.push(elever[i]);
        }
        elevDiv.onclick = fravaer;                                                     //Kjører funskjonen fravaer() når buttonen blir trykket

        document.getElementById("elevListe").appendChild(elevDiv);                          //Legger til diven for eleven på nettsiden
        document.getElementById(elever[i]).appendChild(nyElevNavn);                         //Legger til navnet i den diven nettopp lagt til
        // document.getElementById(elever[i]).appendChild(nyBtnFravaer);                       //Legger til knappen også :)
    }
    // kjører gjennom fraværende elever og sletter de fra elevlista
    for (const elev of eleverFravaer) {
        index = elever.indexOf(elev);
        elever.splice(index, 1);
    }
    // gjør at man ikke kan trykke tilbake med nettleser-navigering
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
        history.pushState(null, null, document.URL);
    });
}

function fravaer(event) {
    let elev = event.target.id;                                                      //Finner id-en til den eleven som får registrert fravær
    let farge = (event.target.className).replace("elevDiv ", "");

    if (farge === "green") {
        document.getElementById(elev).className = "elevDiv red";

        let elevIndex = elever.indexOf(elev);                                               //Finner indexen til eleven registrert
        eleverFravaer.push(elever[elevIndex]);                                              //Legger til eleven i arrayet over de som får fravær
        elever.splice(elevIndex, 1);                                                        //Fjerner fra hovedlista
    }
    else {
        document.getElementById(elev).className = "elevDiv green";

        let elevIndex = eleverFravaer.indexOf(elev);
        elever.push(eleverFravaer[elevIndex]);
        eleverFravaer.splice(elevIndex, 1);
    }
}

function eleverTilstede() {                                                                 //En test, slik at man får sett resultatet i console.log. !KUN FOR TEST, IKKE FOR FERDIG PROGRAM!
    console.log("Elever som er tilstede: " + elever);
    console.log("Fravær: " + eleverFravaer);
    console.log("----------------------------");

    sessionStorage.setItem("valgtKlasse", JSON.stringify({
        klassekode: valgtKlasse.klassekode,
        elever: elever
    }));
    aktiverAnimasjon("Fravær lagret");
    window.location = 'klassebehandling.html'
}