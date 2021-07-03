/* ================================== */
/*              UV index              */
/* ================================== */

/* -------- get UVI from API -------- */

function getUVI(lat, lng) {
	const owm_api_key = "4541406d253305e837d9ff9e415c7551"; // well... no way to hide it ¯\_(ツ)_/¯
	// if (owm_api_key == "") {
	//     window.alert("API key missing!");
	//     console.error("API key missing!");
	// }

	/* ------- grab data from URL ------- */
	// One Call API (https://openweathermap.org/api/one-call-api)
	var owm_url =
		"https://api.openweathermap.org/data/2.5/onecall?lat=" +
		lat +
		"&lon=" +
		lng +
        "&exclude=" +
        "minutely,hourly,daily,alerts" +
		"&appid=" +
		owm_api_key
	console.log('%c%s', 'color: #0047ca', "Full API URL (One Call (UV)):", owm_url); // debug; colored output 
	fetch(owm_url)
		// convert data to JSON
		.then(function (resp) {
			return resp.json();
		})
		// get data to showUVI() function below
		.then(function (owm_data) {
			console.error("OpenWeatherMap - One Call (UVI)", owm_data);
			showUVI(owm_data);
		})
		// catch any errors
		.catch(function () {});
}

/* --------- show UVI in app -------- */

// get data from getUVI() and do magic
function showUVI(owm_data) {
    uvi = owm_data.current.uvi
    uvi = Math.round(uvi)
    // console.log('UVI:', uvi) // debug

    // *NOTE: https://en.wikipedia.org/wiki/Ultraviolet_index

    var uvi_in_html = document.getElementById("uvi");
    if (uvi < 3) { // low danger
        uvi_in_html.textContent += uvi + " 🕶️";
    } else if (uvi >= 3 && uvi < 6) { // moderate risk of harm
        uvi_in_html.textContent += uvi + " 🕶️👒";
    } else if (uvi >= 6 && uvi < 8) { // high risk of harm 
        uvi_in_html.textContent += uvi + " 🕶️👒🌳";
    } else if (uvi >= 8 && uvi < 11) { // very high risk of harm
        uvi_in_html.textContent += uvi + " 🏠";
    } else { // uvi >= 11; extreme risk of harm 
        uvi_in_html.textContent += uvi + " 🏠";
    }
}

/* --------- high UVI alert --------- */

// notify user when there is high risk of harm from unprotected sun exposure
// using browser notification: https://developer.mozilla.org/en-US/docs/Web/API/notification
// using alert() when browser notification ^ is not supported / blocked 
// !FIX: doesn't work on mobile - would need to implemment https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
function uviAlert() {
	setTimeout(function () {
		var uvi = document.getElementById("uvi")
			.textContent;
		if (
			uvi == "UVI: 8 🏠" || 
			uvi == "UVI: 9 🏠" || 
			uvi == "UVI: 10 🏠" || 
			uvi == "UVI: 11 🏠" || 
			uvi == "UVI: 12 🏠" || 
			uvi == "UVI: 13 🏠" || 
			uvi == "UVI: 14 🏠" || 
			uvi == "UVI: 15 🏠"
		) {
			// Let's check if the browser supports notifications
			if (!("Notification" in window)) {
				console.error(
					"This browser does not support desktop notifications."
				);
				alert(
					"Lepiej nie wychodź z budynku. Wysokie zagrożenie podczas przebywania na słońcu!"
				);
			}

			// Let's check whether notification permissions have already been granted
			else if (Notification.permission === "granted") {
				// If it's okay let's create a notification
				var notification = new Notification(
					"Słońce szkodzi ☀️", {
						icon: "./images/umbrella-icon_blue-circle.png",
						body: "Lepiej nie wychodź z budynku. Wysokie zagrożenie podczas przebywania na słońcu!",
						requireInteraction: true // don't close notification
					}
				);
			} else if (Notification.permission == 'denied') {
				// user blocked notifications
				alert("Lepiej nie wychodź z budynku. Wysokie zagrożenie podczas przebywania na słońcu!");
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
                            "Słońce szkodzi ☀️", {
                                icon: "./images/umbrella-icon_blue-circle.png",
                                body: "Lepiej nie wychodź z budynku. Wysokie zagrożenie podczas przebywania na słońcu!",
                                requireInteraction: true // don't close notification
                            }
                        );
					}
				});
			}
		} else console.log("No alert/notification, UVI is not so bad. Current: >", uvi, "<");
	}, 2000); // how many ms to wait until function is executed; 1500 ms = 1.5 s
}

uviAlert();