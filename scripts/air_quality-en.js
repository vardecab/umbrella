// 🇬🇧

// API keys, well... ¯\_(ツ)_/¯ 
const airly_api_key = "p1ukBMrlBEPfRD1SynGXU9iEcr0zzJrE";
const aqicn_api_key = "b2a31fc801f6e4e27353e44d13acf144189c4a0a";

function airMask(lat, lng) {
    // grab data from URL
    fetch("https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=" + lat + "&lng=" + lng + "&apikey=" + airly_api_key)

        // convert data to JSON
        .then(function (res) {
            return res.json();
        })

        // use the data stored in object to do whatever
        .then(function (data_airly) {
            console.error("Airly", data_airly); // debug: output everything stored in the object

            // 💨 air quality
            current_air_quality = data_airly.current.indexes["0"].level; // get info about air quality 
            console.log("Current air quality is", current_air_quality, "with value of: " + data_airly.current.indexes["0"].value + ". Medium starts at 50, bad starts at 75. Death starts at 100."); // debug

            // data from primary API - Airly
            air_quality_index = data_airly.current.indexes["0"].value;

            if ((air_quality_index >= 0) & (air_quality_index < 50)) {
                document.getElementById("air_quality").innerHTML = "Air quality: 🤓"; // 🟢 emoji not fully supported across different operating systems (ie < Android 10)
            } else if ((air_quality_index >= 50) & (air_quality_index < 75)) {
                document.getElementById("air_quality").innerHTML = "Air quality: 🤢"; // 🟡 emoji not fully supported across different operating systems (ie < Android 10)
            } else if ((air_quality_index >= 75) & (air_quality_index < 100)) {
                document.getElementById("air_quality").innerHTML = "Air quality: 🤬"; // 🔴
            } else if (air_quality_index >= 100) {
                document.getElementById("air_quality").innerHTML = "Air quality: ⚰️"; // ⚫
            } else {}

            // fallback call to different API (AQICN) when Airly is down (either lack of sensors around (3 km radius) or no requests available due to their limits)
            if ((data_airly.current.indexes["0"].value == null) || (data_airly.current.indexes["0"].level == "UNKNOWN") || (data_airly.current.indexes["0"].level == null)) {
                console.log("There is something wrong and I can't download air quality data from Airly. Probably I couldn't find any stations in 3 km radius or I can't send any more requests.")

                console.log("Looks like Airly failed us... Let's pull data from China 🤓");

                fetch("https://api.waqi.info/feed/geo:" + lat + ";" + lng + "/?token=" + aqicn_api_key)

                    // convert data to JSON
                    .then(function (res) {
                        return res.json();
                    })

                    // use the data stored in object to do whatever
                    .then(function (data_aqicn) {
                        console.error("AQICN", data_aqicn); // debug: output everything stored in the object
                        console.log("AQI:", data_aqicn.data.aqi); // debug

                        air_quality_index = data_aqicn.data.aqi;

                        // NOTE: there must be a cleaner way to do it rather than copy-pasting from above... but this works for now 
                        if ((air_quality_index >= 0) & (air_quality_index < 50)) {
                            document.getElementById("air_quality").innerHTML = "Air quality: 🤓"; // 🟢 emoji not fully supported across different operating systems (ie < Android 10)
                        } else if ((air_quality_index >= 50) & (air_quality_index < 75)) {
                            document.getElementById("air_quality").innerHTML = "Air quality: 🤢"; // 🟡 emoji not fully supported across different operating systems (ie < Android 10)
                        } else if ((air_quality_index >= 75) & (air_quality_index < 100)) {
                            document.getElementById("air_quality").innerHTML = "Air quality: 🤬"; // 🔴
                        } else if (air_quality_index >= 100) {
                            document.getElementById("air_quality").innerHTML = "Air quality: ⚰️"; // ⚫
                        } else {}

                    })

            }

        })

        // catch any errors
        .catch(function () {});
}