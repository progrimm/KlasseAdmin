// Henter data fra fil
// const fs = require("fs");
// const dataFilename = __dirname + "/js/data.json";
// let data = JSON.parse(fs.readFileSync(dataFilename));

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
    for(let i = 0; i < listeLengde; i++) {                                                  //Lager en div til hver elev
        let elevDiv = document.createElement("div");
        elevDiv.id = elever[i];
        elevDiv.className = "elevDiv";

        let nyElevNavn = document.createElement("p");
        nyElevNavn.innerHTML = elever[i];

        let nyBtnFravaer = document.createElement("button");
        nyBtnFravaer.id = "btnFravaer" + elever[i];
        nyBtnFravaer.className = "btnFravaer";

        if(elever_tilstede.includes(elever[i])) {   // hvis eleven er tilstedeværende
            nyBtnFravaer.value = "green";
            nyBtnFravaer.innerHTML = "Tilstede";
        }
        else {  // hvis fraværende
            nyBtnFravaer.value = "red";
            nyBtnFravaer.innerHTML = "Fravær";
            nyBtnFravaer.style.backgroundColor = "red";
            elevDiv.style.borderColor = "red";
            eleverFravaer.push(elever[i]);
        }
        nyBtnFravaer.onclick = fravaer;                                                     //Kjører funskjonen fravaer() når buttonen blir trykket

        document.getElementById("elevListe").appendChild(elevDiv);                          //Legger til diven for eleven på nettsiden
        document.getElementById(elever[i]).appendChild(nyElevNavn);                         //Legger til navnet i den diven nettopp lagt til
        document.getElementById(elever[i]).appendChild(nyBtnFravaer);                       //Legger til knappen også :)
    }
    // kjører gjennom fraværende elever og sletter de fra elevlista
    for (const elev of eleverFravaer) {
        index = elever.indexOf(elev);
        elever.splice(index,1);
    }
    // gjør at man ikke kan trykke tilbake med nettleser-navigering
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
        history.pushState(null, null, document.URL);
    });
}

function fravaer(event) {
    let elevMedKode = event.target.id;                                                      //Finner id-en til den eleven som får registrert fravær
    let elev = elevMedKode.replace("btnFravaer", "");                                       //Fjerner all fra id-en utenom navnet til eleven

    if(document.getElementById(elevMedKode).value === "green") {                            //Gjør diven rød og registrerer fravær hvis den er grønn
        document.getElementById(elevMedKode).style.backgroundColor = "red";
        document.getElementById(elev).style.borderColor = "red";
        document.getElementById(elevMedKode).value = "red";
        document.getElementById(elevMedKode).innerHTML = "Fravær";
        
        let elevIndex = elever.indexOf(elev);                                               //Finner indexen til eleven registrert
        eleverFravaer.push(elever[elevIndex]);                                              //Legger til eleven i arrayet over de som får fravær
        elever.splice(elevIndex, 1);                                                        //Fjerner fra hovedlista
    }
    else {
        document.getElementById(elevMedKode).style.backgroundColor = "green";               //Hvis den er rød, så gjør den diven grønn, slik at man kan rette opp i feil registrering
        document.getElementById(elev).style.borderColor = "green";
        document.getElementById(elevMedKode).value = "green";
        document.getElementById(elevMedKode).innerHTML = "Tilstede";

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
    window.location = 'klassebehandling.html'
}