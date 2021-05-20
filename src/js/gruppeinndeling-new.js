/*henter klasse fra session storage*/
//const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
//const klasse = valgtKlasse.klassekode;
//const elever = valgtKlasse.elever;

/*Testvariabler*/
let testKlasse = ["Julianne","Adrian","Smil","Hege","Sine","Lisa","Sven","Jon","Magnus","Åmund","Erik","Mikkel","Anders","Ulrik"];         //Bare en testklasse
let testAntall = 3;                                                         //Enten antall grupper som skal lages, eller antall elever som skal være i gruppene
let testSortering = "gruppe";                                                 //"gruppe" eller "elev"

function gruppeinndeling(elever, antall, sortering) {
    let reverseringAvFerdigListe = false;
    let [lagUtIFra, klasse, antallPerInndeling] = [sortering, elever, Math.abs(antall)];
    let ferdigGrupper = [];
    let undergruppe = [];

    if(lagUtIFra === "gruppe") {
        
    } else {
        
    }
}

console.log(gruppeinndeling(testKlasse, testAntall, testSortering));