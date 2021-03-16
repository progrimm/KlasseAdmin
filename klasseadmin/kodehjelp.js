// HER KOMMER NOEN EKSEMPLER PÅ KODEBITER VI VIL/KAN FÅ BRUK FOR:

// Hente data fra json-fil
const fs = require("fs");
const dataFilename = __dirname + "/js/data.json";
var data = JSON.parse(fs.readFileSync(dataFilename));

// Legge til data i json-fil (her legge til elev "Per" i klasse "3STA")
let klasse = "3STA"
let navn = "Per";
data[klasse]["elever"].push(navn);
let dataOppdatert = JSON.stringify(data, null, '\t');
fs.writeFile(dataFilename, dataOppdatert, function (err) {
  if (err) throw err;
  console.log('Oppdatert!');
});

// Legge til data i sessionStorage og hente det ut igjen
sessionStorage.setItem("status", true);
var status = sessionStorage.getItem("status"); // => status = true

// Legger ved template.js som inneholder kode for å enkelt bruke elementer med id/class, og en fade funksjon (som jeg såklart har stjelt)
// Førstnevnte fungerer slik:
$("#navn") = document.getElementById("navn");
$(".boks") = document.getElementsByClassName("boks");

// Trenger dere å bytte stilark i et tilfelle kan dere bruke dette (forutsatt at stilarket er på første link i head)
var stilark = document.getElementsByTagName('link')[0];
theme.setAttribute('href', 'css/nytt_stilark.css');
