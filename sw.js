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
  './', './index.html', './styles.css', './version.js', './app.js', './words.js', './a1-verb-forms.js', './grammar.js',
  './scenarios.js', './exam.js', './calls.js', './plan.js', './tracks.js', './log.js',
  './b1-plan.js', './b1-tracks.js', './b1-tracks-2.js', './b1-exam-data.js', './b1-words.js', './b1-grammar.js',
  './b1-scenes.js', './b1-calls.js', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './manifest.json'
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
// Cache Storage refuses to store. So a file that is not stored yet is played
// straight from the network (its Range requests pass through, so playback
// starts at once), and meanwhile the WHOLE file is fetched once more without
// Range, in the background (waitUntil), and kept in AUDIO_CACHE. Once it is
// there, every Range request is answered with a 206 sliced from it -- offline
// too (iOS Safari will not play media from a SW without 206s).
//
// A cached file is never revalidated, so a replaced MP3 gets a new URL
// instead: tracks.js adds ?v=<rev> (TRACK_AUDIO_REV, the start of the file's
// sha1, written by scripts/generate_audio.py). The cache is keyed by the full
// URL, so a new revision misses, is fetched once, and once it is stored the
// older copies of the same path (any other ?v=, or none) are deleted. Until
// then -- e.g. offline -- the older copy is played rather than nothing.
var audioPending = {};    // url -> the one background download of that file

function audioDropOtherRevisions(cache, url) {
  var path = new URL(url).pathname;
  return cache.keys().then(function(reqs) {
    return Promise.all(reqs.filter(function(r) {
      return r.url !== url && new URL(r.url).pathname === path;
    }).map(function(r) { return cache.delete(r); }));
  });
}

// Range requests that miss while the file is downloading share that one
// download. A dropped connection stores nothing; the next play tries again.
function audioFetchOnce(cache, url) {
  if (!audioPending[url]) {
    audioPending[url] = fetch(url, { cache: 'no-store' }).then(function(full) {
      if (full.status !== 200) return;
      return cache.put(url, full).then(function() { return audioDropOtherRevisions(cache, url); });
    }).catch(function() {}).then(function() { delete audioPending[url]; });
  }
  return audioPending[url];
}

// A 206 for `range` from a stored 200. Sliced as a Blob, so a seek does not
// copy the whole file into memory first.
function audioSlice(full, range) {
  var type = full.headers.get('Content-Type') || 'audio/mpeg';
  var etag = full.headers.get('ETag'), modified = full.headers.get('Last-Modified');
  return full.blob().then(function(blob) {
    var m = /bytes=(\d*)-(\d*)/.exec(range) || [];
    var size = blob.size;
    var start = m[1] ? parseInt(m[1], 10) : 0;
    var end = m[2] ? Math.min(parseInt(m[2], 10), size - 1) : size - 1;
    if (!m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }   // 'bytes=-N': the last N bytes
    var headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes' };
    if (start >= size || start > end) {
      headers['Content-Range'] = 'bytes */' + size;
      return new Response(null, { status: 416, statusText: 'Range Not Satisfiable', headers: headers });
    }
    headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + size;
    headers['Content-Length'] = String(end - start + 1);
    if (etag) headers['ETag'] = etag;
    if (modified) headers['Last-Modified'] = modified;
    return new Response(blob.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers: headers });
  });
}

// A network (or stored) answer passed on as a constructed Response, like the
// 206s sliced from the cache. Chrome's media player fails with "data source
// error" when the responses for one file mix the two kinds -- e.g. the file
// was streamed from the network, stored meanwhile, and then a seek is
// answered from the cache. The body is still the original stream: nothing
// waits for it.
function audioPass(resp) {
  var headers = new Headers();
  ['Content-Type', 'Content-Range', 'Accept-Ranges', 'ETag', 'Last-Modified'].forEach(function(h) {
    var v = resp.headers.get(h);
    if (v) headers.set(h, v);
  });
  var len = resp.headers.get('Content-Length');
  if (len && !resp.headers.get('Content-Encoding')) headers.set('Content-Length', len);
  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: headers });
}

function audioHandle(e) {
  var req = e.request;
  var url = req.url.split('#')[0];
  var range = req.headers.get('range');
  var lookup = caches.open(AUDIO_CACHE).then(function(cache) {
    return cache.match(url).then(function(hit) { return { cache: cache, hit: hit }; });
  });
  // Not stored yet: keep the whole file for next time, without holding up this request.
  e.waitUntil(lookup.then(function(c) { if (!c.hit) return audioFetchOnce(c.cache, url); }).catch(function() {}));
  e.respondWith(lookup.then(function(c) {
    if (c.hit) return range ? audioSlice(c.hit, range) : audioPass(c.hit);
    var older = function() {
      return c.cache.match(url, { ignoreSearch: true }).then(function(old) {
        return old && (range ? audioSlice(old, range) : audioPass(old));
      });
    };
    return fetch(req).then(function(resp) {
      if (resp.ok) return audioPass(resp);
      return older().then(function(old) { return old || resp; });
    }, function(err) {
      return older().then(function(old) { if (old) return old; throw err; });
    });
  }));
}

self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;                       // OpenAI POSTs etc: browser default
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // cross-origin: browser default
  if (url.search.indexOf('check=') !== -1) return;       // 'Check for updates' probe: network only, never the cache
  // Audiobooks (audio/books/*.m4b, tens of MB, opened in Safari/Books): network
  // only -- never stored in AUDIO_CACHE, never Range-sliced from it.
  if (/\.m4b$/i.test(url.pathname)) return;
  if (url.pathname.indexOf('/audio/') !== -1) { audioHandle(e); return; }
  if (/\.png$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then(function(c) { return c || fetch(req); }));
    return;
  }
  e.respondWith(networkFirst(req));
});
