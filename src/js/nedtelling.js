let klokka_gaar = false
let min = 0;
let sek = 0;

window.onload = () => {
    nedteller =$('#nedteller');
    start_stopp = $('#start_stopp');
    start_stopp.onclick = start_eller_stopp;
        
}
function sleep(ms) {    // setter programmet på vent i x millisekunder
  return new Promise(resolve => setTimeout(resolve, ms));s
}

async function start_eller_stopp() {
    tid = (new Date()).getTime()
    min = +$('#minutt').value;
    sek = +$('#sek').value;
    if (klokka_gaar) {
        // sette nedtelling på pause
        klokka_gaar = false;
        start_stopp.innerHTML ='Start';
    } else {
        // starte/fortsette nedtelling
        start_stopp.innerHTML = 'Stopp';
        klokka_gaar = true;
        while(klokka_gaar) {
            await sleep(1000)   // venter 1 sek
            sek--;
            if (sek<0) {
                sek = 59;
                min--;
                if (min<0) {    // timer ferdig
                    klokka_gaar = false;
                    min = 4;
                    sek = 0;
                    return
                }
            }
            $('#minutt').value = min;
            $('#sek').value = sek;
        }
    }
}