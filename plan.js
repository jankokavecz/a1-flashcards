// plan.js — renders the Plan tab (the app's home screen) from b1-plan.js's
// B1_WEEKS / B1_PHASES / B1_SLOTS / B1_RHYTHMS / B1_RECOVERIES / B1_KEY_DATES.
// Loaded via <script> tag. ES5 only.

var PLAN_WEEKS_KEY = 'plan-weeks';
var PLAN_DAYS_KEY = 'plan-days';

// ── Date helpers ────────────────────────────────────────────────
// planDate() parses 'YYYY-MM-DD' by hand -- new Date(iso) parses at UTC
// midnight, which shifts the calendar day in negative-UTC-offset zones.

function planDate(iso) {
    var parts = iso.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

function planToday() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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
    var msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

function planCurrentWeek() {
    if (typeof B1_WEEKS === 'undefined') return null;
    var today = planToday();
    for (var i = 0; i < B1_WEEKS.length; i++) {
        var week = B1_WEEKS[i];
        var weekStart = planDate(week.from);
        var weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        if (today >= weekStart && today <= weekEnd) return week;
    }
    return null;
}

function planPhaseFor(week) {
    for (var i = 0; i < B1_PHASES.length; i++) {
        if (B1_PHASES[i].id === week.phase) return B1_PHASES[i];
    }
    return null;
}

function planTodayTask() {
    var week = planCurrentWeek();
    if (!week) return null;
    var rhythm = B1_RHYTHMS[week.rhythm];
    if (!rhythm) return null;
    var idx = planWeekdayIndex(planToday());
    for (var i = 0; i < rhythm.days.length; i++) {
        if (rhythm.days[i].day === idx) return rhythm.days[i];
    }
    return null;
}

function planPhaseColor(phaseId) {
    var colors = ['#5b8def', '#9b7ede', '#e08a4a', '#ef4444', '#10b981'];
    return colors[phaseId % colors.length];
}

// ── Storage ─────────────────────────────────────────────────────

function planLoad(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch (e) { return {}; }
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

// ── Linkify week/task text into buttons that jump to Tracks or Exam ──

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

var PLAN_LINK_PATTERNS = [
    { re: /Scooter Tracks?\s*(\d+)(?:-\d+)?/g, build: function(m) { return { tab: 'tracks', arg: 's1-' + ('0' + m[1]).slice(-2) }; } },
    { re: /Gym Session\s*(\d+)/g, build: function(m) { return { tab: 'tracks', arg: 'gym-' + ('0' + m[1]).slice(-2) }; } },
    { re: /(Hören|Lesen|Schreiben|Sprechen) Teil\s*\d+/g, build: function(m) { return { tab: 'exam', arg: m[1].toLowerCase() }; } },
    { re: /Aufgabe\s*\d+/g, build: function() { return { tab: 'exam', arg: 'schreiben' }; } }
];

function planLinkify(text) {
    var matches = [];
    PLAN_LINK_PATTERNS.forEach(function(pattern) {
        pattern.re.lastIndex = 0;
        var m;
        while ((m = pattern.re.exec(text)) !== null) {
            var dest = pattern.build(m);
            matches.push({ start: m.index, end: m.index + m[0].length, label: m[0], tab: dest.tab, arg: dest.arg });
        }
    });
    matches.sort(function(a, b) { return a.start - b.start; });
    var clean = [];
    var lastEnd = -1;
    matches.forEach(function(m) {
        if (m.start >= lastEnd) { clean.push(m); lastEnd = m.end; }
    });

    var html = '';
    var pos = 0;
    clean.forEach(function(m) {
        html += escapeHtml(text.slice(pos, m.start));
        html += '<button class="plan-link" onclick="planGoto(\'' + m.tab + '\',\'' + m.arg + '\')">' + escapeHtml(m.label) + '</button>';
        pos = m.end;
    });
    html += escapeHtml(text.slice(pos));
    return html;
}

function planGoto(tab, arg) {
    switchTab(tab);
    if (tab === 'tracks' && typeof tracksOpenTrack === 'function') {
        setTimeout(function() { tracksOpenTrack(arg); }, 50);
    }
    if (tab === 'exam' && typeof examStartSection === 'function') {
        setTimeout(function() { examStartSection(arg); }, 50);
    }
}

// ── Render ──────────────────────────────────────────────────────

function renderPlanScreen() {
    var container = document.getElementById('plan-content');
    if (!container) return;
    if (typeof B1_WEEKS === 'undefined') {
        container.innerHTML = '<div class="plan-empty-state">Plan data not loaded.</div>';
        return;
    }

    var today = planToday();
    var week = planCurrentWeek();

    if (!week) {
        var start = planDate(B1_KEY_DATES.planStart);
        var msg = today < start
            ? 'The plan starts ' + B1_KEY_DATES.planStart + ' — ' + planDaysBetween(today, start) + ' days to go.'
            : 'The 30-week plan has ended.';
        container.innerHTML = '<div class="plan-empty-state">🗓️<br>' + escapeHtml(msg) + '</div>';
        return;
    }

    var phase = planPhaseFor(week);
    var daysToSitting = planDaysBetween(today, planDate(B1_KEY_DATES.sittingWindow));
    var daysToDeadline = planDaysBetween(today, planDate(B1_KEY_DATES.hardDeadline));

    var html = '';

    // ── Header ──
    html += '<div class="plan-header-card">';
    html += daysToSitting >= 0
        ? '<div class="plan-header-days">' + daysToSitting + ' days to the exam window</div>'
        : '<div class="plan-header-days">' + Math.abs(daysToDeadline) + ' days past the deadline</div>';
    html += '<div class="plan-header-sub">Sitting window ' + B1_KEY_DATES.sittingWindow + ' · hard deadline ' + B1_KEY_DATES.hardDeadline + '</div>';
    html += '<div class="plan-header-week">Week ' + week.n + ' of ' + B1_WEEKS.length + ' · ' + (phase ? escapeHtml(phase.name) : '') + '</div>';
    if (typeof checkpointReadiness === 'function') {
        var readiness = checkpointReadiness();
        html += '<div class="plan-header-sub">Checkpoint readiness: ' + readiness.text +
            (readiness.attempts ? ' (' + readiness.attempts + ' attempt' + (readiness.attempts === 1 ? '' : 's') + ')' : '') + '</div>';
    }

    html += '<div class="plan-phase-bar">';
    var totalWeeks = B1_WEEKS.length;
    B1_PHASES.forEach(function(p) {
        var span = p.weeks[1] - p.weeks[0] + 1;
        var pct = (span / totalWeeks) * 100;
        html += '<div class="plan-phase-seg" style="width:' + pct + '%;background:' + planPhaseColor(p.id) + '"></div>';
    });
    var markerPct = ((week.n - 1) / totalWeeks) * 100;
    html += '<div class="plan-phase-marker" style="left:' + markerPct + '%"></div>';
    html += '</div>';
    html += '<div class="plan-phase-labels"><span>' + B1_PHASES[0].name + '</span><span>' + B1_PHASES[B1_PHASES.length - 1].name + '</span></div>';
    html += '</div>';

    // ── This week ──
    var task = planTodayTask();
    var todayKey = planDayKey(today);

    html += '<div class="plan-section-title">This week</div>';
    html += '<div class="plan-today-card">';
    [B1_SLOTS.scooter, B1_SLOTS.gym, B1_SLOTS.evening].forEach(function(slot) {
        var text = slot.id === 'scooter' ? week.scooter : (slot.id === 'gym' ? week.gym : week.evening);
        if (!text) return;
        html += '<div class="plan-slot-row"><span class="plan-slot-emoji">' + slot.emoji + '</span>' +
            '<span class="plan-slot-name">' + slot.name + '</span>' +
            '<span class="plan-slot-task">' + planLinkify(text) + '</span></div>';
    });
    if (task) {
        html += '<div class="plan-today-task">' +
            '<div class="plan-today-check' + (planIsDayDone(todayKey) ? ' checked' : '') + '" onclick="planToggleToday()">&#10003;</div>' +
            '<div><strong>' + escapeHtml(task.label) + ':</strong> ' + planLinkify(task.task) + '</div>' +
        '</div>';
    }
    html += '<div class="plan-day-dots">';
    var weekStart = planDate(week.from);
    for (var i = 0; i < 7; i++) {
        var d = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
        var key = planDayKey(d);
        var cls = 'plan-day-dot';
        if (planIsDayDone(key)) cls += ' milestone';
        if (key === todayKey) cls += ' today';
        html += '<div class="' + cls + '"></div>';
    }
    html += '</div>';
    html += '</div>';

    // ── All weeks ──
    html += '<div class="plan-section-title">All ' + B1_WEEKS.length + ' weeks</div>';
    B1_PHASES.forEach(function(p) {
        var weeksInPhase = B1_WEEKS.filter(function(w) { return w.phase === p.id; });
        if (!weeksInPhase.length) return;
        html += '<div class="plan-week-row" style="background:none;padding:6px 4px;cursor:default;">' +
            '<span style="color:' + planPhaseColor(p.id) + ';font-weight:600;font-size:0.8rem;">' + escapeHtml(p.name) + '</span></div>';
        weeksInPhase.forEach(function(w) {
            var done = planIsWeekDone(w.n);
            var cls = 'plan-week-row';
            if (w.n === week.n) cls += ' cur';
            html += '<div class="' + cls + '" id="plan-week-' + w.n + '" onclick="planToggleWeekExpand(' + w.n + ')">' +
                '<div class="plan-week-row-top">' +
                    '<div class="plan-week-checkbox' + (done ? ' checked' : '') + '" onclick="event.stopPropagation(); planToggleWeekUI(' + w.n + ')">&#10003;</div>' +
                    '<div>' +
                        '<div class="plan-week-label">Week ' + w.n + ' · ' + escapeHtml(w.label) + '</div>' +
                        (w.milestone ? '<div class="plan-week-range">🏁 ' + escapeHtml(w.milestone) + '</div>' : '') +
                    '</div>' +
                '</div>' +
                '<div class="plan-week-detail">' +
                    (w.scooter ? '<div class="plan-week-detail-row"><span class="plan-week-detail-label">Scooter</span>' + planLinkify(w.scooter) + '</div>' : '') +
                    (w.gym ? '<div class="plan-week-detail-row"><span class="plan-week-detail-label">Gym</span>' + planLinkify(w.gym) + '</div>' : '') +
                    (w.evening ? '<div class="plan-week-detail-row"><span class="plan-week-detail-label">Evening</span>' + planLinkify(w.evening) + '</div>' : '') +
                '</div>' +
            '</div>';
        });
    });

    // ── Recoveries ──
    html += '<details class="plan-recoveries"><summary>If it slips</summary>';
    B1_RECOVERIES.forEach(function(r) {
        html += '<div class="plan-recovery-item"><span class="plan-recovery-when">' + escapeHtml(r.when) + '</span> — ' + escapeHtml(r.then) + '</div>';
    });
    html += '</details>';

    container.innerHTML = html;
}

function planToggleToday() {
    planToggleDay(planDayKey(planToday()));
    renderPlanScreen();
}

function planToggleWeekUI(n) {
    planToggleWeek(n);
    renderPlanScreen();
}

function planToggleWeekExpand(n) {
    var row = document.getElementById('plan-week-' + n);
    if (row) row.classList.toggle('expanded');
}
