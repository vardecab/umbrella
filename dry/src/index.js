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

		const tz = cf.timezone || "Europe/Warsaw";
		let updated;
		try {
			updated = new Intl.DateTimeFormat("pl-PL", {
				timeZone: tz,
				hour: "2-digit",
				minute: "2-digit",
			}).format(new Date());
		} catch (_) {
			updated = new Date().toISOString().slice(11, 16) + " UTC";
		}

		const state = STATES[model.verdict];
		return htmlResponse(renderPage(model, state, { place, source, updated }), state, 300);
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

	const isDay = !!(
		city.sunrise &&
		city.sunset &&
		slot.dt >= city.sunrise &&
		slot.dt <= city.sunset
	);
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
		isDay,
		sunBonus,
		windBonus,
		rain,
		rainPenalty,
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

// palette: "Sorbet" — the brightest of the candidates, readable at arm's length
// emoji: 🍃 = hang it outside, 🏠 = dry it indoors
const STATES = {
	out: { bg: "#a7e8c4", fg: "#17513a", emoji: "🍃", title: "Susz na zewnątrz", sub: "wyschnie bez problemu" },
	slow: { bg: "#ffe9a8", fg: "#6a5108", emoji: "🍃", title: "Na zewnątrz, ale wolniej", sub: "wyschnie, tylko dłużej" },
	in: { bg: "#ffc2bd", fg: "#7a352f", emoji: "🏠", title: "Susz w domu", sub: "na zewnątrz nie wyschnie" },
	error: { bg: "#dde3e6", fg: "#3c4247", emoji: "🤷", title: "Brak danych", sub: "" },
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
		padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		color: ${state.fg};
		-webkit-font-smoothing: antialiased;
	}
	main {
		margin: auto; /* centres when it fits, scrolls from the top when it doesn't */
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		max-width: 34rem;
		padding: 2rem 1.25rem 5.5rem; /* bottom room so the GPS button clears the table */
		box-sizing: border-box;
		text-align: center;
	}
	.emoji {
		font-size: clamp(3.25rem, 20vw, 6rem);
		line-height: 1;
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		transition: transform .1s ease;
	}
	.emoji:active { transform: scale(0.92); }
	.title { font-size: clamp(1.35rem, 6.5vw, 2rem); font-weight: 700; letter-spacing: -0.01em; }
	.sub { font-size: clamp(0.9rem, 4vw, 1.05rem); opacity: 0.72; }

	#panel[hidden] { display: none; }
	#panel { width: 100%; }

	.tbl {
		margin-top: 1.5rem;
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
		line-height: 1.4;
	}
	.tbl caption {
		text-align: left;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		opacity: 0.5;
		padding-bottom: 0.35rem;
	}
	.tbl td {
		padding: 0.5rem 0.5rem;
		border-top: 1px solid rgba(0, 0, 0, 0.13);
		vertical-align: top;
		text-align: left;
	}
	.tbl td.m { font-weight: 700; white-space: nowrap; }
	.tbl td.v { font-variant-numeric: tabular-nums; white-space: nowrap; }
	.tbl td.w { opacity: 0.82; }
	.tbl tr.sum td { border-top: 2px solid rgba(0, 0, 0, 0.32); font-weight: 700; }
	.tbl tr.sum td.w { opacity: 1; font-weight: 600; }
	.tbl tr.upd td { opacity: 0.6; font-size: 0.78rem; }
	.tbl tr.upd td.m { font-weight: 600; }

	.loc { margin-top: 1.1rem; font-size: 0.78rem; opacity: 0.55; }
	.loc a { color: inherit; }

	/* location button — pin only, centered at the bottom */
	#gps {
		position: fixed;
		left: 50%;
		bottom: calc(env(safe-area-inset-bottom) + 1rem);
		transform: translateX(-50%);
		width: 3rem;
		height: 3rem;
		border: 0;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.1);
		color: ${state.fg};
		font-size: 1.35rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		-webkit-tap-highlight-color: transparent;
		transition: transform .1s ease;
	}
	#gps:active { transform: translateX(-50%) scale(0.92); }
	#gps[disabled] { opacity: 0.55; cursor: default; }
</style>
</head>
<body>
<main>
${body}
</main>
<button id="gps" type="button" aria-label="Użyj mojej lokalizacji GPS" title="Moja lokalizacja">📍</button>
<script>
(function () {
	// tap the laundry icon to show / hide the breakdown
	var icon = document.getElementById("toggle");
	var panel = document.getElementById("panel");
	if (icon && panel) {
		var flip = function () { panel.hidden = !panel.hidden; icon.setAttribute("aria-expanded", String(!panel.hidden)); };
		icon.addEventListener("click", flip);
		icon.addEventListener("keydown", function (e) {
			if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
		});
	}

	// location button
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
	const rows = [
		humidityRow(m.humidity),
		windRow(m.wind, m.windBonus),
		sunRow(m.clouds, m.sunBonus, m.isDay),
		tempRow(m.temp),
		rainRow(m.rain, m.rainPenalty),
	];

	const sumWhy =
		`${m.humidity} − ${m.windBonus} (wiatr) − ${m.sunBonus} (słońce)` +
		(m.rainPenalty ? ` + ${m.rainPenalty} (mżawka)` : "") +
		` = ${m.effectiveRh}% &nbsp;·&nbsp; ≤50 na zewnątrz · ≤60 wolniej · &gt;60 w domu`;

	const body = rows
		.map(([metric, value, why]) =>
			`<tr><td class="m">${metric}</td><td class="v">${value}</td><td class="w">${why}</td></tr>`
		)
		.join("\n\t\t\t");

	let where = "";
	if (loc.source === "gps") where = `📍 własna lokalizacja &nbsp;·&nbsp; <a href="?auto=1">auto</a>`;
	else if (loc.source === "edge" && loc.place) where = escapeHtml(loc.place);
	else if (loc.source === "fallback") where = escapeHtml(FALLBACK.label);

	return `	<div class="emoji" id="toggle" role="button" tabindex="0" aria-expanded="false" aria-controls="panel" title="Pokaż / ukryj szczegóły">${state.emoji}</div>
	<div class="title">${state.title}</div>
	<div class="sub">${state.sub}</div>
	<div id="panel" hidden>
		<table class="tbl">
			<caption>co się składa na wynik</caption>
			<tbody>
				${body}
				<tr class="sum"><td class="m">Efektywnie</td><td class="v">${m.effectiveRh}%</td><td class="w">${sumWhy}</td></tr>
				<tr class="upd"><td class="m">Aktualizacja</td><td class="v">${loc.updated}</td><td class="w">odświeża się automatycznie co ~5 min</td></tr>
			</tbody>
		</table>
		${where ? `<div class="loc">${where}</div>` : ""}
	</div>`;
}

// each row: [metric, value, why-it-helps-or-hurts]
function humidityRow(h) {
	let why;
	if (h <= 40) why = "🟩 sucho — powietrze łatwo chłonie wilgoć z prania";
	else if (h <= 55) why = "🟩 w normie — pranie wyschnie";
	else if (h <= 70) why = "🟨 wysoko — powietrze wolno przyjmuje wilgoć";
	else why = "🟥 bardzo wysoko — powietrze jest niemal nasycone, pranie nie schnie";
	return ["Wilgotność", `${h}%`, why];
}

function windRow(w, bonus) {
	let why;
	if (bonus === 0) why = "🟨 cisza — nie zdmuchuje wilgotnego powietrza znad prania";
	else if (w <= 19) why = `🟩 lekki — odsuwa wilgotne powietrze od tkaniny (−${bonus})`;
	else if (w <= 29) why = `🟩 umiarkowany — najlepszy do schnięcia (−${bonus})`;
	else if (w <= 39) why = `🟩 świeży — schnie szybko, dobrze przypnij pranie (−${bonus})`;
	else if (w <= 50) why = `🟨 silny — schnie szybko, ale może zrywać pranie (−${bonus})`;
	else why = `🟥 wichura — pranie poleci ze sznurka (−${bonus})`;
	return ["Wiatr", `${w} km/h`, why];
}

function sunRow(clouds, bonus, isDay) {
	if (!isDay) return ["Słońce", "noc", "🌙 po zmroku słońce nie dosusza; może osiadać rosa"];
	let why;
	if (clouds < 20) why = `☀️ pełne słońce — nagrzewa mokrą tkaninę, parowanie rośnie (−${bonus})`;
	else if (clouds < 50) why = `🌤️ sporo słońca — trochę dogrzewa pranie (−${bonus})`;
	else if (clouds < 80) why = `⛅ przeważnie pochmurno — słońce pomaga minimalnie (−${bonus})`;
	else why = "☁️ całkowite zachmurzenie — brak dosuszania słońcem";
	return ["Słońce", `${clouds}% chmur`, why];
}

function tempRow(t) {
	let why;
	if (t < 3) why = "🥶 mróz — parowanie prawie ustaje (wymusza suszenie w domu)";
	else if (t < 10) why = "🟨 chłodno — pranie schnie powoli";
	else if (t < 18) why = "🟩 w porządku dla schnięcia";
	else why = "🟩 ciepło — sprzyja parowaniu";
	return ["Temperatura", `${t}°`, why];
}

function rainRow(level, penalty) {
	if (level === 2) return ["Deszcz", "opady", "🟥 pada — pranie zmoknie (wymusza suszenie w domu)"];
	if (level === 1) return ["Deszcz", "mżawka?", `🟨 możliwa mżawka — doliczany zapas do wilgotności (+${penalty})`];
	return ["Deszcz", "brak", "🟩 bez opadów w najbliższych godzinach"];
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
