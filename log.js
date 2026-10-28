// log.js — the daily learning log: a written summary of everything
// touched each day (new/reviewed words, grammar chapters opened, tracks
// played, scenes practiced, exams and checkpoint scores) so it's easy to
// look back. Loaded via <script> tag. ES5 only. Depends on helpers from
// plan.js (planDate/planDayKey/planToday/planAddDays/escapeHtml) and
// app.js/exam.js/tracks.js globals, all read lazily inside functions so
// load order doesn't matter.

var DAILY_LOG_KEY = 'daily-log';
var DAILY_LOG_STARTED = '2026-09-10';
var logExpanded = {};
var logScrollY = 0;
var logLastRenderDay = null;
var logListenersReady = false;

function dailyLogToday() {
    return typeof srsToday === 'function' ? srsToday() : planDayKey(planToday());
}

function dailyLogLoad() {
    try {
        var v = JSON.parse(localStorage.getItem(DAILY_LOG_KEY) || '{}');
        return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    } catch (e) { return {}; }
}

function dailyLogSave(data) {
    try { localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(data)); } catch (e) {}
}

function dailyLogRecord(category, id) {
    if (id === undefined || id === null || id === '') return;
    var data = dailyLogLoad();
    var key = dailyLogToday();
    var day = data[key];
    if (!day || typeof day !== 'object' || Array.isArray(day)) day = data[key] = {};
    if (!Array.isArray(day[category])) day[category] = [];
    for (var i = 0; i < day[category].length; i++) {
        if (String(day[category][i]) === String(id)) return;
    }
    day[category].push(id);
    dailyLogSave(data);
}

// ── Render ──────────────────────────────────────────────────────

var LOG_SECTIONS = [
    { cat: 'wordsNew',    label: 'New words',      kind: 'word',    unit: 'new word',        plural: true },
    { cat: 'wordsReview', label: 'Reviewed',       kind: 'word',    unit: 'reviewed' },
    { cat: 'wordsAgain',  label: 'Pressed Again',  kind: 'word',    unit: 'pressed Again' },
    { cat: 'practiced',   label: 'Practised',      kind: 'word',    unit: 'practised' },
    { cat: 'wordsMarked', label: 'Marked by hand', kind: 'word',    unit: 'marked by hand' },
    { cat: 'grammar',     label: 'Grammar',        kind: 'grammar', unit: 'grammar chapter', plural: true },
    { cat: 'tracks',      label: 'Tracks',         kind: 'track',   unit: 'track',           plural: true, suffix: ' played' },
    { cat: 'scenes',      label: 'Scenes',         kind: 'text',    unit: 'scene',           plural: true },
    { cat: 'calls',       label: 'Speak calls',    kind: 'text',    unit: 'call',            plural: true },
    { cat: 'tests',       label: 'Word tests',     kind: 'text',    unit: 'word test',       plural: true },
    { cat: 'exams',       label: 'Exam practice',  kind: 'text',    unit: 'exam',            plural: true }
];

function logEsc(s) {
    if (typeof escapeHtml === 'function') return escapeHtml(s);
    return String(s === null || s === undefined ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function logArr(v) {
    return Array.isArray(v) ? v : [];
}

function logLabelFor(dateKey) {
    if (dateKey === dailyLogToday()) return 'Today';
    var today = planToday();
    if (planDayKey(planAddDays(today, -1)) === dateKey) return 'Yesterday';
    var d = planDate(dateKey);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] +
        (d.getFullYear() !== today.getFullYear() ? ' ' + d.getFullYear() : '');
}

function logWordName(id) {
    var w = typeof planWordById === 'function'
        ? planWordById(id)
        : ALL_WORDS.filter(function(x) { return String(x.id) === String(id); })[0];
    return w ? w.de : null;
}

function logGrammarName(id) {
    var s = typeof planGrammarById === 'function'
        ? planGrammarById(id)
        : ALL_GRAMMAR.filter(function(x) { return x.id === id; })[0];
    return s ? s.title : null;
}

function logTrackName(id) {
    if (typeof tracksDisplayName === 'function') return tracksDisplayName(id) || id;
    if (typeof B1_TRACKS === 'undefined') return id;
    var t = B1_TRACKS.filter(function(x) { return x.id === id; })[0];
    return t ? (('0' + t.n).slice(-2) + ' ' + t.title) : id;
}

function logCheckpointHistory() {
    if (typeof checkpointGetHistory !== 'function') return [];
    var hist;
    try { hist = checkpointGetHistory(); } catch (e) { hist = null; }
    return Array.isArray(hist) ? hist.filter(function(a) { return a && typeof a.date === 'string'; }) : [];
}

// Names per category, unknown ids dropped so counts match the lists.
// A word that is new that day is listed under New only, not also Reviewed.
function logDayInfo(entry, checkpointForDay) {
    entry = (entry && typeof entry === 'object') ? entry : {};
    var newIds = {};
    logArr(entry.wordsNew).forEach(function(id) { newIds[String(id)] = true; });
    var sections = [];
    LOG_SECTIONS.forEach(function(sec) {
        var seen = {};
        var names = [];
        logArr(entry[sec.cat]).forEach(function(id) {
            var k = String(id);
            if (seen[k]) return;
            seen[k] = true;
            if (sec.cat === 'wordsReview' && newIds[k]) return;
            // Checkpoint quizzes come from checkpoint-history below; exam.js
            // also logs them as 'Checkpoint · N%' -- don't list them twice.
            if (sec.cat === 'exams' && k.indexOf('Checkpoint') === 0 && (checkpointForDay || []).length) return;
            var name;
            if (sec.kind === 'word') name = logWordName(id);
            else if (sec.kind === 'grammar') name = logGrammarName(id);
            else if (sec.kind === 'track') name = logTrackName(id);
            else name = id;
            if (name !== null && name !== undefined && name !== '') names.push(String(name));
        });
        if (names.length) sections.push({ sec: sec, names: names });
    });
    return { sections: sections, checkpoints: checkpointForDay || [] };
}

function logSummaryText(info) {
    var parts = info.sections.map(function(s) {
        var n = s.names.length;
        return n + ' ' + s.sec.unit + (s.sec.plural && n !== 1 ? 's' : '') + (s.sec.suffix || '');
    });
    info.checkpoints.forEach(function(a) { parts.push('checkpoint ' + (Math.round(a.percentage) || 0) + '%'); });
    return parts.length ? parts.join(' · ') : 'No activity logged';
}

function logDetailHtml(info) {
    var html = '';
    info.sections.forEach(function(s) {
        html += '<div class="log-detail-row"><span class="log-detail-label">' + logEsc(s.sec.label) + '</span>' + logEsc(s.names.join(', ')) + '</div>';
    });
    if (info.checkpoints.length) {
        html += '<div class="log-detail-row"><span class="log-detail-label">Checkpoint quiz</span>' +
            logEsc(info.checkpoints.map(function(a) { return (Math.round(a.percentage) || 0) + '%'; }).join(', ')) + '</div>';
    }
    return html || '<div class="log-detail-row">No detail recorded.</div>';
}

function logValidKey(k) {
    return /^\d{4}-\d{2}-\d{2}$/.test(k);
}

function logInitListeners() {
    if (logListenersReady) return;
    var el = document.getElementById('log-screen');
    if (!el) return;
    logListenersReady = true;
    el.addEventListener('scroll', function() {
        if (el.classList.contains('active')) logScrollY = el.scrollTop;
    });
}

function renderLogScreen() {
    var container = document.getElementById('log-content');
    if (!container) return;
    logInitListeners();
    logLastRenderDay = dailyLogToday();

    var data = dailyLogLoad();
    var checkpointHist = logCheckpointHistory();
    var dates = Object.keys(data).filter(logValidKey);
    checkpointHist.forEach(function(a) { if (logValidKey(a.date) && dates.indexOf(a.date) === -1) dates.push(a.date); });
    dates.sort().reverse();

    if (!dates.length) {
        container.innerHTML = '<div class="plan-empty-state">📋<br>Nothing logged yet. Once you study something, each day shows up here.</div>';
        return;
    }

    var oldest = dates[dates.length - 1];
    var html = '';
    dates.forEach(function(date) {
        var checkpointForDay = checkpointHist.filter(function(a) { return a.date === date; });
        html += renderLogDayCard(date, data[date], checkpointForDay, date === oldest);
    });
    container.innerHTML = html;
}

function renderLogDayCard(date, entry, checkpointForDay, isOldest) {
    var info = logDayInfo(entry, checkpointForDay);
    var expanded = !!logExpanded[date];
    var isToday = date === dailyLogToday();
    var note = '';
    // The log only exists since DAILY_LOG_STARTED; the Plan files older study under Week 1.
    if (isOldest && typeof B1_WEEKS !== 'undefined' && B1_WEEKS.length && date <= planDayKey(planAddDays(planDate(B1_WEEKS[0].from), 6))) {
        note = '<div class="log-day-note">The daily log started on ' + logEsc(planFmtDate(planDate(DAILY_LOG_STARTED), true)) +
            '. Anything you studied before that is counted under Week 1 on the Plan.</div>';
    }
    return '<div class="log-day-card' + (isToday ? ' today' : '') + (expanded ? ' expanded' : '') + '" data-date="' + logEsc(date) + '" onclick="logToggleDay(this)">' +
        '<div class="log-day-header">' +
            '<span class="log-day-date">' + logEsc(logLabelFor(date)) + '</span>' +
            '<span class="log-day-chevron">&#9654;</span>' +
        '</div>' +
        '<div class="log-day-summary">' + logEsc(logSummaryText(info)) + '</div>' +
        note +
        '<div class="log-day-detail"' + (expanded ? ' data-built="1">' + logDetailHtml(info) : '>') + '</div>' +
    '</div>';
}

// Detail rows are built on first expand, so the list stays light as it grows.
function logToggleDay(card) {
    var date = card.getAttribute('data-date');
    var open = !card.classList.contains('expanded');
    if (open) {
        var detail = card.querySelector('.log-day-detail');
        if (detail && !detail.getAttribute('data-built')) {
            var hist = logCheckpointHistory().filter(function(a) { return a.date === date; });
            detail.innerHTML = logDetailHtml(logDayInfo(dailyLogLoad()[date], hist));
            detail.setAttribute('data-built', '1');
        }
        card.classList.add('expanded');
        logExpanded[date] = true;
    } else {
        card.classList.remove('expanded');
        delete logExpanded[date];
    }
}

function logSetScroll(y) {
    var el = document.getElementById('log-screen');
    if (!el) return;
    el.scrollTop = y;
    if (!el.classList.contains('active') || el.scrollTop !== y) {
        setTimeout(function() { el.scrollTop = y; }, 0);
    }
}

// Tab lifecycle hooks, called by switchTab() in app.js.
function logOnEnter(isReTap) {
    var dayChanged = logLastRenderDay !== null && logLastRenderDay !== dailyLogToday();
    renderLogScreen();
    logSetScroll(isReTap || dayChanged ? 0 : logScrollY);
}

function logOnLeave() {
    var el = document.getElementById('log-screen');
    if (el && el.classList.contains('active')) logScrollY = el.scrollTop;
}
