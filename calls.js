// calls.js — the Speak tab: AI role-play conversations with spoken (or typed)
// answers and feedback afterwards. A1-A2 scenarios live here, B1 ones in
// b1-calls.js. Loaded via <script> tag. ES5 only.

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

// ALL_CALLS_SCENARIOS (CALLS_SCENARIOS + B1_CALLS_SCENARIOS) is defined in
// app.js, which loads after b1-calls.js; callsAllScenarios() falls back to
// building the same list if it is missing.

var CALLS_DONE_KEY = 'calls_done';
var CALLS_B1_WORDS = 300;           // learned words at which the AI switches to B1 German
var CALLS_URL = 'https://api.openai.com/v1/chat/completions';

// ── Calls State ────────────────────────────────────────────────
var callsCurrentScenario = null;    // scenario of the active (or last) call
var callsConversation = [];         // [{role, content}] for OpenAI
var callsRecognition = null;        // SpeechRecognition of the current listen, if any
var callsSRCtor = null;             // SpeechRecognition constructor; null = typed answers only
var callsListening = false;
var callsEnded = true;
var callsCallId = 0;                // bumped on every start/stop: stale async callbacks compare against it
var callsFinishedId = -1;           // call whose feedback was already shown (guards double counting)
var callsUtterSeq = 0;
var callsTtsTimer = null;
var callsTtsActive = false;
var callsFetchAbort = null;
var callsTurn = 'idle';             // 'ai' | 'listening' | 'thinking' | 'user' | 'idle'
var callsTyping = false;            // typed-answer box open
var callsTapToListen = false;       // iOS refused to start the mic by itself after the AI spoke: tap 🎤
var callsView = 'list';             // 'setup' | 'list' | 'settings' | 'call' | 'feedback'
var callsListNotice = null;         // { text, at }
var callsLastCall = null;           // { scenario, conversation } of the finished call
var callsFeedbackSeq = 0;

// ── Helpers ────────────────────────────────────────────────────

function callsEsc(s) {
    if (typeof escapeHtml === 'function') return escapeHtml(s);
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function callsEl(id) { return document.getElementById(id); }

function callsContainer() { return document.getElementById('calls-content'); }

function callsAllScenarios() {
    if (typeof ALL_CALLS_SCENARIOS !== 'undefined') return ALL_CALLS_SCENARIOS;
    return CALLS_SCENARIOS.concat(typeof B1_CALLS_SCENARIOS !== 'undefined' ? B1_CALLS_SCENARIOS : []);
}

function callsFindScenario(id) {
    var all = callsAllScenarios();
    for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) return all[i];
    }
    return null;
}

function callsScenarioKind(s) {
    if (!s) return 'a1';
    if (/^sprechen_teil/.test(s.id || '') || /^Prüfung Sprechen/.test(s.title || '')) return 'exam';
    if (s.level === 'B1') return 'b1';
    if (typeof B1_CALLS_SCENARIOS !== 'undefined') {
        for (var i = 0; i < B1_CALLS_SCENARIOS.length; i++) {
            if (B1_CALLS_SCENARIOS[i].id === s.id) return 'b1';
        }
    }
    return 'a1';
}

function callsExamPart(s) {
    var m = /teil\s*_?(\d)/i.exec((s.id || '') + ' ' + (s.title || ''));
    return m ? m[1] : '';
}

function callsLearnedWords() {
    if (typeof wordStats === 'function') {
        try {
            var st = wordStats();
            if (st && typeof st.learnedEver === 'number') return st.learnedEver;
            if (st) return (st.learned || 0) + (st.mastered || 0);
        } catch (e) {}
    }
    if (typeof wordProgress === 'object' && wordProgress) {
        var n = 0;
        for (var k in wordProgress) {
            if (wordProgress[k] && wordProgress[k].level >= 3) n++;
        }
        return n;
    }
    return null;
}

function callsLearnerLevel() {
    var n = callsLearnedWords();
    var b1 = n !== null && n >= CALLS_B1_WORDS;
    return { b1: b1, label: b1 ? 'B1' : 'A1–A2', learned: n };
}

function callsIsLive() { return !!callsCurrentScenario && !callsEnded; }

function callsSetNotice(text) { callsListNotice = text ? { text: text, at: Date.now() } : null; }

function callsDismissNotice() {
    callsSetNotice('');
    var el = callsEl('calls-list-notice');
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

// ── Init / storage ─────────────────────────────────────────────

function initCalls() {
    // The German voice is picked for every line by speechSay (app.js): on
    // iOS getVoices() can stay empty and 'voiceschanged' may never fire.
    callsSRCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    document.addEventListener('visibilitychange', callsOnVisibility);
    renderCallsScreen();
}

// The Speech check found voice input off (app.js): calls start in typing mode.
function callsVoiceInputOff() {
    return typeof speechVoiceInputOff === 'function' && speechVoiceInputOff();
}

// iOS cuts off speech (app.js stops it) and the mic in the background: the
// call stays open, on the learner's turn.
function callsOnVisibility() {
    if (document.visibilityState !== 'hidden' || !callsIsLive()) return;
    if (callsTurn !== 'ai' && callsTurn !== 'listening') return;
    callsUtterSeq++;
    if (callsTtsTimer) { clearTimeout(callsTtsTimer); callsTtsTimer = null; }
    callsTtsActive = false;
    var rec = callsRecognition;
    callsRecognition = null;
    callsListening = false;
    if (rec) { try { if (rec.abort) rec.abort(); else rec.stop(); } catch (e) {} }
    callsShowUserTurn('Paused while the app was in the background. ' + (callsSRCtor ? 'Tap 🎤 to answer, or type.' : 'Type your answer.'));
}

function callsGetApiKey() {
    try { return localStorage.getItem('openai_api_key') || ''; } catch (e) { return ''; }
}

function callsSaveApiKey(key) {
    try { localStorage.setItem('openai_api_key', String(key).trim()); } catch (e) {}
}

function callsGetCompletedCount() {
    var n = 0;
    try { n = parseInt(localStorage.getItem('calls_completed') || '0', 10); } catch (e) {}
    return isNaN(n) ? 0 : n;
}

function callsIncrementCompleted() {
    try { localStorage.setItem('calls_completed', String(callsGetCompletedCount() + 1)); } catch (e) {}
}

function callsLoadDone() {
    try { return JSON.parse(localStorage.getItem(CALLS_DONE_KEY) || '{}') || {}; } catch (e) { return {}; }
}

function callsBumpDone(id) {
    var data = callsLoadDone();
    data[id] = (data[id] || 0) + 1;
    try { localStorage.setItem(CALLS_DONE_KEY, JSON.stringify(data)); } catch (e) {}
}

// ── Prompt level ───────────────────────────────────────────────

function callsDifficultyInstructions() {
    var n = callsGetCompletedCount();
    if (n <= 3) return 'Speak slowly and clearly. If the learner makes a grammar mistake, understand them anyway and keep the conversation going.';
    if (n <= 8) return 'Speak at a natural pace. Occasionally ask the learner to repeat or explain if something is unclear.';
    return 'Speak at a natural pace and do not simplify more than the level needs. If you do not understand, say so in German.';
}

function callsPaceLabel() {
    var n = callsGetCompletedCount();
    if (n <= 3) return 'slow and clear';
    if (n <= 8) return 'natural';
    return 'natural, no simplifying';
}

function callsLevelInstructions(s) {
    var kind = callsScenarioKind(s);
    var lvl = callsLearnerLevel();
    if (kind === 'exam') {
        var part = callsExamPart(s);
        return 'This is practice for the Goethe-Zertifikat B1 speaking exam' + (part ? ' (Sprechen Teil ' + part + ')' : '') +
            '. Behave exactly as in the real exam and use natural B1-level German, whatever the learner\'s current level.';
    }
    if (kind === 'b1') {
        return 'This is spoken German practice for a learner preparing for the Goethe-Zertifikat B1 exam (currently about ' + lvl.label + ' level). ' +
            'Use natural B1-level German: everyday vocabulary, subordinate clauses (weil, dass, obwohl, wenn) and opinions with reasons.' +
            (lvl.b1 ? '' : ' Speak clearly, and rephrase more simply if the learner struggles.');
    }
    if (lvl.b1) {
        return 'This is spoken German practice for a learner at about B1 level preparing for the Goethe-Zertifikat B1 exam. ' +
            'The situation is simple, but speak natural B1 German: use some subordinate clauses and ask follow-up questions that invite reasons and opinions.';
    }
    return 'This is spoken German practice for a learner at about A1–A2 level who is working towards the Goethe-Zertifikat B1 exam. ' +
        'Use simple A1–A2 German: short sentences and everyday words.';
}

function callsMaxTokens(kind) {
    return kind === 'exam' ? 320 : (kind === 'b1' ? 220 : 150);
}

function callsBuildSystemPrompt() {
    var s = callsCurrentScenario;
    var kind = callsScenarioKind(s);
    var role = String(s.role || '').replace(/\s*\.\s*$/, '');
    return 'You are playing the role of ' + role + '. The setting is Germany.\n' +
        callsLevelInstructions(s) + '\n' +
        'Rules:\n' +
        '- Speak ONLY German\n' +
        (kind === 'exam'
            ? '- Keep your turns as long as your role needs (usually 1-4 sentences) and never take over the learner\'s part\n' +
              '- Do not correct the learner during the task\n'
            : '- Keep each response to 1-3 sentences\n' +
              '- ' + callsDifficultyInstructions() + '\n') +
        '- When the goal is achieved, end naturally with a polite goodbye (for example "Auf Wiedersehen" or "Tschüss")\n' +
        '- Goal for the learner: ' + s.goalEn;
}

// ── Screen Rendering ───────────────────────────────────────────

function renderCallsScreen() {
    var container = callsContainer();
    if (!container) return;
    if (callsIsLive()) return;   // never wipe an active call
    if (!callsGetApiKey()) { renderCallsApiKeySetup(container); return; }
    if (callsView === 'feedback' || callsView === 'settings') return;
    renderCallsScenarioList(container);
}

// Tab lifecycle hooks, called by app.js switchTab.
function callsOnEnter(isReTap) {
    var container = callsContainer();
    if (!container || callsIsLive()) return;
    if (isReTap) {
        container.scrollTop = 0;
        var screen = callsEl('calls-screen');
        if (screen) screen.scrollTop = 0;
        return;
    }
    if (callsView === 'setup' && callsGetApiKey()) callsView = 'list';
    renderCallsScreen();
}

function callsOnLeave() {
    if (callsIsLive()) callsAbandon('Your call ended when you left Speak, so it wasn’t counted.');
    else callsHaltMedia();
    var a = document.activeElement;
    var c = callsContainer();
    if (a && c && c.contains(a) && a.blur) a.blur();
}

// Older callers (switchTab before the lifecycle hooks) call this on every switch.
function callsStopAll() {
    if (callsIsLive()) callsAbandon('Your call ended when you left Speak, so it wasn’t counted.');
    else callsHaltMedia();
}

function callsAbandon(notice) {
    callsEnded = true;
    callsCallId++;
    callsHaltMedia();
    callsTurn = 'idle';
    callsSetNotice(notice || '');
    var c = callsContainer();
    if (c) {
        if (callsGetApiKey()) renderCallsScenarioList(c);
        else renderCallsApiKeySetup(c);
    }
}

function renderCallsApiKeySetup(container) {
    container = container || callsContainer();
    if (!container) return;
    container.innerHTML =
        '<div class="calls-setup">' +
          '<div class="calls-setup-icon">🔑</div>' +
          '<h2 class="calls-setup-title">Speak needs an OpenAI API key</h2>' +
          '<p class="calls-setup-desc">An AI plays the other person in each role-play — including the three B1 Sprechen exam parts — and gives you feedback afterwards. ' +
            'It runs on your own OpenAI account (model gpt-4o-mini), so each call is billed there. Get a key at <strong>platform.openai.com</strong>. It is stored only on this device.</p>' +
          '<input type="password" id="calls-api-input" class="calls-api-input" placeholder="sk-..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">' +
          '<div class="calls-api-error hidden" id="calls-api-error"></div>' +
          '<button class="btn btn-primary calls-setup-btn" onclick="callsSubmitApiKey()">Save & Continue</button>' +
        '</div>';
    callsView = 'setup';
}

function callsSubmitApiKey() {
    var input = callsEl('calls-api-input');
    if (!input) return;
    var val = input.value.trim();
    if (val.indexOf('sk-') !== 0) {
        var err = callsEl('calls-api-error');
        if (err) {
            err.textContent = 'That doesn’t look like an OpenAI key — it should start with “sk-”.';
            err.classList.remove('hidden');
        }
        return;
    }
    callsSaveApiKey(val);
    renderCallsScenarioList(callsContainer());
}

function renderCallsScenarioList(container) {
    container = container || callsContainer();
    if (!container) return;
    var all = callsAllScenarios();
    var done = callsLoadDone();
    var lvl = callsLearnerLevel();
    var completed = callsGetCompletedCount();

    var html = '<div class="calls-list-header">' +
        '<p class="calls-list-subtitle">' + all.length + ' scenarios · tap one to start a call</p>' +
        '<button class="calls-settings-btn" onclick="callsShowSettings()" title="API key settings" aria-label="API key settings">⚙️</button>' +
    '</div>';
    html += '<div class="calls-list-level">AI speaks at <strong>' + callsEsc(lvl.label) + '</strong> level' +
        (lvl.learned !== null ? ' · ' + lvl.learned + ' words learned' + (lvl.b1 ? '' : ' (B1 from ' + CALLS_B1_WORDS + ')') : '') +
        ' · ' + completed + ' call' + (completed === 1 ? '' : 's') + ' done · pace: ' + callsPaceLabel() + '</div>';

    if (callsListNotice && Date.now() - callsListNotice.at < 30 * 60 * 1000) {
        html += '<div class="calls-list-notice" id="calls-list-notice"><span>' + callsEsc(callsListNotice.text) + '</span>' +
            '<button class="calls-notice-close" onclick="callsDismissNotice()" aria-label="Dismiss">×</button></div>';
    }

    var groups = [
        { title: 'B1 exam — Sprechen role-plays', note: 'Exam-style B1 German, whatever your current level.', items: [] },
        { title: 'B1 everyday situations', note: '', items: [] },
        { title: 'A1–A2 warm-ups', note: lvl.b1 ? 'Simple situations — the AI still speaks at your B1 level.' : '', items: [] }
    ];
    all.forEach(function(s) {
        var k = callsScenarioKind(s);
        groups[k === 'exam' ? 0 : (k === 'b1' ? 1 : 2)].items.push(s);
    });

    html += '<div class="calls-scenarios">';
    groups.forEach(function(g) {
        if (!g.items.length) return;
        html += '<div class="calls-group-header">' + callsEsc(g.title) + (g.note ? '<span class="calls-group-note">' + callsEsc(g.note) + '</span>' : '') + '</div>';
        g.items.forEach(function(s) {
            var n = done[s.id] || 0;
            html += '<div class="calls-scenario-card" role="button" data-id="' + callsEsc(s.id) + '" onclick="callsStartScenario(this.getAttribute(\'data-id\'))">' +
                '<div class="calls-scenario-emoji">' + callsEsc(s.emoji || '') + '</div>' +
                '<div class="calls-scenario-info">' +
                    '<div class="calls-scenario-title">' + callsEsc(s.title) + '</div>' +
                    '<div class="calls-scenario-goal">' + (s.type === 'phone' ? '📞' : '💬') + ' ' + callsEsc(s.goalEn) + '</div>' +
                '</div>' +
                (n ? '<div class="calls-scenario-done" title="Completed ' + n + '×">✓ ×' + n + '</div>' : '') +
                '<div class="calls-scenario-arrow">›</div>' +
            '</div>';
        });
    });
    html += '</div>';

    container.innerHTML = html;
    callsView = 'list';
}

// Shows the list scrolled to one scenario (for links from other tabs).
function callsShowScenario(id) {
    if (callsIsLive()) return;
    var container = callsContainer();
    if (!container) return;
    if (!callsGetApiKey()) { renderCallsApiKeySetup(container); return; }
    renderCallsScenarioList(container);
    var cards = container.querySelectorAll('.calls-scenario-card');
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute('data-id') !== id) continue;
        cards[i].classList.add('calls-scenario-highlight');
        if (cards[i].scrollIntoView) cards[i].scrollIntoView();
        return;
    }
}

function callsShowSettings() {
    if (callsIsLive()) callsAbandon('');
    var container = callsContainer();
    if (!container) return;
    var key = callsGetApiKey();
    container.innerHTML =
        '<div class="calls-setup">' +
          '<div class="calls-setup-icon">⚙️</div>' +
          '<h2 class="calls-setup-title">Change API key</h2>' +
          '<p class="calls-setup-desc">' + (key ? 'The saved key ends in …' + callsEsc(key.slice(-4)) + '. ' : '') +
            'Paste a new OpenAI key (it starts with “sk-”). It is stored only on this device.</p>' +
          '<input type="password" id="calls-api-input" class="calls-api-input" placeholder="sk-..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">' +
          '<div class="calls-api-error hidden" id="calls-api-error"></div>' +
          '<button class="btn btn-primary calls-setup-btn" onclick="callsSubmitApiKey()">Save</button>' +
          '<button class="btn calls-cancel-btn" onclick="callsCancelSettings()">Cancel</button>' +
        '</div>';
    callsView = 'settings';
}

function callsCancelSettings() {
    callsView = 'list';
    renderCallsScreen();
}

// ── Active Call ────────────────────────────────────────────────

function callsStartScenario(scenarioId) {
    var s = callsFindScenario(scenarioId);
    var container = callsContainer();
    if (!s || !container) return;
    if (!callsGetApiKey()) { renderCallsApiKeySetup(container); return; }
    if (callsIsLive()) { callsEnded = true; callsCallId++; callsHaltMedia(); }
    if (typeof tracksPauseAudio === 'function') tracksPauseAudio();

    callsSetNotice('');
    callsSRCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    callsCurrentScenario = s;
    callsConversation = [];
    callsEnded = false;
    callsCallId++;
    callsTyping = callsVoiceInputOff();
    callsView = 'call';

    var typeIcon = s.type === 'phone' ? '📞' : '💬';
    container.innerHTML =
        '<div class="calls-active">' +
            '<div class="calls-active-header">' +
                '<button class="calls-hangup-btn" onclick="callsHangUp()">⛔ Hang Up</button>' +
                '<div class="calls-active-title">' + typeIcon + ' ' + callsEsc(s.title) + '</div>' +
            '</div>' +
            '<div class="calls-goal-banner">🎯 ' + callsEsc(s.goalEn) + '</div>' +
            '<div class="calls-transcript" id="calls-transcript">' + callsSilentHintHtml() + '</div>' +
            '<div class="calls-mic-area" id="calls-mic-area">' +
                '<div class="calls-turn-note hidden" id="calls-turn-note"></div>' +
                '<div class="calls-mic-indicator hidden" id="calls-mic-indicator">' +
                    '<div class="calls-mic-pulse"></div>' +
                    '<span id="calls-mic-status">Listening…</span>' +
                '</div>' +
                '<button class="calls-speak-btn" id="calls-speak-btn" onclick="callsStartListening()" disabled>⏳ AI speaking…</button>' +
                '<form class="calls-type-row hidden" id="calls-type-row" onsubmit="callsSubmitTyped(); return false;">' +
                    '<input type="text" id="calls-type-input" class="calls-type-input" placeholder="Type your answer in German…" autocomplete="off" enterkeyhint="send" lang="de">' +
                    '<button type="submit" class="calls-type-send" id="calls-type-send">Send</button>' +
                '</form>' +
                '<button class="calls-type-toggle hidden" id="calls-type-toggle" onclick="callsShowTyping()">⌨️ Type instead</button>' +
            '</div>' +
        '</div>';

    callsAddBubble('ai', s.firstLine, '');
    callsConversation.push({ role: 'assistant', content: s.firstLine });
    callsSetTurn('ai');
    callsSpeakAI(s.firstLine, callsAfterAiTurn);
}

// The voice was silent in the Speech check: a note at the top of the
// transcript (it scrolls away with the replies and can be closed). No link to
// Settings here -- leaving Speak would end the call.
function callsSilentHintHtml() {
    if (typeof speechTtsSilent !== 'function' || !speechTtsSilent()) return '';
    return '<div class="speech-hint">' +
        '<button type="button" class="speech-hint-close" aria-label="Close" onclick="callsDismissSilentHint(this)">×</button>' +
        '🔇 The voice was silent in your Speech check, so read the replies here. After the call you can test again in Settings → Speech check.</div>';
}

function callsDismissSilentHint(btn) {
    var hint = btn && btn.parentNode;
    if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
}

function callsAddBubble(speaker, de, en) {
    var transcript = callsEl('calls-transcript');
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
    var el = callsEl('calls-mic-status');
    if (el) el.textContent = text;
}

function callsSetNote(text) {
    var note = callsEl('calls-turn-note');
    if (!note) return;
    note.textContent = text || '';
    note.classList.toggle('hidden', !text);
}

// The bottom bar grows and shrinks with its note, Try again button and
// typing row, and the transcript gives up that space. Whoever was reading
// the newest message keeps it in view; someone scrolled up stays put.
function callsTranscriptAtEnd() {
    var t = callsEl('calls-transcript');
    return !t || t.scrollHeight - t.scrollTop - t.clientHeight < 24;
}

function callsKeepTranscriptEnd(wasAtEnd) {
    var t = callsEl('calls-transcript');
    if (t && wasAtEnd) t.scrollTop = t.scrollHeight;
}

// Bottom-bar state while the AI talks, listens or waits for OpenAI.
function callsSetTurn(turn) {
    var atEnd = callsTranscriptAtEnd();
    callsTurn = turn;
    var mic = callsEl('calls-mic-indicator');
    var btn = callsEl('calls-speak-btn');
    var row = callsEl('calls-type-row');
    var toggle = callsEl('calls-type-toggle');
    var send = callsEl('calls-type-send');
    if (!btn) return;
    if (mic) mic.classList.toggle('hidden', turn !== 'listening');
    callsSetMicStatus('Listening…');
    callsSetNote('');
    if (turn === 'listening') {
        btn.classList.add('hidden');
    } else {
        btn.classList.remove('hidden');
        btn.disabled = true;
        btn.textContent = turn === 'thinking' ? '💭 Thinking…' : '⏳ AI speaking…';
    }
    if (row) row.classList.toggle('hidden', !callsTyping);
    if (send) send.disabled = turn !== 'listening';
    if (toggle) toggle.classList.toggle('hidden', !(turn === 'listening' && callsSRCtor && !callsTyping));
    callsKeepTranscriptEnd(atEnd);
}

// The learner's turn without an active microphone: speak button and/or typing.
function callsShowUserTurn(note, openTyping) {
    if (!callsIsLive()) return;
    var atEnd = callsTranscriptAtEnd();
    callsTurn = 'user';
    callsListening = false;
    if (openTyping || !callsSRCtor) callsTyping = true;
    var mic = callsEl('calls-mic-indicator');
    var btn = callsEl('calls-speak-btn');
    var row = callsEl('calls-type-row');
    var toggle = callsEl('calls-type-toggle');
    var send = callsEl('calls-type-send');
    if (mic) mic.classList.add('hidden');
    if (btn) {
        if (callsSRCtor) {
            btn.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = note ? '🎤 Try again' : '🎤 Tap to Speak';
        } else {
            btn.classList.add('hidden');
        }
    }
    if (row) row.classList.toggle('hidden', !callsTyping);
    if (send) send.disabled = false;
    if (toggle) toggle.classList.toggle('hidden', !callsSRCtor || callsTyping);
    callsSetNote(note || callsTypingNote());
    callsKeepTranscriptEnd(atEnd);
}

// Why this turn is typed, if voice input is off.
function callsTypingNote() {
    if (callsTyping && callsVoiceInputOff()) {
        return 'Voice input didn’t work in your Speech check, so this call is typed' +
            (callsSRCtor ? '. Tap 🎤 to try anyway, or test again in Settings → Speech check.' : ' (details in Settings → Speech check).');
    }
    if (!callsSRCtor) {
        return typeof speechRecError === 'function' ? speechRecError('unsupported').text : 'Voice input isn’t available on this device — type your answer.';
    }
    return '';
}

function callsShowTyping() {
    if (!callsIsLive()) return;
    callsTyping = true;
    if (callsTurn === 'listening') {
        var rec = callsRecognition;
        callsRecognition = null;
        callsListening = false;
        if (rec) { try { if (rec.abort) rec.abort(); else rec.stop(); } catch (e) {} }
        callsShowUserTurn('');
    } else if (callsTurn === 'user') {
        callsShowUserTurn('');
    } else {
        callsSetTurn(callsTurn);
    }
    var input = callsEl('calls-type-input');
    if (input) input.focus();
}

function callsSubmitTyped() {
    var input = callsEl('calls-type-input');
    if (!input || !callsIsLive()) return false;
    if (callsTurn !== 'user' && callsTurn !== 'listening') return false;
    var v = input.value.trim();
    if (!v) return false;
    input.value = '';
    if (callsTurn === 'listening') {
        var rec = callsRecognition;
        callsRecognition = null;
        callsListening = false;
        if (rec) { try { if (rec.abort) rec.abort(); else rec.stop(); } catch (e) {} }
        callsTurn = 'user';
    }
    callsHandleUserSpeech(v);
    return false;
}

// speechSay (app.js) copes with the iOS quirks: a dropped line, onend that
// never fires (its watchdog ends the turn anyway), a paused engine.
function callsSpeakAI(text, onDone) {
    var myId = callsCallId;
    var seq = ++callsUtterSeq;
    if (callsTtsTimer) { clearTimeout(callsTtsTimer); callsTtsTimer = null; }
    callsTtsActive = true;

    function finish(how) {
        if (seq !== callsUtterSeq) return;   // halted or cut short by "Answer now"
        callsTtsActive = false;
        if (callsTtsTimer) { clearTimeout(callsTtsTimer); callsTtsTimer = null; }
        if (myId !== callsCallId || callsEnded) return;
        // Stopped by something else (other audio): the learner's turn, no dead end.
        if (how === 'stopped') { callsShowUserTurn(''); return; }
        if (onDone) onDone();
    }

    // Once the line should be over, the learner may cut in (the engine can
    // keep reporting "speaking" on iOS).
    callsTtsTimer = setTimeout(function() {
        callsTtsTimer = null;
        if (seq !== callsUtterSeq || !callsTtsActive) return;
        var btn = callsEl('calls-speak-btn');
        if (btn && callsTurn === 'ai' && callsSRCtor && !callsTyping) { btn.disabled = false; btn.textContent = '🎤 Answer now'; }
    }, Math.max(2500, String(text).length * 75 + 1000));

    if (typeof speechSay === 'function') speechSay(text, { lang: 'de-DE', rate: 0.88, pitch: 1.05 }, finish);
    else setTimeout(function() { finish('none'); }, 0);
}

function callsAfterAiTurn() {
    if (!callsIsLive()) return;
    if (callsTyping || !callsSRCtor || callsTapToListen || document.visibilityState === 'hidden') callsShowUserTurn('');
    else callsStartListening(true);
}

// auto: started by itself after the AI spoke, i.e. outside a tap.
function callsStartListening(auto) {
    auto = auto === true;
    if (!callsIsLive() || callsListening || callsTurn === 'thinking') return;
    if (!callsSRCtor) { callsShowUserTurn(''); return; }
    if (callsTurn === 'ai' && callsTtsActive) {
        // "Answer now" while the engine still reports speaking
        callsUtterSeq++;
        if (callsTtsTimer) { clearTimeout(callsTtsTimer); callsTtsTimer = null; }
        callsTtsActive = false;
    }
    var myId = callsCallId;
    callsListening = true;              // a second tap meanwhile does nothing
    callsSetTurn('listening');
    // Never over the AI's voice (iOS audio session); from a tap with nothing
    // speaking, start() still runs inside the tap.
    speechThenListen(function(inTap) {
        if (myId !== callsCallId || !callsIsLive() || callsTurn !== 'listening' || callsRecognition) return;
        callsBeginRecognition(!inTap);
    }, !auto);
}

// auto: start() runs outside a tap (iOS may refuse it with 'not-allowed').
function callsBeginRecognition(auto) {
    var myId = callsCallId;
    var rec;
    try { rec = new callsSRCtor(); }
    catch (e) { callsShowUserTurn(speechRecError('start-failed').text, true); return; }
    rec.lang = 'de-DE';
    rec.continuous = false;
    rec.interimResults = false;
    var heard = false;
    function current() { return myId === callsCallId && rec === callsRecognition; }

    rec.onresult = function(event) {
        if (!current() || heard) return;
        var text = '';
        try { text = event.results[0][0].transcript; } catch (e) {}
        if (!text || !String(text).trim()) return;
        heard = true;
        callsRecognition = null;
        callsListening = false;
        if (typeof speechNoteVoiceWorked === 'function') speechNoteVoiceWorked();
        callsHandleUserSpeech(text);
    };
    rec.onerror = function(e) {
        if (!current()) return;
        callsRecognition = null;
        callsListening = false;
        callsHandleRecognitionError(e && e.error, auto);
    };
    rec.onend = function() {
        if (!current()) return;
        callsRecognition = null;
        callsListening = false;
        if (callsTurn === 'listening') callsShowUserTurn('I didn’t catch anything. Tap to speak again.');
    };

    callsRecognition = rec;
    callsListening = true;
    try {
        rec.start();
    } catch (e) {
        callsRecognition = null;
        callsListening = false;
        callsShowUserTurn(speechRecError('start-failed').text);
    }
}

// Messages and fixes come from speechRecError (app.js). A setting that
// blocks voice input opens the typing row.
function callsHandleRecognitionError(err, auto) {
    if (err === 'no-speech') { callsShowUserTurn('I didn’t hear anything. Tap to speak again.'); return; }
    if (err === 'aborted') { callsShowUserTurn(''); return; }
    // iOS may refuse a start that didn't come from a tap: from now on the
    // learner taps 🎤 (a refusal from a tap is a real "blocked").
    if (err === 'not-allowed' && auto) { callsTapToListen = true; callsShowUserTurn('Tap 🎤 to answer.'); return; }
    var info = speechRecError(err);
    callsShowUserTurn(info.text, info.kind === 'blocked' || info.kind === 'no-mic' || info.kind === 'unsupported');
}

function callsHangUp() {
    if (!callsIsLive()) { callsHaltMedia(); return; }
    callsFinishCall();
}

// Stops TTS, recognition, timers and the pending chat request.
function callsHaltMedia() {
    callsUtterSeq++;
    if (callsTtsTimer) { clearTimeout(callsTtsTimer); callsTtsTimer = null; }
    if (callsTtsActive || callsView === 'call') {
        callsTtsActive = false;
        if (typeof speechStop === 'function') speechStop();
    }
    var rec = callsRecognition;
    callsRecognition = null;
    callsListening = false;
    if (rec) { try { if (rec.abort) rec.abort(); else rec.stop(); } catch (e) {} }
    if (callsFetchAbort) { try { callsFetchAbort.abort(); } catch (e) {} callsFetchAbort = null; }
}

// ── OpenAI Integration ─────────────────────────────────────────

function callsHandleUserSpeech(transcript) {
    if (!callsIsLive() || callsTurn === 'thinking' || callsTurn === 'ai') return;
    var text = String(transcript || '').trim();
    if (!text) { callsShowUserTurn('I didn’t catch anything. Tap to speak again.'); return; }

    // A turn whose request failed is replaced, so user/assistant keep alternating.
    var last = callsConversation[callsConversation.length - 1];
    if (last && last.role === 'user') {
        callsConversation.pop();
        var old = document.querySelectorAll('#calls-transcript .calls-bubble-user');
        if (old.length) old[old.length - 1].classList.add('calls-bubble-unsent');
    }
    callsAddBubble('user', text, '');
    callsConversation.push({ role: 'user', content: text });
    callsSendToOpenAI();
}

function callsReadJson(r) {
    return r.text().then(function(text) {
        var data = null;
        try { data = JSON.parse(text); } catch (e) {}
        if (!r.ok || !data || data.error) {
            var err = new Error('openai');
            err.status = r.ok ? 0 : r.status;
            err.apiMessage = data && data.error && data.error.message ? String(data.error.message) : '';
            if (r.ok) err.kind = 'parse';
            throw err;
        }
        return data;
    });
}

function callsReplyText(data) {
    try { return String(data.choices[0].message.content || '').trim(); } catch (e) { return ''; }
}

function callsDescribeError(err) {
    err = err || {};
    var api = err.apiMessage ? ' OpenAI says: “' + err.apiMessage + '”' : '';
    if (err.status === 401) return 'OpenAI rejected your API key (401).' + api;
    if (err.status === 403) return 'OpenAI refused the request (403).' + api;
    if (err.status === 429) return 'OpenAI rate limit or quota reached (429) — check your OpenAI billing, or wait a moment.' + api;
    if (err.status >= 500) return 'OpenAI is having trouble right now (HTTP ' + err.status + '). Try again in a moment.';
    if (err.status) return 'OpenAI error (HTTP ' + err.status + ').' + api;
    if (err.kind === 'parse' || err.kind === 'empty') return 'OpenAI sent an unexpected reply.' + api + ' Try again.';
    if (navigator.onLine === false) return 'You’re offline — Speak needs an internet connection.';
    return 'Couldn’t reach OpenAI. Check your connection and try again.';
}

function callsIsGoodbye(reply) {
    var endWords = ['tschüss', 'auf wiedersehen', 'auf wiederhören', 'tschau', 'ciao'];
    var lower = String(reply).toLowerCase();
    return endWords.some(function(w) { return lower.indexOf(w) !== -1; });
}

function callsSendToOpenAI() {
    if (!callsIsLive()) return;
    var myId = callsCallId;
    var kind = callsScenarioKind(callsCurrentScenario);
    var messages = [{ role: 'system', content: callsBuildSystemPrompt() }].concat(callsConversation);
    var opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + callsGetApiKey() },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: messages, max_tokens: callsMaxTokens(kind), temperature: 0.7 })
    };
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    if (ctrl) opts.signal = ctrl.signal;
    callsFetchAbort = ctrl;
    callsSetTurn('thinking');

    fetch(CALLS_URL, opts)
    .then(callsReadJson)
    .then(function(data) {
        if (myId !== callsCallId || callsEnded) return;
        if (callsFetchAbort === ctrl) callsFetchAbort = null;
        var reply = callsReplyText(data);
        if (!reply) { var e = new Error('empty'); e.kind = 'empty'; throw e; }
        callsConversation.push({ role: 'assistant', content: reply });
        callsAddBubble('ai', reply, '');
        callsSetTurn('ai');
        var isEnd = callsIsGoodbye(reply);
        callsSpeakAI(reply, function() {
            if (!isEnd) { callsAfterAiTurn(); return; }
            setTimeout(function() {
                if (myId === callsCallId && !callsEnded) callsFinishCall();
            }, 800);
        });
    })
    .catch(function(err) {
        if (myId !== callsCallId || callsEnded) return;
        if (callsFetchAbort === ctrl) callsFetchAbort = null;
        callsShowError(callsDescribeError(err), err && err.status);
    });
}

function callsShowError(msg, status) {
    var transcript = callsEl('calls-transcript');
    if (!transcript || !callsIsLive()) return;
    var box = document.createElement('div');
    box.className = 'calls-error';
    var text = document.createElement('div');
    text.textContent = '⚠️ ' + msg;
    box.appendChild(text);

    var actions = document.createElement('div');
    actions.className = 'calls-error-actions';
    var last = callsConversation[callsConversation.length - 1];
    if (last && last.role === 'user') {
        var retry = document.createElement('button');
        retry.className = 'calls-error-btn';
        retry.textContent = '↻ Send again';
        retry.onclick = function() { callsRetrySend(actions); };
        actions.appendChild(retry);
    }
    if (status === 401 || status === 403) {
        var key = document.createElement('button');
        key.className = 'calls-error-btn';
        key.textContent = '🔑 Change API key';
        key.onclick = function() { callsShowSettings(); };
        actions.appendChild(key);
    }
    if (actions.childNodes.length) box.appendChild(actions);
    transcript.appendChild(box);
    transcript.scrollTop = transcript.scrollHeight;
    callsShowUserTurn('Send it again, or say something new.');
}

function callsRetrySend(actions) {
    if (!callsIsLive() || (callsTurn !== 'user' && callsTurn !== 'listening')) return;
    if (actions && actions.parentNode) actions.parentNode.removeChild(actions);
    if (callsTurn === 'listening') {
        var rec = callsRecognition;
        callsRecognition = null;
        callsListening = false;
        if (rec) { try { if (rec.abort) rec.abort(); else rec.stop(); } catch (e) {} }
    }
    var last = callsConversation[callsConversation.length - 1];
    if (last && last.role === 'user') callsSendToOpenAI();
    else callsAfterAiTurn();
}

// ── Feedback ───────────────────────────────────────────────────

function callsFinishCall() {
    var id = callsCallId;
    callsEnded = true;
    callsCallId++;
    callsHaltMedia();
    callsTurn = 'idle';
    callsShowFeedbackFor(id);
}

// Kept for older callers: ends the active call and shows its feedback.
function callsShowFeedback() {
    if (callsIsLive()) callsFinishCall();
}

function callsShowFeedbackFor(id) {
    if (callsFinishedId === id) return;
    callsFinishedId = id;
    var s = callsCurrentScenario;
    var container = callsContainer();
    if (!s || !container) return;

    var userTurns = callsConversation.filter(function(m) { return m.role === 'user'; }).length;
    if (!userTurns) {
        callsSetNotice('That call ended before you said anything, so it wasn’t counted.');
        renderCallsScenarioList(container);
        return;
    }

    callsIncrementCompleted();
    callsBumpDone(s.id);
    if (typeof dailyLogRecord === 'function') dailyLogRecord('calls', s.title);
    callsLastCall = { scenario: s, conversation: callsConversation.slice() };

    container.innerHTML =
        '<div class="calls-feedback">' +
            '<div class="calls-feedback-header">📊 Feedback · ' + callsEsc(s.title) + '</div>' +
            '<div class="calls-feedback-loading" id="calls-feedback-body"></div>' +
            '<div class="calls-feedback-actions">' +
                '<button class="btn btn-primary" onclick="callsTryAgain()">Try Again</button>' +
                '<button class="btn" onclick="callsBackToList()">All Scenarios</button>' +
            '</div>' +
        '</div>';
    callsView = 'feedback';
    callsRequestFeedback();
}

function callsTryAgain() {
    if (callsLastCall) callsStartScenario(callsLastCall.scenario.id);
}

function callsBackToList() {
    callsFeedbackSeq++;
    renderCallsScenarioList(callsContainer());
}

function callsFeedbackPrompt(call) {
    var s = call.scenario;
    var kind = callsScenarioKind(s);
    var lvl = callsLearnerLevel();
    var transcriptText = call.conversation.map(function(m) {
        return (m.role === 'user' ? '[USER]' : '[AI]') + ': ' + m.content;
    }).join('\n');

    var frame, standard;
    if (kind === 'exam') {
        var part = callsExamPart(s);
        frame = 'Goethe-Zertifikat B1 speaking exam practice' + (part ? ' (Sprechen Teil ' + part + ')' : '');
        standard = 'Judge the [USER] lines against the Goethe B1 Sprechen standard.';
    } else if (kind === 'b1') {
        frame = 'B1-level German speaking practice ("' + s.title + '")';
        standard = 'Judge the [USER] lines against the B1 standard.';
    } else {
        frame = 'German speaking practice ("' + s.title + '") for a learner at about ' + lvl.label + ' level who is working towards B1';
        standard = lvl.b1 ? 'Judge the [USER] lines against the B1 standard.' : 'Judge the [USER] lines at A1–A2 level, and point out one step towards B1.';
    }

    return 'The following is a ' + frame + ' conversation. The learner\'s lines are marked [USER]; the other person\'s lines are marked [AI]. ' +
        'The learner\'s goal was: ' + s.goalEn + '\n\n' +
        transcriptText + '\n\n' +
        standard + ' Give feedback in English. Return ONLY valid JSON with this exact structure:\n' +
        '{ "summary": "...", "mistakes": [{"error": "...", "correction": "..."}], ' +
        '"phrases": [{"said": "...", "better": "..."}], ' +
        '"vocab": [{"de": "...", "en": "..."}] }\n' +
        '"summary" is one or two sentences on how the learner did' + (kind === 'exam' ? ' and whether this would pass this part of the B1 exam' : '') + '. ' +
        'Include up to 3 mistakes, 3 better phrases and 5 useful vocabulary items for this situation. ' +
        'If the learner made fewer than 3 mistakes, note what they did well instead.';
}

function callsRequestFeedback() {
    var call = callsLastCall;
    if (!call) return;
    var seq = ++callsFeedbackSeq;
    var body = callsEl('calls-feedback-body');
    if (body) {
        body.className = 'calls-feedback-loading';
        body.innerHTML = '<div class="calls-spinner"></div><p>Analysing your conversation…</p>';
    }

    fetch(CALLS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + callsGetApiKey() },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: callsFeedbackPrompt(call) }],
            max_tokens: 900,
            temperature: 0.3,
            response_format: { type: 'json_object' }
        })
    })
    .then(callsReadJson)
    .then(function(data) {
        if (seq !== callsFeedbackSeq) return;
        var raw = callsReplyText(data).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        var fb = null;
        try { fb = JSON.parse(raw); } catch (e) {}
        if (!fb || typeof fb !== 'object') { callsRenderFeedbackError('Couldn’t read the feedback.', raw); return; }
        callsRenderFeedback(fb);
    })
    .catch(function(err) {
        if (seq !== callsFeedbackSeq) return;
        callsRenderFeedbackError(callsDescribeError(err), '');
    });
}

function callsRenderFeedback(fb) {
    var body = callsEl('calls-feedback-body');
    if (!body) return;
    function items(v) { return Array.isArray(v) ? v : []; }
    function txt(v) {
        if (v === undefined || v === null) return '';
        return callsEsc(typeof v === 'object' ? JSON.stringify(v) : v);
    }

    var html = '';
    if (fb.summary) html += '<div class="calls-fb-section calls-fb-summary">' + txt(fb.summary) + '</div>';

    var mistakes = items(fb.mistakes);
    if (mistakes.length) {
        html += '<div class="calls-fb-section calls-fb-mistakes"><div class="calls-fb-title">❌ Mistakes & Corrections</div>';
        mistakes.forEach(function(m) {
            m = m || {};
            html += '<div class="calls-fb-item">' +
                '<span class="calls-fb-wrong">' + txt(m.error) + '</span>' +
                '<span class="calls-fb-arrow"> → </span>' +
                '<span class="calls-fb-right">' + txt(m.correction) + '</span>' +
            '</div>';
        });
        html += '</div>';
    }

    var phrases = items(fb.phrases);
    if (phrases.length) {
        html += '<div class="calls-fb-section calls-fb-phrases"><div class="calls-fb-title">💡 Better Phrases</div>';
        phrases.forEach(function(p) {
            p = p || {};
            html += '<div class="calls-fb-item">' +
                '<span class="calls-fb-said">"' + txt(p.said) + '"</span>' +
                '<span class="calls-fb-arrow"> → </span>' +
                '<span class="calls-fb-better">"' + txt(p.better) + '"</span>' +
            '</div>';
        });
        html += '</div>';
    }

    var vocab = items(fb.vocab);
    if (vocab.length) {
        html += '<div class="calls-fb-section calls-fb-vocab"><div class="calls-fb-title">📚 Vocabulary</div>';
        vocab.forEach(function(v) {
            v = v || {};
            html += '<div class="calls-fb-item">' +
                '<span class="calls-fb-de">' + txt(v.de) + '</span>' +
                '<span class="calls-fb-arrow"> — </span>' +
                '<span class="calls-fb-en">' + txt(v.en) + '</span>' +
            '</div>';
        });
        html += '</div>';
    }

    if (!html) html = '<p class="calls-error">The feedback came back empty.</p>';
    body.className = 'calls-feedback-body';
    body.innerHTML = html;
}

function callsRenderFeedbackError(msg, raw) {
    var body = callsEl('calls-feedback-body');
    if (!body) return;
    body.className = 'calls-feedback-body';
    body.innerHTML = '<p class="calls-error">⚠️ ' + callsEsc(msg) + '</p>' +
        (raw ? '<div class="calls-fb-raw">' + callsEsc(raw) + '</div>' : '') +
        '<div class="calls-fb-retry-row"><button class="btn" onclick="callsRequestFeedback()">↻ Get feedback again</button></div>';
}
