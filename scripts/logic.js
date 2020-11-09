window.onload = function geoLocator() {
	if (
		Cookies.get("umbrella_coord_lat") == undefined ||
		Cookies.get("umbrella_coord_lng") == undefined
	) {
		// get coords from geolocation (GPS/IP)
		function success(position) {
			const geo_latitude = position.coords.latitude;
			const geo_longitude = position.coords.longitude;

			// set 🍪 for latitude
			Cookies.set("umbrella_coord_lat", geo_latitude, {
				expires: 30,
				path: "/"
			});
			// set 🍪 for longitude
			Cookies.set("umbrella_coord_lng", geo_longitude, {
				expires: 30,
				path: "/"
			});
			console.log(
				"Cookie data: " +
					"lat:" +
					Cookies.get("umbrella_coord_lat") +
					" lng:" +
					Cookies.get("umbrella_coord_lng")
			); // debug

			// variables with values from 🍪s
			cookie_lng = Cookies.get("umbrella_coord_lng");
			cookie_lat = Cookies.get("umbrella_coord_lat");

			// API key which we use in the next piece
			const liq_api_key = "a95509ae99d0ab"; // well... no way to hide it ¯\_(ツ)_/¯

			// we need to get city name from LocationIQ API
			fetch(
				"https://eu1.locationiq.com/v1/reverse.php?key=" +
					liq_api_key +
					"&lat=" +
					cookie_lat +
					"&lon=" +
					cookie_lng +
					"&format=json"
			)
				// convert data to JSON
				.then(function(res) {
					return res.json();
				})

				// use the data stored in object to do whatever
				.then(function(liq_data) {
					console.error("LocationIQ", liq_data); // debug: output everything stored in the object

					// get city name
					// liq_location = data.address.city;
					// liq_location = data[0].display_name.split(",")[0];
					if (
						(liq_data.address.town = "null") ||
						(liq_data.address.town = "undefined") ||
						(liq_data.address.town = "")
					) {
						if (
							(liq_data.address.city = "null") ||
							(liq_data.address.city = "undefined") ||
							(liq_data.address.city = "")
						) {
							liq_location = liq_data.address.county;
						} else {
							liq_location = liq_data.address.city;
						}
					}

					// show city name on the website
					document.getElementById("location").textContent =
						"🌍 " + liq_location;

					// set 🍪 for location name so we can reuse in future without querying API
					Cookies.set("umbrella_location", liq_location, {
						expires: 30,
						path: "/"
					});
				});

			weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
			airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
			// apsik(cookie_lat, cookie_lng); // pass coords to get allergy info; NOTE: API doesn't have good coverage
		}

		function error() {
			alert(
				"Wygląda na to, że nie mogę znaleźć Twojej lokalizacji... Prawdopodobnie masz wyłączony GPS :("
			);
			// if we don't know the location let's ask the user
			query_input = prompt(
				"Dla jakiego miejsca chcesz sprawdzić pogodę?"
			);
			console.log("User-requested city:", query_input); // debug

			const liq_api_key = "a95509ae99d0ab"; // well... no way to hide it ¯\_(ツ)_/¯

			// grab data from URL
			fetch(
				"https://eu1.locationiq.com/v1/search.php?key=" +
					liq_api_key +
					"&q=" +
					query_input +
					"&format=json"
			)
				// convert data to JSON
				.then(function(res) {
					return res.json();
				})

				// use the data stored in object to do whatever
				.then(function(liq_data) {
					console.error("LocationIQ", liq_data); // debug: output everything stored in the object

					// get location name based on what was returned from API and cut it to just city
					liq_location = liq_data[0].display_name.split(",")[0];
					// console.error(liq_location); // debug

					document.getElementById("location").textContent =
						"🌍 " + liq_location;

					// set 🍪 for location name
					Cookies.set("umbrella_location", liq_location, {
						expires: 30,
						path: "/"
					});

					// get coords from API based on location user inputted
					lat = liq_data[0].lat;
					lng = liq_data[0].lon;
					console.log("Coords: " + lat + ", " + lng); // debug

					// set 🍪 for latitude
					Cookies.set("umbrella_coord_lat", lat, {
						expires: 30,
						path: "/"
					});
					// set 🍪 for longitude
					Cookies.set("umbrella_coord_lng", lng, {
						expires: 30,
						path: "/"
					});
					console.log(
						"Cookie: " +
							"lat:" +
							Cookies.get("umbrella_coord_lat") +
							" lng:" +
							Cookies.get("umbrella_coord_lng")
					); // debug

					// variables with values from 🍪s
					cookie_lng = Cookies.get("umbrella_coord_lng");
					cookie_lat = Cookies.get("umbrella_coord_lat");
					// alert(liq_data.address.city); // debug
					// alert(liq_location); // debug

					weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
					airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
					// apsik(cookie_lat, cookie_lng); // pass coords to get allergy info; NOTE: API doesn't have good coverage
				});
		}
	}
	// cookies set so we'll use that
	else {
		console.error("LocationIQ data not necessary - took data from 🍪s.");

		console.log(
			"Cookie: " +
				"lat:" +
				Cookies.get("umbrella_coord_lat") +
				" lng:" +
				Cookies.get("umbrella_coord_lng")
		); // debug

		// variables with values from 🍪s
		cookie_lng = Cookies.get("umbrella_coord_lng");
		cookie_lat = Cookies.get("umbrella_coord_lat");
		cookie_location = Cookies.get("umbrella_location");

		if (cookie_location == "undefined") {
			document.getElementById("location").textContent = "🌍 ";
		} else {
			document.getElementById("location").textContent =
				"🌍 " + cookie_location;
		}

		weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
		airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
		// apsik(cookie_lat, cookie_lng); // pass coords to get allergy info; NOTE: API doesn't have good coverage}
	}

	if (!navigator.geolocation) {
		alert(
			"Geolokalizacja nie jest wspierana przez Twoją przeglądarkę... :("
		);
	} else {
		navigator.geolocation.getCurrentPosition(success, error);
	}
};

function manualFinder() {
	query_input = prompt("Dla jakiego miejsca chcesz sprawdzić pogodę?"); // if we don't know the location let's ask the user
	console.log("City:", query_input); // debug

	const liq_api_key = "a95509ae99d0ab"; // well... no way to hide it ¯\_(ツ)_/¯

	// grab data from URL
	fetch(
		"https://eu1.locationiq.com/v1/search.php?key=" +
			liq_api_key +
			"&q=" +
			query_input +
			"&format=json"
	)
		// convert data to JSON
		.then(function(res) {
			return res.json();
		})

		// use the data stored in object to do whatever
		.then(function(liq_data) {
			console.error("LocationIQ", liq_data); // debug: output everything stored in the object

			// get location name based on what was returned from API and cut it to just city
			liq_location = liq_data[0].display_name.split(",")[0];
			// liq_location = liq_data.address.town;
			// console.error(liq_location); // debug

			document.getElementById("location").textContent =
				"🌍 " + liq_location;

			// set 🍪 for location name
			Cookies.set("umbrella_location", liq_location, {
				expires: 30,
				path: "/"
			});

			// get coords from API based on location user inputted
			lat = liq_data[0].lat;
			lng = liq_data[0].lon;
			console.log("Coords: " + lat + ", " + lng); // debug

			// set 🍪 for latitude
			Cookies.set("umbrella_coord_lat", lat, {
				expires: 30,
				path: "/"
			});
			// set 🍪 for longitude
			Cookies.set("umbrella_coord_lng", lng, {
				expires: 30,
				path: "/"
			});
			console.log(
				"Cookie: " +
					"lat:" +
					Cookies.get("umbrella_coord_lat") +
					" lng:" +
					Cookies.get("umbrella_coord_lng")
			); // debug

			// variables with values from 🍪s
			cookie_lng = Cookies.get("umbrella_coord_lng");
			cookie_lat = Cookies.get("umbrella_coord_lat");

			weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
			airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
			// apsik(cookie_lat, cookie_lng); // pass coords to get allergy info; NOTE: API doesn't have good coverage

			location.reload();
		});
}

smogAlert();

setTimeout(function() {
	var allergy_location = document.getElementById("location").textContent;
	if (allergy_location == "🌍 Wroclaw, PL") {
		allergy_region = "R6DS";
		checkPollen(allergy_region);
	} else if (
				allergy_location == "🌍 Tarnów, PL" ||
				allergy_location == "🌍 Krakow, PL" ||
				allergy_location == "🌍 Wola Rzędzińska, PL"
			) {
				allergy_region = "R7MP";
				checkPollen(allergy_region);
			} else if (allergy_location == "🌍 Warsaw, PL") {
				allergy_region = "R5MZ";
				checkPollen(allergy_region);
			} else {
				console.log("Allergy: this region is not supported.");
				$("#allergy").hide();
			}
}, 1500);
// TODO: add ^ to EN version
