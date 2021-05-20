// henter klasse fra session storage
const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
const klasse = valgtKlasse.klassekode;
const elever = valgtKlasse.elever;

document.title = valgtKlasse.klassekode + " - Fravær";
window.onload = oppstart;

// Klasse = ["Erik","Åmund","Jon","Kjell","Bryan","Sindre","Bonsa","Mathilde","Sven","Magnus","Adrian","Julianne","Ola","Anders","Mikkel","Andreas","Herman","Ulrik"]; //Ordentlig klasse med elever

let eleverFravaer = [];                                                                     //Lagrer de som ikke har vært tilstede for seinere bruk

function oppstart() {
    document.getElementById("elevListe").innerHTML = "";    // sletter alt i hoveddiven
    eleverFravaer = [];     // tømmer lista med fraværende elever
    document.getElementById('valgt_klasse').innerHTML =klasse;

    const listeLengde = elever.length;
    for(let i = 0; i < listeLengde; i++) {                                                  //Lager en div til hver elev
        let elevDiv = document.createElement("div");
        elevDiv.id = elever[i];
        elevDiv.className = "elevDiv";

        let nyElevNavn = document.createElement("p");
        nyElevNavn.innerHTML = elever[i];

        let nyBtnFravaer = document.createElement("button");
        nyBtnFravaer.id = "btnFravaer" + elever[i];
        nyBtnFravaer.className = "btnFravaer";
        nyBtnFravaer.value = "green";
        nyBtnFravaer.innerHTML = "Tilstede";
        nyBtnFravaer.onclick = fravaer;                                                     //Kjører funskjonen fravaer() når buttonen blir trykket

        document.getElementById("elevListe").appendChild(elevDiv);                          //Legger til diven for eleven på nettsiden
        document.getElementById(elever[i]).appendChild(nyElevNavn);                         //Legger til navnet i den diven nettopp lagt til
        document.getElementById(elever[i]).appendChild(nyBtnFravaer);                       //Legger til knappen også :)
    }
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
    window.location = 'klassebehandling.html'
}


// 
// 'Innlogging'
// 

// var laerer_id;
// var klasse_data;

// function oppstart_innlogging() {
//     laerer_id = document.getElementById('laerer_id');
//     laerer_id.focus();      // fokuserer på inputfeltet
//     document.getElementById('btn_laerer').onclick = req;
//     onkeydown = function (evt) {        // hvis brukeren trykker på enter
//         if (evt.keyCode === 13 && laerer_id === document.activeElement) req();
//     }
// }

// async function req() {
//     if (laerer_id.value !== '') {                   // hvis det er skrevet inn noe i inputen
//         let em = document.getElementById('valg_klassekoder');
//         while (em.lastChild) em.removeChild(em.lastChild);     // sletter alle child-elements
//         klasse_data = await( await fetch("/api/klasse_data/"+laerer_id.value)).json();  // henter klasser fra API

//         if (klasse_data.text !== 'undefined') {          // hvis læreren som ble skrevet inn har klasser
//             let klasseliste = klasse_data.klasser;       // legger klassene til lærer i liste
//             let klassekoder = [];
//             for (let i=0; i<klasseliste.length; i++)     // legger til klassekodene i liste
//                 klassekoder.push(klasseliste[i].id);
//             // generer valg av klasser
//             for (let i=0; i<klassekoder.length; i++) {
//                 let nytt_element = document.createElement('option');
//                 nytt_element.value = klassekoder[i];
//                 nytt_element.innerHTML = klassekoder[i];
//                 nytt_element.addEventListener('click',legg_til_klasse);    // legger til hendelseslytter til klassene
//                 em.appendChild(nytt_element);           // legger til nytt options-element
//             }
//         }
//     }
// }

// function legg_til_klasse() {
//     let klasse_id = document.getElementById('valg_klassekoder').value;
//     let klasser = klasse_data.klasser;
//     let elever;

//     // legge til angitt klasse i minnet //

//     for (let i=0; i<klasser.length; i++)    // kjører gjennom klassene til læreren og finner den med riktig id
//         if (klasser[i].id === klasse_id) elever = klasser[i].elever;    
    
//     elever = elever;
//     oppstart();
// }
