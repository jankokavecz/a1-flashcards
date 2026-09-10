// tracks.js — renders the Tracks tab from b1-tracks.js's B1_TRACKS /
// B1_TRACK_SEASONS / B1_TRACK_HOWTO. Loaded via <script> tag. ES5 only.
// escapeHtml() comes from plan.js, loaded earlier.

var TRACK_PROGRESS_KEY = 'track-progress';
var tracksCurrentId = null;
var tracksSearchQuery = '';

// ── Storage ─────────────────────────────────────────────────────

function tracksLoadProgress() {
    try { return JSON.parse(localStorage.getItem(TRACK_PROGRESS_KEY) || '{}'); }
    catch (e) { return {}; }
}

function tracksSaveProgress(data) {
    try { localStorage.setItem(TRACK_PROGRESS_KEY, JSON.stringify(data)); } catch (e) {}
}

function tracksGetEntry(id) {
    var data = tracksLoadProgress();
    return data[id] || { plays: 0, last: 0, hard: false };
}

function tracksBumpPlay(id) {
    var data = tracksLoadProgress();
    var entry = data[id] || { plays: 0, last: 0, hard: false };
    entry.plays = (entry.plays || 0) + 1;
    entry.last = Date.now();
    data[id] = entry;
    tracksSaveProgress(data);
    if (tracksCurrentId === id) tracksRenderDetail(id);
}

function tracksToggleHard(id) {
    var data = tracksLoadProgress();
    var entry = data[id] || { plays: 0, last: 0, hard: false };
    entry.hard = !entry.hard;
    data[id] = entry;
    tracksSaveProgress(data);
    tracksRenderDetail(id);
}

function tracksFindById(id) {
    if (typeof B1_TRACKS === 'undefined') return null;
    for (var i = 0; i < B1_TRACKS.length; i++) {
        if (B1_TRACKS[i].id === id) return B1_TRACKS[i];
    }
    return null;
}

// ── List view ───────────────────────────────────────────────────

function renderTracksScreen() {
    if (tracksCurrentId) tracksRenderDetail(tracksCurrentId);
    else tracksRenderList();
}

function tracksRenderList() {
    var container = document.getElementById('tracks-content');
    if (!container) return;
    if (typeof B1_TRACKS === 'undefined') {
        container.innerHTML = '<div class="plan-empty-state">Track data not loaded.</div>';
        return;
    }

    var html = '';
    html += '<details class="tracks-howto"><summary>How to use these</summary>';
    B1_TRACK_HOWTO.forEach(function(item) {
        html += '<div class="tracks-howto-item">' + escapeHtml(item) + '</div>';
    });
    html += '</details>';

    html += '<input type="text" class="tracks-search" id="tracks-search-input" placeholder="Search transcripts…" value="' + escapeHtml(tracksSearchQuery) + '">';

    var searchResultsHtml = tracksSearchQuery.trim().length >= 2 ? tracksRenderSearchResults(tracksSearchQuery) : '';

    if (searchResultsHtml) {
        html += searchResultsHtml;
    } else {
        Object.keys(B1_TRACK_SEASONS).forEach(function(seasonId) {
            var season = B1_TRACK_SEASONS[seasonId];
            var tracks = B1_TRACKS.filter(function(t) { return t.season === seasonId; });
            if (!tracks.length) return;
            html += '<div class="tracks-season-header">' + escapeHtml(season.name) + ' · ' + escapeHtml(season.weeks) + '</div>';
            tracks.forEach(function(t) {
                var entry = tracksGetEntry(t.id);
                var done = entry.plays >= 2;
                html += '<div class="tracks-row" onclick="tracksOpenTrack(\'' + t.id + '\')">' +
                    '<div class="tracks-row-num">' + ('0' + t.n).slice(-2) + '</div>' +
                    '<div class="tracks-row-info">' +
                        '<div class="tracks-row-title">' + escapeHtml(t.title) + '</div>' +
                        '<div class="tracks-row-meta">' + t.minutes + ' min' + (entry.plays > 2 ? ' · ×' + entry.plays : '') + '</div>' +
                    '</div>' +
                    (entry.hard ? '<span class="tracks-row-hard">🚩</span>' : '') +
                    '<div class="tracks-row-dots"><span class="tracks-dot' + (entry.plays >= 1 ? ' done' : '') + '"></span><span class="tracks-dot' + (done ? ' done' : '') + '"></span></div>' +
                '</div>';
            });
        });
    }

    container.innerHTML = html;

    var input = document.getElementById('tracks-search-input');
    if (input) {
        input.addEventListener('input', function() {
            tracksSearchQuery = input.value;
            tracksRenderList();
            var el = document.getElementById('tracks-search-input');
            if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
        });
    }
}

function tracksOpenTrack(id) {
    tracksCurrentId = id;
    tracksRenderDetail(id);
}

function tracksBackToList() {
    tracksCurrentId = null;
    tracksRenderList();
}

// ── Detail view ─────────────────────────────────────────────────

function tracksRenderDetail(id) {
    var container = document.getElementById('tracks-content');
    if (!container) return;
    var track = tracksFindById(id);
    if (!track) { tracksBackToList(); return; }

    var entry = tracksGetEntry(id);

    var html = '<div class="tracks-detail-header"><button class="tracks-back-btn" onclick="tracksBackToList()">&larr; Tracks</button></div>';
    html += '<div class="plan-header-week" style="margin-bottom:10px;">' + ('0' + track.n).slice(-2) + ' · ' + escapeHtml(track.title) + ' · ' + track.minutes + ' min</div>';

    html += '<div class="tracks-player-area">';
    html += '<audio id="tracks-audio-el" controls preload="none" src="' + escapeHtml(track.audio) + '"></audio>';
    html += '<div class="tracks-audio-missing hidden" id="tracks-audio-missing">Audio not added yet — drop the MP3 into flashcard-app/audio/</div>';
    html += '<button class="tracks-play-count-btn" onclick="tracksBumpPlay(\'' + id + '\')">+1 play (' + (entry.plays || 0) + ' so far)</button>';
    html += '<label class="tracks-hard-toggle"><input type="checkbox" ' + (entry.hard ? 'checked' : '') + ' onchange="tracksToggleHard(\'' + id + '\')"> Mark as hard (replay at the gym)</label>';
    html += '</div>';

    if (track.intro) html += '<div class="tracks-text-line" style="margin-bottom:14px;">' + escapeHtml(track.intro) + '</div>';

    track.sections.forEach(function(section) {
        html += tracksRenderSection(section);
    });

    container.innerHTML = html;

    var audioEl = document.getElementById('tracks-audio-el');
    var missingEl = document.getElementById('tracks-audio-missing');
    if (audioEl) {
        audioEl.addEventListener('error', function() {
            audioEl.classList.add('hidden');
            if (missingEl) missingEl.classList.remove('hidden');
        });
        audioEl.addEventListener('ended', function() { tracksBumpPlay(id); });
    }
}

function tracksRenderSection(section) {
    var html = '<div class="tracks-section">';
    if (section.heading) html += '<div class="tracks-section-heading">' + escapeHtml(section.heading) + '</div>';

    if (section.type === 'phrases') {
        section.rows.forEach(function(row) {
            html += '<div class="tracks-phrase-row"><div class="tracks-phrase-de">' + escapeHtml(row.de) + '</div>' +
                '<div class="tracks-phrase-en">' + escapeHtml(row.en) + '</div>' +
                (row.note ? '<div class="tracks-phrase-note">' + escapeHtml(row.note) + '</div>' : '') +
            '</div>';
        });
    } else if (section.type === 'builds') {
        section.rows.forEach(function(row) {
            html += '<div class="tracks-phrase-row"><div class="tracks-phrase-de">' + escapeHtml(row.de) + '</div>' +
                '<div class="tracks-phrase-en">' + escapeHtml(row.en) + '</div></div>';
        });
    } else if (section.type === 'dialogue') {
        if (section.intro) html += '<div class="tracks-text-line">' + escapeHtml(section.intro) + '</div>';
        section.lines.forEach(function(line) {
            html += '<div class="tracks-dialogue-line' + (line.you ? ' you' : '') + '">' +
                '<span class="tracks-dialogue-speaker">' + escapeHtml(line.speaker) + '</span>' +
                '<span class="tracks-dialogue-de">' + escapeHtml(line.de) + '</span>' +
            '</div>';
        });
    } else if (section.type === 'text') {
        if (section.intro) html += '<div class="tracks-text-line">' + escapeHtml(section.intro) + '</div>';
        section.lines.forEach(function(line) {
            html += '<div class="tracks-text-line">' + escapeHtml(line) + '</div>';
        });
    } else if (section.type === 'list') {
        section.items.forEach(function(item) {
            html += '<div class="tracks-list-item">' + escapeHtml(item) + '</div>';
        });
    }

    html += '</div>';
    return html;
}

// ── Diacritic-insensitive search ────────────────────────────────

function tracksNormalize(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function tracksRenderSearchResults(query) {
    var q = tracksNormalize(query);
    var hits = [];

    B1_TRACKS.forEach(function(t) {
        t.sections.forEach(function(section) {
            if (section.heading && tracksNormalize(section.heading).indexOf(q) !== -1) {
                hits.push({ track: t, text: section.heading, sub: '' });
            }
            (section.rows || []).forEach(function(row) {
                var hay = tracksNormalize((row.de || '') + ' ' + (row.en || '') + ' ' + (row.note || ''));
                if (hay.indexOf(q) !== -1) hits.push({ track: t, text: row.de, sub: row.en || '' });
            });
            (section.lines || []).forEach(function(line) {
                if (typeof line === 'string') {
                    if (tracksNormalize(line).indexOf(q) !== -1) hits.push({ track: t, text: line, sub: '' });
                } else if (line && line.de) {
                    if (tracksNormalize(line.de).indexOf(q) !== -1) hits.push({ track: t, text: line.de, sub: '' });
                }
            });
            (section.items || []).forEach(function(item) {
                if (tracksNormalize(item).indexOf(q) !== -1) hits.push({ track: t, text: item, sub: '' });
            });
        });
    });

    if (!hits.length) return '<div class="plan-empty-state">No matches.</div>';

    var html = '<div class="tracks-section-heading">' + hits.length + ' match' + (hits.length === 1 ? '' : 'es') + '</div>';
    hits.slice(0, 40).forEach(function(hit) {
        html += '<div class="tracks-search-hit" onclick="tracksOpenTrack(\'' + hit.track.id + '\')">' +
            '<div>' + escapeHtml(hit.text) + (hit.sub ? ' — ' + escapeHtml(hit.sub) : '') + '</div>' +
            '<div class="tracks-search-hit-track">' + ('0' + hit.track.n).slice(-2) + ' · ' + escapeHtml(hit.track.title) + '</div>' +
        '</div>';
    });
    return html;
}
