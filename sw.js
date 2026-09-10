var CACHE = 'flashcards-v10';
var FILES = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './words.js',
  './grammar.js',
  './scenarios.js',
  './exam.js',
  './calls.js',
  './plan.js',
  './tracks.js',
  './b1-plan.js',
  './b1-tracks.js',
  './b1-exam-data.js',
  './b1-words.js',
  './b1-grammar.js',
  './b1-scenes.js',
  './b1-calls.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) { return name !== CACHE; })
             .map(function(name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request);
    })
  );
});
