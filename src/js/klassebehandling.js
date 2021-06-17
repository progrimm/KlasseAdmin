const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
document.title = valgtKlasse.klassekode + " - Klassebehandling";

window.onload = () => {
    document.getElementById("overskrift").innerHTML = (valgtKlasse["klassekode"]);
}