/* ================================== */
/*               findMe               */
/* ================================== */

// find user using GPS/IP when clicked on 📍

// NOTE: doesn't work in Vivaldi, GPS is disabled -> https://forum.vivaldi.net/topic/71634/gps-still-not-working/7

function findMe() {
	// change text in the page
	var locating = document.querySelector("#findme");
	locating.textContent = "Szukam...";

	// reload page
	location.reload(); 
	
	// use function from another file (dispatcher.js)
	geoLocator();
	
	// function success(position) {
	// 	const geo_latitude = position.coords.latitude;
	// 	const geo_longitude = position.coords.longitude;

	// 	// set 🍪 for latitude
	// 	Cookies.set("umbrella_coord_lat", geo_latitude, {
	// 		expires: 30,
	// 		path: "/"
	// 	});
	// 	// set 🍪 for longitude
	// 	Cookies.set("umbrella_coord_lng", geo_longitude, {
	// 		expires: 30,
	// 		path: "/"
	// 	});
	// }

	// function error() {
	// 	console.log('Unable to get location from GPS/IP...');
	// }

	// if (!navigator.geolocation) {
	// 	alert(
	// 		"Geolokalizacja (GPS) nie jest wspierana przez Twoją przeglądarkę... :("
	// 	);
	// } else {
	// 	var locating = document.querySelector("#findme");
	// 	locating.textContent = "Szukam...";
	// 	location.reload(); // reload page
	// 	navigator.geolocation.getCurrentPosition(success, error);
	// }
}