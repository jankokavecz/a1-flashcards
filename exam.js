// exam.js — the Exam tab: the key-free checkpoint quiz and B1 toolkit, the
// AI-generated and AI-graded B1 mock exams, and the older A1 practice.
// Loaded via <script> before b1-exam-data.js and app.js, so their globals are
// only read inside functions. The mock exams use the OpenAI key that the Speak
// tab (calls.js) stores. ES5 only.

// ── State ──────────────────────────────────────────────────────
var examCurrentSection = null;   // section id of the exam in progress
var examRecognition = null;      // the one SpeechRecognition instance (created on first use)
var examActiveAudio = null;      // <audio> of the current Hören item
var examRunId = 0;               // bumped whenever an exam ends; async callbacks compare against it
var examSession = null;          // the exam in progress (checkpoint, A1 or B1), or null
var examView = 'list';           // 'list' | 'active' | 'results' | 'notice'
var examOpenDetails = {};        // which collapsible groups are open, by data-key
var examCopyTexts = {};          // clipboard texts for the toolkit's copy buttons
var examLastMissedIds = [];      // word ids missed in the last checkpoint

var EXAM_SECTIONS = {
    hoeren:       { id: 'hoeren',       module: 'hoeren',    level: 'A1', emoji: '🎧', titleDe: 'Hören (A1)',     titleEn: 'Listening' },
    lesen:        { id: 'lesen',        module: 'lesen',     level: 'A1', emoji: '📖', titleDe: 'Lesen (A1)',     titleEn: 'Reading' },
    schreiben:    { id: 'schreiben',    module: 'schreiben', level: 'A1', emoji: '✍️', titleDe: 'Schreiben (A1)', titleEn: 'Writing' },
    sprechen:     { id: 'sprechen',     module: 'sprechen',  level: 'A1', emoji: '🗣️', titleDe: 'Sprechen (A1)',  titleEn: 'Speaking' },
    hoeren_b1:    { id: 'hoeren_b1',    module: 'hoeren',    level: 'B1', emoji: '🎧', titleDe: 'Hören (B1)',     titleEn: 'Listening' },
    lesen_b1:     { id: 'lesen_b1',     module: 'lesen',     level: 'B1', emoji: '📖', titleDe: 'Lesen (B1)',     titleEn: 'Reading' },
    schreiben_b1: { id: 'schreiben_b1', module: 'schreiben', level: 'B1', emoji: '✍️', titleDe: 'Schreiben (B1)', titleEn: 'Writing' },
    sprechen_b1:  { id: 'sprechen_b1',  module: 'sprechen',  level: 'B1', emoji: '🗣️', titleDe: 'Sprechen (B1)',  titleEn: 'Speaking' }
};
var EXAM_B1_IDS = ['hoeren_b1', 'lesen_b1', 'schreiben_b1', 'sprechen_b1'];
var EXAM_A1_IDS = ['hoeren', 'lesen', 'schreiben', 'sprechen'];

// ── Small helpers ──────────────────────────────────────────────

function examEsc(s) {
    return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function examNum(v) {
    if (typeof v === 'number') return isFinite(v) ? v : null;
    if (typeof v === 'string' && v.trim() !== '') {
        var n = parseFloat(v.replace(',', '.'));
        return isFinite(n) ? n : null;
    }
    return null;
}

function examClamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

function examShuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

function examStrList(v) {
    if (!(v instanceof Array)) return [];
    return v.map(function(x) {
        if (x && typeof x === 'object') return String(x.text || x.phrase || x.error || '').trim();
        return String(x === null || x === undefined ? '' : x).trim();
    }).filter(Boolean);
}

function examWordCount(text) {
    var m = String(text || '').trim().match(/\S+/g);
    return m ? m.length : 0;
}

function examFill(template, vars) {
    return String(template).replace(/\{\{(\w+)\}\}/g, function(all, k) {
        return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : all;
    });
}

// {{slot}} markers in the B1 templates are the parts that change per task.
function examSlotHtml(text) {
    return examEsc(text).replace(/\{\{([\s\S]+?)\}\}/g, '<mark class="exam-tk-slot">$1</mark>');
}

function examSlotPlain(text) {
    return String(text || '').replace(/\{\{([\s\S]+?)\}\}/g, '$1');
}

function examBoldHtml(text) {
    return examEsc(text).replace(/\*\*([\s\S]+?)\*\*/g, '<strong class="exam-fix">$1</strong>');
}

function examSafeUrl(u) {
    u = String(u || '').trim();
    return /^https?:\/\//i.test(u) ? u : '';
}

function examContainer() { return document.getElementById('exam-content'); }

function examScreenActive() {
    var el = document.getElementById('exam-screen');
    return !!el && el.classList.contains('active');
}

function examHasB1() {
    return typeof B1_EXAM_SECTIONS !== 'undefined' && typeof B1_EXAM_PROMPTS !== 'undefined';
}

function examB1Teile(module) {
    if (!examHasB1() || !B1_EXAM_SECTIONS[module]) return [];
    // Sprechen's n:0 entry is pronunciation, scored across the other parts.
    return B1_EXAM_SECTIONS[module].teile.filter(function(t) { return t.n !== 0; });
}

function examPartWord(module) { return module === 'schreiben' ? 'Aufgabe' : 'Teil'; }

// Only B1 Schreiben has Aufgaben; A1 Schreiben, like the rest, has Teile.
function examAttemptTitle(section, teil) {
    var sec = EXAM_SECTIONS[section];
    var t = sec ? sec.titleDe : String(section);
    if (teil) t += ' ' + examPartWord(sec && sec.level === 'B1' ? sec.module : '') + ' ' + teil;
    return t;
}

function examDayKey() {
    if (typeof srsToday === 'function') return srsToday();
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

// Each attempt gets its own entry ("… · 50% · 18:20"): the daily log and the
// Plan's week view drop identical strings, so two equal scores would
// otherwise count as one exam. A clash anywhere in the log gets " (2)".
function examLogAttempt(title, pct) {
    if (typeof dailyLogRecord !== 'function') return;
    var d = new Date();
    var base = title + ' · ' + pct + '% · ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    var used = examLoggedExams();
    var id = base;
    for (var n = 2; used[id]; n++) id = base + ' (' + n + ')';
    try { dailyLogRecord('exams', id); } catch (e) {}
}

function examLoggedExams() {
    var used = {};
    try {
        var log = typeof dailyLogLoad === 'function' ? dailyLogLoad() : {};
        Object.keys(log).forEach(function(day) {
            var list = log[day] && log[day].exams;
            if (list instanceof Array) list.forEach(function(x) { used[String(x)] = true; });
        });
    } catch (e) {}
    return used;
}

function examGotoTab() {
    if (!examScreenActive() && typeof switchTab === 'function') switchTab('exam');
}

function examInProgress() { return !!examSession && examView === 'active'; }

// ── Run management ─────────────────────────────────────────────
// Every async step (API call, TTS, timer, recognizer event) holds the session
// object it started under and drops its result unless that session is still
// the live one, so Beenden or a finished exam can never be overwritten.

function examBeginRun(kind, section) {
    examEndRun();
    var s = { kind: kind, section: section, run: examRunId, ctrls: [], itemToken: 0, startedAt: Date.now() };
    examSession = s;
    examView = 'active';
    examCurrentSection = section;
    return s;
}

function examEndRun() {
    var s = examSession;
    examRunId++;
    examSession = null;
    examMicAbort(false);
    examPauseAudio();
    examTimerStop();
    clearTimeout(examDraftTimer);
    if (s) {
        s.ctrls.forEach(function(c) { try { c.abort(); } catch (e) {} });
        s.ctrls = [];
        if (s.audioUrl) { try { URL.revokeObjectURL(s.audioUrl); } catch (e) {} s.audioUrl = null; }
    }
    examActiveAudio = null;
}

function examLive(s) { return !!s && s === examSession && s.run === examRunId; }

function examRender(s, html) {
    if (s && !examLive(s)) return false;
    var c = examContainer();
    if (!c) return false;
    c.innerHTML = html;
    c.scrollTop = 0;
    examTimerPause(false);
    examTimerPaint();
    return true;
}

function examPauseAudio() {
    if (examActiveAudio) { try { examActiveAudio.pause(); } catch (e) {} }
    var c = examContainer();
    if (!c) return;
    var list = c.querySelectorAll('audio');
    for (var i = 0; i < list.length; i++) { try { list[i].pause(); } catch (e) {} }
}

// ── Timer (informational, never ends an exam) ──────────────────

var examTimer = null;

function examTimerStart(s, seconds) {
    examTimerStop();
    if (!seconds) return;
    examTimer = { s: s, limit: seconds, elapsed: 0, paused: false, iv: setInterval(examTimerTick, 1000) };
    examTimerPaint();
}

function examTimerStop() {
    if (examTimer) clearInterval(examTimer.iv);
    examTimer = null;
    var el = document.getElementById('exam-timer');
    if (el) el.textContent = '';
}

function examTimerPause(p) { if (examTimer) examTimer.paused = p; }

function examTimerTick() {
    var t = examTimer;
    if (!t) return;
    if (!examLive(t.s)) { examTimerStop(); return; }
    if (t.paused || !examScreenActive() || document.visibilityState === 'hidden') return;
    t.elapsed++;
    examTimerPaint();
}

function examTimerPaint() {
    var el = document.getElementById('exam-timer');
    if (!el) return;
    if (!examTimer) { el.textContent = ''; return; }
    var left = examTimer.limit - examTimer.elapsed;
    var a = Math.abs(left);
    el.textContent = '⏱ ' + (left < 0 ? '+' : '') + Math.floor(a / 60) + ':' + ('0' + (a % 60)).slice(-2);
    el.className = 'exam-timer' + (left < 0 ? ' over' : '');
}

// ── History ────────────────────────────────────────────────────

function examGetHistory() {
    try {
        var h = JSON.parse(localStorage.getItem('exam_history') || '[]');
        return h instanceof Array ? h : [];
    } catch (e) { return []; }
}

function examSaveAttempt(section, percentage, feedback, detail, teil) {
    var hist = examGetHistory();
    var rec = { section: section, percentage: Math.round(percentage), timestamp: Date.now(), feedback: feedback || null };
    if (teil) rec.teil = teil;
    if (detail) rec.detail = detail;
    hist.push(rec);
    while (hist.length > 100) hist.shift();
    // Full feedback is kept for the last 30 attempts only, to stay well inside localStorage.
    for (var i = 0; i < hist.length - 30; i++) delete hist[i].detail;
    try { localStorage.setItem('exam_history', JSON.stringify(hist)); }
    catch (e) {
        hist.forEach(function(a) { if (a !== rec) delete a.detail; });
        try { localStorage.setItem('exam_history', JSON.stringify(hist)); } catch (e2) {}
    }
    examLogAttempt(examAttemptTitle(section, teil), rec.percentage);
    return rec;
}

// Full attempts only, or the drills of one Teil when teil is given.
function examSectionHistory(section, teil) {
    return examGetHistory().filter(function(a) {
        return a.section === section && (teil ? a.teil === teil : !a.teil);
    });
}

function examBestScore(section) {
    var h = examSectionHistory(section);
    if (!h.length) return null;
    return h.reduce(function(max, a) { return a.percentage > max ? a.percentage : max; }, 0);
}

function examLastScore(section) {
    var h = examSectionHistory(section);
    return h.length ? h[h.length - 1].percentage : null;
}

function examLastWithDetail(section) {
    var h = examGetHistory();
    for (var i = h.length - 1; i >= 0; i--) {
        if (h[i].section === section && (h[i].detail || h[i].feedback)) return h[i];
    }
    return null;
}

// ── Drafts (writing is never thrown away) ──────────────────────

var EXAM_DRAFTS_KEY = 'exam-drafts';
var examDraftTimer = null;

function examDraftsLoad() {
    try {
        var d = JSON.parse(localStorage.getItem(EXAM_DRAFTS_KEY) || '{}');
        return d && typeof d === 'object' && !(d instanceof Array) ? d : {};
    } catch (e) { return {}; }
}

function examDraftsSave(d) {
    try { localStorage.setItem(EXAM_DRAFTS_KEY, JSON.stringify(d)); } catch (e) {}
}

// One draft per attempt (section__teil__startedAt), so a new exam never
// overwrites or clears an older unfinished text for the same Aufgabe.
// Drafts saved before this scheme (section__teil) keep their own key.
function examDraftKey(section, teil, stamp) {
    return section + '__' + (teil || 0) + (stamp ? '__' + stamp : '');
}

function examDraftPut(key, section, teil, task, text) {
    var d = examDraftsLoad();
    if (!String(text || '').trim()) {
        // An emptied textarea only clears this attempt's own draft.
        if (d[key]) { delete d[key]; examDraftsSave(d); }
        return false;
    }
    d[key] = { section: section, teil: teil || 0, task: task || null, text: String(text), savedAt: Date.now() };
    examDraftsSave(d);
    return true;
}

function examDraftDrop(key) {
    var d = examDraftsLoad();
    if (key && d[key]) { delete d[key]; examDraftsSave(d); }
}

function examDraftsList() {
    var d = examDraftsLoad();
    return Object.keys(d).map(function(k) { var x = d[k]; x.key = k; return x; })
        .filter(function(x) { return x && /^[a-z0-9_]+$/.test(x.key) && EXAM_SECTIONS[x.section] && x.text; })
        .sort(function(a, b) { return (b.savedAt || 0) - (a.savedAt || 0); });
}

function examSaveCurrentDraft() {
    var s = examSession;
    if (!s || !s.writing) return;
    var w = s.writing;
    var el = document.getElementById(w.inputId);
    var text = el ? el.value : (w.text || '');
    if (examDraftPut(w.key, w.section, w.teil, w.task, text)) s.hasDraft = true;
}

function examDraftSaveSoon(s) {
    clearTimeout(examDraftTimer);
    examDraftTimer = setTimeout(function() { if (examLive(s)) examSaveCurrentDraft(); }, 800);
}

function examResumeDraft(key) {
    var d = examDraftsLoad()[key];
    if (!d || !d.task || !EXAM_SECTIONS[d.section] || EXAM_SECTIONS[d.section].level !== 'B1' || !examHasB1()) { examShowList(); return; }
    var task = b1CleanTeil(EXAM_SECTIONS[d.section].module, d.task);
    if (!task) { examShowList(); return; }
    if (examInProgress()) {
        if (!window.confirm('Leave the unfinished ' + examAttemptTitle(examSession.section, examSession.teilN) + ' and continue this draft?')) return;
        examLeaveRun();
    }
    if (!examGetApiKey()) { examEndRun(); examShowKeyNotice(d.section, d.teil, key); return; }
    var s = examBeginRun('b1', d.section);
    b1Setup(s, d.teil);
    if (!s.teilN) { examEndRun(); examShowList(); return; }
    s.draftKeys[0] = key; // keep writing into this draft, and drop it once graded
    s.gen[0].status = 'ready';
    s.gen[0].data = task;
    s.texts[0] = d.text;
    s.hasDraft = true;
    b1Start(s);
}

function examCopyDraft(btn, key) {
    var d = examDraftsLoad()[key];
    examCopyText(d ? d.text : '', btn);
}

function examDeleteDraft(key) {
    var d = examDraftsLoad();
    if (!d[key]) { examShowList(); return; }
    if (!window.confirm('Delete this draft? The text cannot be recovered.')) return;
    delete d[key];
    examDraftsSave(d);
    examShowList();
}

// ── Clipboard ──────────────────────────────────────────────────

function examCopy(btn, id) { examCopyText(examCopyTexts[id] || '', btn); }

function examCopyText(text, btn) {
    var label = btn ? (btn.getAttribute('data-label') || btn.textContent) : '';
    if (btn) btn.setAttribute('data-label', label);
    function done(ok) {
        if (!btn) return;
        btn.textContent = ok ? '✓ Copied' : 'Copy failed';
        if (ok) btn.classList.add('copied');
        clearTimeout(btn._examCopyTimer);
        btn._examCopyTimer = setTimeout(function() { btn.textContent = label; btn.classList.remove('copied'); }, 1600);
    }
    if (!text) { done(false); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            navigator.clipboard.writeText(text).then(function() { done(true); }, function() { done(examCopyFallback(text)); });
            return;
        } catch (e) {}
    }
    done(examCopyFallback(text));
}

function examCopyFallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    ta.style.fontSize = '16px'; // stops iOS zooming in on focus
    document.body.appendChild(ta);
    var ok = false;
    try {
        ta.select();
        ta.setSelectionRange(0, text.length);
        ok = document.execCommand('copy');
    } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
}

// ── OpenAI helpers ─────────────────────────────────────────────

function examGetApiKey() {
    try { return localStorage.getItem('openai_api_key') || ''; } catch (e) { return ''; }
}

function examChatJson(prompt, max_tokens, callback, opts) {
    opts = opts || {};
    var apiKey = examGetApiKey();
    if (!apiKey) { callback({ error: 'No OpenAI API key set. Add it in the Speak tab.', noKey: true }); return; }
    var req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: max_tokens || 1500,
            temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.7,
            response_format: { type: 'json_object' }
        })
    };
    if (opts.signal) req.signal = opts.signal;
    fetch('https://api.openai.com/v1/chat/completions', req)
        .then(function(r) {
            return r.text().then(function(body) {
                var data = null;
                try { data = JSON.parse(body); } catch (e) {}
                if (!r.ok) {
                    var msg = data && data.error && data.error.message ? data.error.message : '';
                    return { error: msg || 'The AI service returned an error (HTTP ' + r.status + ').', status: r.status };
                }
                if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
                    return { error: 'The AI service sent an unexpected reply (HTTP ' + r.status + ').' };
                }
                var choice = data.choices[0];
                var parsed = null;
                try { parsed = JSON.parse(choice.message.content); } catch (e) {}
                if (!parsed || typeof parsed !== 'object') {
                    return { error: choice.finish_reason === 'length'
                        ? 'The AI\'s answer was cut off before it finished.'
                        : 'The AI\'s answer could not be read (not valid JSON).' };
                }
                return { data: parsed };
            });
        })
        .then(function(res) { callback(res); }, function(err) {
            if (err && err.name === 'AbortError') return;
            callback({ error: 'Network error. Check your connection and try again.' });
        });
}

function examTtsToBlob(text, voice, callback, signal) {
    var apiKey = examGetApiKey();
    if (!apiKey) { callback({ error: 'No OpenAI API key set.', noKey: true }); return; }
    var req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({ model: 'tts-1', voice: voice || 'nova', input: text, speed: 0.95 })
    };
    if (signal) req.signal = signal;
    fetch('https://api.openai.com/v1/audio/speech', req)
        .then(function(r) {
            if (!r.ok) {
                return r.text().then(function(body) {
                    var msg = '';
                    try { var j = JSON.parse(body); msg = j && j.error && j.error.message; } catch (e) {}
                    return { error: msg || 'Audio error (HTTP ' + r.status + ').' };
                });
            }
            return r.blob().then(function(blob) { return { url: URL.createObjectURL(blob) }; });
        })
        .then(function(res) { callback(res); }, function(err) {
            if (err && err.name === 'AbortError') return;
            callback({ error: 'Network error while loading the audio.' });
        });
}

function examNewCtrl(s) {
    if (typeof AbortController !== 'function') return null;
    var c = new AbortController();
    s.ctrls.push(c);
    return c;
}

function examDoneCtrl(s, c) {
    if (!c) return;
    var i = s.ctrls.indexOf(c);
    if (i !== -1) s.ctrls.splice(i, 1);
}

// examChatJson bound to a session: the callback only runs while it is live.
function examAsk(s, prompt, maxTokens, cb, temperature) {
    var ctrl = examNewCtrl(s);
    examChatJson(prompt, maxTokens, function(res) {
        examDoneCtrl(s, ctrl);
        if (examLive(s)) cb(res);
    }, { signal: ctrl ? ctrl.signal : null, temperature: temperature });
}

function examTts(s, text, voice, cb) {
    var ctrl = examNewCtrl(s);
    examTtsToBlob(text, voice, function(res) {
        examDoneCtrl(s, ctrl);
        if (!examLive(s)) { if (res.url) { try { URL.revokeObjectURL(res.url); } catch (e) {} } return; }
        cb(res);
    }, ctrl ? ctrl.signal : null);
}

// ── Answer options (shared by A1 and B1) ───────────────────────

var EXAM_OPT_PREFIX = /^\s*(?:\(?[A-Ka-k]\)|[A-Ka-k][.:]|\d{1,2}\))\s+/;

// Strips a model-echoed "A) " / "b. " / "0) " label (only when every option
// has one, so real text is never cut) and rejects bare-letter options.
function examCleanOptions(raw) {
    if (!(raw instanceof Array) || raw.length < 2) return null;
    var opts = raw.map(function(o) {
        if (o && typeof o === 'object') o = o.text || o.option || '';
        return String(o === null || o === undefined ? '' : o).trim();
    });
    if (opts.some(function(o) { return !o; })) return null;
    for (var pass = 0; pass < 2; pass++) {
        if (!opts.every(function(o) { return EXAM_OPT_PREFIX.test(o); })) break;
        opts = opts.map(function(o) { return o.replace(EXAM_OPT_PREFIX, '').trim() || o; });
    }
    if (opts.every(function(o) { return /^[A-Ka-k0]$/.test(o); })) return null;
    var seen = {};
    for (var i = 0; i < opts.length; i++) {
        var k = opts[i].toLowerCase();
        if (seen[k]) return null;
        seen[k] = true;
    }
    return opts;
}

function examAnswerIndex(v, opts) {
    var n = opts.length;
    if (typeof v === 'number') return v % 1 === 0 && v >= 0 && v < n ? v : null;
    if (typeof v !== 'string') return null;
    var t = v.trim();
    if (/^\d+$/.test(t)) { var i = parseInt(t, 10); return i < n ? i : null; }
    if (/^[A-Ka-k]$/.test(t)) { var j = t.toUpperCase().charCodeAt(0) - 65; return j < n ? j : null; }
    for (var k = 0; k < n; k++) if (opts[k].toLowerCase() === t.toLowerCase()) return k;
    return null;
}

function examBool(v) {
    if (v === true || v === false) return v;
    var t = String(v === null || v === undefined ? '' : v).trim().toLowerCase();
    if (t === 'true' || t === 'richtig' || t === 'ja' || t === 'r') return true;
    if (t === 'false' || t === 'falsch' || t === 'nein' || t === 'f') return false;
    return null;
}

function examOptionLabel(opts, idx) {
    if (typeof idx !== 'number' || idx < 0 || idx >= opts.length) return '(keine Antwort)';
    return opts.length >= 3 && opts.length <= 4 ? String.fromCharCode(65 + idx) + ') ' + opts[idx] : opts[idx];
}

function examFillOptions(el, opts, onPick) {
    if (!el) return;
    var picked = false;
    opts.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'exam-option';
        btn.textContent = examOptionLabel(opts, idx);
        btn.addEventListener('click', function() {
            if (picked) return;
            picked = true;
            onPick(idx);
        });
        el.appendChild(btn);
    });
}

// ── Shared screens ─────────────────────────────────────────────

function examActiveHeader(title, progress) {
    return '<div class="exam-active-header">' +
        '<button type="button" class="exam-exit-btn" onclick="examExit()">⛔ Beenden</button>' +
        '<div class="exam-active-head-text">' +
            '<div class="exam-active-title">' + examEsc(title) + '</div>' +
            '<div class="exam-active-sub"><span class="exam-active-progress">' + examEsc(progress) + '</span>' +
                '<span class="exam-timer" id="exam-timer"></span></div>' +
        '</div>' +
    '</div>';
}

function examShowLoading(s, title, sub) {
    if (!examRender(s, '<div class="exam-loading">' +
            '<div class="exam-spinner"></div>' +
            '<div class="exam-loading-title">' + examEsc(title) + '</div>' +
            '<div class="exam-loading-sub">' + examEsc(sub) + '</div>' +
            '<button type="button" class="exam-exit-btn exam-loading-cancel" onclick="examExit()">⛔ Abbrechen</button>' +
        '</div>')) return;
    examTimerPause(true);
}

function examShowError(s, msg, retry) {
    if (!examLive(s)) return;
    s.retry = retry || null;
    examRender(s, '<div class="exam-error-screen">' +
        '<div class="exam-error-icon">⚠️</div>' +
        '<p>' + examEsc(msg) + '</p>' +
        (s.hasDraft ? '<p class="exam-error-note">Your text is saved as a draft. You will find it on the Exam overview.</p>' : '') +
        (retry ? '<button type="button" class="btn btn-primary" onclick="examRetry()">🔁 Nochmal versuchen</button>' : '') +
        '<button type="button" class="exam-btn-secondary" onclick="examExit()">← Zur Übersicht</button>' +
    '</div>');
    examTimerPause(true);
}

function examRetry() {
    var s = examSession;
    if (!s || !s.retry) return;
    var f = s.retry;
    s.retry = null;
    f();
}

function examFail(s, res, retry) {
    if (!examLive(s)) return;
    if (res && res.noKey) {
        var id = s.section, t = s.teilN;
        examLeaveRun();
        examShowKeyNotice(id, t);
        return;
    }
    examShowError(s, (res && res.error) || 'Something went wrong.', retry);
}

function examExit() {
    var s = examSession;
    if (s && s.progressed && examView === 'active') {
        var graded = b1GradedParts(s);
        var msg = 'Stop this exam? ' + (graded.length
            ? 'The full exam will not be scored, but ' + b1PartNames(s, graded) + (graded.length === 1 ? ' is' : ' are') +
              ' already graded and will be saved as ' + (graded.length === 1 ? 'a single result.' : 'single results.')
            : 'It will not be scored.');
        if (examKeepsText(s, graded)) msg += ' Your text stays saved as a draft.';
        if (!window.confirm(msg)) return;
    }
    examLeaveRun();
    examShowList();
}

// Ends the live run because the user walked away from it: the open text is
// saved as a draft and parts that were already graded are kept as results.
function examLeaveRun() {
    var s = examSession;
    examSaveCurrentDraft();
    if (examLive(s)) b1SavePartial(s);
    examEndRun();
}

// Whether leaving keeps some of the user's text as a draft (for the confirm).
function examKeepsText(s, graded) {
    var el = s.writing ? document.getElementById(s.writing.inputId) : null;
    if (el && String(el.value).trim()) return true;
    if (s.kind !== 'b1') return !!s.hasDraft;
    return (s.texts || []).some(function(t, i) { return graded.indexOf(i) === -1 && !!String(t || '').trim(); });
}

// ── Tab lifecycle (called by app.js switchTab) ─────────────────

function examOnLeave() {
    examPauseAudio();
    examMicAbort(true);
    examSaveCurrentDraft();
}

// A finished attempt's results stay reachable via "Last feedback" on its card.
function examOnEnter(isReTap) {
    if (!examContainer()) return;
    if (examInProgress()) { examTimerPaint(); return; }
    examShowList();
}

function renderExamScreen() { examOnEnter(false); }

function initExam() {
    examShowList();
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') { examMicAbort(true); examSaveCurrentDraft(); }
    });
    window.addEventListener('pagehide', examSaveCurrentDraft);
}

// ── Opening a section (Plan links, cards, results) ─────────────

// Bare module names ('lesen', 'hören') mean B1, since the Plan is a B1 plan;
// the A1 sections are addressed as 'lesen_a1'. 'lesen_b1:4' or a second
// argument picks a single Teil.
function examParseSection(sectionId, teil) {
    var raw = String(sectionId === null || sectionId === undefined ? '' : sectionId).toLowerCase().replace(/\s+/g, '');
    var parts = raw.split(/[:\/#]/);
    var id = parts[0].replace(/ö/g, 'oe').replace(/ä/g, 'ae').replace(/ü/g, 'ue');
    var aliases = { horen: 'hoeren', aufgabe: 'schreiben' };
    if (aliases[id]) id = aliases[id];
    var t = examNum(teil !== undefined && teil !== null && teil !== '' ? teil : parts[1]);
    if (/_a1$/.test(id)) id = id.replace(/_a1$/, '');
    else if (EXAM_SECTIONS[id + '_b1']) id = id + '_b1';
    if (!EXAM_SECTIONS[id]) return null;
    if (EXAM_SECTIONS[id].level === 'B1' && !examHasB1()) id = EXAM_SECTIONS[id].module;
    var sec = EXAM_SECTIONS[id];
    if (sec.level !== 'B1' || t === null) t = null;
    else if (!examB1Teile(sec.module).some(function(x) { return x.n === t; })) t = null;
    return { id: id, teil: t };
}

function examOpenSection(sectionId, teil) {
    if (String(sectionId).toLowerCase() === 'checkpoint') { examGotoTab(); checkpointStart(); return; }
    var p = examParseSection(sectionId, teil);
    examGotoTab();
    if (!p) { if (!examInProgress()) examShowList(); return; }
    if (examInProgress()) {
        var s = examSession;
        if (s.section === p.id && (s.teilN || null) === p.teil) return;
        var cur = s.kind === 'checkpoint' ? 'checkpoint quiz' : examAttemptTitle(s.section, s.teilN);
        if (!window.confirm('Leave the unfinished ' + cur + ' and start ' + examAttemptTitle(p.id, p.teil) + '?')) return;
        examLeaveRun();
    }
    if (!examGetApiKey()) { examShowKeyNotice(p.id, p.teil); return; }
    var s2 = examBeginRun(EXAM_SECTIONS[p.id].level === 'B1' ? 'b1' : 'a1', p.id);
    if (s2.kind === 'b1') { b1Setup(s2, p.teil); b1Start(s2); }
    else a1Start(s2);
}

function examStartSection(sectionId, teil) { examOpenSection(sectionId, teil); }

function examOpenToolkit(key) {
    examGotoTab();
    if (examInProgress()) return;
    var k = String(key || '').toLowerCase().replace(/^tk-/, '').replace(/[^a-z0-9_-]/g, '');
    if (k) examOpenDetails['tk-' + k] = true;
    examShowList();
    var c = examContainer();
    var el = c && (k ? c.querySelector('details[data-key="tk-' + k + '"]') : c.querySelector('.exam-toolkit'));
    if (!el) el = c && c.querySelector('.exam-toolkit');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
}

function examReviewLast(section) {
    var rec = examLastWithDetail(section);
    if (rec) examShowResults(rec, true);
    else examShowList();
}

function examDetailsToggle(el) {
    var k = el && el.getAttribute('data-key');
    if (k) examOpenDetails[k] = el.open;
}

// ── Exam overview ──────────────────────────────────────────────

function examShowList() {
    examView = 'list';
    var c = examContainer();
    if (!c) return;
    var hasKey = !!examGetApiKey();
    var html = checkpointCardHtml() + examDraftsHtml();
    if (examHasB1()) {
        html += '<div class="exam-group-title">B1 Prüfung · mock exams</div>';
        if (!hasKey) html += examKeyBannerHtml();
        html += '<div class="exam-sections">' + EXAM_B1_IDS.map(function(id) { return examSectionCardHtml(id, hasKey); }).join('') + '</div>';
        html += examToolkitHtml();
    }
    html += '<details class="exam-a1-group" data-key="a1" ontoggle="examDetailsToggle(this)"' + (examOpenDetails.a1 ? ' open' : '') + '>' +
        '<summary><span class="exam-a1-title">A1 practice</span><span class="exam-a1-sub">Hören · Lesen · Schreiben · Sprechen at A1 level</span></summary>' +
        '<div class="exam-sections">' + EXAM_A1_IDS.map(function(id) { return examSectionCardHtml(id, hasKey); }).join('') + '</div>' +
    '</details>';
    c.innerHTML = html;
}

function examKeyBannerHtml() {
    return '<div class="exam-key-banner">' +
        '<div class="exam-key-banner-title">🔑 The mock exams need an OpenAI key</div>' +
        '<p>Each mock exam is written and graded by AI with your own OpenAI API key. Paste it here once (it starts with <code>sk-</code>).</p>' +
        examKeyFormHtml('list') +
        '<p>No key needed for the checkpoint quiz above or the B1 toolkit below.</p>' +
    '</div>';
}

// ── OpenAI key, entered right here (same storage as the Speak tab) ──

var examKeyNext = null; // what the key notice opens once a key is saved

function examKeyFormHtml(where) {
    var go = 'examSaveKey(\'' + where + '\')';
    return '<div class="exam-key-form">' +
        '<input type="password" id="exam-api-input" class="calls-api-input exam-key-input" placeholder="sk-..." aria-label="OpenAI API key" ' +
            'autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" ' +
            'onkeydown="if (event.key === \'Enter\') ' + go + '">' +
        '<div class="exam-key-error" id="exam-key-error"></div>' +
        '<button type="button" class="btn btn-primary exam-key-btn" onclick="' + go + '">Save key</button>' +
        '<div class="exam-key-note">Stored only on this device. The 🗣️ Speak tab uses the same key.</div>' +
    '</div>';
}

// Never logs or shows the key; the field is cleared once it is saved.
function examSaveKey(where) {
    var input = document.getElementById('exam-api-input');
    var err = document.getElementById('exam-key-error');
    var val = input ? input.value.trim() : '';
    if (val.indexOf('sk-') !== 0) {
        if (err) err.textContent = val ? 'That doesn’t look like an OpenAI key: it should start with “sk-”.' : 'Paste your OpenAI API key first.';
        return;
    }
    if (typeof callsSaveApiKey === 'function') callsSaveApiKey(val);
    else { try { localStorage.setItem('openai_api_key', val); } catch (e) {} }
    if (input) input.value = '';
    if (!examGetApiKey()) { if (err) err.textContent = 'The key could not be saved on this device.'; return; }
    var next = where === 'notice' ? examKeyNext : null;
    examKeyNext = null;
    if (next && next.draft) examResumeDraft(next.draft);
    else if (next) examOpenSection(next.arg, next.teil);
    else examShowList();
}

function examSectionCardHtml(id, hasKey) {
    var sec = EXAM_SECTIONS[id];
    var hist = examSectionHistory(id);
    var best = examBestScore(id);
    var last = examLastScore(id);
    var drills = examGetHistory().filter(function(a) { return a.section === id && a.teil; }).length;
    var b1 = sec.level === 'B1' && examHasB1() ? B1_EXAM_SECTIONS[sec.module] : null;
    var teile = b1 ? examB1Teile(sec.module) : [];
    var sub = sec.titleEn + (b1 ? ' · ' + teile.length + ' ' + (sec.module === 'schreiben' ? 'Aufgaben' : 'Teile') + ' · ' + b1.minutes + ' min' : '');
    var miniChart = examDrawChart(hist.slice(-10).map(function(a) { return a.percentage; }), 80, 36, true);
    var arg = sec.level === 'B1' ? id : id + '_a1';
    var stats = (last !== null ? 'Last: ' + last + '%' : 'Not started') + ' · ' + hist.length + ' attempt' + (hist.length === 1 ? '' : 's') +
        (drills ? ' · ' + drills + ' drill' + (drills === 1 ? '' : 's') : '');

    var html = '<div class="exam-section-card' + (hasKey ? '' : ' locked') + '" onclick="examOpenSection(\'' + arg + '\')">' +
        '<div class="exam-section-top">' +
            '<div class="exam-section-emoji">' + sec.emoji + '</div>' +
            '<div class="exam-section-info">' +
                '<div class="exam-section-title">' + examEsc(sec.titleDe) + '</div>' +
                '<div class="exam-section-subtitle">' + examEsc(sub) + '</div>' +
            '</div>' +
            '<div class="exam-section-score">' +
                (!hasKey ? '<div class="exam-lock">🔑 key</div>' : '') +
                (best !== null ? '<div class="exam-best">' + best + '%</div><div class="exam-best-label">best</div>'
                               : (hasKey ? '<div class="exam-best-empty">—</div>' : '')) +
            '</div>' +
        '</div>' +
        '<div class="exam-section-bottom">' +
            '<div class="exam-section-stats">' + examEsc(stats) + '</div>' +
            '<div class="exam-section-chart">' + miniChart + '</div>' +
        '</div>';
    if (teile.length > 1 || examLastWithDetail(id)) {
        html += '<div class="exam-teil-chips" onclick="event.stopPropagation()">';
        if (teile.length > 1) {
            html += '<span class="exam-teil-label">Only ' + examPartWord(sec.module) + '</span>';
            teile.forEach(function(t) {
                html += '<button type="button" class="exam-teil-chip" onclick="examOpenSection(\'' + id + '\',' + t.n + ')">' + t.n + '</button>';
            });
        }
        if (examLastWithDetail(id)) {
            html += '<button type="button" class="exam-link-btn" onclick="examReviewLast(\'' + id + '\')">📝 Last feedback</button>';
        }
        html += '</div>';
    }
    return html + '</div>';
}

var EXAM_DRAFTS_SHOWN = 3;

// The newest drafts, plus a toggle for the rest so every draft stays reachable.
function examDraftsHtml() {
    var drafts = examDraftsList();
    if (!drafts.length) return '';
    var all = !!examOpenDetails.draftsAll;
    var more = drafts.length - EXAM_DRAFTS_SHOWN;
    var html = '<div class="exam-drafts">';
    (all ? drafts : drafts.slice(0, EXAM_DRAFTS_SHOWN)).forEach(function(d) {
        var resumable = EXAM_SECTIONS[d.section].level === 'B1' && !!d.task;
        var preview = d.text.replace(/\s+/g, ' ').trim();
        if (preview.length > 90) preview = preview.slice(0, 90) + '…';
        var when = new Date(d.savedAt || Date.now());
        var stamp = when.getDate() + '.' + (when.getMonth() + 1) + '. ' + ('0' + when.getHours()).slice(-2) + ':' + ('0' + when.getMinutes()).slice(-2);
        html += '<div class="exam-draft-card">' +
            '<div class="exam-draft-title">📝 Unfinished: ' + examEsc(examAttemptTitle(d.section, d.teil)) + '</div>' +
            '<div class="exam-draft-preview">' + examEsc(preview) + '</div>' +
            '<div class="exam-draft-meta">' + examWordCount(d.text) + ' words · saved ' + examEsc(stamp) + '</div>' +
            '<div class="exam-draft-actions">' +
                (resumable ? '<button type="button" class="exam-btn-small primary" onclick="examResumeDraft(\'' + d.key + '\')">Continue</button>' : '') +
                '<button type="button" class="exam-btn-small" onclick="examCopyDraft(this,\'' + d.key + '\')">📋 Copy</button>' +
                '<button type="button" class="exam-btn-small" onclick="examDeleteDraft(\'' + d.key + '\')">Delete</button>' +
            '</div>' +
        '</div>';
    });
    if (more > 0) {
        html += '<button type="button" class="exam-link-btn exam-drafts-more" onclick="examDraftsShowAll(' + (all ? 'false' : 'true') + ')">' +
            (all ? 'Show fewer drafts' : '+ ' + more + ' more draft' + (more === 1 ? '' : 's')) + '</button>';
    }
    return html + '</div>';
}

function examDraftsShowAll(on) {
    examOpenDetails.draftsAll = !!on;
    examShowList();
}

// draftKey: the draft to continue once a key is saved (from examResumeDraft).
function examShowKeyNotice(id, teil, draftKey) {
    examView = 'notice';
    var c = examContainer();
    if (!c) return;
    var sec = EXAM_SECTIONS[id] || EXAM_SECTIONS.lesen_b1;
    var name = examAttemptTitle(sec.id, teil);
    examKeyNext = { arg: sec.level === 'B1' ? sec.id : sec.id + '_a1', teil: teil || null, draft: draftKey || null };
    var html = '<div class="exam-notice">' +
        '<div class="exam-notice-icon">🔑</div>' +
        '<div class="exam-notice-title">' + examEsc(name) + ' needs an OpenAI key</div>' +
        '<p>The questions' + (sec.module === 'hoeren' ? ', the audio' : '') + ' and the grading of this mock exam are made by AI, with your own OpenAI API key. ' +
            'You only need to add it once: paste it below (it starts with <code>sk-</code>) and ' + examEsc(name) + ' starts right away.</p>' +
        examKeyFormHtml('notice') +
        '<button type="button" class="exam-btn-secondary" onclick="examShowList()">← Exam overview</button>' +
    '</div>';
    if (sec.level === 'B1' && examHasB1() && B1_EXAM_SECTIONS[sec.module]) {
        examCopyTexts = {};
        html += '<div class="exam-group-title">Meanwhile, without a key</div>' +
            '<div class="exam-toolkit"><div class="exam-tk exam-tk-static"><div class="exam-tk-static-title">' + examEsc(sec.emoji + ' ' + B1_EXAM_SECTIONS[sec.module].titleDe) + ' · format & tactics</div>' +
            '<div class="exam-tk-body">' + examTkModuleHtml(sec.module) + '</div></div>';
        if (typeof B1_OFFICIAL_SETS !== 'undefined') {
            html += '<div class="exam-tk exam-tk-static"><div class="exam-tk-static-title">📄 Official practice sets</div><div class="exam-tk-body">' + examTkOfficialHtml() + '</div></div>';
        }
        html += '</div><p class="exam-notice-foot">The checkpoint quiz and the full B1 toolkit are on the Exam overview.</p>';
    }
    c.innerHTML = html;
    c.scrollTop = 0;
}

// ── B1 toolkit (static data from b1-exam-data.js, no key) ──────

function examTkDetails(key, title, body) {
    return '<details class="exam-tk" data-key="' + key + '" ontoggle="examDetailsToggle(this)"' + (examOpenDetails[key] ? ' open' : '') + '>' +
        '<summary>' + examEsc(title) + '</summary>' +
        '<div class="exam-tk-body">' + body + '</div>' +
    '</details>';
}

function examCopyBtn(id) {
    return '<button type="button" class="exam-copy-btn" onclick="examCopy(this,\'' + id + '\')">📋 Copy</button>';
}

function examToolkitHtml() {
    examCopyTexts = {};
    var html = '<div class="exam-group-title">B1 toolkit · works without a key</div><div class="exam-toolkit">';
    ['hoeren', 'lesen', 'schreiben', 'sprechen'].forEach(function(m) {
        var mod = B1_EXAM_SECTIONS[m];
        if (mod) html += examTkDetails('tk-' + m, mod.emoji + ' ' + mod.titleDe + ' · format & tactics', examTkModuleHtml(m));
    });
    if (typeof B1_SCHREIBEN_TEMPLATES !== 'undefined') html += examTkDetails('tk-templates', '✍️ Writing templates (Aufgabe 1–3)', examTkTemplatesHtml());
    if (typeof B1_SPRECHEN_REDEMITTEL !== 'undefined') html += examTkDetails('tk-redemittel', '💬 Speaking phrases (Redemittel)', examTkRedemittelHtml());
    if (typeof B1_PRESENTATION_TOPICS !== 'undefined') html += examTkDetails('tk-topics', '🎤 Presentation topics (Sprechen Teil 2)', examTkTopicsHtml());
    if (typeof B1_CONNECTORS !== 'undefined') html += examTkDetails('tk-connectors', '🔗 Connectors for the Strukturen points', examTkConnectorsHtml());
    if (typeof B1_GRAMMAR_PRIORITIES !== 'undefined') html += examTkDetails('tk-grammar', '📐 Grammar the exam pays for', '<ol class="exam-tk-list">' +
        B1_GRAMMAR_PRIORITIES.map(function(g) { return '<li>' + examEsc(g) + '</li>'; }).join('') + '</ol>');
    if (typeof B1_COACH_PROMPTS !== 'undefined') html += examTkDetails('tk-coach', '🤖 AI coach prompts (examiner & corrector)', examTkCoachHtml());
    if (typeof B1_OFFICIAL_SETS !== 'undefined') html += examTkDetails('tk-official', '📄 Official practice sets (Goethe-Institut)', examTkOfficialHtml());
    return html + '</div>';
}

function examTkModuleHtml(m) {
    var mod = B1_EXAM_SECTIONS[m];
    var facts = [];
    if (mod.minutes) facts.push(mod.minutes + ' min' + (mod.prepMinutes ? ' + ' + mod.prepMinutes + ' min preparation' : ''));
    if (m === 'hoeren' || m === 'lesen') facts.push(mod.items + ' items');
    if (mod.passItems) facts.push('pass: ' + mod.passItems + ' of ' + mod.items + ' items (' + mod.passPoints + ' points)');
    else if (mod.passPoints) facts.push('pass: ' + mod.passPoints + ' of 100 points');
    var teile = (mod.teile || []).map(function(t) {
        var bits = [];
        if (t.items) bits.push(t.items + ' items');
        if (t.points) bits.push(t.points + ' points');
        if (t.words) bits.push('~' + t.words + ' words');
        if (t.minutes) bits.push(t.minutes + ' min');
        if (t.plays) bits.push(t.plays === 2 ? 'played twice' : 'played once');
        var name = t.n === 0 ? 'Aussprache' : examPartWord(m) + ' ' + t.n;
        return '<li><div class="exam-tk-teil-head"><strong>' + examEsc(name) + '</strong>' + (bits.length ? ' · ' + examEsc(bits.join(' · ')) : '') + '</div>' +
            '<div class="exam-tk-teil-format">' + examEsc(t.format) + '</div></li>';
    }).join('');
    var tactics = (mod.tactics || []).map(function(x) { return '<li>' + examEsc(x) + '</li>'; }).join('');
    return '<div class="exam-tk-facts">' + examEsc(facts.join(' · ')) + '</div>' +
        '<ul class="exam-tk-teile">' + teile + '</ul>' +
        (tactics ? '<div class="exam-tk-sub">Tactics</div><ol class="exam-tk-list">' + tactics + '</ol>' : '');
}

function examTkTemplateHtml(t, copyId) {
    var lines = (t.lines || []).map(function(l) {
        return '<div class="exam-tk-line"><span class="exam-tk-de">' + examSlotHtml(l.de) + '</span>' +
            (l.gloss ? '<span class="exam-tk-gloss">' + examEsc(l.gloss) + '</span>' : '') + '</div>';
    }).join('');
    var meta = [t.subtitle, t.words ? '~' + t.words + ' words' : '', t.points ? t.points + ' points' : ''].filter(Boolean).join(' · ');
    return '<div class="exam-tk-item">' +
        '<div class="exam-tk-item-head"><div><div class="exam-tk-item-title">' + examEsc(t.title) + '</div>' +
            (meta ? '<div class="exam-tk-item-sub">' + examEsc(meta) + '</div>' : '') + '</div>' +
            (copyId ? examCopyBtn(copyId) : '') + '</div>' +
        '<div class="exam-tk-lines">' + lines + '</div>' +
    '</div>';
}

function examTemplateCopyText(t) {
    return (t.lines || []).map(function(l) { return examSlotPlain(l.de); }).join('\n');
}

function examTkTemplatesHtml() {
    return B1_SCHREIBEN_TEMPLATES.map(function(t, i) {
        var id = 'tpl' + i;
        examCopyTexts[id] = examTemplateCopyText(t);
        return examTkTemplateHtml(t, id);
    }).join('') + '<div class="exam-tk-note"><mark class="exam-tk-slot">Highlighted</mark> parts change with each task; learn the rest by heart.</div>';
}

function examTkRedemittelHtml() {
    return B1_SPRECHEN_REDEMITTEL.map(function(r, i) {
        var id = 'rm' + i;
        var groups = r.groups || [];
        examCopyTexts[id] = r.title + '\n' + groups.map(function(g) {
            return g.label + ':\n' + (g.items || []).map(function(x) { return '– ' + examSlotPlain(x); }).join('\n');
        }).join('\n');
        return '<div class="exam-tk-item">' +
            '<div class="exam-tk-item-head"><div class="exam-tk-item-title">' + examEsc(r.title) + '</div>' + examCopyBtn(id) + '</div>' +
            groups.map(function(g) {
                return '<div class="exam-tk-group"><div class="exam-tk-group-label">' + examEsc(g.label) + '</div>' +
                    '<ul class="exam-tk-phrases">' + (g.items || []).map(function(x) { return '<li>' + examSlotHtml(x) + '</li>'; }).join('') + '</ul></div>';
            }).join('') +
        '</div>';
    }).join('');
}

function examTkTopicsHtml() {
    examCopyTexts.topics = B1_PRESENTATION_TOPICS.map(function(t, i) { return (i + 1) + '. ' + t.de; }).join('\n');
    return '<div class="exam-tk-item-head"><div class="exam-tk-note">Prepare a five-slide talk for each (phrases: Redemittel › Teil 2).</div>' + examCopyBtn('topics') + '</div>' +
        '<ol class="exam-tk-topics">' + B1_PRESENTATION_TOPICS.map(function(t) {
            return '<li><span class="exam-tk-de">' + examEsc(t.de) + '</span>' + (t.en ? ' <span class="exam-tk-gloss">' + examEsc(t.en) + '</span>' : '') + '</li>';
        }).join('') + '</ol>';
}

function examTkConnectorsHtml() {
    var labels = { own_by_december: 'Use these in every text', polite_requests: 'Polite requests' };
    return Object.keys(B1_CONNECTORS).map(function(k) {
        var list = B1_CONNECTORS[k] instanceof Array ? B1_CONNECTORS[k] : [];
        return '<div class="exam-tk-group"><div class="exam-tk-group-label">' + examEsc(labels[k] || k.replace(/_/g, ' ')) + '</div>' +
            '<div class="exam-tk-chips">' + list.map(function(x) { return '<span class="exam-tk-chip">' + examEsc(x) + '</span>'; }).join('') + '</div></div>';
    }).join('');
}

function examTkCoachHtml() {
    return '<div class="exam-tk-note">Paste into Claude (voice mode) or ChatGPT. They run outside this app, so no key is needed here.</div>' +
        B1_COACH_PROMPTS.map(function(p, i) {
            var id = 'coach' + i;
            examCopyTexts[id] = p.text;
            return '<div class="exam-tk-item">' +
                '<div class="exam-tk-item-head"><div class="exam-tk-item-title">' + examEsc(p.title) + '</div>' + examCopyBtn(id) + '</div>' +
                '<div class="exam-tk-prompt">' + examEsc(p.text) + '</div>' +
            '</div>';
        }).join('');
}

function examTkOfficialHtml() {
    return '<ul class="exam-tk-links">' + B1_OFFICIAL_SETS.map(function(o) {
        var main = examSafeUrl(o.url);
        if (!main) return '';
        var audio = examSafeUrl(o.audio);
        var audioKind = /\.mp4(\?|$)/i.test(audio) ? 'MP4' : (/\.mp3(\?|$)/i.test(audio) ? 'MP3' : 'audio');
        return '<li>' +
            '<a class="exam-tk-link" href="' + examEsc(main) + '" target="_blank" rel="noopener">' + (o.kind === 'pdf' ? '📄 ' : '🌐 ') + examEsc(o.name) +
                ' <span class="exam-tk-kind">' + (o.kind === 'pdf' ? 'PDF' : 'web') + '</span></a>' +
            (audio ? '<a class="exam-tk-link exam-tk-audio" href="' + examEsc(audio) + '" target="_blank" rel="noopener">🎧 Hören audio <span class="exam-tk-kind">' + audioKind + '</span></a>' : '') +
        '</li>';
    }).join('') + '</ul>';
}

// ── SVG chart ──────────────────────────────────────────────────

function examDrawChart(scores, width, height, isMini) {
    var w = width || 320;
    var h = height || 120;
    var pad = isMini ? 2 : 24;
    // The viewBox lets CSS shrink the chart on narrow screens (iPhone SE).
    var size = 'width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet"';

    if (!scores.length) {
        return '<svg ' + size + ' class="exam-chart-empty">' +
            '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (h * 0.4) + '" y2="' + (h * 0.4) + '" stroke="#444" stroke-dasharray="3,3"/>' +
        '</svg>';
    }

    var innerW = w - pad * 2;
    var innerH = h - pad * 2;
    var n = scores.length;

    function x(i) { return pad + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1)); }
    function y(s) { return pad + innerH - (examClamp(Number(s) || 0, 0, 100) / 100) * innerH; }

    var passLineY = y(60);
    var lastScore = scores[n - 1];
    var lineColor = lastScore >= 60 ? '#10b981' : '#ef4444';
    var pts = scores.map(function(s, i) { return x(i) + ',' + y(s); }).join(' ');

    var svg = '<svg ' + size + ' class="exam-chart' + (isMini ? ' exam-chart-mini' : '') + '">';
    svg += '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + passLineY + '" y2="' + passLineY + '" stroke="#666" stroke-dasharray="3,3" stroke-width="1"/>';
    if (!isMini) {
        svg += '<text x="' + (pad - 4) + '" y="' + (y(0) + 4) + '" text-anchor="end" fill="#666" font-size="10">0</text>';
        svg += '<text x="' + (pad - 4) + '" y="' + (passLineY + 4) + '" text-anchor="end" fill="#666" font-size="10">60</text>';
        svg += '<text x="' + (pad - 4) + '" y="' + (y(100) + 4) + '" text-anchor="end" fill="#666" font-size="10">100</text>';
    }
    if (n >= 2) svg += '<polyline points="' + pts + '" fill="none" stroke="' + lineColor + '" stroke-width="' + (isMini ? 1.5 : 2) + '"/>';
    scores.forEach(function(s, i) {
        svg += '<circle cx="' + x(i) + '" cy="' + y(s) + '" r="' + (isMini ? 1.5 : 3) + '" fill="' + (s >= 60 ? '#10b981' : '#ef4444') + '"/>';
    });
    return svg + '</svg>';
}

// ── Checkpoint quiz (no API key) ───────────────────────────────
// A short vocab + grammar quiz drawn only from words and chapters already
// seen, so it gets harder on its own; scored for the Plan's readiness line.

var CHECKPOINT_HISTORY_KEY = 'checkpoint-history';

function checkpointGetHistory() {
    try {
        var h = JSON.parse(localStorage.getItem(CHECKPOINT_HISTORY_KEY) || '[]');
        return h instanceof Array ? h : [];
    } catch (e) { return []; }
}

// missed: [{prompt, answer, yours, wordId}], kept on the last 10 attempts so
// the card's "Last result" can show the review list again.
function checkpointSaveAttempt(percentage, wordCount, missed, correct, total) {
    var hist = checkpointGetHistory();
    var rec = { date: examDayKey(), percentage: Math.round(percentage), wordCount: wordCount, timestamp: Date.now() };
    if (missed instanceof Array) { rec.missed = missed; rec.correct = correct; rec.total = total; }
    hist.push(rec);
    while (hist.length > 100) hist.shift();
    for (var i = 0; i < hist.length - 10; i++) delete hist[i].missed;
    try { localStorage.setItem(CHECKPOINT_HISTORY_KEY, JSON.stringify(hist)); } catch (e) {}
    examLogAttempt('Checkpoint', Math.round(percentage));
    return rec;
}

function checkpointReadiness() {
    var hist = checkpointGetHistory().slice(-3);
    if (!hist.length) return { text: 'not enough data', attempts: 0 };
    var weights = [0.5, 0.3, 0.2].slice(0, hist.length);
    var recent = hist.slice().reverse();
    var wSum = 0, total = 0;
    recent.forEach(function(a, i) { var w = weights[i] || 0.1; total += a.percentage * w; wSum += w; });
    var avg = Math.round(total / wSum);
    return { text: avg + '/100', attempts: hist.length, trend: recent[0].percentage >= (recent[1] ? recent[1].percentage : recent[0].percentage) };
}

function checkpointIntroducedWords() {
    if (typeof ALL_WORDS === 'undefined') return [];
    var useState = typeof wordState === 'function';
    var prog = typeof wordProgress !== 'undefined' && wordProgress ? wordProgress : {};
    return ALL_WORDS.filter(function(w) {
        if (useState) {
            try { return wordState(w.id) !== 'new'; } catch (e) {}
        }
        return !!prog[w.id];
    });
}

function checkpointCardHtml() {
    var count = checkpointIntroducedWords().length;
    var hist = checkpointGetHistory();
    var last = hist.length ? hist[hist.length - 1] : null;
    var readiness = checkpointReadiness();
    var subtitle = count < 10
        ? 'Learn a few more cards first: the checkpoint needs at least 10 words you have seen (now ' + count + ').'
        : (last ? 'Last: ' + last.percentage + '% · ' + readiness.attempts + ' attempt' + (readiness.attempts === 1 ? '' : 's') + ' · readiness ' + readiness.text
                : 'No attempts yet. Draws only from words and grammar chapters you have already seen, so it gets harder as you learn more.');
    return '<div class="checkpoint-card">' +
        '<div class="checkpoint-card-top">' +
            '<div class="checkpoint-card-emoji">📊</div>' +
            '<div>' +
                '<div class="checkpoint-card-title">Checkpoint quiz <span class="exam-free-tag">no key needed</span></div>' +
                '<div class="checkpoint-card-sub">' + examEsc(subtitle) + '</div>' +
            '</div>' +
        '</div>' +
        '<button type="button" class="btn btn-primary checkpoint-start-btn" id="checkpoint-start-btn" onclick="checkpointStart()"' +
            (count < 10 ? ' disabled' : '') + '>Start checkpoint</button>' +
        (last && last.missed instanceof Array
            ? '<div class="checkpoint-card-links"><button type="button" class="exam-link-btn" onclick="checkpointReviewLast()">📝 Last result</button></div>' : '') +
    '</div>';
}

function checkpointReviewLast() {
    if (examInProgress()) return;
    var hist = checkpointGetHistory();
    var last = hist.length ? hist[hist.length - 1] : null;
    if (last && last.missed instanceof Array) checkpointShowResults(last, true);
    else examShowList();
}

// A word's meanings or forms: "friend (male) / boyfriend" -> ["friend", "boyfriend"].
function checkpointSenses(text) {
    return String(text || '').toLowerCase().split('/').map(function(x) {
        return x.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
    }).filter(Boolean);
}

function checkpointBuildVocabQuestions(pool, count) {
    var senses = {};
    function sensesOf(w) {
        if (!senses[w.id]) senses[w.id] = { en: checkpointSenses(w.en), de: checkpointSenses(w.de) };
        return senses[w.id];
    }
    function overlap(a, b) {
        for (var i = 0; i < a.length; i++) if (b.indexOf(a[i]) !== -1) return true;
        return false;
    }
    // A distractor never shares a meaning or a form with the word asked, so
    // every question has one right answer: weil is "because" too, and
    // sie / ihr / sein each have several meanings.
    function distinct(w, word) {
        if (w.id === word.id) return false;
        var a = sensesOf(w), b = sensesOf(word);
        return !overlap(a.en, b.en) && !overlap(a.de, b.de);
    }
    return examShuffle(pool).slice(0, count).map(function(word) {
        var dir = Math.random() < 0.5 ? 'de_to_en' : 'en_to_de';
        var key = dir === 'de_to_en' ? 'en' : 'de';
        var cands = pool.filter(function(w) { return distinct(w, word) && w.category === word.category && w.type === word.type; });
        if (cands.length < 3) cands = pool.filter(function(w) { return distinct(w, word) && w.category === word.category; });
        if (cands.length < 3) cands = pool.filter(function(w) { return distinct(w, word); });
        var opts = [{ text: String(word[key] || ''), correct: true }];
        var seen = [opts[0].text.toLowerCase()];
        examShuffle(cands).forEach(function(w) {
            var t = String(w[key] || '');
            if (opts.length >= 4 || !t || seen.indexOf(t.toLowerCase()) !== -1) return;
            seen.push(t.toLowerCase());
            opts.push({ text: t, correct: false });
        });
        return { wordId: word.id, direction: dir, prompt: dir === 'de_to_en' ? word.de : word.en, options: examShuffle(opts) };
    }).filter(function(q) { return q.prompt && q.options.length >= 2; });
}

function checkpointCollectGrammarExamples() {
    if (typeof ALL_GRAMMAR === 'undefined') return [];
    var viewed = typeof grammarViewedIds === 'function' ? grammarViewedIds() : [];
    var examples = [];
    ALL_GRAMMAR.forEach(function(section) {
        if (viewed.indexOf(section.id) === -1) return;
        (section.content || []).forEach(function(item) {
            if (item.type === 'example' && item.de && item.en) examples.push({ de: item.de, en: item.en });
        });
    });
    return examples;
}

function checkpointBuildGrammarQuestions(count) {
    var pool = checkpointCollectGrammarExamples();
    if (pool.length < 4) return [];
    return examShuffle(pool).slice(0, count).map(function(ex) {
        var seen = [ex.en.toLowerCase()];
        var opts = [{ text: ex.en, correct: true }];
        examShuffle(pool).forEach(function(d) {
            if (opts.length >= 4 || seen.indexOf(d.en.toLowerCase()) !== -1) return;
            seen.push(d.en.toLowerCase());
            opts.push({ text: d.en, correct: false });
        });
        return { wordId: null, direction: 'de_to_en', prompt: ex.de, options: examShuffle(opts) };
    }).filter(function(q) { return q.options.length >= 2; });
}

function checkpointStart() {
    if (examInProgress()) {
        if (examSession.kind === 'checkpoint') return;
        if (!window.confirm('Leave the unfinished ' + examAttemptTitle(examSession.section, examSession.teilN) + ' and start the checkpoint?')) return;
        examLeaveRun();
    }
    var introduced = checkpointIntroducedWords();
    if (introduced.length < 10) { examEndRun(); examShowList(); return; }
    var s = examBeginRun('checkpoint', 'checkpoint');
    s.wordCount = introduced.length;
    s.questions = examShuffle(checkpointBuildVocabQuestions(introduced, Math.min(9, introduced.length)).concat(checkpointBuildGrammarQuestions(4)));
    s.index = 0;
    s.correct = 0;
    s.missed = [];
    checkpointShowQuestion(s);
}

function checkpointShowQuestion(s) {
    if (!examLive(s)) return;
    if (s.index >= s.questions.length) { checkpointFinish(s); return; }
    var q = s.questions[s.index];
    s.answered = false;
    examRender(s, '<div class="exam-active">' +
        examActiveHeader('📊 Checkpoint', (s.index + 1) + ' / ' + s.questions.length) +
        '<div class="exam-question">' +
            '<div class="exam-question-text">' + (q.direction === 'de_to_en' ? 'What does this mean?' : 'How do you say this in German?') + '</div>' +
            '<div class="exam-context">' + examEsc(q.prompt) + '</div>' +
            '<div class="exam-options" id="checkpoint-options"></div>' +
        '</div>' +
    '</div>');
    var optsEl = document.getElementById('checkpoint-options');
    q.options.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'exam-option';
        btn.textContent = opt.text;
        btn.addEventListener('click', function() { checkpointAnswer(s, idx, optsEl); });
        optsEl.appendChild(btn);
    });
}

function checkpointAnswer(s, idx, container) {
    if (!examLive(s) || s.answered) return;
    s.answered = true;
    s.progressed = true;
    var q = s.questions[s.index];
    var btns = container.querySelectorAll('.exam-option');
    var right = 0;
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.add('disabled');
        if (q.options[i].correct) { btns[i].classList.add('correct'); right = i; }
    }
    var ok = !!q.options[idx].correct;
    if (ok) s.correct++;
    else {
        btns[idx].classList.add('wrong');
        s.missed.push({ prompt: q.prompt, answer: q.options[right].text, yours: q.options[idx].text, wordId: q.wordId });
    }
    setTimeout(function() {
        if (!examLive(s)) return;
        s.index++;
        checkpointShowQuestion(s);
    }, ok ? 800 : 1600);
}

function checkpointFinish(s) {
    var total = s.questions.length;
    var pct = total ? Math.round((s.correct / total) * 100) : 0;
    var correct = s.correct, missed = s.missed;
    examEndRun();
    checkpointShowResults(checkpointSaveAttempt(pct, s.wordCount, missed, correct, total), false);
}

// Also reopened later from the card's "Last result" (isReview).
function checkpointShowResults(rec, isReview) {
    var missed = rec.missed instanceof Array ? rec.missed : [];
    var pct = rec.percentage;
    examView = 'results';
    examLastMissedIds = missed.map(function(m) { return m.wordId; }).filter(function(id) { return id !== null && id !== undefined; });
    var passed = pct >= 60;
    var when = new Date(rec.timestamp || Date.now());
    var html = '<div class="exam-results">' +
        '<div class="exam-results-header">📊 Checkpoint — Ergebnis</div>' +
        (isReview ? '<div class="exam-results-date">' + examEsc(when.toLocaleDateString() + ' ' + ('0' + when.getHours()).slice(-2) + ':' + ('0' + when.getMinutes()).slice(-2)) + '</div>' : '') +
        '<div class="exam-results-score-box">' +
            '<div class="exam-results-score ' + (passed ? 'passed' : 'failed') + '">' + pct + '%</div>' +
            (rec.total ? '<div class="exam-results-badge ' + (passed ? 'passed' : 'failed') + '">' + examEsc(rec.correct) + ' / ' + examEsc(rec.total) + ' correct</div>' : '') +
            '<div class="exam-results-sub">Readiness ' + examEsc(checkpointReadiness().text) + '</div>' +
        '</div>';
    if (missed.length) {
        html += '<div class="exam-results-wrong"><div class="exam-results-section-title">🔁 To review (' + missed.length + ')</div>';
        missed.forEach(function(m) {
            html += '<div class="exam-wrong-item">' +
                '<div class="exam-wrong-q">' + examEsc(m.prompt) + '</div>' +
                '<div class="exam-wrong-yours">Your answer: <span class="exam-wrong-bad">' + examEsc(m.yours) + '</span></div>' +
                '<div class="exam-wrong-right">Right: <span class="exam-wrong-good">' + examEsc(m.answer) + '</span></div>' +
            '</div>';
        });
        html += '</div>';
    } else {
        html += '<div class="exam-results-allright">✅ Everything right!</div>';
    }
    html += '<div class="exam-results-actions">';
    if (examLastMissedIds.length && typeof startPracticeSession === 'function') {
        html += '<button type="button" class="btn btn-primary" onclick="checkpointPracticeMissed()">Practise missed words</button>';
    }
    html += '<button type="button" class="btn ' + (examLastMissedIds.length && typeof startPracticeSession === 'function' ? 'exam-btn-secondary' : 'btn-primary') + '" onclick="examShowList()">Done</button></div></div>';
    var c = examContainer();
    if (c) { c.innerHTML = html; c.scrollTop = 0; }
}

function checkpointPracticeMissed() {
    if (typeof startPracticeSession === 'function' && examLastMissedIds.length) {
        startPracticeSession(examLastMissedIds.slice(), 'Checkpoint · missed words');
    }
}

// ── Speaking: the mic controller (A1 and B1 Sprechen) ──────────
// One recognizer instance; each tap on 🎤 is a listening request (examMic).
// Results are written into a textarea the user can also type into. Starts
// happen only from a tap or from 'end' (never inside onresult), and late
// events from an earlier request are ignored via examRecOwner.

var examMic = null;
var examRecRunning = false;
var examRecOwner = null;

function examSpeechSupported() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }

function examRecGet() {
    if (examRecognition) return examRecognition;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    try { examRecognition = new SR(); } catch (e) { return null; }
    examRecognition.lang = 'de-DE';
    examRecognition.onresult = examRecOnResult;
    examRecognition.onerror = examRecOnError;
    examRecognition.onend = examRecOnEnd;
    return examRecognition;
}

function examMicJoin(a, b) {
    a = String(a || '').trim();
    b = String(b || '').trim();
    if (!a) return b;
    if (!b) return a;
    return a + ' ' + b;
}

function examSpeechValue() {
    var ta = document.getElementById('exam-speech-text');
    if (ta) return ta.value.trim();
    return examSession && examSession.speechText ? String(examSession.speechText).trim() : '';
}

function examMicToggle() {
    if (examMic && examMic.listening) examMicFinish();
    else if (!examMic || !examMic.finishing) examMicStart();
}

function examMicStart() {
    var s = examSession;
    if (!s || !s.speech || !examLive(s)) return;
    if (!examRecGet()) { examMicPaint('error', 'Speech recognition is not available here, so type your answer.'); return; }
    if (examMic) examMicAbort(true);
    var ta = document.getElementById('exam-speech-text');
    var m = {
        s: s, token: s.itemToken, base: ta ? ta.value : (s.speechText || ''),
        committed: '', session: '', interim: '', listening: true, finishing: false,
        continuous: s.speech.mode === 'b1', quiet: 0, heard: false, lastError: null
    };
    examMic = m;
    s.progressed = true;
    if (s.speech.timerSeconds && !s.speech.timerStarted) {
        s.speech.timerStarted = true;
        examTimerStart(s, s.speech.timerSeconds);
    }
    examMicBegin(m);
    if (examMic === m) examMicPaint();
}

function examMicBegin(m) {
    if (examMic !== m || !m.listening) return;
    var rec = examRecognition;
    if (examRecRunning) {
        // The previous session is still closing; start once its 'end' arrives.
        m.pending = true;
        try { rec.abort(); } catch (e) {}
        clearTimeout(m.watchdog);
        m.watchdog = setTimeout(function() {
            if (examMic === m && m.pending && examRecRunning) {
                examRecRunning = false;
                examRecOwner = null;
                examMicBegin(m);
            }
        }, 1200);
        return;
    }
    m.pending = false;
    m.heard = false;
    try {
        rec.continuous = m.continuous;
        rec.interimResults = true;
        rec.lang = 'de-DE';
        rec.start();
        examRecRunning = true;
        examRecOwner = m;
        m.retried = false;
    } catch (e) {
        if (!m.retried) {
            m.retried = true;
            setTimeout(function() { examMicBegin(m); }, 400);
            return;
        }
        examMicEnded(m, 'error', 'The microphone could not start. Tap 🎤 to try again, or type your answer.');
    }
}

function examRecOnResult(e) {
    var m = examRecOwner;
    if (!m || m !== examMic) return;
    var finals = [], interim = '';
    var list = (e && e.results) || [];
    for (var i = 0; i < list.length; i++) {
        var r = list[i];
        var t = r && r[0] && r[0].transcript ? String(r[0].transcript).trim() : '';
        if (!t) continue;
        if (r.isFinal === false) { interim = examMicJoin(interim, t); continue; }
        // Some engines repeat earlier words in each new final result.
        var prev = finals.length ? finals[finals.length - 1] : '';
        if (prev && t.toLowerCase().indexOf(prev.toLowerCase()) === 0) finals[finals.length - 1] = t;
        else finals.push(t);
    }
    m.session = finals.join(' ');
    m.interim = interim;
    if (m.session || m.interim) { m.heard = true; m.quiet = 0; }
    examMicPaintText(m);
}

function examRecOnError(e) {
    var m = examRecOwner;
    if (m && m === examMic) m.lastError = e && e.error ? e.error : 'error';
}

function examMicMayContinue(m) {
    return examMic === m && examLive(m.s) && m.s.itemToken === m.token && examScreenActive() && document.visibilityState !== 'hidden';
}

function examRecOnEnd() {
    var m = examRecOwner;
    examRecRunning = false;
    examRecOwner = null;
    var cur = examMic;
    if (cur && cur.pending) {
        if (m === cur) { cur.committed = examMicJoin(cur.committed, cur.session || cur.interim); cur.session = ''; cur.interim = ''; }
        examMicBegin(cur);
        return;
    }
    if (!m || m !== cur) return;
    var err = m.lastError;
    m.lastError = null;
    if (err === 'not-allowed' || err === 'service-not-allowed') {
        examMicEnded(m, 'error', 'The microphone or speech recognition is blocked. Allow it in Settings › Safari (Microphone and Speech Recognition), or type your answer.');
        return;
    }
    if (m.listening && m.continuous && examMicMayContinue(m)) {
        // iOS ends a session after a pause or ~60s; keep listening until Stopp.
        m.committed = examMicJoin(m.committed, m.session || m.interim);
        m.session = '';
        m.interim = '';
        m.quiet = m.heard ? 0 : m.quiet + 1;
        if (m.quiet >= 3) { examMicEnded(m, 'quiet'); return; }
        setTimeout(function() {
            if (examMic !== m) return;
            if (m.listening && examMicMayContinue(m)) examMicBegin(m);
            else examMicEnded(m, 'paused');
        }, 250);
        return;
    }
    var any = m.session || m.interim || m.committed;
    if (err === 'network' && !any) {
        examMicEnded(m, 'error', 'Speech recognition needs an internet connection. Check it and tap 🎤 again, or type your answer.');
        return;
    }
    examMicEnded(m, m.finishing ? 'user' : (any ? 'done' : 'nothing'));
}

function examMicEnded(m, reason, msg) {
    m.listening = false;
    m.finishing = false;
    m.pending = false;
    clearTimeout(m.finishTimer);
    clearTimeout(m.watchdog);
    m.committed = examMicJoin(m.committed, m.session || m.interim);
    m.session = '';
    m.interim = '';
    if (examMic === m) examMic = null;
    var s = m.s;
    if (!examLive(s) || s.itemToken !== m.token) return;
    var full = examMicJoin(m.base, m.committed);
    s.speechText = full;
    var ta = document.getElementById('exam-speech-text');
    if (ta) ta.value = full;
    examMicPaint(reason, msg);
    if (s.speech && s.speech.mode === 'a1' && m.committed && (reason === 'done' || reason === 'user')) {
        var token = m.token;
        setTimeout(function() {
            if (examLive(s) && s.itemToken === token && !examMic && s.speech) s.speech.onSubmit(examSpeechValue());
        }, 700);
    }
}

function examMicFinish() {
    var m = examMic;
    if (!m) return;
    m.listening = false;
    m.finishing = true;
    examMicPaint();
    if (!examRecRunning || examRecOwner !== m) { examMicEnded(m, 'user'); return; }
    try { examRecognition.stop(); } catch (e) {}
    m.finishTimer = setTimeout(function() {
        if (examMic !== m) return;
        examMicEnded(m, 'user');
        try { examRecognition.abort(); } catch (e) {}
    }, 2000);
}

// commit=true keeps what was heard so far (leaving the tab); false drops it.
function examMicAbort(commit) {
    var m = examMic;
    if (m) {
        if (commit) examMicEnded(m, 'paused');
        else {
            m.listening = false;
            clearTimeout(m.finishTimer);
            clearTimeout(m.watchdog);
            examMic = null;
        }
    }
    if (examRecRunning && examRecognition) { try { examRecognition.abort(); } catch (e) {} }
}

function examMicPaintText(m) {
    var s = m.s;
    if (!examLive(s) || s.itemToken !== m.token) return;
    var ta = document.getElementById('exam-speech-text');
    if (ta) ta.value = examMicJoin(m.base, examMicJoin(m.committed, examMicJoin(m.session, m.interim)));
}

function examMicHint(reason, msg, mode) {
    if (msg) return msg;
    if (!examSpeechSupported()) return 'Speech recognition is not available in this browser, so type what you would say.';
    if (reason === 'nothing') return 'Nothing heard. Tap 🎤 and try again' + (mode === 'a1' ? ', or tap Überspringen.' : ', or type your answer.');
    if (reason === 'quiet') return 'Long pause, so the mic stopped. Tap 🎤 to keep going.';
    if (reason === 'paused') return 'Mic paused. Tap 🎤 to keep going.';
    if (reason === 'done' || reason === 'user') return mode === 'a1' ? 'Got it.' : 'Check the text (you can fix it), then tap Fertig.';
    return mode === 'a1' ? 'Tap 🎤 and answer in German. You can also type.' : 'Tap 🎤 and speak. Tap Stopp when you are done; you can also type or fix the text.';
}

function examMicPaint(reason, msg) {
    var s = examSession;
    var mode = s && s.speech ? s.speech.mode : 'a1';
    var m = examMic;
    var listening = !!(m && m.listening);
    var btn = document.getElementById('exam-mic-btn');
    var label = document.getElementById('exam-mic-label');
    var hint = document.getElementById('exam-mic-hint');
    var ta = document.getElementById('exam-speech-text');
    if (btn) { if (listening) btn.classList.add('listening'); else btn.classList.remove('listening'); }
    if (ta) ta.readOnly = listening || !!(m && m.finishing);
    if (label) label.textContent = listening ? 'Stopp' : (m && m.finishing ? 'Moment…' : (ta && ta.value.trim() ? 'Weitersprechen' : 'Sprechen'));
    if (hint) {
        hint.textContent = listening
            ? (mode === 'b1' ? 'Listening… speak as long as you need, then tap Stopp.' : 'Listening… say your answer.')
            : examMicHint(reason, msg, mode);
        hint.className = 'exam-mic-hint' + (!listening && (reason === 'error' || reason === 'nothing' || reason === 'warn') ? ' warn' : '');
    }
}

function examSpeechPanelHtml(mode) {
    var sr = examSpeechSupported();
    return '<div class="exam-speech">' +
        (sr ? '<button type="button" class="exam-mic-btn" id="exam-mic-btn" onclick="examMicToggle()">' +
                '<span class="exam-mic-icon">🎤</span><span id="exam-mic-label">Sprechen</span></button>' : '') +
        '<div class="exam-mic-hint" id="exam-mic-hint"></div>' +
        '<textarea class="exam-textarea exam-speech-text" id="exam-speech-text" rows="' + (mode === 'b1' ? 6 : 3) + '" ' +
            'placeholder="What you say appears here. You can also type." autocomplete="off" autocapitalize="sentences"></textarea>' +
    '</div>';
}

function examSpeechBind(s) {
    var ta = document.getElementById('exam-speech-text');
    if (ta) {
        ta.value = s.speechText || '';
        ta.addEventListener('input', function() {
            if (!examLive(s)) return;
            s.speechText = ta.value;
            s.progressed = true;
            examMicPaint();
        });
    }
    examMicPaint();
}

function examSpeechSubmit() {
    var s = examSession;
    if (!s || !s.speech) return;
    if (examMic) examMicAbort(true);
    var text = examSpeechValue();
    if (!text && s.speech.mode === 'b1') { examMicPaint('warn', 'Say (or type) your answer first.'); return; }
    s.speech.onSubmit(text);
}

function examSpeechSkip() {
    var s = examSession;
    if (!s || !s.speech) return;
    examMicAbort(false);
    s.speech.onSubmit('');
}

// ── Hören audio (per item, never attached to the wrong item) ───

function examLoadItemAudio(s, text, voice) {
    var token = s.itemToken;
    s.audioRetry = function() { examLoadItemAudio(s, text, voice); };
    s.audioText = text;
    var wrap = document.getElementById('exam-audio-wrap');
    if (wrap) wrap.innerHTML = '<div class="exam-audio-loading">⏳ Audio wird geladen…</div>';
    examTts(s, text, voice, function(res) {
        if (s.itemToken !== token) { if (res.url) { try { URL.revokeObjectURL(res.url); } catch (e) {} } return; }
        var w = document.getElementById('exam-audio-wrap');
        if (!w) { if (res.url) { try { URL.revokeObjectURL(res.url); } catch (e) {} } return; }
        if (res.error) {
            w.innerHTML = '<div class="exam-audio-error">⚠️ The audio could not be loaded: ' + examEsc(res.error) + '</div>' +
                '<div class="exam-audio-actions">' +
                    '<button type="button" class="exam-btn-small primary" onclick="examAudioRetry()">🔁 Load again</button>' +
                    '<button type="button" class="exam-btn-small" onclick="examAudioShowText()">📄 Read the text instead</button>' +
                '</div>';
            return;
        }
        if (s.audioUrl) { try { URL.revokeObjectURL(s.audioUrl); } catch (e) {} }
        s.audioUrl = res.url;
        w.innerHTML = '<audio id="exam-audio" controls preload="auto" class="exam-audio"></audio>';
        var a = document.getElementById('exam-audio');
        a.src = res.url;
        examActiveAudio = a;
    });
}

function examAudioRetry() {
    var s = examSession;
    if (s && s.audioRetry) s.audioRetry();
}

function examAudioShowText() {
    var s = examSession;
    var w = document.getElementById('exam-audio-wrap');
    if (!s || !w || !s.audioText) return;
    w.innerHTML = '<div class="exam-reading-text">' + examEsc(s.audioText) + '</div>';
}

// ── A1 practice ────────────────────────────────────────────────

var A1_HOEREN_PROMPT = 'Create a Goethe A1 Hören practice test in German. Return JSON only.\n\n' +
    'Required schema (use this EXACT example as your style guide — replace its content but match the structure):\n\n' +
    '{\n' +
    '  "teil1": [\n' +
    '    {"context":"At a train station","dialog":[{"speaker":"A","text":"Wann fährt der Zug nach Berlin?"},{"speaker":"B","text":"Der Zug fährt um halb zehn."}],"question":"Wann fährt der Zug nach Berlin?","options":["um 9:00 Uhr","um 9:30 Uhr","um 10:00 Uhr"],"correct":1},\n' +
    '    ... 5 more items ...\n' +
    '  ],\n' +
    '  "teil2": [\n' +
    '    {"context":"Supermarket announcement","text":"Liebe Kunden, der Supermarkt schließt heute um 20 Uhr. Wir wünschen Ihnen einen schönen Abend.","statement":"Der Supermarkt schließt heute früher als sonst.","correct":true},\n' +
    '    ... 3 more items ...\n' +
    '  ],\n' +
    '  "teil3": [\n' +
    '    {"context":"Phone message","text":"Hallo Maria, hier ist Tom. Wir treffen uns morgen um 18 Uhr im Café Lehmann. Bring bitte deine Schwester mit!","question":"Wo treffen sich Maria und Tom?","options":["im Restaurant","im Café","im Park"],"correct":1},\n' +
    '    ... 4 more items ...\n' +
    '  ]\n' +
    '}\n\n' +
    'CRITICAL: every "options" array must contain THREE real German answer phrases like the example above. NEVER output single letters. Use varied A1 topics: shopping, travel, family, time, weather, food, transport.';

var A1_LESEN_PROMPT = 'Create a Goethe A1 Lesen practice test in German. Return JSON only.\n\n' +
    'Required schema (use this EXACT example as your style guide — replace its content but match the structure):\n\n' +
    '{\n' +
    '  "teil1": [\n' +
    '    {"text":"Hallo Anna! Ich komme heute Abend um 19 Uhr nach Hause. Können wir zusammen kochen? Ich kaufe noch Brot und Käse. Bis später! Lukas","statement":"Lukas kommt um sieben Uhr abends nach Hause.","correct":true},\n' +
    '    ... 4 more items ...\n' +
    '  ],\n' +
    '  "teil2": [\n' +
    '    {"text":"Bäckerei Müller — Heute frische Brötchen für nur 30 Cent! Geöffnet von 6 bis 18 Uhr. Sonntag geschlossen.","question":"Wann ist die Bäckerei am Sonntag geöffnet?","options":["von 6 bis 18 Uhr","gar nicht","nur morgens"],"correct":1},\n' +
    '    ... 4 more items ...\n' +
    '  ],\n' +
    '  "teil3": [\n' +
    '    {"text":"Achtung! Die Bibliothek ist heute geschlossen. Wir öffnen wieder am Montag um 9 Uhr.","statement":"Die Bibliothek ist morgen offen.","correct":false},\n' +
    '    ... 4 more items ...\n' +
    '  ]\n' +
    '}\n\n' +
    'CRITICAL: every "options" array must contain THREE real German answer phrases (full words and short sentences), like the example above. NEVER output single letters such as "a", "b", "c". Use varied A1 topics: shopping, food, travel, family, work, weather, time. Mix true/false answers across items.';

var A1_SCHREIBEN_PROMPT = 'Generate Goethe A1 Schreiben practice prompts as JSON:\n' +
    '{\n' +
    '  "teil1": { "scenario": "What form context (e.g. Library card application, Gym registration)", "intro": "Short German context paragraph (30-50 words) giving info to fill in", "fields": [ {"label":"Vorname","correct_answer":"..."}, ... 5 fields with German labels and correct answers extractable from intro ] },\n' +
    '  "teil2": { "scenario": "Who you are writing to and why (in English, brief)", "task_de": "German task description with 3 bullet points to address", "min_words": 30 }\n' +
    '}';

var A1_SPRECHEN_PROMPT = 'Generate Goethe A1 Sprechen prompts as JSON:\n' +
    '{\n' +
    '  "teil1_fields": ["Name","Alter","Land","Wohnort","Sprachen","Beruf","Hobby"],\n' +
    '  "teil2": { "topic": "Single A1 topic word in German (e.g. Familie, Hobby, Wohnung, Essen)", "questions": ["Q1 in German","Q2 in German","Q3 in German"] },\n' +
    '  "teil3": { "scenario": "Brief A1 situation in German (e.g. Im Restaurant)", "request_prompt": "What you must request in German", "respond_prompt": "What you must respond to in German" }\n' +
    '}';

function a1Start(s) {
    s.module = EXAM_SECTIONS[s.section].module;
    if (s.module === 'hoeren' || s.module === 'lesen') a1StartReceptive(s);
    else if (s.module === 'schreiben') a1StartSchreiben(s);
    else a1StartSprechen(s);
}

function a1CleanItem(module, it) {
    if (!it || typeof it !== 'object') return null;
    var q = String(it.question || it.statement || '').trim();
    if (!q) return null;
    var out = { context: String(it.context || ''), question: q, text: String(it.text || '') };
    if (it.options !== undefined && it.options !== null) {
        var opts = examCleanOptions(it.options);
        if (!opts) return null;
        var c = examAnswerIndex(it.correct, opts);
        if (c === null) return null;
        out.options = opts;
        out.correct = c;
    } else {
        var b = examBool(it.correct);
        if (b === null) return null;
        out.options = null;
        out.correct = b;
    }
    if (module === 'hoeren') {
        if (it.dialog instanceof Array && it.dialog.length) {
            out.audioText = it.dialog.map(function(d) { return d && d.text ? String(d.text) : ''; }).filter(Boolean).join(' … ');
            out.voice = 'nova';
        } else {
            out.audioText = out.text;
            out.voice = 'onyx';
        }
        if (!out.audioText.trim()) return null;
    } else if (!out.text.trim()) return null;
    return out;
}

function a1CleanReceptive(module, data) {
    if (!data || typeof data !== 'object') return null;
    var test = ['teil1', 'teil2', 'teil3'].map(function(k) {
        return (data[k] instanceof Array ? data[k] : []).map(function(it) { return a1CleanItem(module, it); }).filter(Boolean);
    });
    var total = test.reduce(function(n, t) { return n + t.length; }, 0);
    return total ? test : null;
}

function a1StartReceptive(s) {
    var hoeren = s.module === 'hoeren';
    examShowLoading(s, EXAM_SECTIONS[s.section].titleDe + ' wird vorbereitet…', hoeren ? 'Generating questions…' : 'Generating the reading test…');
    examAsk(s, hoeren ? A1_HOEREN_PROMPT : A1_LESEN_PROMPT, hoeren ? 3000 : 2500, function(res) {
        if (res.error) { examFail(s, res, function() { a1StartReceptive(s); }); return; }
        var test = a1CleanReceptive(s.module, res.data);
        if (!test) { examShowError(s, 'The AI sent back an incomplete test.', function() { a1StartReceptive(s); }); return; }
        s.test = test;
        s.answers = [[], [], []];
        s.part = 0;
        s.item = 0;
        a1ShowReceptiveItem(s);
    });
}

function a1ShowReceptiveItem(s) {
    if (!examLive(s)) return;
    while (s.part < 3 && s.item >= s.test[s.part].length) { s.part++; s.item = 0; }
    if (s.part >= 3) { a1FinishReceptive(s); return; }
    var teil = s.test[s.part];
    var item = teil[s.item];
    var sec = EXAM_SECTIONS[s.section];
    var hoeren = s.module === 'hoeren';
    s.itemToken++;
    var html = '<div class="exam-active">' +
        examActiveHeader(sec.emoji + ' ' + sec.titleDe, 'Teil ' + (s.part + 1) + ' · Frage ' + (s.item + 1) + ' / ' + teil.length) +
        '<div class="exam-question">';
    if (hoeren) {
        if (item.context) html += '<div class="exam-context">' + examEsc(item.context) + '</div>';
        html += '<div class="exam-audio-wrap" id="exam-audio-wrap"></div>';
    } else {
        html += '<div class="exam-reading-text">' + examEsc(item.text) + '</div>';
    }
    html += '<div class="exam-question-text">' + examEsc(item.question) + '</div>' +
        '<div class="exam-options" id="exam-options"></div></div></div>';
    examRender(s, html);
    examFillOptions(document.getElementById('exam-options'), item.options || ['Richtig', 'Falsch'], function(idx) {
        a1AnswerReceptive(s, item.options ? idx : idx === 0);
    });
    if (hoeren) examLoadItemAudio(s, item.audioText, item.voice);
}

function a1AnswerReceptive(s, value) {
    if (!examLive(s)) return;
    s.itemToken++;
    examPauseAudio();
    s.answers[s.part].push(value);
    s.progressed = true;
    s.item++;
    a1ShowReceptiveItem(s);
}

function a1FormatAnswer(ans, item) {
    if (item.options) return typeof ans === 'number' ? examOptionLabel(item.options, ans) : '(keine Antwort)';
    if (ans === true) return 'Richtig';
    if (ans === false) return 'Falsch';
    return '(keine Antwort)';
}

function a1FinishReceptive(s) {
    var correct = 0, total = 0, wrong = [];
    s.test.forEach(function(teil, ti) {
        teil.forEach(function(item, idx) {
            total++;
            var ans = s.answers[ti][idx];
            if (ans === item.correct) { correct++; return; }
            wrong.push({ teil: ti + 1, question: item.question, userAnswer: a1FormatAnswer(ans, item), correctAnswer: a1FormatAnswer(item.correct, item), note: '' });
        });
    });
    var pct = total ? Math.round((correct / total) * 100) : 0;
    examFinishAttempt(s, pct, { kind: 'receptive', correct: correct, total: total, wrong: wrong }, correct + '/' + total + ' correct');
}

function a1CleanSchreiben(d) {
    if (!d || !d.teil1 || !d.teil2) return null;
    var fields = (d.teil1.fields instanceof Array ? d.teil1.fields : []).filter(function(f) { return f && f.label; }).map(function(f) {
        return { label: String(f.label), correct_answer: String(f.correct_answer === undefined ? '' : f.correct_answer) };
    });
    if (!fields.length || !d.teil2.task_de) return null;
    return {
        teil1: { scenario: String(d.teil1.scenario || ''), intro: String(d.teil1.intro || ''), fields: fields },
        teil2: { scenario: String(d.teil2.scenario || ''), task_de: String(d.teil2.task_de), min_words: examNum(d.teil2.min_words) || 30 }
    };
}

function a1StartSchreiben(s) {
    examShowLoading(s, 'Schreiben (A1) wird vorbereitet…', 'Generating writing prompts…');
    examAsk(s, A1_SCHREIBEN_PROMPT, 1500, function(res) {
        if (res.error) { examFail(s, res, function() { a1StartSchreiben(s); }); return; }
        var t = a1CleanSchreiben(res.data);
        if (!t) { examShowError(s, 'The AI sent back an incomplete task.', function() { a1StartSchreiben(s); }); return; }
        s.test = t;
        s.fields = {};
        s.text = '';
        a1ShowSchreibenTeil1(s);
    });
}

function a1ShowSchreibenTeil1(s) {
    var t1 = s.test.teil1;
    var fieldsHtml = t1.fields.map(function(f, i) {
        return '<div class="exam-form-field">' +
            '<label class="exam-form-label" for="exam-field-' + i + '">' + examEsc(f.label) + '</label>' +
            '<input type="text" class="exam-form-input" id="exam-field-' + i + '" autocomplete="off">' +
        '</div>';
    }).join('');
    examRender(s, '<div class="exam-active">' +
        examActiveHeader('✍️ Schreiben (A1)', 'Teil 1 · Formular ausfüllen') +
        '<div class="exam-question">' +
            '<div class="exam-scenario-banner">📝 ' + examEsc(t1.scenario) + '</div>' +
            '<div class="exam-reading-text">' + examEsc(t1.intro) + '</div>' +
            '<div class="exam-form">' + fieldsHtml + '</div>' +
            '<button type="button" class="btn btn-primary exam-next-btn" onclick="a1SubmitSchreibenTeil1()">Weiter zu Teil 2 →</button>' +
        '</div>' +
    '</div>');
    t1.fields.forEach(function(f, i) {
        var input = document.getElementById('exam-field-' + i);
        if (!input) return;
        input.value = s.fields[f.label] || '';
        input.addEventListener('input', function() { s.fields[f.label] = input.value; s.progressed = true; });
    });
}

function a1SubmitSchreibenTeil1() {
    var s = examSession;
    if (!s || s.kind !== 'a1' || s.module !== 'schreiben' || !s.test) return;
    s.test.teil1.fields.forEach(function(f, i) {
        var input = document.getElementById('exam-field-' + i);
        if (input) s.fields[f.label] = input.value.trim();
    });
    a1ShowSchreibenTeil2(s);
}

function a1ShowSchreibenTeil2(s) {
    var t2 = s.test.teil2;
    examRender(s, '<div class="exam-active">' +
        examActiveHeader('✍️ Schreiben (A1)', 'Teil 2 · Mitteilung schreiben') +
        '<div class="exam-question">' +
            '<div class="exam-scenario-banner">✉️ ' + examEsc(t2.scenario) + '</div>' +
            '<div class="exam-reading-text">' + examEsc(t2.task_de) + '</div>' +
            '<div class="exam-min-words">Mindestens ' + examEsc(t2.min_words) + ' Wörter · <span id="exam-wordcount">0</span> geschrieben</div>' +
            '<textarea class="exam-textarea" id="exam-text-input" rows="8" placeholder="Hier schreiben…"></textarea>' +
            '<button type="button" class="btn btn-primary exam-next-btn" onclick="a1SubmitSchreibenTeil2()">Abgeben & bewerten</button>' +
        '</div>' +
    '</div>');
    s.writing = { key: a1DraftKey(s), section: s.section, teil: 2, task: { scenario: t2.scenario, task_de: t2.task_de }, inputId: 'exam-text-input' };
    var ta = document.getElementById('exam-text-input');
    var wc = document.getElementById('exam-wordcount');
    ta.value = s.text || '';
    if (wc) wc.textContent = examWordCount(ta.value);
    ta.addEventListener('input', function() {
        if (!examLive(s)) return;
        s.text = ta.value;
        s.progressed = true;
        if (wc) wc.textContent = examWordCount(ta.value);
        examDraftSaveSoon(s);
    });
}

function a1SubmitSchreibenTeil2() {
    var s = examSession;
    if (!s || s.kind !== 'a1' || s.module !== 'schreiben' || !s.test) return;
    var ta = document.getElementById('exam-text-input');
    s.text = ta ? ta.value.trim() : s.text;
    if (examDraftPut(a1DraftKey(s), s.section, 2, s.writing ? s.writing.task : null, s.text)) s.hasDraft = true;
    s.writing = null;
    a1GradeSchreiben(s);
}

function a1DraftKey(s) { return examDraftKey(s.section, 2, s.startedAt); }

function a1Total(data, parts) {
    var t = examNum(data.total);
    if (t === null) {
        var vals = parts.map(function(k) { return examNum(data[k]); });
        if (vals.some(function(v) { return v === null; })) return null;
        t = vals.reduce(function(a, b) { return a + b; }, 0);
    }
    return examClamp(Math.round(t), 0, 100);
}

function a1GradeSchreiben(s) {
    examShowLoading(s, 'Wird bewertet…', 'The AI is grading your writing');
    var t1 = s.test.teil1;
    var teil1Submission = t1.fields.map(function(f) {
        return f.label + ': ' + (s.fields[f.label] || '(blank)') + ' (correct: ' + f.correct_answer + ')';
    }).join('\n');
    var prompt = 'Grade this Goethe A1 Schreiben submission. Return JSON only:\n' +
        '{\n' +
        '  "teil1_score": 0-50,\n' +
        '  "teil2_score": 0-50,\n' +
        '  "total": 0-100,\n' +
        '  "feedback": "1-2 paragraph feedback in English with specific corrections and at least one positive note"\n' +
        '}\n\n' +
        'TEIL 1 (form, score 10 per correct or near-correct field, accept minor spelling):\n' + teil1Submission + '\n\n' +
        'TEIL 2 (message, score: task fulfillment 0-20, grammar 0-15, vocab 0-15):\n' +
        'Task: ' + s.test.teil2.task_de + '\n' +
        'User wrote: ' + (s.text || '(empty)');
    examAsk(s, prompt, 900, function(res) {
        if (res.error) { examFail(s, res, function() { a1GradeSchreiben(s); }); return; }
        var total = a1Total(res.data, ['teil1_score', 'teil2_score']);
        if (total === null) { examShowError(s, 'The grader sent back no score.', function() { a1GradeSchreiben(s); }); return; }
        examDraftDrop(a1DraftKey(s));
        examFinishAttempt(s, total, {
            kind: 'a1-productive',
            parts: [
                { label: 'Teil 1 · Formular', score: examNum(res.data.teil1_score), max: 50 },
                { label: 'Teil 2 · Mitteilung', score: examNum(res.data.teil2_score), max: 50 }
            ],
            feedback: String(res.data.feedback || ''),
            fields: t1.fields.map(function(f) { return { label: f.label, yours: s.fields[f.label] || '', correct: f.correct_answer }; }),
            text: s.text
        }, String(res.data.feedback || ''));
    }, 0.3);
}

function a1StartSprechen(s) {
    examShowLoading(s, 'Sprechen (A1) wird vorbereitet…', 'Generating speaking prompts…');
    examAsk(s, A1_SPRECHEN_PROMPT, 800, function(res) {
        if (res.error) { examFail(s, res, function() { a1StartSprechen(s); }); return; }
        var d = res.data || {};
        var fields = examStrList(d.teil1_fields);
        if (!fields.length) fields = ['Name', 'Alter', 'Land', 'Wohnort', 'Sprachen', 'Beruf', 'Hobby'];
        var t2 = d.teil2 || {}, t3 = d.teil3 || {};
        var qs = examStrList(t2.questions);
        var t3prompts = examStrList([t3.request_prompt, t3.respond_prompt]);
        if (!qs.length || !t3prompts.length) { examShowError(s, 'The AI sent back incomplete prompts.', function() { a1StartSprechen(s); }); return; }
        var items = [];
        fields.forEach(function(f, i) { items.push({ teil: 1, n: i + 1, of: fields.length, banner: '', lead: 'Sagen Sie etwas über:', prompt: f }); });
        qs.forEach(function(q, i) { items.push({ teil: 2, n: i + 1, of: qs.length, banner: '📌 Thema: ' + String(t2.topic || ''), lead: '', prompt: q }); });
        t3prompts.forEach(function(p, i) { items.push({ teil: 3, n: i + 1, of: t3prompts.length, banner: '📍 ' + String(t3.scenario || ''), lead: '', prompt: p }); });
        s.items = items;
        s.topic = String(t2.topic || '');
        s.scenario = String(t3.scenario || '');
        s.answers = [];
        s.item = 0;
        a1ShowSprechenItem(s);
    });
}

function a1ShowSprechenItem(s) {
    if (!examLive(s)) return;
    examMicAbort(false);
    if (s.item >= s.items.length) { a1GradeSprechen(s); return; }
    s.itemToken++;
    var it = s.items[s.item];
    s.speechText = '';
    s.speech = { mode: 'a1', onSubmit: function(text) { a1SprechenAnswer(s, text); } };
    examRender(s, '<div class="exam-active">' +
        examActiveHeader('🗣️ Sprechen (A1)', 'Teil ' + it.teil + ' · ' + it.n + ' / ' + it.of) +
        '<div class="exam-question">' +
            (it.banner ? '<div class="exam-scenario-banner">' + examEsc(it.banner) + '</div>' : '') +
            '<div class="exam-sprechen-prompt">' + (it.lead ? examEsc(it.lead) + ' <strong>' + examEsc(it.prompt) + '</strong>' : examEsc(it.prompt)) + '</div>' +
            examSpeechPanelHtml('a1') +
            '<div class="exam-speech-actions">' +
                '<button type="button" class="exam-btn-secondary" onclick="examSpeechSkip()">Überspringen</button>' +
                '<button type="button" class="btn btn-primary" onclick="examSpeechSubmit()">Weiter →</button>' +
            '</div>' +
        '</div>' +
    '</div>');
    examSpeechBind(s);
}

function a1SprechenAnswer(s, text) {
    if (!examLive(s)) return;
    examMicAbort(false);
    s.answers[s.item] = String(text || '').trim();
    if (s.answers[s.item]) s.progressed = true;
    s.item++;
    a1ShowSprechenItem(s);
}

function a1GradeSprechen(s) {
    examShowLoading(s, 'Wird bewertet…', 'The AI is grading your speaking');
    function sub(teil, fmt) {
        return s.items.map(function(it, i) { return it.teil === teil ? fmt(it, s.answers[i] || '(silent)') : null; }).filter(Boolean).join('\n');
    }
    var prompt = 'Grade this Goethe A1 Sprechen submission (transcripts). Return JSON only:\n' +
        '{\n' +
        '  "teil1_score": 0-30,\n' +
        '  "teil2_score": 0-35,\n' +
        '  "teil3_score": 0-35,\n' +
        '  "total": 0-100,\n' +
        '  "feedback": "1-2 paragraph feedback in English. Note grammar/vocab/task fulfilment, plus at least one positive note. Do not comment on pronunciation since we only have transcripts."\n' +
        '}\n\n' +
        'TEIL 1 (self-introduction):\n' + sub(1, function(it, a) { return it.prompt + ': ' + a; }) + '\n\n' +
        'TEIL 2 (topic ' + s.topic + '):\n' + sub(2, function(it, a) { return 'Q: ' + it.prompt + '\nA: ' + a; }) + '\n\n' +
        'TEIL 3 (scenario ' + s.scenario + '):\n' + sub(3, function(it, a) { return 'Prompt: ' + it.prompt + '\nUser said: ' + a; });
    examAsk(s, prompt, 900, function(res) {
        if (res.error) { examFail(s, res, function() { a1GradeSprechen(s); }); return; }
        var total = a1Total(res.data, ['teil1_score', 'teil2_score', 'teil3_score']);
        if (total === null) { examShowError(s, 'The grader sent back no score.', function() { a1GradeSprechen(s); }); return; }
        examFinishAttempt(s, total, {
            kind: 'a1-productive',
            parts: [
                { label: 'Teil 1 · Sich vorstellen', score: examNum(res.data.teil1_score), max: 30 },
                { label: 'Teil 2 · Fragen und Antworten', score: examNum(res.data.teil2_score), max: 35 },
                { label: 'Teil 3 · Bitten formulieren', score: examNum(res.data.teil3_score), max: 35 }
            ],
            feedback: String(res.data.feedback || ''),
            transcripts: s.items.map(function(it, i) { return { q: 'Teil ' + it.teil + ': ' + (it.lead ? it.lead + ' ' : '') + it.prompt, a: s.answers[i] || '' }; })
        }, String(res.data.feedback || ''));
    }, 0.3);
}

// ── B1 mock exams (Goethe format, AI-generated and AI-graded) ──
// Driven by B1_EXAM_SECTIONS / B1_EXAM_PROMPTS from b1-exam-data.js. Teil 1
// is generated first and the next Teil is prefetched while the user works.

var B1_TTS_VOICES = ['nova', 'shimmer', 'echo', 'onyx', 'fable', 'alloy', 'ash', 'sage', 'coral'];

function b1SafeVoice(v) {
    // The model sometimes returns a speaker name instead of a voice id.
    return B1_TTS_VOICES.indexOf(v) !== -1 ? v : 'nova';
}

var B1_OPTION_RULES = ' JSON rules: every "options" entry is a complete German answer text, never a bare letter such as "A"; "answer" is the 0-based index of the correct option.';

// Teil-specific shape notes, so the generic {text, items[]} format can carry
// the matching (Lesen 3), for/against (Lesen 4) and who-said-what (Hören 4) tasks.
function b1PromptExtra(module, n) {
    var x = '';
    if (module === 'hoeren') {
        x = B1_OPTION_RULES + ' Every item has its own "audioText".';
        if (n === 1) x += ' Use five short texts with two items each and repeat the audioText for both: first a statement with options ["Richtig","Falsch"], then a question with three options.';
        if (n === 4) x += ' The audioText of each item is a short part of one radio discussion; start each line with the speaker (Moderatorin:, then the two guests by name). The "question" is an opinion statement and the "options" are the three speakers.';
    } else if (module === 'lesen') {
        x = B1_OPTION_RULES;
        if (n === 1) x += ' Every item is a statement about the blog post with options ["Richtig","Falsch"].';
        if (n === 2) x += ' "text" contains both press texts, headed "Text 1" and "Text 2", with three items on each; three options per item.';
        if (n === 3) x += ' "text" lists ten short ads, one per line, labelled a) to j). Each item "question" is one situation and its "options" are exactly ["Anzeige a","Anzeige b","Anzeige c","Anzeige d","Anzeige e","Anzeige f","Anzeige g","Anzeige h","Anzeige i","Anzeige j","keine passende Anzeige"]; one situation has no fitting ad.';
        if (n === 4) x += ' "text" contains seven short readers\' comments, each starting with the reader\'s name. Each item "question" asks whether one named reader is for the idea, and its "options" are ["Ja","Nein"].';
        if (n === 5) x += ' Three options per item.';
    }
    return x;
}

function b1GenTokens(module, n) {
    if (module === 'hoeren') return n === 1 ? 4000 : 3200;
    if (module === 'lesen') return 3200;
    return 900;
}

function b1Setup(s, teilN) {
    s.module = EXAM_SECTIONS[s.section].module;
    var all = examB1Teile(s.module);
    var only = teilN ? all.filter(function(t) { return t.n === teilN; }) : [];
    s.teilN = only.length ? teilN : null;
    s.teile = only.length ? only : all;
    s.gen = s.teile.map(function() { return { status: 'idle', data: null, error: null, waiters: [], attempts: 0 }; });
    s.idx = 0;
    s.item = 0;
    s.answers = [];
    s.wrong = [];
    s.texts = [];
    s.grades = [];
    s.gradeState = [];
    s.gradeError = [];
    s.draftKeys = [];
    var mod = examHasB1() ? B1_EXAM_SECTIONS[s.module] : null;
    var minutes = !mod || s.module === 'hoeren' || s.module === 'sprechen' ? 0 : (s.teilN ? s.teile[0].minutes : mod.minutes);
    s.timerSeconds = minutes ? minutes * 60 : 0;
}

// Each Teil's text stays a draft under this key until the whole attempt is
// saved (or, on leaving, until that Teil is saved as its own result).
function b1DraftKey(s, i) {
    if (!s.draftKeys[i]) s.draftKeys[i] = examDraftKey(s.section, s.teile[i].n, s.startedAt);
    return s.draftKeys[i];
}

function b1DropDrafts(s, only) {
    (s.draftKeys || []).forEach(function(k, i) { if (!only || only.indexOf(i) !== -1) examDraftDrop(k); });
}

function b1Start(s) {
    if (!s.teile || !s.teile.length) { examShowError(s, 'The B1 exam data is missing.'); return; }
    if (s.timerSeconds) examTimerStart(s, s.timerSeconds);
    b1EnterTeil(s, 0);
}

function b1GenPrompt(module, meta) {
    var vars = { teil: meta.n, format: meta.format, n: meta.items || '', words: meta.words || '' };
    return examFill(B1_EXAM_PROMPTS[module], vars) + b1PromptExtra(module, meta.n);
}

function b1CleanItem(module, it) {
    if (!it || typeof it !== 'object') return null;
    var q = String(it.question || it.statement || '').trim();
    var opts = examCleanOptions(it.options);
    if (!q || !opts) return null;
    var ans = examAnswerIndex(it.answer !== undefined ? it.answer : it.correct, opts);
    if (ans === null) return null;
    var out = { question: q, options: opts, answer: ans, note: String(it.transcriptNote || it.evidence || '').trim() };
    if (module === 'hoeren') {
        var audio = String(it.audioText || it.text || '').trim();
        if (!audio) return null;
        out.audioText = audio;
        out.voice = b1SafeVoice(it.speakers instanceof Array ? it.speakers[0] : it.speakers);
    }
    return out;
}

function b1CleanTeil(module, data) {
    if (!data || typeof data !== 'object') return null;
    if (module === 'hoeren' || module === 'lesen') {
        var raw = data.items instanceof Array ? data.items : (data.questions instanceof Array ? data.questions : null);
        if (!raw) return null;
        var items = raw.map(function(it) { return b1CleanItem(module, it); }).filter(Boolean);
        if (!items.length) return null;
        var text = String(data.text || '').trim();
        if (module === 'lesen' && !text) return null;
        return { text: text, items: items };
    }
    if (module === 'schreiben') {
        var pts = examStrList(data.inhaltspunkte);
        var sit = String(data.situation || '').trim();
        if (!sit || !pts.length) return null;
        return { situation: sit, inhaltspunkte: pts, wordTarget: examNum(data.wordTarget), register: data.register === 'Sie' || data.register === 'du' ? data.register : '' };
    }
    if (module === 'sprechen') {
        var auf = String(data.aufgabe || '').trim();
        if (!auf) return null;
        return { aufgabe: auf, stichpunkte: examStrList(data.stichpunkte), partnerOpener: String(data.partnerOpener || '').trim() };
    }
    return null;
}

function b1EnsureTeil(s, i, onDone) {
    var g = s.gen[i];
    if (!g) return;
    if (g.status === 'ready') { if (onDone) onDone(true); return; }
    if (onDone) g.waiters.push(onDone);
    if (g.status === 'loading') return;
    if (g.status === 'error' && !onDone) return;
    g.status = 'loading';
    g.attempts++;
    var meta = s.teile[i];
    examAsk(s, b1GenPrompt(s.module, meta), b1GenTokens(s.module, meta.n), function(res) {
        var data = res.error ? null : b1CleanTeil(s.module, res.data);
        if (!data && !res.error && g.attempts < 2) {
            // Unusable shape: ask once more before bothering the user.
            g.status = 'idle';
            b1EnsureTeil(s, i);
            return;
        }
        g.status = data ? 'ready' : 'error';
        g.data = data;
        g.error = data ? null : (res.error || 'The AI sent back an incomplete ' + examPartWord(s.module) + ' ' + meta.n + '.');
        g.noKey = !!res.noKey;
        var waiters = g.waiters;
        g.waiters = [];
        waiters.forEach(function(w) { w(!!data); });
    });
}

function b1EnterTeil(s, i) {
    if (!examLive(s)) return;
    s.idx = i;
    s.item = 0;
    if (i >= s.teile.length) { b1Finish(s); return; }
    var g = s.gen[i];
    var meta = s.teile[i];
    function go(ok) {
        if (!examLive(s) || s.idx !== i) return;
        if (!ok) {
            if (g.noKey) { examFail(s, { noKey: true }); return; }
            examShowError(s, g.error, function() { b1EnterTeil(s, i); });
            return;
        }
        b1ShowTeil(s);
        if (i + 1 < s.teile.length) b1EnsureTeil(s, i + 1);
    }
    if (g.status === 'ready') { go(true); return; }
    if (g.status === 'error') { g.status = 'idle'; g.attempts = 0; }
    examShowLoading(s, EXAM_SECTIONS[s.section].titleDe + ' wird vorbereitet…',
        examPartWord(s.module) + ' ' + meta.n + (s.teile.length > 1 ? ' (' + (i + 1) + ' von ' + s.teile.length + ')' : '') + ' wird erstellt…');
    b1EnsureTeil(s, i, go);
}

function b1ShowTeil(s) {
    if (s.module === 'hoeren' || s.module === 'lesen') b1ShowReceptiveItem(s);
    else if (s.module === 'schreiben') b1ShowSchreiben(s);
    else b1ShowSprechen(s);
}

function b1TeilIntro(s, meta) {
    var bits = [meta.format];
    if (s.module === 'hoeren' && meta.plays) bits.push(meta.plays === 2 ? 'played twice in the exam' : 'played once in the exam');
    if (meta.minutes && s.module !== 'hoeren') bits.push('~' + meta.minutes + ' min');
    return '<div class="exam-teil-intro">' + examEsc(bits.join(' · ')) + '</div>';
}

// ── B1 receptive (Hören / Lesen) ───────────────────────────────

function b1ShowReceptiveItem(s) {
    if (!examLive(s)) return;
    var i = s.idx;
    var data = s.gen[i].data;
    var meta = s.teile[i];
    if (s.item >= data.items.length) { b1EnterTeil(s, i + 1); return; }
    var item = data.items[s.item];
    var sec = EXAM_SECTIONS[s.section];
    var hoeren = s.module === 'hoeren';
    s.itemToken++;
    var html = '<div class="exam-active">' +
        examActiveHeader(sec.emoji + ' ' + sec.titleDe, 'Teil ' + meta.n + ' · Frage ' + (s.item + 1) + ' / ' + data.items.length) +
        '<div class="exam-question">' + b1TeilIntro(s, meta);
    if (hoeren) html += '<div class="exam-audio-wrap" id="exam-audio-wrap"></div>';
    else html += '<div class="exam-reading-text">' + examEsc(data.text) + '</div>';
    html += '<div class="exam-question-text">' + examEsc(item.question) + '</div>' +
        '<div class="exam-options' + (item.options.length > 5 ? ' compact' : '') + '" id="b1-exam-options"></div>' +
        '</div></div>';
    examRender(s, html);
    examFillOptions(document.getElementById('b1-exam-options'), item.options, function(idx) { b1AnswerReceptive(s, idx); });
    if (hoeren) examLoadItemAudio(s, item.audioText, item.voice);
}

function b1AnswerReceptive(s, idx) {
    if (!examLive(s)) return;
    var i = s.idx;
    var item = s.gen[i].data.items[s.item];
    s.itemToken++;
    examPauseAudio();
    if (!s.answers[i]) s.answers[i] = [];
    var ok = idx === item.answer;
    s.answers[i].push(ok);
    s.progressed = true;
    if (!ok) {
        s.wrong.push({
            teil: s.teile[i].n,
            question: item.question,
            userAnswer: examOptionLabel(item.options, idx),
            correctAnswer: examOptionLabel(item.options, item.answer),
            note: item.note ? (s.module === 'hoeren' ? 'Im Audio: „' : 'Im Text: „') + item.note + '“' : ''
        });
    }
    s.item++;
    b1ShowReceptiveItem(s);
}

function b1FinishReceptive(s) {
    var correct = 0, total = 0;
    s.answers.forEach(function(arr) { (arr || []).forEach(function(a) { total++; if (a) correct++; }); });
    if (!total) { examShowError(s, 'No questions were answered, so there is nothing to score.'); return; }
    var pct = Math.round((correct / total) * 100);
    examFinishAttempt(s, pct, { kind: 'receptive', correct: correct, total: total, wrong: s.wrong }, correct + '/' + total + ' correct');
}

// ── B1 productive (Schreiben / Sprechen) ───────────────────────

function b1TemplateFor(n) {
    if (typeof B1_SCHREIBEN_TEMPLATES === 'undefined') return null;
    return B1_SCHREIBEN_TEMPLATES.filter(function(t) { return t.id === 'aufgabe' + n; })[0] || null;
}

function b1ShowSchreiben(s) {
    if (!examLive(s)) return;
    var i = s.idx;
    var meta = s.teile[i];
    var task = s.gen[i].data;
    var sec = EXAM_SECTIONS[s.section];
    var last = i === s.teile.length - 1;
    var target = task.wordTarget || meta.words;
    var tpl = b1TemplateFor(meta.n);
    s.itemToken++;
    if (tpl) examCopyTexts.peek = examTemplateCopyText(tpl);
    var points = task.inhaltspunkte.map(function(p) { return '<li>' + examEsc(p) + '</li>'; }).join('');
    examRender(s, '<div class="exam-active">' +
        examActiveHeader(sec.emoji + ' ' + sec.titleDe, 'Aufgabe ' + meta.n + ' · ' + meta.points + ' Punkte') +
        '<div class="exam-question">' +
            b1TeilIntro(s, meta) +
            '<div class="exam-scenario-banner">📝 ' + examEsc(task.situation) + '</div>' +
            (task.register ? '<div class="exam-min-words">Schreiben Sie per <strong>' + examEsc(task.register) + '</strong>.</div>' : '') +
            '<ul class="exam-inhaltspunkte">' + points + '</ul>' +
            (tpl ? '<details class="exam-template-peek"><summary>Template for Aufgabe ' + meta.n + '</summary>' + examTkTemplateHtml(tpl, 'peek') + '</details>' : '') +
            '<div class="exam-min-words">Ziel: ~' + examEsc(target) + ' Wörter · <span id="exam-wordcount">0</span> geschrieben</div>' +
            '<textarea class="exam-textarea" id="b1-schreiben-input" rows="10" placeholder="Hier schreiben…" autocapitalize="sentences"></textarea>' +
            '<div class="exam-mic-hint" id="exam-write-hint"></div>' +
            '<button type="button" class="btn btn-primary exam-next-btn" onclick="b1SubmitSchreiben()">' +
                (last ? 'Abgeben & bewerten' : 'Abgeben & weiter zu Aufgabe ' + s.teile[i + 1].n + ' →') + '</button>' +
        '</div>' +
    '</div>');
    s.writing = { key: b1DraftKey(s, i), section: s.section, teil: meta.n, task: task, inputId: 'b1-schreiben-input' };
    var ta = document.getElementById('b1-schreiben-input');
    var wc = document.getElementById('exam-wordcount');
    ta.value = s.texts[i] || '';
    if (wc) wc.textContent = examWordCount(ta.value);
    ta.addEventListener('input', function() {
        if (!examLive(s)) return;
        s.texts[i] = ta.value;
        s.progressed = true;
        if (wc) wc.textContent = examWordCount(ta.value);
        examDraftSaveSoon(s);
    });
}

function b1SubmitSchreiben() {
    var s = examSession;
    if (!s || s.kind !== 'b1' || s.module !== 'schreiben') return;
    var i = s.idx;
    var ta = document.getElementById('b1-schreiben-input');
    var text = ta ? ta.value.trim() : String(s.texts[i] || '').trim();
    if (!text) {
        var hint = document.getElementById('exam-write-hint');
        if (hint) { hint.textContent = 'Write your text first (or tap Beenden).'; hint.className = 'exam-mic-hint warn'; }
        return;
    }
    s.texts[i] = text;
    if (examDraftPut(b1DraftKey(s, i), s.section, s.teile[i].n, s.gen[i].data, text)) s.hasDraft = true;
    s.writing = null;
    b1Grade(s, i);
    b1EnterTeil(s, i + 1);
}

function b1ShowSprechen(s) {
    if (!examLive(s)) return;
    examMicAbort(false);
    var i = s.idx;
    var meta = s.teile[i];
    var task = s.gen[i].data;
    var sec = EXAM_SECTIONS[s.section];
    var last = i === s.teile.length - 1;
    s.itemToken++;
    s.speechText = s.texts[i] || '';
    s.speech = { mode: 'b1', timerSeconds: meta.minutes ? meta.minutes * 60 : 0, onSubmit: function(text) { b1SprechenSubmit(s, i, text); } };
    examTimerStop();
    var points = task.stichpunkte.map(function(p) { return '<li>' + examEsc(p) + '</li>'; }).join('');
    examRender(s, '<div class="exam-active">' +
        examActiveHeader(sec.emoji + ' ' + sec.titleDe, 'Teil ' + meta.n + ' · ' + meta.points + ' Punkte') +
        '<div class="exam-question">' +
            b1TeilIntro(s, meta) +
            '<div class="exam-scenario-banner">📌 ' + examEsc(task.aufgabe) + '</div>' +
            (points ? '<ul class="exam-inhaltspunkte">' + points + '</ul>' : '') +
            (task.partnerOpener ? '<div class="exam-sprechen-prompt">Partner: „' + examEsc(task.partnerOpener) + '“</div>' : '') +
            examSpeechPanelHtml('b1') +
            '<div class="exam-speech-actions">' +
                '<button type="button" class="btn btn-primary" onclick="examSpeechSubmit()">' +
                    (last ? 'Fertig & bewerten' : 'Fertig, weiter zu Teil ' + s.teile[i + 1].n + ' →') + '</button>' +
            '</div>' +
        '</div>' +
    '</div>');
    examSpeechBind(s);
}

function b1SprechenSubmit(s, i, text) {
    if (!examLive(s) || s.idx !== i) return;
    examMicAbort(false);
    examTimerStop();
    s.texts[i] = text;
    s.speech = null;
    // Like a written text, the transcript stays a draft until it is scored.
    if (examDraftPut(b1DraftKey(s, i), s.section, s.teile[i].n, s.gen[i].data, text)) s.hasDraft = true;
    b1Grade(s, i);
    b1EnterTeil(s, i + 1);
}

var B1_SCHREIBEN_KEYS = ['erfuellung', 'kohaerenz', 'wortschatz', 'strukturen'];
var B1_SPRECHEN_KEYS = ['erfuellung', 'interaktion', 'wortschatz', 'strukturen', 'aussprache'];
var B1_SPRECHEN_LABELS = ['Erfüllung', 'Interaktion', 'Wortschatz', 'Strukturen', 'Aussprache'];

function b1GradePrompt(s, i) {
    var meta = s.teile[i];
    var task = s.gen[i].data;
    var text = s.texts[i] || '';
    if (s.module === 'schreiben') {
        var crit = (meta.criteria || ['Erfüllung', 'Kohärenz', 'Wortschatz', 'Strukturen']).map(function(c, k) {
            return c + ' 0-' + ((meta.criteriaMax && meta.criteriaMax[k]) || 10);
        }).join(', ');
        return examFill(B1_EXAM_PROMPTS.schreiben_grade, {
            task: task.situation + (task.register ? ' (Register: ' + task.register + ')' : ''),
            points: task.inhaltspunkte.join('; '),
            text: text,
            max: meta.points
        }) + ' Score ' + crit + '; "total" is their sum, out of ' + meta.points + '. The word target is about ' + (task.wordTarget || meta.words) + ' words.';
    }
    var t = task.aufgabe + (task.stichpunkte.length ? ' Points to cover: ' + task.stichpunkte.join('; ') + '.' : '') +
        (task.partnerOpener ? ' The partner opened with: "' + task.partnerOpener + '".' : '');
    return examFill(B1_EXAM_PROMPTS.sprechen_grade, { task: t, transcript: text }) +
        ' Score each of the five criteria from 0 to 20; "total" is their sum, out of 100.';
}

function b1SchreibenPoints(g, meta) {
    if (!g || typeof g !== 'object') return null;
    var crit = B1_SCHREIBEN_KEYS.map(function(k) { return examNum(g[k]); });
    var sum = crit.every(function(v) { return v !== null; }) ? crit.reduce(function(a, b) { return a + b; }, 0) : null;
    var t = examNum(g.total);
    if (t === null) t = sum;
    if (t === null) return null;
    var mt = examNum(g.maxTotal);
    if (mt && mt > 0 && Math.abs(mt - meta.points) > 0.5) t = t / mt * meta.points;
    return examClamp(Math.round(t), 0, meta.points);
}

// Per-Teil share (0-1) and the Aussprache share (0-1). The grader is asked
// for 0-20 per criterion, but the scale is re-detected in case it used 0-100.
function b1SprechenScore(g) {
    if (!g || typeof g !== 'object') return null;
    var crit = B1_SPRECHEN_KEYS.map(function(k) { return examNum(g[k]); });
    var known = crit.filter(function(v) { return v !== null; });
    var sum = known.length === 5 ? known.reduce(function(a, b) { return a + b; }, 0) : null;
    var total = examNum(g.total);
    var maxT = examNum(g.maxTotal) || 100;
    var scale = 20;
    if (known.length && Math.max.apply(null, known) > 20) scale = 100;
    else if (total !== null && sum !== null) scale = Math.abs(sum - total) <= Math.abs(sum / 5 - total) ? 20 : 100;
    if (total === null && sum !== null) { total = scale === 20 ? sum : sum / 5; maxT = 100; }
    if (total === null) return null;
    return {
        share: examClamp(total / maxT, 0, 1),
        aus: crit[4] !== null ? examClamp(crit[4] / scale, 0, 1) : null,
        crit: crit,
        scale: scale
    };
}

function b1Grade(s, i) {
    s.gradeState[i] = 'loading';
    var meta = s.teile[i];
    examAsk(s, b1GradePrompt(s, i), s.module === 'schreiben' ? 1600 : 900, function(res) {
        var g = res.error ? null : res.data;
        var ok = s.module === 'schreiben' ? b1SchreibenPoints(g, meta) !== null : b1SprechenScore(g) !== null;
        if (ok) {
            s.grades[i] = g;
            s.gradeState[i] = 'done';
        } else {
            s.gradeState[i] = 'error';
            s.gradeError[i] = res.error || 'The grader sent back no score.';
            if (res.noKey) s.gradeNoKey = true;
        }
        if (s.finishing) b1Finish(s);
    }, 0.2);
}

function b1Finish(s) {
    if (!examLive(s)) return;
    if (s.module === 'hoeren' || s.module === 'lesen') { b1FinishReceptive(s); return; }
    s.finishing = true;
    var pending = false, failed = [];
    s.teile.forEach(function(meta, i) {
        if (s.gradeState[i] === 'loading') pending = true;
        else if (s.gradeState[i] === 'error') failed.push(i);
    });
    if (pending) {
        examShowLoading(s, 'Wird bewertet…', s.module === 'schreiben' ? 'The AI is grading your texts' : 'The AI is grading what you said');
        return;
    }
    if (failed.length) {
        if (s.gradeNoKey) { examFail(s, { noKey: true }); return; }
        var names = failed.map(function(i) { return examPartWord(s.module) + ' ' + s.teile[i].n; }).join(', ');
        examShowError(s, 'Grading failed for ' + names + ': ' + s.gradeError[failed[0]], function() {
            failed.forEach(function(i) { b1Grade(s, i); });
            b1Finish(s);
        });
        return;
    }
    if (s.module === 'schreiben') b1FinishSchreiben(s);
    else b1FinishSprechen(s);
}

function b1Errors(list) {
    if (!(list instanceof Array)) return [];
    return list.map(function(e) {
        if (e && typeof e === 'object') return { error: String(e.error || e.text || '').trim(), rule: String(e.rule || '').trim() };
        return { error: String(e === null || e === undefined ? '' : e).trim(), rule: '' };
    }).filter(function(e) { return e.error; });
}

function b1AllParts(s) { return s.teile.map(function(meta, i) { return i; }); }

function b1FinishSchreiben(s) {
    var r = b1SchreibenResult(s, b1AllParts(s));
    if (examFinishAttempt(s, r.pct, r.detail, r.summary)) b1DropDrafts(s);
}

function b1FinishSprechen(s) {
    var r = b1SprechenResult(s, b1AllParts(s));
    if (examFinishAttempt(s, r.pct, r.detail, r.summary)) b1DropDrafts(s);
}

// Graded parts of an unfinished multi-part Schreiben/Sprechen exam (indexes).
function b1GradedParts(s) {
    if (!s || s.kind !== 'b1' || (s.module !== 'schreiben' && s.module !== 'sprechen') || !s.teile || s.teile.length < 2) return [];
    return b1AllParts(s).filter(function(i) { return s.gradeState[i] === 'done' && !!s.grades[i]; });
}

function b1PartNames(s, idxs) {
    var names = idxs.map(function(i) { return examPartWord(s.module) + ' ' + s.teile[i].n; });
    return names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names.join('');
}

// On leaving, each graded part is saved as its own single-part result (as if
// it had been drilled alone), so its paid feedback is kept; its draft goes.
function b1SavePartial(s) {
    var parts = b1GradedParts(s);
    parts.forEach(function(i) {
        var r = s.module === 'schreiben' ? b1SchreibenResult(s, [i]) : b1SprechenResult(s, [i]);
        examSaveAttempt(s.section, r.pct, r.summary, r.detail, s.teile[i].n);
    });
    if (parts.length) b1DropDrafts(s, parts);
    return parts.length;
}

// Score, detail and summary for the given parts (all of them, or one).
function b1SchreibenResult(s, idxs) {
    var earned = 0, max = 0, blocks = [];
    idxs.forEach(function(i) {
        var meta = s.teile[i];
        var g = s.grades[i];
        var task = s.gen[i].data;
        var pts = b1SchreibenPoints(g, meta);
        earned += pts;
        max += meta.points;
        var covered = g.pointsCovered instanceof Array ? g.pointsCovered : [];
        blocks.push({
            title: 'Aufgabe ' + meta.n,
            score: pts,
            max: meta.points,
            task: task.situation,
            crit: (meta.criteria || ['Erfüllung', 'Kohärenz', 'Wortschatz', 'Strukturen']).map(function(label, k) {
                return { label: label, value: examNum(g[B1_SCHREIBEN_KEYS[k]]), max: meta.criteriaMax ? meta.criteriaMax[k] : null };
            }),
            words: examWordCount(s.texts[i]),
            wordTarget: task.wordTarget || meta.words,
            points: task.inhaltspunkte.map(function(p, k) {
                var v = covered[k];
                return { text: p, ok: v === undefined || v === null ? null : examBool(v) !== false };
            }),
            text: s.texts[i] || '',
            corrected: String(g.corrected || ''),
            errors: b1Errors(g.topErrors),
            phrases: examStrList(g.phrases)
        });
    });
    var pct = max ? Math.round(earned / max * 100) : 0;
    var summary = blocks.map(function(b) { return b.title + ': ' + b.score + '/' + b.max; }).join('\n');
    return { pct: pct, summary: summary, detail: { kind: 'b1-productive', module: 'schreiben', earned: earned, max: max, blocks: blocks } };
}

function b1SprechenResult(s, idxs) {
    var earned = 0, max = 0, aus = [], blocks = [];
    idxs.forEach(function(i) {
        var meta = s.teile[i];
        var g = s.grades[i];
        var sc = b1SprechenScore(g);
        var pts = sc.share * meta.points;
        earned += pts;
        max += meta.points;
        if (sc.aus !== null) aus.push(sc.aus);
        blocks.push({
            title: 'Teil ' + meta.n,
            score: Math.round(pts),
            max: meta.points,
            task: s.gen[i].data.aufgabe,
            crit: B1_SPRECHEN_LABELS.map(function(label, k) { return { label: label, value: sc.crit[k], max: sc.scale }; }),
            feedback: String(g.feedback || ''),
            text: s.texts[i] || '',
            mistakes: examStrList(g.repeatedMistakes),
            phrases: examStrList(g.missingPhrases)
        });
    });
    var slot = B1_EXAM_SECTIONS.sprechen.teile.filter(function(t) { return t.n === 0; })[0];
    var ausBlock = null;
    if (slot && aus.length) {
        var avg = aus.reduce(function(a, b) { return a + b; }, 0) / aus.length;
        earned += avg * slot.points;
        max += slot.points;
        ausBlock = { score: Math.round(avg * slot.points), max: slot.points };
    }
    var pct = max ? Math.round(earned / max * 100) : 0;
    var summary = blocks.map(function(b) { return b.title + ': ' + b.score + '/' + b.max + (b.feedback ? ' — ' + b.feedback : ''); }).join('\n');
    return { pct: pct, summary: summary, detail: { kind: 'b1-productive', module: 'sprechen', earned: Math.round(earned), max: max, blocks: blocks, aussprache: ausBlock } };
}

// ── Results ────────────────────────────────────────────────────

function examFinishAttempt(s, pct, detail, feedback) {
    if (!examLive(s)) return null;
    var section = s.section, teil = s.teilN || null;
    examEndRun();
    var rec = examSaveAttempt(section, pct, feedback, detail, teil);
    examShowResults(rec, false);
    return rec;
}

function examFmtNum(v) {
    var n = examNum(v);
    if (n === null) return '–';
    return String(Math.round(n * 10) / 10);
}

function examSubTitle(t) { return '<div class="exam-result-sub">' + examEsc(t) + '</div>'; }

function examWrongListHtml(wrong) {
    if (!wrong || !wrong.length) return '<div class="exam-results-allright">✅ Alles richtig!</div>';
    var html = '<div class="exam-results-wrong"><div class="exam-results-section-title">❌ Falsche Antworten (' + wrong.length + ')</div>';
    wrong.forEach(function(w) {
        html += '<div class="exam-wrong-item">' +
            '<div class="exam-wrong-q">Teil ' + examEsc(w.teil) + ': ' + examEsc(w.question) + '</div>' +
            '<div class="exam-wrong-yours">Deine Antwort: <span class="exam-wrong-bad">' + examEsc(w.userAnswer) + '</span></div>' +
            '<div class="exam-wrong-right">Richtig: <span class="exam-wrong-good">' + examEsc(w.correctAnswer) + '</span></div>' +
            (w.note ? '<div class="exam-wrong-note">💡 ' + examEsc(w.note) + '</div>' : '') +
        '</div>';
    });
    return html + '</div>';
}

function examResultBlockHtml(b, module) {
    var html = '<div class="exam-result-block">' +
        '<div class="exam-result-block-head"><span>' + examEsc(b.title) + '</span><span class="exam-result-block-score">' + examEsc(b.score) + ' / ' + examEsc(b.max) + '</span></div>';
    if (b.task) html += '<div class="exam-result-task">' + examEsc(b.task) + '</div>';
    var crit = (b.crit || []).filter(function(c) { return c.value !== null && c.value !== undefined; });
    if (crit.length) {
        html += '<div class="exam-crit-row">' + crit.map(function(c) {
            return '<span class="exam-crit">' + examEsc(c.label) + ' <strong>' + examFmtNum(c.value) + '</strong>' + (c.max ? '/' + examEsc(c.max) : '') + '</span>';
        }).join('') + '</div>';
    }
    if (module === 'schreiben') html += '<div class="exam-result-meta">' + examEsc(b.words + ' words · target ~' + b.wordTarget) + '</div>';
    if (b.points && b.points.length) {
        html += '<ul class="exam-points-covered">' + b.points.map(function(p) {
            var cls = p.ok === false ? 'miss' : (p.ok ? 'ok' : '');
            return '<li class="' + cls + '">' + (p.ok === false ? '✗ ' : (p.ok ? '✓ ' : '• ')) + examEsc(p.text) + '</li>';
        }).join('') + '</ul>';
    }
    if (b.feedback) html += '<p class="exam-result-feedback">' + examEsc(b.feedback) + '</p>';
    if (b.corrected) html += examSubTitle('Corrected text') + '<div class="exam-corrected">' + examBoldHtml(b.corrected) + '</div>';
    if (b.errors && b.errors.length) {
        html += examSubTitle('Top errors') + '<ul class="exam-errors">' + b.errors.map(function(e) {
            return '<li><strong>' + examEsc(e.error) + '</strong>' + (e.rule ? ' — ' + examEsc(e.rule) : '') + '</li>';
        }).join('') + '</ul>';
    }
    if (b.mistakes && b.mistakes.length) {
        html += examSubTitle('Repeated mistakes') + '<ul class="exam-errors">' + b.mistakes.map(function(x) { return '<li>' + examEsc(x) + '</li>'; }).join('') + '</ul>';
    }
    if (b.phrases && b.phrases.length) {
        html += examSubTitle(module === 'schreiben' ? 'Phrases to reuse' : 'Phrases you could have used') +
            '<ul class="exam-phrases">' + b.phrases.map(function(x) { return '<li>' + examEsc(x) + '</li>'; }).join('') + '</ul>';
    }
    if (b.text) {
        html += '<details class="exam-result-text"' + (module === 'sprechen' ? ' open' : '') + '><summary>' +
            (module === 'schreiben' ? 'Your text' : 'What you said (transcript)') + '</summary>' +
            '<div class="exam-transcript">' + examEsc(b.text) + '</div></details>';
    }
    return html + '</div>';
}

function examA1ResultHtml(d) {
    var html = '<div class="exam-result-block">';
    var parts = (d.parts || []).filter(function(p) { return p.score !== null && p.score !== undefined; });
    if (parts.length) {
        html += '<div class="exam-crit-row">' + parts.map(function(p) {
            return '<span class="exam-crit">' + examEsc(p.label) + ' <strong>' + examFmtNum(p.score) + '</strong>/' + examEsc(p.max) + '</span>';
        }).join('') + '</div>';
    }
    if (d.feedback) html += examSubTitle('📝 Feedback') + '<p class="exam-result-feedback">' + examEsc(d.feedback) + '</p>';
    if (d.fields && d.fields.length) {
        html += examSubTitle('Teil 1 · your form') + '<ul class="exam-errors">' + d.fields.map(function(f) {
            return '<li><strong>' + examEsc(f.label) + ':</strong> ' + examEsc(f.yours || '(blank)') + ' <span class="exam-muted">(expected: ' + examEsc(f.correct) + ')</span></li>';
        }).join('') + '</ul>';
    }
    if (d.text) html += '<details class="exam-result-text"><summary>Your text</summary><div class="exam-transcript">' + examEsc(d.text) + '</div></details>';
    if (d.transcripts && d.transcripts.length) {
        html += '<details class="exam-result-text" open><summary>What you said (transcripts)</summary><ul class="exam-errors">' + d.transcripts.map(function(t) {
            return '<li><span class="exam-muted">' + examEsc(t.q) + '</span><br>' + examEsc(t.a || '(silent)') + '</li>';
        }).join('') + '</ul></details>';
    }
    return html + '</div>';
}

function examResultsDetailHtml(rec) {
    var d = rec.detail;
    if (!d) {
        return rec.feedback ? '<div class="exam-results-feedback"><div class="exam-results-section-title">📝 Feedback</div><p>' + examEsc(rec.feedback) + '</p></div>' : '';
    }
    if (d.kind === 'receptive') return examWrongListHtml(d.wrong);
    if (d.kind === 'a1-productive') return examA1ResultHtml(d);
    if (d.kind === 'b1-productive') {
        var html = (d.blocks || []).map(function(b) { return examResultBlockHtml(b, d.module); }).join('');
        if (d.aussprache) {
            html += '<div class="exam-result-block"><div class="exam-result-block-head"><span>Aussprache (all parts)</span>' +
                '<span class="exam-result-block-score">' + examEsc(d.aussprache.score) + ' / ' + examEsc(d.aussprache.max) + '</span></div>' +
                '<div class="exam-result-meta">Estimated from word choice and complete sentences: a transcript cannot show pronunciation.</div></div>';
        }
        return html;
    }
    return '';
}

function examShowResults(rec, isReview) {
    var sec = EXAM_SECTIONS[rec.section];
    if (!sec) { examShowList(); return; }
    examView = 'results';
    var pct = rec.percentage;
    var passed = pct >= 60;
    var d = rec.detail || null;
    var hist = examSectionHistory(rec.section, rec.teil || null);
    var chart = examDrawChart(hist.slice(-30).map(function(a) { return a.percentage; }), 320, 140, false);
    var sub = '';
    if (d && d.kind === 'receptive') sub = d.correct + ' / ' + d.total + ' richtig';
    else if (d && d.kind === 'b1-productive') sub = Math.round(d.earned) + ' / ' + d.max + ' Punkte';
    var arg = sec.level === 'B1' ? rec.section : rec.section + '_a1';
    var when = new Date(rec.timestamp || Date.now());

    var html = '<div class="exam-results">' +
        '<div class="exam-results-header">' + examEsc(sec.emoji + ' ' + examAttemptTitle(rec.section, rec.teil)) + ' — Ergebnis</div>' +
        (isReview ? '<div class="exam-results-date">' + examEsc(when.toLocaleDateString() + ' ' + ('0' + when.getHours()).slice(-2) + ':' + ('0' + when.getMinutes()).slice(-2)) + '</div>' : '') +
        '<div class="exam-results-score-box">' +
            '<div class="exam-results-score ' + (passed ? 'passed' : 'failed') + '">' + pct + '%</div>' +
            '<div class="exam-results-badge ' + (passed ? 'passed' : 'failed') + '">' + (passed ? '✅ Bestanden' : '❌ Nicht bestanden') + '</div>' +
            (sub ? '<div class="exam-results-sub">' + examEsc(sub) + ' · pass mark 60%</div>' : '<div class="exam-results-sub">pass mark 60%</div>') +
        '</div>' +
        examResultsDetailHtml(rec) +
        '<div class="exam-results-chart">' +
            '<div class="exam-results-section-title">📈 Fortschritt' + (rec.teil ? ' · ' + examEsc(examPartWord(sec.module) + ' ' + rec.teil) : '') + '</div>' +
            chart +
        '</div>' +
        '<div class="exam-results-actions">' +
            '<button type="button" class="btn btn-primary" onclick="examOpenSection(\'' + arg + '\'' + (rec.teil ? ',' + Number(rec.teil) : '') + ')">Nochmal</button>' +
            '<button type="button" class="btn exam-btn-secondary" onclick="examShowList()">Zurück</button>' +
        '</div>' +
    '</div>';
    var c = examContainer();
    if (c) { c.innerHTML = html; c.scrollTop = 0; }
}
