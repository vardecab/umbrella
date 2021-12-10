// what this file does: 
// $ take user's input 
// $ take user's coords or convert input (city name) to coords and then send to functions which will return the weather data 
// $ save coords to cookies 

window.onload = function geoLocator() {
	// TODO: refactoring might be needed 
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
				path: "/",
			});
			// set 🍪 for longitude
			Cookies.set("umbrella_coord_lng", geo_longitude, {
				expires: 30,
				path: "/",
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
					"&format=json" + 
					"&addressdetails=1"
				)
				// convert data to JSON
				.then(function (res) {
					return res.json();
				})

				// use the data stored in object to do whatever
				.then(function (liq_data) {
					console.error("LocationIQ", liq_data); // debug: output everything stored in the object

					// TODO: is this necessary? GPS auto-locator 🤔

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
						path: "/",
					});
				});

			weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
			weatherBallon2(cookie_lat, cookie_lng); // pass coords to get UV index
			airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
			airCrystalBall(cookie_lat, cookie_lng) // pass coords to get air quality forecast
			// TODO: showPollen(liq_location_full); // pass voivodeship to get allergy information
			// apsik(cookie_lat, cookie_lng); // pass coords to get allergy info; NOTE: API doesn't have good coverage
		}

		function error() {
			alert(
				"Wygląda na to, że nie mogę znaleźć Twojej lokalizacji... Prawdopodobnie masz wyłączony GPS :("
			);
			// if we don't know the location let's ask the user
			query_input = prompt(
				"Dla jakiej ulicy w jakim mieście chcesz sprawdzić pogodę?"
			);
			console.log("User-requested city:", query_input); // debug
			// alert(query_input); // debug
			// user pressed OK, but the input field was empty - re-ask
			if (query_input === "") {
				// query_input = prompt(
				// 	"Dla jakiego miejsca chcesz sprawdzić pogodę?"
				// );
				alert("Nic nie zostało wpisane. Musisz wpisać jakąś ulicę i miasto :)");
				error(); // re-run the whole process of getting user's location
			}
			// user typed something and hit OK; success - let's go
			else if (query_input) {
				const liq_api_key = "a95509ae99d0ab"; // well... no way to hide it ¯\_(ツ)_/¯

				// grab data from URL
				fetch(
						"https://eu1.locationiq.com/v1/search.php?key=" +
						liq_api_key +
						"&q=" +
						query_input +
						"&format=json" +
						"&addressdetails=1"
					)
					// convert data to JSON
					.then(function (res) {
						return res.json();
					})

					// use the data stored in object to do whatever
					.then(function (liq_data) {
						console.error("LocationIQ", liq_data); // debug: output everything stored in the object

						// get location name based on what was returned from API and cut it to just district / city or village

						liq_location = liq_data[0].address.city_district;
						if (liq_location == undefined) {
							// console.log('testA'); // debug
							liq_location = liq_data[0].address.town;
							if (liq_location == undefined) {
								// console.log('testB'); // debug
								liq_location = liq_data[0].address.village;
							}
						}

						liq_location_voivodeship = liq_data[0].address.state;
						// console.log('Voivodeship:', liq_location_voivodeship); // debug
						
						document.getElementById("location").textContent =
							"🌍 " + liq_location;

						// set 🍪 for location name
						Cookies.set("umbrella_location", liq_location, {
							expires: 30,
							path: "/",
						});

						// set 🍪 for location voivodeship
						Cookies.set("umbrella_location_voivodeship", liq_location_voivodeship, {
							expires: 30,
							path: "/",
						});

						// // set 🍪 for full location 
						// Cookies.set("umbrella_location_full", liq_location_full, {
						// 	expires: 30,
						// 	path: "/",
						// });

						// get coords from API based on location user inputted
						lat = liq_data[0].lat;
						lng = liq_data[0].lon;
						console.log("Coords: " + lat + ", " + lng); // debug

						// set 🍪 for latitude
						Cookies.set("umbrella_coord_lat", lat, {
							expires: 30,
							path: "/",
						});
						// set 🍪 for longitude
						Cookies.set("umbrella_coord_lng", lng, {
							expires: 30,
							path: "/",
						});
						console.log(
							"Cookie: " +
							"lat: ",
							Cookies.get("umbrella_coord_lat") +
							" lng: ",
							Cookies.get("umbrella_coord_lng")
						); // debug

						// variables with values from 🍪s
						cookie_lng = Cookies.get("umbrella_coord_lng");
						cookie_lat = Cookies.get("umbrella_coord_lat");
						// alert(liq_data.address.city); // debug
						// alert(liq_location); // debug

						weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
						weatherBallon2(cookie_lat, cookie_lng); // pass coords to get UV index
						airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
						airCrystalBall(cookie_lat, cookie_lng) // pass coords to get air quality forecast
						showPollen(liq_location_voivodeship); // pass voivodeship to get allergy information
						// apsik(cookie_lat, cookie_lng); // pass coords to get allergy info; NOTE: API doesn't have good coverage
					});
			}
			// user hit Cancel / ESC - re-ask
			else {
				alert("Wpisz jakieś miejsce i kliknij Enter albo wybierz OK :)");
				error(); // re-run the whole process of getting user's location
			}
		}
	}
	// cookies set so we'll use that
	else {
		console.error("LocationIQ data not necessary - took data from 🍪s.");

		console.log(
			"Cookie: " +
			"lat: " +
			Cookies.get("umbrella_coord_lat") +
			" lng: " +
			Cookies.get("umbrella_coord_lng")
		); // debug

		// variables with values from 🍪s
		cookie_lng = Cookies.get("umbrella_coord_lng");
		cookie_lat = Cookies.get("umbrella_coord_lat");
		cookie_location = Cookies.get("umbrella_location");
		cookie_location_voivodeship = Cookies.get("umbrella_location_voivodeship");
		// cookie_location_full = Cookies.get("umbrella_location_full");

		if (cookie_location == "undefined") {
			document.getElementById("location").textContent = "🌍 ";
		} else {
			document.getElementById("location").textContent =
				"🌍 " + cookie_location;
		}

		weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
		weatherBallon2(cookie_lat, cookie_lng); // pass coords to get UV index
		airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
		airCrystalBall(cookie_lat, cookie_lng) // pass coords to get air quality forecast
		showPollen(cookie_location_voivodeship); // pass voivodeship to get allergy information
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
	// alert('manualFinder'); // debug

	query_input = prompt("Dla jakiej ulicy w jakim mieście chcesz sprawdzić pogodę?"); // if we don't know the location let's ask the user
	console.log("Street / city:", query_input); // debug

	// user pressed OK, but the input field was empty - re-ask
	if (query_input === "") {
		// query_input = prompt(
		// 	"Dla jakiego miejsca chcesz sprawdzić pogodę?"
		// );
		alert("Nic nie zostało wpisane. Musisz wpisać jakąś ulicę i miasto :)");
		error(); // re-run the whole process of getting user's location
	}
	// user typed something and hit OK; success - let's go
	else if (query_input) {
		const liq_api_key = "a95509ae99d0ab"; // well... no way to hide it ¯\_(ツ)_/¯

		// grab data from URL
		fetch(
				"https://eu1.locationiq.com/v1/search.php?key=" +
				liq_api_key +
				"&q=" +
				query_input +
				"&format=json" +
				"&addressdetails=1"
			)
			// convert data to JSON
			.then(function (res) {
				return res.json();
			})

			// use the data stored in object to do whatever
			.then(function (liq_data) {
				console.error("LocationIQ", liq_data); // debug: output everything stored in the object

				// get location name based on what was returned from API and cut it to just district / city or village
				
				liq_location = liq_data[0].address.city_district;
						if (liq_location == undefined) {
							// console.log('testC'); // debug
							liq_location = liq_data[0].address.town;
							if (liq_location == undefined) {
								// console.log('testD'); // debug
								liq_location = liq_data[0].address.village;
							}
						}
				
				liq_location_voivodeship = liq_data[0].address.state;
				// console.log('Voivodeship:', liq_location_voivodeship); // debug

				document.getElementById("location").textContent =
					"🌍 " + liq_location;

				// set 🍪 for location name
				Cookies.set("umbrella_location", liq_location, {
					expires: 30,
					path: "/",
				});

				// set 🍪 for location name voivodeship
				Cookies.set("umbrella_location_voivodeship", liq_location_voivodeship, {
					expires: 30,
					path: "/",
				});

				// // set 🍪 for full location 
				// Cookies.set("umbrella_location_full", liq_location_full, {
				// 	expires: 30,
				// 	path: "/",
				// });

				// get coords from API based on location user inputted
				lat = liq_data[0].lat;
				lng = liq_data[0].lon;
				console.log("Coords: " + lat + ", " + lng); // debug

				// set 🍪 for latitude
				Cookies.set("umbrella_coord_lat", lat, {
					expires: 30,
					path: "/",
				});
				// set 🍪 for longitude
				Cookies.set("umbrella_coord_lng", lng, {
					expires: 30,
					path: "/",
				});
				console.log(
					"Cookie: " +
					"lat: " +
					Cookies.get("umbrella_coord_lat") +
					" lng: " +
					Cookies.get("umbrella_coord_lng")
				); // debug

				// variables with values from 🍪s
				cookie_lng = Cookies.get("umbrella_coord_lng");
				cookie_lat = Cookies.get("umbrella_coord_lat");
				cookie_location_full = Cookies.get("umbrella_location_full");

				weatherBallon(cookie_lat, cookie_lng); // pass coords to get weather info
				weatherBallon2(cookie_lat, cookie_lng); // pass coords to get UV index
				airMask(cookie_lat, cookie_lng); // pass coords to get air quality info
				airCrystalBall(cookie_lat, cookie_lng) // pass coords to get air quality forecast
				showPollen(liq_location_voivodeship); // pass voivodeship to get allergy information
				// apsik(cookie_lat, cookie_lng); // pass coords to get allergy info; NOTE: API doesn't have good coverage

				location.reload();
			});
	}

	// user hit Cancel / ESC - re-ask
	else {
		alert("Wpisz jakieś miejsce i kliknij Enter albo wybierz OK :)");
		error(); // re-run the whole process of getting user's location

		// });
	}
}