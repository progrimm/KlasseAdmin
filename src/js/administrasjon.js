// Henter lagret data
const Store = require('electron-store');
const store = new Store();
let data = store.store.data_klasser;

let valgtKlasse = ""; // Husker valgt klasse ved redigering, brukes som sjekk om det er ny klasse eller redigering

window.onload = () => {
    includeHTML(); // Aktiverer importert html fil
    oppdaterTabell();

    $("#btnLeggTil").onclick = leggTilKlasse;

    $("#btnLagreKlasse").onclick = lagreKlasse;

    // Lukk modal ved trykk utenfor innholdet
    window.onmousedown = (evt) => {
        if (evt.target == $("#wholeModal")) {
            $("#wholeModal").style.display = "none";
        }
        // else if (evt.target == $("#warning_modal")) {
        //     $("#warning_modal").style.display = "none";
        // }
        // else if (evt.target == $("#error_modal")) {
        //     $("#error_modal").style.display = "none";
        // }
    }
    // gjør at man ikke kan trykke tilbake med nettleser-navigering
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', () => {
        history.pushState(null, null, document.URL);
    });
}

function oppdaterTabell() {
    valgtKlasse = "";
    $("#tableOversiktKlasser").innerHTML = "";

    // Fyller ut tabellen med klassene
    for (let klassekode in data) {
        let radKlasse = document.createElement("tr");

        let kode = document.createElement("td");
        kode.innerHTML = klassekode;

        let elever = document.createElement("td");
        elever.innerHTML = data[klassekode]["elever"].length;

        let rediger_celle = document.createElement("td");
        let btnRediger = document.createElement("p");
        btnRediger.innerHTML = "Rediger";
        btnRediger.className = 'btn';
        btnRediger.onclick = () => {
            redigerKlasse(klassekode);   // åpne modal
        };
        rediger_celle.appendChild(btnRediger);

        let slett_celle = document.createElement("td");
        let btnSlett = document.createElement("p");
        btnSlett.innerHTML = "Slett";
        btnSlett.className = 'btn btn-danger';
        btnSlett.onclick = () => {
            slett_advarsel(klassekode); // åpne modal
        };
        slett_celle.appendChild(btnSlett);

        radKlasse.append(kode, elever, rediger_celle, slett_celle);
        $("#tableOversiktKlasser").appendChild(radKlasse);
    }
}

function oppdaterData() {
    // flytter data over i liste for å sortere
    let klasseliste = [];
    for (const klassekode in data) {
        klasseliste.push([klassekode, data[klassekode]]);   // [klassekode, klasseobjekt]
    }
    // sorterer klasser alfabetisk ut fra klassekode, som er element [0]
    klasseliste.sort((a, b) => {
        return b[0].localeCompare(a[0]);
    })
    // legger til objektene i data igjen, nå i alfabetisk rekkefølge
    data = {};
    for (const klasse of klasseliste) {
        data = Object.assign({
            [klasse[0]]: klasse[1]
        }, data);
    }

    store.set("data_klasser", data);

    data = store.store.data_klasser;
}

function slett_advarsel(klassekode) {
    $("#warning-shade").style.display = "initial";
    $("#warning-msg").innerHTML = "Ved å slette " + klassekode + " forsvinner den for alltid. Dette kan ikke angres!"
    $("#warning-confirm").onclick = () => {
        slettKlasse(klassekode);
    }   
}

// Sletter klassa fra objektet data
function slettKlasse(klassekode) {
    delete data[klassekode];
    $("#warning-shade").style.display = "none";
    $("#wholeModal").style.display = "none";
    oppdaterData();
    oppdaterTabell();
    aktiverAnimasjon(`${klassekode} er slettet`);
}

function leggTilKlasse() {
    $("#wholeModal").style.display = "block";
    $("#modalHeaderText").innerHTML = "Ny klasse";
    $("#btnLagreKlasse").innerHTML = "Legg til";
    $("#btnLagreKlasse").onclick = lagreKlasse;

    $("#inpKlassekode").value = "";
    $("#inpElever").value = "";

    $("#inpKlassekode").placeholder = "Eks.: 2MATR";
    $("#inpElever").placeholder = "Skill elevene med komma. Eks.: 'Åmund, Jon, Erik, Kjell'";
    valgtKlasse = "";  // fjerner valgt klasse
}

function redigerKlasse(klassekode) {
    $("#wholeModal").style.display = "block";
    $("#modalHeaderText").innerHTML = "Rediger - " + klassekode;
    $("#btnLagreKlasse").innerHTML = "Lagre";
    $("#btnLagreKlasse").onclick = lagreKlasse;

    $("#inpKlassekode").value = klassekode;
    let elever = data[klassekode]["elever"];
    let txt = elever[0];    // streng som alle elevene legges til i med komma og mellomrom mellom
    for (let index = 1; index < elever.length; index++) {
        const elev = elever[index];
        txt += ', ' + elev;
    }
    $("#inpElever").value = txt;

    valgtKlasse = klassekode;
}

function lagreKlasse() {
    // Henter data på nytt for at ting skal funke
    // data = JSON.parse(fs.readFileSync(dataFilename));
    data = store.store.data_klasser;

    // Henter verdier fra inputfeltene
    let nyKlassekode = $("#inpKlassekode").value;
    let nyeElever = $("#inpElever").value;
    nyKlassekode = tekstbehandling_klasse(nyKlassekode);    // fjerner mellomrom
    nyeElever = tekstbehandling(nyeElever); // Formaterer input-tekst, returnerer array

    if (!nyKlassekode) {    // hvis klassekode ikke er skrevet inn eller bare er mellomrom
        $("#error-msg").innerHTML = "Vennligst oppgi en klassekode.";
        $("#error-shade").style.display = "initial";
        return;
    } else if (!nyeElever[0]) {
        $("#error-msg").innerHTML = "Vennligst legg til elever.";
        $("#error-shade").style.display = "initial";
        return;
    }
    // sjekker om det er elever som heter det samme
    for (let i = 0; i < nyeElever.length; i++) {
        let liste_uten_elev_nr_i = nyeElever.slice();
        liste_uten_elev_nr_i.splice(i, 1);
        if (liste_uten_elev_nr_i.includes(nyeElever[i])) {
            $("#error-msg").innerHTML = "To elever kan ikke ha samme navn. Prøv å legge til første bokstav i etternavnet til elevene i tillegg.";
            $("#error-shade").style.display = "initial";
            return;
        }
    }

    // klassekart til den nye klassa + utdatert kart status
    let klassekart = [];
    let klassekart_oppsett = {
        per_bord: 0,
        rader: 0,
        kolonner: 0
    };
    let utdatert_kart = false;

    let melding_fullfort_endring = `${nyKlassekode} lagt til`

    if (valgtKlasse !== "") {   // hvis klassen redigeres
        klassekart = data[valgtKlasse].klassekart;   // tar vare på klassekartet
        klassekart_oppsett = data[valgtKlasse].klassekart_oppsett;
        utdatert_kart = true;
        delete data[valgtKlasse];   // fjerner klasse, for så å legge til igjen med oppdatert data
        melding_fullfort_endring = `${nyKlassekode} er lagret`;
    }

    // Sjekker om klassa finnes fra før
    for (klassekode in data) {
        if (klassekode === nyKlassekode) {
            $("#error_modal_melding").innerHTML = "Oppgitt klassekode finnes fra før. Prøv igjen."
            $("#error_modal").style.display = "block";
            return;
        }
    }

    // Lager objekt for den nye klassa
    let nyKlasse = {
        [nyKlassekode]: {
            elever: nyeElever,
            klassekart: klassekart,
            klassekart_oppsett: klassekart_oppsett,
            utdatert_kart: utdatert_kart
        }
    };

    data = Object.assign(nyKlasse, data);

    valgtKlasse = "";
    $("#wholeModal").style.display = "none";
    oppdaterData();
    oppdaterTabell();
    aktiverAnimasjon(melding_fullfort_endring);

    // 
    // gi link til klassekart
    // 
}

// Takk til Jon for kreativt innslag                // bare hyggelig :) -Jon       //Jon er flink og søt! -Erik     // <3 -Jon
function tekstbehandling(nye_elever) {
    let elever = nye_elever.split(',');             // deler opp på komma
    let i = 0;
    while (i < elever.length) {
        elever[i] = elever[i].split('\n').join(''); // tar bort linjeskift
        elever[i] = elever[i].split(' ');           // deler opp på mellomrom
        let j = 0;
        while (j < elever[i].length) {
            if (elever[i][j] === '') {
                elever[i].splice(j, 1);             // sletter tomme elementer
            } else j++;
        }
        elever[i] = elever[i].join(' ');            // setter de sammen igjen med mellomrom mellom

        if (elever[i] === '') {
            elever.splice(i, 1);                    // sletter tomme elev-elementer
        } else i++;
    }
    // elever.sort((a, b) => {                         // sorterer alfabetisk
    //     return a.localeCompare(b);
    // })

    return elever;
}

function tekstbehandling_klasse(klassekode) {
    klassekode = klassekode.split(' ');
    let i = 0;
    while (i < klassekode.length) {
        if (klassekode[i] === '') klassekode.splice(i, 1);
        else i++;
    }
    return klassekode.join(' ');
}