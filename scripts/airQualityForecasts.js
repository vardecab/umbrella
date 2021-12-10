/* ================================== */
/*         airQualityForecasts        */
/* ================================== */

// TODO: what this script does? 

// API keys, well... no way to hide it ¯\_(ツ)_/¯
// const airly_api_key = "#"; //* NOTE: already declared elsewhere and can be used
// const aqicn_api_key = "#"; //* NOTE: already declared elsewhere and can be used

function airCrystalBall(lat, lng) {
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
                console.error("Airly2", data_airly); // debug: output everything stored in the object

                /* - convert ISO time to local time - */

                try {
                    forecast_time_6 = data_airly.forecast[6].fromDateTime; // take time & day from API; 6 hrs forward
                    forecast_time_12 = data_airly.forecast[12].fromDateTime; // take time & day from API; 12 hrs forward
                    //* NOTE: ISO8601 timestamp; date and time in UTC; the two fields represent time interval during which the data in this payload was measured and averaged
                    // console.log(forecast_time_6); // debug 

                    // 6 hrs
                    localized_day_time_6 = dayjs(forecast_time_6).format('DD/MM/YYYY HH:mm'); // ISO converted to local day & time 
                    console.log("Air quality forecast time (in 6 hrs):", localized_day_time_6); // debug

                    localized_time_6 = dayjs(forecast_time_6).format('H:mm'); // ISO converted to local time 
                    console.log("Air quality forecast time (in 6 hrs):", localized_time_6); // debug

                    // 12 hrs
                    localized_day_time_12 = dayjs(forecast_time_12).format('DD/MM/YYYY HH:mm'); // ISO converted to local day & time 
                    console.log("Air quality forecast time (in 12 hrs):", localized_day_time_12); // debug

                    localized_time_12 = dayjs(forecast_time_12).format('H:mm'); // ISO converted to local time 
                    console.log("Air quality forecast time (in 12 hrs):", localized_time_12); // debug


                    /* ----------- get PM data ---------- */

                    // PM2.5
                    // 6 hrs
                    pm25_6 = data_airly.forecast[6].values[0].value;
                    console.log("PM2.5_forecast_6:", pm25_6 + "/25 μg");

                    // 12 hrs
                    pm25_12 = data_airly.forecast[12].values[0].value;
                    console.log("PM2.5_forecast_12:", pm25_12 + "/25 μg");

                    // PM10
                    // 6 hrs
                    pm10_6 = data_airly.forecast[6].values[1].value;
                    console.log("PM10_forecast_6:", pm10_6 + "/50 μg");

                    // 12 hrs
                    pm10_12 = data_airly.forecast[12].values[1].value;
                    console.log("PM10_forecast_12:", pm10_12 + "/50 μg");

                    /* ------ display data on page ------ */

                    // document.getElementById("pm_forecast_6").append("O ", localized_time_6, " będzie: ", "PM2,5: ", pm25_6, "/50 μg", ", a PM10: ", pm10_6, "/50 μg");
                    document.getElementById("pm_forecast_6").append("🕕", localized_time_6, ": ", "PM2,5: ", pm25_6, " & PM10: ", pm10_6);
                    // document.getElementById("pm_forecast_12").append("O ", localized_time_12, " będzie: ", "PM2,5: ", pm25_12, "/50 μg", ", a PM10: ", pm10_12, "/50 μg");
                    document.getElementById("pm_forecast_12").append("🕛", localized_time_12, ": ", "PM2,5: ", pm25_12, " & PM10: ", pm10_12);
                } catch {
                    console.log("Airly is not supported in this location so can't show a forecast.")
                    // TODO: code AQICN fallback for forecasts
                }

            })
    })
}