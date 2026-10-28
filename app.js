// Goethe A1+B1 Flashcard App — Core Logic
// Depends on globals from words.js (WORDS, CATEGORIES), grammar.js (GRAMMAR_SECTIONS),
// scenarios.js (SCENARIO_THEMES, SCENARIOS), and their B1 siblings if loaded
// (b1-words.js, b1-grammar.js, b1-scenes.js). words.js/grammar.js/scenarios.js
// are never edited -- B1 content is concatenated on top of them, once, below.

// ── Unified word/grammar/scene pool ────────────────────────────────
// One continuous deck spanning A1 through B1: no level switch, no
// per-level branching. WORDS keeps its existing (easiest-first) order;
// B1_WORDS is ordered Core-800 (freq:1) before the rest (freq:2).

function mergeMaps() {
    var merged = {};
    for (var i = 0; i < arguments.length; i++) {
        var map = arguments[i];
        if (!map) continue;
        for (var k in map) merged[k] = map[k];
    }
    return merged;
}

var ALL_WORDS = WORDS.concat(typeof B1_WORDS !== 'undefined' ? B1_WORDS : []);
var ALL_CATEGORIES = mergeMaps(CATEGORIES, typeof B1_CATEGORIES !== 'undefined' ? B1_CATEGORIES : null);
var ALL_GRAMMAR = GRAMMAR_SECTIONS.concat(typeof B1_GRAMMAR_SECTIONS !== 'undefined' ? B1_GRAMMAR_SECTIONS : []);
var ALL_SCENARIO_THEMES = mergeMaps(SCENARIO_THEMES, typeof B1_SCENARIO_THEMES !== 'undefined' ? B1_SCENARIO_THEMES : null);
var ALL_SCENARIOS = SCENARIOS.concat(typeof B1_SCENARIOS !== 'undefined' ? B1_SCENARIOS : []);
var ALL_CALLS_SCENARIOS = CALLS_SCENARIOS.concat(typeof B1_CALLS_SCENARIOS !== 'undefined' ? B1_CALLS_SCENARIOS : []);

var WORD_BY_ID = {};
var A1_WORD_IDS = {};
ALL_WORDS.forEach(function(w, i) { WORD_BY_ID[w.id] = w; w._order = i; });
WORDS.forEach(function(w) { A1_WORD_IDS[w.id] = true; });

var DAY_MS = 24 * 60 * 60 * 1000;
var SRS_DAY_START_HOUR = 4;  // reviews scheduled for a day become due at 04:00 local
// Pre-SM-2 interval table, only used to migrate { level, nextReview } cards
var SRS_INTERVALS = [0, 1, 3, 7, 14, 30];
var LEARNED_THRESHOLD = 3; // legacy: level >= 3 counted as "learned"
var LEARNED_DAYS = 7;      // a word is "learned" once it has earned a 7-day interval
var MASTERED_DAYS = 21;    // ... and "mastered" while its interval is 21+ days

var wordProgress = {}; // { wordId: { level, ease, due, reps, lapses, intervalDays, firstSeen, lastReviewed, learnedAt, source } }
var currentDeck = [];
var currentIndex = 0;
var isFlipped = false;

function appEscape(s) {
    return String(s === undefined || s === null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Calls a global hook like window.planOnEnter if a module defines one.
function callHook(name, arg) {
    var fn = window[name];
    if (typeof fn !== 'function') return false;
    try { fn(arg); } catch (e) { if (window.console) console.error(name, e); }
    return true;
}

// ── Initialization ──────────────────────────────────────────────

var appLastDay = '';

function init() {
    rebuildTabBar();
    loadProgress();
    populateCategoryFilter();
    populateTestCategoryFilter();
    var coreToggle = document.getElementById('core-only-toggle');
    if (coreToggle) {
        coreToggle.checked = coreOnlyEnabled();
        // Without frequency data the toggle can't filter anything -- hide it.
        if (!hasFreqData() && coreToggle.parentNode) coreToggle.parentNode.style.display = 'none';
    }
    var speakToggle = document.getElementById('speak-on-flip-toggle');
    if (speakToggle) speakToggle.checked = speakOnFlipEnabled();
    cardsRestoreMode();
    renderGrammar();
    renderScenes();
    initExam();
    initHandsFree();
    initCalls();
    if (typeof renderTracksScreen === 'function') renderTracksScreen();
    appLastDay = srsToday();
    switchTab('plan');

    renderAppVersion();
    requestPersistentStorage();
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') appOnResume();
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(function(reg) {
            reg.update().catch(function() {}); // offline: ignore
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') reg.update().catch(function() {}); // offline: ignore
            });
        }).catch(function() {});
        // No reload when a new worker takes over: the network-first SW already
        // serves the newest files on the next launch, and reloading here would
        // throw away a test, exam or call in progress. (Pages still controlled
        // by the old cache-first worker reload themselves once.)
    }
}

// The PWA is usually resumed, not relaunched -- often on a new day. Refresh
// whatever on screen depends on "today" instead of showing yesterday's state.
// (plan.js refreshes the Plan itself on resume.)
function appOnResume() {
    var dayChanged = appLastDay !== srsToday();
    appLastDay = srsToday();
    if (currentTab === 'cards') cardsOnEnter(false);
    else if (currentTab === 'words') renderMyWords();
    else if (currentTab === 'settings') renderSettings();
    else if (dayChanged && currentTab === 'log') enterTab('log', false);
}

function renderAppVersion() {
    var el = document.getElementById('app-version');
    if (!el) {
        el = document.createElement('div');
        el.id = 'app-version';
        el.className = 'app-version';
        var plan = document.getElementById('plan-screen');
        if (plan) plan.appendChild(el);
    }
    el.innerHTML = 'Version ' + appEscape(appVersion()) +
        ' &middot; <button type="button" class="link-btn" onclick="forceUpdate(this)">Check for updates</button>';
}

function appVersion() {
    return typeof APP_VERSION !== 'undefined' ? APP_VERSION : '?';
}

// Ask the server which version is live. If it is newer, let the service
// worker update and reload: the network-first worker revalidates every file,
// so the reload gets the new code. The worker and the offline copy are never
// dropped -- unregistering would let the browser's 10-minute HTTP cache pair
// a new index.html with old scripts, and offline it would break the app.
function forceUpdate(btn) {
    var say = function(text) { if (btn) btn.textContent = text; };
    say('Checking…');
    fetch('./version.js?check=' + Date.now(), { cache: 'no-store' }).then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
    }).then(function(text) {
        var m = /APP_VERSION\s*=\s*'([^']+)'/.exec(text);
        if (m && m[1] === appVersion()) { say('Up to date ✓'); return; }
        say('Updating…');
        var job = 'serviceWorker' in navigator ?
            navigator.serviceWorker.getRegistration().then(function(reg) { return reg && reg.update(); }) :
            Promise.resolve();
        return job.catch(function() {}).then(function() { window.location.reload(); });
    }).catch(function() {
        say('Offline — try again with internet');
    });
}

document.addEventListener('DOMContentLoaded', init);

// ── Navigation ──────────────────────────────────────────────────
// A single tab bar for everyone: 4 primary slots plus a "More" sheet for
// the rest, since the full tab set doesn't fit one row.
//
// Screen lifecycle: leaving tab X calls window[X + 'OnLeave']() and entering
// it calls window[X + 'OnEnter'](isReTap) -- isReTap is true when the tab
// that is already showing is tapped again. Screens without an OnEnter hook
// fall back to their render function (TAB_RENDER_FALLBACK).

var TAB_META = {
    plan:     { icon: '🗓️', label: 'Plan' },
    cards:    { icon: '🃏', label: 'Cards' },
    words:    { icon: '📖', label: 'My Words' },
    test:     { icon: '✅', label: 'Test' },
    tracks:   { icon: '🎧', label: 'Tracks' },
    scenes:   { icon: '💬', label: 'Scenes' },
    grammar:  { icon: '📐', label: 'Grammar' },
    exam:     { icon: '🎓', label: 'Exam' },
    calls:    { icon: '🗣️', label: 'Speak' },
    log:      { icon: '📋', label: 'Log' },
    settings: { icon: '⚙️', label: 'Settings' }
};
var PRIMARY_TABS = ['plan', 'cards', 'words', 'tracks'];
var ALL_TAB_IDS = ['plan', 'cards', 'words', 'test', 'tracks', 'scenes', 'grammar', 'exam', 'calls', 'log', 'settings'];
var TAB_RENDER_FALLBACK = {
    plan: 'renderPlanScreen', exam: 'renderExamScreen', tracks: 'renderTracksScreen',
    calls: 'renderCallsScreen', log: 'renderLogScreen'
};
var currentTab = null;

function buildTabButton(id) {
    var meta = TAB_META[id];
    var btn = document.createElement('button');
    btn.className = 'tab';
    btn.setAttribute('data-tab', id);
    btn.addEventListener('click', function() { switchTab(id); });
    btn.innerHTML = '<span class="tab-icon">' + meta.icon + '</span><span class="tab-label">' + meta.label + '</span>';
    return btn;
}

function rebuildTabBar() {
    var nav = document.querySelector('.tab-bar');
    if (!nav) return;
    nav.innerHTML = '';
    PRIMARY_TABS.forEach(function(id) { nav.appendChild(buildTabButton(id)); });

    var moreBtn = document.createElement('button');
    moreBtn.className = 'tab';
    moreBtn.setAttribute('data-tab', 'more');
    moreBtn.addEventListener('click', openMoreSheet);
    moreBtn.innerHTML = '<span class="tab-icon">⋯</span><span class="tab-label">More</span>';
    nav.appendChild(moreBtn);
}

function openMoreSheet() {
    var sheet = document.getElementById('more-sheet');
    var list = document.getElementById('more-sheet-list');
    if (!sheet || !list) return;
    list.innerHTML = '';
    ALL_TAB_IDS.filter(function(id) { return PRIMARY_TABS.indexOf(id) === -1; }).forEach(function(id) {
        var meta = TAB_META[id];
        var item = document.createElement('button');
        item.className = 'more-sheet-item' + (currentTab === id ? ' active' : '');
        item.innerHTML = '<span class="tab-icon">' + meta.icon + '</span><span>' + meta.label + '</span>';
        item.addEventListener('click', function() { closeMoreSheet(); switchTab(id); });
        list.appendChild(item);
    });
    var ver = document.getElementById('more-sheet-version');
    if (ver) ver.textContent = 'Version ' + appVersion();
    sheet.classList.add('open');
}

function closeMoreSheet() {
    var sheet = document.getElementById('more-sheet');
    if (sheet) sheet.classList.remove('open');
}

function switchTab(tabName) {
    var screenEl = document.getElementById(tabName + '-screen');
    if (!screenEl) return;
    closeMoreSheet();
    closeWordSheet();
    var isReTap = currentTab === tabName;
    if (!isReTap && currentTab) {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        leaveTab(currentTab);
    }

    document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
    });
    screenEl.classList.add('active');

    document.querySelectorAll('.tab').forEach(function(t) {
        t.classList.remove('active');
    });
    var isPrimary = PRIMARY_TABS.indexOf(tabName) !== -1;
    var activeBtn = document.querySelector('[data-tab="' + (isPrimary ? tabName : 'more') + '"]');
    if (activeBtn) activeBtn.classList.add('active');

    currentTab = tabName;
    enterTab(tabName, isReTap);
}

function leaveTab(id) {
    if (callHook(id + 'OnLeave')) return;
    // Screens that predate the hooks: stop their audio here.
    if (id === 'calls' && typeof callsStopAll === 'function') callsStopAll();
    if (id === 'exam') {
        if (typeof examActiveAudio !== 'undefined' && examActiveAudio) { try { examActiveAudio.pause(); } catch (e) {} }
        if (typeof examRecognition !== 'undefined' && examRecognition) { try { examRecognition.stop(); } catch (e) {} }
    }
}

function enterTab(id, isReTap) {
    if (callHook(id + 'OnEnter', isReTap)) return;
    var fallback = TAB_RENDER_FALLBACK[id];
    if (fallback && typeof window[fallback] === 'function') window[fallback]();
}

// ── Cards Logic ─────────────────────────────────────────────────
// Three modes: 'daily' (due reviews + today's new words, the paced SRS
// session), 'mydeck' (every word introduced so far, growing day by day) and
// 'practice' (a set handed over from My Words). In mydeck/practice, only
// cards that are actually due get rescheduled -- browsing a word you already
// know never pushes it weeks ahead or inflates your counts.

var CARDS_MODE_KEY = 'cards-mode';
var CARDS_CATEGORY_KEY = 'cards-category';
var cardsMode = 'daily';
var cardsPracticeIds = [];
var cardsPracticeLabel = '';
var cardsDeckDay = '';
var cardsBacklog = 0;

function populateCategoryFilter() {
    var select = document.getElementById('category-filter');
    if (!select) return;
    sortedCategoryIds().forEach(function(catId) {
        var opt = document.createElement('option');
        opt.value = catId;
        opt.textContent = ALL_CATEGORIES[catId].emoji + ' ' + ALL_CATEGORIES[catId].name;
        select.appendChild(opt);
    });
    select.addEventListener('change', function() {
        cardsSaveCategory(this.value);
        cardsRebuild();
    });
}

// The topic is remembered for the rest of the study day only: a topic
// picked once must not quietly hide other reviews on later days.
function cardsSaveCategory(cat) {
    try { localStorage.setItem(CARDS_CATEGORY_KEY, JSON.stringify({ cat: cat, day: srsToday() })); } catch (e) {}
}

function cardsRestoreCategory() {
    var cat = 'all';
    try {
        var saved = JSON.parse(localStorage.getItem(CARDS_CATEGORY_KEY) || 'null');
        if (saved && saved.day === srsToday() && ALL_CATEGORIES[saved.cat]) cat = saved.cat;
    } catch (e) {}
    var select = document.getElementById('category-filter');
    if (select) select.value = cat;
}

function sortedCategoryIds() {
    return Object.keys(ALL_CATEGORIES).sort(function(a, b) {
        return ALL_CATEGORIES[a].name.localeCompare(ALL_CATEGORIES[b].name);
    });
}

function cardsRestoreMode() {
    var mode = 'daily';
    try { mode = localStorage.getItem(CARDS_MODE_KEY) === 'mydeck' ? 'mydeck' : 'daily'; } catch (e) {}
    cardsRestoreCategory();
    cardsMode = mode;
    cardsRebuild();
}

function setCardsMode(mode) {
    cardsMode = mode === 'mydeck' ? 'mydeck' : 'daily';
    try { localStorage.setItem(CARDS_MODE_KEY, cardsMode); } catch (e) {}
    cardsRebuild();
}

// Kept for older callers: startSession('mydeck') or startSession(categoryId).
function startSession(category) {
    if (category === 'mydeck') { setCardsMode('mydeck'); return; }
    var select = document.getElementById('category-filter');
    if (select && category && (category === 'all' || ALL_CATEGORIES[category])) select.value = category;
    if (cardsMode === 'practice') cardsMode = 'daily';
    cardsRebuild();
}

function cardsCategory() {
    var select = document.getElementById('category-filter');
    return select ? select.value : 'all';
}

function cardsWordPool() {
    var cat = cardsCategory();
    return cat === 'all' ? ALL_WORDS.slice() : ALL_WORDS.filter(function(w) { return w.category === cat; });
}

function cardsRebuild() {
    var now = Date.now();
    cardsBacklog = 0;
    if (cardsMode === 'practice') {
        currentDeck = shuffle(cardsPracticeIds.map(function(id) { return WORD_BY_ID[id]; }).filter(Boolean));
    } else if (cardsMode === 'mydeck') {
        currentDeck = shuffle(cardsWordPool().filter(function(w) { return !!wordProgress[w.id]; }));
    } else {
        var due = [];
        var fresh = [];
        // "Core only" limits which new words come in; reviews of words
        // already studied always show.
        var coreOnly = coreOnlyEnabled() && hasFreqData();
        cardsWordPool().forEach(function(w) {
            var prog = wordProgress[w.id];
            if (!prog) { if (!coreOnly || w.freq !== 2) fresh.push(w); }
            else if ((prog.due || 0) <= now) due.push(w);
        });
        due.sort(function(a, b) { return (wordProgress[a.id].due || 0) - (wordProgress[b.id].due || 0); });

        // Respect the daily review cap; while a backlog of overdue reviews is
        // left over, don't pile new words on top of it.
        var todayCounts = srsTodayCounts();
        var reviewsLeft = Math.max(0, srsReviewCap() - todayCounts.reviews);
        cardsBacklog = Math.max(0, due.length - reviewsLeft);
        due = due.slice(0, reviewsLeft);
        var newLeft = cardsBacklog > 0 ? 0 : Math.max(0, srsNewPerDay() - todayCounts['new']);
        var newSlice = shuffle(srsOrderNew(fresh).slice(0, newLeft));
        currentDeck = due.concat(newSlice);
    }
    currentIndex = 0;
    isFlipped = false;
    cardsDeckDay = srsToday();
    cardsRenderModeBar();
    updateIntroducedCounter();
    showCurrentCard();
}

// New words come easiest-first: all of A1 in its lesson order, then B1
// Core (freq 1), then the rest of B1 -- not a random draw from all 1983.
function srsOrderNew(words) {
    function rank(w) {
        if (A1_WORD_IDS[w.id]) return 0;
        return w.freq === 2 ? 2 : 1;
    }
    return words.slice().sort(function(a, b) {
        return (rank(a) - rank(b)) || (a._order - b._order);
    });
}

function hasFreqData() {
    for (var i = 0; i < ALL_WORDS.length; i++) {
        if (ALL_WORDS[i].freq === 2) return true;
    }
    return false;
}

function startMyDeckSession() {
    setCardsMode('mydeck');
}

// Contract for My Words / Plan: flip through a hand-picked set of words.
function startPracticeSession(ids, label) {
    cardsPracticeIds = (ids || []).filter(function(id) { return !!WORD_BY_ID[id]; });
    cardsPracticeLabel = label || 'Selected words';
    cardsMode = 'practice';
    switchTab('cards');
    cardsRebuild();
}

function exitPracticeSession() {
    cardsPracticeIds = [];
    cardsRestoreMode();
}

// Re-entering Cards (or resuming the app) rebuilds a deck that is from an
// earlier day or already used up, so new reviews show without a reload.
function cardsOnEnter(isReTap) {
    var finished = currentDeck.length === 0 || currentIndex >= currentDeck.length;
    if (cardsDeckDay !== srsToday()) {
        cardsRestoreCategory();
        cardsRebuild();
    } else if (finished && cardsMode !== 'practice') {
        cardsRebuild();
    } else {
        cardsRenderModeBar();
        updateIntroducedCounter();
    }
}

function cardsRenderModeBar() {
    var seg = document.getElementById('cards-mode-seg');
    if (seg) {
        var btns = seg.querySelectorAll('button');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.toggle('active', btns[i].getAttribute('data-mode') === cardsMode);
        }
    }
    var deckCount = document.getElementById('cards-mydeck-count');
    if (deckCount) {
        var n = 0;
        cardsWordPool().forEach(function(w) { if (wordProgress[w.id]) n++; });
        deckCount.textContent = n;
    }
    var banner = document.getElementById('cards-practice-banner');
    var modeBar = document.getElementById('cards-mode-bar');
    var isPractice = cardsMode === 'practice';
    if (banner) banner.classList.toggle('hidden', !isPractice);
    if (modeBar) modeBar.classList.toggle('hidden', isPractice);
    var select = document.getElementById('category-filter');
    if (select) select.classList.toggle('hidden', isPractice);
    var label = document.getElementById('cards-practice-label');
    if (label) label.textContent = '▶ ' + cardsPracticeLabel + ' · ' + cardsPracticeIds.length;
    var note = document.getElementById('cards-mode-note');
    if (note) {
        note.textContent = cardsMode === 'daily' ? '' :
            'Browsing: words that aren\'t due (or not started yet) keep their schedule. "Again" on a studied word puts it back into review.';
    }
}

// Due reviews outside the selected topic (0 when no topic is selected).
function cardsDueInOtherTopics() {
    if (cardsCategory() === 'all') return 0;
    var now = Date.now();
    var n = 0;
    ALL_WORDS.forEach(function(w) {
        var p = wordProgress[w.id];
        if (p && w.category !== cardsCategory() && (p.due || 0) <= now) n++;
    });
    return n;
}

function cardsShowAllTopics() {
    var select = document.getElementById('category-filter');
    if (select) select.value = 'all';
    cardsSaveCategory('all');
}

function cardsHasCard() {
    return currentDeck.length > 0 && currentIndex < currentDeck.length;
}

function updateIntroducedCounter() {
    var introducedEl = document.getElementById('cards-introduced-counter');
    if (!introducedEl) return;
    var s = wordStats();
    var text = 'Learned ' + s.learnedEver + ' · Seen ' + s.seen + ' / ' + s.total;
    if (hasFreqData()) {
        var coreTotal = 0;
        var coreSeen = 0;
        ALL_WORDS.forEach(function(w) {
            if (w.freq !== 1) return;
            coreTotal++;
            if (wordProgress[w.id]) coreSeen++;
        });
        text += ' · B1 Core ' + coreSeen + '/' + coreTotal;
    }
    introducedEl.textContent = text;
}

function cardsUpdateCounter() {
    var counterEl = document.getElementById('card-counter');
    if (!counterEl) return;
    if (!cardsHasCard()) return;
    if (cardsMode === 'daily') {
        var due = 0;
        var fresh = 0;
        currentDeck.slice(currentIndex).forEach(function(w) {
            if (wordProgress[w.id]) due++; else fresh++;
        });
        counterEl.textContent = due + ' due · ' + fresh + ' new left';
    } else {
        counterEl.textContent = (currentIndex + 1) + ' / ' + currentDeck.length;
    }
}

function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a;
}

function cardsShowMessage(title, hint, counter, progressPct) {
    var flashcard = document.getElementById('flashcard');
    var cardFront = flashcard.querySelector('.card-front');
    cardFront.classList.remove('gender-m', 'gender-f', 'gender-n');
    flashcard.classList.add('is-message');
    document.getElementById('card-type').textContent = '';
    document.getElementById('card-type').className = 'card-type-badge';
    document.getElementById('card-level').textContent = '';
    document.getElementById('card-front-word').textContent = title;
    document.getElementById('card-hint').textContent = hint;
    document.getElementById('card-translation').textContent = '';
    document.getElementById('card-example-de').textContent = '';
    document.getElementById('card-example-en').textContent = '';
    document.getElementById('card-details').textContent = '';
    document.getElementById('card-counter').textContent = counter;
    document.getElementById('session-progress').style.width = progressPct + '%';
    var actions = document.querySelector('.card-actions');
    if (actions) actions.classList.add('disabled');
}

function showCurrentCard() {
    var flashcard = document.getElementById('flashcard');
    isFlipped = false;
    flashcard.classList.remove('flipped');

    if (currentDeck.length === 0) {
        if (cardsMode === 'mydeck') {
            cardsShowMessage('Your deck is empty', 'Grade a few cards in "Today" first — every word you study is added here.', 'Nothing in your deck', 0);
        } else if (cardsMode === 'practice') {
            cardsShowMessage('Nothing to practise', 'Pick some words in My Words first.', 'Empty', 0);
        } else if (cardsBacklog > 0) {
            cardsShowMessage('Daily limit reached', cardsBacklog + ' more reviews are waiting — they come back tomorrow.', 'Limit reached', 100);
        } else if (cardsDueInOtherTopics() > 0) {
            cardsShowMessage('Topic done ✓', cardsDueInOtherTopics() + ' reviews are due in other topics. Tap the card to show all topics.', 'Topic done', 100);
        } else {
            cardsShowMessage('All caught up! 🎉', 'No reviews due and today\'s new words are done. Come back tomorrow — or browse My Deck.', 'Nothing due', 100);
        }
        return;
    }

    if (currentIndex >= currentDeck.length) {
        var more = cardsMode === 'daily' && cardsBacklog > 0 ? ' ' + cardsBacklog + ' reviews wait for tomorrow.' : '';
        if (cardsMode === 'daily' && cardsDueInOtherTopics() > 0) more += ' ' + cardsDueInOtherTopics() + ' reviews are due in other topics — tap to show all topics.';
        cardsShowMessage('🎉 Done!', 'Session complete.' + more + ' Tap the card to check for more.', 'Session done', 100);
        return;
    }

    flashcard.classList.remove('is-message');
    var actions = document.querySelector('.card-actions');
    if (actions) actions.classList.remove('disabled');
    var word = currentDeck[currentIndex];

    // Gender coloring for nouns (not for plural-only nouns like "die Eltern")
    var cardFront = flashcard.querySelector('.card-front');
    cardFront.classList.remove('gender-m', 'gender-f', 'gender-n');
    if (word.type === 'noun' && word.gender && word.plural !== word.de) {
        cardFront.classList.add('gender-' + word.gender);
    }

    // Front side
    document.getElementById('card-type').textContent = word.type;
    document.getElementById('card-type').className = 'card-type-badge type-' + word.type;
    document.getElementById('card-front-word').textContent = word.de;

    // Level indicator: 5 dots, or "new word" for a first sighting
    var prog = wordProgress[word.id];
    var level = prog ? Math.min(prog.level || 0, 5) : 0;
    var levelEl = document.getElementById('card-level');
    if (levelEl) {
        if (!prog) {
            levelEl.textContent = 'new word';
        } else {
            var st = wordIsRelearning(word.id) ? 'relearning' : wordState(word.id);
            var dots = '';
            for (var i = 0; i < 5; i++) dots += i < level ? '●' : '○';
            levelEl.innerHTML = '<span class="card-state card-state-' + st + '">' + st + '</span>' + dots;
        }
        levelEl.className = 'card-level level-' + level;
    }

    document.getElementById('card-hint').textContent = 'Tap to flip';

    // Back side
    document.getElementById('card-translation').textContent = word.en;
    document.getElementById('card-example-de').textContent = word.example ? word.example.de : '';
    document.getElementById('card-example-en').textContent = word.example ? word.example.en : '';

    // Details (plural for nouns, conjugation for verbs)
    var details = '';
    if (word.type === 'noun' && word.plural) {
        details = 'Plural: ' + word.plural;
    } else if (word.type === 'verb' && word.conjugation) {
        details = Object.keys(word.conjugation).map(function(k) {
            return k + ': ' + word.conjugation[k];
        }).join(' | ');
    }
    document.getElementById('card-details').textContent = details;

    document.getElementById('session-progress').style.width = ((currentIndex + 1) / currentDeck.length * 100) + '%';
    cardsUpdateCounter();
}

function flipCard() {
    // On the "done" / "all caught up" card a tap looks for more cards
    // (in all topics, if only the selected topic is finished).
    if (!cardsHasCard()) {
        if (cardsMode === 'daily' && cardsDueInOtherTopics() > 0) cardsShowAllTopics();
        cardsRebuild();
        return;
    }
    isFlipped = !isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped', isFlipped);
    if (isFlipped && speakOnFlipEnabled()) speakCurrentWord();
}

var cardsSpeakGen = 0; // bumped when leaving Cards: a queued example sentence is dropped

function cardsOnLeave() {
    cardsSpeakGen++;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// Front: the word. Back: the word, then its example sentence.
function speakCurrentWord() {
    if (!cardsHasCard()) return;
    var word = currentDeck[currentIndex];
    var gen = ++cardsSpeakGen;
    if (isFlipped && word.example && word.example.de) {
        speakText(word.de, 'de-DE', function() {
            if (gen === cardsSpeakGen && currentTab === 'cards' && isFlipped && currentDeck[currentIndex] === word) {
                speakText(word.example.de, 'de-DE', null);
            }
        });
    } else {
        speakText(word.de, 'de-DE', null);
    }
}

// ── SRS: SM-2-style scheduling ────────────────────────────────────
// Per-card state: { level, ease, due, reps, lapses, intervalDays, leech }
// plus tracking dates { firstSeen, lastReviewed, learnedAt, source }.
// Old { level, nextReview } cards are migrated on read, never reset.

var SRS_DAILY_KEY = 'srs-daily';
var CORE_ONLY_KEY = 'core-only';
var SPEAK_ON_FLIP_KEY = 'speak-on-flip';
var LEECH_LAPSES = 8;

function srsMigrateCard(prog) {
    if (prog.ease !== undefined) return prog; // already migrated
    var oldLevel = prog.level || 0;
    return {
        level: oldLevel,
        ease: 2.5,
        due: prog.nextReview || 0,
        reps: oldLevel,
        lapses: 0,
        intervalDays: SRS_INTERVALS[Math.min(oldLevel, SRS_INTERVALS.length - 1)] || 1
    };
}

function srsNewCard(now) {
    return { level: 0, ease: 2.5, due: now, reps: 0, lapses: 0, intervalDays: 0, firstSeen: now, source: 'srs' };
}

// 04:00 local time, `days` study days after the study day of nowMs
// (a session at 00:30 still counts from the evening before).
function srsDueDate(days, nowMs) {
    var d = new Date(srsStudyDayStart(nowMs));
    d.setDate(d.getDate() + days);
    return d.getTime();
}

function srsDayStart(ms) {
    var d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

// Local midnight `n` calendar days after the day of ms (DST-safe).
function srsAddDays(ms, n) {
    var d = new Date(srsDayStart(ms));
    d.setDate(d.getDate() + n);
    return d.getTime();
}

function srsWeekStart(ms) {
    var d = new Date(srsDayStart(ms));
    return srsAddDays(d.getTime(), -((d.getDay() + 6) % 7));
}

function srsDayKey(ms) {
    var d = new Date(ms);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

// The study day runs 04:00-04:00, the same hour reviews come due: a late
// session after midnight still belongs to the evening's day.
function srsStudyDayKey(ms) {
    return srsDayKey(ms - SRS_DAY_START_HOUR * 3600000);
}

function srsStudyDayStart(ms) {
    var d = new Date(ms - SRS_DAY_START_HOUR * 3600000);
    d.setHours(SRS_DAY_START_HOUR, 0, 0, 0);
    return d.getTime();
}

function srsDayKeyToMs(key) {
    var p = String(key).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).getTime();
}

function srsNext(card, grade, nowMs) {
    var now = nowMs || Date.now();
    if (grade === 'again') {
        // Only forgetting a word you had already graduated counts as a lapse;
        // stumbling over a brand-new or still-learning card costs nothing.
        if ((card.level || 0) >= 2) {
            card.lapses = (card.lapses || 0) + 1;
            card.ease = Math.max(1.3, (card.ease || 2.5) - 0.2);
            if (card.lapses >= LEECH_LAPSES) card.leech = true;
        }
        if (card.learnedAt) card.relearning = true;
        card.level = 0;
        card.intervalDays = 0;
        card.due = now + 10 * 60 * 1000; // retry within this session
        return card;
    }
    card.reps = (card.reps || 0) + 1;
    var iv = card.intervalDays || 0;
    var days;
    if (!card.level) days = grade === 'easy' ? 4 : 1;
    else if (card.level === 1) days = Math.max(3, iv + 1);
    else days = Math.max(iv + 1, Math.round((iv || 1) * card.ease));
    if (grade === 'easy' && card.level) {
        days = Math.ceil(days * 1.3);
        card.ease = card.ease + 0.15;
    }
    days = Math.min(days, 180);
    card.intervalDays = days;
    if (days >= LEARNED_DAYS) delete card.relearning;
    card.level = (card.level || 0) + 1;
    card.due = srsDueDate(days, now);
    return card;
}

function srsToday() {
    return srsStudyDayKey(Date.now());
}

function srsDailyLoad() {
    try { return JSON.parse(localStorage.getItem(SRS_DAILY_KEY) || '{}'); }
    catch (e) { return {}; }
}

function srsDailySave(data) {
    try { localStorage.setItem(SRS_DAILY_KEY, JSON.stringify(data)); } catch (e) {}
}

function srsTodayCounts() {
    return srsDailyLoad()[srsToday()] || { 'new': 0, reviews: 0 };
}

function srsBumpToday(field) {
    var data = srsDailyLoad();
    var key = srsToday();
    if (!data[key]) data[key] = { 'new': 0, reviews: 0 };
    data[key][field] = (data[key][field] || 0) + 1;
    srsDailySave(data);
}

function srsNewPerDay() {
    if (typeof B1_KEY_DATES === 'undefined') return 10;
    var today = srsToday();
    if (today >= B1_KEY_DATES.newCardsTo0) return 0;
    if (today >= B1_KEY_DATES.newCardsTo5) return 5;
    return 10;
}

function srsReviewCap() { return 150; }

function coreOnlyEnabled() {
    return localStorage.getItem(CORE_ONLY_KEY) === '1';
}

function toggleCoreOnly() {
    localStorage.setItem(CORE_ONLY_KEY, coreOnlyEnabled() ? '0' : '1');
    cardsRebuild();
}

function speakOnFlipEnabled() {
    var v = localStorage.getItem(SPEAK_ON_FLIP_KEY);
    return v === null ? true : v === '1'; // default ON
}

function toggleSpeakOnFlip() {
    localStorage.setItem(SPEAK_ON_FLIP_KEY, speakOnFlipEnabled() ? '0' : '1');
}

function logWordEvent(category, id) {
    if (typeof dailyLogRecord === 'function') dailyLogRecord(category, id);
}

function gradeCard(grade) {
    if (!cardsHasCard()) return;
    var word = currentDeck[currentIndex];
    var now = Date.now();
    var existing = wordProgress[word.id];
    var wasNew = !existing;
    var prog = existing ? srsMigrateCard(existing) : srsNewCard(now);
    var isDue = wasNew || (prog.due || 0) <= now;
    var browsing = cardsMode !== 'daily' && (wasNew || !isDue);

    if (browsing && (grade !== 'again' || wasNew)) {
        // A word that isn't due yet: knowing it changes nothing.
        logWordEvent('practiced', word.id);
    } else {
        // Seen for the first time earlier today (e.g. after an "Again"):
        // today it still counts as a new word, not as a review.
        var newToday = !wasNew && prog.firstSeen && !prog.firstSeenApprox && srsStudyDayKey(prog.firstSeen) === srsToday();
        prog = srsNext(prog, grade, now);
        if (!prog.firstSeen) prog.firstSeen = now;
        if (!prog.source) prog.source = 'srs';
        prog.lastReviewed = now;
        delete prog.lastReviewedApprox;
        if (!prog.learnedAt && prog.intervalDays >= LEARNED_DAYS) prog.learnedAt = now;
        wordProgress[word.id] = prog;
        saveProgress();
        if (wasNew) {
            srsBumpToday('new');
            logWordEvent('wordsNew', word.id);
        } else if (browsing) {
            logWordEvent('practiced', word.id);
        } else if (!newToday) {
            srsBumpToday('reviews');
            logWordEvent('wordsReview', word.id);
        }
        if (grade === 'again') logWordEvent('wordsAgain', word.id);
    }
    updateIntroducedCounter();
    if (cardsMode !== 'practice') cardsRenderModeBar();

    if (grade === 'again') {
        // Re-insert the card later in this session for another attempt
        currentDeck.splice(currentIndex, 1);
        var insertAt = currentIndex + Math.floor(Math.random() * Math.max(1, currentDeck.length - currentIndex)) + 1;
        if (insertAt > currentDeck.length) insertAt = currentDeck.length;
        currentDeck.splice(insertAt, 0, word);
    } else {
        currentIndex++;
    }
    showCurrentCard();
}

// ── Word tracking ───────────────────────────────────────────────
// One definition of a word's state, used by every counter in the app:
//   new      -- never studied
//   learning -- studied, still on short intervals
//   learned  -- has earned a 7-day interval at least once (sticky: the
//               learned list only grows; a forgotten word shows "relearning")
//   mastered -- currently on a 21+ day interval

function wordState(id) {
    var p = wordProgress[id];
    if (!p || typeof p !== 'object') return 'new';
    var iv = p.intervalDays || 0;
    if (iv >= MASTERED_DAYS) return 'mastered';
    if (iv >= LEARNED_DAYS || p.learnedAt) return 'learned';
    return 'learning';
}

// A learned word that was forgotten (or sent back to review) and hasn't
// earned its 7-day gap again. Words the A1 app counted as learned often sit
// on short gaps without ever being forgotten -- those are not relearning.
function wordIsRelearning(id) {
    var p = wordProgress[id];
    if (!p || !p.learnedAt || (p.intervalDays || 0) >= LEARNED_DAYS) return false;
    return !!(p.relearning || p.lapses > 0);
}

function wordStats() {
    var now = Date.now();
    var todayStart = srsStudyDayStart(now);
    var s = { total: ALL_WORDS.length, seen: 0, 'new': 0, learning: 0, learned: 0, mastered: 0,
              learnedEver: 0, newToday: 0, learnedToday: 0, dueNow: 0 };
    ALL_WORDS.forEach(function(w) {
        var st = wordState(w.id);
        s[st]++;
        if (st === 'new') return;
        var p = wordProgress[w.id];
        s.seen++;
        if (st === 'learned' || st === 'mastered') s.learnedEver++;
        if (p.firstSeen >= todayStart) s.newToday++;
        if (p.learnedAt >= todayStart) s.learnedToday++;
        if ((p.due || 0) <= now) s.dueNow++;
    });
    return s;
}

function wordsFieldBetween(field, fromMs, toMs) {
    var ids = [];
    ALL_WORDS.forEach(function(w) {
        var p = wordProgress[w.id];
        if (!p || p[field + 'Unknown']) return;
        if (p[field] >= fromMs && p[field] < toMs) ids.push(w.id);
    });
    return ids;
}

function wordsFirstSeenBetween(fromMs, toMs) { return wordsFieldBetween('firstSeen', fromMs, toMs); }
function wordsLearnedBetween(fromMs, toMs) { return wordsFieldBetween('learnedAt', fromMs, toMs); }

function isWordLearned(wordId) {
    var st = wordState(wordId);
    return st === 'learned' || st === 'mastered';
}

function getLearnedCount() {
    return wordStats().learnedEver;
}

// "I know this": promote to learned without throwing away any history.
function markWordKnown(id) {
    var now = Date.now();
    var existing = wordProgress[id];
    var p = existing ? srsMigrateCard(existing) : srsNewCard(now);
    if (!existing) p.source = 'manual';
    p.level = Math.max(p.level || 0, LEARNED_THRESHOLD);
    p.intervalDays = Math.max(p.intervalDays || 0, LEARNED_DAYS);
    p.due = Math.max(p.due || 0, srsDueDate(LEARNED_DAYS, now));
    if (!p.firstSeen) p.firstSeen = now;
    if (!p.learnedAt) p.learnedAt = now;
    p.lastReviewed = now;
    delete p.lastReviewedApprox;
    delete p.relearning;
    wordProgress[id] = p;
    saveProgress();
    logWordEvent('wordsMarked', id);
}

// "Review again soon": back into today's reviews, history kept.
function markWordForReview(id) {
    var p = wordProgress[id];
    if (!p) return;
    p = srsMigrateCard(p);
    if (p.learnedAt) p.relearning = true;
    p.level = 0;
    p.intervalDays = 0;
    p.due = Date.now();
    wordProgress[id] = p;
    saveProgress();
}

function resetWord(id) {
    delete wordProgress[id];
    saveProgress();
}

// ── My Words ────────────────────────────────────────────────────
// The tracker of everything studied: what you learned and when, what's
// next, searchable, filterable, and one tap away from a flashcard review.

var MYWORDS_VIEW_KEY = 'mywords-view';
var MW_PAGE = 120;
var mwView = { q: '', state: 'seen', level: 'all', category: 'all', sort: 'seen', range: null, limit: MW_PAGE };
var mwSearchKeys = null;
var mwLastList = [];
var MW_STATE_LABEL = { 'new': 'Not started', learning: 'Learning', learned: 'Learned', mastered: 'Mastered' };
var MW_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var MW_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var mwViewLoaded = false;

function mwLoadView() {
    if (mwViewLoaded) return;
    mwViewLoaded = true;
    try {
        var saved = JSON.parse(localStorage.getItem(MYWORDS_VIEW_KEY) || '{}');
        if (saved.state) mwView.state = saved.state;
        if (saved.sort) mwView.sort = saved.sort;
        if (saved.level) mwView.level = saved.level;
    } catch (e) {}
}

function mwSaveView() {
    try {
        localStorage.setItem(MYWORDS_VIEW_KEY, JSON.stringify({ state: mwView.state, sort: mwView.sort, level: mwView.level }));
    } catch (e) {}
}

// Search ignores case, umlauts and a leading article: "schon" finds
// "schön", "tisch" finds "der Tisch", "to go" finds "gehen".
function mwNorm(s) {
    return String(s || '').toLowerCase()
        .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/^\s*(der|die|das|den|dem|ein|eine|the|a|an|to)\s+/, '')
        .replace(/\s+/g, ' ').trim();
}

function mwSearchKey(w) {
    if (!mwSearchKeys) mwSearchKeys = {};
    if (mwSearchKeys[w.id] === undefined) {
        mwSearchKeys[w.id] = ' ' + mwNorm(w.de) + ' | ' + mwNorm(w.en) + ' | ' + mwNorm(w.plural || '') + ' ';
    }
    return mwSearchKeys[w.id];
}

function mwFormatDate(ms, approx, unknown) {
    if (!ms) return '—';
    if (unknown) return 'unknown (before ' + mwFormatDate(srsAddDays(ms, 1)) + ')';
    var d = new Date(ms);
    var key = srsStudyDayKey(ms);
    var today = srsToday();
    var label;
    if (key === today) label = 'today';
    else if (key === srsStudyDayKey(Date.now() - DAY_MS)) label = 'yesterday';
    else if (key === srsStudyDayKey(Date.now() + DAY_MS)) label = 'tomorrow';
    else label = d.getDate() + ' ' + MW_MONTHS[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '');
    return (approx ? '≈ ' : '') + label;
}

function mwDayHeader(key) {
    if (key === srsToday()) return 'Today';
    if (key === srsStudyDayKey(Date.now() - DAY_MS)) return 'Yesterday';
    if (key === srsStudyDayKey(Date.now() + DAY_MS)) return 'Tomorrow';
    var d = new Date(srsDayKeyToMs(key));
    return MW_DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MW_MONTHS[d.getMonth()];
}

function mwNextReviewText(p) {
    if (!p) return '';
    var now = Date.now();
    if ((p.due || 0) <= now) return 'due now';
    var days = Math.round((srsDayStart(p.due) - srsDayStart(now)) / DAY_MS);
    if (days <= 0) return 'due later today';
    if (days === 1) return 'next: tomorrow';
    return 'next: in ' + days + ' d';
}

function mwStateMatches(state, st) {
    if (state === 'seen') return st !== 'new';
    if (state === 'learning') return st === 'learning';
    if (state === 'learned') return st === 'learned' || st === 'mastered';
    if (state === 'mastered') return st === 'mastered';
    if (state === 'new') return st === 'new';
    return true;
}

function mwMatches(w, st) {
    return mwStateMatches(mwView.state, st) && mwBaseMatches(w);
}

// Every filter except the state chips: level, topic, date range, search.
function mwBaseMatches(w) {
    var v = mwView;
    var q = mwNorm(v.q);
    if (q && mwSearchKey(w).indexOf(q) === -1) return false;
    if (v.level === 'a1' && !A1_WORD_IDS[w.id]) return false;
    if (v.level === 'b1' && A1_WORD_IDS[w.id]) return false;
    if (v.category !== 'all' && w.category !== v.category) return false;
    if (v.range) {
        var p = wordProgress[w.id];
        var t = p ? p[v.range.by === 'learned' ? 'learnedAt' : 'firstSeen'] : 0;
        if (!t || t < v.range.from || t >= v.range.to) return false;
    }
    return true;
}

function mwFilteredWords() {
    var list = ALL_WORDS.filter(function(w) {
        return mwMatches(w, wordState(w.id));
    });
    var sort = mwView.sort;
    function field(w, f) { var p = wordProgress[w.id]; return p && p[f] ? p[f] : 0; }
    list.sort(function(a, b) {
        if (sort === 'learned') return (field(b, 'learnedAt') - field(a, 'learnedAt')) || (field(b, 'firstSeen') - field(a, 'firstSeen'));
        if (sort === 'due') {
            var da = wordProgress[a.id] ? field(a, 'due') : Infinity;
            var db = wordProgress[b.id] ? field(b, 'due') : Infinity;
            return da === db ? a._order - b._order : (da < db ? -1 : 1);
        }
        if (sort === 'az') return mwNorm(a.de).localeCompare(mwNorm(b.de));
        if (sort === 'lapses') return (field(b, 'lapses') - field(a, 'lapses')) || (field(b, 'lastReviewed') - field(a, 'lastReviewed'));
        if (sort === 'order') return a._order - b._order;
        return (field(b, 'firstSeen') - field(a, 'firstSeen')) || (a._order - b._order);
    });
    return list;
}

// 'today' / 'this week' ranges are kept relative, so a list left open
// overnight moves on to the new day.
function mwRelativeRange(rel, by) {
    var now = Date.now();
    var label = (by === 'learned' ? 'Learned' : 'Seen') + (rel === 'today' ? ' today' : ' this week');
    if (rel === 'today') {
        var dayStart = srsStudyDayStart(now);
        var dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        return { from: dayStart, to: dayEnd.getTime(), label: label, by: by, rel: rel };
    }
    var monday = srsWeekStart(now);
    return { from: monday, to: srsAddDays(monday, 7), label: label, by: by, rel: rel };
}

// Contract for Plan/Log: open My Words pre-filtered.
// opts: { range: 'today'|'week'|'all' } or { from, to, label, by: 'seen'|'learned' }, plus optional state.
function openMyWords(opts) {
    opts = opts || {};
    mwLoadView();
    mwView.q = '';
    mwView.category = 'all';
    mwView.range = null;
    if (opts.range || opts.from !== undefined || opts.state) mwView.level = 'all';
    var now = Date.now();
    var by = opts.by === 'learned' ? 'learned' : 'seen';
    if (opts.range === 'today' || opts.range === 'week') {
        mwView.range = mwRelativeRange(opts.range, by);
    } else if (opts.from !== undefined && opts.to !== undefined) {
        mwView.range = { from: +opts.from, to: +opts.to, label: opts.label || 'Selected dates', by: by };
    }
    if (opts.state) mwView.state = opts.state;
    else if (mwView.range) mwView.state = by === 'learned' ? 'learned' : 'seen';
    if (opts.sort) mwView.sort = opts.sort;
    else if (mwView.range) mwView.sort = by === 'learned' ? 'learned' : 'seen';
    mwView.limit = MW_PAGE;
    switchTab('words');
    renderMyWords();
}

function wordsOnEnter(isReTap) {
    renderMyWords();
    if (isReTap) {
        var screen = document.getElementById('words-screen');
        if (screen) screen.scrollTop = 0;
    }
}

// Kept for older callers.
function renderWordList() { renderMyWords(); }

function renderMyWords() {
    var container = document.getElementById('mywords-content');
    if (!container) return;
    if (!container.getAttribute('data-ready')) {
        mwLoadView();
        mwBuildShell(container);
        container.setAttribute('data-ready', '1');
    }
    if (mwView.range && mwView.range.rel) mwView.range = mwRelativeRange(mwView.range.rel, mwView.range.by);
    var s = wordStats();
    mwRenderSummary(s);
    mwRenderControls(s);
    mwRenderList();
}

function mwBuildShell(container) {
    var catOptions = '<option value="all">All topics</option>' + sortedCategoryIds().map(function(id) {
        return '<option value="' + appEscape(id) + '">' + ALL_CATEGORIES[id].emoji + ' ' + appEscape(ALL_CATEGORIES[id].name) + '</option>';
    }).join('');
    container.innerHTML =
        '<div class="mw-summary" id="mw-summary"></div>' +
        '<details class="mw-weeks" id="mw-weeks"><summary>Week by week</summary><div id="mw-weeks-body"></div></details>' +
        '<div class="mw-search-wrap"><input type="search" id="mw-search" class="mw-search" placeholder="Search German or English…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>' +
        '<div class="mw-chips" id="mw-chips"></div>' +
        '<div class="mw-selects">' +
            '<select id="mw-level"><option value="all">A1 + B1</option><option value="a1">A1 only</option><option value="b1">B1 only</option></select>' +
            '<select id="mw-category">' + catOptions + '</select>' +
            '<select id="mw-sort">' +
                '<option value="seen">Newest first</option>' +
                '<option value="learned">Recently learned</option>' +
                '<option value="due">Next review</option>' +
                '<option value="lapses">Most forgotten</option>' +
                '<option value="az">A–Z</option>' +
                '<option value="order">Course order</option>' +
            '</select>' +
        '</div>' +
        '<div class="mw-range hidden" id="mw-range"></div>' +
        '<div class="mw-actions" id="mw-actions"></div>' +
        '<div class="mw-list" id="mw-list"></div>';

    var search = document.getElementById('mw-search');
    var searchTimer = null;
    search.addEventListener('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            mwView.q = search.value;
            mwView.limit = MW_PAGE;
            mwRenderControls(wordStats());
            mwRenderList();
        }, 120);
    });
    document.getElementById('mw-level').addEventListener('change', function() { mwSet('level', this.value); });
    document.getElementById('mw-category').addEventListener('change', function() { mwSet('category', this.value); });
    document.getElementById('mw-sort').addEventListener('change', function() { mwSet('sort', this.value); });
    document.getElementById('mw-weeks-body').addEventListener('click', function(e) {
        var week = e.target.closest ? e.target.closest('.mw-week') : null;
        if (week) openMyWords({ from: +week.getAttribute('data-from'), to: +week.getAttribute('data-to'), label: week.getAttribute('data-label') });
    });
    document.getElementById('mw-list').addEventListener('click', function(e) {
        var more = e.target.closest ? e.target.closest('.mw-more') : null;
        if (more) {
            mwView.limit += MW_PAGE * 3;
            mwRenderList();
            return;
        }
        var row = e.target.closest ? e.target.closest('.mw-row') : null;
        if (row) openWordSheet(+row.getAttribute('data-id'));
    });
}

function mwSet(key, value) {
    mwView[key] = value;
    mwView.limit = MW_PAGE;
    mwSaveView();
    mwRenderControls(wordStats());
    mwRenderList();
}

function mwClearRange() {
    mwView.range = null;
    mwView.limit = MW_PAGE;
    mwRenderControls(wordStats());
    mwRenderList();
}

function mwRenderSummary(s) {
    var el = document.getElementById('mw-summary');
    if (!el) return;
    var pct = function(n) { return s.total ? (n / s.total * 100) : 0; };
    el.innerHTML =
        '<div class="mw-hero">' +
            '<div class="mw-hero-main"><span class="mw-hero-num">' + s.learnedEver + '</span>' +
                '<span class="mw-hero-label">words learned<br><span class="mw-hero-of">of ' + s.total + ' · ' + s.seen + ' seen</span></span></div>' +
            '<div class="mw-stack">' +
                '<span class="mw-stack-mastered" style="width:' + pct(s.mastered) + '%"></span>' +
                '<span class="mw-stack-learned" style="width:' + pct(s.learned) + '%"></span>' +
                '<span class="mw-stack-learning" style="width:' + pct(s.learning) + '%"></span>' +
            '</div>' +
            '<div class="mw-legend">' +
                '<span><i class="mw-dot mw-dot-mastered"></i>Mastered ' + s.mastered + '</span>' +
                '<span><i class="mw-dot mw-dot-learned"></i>Learned ' + s.learned + '</span>' +
                '<span><i class="mw-dot mw-dot-learning"></i>Learning ' + s.learning + '</span>' +
            '</div>' +
            '<div class="mw-today">' +
                '<button type="button" onclick="openMyWords({range:\'today\'})"><b>+' + s.newToday + '</b> new today</button>' +
                '<button type="button" onclick="openMyWords({range:\'today\',by:\'learned\'})"><b>+' + s.learnedToday + '</b> learned today</button>' +
                '<button type="button" onclick="mwReviewDue()"><b>' + s.dueNow + '</b> due now</button>' +
            '</div>' +
        '</div>';
    mwRenderWeeks();
}

function mwReviewDue() {
    cardsShowAllTopics();
    setCardsMode('daily');
    switchTab('cards');
}

// Last 8 calendar weeks: words first seen and words learned per week.
function mwRenderWeeks() {
    var el = document.getElementById('mw-weeks-body');
    if (!el) return;
    var monday = srsWeekStart(Date.now());
    var rows = [];
    var max = 1;
    for (var i = 0; i < 8; i++) {
        var from = srsAddDays(monday, -7 * i);
        var to = srsAddDays(from, 7);
        var seen = wordsFirstSeenBetween(from, to).length;
        var learned = wordsLearnedBetween(from, to).length;
        max = Math.max(max, seen, learned);
        var fromD = new Date(from);
        var toD = new Date(to - DAY_MS);
        var label = i === 0 ? 'This week' : (i === 1 ? 'Last week' :
            fromD.getDate() + ' ' + MW_MONTHS[fromD.getMonth()] + '–' + toD.getDate() + ' ' + MW_MONTHS[toD.getMonth()]);
        rows.push({ from: from, to: to, seen: seen, learned: learned, label: label });
    }
    el.innerHTML = rows.map(function(r) {
        return '<button type="button" class="mw-week" data-from="' + r.from + '" data-to="' + r.to + '" data-label="Seen ' + appEscape(r.label) + '">' +
            '<span class="mw-week-label">' + appEscape(r.label) + '</span>' +
            '<span class="mw-week-bars">' +
                '<span class="mw-week-bar seen" style="width:' + (r.seen / max * 100) + '%"></span>' +
                '<span class="mw-week-bar learned" style="width:' + (r.learned / max * 100) + '%"></span>' +
            '</span>' +
            '<span class="mw-week-nums">' + r.seen + ' new · ' + r.learned + ' learned</span>' +
        '</button>';
    }).join('') + '<div class="mw-week-hint">Blue: first seen that week · green: reached "learned" that week. Tap a week to list its words.</div>';
}

// State counts within the current level/topic/search/date filters.
function mwChipCounts() {
    var c = { seen: 0, learning: 0, learned: 0, mastered: 0, 'new': 0, all: 0 };
    ALL_WORDS.forEach(function(w) {
        if (!mwBaseMatches(w)) return;
        var st = wordState(w.id);
        c.all++;
        if (st === 'new') { c['new']++; return; }
        c.seen++;
        if (st === 'learning') c.learning++;
        else c.learned++;
        if (st === 'mastered') c.mastered++;
    });
    return c;
}

function mwRenderControls(s) {
    var chips = document.getElementById('mw-chips');
    if (chips) {
        var c = mwChipCounts();
        var defs = [
            ['seen', 'My words', c.seen], ['learning', 'Learning', c.learning], ['learned', 'Learned', c.learned],
            ['mastered', 'Mastered', c.mastered], ['new', 'Not started', c['new']], ['all', 'All', c.all]
        ];
        chips.innerHTML = defs.map(function(d) {
            return '<button type="button" class="mw-chip' + (mwView.state === d[0] ? ' active' : '') +
                '" onclick="mwSet(\'state\',\'' + d[0] + '\')">' + d[1] + ' <span>' + d[2] + '</span></button>';
        }).join('');
    }
    var level = document.getElementById('mw-level');
    if (level) level.value = mwView.level;
    var cat = document.getElementById('mw-category');
    if (cat) cat.value = mwView.category;
    var sort = document.getElementById('mw-sort');
    if (sort) sort.value = mwView.sort;
    var search = document.getElementById('mw-search');
    if (search && search.value !== mwView.q) search.value = mwView.q;
    var range = document.getElementById('mw-range');
    if (range) {
        range.classList.toggle('hidden', !mwView.range);
        range.innerHTML = mwView.range ? '<span>📅 ' + appEscape(mwView.range.label) + '</span><button type="button" onclick="mwClearRange()">✕ Show all dates</button>' : '';
    }
}

function mwRenderList() {
    var listEl = document.getElementById('mw-list');
    var actions = document.getElementById('mw-actions');
    if (!listEl) return;
    var list = mwFilteredWords();
    mwLastList = list;

    if (actions) {
        var scope = '';
        if (mwView.category !== 'all' || mwView.level !== 'all') {
            var c = mwChipCounts();
            var where = mwView.category !== 'all' && ALL_CATEGORIES[mwView.category] ? ALL_CATEGORIES[mwView.category].name : (mwView.level === 'a1' ? 'A1' : 'B1');
            scope = '<div class="mw-scope">Learned <b>' + c.learned + '</b> of ' + c.all + ' in ' + appEscape(where) + ' · ' + c.seen + ' seen</div>';
        }
        actions.innerHTML = scope + (list.length ?
            '<button type="button" class="btn btn-primary mw-practice-btn" onclick="mwPracticeList()">▶ Review these ' + list.length + ' as flashcards</button>' : '');
    }

    if (!list.length) {
        var msg;
        if (mwView.q) msg = 'No word matches "' + appEscape(mwView.q) + '" here.' + (mwView.state !== 'all' ? ' <button type="button" class="link-btn" onclick="mwSet(\'state\',\'all\')">Search all ' + ALL_WORDS.length + ' words</button>' : '');
        else if (mwView.state === 'seen' || mwView.state === 'learning') msg = 'No words here yet — study a few in Cards and they show up here, newest first.';
        else if (mwView.state === 'learned' || mwView.state === 'mastered') msg = 'Nothing yet. A word counts as learned once you have recalled it well enough to earn a 7-day gap (usually its 3rd good review).';
        else msg = 'No words match these filters.';
        listEl.innerHTML = '<div class="plan-empty-state">' + msg + '</div>';
        return;
    }

    var groupField = mwView.sort === 'seen' ? 'firstSeen' : (mwView.sort === 'learned' ? 'learnedAt' : null);
    var html = '';
    var lastGroup = null;
    var shown = list.slice(0, mwView.limit);
    var groupCounts = {};
    if (groupField) {
        list.forEach(function(w) {
            var p = wordProgress[w.id];
            var k = mwGroupKey(p, groupField);
            groupCounts[k] = (groupCounts[k] || 0) + 1;
        });
    }
    shown.forEach(function(w) {
        var p = wordProgress[w.id];
        if (groupField) {
            var k = mwGroupKey(p, groupField);
            if (k !== lastGroup) {
                var approx = p && p[groupField + 'Approx'];
                var label = k === '-' ? (groupField === 'learnedAt' ? 'Not learned yet' : 'Not started') :
                    (k === '?' ? 'Earlier · date unknown' : (approx ? '≈ ' : '') + mwDayHeader(k));
                html += '<div class="mw-group-header"><span>' + label + '</span><span>' + groupCounts[k] + '</span></div>';
                lastGroup = k;
            }
        }
        html += mwRowHtml(w, p);
    });
    if (list.length > shown.length) {
        html += '<button type="button" class="mw-more">Show more (' + shown.length + ' of ' + list.length + ')</button>';
    }
    listEl.innerHTML = html;
}

function mwGroupKey(p, field) {
    if (!p || !p[field]) return '-';
    if (p[field + 'Unknown']) return '?';
    return srsStudyDayKey(p[field]);
}

function mwRowHtml(w, p) {
    var st = wordState(w.id);
    var deClass = 'mw-de';
    if (w.type === 'noun' && w.gender && w.plural !== w.de) deClass += ' word-de-gender-' + w.gender;
    var pill = MW_STATE_LABEL[st];
    var meta;
    if (!p) meta = A1_WORD_IDS[w.id] ? 'A1' : 'B1';
    else if (mwView.sort === 'lapses') meta = (p.lapses || 0) + '× forgotten';
    else if (mwView.sort === 'learned' && p.learnedAt) meta = p.learnedAtUnknown ? 'learned (A1 app)' : 'learned ' + mwFormatDate(p.learnedAt, p.learnedAtApprox);
    else meta = mwNextReviewText(p);
    if (wordIsRelearning(w.id)) pill = 'Relearning';
    return '<div class="mw-row" data-id="' + w.id + '">' +
        '<div class="mw-row-main"><div class="' + deClass + '">' + appEscape(w.de) + (p && p.leech ? ' <span title="Often forgotten">🚩</span>' : '') + '</div>' +
        '<div class="mw-en">' + appEscape(w.en) + '</div></div>' +
        '<div class="mw-row-side"><span class="mw-pill mw-pill-' + (wordIsRelearning(w.id) ? 'relearning' : st) + '">' + pill + '</span>' +
        '<span class="mw-meta">' + appEscape(meta) + '</span></div>' +
    '</div>';
}

function mwPracticeList() {
    if (!mwLastList.length) return;
    var label = mwView.range ? mwView.range.label : ({ seen: 'My words', learning: 'Learning', learned: 'Learned words', mastered: 'Mastered words', 'new': 'Not started', all: 'All words' }[mwView.state] || 'My words');
    if (mwView.q) label += ' · "' + mwView.q + '"';
    startPracticeSession(mwLastList.map(function(w) { return w.id; }), label);
}

// ── Word detail sheet ──

var wordSheetId = null;

function openWordSheet(id) {
    var w = WORD_BY_ID[id];
    var sheet = document.getElementById('word-sheet');
    var body = document.getElementById('word-sheet-body');
    if (!w || !sheet || !body) return;
    wordSheetId = id;
    var p = wordProgress[id];
    var st = wordState(id);
    var cat = ALL_CATEGORIES[w.category];
    var html = '<div class="ws-top"><div class="ws-de' + (w.type === 'noun' && w.gender && w.plural !== w.de ? ' word-de-gender-' + w.gender : '') + '">' + appEscape(w.de) + '</div>' +
        '<button type="button" class="ws-speak" onclick="speakText(WORD_BY_ID[' + id + '].de, \'de-DE\', null)">🔊</button></div>' +
        '<div class="ws-en">' + appEscape(w.en) + '</div>' +
        '<div class="ws-tags"><span class="word-type-badge type-' + appEscape(w.type) + '">' + appEscape(w.type) + '</span>' +
        '<span class="ws-tag">' + (A1_WORD_IDS[id] ? 'A1' : 'B1') + '</span>' +
        (cat ? '<span class="ws-tag">' + cat.emoji + ' ' + appEscape(cat.name) + '</span>' : '') + '</div>';
    if (w.plural) html += '<div class="ws-line">Plural: ' + appEscape(w.plural) + '</div>';
    if (w.conjugation) {
        html += '<div class="ws-line ws-conj">' + Object.keys(w.conjugation).map(function(k) {
            return '<span>' + appEscape(k) + ': ' + appEscape(w.conjugation[k]) + '</span>';
        }).join('') + '</div>';
    }
    if (w.example && w.example.de) {
        html += '<div class="ws-example"><div>' + appEscape(w.example.de) +
            ' <button type="button" class="link-btn" onclick="speakText(WORD_BY_ID[' + id + '].example.de, \'de-DE\', null)">🔊</button></div>' +
            '<div class="ws-example-en">' + appEscape(w.example.en) + '</div></div>';
    }
    html += '<div class="ws-stats">';
    html += mwStatRow('Status', '<span class="mw-pill mw-pill-' + (wordIsRelearning(id) ? 'relearning' : st) + '">' + (wordIsRelearning(id) ? 'Relearning' : MW_STATE_LABEL[st]) + '</span>');
    if (p) {
        html += mwStatRow('First seen', mwFormatDate(p.firstSeen, p.firstSeenApprox, p.firstSeenUnknown));
        html += mwStatRow('Learned', p.learnedAt ? mwFormatDate(p.learnedAt, p.learnedAtApprox, p.learnedAtUnknown) + (p.source === 'manual' ? ' (marked by you)' : (p.source === 'legacy' ? ' (from the A1 app)' : '')) : 'not yet');
        html += mwStatRow('Last review', mwFormatDate(p.lastReviewed, p.lastReviewedApprox));
        html += mwStatRow('Next review', (p.due || 0) <= Date.now() ? 'due now' : mwFormatDate(p.due) + ' (' + mwNextReviewText(p).replace('next: ', '') + ')');
        var reps = p.reps || 0;
        html += mwStatRow('History', reps + ' good review' + (reps === 1 ? '' : 's') + ' · forgotten ' + (p.lapses || 0) + '× · gap ' + (p.intervalDays || 0) + ' d');
    }
    html += '</div><div class="ws-actions">';
    if (st === 'new' || st === 'learning') html += '<button type="button" class="btn btn-known" onclick="wordSheetAction(\'known\')">✓ I know this</button>';
    if (p && (p.due || 0) > Date.now()) html += '<button type="button" class="btn btn-learning" onclick="wordSheetAction(\'review\')">↺ Review again soon</button>';
    html += '</div>';
    if (p) html += '<button type="button" class="link-btn ws-reset" onclick="wordSheetAction(\'reset\')">Reset this word to "not started"</button>';
    body.innerHTML = html;
    sheet.classList.add('open');
}

function mwStatRow(label, value) {
    return '<div class="ws-stat"><span>' + label + '</span><span>' + value + '</span></div>';
}

function wordSheetAction(action) {
    var id = wordSheetId;
    var w = WORD_BY_ID[id];
    if (!w) return;
    if (action === 'known') markWordKnown(id);
    if (action === 'review') {
        var gap = wordProgress[id] ? wordProgress[id].intervalDays || 0 : 0;
        if (gap >= 3 && !confirm('Review "' + w.de + '" again soon? Its ' + gap + '-day gap starts over.')) return;
        markWordForReview(id);
    }
    if (action === 'reset') {
        if (!confirm('Reset "' + w.de + '"? Its review history is cleared and it goes back to "not started".')) return;
        resetWord(id);
    }
    updateIntroducedCounter();
    if (currentTab === 'words') renderMyWords();
    openWordSheet(id);
}

function closeWordSheet() {
    var sheet = document.getElementById('word-sheet');
    if (sheet) sheet.classList.remove('open');
    wordSheetId = null;
}

// ── Settings & backup ───────────────────────────────────────────
// Progress lives only in this phone's localStorage (the home-screen app
// has its own storage, separate from Safari). Export makes a file you can
// keep in Files/iCloud; import restores it on any device.

var LAST_BACKUP_KEY = 'last-backup-at';

function requestPersistentStorage() {
    try {
        if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().catch(function() {});
        }
    } catch (e) {}
}

function settingsOnEnter() {
    renderSettings();
}

function renderSettings() {
    var el = document.getElementById('settings-content');
    if (!el) return;
    var s = wordStats();
    var last = null;
    try { last = localStorage.getItem(LAST_BACKUP_KEY); } catch (e) {}
    el.innerHTML =
        '<div class="settings-card">' +
            '<div class="settings-title">App</div>' +
            '<div class="settings-row"><span>Version</span><span>' + appEscape(appVersion()) + '</span></div>' +
            '<button type="button" class="btn btn-good" onclick="forceUpdate(this)">Check for updates</button>' +
            '<p class="settings-note">Updates install by themselves whenever you open the app with internet. ' +
            '<b>Never delete the home-screen app to update it</b> — that erases all progress on this phone.</p>' +
        '</div>' +
        '<div class="settings-card">' +
            '<div class="settings-title">Backup</div>' +
            '<div class="settings-row"><span>Words seen / learned</span><span>' + s.seen + ' / ' + s.learnedEver + '</span></div>' +
            '<div class="settings-row"><span>Last backup</span><span>' + (last ? mwFormatDate(+last) : 'never') + '</span></div>' +
            '<div class="settings-row"><span>Storage</span><span id="settings-persist">checking…</span></div>' +
            '<button type="button" class="btn btn-good" onclick="exportBackup()">⬇ Export backup file</button>' +
            '<button type="button" class="btn btn-learning" onclick="document.getElementById(\'backup-file\').click()">⬆ Restore from backup file</button>' +
            '<input type="file" id="backup-file" accept=".json,application/json" class="hidden" onchange="importBackupFile(this)">' +
            '<button type="button" class="btn btn-known" onclick="exportWordsCsv()">📄 Export my words (CSV)</button>' +
            '<p class="settings-note">The backup has every word\'s history, your plan ticks, exam scores and the daily log. Your OpenAI key is never included.</p>' +
        '</div>';
    try {
        if (navigator.storage && navigator.storage.persisted) {
            navigator.storage.persisted().then(function(p) {
                var span = document.getElementById('settings-persist');
                if (span) span.textContent = p ? 'protected ✓' : 'not guaranteed — export a backup now and then';
            }).catch(function() {});
        } else {
            document.getElementById('settings-persist').textContent = 'export a backup now and then';
        }
    } catch (e) {}
}

function backupCollect() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k === 'openai_api_key') continue; // never put the API key in a file
        data[k] = localStorage.getItem(k);
    }
    return { app: 'deutsch-b1', format: 1, version: appVersion(), exportedAt: new Date().toISOString(), data: data };
}

// onSaved runs once the file was handed over (not when the share sheet is cancelled).
function backupSaveFile(filename, text, mime, onSaved) {
    var blob = new Blob([text], { type: mime });
    var file = null;
    try { file = new File([blob], filename, { type: mime }); } catch (e) {}
    // iOS: the share sheet ("Save to Files") is the reliable way out of a home-screen app.
    if (file && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: filename }).then(function() {
            if (onSaved) onSaved();
        }).catch(function() {});
        return;
    }
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() { URL.revokeObjectURL(url); a.parentNode.removeChild(a); }, 1500);
    if (onSaved) onSaved();
}

function exportBackup() {
    var json = JSON.stringify(backupCollect());
    backupSaveFile('deutsch-b1-backup-' + srsToday() + '.json', json, 'application/json', function() {
        try { localStorage.setItem(LAST_BACKUP_KEY, String(Date.now())); } catch (e) {}
        setTimeout(renderSettings, 300);
    });
}

function importBackupFile(input) {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function() { importBackupText(String(reader.result || '')); input.value = ''; };
    reader.readAsText(file);
}

function importBackupText(text) {
    var obj = null;
    try { obj = JSON.parse(text); } catch (e) {}
    if (!obj || obj.app !== 'deutsch-b1' || !obj.data || typeof obj.data !== 'object') {
        alert('That file is not a Deutsch B1 backup.');
        return;
    }
    // a1-* keys are the untouched originals from the A1 app: never overwritten.
    var keys = Object.keys(obj.data).filter(function(k) {
        return k.indexOf('a1-') !== 0 && k !== 'openai_api_key' && typeof obj.data[k] === 'string';
    });
    var words = 0;
    try { words = Object.keys(JSON.parse(obj.data[WORD_PROGRESS_KEY] || '{}')).length; } catch (e) {}
    var when = obj.exportedAt ? obj.exportedAt.slice(0, 10) : 'unknown date';
    if (!confirm('Restore the backup from ' + when + ' (' + words + ' words studied)?\n\nIt replaces the progress on this device.')) return;
    try {
        keys.forEach(function(k) { localStorage.setItem(k, obj.data[k]); });
    } catch (e) {
        alert('Restore failed: ' + e.message);
        return;
    }
    window.location.reload();
}

function csvCell(v) {
    var s = String(v === undefined || v === null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function exportWordsCsv() {
    var rows = [['german', 'english', 'type', 'level', 'topic', 'status', 'first_seen', 'learned_on', 'last_review', 'next_review', 'good_reviews', 'forgotten']];
    ALL_WORDS.forEach(function(w) {
        var p = wordProgress[w.id];
        if (!p) return;
        var day = function(ms) { return ms ? srsDayKey(ms) : ''; };
        rows.push([w.de, w.en, w.type, A1_WORD_IDS[w.id] ? 'A1' : 'B1', ALL_CATEGORIES[w.category] ? ALL_CATEGORIES[w.category].name : w.category,
            MW_STATE_LABEL[wordState(w.id)], day(p.firstSeen), day(p.learnedAt), day(p.lastReviewed), day(p.due), p.reps || 0, p.lapses || 0]);
    });
    var csv = '﻿' + rows.map(function(r) { return r.map(csvCell).join(','); }).join('\n');
    backupSaveFile('my-german-words-' + srsToday() + '.csv', csv, 'text/csv');
}

// ── Test Screen ────────────────────────────────────────────────

var testQuestions = [];
var testCurrentIndex = 0;
var testCorrectCount = 0;
var testTotalQuestions = 10;
var testAdvanceTimer = null;
var testGeneration = 0;   // bumped on every new test, so stale timers do nothing

// ── Hands-Free State ───────────────────────────────────────────
var handsFreeModeActive = false;  // toggled before test starts
var hfRecognition = null;         // single SpeechRecognition instance
var hfListenTimer = null;         // timeout for no-speech
var hfRetryCount = 0;             // retries per question (max 2)
var hfSpeechSupported = false;
var hfSession = 0;                // bumped on new test / leaving the tab: cancels pending speech chains
var hfListening = false;

function populateTestCategoryFilter() {
    var select = document.getElementById('test-category-filter');
    if (!select) return;
    var mine = document.createElement('option');
    mine.value = 'mywords';
    mine.textContent = '📖 My words (seen)';
    select.appendChild(mine);
    var learned = document.createElement('option');
    learned.value = 'learned';
    learned.textContent = '✓ Learned words';
    select.appendChild(learned);
    sortedCategoryIds().forEach(function(catId) {
        var opt = document.createElement('option');
        opt.value = catId;
        opt.textContent = ALL_CATEGORIES[catId].emoji + ' ' + ALL_CATEGORIES[catId].name;
        select.appendChild(opt);
    });
    select.addEventListener('change', function() {
        startTest();
    });
}

function testScreenActive() {
    var el = document.getElementById('test-screen');
    return !!(el && el.classList.contains('active'));
}

function testOnEnter(isReTap) {
    if (testQuestions.length === 0) { startTest(); return; }
    // Coming back mid-test in hands-free mode: read the open question again.
    var q = testQuestions[testCurrentIndex];
    if (handsFreeModeActive && q && !q.answered) showTestQuestion();
}

function testOnLeave() {
    hfSession++;
    stopHFListening();
}

function startTest() {
    testGeneration++;
    clearTimeout(testAdvanceTimer);
    hfSession++;
    stopHFListening();
    var category = document.getElementById('test-category-filter').value;
    var pool;
    if (category === 'all') {
        pool = ALL_WORDS.slice();
    } else if (category === 'mywords') {
        pool = ALL_WORDS.filter(function(w) { return !!wordProgress[w.id]; });
    } else if (category === 'learned') {
        pool = ALL_WORDS.filter(function(w) { return isWordLearned(w.id); });
    } else {
        pool = ALL_WORDS.filter(function(w) { return w.category === category; });
    }

    if (pool.length < 4) {
        testQuestions = [];
        testCurrentIndex = 0;
        testCorrectCount = 0;
        updateTestScore();
        document.getElementById('test-question').style.display = 'flex';
        document.getElementById('test-result').style.display = 'none';
        document.getElementById('test-prompt').textContent = category === 'mywords' || category === 'learned' ?
            'Not enough words yet — you need at least 4 here. Study a few more in Cards.' : 'Not enough words in this category';
        document.getElementById('test-options').innerHTML = '';
        return;
    }

    testQuestions = generateQuestions(pool, Math.min(testTotalQuestions, pool.length));
    testCurrentIndex = 0;
    testCorrectCount = 0;
    hfRetryCount = 0;

    // Sync hands-free state from toggle at test start
    if (hfSpeechSupported) {
        var toggle = document.getElementById('hands-free-toggle');
        handsFreeModeActive = toggle.checked;
    }

    document.getElementById('test-question').style.display = 'flex';
    document.getElementById('test-result').style.display = 'none';

    var testContent = document.querySelector('.test-content');
    if (handsFreeModeActive) {
        testContent.classList.add('hands-free-active');
    } else {
        testContent.classList.remove('hands-free-active');
    }

    updateTestScore();
    showTestQuestion();
}

// The meanings in a gloss: "car / (train) carriage" -> ['car', 'carriage'].
// Two words sharing one are never offered side by side as answer options.
function testSenses(en) {
    return String(en || '').toLowerCase().replace(/\([^)]*\)/g, '').split(/\s*[\/,;]\s*/).map(function(sense) {
        return sense.replace(/^(to|the|a|an)\s+/, '').trim();
    }).filter(Boolean);
}

function generateQuestions(pool, count) {
    var shuffled = shuffle(pool);
    var questions = [];

    for (var i = 0; i < count; i++) {
        var word = shuffled[i];
        // Randomly choose direction: de->en or en->de
        var direction = Math.random() < 0.5 ? 'de_to_en' : 'en_to_de';
        var field = direction === 'de_to_en' ? 'en' : 'de';
        var answer = String(word[field]).toLowerCase();

        // Distractors: prefer same type AND category, then same category, then
        // the whole pool -- never a synonym that shows the same text as the
        // answer (two "correct" buttons) and never two identical buttons.
        var wordSenses = testSenses(word.en);
        var usable = function(w) {
            if (w.id === word.id || w.en.toLowerCase() === word.en.toLowerCase() || w.de.toLowerCase() === word.de.toLowerCase()) return false;
            return !testSenses(w.en).some(function(sense) { return wordSenses.indexOf(sense) !== -1; });
        };
        var tiers = [
            pool.filter(function(w) { return usable(w) && w.category === word.category && w.type === word.type; }),
            pool.filter(function(w) { return usable(w) && w.category === word.category; }),
            pool.filter(usable),
            ALL_WORDS.filter(usable)
        ];
        var distractors = [];
        var seenText = {};
        seenText[answer] = true;
        for (var t = 0; t < tiers.length && distractors.length < 3; t++) {
            var cands = shuffle(tiers[t]);
            for (var c = 0; c < cands.length && distractors.length < 3; c++) {
                var text = String(cands[c][field]).toLowerCase();
                if (seenText[text]) continue;
                seenText[text] = true;
                distractors.push(cands[c]);
            }
        }

        var options = distractors.map(function(d) { return { text: d[field], correct: false }; });
        options.push({ text: word[field], correct: true });
        options = shuffle(options);

        questions.push({
            word: word,
            direction: direction,
            prompt: direction === 'de_to_en' ? word.de : word.en,
            directionLabel: direction === 'de_to_en' ? 'What does this mean in English?' : 'How do you say this in German?',
            options: options
        });
    }

    return questions;
}

function showTestQuestion() {
    if (testCurrentIndex >= testQuestions.length) {
        stopHFListening();
        showTestResult();
        return;
    }

    var q = testQuestions[testCurrentIndex];
    document.getElementById('test-prompt').innerHTML =
        '<span class="test-direction">' + q.directionLabel + '</span>' + appEscape(q.prompt);

    var optionsContainer = document.getElementById('test-options');
    optionsContainer.innerHTML = '';

    q.options.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        btn.className = 'test-option';
        btn.textContent = opt.text;
        btn.addEventListener('click', function() {
            if (handsFreeModeActive) stopHFListening();
            handleTestAnswer(opt.correct, btn, optionsContainer);
        });
        optionsContainer.appendChild(btn);
    });

    updateTestScore();

    if (handsFreeModeActive && testScreenActive()) {
        hfRetryCount = 0;
        var session = ++hfSession;
        speakQuestion(q, function() {
            if (session === hfSession) startHFListening();
        });
    }
}

// fromVoice: the hands-free caller speaks feedback and advances itself.
function handleTestAnswer(isCorrect, clickedBtn, container, fromVoice) {
    var q = testQuestions[testCurrentIndex];
    if (!q || q.answered) return;
    q.answered = true;
    // Disable all options
    var allBtns = container.querySelectorAll('.test-option');
    allBtns.forEach(function(b) { b.classList.add('disabled'); });

    if (isCorrect) {
        testCorrectCount++;
        clickedBtn.classList.add('correct');
    } else {
        clickedBtn.classList.add('wrong');
        // Highlight the correct answer
        allBtns.forEach(function(b, idx) {
            if (q.options[idx].correct) b.classList.add('correct');
        });
    }

    updateTestScore();

    // Auto-advance after delay (ignored if a new test started meanwhile)
    if (fromVoice) return;
    testAdvanceAfter(1200);
}

function testAdvanceAfter(ms) {
    var gen = testGeneration;
    clearTimeout(testAdvanceTimer);
    testAdvanceTimer = setTimeout(function() {
        if (gen !== testGeneration) return;
        testCurrentIndex++;
        showTestQuestion();
    }, ms);
}

// Speak hands-free feedback, then move on once it has been said.
function hfSpeakThenAdvance(text) {
    var session = hfSession;
    var gen = testGeneration;
    setTimeout(function() {
        if (gen !== testGeneration) return;
        if (session !== hfSession || !testScreenActive()) { testAdvanceAfter(0); return; }
        speakText(text, 'de-DE', function() {
            if (gen === testGeneration) testAdvanceAfter(500);
        });
    }, 300);
}

function updateTestScore() {
    document.getElementById('test-correct').textContent = testCorrectCount;
    document.getElementById('test-total').textContent = testQuestions.length;
    document.getElementById('test-progress').style.width =
        (testQuestions.length ? (testCurrentIndex / testQuestions.length * 100) : 0) + '%';
}

function showTestResult() {
    document.getElementById('test-question').style.display = 'none';
    document.getElementById('test-result').style.display = 'flex';
    document.getElementById('test-progress').style.width = '100%';

    var pct = Math.round(testCorrectCount / testQuestions.length * 100);
    var icon, message;
    if (pct >= 90) { icon = '🌟'; message = 'Excellent! Ausgezeichnet!'; }
    else if (pct >= 70) { icon = '👍'; message = 'Good job! Gut gemacht!'; }
    else if (pct >= 50) { icon = '💪'; message = 'Keep practicing! Weiter so!'; }
    else { icon = '📚'; message = 'Keep studying! Weiter lernen!'; }

    document.getElementById('test-result-icon').textContent = icon;
    document.getElementById('test-result-score').textContent = testCorrectCount + ' / ' + testQuestions.length + ' (' + pct + '%)';
    document.getElementById('test-result-message').textContent = message;

    var select = document.getElementById('test-category-filter');
    var catLabel = select && select.selectedIndex >= 0 ? select.options[select.selectedIndex].textContent : '';
    logWordEvent('tests', 'Word test ' + testCorrectCount + '/' + testQuestions.length + (catLabel ? ' · ' + catLabel : '') + ' · ' + new Date().toTimeString().slice(0, 5));
}

// ── Hands-Free Mode ────────────────────────────────────────────

function initHandsFree() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    hfSpeechSupported = true;
    var bar = document.getElementById('hands-free-bar');
    bar.classList.remove('hidden');

    var toggle = document.getElementById('hands-free-toggle');
    toggle.addEventListener('change', function() {
        handsFreeModeActive = toggle.checked;
        var content = document.querySelector('.test-content');
        if (content) content.classList.toggle('hands-free-active', handsFreeModeActive);
        if (!handsFreeModeActive) { hfSession++; stopHFListening(); return; }
        var q = testQuestions[testCurrentIndex];
        if (q && !q.answered && testScreenActive()) showTestQuestion();
    });

    hfRecognition = new SpeechRecognition();
    hfRecognition.continuous = false;
    hfRecognition.interimResults = false;

    hfRecognition.onresult = function(event) {
        if (!hfListening) return; // stopped meanwhile (new test, other tab)
        clearTimeout(hfListenTimer);
        var transcript = event.results[0][0].transcript;
        hfProcessVoiceInput(transcript);
    };

    hfRecognition.onerror = function(event) {
        if (event.error === 'no-speech' || event.error === 'aborted') return;
        if (!hfListening) return;
        clearTimeout(hfListenTimer);
        hfHandleNoMatch();
    };

    hfRecognition.onend = function() {
        // handled via onresult or timeout
    };
}

// TTS helpers

function speakText(text, lang, onDone) {
    if (!window.speechSynthesis) { if (onDone) onDone(); return; }
    if (typeof tracksPauseAudio === 'function') tracksPauseAudio();
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;

    var fired = false;
    var done = function() { if (!fired) { fired = true; if (onDone) onDone(); } };
    utterance.onend = done;
    utterance.onerror = done;
    setTimeout(done, Math.max(2000, text.length * 75 + 800));

    window.speechSynthesis.speak(utterance);
}

function speakQuestion(q, onDone) {
    var promptLang = q.direction === 'de_to_en' ? 'de-DE' : 'en-US';
    var optLang    = q.direction === 'de_to_en' ? 'en-US' : 'de-DE';
    var session = hfSession;
    if (typeof tracksPauseAudio === 'function') tracksPauseAudio();

    // Build chain: prompt → option A → option B → option C → option D → onDone
    var utterances = [];

    var promptU = new SpeechSynthesisUtterance(q.prompt);
    promptU.lang = promptLang;
    promptU.rate = 0.9;
    utterances.push(promptU);

    q.options.forEach(function(opt, idx) {
        var labels = ['Option A', 'Option B', 'Option C', 'Option D'];
        var u = new SpeechSynthesisUtterance(labels[idx] + ': ' + opt.text);
        u.lang = optLang;
        u.rate = 0.9;
        utterances.push(u);
    });

    // Chain via onend with per-utterance timeout fallback (iOS onend unreliable)
    var currentIdx = 0;
    var chainFired = false;

    function speakNext() {
        if (chainFired || session !== hfSession) return;
        if (currentIdx >= utterances.length) {
            chainFired = true;
            if (onDone) onDone();
            return;
        }
        var u = utterances[currentIdx];
        var uFired = false;
        var uDone = function() {
            if (!uFired) {
                uFired = true;
                currentIdx++;
                speakNext();
            }
        };
        u.onend = uDone;
        u.onerror = uDone;
        var ms = Math.max(1500, u.text.length * 75 + 600);
        setTimeout(uDone, ms);
        window.speechSynthesis.speak(u);
    }

    window.speechSynthesis.cancel();
    speakNext();
}

// Speech recognition helpers

function hfNormalize(str) {
    return String(str || '').toLowerCase().trim().replace(/[^a-z0-9äöüß\s]/g, '').replace(/\s+/g, ' ');
}

function hfStripArticle(str) {
    return str.replace(/^(der|die|das|ein|eine|the|a|an|to)\s+/, '');
}

// Best match, not the last substring hit: exact > same without article >
// option said inside a longer phrase (longest wins). "Option B" / "B" works too.
function matchVoiceToOption(transcript, q) {
    var norm = hfNormalize(transcript);
    if (!norm) return null;
    var letter = /^(?:option\s+)?([abcd])$/.exec(norm);
    if (letter) return 'abcd'.indexOf(letter[1]);
    var best = null;
    var bestScore = 0;
    q.options.forEach(function(opt, idx) {
        var optNorm = hfNormalize(opt.text);
        if (!optNorm) return;
        var score = 0;
        if (norm === optNorm) score = 10000;
        else if (hfStripArticle(norm) === hfStripArticle(optNorm)) score = 9000;
        else if ((' ' + norm + ' ').indexOf(' ' + optNorm + ' ') !== -1) score = 100 + optNorm.length;
        else if (norm.length >= 3 && (' ' + optNorm + ' ').indexOf(' ' + norm + ' ') !== -1) score = norm.length;
        if (score > bestScore) { bestScore = score; best = idx; }
    });
    return best; // index into q.options, or null
}

function startHFListening() {
    if (!hfSpeechSupported || !handsFreeModeActive || !testScreenActive()) return;
    var q = testQuestions[testCurrentIndex];
    if (!q || q.answered) return;
    var lang = q.direction === 'de_to_en' ? 'en-US' : 'de-DE';
    hfRecognition.lang = lang;

    var mic = document.getElementById('mic-indicator');
    mic.classList.remove('hidden');
    mic.querySelector('.mic-status').textContent = 'Listening…';

    hfListening = true;
    try { hfRecognition.start(); } catch(e) { /* already started */ }

    clearTimeout(hfListenTimer);
    hfListenTimer = setTimeout(function() {
        try { hfRecognition.stop(); } catch(e) {}
        if (hfListening) hfHandleNoMatch();
    }, 7000);
}

function stopHFListening() {
    hfListening = false;
    clearTimeout(hfListenTimer);
    var mic = document.getElementById('mic-indicator');
    if (mic) mic.classList.add('hidden');
    if (hfRecognition) { try { hfRecognition.stop(); } catch(e) {} }
}

function hfProcessVoiceInput(transcript) {
    stopHFListening();
    var q = testQuestions[testCurrentIndex];
    if (!q || q.answered) return;
    var matchIdx = matchVoiceToOption(transcript, q);
    var optionsContainer = document.getElementById('test-options');
    var btns = optionsContainer.querySelectorAll('.test-option');

    if (matchIdx !== null) {
        hfRetryCount = 0;
        handleTestAnswer(q.options[matchIdx].correct, btns[matchIdx], optionsContainer, true);
        hfSpeakThenAdvance(q.options[matchIdx].correct ? 'Richtig!' : 'Falsch — die Antwort ist ' + q.options.filter(function(o){return o.correct;})[0].text);
    } else {
        hfHandleNoMatch();
    }
}

function hfHandleNoMatch() {
    if (!testScreenActive()) { stopHFListening(); return; }
    var q = testQuestions[testCurrentIndex];
    if (!q || q.answered) return;
    hfRetryCount++;
    if (hfRetryCount > 2) {
        // Auto-skip
        hfRetryCount = 0;
        stopHFListening();
        var optionsContainer = document.getElementById('test-options');
        var btns = optionsContainer.querySelectorAll('.test-option');
        var correctIdx = 0;
        q.options.forEach(function(o, i) { if (o.correct) correctIdx = i; });
        handleTestAnswer(false, btns[correctIdx], optionsContainer, true);
        hfSpeakThenAdvance('Übersprungen — die Antwort ist ' + q.options[correctIdx].text);
    } else {
        var session = hfSession;
        stopHFListening();
        speakText('Bitte nochmal', 'de-DE', function() {
            if (session === hfSession) startHFListening();
        });
    }
}

// ── Scenes Screen ──────────────────────────────────────────────

var currentSpeechCard = null; // track which card is currently playing
var scenePlayId = 0;          // bumped on every play/stop: stale callbacks do nothing
var sceneGapTimer = null;

function sceneResetButton(card) {
    var btn = card ? card.querySelector('.scene-play-btn') : null;
    if (btn) {
        btn.textContent = '🔊 Play Conversation';
        btn.classList.remove('playing');
    }
}

function stopConversation() {
    scenePlayId++;
    clearTimeout(sceneGapTimer);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    sceneResetButton(currentSpeechCard);
    currentSpeechCard = null;
}

function scenesOnLeave() {
    stopConversation();
}

function playConversation(scenario, btn, card) {
    // If already playing this one, stop
    var wasPlaying = currentSpeechCard === card;
    stopConversation();
    if (wasPlaying) return;

    var playId = scenePlayId;
    if (typeof tracksPauseAudio === 'function') tracksPauseAudio();
    currentSpeechCard = card;
    btn.textContent = '⏹ Stop';
    btn.classList.add('playing');
    if (typeof dailyLogRecord === 'function') dailyLogRecord('scenes', scenario.title);

    var lines = scenario.lines.slice();
    var lineIndex = 0;

    function finish() {
        if (playId !== scenePlayId) return;
        sceneResetButton(card);
        currentSpeechCard = null;
    }

    function speakNext() {
        if (playId !== scenePlayId) return;
        if (lineIndex >= lines.length) { finish(); return; }

        var text = lines[lineIndex].de;
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        var advanced = false;
        var next = function() {
            if (advanced || playId !== scenePlayId) return;
            advanced = true;
            lineIndex++;
            sceneGapTimer = setTimeout(speakNext, 800);
        };
        utterance.onend = next;
        utterance.onerror = next;
        // iOS sometimes never fires onend; the queue keeps lines in order anyway
        setTimeout(next, Math.max(3000, text.length * 90 + 1500));
        window.speechSynthesis.speak(utterance);
    }

    speakNext();
}

function renderScenes() {
    var container = document.getElementById('scenes-content');
    container.innerHTML = '';

    var themeIds = Object.keys(ALL_SCENARIO_THEMES);

    themeIds.forEach(function(themeId) {
        var themeScenarios = ALL_SCENARIOS.filter(function(s) { return s.theme === themeId; });
        if (themeScenarios.length === 0) return;

        var group = document.createElement('div');
        group.className = 'scene-theme-group';

        var header = document.createElement('div');
        header.className = 'scene-theme-header';
        header.textContent = ALL_SCENARIO_THEMES[themeId].emoji + ' ' + ALL_SCENARIO_THEMES[themeId].name;
        group.appendChild(header);

        themeScenarios.forEach(function(scenario) {
            var card = document.createElement('div');
            card.className = 'scene-card';

            var cardHeader = document.createElement('div');
            cardHeader.className = 'scene-header';
            cardHeader.innerHTML =
                '<div><div class="scene-title">' + scenario.title + '</div>' +
                '<div class="scene-title-de">' + scenario.titleDe + '</div></div>' +
                '<span class="scene-chevron">▶</span>';
            cardHeader.addEventListener('click', function() {
                card.classList.toggle('open');
            });
            card.appendChild(cardHeader);

            var body = document.createElement('div');
            body.className = 'scene-body';

            scenario.lines.forEach(function(line) {
                var lineEl = document.createElement('div');
                lineEl.className = 'scene-line';
                lineEl.innerHTML =
                    '<div class="scene-speaker">' + line.speaker + '</div>' +
                    '<div class="scene-de">' + line.de + '</div>' +
                    '<div class="scene-en">' + line.en + '</div>';
                body.appendChild(lineEl);
            });

            // Play conversation button
            if ('speechSynthesis' in window) {
                var playBtn = document.createElement('button');
                playBtn.className = 'scene-play-btn';
                playBtn.textContent = '🔊 Play Conversation';
                (function(sc, pb, cd) {
                    playBtn.addEventListener('click', function() {
                        playConversation(sc, pb, cd);
                    });
                })(scenario, playBtn, card);
                body.appendChild(playBtn);
            }

            var toggleBtn = document.createElement('button');
            toggleBtn.className = 'scene-toggle-translation';
            toggleBtn.textContent = 'Show English Translation';
            toggleBtn.addEventListener('click', function() {
                card.classList.toggle('show-translation');
                toggleBtn.textContent = card.classList.contains('show-translation')
                    ? 'Hide English Translation'
                    : 'Show English Translation';
            });
            body.appendChild(toggleBtn);

            card.appendChild(body);
            group.appendChild(card);
        });

        container.appendChild(group);
    });
}

// ── Grammar Screen ──────────────────────────────────────────────

// ── Grammar progress (continuous learning) ───────────────────────
// Grammar isn't just a static reference: opening a chapter marks it
// reviewed (localStorage + the day's log), and the checkpoint quiz
// draws grammar questions only from chapters you've actually opened,
// so it gets broader as you read more -- same shape as new-card growth.

var GRAMMAR_PROGRESS_KEY = 'grammar-progress';

function grammarLoadProgress() {
    try { return JSON.parse(localStorage.getItem(GRAMMAR_PROGRESS_KEY) || '{}'); }
    catch (e) { return {}; }
}

function grammarMarkViewed(chapterId) {
    var data = grammarLoadProgress();
    if (data[chapterId]) return;
    data[chapterId] = { firstViewed: Date.now() };
    localStorage.setItem(GRAMMAR_PROGRESS_KEY, JSON.stringify(data));
    if (typeof dailyLogRecord === 'function') dailyLogRecord('grammar', chapterId);
}

function grammarViewedIds() {
    return Object.keys(grammarLoadProgress());
}

// Rendered once; visiting the tab only refreshes the counter and ticks,
// so chapters you left open stay open.
function grammarOnEnter() {
    grammarRefreshProgress();
}

function grammarRefreshProgress() {
    var viewed = grammarLoadProgress();
    var count = 0;
    ALL_GRAMMAR.forEach(function(s) { if (viewed[s.id]) count++; });
    var num = document.getElementById('grammar-viewed-count');
    if (num) num.textContent = count;
    var bar = document.getElementById('grammar-viewed-bar');
    if (bar) bar.style.width = (ALL_GRAMMAR.length ? (count / ALL_GRAMMAR.length * 100) : 0) + '%';
    document.querySelectorAll('#grammar-content .grammar-section').forEach(function(sec) {
        var header = sec.querySelector('.grammar-section-header');
        if (viewed[sec.getAttribute('data-id')] && header && !header.querySelector('.grammar-reviewed-badge')) {
            var badge = document.createElement('span');
            badge.className = 'grammar-reviewed-badge';
            badge.title = 'Reviewed';
            badge.innerHTML = '&#10003;';
            header.insertBefore(badge, header.querySelector('.chevron'));
        }
    });
}

// Open one chapter directly (used by links from the Plan).
function openGrammarChapter(id) {
    switchTab('grammar');
    var sec = document.querySelector('#grammar-content .grammar-section[data-id="' + id + '"]');
    if (!sec) return;
    sec.classList.add('open');
    grammarMarkViewed(id);
    grammarRefreshProgress();
    if (sec.scrollIntoView) sec.scrollIntoView({ block: 'start' });
}

function renderGrammar() {
    var container = document.getElementById('grammar-content');
    var openIds = {};
    container.querySelectorAll('.grammar-section.open').forEach(function(sec) { openIds[sec.getAttribute('data-id')] = true; });
    container.innerHTML = '';

    var progressEl = document.createElement('div');
    progressEl.className = 'progress-summary grammar-progress-summary';
    progressEl.innerHTML = '<span id="grammar-viewed-count">0</span> / ' + ALL_GRAMMAR.length + ' chapters reviewed';
    container.appendChild(progressEl);

    var progressBarWrap = document.createElement('div');
    progressBarWrap.className = 'progress-bar-container';
    var progressBar = document.createElement('div');
    progressBar.className = 'progress-fill';
    progressBar.id = 'grammar-viewed-bar';
    progressBarWrap.appendChild(progressBar);
    container.appendChild(progressBarWrap);

    ALL_GRAMMAR.forEach(function(section) {
        var sec = document.createElement('div');
        sec.className = 'grammar-section' + (openIds[section.id] ? ' open' : '');
        sec.setAttribute('data-id', section.id);

        var header = document.createElement('div');
        header.className = 'grammar-section-header';
        header.innerHTML = '<span class="emoji">' + section.emoji +
            '</span><span>' + section.title + '</span><span class="chevron">&#9654;</span>';
        header.addEventListener('click', function() {
            sec.classList.toggle('open');
            if (sec.classList.contains('open')) {
                grammarMarkViewed(section.id);
                grammarRefreshProgress();
            }
        });
        sec.appendChild(header);

        var body = document.createElement('div');
        body.className = 'grammar-section-body';

        section.content.forEach(function(item) {
            var el;
            switch (item.type) {
                case 'text':
                    el = document.createElement('p');
                    el.className = 'grammar-text';
                    el.textContent = item.value;
                    break;
                case 'heading':
                    el = document.createElement('h3');
                    el.className = 'grammar-heading';
                    el.textContent = item.value;
                    break;
                case 'table':
                    el = document.createElement('div');
                    el.style.overflowX = 'auto';
                    var table = document.createElement('table');
                    table.className = 'grammar-table';
                    var thead = '<thead><tr>' + item.headers.map(function(h) {
                        return '<th>' + h + '</th>';
                    }).join('') + '</tr></thead>';
                    var tbody = '<tbody>' + item.rows.map(function(row) {
                        return '<tr>' + row.map(function(cell) {
                            return '<td>' + cell + '</td>';
                        }).join('') + '</tr>';
                    }).join('') + '</tbody>';
                    table.innerHTML = thead + tbody;
                    el.appendChild(table);
                    break;
                case 'example':
                    el = document.createElement('div');
                    el.className = 'grammar-example';
                    el.innerHTML = '<div class="de">' + item.de + '</div><div class="en">' + item.en + '</div>';
                    break;
                case 'tip':
                    el = document.createElement('div');
                    el.className = 'grammar-tip';
                    el.textContent = '💡 ' + item.value;
                    break;
                default:
                    el = document.createElement('p');
                    el.textContent = JSON.stringify(item);
            }
            body.appendChild(el);
        });

        sec.appendChild(body);
        container.appendChild(sec);
    });
    grammarRefreshProgress();
}

// ── Progress / Storage ──────────────────────────────────────────
// 'word-progress' is the single live key for the unified deck. The old
// 'a1-word-progress' is seeded from once, then never written to again --
// it stays on disk untouched, byte-for-byte, as a permanent backup.

var WORD_PROGRESS_KEY = 'word-progress';
var WORD_SCHEMA_KEY = 'word-progress-schema';
var WORD_SCHEMA_VERSION = 2;

function loadProgress() {
    wordProgress = {};
    var saved = null;
    try {
        saved = localStorage.getItem(WORD_PROGRESS_KEY);
        if (saved) {
            var parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') wordProgress = parsed;
        } else {
            var legacy = localStorage.getItem('a1-word-progress');
            if (legacy) {
                var legacyParsed = JSON.parse(legacy);
                if (legacyParsed && typeof legacyParsed === 'object') wordProgress = legacyParsed;
                saveProgress();
            } else {
                // Migrate from the even older pre-SRS knownWords format
                // (the old key itself is left in place).
                var oldSaved = localStorage.getItem('a1-known-words');
                if (oldSaved) {
                    var oldIds = JSON.parse(oldSaved);
                    oldIds.forEach(function(id) {
                        wordProgress[id] = { level: 3, nextReview: Date.now() + 7 * DAY_MS };
                    });
                    saveProgress();
                }
            }
        }
    } catch (e) {
        // Keep the unreadable original instead of overwriting it later.
        if (saved) { try { localStorage.setItem('word-progress-unreadable', saved); } catch (e2) {} }
        wordProgress = {};
    }
    for (var id in wordProgress) {
        if (!wordProgress[id] || typeof wordProgress[id] !== 'object') delete wordProgress[id];
    }
    try {
        migrateWordProgress();
    } catch (e) {
        if (window.console) console.error('word-progress migration failed', e);
    }
}

// Schema 2 adds tracking dates to every studied word. Words studied before
// this existed get them reconstructed: from the daily log where it has the
// word, otherwise estimated from the SRS history (flagged *Approx, shown
// with "≈"). Words the A1 app counted as learned (level >= 1) stay learned.
function migrateWordProgress() {
    var schema = parseInt(localStorage.getItem(WORD_SCHEMA_KEY) || '0', 10);
    if (schema >= WORD_SCHEMA_VERSION) return;
    var raw = localStorage.getItem(WORD_PROGRESS_KEY);
    if (raw && !localStorage.getItem('word-progress-backup-v1')) {
        try { localStorage.setItem('word-progress-backup-v1', raw); } catch (e) {}
    }
    var now = Date.now();
    var log = {};
    var legacy = {};
    try { log = JSON.parse(localStorage.getItem('daily-log') || '{}') || {}; } catch (e) {}
    try { legacy = JSON.parse(localStorage.getItem('a1-word-progress') || '{}') || {}; } catch (e) {}
    var firstNewDay = {};
    var reviewDays = {};
    // The log records every new word from its first day on, so a word it
    // never lists as new was first seen before the log started.
    var logStart = Object.keys(log).sort()[0];
    var beforeLog = logStart ? srsAddDays(srsDayKeyToMs(logStart), -1) : null;
    Object.keys(log).sort().forEach(function(day) {
        var entry = log[day] || {};
        (entry.wordsNew || []).forEach(function(id) { if (!firstNewDay[id]) firstNewDay[id] = day; });
        (entry.wordsReview || []).forEach(function(id) { (reviewDays[id] = reviewDays[id] || []).push(day); });
    });

    Object.keys(wordProgress).forEach(function(id) {
        var p = srsMigrateCard(wordProgress[id]);
        var iv = p.intervalDays || 0;
        if (p.due) p.due = srsAtDayStart(p.due);
        if (!p.lastReviewed && p.due && (p.reps || p.level)) {
            p.lastReviewed = Math.min(now, iv > 0 ? p.due - iv * DAY_MS : now);
            p.lastReviewedApprox = true;
        }
        if (!p.firstSeen) {
            if (firstNewDay[id]) {
                p.firstSeen = srsDayKeyToMs(firstNewDay[id]);
            } else if (!p.lastReviewed) {
                // No date anywhere (e.g. an A1-app entry never reviewed): unknown.
                p.firstSeen = beforeLog || srsEstimateFirstSeen(p, now);
                p.firstSeenApprox = true;
                p.firstSeenUnknown = true;
            } else {
                p.firstSeen = srsEstimateFirstSeen(p, now);
                if (beforeLog !== null) p.firstSeen = Math.min(p.firstSeen, beforeLog);
                p.firstSeenApprox = true;
            }
        }
        if (p.lastReviewed && p.lastReviewed < p.firstSeen) p.lastReviewed = p.firstSeen;
        var lg = legacy[id];
        if (!p.learnedAt) {
            if (iv >= LEARNED_DAYS || (p.level || 0) >= LEARNED_THRESHOLD) {
                var later = (reviewDays[id] || []).filter(function(d) { return d > firstNewDay[id]; });
                if (firstNewDay[id] && later.length >= 2) {
                    p.learnedAt = srsDayKeyToMs(later[1]);
                } else {
                    p.learnedAt = (p.level || 0) >= LEARNED_THRESHOLD ?
                        Math.min(p.lastReviewed || now, p.firstSeen + 4 * DAY_MS) : (p.lastReviewed || now);
                    p.learnedAtApprox = true;
                }
            } else if (lg && typeof lg === 'object' && (lg.level || 0) >= 1) {
                var lgTime = lg.nextReview ? lg.nextReview - (SRS_INTERVALS[Math.min(lg.level, SRS_INTERVALS.length - 1)] || 0) * DAY_MS : 0;
                p.learnedAt = lgTime > 0 ? Math.min(lgTime, now) : p.firstSeen;
                p.learnedAtApprox = true;
                if (!(lgTime > 0)) p.learnedAtUnknown = true;
                p.source = 'legacy';
            }
        }
        if (!p.source) p.source = lg ? 'legacy' : 'srs';
        wordProgress[id] = p;
    });
    saveProgress();
    localStorage.setItem(WORD_SCHEMA_KEY, String(WORD_SCHEMA_VERSION));
}

// Same calendar day, at 04:00: old exact-time due dates join the day scheme.
function srsAtDayStart(ms) {
    var d = new Date(ms);
    d.setHours(SRS_DAY_START_HOUR, 0, 0, 0);
    return d.getTime();
}

// A card at level L was graded L times since its last lapse, with gaps of
// 1, 3, then ×ease days -- walking that back from the last review gives a
// (conservative) first-seen date.
function srsEstimateFirstSeen(p, now) {
    var planStart = typeof B1_KEY_DATES !== 'undefined' && B1_KEY_DATES.planStart ? srsDayKeyToMs(B1_KEY_DATES.planStart) : now;
    var t = p.lastReviewed || Math.min(planStart, now);
    var level = Math.min(p.level || 0, 12);
    var back = 0;
    var iv = 0;
    for (var k = 1; k < level; k++) {
        iv = k === 1 ? 1 : (k === 2 ? 3 : Math.round(iv * (p.ease || 2.5)));
        back += iv;
    }
    return srsDayStart(t - Math.min(back, 400) * DAY_MS);
}

function saveProgress() {
    try {
        localStorage.setItem(WORD_PROGRESS_KEY, JSON.stringify(wordProgress));
    } catch (e) {}
}

function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
        wordProgress = {};
        saveProgress();
        renderMyWords();
        cardsRebuild();
    }
}
