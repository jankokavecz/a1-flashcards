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
    sprechen:  { id: 'sprechen',  emoji: '🗣️', titleDe: 'Sprechen', titleEn: 'Speaking' },
    // B1 variants share history/results/list rendering with the A1 ones
    // above (same EXAM_SECTIONS map, same examGetHistory() by section id) --
    // examStartSection() below is the only place that branches on '_b1'.
    hoeren_b1:    { id: 'hoeren_b1',    emoji: '🎧', titleDe: 'Hören (B1)',    titleEn: 'Listening (B1)' },
    lesen_b1:     { id: 'lesen_b1',     emoji: '📖', titleDe: 'Lesen (B1)',     titleEn: 'Reading (B1)' },
    schreiben_b1: { id: 'schreiben_b1', emoji: '✍️', titleDe: 'Schreiben (B1)', titleEn: 'Writing (B1)' },
    sprechen_b1:  { id: 'sprechen_b1',  emoji: '🗣️', titleDe: 'Sprechen (B1)', titleEn: 'Speaking (B1)' }
};

// ── Checkpoint quiz ──────────────────────────────────────────────
// Needs no API key: a short vocab quiz drawn only from words already
// introduced (so difficulty rises on its own as more words unlock),
// scored and logged so a readiness trend can be shown.

var CHECKPOINT_HISTORY_KEY = 'checkpoint-history';
var checkpointQuestions = [];
var checkpointIndex = 0;
var checkpointCorrect = 0;

function checkpointGetHistory() {
    try { return JSON.parse(localStorage.getItem(CHECKPOINT_HISTORY_KEY) || '[]'); }
    catch (e) { return []; }
}

function checkpointSaveAttempt(percentage, wordCount) {
    var hist = checkpointGetHistory();
    hist.push({ date: srsToday(), percentage: Math.round(percentage), wordCount: wordCount, timestamp: Date.now() });
    while (hist.length > 100) hist.shift();
    localStorage.setItem(CHECKPOINT_HISTORY_KEY, JSON.stringify(hist));
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

function checkpointCardHtml() {
    var hist = checkpointGetHistory();
    var last = hist.length ? hist[hist.length - 1] : null;
    var readiness = checkpointReadiness();
    var introducedCount = 0;
    for (var id in wordProgress) introducedCount++;

    var subtitle = introducedCount < 10
        ? 'Learn a few more cards first — checkpoints need at least 10 introduced words.'
        : (last ? 'Last: ' + last.percentage + '% · ' + readiness.attempts + ' attempt' + (readiness.attempts === 1 ? '' : 's') + ' · readiness ' + readiness.text
                : 'No attempts yet. Draws only from words and grammar chapters you have already seen, so it gets harder as you learn more.');

    return '<div class="checkpoint-card">' +
        '<div class="checkpoint-card-top">' +
            '<div class="checkpoint-card-emoji">📊</div>' +
            '<div>' +
                '<div class="checkpoint-card-title">Checkpoint quiz</div>' +
                '<div class="checkpoint-card-sub">' + subtitle + '</div>' +
            '</div>' +
        '</div>' +
        '<button class="btn btn-primary checkpoint-start-btn" id="checkpoint-start-btn" ' +
            (introducedCount < 10 ? 'disabled' : '') + '>Start checkpoint</button>' +
    '</div>';
}

function bindCheckpointCard() {
    var btn = document.getElementById('checkpoint-start-btn');
    if (btn) btn.addEventListener('click', checkpointStart);
}

function checkpointCollectGrammarExamples() {
    var viewed = typeof grammarViewedIds === 'function' ? grammarViewedIds() : [];
    var examples = [];
    ALL_GRAMMAR.forEach(function(section) {
        if (viewed.indexOf(section.id) === -1) return; // only quiz chapters you've actually opened
        section.content.forEach(function(item) {
            if (item.type === 'example' && item.de && item.en) {
                examples.push({ de: item.de, en: item.en });
            }
        });
    });
    return examples;
}

function checkpointBuildGrammarQuestions(count) {
    var pool = checkpointCollectGrammarExamples();
    if (pool.length < 4) return [];
    var shuffled = shuffle(pool);
    var qs = [];
    for (var i = 0; i < Math.min(count, shuffled.length); i++) {
        var ex = shuffled[i];
        var distractors = shuffle(pool.filter(function(e) { return e.en !== ex.en; })).slice(0, 3);
        var options = distractors.map(function(d) { return { text: d.en, correct: false }; });
        options.push({ text: ex.en, correct: true });
        options = shuffle(options);
        qs.push({ prompt: ex.de, direction: 'de_to_en', options: options });
    }
    return qs;
}

function checkpointStart() {
    var introduced = ALL_WORDS.filter(function(w) { return !!wordProgress[w.id]; });
    if (introduced.length < 10) return;
    var vocabQs = generateQuestions(introduced, Math.min(9, introduced.length));
    var grammarQs = checkpointBuildGrammarQuestions(4);
    checkpointQuestions = shuffle(vocabQs.concat(grammarQs));
    checkpointIndex = 0;
    checkpointCorrect = 0;
    checkpointShowQuestion();
}

function checkpointShowQuestion() {
    var container = document.getElementById('exam-content');
    if (checkpointIndex >= checkpointQuestions.length) {
        checkpointFinish();
        return;
    }
    var q = checkpointQuestions[checkpointIndex];
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('📊 Checkpoint', (checkpointIndex + 1) + ' / ' + checkpointQuestions.length) +
            '<div class="exam-question">' +
                '<div class="exam-question-text">' + (q.direction === 'de_to_en' ? 'What does this mean?' : 'How do you say this in German?') + '</div>' +
                '<div class="exam-context">' + q.prompt + '</div>' +
                '<div class="exam-options" id="checkpoint-options"></div>' +
            '</div>' +
        '</div>';

    var optsEl = document.getElementById('checkpoint-options');
    q.options.forEach(function(opt) {
        var btn = document.createElement('button');
        btn.className = 'exam-option';
        btn.textContent = opt.text;
        btn.addEventListener('click', function() { checkpointAnswer(opt.correct, btn, optsEl); });
        optsEl.appendChild(btn);
    });
}

function checkpointAnswer(isCorrect, clickedBtn, container) {
    var allBtns = container.querySelectorAll('.exam-option');
    allBtns.forEach(function(b) { b.style.pointerEvents = 'none'; });
    if (isCorrect) {
        checkpointCorrect++;
        clickedBtn.classList.add('correct');
    } else {
        clickedBtn.classList.add('wrong');
        var q = checkpointQuestions[checkpointIndex];
        allBtns.forEach(function(b, idx) { if (q.options[idx].correct) b.classList.add('correct'); });
    }
    setTimeout(function() {
        checkpointIndex++;
        checkpointShowQuestion();
    }, 900);
}

function checkpointFinish() {
    var pct = Math.round((checkpointCorrect / checkpointQuestions.length) * 100);
    var introducedCount = 0;
    for (var id in wordProgress) introducedCount++;
    checkpointSaveAttempt(pct, introducedCount);

    var passed = pct >= 60;
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-results">' +
            '<div class="exam-results-header">📊 Checkpoint — Ergebnis</div>' +
            '<div class="exam-results-score-box">' +
                '<div class="exam-results-score ' + (passed ? 'passed' : 'failed') + '">' + pct + '%</div>' +
                '<div class="exam-results-badge ' + (passed ? 'passed' : 'failed') + '">' + checkpointCorrect + ' / ' + checkpointQuestions.length + ' correct</div>' +
            '</div>' +
            '<div class="exam-results-actions">' +
                '<button class="btn btn-primary" onclick="renderExamScreen()">Done</button>' +
            '</div>' +
        '</div>';
}

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

    var html = checkpointCardHtml();

    if (!examGetApiKey()) {
        html += '<div class="exam-no-key">' +
                '<div class="exam-no-key-icon">🔑</div>' +
                '<p>Set your OpenAI API key in the <strong>🗣️ Speak</strong> tab for the full AI-graded Hören/Lesen/Schreiben/Sprechen practice below.</p>' +
            '</div>';
        container.innerHTML = html;
        return;
    }

    container.innerHTML = html + examSectionListHtml();
    bindCheckpointCard();
}

function examSectionListHtml() {
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
    return html;
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
    if (sectionId.indexOf('_b1') !== -1) { b1ExamStartSection(sectionId); return; }
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

// ── B1 exam practice (real Goethe-format, AI-generated + AI-graded) ────
// Driven by B1_EXAM_SECTIONS/B1_EXAM_PROMPTS from b1-exam-data.js. Reuses
// examChatJson/examTtsToBlob/examActiveHeader/examLoadingHtml/examMicArea/
// examDrawChart/examShowResults from the A1 engine above -- only the
// generation and per-item display logic is new, because B1_EXAM_PROMPTS
// returns a different JSON shape per module than the hardcoded A1 prompts.

var b1ExamModule = null;        // 'hoeren' | 'lesen' | 'schreiben' | 'sprechen'
var b1ExamTeilResults = [];     // generated data per teil, index-aligned with b1ExamActiveTeile()
var b1ExamTeilIdx = 0;
var b1ExamItemIdx = 0;
var b1ExamAnswers = [];         // per teil: bool[] (receptive) or {text|transcript} (productive)
var b1ExamGrades = [];          // per teil: AI grading result (productive only)
var b1ExamWrongList = [];

function b1FillPrompt(template, vars) {
    var out = template;
    Object.keys(vars).forEach(function(k) {
        out = out.split('{{' + k + '}}').join(String(vars[k]));
    });
    return out;
}

function b1ExamActiveTeile() {
    var teile = B1_EXAM_SECTIONS[b1ExamModule].teile;
    // Sprechen's n:0 "pronunciation" entry has no task of its own -- it is
    // assessed across the other three parts, not generated/answered on its own.
    return b1ExamModule === 'sprechen' ? teile.filter(function(t) { return t.n !== 0; }) : teile;
}

function b1ExamStartSection(sectionId) {
    examCurrentSection = sectionId;
    b1ExamModule = sectionId.replace('_b1', '');
    b1ExamTeilResults = [];
    b1ExamTeilIdx = 0;
    b1ExamItemIdx = 0;
    b1ExamAnswers = [];
    b1ExamGrades = [];
    b1ExamWrongList = [];

    var meta = EXAM_SECTIONS[sectionId];
    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml(meta.titleDe + ' wird vorbereitet…', 'Generating B1 practice — this can take a little while');

    if (b1ExamModule === 'hoeren' || b1ExamModule === 'lesen') {
        b1ExamGenerateAllTeile(0);
    } else {
        b1ExamGenerateOneTeil(0, b1ExamShowCurrentProductive);
    }
}

function b1ExamGenerateAllTeile(teilIdx) {
    var teile = b1ExamActiveTeile();
    if (teilIdx >= teile.length) { b1ExamShowCurrentReceptive(); return; }
    var teilMeta = teile[teilIdx];
    var prompt = b1FillPrompt(B1_EXAM_PROMPTS[b1ExamModule], { teil: teilMeta.n, format: teilMeta.format, n: teilMeta.items });
    examChatJson(prompt, 2800, function(res) {
        if (res.error) { examShowError(res.error); return; }
        b1ExamTeilResults[teilIdx] = res.data;
        b1ExamGenerateAllTeile(teilIdx + 1);
    });
}

function b1ExamGenerateOneTeil(teilIdx, onDone) {
    var teile = b1ExamActiveTeile();
    if (teilIdx >= teile.length) { onDone(); return; }
    var teilMeta = teile[teilIdx];
    var vars = b1ExamModule === 'schreiben'
        ? { teil: teilMeta.n, format: teilMeta.format, words: teilMeta.words }
        : { teil: teilMeta.n, format: teilMeta.format };
    var prompt = b1FillPrompt(B1_EXAM_PROMPTS[b1ExamModule], vars);
    examChatJson(prompt, 900, function(res) {
        if (res.error) { examShowError(res.error); return; }
        b1ExamTeilResults[teilIdx] = res.data;
        onDone();
    });
}

// ── Receptive (Hören / Lesen): multiple choice, auto-graded ────────────

function b1ExamShowCurrentReceptive() {
    b1ExamTeilIdx = 0;
    b1ExamItemIdx = 0;
    if (b1ExamModule === 'hoeren') b1ExamShowHoerenItem();
    else b1ExamShowLesenItem();
}

function b1ExamShowHoerenItem() {
    var teil = b1ExamTeilResults[b1ExamTeilIdx];
    var items = (teil && teil.items) || [];
    if (b1ExamItemIdx >= items.length) {
        b1ExamTeilIdx++; b1ExamItemIdx = 0;
        if (b1ExamTeilIdx >= b1ExamTeilResults.length) { b1ExamFinishReceptive(); return; }
        b1ExamShowHoerenItem();
        return;
    }
    var item = items[b1ExamItemIdx];
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('🎧 Hören (B1)', 'Teil ' + (b1ExamTeilIdx + 1) + ' · Frage ' + (b1ExamItemIdx + 1) + ' / ' + items.length) +
            '<div class="exam-question">' +
                '<div class="exam-audio-loading" id="exam-audio-loading">⏳ Audio wird geladen…</div>' +
                '<audio id="exam-audio" controls class="exam-audio hidden"></audio>' +
                '<div class="exam-question-text">' + item.question + '</div>' +
                '<div class="exam-options" id="b1-exam-options"></div>' +
            '</div>' +
        '</div>';

    examTtsToBlob(item.audioText, b1SafeVoice(item.speakers && item.speakers[0]), function(res) {
        if (res.error) { examShowError(res.error); return; }
        var audioEl = document.getElementById('exam-audio');
        var loadingEl = document.getElementById('exam-audio-loading');
        if (audioEl) { audioEl.src = res.url; audioEl.classList.remove('hidden'); examActiveAudio = audioEl; }
        if (loadingEl) loadingEl.style.display = 'none';
    });

    b1RenderOptions(item, function(idx) {
        var audioEl = document.getElementById('exam-audio');
        if (audioEl) audioEl.pause();
        b1ExamAnswerReceptive(idx, item);
    });
}

function b1ExamShowLesenItem() {
    var teil = b1ExamTeilResults[b1ExamTeilIdx];
    var items = (teil && teil.items) || [];
    if (b1ExamItemIdx >= items.length) {
        b1ExamTeilIdx++; b1ExamItemIdx = 0;
        if (b1ExamTeilIdx >= b1ExamTeilResults.length) { b1ExamFinishReceptive(); return; }
        b1ExamShowLesenItem();
        return;
    }
    var item = items[b1ExamItemIdx];
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('📖 Lesen (B1)', 'Teil ' + (b1ExamTeilIdx + 1) + ' · Frage ' + (b1ExamItemIdx + 1) + ' / ' + items.length) +
            '<div class="exam-question">' +
                '<div class="exam-reading-text">' + ((teil.text || '').replace(/\n/g, '<br>')) + '</div>' +
                '<div class="exam-question-text">' + item.question + '</div>' +
                '<div class="exam-options" id="b1-exam-options"></div>' +
            '</div>' +
        '</div>';

    b1RenderOptions(item, function(idx) { b1ExamAnswerReceptive(idx, item); });
}

var B1_TTS_VOICES = ['nova', 'shimmer', 'echo', 'onyx', 'fable', 'alloy', 'ash', 'sage', 'coral'];

function b1SafeVoice(v) {
    // The model doesn't always stick to the enum the prompt asks for
    // (has returned descriptive speaker names instead of a real voice id) --
    // fall back to a safe default rather than let the TTS call fail.
    return B1_TTS_VOICES.indexOf(v) !== -1 ? v : 'nova';
}

function b1StripOptionPrefix(text) {
    // The model sometimes echoes its own "A) "/"B. " label inside the option
    // text despite the prompt not asking for it -- strip it so our own
    // letter prefix below is never doubled up.
    return String(text).replace(/^\s*[A-Ca-c][).:]\s*/, '');
}

function b1RenderOptions(item, onPick) {
    var optsEl = document.getElementById('b1-exam-options');
    item.options.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        btn.className = 'exam-option';
        btn.textContent = String.fromCharCode(65 + idx) + ') ' + b1StripOptionPrefix(opt);
        btn.addEventListener('click', function() { onPick(idx); });
        optsEl.appendChild(btn);
    });
}

function b1ExamAnswerReceptive(idx, item) {
    if (!b1ExamAnswers[b1ExamTeilIdx]) b1ExamAnswers[b1ExamTeilIdx] = [];
    var isCorrect = idx === item.answer;
    b1ExamAnswers[b1ExamTeilIdx].push(isCorrect);
    if (!isCorrect) {
        b1ExamWrongList.push({
            teil: b1ExamTeilIdx + 1,
            question: item.question,
            userAnswer: String.fromCharCode(65 + idx) + ') ' + b1StripOptionPrefix(item.options[idx]),
            correctAnswer: String.fromCharCode(65 + item.answer) + ') ' + b1StripOptionPrefix(item.options[item.answer])
        });
    }
    b1ExamItemIdx++;
    if (b1ExamModule === 'hoeren') b1ExamShowHoerenItem();
    else b1ExamShowLesenItem();
}

function b1ExamFinishReceptive() {
    var correct = 0, total = 0;
    b1ExamAnswers.forEach(function(teilAnswers) {
        (teilAnswers || []).forEach(function(a) { total++; if (a) correct++; });
    });
    var pct = total ? Math.round((correct / total) * 100) : 0;
    examShowResults(examCurrentSection, pct, null, b1ExamWrongList);
}

// ── Productive (Schreiben / Sprechen): AI-graded ────────────────────────

function b1ExamShowCurrentProductive() {
    if (b1ExamModule === 'schreiben') b1ExamShowSchreibenTeil();
    else b1ExamShowSprechenTeil();
}

function b1ExamShowSchreibenTeil() {
    var teile = b1ExamActiveTeile();
    var teilMeta = teile[b1ExamTeilIdx];
    if (!teilMeta) { b1ExamFinishSchreiben(); return; }
    var task = b1ExamTeilResults[b1ExamTeilIdx] || {};
    var points = (task.inhaltspunkte || []).map(function(p) { return '<li>' + p + '</li>'; }).join('');
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('✍️ Schreiben (B1)', 'Aufgabe ' + teilMeta.n + ' · ' + teilMeta.points + ' Punkte') +
            '<div class="exam-question">' +
                '<div class="exam-scenario-banner">📝 ' + (task.situation || '') + '</div>' +
                '<ul class="exam-inhaltspunkte">' + points + '</ul>' +
                '<div class="exam-min-words">Ziel: ' + (task.wordTarget || teilMeta.words) + ' Wörter</div>' +
                '<textarea class="exam-textarea" id="b1-schreiben-input" rows="8" placeholder="Hier schreiben…"></textarea>' +
                '<button class="btn btn-primary exam-next-btn" onclick="b1ExamSubmitSchreiben()">Abgeben & Bewerten</button>' +
            '</div>' +
        '</div>';
}

function b1ExamSubmitSchreiben() {
    var text = document.getElementById('b1-schreiben-input').value.trim();
    var teile = b1ExamActiveTeile();
    var teilMeta = teile[b1ExamTeilIdx];
    var task = b1ExamTeilResults[b1ExamTeilIdx] || {};
    b1ExamAnswers[b1ExamTeilIdx] = { text: text };

    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Wird bewertet…', 'AI is grading your writing');

    var prompt = b1FillPrompt(B1_EXAM_PROMPTS.schreiben_grade, {
        task: task.situation || '',
        points: (task.inhaltspunkte || []).join('; '),
        text: text,
        max: teilMeta.points
    });
    examChatJson(prompt, 900, function(res) {
        if (res.error) { examShowError(res.error); return; }
        b1ExamGrades[b1ExamTeilIdx] = res.data;
        b1ExamTeilIdx++;
        b1ExamGenerateOneTeil(b1ExamTeilIdx, b1ExamShowSchreibenTeil);
    });
}

function b1ExamFinishSchreiben() {
    var earned = 0, max = 0;
    var feedback = [];
    b1ExamActiveTeile().forEach(function(teilMeta, i) {
        var grade = b1ExamGrades[i];
        if (!grade) return;
        earned += grade.total || 0;
        max += grade.maxTotal || teilMeta.points;
        var errs = (grade.topErrors || []).map(function(e) { return e.error; }).join('; ');
        feedback.push('Aufgabe ' + teilMeta.n + ': ' + (grade.total || 0) + '/' + (grade.maxTotal || teilMeta.points) + (errs ? ' — ' + errs : ''));
    });
    var pct = max ? Math.round((earned / max) * 100) : 0;
    examShowResults(examCurrentSection, pct, feedback.join('\n'), null);
}

function b1ExamShowSprechenTeil() {
    var teile = b1ExamActiveTeile();
    var teilMeta = teile[b1ExamTeilIdx];
    if (!teilMeta) { b1ExamFinishSprechen(); return; }
    if (!examRecognition) {
        examShowError('Speech recognition not available on this device. Please use a recent Safari (iOS) or Chrome browser.');
        return;
    }
    var task = b1ExamTeilResults[b1ExamTeilIdx] || {};
    var points = (task.stichpunkte || []).map(function(p) { return '<li>' + p + '</li>'; }).join('');
    var container = document.getElementById('exam-content');
    container.innerHTML =
        '<div class="exam-active">' +
            examActiveHeader('🗣️ Sprechen (B1)', 'Teil ' + teilMeta.n + ' · ' + teilMeta.points + ' Punkte') +
            '<div class="exam-question">' +
                '<div class="exam-scenario-banner">📌 ' + (task.aufgabe || '') + '</div>' +
                '<ul class="exam-inhaltspunkte">' + points + '</ul>' +
                (task.partnerOpener ? '<div class="exam-sprechen-prompt">Partner: „' + task.partnerOpener + '"</div>' : '') +
                examMicArea() +
            '</div>' +
        '</div>';
    b1ExamStartListen();
}

function b1ExamStartListen() {
    var oldOnResult = examRecognition.onresult;
    var oldOnError = examRecognition.onerror;
    examRecognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        examRecognition.onresult = oldOnResult;
        examRecognition.onerror = oldOnError;
        b1ExamHandleSprechenAnswer(transcript);
    };
    examRecognition.onerror = function(e) {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        examRecognition.onresult = oldOnResult;
        examRecognition.onerror = oldOnError;
        b1ExamHandleSprechenAnswer('(could not transcribe)');
    };
    try { examRecognition.start(); } catch (e) {}
}

function b1ExamHandleSprechenAnswer(transcript) {
    var teile = b1ExamActiveTeile();
    var teilMeta = teile[b1ExamTeilIdx];
    var task = b1ExamTeilResults[b1ExamTeilIdx] || {};
    b1ExamAnswers[b1ExamTeilIdx] = { transcript: transcript };

    var container = document.getElementById('exam-content');
    container.innerHTML = examLoadingHtml('Wird bewertet…', 'AI is grading your speaking');

    var prompt = b1FillPrompt(B1_EXAM_PROMPTS.sprechen_grade, { task: task.aufgabe || '', transcript: transcript });
    examChatJson(prompt, 700, function(res) {
        if (res.error) { examShowError(res.error); return; }
        b1ExamGrades[b1ExamTeilIdx] = res.data;
        b1ExamTeilIdx++;
        b1ExamGenerateOneTeil(b1ExamTeilIdx, b1ExamShowSprechenTeil);
    });
}

function b1ExamFinishSprechen() {
    var teile = b1ExamActiveTeile();
    var earned = 0;
    var aussprache = [];
    var feedback = [];
    teile.forEach(function(teilMeta, i) {
        var grade = b1ExamGrades[i];
        if (!grade) return;
        var share = (grade.total || 0) / (grade.maxTotal || 100);
        earned += share * teilMeta.points;
        if (typeof grade.aussprache === 'number') aussprache.push(grade.aussprache);
        feedback.push('Teil ' + teilMeta.n + ': ' + (grade.feedback || ''));
    });
    var pronunciationSlot = B1_EXAM_SECTIONS.sprechen.teile.filter(function(t) { return t.n === 0; })[0];
    if (pronunciationSlot && aussprache.length) {
        var avg = aussprache.reduce(function(a, b) { return a + b; }, 0) / aussprache.length;
        // aussprache is graded on the same 0-100-ish scale as the other criteria in
        // sprechen_grade's response; treat it as a percentage of this slot's points.
        earned += (avg / 100) * pronunciationSlot.points;
    }
    var pct = Math.round(earned);
    examShowResults(examCurrentSection, pct, feedback.join('\n'), null);
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
