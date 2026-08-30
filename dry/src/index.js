/* =========================================================================
 * dry — "can I hang the laundry outside right now?" in one colour.
 *
 * A tiny spin-off of the umbrella weather app (github.com/vardecab/umbrella).
 * It takes the drying model from umbrella's weather.js and renders nothing but
 * a full-screen colour:
 *
 *   🟩 green   — hang it outside, it'll dry
 *   🟨 amber   — outside works but slowly
 *   🟥 red      — dry it inside (too humid / raining / too cold)
 *
 * Location comes from Cloudflare's edge geolocation (request.cf); override with
 * ?lat=..&lon=.. . Forecast is OpenWeatherMap's free 5-day/3-hour endpoint and
 * we only look at the next 3-hour slot.
 * ========================================================================= */

const FALLBACK = { lat: 51.11, lon: 17.03, label: "Wrocław" }; // umbrella's home city

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const cf = request.cf || {};

		let lat = url.searchParams.get("lat") || cf.latitude || FALLBACK.lat;
		let lon = url.searchParams.get("lon") || cf.longitude || FALLBACK.lon;
		let place = url.searchParams.get("lat") ? null : (cf.city || null);

		let model;
		try {
			model = await computeDrying(lat, lon, env.OWM_API_KEY);
		} catch (err) {
			return htmlResponse(renderError(String(err && err.message || err)), STATES.error, 60);
		}

		const state = STATES[model.verdict];
		return htmlResponse(renderPage(model, state, place), state, 600);
	},
};

/* ---------------------------------- model --------------------------------- */

async function computeDrying(lat, lon, key) {
	if (!key) throw new Error("OWM_API_KEY is not set");

	const api =
		"https://api.openweathermap.org/data/2.5/forecast" +
		`?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}` +
		`&appid=${key}&units=metric&cnt=1`;

	// cache the upstream forecast at the edge for 10 minutes
	const resp = await fetch(api, { cf: { cacheTtl: 600, cacheEverything: true } });
	if (!resp.ok) throw new Error(`OpenWeatherMap ${resp.status}`);
	const data = await resp.json();
	if (!data.list || !data.list.length) throw new Error("no forecast data");

	const slot = data.list[0]; // the next 3-hour block — "the first hours from now"
	const city = data.city || {};

	const humidity = Math.round(slot.main.humidity); // % RH
	const wind = Math.round((slot.wind?.speed || 0) * 3.6); // m/s -> km/h
	const temp = Math.round(slot.main.feels_like); // °C feels-like
	const clouds = Math.round(slot.clouds?.all ?? 100); // % cloud cover

	const sunBonus = sunBonusFor(slot, city); // RH points the sky is worth
	const rain = rainLevel(slot); //  0 none · 1 drizzle risk · 2 real rain
	const rainPenalty = rain === 1 ? 12 : 0;

	// wind lowers the "effective" humidity; benefit flattens out and is capped
	let windBonus;
	if (wind < 6) windBonus = 0;
	else if (wind <= 19) windBonus = 6;
	else if (wind <= 29) windBonus = 12;
	else if (wind <= 39) windBonus = 16;
	else if (wind <= 50) windBonus = 18;
	else windBonus = 16;

	const effectiveRh = Math.max(5, humidity - windBonus - sunBonus + rainPenalty);

	let verdict;
	if (rain === 2) verdict = "in"; // wet from above beats any drying
	else if (temp < 3) verdict = "slow"; // near-freezing: evaporation stalls
	else if (effectiveRh <= 50) verdict = "out";
	else if (effectiveRh <= 60) verdict = "slow";
	else verdict = "in";

	return {
		verdict,
		effectiveRh,
		humidity,
		wind,
		temp,
		clouds,
		sunBonus,
		windBonus,
		rain,
		when: slot.dt_txt,
	};
}

// how many RH points a daylight slot's sky is worth (0 at night — no sun help after dark)
function sunBonusFor(slot, city) {
	const isDay =
		city.sunrise && city.sunset && slot.dt >= city.sunrise && slot.dt <= city.sunset;
	if (!isDay) return 0;
	const clouds = slot.clouds?.all ?? 100;
	if (clouds < 20) return 9; // sunny
	if (clouds < 50) return 5; // partly cloudy
	if (clouds < 80) return 2; // mostly cloudy
	return 0; // overcast
}

// rain guard — quantitative, not just the weather label
function rainLevel(slot) {
	const mm = (slot.rain?.["3h"] || 0) + (slot.snow?.["3h"] || 0); // mm over the 3-h slot
	const pop = slot.pop || 0; // probability of precipitation, 0..1
	if ((pop >= 0.5 && mm >= 0.5) || mm >= 1.5) return 2;
	if (mm >= 0.2 || pop >= 0.6) return 1;
	return 0;
}

/* ---------------------------------- view ---------------------------------- */

const STATES = {
	out: {
		key: "out",
		bg: "#3ddc84",
		bgGrad: "linear-gradient(160deg, #45e08d 0%, #2bbf6e 100%)",
		fg: "#0b3d22",
		emoji: "🧺",
		title: "Susz na dworze",
		sub: "wyschnie bez problemu",
	},
	slow: {
		key: "slow",
		bg: "#ffcf5c",
		bgGrad: "linear-gradient(160deg, #ffd873 0%, #f5b301 100%)",
		fg: "#4a3600",
		emoji: "🧺",
		title: "Dwór, ale wolniej",
		sub: "wyschnie, tylko dłużej",
	},
	in: {
		key: "in",
		bg: "#ff6b6b",
		bgGrad: "linear-gradient(160deg, #ff7a7a 0%, #e64545 100%)",
		fg: "#4d0f0f",
		emoji: "🧺",
		title: "Susz w domu",
		sub: "na zewnątrz nie wyschnie",
	},
	error: {
		key: "error",
		bg: "#9aa0a6",
		bgGrad: "linear-gradient(160deg, #a8adb3 0%, #868b91 100%)",
		fg: "#20242a",
		emoji: "🤷",
		title: "Brak danych",
		sub: "",
	},
};

function htmlResponse(body, state, maxAge) {
	const html = shell(body, state, maxAge);
	return new Response(html, {
		headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": `public, max-age=${maxAge}`,
		},
	});
}

function shell(body, state, maxAge) {
	return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="${state.bg}">
<meta name="description" content="Czy warto teraz suszyć pranie na zewnątrz? Jeden kolor: zielony = tak, żółty = wolno, czerwony = w domu.">
<title>dry</title>
<meta http-equiv="refresh" content="${Math.min(maxAge, 900)}">
<style>
	:root { color-scheme: light dark; }
	html, body {
		margin: 0;
		min-height: 100vh;
		background-color: ${state.bg};
		background-image: ${state.bgGrad};
	}
	body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: calc(env(safe-area-inset-top) + 2rem) 1.5rem calc(env(safe-area-inset-bottom) + 2rem);
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		color: ${state.fg};
		text-align: center;
		-webkit-font-smoothing: antialiased;
	}
	.emoji { font-size: clamp(3.5rem, 22vw, 7rem); line-height: 1; }
	.title { font-size: clamp(1.4rem, 7vw, 2.2rem); font-weight: 700; letter-spacing: -0.01em; }
	.sub { font-size: clamp(0.9rem, 4vw, 1.1rem); opacity: 0.75; }
	.meta {
		margin-top: 1.4rem;
		font-size: 0.85rem;
		opacity: 0.6;
		font-variant-numeric: tabular-nums;
		line-height: 1.7;
	}
	.meta b { font-weight: 600; }
	a { color: inherit; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function renderPage(m, state, place) {
	const bits = [];
	bits.push(`wilgotność <b>${m.humidity}%</b>`);
	bits.push(`wiatr <b>${m.wind} km/h</b>`);
	bits.push(`zachmurzenie <b>${m.clouds}%</b>`);
	bits.push(`odczuwalna <b>${m.temp}°</b>`);
	const guard =
		m.rain === 2 ? " · 🌧️ deszcz" : m.rain === 1 ? " · 💧 możliwa mżawka" : "";

	return `	<div class="emoji">${state.emoji}</div>
	<div class="title">${state.title}</div>
	<div class="sub">${state.sub}</div>
	<div class="meta">
		efektywna wilgotność <b>${m.effectiveRh}%</b>${guard}<br>
		${bits.join(" · ")}${place ? `<br>${escapeHtml(place)}` : ""}
	</div>`;
}

function renderError(message) {
	return `	<div class="emoji">🤷</div>
	<div class="title">Brak danych pogodowych</div>
	<div class="sub">${escapeHtml(message)}</div>`;
}

function escapeHtml(s) {
	return String(s).replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	}[c]));
}
