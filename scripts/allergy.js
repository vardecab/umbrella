// scraper.py is getting data from https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/

$("#allergy").hide();

function checkPollen(lID) {
	//  get description
	fetch("./py/allergens-description-" + lID + ".txt")
		.then(response => response.text())
		.then(data_description => {
			// alert(data_description); // debug
			$("#allergy_placeholder").show();
			$("#allergy").click(function() {
				$("#allergy_placeholder").hide();
				document.getElementById(
					"allergy_description"
				).textContent = data_description;
				$("#allergy_description").show();
			});

			// get date range for which this update is available
			fetch("../py/allergens-date_range.txt")
				.then(response => response.text())
				.then(data_dateRange => {
					// alert(data_dateRange); // debug
					console.log(
						"Allergy description date range:",
						data_dateRange
					);
				});
		});
}
