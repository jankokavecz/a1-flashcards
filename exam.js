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
    container.innerHTML = ''; // populated in Task 2
}
