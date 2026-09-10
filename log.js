// log.js — the daily learning log: a written summary of everything
// touched each day (new/reviewed words, grammar chapters opened, tracks
// played, scenes practiced, checkpoint scores) so it's easy to look back.
// Loaded via <script> tag. ES5 only. Depends on helpers from plan.js
// (planDate/planDayKey/planToday) and app.js/exam.js/tracks.js globals,
// all read lazily inside functions so load order doesn't matter.

var DAILY_LOG_KEY = 'daily-log';

function dailyLogToday() {
    return typeof srsToday === 'function' ? srsToday() : planDayKey(planToday());
}

function dailyLogLoad() {
    try { return JSON.parse(localStorage.getItem(DAILY_LOG_KEY) || '{}'); }
    catch (e) { return {}; }
}

function dailyLogSave(data) {
    try { localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(data)); } catch (e) {}
}

function dailyLogRecord(category, id) {
    var data = dailyLogLoad();
    var key = dailyLogToday();
    if (!data[key]) data[key] = {};
    if (!data[key][category]) data[key][category] = [];
    if (data[key][category].indexOf(id) === -1) {
        data[key][category].push(id);
        dailyLogSave(data);
    }
}

// ── Render ──────────────────────────────────────────────────────

function logLabelFor(dateKey) {
    if (dateKey === dailyLogToday()) return 'Today';
    var yesterday = new Date(planToday().getTime() - 24 * 60 * 60 * 1000);
    if (planDayKey(yesterday) === dateKey) return 'Yesterday';
    var d = planDate(dateKey);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
}

function logWordName(id) {
    var w = ALL_WORDS.filter(function(x) { return x.id === id; })[0];
    return w ? w.de : null;
}

function logGrammarName(id) {
    var s = ALL_GRAMMAR.filter(function(x) { return x.id === id; })[0];
    return s ? s.title : null;
}

function logTrackName(id) {
    if (typeof B1_TRACKS === 'undefined') return id;
    var t = B1_TRACKS.filter(function(x) { return x.id === id; })[0];
    return t ? (('0' + t.n).slice(-2) + ' ' + t.title) : id;
}

function renderLogScreen() {
    var container = document.getElementById('log-content');
    if (!container) return;

    var data = dailyLogLoad();
    var checkpointHist = typeof checkpointGetHistory === 'function' ? checkpointGetHistory() : [];
    var dates = Object.keys(data);
    checkpointHist.forEach(function(a) { if (dates.indexOf(a.date) === -1) dates.push(a.date); });
    dates.sort().reverse();

    if (!dates.length) {
        container.innerHTML = '<div class="plan-empty-state">📋<br>Nothing logged yet. Once you study something, each day shows up here.</div>';
        return;
    }

    var html = '';
    dates.forEach(function(date) {
        var entry = data[date] || {};
        var checkpointForDay = checkpointHist.filter(function(a) { return a.date === date; });
        html += renderLogDayCard(date, entry, checkpointForDay);
    });
    container.innerHTML = html;
}

function renderLogDayCard(date, entry, checkpointForDay) {
    var wordsNew = entry.wordsNew || [];
    var wordsReview = entry.wordsReview || [];
    var grammar = entry.grammar || [];
    var tracks = entry.tracks || [];
    var scenes = entry.scenes || [];
    var calls = entry.calls || [];

    var parts = [];
    if (wordsNew.length) parts.push(wordsNew.length + ' new word' + (wordsNew.length === 1 ? '' : 's'));
    if (wordsReview.length) parts.push(wordsReview.length + ' reviewed');
    if (grammar.length) parts.push(grammar.length + ' grammar chapter' + (grammar.length === 1 ? '' : 's'));
    if (tracks.length) parts.push(tracks.length + ' track' + (tracks.length === 1 ? '' : 's') + ' played');
    if (scenes.length) parts.push(scenes.length + ' scene' + (scenes.length === 1 ? '' : 's'));
    if (calls.length) parts.push(calls.length + ' call' + (calls.length === 1 ? '' : 's'));
    checkpointForDay.forEach(function(a) { parts.push('checkpoint ' + a.percentage + '%'); });

    var summary = parts.length ? parts.join(' · ') : 'No activity logged';

    var detail = '';
    var newNames = wordsNew.map(logWordName).filter(Boolean);
    var reviewNames = wordsReview.map(logWordName).filter(Boolean);
    if (newNames.length) detail += '<div class="log-detail-row"><span class="log-detail-label">New words</span>' + newNames.join(', ') + '</div>';
    if (reviewNames.length) detail += '<div class="log-detail-row"><span class="log-detail-label">Reviewed</span>' + reviewNames.join(', ') + '</div>';
    var grammarNames = grammar.map(logGrammarName).filter(Boolean);
    if (grammarNames.length) detail += '<div class="log-detail-row"><span class="log-detail-label">Grammar</span>' + grammarNames.join(', ') + '</div>';
    var trackNames = tracks.map(logTrackName);
    if (trackNames.length) detail += '<div class="log-detail-row"><span class="log-detail-label">Tracks</span>' + trackNames.join(', ') + '</div>';
    if (scenes.length) detail += '<div class="log-detail-row"><span class="log-detail-label">Scenes</span>' + scenes.join(', ') + '</div>';
    if (calls.length) detail += '<div class="log-detail-row"><span class="log-detail-label">Calls</span>' + calls.join(', ') + '</div>';
    if (!detail) detail = '<div class="log-detail-row">No detail recorded.</div>';

    var isToday = date === dailyLogToday();
    return '<div class="log-day-card' + (isToday ? ' today' : '') + '" onclick="this.classList.toggle(\'expanded\')">' +
        '<div class="log-day-header">' +
            '<span class="log-day-date">' + logLabelFor(date) + '</span>' +
            '<span class="log-day-chevron">&#9654;</span>' +
        '</div>' +
        '<div class="log-day-summary">' + summary + '</div>' +
        '<div class="log-day-detail">' + detail + '</div>' +
    '</div>';
}
