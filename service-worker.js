const CACHE_NAME = "video-scroll-cache-v1";
const assetsToCache = [
    "index.html",
    "style.css",
    "script.js",
    "manifest.json",
    "logo-192.png",
    "logo-512.png"
];

// Install Service Worker dan cache file
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assetsToCache);
        })
    );
});

// Aktifkan Service Worker dan hapus cache lama jika ada
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch data dari cache atau jaringan jika offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
