// === Part 1 ===
// get data from weather API and do stuff

// get JSON data from API and pass to drawWeather function
function weatherBallon(lat, lng) {

    const owm_api_key = "4541406d253305e837d9ff9e415c7551";
    if (owm_api_key == "") {
        window.alert("API key missing!");
        console.error("API key missing!");
    }

    // grab data from URL
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lng + "&appid=" + owm_api_key + "&units=metric")

        // convert data to JSON
        .then(function (resp) {
            return resp.json();
        })
        // get data to drawWeather function below
        .then(function (data) {
            console.error("OpenWeatherMap", data);
            drawWeather(data);
        })
        // catch any errors
        .catch(function () {});
}

// === Part 2 ===
// icon/text/background logic based on temperature

// get data from weatherBallon and do magic 
function drawWeather(data_from_api) {
    // loading screen
    if (data_from_api.city.name != "") {
        document.getElementById("loading").remove();
    } else console.log("City in OWM is null!");

    // 👕 clothes
    var just_a_counter = 0;
    var temperatures = []; // list of temperatures

    // output temperature from 2 consecutive data updates
    while (just_a_counter <= 1) {
        console.log("Update #" + just_a_counter + ": " + Math.round(data_from_api.list[just_a_counter].main.temp, 0) + "C");
        single_temperature = Math.round(data_from_api.list[just_a_counter].main.temp, 0);
        single_temperature_float = parseFloat(single_temperature); // convert to float
        temperatures.push(single_temperature_float); // add to list
        single_temperature = 0; // reset variable
        just_a_counter++; // let's get next data update
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

    // console.log("sum:", temperatures_sum, "avg:", temperatures_avg); // debug ✅
    // console.log("med:", median); // debug ✅

    // logic itself for showing appropriate icon, background and text depending on temperature
    // < 0, 0-10, 10-15, 15-20, 20-25, 25-30, 30+
    if (temperatures_avg >= 30) {
        document.getElementById("clothes").innerHTML = "Upał 🥵"; // text to be displayed
        document.body.style.background =
            "linear-gradient(180deg, rgba(255,78,78,1) 27%, rgba(255,118,118,1) 69%) no-repeat center center fixed"; // gradient background
        document.getElementById("icon").src = "./images/weather/fire.svg"; // icon to be displayed
    } else if ((temperatures_avg >= 25) & (temperatures_avg < 30)) {
        document.getElementById("clothes").innerHTML = "Króciutko 👕"; // 🩳: shorts emoji is not yet supported everywhere: https://emojipedia.org/shorts/ 
        document.body.style.background =
            "linear-gradient(360deg, rgba(249,224,144,1) 30%, rgba(255,147,92,1) 77%) no-repeat center center fixed";
        document.getElementById("icon").src = "./images/weather/sun.svg";
    } else if ((temperatures_avg < 25) & (temperatures_avg >= 20)) {
        document.getElementById("clothes").innerHTML = "Weź bluzę 🧥";
        document.body.style.background =
            "linear-gradient(180deg, rgba(255,241,114,1) 20%, rgba(255,249,191,1) 70%) no-repeat center center fixed";
        document.getElementById("icon").src = "./images/weather/cloudy.svg";
    } else if ((temperatures_avg < 20) & (temperatures_avg >= 15)) {
        document.getElementById("clothes").innerHTML = "Długie spodnie i bluza 👖";
        document.body.style.background =
            "linear-gradient(180deg, rgba(131,240,167,1) 10%, rgba(222,251,232,1) 80%) no-repeat center center fixed";
        document.getElementById("icon").src = "./images/weather/clouds.svg";
    } else if ((temperatures_avg < 15) & (temperatures_avg >= 10)) {
        document.getElementById("clothes").innerHTML = "Ubierz się ciepło 🤗";
        document.getElementById("icon").src = "./images/weather/wind.svg";
        document.body.style.background =
            "linear-gradient(0deg, rgba(254,208,254,1) 20%, rgba(178,50,178,1) 95%) no-repeat center center fixed";
    } else if ((temperatures_avg < 10) & (temperatures_avg >= 0)) {
        document.getElementById("clothes").innerHTML = "Kurtka, bluza, szalik 🧣";
        document.getElementById("icon").src = "./images/weather/scarf.svg";
        document.body.style.background =
            "linear-gradient(180deg, rgba(31,186,195,1) 10%, rgba(196,243,246,1) 80%) no-repeat center center fixed";
    } else {
        document.getElementById("clothes").innerHTML = "Mróz 🥶";
        document.getElementById("icon").src = "./images/weather/freezing.svg";
        document.body.style.background =
            "linear-gradient(0deg, rgba(249,254,254,1) 20%, rgba(227,250,250,1) 70%) no-repeat center center fixed";
    }

    // debug start --->

    // var data_update_number = 0;
    // console.log("City:", data_from_api.city.name);
    // console.log("Sunrise time:", data_from_api.city.sunrise, "(UNIX)");
    // console.log("Sunset time:", data_from_api.city.sunset, "(UNIX)");
    // while (data_update_number <= 8) {
    //     // 8 should give 24 hrs; TODO: get number of updates in single .json
    //     console.log("<<<--- data update:", data_update_number, "--->>>");
    //     console.log(
    //         "Weather:",
    //         data_from_api.list[data_update_number].weather[0].main
    //     );
    //     console.log("Temp:", data_from_api.list[data_update_number].main.temp, "C");
    //     time_of_data = data_from_api.list[data_update_number].dt_txt;
    //     var utcTime = time_of_data;
    //     var local_time = moment // uses moment.js
    //         .utc(utcTime)
    //         .local()
    //         .format("D MMMM, H:mm"); // // time of update should be in local time now
    //     console.log("Time of update:", local_time); // UTC, 2 hrs behind
    //     // console.log("Wind:", data_from_api.list[data_update_number].wind.speed, "m/s"); // meter/sec
    // // console.log("Rain:", data_from_api.list[1].rain["3h"]); // Rain volume for last 3 hours in mm
    //     data_update_number++;
    // }

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
        // console.log(just_a_counter); // debug ✅
        weather_conditions.push(data_from_api.list[numero].weather[0].main); // add to list
        numero++; // let's get next data update
    }
    // console.log("what's in 'raining' list:", raining); // debug ✅
    // console.log("weather conditions:", weather_conditions); // debug ✅; write next 4 weather conditions

    // check if actual raining weather is in definied 'raining' or 'snowing' lists
    if (weather_conditions.some(r => raining.includes(r)) == true) {
        document.getElementById("umbrella").innerHTML = "Weź parasol! ☔";
        document.getElementById("icon").src = "./images/weather/rain.svg";
    } else if (weather_conditions.some(r => snowing.includes(r)) == true) {
        document.getElementById("umbrella").innerHTML = "Pada śnieg ⛄";
        document.getElementById("icon").src = "./images/weather/snowing.svg";
    } else document.getElementById("umbrella").innerHTML = "Bez deszczu";

    // === Part 4 ===
    // get weather details from API and push to HTML

    // 🔥 temperature
    document.getElementById("temperature").innerHTML =
        // Math.round(data_from_api.list[0].main.temp, 0) + "&deg;"; // temperature in Celsius without comma
        Math.round(temperatures_avg, 0) + "&deg;";

    // 🏙 city name
    // document.getElementById("location").innerHTML = data_from_api.city.name;
    if (data_from_api.city.name == "Trnava") { // works when user dismissed the alert without providing any location - fallback; Trnava seems to be the default
        document.getElementById("location").innerHTML = "🌍 " + data_from_api.city.name;
    }

    // 🍃 wind
    var wind_raw = data_from_api.list[1].wind.speed; // get wind
    wind_kph = parseFloat(wind_raw) * 3.6; // convert m/s to km/h
    wind = Math.round(wind_kph, 2);

    var wind_in_html = document.getElementById("wind");
    wind_in_html.textContent += wind + " km/h"; // add to HTML

    // 📔 description
    // document.getElementById("weather_description").innerHTML = data_from_api.list[0].weather[0].main; // NOTE: if disabling in HTML you need to disable here as well - otherwise everything below won't be displayed 

    // ☀️ sunrise
    var sunrise_local = moment.unix(data_from_api.city.sunrise).format("H:mm");

    var sunrise_in_html = document.getElementById("sunrise");
    sunrise_in_html.textContent += sunrise_local;

    // 🌒 sunset
    var sunset_local = moment.unix(data_from_api.city.sunset).format("H:mm");

    var sunset_in_html = document.getElementById("sunset");
    sunset_in_html.textContent += sunset_local;

    // === Part 5 ===
    // save data to localStorage for offline use

    // store data
    var localStorage_temperature = Math.round(data_from_api.list[0].main.temp, 0);
    localStorage.setItem('localStorage_temperature_key', localStorage_temperature);

    var localStorage_description = data_from_api.list[0].weather[0].main;
    localStorage.setItem('localStorage_description_key', localStorage_description);

    var localStorage_time_of_update = local_time;
    localStorage.setItem('localStorage_time_of_update_key', local_time);
}

// === Part 6 ===
// check if browser is online or offline and if offline display offline.html

if (navigator.onLine === false) {
    window.location = "./offline.html";
}