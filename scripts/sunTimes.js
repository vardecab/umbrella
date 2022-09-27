/* ================================== */
/*              sunTimes              */
/* ================================== */

// get sunrise and sunset times 

// 2nd function

function sunTimes(lat, lng, offset) {
	ss_url =
		"https://api.sunrise-sunset.org/json?lat=" +
		lat +
		"&lng=" +
		lng +
		"&formatted=0";
	// NOTE: "&formatted=0" so the date is in UNIX
	console.log('%c%s', 'color: #0047ca', "🔗 Sunrise Sunset URL:", ss_url); // debug, colored output

	// grab data from URL
	fetch(ss_url)
		// convert data to JSON
		.then(function (resp) {
			return resp.json();
		})
		// use the data stored in object to do whatever
		.then(function (ss_data) {
			// console.error("Sunrise Sunset", ss_data); // debug: output everything stored in the object
			console.log('%c%s', 'color: #ea01ff', "🌐 Sunrise Sunset", ss_data); // debug: output everything stored in the object

			// 🌥️ first light

			var first_light_utc = ss_data.results.civil_twilight_begin; // get data from API, it's UTC
			var first_light_location = moment(first_light_utc).utcOffset(offset).format("H:mm"); // take UTC, add offset from TimeZoneDB, format nicely
			console.log("First light UTC:", first_light_utc); // debug 
			console.log("First light location:", first_light_location); // debug 

			var first_light_in_html = document.getElementById("first_light");
			first_light_in_html.textContent += first_light_location; // add to the page

			// ☀️ sunrise

			var sunrise_utc = ss_data.results.sunrise; // get data from API, it's UTC
			var sunrise_location = moment(sunrise_utc).utcOffset(offset).format("H:mm"); // take UTC, add offset from TimeZoneDB, format nicely
			console.log("Sunrise:", sunrise_location); // debug

			var sunrise_in_html = document.getElementById("sunrise");
			sunrise_in_html.textContent += sunrise_location; // add to the page

			// 🌒 sunset

			var sunset_utc = ss_data.results.sunset; // get data from API, it's UTC
			var sunset_location = moment(sunset_utc).utcOffset(offset).format("H:mm"); // take UTC, add offset from TimeZoneDB, format nicely
			console.log("Sunset:", sunset_location); // debug

			var sunset_in_html = document.getElementById("sunset");
			sunset_in_html.textContent += sunset_location; // add to the page

			// 🌑 last light 

			var last_light_utc = ss_data.results.civil_twilight_end; // get data from API, it's UTC
			var last_light_location = moment(last_light_utc).utcOffset(offset).format("H:mm"); // take UTC, add offset from TimeZoneDB, format nicely
			console.log("Last light:", last_light_location); // debug

			var last_light_in_html = document.getElementById("last_light");
			last_light_in_html.textContent += last_light_location; // add to the page

		})
		// catch any errors
		.catch(function () {});
}

// 1st function

function getTimeZoneOffset(lat, lng) {
	const tzdbAPIkey = "CJR1UAW12M6R";
	tzdbURL =
		"https://api.timezonedb.com/v2.1/get-time-zone?" +
		"key=" + tzdbAPIkey +
		"&format=json" +
		"&by=position" +
		"&lat=" + lat +
		"&lng=" + lng;
	console.log('%c%s', 'color: #0047ca', "🔗 TimeZoneDB URL:", tzdbURL); // debug, colored output

	// grab data from URL
	fetch(tzdbURL)
		// convert data to JSON
		.then(function (resp) {
			return resp.json();
		})
		// use the data stored in object to do whatever
		.then(function (tzdbData) {
			// console.error("TimeZoneDB", tzdbData); // debug: output everything stored in the object
			console.log('%c%s', 'color: #ea01ff', "🌐 TimeZoneDB", tzdbData); // debug: output everything stored in the object

			// get GMT offset from the data
			var offset = tzdbData.gmtOffset; // get GMT offset from the API; eg. 7200 means 120 minutes means 2 hours
			offset = offset / 60 / 60; // convert offset from seconds to hours
			console.log("GMT offset:", offset, "hours"); // status
			
			// send data to function to get sunrise & sunset
			sunTimes(lat, lng, offset);
		})
		// catch any errors
		.catch(function () {});
}