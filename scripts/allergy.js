// scraper.py is getting data from https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/
// scraper2.py is getting data from http://pylenia.pl/

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

			// get date range for which this update is available
			// TODO: get data range from new "API"
			// fetch("./py/allergens-date_range.txt")
			// 	.then(response => response.text())
			// 	.then(data_dateRange => {
					// alert(data_dateRange); // debug
			// 		console.log(
			// 			"Allergy description date range:",
			// 			data_dateRange
			// 		);
			// 	});
		});
};

setTimeout(function () {
	// show info from PollenInfoAutoUpdate
	var allergy_location = document.getElementById("location").textContent;
	if (
		allergy_location == "🌍 Wroclaw, PL" ||
		allergy_location == "🌍 Wrocław, PL"
	) {
		allergy_region = "R6DS";
		checkPollen(allergy_region);
	} else if (
		allergy_location == "🌍 Tarnów, PL" ||
		allergy_location == "🌍 Krakow, PL" ||
		allergy_location == "🌍 Wola Rzędzińska, PL"
	) {
		allergy_region = "R9MP";
		checkPollen(allergy_region);
	} else if (allergy_location == "🌍 Warsaw, PL") {
		allergy_region = "R7MZ";
		checkPollen(allergy_region);
	} else {
		console.log("Allergy: this region is not supported.");
		$("#allergy").hide();
	}
}, 2000);