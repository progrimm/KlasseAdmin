let klokka_gaar = paa_overtid =false;
let min = start_min =4;
let sek = start_sek =0;
let nedteller_intervall, overtid_intervall;
let lyd = new Audio('multimedia/gong.mp3');

window.onload =() => {
    veksle =$('#veksle_start_stopp');
    minutt =$('#minutt');
    sekund =$('#sekund');
    // lyttere
    $('#nullstill').onclick =nullstill;
    veksle.onclick =start_eller_stopp;
    // stopper klokka hvis bruker fokuserer på inputfeltene
    minutt.onfocus =() => {
        stopp_nedtelling();
        minutt.select() // markerer tall
    }
    sekund.onfocus =() => {
        stopp_nedtelling();
        sekund.select() // markerer tall
    }
    // setter nye startverdier for min og sek hvis bruker gjør endringer
    minutt.onchange =() => {
        start_min =Math.abs(Math.floor(minutt.value));
    }
    sekund.onchange =() => {
        start_sek =Math.abs(Math.floor(sekund.value));
    }
    // behandler input slik at det bare er to siffer i input
    minutt.oninput = sekund.oninput =bare2siffer;
}

function nedteller() {
    sek--;
    // ved minuttskifte
    if (sek <0) {
        sek =59;
        min--;
    }
    minutt.value =nuller_foran(min);
    sekund.value =nuller_foran(sek);
    if (min ===0 && sek ===0) { // nedtelling ferdig
        lyd.play()
        minutt.style.color = sekund.style.color ='red'; // negative tall blir rød
        clearInterval(nedteller_intervall);
        // teller hvor mye nedtellingen er på overtid
        paa_overtid = true;
        overtid_intervall = setInterval(overtid_stoppeklokke, 1000);
    }
}

function start_eller_stopp() {
    min =Math.abs(Math.floor(minutt.value));
    sek =Math.abs(Math.floor(sekund.value));
    // dumt å gjenta denne kodebolken, flyten burde endres på
    if (min ===0 && sek ===0) { // nedtelling ferdig
        lyd.play()
        $('#nedteller').style.color = minutt.style.color = sekund.style.color ='red'; // negative tall blir rød
        clearInterval(nedteller_intervall);
        veksle.innerHTML ='Stopp';
        klokka_gaar =true;
        // teller hvor mye nedtellingen er på overtid
        paa_overtid = true;
        overtid_intervall = setInterval(overtid_stoppeklokke, 1000);
        return;
    }

    if (klokka_gaar) {
        stopp_nedtelling();
        if (paa_overtid) nullstill()    // nullstiller hvis klokka er på overtid selv når bruker trykker stopp
    }
    else {  // setter i gang klokka
        nedteller_intervall =setInterval(nedteller, 1000);  // kjører nedtellerfunksjonen hvert sek
        klokka_gaar =true;
        veksle.innerHTML ='Stopp';
    }
}

function stopp_nedtelling () {
    klokka_gaar =false;
    veksle.innerHTML ='Start';
    $('#nedteller').style.color = minutt.style.color = sekund.style.color ='black';
    clearInterval(nedteller_intervall);
    clearInterval(overtid_intervall);
}

function nullstill() {
    stopp_nedtelling();
    paa_overtid = false;
    minutt.value =nuller_foran(start_min);
    sekund.value =nuller_foran(start_sek);
}

function overtid_stoppeklokke() {
    sek++;
    // ved minuttskifte
    if (sek ===60) {
        sek =0;
        min++;
    }
    minutt.value =nuller_foran(min);
    sekund.value =nuller_foran(sek);
}

function nuller_foran(tall) {   // legger til nuller foran
    let plasser = 2;
    let tall_med_0 = "00" + tall;
    // tar med så mange nuller som trengs
    return tall_med_0.substr(tall_med_0.length - plasser);
}

function bare2siffer() {  // lar det til en hver tid bare være to siffer i input
    let min_str = minutt.value;
    if (min_str.length >2) {
        minutt.value = min_str.substr(min_str.length - 2);
    } else minutt.value = nuller_foran(min_str);
    let sek_str = sekund.value;
    if (sek_str.length >2) {
        sekund.value = sek_str.substr(sek_str.length - 2);
    } else sekund.value = nuller_foran(sek_str);
}