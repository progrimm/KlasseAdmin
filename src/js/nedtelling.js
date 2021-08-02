// Henter data fra fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data_nedtelling.json";
let data = JSON.parse(fs.readFileSync(dataFilename));

let klokka_gaar = paa_overtid = false;
let min = start_min = data.min;
let sek = start_sek = data.sek;
let nedteller_intervall, overtid_intervall;

window.onload = () => {
    includeHTML();

    $("#back_icon").onclick = () => {
        window.location = sessionStorage.getItem("nedtelling_ref");
    }
    lyd = new Audio('multimedia/gong.mp3');
    minuttviser = $('#minuttviser');
    sekundviser = $('#sekundviser');
    veksle = $('#veksle_start_stopp');
    minutt = $('#minutt');
    sekund = $('#sekund');
    nuller_foran(min, sek);
    still_inn_klokke(min, sek);

    // lyttere
    $('#nullstill').onclick = nullstill;
    veksle.onclick = start_eller_stopp;
    // stopper klokka hvis bruker fokuserer på inputfeltene
    minutt.onfocus = sekund.onfocus = () => {
        if (paa_overtid) nullstill();   // nullstiller hvis klokka er på overtid selv når bruker trykker stopp
        else stopp_nedtelling();
    }
    // setter nye startverdier for min og sek hvis bruker gjør endringer
    minutt.onchange = sekund.onchange = () => {
        start_min = Math.abs(Math.floor(minutt.value));
        start_sek = Math.abs(Math.floor(sekund.value));
    }
    minutt.oninput = sekund.oninput = () => {
        bare2siffer();  // behandler input slik at det bare er to siffer i input
        nuller_foran(minutt.value, sekund.value);
        still_inn_klokke(minutt.value, sekund.value)
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
    nuller_foran(min, sek);
    still_inn_klokke(min, sek);
    if (min === 0) {
        if (sek === 1) lyd = new Audio('multimedia/gong.mp3');  // laster inn lyd i god tid (lyden kutter noen ganger med deklarering bare i begynnelsen)
        else if (sek === 0) { // nedtelling ferdig
            clearInterval(nedteller_intervall);
            // teller hvor mye nedtellingen er på overtid
            overtid_intervall = setInterval(overtid_stoppeklokke, 1000);
            paa_overtid = true;

            if (lyd.paused) lyd.play();
            else new Audio('multimedia/gong.mp3').play();

            setTimeout(() => {
                if (overtid_intervall) $('#minus').innerHTML = '-';
            }, 1000);    // minus foran tallene
            minutt.style.color = sekund.style.color = 'var(--red)'; // negative tall blir rød
            $('.enhet')[0].style.color = $('.enhet')[1].style.color = 'var(--red)'; // enhetene blir rød
        }
    }
}

function start_eller_stopp() {
    min = Math.abs(Math.floor(minutt.value));
    sek = Math.abs(Math.floor(sekund.value));
    if (sek >= 60) {    // ved for mange sekunder i input
        min += 1;       // blir aldri mer enn ett min ekstra
        sek %= 60;      // sekundene til overs
        nuller_foran(min, sek);
        start_min = min;
        start_sek = sek;
    }
    if (klokka_gaar) {
        if (paa_overtid) nullstill();    // nullstiller hvis klokka er på overtid selv når bruker trykker stopp
        else stopp_nedtelling();
    }
    else {  // setter i gang klokka
        if (min === 0 && sek === 0) return; // setter ikke i gang nedtelling fra 00:00
        nedteller_intervall = setInterval(nedteller, 1000);  // kjører nedtellerfunksjonen hvert sek
        klokka_gaar = true;
        veksle.innerHTML = 'Stopp';
        veksle.className = 'btn btn-danger';
        $('#lagre_tid').className='btn btn-disabled';   // deakt. lagring
        still_inn_klokke(min,sek);
    }
}

function stopp_nedtelling() {
    klokka_gaar = false;
    veksle.innerHTML = 'Start';
    veksle.className = 'btn btn-success';
    $('#lagre_tid').className='btn';   // aktiverer lagring
    $('#minus').innerHTML = '';
    minutt.style.color = sekund.style.color = 'black';
    $('.enhet')[0].style.color = $('.enhet')[1].style.color = 'black';
    clearInterval(nedteller_intervall);
    clearInterval(overtid_intervall);
    overtid_intervall = false;
}

function nullstill() {
    stopp_nedtelling();
    paa_overtid = false;
    nuller_foran(start_min, start_sek);
    still_inn_klokke(start_min, start_sek);
}

function overtid_stoppeklokke() {
    sek++;
    // ved minuttskifte
    if (sek === 60) {
        sek = 0;
        min++;
    }
    nuller_foran(min, sek);
    still_inn_klokke(-min, -sek);    // teller oppover
}

function nuller_foran(min_uten_0, sek_uten_0) {   // legger til nuller foran
    let plasser = 2;
    let min_med_0 = "00" + min_uten_0;
    let sek_med_0 = "00" + sek_uten_0;
    // tar med så mange nuller som trengs
    minutt.value = min_med_0.substr(min_med_0.length - plasser);
    sekund.value = sek_med_0.substr(sek_med_0.length - plasser);
}

function bare2siffer() {  // lar det til en hver tid bare være to siffer i input
    let min_str = minutt.value;
    if (min_str.length > 2) {
        minutt.value = min_str.substr(min_str.length - 2);
        return;
    }
    let sek_str = sekund.value;
    if (sek_str.length > 2) {
        sekund.value = sek_str.substr(sek_str.length - 2);
        return;
    }
    nuller_foran(min_str, sek_str);
}

function oppdater_standard_tid() {
    aktiverAnimasjon(`Ny standartid: ${minutt.value}:${sekund.value}`);
    let tid = {
        min: minutt.value,
        sek: sekund.value
    }
    let oppdatert_tid = JSON.stringify(tid, null, '\t');

    fs.writeFileSync(dataFilename, oppdatert_tid, function (err) {
        if (err) throw err;
    });
}

function still_inn_klokke(min, sek) {
    let minutt_grader = min*(-30) + sek*(-0.5);
    let sekund_grader = sek*(-6);
    minuttviser.style.transform ='rotate('+minutt_grader+'deg)';
    sekundviser.style.transform ='rotate('+sekund_grader+'deg)';
}