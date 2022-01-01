// Cache Name
var cacheName = "cardComponent"
    // The filles will be Cached
var filesToCache = [
    "index.html",
    "sw.js",
    "css/main.css",
    "css/normalize.css",
    "css/media.css",
    "images/favicon-32x32.png",
    "images/image-header-desktop.jpg"
]

// Install [Service Worker]
self.addEventListener("install", function(e) {
    console.log("[Service Worker] Install")
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("[Service Worker] Caching app shell")
            return cache.addAll(filesToCache)
        })
    )
})

// To Remove Old Cache
self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key != cacheName) {
                    console.log("[Service Worker Remove Old Cache]", key)
                    return caches.delete(key)
                }
            }))
        })
    )
})

//To fetch Data from Cache then Network
self.addEventListener('fetch', (e) => {
    e.respondWith((async() => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
            return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName)
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
})