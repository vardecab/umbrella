# Umbrella

![Actively Maintained](https://img.shields.io/badge/Maintenance%20Level-Actively%20Maintained-green.svg)
<br>
![](https://img.shields.io/uptimerobot/status/m788095876-34537beb719d60f13baeea7b)
![](https://img.shields.io/uptimerobot/ratio/m788095876-34537beb719d60f13baeea7b)
<br>
![](https://img.shields.io/badge/browser-Chromium%20%7C%20Firefox%20%7C%20Safari-blue)

> A simple [weather app](https://vardecab.github.io/umbrella/umbrella.html) that tells you if you need to take an umbrella when going outside ☔ + it shows air quality and allergy information for supported regions. _Currently only in Polish_.

<img src="https://vardecab.github.io/umbrella/images/social-sharing/umbrella-facebook-ogimage-v2.png">

It _doesn't_ show current weather outside - you can check it yourself by looking out through a window 🙃 Umbrella will tell you the future 🔮.

And it's kinda quick at that: [Pingdom report](https://tools.pingdom.com/#5bef88ed9f800000), [GTmetrix report](https://gtmetrix.com/reports/vardecab.github.io/snSxSCDL).

## Screenshots

<!-- <img src="https://s5.gifyu.com/images/umbrella.gif" height="400"/> -->
<img src="https://i.ibb.co/X4CHyH4/umbrella.png"/>

<!-- ![](https://i.ibb.co/Sr8H4Wv/Screenshot-20191208-143750-Brave-COLLAGE.jpg)
![](https://s5.gifyu.com/images/Screenshot_20191208-143750_Brave-ANIMATION.gif) -->

## How to use

Click [here](https://vardecab.github.io/umbrella/umbrella.html). For now it shows temperature, air pressure, wind speed, sunrise & sunset, what to wear, air quality. Location is saved in the 🍪s for 30 days. If you want to change the location, click on 🌍. If you want to geolocate yourself (GPS/IP), click on 📍.

## Roadmap

-   Autocomplete location name (+ maybe a search bar).
-   More elegant way to ask for location.
-   <del>_Geolocation._</del>
-   <del>_Be able to use any city - not only those predefined._</del>

## Release History

- 0.47: Disabled `UVI` and `dew point` information due to API problems.
- 0.46: Disabled `pollen` information because API died.
- 0.45: Added a local notification if there is pollen in the region; fixed LocationIQ API key so the whole thing can continue to work.
- 0.44: Changed emojis for sunrise & sunset.
- 0.43.1: New library used for displaying Windows notifications.
- 0.43: Added `Wybrzeże` to allergens/pollen logic.
- 0.42: Click to see more temperature details without element hiding.
- 0.41.1: Fixed margins in some edge cases; changes to rain related stuff.
- 0.41: Fixed geolocation issues.
- 0.40.1: Fixed a HTTP/HTTPS mismatch in `TimeZoneDB` URL; fixed a comment that appeared publicly but shouldn't.
- 0.40: Changed how sunrise and sunset times are displayed — now in location time regardless of user's local time.
- 0.39: Added rain description; changed how emojis in conditions' description are displayed.
- 0.38.3: Extended UVI range when notification is displayed.
- 0.38.2: Updated "rain window" from 6 to 3 hours.
- 0.38.1: Updated `moment.js` to fix lib's vulnerability.
- 0.38: Re-wrote `PollenInfoAutoUpdate` Python scraper a bit: more functions to avoid repeated code, icons are now locally stored, more notifications added to show potential errors preventing script to complete.
- 0.37: Previously air quality data from AQICN API was displayed in `AQI` unit rather than in `μg` — big bug that's now fixed.
- 0.36.1: Cleaned some comments.
- 0.36: Extended air quality forecasts to 18 hours with Airly API; added fallback air quality forecast API; tweaked how location is displayed; fixed a bug when PM2.5 or PM10 was unavailable in AQICN API.
- 0.35: Changed how location is displayed - more bulletproof.
- 0.34.1: Tiny fix to how air quality details are displayed.
- 0.34: Fixed logs; fixed how some text is displayed; added air quality forecasts - 6 & 12 hours.
- 0.33: Changed displayed allergy information to be based on voivodeship rather than city (supports MZ, DS, MP for now); added `Day.js` library to manipulate time and date. 
- 0.32: Showing city name instead of street name; changed unit for air quality data; improved logs and comments; started working on air quality forecasts.
- 0.31.1: Improved RWD in one specific case.
- 0.31: Fixed a bug where an incorrect air quality value was shown before the target air quality value was shown.
- 0.30.6: Improved RWD in one specific case.
- 0.30.5: Improved RWD in one specific case.
- 0.30.4: Tiny UX tweak to dew point; changed "auto-refresh" from 30 to 15 mins.
- 0.30.3: Changed "auto-refresh" from 60 to 30 mins.
- 0.30.2: Tiny text tweak.
- 0.30.1: Fixed a tiny bug where `UVI == 0` wasn't handled. 
- 0.30: Added dew point temperature to see if it's muddy or not (based on [NWS: Dew Point vs Humidity](https://www.weather.gov/arx/why_dewpoint_vs_humidity)); cleaned up some code; added some comments.

<details>

<summary>
Click to see all updates < 0.30
</summary>

- 0.29: Added UV index info with notifications when UVI means high risk of harm from unprotected sun exposure.
- 0.28.1: Log `autoRefreshLastUpdate`.
- 0.28: Auto-refresh every 1 hour to load a new forecast.
- 0.27: Re-enabled macOS notification and added Windows 10 notification when `PollenInfoAutoUpdate` is complete.
- 0.26.3: Disabled macOS notification added in 0.24.
- 0.26.2: Removed sound from macOS notification when allergens/pollen info is updated.
- 0.26.1: Added a 500 ms delay so air quality info is not being shown with the loading screen but after; increased the delay from 1500 ms → 2000 ms for allergens/pollen info; tweaked notifications so they won't be closed without user's interaction. 
- 0.26: Added browser notification feature when air quality is bad. `alert()` being used when notifications are not supported / blocked.
- 0.25: Added dawn & dusk times; renamed files so it's easier to understand what's happening where. moved some functions around.
- 0.24.3: Fixed "Die Null" bug. 
- 0.24.2: Fixed `TypeError` from _0.24.1_.
- 0.24.1: Fixed a bug causing no allergens/pollen info updates.
- 0.24: Added macOS notification to show when the update was ran.
- 0.23.2: Tiny change to `theme-color` for purple background.
- 0.23.1: Removed allergens/pollen date range info until a fix for APIv2 is in place.
- 0.23: Added a function & `try-except` to allergens/pollen script.
- 0.22: Re-added information on allergens/pollen - using a different website now.
- 0.21.3: Information on allergens/pollen has been disabled due to backend change on the site from which the data was collected.
- 0.21.2: Fixed spacing between items in `more_details` section.
- 0.21.1: Fixed font not working due to minification problem.
- 0.21: Added an emoji distinction of wind strength + improved RWD in one specific case.
- 0.20.2: Small fix to show pollen info for both `Wroclaw` & `Wrocław`. Changed text when geolocating.
- 0.20.1: Small fix to `air_quality.js`.
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

</details>

<br>

## Versioning

Using [SemVer](http://semver.org/).

## License

![](https://img.shields.io/github/license/vardecab/umbrella)
<!-- GNU General Public License v3.0, see [LICENSE.md](https://github.com/vardecab/umbrella/blob/master/LICENSE). -->

## Acknowledgements
### APIs

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Airly API](https://developer.airly.eu/api)
- [AQICN API](https://aqicn.org/api/)
- [LocationIQ API](https://locationiq.com)
- [Sunrise Sunset API](https://sunrise-sunset.org/api)
- [Aktualna prognoza pylenia](http://pylenia.pl/)

<details>

<summary>
Other
</summary>

-   [Main tutorial that inspired me](https://bytemaster.io/fetch-weather-openweathermap-api-javascript)
-   [Moment.js](https://momentjs.com)
-   [JavaScript Cookie](https://github.com/js-cookie/js-cookie)
-   [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
-   Tools used for creating backgrounds: [ColorHexa](https://www.colorhexa.com) & [CSS Gradient](https://cssgradient.io)
-   RWD layout based on [Skeleton](http://getskeleton.com)
-   [Navbar tutorial](https://www.w3schools.com/howto/howto_js_bottom_nav_responsive.asp)
-   [Full background cover tutorial](https://css-tricks.com/perfect-full-page-background-image)
-   Icons from [Flaticon](https://www.flaticon.com)
-   Font used: [Mali](https://fonts.google.com/specimen/Mali)
- [Wind strength scale](https://www.bip.krakow.pl/plik.php?zid=80905&wer=0&new=t&mode=shw)
- [Day.js](https://day.js.org/en/)
- [AQI Calculator](https://www.airnow.gov/aqi/aqi-calculator/)
- SVG to PNG converter: [Aconvert](https://www.aconvert.com/image/png-to-svg/)

</details>

<br>

## Contributing

![](https://img.shields.io/github/issues/vardecab/umbrella)

If you found a bug or want to propose a feature, feel free to visit [the Issues page](https://github.com/vardecab/umbrella/issues).
