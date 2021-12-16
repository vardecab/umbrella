/* ================================== */
/*         airQualityForecasts        */
/* ================================== */

// Display air quality forecasts using 2 APIs: Airly & AQICN. Airly allows to show hourly (1-23) forecast while AQICN only allows for daily. AQICN acts as a fallback to Airly in locations where Airly sensors are not available. 

// const airly_api_key = "#"; //* NOTE: already declared elsewhere and can be used here
// const aqicn_api_key = "#"; //* NOTE: already declared elsewhere and can be used here

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
                console.error("Airly2_forecast", data_airly); // debug: output everything stored in the object

                /* - convert ISO time to local time - */

                try {
                    forecast_time_6 = data_airly.forecast[6].fromDateTime; // take time & day from API; 6 hrs forward
                    forecast_time_12 = data_airly.forecast[12].fromDateTime; // take time & day from API; 12 hrs forward
                    forecast_time_18 = data_airly.forecast[18].fromDateTime; // take time & day from API; 18 hrs forward
                    //* NOTE: ISO8601 timestamp; date and time in UTC; the two fields represent time interval during which the data in this payload was measured and averaged

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
                    
                    // 18 hrs
                    localized_day_time_18 = dayjs(forecast_time_18).format('DD/MM/YYYY HH:mm'); // ISO converted to local day & time 
                    console.log("Air quality forecast time (in 18 hrs):", localized_day_time_18); // debug

                    localized_time_18 = dayjs(forecast_time_18).format('H:mm'); // ISO converted to local time 
                    console.log("Air quality forecast time (in 18 hrs):", localized_time_18); // debug


                    /* ----------- get PM data ---------- */

                    /* -------------- PM2.5 ------------- */
                    // 6 hrs
                    pm25_6 = data_airly.forecast[6].values[0].value;
                    console.log("PM2.5_forecast_6:", pm25_6 + "/25 μg");

                    // 12 hrs
                    pm25_12 = data_airly.forecast[12].values[0].value;
                    console.log("PM2.5_forecast_12:", pm25_12 + "/25 μg");
                    
                    // 18 hrs
                    pm25_18 = data_airly.forecast[18].values[0].value;
                    console.log("PM2.5_forecast_18:", pm25_18 + "/25 μg");

                    /* -------------- PM10 -------------- */
                    // 6 hrs
                    pm10_6 = data_airly.forecast[6].values[1].value;
                    console.log("PM10_forecast_6:", pm10_6 + "/50 μg");

                    // 12 hrs
                    pm10_12 = data_airly.forecast[12].values[1].value;
                    console.log("PM10_forecast_12:", pm10_12 + "/50 μg");
                    
                    // 18 hrs
                    pm10_18 = data_airly.forecast[18].values[1].value;
                    console.log("PM10_forecast_18:", pm10_18 + "/50 μg");

                    /* ------ display data on page ------ */

                    document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line
                    document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line

                    document.getElementById("pm_forecast_6").append("+6 🕕", localized_time_6, ": ", "PM2.5: ", pm25_6, " & PM10: ", pm10_6);

                    document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line
                    
                    document.getElementById("pm_forecast_12").append("+12 🕛", localized_time_12, ": ", "PM2.5: ", pm25_12, " & PM10: ", pm10_12);
                    
                    document.getElementById("pm_forecast_18").appendChild(document.createElement("br")); // add a new line

                    document.getElementById("pm_forecast_18").append("+18 🕕", localized_time_18, ": ", "PM2.5: ", pm25_18, " & PM10: ", pm10_18);

                } catch {
                    console.log("Airly is not supported in this location so can't show a forecast.")
                }

                /* --------- AQICN fallback --------- */
                //* NOTE: AQICN is showing forecasts for a day, not specific hours... 

                if (data_airly.forecast[6].values.length === 0) { // checking if Airly failed
                    // Airly failed 

                    /* ----- get data from AQICN API ---- */

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
                            console.error("AQICN2_forecast", data_aqicn); // debug: output everything stored in the object
                            // console.log("AQICN:", data_aqicn.data.aqi); // debug

                            //* NOTE: assumption: looks like API returns forecast for -2 days from the request day, day 0 = request day, and +4 days // update: depends on location, need to diff dates to course correct this 

                            /* ------------- get today ------------ */

                            //* NOTE: wild things ahead, drink something before reading
                            
                            index = 0;

                            forecast_day = data_aqicn.data.forecast.daily.pm25[index].day;
                            console.log('Forecast day:', forecast_day);

                            // calculate how off initial date from API is to 'today' 

                            var forecast_day = moment(forecast_day); // create moment object, otherwise diff doesn't work
                            var today = moment();
                            // console.log('Today: ', today); // debug
                            diff_today = forecast_day.diff(today, 'days');
                            // console.log('%c%s', 'color: #e50000', diff_today); // debug
                            // console.log('diff: ', forecast_day.diff(today, 'days')+1); // debug
                            forecast_day = data_aqicn.data.forecast.daily.pm25[index-diff_today].day;
                            console.log('Forecast day (adjusted):', forecast_day); 
                            forecast_index_today = index-diff_today;
                            
                            /* ---------- get tomorrow ---------- */
                            
                            forecast_day_tomorrow = data_aqicn.data.forecast.daily.pm25[index].day;
                            console.log('Forecast day_tomorrow:', forecast_day_tomorrow);

                            // calculate how off initial date from API is to 'tomorrow' 

                            var forecast_day_tomorrow = moment(forecast_day_tomorrow); // create moment object, otherwise diff doesn't work
                            var tomorrow = moment().add(1,'days');
                            // console.log('%c%s', 'color: #00a3cc', tomorrow); // debug
                            // console.log('Tomorrow: ', tomorrow); // debug
                            diff_tomorrow = forecast_day_tomorrow.diff(tomorrow, 'days');
                            // console.log('%c%s', 'color: #00e600', diff_tomorrow); // debug
                            // console.log('diff: ', forecast_day_tomorrow.diff(today, 'days')+1); // debug
                            forecast_day_tomorrow = data_aqicn.data.forecast.daily.pm25[index-diff_tomorrow].day;
                            // console.log('%c%s', 'color: #aa00ff', forecast_day_tomorrow); // debug
                            console.log('Forecast day_tomorrow (adjusted):', forecast_day_tomorrow);
                            forecast_index_tomorrow = index-diff_tomorrow;

                            /* ---- get forecast PM2.5 today ---- */

                            forecast_pm25_avg = data_aqicn.data.forecast.daily.pm25[forecast_index_today].avg;
                            forecast_pm25_avg = ConcPM25(forecast_pm25_avg); // convert AQI value from API to μg
                            console.log('Forecast PM25 avg:', forecast_pm25_avg);
                            
                            /* --- get forecast PM2.5 tomorrow -- */
                            
                            forecast_pm25_avg_tomorrow = data_aqicn.data.forecast.daily.pm25[forecast_index_tomorrow].avg;
                            forecast_pm25_avg_tomorrow = ConcPM25(forecast_pm25_avg_tomorrow); // convert AQI value from API to μg
                            console.log('Forecast PM25 avg_tomorrow:', forecast_pm25_avg_tomorrow);

                            /* ----- get forecast PM10 today ---- */
                            forecast_pm10_avg = data_aqicn.data.forecast.daily.pm10[forecast_index_today].avg;
                            forecast_pm10_avg = ConcPM10(forecast_pm10_avg); // convert AQI value from API to μg
                            console.log('Forecast PM10 avg:', forecast_pm10_avg);
                            
                            /* --- get forecast PM10 tomorrow --- */
                            
                            forecast_pm10_avg_tomorrow = data_aqicn.data.forecast.daily.pm10[forecast_index_tomorrow].avg;
                            forecast_pm10_avg_tomorrow = ConcPM10(forecast_pm10_avg_tomorrow); // convert AQI value from API to μg
                            console.log('Forecast PM10 avg_tomorrow:', forecast_pm10_avg_tomorrow);
                            
                            /* ------ display data on page ------ */

                            document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line
                            document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line

                            document.getElementById("pm_forecast_6").append("Dzienna średnia: ");
                            // document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line
                            document.getElementById("pm_forecast_6").append("PM2.5: ", forecast_pm25_avg, "/25 μg & PM10: ", forecast_pm10_avg, "/50 μg");

                            document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line
                            
                            document.getElementById("pm_forecast_6").append("Jutro: ");
                            // document.getElementById("pm_forecast_6").appendChild(document.createElement("br")); // add a new line
                            document.getElementById("pm_forecast_6").append("PM2.5: ", forecast_pm25_avg_tomorrow, "/25 μg & PM10: ", forecast_pm10_avg_tomorrow, "/50 μg");
                            
                        })
                } else {
                    // Airly is ok
                }

            })
    })
}