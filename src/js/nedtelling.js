let klokka_gaar =false
let min = start_min =4;
let sek = start_sek =0;
let nedteller_intervall;

window.onload =() => {
    veksle =$('#veksle_start_stopp');
    minutt =$('#minutt');
    sekund =$('#sekund');
    // lyttere
    $('#nullstill').onclick =nullstill;
    veksle.onclick =start_eller_stopp;
    // stopper klokka hvis bruker fokuserer på inputfeltene
    minutt.onclick =() => {
        clearInterval(nedteller_intervall);
    }
    sekund.onclick =() => {
        clearInterval(nedteller_intervall);
    }
    // setter nye startverdier for min og sek hvis bruker gjør endringer
    minutt.onchange =() => {
        start_min =minutt.value;
    }
    sekund.onchange =() => {
        start_sek =sekund.value;
    }

}

function nedteller() {
    // starte/fortsette nedtelling
    klokka_gaar;
    veksle.innerHTML ='Stopp';
    sek--;
    if (sek < 0) {
        sek =59;
        min--;
        console.log(klokka_gaar)
    }
    minutt.value =min;
    sekund.value =sek;
    if (min < 0) {    // nedtelling ferdig
        nullstill();
        // fortsette med negative tall
    }
}

function start_eller_stopp() {
    min =Math.floor(minutt.value);
    sek =Math.floor(sekund.value);

    if (klokka_gaar) {  // stopper klokka
        clearInterval(nedteller_intervall);
        klokka_gaar =false;
        veksle.innerHTML ='Start';
    } else {  // setter i gang klokka
        nedteller_intervall =setInterval(nedteller, 1000);  // kjører nedtellerfunksjonen hvert sek
        klokka_gaar =true;
        veksle.innerHTML ='Stopp';
    }
}

function nullstill() {
    clearInterval(nedteller_intervall);
    klokka_gaar =false;
    veksle.innerHTML ='Start';
    minutt.value =start_min;
    sekund.value =start_sek;
}