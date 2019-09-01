// API: https://openweathermap.org/forecast5 & https://api.openweathermap.org/data/2.5/forecast

// === Part 1 ===

function weatherBallon(cityID) {
  // fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID + '&units=metric' + '&appid=' + key) // current weather
  // fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&units=metric' + '&appid=' + key) // 5 day forecast includes weather data every 3 hours
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?id=3081368&lang=pl&units=metric&appid=4541406d253305e837d9ff9e415c7551" // Wroclaw
    // "https://api.openweathermap.org/data/2.5/forecast?id=2220957&lang=pl&units=metric&appid=4541406d253305e837d9ff9e415c7551" // Yaounde, CM - should be raining; for debug
    // "https://api.openweathermap.org/data/2.5/forecast?id=1819729&lang=pl&units=metric&appid=4541406d253305e837d9ff9e415c7551" // Hong Kong; for debug
    // "https://api.openweathermap.org/data/2.5/forecast?id=5368361&lang=pl&units=metric&appid=4541406d253305e837d9ff9e415c7551" // Los Angeles; for debug
    // "https://api.openweathermap.org/data/2.5/forecast?id=6453366&lang=pl&units=metric&appid=4541406d253305e837d9ff9e415c7551" // Oslo - should be cold; for debug
    // "https://api.openweathermap.org/data/2.5/forecast?id=2643743&lang=pl&units=metric&appid=4541406d253305e837d9ff9e415c7551" // London; for debug
  )
    .then(function(resp) {
      return resp.json();
    }) // Convert data to json
    .then(function(data) {
      drawWeather(data);
    })
    .catch(function() {
      // catch any errors
    });
}

// === Part 2 ===

function drawWeather(data_from_api) {
  //
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
  }
  // console.log(temperatures); // debug ✅

  // let's get sum and average of temperatures in the list
  if (temperatures.length) {
    temperatures_sum = temperatures.reduce(function(a, b) {
      return a + b;
    });
    temperatures_avg = temperatures_sum / temperatures.length;
  }

  // let's get median of temperatures in the list
  temperatures.sort((a, b) => a - b);
  let lowMiddle = Math.floor((temperatures.length - 1) / 2);
  let highMiddle = Math.ceil((temperatures.length - 1) / 2);
  let median = (temperatures[lowMiddle] + temperatures[highMiddle]) / 2;

  console.log("sum:", temperatures_sum, "avg:", temperatures_avg);
  console.log("med:", median);

  // logic itself
  if (temperatures_avg >= 24) {
    document.getElementById("clothes").innerHTML = "Króciutko 👕"; // 🩳: shorts emoji does work only on Windows: https://emojipedia.org/shorts/
    document.body.style.background =
      "linear-gradient(360deg, rgba(249, 224, 144, 1) 0%, rgba(255, 147, 92, 1) 100%) no-repeat center center fixed";
    document.getElementById("icon").src = "./images/svg/sun.svg";
  } else if ((temperatures_avg < 24) & (temperatures_avg > 16)) {
    document.getElementById("clothes").innerHTML = "Długie spodnie i bluza 👖";
    document.body.style.background =
      "linear-gradient(360deg, rgba(86,235,134,1) 25%, rgba(154,243,183,1) 85%) no-repeat center center fixed";
    document.getElementById("icon").src = "./images/svg/clouds.svg";
  } else if ((temperatures_avg <= 16) & (temperatures_avg > 10)) {
    document.getElementById("clothes").innerHTML = "Ubierz się ciepło 🤗";
    document.getElementById("icon").src = "./images/svg/cold.svg";
    document.body.style.background =
      "linear-gradient(0deg, rgba(29,171,179,1) 33%, rgba(33,192,201,1) 90%) no-repeat center center fixed";
  } else if ((temperatures_avg <= 10) & (temperatures_avg > 0)) {
    document.getElementById("icon").src = "./images/svg/santa-hat.svg"; // TODO: change icon
    document.getElementById("icon").src = "./images/svg/cold.svg";
    // document.body.style.background =
    //   "linear-gradient(0deg, rgba(29,171,179,1) 33%, rgba(33,192,201,1) 90%) no-repeat center center fixed"; // TODO: change background
  } else {
    document.getElementById("clothes").innerHTML = "Mróz 🥶";
    document.getElementById("icon").src = "./images/svg/santa-hat.svg";
    // document.body.style.background =
    // "linear-gradient(0deg, rgba(29,171,179,1) 33%, rgba(33,192,201,1) 90%) no-repeat center center fixed"; // TODO: change background
  }

  // 🌍 convert time (first data update) from UTC to local (UTC+2)
  // var time_of_data = data_from_api.list[0].dt_txt;
  // var utcTime = time_of_data;
  // var local_time = moment
  //   .utc(utcTime)
  //   .local()
  //   .format("dddd DD, HH:mm"); // time of update should be in local time now

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
    var local_time = moment // use moment.js
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

  var weather_description = data_from_api.list[0].weather[0].main; // first data TODO: check 1st, 2nd, 3rd data update to be more reliable

  var raining = [
    "Rain",
    "rain",
    "snow",
    "Snow",
    "thunderstorm",
    "Thunderstorm",
    "thunderstorms",
    "Thunderstorms",
    "Thunder",
    "thunder",
    "storm",
    "Storm"
  ];

  var raino = 0;
  var weather_conditions = [];

  while (raino <= 1) {
    // console.log(raino, data_from_api.list[raino].weather[0].main);
    // console.log(idema); // debug ✅
    weather_conditions.push(data_from_api.list[raino].weather[0].main); // add to list
    raino++; // let's get next data update
  }
  console.log("what's in 'raining' list:", raining); // debug ✅
  console.log("weather conditions:", weather_conditions); // debug ✅; write next 4 weather conditions

  // check if actual raining weather is in definied 'raining' list
  if (weather_conditions.some(r => raining.includes(r)) == true) {
    document.getElementById("umbrella").innerHTML = "Weź parasol! ☔";
    document.body.style.background =
      "linear-gradient(360deg, rgba(39,168,230,1) 25%, rgba(108,196,238,1) 85%) no-repeat center center fixed";
    document.getElementById("icon").src = "./images/svg/rain.svg";
  } else document.getElementById("umbrella").innerHTML = "Bez deszczu";

  // === Part 4 ===
  // get data from API to HTML

  // 🔥 temperature
  document.getElementById("temperature").innerHTML =
    // Math.round(data_from_api.list[0].main.temp, 0) + "&deg;"; // temperature in Celsius without comma
    Math.round(temperatures_avg, 0) + "&deg;";

  // 🏙 city name
  document.getElementById("city").innerHTML = data_from_api.city.name;

  // 🍃 wind
  // var wind = document.getElementById("wind"); // not used now
  // wind.textContent += data_from_api.list[0].wind.speed + " m/s"; // not used now

  // 🕕 time of data update
  // var update_time = document.getElementById("time");
  // update_time.textContent += local_time;

  // 📔 description
  document.getElementById("description").innerHTML =
    data_from_api.list[0].weather[0].main;

  // 🌞 sunrise
  // TODO: convert from UNIX to UTC+2

  // ⛅ sunset
  // TODO: convert from UNIX to UTC+2
}

// === Part 5 ===

window.onload = function() {
  weatherBallon(3081368); // Wroclaw
};
