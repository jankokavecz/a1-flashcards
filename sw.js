// Service worker -- network-first for the app shell, cache-first for audio.
//
// Why network-first: the old cache-first handler served index.html and all
// JS from Cache Storage forever, so a deploy only reached the phone if sw.js
// itself changed (CACHE bump) AND the install's fetches bypassed the 10-min
// HTTP cache GitHub Pages sets. Network-first means: online -> you always get
// what is deployed (one conditional request per file, mostly 304s);
// offline / slow network (>3s) -> the last good copy from Cache Storage.
importScripts('./version.js');            // defines APP_VERSION
var SHELL_CACHE = 'deutsch-b1-shell-' + APP_VERSION;
var AUDIO_CACHE = 'deutsch-b1-audio';     // survives version bumps on purpose
var NETWORK_TIMEOUT_MS = 3000;
var SHELL = [
  './', './index.html', './styles.css', './version.js', './app.js', './words.js', './grammar.js',
  './scenarios.js', './exam.js', './calls.js', './plan.js', './tracks.js', './log.js',
  './b1-plan.js', './b1-tracks.js', './b1-exam-data.js', './b1-words.js', './b1-grammar.js',
  './b1-scenes.js', './b1-calls.js', './icon-192.png', './icon-512.png', './manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(SHELL_CACHE).then(function(cache) {
    // cache: 'reload' bypasses the browser HTTP cache (max-age=600 on GitHub
    // Pages) so a new version can never be precached with old bytes.
    return cache.addAll(SHELL.map(function(u) { return new Request(u, { cache: 'reload' }); }));
  }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(names) {
    return Promise.all(names.filter(function(n) {
      return n !== SHELL_CACHE && n !== AUDIO_CACHE;
    }).map(function(n) { return caches.delete(n); }));
  }).then(function() { return self.clients.claim(); }));
});

self.addEventListener('message', function(e) {
  if (e.data === 'version' && e.source) e.source.postMessage({ type: 'version', version: APP_VERSION });
});

function networkFirst(req) {
  var cacheKey = req.mode === 'navigate' ? './index.html' : req;
  var net = fetch(req, { cache: 'no-cache' }).then(function(resp) {
    if (resp && resp.ok && resp.status === 200) {
      var copy = resp.clone();
      caches.open(SHELL_CACHE).then(function(c) { return c.put(cacheKey, copy); }).catch(function() {});
    }
    return resp;
  });
  var offline = net.then(function() { return false; }, function() { return true; });
  var timeout = new Promise(function(resolve) { setTimeout(resolve, NETWORK_TIMEOUT_MS); });
  return Promise.race([net.catch(function() { return null; }), timeout.then(function() { return null; })])
    .then(function(resp) {
      if (resp) return resp;
      // Slow network: only an exact cached copy may stand in. Deployed pages
      // load 'app.js?v=<version>', so this never pairs files of two versions.
      return caches.match(cacheKey, { ignoreSearch: req.mode === 'navigate' }).then(function(exact) {
        if (exact) return exact;
        // No exact copy: wait for the network. Offline, any cached copy of the
        // path will do (the precache holds './app.js' without '?v=').
        return offline.then(function(isOffline) {
          if (!isOffline) return net;
          return caches.match(cacheKey, { ignoreSearch: true }).then(function(c) { return c || net; });
        });
      });
    });
}

// Audio: <audio> sends Range requests and GitHub Pages answers 206, which
// Cache Storage refuses to store. So fetch the WHOLE file once (no Range),
// keep the 200 in AUDIO_CACHE, and answer every Range request with a 206
// sliced from it (iOS Safari will not play media from a SW without 206s).
//
// A cached file is never revalidated, so a replaced MP3 gets a new URL
// instead: tracks.js adds ?v=N (TRACK_AUDIO_REV). The cache is keyed by the
// full URL, so a new revision misses, is fetched once, and once it is stored
// the older copies of the same file are deleted. Until then -- e.g. offline
// -- the older copy is played rather than nothing.
var audioPending = {};    // url -> the one in-flight download of that file

function audioDropOtherRevisions(cache, url) {
  var path = new URL(url).pathname;
  return cache.keys().then(function(reqs) {
    return Promise.all(reqs.filter(function(r) {
      return r.url !== url && new URL(r.url).pathname === path;
    }).map(function(r) { return cache.delete(r); }));
  });
}

// Parallel Range requests for a file that is not cached yet share one
// download. Each caller gets its own clone of the response.
function audioFetchOnce(cache, url) {
  if (!audioPending[url]) {
    var done = function() { delete audioPending[url]; };
    audioPending[url] = fetch(url, { cache: 'no-cache' }).then(function(full) {
      if (full.status === 200) {
        // Stays pending until stored, so a later request finds it in the cache.
        cache.put(url, full.clone()).then(function() {
          return audioDropOtherRevisions(cache, url);
        }).catch(function() {}).then(done);
      } else {
        done();
      }
      return full;
    });
    audioPending[url].catch(done);
  }
  return audioPending[url].then(function(full) { return full.clone(); });
}

function audioWhole(url) {
  return caches.open(AUDIO_CACHE).then(function(cache) {
    return cache.match(url).then(function(hit) {
      if (hit) return hit;
      var older = function() { return cache.match(url, { ignoreSearch: true }); };
      return audioFetchOnce(cache, url).then(function(full) {
        if (full.status === 200) return full;
        return older().then(function(old) { return old || full; });
      }, function(err) {
        return older().then(function(old) { if (old) return old; throw err; });
      });
    });
  });
}

function audioResponse(req) {
  var url = req.url.split('#')[0];
  return audioWhole(url).then(function(full) {
    var range = req.headers.get('range');
    if (!range || full.status !== 200) return full;
    return full.arrayBuffer().then(function(buf) {
      var m = /bytes=(\d*)-(\d*)/.exec(range) || [];
      var size = buf.byteLength;
      var start = m[1] ? parseInt(m[1], 10) : 0;
      var end = m[2] ? Math.min(parseInt(m[2], 10), size - 1) : size - 1;
      if (!m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }   // 'bytes=-N': the last N bytes
      var headers = { 'Content-Type': full.headers.get('Content-Type') || 'audio/mpeg', 'Accept-Ranges': 'bytes' };
      if (start >= size || start > end) {
        headers['Content-Range'] = 'bytes */' + size;
        return new Response(null, { status: 416, statusText: 'Range Not Satisfiable', headers: headers });
      }
      headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + size;
      headers['Content-Length'] = String(end - start + 1);
      return new Response(buf.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers: headers });
    });
  });
}

self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;                       // OpenAI POSTs etc: browser default
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // cross-origin: browser default
  if (url.search.indexOf('check=') !== -1) return;       // 'Check for updates' probe: network only, never the cache
  if (url.pathname.indexOf('/audio/') !== -1) { e.respondWith(audioResponse(req)); return; }
  if (/\.png$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then(function(c) { return c || fetch(req); }));
    return;
  }
  e.respondWith(networkFirst(req));
});
