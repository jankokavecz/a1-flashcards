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

function examStartHoeren() {
    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Hören wird vorbereitet…', 'Generating questions and audio (~30s)');

    var prompt = 'Generate a complete Goethe A1 Hören practice test as JSON. Use only A1-level German vocabulary. Topics: everyday situations (shopping, travel, family, time, weather). Return EXACTLY this structure:\n' +
        '{\n' +
        '  "teil1": [ { "context": "Where is the dialogue happening?", "dialog": [ {"speaker":"A","text":"..."},{"speaker":"B","text":"..."} ], "question": "...", "options": ["a","b","c"], "correct": 0 }, ... 6 items ],\n' +
        '  "teil2": [ { "context": "Public announcement", "text": "longer announcement", "statement": "Statement to judge as true or false", "correct": true }, ... 4 items ],\n' +
        '  "teil3": [ { "context": "Phone message or radio", "text": "...", "question": "...", "options": ["a","b","c"], "correct": 0 }, ... 5 items ]\n' +
        '}\n' +
        'All German text natural for A1. Questions in German. Make options plausible distractors.';

    examChatJson(prompt, 3000, function(res) {
        if (res.error) { examShowError(res.error); return; }
        examCurrentTest = res.data;
        examUserAnswers = { teil1: [], teil2: [], teil3: [] };
        examPartIndex = 0;
        examItemIndex = 0;
        examShowHoerenItem();
    });
}

function examShowHoerenItem() {
    var teilKey = ['teil1', 'teil2', 'teil3'][examPartIndex];
    var teil = examCurrentTest[teilKey];

    if (!teil || examItemIndex >= teil.length) {
        examPartIndex++;
        examItemIndex = 0;
        if (examPartIndex >= 3) { examFinishAutoGraded(); return; }
        examShowHoerenItem();
        return;
    }

    var item = teil[examItemIndex];

    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('🎧 Hören', 'Teil ' + (examPartIndex + 1) + ' · Frage ' + (examItemIndex + 1) + ' / ' + teil.length) +
            '<div class="exam-question">' +
                '<div class="exam-context">' + item.context + '</div>' +
                '<div class="exam-audio-loading" id="exam-audio-loading">⏳ Audio wird geladen…</div>' +
                '<audio id="exam-audio" controls class="exam-audio hidden"></audio>' +
                '<div class="exam-question-text">' + (item.question || item.statement) + '</div>' +
                '<div class="exam-options" id="exam-options"></div>' +
            '</div>' +
        '</div>';

    var audioText, voice;
    if (item.dialog) {
        audioText = item.dialog.map(function(d) { return d.text; }).join(' … ');
        voice = 'nova';
    } else {
        audioText = item.text;
        voice = 'onyx';
    }

    examTtsToBlob(audioText, voice, function(res) {
        if (res.error) { examShowError(res.error); return; }
        var audioEl = document.getElementById('exam-audio');
        var loadingEl = document.getElementById('exam-audio-loading');
        if (audioEl) {
            audioEl.src = res.url;
            audioEl.classList.remove('hidden');
            examActiveAudio = audioEl;
        }
        if (loadingEl) loadingEl.style.display = 'none';
    });

    var optsEl = document.getElementById('exam-options');
    if (item.options) {
        item.options.forEach(function(opt, idx) {
            var btn = document.createElement('button');
            btn.className = 'exam-option';
            btn.textContent = String.fromCharCode(65 + idx) + ') ' + opt;
            btn.addEventListener('click', function() { examAnswerHoeren(idx); });
            optsEl.appendChild(btn);
        });
    } else {
        ['Richtig', 'Falsch'].forEach(function(label, idx) {
            var btn = document.createElement('button');
            btn.className = 'exam-option';
            btn.textContent = label;
            btn.addEventListener('click', function() { examAnswerHoeren(idx === 0); });
            optsEl.appendChild(btn);
        });
    }
}

function examAnswerHoeren(answer) {
    var teilKey = ['teil1', 'teil2', 'teil3'][examPartIndex];
    examUserAnswers[teilKey].push(answer);
    var audioEl = document.getElementById('exam-audio');
    if (audioEl) audioEl.pause();
    examItemIndex++;
    examShowHoerenItem();
}
function examStartLesen() {
    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Lesen wird vorbereitet…', 'Generating reading test…');

    var prompt = 'Generate a Goethe A1 Lesen practice test as JSON. Use A1-level German. Return EXACTLY:\n' +
        '{\n' +
        '  "teil1": [ { "text": "Short personal email or text message (40-60 words)", "statement": "Statement about the text", "correct": true }, ... 5 items ],\n' +
        '  "teil2": [ { "text": "Short ad, sign, or notice (30-50 words)", "question": "Question in German", "options": ["a","b","c"], "correct": 0 }, ... 5 items ],\n' +
        '  "teil3": [ { "text": "Short note, sign, or instruction (20-40 words)", "statement": "Statement about it", "correct": false }, ... 5 items ]\n' +
        '}';

    examChatJson(prompt, 2500, function(res) {
        if (res.error) { examShowError(res.error); return; }
        examCurrentTest = res.data;
        examUserAnswers = { teil1: [], teil2: [], teil3: [] };
        examPartIndex = 0;
        examItemIndex = 0;
        examShowLesenItem();
    });
}

function examShowLesenItem() {
    var teilKey = ['teil1', 'teil2', 'teil3'][examPartIndex];
    var teil = examCurrentTest[teilKey];

    if (!teil || examItemIndex >= teil.length) {
        examPartIndex++;
        examItemIndex = 0;
        if (examPartIndex >= 3) { examFinishAutoGraded(); return; }
        examShowLesenItem();
        return;
    }

    var item = teil[examItemIndex];
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('📖 Lesen', 'Teil ' + (examPartIndex + 1) + ' · Frage ' + (examItemIndex + 1) + ' / ' + teil.length) +
            '<div class="exam-question">' +
                '<div class="exam-reading-text">' + item.text.replace(/\n/g, '<br>') + '</div>' +
                '<div class="exam-question-text">' + (item.question || item.statement) + '</div>' +
                '<div class="exam-options" id="exam-options"></div>' +
            '</div>' +
        '</div>';

    var optsEl = document.getElementById('exam-options');
    if (item.options) {
        item.options.forEach(function(opt, idx) {
            var btn = document.createElement('button');
            btn.className = 'exam-option';
            btn.textContent = String.fromCharCode(65 + idx) + ') ' + opt;
            btn.addEventListener('click', function() { examAnswerLesen(idx); });
            optsEl.appendChild(btn);
        });
    } else {
        ['Richtig', 'Falsch'].forEach(function(label, idx) {
            var btn = document.createElement('button');
            btn.className = 'exam-option';
            btn.textContent = label;
            btn.addEventListener('click', function() { examAnswerLesen(idx === 0); });
            optsEl.appendChild(btn);
        });
    }
}

function examAnswerLesen(answer) {
    var teilKey = ['teil1', 'teil2', 'teil3'][examPartIndex];
    examUserAnswers[teilKey].push(answer);
    examItemIndex++;
    examShowLesenItem();
}
function examStartSchreiben() { /* Task 5 */ }
function examStartSprechen()  { /* Task 6 */ }
