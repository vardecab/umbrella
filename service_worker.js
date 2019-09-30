self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('airhorner').then(function (cache) {
            return cache.addAll([
                '/',
                'cities/wroclaw.html',
                'styles/styles.css',
                'offline.html',
                'scripts/script.js',
                'images/'
                // 'images/umbrella.png',
                // 'images/no-connection.svg'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log(event.request.url);

    // OFFLINE_URL = 'offline.html';

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
            // return response || fetch(OFFLINE_URL);
            // window.location = "offline.html";
        })
    );
});