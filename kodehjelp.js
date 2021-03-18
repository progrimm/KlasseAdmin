// HER KOMMER NOEN EKSEMPLER PÅ KODEBITER VI VIL/KAN FÅ BRUK FOR:

// Gjør om data.json til js-objekt med navn "data". Behandler så objektet slik vi er vant med.
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
var data = JSON.parse(fs.readFileSync(dataFilename));

// Legge til data i json-fil (her legge til elev "Per" i klasse "3STA")
let klasse = "3STA"
let navn = "Per";
data["klasser"][klasse]["elever"].push(navn);
let dataOppdatert = JSON.stringify(data, null, '\t');
fs.writeFile(dataFilename, dataOppdatert, function (err) {
  if (err) throw err;
  console.log('Oppdatert!');
});

// Legge til ny klasse i json-fil. Må her legge til et nytt objekt i "data", istedenfor å pushe til en array slik som i eksempelet over
let klasseNavn = "3STB"
let nyKlasse = {[klasseNavn]:{elever:[],klassekart:[]}};
data = Object.assign(nyKlasse, data);

// Legge til data i sessionStorage og hente det ut igjen
sessionStorage.setItem("status", true);
var retrievedStatus_session = sessionStorage.getItem("status"); // => retrievedStatus_session = true

// Veldig likt med localStorage (kan brukes når bestemte innstillinger (som darkmode) må lagres)
localStorage.setItem("status", true);
var retrievedStatus_local = localStorage.getItem("status"); // => retrievedStatus_local = true

// Legger ved template.js som inneholder kode for å enkelt bruke elementer med id/class, og en fade funksjon (som jeg såklart har stjelt)
// Førstnevnte fungerer slik i forhold til det vi er vant til:
$("#navn") = document.getElementById("navn");
$(".boks") = document.getElementsByClassName("boks");

// Trenger vi noen gang å bytte stilark kan dette benyttes (forutsatt at stilarket er på første link i head)
var stilark = document.getElementsByTagName('link')[0];
theme.setAttribute('href', 'css/nytt_stilark.css');

// Endre css variabler med js
function myFunction_set() {
  var r = document.querySelector(':root');
  r.style.setProperty('--blue', 'lightblue');
}


