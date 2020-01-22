// 🇵🇱

// API keys, well... no way to hide it ¯\_(ツ)_/¯
const airly_api_key = "p1ukBMrlBEPfRD1SynGXU9iEcr0zzJrE";
const aqicn_api_key = "b2a31fc801f6e4e27353e44d13acf144189c4a0a";

function airMask(lat, lng) {
	// grab data from URL
	fetch(
		"https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=" +
			lat +
			"&lng=" +
			lng +
			"&apikey=" +
			airly_api_key
	)
		// convert data to JSON
		.then(function(res) {
			return res.json();
		})

		// use the data stored in object to do whatever
		.then(function(data_airly) {
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

			if ((air_quality_index >= 0) & (air_quality_index < 50)) {
				document.getElementById("air_quality").innerHTML =
					"Powietrze: 🤓"; // 🟢 emoji not fully supported across different operating systems (ie < Android 10)
			} else if ((air_quality_index >= 50) & (air_quality_index < 75)) {
				document.getElementById("air_quality").innerHTML =
					"Powietrze: 🤢"; // 🟡 emoji not fully supported across different operating systems (ie < Android 10)
			} else if ((air_quality_index >= 75) & (air_quality_index < 100)) {
				document.getElementById("air_quality").innerHTML =
					"Powietrze: 🤬"; // 🔴
			} else if ((air_quality_index >= 100) & (air_quality_index < 150)) {
				document.getElementById("air_quality").innerHTML =
					"Powietrze: ⚰️"; // ⚫
			} else if ((air_quality_index >= 150) & (air_quality_index < 200)) {
				document.getElementById("air_quality").innerHTML =
					"Powietrze: ⚰️⚰️"; // ⚫⚫
			} else if (air_quality_index >= 200) {
				document.getElementById("air_quality").innerHTML =
					"Powietrze: ⚰️⚰️⚰️"; // ⚫⚫⚫
			} else {
			}

			// fallback call to different API (AQICN) when Airly is down (either lack of sensors around (3 km radius) or no requests available due to their limits)
			if (
				data_airly.current.indexes["0"].value == null ||
				data_airly.current.indexes["0"].level == "UNKNOWN" ||
				data_airly.current.indexes["0"].level == null
			) {
				console.log(
					"There is something wrong and I can't download air quality data from Airly. Probably I couldn't find any stations in 3 km radius or I can't send any more requests."
				);

				console.log(
					"Looks like Airly failed us... Let's pull data from China 🤓"
				);

				fetch(
					"https://api.waqi.info/feed/geo:" +
						lat +
						";" +
						lng +
						"/?token=" +
						aqicn_api_key
				)
					// convert data to JSON
					.then(function(res) {
						return res.json();
					})

					// use the data stored in object to do whatever
					.then(function(data_aqicn) {
						console.error("AQICN", data_aqicn); // debug: output everything stored in the object
						console.log("AQI:", data_aqicn.data.aqi); // debug

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
							(air_quality_index < 75)
						) {
							document.getElementById("air_quality").innerHTML =
								"Powietrze: 🤢"; // 🟡 emoji not fully supported across different operating systems (ie < Android 10)
						} else if (
							(air_quality_index >= 75) &
							(air_quality_index < 100)
						) {
							document.getElementById("air_quality").innerHTML =
								"Powietrze: 🤬"; // 🔴
						} else if (
							(air_quality_index >= 100) &
							(air_quality_index < 150)
						) {
							document.getElementById("air_quality").innerHTML =
								"Powietrze: ⚰️"; // ⚫
						} else if (
							(air_quality_index >= 150) &
							(air_quality_index < 200)
						) {
							document.getElementById("air_quality").innerHTML =
								"Powietrze: ⚰️⚰️"; // ⚫⚫
						} else if (air_quality_index >= 200) {
							document.getElementById("air_quality").innerHTML =
								"Powietrze: ⚰️⚰️⚰️"; // ⚫⚫⚫
						} else {
						}
					});
			}
		})

		// catch any errors
		.catch(function() {});
}

function smogAlert() {
	setTimeout(function() {
		var air_quality_status = document.getElementById("air_quality")
			.textContent;
		if (
			air_quality_status == "Powietrze: ⚰️" ||
			air_quality_status == "Powietrze: ⚰️⚰️" ||
			air_quality_status == "Powietrze: ⚰️⚰️⚰️"
		) {
			alert(
				"Lepiej nie wychodź z budynku i nie otwieraj okien! Smog zabija ☠️"
			); // replaced with notification
			// // Let's check if the browser supports notifications
			// if (!("Notification" in window)) {
			// 	console.error(
			// 		"This browser does not support desktop notifications."
			// 	);
			// }

			// // Let's check whether notification permissions have already been granted
			// else if (Notification.permission === "granted") {
			// 	// If it's okay let's create a notification
			// 	var notification = new Notification(
			// 		"Smog zabija ☠️",
			// 		{
			// 			icon:
			// 				"./images/umbrella-icon_blue-circle.png",
			// 			body:
			// 				"Nie wychodź z budynku i nie otwieraj okien!"
			// 		}
			// 	);
			// }

			// // Otherwise, we need to ask the user for permission
			// else if (Notification.permission !== "denied") {
			// 	Notification.requestPermission().then(function(
			// 		permission
			// 	) {
			// 		// If the user accepts, let's create a notification
			// 		if (permission === "granted") {
			// 			var notification = new Notification(
			// 				"Smog zabija ☠️",
			// 				{
			// 					icon:
			// 						"./images/umbrella-icon_blue-circle.png",
			// 					body:
			// 						"Nie wychodź z budynku i nie otwieraj okien!"
			// 				}
			// 			);
			// 		}
			// 	});
			// }
		} else console.log("No alert/notification, air is not so bad. Current: >", air_quality_status, "<");
	}, 1500); // how many ms to wait until function is executed; 1500 ms = 1.5 s
}