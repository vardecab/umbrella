// API:
// https://openweathermap.org/forecast5 // 5 day forecast includes weather data every 3 hours
// https://api.openweathermap.org/data/2.5/forecast // current weather

// === Part 0 ===

const api_key = "4541406d253305e837d9ff9e415c7551";
if (api_key == "") {
	window.alert("API key missing!");
	console.error("API key missing!");
}

// === Part 1 ===

function weatherBallon(cityID) {
	fetch(
			"https://api.openweathermap.org/data/2.5/forecast?id=" +
			cityID +
			"&appid=" +
			api_key +
			"&units=metric"
		)
		// convert data to JSON
		.then(function (resp) {
			return resp.json();
		})
		// get data to drawWeather function below
		.then(function (data) {
			drawWeather(data);
		})
		// catch any errors
		.catch(function () {});
}

// === Part 2 ===

function drawWeather(data_from_api) {
	// loading screen
	if (data_from_api.city.name != "") {
		document.getElementById("loading").remove();
	} else console.log("loading not removed");

	// 👕 clothes
	var idema = 0;
	var temperatures = []; // list of temperatures

	// output temperature from 2 consecutive data updates
	while (idema <= 1) {
		console.log(idema, Math.round(data_from_api.list[idema].main.temp, 0), "C");
		// console.log(idema); // debug ✅
		single_temperature = Math.round(data_from_api.list[idema].main.temp, 0);
		single_temperature_float = parseFloat(single_temperature); // convert to float
		temperatures.push(single_temperature_float); // add to list
		single_temperature = 0; // reset variable
		idema++; // let's get next data update
		// NOTE: [0] is first update in the JSON file, [1] is the 2nd and so on
	}
	// console.log(temperatures); // debug ✅

	// let's get sum and average of temperatures in the list
	if (temperatures.length) {
		temperatures_sum = temperatures.reduce(function (a, b) {
			return a + b;
		});
		temperatures_avg = temperatures_sum / temperatures.length;
	}

	// let's get median of temperatures in the list
	temperatures.sort((a, b) => a - b);
	let lowMiddle = Math.floor((temperatures.length - 1) / 2);
	let highMiddle = Math.ceil((temperatures.length - 1) / 2);
	let median = (temperatures[lowMiddle] + temperatures[highMiddle]) / 2;

	console.log("sum:", temperatures_sum, "avg:", temperatures_avg); // debug ✅
	console.log("med:", median); // debug ✅

	// logic itself for showing appropriate icon and background depending on temperature
	if (temperatures_avg >= 23) {
		document.getElementById("clothes").innerHTML = "Króciutko 👕"; // 🩳: shorts emoji does work only on Windows: https://emojipedia.org/shorts/
		document.body.style.background =
			"linear-gradient(360deg, rgba(249, 224, 144, 1) 0%, rgba(255, 147, 92, 1) 100%) no-repeat center center fixed";
		document.getElementById("icon").src = "../images/weather/sun.svg";
	} else if ((temperatures_avg < 23) & (temperatures_avg > 16)) {
		document.getElementById("clothes").innerHTML = "Długie spodnie i bluza 👖";
		document.body.style.background =
			"linear-gradient(180deg, rgba(131,240,167,1) 10%, rgba(222,251,232,1) 80%) no-repeat center center fixed";
		document.getElementById("icon").src = "../images/weather/clouds.svg";
	} else if ((temperatures_avg <= 16) & (temperatures_avg > 10)) {
		document.getElementById("clothes").innerHTML = "Ubierz się ciepło 🤗";
		document.getElementById("icon").src = "../images/weather/wind.svg";
		document.body.style.background =
			"linear-gradient(180deg, rgba(31,186,195,1) 10%, rgba(196,243,246,1) 80%) no-repeat center center fixed";
	} else if ((temperatures_avg <= 10) & (temperatures_avg > 0)) {
		document.getElementById("clothes").innerHTML = "Kurtka, bluza, szalik 🧣";
		document.getElementById("icon").src = "../images/weather/scarf.svg";
		document.body.style.background =
			"linear-gradient(0deg, rgba(245,217,245,1) 20%, rgba(228,157,228,1) 90%) no-repeat center center fixed";
	} else {
		document.getElementById("clothes").innerHTML = "Mróz 🥶";
		document.getElementById("icon").src = "../images/weather/freezing.svg";
		document.body.style.background =
			"linear-gradient(0deg, rgba(249,254,254,1) 20%, rgba(227,250,250,1) 70%) no-repeat center center fixed";
	}

	// debug start --->

	var data_update_number = 0;
	console.log("City:", data_from_api.city.name);
	console.log("Sunrise time:", data_from_api.city.sunrise, "(UNIX)");
	console.log("Sunset time:", data_from_api.city.sunset, "(UNIX)");
	while (data_update_number <= 8) {
		// 8 should give 24 hrs; TODO: get number of updates in single .json
		console.log("<<<--- data update:", data_update_number, "--->>>");
		console.log(
			"Weather:",
			data_from_api.list[data_update_number].weather[0].main
		);
		console.log("Temp:", data_from_api.list[data_update_number].main.temp, "C");
		time_of_data = data_from_api.list[data_update_number].dt_txt;
		var utcTime = time_of_data;
		var local_time = moment // uses moment.js
			.utc(utcTime)
			.local()
			.format("dddd DD, HH:mm"); // // time of update should be in local time now
		console.log("Time of update:", local_time); // UTC, 2 hrs behind
		// console.log("Wind:", data_from_api.list[data_update_number].wind.speed, "m/s"); // meter/sec
		// console.log('Rain:', data_from_api.list[1].rain.3h) // The data is specified for the 3 hours time period from the timestamp in the response. FIX: `.3h` won't work
		data_update_number++;
	}

	// <--- debug end

	// === Part 3 ===
	// ☔ check if it's gonna rain logic

	// var weather_description = data_from_api.list[0].weather[0].main; // first data TODO: check 1st, 2nd, 3rd data update to be more reliable

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

	while (numero <= 1) {
		// console.log(numero, data_from_api.list[numero].weather[0].main); // debug ✅
		// console.log(idema); // debug ✅
		weather_conditions.push(data_from_api.list[numero].weather[0].main); // add to list
		numero++; // let's get next data update
	}
	console.log("what's in 'raining' list:", raining); // debug ✅
	console.log("weather conditions:", weather_conditions); // debug ✅; write next 4 weather conditions

	// check if actual raining weather is in definied 'raining' list
	if (weather_conditions.some(r => raining.includes(r)) == true) {
		document.getElementById("umbrella").innerHTML = "Weź parasol! ☔";
		document.getElementById("icon").src = "../images/weather/rain.svg";
	} else if (weather_conditions.some(r => snowing.includes(r)) == true) {
		document.getElementById("umbrella").innerHTML = "Pada śnieg ⛄";
		document.getElementById("icon").src = "../images/weather/snowing.svg";
	} else document.getElementById("umbrella").innerHTML = "Bez deszczu";

	// === Part 4 ===
	// get weather details from API and push to HTML

	// 🔥 temperature
	document.getElementById("temperature").innerHTML =
		// Math.round(data_from_api.list[0].main.temp, 0) + "&deg;"; // temperature in Celsius without comma
		Math.round(temperatures_avg, 0) + "&deg;";

	// 🏙 city name
	// document.getElementById("city").innerHTML = data_from_api.city.name;

	// 🍃 wind
	var wind_raw = data_from_api.list[1].wind.speed; // get wind
	wind_kph = parseFloat(wind_raw) * 3.6; // convert m/s to km/h
	wind = Math.round(wind_kph, 2);

	var wind_in_html = document.getElementById("wind");
	wind_in_html.textContent += wind + " km/h"; // add to HTML

	// 📔 description
	document.getElementById("weather_description").innerHTML =
		data_from_api.list[0].weather[0].main;

	// ☀️ sunrise
	var sunrise_local = moment.unix(data_from_api.city.sunrise).format("H:mm");

	var sunrise_in_html = document.getElementById("sunrise");
	sunrise_in_html.textContent += sunrise_local;

	// 🌗 sunset
	var sunset_local = moment.unix(data_from_api.city.sunset).format("H:mm ");

	var sunset_in_html = document.getElementById("sunset");
	sunset_in_html.textContent += sunset_local;
}