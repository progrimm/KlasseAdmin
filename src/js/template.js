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

// Funksjon for å fade innholdet ut eller inn på nettsiden. Tar først objektet som skal fades som parameter, så type fade, f.eks fade inn
function fade(obj, type) {

	//velger verdiene som skal forrandres ut ifra fade type
	if (type === "inn") {
		var opacity = 1;
		var marginTop = 0;
	} else if (type === "out") {
		var opacity = 0;
		var marginTop = "10px";
	} else {
		console.log("ugyldig fade type for elementet: " + obj);
		return;
	}

	var elem = $(obj);

	//sjekker om elementet finnes og om det er en id eller class
	if (obj.charAt(0) === "#" && !!elem) {

		elem.style.opacity = opacity;
		elem.style.marginTop = marginTop;

	} else if (obj.charAt(0) === "." && !!elem) {
		var i = 0;

		//looper igjennom array og gir alle elementene med en class verdiene med en delay mellom hver
		setInterval(function () {
			if (i >= elem.length) return;

			elem[i].style.opacity = opacity;
			elem[i].style.marginTop = marginTop;

			i++;
		}, 100)

	} else {
		console.log("elementet " + obj + " finnes ikke");
		return;
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
}
