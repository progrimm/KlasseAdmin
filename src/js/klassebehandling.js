window.onload = () => {
    const valgtKlasse = sessionStorage.getItem("valgtKlasse"); 
    document.title = valgtKlasse + " - Klassebehandling";

    $("#btnStartside").onclick = () => {
        sessionStorage.clear();
        window.location = "index.html";
    }

}