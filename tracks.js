// tracks.js — renders the Tracks tab from b1-tracks.js's B1_TRACKS /
// B1_TRACK_SEASONS / B1_TRACK_HOWTO. Loaded via <script> tag. ES5 only.
//
// The tab is built once (list view + detail view + a hidden audio holder)
// and never rebuilt wholesale, so an <audio> element keeps playing across
// tab switches, +1/hard taps and list/detail navigation. Players are only
// ever moved between containers (which does not pause them), never recreated.

var TRACK_PROGRESS_KEY = 'track-progress';
var TRACK_POSITIONS_KEY = 'track-positions';

// Real lengths of audio/*.mp3 (ffprobe). b1-tracks.js `minutes` are the
// booklet's planned session lengths, which include pauses for speaking.
var TRACK_AUDIO_SECONDS = {
    's1-01': 171, 's1-02': 173, 's1-03': 175, 's1-04': 161, 's1-05': 166,
    's1-06': 198, 's1-07': 185, 's1-08': 162, 's1-09': 158, 's1-10': 220,
    'gym-01': 297
};

// Audio revisions. The service worker keeps a played MP3 forever (that is
// what makes it play offline), so a replaced file never reaches a phone
// that already has it -- unless its URL changes. When you replace
// audio/<id>.mp3, bump its number here (e.g. 's1-01': 2) and update its
// TRACK_AUDIO_SECONDS entry: the URL becomes audio/s1-01.mp3?v=2, the next
// online play fetches the new file once, and sw.js drops the old copy.
var TRACK_AUDIO_REV = {};

var TRACKS_HOWTO_PLAY = 'Play it here. Tap a track and press play. A track counts as played when it plays to the end: one green dot after the first play, two when it is done. Listened somewhere else? Tap “+1 play”. Tick “Mark as hard” (🚩) on a track you want to replay.';
var TRACKS_HOWTO_WARMUP = 'Warm up with an older track. The recordings have no built-in review, so before a new track replay yesterday’s one or one marked 🚩.';
var TRACKS_HOWTO_SPEAK = 'Speak out loud. The gaps in the recordings are short, so pause after a line and say it back — quietly is fine. If you say nothing, the track is a podcast; if you speak, it is a lesson.';
var TRACKS_HOWTO_OFFLINE = 'Offline: a track you have played here while online is saved on this phone and then plays without a connection (“✓ Saved for offline” shows on the track). A track you have never played needs a connection the first time. If playback stops when the screen locks or you switch apps, keep the app open.';

// Sentences in the booklet intros that describe audio the MP3s don't contain.
var TRACKS_INTRO_DROP = /same shape|short tone|quiet minute|^\s*\d+\s+minutes\b/i;

var tracksCurrentId = null;     // track shown in the detail view, or null for the list
var tracksSearchQuery = '';
var tracksComposing = false;
var tracksHardOnly = false;
var tracksListScroll = 0;
var tracksDetailScroll = 0;
var tracksNotice = '';
var tracksPlayers = {};         // id -> { id, el, dead, listened, lastT, ... }
var tracksLastPlayedId = null;
var tracksMeasured = {};        // id -> seconds, from loadedmetadata

// ── Helpers ─────────────────────────────────────────────────────

function tracksEsc(s) {
    if (typeof escapeHtml === 'function') return escapeHtml(s);
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function tracksById(elId) { return document.getElementById(elId); }

function tracksScreenEl() { return document.getElementById('tracks-screen'); }

function tracksFmtTime(sec) {
    sec = Math.round(sec || 0);
    return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);
}

function tracksSeconds(id) {
    return tracksMeasured[id] || TRACK_AUDIO_SECONDS[id] || 0;
}

// The track's audio URL, with its revision (TRACK_AUDIO_REV) if it has one.
function tracksAudioUrl(track) {
    var url = String(track.audio || '');
    var rev = TRACK_AUDIO_REV[track.id];
    if (!url || !rev) return url;
    return url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=' + encodeURIComponent(rev);
}

function tracksLengthLabel(track) {
    var s = tracksSeconds(track.id);
    return s ? tracksFmtTime(s) : (track.minutes ? track.minutes + ' min' : '');
}

function tracksNumLabel(track) {
    if (track.season === 'gym') return 'G' + track.n;
    return ('0' + track.n).slice(-2);
}

// "01 · Who you are" / "G1 · Los geht’s" -- for the Log and Plan.
function tracksDisplayName(id) {
    var t = tracksFindById(id);
    return t ? tracksNumLabel(t) + ' · ' + t.title : String(id);
}

function tracksFindById(id) {
    if (typeof B1_TRACKS === 'undefined') return null;
    for (var i = 0; i < B1_TRACKS.length; i++) {
        if (B1_TRACKS[i].id === id) return B1_TRACKS[i];
    }
    return null;
}

function tracksExists(id) {
    return !!tracksFindById(id);
}

function tracksCleanIntro(text) {
    var parts = String(text || '').match(/[^.!?]+[.!?]+\S*\s*|[^.!?]+$/g) || [];
    return parts.filter(function(p) { return !TRACKS_INTRO_DROP.test(p); }).join('').trim();
}

function tracksHowtoItems() {
    var src = typeof B1_TRACK_HOWTO !== 'undefined' ? B1_TRACK_HOWTO : [];
    var out = [];
    src.forEach(function(item) {
        if (/\.m4b|\bBooks\b|audiobook/i.test(item)) out.push(TRACKS_HOWTO_PLAY);
        else if (/warm-up/i.test(item)) out.push(TRACKS_HOWTO_WARMUP);
        else if (/speak in every pause/i.test(item)) out.push(TRACKS_HOWTO_SPEAK);
        else out.push(item);
    });
    if (out.indexOf(TRACKS_HOWTO_PLAY) === -1) out.unshift(TRACKS_HOWTO_PLAY);
    out.push(TRACKS_HOWTO_OFFLINE);
    return out;
}

// ── Storage ─────────────────────────────────────────────────────

function tracksLoadProgress() {
    try { return JSON.parse(localStorage.getItem(TRACK_PROGRESS_KEY) || '{}') || {}; }
    catch (e) { return {}; }
}

function tracksSaveProgress(data) {
    try { localStorage.setItem(TRACK_PROGRESS_KEY, JSON.stringify(data)); } catch (e) {}
}

function tracksGetEntry(id) {
    var data = tracksLoadProgress();
    return data[id] || { plays: 0, last: 0, hard: false };
}

function tracksLoadPositions() {
    try { return JSON.parse(localStorage.getItem(TRACK_POSITIONS_KEY) || '{}') || {}; }
    catch (e) { return {}; }
}

function tracksGetPosition(id) {
    var p = tracksLoadPositions()[id];
    return typeof p === 'number' && p > 0 ? p : 0;
}

function tracksSavePosition(id, t, dur) {
    var data = tracksLoadPositions();
    if (t > 5 && (!dur || !isFinite(dur) || t < dur - 5)) data[id] = Math.floor(t);
    else delete data[id];
    try { localStorage.setItem(TRACK_POSITIONS_KEY, JSON.stringify(data)); } catch (e) {}
}

function tracksBumpPlay(id) {
    var data = tracksLoadProgress();
    var entry = data[id] || { plays: 0, last: 0, hard: false };
    entry.plays = (entry.plays || 0) + 1;
    entry.last = Date.now();
    data[id] = entry;
    tracksSaveProgress(data);
    if (typeof dailyLogRecord === 'function') dailyLogRecord('tracks', id);
    tracksRefreshCounts(id);
}

function tracksSetHard(id, hard) {
    var data = tracksLoadProgress();
    var entry = data[id] || { plays: 0, last: 0, hard: false };
    entry.hard = !!hard;
    data[id] = entry;
    tracksSaveProgress(data);
    var boxes = document.querySelectorAll('#tracks-content input[data-action="hard"]');
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].getAttribute('data-id') === id) boxes[i].checked = entry.hard;
    }
    if (tracksListVisible()) tracksRenderListBody();
}

function tracksToggleHard(id) {
    tracksSetHard(id, !tracksGetEntry(id).hard);
}

function tracksPlayBtnText(plays) {
    return '+1 play (listened elsewhere) · ' + (plays || 0) + ' so far';
}

// Updates counters in place -- never re-renders the player.
function tracksRefreshCounts(id) {
    var entry = tracksGetEntry(id);
    var btns = document.querySelectorAll('#tracks-content .tracks-play-count-btn');
    for (var i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-id') === id) btns[i].textContent = tracksPlayBtnText(entry.plays);
    }
    if (tracksListVisible()) tracksRenderListBody();
}

// ── Skeleton (built once) ───────────────────────────────────────

function tracksEnsureBuilt() {
    var container = document.getElementById('tracks-content');
    if (!container) return false;
    if (document.getElementById('tracks-list-view')) return true;
    if (typeof B1_TRACKS === 'undefined') {
        container.innerHTML = '<div class="plan-empty-state">Track data not loaded.</div>';
        return false;
    }

    var html = '<div id="tracks-list-view">';
    html += '<div class="tracks-notice hidden" id="tracks-notice"><span id="tracks-notice-text"></span>' +
        '<button class="tracks-notice-close" data-action="close-notice" aria-label="Dismiss">×</button></div>';
    html += '<div id="tracks-np-list" class="tracks-np-slot"></div>';
    html += '<details class="tracks-howto"><summary>How to use these</summary>';
    tracksHowtoItems().forEach(function(item) {
        html += '<div class="tracks-howto-item">' + tracksEsc(item) + '</div>';
    });
    html += '</details>';
    html += '<input type="text" class="tracks-search" id="tracks-search-input" placeholder="Search titles and transcripts…" ' +
        'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search">';
    html += '<div id="tracks-list-body"></div>';
    html += '</div>';
    html += '<div id="tracks-detail-view" class="hidden"></div>';
    html += '<div id="tracks-audio-holder" class="hidden"></div>';
    container.innerHTML = html;

    var input = document.getElementById('tracks-search-input');
    input.value = tracksSearchQuery;
    input.addEventListener('compositionstart', function() { tracksComposing = true; });
    input.addEventListener('compositionend', function() {
        tracksComposing = false;
        tracksSearchQuery = input.value;
        tracksRenderListBody();
    });
    input.addEventListener('input', function(e) {
        if (tracksComposing || (e && e.isComposing)) return;
        tracksSearchQuery = input.value;
        tracksRenderListBody();
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) input.blur();
    });

    container.addEventListener('click', tracksOnClick);
    container.addEventListener('change', function(e) {
        var t = e.target;
        if (t && t.getAttribute && t.getAttribute('data-action') === 'hard') tracksSetHard(t.getAttribute('data-id'), t.checked);
    });

    // Another media element (e.g. exam audio) starting pauses the track.
    document.addEventListener('play', function(e) {
        var t = e.target;
        if (t && (t.tagName === 'AUDIO' || t.tagName === 'VIDEO') && !t.hasAttribute('data-track-id')) tracksPauseAudio();
    }, true);
    return true;
}

function tracksOnClick(e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-action]') : null;
    if (!el) return;
    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');
    if (action === 'open') tracksOpenTrack(id, el.getAttribute('data-hit'));
    else if (action === 'back') tracksBackToList();
    else if (action === 'bump') tracksBumpPlay(id);
    else if (action === 'retry') tracksRetryAudio(id);
    else if (action === 'hard-filter') { tracksHardOnly = !tracksHardOnly; tracksRenderListBody(); }
    else if (action === 'close-notice') { tracksNotice = ''; tracksRenderNotice(); }
}

function tracksListVisible() {
    var lv = document.getElementById('tracks-list-view');
    return !!lv && !lv.classList.contains('hidden');
}

// Moves any player elements out of `el` before its innerHTML is replaced.
function tracksSetHtml(el, html) {
    tracksParkPlayers(el);
    el.innerHTML = html;
}

function tracksParkPlayers(within) {
    var holder = document.getElementById('tracks-audio-holder');
    if (!holder) return;
    Object.keys(tracksPlayers).forEach(function(id) {
        var el = tracksPlayers[id].el;
        if (el.parentNode !== holder && (!within || within.contains(el))) holder.appendChild(el);
    });
}

// ── Lifecycle (called by app.js switchTab) ──────────────────────

function tracksOnEnter(isReTap) {
    if (!tracksEnsureBuilt()) return;
    var screen = tracksScreenEl();
    if (isReTap) {
        if (screen) screen.scrollTop = 0;
        return;
    }
    if (tracksCurrentId && tracksDetailShows(tracksCurrentId)) {
        tracksShowDetail(tracksCurrentId);
        if (screen) screen.scrollTop = tracksDetailScroll;
        return;
    }
    tracksShowList('restore');
}

function tracksOnLeave() {
    var screen = tracksScreenEl();
    if (screen) {
        if (tracksListVisible()) tracksListScroll = screen.scrollTop;
        else tracksDetailScroll = screen.scrollTop;
    }
    var input = document.getElementById('tracks-search-input');
    if (input && document.activeElement === input) input.blur();
}

// Fallback entry point (old switchTab, init).
function renderTracksScreen() {
    if (!tracksEnsureBuilt()) return;
    if (tracksCurrentId) tracksShowDetail(tracksCurrentId);
    else tracksShowList(tracksListVisible() ? 'keep' : 'restore');
}

function tracksPauseAudio() {
    Object.keys(tracksPlayers).forEach(function(id) {
        var el = tracksPlayers[id].el;
        if (!el.paused) { try { el.pause(); } catch (e) {} }
    });
}

// ── List view ───────────────────────────────────────────────────

// scrollMode: 'restore' (saved list position), 'top', or 'keep'.
function tracksShowList(scrollMode) {
    if (!tracksEnsureBuilt()) return;
    var detail = document.getElementById('tracks-detail-view');
    tracksCurrentId = null;
    tracksPrune(null);
    tracksSetHtml(detail, '');
    detail.removeAttribute('data-id');
    detail.classList.add('hidden');
    document.getElementById('tracks-list-view').classList.remove('hidden');
    tracksRenderNotice();
    tracksRenderNowPlaying(document.getElementById('tracks-np-list'), null);
    tracksRenderListBody();
    var screen = tracksScreenEl();
    if (screen && scrollMode !== 'keep') screen.scrollTop = scrollMode === 'restore' ? tracksListScroll : 0;
}

function tracksRenderList() { tracksShowList('keep'); }

function tracksRenderNotice() {
    var box = document.getElementById('tracks-notice');
    if (!box) return;
    document.getElementById('tracks-notice-text').textContent = tracksNotice;
    box.classList.toggle('hidden', !tracksNotice);
}

function tracksSeasonOrder() {
    var ids = Object.keys(B1_TRACK_SEASONS);
    function firstWeek(id) {
        var m = /W(\d+)/.exec(B1_TRACK_SEASONS[id].weeks || '');
        return m ? parseInt(m[1], 10) : 999;
    }
    return ids.sort(function(a, b) { return firstWeek(a) - firstWeek(b); });
}

function tracksRenderListBody() {
    var body = document.getElementById('tracks-list-body');
    if (!body) return;
    var q = tracksSearchQuery.trim();
    tracksSetHtml(body, q.length >= 2 ? tracksSearchHtml(q) : tracksRowsHtml());
}

function tracksRowsHtml() {
    var progress = tracksLoadProgress();
    var hardCount = B1_TRACKS.filter(function(t) { return progress[t.id] && progress[t.id].hard; }).length;
    var html = '';
    if (hardCount || tracksHardOnly) {
        html += '<div class="tracks-filter-row"><button class="tracks-filter-btn' + (tracksHardOnly ? ' active' : '') +
            '" data-action="hard-filter">🚩 Hard only (' + hardCount + ')</button></div>';
    }
    if (tracksHardOnly && !hardCount) {
        return html + '<div class="plan-empty-state">No tracks marked 🚩 yet.</div>';
    }
    tracksSeasonOrder().forEach(function(seasonId) {
        var season = B1_TRACK_SEASONS[seasonId];
        var tracks = B1_TRACKS.filter(function(t) {
            return t.season === seasonId && (!tracksHardOnly || (progress[t.id] && progress[t.id].hard));
        });
        if (!tracks.length) return;
        html += '<div class="tracks-season-header">' + tracksEsc(season.name) + ' · ' + tracksEsc(season.weeks) + '</div>';
        tracks.forEach(function(t) {
            var entry = progress[t.id] || { plays: 0, hard: false };
            var plays = entry.plays || 0;
            html += '<div class="tracks-row" role="button" data-action="open" data-id="' + tracksEsc(t.id) + '">' +
                '<div class="tracks-row-num">' + tracksEsc(tracksNumLabel(t)) + '</div>' +
                '<div class="tracks-row-info">' +
                    '<div class="tracks-row-title">' + tracksEsc(t.title) + '</div>' +
                    '<div class="tracks-row-meta"><span class="tracks-len" data-len-id="' + tracksEsc(t.id) + '">' + tracksEsc(tracksLengthLabel(t)) + '</span>' +
                        (plays > 2 ? ' · ×' + plays : '') + '</div>' +
                '</div>' +
                (entry.hard ? '<span class="tracks-row-hard">🚩</span>' : '') +
                '<div class="tracks-row-dots" title="' + plays + (plays === 1 ? ' play' : ' plays') + ' — two plays = done">' +
                    '<span class="tracks-dot' + (plays >= 1 ? ' done' : '') + '"></span>' +
                    '<span class="tracks-dot' + (plays >= 2 ? ' done' : '') + '"></span></div>' +
            '</div>';
        });
    });
    return html;
}

function tracksMissingText(id) {
    var m = /^([a-z]+\d*)-0*(\d+)$/.exec(String(id || ''));
    var label = m ? (m[1] === 'gym' ? 'Gym Session ' : 'Scooter Track ') + m[2] : 'That track';
    var avail = [];
    tracksSeasonOrder().forEach(function(sid) {
        var nums = B1_TRACKS.filter(function(t) { return t.season === sid; }).map(function(t) { return t.n; });
        if (!nums.length) return;
        var name = sid === 'gym' ? 'Gym Session' : 'Scooter Track';
        var lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums);
        avail.push(lo === hi ? name + ' ' + lo : name + 's ' + lo + '–' + hi);
    });
    return label + ' isn’t in the app yet' + (avail.length ? ' — so far it has ' + avail.join(' and ') : '') +
        '. Replay a track you marked 🚩 or the newest one instead.';
}

// ── Detail view ─────────────────────────────────────────────────

function tracksOpenTrack(id, hitKey) {
    if (!tracksEnsureBuilt()) return;
    if (!tracksExists(id)) {
        tracksNotice = tracksMissingText(id);
        tracksShowList('top');
        return;
    }
    tracksNotice = '';
    tracksShowDetail(id, hitKey);
}

function tracksBackToList() {
    tracksNotice = '';
    tracksShowList('restore');
}

function tracksRenderDetail(id) { tracksOpenTrack(id); }

function tracksDetailShows(id) {
    var detail = document.getElementById('tracks-detail-view');
    return !!detail && detail.getAttribute('data-id') === id;
}

function tracksShowDetail(id, hitKey) {
    var track = tracksFindById(id);
    var detail = document.getElementById('tracks-detail-view');
    var list = document.getElementById('tracks-list-view');
    var screen = tracksScreenEl();
    if (!track || !detail || !list) return;
    if (tracksListVisible() && screen) tracksListScroll = screen.scrollTop;

    var fresh = !tracksDetailShows(id);
    if (fresh) {
        tracksPrune(id);
        tracksSetHtml(detail, tracksDetailHtml(track));
        detail.setAttribute('data-id', id);
    }
    tracksCurrentId = id;
    var rec = tracksGetPlayer(track);
    var slot = document.getElementById('tracks-audio-slot');
    if (slot && rec.el.parentNode !== slot) slot.appendChild(rec.el);
    tracksRenderNowPlaying(document.getElementById('tracks-np-detail'), id);
    tracksSyncError(id);
    tracksSyncResumeHint(id);
    list.classList.add('hidden');
    detail.classList.remove('hidden');
    if (fresh) {
        tracksCheckOffline(track);
        if (screen) screen.scrollTop = 0;
        if (hitKey) tracksScrollToHit(hitKey);
    }
}

function tracksDetailHtml(track) {
    var id = tracksEsc(track.id);
    var entry = tracksGetEntry(track.id);
    var html = '<div class="tracks-detail-header"><button class="tracks-back-btn" data-action="back">&larr; Tracks</button></div>';
    html += '<div id="tracks-np-detail" class="tracks-np-slot"></div>';
    html += '<div class="plan-header-week" style="margin-bottom:10px;">' + tracksEsc(tracksNumLabel(track)) + ' · ' + tracksEsc(track.title) +
        ' · <span class="tracks-len" data-len-id="' + id + '">' + tracksEsc(tracksLengthLabel(track)) + '</span></div>';

    html += '<div class="tracks-player-area">';
    html += '<div id="tracks-audio-slot" class="tracks-audio-slot"></div>';
    html += '<div class="tracks-audio-missing hidden" id="tracks-audio-missing"><div id="tracks-audio-missing-msg"></div>' +
        '<button class="tracks-retry-btn" data-action="retry" data-id="' + id + '">Try again</button></div>';
    html += '<div class="tracks-player-note">Counts as a play when it plays to the end.' +
        (track.minutes ? ' The plan’s ' + tracksEsc(track.minutes) + ' min includes time to pause and say each line back.' : '') +
        '<span class="tracks-resume-hint hidden" id="tracks-resume-hint"></span>' +
        '<span class="tracks-offline-badge hidden" id="tracks-offline-badge"> ✓ Saved for offline</span></div>';
    html += '<button class="tracks-play-count-btn" data-action="bump" data-id="' + id + '">' + tracksEsc(tracksPlayBtnText(entry.plays)) + '</button>';
    html += '<label class="tracks-hard-toggle"><input type="checkbox" data-action="hard" data-id="' + id + '"' + (entry.hard ? ' checked' : '') +
        '> Mark as hard (replay at the gym)</label>';
    html += '</div>';

    var intro = tracksCleanIntro(track.intro);
    if (intro) html += '<div class="tracks-text-line" data-hit="intro" style="margin-bottom:14px;">' + tracksEsc(intro) + '</div>';

    (track.sections || []).forEach(function(section, si) {
        html += tracksRenderSection(section, si);
    });
    return html;
}

function tracksRenderSection(section, si) {
    function hit(key) { return ' data-hit="' + si + '.' + key + '"'; }
    var html = '<div class="tracks-section">';
    if (section.heading) html += '<div class="tracks-section-heading"' + hit('h') + '>' + tracksEsc(section.heading) + '</div>';

    if (section.type === 'phrases') {
        (section.rows || []).forEach(function(row, ri) {
            html += '<div class="tracks-phrase-row"' + hit(ri) + '><div class="tracks-phrase-de">' + tracksEsc(row.de) + '</div>' +
                '<div class="tracks-phrase-en">' + tracksEsc(row.en) + '</div>' +
                (row.note ? '<div class="tracks-phrase-note">' + tracksEsc(row.note) + '</div>' : '') +
            '</div>';
        });
    } else if (section.type === 'builds') {
        (section.rows || []).forEach(function(row, ri) {
            html += '<div class="tracks-phrase-row"' + hit(ri) + '><div class="tracks-phrase-de">' + tracksEsc(row.de) + '</div>' +
                '<div class="tracks-phrase-en">' + tracksEsc(row.en) + '</div></div>';
        });
    } else if (section.type === 'dialogue') {
        if (section.intro) html += '<div class="tracks-text-line"' + hit('i') + '>' + tracksEsc(section.intro) + '</div>';
        (section.lines || []).forEach(function(line, li) {
            html += '<div class="tracks-dialogue-line' + (line.you ? ' you' : '') + '"' + hit(li) + '>' +
                '<span class="tracks-dialogue-speaker">' + tracksEsc(line.speaker) + '</span>' +
                '<span class="tracks-dialogue-de">' + tracksEsc(line.de) + '</span>' +
            '</div>';
        });
    } else if (section.type === 'text') {
        if (section.intro) html += '<div class="tracks-text-line"' + hit('i') + '>' + tracksEsc(section.intro) + '</div>';
        (section.lines || []).forEach(function(line, li) {
            html += '<div class="tracks-text-line"' + hit(li) + '>' + tracksEsc(line) + '</div>';
        });
    } else if (section.type === 'list') {
        (section.items || []).forEach(function(item, ii) {
            html += '<div class="tracks-list-item"' + hit(ii) + '>' + tracksEsc(item) + '</div>';
        });
    }

    html += '</div>';
    return html;
}

function tracksScrollToHit(key) {
    var detail = document.getElementById('tracks-detail-view');
    var screen = tracksScreenEl();
    if (!detail || !screen) return;
    var nodes = detail.querySelectorAll('[data-hit]');
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].getAttribute('data-hit') !== key) continue;
        nodes[i].classList.add('tracks-hit');
        var r = nodes[i].getBoundingClientRect();
        var sr = screen.getBoundingClientRect();
        screen.scrollTop += (r.top - sr.top) - Math.round(sr.height / 3);
        return;
    }
}

function tracksCheckOffline(track) {
    if (!window.caches || typeof caches.match !== 'function') return;
    var url;
    try { url = new URL(tracksAudioUrl(track), location.href).href; } catch (e) { return; }
    caches.match(url).then(function(hit) {
        var badge = document.getElementById('tracks-offline-badge');
        if (hit && badge && tracksCurrentId === track.id) badge.classList.remove('hidden');
    }).catch(function() {});
}

// ── Players ─────────────────────────────────────────────────────

function tracksGetPlayer(track) {
    var id = track.id;
    if (tracksPlayers[id]) return tracksPlayers[id];
    var el = document.createElement('audio');
    var pos = tracksGetPosition(id);
    var rec = { id: id, el: el, dead: false, listened: 0, lastT: 0, lastSaved: 0, pendingSeek: pos, resumeFrom: pos, errorMsg: '' };
    el.controls = true;
    el.preload = pos ? 'metadata' : 'none';
    el.setAttribute('data-track-id', id);
    el.className = 'tracks-audio';
    el.src = tracksAudioUrl(track);

    el.addEventListener('loadedmetadata', function() {
        if (rec.dead) return;
        if (isFinite(el.duration) && el.duration > 0) {
            tracksMeasured[id] = el.duration;
            var lens = document.querySelectorAll('#tracks-content .tracks-len');
            for (var i = 0; i < lens.length; i++) {
                if (lens[i].getAttribute('data-len-id') === id) lens[i].textContent = tracksFmtTime(el.duration);
            }
        }
        if (rec.pendingSeek) {
            var to = rec.pendingSeek;
            rec.pendingSeek = 0;
            if (!isFinite(el.duration) || to < el.duration - 1) { try { el.currentTime = to; } catch (e) {} }
            rec.lastT = to;
        }
    });
    el.addEventListener('timeupdate', function() {
        if (rec.dead) return;
        var t = el.currentTime;
        var d = t - rec.lastT;
        if (!el.seeking && d > 0 && d < 1.5 * Math.max(1, el.playbackRate || 1)) rec.listened += d;
        rec.lastT = t;
        if (Math.abs(t - rec.lastSaved) > 10) { rec.lastSaved = t; tracksSavePosition(id, t, el.duration); }
    });
    el.addEventListener('seeked', function() { rec.lastT = el.currentTime; });
    el.addEventListener('play', function() {
        if (rec.dead) return;
        rec.errorMsg = '';
        tracksLastPlayedId = id;
        Object.keys(tracksPlayers).forEach(function(other) {
            if (other !== id && !tracksPlayers[other].el.paused) { try { tracksPlayers[other].el.pause(); } catch (e) {} }
        });
        tracksSyncError(id);
        tracksSyncResumeHint(id);
        tracksUpdateNpLabels();
    });
    el.addEventListener('pause', function() {
        if (rec.dead) return;
        if (!el.ended) tracksSavePosition(id, el.currentTime, el.duration);
        tracksUpdateNpLabels();
        if (tracksCurrentId === id) tracksCheckOffline(track);
    });
    el.addEventListener('ended', function() {
        if (rec.dead) return;
        var dur = isFinite(el.duration) && el.duration > 0 ? el.duration : tracksSeconds(id);
        var need = dur * 0.5;
        if (rec.resumeFrom) need = Math.min(need, (dur - rec.resumeFrom) * 0.8);
        var counted = rec.listened > 0 && rec.listened >= need;
        rec.listened = 0;
        rec.resumeFrom = 0;
        tracksSavePosition(id, 0, dur);
        if (counted) tracksBumpPlay(id);
        tracksUpdateNpLabels();
        if (tracksCurrentId === id) tracksCheckOffline(track);
    });
    el.addEventListener('error', function() {
        if (rec.dead) return;
        rec.errorMsg = navigator.onLine === false
            ? 'Offline — play it once while online to keep it for offline use.'
            : 'Couldn’t load the audio for this track. Check your connection and try again.';
        tracksSyncError(id);
    });

    tracksPlayers[id] = rec;
    var holder = document.getElementById('tracks-audio-holder');
    if (holder) holder.appendChild(el);
    return rec;
}

function tracksPlayerAlive(rec) {
    return !rec.el.paused || (!rec.el.ended && rec.el.currentTime > 0 && !rec.errorMsg);
}

// Drops players that are neither shown nor the last-played, still-going one.
function tracksPrune(keepId) {
    Object.keys(tracksPlayers).forEach(function(id) {
        var rec = tracksPlayers[id];
        if (id === keepId) return;
        if (id === tracksLastPlayedId && tracksPlayerAlive(rec)) return;
        rec.dead = true;
        if (!rec.el.ended && rec.el.currentTime > 0) tracksSavePosition(id, rec.el.currentTime, rec.el.duration);
        try { rec.el.pause(); } catch (e) {}
        if (rec.el.parentNode) rec.el.parentNode.removeChild(rec.el);
        delete tracksPlayers[id];
        if (tracksLastPlayedId === id) tracksLastPlayedId = null;
    });
}

// The last-played track's real player, shown above the list or another track.
function tracksRenderNowPlaying(slot, excludeId) {
    if (!slot) return;
    var rec = tracksLastPlayedId ? tracksPlayers[tracksLastPlayedId] : null;
    if (!rec || rec.id === excludeId || !tracksPlayerAlive(rec)) {
        tracksSetHtml(slot, '');
        return;
    }
    var holder = slot.querySelector('.tracks-np-audio');
    if (!holder || slot.getAttribute('data-np-id') !== rec.id) {
        var track = tracksFindById(rec.id);
        tracksSetHtml(slot, '<div class="tracks-np">' +
            '<div class="tracks-np-head"><span class="tracks-np-label"></span>' +
            '<button class="tracks-np-open" data-action="open" data-id="' + tracksEsc(rec.id) + '">' +
                tracksEsc(track ? tracksNumLabel(track) + ' · ' + track.title : rec.id) + ' ›</button></div>' +
            '<div class="tracks-np-audio"></div></div>');
        slot.setAttribute('data-np-id', rec.id);
        holder = slot.querySelector('.tracks-np-audio');
    }
    if (rec.el.parentNode !== holder) holder.appendChild(rec.el);
    tracksUpdateNpLabels();
}

function tracksUpdateNpLabels() {
    var labels = document.querySelectorAll('#tracks-content .tracks-np-label');
    var rec = tracksLastPlayedId ? tracksPlayers[tracksLastPlayedId] : null;
    for (var i = 0; i < labels.length; i++) {
        labels[i].textContent = rec && !rec.el.paused ? '▶ Now playing' : '⏸ Paused';
    }
}

function tracksSyncError(id) {
    if (tracksCurrentId !== id) return;
    var rec = tracksPlayers[id];
    var box = document.getElementById('tracks-audio-missing');
    if (!box || !rec) return;
    if (rec.errorMsg) {
        document.getElementById('tracks-audio-missing-msg').textContent = rec.errorMsg;
        box.classList.remove('hidden');
        rec.el.classList.add('hidden');
    } else {
        box.classList.add('hidden');
        rec.el.classList.remove('hidden');
    }
}

function tracksSyncResumeHint(id) {
    var hint = document.getElementById('tracks-resume-hint');
    var rec = tracksPlayers[id];
    if (!hint || tracksCurrentId !== id || !rec) return;
    var show = rec.pendingSeek > 0 && rec.el.paused;
    hint.textContent = show ? ' Picks up at ' + tracksFmtTime(rec.pendingSeek) + '.' : '';
    hint.classList.toggle('hidden', !show);
}

function tracksRetryAudio(id) {
    var rec = tracksPlayers[id];
    if (!rec) return;
    rec.errorMsg = '';
    rec.pendingSeek = tracksGetPosition(id);
    tracksSyncError(id);
    try { rec.el.load(); } catch (e) {}
    try {
        var p = rec.el.play();
        if (p && p.catch) p.catch(function() {});
    } catch (e) {}
}

// ── Search (folds diacritics, ß/ss and ä/ae etc.) ───────────────

function tracksNormalize(s) {
    s = String(s || '').toLowerCase().replace(/ß/g, 'ss').replace(/[’‘]/g, '\'');
    if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return s.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
}

function tracksSearchHits(query) {
    var q = tracksNormalize(query.trim());
    var hits = [];
    function has(text) { return !!text && tracksNormalize(text).indexOf(q) !== -1; }
    B1_TRACKS.forEach(function(t) {
        if (has(t.title)) hits.push({ track: t, text: t.title, sub: '', key: '' });
        var intro = tracksCleanIntro(t.intro);
        if (has(intro)) hits.push({ track: t, text: intro, sub: '', key: 'intro' });
        (t.sections || []).forEach(function(section, si) {
            if (has(section.heading)) hits.push({ track: t, text: section.heading, sub: '', key: si + '.h' });
            if (has(section.intro)) hits.push({ track: t, text: section.intro, sub: '', key: si + '.i' });
            (section.rows || []).forEach(function(row, ri) {
                if (has((row.de || '') + ' ' + (row.en || '') + ' ' + (row.note || ''))) hits.push({ track: t, text: row.de, sub: row.en || '', key: si + '.' + ri });
            });
            (section.lines || []).forEach(function(line, li) {
                var text = typeof line === 'string' ? line : (line && line.de);
                if (has(text)) hits.push({ track: t, text: text, sub: '', key: si + '.' + li });
            });
            (section.items || []).forEach(function(item, ii) {
                if (has(item)) hits.push({ track: t, text: item, sub: '', key: si + '.' + ii });
            });
        });
    });
    return hits;
}

function tracksSearchHtml(query) {
    var hits = tracksSearchHits(query);
    if (!hits.length) return '<div class="plan-empty-state">No matches.</div>';
    var max = 40;
    var html = '<div class="tracks-section-heading">' + hits.length + ' match' + (hits.length === 1 ? '' : 'es') +
        (hits.length > max ? ' · showing the first ' + max + ' — type more to narrow it down' : '') + '</div>';
    hits.slice(0, max).forEach(function(hit) {
        var text = String(hit.text || '');
        if (text.length > 140) text = text.slice(0, 137) + '…';
        html += '<div class="tracks-search-hit" role="button" data-action="open" data-id="' + tracksEsc(hit.track.id) + '" data-hit="' + tracksEsc(hit.key) + '">' +
            '<div>' + tracksEsc(text) + (hit.sub ? ' — ' + tracksEsc(hit.sub) : '') + '</div>' +
            '<div class="tracks-search-hit-track">' + tracksEsc(tracksNumLabel(hit.track)) + ' · ' + tracksEsc(hit.track.title) + '</div>' +
        '</div>';
    });
    return html;
}

function tracksRenderSearchResults(query) { return tracksSearchHtml(query); }
