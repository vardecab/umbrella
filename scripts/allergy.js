/* ================================== */
/*               allergy              */
/* ================================== */

// "manual API" to get allergy/pollen info 

// scraper.py is getting data from https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/
// scraper2.py is getting data from http://pylenia.pl/
// FIX: doesn't work as of late 2024, the website is down so we need to take the data from a different API

function checkPollen(lID) {
	//  get description
	fetch("./py/allergens-description-" + lID + ".txt")
		.then(response => response.text())
		.then(data_description => {
			// alert(data_description); // debug
			$("#allergy_placeholder").show();
			$("#allergy_description").hide();
			document.getElementById("allergy_placeholder").textContent = "🤧 👀";

			$("#allergy").click(function () {
				if ($("#allergy_description").is(":hidden")) {
					document.getElementById("allergy_description").textContent = data_description;
					$("#allergy_placeholder").hide();
					$("#allergy_description").show();
				} else {
					$("#allergy_description").hide();
					$("#allergy_placeholder").show();
				}
			});
		});
};

// show info from PollenInfoAutoUpdate
function showPollen(voivodeship) {

	console.log('Województwo:', voivodeship); // debug 

	if (voivodeship.includes("Masovian")) {
		allergy_region = "R7MZ";
		checkPollen(allergy_region);
	} else if (voivodeship.includes("Lower Silesian")) {
		allergy_region = "R6DS";
		checkPollen(allergy_region);
	} else if (voivodeship.includes("Lesser")) {
		allergy_region = "R9MP";
		checkPollen(allergy_region);
	} else if (voivodeship.includes("Pomeranian")) {
		allergy_region = "R2WY";
		checkPollen(allergy_region);
	}
	// TODO: other 12 voivodeships
	else {
		console.log("Allergy: this region is not supported.");
		$("#allergy").hide();
	}
}