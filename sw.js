var CACHE = 'flashcards-v12';
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
  './log.js',
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
// Audio files are NOT in this list on purpose: cache.addAll() below is
// atomic, and MP3s aren't in git (see audio/ header comment), so requiring
// them at install time would break the install for anyone without them.
// They're cached opportunistically on first successful play instead --
// see the fetch handler.

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
  var isAudio = e.request.url.indexOf('/audio/') !== -1;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (isAudio && response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, copy); });
        }
        return response;
      });
    })
  );
});
