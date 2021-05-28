const valgtKlasse = JSON.parse(sessionStorage.getItem("valgtKlasse"));
document.title = valgtKlasse.klassekode + " - Klassebehandling";

window.onload = () => {
    $("#btnStartside").onclick = () => {
        window.location = "index.html";
    }
}