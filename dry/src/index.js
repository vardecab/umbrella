/* =========================================================================
 * dry — "can I hang the laundry outside right now?" in one colour.
 *
 * A tiny spin-off of the umbrella weather app (github.com/vardecab/umbrella).
 * It takes the drying model from umbrella's weather.js and renders nothing but
 * a solid full-screen colour:
 *
 *   🟩 green   — hang it outside, it'll dry
 *   🟨 amber   — outside works but slowly
 *   🟥 red      — dry it inside (too humid / raining / too cold)
 *
 * Location, in order of precedence:
 *   1. ?lat=..&lon=..           one-off override
 *   2. `dry_loc` cookie          set by the 📍 GPS button, remembered ~6 months
 *   3. Cloudflare edge geo       request.cf.latitude / longitude
 *   4. Wrocław                   fallback
 * `?auto=1` clears the saved GPS location.
 *
 * Forecast is OpenWeatherMap's free 5-day/3-hour endpoint; we only look at the
 * next 3-hour slot.
 * ========================================================================= */

const FALLBACK = { lat: 51.11, lon: 17.03, label: "Wrocław" }; // umbrella's home city
const COOKIE = "dry_loc";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 182; // ~6 months

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const cf = request.cf || {};

		// clear a saved GPS location
		if (url.searchParams.has("auto")) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: url.pathname,
					"Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`,
				},
			});
		}

		// resolve location
		const q = url.searchParams;
		const cookie = readCookie(request, COOKIE);
		let lat, lon, place, source;
		if (isNum(q.get("lat")) && isNum(q.get("lon"))) {
			lat = q.get("lat");
			lon = q.get("lon");
			source = "query";
		} else if (cookie && /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(cookie)) {
			[lat, lon] = cookie.split(",");
			source = "gps";
		} else if (isNum(cf.latitude) && isNum(cf.longitude)) {
			lat = cf.latitude;
			lon = cf.longitude;
			place = cf.city || null;
			source = "edge";
		} else {
			lat = FALLBACK.lat;
			lon = FALLBACK.lon;
			place = FALLBACK.label;
			source = "fallback";
		}

		let model;
		try {
			model = await computeDrying(lat, lon, env.OWM_API_KEY);
		} catch (err) {
			return htmlResponse(
				renderError(String((err && err.message) || err)),
				STATES.error,
				60
			);
		}

		const state = STATES[model.verdict];
		return htmlResponse(renderPage(model, state, { place, source }), state, 300);
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
		lat: round4(lat),
		lon: round4(lon),
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
	out: { bg: "#33c06f", fg: "#08381f", pill: "rgba(8,56,31,.14)", emoji: "🧺", title: "Susz na dworze", sub: "wyschnie bez problemu" },
	slow: { bg: "#f0b429", fg: "#452f00", pill: "rgba(69,47,0,.14)", emoji: "🧺", title: "Dwór, ale wolniej", sub: "wyschnie, tylko dłużej" },
	in: { bg: "#e5484d", fg: "#4d0d0f", pill: "rgba(77,13,15,.16)", emoji: "🧺", title: "Susz w domu", sub: "na zewnątrz nie wyschnie" },
	error: { bg: "#8b9096", fg: "#1f2328", pill: "rgba(31,35,40,.16)", emoji: "🤷", title: "Brak danych", sub: "" },
};

function htmlResponse(body, state, maxAge) {
	return new Response(shell(body, state, maxAge), {
		headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": `private, max-age=${maxAge}`,
			vary: "Cookie",
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
	html, body { margin: 0; background: ${state.bg}; }
	body {
		min-height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		padding:
			calc(env(safe-area-inset-top) + 2rem)
			calc(env(safe-area-inset-right) + 1.5rem)
			calc(env(safe-area-inset-bottom) + 2rem)
			calc(env(safe-area-inset-left) + 1.5rem);
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		color: ${state.fg};
		text-align: center;
		-webkit-font-smoothing: antialiased;
	}
	.emoji { font-size: clamp(3.5rem, 22vw, 7rem); line-height: 1; }
	.title { font-size: clamp(1.4rem, 7vw, 2.2rem); font-weight: 700; letter-spacing: -0.01em; }
	.sub { font-size: clamp(0.9rem, 4vw, 1.1rem); opacity: 0.72; }
	.meta {
		margin-top: 1.3rem;
		font-size: 0.82rem;
		opacity: 0.62;
		font-variant-numeric: tabular-nums;
		line-height: 1.7;
	}
	.meta b { font-weight: 600; }
	.meta a { color: inherit; }

	/* GPS button */
	#gps {
		position: fixed;
		right: calc(env(safe-area-inset-right) + 1rem);
		bottom: calc(env(safe-area-inset-bottom) + 1rem);
		width: 3rem;
		height: 3rem;
		border: 0;
		border-radius: 50%;
		background: ${state.pill};
		color: ${state.fg};
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		-webkit-tap-highlight-color: transparent;
		transition: transform .1s ease;
	}
	#gps:active { transform: scale(0.9); }
	#gps[disabled] { opacity: 0.6; cursor: default; }
</style>
</head>
<body>
${body}
<button id="gps" type="button" aria-label="Użyj mojej lokalizacji GPS" title="Moja lokalizacja (GPS)">📍</button>
<script>
(function () {
	var b = document.getElementById("gps");
	b.addEventListener("click", function () {
		if (!navigator.geolocation) { flash("🚫"); return; }
		b.disabled = true; b.textContent = "…";
		navigator.geolocation.getCurrentPosition(
			function (p) {
				var lat = p.coords.latitude.toFixed(4), lon = p.coords.longitude.toFixed(4);
				document.cookie = "${COOKIE}=" + lat + "," + lon +
					";path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax";
				location.assign(location.pathname); // drop any ?lat override, let the cookie drive
			},
			function () { b.disabled = false; flash("🚫"); },
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
		);
	});
	function flash(t) { b.textContent = t; setTimeout(function () { b.textContent = "📍"; }, 2000); }
})();
</script>
</body>
</html>`;
}

function renderPage(m, state, loc) {
	const bits = [
		`wilgotność <b>${m.humidity}%</b>`,
		`wiatr <b>${m.wind} km/h</b>`,
		`zachmurzenie <b>${m.clouds}%</b>`,
		`odczuwalna <b>${m.temp}°</b>`,
	];
	const guard =
		m.rain === 2 ? " · 🌧️ deszcz" : m.rain === 1 ? " · 💧 możliwa mżawka" : "";

	let where;
	if (loc.source === "gps") where = `📍 ${m.lat}, ${m.lon} · <a href="?auto=1">auto</a>`;
	else if (loc.source === "query") where = `${m.lat}, ${m.lon}`;
	else if (loc.place) where = escapeHtml(loc.place);
	else where = "";

	return `	<div class="emoji">${state.emoji}</div>
	<div class="title">${state.title}</div>
	<div class="sub">${state.sub}</div>
	<div class="meta">
		efektywna wilgotność <b>${m.effectiveRh}%</b>${guard}<br>
		${bits.join(" · ")}${where ? `<br>${where}` : ""}
	</div>`;
}

function renderError(message) {
	return `	<div class="emoji">🤷</div>
	<div class="title">Brak danych pogodowych</div>
	<div class="sub">${escapeHtml(message)}</div>`;
}

/* --------------------------------- helpers -------------------------------- */

function isNum(v) {
	return v !== null && v !== undefined && v !== "" && isFinite(Number(v));
}

function round4(v) {
	return Math.round(Number(v) * 1e4) / 1e4;
}

function readCookie(request, name) {
	const raw = request.headers.get("Cookie") || "";
	const m = raw.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
	return m ? decodeURIComponent(m[1]) : null;
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
