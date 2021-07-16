const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
document.title = 'KlasseAdmin - ' + valgtKlasse.klassekode;

window.onload = () => {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);
    
    document.getElementById("overskrift").innerHTML = (valgtKlasse["klassekode"]);
}