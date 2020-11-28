// scraper.py is getting data from https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/

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
			fetch("./py/allergens-date_range.txt")
				.then(response => response.text())
				.then(data_dateRange => {
					// alert(data_dateRange); // debug
					console.log(
						"Allergy description date range:",
						data_dateRange
					);
				});
		});
};