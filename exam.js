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

    var prompt = 'Create a Goethe A1 Hören practice test in German. Return JSON only.\n\n' +
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

    var prompt = 'Create a Goethe A1 Lesen practice test in German. Return JSON only.\n\n' +
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
function examStartSchreiben() {
    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Schreiben wird vorbereitet…', 'Generating writing prompts…');

    var prompt = 'Generate Goethe A1 Schreiben practice prompts as JSON:\n' +
        '{\n' +
        '  "teil1": { "scenario": "What form context (e.g. Library card application, Gym registration)", "intro": "Short German context paragraph (30-50 words) giving info to fill in", "fields": [ {"label":"Vorname","correct_answer":"..."}, ... 5 fields with German labels and correct answers extractable from intro ] },\n' +
        '  "teil2": { "scenario": "Who you are writing to and why (in English, brief)", "task_de": "German task description with 3 bullet points to address", "min_words": 30 }\n' +
        '}';

    examChatJson(prompt, 1500, function(res) {
        if (res.error) { examShowError(res.error); return; }
        examCurrentTest = res.data;
        examUserAnswers = { teil1: {}, teil2: '' };
        examPartIndex = 0;
        examShowSchreibenTeil1();
    });
}

function examShowSchreibenTeil1() {
    var t1 = examCurrentTest.teil1;
    var container = document.getElementById('exam-content');

    var fieldsHtml = t1.fields.map(function(f, i) {
        return '<div class="exam-form-field">' +
            '<label class="exam-form-label">' + f.label + '</label>' +
            '<input type="text" class="exam-form-input" id="exam-field-' + i + '" autocomplete="off">' +
        '</div>';
    }).join('');

    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('✍️ Schreiben', 'Teil 1 · Formular ausfüllen') +
            '<div class="exam-question">' +
                '<div class="exam-scenario-banner">📝 ' + t1.scenario + '</div>' +
                '<div class="exam-reading-text">' + t1.intro + '</div>' +
                '<div class="exam-form">' + fieldsHtml + '</div>' +
                '<button class="btn btn-primary exam-next-btn" onclick="examSubmitSchreibenTeil1()">Weiter zu Teil 2 →</button>' +
            '</div>' +
        '</div>';
}

function examSubmitSchreibenTeil1() {
    var t1 = examCurrentTest.teil1;
    t1.fields.forEach(function(f, i) {
        var input = document.getElementById('exam-field-' + i);
        examUserAnswers.teil1[f.label] = input ? input.value.trim() : '';
    });
    examShowSchreibenTeil2();
}

function examShowSchreibenTeil2() {
    var t2 = examCurrentTest.teil2;
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('✍️ Schreiben', 'Teil 2 · Mitteilung schreiben') +
            '<div class="exam-question">' +
                '<div class="exam-scenario-banner">✉️ ' + t2.scenario + '</div>' +
                '<div class="exam-reading-text">' + t2.task_de + '</div>' +
                '<div class="exam-min-words">Mindestens ' + t2.min_words + ' Wörter</div>' +
                '<textarea class="exam-textarea" id="exam-text-input" rows="8" placeholder="Hier schreiben…"></textarea>' +
                '<button class="btn btn-primary exam-next-btn" onclick="examSubmitSchreibenTeil2()">Abgeben & Bewerten</button>' +
            '</div>' +
        '</div>';
}

function examSubmitSchreibenTeil2() {
    examUserAnswers.teil2 = document.getElementById('exam-text-input').value.trim();
    examGradeSchreiben();
}

function examGradeSchreiben() {
    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Wird bewertet…', 'AI is grading your writing');

    var t1 = examCurrentTest.teil1;
    var teil1Submission = t1.fields.map(function(f) {
        return f.label + ': ' + (examUserAnswers.teil1[f.label] || '(blank)') + ' (correct: ' + f.correct_answer + ')';
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
        'Task: ' + examCurrentTest.teil2.task_de + '\n' +
        'User wrote: ' + (examUserAnswers.teil2 || '(empty)');

    examChatJson(prompt, 800, function(res) {
        if (res.error) { examShowError(res.error); return; }
        examShowResults('schreiben', res.data.total, res.data.feedback, null);
    });
}
function examStartSprechen() {
    if (!examRecognition) {
        examShowError('Speech recognition not available on this device. Please use a recent Safari (iOS) or Chrome browser.');
        return;
    }

    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Sprechen wird vorbereitet…', 'Generating speaking prompts…');

    var prompt = 'Generate Goethe A1 Sprechen prompts as JSON:\n' +
        '{\n' +
        '  "teil1_fields": ["Name","Alter","Land","Wohnort","Sprachen","Beruf","Hobby"],\n' +
        '  "teil2": { "topic": "Single A1 topic word in German (e.g. Familie, Hobby, Wohnung, Essen)", "questions": ["Q1 in German","Q2 in German","Q3 in German"] },\n' +
        '  "teil3": { "scenario": "Brief A1 situation in German (e.g. Im Restaurant)", "request_prompt": "What you must request in German", "respond_prompt": "What you must respond to in German" }\n' +
        '}';

    examChatJson(prompt, 800, function(res) {
        if (res.error) { examShowError(res.error); return; }
        examCurrentTest = res.data;
        examUserAnswers = { teil1: [], teil2: [], teil3: [] };
        examPartIndex = 0;
        examItemIndex = 0;
        examShowSprechenItem();
    });
}

function examShowSprechenItem() {
    var container = document.getElementById('exam-content');

    if (examPartIndex === 0) {
        var fields = examCurrentTest.teil1_fields;
        if (examItemIndex >= fields.length) {
            examPartIndex = 1; examItemIndex = 0;
            examShowSprechenItem();
            return;
        }
        var field = fields[examItemIndex];
        container.innerHTML =
            '<div class="exam-active">' +
                examActiveHeader('🗣️ Sprechen', 'Teil 1 · ' + (examItemIndex + 1) + ' / ' + fields.length) +
                '<div class="exam-question">' +
                    '<div class="exam-sprechen-prompt">Sagen Sie etwas über: <strong>' + field + '</strong></div>' +
                    examMicArea() +
                '</div>' +
            '</div>';
        examStartSprechenListen();
        return;
    }

    if (examPartIndex === 1) {
        var qs = examCurrentTest.teil2.questions;
        if (examItemIndex >= qs.length) {
            examPartIndex = 2; examItemIndex = 0;
            examShowSprechenItem();
            return;
        }
        container.innerHTML =
            '<div class="exam-active">' +
                examActiveHeader('🗣️ Sprechen', 'Teil 2 · ' + (examItemIndex + 1) + ' / ' + qs.length) +
                '<div class="exam-question">' +
                    '<div class="exam-scenario-banner">📌 Thema: ' + examCurrentTest.teil2.topic + '</div>' +
                    '<div class="exam-sprechen-prompt">' + qs[examItemIndex] + '</div>' +
                    examMicArea() +
                '</div>' +
            '</div>';
        examStartSprechenListen();
        return;
    }

    var t3 = examCurrentTest.teil3;
    var prompts = [t3.request_prompt, t3.respond_prompt];
    if (examItemIndex >= prompts.length) {
        examGradeSprechen();
        return;
    }
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('🗣️ Sprechen', 'Teil 3 · ' + (examItemIndex + 1) + ' / 2') +
            '<div class="exam-question">' +
                '<div class="exam-scenario-banner">📍 ' + t3.scenario + '</div>' +
                '<div class="exam-sprechen-prompt">' + prompts[examItemIndex] + '</div>' +
                examMicArea() +
            '</div>' +
        '</div>';
    examStartSprechenListen();
}

function examStartSprechenListen() {
    if (!examRecognition) return;
    var oldOnResult = examRecognition.onresult;
    var oldOnError = examRecognition.onerror;

    examRecognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        examRecognition.onresult = oldOnResult;
        examRecognition.onerror = oldOnError;
        examHandleSprechenAnswer(transcript);
    };

    examRecognition.onerror = function(e) {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        examRecognition.onresult = oldOnResult;
        examRecognition.onerror = oldOnError;
        examHandleSprechenAnswer('(could not transcribe)');
    };

    try { examRecognition.start(); } catch(e) {}
}

function examHandleSprechenAnswer(transcript) {
    var teilKey = ['teil1', 'teil2', 'teil3'][examPartIndex];
    examUserAnswers[teilKey].push(transcript);
    examItemIndex++;
    examShowSprechenItem();
}

function examGradeSprechen() {
    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Wird bewertet…', 'AI is grading your speaking');

    var teil1Sub = examCurrentTest.teil1_fields.map(function(f, i) {
        return f + ': ' + (examUserAnswers.teil1[i] || '(silent)');
    }).join('\n');
    var teil2Sub = examCurrentTest.teil2.questions.map(function(q, i) {
        return 'Q: ' + q + '\nA: ' + (examUserAnswers.teil2[i] || '(silent)');
    }).join('\n');
    var teil3Sub = [examCurrentTest.teil3.request_prompt, examCurrentTest.teil3.respond_prompt].map(function(p, i) {
        return 'Prompt: ' + p + '\nUser said: ' + (examUserAnswers.teil3[i] || '(silent)');
    }).join('\n');

    var prompt = 'Grade this Goethe A1 Sprechen submission (transcripts). Return JSON only:\n' +
        '{\n' +
        '  "teil1_score": 0-30,\n' +
        '  "teil2_score": 0-35,\n' +
        '  "teil3_score": 0-35,\n' +
        '  "total": 0-100,\n' +
        '  "feedback": "1-2 paragraph feedback in English. Note grammar/vocab/task fulfilment, plus at least one positive note. Do not comment on pronunciation since we only have transcripts."\n' +
        '}\n\n' +
        'TEIL 1 (self-introduction):\n' + teil1Sub + '\n\n' +
        'TEIL 2 (topic ' + examCurrentTest.teil2.topic + '):\n' + teil2Sub + '\n\n' +
        'TEIL 3 (scenario ' + examCurrentTest.teil3.scenario + '):\n' + teil3Sub;

    examChatJson(prompt, 800, function(res) {
        if (res.error) { examShowError(res.error); return; }
        examShowResults('sprechen', res.data.total, res.data.feedback, null);
    });
}

// ── Shared UI helpers ──────────────────────────────────────────

function examLoadingHtml(title, sub) {
    return '<div class="exam-loading">' +
        '<div class="exam-spinner"></div>' +
        '<div class="exam-loading-title">' + title + '</div>' +
        '<div class="exam-loading-sub">' + sub + '</div>' +
    '</div>';
}

function examActiveHeader(title, progress) {
    return '<div class="exam-active-header">' +
        '<button class="exam-exit-btn" onclick="examExit()">⛔ Beenden</button>' +
        '<div class="exam-active-title">' + title + '</div>' +
        '<div class="exam-active-progress">' + progress + '</div>' +
    '</div>';
}

function examMicArea() {
    return '<div class="exam-mic-area">' +
        '<div class="exam-mic-pulse"></div>' +
        '<div class="exam-mic-status">🎤 Sprich jetzt…</div>' +
    '</div>';
}

function examShowError(msg) {
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-error-screen">' +
            '<div class="exam-error-icon">⚠️</div>' +
            '<p>' + msg + '</p>' +
            '<button class="btn btn-primary" onclick="renderExamScreen()">Zurück</button>' +
        '</div>';
}

function examExit() {
    if (examActiveAudio) { try { examActiveAudio.pause(); } catch(e) {} }
    if (examRecognition) { try { examRecognition.stop(); } catch(e) {} }
    renderExamScreen();
}

// ── Auto-graded scoring (Hören, Lesen) ─────────────────────────

function examFinishAutoGraded() {
    var test = examCurrentTest;
    var ans = examUserAnswers;
    var correct = 0, total = 0, wrongList = [];

    ['teil1', 'teil2', 'teil3'].forEach(function(key, ti) {
        test[key].forEach(function(item, idx) {
            total++;
            var userAns = ans[key][idx];
            var isCorrect = userAns === item.correct;
            if (isCorrect) correct++;
            else wrongList.push({
                teil: ti + 1,
                question: item.question || item.statement,
                userAnswer: examFormatAnswer(userAns, item),
                correctAnswer: examFormatAnswer(item.correct, item)
            });
        });
    });

    var pct = total ? Math.round((correct / total) * 100) : 0;
    examShowResults(examCurrentSection, pct, null, wrongList);
}

function examFormatAnswer(ans, item) {
    if (item.options) {
        if (typeof ans !== 'number' || ans < 0) return '(no answer)';
        return String.fromCharCode(65 + ans) + ') ' + item.options[ans];
    }
    if (ans === true) return 'Richtig';
    if (ans === false) return 'Falsch';
    return '(no answer)';
}

// ── Results screen ─────────────────────────────────────────────

function examShowResults(section, percentage, feedback, wrongList) {
    examSaveAttempt(section, percentage, feedback);

    var sec = EXAM_SECTIONS[section];
    var passed = percentage >= 60;
    var allScores = examSectionHistory(section).map(function(a) { return a.percentage; });
    var chart = examDrawChart(allScores.slice(-30), 320, 140, false);

    var html = '<div class="exam-results">' +
        '<div class="exam-results-header">' + sec.emoji + ' ' + sec.titleDe + ' — Ergebnis</div>' +
        '<div class="exam-results-score-box">' +
            '<div class="exam-results-score ' + (passed ? 'passed' : 'failed') + '">' + percentage + '%</div>' +
            '<div class="exam-results-badge ' + (passed ? 'passed' : 'failed') + '">' + (passed ? '✅ Bestanden' : '❌ Nicht bestanden') + '</div>' +
        '</div>';

    if (feedback) {
        html += '<div class="exam-results-feedback">' +
            '<div class="exam-results-section-title">📝 Feedback</div>' +
            '<p>' + feedback + '</p>' +
        '</div>';
    }

    if (wrongList && wrongList.length) {
        html += '<div class="exam-results-wrong">' +
            '<div class="exam-results-section-title">❌ Falsche Antworten (' + wrongList.length + ')</div>';
        wrongList.forEach(function(w) {
            html += '<div class="exam-wrong-item">' +
                '<div class="exam-wrong-q">Teil ' + w.teil + ': ' + w.question + '</div>' +
                '<div class="exam-wrong-yours">Deine Antwort: <span class="exam-wrong-bad">' + w.userAnswer + '</span></div>' +
                '<div class="exam-wrong-right">Richtig: <span class="exam-wrong-good">' + w.correctAnswer + '</span></div>' +
            '</div>';
        });
        html += '</div>';
    }

    html += '<div class="exam-results-chart">' +
        '<div class="exam-results-section-title">📈 Fortschritt</div>' +
        chart +
    '</div>';

    html += '<div class="exam-results-actions">' +
        '<button class="btn btn-primary" onclick="examStartSection(\'' + section + '\')">Nochmal</button>' +
        '<button class="btn" onclick="renderExamScreen()">Zurück</button>' +
    '</div>';

    html += '</div>';

    document.getElementById('exam-content').innerHTML = html;
}
