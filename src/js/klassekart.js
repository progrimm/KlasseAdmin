const testKlasse = ["Åmund", "Kristoffer", "Karl Elias", "Erik", "Jon", "Sven", "Magnus", "Mikkel", "Bonsa"];
const laerer = "Kjell";
let antallKlikk = 0;

let perBord, rader, kolonner;

window.onload = () => {
    $("#btnNyttKlassekart").onclick = nyttKlassekart;
    $("#btnSnuKlassekart").onclick = snuKlassekart;
}


function nyttKlassekart() {

    perBord = parseInt($("#inputEleverPerBord").value);     // Henter strukturen klassekartet skal genereres på
    rader = parseInt($("#inputAntallRader").value);
    kolonner = parseInt($("#inputAntallKolonner").value);

    if (rader * kolonner * perBord < testKlasse.length) {
        alert("Klasserommet er for lite i forhold til antall elever.")
    }
    else {
        lagKlassekart();  // Kaller funksjonen
    }
}

function lagKlassekart() {

    $("#tableKlassekart").innerHTML = "";

    var klasse = testKlasse.map((elev) => elev);

    klasse = shuffleStudents(klasse);     // Stokker elevene

    let laererbord = lagLaererbord();
    $("#tableKlassekart").appendChild(laererbord);

    let elevID = 0; // Løpetall for elevene
    for (let i = 0; i < rader; i++) {    // Lager tabell-struktur og setter inn elevene
        // Først radene som tabellrader
        let rad = document.createElement("tr");
        rad.id = "rad" + i;
        $("#tableKlassekart").appendChild(rad);
        // Så bordene som tabellceller
        for (let j = 0; j < kolonner; j++) {
            let bord = document.createElement("td");
            bord.id = "rad" + i + "kolonne" + j;
            $("#rad" + i).appendChild(bord);
            // Så elevene som knapper
            for (let k = 0; k < perBord; k++) {
                let btnElev = document.createElement("button");
                btnElev.id = "rad" + i + "kolonne" + j + "nr" + k;
                btnElev.classList.add("elev");
                let elevNavn = (klasse[elevID] !== undefined ? klasse[elevID] : ".");
                btnElev.innerHTML = elevNavn;
                btnElev.addEventListener("click", byttePlass);   // Legger til hendelseslytter på elevene så man kan bytte plasser
                elevID++
                $("#rad" + i + "kolonne" + j).appendChild(btnElev);
            }
        }
    }
}

// Durstenfelds sorteringsalgoritme
function shuffleStudents(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function lagLaererbord() {
    let laererbord = document.createElement("th");
    laererbord.innerHTML = laerer;
    laererbord.colSpan = "" + kolonner;
    let rad = document.createElement("tr");
    rad.appendChild(laererbord);
    return rad;
}

// Henter ut elev
function velgerElev(arr, id) {
    let valgtElev = (arr[id] !== undefined ? arr[id] : ".");
    return valgtElev;
}

// Funksjon for å bytte plasser
function byttePlass(evt) {
    if (antallKlikk === 1) {
        let elev1 = evt.target.innerHTML;
        let elev2 = $("#" + elev1ID).innerHTML;
        $("#" + elev1ID).innerHTML = elev1;
        $("#" + elev1ID).style.backgroundColor = "";
        evt.target.innerHTML = elev2;
        antallKlikk--;
    }
    else {
        elev1ID = evt.target.id;
        $("#" + elev1ID).style.backgroundColor = "lime";
        antallKlikk++
    }
}

function snuKlassekart() {
    var tabell = $("#tableKlassekart");
    var rader = [];
    for (let i = 0, rad; rad = tabell.rows[i]; i++) {

        var celler = [];
        for (let j = 0, celle; celle = rad.cells[j]; j++) {
            if (celle.nodeName !== "TH") {
                console.log(celle.childNodes.length);
                switch (celle.childNodes.length) {
                    case 2:
                        celle.insertBefore(celle.childNodes[1], celle.childNodes[0]);
                        break;
                    case 3:
                        celle.insertBefore(celle.childNodes[2], celle.childNodes[0]);
                        celle.insertBefore(celle.childNodes[2], celle.childNodes[1]);
                        break;

                }
            }
            celler.push(celle.innerHTML);
        }
        celler.reverse();
        for (let j = 0, celle; celle = rad.cells[j]; j++) {
            celle.innerHTML = celler[j];
        }

        rader.push(rad.innerHTML);
    }
    rader.reverse();
    for (let i = 0, rad; rad = tabell.rows[i]; i++) {
        rad.innerHTML = rader[i];
    }
}



