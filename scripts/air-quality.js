// API: 
// https://powietrze.gios.gov.pl/pjp/content/api NOTE: doesn't work because of CORS (Cross-Origin Resource Sharing)
// https://developer.airly.eu/api

// // === Part 0 ===

const airly_api_key = "p1ukBMrlBEPfRD1SynGXU9iEcr0zzJrE";

// geo - based on those coords we'll get nearest station's results
// const lat = 51.09;
// const lng = 17.02;

function airMask(lat, lng) {
    // grab data from URL
    fetch("https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=" + lat + "&lng=" + lng + "&apikey=" + airly_api_key)

        // https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=49.67&lng=19.23&apikey=p1ukBMrlBEPfRD1SynGXU9iEcr0zzJrE // debug 

        // convert data to JSON
        .then(function (res) {
            return res.json();
        })

        // use the data stored in object to do whatever
        .then(function (data) {
            console.error(data); // debug: output everything stored in the object

            // 💨 air quality
            current_air_quality = data.current.indexes["0"].level; // get info about air quality 
            console.log("Current air quality: ", current_air_quality);

            var air_quality = [];
            air_quality.push(data.current.indexes["0"].level);
            console.log("WH:", air_quality); // debug

            var good_air_quality = ["VERY_LOW", "LOW"];
            var medium_air_quality = ["MEDIUM"];
            var bad_air_quality = ["HIGH", "VERY_HIGH", "EXTREME", "AIRMAGEDDON"];

            // depending on the air let's return appropriate emoji
            if (air_quality.some(r => good_air_quality.includes(r)) == true) {
                document.getElementById("air_quality").innerHTML = "Powietrze: ✅";
            } else if (air_quality.some(r => medium_air_quality.includes(r)) == true) {
                document.getElementById("air_quality").innerHTML = "Powietrze: 😷";
            } else if (air_quality.some(r => bad_air_quality.includes(r)) == true) {
                document.getElementById("air_quality").innerHTML = "Powietrze: 🤬";
            } else {
                console.error("Something went wrong and I can't get the air quality level 😭");
            }

        })

        // catch any errors
        .catch(function () {});
}