// find user using GPS/IP when clicked on 📍
function findMe() {
	function success(position) {
		const geo_latitude = position.coords.latitude;
		const geo_longitude = position.coords.longitude;

		// set 🍪 for latitude
		Cookies.set("umbrella_coord_lat", geo_latitude, {
			expires: 30,
			path: "/"
		});
		// set 🍪 for longitude
		Cookies.set("umbrella_coord_lng", geo_longitude, {
			expires: 30,
			path: "/"
		});
	}

	if (!navigator.geolocation) {
		alert(
			"Geolokalizacja nie jest wspierana przez Twoją przeglądarkę... :("
		);
	} else {
		var locating = document.querySelector("#findme");
		locating.textContent = "Szukam...";
		location.reload();
		navigator.geolocation.getCurrentPosition(success, error);
	}
}
