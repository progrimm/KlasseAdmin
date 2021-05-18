const valgtKlasse = sessionStorage.getItem("valgtKlasse");
document.title = valgtKlasse + " - Klassebehandling";

window.onload = () => {
    $("#btnStartside").onclick = () => {
        sessionStorage.clear();
        window.location = "index.html";
    }
}