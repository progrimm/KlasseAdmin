// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data_nedtelling.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

let klokka_gaar = paa_overtid = false;
let min = start_min = data.min;
let sek = start_sek = data.sek;
let nedteller_intervall, overtid_intervall;

window.onload = () => {

    // Spørs fra hvilken side man trykket nedtelling fra
    var nedtelling_fra_index = sessionStorage.getItem("nedtelling_fra_index");
    if (nedtelling_fra_index) {
        $("#back_icon").onclick = () => {
            sessionStorage.removeItem("nedtelling_fra_index");
            window.location = "index.html";
        }
    }
    else {
        $("#back_icon").onclick = () => {
            window.location = "klassebehandling.html";
        }
    }

    lyd = new Audio('multimedia/gong.mp3');

    veksle = $('#veksle_start_stopp');
    minutt = $('#minutt');
    sekund = $('#sekund');
    minutt.value = nuller_foran(min);
    sekund.value = nuller_foran(sek);
    // lyttere
    $('#nullstill').onclick = nullstill;
    veksle.onclick = start_eller_stopp;
    // stopper klokka hvis bruker fokuserer på inputfeltene
    minutt.onfocus = () => {
        stopp_nedtelling();
        minutt.select() // markerer tall
    }
    sekund.onfocus = () => {
        stopp_nedtelling();
        sekund.select() // markerer tall
    }
    // setter nye startverdier for min og sek hvis bruker gjør endringer
    minutt.onchange = sekund.onchange = () => {
        start_min = Math.abs(Math.floor(minutt.value));
        start_sek = Math.abs(Math.floor(sekund.value));
    }
    minutt.oninput = sekund.oninput = () => {
        // behandler input slik at det bare er to siffer i input
        bare2siffer();
        // formatering?
    }

    $('#lagre_tid').onclick = oppdater_standard_tid;
}

function nedteller() {
    sek--;
    // ved minuttskifte
    if (sek < 0) {
        sek = 59;
        min--;
    }

    minutt.value = nuller_foran(min);
    sekund.value = nuller_foran(sek);
    if (min === 0 && sek === 0) { // nedtelling ferdig
        clearInterval(nedteller_intervall);
        // teller hvor mye nedtellingen er på overtid
        overtid_intervall = setInterval(overtid_stoppeklokke, 1000);
        paa_overtid = true;

        if (lyd.paused) lyd.play();
        else new Audio('multimedia/gong.mp3').play();

        setTimeout(() => {
            if (klokka_gaar) $('#minus').innerHTML = '-';
        }, 1000);    // minus foran tallene
        minutt.style.color = sekund.style.color = 'red'; // negative tall blir rød
    }
}

function start_eller_stopp() {
    min = Math.abs(Math.floor(minutt.value));
    sek = Math.abs(Math.floor(sekund.value));
    if (sek >= 60) {    // ved for mange sekunder i input
        min += 1;       // blir aldri mer enn ett min ekstra
        sek %= 60;      // sekundene til overs
        minutt.value = nuller_foran(min);
        sekund.value = nuller_foran(sek);
    }

    if (klokka_gaar) {
        stopp_nedtelling();
        if (paa_overtid) nullstill()    // nullstiller hvis klokka er på overtid selv når bruker trykker stopp
    }
    else {  // setter i gang klokka
        if (min === 0 && sek === 0) return; // setter ikke i gang nedtelling fra 00:00
        nedteller_intervall = setInterval(nedteller, 1000);  // kjører nedtellerfunksjonen hvert sek
        klokka_gaar = true;
        veksle.innerHTML = 'Stopp';
        veksle.className = 'btn btn-danger';
    }
}

function stopp_nedtelling() {
    klokka_gaar = false;
    veksle.innerHTML = 'Start';
    veksle.className = 'btn btn-success';
    $('#minus').innerHTML = '';
    $('#nedteller').style.color = minutt.style.color = sekund.style.color = 'black';
    clearInterval(nedteller_intervall);
    clearInterval(overtid_intervall);
}

function nullstill() {
    stopp_nedtelling();
    paa_overtid = false;
    minutt.value = nuller_foran(start_min);
    sekund.value = nuller_foran(start_sek);
}

function overtid_stoppeklokke() {
    sek++;
    // ved minuttskifte
    if (sek === 60) {
        sek = 0;
        min++;
    }
    minutt.value = nuller_foran(min);
    sekund.value = nuller_foran(sek);
}

function nuller_foran(tall) {   // legger til nuller foran
    let plasser = 2;
    let tall_med_0 = "00" + tall;
    // tar med så mange nuller som trengs
    return tall_med_0.substr(tall_med_0.length - plasser);
}

function bare2siffer() {  // lar det til en hver tid bare være to siffer i input
    let min_str = minutt.value;
    if (min_str.length > 2) {
        minutt.value = min_str.substr(min_str.length - 2);
    } else minutt.value = nuller_foran(min_str);
    let sek_str = sekund.value;
    if (sek_str.length > 2) {
        sekund.value = sek_str.substr(sek_str.length - 2);
    } else sekund.value = nuller_foran(sek_str);
}

function oppdater_standard_tid() {
    let tid = {
        min: minutt.value,
        sek: sekund.value
    }
    let oppdatert_tid = JSON.stringify(tid, null, '\t');

    fs.writeFileSync(dataFilename, oppdatert_tid, function (err) {
        if (err) throw err;
    });
}