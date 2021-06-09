function gruppeinndeling(antall) {
    let klasse = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
    let lagUtIFra = "elev";
    let antallPerInndeling = JSON.parse(JSON.stringify(antall));

    if(lagUtIFra === "gruppe") {
        if((klasse.length / antallPerInndeling) < 2) {
            let iteration = true;
            while(iteration) {
                antallPerInndeling++;
                if((klasse.length / antallPerInndeling) === 1) {
                    iteration = false;
                }
            }
            antallPerInndeling = ~~(antallPerInndeling / 2)
        }
        let antallPerGruppe = ~~(klasse.length / antallPerInndeling);
        let personEkstra = klasse.length % antallPerInndeling;
    } else {
        if(~~(klasse.length / 2) < antallPerInndeling) {
            antallPerInndeling = ~~(klasse.length / 2);
        }
        let antallGrupper = ~~(klasse.length / antallPerInndeling);
        let grupper = [];

        for(i = 0; i < antallGrupper; i++) {
            let midGruppe = [];
            for(j = 0; j < antallPerInndeling; j++) {
                midGruppe.push(klasse.shift());
            }
            grupper.push(midGruppe);
        }

        if(antallPerInndeling - klasse.length === 1) {
            grupper.push(klasse);
        } else {
            if(antallPerInndeling / klasse.length > 2) { //Putte resten i eksisterende grupper
                klasse.forEach((x, key) => {
                    if(key < grupper.length) {
                        grupper[key].push(x);
                    } else {
                        let middleIndex = Math.ceil(klasse.length / 2);
                        grupper[0].push(klasse.splice(0, middleIndex));
                        grupper[1].push(klasse.splice(-middleIndex));
                    }
                });
            } else { //Fordele gruppene
                klasse.forEach((x, key) => {
                    if(grupper[0].length - klasse.length > 1) {    
                        klasse.push(grupper[grupper.length - 1 - key].pop());
                    }
                });
                grupper.push(klasse);
            }
        }
        
        console.log(antallPerInndeling);
        console.log(grupper.map(i => i.length));
        console.log("");
    }
}

