const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
let data = JSON.parse(fs.readFileSync(dataFilename));
const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse")); // Henter valgte klassa
let klasse = data[valgtKlasse.klassekode];
let elever = klasse["elever"]; // Henter elevene

document.title = valgtKlasse.klassekode + " - Gruppeinndeling";

window.onload = () => {
    document.getElementById("slcInndeling").onchange = valgfelt;
}

function valgfelt() {
    let typInndeling = document.getElementById("slcInndeling").value;
    let btnAntall = document.getElementById("btnUserSubmit");
    let divAntall = document.getElementById("divAntall");
    
    if(typInndeling === "gruppe") {
        btnAntall.style.display = "initial";
        divAntall.innerHTML = "<p>Antall grupper: <select id='slcAntall'><option selected disabled>Velg antall grupper</option></select></p>"
    } else {
        btnAntall.style.display = "initial";
        divAntall.innerHTML = "<p>Antall elever per gruppe: <select id='slcAntall'><option selected disabled>Velg antall elever</option></select></p>"
    }

    for(let i = 2; i <= ~~(elever.length / 2); i++) {
        let option = document.createElement("option");
        option.innerHTML = i;
        option.value = i;
        document.getElementById("slcAntall").appendChild(option);
    }
    
    document.getElementById("slcAntall").onchange = enableBtn;
}

function enableBtn() {
    document.getElementById("btnUserSubmit").disabled = false;
    document.getElementById("btnUserSubmit").style.cursor = "pointer";
    
    let antallInndeling = document.getElementById("slcAntall").value;
    let typeInndeling = document.getElementById("slcInndeling").value;
    document.getElementById("btnUserSubmit").onclick = () => {
        gruppeinndeling(antallInndeling, typeInndeling);   
    }
}

function sortRandom(element) {
    let liste = element, indeks = [], randomListe = [...Array(liste.length).keys()];    //Deklarerer tre arrayer som brukes og gir viktige verdier
    while(indeks.length < liste.length){                                                //Løkke for å fylle indeks med like mange randome indekser som lengden på innsendt liste
        let randomIndex = ~~(Math.random() * liste.length);                             //Lager random tall. ~~ = Math.floor
        indeks.includes(randomIndex) ? null : indeks.push(randomIndex)};                //Hvis array for random indeks inneholder random tall, legges det ikke til i arrayet
    randomListe = randomListe.map(x => liste[indeks[x]]);                               //For hvert element i randomListe, henter den et element i innsendt liste som tilsvarer indeks i arrayet indeks
    return randomListe;
}

function gruppeinndeling(antall, type) {
    let lagUtIFra = type;
    let antallPerInndeling = antall;
    let klasse = sortRandom([...elever]);
    let grupper = [];
    
    if(lagUtIFra === "gruppe") {
        if((klasse.length / antallPerInndeling) < 2) {
            antallPerInndeling = ~~(klasse.length / 2);
        } else if(antallPerInndeling === 0) {
            antallPerInndeling = 1;
        }

        for(let i = 0; i < antallPerInndeling; i++) {
            grupper.push([]);
        }

        let j = 0;
        while(klasse.length > 0) {
            grupper[j].push(klasse[0]);
            klasse.shift();
            j++;
            if(j === grupper.length) {
                j = 0;
            }
        }
        // console.log(grupper.map(i => i.length));
        // let sum = 0;
        // grupper.forEach(x => {
        //     sum += x.length;
        // });
        // console.log(sum);
    } else {
        if(~~(klasse.length / 2) < antallPerInndeling) {
            antallPerInndeling = ~~(klasse.length / 2);
        }
        let antallGrupper = ~~(klasse.length / antallPerInndeling);

        for(let i = 0; i < antallGrupper; i++) {
            let midGruppe = [];
            for(let j = 0; j < antallPerInndeling; j++) {
                midGruppe.push(klasse.shift());
            }
            grupper.push(midGruppe);
        }

        if(antallPerInndeling - klasse.length === 1) {
            if(klasse.length === 1) {
                grupper[grupper.length - 1].push(klasse);
            } else {
                grupper.push(klasse);
            }
        } else {
            if(antallPerInndeling / klasse.length > 2) { //Putte resten i eksisterende grupper
                let l = 0;
                for(let i = 0; i < klasse.length; i++) {
                    grupper[l].push(klasse[i]);
                    l++;
                    if(l >= grupper.length) {
                        l = 0;
                    }
                }
            } else { //Fordele gruppene
                let k = 0;
                klasse.forEach(x => {
                    if(grupper[0].length - klasse.length > 1) {    
                        klasse.push(grupper[grupper.length - 1 - k].pop());
                    }
                    k++;
                    if(k >= grupper.length) {
                        k = 0;
                    }
                });
                grupper.push(klasse);
            }
        }
        // console.log(grupper.map(i => i.length));
        // let sum = 0;
        // grupper.forEach(x => {
        //     sum += x.length;
        // });
        // console.log(sum);
    }
    utskrift(grupper);
}

function utskrift(grupper) {
    let utskriftGrupper = grupper;
    let utskriftArea = document.getElementById("utskrift");
    utskriftArea.innerHTML = "";
    
    utskriftGrupper.forEach((x, key) => {
        utskriftArea.innerHTML += "<p id='gruppe" + (key + 1) + "'><span class='printaGrupper'>Gruppe " + (key + 1) + ":<span> </p>";
        x.forEach((y, last) => {
            if(x.length - 1 > last) {
                document.getElementById("gruppe" + (key + 1)).innerHTML += y + ", ";
            } else {
                document.getElementById("gruppe" + (key + 1)).innerHTML += y + ".";
            }
        });
    });
}