# Umbrella

> A simple [weather page](https://vardecab.github.io/umbrella/umbrella.html) that tells you if you need to take an umbrella when going outside ☔ + it shows air quality.

<img src="https://vardecab.github.io/umbrella/images/social-sharing/umbrella-facebook-ogimage-v2.png">

It _doesn't_ show current weather outside - you can check it yourself by looking out through a window 🙃 Umbrella will tell you the future 🔮.

And it's kinda quick at that: [Pingdom report](https://tools.pingdom.com/#5bef88ed9f800000), [GTmetrix report](https://gtmetrix.com/reports/vardecab.github.io/snSxSCDL).

## Screenshots

<img src="https://s5.gifyu.com/images/umbrella.gif" height="400"/>
<img src="https://i.ibb.co/X4CHyH4/umbrella.png"/>

<!-- ![](https://i.ibb.co/Sr8H4Wv/Screenshot-20191208-143750-Brave-COLLAGE.jpg)
![](https://s5.gifyu.com/images/Screenshot_20191208-143750_Brave-ANIMATION.gif) -->

## How to use

Click [here](https://vardecab.github.io/umbrella/umbrella.html). For now it shows temperature, wind speed, sunrise & sunset, what to wear, air quality <del>and overall description of the conditions</del>. Location is saved in the 🍪s for 30 days. If you want to change the location, click on 🌍. If you want to geolocate yourself (GPS/IP), click on 📍.

## Roadmap

-   Autocomplete location name (+ maybe a search bar).
-   More elegant way to ask for location.
-   <del>_Geolocation._</del>
-   <del>_Be able to use any city - not only those predefinied._</del>

## Release History

- 0.19.6 & 0.20: Added: info about PM2.5 & PM10; it's now possible to hide allergy info. Changed: air quality scale is now more strict; modified spacing between elements on smartphones; clothing recommendations; emojis. Removed: info about weather in the next 6 hours.
- 0.19.5: Changed primary temperature from next 6 hours to current. 
- 0.19.4: Added GitHub backlink.
- 0.19.3: Translated remaining titles to PL.
-   0.19.2: Removed `fonts.googleapis.com` calls by self-hosting the font.
-   0.19.1: Tiny fix to a file path.
-   0.19: I hid allergens/pollen information behind _🤧👀_ emojis to improve UX + moved JS from main `umbrella.html` to separate files so it's easier to navigate. Also turned off EN version until I figure out how to easily maintain two languages.
-   0.18: Another big one: implemented allergens/pollen info for selected Polish cities - I'm scraping those in Python from [this page](https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/).
-   0.17: Big one:
    -   Instead of showing the normal temperature, the "feels like" temperature will be shown.
    -   Added air pressure info.
    -   Swapped way of showing smog alert from `alert()` to browser notification.
    -   More ⚰️s are shown when air pollution is extreme.
    -   Changed code formatting from [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify) to [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
    -   Minified JS, CSS and HTML files.
-   0.16: Added alert when air pollution is really bad.
-   0.15.1: Fixed a `null` bug when geolocating.
-   0.15: Fixed a `null` bug in `offline.html`.
-   0.14.2: Updated `og:image`.
-   0.14.1: Tiny fix to layout.
-   0.14: [Umbrella (English version)](https://vardecab.github.io/umbrella/umbrella-en.html) + [Umbrella (Polish version)](https://vardecab.github.io/umbrella/umbrella.html)
-   0.13.5: Bug fixes and refined backgrounds.
-   0.13.4: Updates to `offline.html`, bug fixing and some cleanup in various places. Added new icon for a very low temperature.
-   0.13.3: Fixed a loading bug on first use.
-   0.13.2: Changed favicon.
-   0.13.1: Country now displayed alongside city name.
-   0.13: Added [theme-color meta tag](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android) based dynamically on the background color for mobile Chromium-based browsers.
-   0.12: Added [geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
-   0.11.1: Changed main font to [Mali](https://fonts.google.com/specimen/Mali).
-   0.11: Added allergy/pollen API but then removed due to its weak coverage.
-   0.10.1: RWD fixes, switched fonts.
-   0.10: Added air quality support for (probably) all cities.
-   0.9.3: `styles.css`: cleaned up, added comments, fixes for RWD, changed main font. Changed air quality emojis.
-   0.9.2: Changed air quality emojis.
-   0.9.1: Added social media tags for sharing.
-   0.9: Added weather info support for (probably) all cities.
-   0.8: Updated some backgrounds to better align with standards. Added different background and icon for temperature +30.
-   0.7: Added air quality info from Airly API.
-   0.6.1: Tiny RWD fix.
-   0.6: Implemented Service Worker.
-   0.5: Store & display weather data from `localStorage` when offline. Fixes for RWD.
-   0.4: Added new page to load when browser is offline.
-   0.3.3: Added several comments, added a few icons, added "Snowing" logic, styled `<select>`.
-   0.3.2: Changed backgrounds, added wind & sunrise/sunset while hovering over temperature.
-   0.3.1: Added new city - Tarnów.
-   0.3: Added new icons, changed backgrounds, polished code, added (MVP) city selector.
-   0.2: Added early code for winter.
-   0.1: Initial release.

## Versioning

Using [SemVer](http://semver.org/).

## License

GNU General Public License v3.0, see [LICENSE.md](https://github.com/vardecab/umbrella/blob/master/LICENSE).

## Acknowledgements

-   APIs: [OpenWeatherMap](https://openweathermap.org/api) & [Airly](https://developer.airly.eu/api) & [AQICN](https://aqicn.org/api/) & [LocationIQ](https://locationiq.com)
-   [Aktualna prognoza pylenia Claritine](https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/)
-   [Main tutorial that inspired me](https://bytemaster.io/fetch-weather-openweathermap-api-javascript)
-   [Moment.js](https://momentjs.com)
-   [JavaScript Cookie](https://github.com/js-cookie/js-cookie)
-   [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
-   Tools used for creating backgrounds: [ColorHexa](https://www.colorhexa.com) & [CSS Gradient](https://cssgradient.io)
-   RWD layout based on [Skeleton](http://getskeleton.com)
-   [Navbar tutorial](https://www.w3schools.com/howto/howto_js_bottom_nav_responsive.asp)
-   [Full background cover tutorial](https://css-tricks.com/perfect-full-page-background-image)
-   Icons from [Flaticon](https://www.flaticon.com)
-   Fonts used: [Mali](https://fonts.google.com/specimen/Mali) & [Reem Kufi](https://fonts.google.com/specimen/Reem+Kufi)
