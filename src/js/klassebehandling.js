const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
document.title = valgtKlasse.klassekode + " - Klassebehandling";

window.onload = () => {
    // Husker hvilken side man gikk til nedtelling fra
    sessionStorage.setItem("nedtelling_ref", window.location.pathname);
    
    document.getElementById("overskrift").innerHTML = (valgtKlasse["klassekode"]);
}