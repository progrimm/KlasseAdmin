/*henter klasse fra session storage*/
//const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
//const klasse = valgtKlasse.klassekode;
//const elever = valgtKlasse.elever;

/*Testvariabler*/
let testKlasse = ["Julianne","Adrian","Smil","Hege","Sine","Lisa","Sven","Jon","Magnus","Åmund","Erik","Mikkel","Anders","Ulrik"];         //Bare en testklasse
let testAntall = 11;                                                         //Enten antall grupper som skal lages, eller antall elever som skal være i gruppene
let testSortering = "elev";                                                 //"gruppe" eller "elev"

function gruppeinndeling(elever, antall, sortering) {
    let reverseringAvFerdigListe = false;
    let [lagUtIFra, klasse, antallPerInndeling] = [sortering, elever, Math.abs(antall)];
    let ferdigGrupper = [];
    let undergruppe = [];

    if(lagUtIFra === "gruppe") {
        if((klasse.length / antallPerInndeling) < 2) {
            let iteration = true;
            while(iteration) {
                antallPerInndeling++;
                if((klasse.length / antallPerInndeling) === 1) {
                    iteration = false;
                }
            }
            antallPerInndeling = ~~(antallPerInndeling / 2)
        }
        let antallPerGruppe = ~~(klasse.length / antallPerInndeling);
        let personEkstra = klasse.length % antallPerInndeling;
    } else {
        let personEkstra = klasse.length % antallPerInndeling;
        let antallGrupper = ~~(klasse.length / antallPerInndeling);

        
    }
}

gruppeinndeling(testKlasse, testAntall, testSortering);