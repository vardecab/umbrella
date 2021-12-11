/* ================================== */
/*              sunTimes              */
/* ================================== */

// get sunrise and sunset times from sunrise-sunset API

function sunTimes(lat, lng) {
	ss_url =
		"https://api.sunrise-sunset.org/json?lat=" +
		lat +
		"&lng=" +
		lng +
		"&formatted=0";
	// *NOTE "&formatted=0" so the date is in UNIX
	console.log("Sunrise Sunset URL:", ss_url); // debug

	// grab data from URL
	fetch(ss_url)
		// convert data to JSON
		.then(function (resp) {
			return resp.json();
		})
		// use the data stored in object to do whatever
		.then(function (ss_data) {
			console.error("Sunrise Sunset", ss_data); // debug: output everything stored in the object

			// 🌥️ first light

			var first_light_utc = ss_data.results.civil_twilight_begin;
			var first_light_local = moment.utc(first_light_utc).local().format("H:mm");
			console.log("First light:", first_light_local); // debug 

			var first_light_in_html = document.getElementById("first_light");
			first_light_in_html.textContent += first_light_local;

			// ☀️ sunrise

			var sunrise_utc = ss_data.results.sunrise;
			var sunrise_local = moment.utc(sunrise_utc).local().format("H:mm");
			console.log("Sunrise:", sunrise_local); // debug

			var sunrise_in_html = document.getElementById("sunrise");
			sunrise_in_html.textContent += sunrise_local;

			// 🌒 sunset

			var sunset_utc = ss_data.results.sunset;
			var sunset_local = moment.utc(sunset_utc).local().format("H:mm");
			console.log("Sunset:", sunset_local); // debug

			var sunset_in_html = document.getElementById("sunset");
			sunset_in_html.textContent += sunset_local;

			// 🌑 last light 

			var last_light_utc = ss_data.results.civil_twilight_end;
			var last_light_local = moment.utc(last_light_utc).local().format("H:mm");
			console.log("Last light:", last_light_local); // debug

			var last_light_in_html = document.getElementById("last_light");
			last_light_in_html.textContent += last_light_local;

		})
		// catch any errors
		.catch(function () {});
}