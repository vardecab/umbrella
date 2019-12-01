# Umbrella

>A simple [weather page](https://vardecab.github.io/umbrella/umbrella.html) that tells you if you need to take an umbrella when going outside ☔

It _doesn't_ show current the weather outside - you can check it yourself by looking out through a window 🙃 Umbrella will tell you the future 🔮¹².  

¹ _Usually looking ~ 6 hours ahead._
² _Weather info displayed in Polish for now._

![](https://i.ibb.co/pwnX5wF/umbrella-1.png.png)

## How to use

Go to [Umbrella](https://vardecab.github.io/umbrella/umbrella.html). For now it shows temperature, wind speed, sunrise & sunset, air quality³ and overall description of the conditions. Location is saved in the 🍪. If you want to change the location, click on 🔀.

³ _Supports: parts of UK, Belgium, Netherlands, Germany and most of Poland. [Map of sensors available here](https://airly.eu/map/en/)._

## Roadmap

- Autocomplete location name (+ maybe a search bar).
- More elegant way to ask for location.
- Geolocation.
- <del>Be able to use any city - not only those predefinied.</del>

## Release History

- 0.10: Added air quality support for (probably) all cities.
- 0.9.3: `styles.css`: cleaned up, added comments, fixes for RWD, changed main font. Changed air quality emojis.
- 0.9.2: Changed air quality emojis.
- 0.9.1: Added social media tags for sharing.
- 0.9: Added weather info support for (probably) all cities.
- 0.8: Updated some backgrounds to better align with standards. Added different background and icon for temperature +30.
- 0.7: Added air quality info from Airly API.
- 0.6.1: Tiny RWD fix.
- 0.6: Implemented Service Worker.
- 0.5: Store & display weather data from `localStorage` when offline. Fixes for RWD.
- 0.4: Added new page to load when browser is offline.
- 0.3.3: Added several comments, added a few icons, added "Snowing" logic, styled `<select>`. 
- 0.3.2: Changed backgrounds, added wind & sunrise/sunset while hovering over temperature.
- 0.3.1: Added new city - Tarnów.
- 0.3: Added new icons, changed backgrounds, polished code, added (MVP) city selector.
- 0.2: Added early code for winter.
- 0.1: Initial release.

## Versioning

Using [SemVer](http://semver.org/).

## License

GNU General Public License v3.0, see [LICENSE.md](https://github.com/vardecab/umbrella/blob/master/LICENSE).

## Acknowledgements

- APIs: [OpenWeatherMap](https://openweathermap.org/api) & [Airly](https://developer.airly.eu/api) & [AQICN](https://aqicn.org/api/) & [LocationIQ](https://locationiq.com)
- [Main tutorial that inspired me](https://bytemaster.io/fetch-weather-openweathermap-api-javascript)
- [Moment.js](https://momentjs.com)
- [JavaScript Cookie](https://github.com/js-cookie/js-cookie)
- Tools used for creating backgrounds: [ColorHexa](https://www.colorhexa.com) & [CSS Gradient](https://cssgradient.io)
- RWD layout based on [Skeleton](http://getskeleton.com)
- [Navbar tutorial](https://www.w3schools.com/howto/howto_js_bottom_nav_responsive.asp)
- [Full background cover tutorial](https://css-tricks.com/perfect-full-page-background-image)
- Icons from [Flaticon](https://www.flaticon.com)
- Fonts used: [Fira Code](https://fonts.google.com/specimen/Fira+Code) & [Reem Kufi](https://fonts.google.com/specimen/Reem+Kufi)