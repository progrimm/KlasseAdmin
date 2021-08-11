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
    includeHTML();

    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);
    
    $('#fravaerBtn').onclick = eleverTilstede;
    document.getElementById("elevListe").innerHTML = "";    // sletter alt i hoveddiven
    eleverFravaer = [];     // tømmer lista med fraværende elever

    let listeLengde = elever.length;
    for (let i = 0; i < listeLengde; i++) {                                                  //Lager en div til hver elev
        let elevDiv = document.createElement("div");
        elevDiv.id = elever[i];
        elevDiv.className = "elevDiv green tooltip";

        let nyElevNavn = document.createElement("p");
        nyElevNavn.innerHTML = elever[i];
        setTimeout(() => {
            if (nyElevNavn.clientWidth < nyElevNavn.scrollWidth) {
                let span = document.createElement('span');
                span.onclick = () => { fravaer(elever[i]) };
                span.className = 'tooltiptext';
                span.innerHTML = elever[i];
                nyElevNavn.appendChild(span);
                setTimeout(() => {
                    span.style.marginLeft = (span.offsetWidth /-2) +'px';
                }, 50);
            }
        }, 50);

        nyElevNavn.style.pointerEvents = "none";
        nyElevNavn.style.userSelect = "none";

        if (elever_tilstede.includes(elever[i])) {   // hvis eleven er tilstedeværende
            elevDiv.classList.add('green');
        }
        else {  // hvis fraværende
            elevDiv.classList.add('red');
            eleverFravaer.push(elever[i]);
        }
        elevDiv.onclick = () => { fravaer(elever[i]) };                                                     //Kjører funskjonen fravaer() når buttonen blir trykket

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

function fravaer(elev) {
    console.log(elev)
    
    if ($('#'+elev).classList.contains("green")) {
        document.getElementById(elev).classList.remove('green');
        document.getElementById(elev).classList.add('red');
        
        let elevIndex = elever.indexOf(elev);                                               //Finner indexen til eleven registrert
        eleverFravaer.push(elever[elevIndex]);                                              //Legger til eleven i arrayet over de som får fravær
        elever.splice(elevIndex, 1);                                                        //Fjerner fra hovedlista
    }
    else {
        document.getElementById(elev).classList.remove('red');
        document.getElementById(elev).classList.add('green');

        let elevIndex = eleverFravaer.indexOf(elev);
        elever.push(eleverFravaer[elevIndex]);
        eleverFravaer.splice(elevIndex, 1);
    }
}

function eleverTilstede() {                                                             // lagrer fravær
    sessionStorage.setItem("valgtKlasse", JSON.stringify({
        klassekode: valgtKlasse.klassekode,
        elever: elever
    }));
    aktiverAnimasjon("Fravær lagret",3100);
    setTimeout(() => {
        document.body.onclick = () => {
            window.location = 'klassebehandling.html';
        }
    }, 200);
}