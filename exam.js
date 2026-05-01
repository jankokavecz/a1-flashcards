// exam.js — Goethe A1 Exam Practice
// Depends on: app.js (for tab switching) and shared OpenAI key from calls.js storage

// ── State ──────────────────────────────────────────────────────
var examCurrentSection = null;     // 'hoeren' | 'lesen' | 'schreiben' | 'sprechen'
var examCurrentTest = null;        // generated questions object
var examUserAnswers = [];          // collected answers (shape varies per section)
var examPartIndex = 0;             // current Teil being shown
var examItemIndex = 0;             // current item within Teil
var examRecognition = null;        // SpeechRecognition instance for Sprechen
var examActiveAudio = null;        // <audio> currently playing (Hören)

var EXAM_SECTIONS = {
    hoeren:    { id: 'hoeren',    emoji: '🎧', titleDe: 'Hören',    titleEn: 'Listening' },
    lesen:     { id: 'lesen',     emoji: '📖', titleDe: 'Lesen',     titleEn: 'Reading' },
    schreiben: { id: 'schreiben', emoji: '✍️', titleDe: 'Schreiben', titleEn: 'Writing' },
    sprechen:  { id: 'sprechen',  emoji: '🗣️', titleDe: 'Sprechen', titleEn: 'Speaking' }
};

// ── History ────────────────────────────────────────────────────

function examGetHistory() {
    try { return JSON.parse(localStorage.getItem('exam_history') || '[]'); }
    catch(e) { return []; }
}

function examSaveAttempt(section, percentage, feedback) {
    var hist = examGetHistory();
    hist.push({
        section: section,
        percentage: Math.round(percentage),
        timestamp: Date.now(),
        feedback: feedback || null
    });
    while (hist.length > 100) hist.shift();
    localStorage.setItem('exam_history', JSON.stringify(hist));
}

function examSectionHistory(section) {
    return examGetHistory().filter(function(a) { return a.section === section; });
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

// ── OpenAI helpers ─────────────────────────────────────────────

function examGetApiKey() {
    return localStorage.getItem('openai_api_key') || '';
}

function examChatJson(prompt, max_tokens, callback) {
    var apiKey = examGetApiKey();
    if (!apiKey) { callback({ error: 'No OpenAI API key set. Configure it in the Speak tab.' }); return; }

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: max_tokens || 1500,
            temperature: 0.7,
            response_format: { type: 'json_object' }
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.error) { callback({ error: data.error.message }); return; }
        try {
            var parsed = JSON.parse(data.choices[0].message.content);
            callback({ data: parsed });
        } catch(e) {
            callback({ error: 'Could not parse JSON response.' });
        }
    })
    .catch(function() { callback({ error: 'Network error.' }); });
}

function examTtsToBlob(text, voice, callback) {
    var apiKey = examGetApiKey();
    fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            model: 'tts-1',
            voice: voice || 'nova',
            input: text,
            speed: 0.95
        })
    })
    .then(function(r) {
        if (!r.ok) return r.json().then(function(j) { throw new Error(j.error ? j.error.message : 'TTS error'); });
        return r.blob();
    })
    .then(function(blob) { callback({ url: URL.createObjectURL(blob) }); })
    .catch(function(err) { callback({ error: err.message }); });
}

// ── Init ───────────────────────────────────────────────────────

function initExam() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
        examRecognition = new SR();
        examRecognition.continuous = false;
        examRecognition.interimResults = false;
        examRecognition.lang = 'de-DE';
    }
    renderExamScreen();
}

function renderExamScreen() {
    var container = document.getElementById('exam-content');
    if (!container) return;
    if (!examGetApiKey()) {
        container.innerHTML =
            '<div class="exam-no-key">' +
                '<div class="exam-no-key-icon">🔑</div>' +
                '<p>Set your OpenAI API key in the <strong>🗣️ Speak</strong> tab first.</p>' +
            '</div>';
        return;
    }
    renderExamSectionList(container);
}

function renderExamSectionList(container) {
    var html = '<div class="exam-list-header">' +
        '<p class="exam-list-subtitle">Tap a section to practise</p>' +
    '</div>';

    html += '<div class="exam-sections">';
    Object.keys(EXAM_SECTIONS).forEach(function(key) {
        var sec = EXAM_SECTIONS[key];
        var best = examBestScore(key);
        var last = examLastScore(key);
        var attempts = examSectionHistory(key).length;
        var miniChart = examDrawChart(examSectionHistory(key).slice(-10).map(function(a) { return a.percentage; }), 80, 36, true);

        html += '<div class="exam-section-card" onclick="examStartSection(\'' + key + '\')">' +
            '<div class="exam-section-top">' +
                '<div class="exam-section-emoji">' + sec.emoji + '</div>' +
                '<div class="exam-section-info">' +
                    '<div class="exam-section-title">' + sec.titleDe + '</div>' +
                    '<div class="exam-section-subtitle">' + sec.titleEn + '</div>' +
                '</div>' +
                '<div class="exam-section-score">' +
                    (best !== null ? '<div class="exam-best">' + best + '%</div><div class="exam-best-label">best</div>' : '<div class="exam-best-empty">—</div>') +
                '</div>' +
            '</div>' +
            '<div class="exam-section-bottom">' +
                '<div class="exam-section-stats">' +
                    (last !== null ? 'Last: ' + last + '%' : 'Not started') +
                    ' · ' + attempts + ' attempt' + (attempts === 1 ? '' : 's') +
                '</div>' +
                '<div class="exam-section-chart">' + miniChart + '</div>' +
            '</div>' +
        '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
}

// ── SVG Chart ──────────────────────────────────────────────────

function examDrawChart(scores, width, height, isMini) {
    var w = width || 320;
    var h = height || 120;
    var pad = isMini ? 2 : 24;

    if (!scores.length) {
        return '<svg width="' + w + '" height="' + h + '" class="exam-chart-empty">' +
            '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + (h * 0.4) + '" y2="' + (h * 0.4) + '" stroke="#444" stroke-dasharray="3,3"/>' +
        '</svg>';
    }

    var innerW = w - pad * 2;
    var innerH = h - pad * 2;
    var n = scores.length;

    function x(i) { return pad + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1)); }
    function y(s) { return pad + innerH - (s / 100) * innerH; }

    var passLineY = y(60);
    var lastScore = scores[n - 1];
    var lineColor = lastScore >= 60 ? '#10b981' : '#ef4444';

    var pts = scores.map(function(s, i) { return x(i) + ',' + y(s); }).join(' ');

    var svg = '<svg width="' + w + '" height="' + h + '" class="exam-chart' + (isMini ? ' exam-chart-mini' : '') + '">';
    svg += '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + passLineY + '" y2="' + passLineY + '" stroke="#666" stroke-dasharray="3,3" stroke-width="1"/>';

    if (!isMini) {
        svg += '<text x="' + (pad - 4) + '" y="' + (y(0) + 4) + '" text-anchor="end" fill="#666" font-size="10">0</text>';
        svg += '<text x="' + (pad - 4) + '" y="' + (passLineY + 4) + '" text-anchor="end" fill="#666" font-size="10">60</text>';
        svg += '<text x="' + (pad - 4) + '" y="' + (y(100) + 4) + '" text-anchor="end" fill="#666" font-size="10">100</text>';
    }

    if (n >= 2) {
        svg += '<polyline points="' + pts + '" fill="none" stroke="' + lineColor + '" stroke-width="' + (isMini ? 1.5 : 2) + '"/>';
    }

    scores.forEach(function(s, i) {
        var r = isMini ? 1.5 : 3;
        var pointColor = s >= 60 ? '#10b981' : '#ef4444';
        svg += '<circle cx="' + x(i) + '" cy="' + y(s) + '" r="' + r + '" fill="' + pointColor + '"/>';
    });

    svg += '</svg>';
    return svg;
}

function examStartSection(sectionId) {
    examCurrentSection = sectionId;
    if (sectionId === 'hoeren') examStartHoeren();
    else if (sectionId === 'lesen') examStartLesen();
    else if (sectionId === 'schreiben') examStartSchreiben();
    else if (sectionId === 'sprechen') examStartSprechen();
}

function examStartHoeren()    { /* Task 3 */ }
function examStartLesen()     { /* Task 4 */ }
function examStartSchreiben() { /* Task 5 */ }
function examStartSprechen()  { /* Task 6 */ }
