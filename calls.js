// calls.js — Conversation Practice Scenarios + Logic
// Depends on: app.js (for stopHFListening, speechSynthesis patterns)

var CALLS_SCENARIOS = [
  {
    id: 'restaurant',
    emoji: '🍽️',
    title: 'Einen Tisch reservieren',
    goalEn: 'Book a table for 2 people this Saturday at 7pm',
    type: 'phone',
    role: 'a friendly restaurant host at a German restaurant',
    firstLine: 'Guten Tag, Restaurant Zur Linde, was kann ich für Sie tun?'
  },
  {
    id: 'hotel',
    emoji: '🏨',
    title: 'Ein Hotelzimmer buchen',
    goalEn: 'Book a single room for 3 nights from next Monday',
    type: 'phone',
    role: 'a hotel receptionist at a small German hotel',
    firstLine: 'Guten Tag, Hotel Bergblick, wie kann ich Ihnen helfen?'
  },
  {
    id: 'arzt',
    emoji: '🩺',
    title: 'Einen Arzttermin machen',
    goalEn: 'Make a doctor\'s appointment for a sore throat, as soon as possible',
    type: 'phone',
    role: 'a medical receptionist at a German doctor\'s practice (Arztpraxis)',
    firstLine: 'Praxis Dr. Müller, guten Tag, was kann ich für Sie tun?'
  },
  {
    id: 'krank',
    emoji: '🤒',
    title: 'Sich krankmelden',
    goalEn: 'Call in sick to your boss — you have a fever and can\'t come in today',
    type: 'phone',
    role: 'a friendly German boss or office colleague',
    firstLine: 'Hallo?'
  },
  {
    id: 'taxi',
    emoji: '🚕',
    title: 'Ein Taxi bestellen',
    goalEn: 'Order a taxi to the train station for 8am tomorrow',
    type: 'phone',
    role: 'a taxi dispatcher at a German taxi company',
    firstLine: 'Taxizentrale, guten Tag!'
  },
  {
    id: 'wohnung',
    emoji: '🏠',
    title: 'Eine Wohnung anfragen',
    goalEn: 'Enquire about a 2-room flat you saw advertised — ask about price and when you can view it',
    type: 'phone',
    role: 'a German landlord who has a flat to rent',
    firstLine: 'Hallo?'
  },
  {
    id: 'kurs',
    emoji: '📚',
    title: 'Einen Kurs anmelden',
    goalEn: 'Register for a German language course starting next month',
    type: 'phone',
    role: 'a receptionist at a German language school (Sprachschule)',
    firstLine: 'Sprachschule Berlin, guten Tag, wie kann ich helfen?'
  },
  {
    id: 'absagen',
    emoji: '❌',
    title: 'Einen Termin absagen',
    goalEn: 'Cancel a dentist appointment and reschedule for next week',
    type: 'phone',
    role: 'a receptionist at a German dentist\'s practice',
    firstLine: 'Zahnarztpraxis Schmidt, guten Tag!'
  },
  {
    id: 'fundburo',
    emoji: '🧳',
    title: 'Fundbüro anrufen',
    goalEn: 'Report a lost bag at the train station — describe it and ask if it was found',
    type: 'phone',
    role: 'a helpful staff member at a German lost and found office (Fundbüro)',
    firstLine: 'Fundbüro Hauptbahnhof, guten Tag!'
  },
  {
    id: 'supermarkt',
    emoji: '🛒',
    title: 'Im Supermarkt anrufen',
    goalEn: 'Call a supermarket to ask if they have a specific product and what the opening hours are',
    type: 'phone',
    role: 'a friendly supermarket employee in Germany',
    firstLine: 'REWE Markt, hallo!'
  },
  {
    id: 'erzieherin',
    emoji: '👩‍🏫',
    title: 'Gespräch mit der Erzieherin',
    goalEn: 'Talk to your child\'s kindergarten teacher about how your child is doing',
    type: 'face',
    role: 'a warm kindergarten teacher (Erzieherin) in Germany',
    firstLine: 'Guten Morgen! Wie geht es Ihnen heute?'
  },
  {
    id: 'kinder',
    emoji: '🧒',
    title: 'Gespräch mit Kindergartenkindern',
    goalEn: 'Chat with a group of 5-year-olds at kindergarten — ask about their favourite things',
    type: 'face',
    role: 'a curious and enthusiastic 5-year-old German child at kindergarten. Use very simple German, short sentences, childlike vocabulary. Be playful and ask back.',
    firstLine: 'Hallo! Wie heißt du?'
  },
  {
    id: 'eltern',
    emoji: '👪',
    title: 'Gespräch mit anderen Eltern',
    goalEn: 'Make small talk with another parent at kindergarten drop-off',
    type: 'face',
    role: 'a friendly German parent at a kindergarten',
    firstLine: 'Guten Morgen! Ihr Kind ist auch neu hier, oder?'
  }
];

// ── Calls State ────────────────────────────────────────────────
var callsCurrentScenario = null;    // active scenario object
var callsConversation = [];         // [{role, content}] for OpenAI
var callsRecognition = null;        // SpeechRecognition instance
var callsListening = false;
var callsEnded = false;
var callsSelectedVoice = null;      // best German TTS voice found on device

function initCalls() {
    // Pick the best German TTS voice available
    function pickBestGermanVoice() {
        var voices = window.speechSynthesis.getVoices();
        if (!voices.length) return;
        // Priority: Enhanced > Premium > female name 'Anna' (iOS) > any de-DE > any de-*
        var tiers = [
            function(v) { return v.lang === 'de-DE' && /enhanced/i.test(v.name); },
            function(v) { return v.lang === 'de-DE' && /premium/i.test(v.name); },
            function(v) { return v.lang === 'de-DE' && /anna/i.test(v.name); },
            function(v) { return v.lang === 'de-DE'; },
            function(v) { return v.lang.startsWith('de'); }
        ];
        for (var i = 0; i < tiers.length; i++) {
            var found = voices.filter(tiers[i]);
            if (found.length) { callsSelectedVoice = found[0]; return; }
        }
    }

    pickBestGermanVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = pickBestGermanVoice;
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        callsRecognition = new SpeechRecognition();
        callsRecognition.continuous = false;
        callsRecognition.interimResults = false;
        callsRecognition.lang = 'de-DE';

        callsRecognition.onresult = function(event) {
            var transcript = event.results[0][0].transcript;
            callsHandleUserSpeech(transcript);
        };

        callsRecognition.onerror = function(e) {
            if (e.error === 'no-speech' || e.error === 'aborted') return;
            callsListening = false;
            // Show speak button so user can retry manually
            var speakBtn = document.getElementById('calls-speak-btn');
            var micEl = document.getElementById('calls-mic-indicator');
            if (micEl) micEl.classList.add('hidden');
            if (speakBtn) speakBtn.classList.remove('hidden');
        };

        callsRecognition.onend = function() {
            callsListening = false;
        };
    }

    renderCallsScreen();
}

function callsGetApiKey() {
    return localStorage.getItem('openai_api_key') || '';
}

function callsSaveApiKey(key) {
    localStorage.setItem('openai_api_key', key.trim());
}

function callsGetCompletedCount() {
    return parseInt(localStorage.getItem('calls_completed') || '0', 10);
}

function callsIncrementCompleted() {
    localStorage.setItem('calls_completed', callsGetCompletedCount() + 1);
}

function callsDifficultyInstructions() {
    var n = callsGetCompletedCount();
    if (n <= 3) return 'Speak slowly and clearly. If the user makes a grammar mistake, understand them anyway and keep the conversation going. Use only simple A1 vocabulary.';
    if (n <= 8) return 'Speak at a natural pace. Occasionally ask the user to repeat if something is unclear. Use A1-A2 vocabulary.';
    return 'Speak naturally. Do not simplify your language. If you do not understand, say so in German. Use natural conversational German.';
}

// ── Screen Rendering ───────────────────────────────────────────

function renderCallsScreen() {
    var container = document.getElementById('calls-content');
    if (!container) return;

    if (!callsGetApiKey()) {
        renderCallsApiKeySetup(container);
    } else {
        renderCallsScenarioList(container);
    }
}

function renderCallsApiKeySetup(container) {
    container.innerHTML =
        '<div class="calls-setup">' +
          '<div class="calls-setup-icon">🔑</div>' +
          '<h2 class="calls-setup-title">OpenAI API Key</h2>' +
          '<p class="calls-setup-desc">Your key is stored only on this device. Get one at <strong>platform.openai.com</strong></p>' +
          '<input type="password" id="calls-api-input" class="calls-api-input" placeholder="sk-..." autocomplete="off">' +
          '<button class="btn btn-primary calls-setup-btn" onclick="callsSubmitApiKey()">Save & Continue</button>' +
        '</div>';
}

function callsSubmitApiKey() {
    var val = document.getElementById('calls-api-input').value.trim();
    if (!val.startsWith('sk-')) {
        alert('Please enter a valid OpenAI API key (starts with sk-)');
        return;
    }
    callsSaveApiKey(val);
    renderCallsScenarioList(document.getElementById('calls-content'));
}

function renderCallsScenarioList(container) {
    var html = '<div class="calls-list-header">' +
        '<p class="calls-list-subtitle">13 Goethe A1 scenarios · Tap to start</p>' +
        '<button class="calls-settings-btn" onclick="callsShowSettings()" title="API Key Settings">⚙️</button>' +
    '</div>';

    html += '<div class="calls-scenarios">';
    CALLS_SCENARIOS.forEach(function(s) {
        var typeIcon = s.type === 'phone' ? '📞' : '💬';
        html += '<div class="calls-scenario-card" onclick="callsStartScenario(\'' + s.id + '\')">' +
            '<div class="calls-scenario-emoji">' + s.emoji + '</div>' +
            '<div class="calls-scenario-info">' +
                '<div class="calls-scenario-title">' + s.title + '</div>' +
                '<div class="calls-scenario-goal">' + typeIcon + ' ' + s.goalEn + '</div>' +
            '</div>' +
            '<div class="calls-scenario-arrow">›</div>' +
        '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
}

function callsShowSettings() {
    var container = document.getElementById('calls-content');
    container.innerHTML =
        '<div class="calls-setup">' +
          '<div class="calls-setup-icon">⚙️</div>' +
          '<h2 class="calls-setup-title">Change API Key</h2>' +
          '<input type="password" id="calls-api-input" class="calls-api-input" placeholder="sk-..." autocomplete="off">' +
          '<button class="btn btn-primary calls-setup-btn" onclick="callsSubmitApiKey()">Save</button>' +
          '<button class="btn calls-cancel-btn" onclick="renderCallsScenarioList(document.getElementById(\'calls-content\'))">Cancel</button>' +
        '</div>';
}

// ── Active Call ────────────────────────────────────────────────

function callsStartScenario(scenarioId) {
    callsCurrentScenario = CALLS_SCENARIOS.find(function(s) { return s.id === scenarioId; });
    if (!callsCurrentScenario) return;

    callsConversation = [];
    callsEnded = false;

    var container = document.getElementById('calls-content');
    var typeIcon = callsCurrentScenario.type === 'phone' ? '📞' : '💬';

    container.innerHTML =
        '<div class="calls-active">' +
            '<div class="calls-active-header">' +
                '<button class="calls-hangup-btn" onclick="callsHangUp()">⛔ Hang Up</button>' +
                '<div class="calls-active-title">' + typeIcon + ' ' + callsCurrentScenario.title + '</div>' +
            '</div>' +
            '<div class="calls-goal-banner">🎯 ' + callsCurrentScenario.goalEn + '</div>' +
            '<div class="calls-transcript" id="calls-transcript"></div>' +
            '<div class="calls-mic-area" id="calls-mic-area">' +
                '<div class="calls-mic-indicator hidden" id="calls-mic-indicator">' +
                    '<div class="calls-mic-pulse"></div>' +
                    '<span id="calls-mic-status">Listening…</span>' +
                '</div>' +
                '<button class="calls-speak-btn" id="calls-speak-btn" onclick="callsStartListening()" disabled>⏳ AI speaking…</button>' +
            '</div>' +
        '</div>';

    // AI speaks first
    callsAddBubble('ai', callsCurrentScenario.firstLine, '');
    callsConversation.push({ role: 'assistant', content: callsCurrentScenario.firstLine });
    callsSpeakAI(callsCurrentScenario.firstLine, function() {
        callsStartListening();
    });
}

function callsAddBubble(speaker, de, en) {
    var transcript = document.getElementById('calls-transcript');
    if (!transcript) return;

    var bubble = document.createElement('div');
    bubble.className = 'calls-bubble calls-bubble-' + speaker;

    var deDiv = document.createElement('div');
    deDiv.className = 'calls-bubble-de';
    deDiv.textContent = de;

    bubble.appendChild(deDiv);

    if (en) {
        var enDiv = document.createElement('div');
        enDiv.className = 'calls-bubble-en';
        enDiv.textContent = en;
        bubble.appendChild(enDiv);
        bubble.addEventListener('click', function() {
            bubble.classList.toggle('show-translation');
        });
    }

    transcript.appendChild(bubble);
    transcript.scrollTop = transcript.scrollHeight;
}

function callsSetMicStatus(text) {
    var el = document.getElementById('calls-mic-status');
    if (el) el.textContent = text;
}

function callsSpeakAI(text, onDone) {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    u.rate = 0.88;
    u.pitch = 1.05;
    if (callsSelectedVoice) u.voice = callsSelectedVoice;

    // Guard: fire onDone only once (onend unreliable on iOS)
    var fired = false;
    var done = function() {
        if (!fired) {
            fired = true;
            if (onDone) onDone();
        }
    };
    u.onend = done;
    u.onerror = done;

    // Fallback timeout: ~75ms per character + 1s buffer
    var fallbackMs = Math.max(2500, text.length * 75 + 1000);
    setTimeout(done, fallbackMs);

    window.speechSynthesis.speak(u);
}

function callsStartListening() {
    if (callsEnded) return;

    var micEl = document.getElementById('calls-mic-indicator');
    var speakBtn = document.getElementById('calls-speak-btn');

    if (!callsRecognition) {
        // No speech recognition — show speak button as manual fallback (shouldn't be needed on HTTPS)
        if (speakBtn) { speakBtn.textContent = '🎤 Tap to Speak'; speakBtn.disabled = false; }
        return;
    }

    // Show mic indicator, hide/disable speak button
    if (micEl) micEl.classList.remove('hidden');
    if (speakBtn) speakBtn.classList.add('hidden');
    callsSetMicStatus('Listening…');

    try {
        callsRecognition.start();
        callsListening = true;
    } catch(e) {
        // Already started — that's fine
    }
}

function callsHangUp() {
    callsEnded = true;
    window.speechSynthesis.cancel();
    if (callsRecognition) { try { callsRecognition.stop(); } catch(e) {} }
    callsShowFeedback();
}

function callsStopAll() {
    callsEnded = true;
    window.speechSynthesis.cancel();
    if (callsRecognition) { try { callsRecognition.stop(); } catch(e) {} }
    callsListening = false;
}

// ── OpenAI Integration ─────────────────────────────────────────

function callsHandleUserSpeech(transcript) {
    if (callsEnded) return;

    var micEl = document.getElementById('calls-mic-indicator');
    if (micEl) micEl.classList.add('hidden');

    callsAddBubble('user', transcript, '');
    callsConversation.push({ role: 'user', content: transcript });
    callsSetMicStatus('Thinking…');

    callsSendToOpenAI(transcript);
}

function callsBuildSystemPrompt() {
    var s = callsCurrentScenario;
    return 'You are playing the role of ' + s.role + ' in Germany. ' +
        'This is a spoken German practice conversation for an A1/A2 learner. ' +
        'Rules:\n' +
        '- Speak ONLY German\n' +
        '- Keep each response to 1-3 short sentences maximum\n' +
        '- ' + callsDifficultyInstructions() + '\n' +
        '- When the conversation goal is achieved, end naturally with a polite goodbye\n' +
        '- Scenario goal for the user: ' + s.goalEn;
}

function callsSendToOpenAI(userText) {
    var apiKey = callsGetApiKey();
    var messages = [{ role: 'system', content: callsBuildSystemPrompt() }]
        .concat(callsConversation);

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 120,
            temperature: 0.7
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (callsEnded) return;
        if (data.error) {
            callsShowError(data.error.message);
            return;
        }
        var reply = data.choices[0].message.content.trim();
        callsConversation.push({ role: 'assistant', content: reply });
        callsAddBubble('ai', reply, '');

        // Show "AI speaking" state on button while TTS plays
        var speakBtn = document.getElementById('calls-speak-btn');
        var micEl = document.getElementById('calls-mic-indicator');
        if (speakBtn) { speakBtn.classList.remove('hidden'); speakBtn.textContent = '⏳ AI speaking…'; speakBtn.disabled = true; }
        if (micEl) micEl.classList.add('hidden');

        // Detect natural end (Tschüss / Auf Wiedersehen / Auf Wiederhören)
        var endWords = ['tschüss', 'auf wiedersehen', 'auf wiederhören', 'tschau', 'ciao'];
        var replyLower = reply.toLowerCase();
        var isEnd = endWords.some(function(w) { return replyLower.indexOf(w) !== -1; });

        callsSpeakAI(reply, function() {
            if (isEnd || callsEnded) {
                callsEnded = true;
                setTimeout(callsShowFeedback, 800);
            } else {
                callsStartListening();
            }
        });
    })
    .catch(function(err) {
        callsShowError('Network error. Check your connection.');
    });
}

function callsShowError(msg) {
    var transcript = document.getElementById('calls-transcript');
    if (!transcript) return;
    var errDiv = document.createElement('div');
    errDiv.className = 'calls-error';
    errDiv.textContent = '⚠️ ' + msg;
    transcript.appendChild(errDiv);
    transcript.scrollTop = transcript.scrollHeight;

    // Show manual speak button as fallback
    var speakBtn = document.getElementById('calls-speak-btn');
    if (speakBtn) speakBtn.classList.remove('hidden');
}

// ── Feedback ───────────────────────────────────────────────────

function callsShowFeedback() {
    callsStopAll();
    callsIncrementCompleted();

    var container = document.getElementById('calls-content');
    container.innerHTML =
        '<div class="calls-feedback">' +
            '<div class="calls-feedback-header">📊 Feedback</div>' +
            '<div class="calls-feedback-loading" id="calls-feedback-body">' +
                '<div class="calls-spinner"></div>' +
                '<p>Analysing your conversation…</p>' +
            '</div>' +
            '<div class="calls-feedback-actions">' +
                '<button class="btn btn-primary" onclick="callsStartScenario(\'' + callsCurrentScenario.id + '\')">Try Again</button>' +
                '<button class="btn" onclick="renderCallsScenarioList(document.getElementById(\'calls-content\'))">All Scenarios</button>' +
            '</div>' +
        '</div>';

    callsRequestFeedback();
}

function callsRequestFeedback() {
    var apiKey = callsGetApiKey();

    // Build transcript string for feedback prompt
    var transcriptText = callsConversation.map(function(m) {
        var label = m.role === 'user' ? '[USER]' : '[AI]';
        return label + ': ' + m.content;
    }).join('\n');

    var feedbackPrompt = 'The following is a German A1 practice conversation. The user\'s lines are marked [USER].\n\n' +
        transcriptText + '\n\n' +
        'Give feedback in English. Return ONLY valid JSON with this exact structure:\n' +
        '{ "mistakes": [{"error": "...", "correction": "..."}], ' +
        '"phrases": [{"said": "...", "better": "..."}], ' +
        '"vocab": [{"de": "...", "en": "..."}] }\n' +
        'Include exactly 3 mistakes, 3 better phrases, and 5 vocabulary words. ' +
        'If the user made fewer than 3 mistakes, note what they did well instead.';

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: feedbackPrompt }],
            max_tokens: 600,
            temperature: 0.3
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.error) { callsRenderFeedbackError(data.error.message); return; }
        var raw = data.choices[0].message.content.trim();
        // Strip markdown code fences if present
        raw = raw.replace(/^```json\s*/,'').replace(/\s*```$/,'');
        try {
            var fb = JSON.parse(raw);
            callsRenderFeedback(fb);
        } catch(e) {
            callsRenderFeedbackError('Could not parse feedback. Raw: ' + raw);
        }
    })
    .catch(function() {
        callsRenderFeedbackError('Network error fetching feedback.');
    });
}

function callsRenderFeedback(fb) {
    var body = document.getElementById('calls-feedback-body');
    if (!body) return;

    var html = '';

    html += '<div class="calls-fb-section calls-fb-mistakes">' +
        '<div class="calls-fb-title">❌ Mistakes & Corrections</div>';
    (fb.mistakes || []).forEach(function(m) {
        html += '<div class="calls-fb-item">' +
            '<span class="calls-fb-wrong">' + m.error + '</span>' +
            '<span class="calls-fb-arrow"> → </span>' +
            '<span class="calls-fb-right">' + m.correction + '</span>' +
        '</div>';
    });
    html += '</div>';

    html += '<div class="calls-fb-section calls-fb-phrases">' +
        '<div class="calls-fb-title">💡 Better Phrases</div>';
    (fb.phrases || []).forEach(function(p) {
        html += '<div class="calls-fb-item">' +
            '<span class="calls-fb-said">"' + p.said + '"</span>' +
            '<span class="calls-fb-arrow"> → </span>' +
            '<span class="calls-fb-better">"' + p.better + '"</span>' +
        '</div>';
    });
    html += '</div>';

    html += '<div class="calls-fb-section calls-fb-vocab">' +
        '<div class="calls-fb-title">📚 Vocabulary</div>';
    (fb.vocab || []).forEach(function(v) {
        html += '<div class="calls-fb-item">' +
            '<span class="calls-fb-de">' + v.de + '</span>' +
            '<span class="calls-fb-arrow"> — </span>' +
            '<span class="calls-fb-en">' + v.en + '</span>' +
        '</div>';
    });
    html += '</div>';

    body.innerHTML = html;
}

function callsRenderFeedbackError(msg) {
    var body = document.getElementById('calls-feedback-body');
    if (body) body.innerHTML = '<p class="calls-error">⚠️ ' + msg + '</p>';
}
