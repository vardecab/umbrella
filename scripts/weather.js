// 🇵🇱

// === Part 1 ===
// get data from weather API and do stuff

// get JSON data from API and pass to drawWeather function
function weatherBallon(lat, lng) {
	const owm_api_key = "4541406d253305e837d9ff9e415c7551"; // well... no way to hide it ¯\_(ツ)_/¯
	// if (owm_api_key == "") {
	//     window.alert("API key missing!");
	//     console.error("API key missing!");
	// }

	// grab data from URL
	var owm_url =
		"https://api.openweathermap.org/data/2.5/forecast?lat=" +
		lat +
		"&lon=" +
		lng +
		"&appid=" +
		owm_api_key +
		"&units=metric" +
		"&lang=pl";
	console.log("Full API URL:", owm_url); // debug
	fetch(owm_url)
		// convert data to JSON
		.then(function(resp) {
			return resp.json();
		})
		// get data to drawWeather function below
		.then(function(owm_data) {
			console.error("OpenWeatherMap", owm_data);
			drawWeather(owm_data);
		})
		// catch any errors
		.catch(function() {});
}

// === Part 2 ===
// icon/text/background logic based on temperature

// get data from weatherBallon and do magic
function drawWeather(owm_data) {
	// loading screen
	if (owm_data.city.name != "") {
		document.getElementById("loading").remove();
	} else console.error("City in OWM is null!");

	// === temperature calculations ===
	var just_a_counter = 0; // counter
	var temperatures = []; // list of temperatures

	// add temperature from 2 consecutive data updates to the list above ^
	// let's look at "feels like" temperature, not "normal" one
	while (just_a_counter <= 1) { // * NOTE: 0 = now/next 3 hrs, 1 = next 6 hrs, 2 = next 9 hrs and so on
		console.log(
			"(feels like temp) Update #" +
				just_a_counter +
				": " +
				Math.round(owm_data.list[just_a_counter].main.feels_like, 0) +
				"C"
		); // debug; feels like temperature
		console.log(
			"(temp) Update #" +
				just_a_counter +
				": " +
				Math.round(owm_data.list[just_a_counter].main.temp, 0) +
				"C"
		); // debug; temperature

		single_temperature = Math.round(
			owm_data.list[just_a_counter].main.feels_like,
			0
		);
		single_temperature_float = parseFloat(single_temperature); // convert to float
		temperatures.push(single_temperature_float); // add to list
		single_temperature = 0; // reset variable
		just_a_counter++; // let's get next data update
		// NOTE: [0] is first update in the JSON file, [1] is the 2nd and so on
	}
	console.log("Temperatures, array: ", temperatures); // debug ✅

	// let's get sum and average of temperatures in the list
	if (temperatures.length) {
		temperatures_sum = temperatures.reduce(function(a, b) {
			return a + b;
		});
		temperatures_avg = temperatures_sum / temperatures.length;
	}

	// let's get median of temperatures in the list
	// temperatures.sort((a, b) => a - b);
	// let lowMiddle = Math.floor((temperatures.length - 1) / 2);
	// let highMiddle = Math.ceil((temperatures.length - 1) / 2);
	// let median = (temperatures[lowMiddle] + temperatures[highMiddle]) / 2;

	// console.log("sum:", temperatures_sum, "avg:", temperatures_avg); // debug ✅
	// console.log("med:", median); // debug ✅

	// logic itself for showing appropriate icon, background and text depending on temperature
	// < 0, 0-10, 10-15, 15-20, 20-25, 25-30, 30+
	if (temperatures_avg >= 30) {
		document.getElementById("clothes").innerHTML = "Zostań w domu 🥵"; // text to be displayed
		document.body.style.background =
			"linear-gradient(150deg, rgba(255,78,78,1) 5%, rgba(255,118,118,1) 90%) no-repeat center center fixed"; // gradient background
		document.getElementById("icon").src = "./images/weather/fire.svg"; // icon to be displayed
		document.head.querySelector('meta[name="theme-color"]').content =
			"#ED4A4B"; // change Chrome theme-color to match the background
	} else if ((temperatures_avg >= 25) & (temperatures_avg < 30)) {
		document.getElementById("clothes").innerHTML = "Krótko + czapka i okulary 🕶"; // 🩳: shorts emoji is not yet supported everywhere: https://emojipedia.org/shorts/
		document.body.style.background =
			"linear-gradient(150deg, rgba(255,147,92,1) 25%, rgba(249,224,144,1) 90%) no-repeat center center fixed";
		document.getElementById("icon").src = "./images/weather/sun.svg";
		document.head.querySelector('meta[name="theme-color"]').content =
			"#F2925A";
	} else if ((temperatures_avg < 25) & (temperatures_avg >= 20)) {
		document.getElementById("clothes").innerHTML = "Bluza i krótkie spodenki 🩳"; // 🩳: shorts emoji is not yet supported everywhere: https://emojipedia.org/shorts/
		document.body.style.background =
			"linear-gradient(150deg, rgba(255,241,114,1) 25%, rgba(255,249,191,1) 90%) no-repeat center center fixed";
		document.getElementById("icon").src = "./images/weather/cloudy.svg";
		document.head.querySelector('meta[name="theme-color"]').content =
			"#FFF072";
	} else if ((temperatures_avg < 20) & (temperatures_avg >= 15)) {
		document.getElementById("clothes").innerHTML =
			"Bluza i długie spodnie 🧥";
		document.body.style.background =
			"linear-gradient(150deg, rgba(131,240,167,1) 30%, rgba(222,251,232,1) 90%) no-repeat center center fixed";
		document.getElementById("icon").src = "./images/weather/clouds.svg";
		document.head.querySelector('meta[name="theme-color"]').content =
			"#83F1A8";
	} else if ((temperatures_avg < 15) & (temperatures_avg >= 10)) {
		document.getElementById("clothes").innerHTML = "Kurtka, bluza, długie spodnie 🤗";
		document.getElementById("icon").src = "./images/weather/wind.svg";
		document.body.style.background =
			"linear-gradient(150deg, rgba(61,243,198,1) 40%, rgba(173,245,254,1) 85%) no-repeat center center fixed";
		document.head.querySelector('meta[name="theme-color"]').content =
			"#3df3c6";
	} else if ((temperatures_avg < 10) & (temperatures_avg >= 0)) {
		document.getElementById("clothes").innerHTML =
			"Szalik, kurtka, bluza 🧣";
		document.getElementById("icon").src = "./images/weather/scarf.svg";
		document.body.style.background =
			"linear-gradient(150deg, rgba(96,208,254,1) 15%, rgba(212,250,255,1) 95%) no-repeat center center fixed";
		document.head.querySelector('meta[name="theme-color"]').content =
			"#60d0fe";
	} else if ((temperatures_avg < 0) & (temperatures_avg >= -10)) {
		document.getElementById("clothes").innerHTML = "Czapka, szalik, ciepła kurtka, rękawiczki 🧤";
		document.getElementById("icon").src = "./images/weather/freezing.svg";
		document.body.style.background =
			"linear-gradient(150deg, rgba(148,202,255,1) 15%, rgba(255,255,255,1) 90%) no-repeat center center fixed";
		document.head.querySelector('meta[name="theme-color"]').content =
			"#94caff";
	} else {
		document.getElementById("clothes").innerHTML = "Zostań w domu 🥶";
		document.getElementById("icon").src = "./images/weather/snowflake.svg";
		document.body.style.background =
			"linear-gradient(150deg, rgba(188,133,231,1) 25%, rgba(255,255,255,1) 90%) no-repeat center center fixed";
		document.head.querySelector('meta[name="theme-color"]').content =
			"#dbb4f9";
	}

	// debug start --->

	// var data_update_number = 0;
	// console.log("City:", owm_data.city.name);
	// console.log("Sunrise time:", owm_data.city.sunrise, "(UNIX)");
	// console.log("Sunset time:", owm_data.city.sunset, "(UNIX)");
	// while (data_update_number <= 8) {
	//     // 8 should give 24 hrs; TODO: get number of updates in single .json
	//     console.log("<<<--- data update:", data_update_number, "--->>>");
	//     console.log(
	//         "Weather:",
	//         owm_data.list[data_update_number].weather[0].main
	//     );
	//     console.log("Temp:", owm_data.list[data_update_number].main.temp, "C");
	// time_of_data = owm_data.list[data_update_number].dt_txt;
	// var utcTime = time_of_data;
	// var local_time = moment.utc(utcTime).local().format("D MMMM, H:mm"); // time of update should be in local time now; uses moment.js
	//     console.log("Time of update:", local_time); // UTC, 2 hrs behind
	//     // console.log("Wind:", owm_data.list[data_update_number].wind.speed, "m/s"); // meter/sec
	// // console.log("Rain:", owm_data.list[1].rain["3h"]); // Rain volume for last 3 hours in mm
	//     data_update_number++;
	// }

	// <--- debug end

	// === Part 3 ===
	// ☔ check if it's gonna rain logic

	// var weather_description = owm_data.list[0].weather[0].main; // first data TODO: check 1st, 2nd, 3rd data update to be more reliable

	// let's make a list of weather conditions that may indicate rain
	var raining = [
		"Rain",
		"rain",
		"thunderstorm",
		"Thunderstorm",
		"thunderstorms",
		"Thunderstorms",
		"Thunder",
		"thunder",
		"storm",
		"Storm",
		"Drizzle"
	];

	// let's make a list of weather conditions that may indicate snow
	var snowing = ["Snow", "snow"];

	var weather_conditions = []; // list where we'll store actual weather conditions (descriptions) from API

	var numero = 0; // just a counter for the loop below

	while (numero <= 1) { /// * NOTE: 1 = next 6 hrs 
		// console.log(numero, owm_data.list[numero].weather[0].main); // debug ✅
		// console.log(just_a_counter); // debug ✅
		weather_conditions.push(owm_data.list[numero].weather[0].main); // add to list
		numero++; // let's get next data update
	}
	// console.log("what's in 'raining' list:", raining); // debug ✅
	// console.log("weather conditions:", weather_conditions); // debug ✅; write next 4 weather conditions

	// check if actual raining weather is in definied 'raining' or 'snowing' lists
	if (weather_conditions.some(r => raining.includes(r)) == true) {
		document.getElementById("umbrella").innerHTML = "Weź parasol!";
		document.getElementById("icon").src = "./images/weather/rain.svg";
	} else if (weather_conditions.some(r => snowing.includes(r)) == true) {
		document.getElementById("umbrella").innerHTML = "Pada śnieg";
		document.getElementById("icon").src = "./images/weather/snowing.svg";
	} else document.getElementById("umbrella").innerHTML = "Bez deszczu";

	// === Part 4 ===
	// get weather details from API and push to HTML

	// 🔥 temperature
	document.getElementById("temperature").innerHTML = Math.round(owm_data.list[0].main.feels_like, 0) + "&deg;";
	// Math.round(owm_data.list[0].main.temp, 0) + "&deg;"; // temperature in Celsius without comma
	
	// var element = document.getElementById("temperature");
	// element.classList.add("temperature_next_3hrs");
	// document.getElementById("temperature_next_6hrs").textContent += Math.round(temperatures_avg, 0) + "°"; // ! FIX: "&deg;" doesn't work

	// 🏙 city name (& country name)
	// TODO: `city == undefined`
	if (owm_data.city.country == undefined) {
		// nothing
	} else {
		document.getElementById("location").textContent +=
			", " + owm_data.city.country;
	}
	if (owm_data.city.name == "Trnava") {
		// works when user dismissed the alert without providing any location - fallback; Trnava seems to be the default
		document.getElementById("location").innerHTML =
			"🌍 " + owm_data.city.name + ", " + owm_data.city.country;
	}

	// 🍃 wind
	var wind_raw = owm_data.list[0].wind.speed; // get wind
	wind_kph = parseFloat(wind_raw) * 3.6; // convert m/s to km/h
	wind = Math.round(wind_kph, 2);

	var wind_in_html = document.getElementById("wind");
	wind_in_html.textContent += wind + " km/h"; // add to HTML

	// ☁️ air pressure
	var air_pressure = owm_data.list[0].main.pressure;
	var air_pressure_in_html = document.getElementById("air_pressure");

	if (air_pressure < 1000) {
		air_pressure_in_html.textContent += "👎🏼" + air_pressure + " hPa";
	} else if ((air_pressure >= 1000) & (air_pressure <= 1025)) {
		air_pressure_in_html.textContent += "👍🏼" + air_pressure + " hPa";
	} else {
		air_pressure_in_html.textContent += "👎🏼" + air_pressure + " hPa";
	}

	// 📔 description
	// document.getElementById("weather_description").innerHTML = owm_data.list[0].weather[0].main; // NOTE: if disabling in HTML you need to disable here as well - otherwise everything below won't be displayed

	// ☀️ sunrise
	var sunrise_local = moment.unix(owm_data.city.sunrise).format("H:mm");

	var sunrise_in_html = document.getElementById("sunrise");
	sunrise_in_html.textContent += sunrise_local;

	// 🌒 sunset
	var sunset_local = moment.unix(owm_data.city.sunset).format("H:mm");

	var sunset_in_html = document.getElementById("sunset");
	sunset_in_html.textContent += sunset_local;

	// === Part 5 ===
	// save data to localStorage for offline use

	// store temperature
	var localStorage_temperature = Math.round(
		owm_data.list[0].main.feels_like,
		0
	);
	localStorage.setItem(
		"localStorage_temperature_key",
		localStorage_temperature
	);

	// store weather conditions
	var localStorage_description = owm_data.list[0].weather[0].main;
	localStorage.setItem(
		"localStorage_description_key",
		localStorage_description
	);

	// store time of last update
	time_of_data = owm_data.list[0].dt_txt;
	var utcTime = time_of_data;
	var local_time = moment
		.utc(utcTime)
		.local()
		.format("D MMMM, H:mm"); // time of update should be in local time now; uses moment.js
	var localStorage_time_of_update = local_time;
	localStorage.setItem(
		"localStorage_time_of_update_key",
		localStorage_time_of_update
	);

	// store location
	var localStorage_location = document.getElementById("location").textContent;
	localStorage.setItem("localStorage_location_key", localStorage_location);
}

// === Part 6 ===
// check if browser is online or offline and if offline display offline.html

if (navigator.onLine === false) {
	window.location = "./offline.html";
}
