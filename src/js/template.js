// Funksjon for å gjøre innhenting av id og class enklere (likt jQuery), takk til Rein Bentdal
function $(element) {
	if (element.charAt(0) == "#") {
		var elementId = element.substring(1);
		return document.getElementById(elementId);
	} else if (element.charAt(0) == ".") {
		var elementClass = element.substring(1);
		return document.getElementsByClassName(elementClass);
	}
}

// Importere HTML filer til andre HTML filer (w3schools)
function includeHTML() {
	var z, i, elmnt, file, xhttp;
	/* Loop through a collection of all HTML elements: */
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		elmnt = z[i];
		/*search for elements with a certain atrribute:*/
		file = elmnt.getAttribute("include-html");
		if (file) {
			/* Make an HTTP request using the attribute value as the file name: */
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) { elmnt.innerHTML = this.responseText; }
					if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
					/* Remove the attribute, and call this function once more: */
					elmnt.removeAttribute("include-html");
					includeHTML();
				}
			}
			xhttp.open("GET", file, true);
			xhttp.send();
			/* Exit the function: */
			return;
		}
	}
}

// råtøff animasjon ved endring
function aktiverAnimasjon(tekst) { // tekst = melding under checkmark
	// Checkmark
	$("#div_fullfort_endring").style.display = "flex";
	$("#melding_fullfort_endring").innerHTML = tekst;
	$("#div_fullfort_endring").classList.add("div_fullfort_endring_fade");

	// Bakgrunnsskygge
	$("#div_skygge").style.display = "block";
	$("#div_skygge").classList.add("class_animasjon_skygge");

	// Fjerner det
	setTimeout(() => {
		$("#div_fullfort_endring").style.display = "none";
		$("#div_skygge").style.display = "none";
		$("#div_skygge").classList.remove("class_animasjon_skygge");
	}, 3500);

	document.body.style.pointerEvents = "auto";
}
