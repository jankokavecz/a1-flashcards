// plan.js — renders the Plan tab (the app's home screen) from b1-plan.js's
// B1_WEEKS / B1_PHASES / B1_SLOTS / B1_RHYTHMS / B1_RECOVERIES / B1_KEY_DATES.
// Loaded via <script> tag. ES5 only. Word numbers come from app.js
// (wordStats, wordsFirstSeenBetween, ...), always read lazily and guarded.

var PLAN_WEEKS_KEY = 'plan-weeks';
var PLAN_DAYS_KEY = 'plan-days';
var PLAN_WORD_PAGE = 30;

var planCurrentWeekDetail = null; // week number, or null for the overview
var planOverviewScroll = 0;
var planLastRenderDay = null;
var planDetailGroups = {};
var planListenersReady = false;

// ── Date helpers ────────────────────────────────────────────────
// planDate() parses 'YYYY-MM-DD' by hand -- new Date(iso) parses at UTC
// midnight, which shifts the calendar day in negative-UTC-offset zones.
// All day math works on calendar dates (never +24h*n) so DST can't shift it.

var PLAN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var PLAN_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
var PLAN_DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
var PLAN_DAY_ABBR = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function planDate(iso) {
    var parts = String(iso || '').split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

function planToday() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function planAddDays(date, n) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

function planDayKey(date) {
    var y = date.getFullYear();
    var m = ('0' + (date.getMonth() + 1)).slice(-2);
    var d = ('0' + date.getDate()).slice(-2);
    return y + '-' + m + '-' + d;
}

function planWeekdayIndex(date) {
    var js = date.getDay(); // 0=Sunday..6=Saturday
    return js === 0 ? 6 : js - 1; // 0=Monday..6=Sunday
}

function planDaysBetween(a, b) {
    var ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((ub - ua) / 86400000);
}

function planFmtDate(date, withYear, withWeekday) {
    return (withWeekday ? PLAN_WEEKDAYS[planWeekdayIndex(date)] + ' ' : '') +
        date.getDate() + ' ' + PLAN_MONTHS[date.getMonth()] + (withYear ? ' ' + date.getFullYear() : '');
}

function planPlural(n, word) {
    return n + ' ' + word + (n === 1 ? '' : 's');
}

function planPad2(n) {
    return ('0' + n).slice(-2);
}

function planWeekEndExcl(week) {
    return planAddDays(planDate(week.from), 7);
}

function planFindWeek(n) {
    if (typeof B1_WEEKS === 'undefined') return null;
    for (var i = 0; i < B1_WEEKS.length; i++) {
        if (B1_WEEKS[i].n === n) return B1_WEEKS[i];
    }
    return null;
}

function planCurrentWeek() {
    if (typeof B1_WEEKS === 'undefined') return null;
    var today = planToday();
    for (var i = 0; i < B1_WEEKS.length; i++) {
        var week = B1_WEEKS[i];
        var weekStart = planDate(week.from);
        if (today >= weekStart && today < planAddDays(weekStart, 7)) return week;
    }
    return null;
}

function planPhaseFor(week) {
    for (var i = 0; i < B1_PHASES.length; i++) {
        if (B1_PHASES[i].id === week.phase) return B1_PHASES[i];
    }
    return null;
}

function planRhythmTask(week, dayIdx) {
    var rhythm = typeof B1_RHYTHMS !== 'undefined' ? B1_RHYTHMS[week.rhythm] : null;
    if (!rhythm) return null;
    for (var i = 0; i < rhythm.days.length; i++) {
        if (rhythm.days[i].day === dayIdx) return rhythm.days[i];
    }
    return null;
}

// The week's evening text carries per-day items ('Sa: Aufgabe 1',
// 'Setup week — Mo: check ...', 'Sa 2 Jan: ...'); return the one for dayIdx.
function planDaySegment(week, dayIdx) {
    var parts = String(week.evening || '').split(' · ');
    var re = /(?:^|—\s*)(Mo|Di|Mi|Do|Fr|Sa|So)(?:\s+\d{1,2}\s+[A-Za-z]{3,4})?:\s*(.+)$/;
    for (var i = 0; i < parts.length; i++) {
        var m = re.exec(parts[i]);
        if (m && PLAN_DAY_ABBR.indexOf(m[1]) === dayIdx) return m[2];
    }
    return null;
}

function planTodayTask() {
    var week = planCurrentWeek();
    if (!week) return null;
    var idx = planWeekdayIndex(planToday());
    var also = planDaySegment(week, idx);
    // The setup week has its own day list; the evening rhythm doesn't apply yet.
    if (week.phase === 0 && also) return { label: 'Setup', task: also, also: null };
    var t = planRhythmTask(week, idx);
    if (!t) return also ? { label: 'Today', task: also, also: null } : null;
    return { label: t.label, task: t.task, also: also };
}

function planPhaseColor(phaseId) {
    var colors = ['#5b8def', '#9b7ede', '#e08a4a', '#ef4444', '#10b981'];
    return colors[phaseId % colors.length];
}

// ── Storage ─────────────────────────────────────────────────────

function planLoad(key) {
    try {
        var v = JSON.parse(localStorage.getItem(key) || '{}');
        return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    } catch (e) { return {}; }
}

function planSave(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
}

function planIsWeekDone(weekN) {
    return !!planLoad(PLAN_WEEKS_KEY)['w' + weekN];
}

function planToggleWeek(weekN) {
    var data = planLoad(PLAN_WEEKS_KEY);
    data['w' + weekN] = !data['w' + weekN];
    planSave(PLAN_WEEKS_KEY, data);
}

function planIsDayDone(dayKey) {
    return !!planLoad(PLAN_DAYS_KEY)[dayKey];
}

function planToggleDay(dayKey) {
    var data = planLoad(PLAN_DAYS_KEY);
    data[dayKey] = !data[dayKey];
    planSave(PLAN_DAYS_KEY, data);
}

function planLogLoad() {
    var log = typeof dailyLogLoad === 'function' ? planTry(dailyLogLoad) : null;
    return (log && typeof log === 'object' && !Array.isArray(log)) ? log : {};
}

function planArr(v) {
    return Array.isArray(v) ? v : [];
}

function planTry(fn) {
    try { return fn(); } catch (e) { return null; }
}

function planNum(v) {
    return (typeof v === 'number' && isFinite(v)) ? Math.round(v) : 0;
}

// ── Lookups ─────────────────────────────────────────────────────

var planWordIndex = null;
var planGrammarIndex = null;

function planWordById(id) {
    if (!planWordIndex) {
        if (typeof ALL_WORDS === 'undefined') return null;
        planWordIndex = {};
        ALL_WORDS.forEach(function(w) { planWordIndex[String(w.id)] = w; });
    }
    return planWordIndex[String(id)] || null;
}

function planGrammarById(id) {
    if (!planGrammarIndex) {
        if (typeof ALL_GRAMMAR === 'undefined') return null;
        planGrammarIndex = {};
        ALL_GRAMMAR.forEach(function(s) { planGrammarIndex[String(s.id)] = s; });
    }
    return planGrammarIndex[String(id)] || null;
}

function planScooterTrackId(n) {
    if (typeof B1_TRACKS !== 'undefined' && B1_TRACKS) {
        for (var i = 0; i < B1_TRACKS.length; i++) {
            var t = B1_TRACKS[i];
            if (t && t.n === n && t.season !== 'gym') return t.id;
        }
    }
    return 's1-' + planPad2(n);
}

function planTrackExists(id) {
    if (typeof tracksExists === 'function') return !!planTry(function() { return tracksExists(id); });
    if (typeof B1_TRACKS === 'undefined' || !B1_TRACKS) return false;
    for (var i = 0; i < B1_TRACKS.length; i++) {
        if (B1_TRACKS[i] && B1_TRACKS[i].id === id) return true;
    }
    return false;
}

function planSeasonExists(n) {
    return typeof B1_TRACK_SEASONS !== 'undefined' && !!B1_TRACK_SEASONS && !!B1_TRACK_SEASONS['s' + n];
}

// ── Linkify week/task text into buttons that jump to Tracks or Exam ──

function escapeHtml(s) {
    return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

var PLAN_EXAM_MODULES = { 'Hören': 'hoeren_b1', 'Lesen': 'lesen_b1', 'Schreiben': 'schreiben_b1', 'Sprechen': 'sprechen_b1' };

// Speak (calls.js / b1-calls.js) scenarios for the plan's Sprechen role-plays.
var PLAN_SPEAK_SCENARIOS = { '1': 'sprechen_teil1_plan', '2': 'sprechen_teil2_presentation', '3': 'sprechen_teil3_feedback' };

// A single 'Lesen Teil 4' / 'Aufgabe 3' opens just that Teil, with its own
// timer; a range ('Lesen T3-5', 'Teil 3+4', 'Aufgabe 1 and 3') opens the
// whole module.
var PLAN_LINK_PATTERNS = [
    { re: /Scooter Tracks?\s*(\d+)(?:\s*-\s*\d+)?/g, build: function(m) { return { tab: 'tracks', arg: planScooterTrackId(parseInt(m[1], 10)) }; } },
    { re: /Gym Session\s*(\d+)/g, build: function(m) { return { tab: 'tracks', arg: 'gym-' + planPad2(m[1]) }; } },
    { re: /(Hören|Lesen|Schreiben|Sprechen)\s+(?:Teil|T)\s*(\d+)((?:\s*[-+–\/]\s*(?:Teil|T)?\s*\d+)*)/g, build: function(m) { return { tab: 'exam', arg: PLAN_EXAM_MODULES[m[1]], teil: m[3] ? null : parseInt(m[2], 10) }; } },
    { re: /Aufgabe\s*(\d+)((?:\s*[-+–\/]\s*\d+|\s+(?:and|und)\s+\d\b)*)/g, build: function(m) { return { tab: 'exam', arg: 'schreiben_b1', teil: m[2] ? null : parseInt(m[1], 10) }; } },
    { re: /Teil\s*([123])\s+(?:planning\s+)?role-play/g, build: function(m) { return { tab: 'calls', arg: PLAN_SPEAK_SCENARIOS[m[1]] }; } },
    { re: /Sprechen mock|AI examiner/g, generic: true, build: function() { return { tab: 'exam', arg: 'sprechen_b1' }; } }
];

// The daily evening task's label links to the matching part of the app.
var PLAN_TASK_LINKS = {
    'Lesen':     { tab: 'exam', arg: 'lesen_b1' },
    'Schreiben': { tab: 'exam', arg: 'schreiben_b1' },
    'Hören':     { tab: 'exam', arg: 'hoeren_b1' },
    'Sprechen':  { tab: 'exam', arg: 'sprechen_b1' },
    'Listening': { tab: 'exam', arg: 'hoeren_b1' },
    'Writing':   { tab: 'exam', arg: 'schreiben_b1' },
    'Speaking':  { tab: 'calls', arg: '' },
    'Grammar':   { tab: 'grammar', arg: '' },
    'Cards':     { tab: 'cards', arg: '' }
};

// 'grammar 13-14' in the plan means chapters of the Grammatik aktiv book,
// not the app's Grammar tab, so say so on screen.
function planDisplayText(text) {
    return String(text || '').replace(/\bgrammar (?:ch\. )?(\d+(?:-\d+)?)/g, 'Grammatik aktiv ch. $1');
}

function planSafeArg(s) {
    return String(s || '').replace(/[^\w-]/g, '');
}

// teil (optional): the Teil/Aufgabe number for a single-Teil exam drill.
function planLinkButton(tab, arg, labelHtml, extraClass, teil) {
    var n = parseInt(teil, 10);
    return '<button type="button" class="plan-link' + (extraClass ? ' ' + extraClass : '') + '" onclick="planGoto(\'' +
        planSafeArg(tab) + '\',\'' + planSafeArg(arg) + '\'' + (n > 0 ? ',' + n : '') + ')">' + labelHtml + '</button>';
}

function planLinkify(text, skipDest) {
    text = planDisplayText(text);
    var matches = [];
    PLAN_LINK_PATTERNS.forEach(function(pattern) {
        pattern.re.lastIndex = 0;
        var m;
        while ((m = pattern.re.exec(text)) !== null) {
            var dest = pattern.build(m);
            matches.push({ start: m.index, end: m.index + m[0].length, label: m[0], tab: dest.tab, arg: dest.arg, teil: dest.teil, generic: !!pattern.generic });
        }
    });
    matches.sort(function(a, b) { return (a.start - b.start) || (b.end - a.end); });
    var clean = [];
    var lastEnd = -1;
    matches.forEach(function(m) {
        if (m.start >= lastEnd) { clean.push(m); lastEnd = m.end; }
    });
    var specific = {};
    clean.forEach(function(m) { if (!m.generic) specific[m.tab + ':' + m.arg] = true; });

    var html = '';
    var pos = 0;
    var notInApp = false;
    clean.forEach(function(m) {
        var key = m.tab + ':' + m.arg;
        if (m.generic && (specific[key] || key === skipDest)) return;
        html += escapeHtml(text.slice(pos, m.start));
        if (m.tab === 'tracks' && !planTrackExists(m.arg)) {
            html += escapeHtml(m.label);
            notInApp = true;
        } else {
            html += planLinkButton(m.tab, m.arg, escapeHtml(m.label), '', m.teil);
        }
        pos = m.end;
    });
    html += escapeHtml(text.slice(pos));
    // After the whole text, so it never splits the plan's own sentence.
    if (notInApp) html += ' <span class="plan-muted-note">· not in the app yet</span>';
    return html;
}

function planGoto(tab, arg, teil) {
    if (typeof switchTab !== 'function') return;
    if (tab === 'tracks') {
        switchTab('tracks');
        if (arg && planTrackExists(arg) && typeof tracksOpenTrack === 'function') tracksOpenTrack(arg);
        return;
    }
    if (tab === 'exam') {
        switchTab('exam');
        if (arg && typeof examOpenSection === 'function') examOpenSection(arg, teil ? Number(teil) : null);
        return;
    }
    if (tab === 'calls') {
        switchTab('calls');
        if (arg && typeof callsShowScenario === 'function') callsShowScenario(arg);
        return;
    }
    switchTab(tab);
}

function planStartCheckpoint() {
    if (typeof switchTab !== 'function') return;
    switchTab('exam');
    if (typeof checkpointStart === 'function') checkpointStart();
}

function planOpenWords(opts) {
    if (typeof openMyWords === 'function') { openMyWords(opts); return; }
    if (typeof switchTab === 'function') switchTab('words');
}

// ── Word numbers ────────────────────────────────────────────────

function planWordStats() {
    if (typeof wordStats === 'function') {
        var s = planTry(wordStats);
        if (s && typeof s === 'object') return s;
    }
    if (typeof wordProgress === 'undefined' || !wordProgress) return null;
    var seen = 0, learned = 0, due = 0, now = Date.now();
    for (var id in wordProgress) {
        var p = wordProgress[id];
        if (!p || typeof p !== 'object') continue;
        seen++;
        if ((p.level || 0) >= 3) learned++;
        var when = p.due !== undefined ? p.due : p.nextReview;
        if (when && when <= now) due++;
    }
    var counts = typeof srsTodayCounts === 'function' ? planTry(srsTodayCounts) : null;
    return { seen: seen, learned: learned, learnedEver: learned, newToday: counts ? counts['new'] || 0 : 0, dueNow: due };
}

function planLearnedEver(stats) {
    if (!stats) return 0;
    return planNum(stats.learnedEver !== undefined ? stats.learnedEver : stats.learned);
}

function planWordTarget(text) {
    var m = /(\d{1,3}(?:,\d{3})+|\d+)\s+words/.exec(String(text || ''));
    return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
}

function planIdsBetween(fn, fromMs, toMs) {
    if (typeof fn !== 'function') return null;
    var ids = planTry(function() { return fn(fromMs, toMs); });
    return Array.isArray(ids) ? ids : null;
}

// Learned words per day over the last 14 days (or since the plan started).
function planLearnedPace(learnedEver) {
    var today = planToday();
    var start = planDate(B1_KEY_DATES.planStart);
    var elapsed = planDaysBetween(start, today) + 1;
    if (elapsed < 1) return 0;
    var days = Math.min(14, elapsed);
    var from = planAddDays(today, 1 - days);
    var ids = planIdsBetween(typeof wordsLearnedBetween === 'function' ? wordsLearnedBetween : null,
        from.getTime(), planAddDays(today, 1).getTime());
    if (ids) return ids.length / days;
    return learnedEver / elapsed;
}

function planMilestoneStatus(week, stats) {
    var target = planWordTarget(week.milestone);
    if (!target || !stats) return null;
    var learned = planLearnedEver(stats);
    var today = planToday();
    var endExcl = planWeekEndExcl(week);
    var endLabel = planFmtDate(planAddDays(endExcl, -1));
    if (today >= endExcl) {
        var then = planIdsBetween(typeof wordsLearnedBetween === 'function' ? wordsLearnedBetween : null, 0, endExcl.getTime());
        if (!then) return { cls: learned >= target ? 'ok' : 'behind', target: target, text: learned + ' learned now' };
        return { cls: then.length >= target ? 'ok' : 'behind', target: target,
            text: then.length + ' learned by ' + endLabel + (then.length >= target ? ' · reached ✓' : ' · target missed') + ' · ' + learned + ' now' };
    }
    if (learned >= target) return { cls: 'ok', target: target, text: learned + ' learned · reached ✓' };
    if (today < planDate(B1_KEY_DATES.planStart)) return { cls: '', target: target, text: learned + ' learned so far' };
    var pace = planLearnedPace(learned);
    var projected = Math.round(learned + pace * planDaysBetween(today, endExcl));
    var ok = projected >= target;
    return { cls: ok ? 'ok' : 'behind', target: target,
        text: learned + ' learned · ' + (ok ? 'on track' : 'behind') + ' (~' + projected + ' by ' + endLabel +
            ' at ' + (Math.round(pace * 10) / 10) + '/day)' };
}

function planMilestoneHtml(week, stats) {
    if (!week.milestone) return '';
    var html = '<div class="plan-week-range">🏁 ' + escapeHtml(week.milestone);
    var season = /Season (\d+) done/.exec(week.milestone);
    if (season && !planSeasonExists(parseInt(season[1], 10))) html += ' <span class="plan-muted-note">(Season ' + season[1] + ' is not in the app yet)</span>';
    html += '</div>';
    var st = planMilestoneStatus(week, stats);
    if (st) html += '<div class="plan-milestone-words ' + st.cls + '">' + escapeHtml(st.text) + '</div>';
    return html;
}

function planNextWordMilestone() {
    var today = planToday();
    for (var i = 0; i < B1_WEEKS.length; i++) {
        var w = B1_WEEKS[i];
        if (planWordTarget(w.milestone) && planWeekEndExcl(w) > today) return w;
    }
    return null;
}

function planWordsCardHtml(stats) {
    if (!stats) return '';
    var parts = [
        '<strong>Learned ' + planLearnedEver(stats) + '</strong>',
        'Seen ' + planNum(stats.seen),
        '+' + planNum(stats.newToday) + ' today',
        planNum(stats.dueNow) + ' due now'
    ];
    var html = '<div class="plan-words-card" role="button" onclick="planOpenWords()">' +
        '<div class="plan-words-top"><span class="plan-words-title">📖 Words</span><span class="plan-week-chevron">&#9654;</span></div>' +
        '<div class="plan-words-stats">' + parts.join(' · ') + '</div>';
    var next = planNextWordMilestone();
    var st = next ? planMilestoneStatus(next, stats) : null;
    if (st) {
        html += '<div class="plan-milestone-words ' + st.cls + '">Next target: ' + st.target + ' words by ' +
            planFmtDate(planAddDays(planWeekEndExcl(next), -1)) + ' (week ' + next.n + ') — ' + escapeHtml(st.text) + '</div>';
    }
    return html + '</div>';
}

// ── Week activity (what was actually studied that calendar week) ────

var PLAN_LOG_CATS = ['wordsNew', 'wordsReview', 'wordsAgain', 'wordsMarked', 'practiced', 'exams', 'grammar', 'tracks', 'scenes', 'calls'];

function planWeekActivity(week, log) {
    log = log || planLogLoad();
    var fromKey = week.from;
    var toKey = planDayKey(planAddDays(planDate(week.from), 6));
    var out = {};
    var seen = {};
    PLAN_LOG_CATS.forEach(function(cat) { out[cat] = []; seen[cat] = {}; });
    Object.keys(log).sort().forEach(function(dateKey) {
        if (dateKey < fromKey || dateKey > toKey) return;
        var entry = log[dateKey];
        if (!entry || typeof entry !== 'object') return;
        PLAN_LOG_CATS.forEach(function(cat) {
            planArr(entry[cat]).forEach(function(id) {
                var k = String(id);
                if (seen[cat][k]) return;
                seen[cat][k] = true;
                out[cat].push(id);
            });
        });
    });
    return out;
}

// Word groups for a week, with unknown ids dropped so counts match the cards.
function planWeekWordGroups(week, act) {
    var start = planDate(week.from);
    var fromMs = start.getTime();
    var toMs = planAddDays(start, 7).getTime();
    var newIds = planIdsBetween(typeof wordsFirstSeenBetween === 'function' ? wordsFirstSeenBetween : null, fromMs, toMs);
    var learnedIds = planIdsBetween(typeof wordsLearnedBetween === 'function' ? wordsLearnedBetween : null, fromMs, toMs);

    function toWords(ids, exclude) {
        var out = [];
        var used = {};
        planArr(ids).forEach(function(id) {
            var k = String(id);
            if (used[k] || (exclude && exclude[k])) return;
            var w = planWordById(id);
            if (!w) return;
            used[k] = true;
            out.push(w);
        });
        return out;
    }

    var newWords = toWords(newIds || act.wordsNew);
    var learnedWords = toWords(learnedIds || []);
    var taken = {};
    newWords.concat(learnedWords).forEach(function(w) { taken[String(w.id)] = true; });
    return {
        newWords: newWords,
        learnedWords: learnedWords,
        hasLearned: !!learnedIds,
        reviewedWords: toWords(act.wordsReview, taken)
    };
}

function planWeekRowActivity(week, log) {
    if (planToday() < planDate(week.from)) return '';
    var g = planWeekWordGroups(week, planWeekActivity(week, log));
    var parts = [];
    if (g.newWords.length) parts.push(g.newWords.length + ' new');
    if (g.hasLearned && g.learnedWords.length) parts.push(g.learnedWords.length + ' learned');
    if (!g.hasLearned && g.reviewedWords.length) parts.push(g.reviewedWords.length + ' reviewed');
    return parts.length ? '<div class="plan-week-activity">' + parts.join(' · ') + '</div>' : '';
}

// ── Navigation within the Plan tab ──────────────────────────────

function planScreenEl() {
    return document.getElementById('plan-screen');
}

function planIsActive() {
    var el = planScreenEl();
    return !!el && el.classList.contains('active');
}

function planSetScroll(y) {
    var el = planScreenEl();
    if (!el) return;
    el.scrollTop = y;
    if (!el.classList.contains('active') || el.scrollTop !== y) {
        setTimeout(function() { el.scrollTop = y; }, 0);
    }
}

function planDayChanged() {
    return planLastRenderDay !== null && planLastRenderDay !== planDayKey(planToday());
}

function planShowWeekDetail(weekNum) {
    var el = planScreenEl();
    if (el && planCurrentWeekDetail === null) planOverviewScroll = el.scrollTop;
    planCurrentWeekDetail = weekNum;
    renderPlanScreen();
    planSetScroll(0);
}

function planBackToOverview() {
    var dayChanged = planDayChanged();
    planCurrentWeekDetail = null;
    renderPlanScreen();
    planSetScroll(dayChanged ? 0 : planOverviewScroll);
}

// Tab lifecycle hooks, called by switchTab() in app.js.
function planOnEnter(isReTap) {
    var dayChanged = planDayChanged();
    var wasDetail = planCurrentWeekDetail !== null;
    planCurrentWeekDetail = null;
    renderPlanScreen();
    if (dayChanged) planSetScroll(0);
    else if (wasDetail) planSetScroll(planOverviewScroll);
    else planSetScroll(isReTap ? 0 : planOverviewScroll);
}

function planOnLeave() {
    var el = planScreenEl();
    if (el && planCurrentWeekDetail === null && el.classList.contains('active')) planOverviewScroll = el.scrollTop;
}

function planCheckRollover(resumed) {
    if (!planIsActive()) return;
    if (planDayChanged()) {
        if (planCurrentWeekDetail === null) {
            // Reset the saved position too: the scroll event that would
            // update it fires later, so a planOnEnter() in between would
            // otherwise restore yesterday's position.
            planOverviewScroll = 0;
            renderPlanScreen();
            planSetScroll(0);
        } else {
            planOverviewScroll = 0;
            renderPlanScreen();
        }
    } else if (resumed && planCurrentWeekDetail === null) {
        renderPlanScreen();
    }
}

function planInitListeners() {
    if (planListenersReady) return;
    var el = planScreenEl();
    if (!el) return;
    planListenersReady = true;
    el.addEventListener('scroll', function() {
        if (planCurrentWeekDetail === null && el.classList.contains('active')) planOverviewScroll = el.scrollTop;
    });
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') planCheckRollover(true);
    });
    window.addEventListener('pageshow', function(e) {
        if (e && e.persisted) planCheckRollover(true);
    });
    setInterval(function() { planCheckRollover(false); }, 60000);
}

// ── Week detail ─────────────────────────────────────────────────

var PLAN_WORD_STATES = { learning: 1, learned: 1, mastered: 1 };

function planRenderWordCard(w) {
    var deClass = 'word-de';
    if (w.type === 'noun' && w.gender && w.plural !== w.de) deClass += ' word-de-gender-' + planSafeArg(w.gender);
    var state = typeof wordState === 'function' ? planTry(function() { return wordState(w.id); }) : null;
    return '<div class="plan-word-card">' +
        '<div class="plan-word-top">' +
            '<span class="' + deClass + '">' + escapeHtml(w.de) + '</span>' +
            (w.type ? '<span class="word-type-badge type-' + planSafeArg(w.type) + '">' + escapeHtml(w.type) + '</span>' : '') +
            (PLAN_WORD_STATES.hasOwnProperty(state) ? '<span class="plan-word-new-badge plan-word-state ' + state + '">' + state + '</span>' : '') +
        '</div>' +
        '<div class="plan-word-en">' + escapeHtml(w.en) + '</div>' +
        (w.plural ? '<div class="plan-word-plural">Plural: ' + escapeHtml(w.plural) + '</div>' : '') +
        (w.example ? '<div class="plan-word-example">"' + escapeHtml(w.example.de) + '"</div><div class="plan-word-example-en">' + escapeHtml(w.example.en) + '</div>' : '') +
    '</div>';
}

function planRenderGrammarContentItem(item) {
    switch (item.type) {
        case 'text':
            return '<p class="grammar-text">' + escapeHtml(item.value) + '</p>';
        case 'heading':
            return '<h3 class="grammar-heading">' + escapeHtml(item.value) + '</h3>';
        case 'table':
            var thead = '<thead><tr>' + planArr(item.headers).map(function(h) { return '<th>' + escapeHtml(h) + '</th>'; }).join('') + '</tr></thead>';
            var tbody = '<tbody>' + planArr(item.rows).map(function(row) {
                return '<tr>' + planArr(row).map(function(cell) { return '<td>' + escapeHtml(cell) + '</td>'; }).join('') + '</tr>';
            }).join('') + '</tbody>';
            return '<div style="overflow-x:auto"><table class="grammar-table">' + thead + tbody + '</table></div>';
        case 'example':
            return '<div class="grammar-example"><div class="de">' + escapeHtml(item.de) + '</div><div class="en">' + escapeHtml(item.en) + '</div></div>';
        case 'tip':
            return '<div class="grammar-tip">💡 ' + escapeHtml(item.value) + '</div>';
        default:
            return '';
    }
}

function planRenderGrammarChapter(sec) {
    var body = planArr(sec.content).map(planRenderGrammarContentItem).join('');
    return '<div class="grammar-section">' +
        '<button type="button" class="grammar-section-header" onclick="planToggleChapter(this)"><span class="emoji">' + escapeHtml(sec.emoji) + '</span><span>' + escapeHtml(sec.title) + '</span><span class="chevron">&#9654;</span></button>' +
        '<div class="grammar-section-body">' + body + '</div>' +
    '</div>';
}

function planToggleChapter(btn) {
    if (btn && btn.parentNode) btn.parentNode.classList.toggle('open');
}

function planWordGroupHtml(key, title, words, initial) {
    if (!words.length) return '';
    planDetailGroups[key] = words;
    var html = '<div class="plan-section-title">' + escapeHtml(title) + ' (' + words.length + ')</div>';
    html += '<div id="plan-group-' + key + '">';
    for (var i = 0; i < Math.min(initial, words.length); i++) html += planRenderWordCard(words[i]);
    html += '</div>';
    if (words.length > initial) {
        html += '<button type="button" class="plan-show-all" id="plan-more-' + key + '" onclick="planShowAllWords(\'' + key + '\',' + initial + ')">Show all ' + words.length + '</button>';
    }
    return html;
}

function planShowAllWords(key, from) {
    var words = planDetailGroups[key];
    var box = document.getElementById('plan-group-' + key);
    if (!words || !box) return;
    var html = '';
    for (var i = from || 0; i < words.length; i++) html += planRenderWordCard(words[i]);
    box.insertAdjacentHTML('beforeend', html);
    var btn = document.getElementById('plan-more-' + key);
    if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
}

function planPracticeWeek(weekNum) {
    var week = planFindWeek(weekNum);
    if (!week || typeof startPracticeSession !== 'function') return;
    var g = planWeekWordGroups(week, planWeekActivity(week));
    var ids = g.newWords.map(function(w) { return w.id; });
    if (ids.length) startPracticeSession(ids, 'Week ' + week.n);
}

function planOpenWeekWords(weekNum) {
    var week = planFindWeek(weekNum);
    if (!week) return;
    var start = planDate(week.from);
    planOpenWords({ from: start.getTime(), to: planAddDays(start, 7).getTime(), label: 'Week ' + week.n });
}

function planSlotRowsHtml(week) {
    var html = '';
    [B1_SLOTS.scooter, B1_SLOTS.gym, B1_SLOTS.evening].forEach(function(slot) {
        var text = slot.id === 'scooter' ? week.scooter : (slot.id === 'gym' ? week.gym : week.evening);
        if (!text) return;
        html += '<div class="plan-slot-row"><span class="plan-slot-emoji">' + slot.emoji + '</span>' +
            '<span class="plan-slot-name">' + escapeHtml(slot.name) + '</span>' +
            '<span class="plan-slot-task">' + planLinkify(text) + '</span></div>';
    });
    return html;
}

function renderPlanWeekDetail(container, weekNum) {
    var week = planFindWeek(weekNum);
    if (!week) {
        planCurrentWeekDetail = null;
        renderPlanOverview(container);
        return;
    }
    var today = planToday();
    var start = planDate(week.from);
    var endExcl = planWeekEndExcl(week);
    var started = today >= start;
    var phase = planPhaseFor(week);
    var stats = planWordStats();
    planLastRenderDay = planDayKey(today);
    planDetailGroups = {};

    var html = '<div class="plan-detail-header"><button type="button" class="tracks-back-btn" onclick="planBackToOverview()">&larr; Plan</button></div>';
    html += '<div class="plan-header-week" style="margin-bottom:2px;">Week ' + week.n + ' · ' + escapeHtml(week.label) + (phase ? ' · ' + escapeHtml(phase.name) : '') + '</div>';
    var when = planFmtDate(start, false, true) + ' – ' + planFmtDate(planAddDays(endExcl, -1), true, true);
    if (!started) when += ' · starts in ' + planPlural(planDaysBetween(today, start), 'day');
    else if (today < endExcl) when += ' · this week';
    html += '<div class="plan-week-range" style="margin-bottom:6px;">' + escapeHtml(when) + '</div>';
    html += planMilestoneHtml(week, stats);

    var act = planWeekActivity(week);
    var g = planWeekWordGroups(week, act);
    var grammar = act.grammar.map(planGrammarById).filter(Boolean);
    var tracks = act.tracks.map(function(id) { return typeof logTrackName === 'function' ? logTrackName(id) : id; });

    var summary = [];
    if (g.newWords.length) summary.push(planPlural(g.newWords.length, 'new word'));
    if (g.learnedWords.length) summary.push(g.learnedWords.length + ' learned');
    if (g.reviewedWords.length) summary.push(g.reviewedWords.length + ' reviewed');
    if (grammar.length) summary.push(planPlural(grammar.length, 'grammar chapter'));
    if (tracks.length) summary.push(planPlural(tracks.length, 'track'));
    if (act.scenes.length) summary.push(planPlural(act.scenes.length, 'scene'));
    if (act.calls.length) summary.push(planPlural(act.calls.length, 'call'));
    if (act.exams.length) summary.push(planPlural(act.exams.length, 'exam'));

    if (!started) {
        html += '<div class="plan-empty-state">This week hasn\'t started yet.</div>';
    } else if (!summary.length) {
        html += '<div class="plan-empty-state">Nothing logged for this week' + (today < endExcl ? ' yet' : '') + '.</div>';
    } else {
        html += '<div class="plan-today-card plan-detail-summary">' + escapeHtml(summary.join(' · ')) + '</div>';
    }

    if (g.newWords.length && typeof startPracticeSession === 'function') {
        html += '<button type="button" class="btn btn-primary plan-practice-btn" onclick="planPracticeWeek(' + week.n + ')">' +
            'Review this week\'s words as flashcards (' + g.newWords.length + ')</button>';
    }
    if (started && (g.newWords.length || g.learnedWords.length) && typeof openMyWords === 'function') {
        html += '<div class="plan-detail-links">' + '<button type="button" class="plan-link" onclick="planOpenWeekWords(' + week.n + ')">Open this week in My Words</button></div>';
    }

    html += '<div class="plan-section-title">Planned</div><div class="plan-today-card">' + planSlotRowsHtml(week) + '</div>';

    if (grammar.length) {
        html += '<div class="plan-section-title">Grammar (' + grammar.length + ')</div>';
        grammar.forEach(function(sec) { html += planRenderGrammarChapter(sec); });
    }

    var also = '';
    if (tracks.length) also += '<div class="log-detail-row"><span class="log-detail-label">Tracks</span>' + escapeHtml(tracks.join(', ')) + '</div>';
    if (act.scenes.length) also += '<div class="log-detail-row"><span class="log-detail-label">Scenes</span>' + escapeHtml(act.scenes.join(', ')) + '</div>';
    if (act.calls.length) also += '<div class="log-detail-row"><span class="log-detail-label">Speak calls</span>' + escapeHtml(act.calls.join(', ')) + '</div>';
    if (act.exams.length) also += '<div class="log-detail-row"><span class="log-detail-label">Exam practice</span>' + escapeHtml(act.exams.join(', ')) + '</div>';
    if (also) html += '<div class="plan-section-title">Also this week</div><div class="plan-today-card">' + also + '</div>';

    html += planWordGroupHtml('new', 'New this week', g.newWords, PLAN_WORD_PAGE);
    html += planWordGroupHtml('learned', 'Learned this week', g.learnedWords, PLAN_WORD_PAGE);
    html += planWordGroupHtml('reviewed', 'Also reviewed', g.reviewedWords, 0);

    if (summary.length) {
        html += '<div class="plan-detail-header" style="margin-top:14px;"><button type="button" class="tracks-back-btn" onclick="planBackToOverview()">&larr; Plan</button></div>';
    }
    container.innerHTML = html;
}

// ── Overview ────────────────────────────────────────────────────

function planHeaderHtml(today, week, stats) {
    var kd = B1_KEY_DATES;
    var start = planDate(kd.planStart);
    var end = planDate(kd.planEnd);
    var sitting = planDate(kd.sittingWindow);
    var deadline = planDate(kd.hardDeadline);
    var dS = planDaysBetween(today, sitting);
    var dD = planDaysBetween(today, deadline);
    var sittingTxt = '<span class="plan-nowrap">' + planFmtDate(sitting, true) + '</span>';
    var deadlineTxt = '<span class="plan-nowrap">' + planFmtDate(deadline, true) + '</span>';
    var main, sub;
    if (dS > 0) {
        main = planPlural(dS, 'day') + ' to the exam window';
        sub = 'Exam window from ' + sittingTxt + ' · hard deadline ' + deadlineTxt + ' <span class="plan-nowrap">(' + planPlural(dD, 'day') + ')</span>';
    } else if (dD >= 0) {
        main = dS === 0 ? 'The exam window opens today' : (dD === 0 ? 'Hard deadline: today' : planPlural(dD, 'day') + ' to the hard deadline');
        sub = 'Exam window open since ' + sittingTxt + ' · hard deadline ' + deadlineTxt;
    } else {
        main = planPlural(-dD, 'day') + ' past the deadline';
        sub = 'The hard deadline was ' + deadlineTxt;
    }

    var html = '<div class="plan-header-card">';
    html += '<div class="plan-header-days">' + escapeHtml(main) + '</div>';
    html += '<div class="plan-header-sub">' + sub + '</div>';

    var phase = week ? planPhaseFor(week) : null;
    if (week) {
        html += '<div class="plan-header-week">Week ' + week.n + ' of ' + B1_WEEKS.length + ' · <span class="plan-nowrap">' + escapeHtml(week.label) + '</span>' + (phase ? ' · ' + escapeHtml(phase.name) : '') + '</div>';
    } else if (today < start) {
        var toStart = planDaysBetween(today, start);
        html += '<div class="plan-header-week">The plan starts <span class="plan-nowrap">' + planFmtDate(start, true, true) + '</span> — in ' + planPlural(toStart, 'day') + '.</div>';
    } else {
        html += '<div class="plan-header-week">The ' + B1_WEEKS.length + '-week plan ended on <span class="plan-nowrap">' + planFmtDate(end, true, true) + '</span>. Every week is still below.</div>';
    }

    if (typeof checkpointReadiness === 'function') {
        var readiness = planTry(checkpointReadiness);
        if (readiness) {
            var attempts = planNum(readiness.attempts);
            html += '<div class="plan-header-sub">Checkpoint readiness: ' + escapeHtml(readiness.text) +
                (attempts ? ' (' + planPlural(attempts, 'attempt') + ')' : '') +
                (typeof checkpointStart === 'function' && stats && planNum(stats.seen) >= 10 ? ' <button type="button" class="plan-link" onclick="planStartCheckpoint()">' + (attempts ? 'Take again' : 'Take the quiz') + '</button>' : '') +
                '</div>';
        }
    }

    var totalWeeks = B1_WEEKS.length;
    // The track needs its own width: inside the flex bar its auto width would
    // come from the segments' percentages, which resolve to 0.
    html += '<div class="plan-phase-bar"><div class="plan-phase-track" style="flex:1 1 auto;width:100%;display:flex;height:100%;border-radius:5px;overflow:hidden">';
    B1_PHASES.forEach(function(p) {
        var span = p.weeks[1] - p.weeks[0] + 1;
        html += '<div class="plan-phase-seg" style="width:' + ((span / totalWeeks) * 100) + '%;background:' + planPhaseColor(p.id) + '"></div>';
    });
    html += '</div>';
    if (week) html += '<div class="plan-phase-marker" style="left:' + (((week.n - 0.5) / totalWeeks) * 100) + '%"></div>';
    html += '</div>';

    var first = B1_PHASES[0], last = B1_PHASES[B1_PHASES.length - 1];
    html += '<div class="plan-phase-labels"><span>' + escapeHtml(first.name) + '</span>' +
        (phase && phase !== first && phase !== last ? '<span class="cur" style="color:' + planPhaseColor(phase.id) + '">' + escapeHtml(phase.name) + '</span>' : '') +
        '<span>' + escapeHtml(last.name) + '</span></div>';
    if (phase && phase.summary) html += '<div class="plan-phase-summary">' + escapeHtml(phase.summary) + '</div>';
    html += '</div>';
    return html;
}

function planDayHasActivity(entry) {
    if (!entry || typeof entry !== 'object') return false;
    for (var k in entry) {
        if (Array.isArray(entry[k]) && entry[k].length) return true;
    }
    return false;
}

function planThisWeekHtml(week, today, stats, log) {
    var todayKey = planDayKey(today);
    var task = planTodayTask();
    var html = '<div class="plan-section-title">This week · ' + escapeHtml(week.label) + '</div>';
    html += '<div class="plan-today-card">';
    if (week.milestone) html += '<div class="plan-this-milestone">' + planMilestoneHtml(week, stats) + '</div>';
    html += planSlotRowsHtml(week);
    if (task) {
        var done = planIsDayDone(todayKey);
        var link = PLAN_TASK_LINKS[task.label];
        var label = link
            ? planLinkButton(link.tab, link.arg, escapeHtml(task.label) + ' &rsaquo;', 'plan-task-label')
            : '<strong>' + escapeHtml(task.label) + ':</strong>';
        html += '<div class="plan-today-task">' +
            '<button type="button" class="plan-check-btn" aria-label="Mark today\'s task done" aria-pressed="' + done + '" onclick="planToggleDayUI(\'' + todayKey + '\')">' +
                '<span class="plan-today-check' + (done ? ' checked' : '') + '">&#10003;</span></button>' +
            '<div class="plan-today-text">' + label + ' ' + planLinkify(task.task, link ? link.tab + ':' + link.arg : '') +
                (task.also ? '<div class="plan-task-also"><strong>This week, ' + PLAN_WEEKDAYS[planWeekdayIndex(today)] + ':</strong> ' + planLinkify(task.also) + '</div>' : '') +
            '</div>' +
        '</div>';
    }
    html += '<div class="plan-day-dots">';
    var weekStart = planDate(week.from);
    var days = planLoad(PLAN_DAYS_KEY);
    for (var i = 0; i < 7; i++) {
        var key = planDayKey(planAddDays(weekStart, i));
        var cls = 'plan-day-dot';
        if (days[key]) cls += ' milestone';
        else if (planDayHasActivity(log[key])) cls += ' active';
        if (key === todayKey) cls += ' today';
        html += '<div class="plan-day"><div class="' + cls + '"></div><div class="plan-day-letter' + (key === todayKey ? ' today' : '') + '">' + PLAN_DAY_LETTERS[i] + '</div></div>';
    }
    html += '</div>';
    html += '</div>';
    return html;
}

function renderPlanOverview(container) {
    var today = planToday();
    var week = planCurrentWeek();
    var stats = planWordStats();
    var log = planLogLoad();
    planLastRenderDay = planDayKey(today);

    var html = planHeaderHtml(today, week, stats);
    html += planWordsCardHtml(stats);
    if (week) html += planThisWeekHtml(week, today, stats, log);

    html += '<div class="plan-section-title">All ' + B1_WEEKS.length + ' weeks</div>';
    B1_PHASES.forEach(function(p) {
        var weeksInPhase = B1_WEEKS.filter(function(w) { return w.phase === p.id; });
        if (!weeksInPhase.length) return;
        html += '<div class="plan-week-row" style="background:none;padding:6px 4px;cursor:default;">' +
            '<span style="color:' + planPhaseColor(p.id) + ';font-weight:600;font-size:0.8rem;">' + escapeHtml(p.name) + '</span></div>';
        weeksInPhase.forEach(function(w) {
            var done = planIsWeekDone(w.n);
            var cls = 'plan-week-row';
            if (week && w.n === week.n) cls += ' cur';
            else if (!done && today >= planWeekEndExcl(w)) cls += ' missed';
            html += '<div class="' + cls + '" id="plan-week-' + w.n + '" onclick="planShowWeekDetail(' + w.n + ')">' +
                '<div class="plan-week-row-top">' +
                    '<button type="button" class="plan-check-btn" aria-label="Week ' + w.n + ' done" aria-pressed="' + done + '" onclick="event.stopPropagation(); planToggleWeekUI(' + w.n + ')">' +
                        '<span class="plan-week-checkbox' + (done ? ' checked' : '') + '">&#10003;</span></button>' +
                    '<div>' +
                        '<div class="plan-week-label">Week ' + w.n + ' · ' + escapeHtml(w.label) + '</div>' +
                        planMilestoneHtml(w, stats) +
                        planWeekRowActivity(w, log) +
                    '</div>' +
                    '<span class="plan-week-chevron">&#9654;</span>' +
                '</div>' +
            '</div>';
        });
    });

    html += '<details class="plan-recoveries"><summary>How the three slots work</summary>';
    [B1_SLOTS.scooter, B1_SLOTS.gym, B1_SLOTS.evening].forEach(function(slot) {
        html += '<div class="plan-recovery-item"><span class="plan-recovery-when">' + slot.emoji + ' ' + escapeHtml(slot.name) + ' · ' + escapeHtml(slot.pattern) + '</span> — ' + escapeHtml(slot.note) + '</div>';
    });
    html += '</details>';

    html += '<details class="plan-recoveries"><summary>If it slips</summary>';
    B1_RECOVERIES.forEach(function(r) {
        html += '<div class="plan-recovery-item"><span class="plan-recovery-when">' + escapeHtml(r.when) + '</span> — ' + escapeHtml(r.then) + '</div>';
    });
    html += '</details>';

    container.innerHTML = html;
}

// ── Render ──────────────────────────────────────────────────────

function renderPlanScreen() {
    var container = document.getElementById('plan-content');
    if (!container) return;
    planInitListeners();
    if (typeof B1_WEEKS === 'undefined' || typeof B1_KEY_DATES === 'undefined') {
        container.innerHTML = '<div class="plan-empty-state">Plan data not loaded.</div>';
        return;
    }
    try {
        if (planCurrentWeekDetail !== null) renderPlanWeekDetail(container, planCurrentWeekDetail);
        else renderPlanOverview(container);
    } catch (e) {
        if (window.console) console.error('Plan render failed', e);
        container.innerHTML = '<div class="plan-empty-state">The plan could not be drawn. Your progress is safe.</div>';
    }
}

function planToggleDayUI(dayKey) {
    var key = /^\d{4}-\d{2}-\d{2}$/.test(dayKey || '') ? dayKey : planDayKey(planToday());
    var dayChanged = planDayChanged();
    planToggleDay(key);
    renderPlanScreen();
    if (dayChanged) planSetScroll(0);
}

function planToggleToday() {
    planToggleDayUI(planDayKey(planToday()));
}

function planToggleWeekUI(n) {
    planToggleWeek(n);
    renderPlanScreen();
}
