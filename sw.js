var CACHE_NAME = 'G-aboet-v1';
var urlsToCache = [
    '/',
    '/font-awesome/fonts/FontAwesome.otf',
    '/font-awesome/fonts/fontawesome-webfont.eot',
    '/font-awesome/fonts/fontawesome-webfont.svg',
    '/font-awesome/fonts/fontawesome-webfont.ttf',
    '/font-awesome/fonts/fontawesome-webfont.woff',
    '/font-awesome/fonts/fontawesome-webfont.woff2',
    '/css/materialize.min.css',
    '/font-awesome/css/font-awesome.css',
    '/font-awesome/css/font-awesome.min.css',
    '/img/ancha.png',
    '/img/icon1.png',
    '/img/icon2.png',
    '/img/p1.png',
    '/img/rafli.png',
    '/img/sayang.png',
    '/img/zikri.jpg',
    '/css/custom.css',
    '/js/main.js',
    '/js/materialize.js',
    '/js/materialize.min.js',
    '/js/nav.js',
    '/pages/about.html',
    '/pages/career.html',
    '/pages/contact.html',
    '/pages/home.html',
    '/manifest.json',
    '/nav.html',
    '/index.html'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function(response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});

self.addEventListener('activate', function(event) {

    var cacheWhitelist = CACHE_NAME;
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});