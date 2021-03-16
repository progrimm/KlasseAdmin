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
	if(type === "inn") {
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
		setInterval(function() {
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