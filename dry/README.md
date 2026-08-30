# dry

> Can I hang the laundry outside right now? Answered in one colour.

A tiny Cloudflare Worker spun out of [umbrella](https://github.com/vardecab/umbrella). It
reuses umbrella's drying model (`weather.js`) and renders **nothing but a full-screen colour**:

| Colour | Meaning |
| --- | --- |
| 🟩 green | hang it outside — it'll dry |
| 🟨 amber | outside works, but slowly |
| 🟥 red | dry it inside (too humid, raining, or too cold) |

## How it decides

Looks at the **next 3-hour forecast slot** only (OpenWeatherMap 5-day/3-hour):

```
effective_RH = humidity − wind_bonus − sun_bonus (+ drizzle penalty)   (min 5%)
```

- **wind_bonus**: 0 / 6 / 12 / 16 / 18 RH points by Beaufort band (capped — strong wind blows clothes off the line)
- **sun_bonus**: 9 / 5 / 2 / 0 by cloud cover, and 0 at night (uses the forecast's sunrise/sunset)
- **rain**: `pop` + mm — real rain forces red, a drizzle risk just adds 12 points
- **cold**: feels-like < 3 °C → amber ("evaporation stalls")

Then: `≤ 50 → green`, `≤ 60 → amber`, else `red`.

## Location

In order of precedence:

1. `?lat=..&lon=..` — one-off override
2. `dry_loc` cookie — set by the **📍 GPS button** (bottom-right), remembered ~6 months
3. Cloudflare edge geolocation (`request.cf`)
4. Wrocław — fallback

The 📍 button asks the browser for GPS, writes the cookie, and reloads. `?auto=1`
clears the saved location and goes back to edge geo.

## Look

Solid full-screen colour + a small breakdown table (each metric, its value, and a
plain-language line on why it helps or hurts, ending with the `effective humidity`
arithmetic). `theme-color` + `viewport-fit=cover` make the iOS status-bar and
home-indicator areas the same solid colour.

## Develop / deploy

```bash
npm install
npm run dev      # http://localhost:8787  (add ?lat=..&lon=.. — request.cf is empty locally)
npm run deploy
```

The OpenWeatherMap key lives in `wrangler.jsonc` `vars` (it's already public in the umbrella
repo). Move it to `wrangler secret put OWM_API_KEY` if you ever rotate it.
