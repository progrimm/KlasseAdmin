/*Testvariabler*/
//var testKlasse = ["Julianne","Adrian","Smil","Hege","Sine","Lisa","Sven","Jon","Magnus","Åmund","Erik","Mikkel","Anders"];         //Bare en testklasse
var testKlasse = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];         //Bare en testklasse
var testAntall = 11;                                                         //Enten antall grupper som skal lages, eller antall elever som skal være i gruppene
var testSortering = "elev";                                                 //"gruppe" eller "elev"

/*Gruppefunskjonen*/
function gruppe(klasse, grupper, sortering) {
    var feil = false;                                                           //Registrering av en feil
    var feilmelding = "";                                                       //Mulighet for feilmelding 
    var reverseringAvFerdigListe = false;                                       //Gjør det mulig å ikke reversere listen
    
    var lagUtIfra = sortering;                                              //Variabel som forteller programmet om den skal regne ut ifra antall grupper eller elever   
    var elever = klasse;                                                    //Klassen som et array
    var antallGrupper = grupper;                                            //Hvor mange grupper som skal lages, eller hvor mange elever per gruppe
    if(isNaN(antallGrupper)) {                                              //Sjekker at antallet oppgitt er en gyldig verdi     
        feil = true;                                                        //Hvis ikke gyldig, registreres feilen, og feilmelding returneres neders
        feilmelding = 'Beklager, men "' + antallGrupper + '" er ikke et antall.';
    }
    else {
        antallGrupper = Math.abs(grupper);                                  //Hvis gyldig, gjør om til positivt tall, slik at negative tall ikke skal ødelegge 
    }
                                                                     
    var ferdigGrupper = [];                                                 //Initsialierer to arrayer for lagring av gruppene
    var undergruppe = [];
                                                                            
    if(lagUtIfra === "gruppe") {                                            //Sjekk for å lage variablene riktig utifra sortering på elever eller grupper
        if(parseInt(elever.length / antallGrupper) < 2) {                   //Gjør en utregning hvis det blir så få grupper, at det blir bare 1 person per gruppe.
            var maksMuligeGrupper = 0;                                      //Lagrer største mulig antall grupper
            for(var k = 1; k < 1000; k++) {                                 //For-løkke som jobber seg oppover for å finne punktet hvor det bare blir 1 person på gruppa.
                if(parseInt(elever.length / k) > 1) {                       //Så lenge antall grupper (k) er større enn 1, når delt på lengden av klassen, 
                    maksMuligeGrupper = k;                                  //vil den bli den nye verdien til maksMuligeGrupper
                }
                else {
                    break;                                                  //Avslutter nå maksimalt antall funnet, for å ikke kjøre 1000 ganger
                }
            }
            antallGrupper = maksMuligeGrupper;                              //Gjør om det oppgitte antallet til det maksimale antalet nettopp funnet ut
        }
        var antallPerGruppe = parseInt(elever.length / antallGrupper);      //Finner hvor mange personer det blir per gruppe
        var personForMye = elever.length % antallGrupper;                   //Regner resten, antall over heltallet over
    }
    else if(lagUtIfra === "elev") {
        var antallPerGruppe = antallGrupper; 
        var personForMye = elever.length % antallGrupper;
        antallGrupper = parseInt(elever.length / antallGrupper);

        if(parseInt(elever.length / antallPerGruppe) < 2) {                 //Enda mer idiotsikring, hvis læreren skulle velge ett antall som blir for høyt logisk
            var maksMuligeAntallPerGruppe = 0;
            for(var m = 1; m < 1000; m++) {                                 //Finner det høyeste tallet for elever per gruppe
                if(parseInt(elever.length / m) > 1) {
                    maksMuligeAntallPerGruppe = m;
                }
                else {
                    break;                                                  //Avslutter løkka når det antallet er funnet
                }
            }
            antallPerGruppe = maksMuligeAntallPerGruppe;                    //Antall per gruppe blir nå det maksimale mulige
            antallGrupper = parseInt(elever.length / antallPerGruppe);      //Antall grupper blir nå hvor mange elever det er delt på antall elever per gruppe
            personForMye = elever.length % antallPerGruppe;                 //Person for mye blir resten
            reverseringAvFerdigListe = true;                                //Forhindrer reversering av løkka, slik at den gruppa med flest i kommer først
        }
        if(personForMye > antallGrupper && elever.length % 2 !== 0 && antallPerGruppe - personForMye !== 1) {       //Idiotsikring. Hvis det er flere personer til overs, enn det er grupper, endres verdiene for å passe bedre
            antallPerGruppe = parseInt(elever.length / personForMye);       //antallPerGruppe blir nå antall elever delt på hvor mange til overs
            personForMye = elever.length % personForMye;                    //Finner nå ut hvor mange det er til overs, når det er flere per gruppe
            antallGrupper = parseInt(elever.length / antallPerGruppe);      //Finner nytt antall grupper den skal lage
            reverseringAvFerdigListe = true;
        }
        else if(personForMye > antallGrupper && antallPerGruppe - personForMye === 1){ //Idiotsikring til helvete og lenger, ekstra gruppe hvis mange  
            antallGrupper++;                                                //Lager ekstra gruppe hvor ekstraelevene blir plassert i
            personForMye = 0;                                               //Gjør at det er ingen blir ekstra, fordi de legges nå i en egen gruppe
            reverseringAvFerdigListe = true;
        }
    }

    console.log("Gammel versjon");
    console.log("Antall per gruppe: " + antallPerGruppe);
    console.log("Antall grupper: " + antallGrupper);
    console.log("Antall til overs: " + personForMye);
                                                                            
    for(var i = 0; i < antallGrupper; i++) {                                //Kjører for hvor mange grupper det skal lages. Fordeler elevene random på x-antall grupper
        for(var j = 0; j < antallPerGruppe; j++) {                          //Kjører for hvor mange elever det skal være per gruppe
            var elevNr = Math.floor(Math.random() * elever.length);         //Finner en random index mellom 0 og lengden av klassen
            var elevNavn = elever[elevNr];                                  //Finner eleven ut ifra indexen funnet over
            if(elevNavn !== undefined) {                                    //Hvis det ikke er noe elevnavn, legger den ikke til det i arrayet
                undergruppe.push(elevNavn);                                 //Legger eleven i et midlertidig array
            }
            elever.splice(elevNr, 1);                                       //Sletter eleven fra originallisten
        }
        if(personForMye > 0) {                                              //Hvis det er personer ekstra, legges de til en om gangen her
            var ekstraElevNr = Math.floor(Math.random() * elever.length);
            var ekstraElevNavn = elever[ekstraElevNr];
            undergruppe.push(ekstraElevNavn);
            elever.splice(ekstraElevNr, 1);
            personForMye--;                                                 //Fjerner en verdi fra originalverdien
        }
        ferdigGrupper.push(undergruppe);                                    //Legger den midlertidlige gruppa med elevene i det ferdige arrayet
        undergruppe = [];                                                   //Tømmer det midlertidlige array, slik at neste gruppe kan lages
    }

    if(reverseringAvFerdigListe === true && sortering === "elev") {}        //Forhindrer at listen reverseres, slik at læreren får riktig antall øverst    
    else {
        ferdigGrupper.reverse();                                            //Reverserer ferdige lista, for å få "riktig" antall øverst
    }
    
    if(feil === true) {                                                     //Hvis en feil er registrert, vil den returnere feilmeldingen
        return feilmelding;                                                 //Returnerer feilmeldingen laget lenger oppe
    }
    else {
        return ferdigGrupper;                                               //Hvis ikke returnerer den de ferdiglagde gruppene
    }
}

/*Midlertidlig. Kun for å se gruppene*/
gruppe(testKlasse, testAntall, testSortering);