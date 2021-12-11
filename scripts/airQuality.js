/* ================================== */
/*             airQuality             */
/* ================================== */

// File which handles air quality data - sends request to API, returns the result, displays data in HTML and sends alert when air quality is unhealthy.

// API keys, well... no way to hide it ¯\_(ツ)_/¯
const airly_api_key = "p1ukBMrlBEPfRD1SynGXU9iEcr0zzJrE";
const aqicn_api_key = "b2a31fc801f6e4e27353e44d13acf144189c4a0a";

function airMask(lat, lng) {
	setTimeout(function () {
		// grab data from URL
		fetch(
				"https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=" +
				lat +
				"&lng=" +
				lng +
				"&apikey=" +
				airly_api_key
			)
			// NOTE: Measurement values are interpolated by averaging measurements from nearby sensors (up to 1,5km away from the given point). The returned value is a weighted average, with the weight inversely proportional to the distance from the sensor to the given point.

			// convert data to JSON
			.then(function (res) {
				return res.json();
			})

			// use the data stored in object to do whatever
			.then(function (data_airly) {
				console.error("Airly", data_airly); // debug: output everything stored in the object

				// 💨 air quality
				current_air_quality = data_airly.current.indexes["0"].level; // get info about air quality
				console.log(
					"Current air quality is",
					current_air_quality,
					"with value of: " +
					data_airly.current.indexes["0"].value +
					". Medium starts at 50, bad starts at 75. Death starts at 100."
				); // debug

				// data from primary API - Airly
				air_quality_index = data_airly.current.indexes["0"].value;

				if (air_quality_index == null) {
					document.getElementById("air_quality").innerHTML =
						"Sprawdzam..."; // Airly can't find the data for this location. Need to try with AQICN. 
				} else if ((air_quality_index >= 0) & (air_quality_index < 30)) {
					document.getElementById("air_quality").innerHTML =
						"Powietrze: 🤓"; // 🟢 emoji not fully supported across different operating systems (ie < Android 10)
				} else if ((air_quality_index >= 30) & (air_quality_index < 50)) {
					document.getElementById("air_quality").innerHTML =
						"Powietrze: 🤢"; // 🟡 emoji not fully supported across different operating systems (ie < Android 10)
				} else if ((air_quality_index >= 50) & (air_quality_index < 75)) {
					document.getElementById("air_quality").innerHTML =
						"Powietrze: 🤬"; // 🔴
				} else if ((air_quality_index >= 75) & (air_quality_index < 100)) {
					document.getElementById("air_quality").innerHTML =
						"Powietrze: ⚰️"; // ⚫
				} else if ((air_quality_index >= 100) & (air_quality_index < 125)) {
					document.getElementById("air_quality").innerHTML =
						"Powietrze: ⚰️⚰️"; // ⚫⚫
				} else if (air_quality_index >= 125) {
					document.getElementById("air_quality").innerHTML =
						"Powietrze: ⚰️⚰️⚰️"; // ⚫⚫⚫
				} else {}

				// get info about PM2.5 & PM10

				try {
					console.log("PM2.5:", data_airly.current.values[1].value + "/25 μg"); // debug
					console.log("PM10:", data_airly.current.values[2].value + "/50 μg"); // debug
					pm25 = data_airly.current.values[1].value;
					document.getElementById("pm25").innerHTML = "PM2.5: " + pm25 + "/25 μg";
					pm10 = data_airly.current.values[2].value;
					document.getElementById("pm10").innerHTML = "PM10: " + pm10 + "/50 μg";
				} catch (err) {
					console.log("Can't take PM2.5 & PM10 data from Airly API. Will re-try with AQICN.");
				}

				// fallback call to different API (AQICN) when Airly is down (either lack of sensors around (3 km radius) or no requests available due to their limits)

				if (air_quality_index == null) {
					console.log(
						"There is something wrong and I can't download air quality data from Airly. Probably I couldn't find any stations in 3 km radius or I can't send any more requests. Let's pull data from China instead 🤓"
					);

					// console.log(
					// 	"Looks like Airly failed us... Let's pull data from China 🤓"
					// );

					fetch(
							"https://api.waqi.info/feed/geo:" +
							lat +
							";" +
							lng +
							"/?token=" +
							aqicn_api_key
						)
						// convert data to JSON
						.then(function (res) {
							return res.json();
						})

						// use the data stored in object to do whatever
						.then(function (data_aqicn) {
							console.error("AQICN", data_aqicn); // debug: output everything stored in the object
							console.log("AQICN:", data_aqicn.data.aqi); // debug

							air_quality_index = data_aqicn.data.aqi;

							// NOTE: there must be a cleaner way to do it rather than copy-pasting from above... but this works for now
							if (
								(air_quality_index >= 0) &
								(air_quality_index < 50)
							) {
								document.getElementById("air_quality").innerHTML =
									"Powietrze: 🤓"; // 🟢 emoji not fully supported across different operating systems (ie < Android 10)
							} else if (
								(air_quality_index >= 50) &
								(air_quality_index < 100)
							) {
								document.getElementById("air_quality").innerHTML =
									"Powietrze: 🤢"; // 🟡 emoji not fully supported across different operating systems (ie < Android 10)
							} else if (
								(air_quality_index >= 100) &
								(air_quality_index < 150)
							) {
								document.getElementById("air_quality").innerHTML =
									"Powietrze: 🤬"; // 🔴
							} else if (
								(air_quality_index >= 150) &
								(air_quality_index < 200)
							) {
								document.getElementById("air_quality").innerHTML =
									"Powietrze: ⚰️"; // ⚫
							} else if (
								(air_quality_index >= 200) &
								(air_quality_index < 300)
							) {
								document.getElementById("air_quality").innerHTML =
									"Powietrze: ⚰️⚰️"; // ⚫⚫
							} else if (air_quality_index >= 300) {
								document.getElementById("air_quality").innerHTML =
									"Powietrze: ⚰️⚰️⚰️"; // ⚫⚫⚫
							} else {}

							// get info about PM2.5 & PM10

							if (data_airly.current.standards.length == "0") { // if data from Airly API wasn't used
								if (data_aqicn.data.iaqi.pm25 == undefined || data_aqicn.data.iaqi.pm25 == null) { // check if PM2.5 is available 
									console.log('PM2.5 is not available in this location. Not able to show its value.');
								} else {
									pm25 = data_aqicn.data.iaqi.pm25.v;
									console.log("PM2.5:", pm25 + "/25 μg"); // debug
									document.getElementById("pm25").innerHTML = "PM2.5: " + pm25 + "/25 μg";
								}
							} else {
								pm25 = data_airly.current.values[1].value;
								console.log("PM2.5:", pm25 + "/25 μg"); // debug 
							}
							if (data_airly.current.standards.length == "0") { // if data from Airly API wasn't used
								if (data_aqicn.data.iaqi.pm10 == undefined || data_aqicn.data.iaqi.pm10 == null) { // check if PM10 is available
									console.log('PM10 is not available in this location. Not able to show its value.')
								} else {
									pm10 = data_aqicn.data.iaqi.pm10.v;
									console.log("PM10:", pm10 + "/50 μg"); // debug
									document.getElementById("pm10").innerHTML = "PM10: " + pm10 + "/50 μg";
								}
							} else {
								pm25 = data_airly.current.values[2].value;
								console.log("PM10:", pm10 + "/50 μg"); // debug
							}
						});
				}
			})
			// catch any errors
			.catch(function () {});
	}, 500); // *NOTE: delay showing info so it doesn't show along the loading screen
}

/* ---------- notification ---------- */

// notify user when air quality is bad 
// using browser notification: https://developer.mozilla.org/en-US/docs/Web/API/notification
// using alert() when browser notification ^ is not supported / blocked 
// TODO: doesn't work on mobile - would need to implement https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
function smogAlert() {
	setTimeout(function () {
		var air_quality_status = document.getElementById("air_quality")
			.textContent;
		if (
			air_quality_status == "Powietrze: ⚰️" ||
			air_quality_status == "Powietrze: ⚰️⚰️" ||
			air_quality_status == "Powietrze: ⚰️⚰️⚰️"
		) {
			// Let's check if the browser supports notifications
			if (!("Notification" in window)) {
				console.error(
					"This browser does not support desktop notifications."
				);
				alert(
					"Lepiej nie wychodź z budynku i nie otwieraj okien! Smog zabija ☠️"
				);
			}

			// Let's check whether notification permissions have already been granted
			else if (Notification.permission === "granted") {
				// If it's okay let's create a notification
				var notification = new Notification(
					"Smog zabija ☠️", {
						icon: "./images/umbrella-icon_blue-circle.png",
						body: "Lepiej nie wychodź z budynku i nie otwieraj okien!",
						requireInteraction: true // don't close notification
					}
				);
			} else if (Notification.permission == 'denied') {
				// user blocked notifications
				alert("Lepiej nie wychodź z budynku i nie otwieraj okien! Smog zabija ☠️");
			}

			// Otherwise, we need to ask the user for permission
			else if (Notification.permission !== "denied") {
				alert("Dostęp do powiadomień będzie użyty wyłącznie żeby wyświetlić informacje związane z zagrożeniami pogodowymi.")

				Notification.requestPermission().then(function (
					permission
				) {
					// If the user accepts, let's create a notification
					if (permission === "granted") {
						var notification = new Notification(
							"Smog zabija ☠️", {
								icon: "./images/umbrella-icon_blue-circle.png",
								body: "Lepiej nie wychodź z budynku i nie otwieraj okien!",
								requireInteraction: true // don't close notification
							}
						);
					}
				});
			}
		} else console.log("No alert/notification, air is not so bad. Current: > " + air_quality_status + " <");
	}, 5000); // how many ms to wait until function is executed; 1500 ms = 1.5 s
}

smogAlert();