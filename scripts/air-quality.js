// // === Part 0 ===

const airly_api_key = "p1ukBMrlBEPfRD1SynGXU9iEcr0zzJrE";

function airMask(lat, lng) {
    // grab data from URL
    fetch("https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=" + lat + "&lng=" + lng + "&apikey=" + airly_api_key)

        // convert data to JSON
        .then(function (res) {
            return res.json();
        })

        // use the data stored in object to do whatever
        .then(function (data) {
            console.error("Airly", data); // debug: output everything stored in the object

            // 💨 air quality
            current_air_quality = data.current.indexes["0"].level; // get info about air quality 
            console.log("Current air quality is", current_air_quality, "with value of: " + data.current.indexes["0"].value + ". Medium starts at 50, bad starts at 75."); // debug

            if ((data.current.indexes["0"].value < 50) & (data.current.indexes["0"].value >= 0)) {
                document.getElementById("air_quality").innerHTML = "Powietrze: 🍏"; // 🟢 not fully supported
            } else if ((data.current.indexes["0"].value >= 50) & (data.current.indexes["0"].value < 75)) {
                document.getElementById("air_quality").innerHTML = "Powietrze: 🚧"; // 🟡 not fully supported
            } else if ((data.current.indexes["0"].value >= 75) & (data.current.indexes["0"].value < 100)) {
                document.getElementById("air_quality").innerHTML = "Powietrze: ⛔"; // 🔴
            } else if (data.current.indexes["0"].value >= 100) {
                document.getElementById("air_quality").innerHTML = "Powietrze: ⚫";
            } else {
                console.error("There is something wrong and I can't download air quality data.")
            }

        })

        // catch any errors
        .catch(function () {});
}