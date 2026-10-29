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

// words.js only has present-tense tables for its verbs; a1-verb-forms.js adds
// Präteritum and Perfekt in memory (words.js itself is never edited).
if (typeof A1_VERB_FORMS !== 'undefined') {
    WORDS.forEach(function(w) {
        var past = A1_VERB_FORMS[w.id];
        if (!past || w.type !== 'verb') return;
        var conj = {};
        var k;
        for (k in (w.conjugation || {})) conj[k] = w.conjugation[k];
        for (k in past) conj[k] = past[k];
        w.conjugation = conj;
    });
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

// Official Goethe list level of a word: "A1" | "A2" | "B1". words.js is the
// A1 course; B1_WORDS carry their own level (missing = "B1").
function wordLevel(w) {
    if (!w) return 'B1';
    if (A1_WORD_IDS[w.id]) return 'A1';
    return w.level === 'A1' || w.level === 'A2' ? w.level : 'B1';
}

// Gender colour of a noun ('m' / 'f' / 'n'), or null. Plural-only nouns get
// none: in B1_WORDS they have gender null, but words.js marks its own
// (die Eltern, die Leute) gender 'f' with plural === de. A B1 noun whose
// plural equals the singular (die SMS) is singular and keeps its colour.
// Every gender-coloured headword (card, sheet, lists, plan) uses this.
function wordGenderColor(w) {
    if (!w || w.type !== 'noun' || !w.gender) return null;
    if (w.plural === w.de && A1_WORD_IDS[w.id]) return null;
    return w.gender;
}

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
    closeTickView(true);
    var isReTap = currentTab === tabName;
    if (!isReTap && currentTab) {
        speechStop();
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
var cardsStale = false;   // My Words changed something: refresh the deck on the next visit
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

// refresh === true (after a change in My Words, see cardsInvalidate) keeps
// the running deck: the cards already done, so the progress bar stays, and
// the cards still ahead, this session's "Again" cards included.
function cardsRebuild(refresh) {
    var now = Date.now();
    refresh = refresh === true && cardsMode !== 'practice' && cardsHasCard();
    var done = refresh ? currentDeck.slice(0, currentIndex) : [];
    var ahead = refresh ? currentDeck.slice(currentIndex) : [];
    var inDeck = {};
    cardsBacklog = 0;
    if (cardsMode === 'practice') {
        currentDeck = shuffle(cardsPracticeIds.map(function(id) { return WORD_BY_ID[id]; }).filter(Boolean));
    } else if (cardsMode === 'mydeck') {
        // Refresh: ticked or reset words leave, newly studied ones go last.
        done.concat(ahead).forEach(function(w) { inDeck[w.id] = true; });
        currentDeck = done.concat(ahead.filter(cardsInMyDeck),
            shuffle(cardsWordPool().filter(function(w) { return !inDeck[w.id] && cardsInMyDeck(w); })));
    } else {
        // Ticked words have progress, so they never come in as new cards;
        // their spot checks are left out while "known-checks" is off.
        var checks = knownChecksEnabled();
        // Refresh: a card still ahead stays unless it is a ticked word whose
        // check isn't due (it was just ticked, or checks went off).
        ahead = ahead.filter(function(w) {
            var p = wordProgress[w.id];
            if (p && p.known && (!checks || (p.due || 0) > now)) return false;
            inDeck[w.id] = true;
            return true;
        });
        var aheadReviews = ahead.filter(function(w) { return !!wordProgress[w.id]; }).length;
        var due = [];
        var checksDue = [];
        var fresh = [];
        // "Core only" limits which new words come in; reviews of words
        // already studied always show.
        var coreOnly = coreOnlyEnabled() && hasFreqData();
        cardsWordPool().forEach(function(w) {
            if (inDeck[w.id]) return;
            var prog = wordProgress[w.id];
            if (!prog) { if (!coreOnly || w.freq !== 2) fresh.push(w); }
            else if ((prog.due || 0) <= now) {
                if (!prog.known) due.push(w);
                else if (checks) checksDue.push(w);
            }
        });
        var byDue = function(a, b) { return (wordProgress[a.id].due || 0) - (wordProgress[b.id].due || 0); };
        due.sort(byDue);
        checksDue.sort(byDue);

        // Respect the daily review cap; while a backlog of overdue reviews is
        // left over, don't pile new words on top of it. Spot checks of ticked
        // words only take the review slots left over: they never push a real
        // review out, and never hold back new words.
        var todayCounts = srsTodayCounts();
        var reviewsLeft = Math.max(0, srsReviewCap() - todayCounts.reviews - aheadReviews);
        var overdue = Math.max(0, due.length - reviewsLeft);
        due = due.slice(0, reviewsLeft);
        var checkSlots = reviewsLeft - due.length;
        cardsBacklog = overdue + Math.max(0, checksDue.length - checkSlots);
        due = due.concat(checksDue.slice(0, checkSlots)).sort(byDue);
        var newLeft = overdue > 0 ? 0 : Math.max(0, srsNewPerDay() - todayCounts['new'] - (ahead.length - aheadReviews));
        var newSlice = shuffle(srsOrderNew(fresh).slice(0, newLeft));
        currentDeck = done.concat(ahead, due, newSlice);
    }
    currentIndex = done.length;
    isFlipped = false;
    cardsDeckDay = srsToday();
    cardsStale = false;
    cardsRenderModeBar();
    updateIntroducedCounter();
    showCurrentCard();
}

// My Deck is every word studied in cards; words ticked as known stay out
// (they were never studied here -- the Known list in My Words has them).
function cardsInMyDeck(w) {
    var p = wordProgress[w.id];
    return !!p && !p.known;
}

// The Today deck is built once per study day. After words are ticked,
// unticked, sent back to review or reset (or the checks setting changes)
// it is refreshed on the next visit -- cardsRebuild(true) -- so a word
// ticked in My Words never turns up as a new card from a deck built
// before, and the session's "Again" cards and progress are kept.
function cardsInvalidate() {
    if (cardsMode !== 'practice') cardsStale = true;
}

// New words come easiest-first: all of A1 in its lesson order, then the
// B1 list by frequency and official level -- core A1/A2 words, core B1,
// the other A1/A2 words, the other B1 words -- and regional (A/CH) words
// last. Not a random draw from the whole list.
function srsOrderNew(words) {
    function rank(w) {
        if (A1_WORD_IDS[w.id]) return 0;
        if (w.region) return 5;
        var basic = wordLevel(w) !== 'B1';
        if (w.freq !== 2) return basic ? 1 : 2;
        return basic ? 3 : 4;
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
    } else if (cardsStale && cardsMode !== 'practice') {
        cardsRebuild(true);
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
        cardsWordPool().forEach(function(w) { if (cardsInMyDeck(w)) n++; });
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
    var checks = knownChecksEnabled();
    ALL_WORDS.forEach(function(w) {
        var p = wordProgress[w.id];
        if (p && w.category !== cardsCategory() && (p.due || 0) <= now && (checks || !p.known)) n++;
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
    var text = 'You know ' + s.learnedEver + ' · ' + s['new'] + ' new';
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

// A word's usage note ("mit Absicht = on purpose"), small under the
// translation on the card back. index.html has no slot for it, so the
// element is added next to the translation the first time it is needed.
function cardsNoteEl() {
    var el = document.getElementById('card-note');
    if (el) return el;
    var tr = document.getElementById('card-translation');
    el = document.createElement('div');
    el.id = 'card-note';
    el.className = 'card-note';
    tr.parentNode.insertBefore(el, tr.nextSibling);
    return el;
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
    cardsNoteEl().textContent = '';
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
    var gender = wordGenderColor(word);
    if (gender) cardFront.classList.add('gender-' + gender);

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
            // A ticked word coming back for its spot check says so.
            var st = prog.known ? 'known' : (wordIsRelearning(word.id) ? 'relearning' : wordState(word.id));
            var dots = '';
            for (var i = 0; i < 5; i++) dots += i < level ? '●' : '○';
            levelEl.innerHTML = '<span class="card-state card-state-' + st + '">' + (st === 'known' ? 'Known · check' : st) + '</span>' + dots;
        }
        levelEl.className = 'card-level level-' + level;
    }

    document.getElementById('card-hint').textContent = 'Tap to flip';

    // Back side
    document.getElementById('card-translation').textContent = word.en;
    cardsNoteEl().textContent = word.note || '';
    document.getElementById('card-example-de').textContent = word.example ? word.example.de : '';
    document.getElementById('card-example-en').textContent = word.example ? word.example.en : '';

    // Details (plural for nouns, conjugation for verbs)
    var details = '';
    if (word.type === 'noun' && word.plural) {
        details = 'Plural: ' + word.plural;
    } else if (word.type === 'verb' && word.conjugation) {
        details = conjugationParts(word.conjugation).join(' | ');
    }
    document.getElementById('card-details').textContent = details;

    document.getElementById('session-progress').style.width = ((currentIndex + 1) / currentDeck.length * 100) + '%';
    cardsUpdateCounter();
}

// "ich bin · du bist · … | Präteritum: war | Perfekt: ist gewesen" -- present
// forms first (A1 tables have six, B1 verbs just the er-form), then the past.
var CONJ_PAST_LABELS = { 'präteritum': 'Präteritum', 'perfekt': 'Perfekt' };

function conjugationParts(conj) {
    var present = [];
    var past = [];
    Object.keys(conj || {}).forEach(function(k) {
        if (CONJ_PAST_LABELS[k]) past.push(CONJ_PAST_LABELS[k] + ': ' + conj[k]);
        else present.push(k + ' ' + conj[k]);
    });
    return (present.length ? [present.join(' · ')] : []).concat(past);
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
    speechStop();
}

// Front: the word. Back: the word, then its example sentence.
function speakCurrentWord() {
    if (!cardsHasCard()) return;
    var word = currentDeck[currentIndex];
    var gen = ++cardsSpeakGen;
    if (isFlipped && word.example && word.example.de) {
        speakText(word.de, 'de-DE', function(how) {
            // 'stopped': the app was hidden or other audio started -- no example then.
            if (how === 'stopped' || document.visibilityState === 'hidden') return;
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

// "Check ticked words now and then": ticked words come back in Today on
// their spot-check day. Off ('0'), due ticked words are left out of the deck.
var KNOWN_CHECKS_KEY = 'known-checks';

function knownChecksEnabled() {
    try { return localStorage.getItem(KNOWN_CHECKS_KEY) !== '0'; } catch (e) { return true; }
}

function setKnownChecks(on) {
    var wasOn = knownChecksEnabled();
    try { localStorage.setItem(KNOWN_CHECKS_KEY, on ? '1' : '0'); } catch (e) {}
    if (on && !wasOn) knownChecksRespread();
    cardsInvalidate();
}

// Switched back on after a while: the checks that fell due meanwhile are
// spread over the coming days, oldest first -- at least KNOWN_CHECKS_PER_DAY
// a day, over three months at most -- instead of all landing in one deck.
var KNOWN_CHECKS_PER_DAY = 5;

function knownChecksRespread() {
    var now = Date.now();
    var ids = Object.keys(wordProgress).filter(function(id) {
        var p = wordProgress[id];
        return WORD_BY_ID[id] && p && typeof p === 'object' && p.known && (p.due || 0) <= now;
    });
    if (ids.length <= KNOWN_CHECKS_PER_DAY) return;
    ids.sort(function(a, b) { return (wordProgress[a].due || 0) - (wordProgress[b].due || 0) || a - b; });
    var perDay = Math.max(KNOWN_CHECKS_PER_DAY, Math.ceil(ids.length / 91));
    ids.forEach(function(id, i) {
        var day = Math.floor(i / perDay);
        if (day) wordProgress[id].due = srsDueDate(day, now);
    });
    saveProgress();
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
    var wasKnown = !!(existing && existing.known);
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
        if (wasKnown && grade === 'again') {
            // A ticked word you didn't know after all: an ordinary learning
            // card from now on (knownAt stays as history).
            delete prog.known;
            delete prog.knownReps;
            delete prog.knownPrev;
        }
        // Ticked words keep no firstSeen/learnedAt of their own: the charts
        // and the plan pace measure learning in cards, not ticking.
        if (!prog.firstSeen && !prog.knownAt) prog.firstSeen = now;
        if (!prog.source) prog.source = 'srs';
        prog.lastReviewed = now;
        delete prog.lastReviewedApprox;
        if (!prog.known && !prog.learnedAt && prog.intervalDays >= LEARNED_DAYS) prog.learnedAt = now;
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
// A word ticked as known (wordIsKnown) counts as 'learned' here; wordStats
// counts it separately as 'known' so the learned/mastered numbers stay
// about learning in cards.

function wordState(id) {
    var p = wordProgress[id];
    if (!p || typeof p !== 'object') return 'new';
    if (p.known) return 'learned';
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
    if (!p || p.known || !p.learnedAt || (p.intervalDays || 0) >= LEARNED_DAYS) return false;
    return !!(p.relearning || p.lapses > 0);
}

function wordIsKnown(id) {
    var p = wordProgress[id];
    return !!(p && typeof p === 'object' && p.known);
}

// new + learning + learned + mastered + known === total. learned and
// mastered are words learned in cards; learnedEver ("words you know") also
// counts the ticked ones.
function wordStats() {
    var now = Date.now();
    var todayStart = srsStudyDayStart(now);
    var checks = knownChecksEnabled();
    var s = { total: ALL_WORDS.length, seen: 0, 'new': 0, learning: 0, learned: 0, mastered: 0, known: 0,
              learnedEver: 0, newToday: 0, learnedToday: 0, dueNow: 0 };
    ALL_WORDS.forEach(function(w) {
        var p = wordProgress[w.id];
        var st = p && typeof p === 'object' && p.known ? 'known' : wordState(w.id);
        s[st]++;
        if (st === 'new') return;
        s.seen++;
        if (st !== 'learning') s.learnedEver++;
        if (p.firstSeen >= todayStart) s.newToday++;
        if (p.learnedAt >= todayStart) s.learnedToday++;
        if ((p.due || 0) <= now && (checks || !p.known)) s.dueNow++;
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
// Words ticked as known in the window (by knownAt; a ticked word forgotten
// later keeps its knownAt, like learnedAt stays once learned).
function wordsKnownBetween(fromMs, toMs) { return wordsFieldBetween('knownAt', fromMs, toMs); }

function isWordLearned(wordId) {
    var st = wordState(wordId);
    return st === 'learned' || st === 'mastered';
}

function getLearnedCount() {
    return wordStats().learnedEver;
}

// "I know this": a new or still-learning word is ticked as known (see
// wordTickKnown). A word already learned in cards keeps the older
// behaviour: promoted to a 7-day gap without throwing away any history.
function markWordKnown(id) {
    if (wordIsKnown(id)) return;
    var st = wordState(id);
    if (st === 'new' || st === 'learning') { wordTickKnown(id); return; }
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

// ── Ticking words you already know ──
// Ticking stores, inside the word's normal 'word-progress' entry:
//   known: true, knownAt, knownReps (reps at tick time) and knownPrev (a
//   copy of the entry before the tick, null if there was none),
// and schedules a spot check 30-120 days out. Unticking before any review
// puts knownPrev back exactly; after a review the known* fields go and the
// word is due for review now (see wordUnmarkCore).

// Spot-check gap, spread by id: a batch of 600 ticks comes back a few
// words a day over three months instead of all on one day.
function wordKnownGap(id) {
    return 30 + ((+id * 37) % 91);
}

function wordTickCore(id, now) {
    if (!WORD_BY_ID[id]) return false;
    var existing = wordProgress[id];
    if (existing && existing.known) return false;
    var prev = existing ? JSON.parse(JSON.stringify(existing)) : null;
    var p = existing ? srsMigrateCard(existing) : { level: 0, ease: 2.5, reps: 0, lapses: 0, intervalDays: 0, source: 'known' };
    var gap = wordKnownGap(id);
    p.known = true;
    p.knownAt = now;
    p.knownReps = p.reps || 0;
    p.knownPrev = prev;
    p.level = Math.max(p.level || 0, LEARNED_THRESHOLD);
    if (!p.ease) p.ease = 2.5;
    p.intervalDays = gap;
    p.due = srsDueDate(gap, now);
    wordProgress[id] = p;
    return true;
}

function wordUnmarkCore(id) {
    var p = wordProgress[id];
    if (!p || typeof p !== 'object' || !p.known) return false;
    if ((p.reps || 0) === (p.knownReps || 0) && p.hasOwnProperty('knownPrev')) {
        if (p.knownPrev && typeof p.knownPrev === 'object') wordProgress[id] = p.knownPrev;
        else delete wordProgress[id];
    } else {
        // Checked since the tick: "I don't know it" sends the word back to
        // review now, like "Review again soon" -- it must not keep the long
        // gap it earned as a ticked word. reps/lapses stay as history; a
        // word that was only ever ticked was first seen in its spot check.
        var now = Date.now();
        delete p.known;
        delete p.knownAt;
        delete p.knownReps;
        delete p.knownPrev;
        if (!p.firstSeen) p.firstSeen = p.lastReviewed || now;
        if (p.learnedAt) p.relearning = true;
        p.level = 0;
        p.intervalDays = 0;
        p.due = now;
    }
    return true;
}

// Batch versions save once and log once: "Tick all" on 200 words is one write.
function wordTickKnownMany(ids) {
    var now = Date.now();
    var done = (ids || []).filter(function(id) { return wordTickCore(id, now); });
    if (!done.length) return done;
    saveProgress();
    if (typeof dailyLogRecordMany === 'function') dailyLogRecordMany('wordsKnown', done);
    else done.forEach(function(id) { logWordEvent('wordsKnown', id); });
    cardsInvalidate();
    return done;
}

function wordUnmarkKnownMany(ids) {
    var done = (ids || []).filter(wordUnmarkCore);
    if (!done.length) return done;
    saveProgress();
    if (typeof dailyLogRemove === 'function') dailyLogRemove('wordsKnown', done);
    cardsInvalidate();
    return done;
}

function wordTickKnown(id) {
    return wordTickKnownMany([id]).length > 0;
}

function wordUnmarkKnown(id) {
    return wordUnmarkKnownMany([id]).length > 0;
}

// "Review again soon": back into today's reviews, history kept. A ticked
// word sent back to review is an ordinary card from then on.
function markWordForReview(id) {
    var p = wordProgress[id];
    if (!p) return;
    p = srsMigrateCard(p);
    delete p.known;
    delete p.knownReps;
    delete p.knownPrev;
    if (p.learnedAt) p.relearning = true;
    p.level = 0;
    p.intervalDays = 0;
    p.due = Date.now();
    wordProgress[id] = p;
    saveProgress();
    cardsInvalidate();
}

function resetWord(id) {
    delete wordProgress[id];
    saveProgress();
    cardsInvalidate();
}

// ── My Words ────────────────────────────────────────────────────
// The tracker of everything studied: what you learned and when, what's
// next, searchable, filterable, and one tap away from a flashcard review.

var MYWORDS_VIEW_KEY = 'mywords-view';
var MW_PAGE = 120;
var mwView = { q: '', state: 'seen', level: 'all', category: 'all', sort: 'seen', range: null, limit: MW_PAGE };
var mwSearchKeys = null;
var mwLastList = [];
var MW_STATE_LABEL = { 'new': 'New', learning: 'Learning', learned: 'Learned', mastered: 'Mastered', known: 'Known' };
var MW_LEVELS = ['a1', 'a2', 'b1'];
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
        if (saved.level === 'all' || MW_LEVELS.indexOf(saved.level) !== -1) mwView.level = saved.level;
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

// "today" / "yesterday" / "on 28 Oct", for sentences.
function mwOnDate(ms) {
    var label = mwFormatDate(ms);
    return label === 'today' || label === 'yesterday' || label === 'tomorrow' ? label : 'on ' + label;
}

// The state My Words shows: wordState, with ticked words as 'known'.
function mwState(id) {
    return wordIsKnown(id) ? 'known' : wordState(id);
}

// The date a word became one of "my words": first seen in cards, or ticked.
function mwSeenTime(p, field) {
    return p ? (p[field] || p.knownAt || 0) : 0;
}

function mwStateMatches(state, st) {
    if (state === 'seen') return st !== 'new';
    if (state === 'known') return st === 'known';
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
    if (v.level !== 'all' && wordLevel(w).toLowerCase() !== v.level) return false;
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
        return mwMatches(w, mwState(w.id));
    });
    var sort = mwView.sort;
    function field(w, f) { var p = wordProgress[w.id]; return p && p[f] ? p[f] : 0; }
    // Ticked words have no firstSeen/learnedAt: they sort by the day they were ticked.
    function seenAt(w, f) { return mwSeenTime(wordProgress[w.id], f); }
    // With the checks off a ticked word has no next review: it sorts last.
    var checks = knownChecksEnabled();
    function dueAt(w) { var p = wordProgress[w.id]; return p && (checks || !p.known) ? field(w, 'due') : Infinity; }
    list.sort(function(a, b) {
        if (sort === 'learned') return (seenAt(b, 'learnedAt') - seenAt(a, 'learnedAt')) || (seenAt(b, 'firstSeen') - seenAt(a, 'firstSeen'));
        if (sort === 'due') {
            var da = dueAt(a);
            var db = dueAt(b);
            return da === db ? a._order - b._order : (da < db ? -1 : 1);
        }
        if (sort === 'az') return mwNorm(a.de).localeCompare(mwNorm(b.de));
        if (sort === 'lapses') return (field(b, 'lapses') - field(a, 'lapses')) || (field(b, 'lastReviewed') - field(a, 'lastReviewed'));
        if (sort === 'order') return a._order - b._order;
        return (seenAt(b, 'firstSeen') - seenAt(a, 'firstSeen')) || (a._order - b._order);
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
            '<select id="mw-level"><option value="all">All levels</option><option value="a1">A1</option><option value="a2">A2</option><option value="b1">B1</option></select>' +
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
    // Big number: every word you know, ticked or learned in cards.
    el.innerHTML =
        '<div class="mw-hero">' +
            '<div class="mw-hero-main"><span class="mw-hero-num">' + s.learnedEver + '</span>' +
                '<span class="mw-hero-label">words you know<br><span class="mw-hero-of">of ' + s.total + ' · ' + s['new'] + ' new · ' + s.learning + ' learning</span></span></div>' +
            '<div class="mw-stack">' +
                '<span class="mw-stack-known" style="width:' + pct(s.known) + '%"></span>' +
                '<span class="mw-stack-mastered" style="width:' + pct(s.mastered) + '%"></span>' +
                '<span class="mw-stack-learned" style="width:' + pct(s.learned) + '%"></span>' +
                '<span class="mw-stack-learning" style="width:' + pct(s.learning) + '%"></span>' +
            '</div>' +
            '<div class="mw-legend">' +
                '<span><i class="mw-dot mw-dot-known"></i>Ticked as known ' + s.known + '</span>' +
                '<span><i class="mw-dot mw-dot-learned"></i>Learned in cards ' + s.learned + '</span>' +
                '<span><i class="mw-dot mw-dot-mastered"></i>Mastered ' + s.mastered + '</span>' +
                '<span><i class="mw-dot mw-dot-learning"></i>Learning ' + s.learning + '</span>' +
                '<span><i class="mw-dot mw-dot-new"></i>New ' + s['new'] + '</span>' +
            '</div>' +
            '<div class="mw-today">' +
                '<button type="button" onclick="openMyWords({range:\'today\'})"><b>+' + s.newToday + '</b> new today</button>' +
                '<button type="button" onclick="openMyWords({range:\'today\',by:\'learned\'})"><b>+' + s.learnedToday + '</b> learned today</button>' +
                '<button type="button" onclick="mwReviewDue()"><b>' + s.dueNow + '</b> due now</button>' +
            '</div>' +
        '</div>' +
        '<button type="button" class="mw-tick-entry" onclick="openTickView(\'new\')">' +
            '<span class="mw-tick-entry-icon" aria-hidden="true">✓</span>' +
            '<span class="mw-tick-entry-text"><b>Tick the words you already know</b>' +
                '<span id="mw-tick-new">' + s['new'] + ' word' + (s['new'] === 1 ? '' : 's') + ' still new' +
                (s.known ? ' · ' + s.known + ' ticked' : '') + '</span></span>' +
            '<span class="mw-tick-entry-chev" aria-hidden="true">›</span>' +
        '</button>';
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
// learned = learned in cards (incl. mastered); known = ticked as known.
function mwChipCounts() {
    var c = { seen: 0, known: 0, learning: 0, learned: 0, mastered: 0, 'new': 0, all: 0 };
    ALL_WORDS.forEach(function(w) {
        if (!mwBaseMatches(w)) return;
        var st = mwState(w.id);
        c.all++;
        if (st === 'new') { c['new']++; return; }
        c.seen++;
        if (st === 'known') c.known++;
        else if (st === 'learning') c.learning++;
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
            ['seen', 'My words', c.seen], ['known', 'Known', c.known], ['new', 'New', c['new']],
            ['learning', 'Learning', c.learning], ['learned', 'Learned', c.learned],
            ['mastered', 'Mastered', c.mastered], ['all', 'All', c.all]
        ];
        chips.innerHTML = defs.map(function(d) {
            return '<button type="button" class="mw-chip' + (mwView.state === d[0] ? ' active' : '') +
                '" onclick="mwSet(\'state\',\'' + d[0] + '\')">' + d[1] + ' <span>' + d[2] + '</span></button>';
        }).join('');
        // Keep the active chip in view in the sideways-scrolling row.
        var act = chips.querySelector('.mw-chip.active');
        if (act) {
            var a = act.getBoundingClientRect();
            var box = chips.getBoundingClientRect();
            if (a.left < box.left || a.right > box.right) chips.scrollLeft += a.left - box.left - 16;
        }
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
            var where = mwView.category !== 'all' && ALL_CATEGORIES[mwView.category] ? ALL_CATEGORIES[mwView.category].name : mwView.level.toUpperCase();
            scope = '<div class="mw-scope">You know <b>' + (c.known + c.learned) + '</b> of ' + c.all + ' in ' + appEscape(where) +
                ' · ' + c.known + ' ticked · ' + c['new'] + ' new</div>';
        }
        actions.innerHTML = scope + (list.length ?
            '<button type="button" class="btn btn-primary mw-practice-btn" onclick="mwPracticeList()">▶ Review these ' + list.length + ' as flashcards</button>' : '');
    }

    if (!list.length) {
        var msg;
        if (mwView.q) msg = 'No word matches "' + appEscape(mwView.q) + '" here.' + (mwView.state !== 'all' ? ' <button type="button" class="link-btn" onclick="mwSet(\'state\',\'all\')">Search all ' + ALL_WORDS.length + ' words</button>' : '');
        else if (mwView.state === 'known') msg = 'No words ticked as known here yet. <button type="button" class="link-btn" onclick="openTickView(\'new\')">Tick the words you already know</button> — it takes a few minutes and they skip the new-word queue.';
        else if (mwView.state === 'new') msg = 'No new words left here — every word is known or in your cards. 🎉';
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
                var approx = p && p[groupField] && p[groupField + 'Approx'];
                var label = k === '-' ? (groupField === 'learnedAt' ? 'Not learned yet' : 'New') :
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
    var t = mwSeenTime(p, field);
    if (!t) return '-';
    if (p[field] && p[field + 'Unknown']) return '?';
    return srsStudyDayKey(t);
}

function mwRowHtml(w, p) {
    var st = mwState(w.id);
    var deClass = 'mw-de';
    var gender = wordGenderColor(w);
    if (gender) deClass += ' word-de-gender-' + gender;
    var pill = MW_STATE_LABEL[st];
    var meta;
    if (!p) meta = wordLevel(w);
    else if (mwView.sort === 'lapses') meta = (p.lapses || 0) + '× forgotten';
    else if (st === 'known' && mwView.sort === 'due') meta = knownChecksEnabled() ? mwNextReviewText(p).replace('next:', 'check:') : 'check: off';
    else if (st === 'known') meta = 'ticked ' + mwFormatDate(p.knownAt);
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
    var label = mwView.range ? mwView.range.label : ({ seen: 'My words', known: 'Known words', learning: 'Learning', learned: 'Learned words', mastered: 'Mastered words', 'new': 'New words', all: 'All words' }[mwView.state] || 'My words');
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
    var known = wordIsKnown(id);
    var cat = ALL_CATEGORIES[w.category];
    var gender = wordGenderColor(w);
    var html = '<div class="ws-top"><div class="ws-de' + (gender ? ' word-de-gender-' + gender : '') + '">' + appEscape(w.de) + '</div>' +
        '<button type="button" class="ws-speak" onclick="speakText(WORD_BY_ID[' + id + '].de, \'de-DE\', null)">🔊</button></div>' +
        '<div class="ws-en">' + appEscape(w.en) + '</div>' +
        (w.note ? '<div class="ws-note">' + appEscape(w.note) + '</div>' : '') +
        '<div class="ws-tags"><span class="word-type-badge type-' + appEscape(w.type) + '">' + appEscape(w.type) + '</span>' +
        '<span class="ws-tag">' + wordLevel(w) + '</span>' +
        (cat ? '<span class="ws-tag">' + cat.emoji + ' ' + appEscape(cat.name) + '</span>' : '') + '</div>';
    if (w.plural) html += '<div class="ws-line">Plural: ' + appEscape(w.plural) + '</div>';
    if (w.conjugation) {
        html += '<div class="ws-line ws-conj">' + conjugationParts(w.conjugation).map(function(part) {
            return '<span>' + appEscape(part) + '</span>';
        }).join('') + '</div>';
    }
    if (w.example && w.example.de) {
        html += '<div class="ws-example"><div>' + appEscape(w.example.de) +
            ' <button type="button" class="link-btn" onclick="speakText(WORD_BY_ID[' + id + '].example.de, \'de-DE\', null)">🔊</button></div>' +
            '<div class="ws-example-en">' + appEscape(w.example.en) + '</div></div>';
    }
    if (known) {
        html += '<div class="ws-known-note">✓ Ticked as known ' + appEscape(mwOnDate(p.knownAt)) + '</div>';
    }
    var pillSt = known ? 'known' : (wordIsRelearning(id) ? 'relearning' : st);
    html += '<div class="ws-stats">';
    html += mwStatRow('Status', '<span class="mw-pill mw-pill-' + pillSt + '">' + (pillSt === 'relearning' ? 'Relearning' : MW_STATE_LABEL[pillSt]) + '</span>');
    if (p) {
        if (p.knownAt && !known) html += mwStatRow('Ticked as known', mwFormatDate(p.knownAt) + ' (forgotten since)');
        if (p.firstSeen || !p.knownAt) html += mwStatRow('First seen', mwFormatDate(p.firstSeen, p.firstSeenApprox, p.firstSeenUnknown));
        if (!known || p.learnedAt) html += mwStatRow('Learned', p.learnedAt ? mwFormatDate(p.learnedAt, p.learnedAtApprox, p.learnedAtUnknown) + (p.source === 'manual' ? ' (marked by you)' : (p.source === 'legacy' ? ' (from the A1 app)' : '')) : 'not yet');
        html += mwStatRow('Last review', mwFormatDate(p.lastReviewed, p.lastReviewedApprox));
        if (known && !knownChecksEnabled()) html += mwStatRow('Quick check', 'off (Settings)');
        else html += mwStatRow(known ? 'Quick check' : 'Next review', (p.due || 0) <= Date.now() ? 'due now' : mwFormatDate(p.due) + ' (' + mwNextReviewText(p).replace('next: ', '') + ')');
        var reps = p.reps || 0;
        html += mwStatRow('History', reps + ' good review' + (reps === 1 ? '' : 's') + ' · forgotten ' + (p.lapses || 0) + '× · gap ' + (p.intervalDays || 0) + ' d');
    }
    html += '</div><div class="ws-actions">';
    if (known) html += '<button type="button" class="btn btn-learning" onclick="wordSheetAction(\'unknown\')">Untick — I don\'t know it</button>';
    else if (st === 'new' || st === 'learning') html += '<button type="button" class="btn btn-known" onclick="wordSheetAction(\'known\')">✓ I know this</button>';
    if (p && !known && (p.due || 0) > Date.now()) html += '<button type="button" class="btn btn-learning" onclick="wordSheetAction(\'review\')">↺ Review again soon</button>';
    html += '</div>';
    if (p) html += '<button type="button" class="link-btn ws-reset" onclick="wordSheetAction(\'reset\')">Reset this word to "new"</button>';
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
    if (action === 'unknown') wordUnmarkKnown(id);
    if (action === 'review') {
        var gap = wordProgress[id] ? wordProgress[id].intervalDays || 0 : 0;
        if (gap >= 3 && !confirm('Review "' + w.de + '" again soon? Its ' + gap + '-day gap starts over.')) return;
        markWordForReview(id);
    }
    if (action === 'reset') {
        if (!confirm('Reset "' + w.de + '"? Its review history is cleared and it goes back to "new".')) return;
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

// ── Tick what you know ──
// A full-screen sorting list over the whole word list: one tap ticks a word
// as known (it skips the new-word queue, see wordTickKnown), another tap
// unticks it. A ticked row stays where it is until the filters change, so
// a mis-tap is undone by tapping again. Rows are rendered in chunks and a
// tap only touches its own row, its group header and the counters.

var TICK_VIEW_KEY = 'tick-view';
var TV_PAGE = 150;
var tvState = { seg: 'new', level: 'all', category: 'all', core: false, en: true, q: '' };
var tvList = [];       // words of the current segment + filters, in display order
var tvGroups = {};     // topic id -> { ids: [...] } for the current list
var tvShown = 0;
var tvUndo = null;     // { ids, timer } of the last "Tick all"
var tvReady = false;

function tvLoadPrefs() {
    try {
        var saved = JSON.parse(localStorage.getItem(TICK_VIEW_KEY) || '{}') || {};
        if (typeof saved.en === 'boolean') tvState.en = saved.en;
        if (typeof saved.core === 'boolean') tvState.core = saved.core;
    } catch (e) {}
}

function tvSavePrefs() {
    try { localStorage.setItem(TICK_VIEW_KEY, JSON.stringify({ en: tvState.en, core: tvState.core })); } catch (e) {}
}

function tickViewOpen() {
    var el = document.getElementById('tick-view');
    return !!el && el.classList.contains('open');
}

function openTickView(seg) {
    var el = document.getElementById('tick-view');
    if (!el) return;
    closeWordSheet();
    if (!tvReady) {
        tvLoadPrefs();
        tvBuildShell(el);
        tvReady = true;
    }
    tvState.seg = seg === 'known' ? 'known' : 'new';
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    tvRender();
    document.getElementById('tv-body').scrollTop = 0;
}

// silent: the caller re-renders (switchTab), so My Words isn't redrawn twice.
function closeTickView(silent) {
    var el = document.getElementById('tick-view');
    if (!el || !el.classList.contains('open')) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    tvHideToast();
    if (silent) return;
    updateIntroducedCounter();
    if (currentTab === 'words') renderMyWords();
}

function tvBuildShell(el) {
    var catOptions = '<option value="all">All topics</option>' + sortedCategoryIds().map(function(id) {
        return '<option value="' + appEscape(id) + '">' + ALL_CATEGORIES[id].emoji + ' ' + appEscape(ALL_CATEGORIES[id].name) + '</option>';
    }).join('');
    var levels = [['all', 'All'], ['a1', 'A1'], ['a2', 'A2'], ['b1', 'B1']];
    el.innerHTML =
        '<div class="tv-head">' +
            '<div class="tv-title-row"><h2 class="tv-title">Tick what you know</h2>' +
                '<button type="button" class="tv-done" onclick="closeTickView()">Done</button></div>' +
            '<div class="seg tv-seg" id="tv-seg">' +
                '<button type="button" data-seg="new">To sort <span class="seg-count" id="tv-count-new"></span></button>' +
                '<button type="button" data-seg="known">✓ Known <span class="seg-count" id="tv-count-known"></span></button>' +
            '</div>' +
            '<div class="tv-progress" id="tv-progress"></div>' +
            '<div class="mw-stack tv-stack" id="tv-stack"></div>' +
        '</div>' +
        '<div class="tv-body" id="tv-body">' +
            '<p class="tv-intro">Tap every word you already know. Ticked words skip the new-word queue; a few come back for a quick check in 1–4 months.</p>' +
            '<input type="search" id="tv-search" class="mw-search" placeholder="Search German or English…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search">' +
            '<div class="tv-filters">' +
                '<div class="tv-levels" id="tv-levels">' + levels.map(function(l) {
                    return '<button type="button" class="mw-chip" data-level="' + l[0] + '">' + l[1] + '</button>';
                }).join('') + '</div>' +
                '<select id="tv-category" aria-label="Topic">' + catOptions + '</select>' +
            '</div>' +
            '<div class="tv-toggles">' +
                '<button type="button" class="tv-toggle" id="tv-core" aria-pressed="false">Core words only</button>' +
                '<button type="button" class="tv-toggle" id="tv-en" aria-pressed="true">Show English</button>' +
            '</div>' +
            '<div class="tv-list" id="tv-list"></div>' +
        '</div>' +
        '<div class="tv-toast hidden" id="tv-toast" role="status"><span id="tv-toast-text"></span>' +
            '<button type="button" onclick="tvUndoLast()">Undo</button></div>';

    document.getElementById('tv-seg').addEventListener('click', function(e) {
        var b = e.target.closest ? e.target.closest('button[data-seg]') : null;
        if (!b || b.getAttribute('data-seg') === tvState.seg) return;
        tvState.seg = b.getAttribute('data-seg');
        tvRender();
        document.getElementById('tv-body').scrollTop = 0;
    });
    document.getElementById('tv-levels').addEventListener('click', function(e) {
        var b = e.target.closest ? e.target.closest('button[data-level]') : null;
        if (!b) return;
        tvState.level = b.getAttribute('data-level');
        tvRender();
    });
    document.getElementById('tv-category').addEventListener('change', function() {
        tvState.category = this.value;
        tvRender();
    });
    document.getElementById('tv-core').addEventListener('click', function() {
        tvState.core = !tvState.core;
        tvSavePrefs();
        tvRender();
    });
    // English on/off only hides text: no re-render, ticked rows stay put.
    document.getElementById('tv-en').addEventListener('click', function() {
        tvState.en = !tvState.en;
        tvSavePrefs();
        tvRenderControls();
    });
    var search = document.getElementById('tv-search');
    var searchTimer = null;
    search.addEventListener('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            tvState.q = search.value;
            tvRender();
        }, 150);
    });
    search.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') search.blur();
    });
    var list = document.getElementById('tv-list');
    list.addEventListener('click', function(e) {
        if (!e.target.closest) return;
        if (e.target.closest('.tv-more')) { tvRenderMore(); return; }
        var all = e.target.closest('.tv-tick-all');
        if (all) { tvTickGroup(all.getAttribute('data-g')); return; }
        var row = e.target.closest('.tv-row');
        if (!row) return;
        if (e.target.closest('.tv-reveal')) { row.classList.toggle('revealed'); return; }
        tvToggleRow(row);
    });
    list.addEventListener('keydown', function(e) {
        var row = e.target;
        if ((e.key === ' ' || e.key === 'Enter') && row.classList && row.classList.contains('tv-row')) {
            e.preventDefault();
            tvToggleRow(row);
        }
    });
}

// Level, topic, core and search -- everything except the segment.
function tvBaseMatches(w, q) {
    var s = tvState;
    if (s.level !== 'all' && wordLevel(w).toLowerCase() !== s.level) return false;
    if (s.category !== 'all' && w.category !== s.category) return false;
    if (s.core && w.freq === 2) return false;
    if (q && mwSearchKey(w).indexOf(q) === -1) return false;
    return true;
}

function tvGroupKey(w) {
    return ALL_CATEGORIES[w.category] ? w.category : '_other';
}

// To sort = words not started at all; Known = words ticked as known. Grouped
// by topic (A-Z, like the topic menus), course order within a topic.
function tvBuildList() {
    var q = mwNorm(tvState.q);
    var wantKnown = tvState.seg === 'known';
    var words = srsOrderNew(ALL_WORDS.filter(function(w) {
        if (!tvBaseMatches(w, q)) return false;
        return wantKnown ? wordIsKnown(w.id) : !wordProgress[w.id];
    }));
    tvGroups = {};
    words.forEach(function(w) {
        var key = tvGroupKey(w);
        if (!tvGroups[key]) tvGroups[key] = { ids: [] };
        tvGroups[key].ids.push(w.id);
    });
    var order = sortedCategoryIds().filter(function(k) { return !!tvGroups[k]; });
    if (tvGroups._other) order.push('_other');
    tvList = [];
    order.forEach(function(k) {
        tvGroups[k].ids.forEach(function(id) { tvList.push(WORD_BY_ID[id]); });
    });
}

function tvRender() {
    var listEl = document.getElementById('tv-list');
    if (!listEl) return;
    tvBuildList();
    tvShown = 0;
    listEl.innerHTML = '';
    if (!tvList.length) {
        var msg;
        if (tvState.q) msg = 'No ' + (tvState.seg === 'known' ? 'ticked' : 'new') + ' word matches "' + appEscape(tvState.q) + '" here.';
        else if (tvState.seg === 'known') msg = 'Nothing ticked here yet. Switch to <b>To sort</b> and tap the words you know.';
        else msg = 'Nothing left to sort here 🎉<br>Every word in this selection is known or already in your cards.';
        listEl.innerHTML = '<div class="plan-empty-state">' + msg + '</div>';
    } else {
        tvRenderMore();
    }
    tvRenderControls();
    tvUpdateCounters();
}

// Appends the next chunk of rows; a topic split across chunks keeps one header.
function tvRenderMore() {
    var listEl = document.getElementById('tv-list');
    var oldMore = listEl.querySelector('.tv-more');
    if (oldMore) oldMore.parentNode.removeChild(oldMore);
    var end = Math.min(tvList.length, tvShown + TV_PAGE);
    var parts = [];
    for (var i = tvShown; i < end; i++) {
        var key = tvGroupKey(tvList[i]);
        if (!parts.length || parts[parts.length - 1].key !== key) parts.push({ key: key, html: '' });
        parts[parts.length - 1].html += tvRowHtml(tvList[i]);
    }
    parts.forEach(function(part) {
        var group = listEl.querySelector('.tv-group[data-g="' + part.key + '"]');
        if (group) group.insertAdjacentHTML('beforeend', part.html);
        else listEl.insertAdjacentHTML('beforeend', '<div class="tv-group" data-g="' + appEscape(part.key) + '">' + tvGroupHeaderHtml(part.key) + part.html + '</div>');
    });
    tvShown = end;
    if (end < tvList.length) {
        listEl.insertAdjacentHTML('beforeend', '<button type="button" class="mw-more tv-more">Show more (' + end + ' of ' + tvList.length + ')</button>');
    }
}

function tvGroupName(key) {
    var cat = ALL_CATEGORIES[key];
    return cat ? cat.name : 'Other';
}

function tvGroupKnown(key) {
    var g = tvGroups[key];
    var k = 0;
    if (g) g.ids.forEach(function(id) { if (wordIsKnown(id)) k++; });
    return k;
}

function tvGroupHeaderHtml(key) {
    var cat = ALL_CATEGORIES[key];
    var n = tvGroups[key] ? tvGroups[key].ids.length : 0;
    var k = tvGroupKnown(key);
    return '<div class="tv-group-header">' +
        '<span class="tv-group-name">' + (cat ? cat.emoji + ' ' : '') + appEscape(tvGroupName(key)) + '</span>' +
        '<span class="tv-group-count">' + k + ' of ' + n + ' known</span>' +
        '<button type="button" class="tv-tick-all' + (k >= n ? ' hidden' : '') + '" data-g="' + appEscape(key) + '">Tick all</button>' +
    '</div>';
}

function tvRowHtml(w) {
    var known = wordIsKnown(w.id);
    var deClass = 'tv-de';
    var gender = wordGenderColor(w);
    if (gender) deClass += ' word-de-gender-' + gender;
    return '<div class="tv-row' + (known ? ' is-known' : '') + '" data-id="' + w.id + '" role="checkbox" aria-checked="' + known + '" tabindex="0">' +
        '<span class="tv-tick" aria-hidden="true"></span>' +
        '<span class="tv-main"><span class="' + deClass + '" lang="de">' + appEscape(w.de) + '</span>' +
            '<span class="tv-en">' + appEscape(w.en) + '</span></span>' +
        '<button type="button" class="tv-reveal" tabindex="-1" aria-label="Show English">EN</button>' +
    '</div>';
}

function tvRenderControls() {
    var seg = document.getElementById('tv-seg');
    if (!seg) return;
    var btns = seg.querySelectorAll('button[data-seg]');
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle('active', btns[i].getAttribute('data-seg') === tvState.seg);
    var lv = document.querySelectorAll('#tv-levels button');
    for (var j = 0; j < lv.length; j++) lv[j].classList.toggle('active', lv[j].getAttribute('data-level') === tvState.level);
    document.getElementById('tv-category').value = tvState.category;
    var core = document.getElementById('tv-core');
    core.classList.toggle('on', tvState.core);
    core.setAttribute('aria-pressed', tvState.core ? 'true' : 'false');
    var en = document.getElementById('tv-en');
    en.classList.toggle('on', tvState.en);
    en.setAttribute('aria-pressed', tvState.en ? 'true' : 'false');
    document.getElementById('tv-list').classList.toggle('tv-hide-en', !tvState.en);
    var search = document.getElementById('tv-search');
    if (search.value !== tvState.q) search.value = tvState.q;
}

// Counts for the current level/topic/core/search filter, both segments.
function tvUpdateCounters() {
    var q = mwNorm(tvState.q);
    var c = { known: 0, learned: 0, learning: 0, 'new': 0, all: 0 };
    ALL_WORDS.forEach(function(w) {
        if (!tvBaseMatches(w, q)) return;
        var st = mwState(w.id);
        c.all++;
        if (st === 'mastered') st = 'learned';
        c[st]++;
    });
    var cn = document.getElementById('tv-count-new');
    if (!cn) return;
    cn.textContent = c['new'];
    document.getElementById('tv-count-known').textContent = c.known;
    var parts = ['<span class="tv-p-known">Known <b>' + c.known + '</b></span>'];
    if (c.learned) parts.push('<span class="tv-p-learned">Learned <b>' + c.learned + '</b></span>');
    parts.push('<span class="tv-p-learning">Learning <b>' + c.learning + '</b></span>');
    parts.push('<span class="tv-p-new">New <b>' + c['new'] + '</b></span>');
    document.getElementById('tv-progress').innerHTML = parts.join(' · ');
    var pct = function(n) { return c.all ? (n / c.all * 100) : 0; };
    document.getElementById('tv-stack').innerHTML =
        '<span class="mw-stack-known" style="width:' + pct(c.known) + '%"></span>' +
        '<span class="mw-stack-learned" style="width:' + pct(c.learned) + '%"></span>' +
        '<span class="mw-stack-learning" style="width:' + pct(c.learning) + '%"></span>';
}

// Re-reads the state of the given words into their rows and group headers.
function tvAfterChange(ids) {
    var listEl = document.getElementById('tv-list');
    if (!listEl) return;
    var want = {};
    var groups = {};
    ids.forEach(function(id) {
        want[String(id)] = true;
        if (WORD_BY_ID[id]) groups[tvGroupKey(WORD_BY_ID[id])] = true;
    });
    var rows = ids.length > 20 ? listEl.querySelectorAll('.tv-row') :
        ids.map(function(id) { return listEl.querySelector('.tv-row[data-id="' + id + '"]'); });
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!row || !want[row.getAttribute('data-id')]) continue;
        var known = wordIsKnown(+row.getAttribute('data-id'));
        row.classList.toggle('is-known', known);
        row.setAttribute('aria-checked', known ? 'true' : 'false');
    }
    Object.keys(groups).forEach(function(key) {
        var header = listEl.querySelector('.tv-group[data-g="' + key + '"] .tv-group-header');
        if (!header || !tvGroups[key]) return;
        var k = tvGroupKnown(key);
        var n = tvGroups[key].ids.length;
        header.querySelector('.tv-group-count').textContent = k + ' of ' + n + ' known';
        header.querySelector('.tv-tick-all').classList.toggle('hidden', k >= n);
    });
    tvUpdateCounters();
}

function tvToggleRow(row) {
    var id = +row.getAttribute('data-id');
    if (!WORD_BY_ID[id]) return;
    if (wordIsKnown(id)) wordUnmarkKnown(id);
    else wordTickKnown(id);
    tvAfterChange([id]);
}

function tvTickGroup(key) {
    var g = tvGroups[key];
    if (!g) return;
    var ids = g.ids.filter(function(id) { return !wordIsKnown(id); });
    if (!ids.length) return;
    if (!confirm('Tick all ' + ids.length + ' word' + (ids.length === 1 ? '' : 's') + ' in ' + tvGroupName(key) + ' as known?')) return;
    var done = wordTickKnownMany(ids);
    tvAfterChange(done);
    tvShowToast('Ticked ' + done.length, done);
}

function tvShowToast(text, ids) {
    var toast = document.getElementById('tv-toast');
    if (!toast) return;
    if (tvUndo) clearTimeout(tvUndo.timer);
    tvUndo = { ids: ids, timer: setTimeout(tvHideToast, 8000) };
    document.getElementById('tv-toast-text').textContent = text;
    toast.classList.remove('hidden');
}

function tvHideToast() {
    if (tvUndo) clearTimeout(tvUndo.timer);
    tvUndo = null;
    var toast = document.getElementById('tv-toast');
    if (toast) toast.classList.add('hidden');
}

// Undo of "Tick all": each word goes back to exactly what it was before.
function tvUndoLast() {
    if (!tvUndo) return;
    var ids = tvUndo.ids;
    tvHideToast();
    tvAfterChange(wordUnmarkKnownMany(ids));
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
            '<div class="settings-title">Words</div>' +
            '<div class="settings-row"><span>Words you know</span><span>' + s.known + ' ticked + ' + (s.learned + s.mastered) + ' learned</span></div>' +
            '<label class="settings-switch"><span>Check ticked words now and then</span>' +
                '<span class="toggle-switch"><input type="checkbox" id="known-checks-toggle"' + (knownChecksEnabled() ? ' checked' : '') +
                ' onchange="setKnownChecks(this.checked)"><span class="toggle-track"><span class="toggle-thumb"></span></span></span></label>' +
            '<p class="settings-note">On: each ticked word comes back once in Today after 1–4 months as a quick check — a few a day. Off: ticked words never show up in your cards.</p>' +
            '<button type="button" class="btn btn-known" onclick="openMyWords(); openTickView(\'new\')">✓ Tick the words you already know</button>' +
        '</div>' +
        '<div class="settings-card">' +
            '<div class="settings-title">Backup</div>' +
            '<div class="settings-row"><span>Words seen / you know</span><span>' + s.seen + ' / ' + s.learnedEver + '</span></div>' +
            '<div class="settings-row"><span>Last backup</span><span>' + (last ? mwFormatDate(+last) : 'never') + '</span></div>' +
            '<div class="settings-row"><span>Storage</span><span id="settings-persist">checking…</span></div>' +
            '<button type="button" class="btn btn-good" onclick="exportBackup()">⬇ Export backup file</button>' +
            '<button type="button" class="btn btn-learning" onclick="document.getElementById(\'backup-file\').click()">⬆ Restore from backup file</button>' +
            '<input type="file" id="backup-file" accept=".json,application/json" class="hidden" onchange="importBackupFile(this)">' +
            '<button type="button" class="btn btn-known" onclick="exportWordsCsv()">📄 Export my words (CSV)</button>' +
            '<p class="settings-note">The backup has every word\'s history, your plan ticks, exam scores and the daily log. Your OpenAI key is never included.</p>' +
        '</div>';
    speechCheckMount(el);
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
    var rows = [['german', 'english', 'note', 'type', 'level', 'topic', 'status', 'first_seen', 'learned_on', 'last_review', 'next_review', 'good_reviews', 'forgotten', 'known', 'known_on']];
    ALL_WORDS.forEach(function(w) {
        var p = wordProgress[w.id];
        if (!p) return;
        var day = function(ms) { return ms ? srsDayKey(ms) : ''; };
        rows.push([w.de, w.en, w.note || '', w.type, wordLevel(w), ALL_CATEGORIES[w.category] ? ALL_CATEGORIES[w.category].name : w.category,
            MW_STATE_LABEL[mwState(w.id)], day(p.firstSeen), day(p.learnedAt), day(p.lastReviewed), day(p.due), p.reps || 0, p.lapses || 0,
            p.known ? 'yes' : '', day(p.knownAt)]);
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
    learned.textContent = '✓ Words you know';
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
// Punctuation and the gap a "(someone)" leaves don't count: "Pardon?" is
// "Pardon", and "to wake (someone) up" is "wake up".
function testSenses(en) {
    return String(en || '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[!?.…]/g, '').split(/\s*[\/,;]\s*/).map(function(sense) {
        return sense.replace(/\s+/g, ' ').trim().replace(/^(to|the|a|an) /, '');
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

    if (hfCanRun()) {
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

var hfVoiceOff = '';       // why voice answers are off ('' = on); a tap on the note's 🎤 retries
var hfVoiceTried = false;  // the learner tapped 🎤 despite a "blocked" Speech check
var hfNeedTap = false;     // iOS refused a start that wasn't a tap: each listen needs a tap
var hfFromTap = false;     // the current listen was started by a tap

function initHandsFree() {
    document.addEventListener('visibilitychange', hfOnVisibility);
    var SpeechRecognition = speechRecCtor();
    // (One recognizer for the whole test; a constructor that throws must not
    // stop the rest of init.)
    if (SpeechRecognition) {
        try { hfRecognition = new SpeechRecognition(); } catch (e) { hfRecognition = null; }
    }
    if (!hfRecognition) { speechAdaptRefresh(); return; }

    hfSpeechSupported = true;
    var bar = document.getElementById('hands-free-bar');
    bar.classList.remove('hidden');
    speechAdaptRefresh();

    var toggle = document.getElementById('hands-free-toggle');
    toggle.addEventListener('change', function() {
        handsFreeModeActive = toggle.checked;
        var content = document.querySelector('.test-content');
        if (content) content.classList.toggle('hands-free-active', handsFreeModeActive);
        if (!handsFreeModeActive) { hfSession++; stopHFListening(); return; }
        var q = testQuestions[testCurrentIndex];
        if (q && !q.answered && testScreenActive()) showTestQuestion();
    });

    // continuous=false: one answer per listen (continuous is unreliable on iOS).
    hfRecognition.continuous = false;
    hfRecognition.interimResults = false;

    hfRecognition.onresult = function(event) {
        if (!hfListening) return; // stopped meanwhile (new test, other tab)
        var transcript = '';
        try { transcript = event.results[0][0].transcript; } catch (e) {}
        if (!transcript) return;
        clearTimeout(hfListenTimer);
        speechNoteVoiceWorked();
        hfProcessVoiceInput(transcript);
    };

    hfRecognition.onerror = function(event) {
        var code = event && event.error;
        if (code === 'no-speech' || code === 'aborted') return; // the listen timer moves on
        if (!hfListening) return;
        clearTimeout(hfListenTimer);
        hfMicFailed(code);
    };

    hfRecognition.onend = function() {
        // handled via onresult, onerror or the listen timer
    };
}

function hfCanRun() {
    return handsFreeModeActive && testScreenActive() && document.visibilityState !== 'hidden';
}

// In the background iOS stops speech and the mic; coming back reads the
// open question again.
function hfOnVisibility() {
    if (!handsFreeModeActive) return;
    if (document.visibilityState === 'hidden') { hfSession++; stopHFListening(); return; }
    if (testScreenActive()) testOnEnter(false);
}

// Voice answers failed in a way another listen won't fix by itself, so no
// "Bitte nochmal" loop: the question stays open for tapping, and the note's
// 🎤 button retries from a tap (which is what iOS may want for start()).
function hfMicFailed(code) {
    var fromTap = hfFromTap;
    stopHFListening();
    if (!testScreenActive()) return;
    if (code === 'not-allowed' && !fromTap) {
        hfNeedTap = true;
        hfShowMicNote('Tap 🎤 to answer by voice — or tap an answer.', true);
        return;
    }
    hfVoiceOff = speechRecError(code, true).text || 'Voice answers stopped working.'; // no text box here: "tap an answer"
    hfShowMicNote(hfVoiceOff, true);
}

function hfShowMicNote(text, withButton) {
    var note = document.getElementById('hf-mic-note');
    if (!note) {
        var host = document.getElementById('test-question');
        if (!text || !host) return;
        note = document.createElement('div');
        note.id = 'hf-mic-note';
        note.className = 'hf-mic-note';
        host.appendChild(note);
    }
    note.innerHTML = !text ? '' : '<div>' + appEscape(text) + '</div>' +
        (withButton ? '<button type="button" class="btn btn-good hf-mic-btn" onclick="startHFListening(true)">🎤 Answer by voice</button>' : '');
    note.classList.toggle('hidden', !text);
    if (text && note.scrollIntoView) note.scrollIntoView({ block: 'nearest' });
}

// ── Speech core: text-to-speech that holds up on iOS ───────────
// Every spoken line goes through speechSay(), every recognition start
// through speechThenListen(). What iOS WebKit (Safari and the home-screen
// app) does, and how it is handled here:
// - getVoices() is often empty until something was spoken, and
//   'voiceschanged' may never fire: the German voice is looked up again for
//   every line, and utterance.lang is always set, so a line is spoken in the
//   default German voice even when no voice object is known.
// - Nothing is heard until speak() was called inside a tap: taps queue one
//   silent line (speechUnlock) until a line has been seen starting, so lines
//   started later from timers, network replies or recognition results are
//   heard too.
// - cancel() directly followed by speak() can swallow the new line: cancel
//   only when something is speaking, and start the line SPEECH_GAP_MS later.
// - onend may never fire (and an utterance nobody references can be
//   garbage-collected first): the line stays referenced in speechCur, and a
//   watchdog based on the text length ends it anyway, so no flow hangs.
// - After the app was in the background the engine can be stuck paused:
//   resume() before every line and when the app is visible again; speech
//   stops while the app is hidden.
// - Speech and media never overlap: speaking pauses the tracks
//   (tracksPauseAudio) and any <audio>/<video> starting stops speech.

var SPEECH_GAP_MS = 100;      // between cancel() and the next speak()
var speechCur = null;         // the line in flight (see speechSay)
var speechStartTimer = null;  // a start waiting out SPEECH_GAP_MS
var speechCancelAt = 0;       // last cancel(): a speak() right after it waits
var speechVoice = null;       // best German voice found so far (null: lang only)
var speechUnlocked = false;   // a line was seen starting: iOS lets later ones through
var speechUnlockU = null;     // the silent unlock line, kept referenced
var speechUnlockAt = 0;
var speechUnlockOver = true;

function speechTtsSupported() {
    return !!window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined';
}

function speechGermanVoices() {
    var all = [];
    try { all = window.speechSynthesis.getVoices() || []; } catch (e) {}
    var out = [];
    for (var i = 0; i < all.length; i++) {
        if (/^de(?:[-_]|$)/i.test(String(all[i].lang || ''))) out.push(all[i]);
    }
    return out;
}

// Higher is better: de-DE before de-AT/de-CH, enhanced/premium before the
// compact default, the iOS novelty voices (Eloquence: Grandma, Rocko…) last.
function speechVoiceScore(v) {
    var id = String(v.name || '') + ' ' + String(v.voiceURI || '');
    var score = /^de[-_]de$/i.test(String(v.lang || '')) ? 40 : 20;
    if (/enhanced|premium|erweitert|neural|natural/i.test(id)) score += 30;
    if (/compact/i.test(id)) score -= 5;
    if (/eloquence|\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i.test(id)) score -= 30;
    return score;
}

function speechPickVoice() {
    var list = speechGermanVoices(), best = null, bestScore = -1000;
    for (var i = 0; i < list.length; i++) {
        var sc = speechVoiceScore(list[i]);
        if (sc > bestScore) { best = list[i]; bestScore = sc; }
    }
    if (best) speechVoice = best;
    return speechVoice;
}

// Every tap (capture phase, before the tap's own handler) until unlocked.
// (A touchend that ended a scroll isn't a tap for iOS, so one try is not enough.)
function speechUnlock() {
    if (speechUnlocked || !speechTtsSupported()) return;
    var ss = window.speechSynthesis;
    try {
        if (ss.speaking || ss.pending) return;
        var u = new SpeechSynthesisUtterance(' ');
        u.lang = 'de-DE';
        u.volume = 0;
        u.onstart = function() { speechUnlocked = true; };
        u.onend = u.onerror = function() { if (speechUnlockU === u) speechUnlockOver = true; };
        speechUnlockU = u;
        speechUnlockAt = Date.now();
        speechUnlockOver = false;
        ss.speak(u);
    } catch (e) {}
}

// The silent unlock line is still queued: a line spoken in the same tap
// goes after it instead of cancelling it (which would leave the tap).
function speechUnlockQueued() {
    return !!speechUnlockU && !speechUnlockOver && Date.now() - speechUnlockAt < 2000;
}

function speechEngineBusy() {
    if (!speechTtsSupported()) return false;
    try { return (window.speechSynthesis.speaking || window.speechSynthesis.pending) && !speechUnlockQueued(); }
    catch (e) { return false; }
}

function speechCancel() {
    speechCancelAt = Date.now();
    try { window.speechSynthesis.cancel(); } catch (e) {}
}

// Speaks one line. onDone(how) runs exactly once, always asynchronously:
// 'end', 'error', 'timeout' (the watchdog stopped waiting for onend),
// 'stopped' (speechStop() or a newer line: the app's own stop),
// 'interrupted' (the engine or system cancelled it -- callers move on, as
// after 'error') or 'none' (no engine / no text).
// opts: lang ('de-DE'), rate (0.9), pitch, onStart. Returns the line;
// line.started tells whether the engine was seen speaking it.
function speechSay(text, opts, onDone) {
    opts = opts || {};
    text = String(text === undefined || text === null ? '' : text);
    var prev = speechCur;
    speechCur = null;
    clearTimeout(speechStartTimer);
    speechStartTimer = null;
    if (prev) prev.finish('stopped');
    var line = { started: false, done: false, timer: null, u: null };
    line.finish = function(how) {
        if (line.done) return;
        line.done = true;
        clearTimeout(line.timer);
        if (speechCur === line) speechCur = null;
        if (onDone) setTimeout(function() { onDone(how); }, 0);
    };
    if (!speechTtsSupported() || !text.trim()) { line.finish('none'); return line; }
    var ss = window.speechSynthesis;
    var u;
    try {
        u = new SpeechSynthesisUtterance(text);
        u.lang = opts.lang || 'de-DE';
        u.rate = opts.rate || 0.9;
        if (opts.pitch) u.pitch = opts.pitch;
        if (/^de/i.test(u.lang) && speechPickVoice()) u.voice = speechVoice;
    } catch (e) { line.finish('error'); return line; }
    line.u = u;
    u.onstart = function() {
        line.started = true;
        speechUnlocked = true;
        if (opts.onStart && !line.done) opts.onStart();
    };
    u.onend = function() { line.finish('end'); };
    // The app's own stops finish the line with 'stopped' before they cancel,
    // so an 'interrupted'/'canceled' that still reaches an open line came
    // from the engine or the system (WebKit says 'canceled').
    u.onerror = function(e) {
        var code = e && e.error;
        line.finish(code === 'interrupted' || code === 'canceled' ? 'interrupted' : 'error');
    };
    speechCur = line;
    if (typeof tracksPauseAudio === 'function') tracksPauseAudio();

    var busy = speechEngineBusy();
    if (busy) speechCancel();
    var wait = busy || Date.now() - speechCancelAt < SPEECH_GAP_MS;
    var start = function() {
        speechStartTimer = null;
        if (speechCur !== line) return;
        try { ss.resume(); } catch (e) {}
        try { ss.speak(u); } catch (e) { line.finish('error'); return; }
        speechUnlockOver = true; // from now on a busy engine is this app's own speech
        var began = Date.now();
        var est = Math.max(2000, Math.round(text.length * 70 / u.rate) + 1200);
        var check = function() {
            if (line.done) return;
            var speaking = false;
            try { speaking = ss.speaking; } catch (e) {}
            if (speaking) line.started = speechUnlocked = true;
            // Still talking (a slower voice than estimated): wait, up to a
            // cap, as iOS can also report "speaking" forever.
            if (speaking && Date.now() - began < est * 2 + 4000) { line.timer = setTimeout(check, 400); return; }
            line.finish('timeout');
        };
        line.timer = setTimeout(check, est);
    };
    if (wait) speechStartTimer = setTimeout(start, SPEECH_GAP_MS);
    else start();
    return line;
}

// Stops the line in flight (its onDone gets 'stopped') and anything queued.
function speechStop() {
    var handedOver = !!speechCur && !speechStartTimer;
    clearTimeout(speechStartTimer);
    speechStartTimer = null;
    var line = speechCur;
    speechCur = null;
    if (line) line.finish('stopped');
    if (handedOver || speechEngineBusy()) speechCancel();
}

// Recognition must not start while speech holds the audio session (on iOS
// one of the two breaks): stop speaking and give the engine a moment. From a
// tap with nothing speaking, cb runs at once, still inside the tap, which
// iOS may require for SpeechRecognition.start(). cb(inTap) says which it
// was: a 'not-allowed' after a start outside a tap only means "tap again".
function speechThenListen(cb, fromTap) {
    var busy = !!speechCur || !!speechStartTimer || speechEngineBusy();
    if (busy) speechStop();
    else if (speechUnlockQueued()) {
        // Only this tap's silent unlock line: drop it and keep the tap.
        speechUnlockOver = true;
        speechCancel();
    }
    if (fromTap && !busy) { cb(true); return; }
    setTimeout(function() { cb(false); }, busy ? 350 : 200);
}

if (typeof document !== 'undefined') {
    document.addEventListener('touchend', speechUnlock, true);
    document.addEventListener('click', speechUnlock, true);
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            speechStop();
            speechCheckMicAbort();
        } else if (speechTtsSupported()) {
            try { window.speechSynthesis.resume(); } catch (e) {}
        }
    });
    document.addEventListener('play', function(e) {
        var t = e.target;
        if (t && (t.tagName === 'AUDIO' || t.tagName === 'VIDEO')) speechStop();
    }, true);
}

function speakText(text, lang, onDone) {
    speechSay(text, { lang: lang || 'de-DE' }, onDone);
}

// Hands-free: prompt, then options A-D, then onDone. A chain that was
// stopped (new question, leaving the tab, app hidden) just ends; a line the
// system cut off ('interrupted') is passed over like a failed one.
function speakQuestion(q, onDone) {
    var promptLang = q.direction === 'de_to_en' ? 'de-DE' : 'en-US';
    var optLang    = q.direction === 'de_to_en' ? 'en-US' : 'de-DE';
    var session = hfSession;
    var labels = ['Option A', 'Option B', 'Option C', 'Option D'];
    var lines = [{ text: q.prompt, lang: promptLang }];
    q.options.forEach(function(opt, idx) {
        lines.push({ text: labels[idx] + ': ' + opt.text, lang: optLang });
    });
    hfShowMicNote('');
    var i = 0;
    function next(how) {
        if (session !== hfSession || how === 'stopped') return;
        if (i >= lines.length) { if (onDone) onDone(); return; }
        var line = lines[i++];
        speechSay(line.text, { lang: line.lang }, next);
    }
    next();
}

// ── Speech recognition: errors, device facts, Speech check result ──

// iOS version from the user agent as [major, minor], or null when not iOS.
// (iOS 26 still says "OS 18_6" there; Safari adds "Version/26".)
function speechIosVersion() {
    var ua = navigator.userAgent || '';
    var m = /(?:iPhone|iPad|iPod).*? OS (\d+)[_.](\d+)/.exec(ua);
    if (!m && /Macintosh/.test(ua) && navigator.maxTouchPoints > 1) m = /Version\/(\d+)\.(\d+)/.exec(ua);
    if (!m) return null;
    var v = [+m[1], +m[2]];
    var safari = /Version\/(\d+)(?:\.(\d+))?/.exec(ua);
    if (safari && +safari[1] > v[0]) v = [+safari[1], +(safari[2] || 0)];
    return v;
}

function speechIsStandalone() {
    if (window.navigator.standalone === true) return true;
    try { return !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches); }
    catch (e) { return false; }
}

function speechRecCtor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// A SpeechRecognition error code as one short message with the fix. kind:
// 'blocked' (a setting turns voice input off), 'no-mic', 'unsupported',
// 'retry' (another try may work) or 'quiet' (nothing worth saying).
// tapToAnswer: the screen has answer buttons, no text box (hands-free Test).
function speechRecError(code, tapToAnswer) {
    var ios = speechIosVersion();
    var safari = ios && ios[0] >= 18 ? 'Settings → Apps → Safari' : 'Settings → Safari';
    var inApp = !!ios && speechIsStandalone();
    var orType = tapToAnswer ? ' — or tap an answer.' : ' — or type your answer.';
    var typeAll = tapToAnswer ? 'tap the answers.' : 'type your answers.';
    var notInApp = 'isn’t available in the home-screen app on this iPhone — open the site in Safari, or ' + typeAll;
    switch (code) {
    case 'aborted':
        return { kind: 'quiet', text: '' };
    case 'no-speech':
        return { kind: 'retry', text: 'Nothing was heard. Tap 🎤, then speak right away and close to the phone' + orType };
    case 'not-allowed':
        return { kind: 'blocked', text: 'Microphone access is blocked. Allow it in ' + safari + ' → Microphone, then try again' + orType };
    case 'service-not-allowed':
        return { kind: 'blocked', text: 'Voice input is switched off. Turn on Settings → General → Keyboard → Enable Dictation (and Siri in Settings → Siri), then try again' +
            (inApp ? '. If it still fails, voice input ' + notInApp : orType) };
    case 'audio-capture':
        return { kind: 'no-mic', text: 'No microphone could be used (another app may be using it). Close that app and try again' + orType };
    case 'network':
        return { kind: 'retry', text: 'Voice input needs an internet connection. Check it and try again' + orType };
    case 'language-not-supported':
        return { kind: 'blocked', text: 'German voice input isn’t set up. Add a German keyboard in Settings → General → Keyboard → Keyboards' + orType };
    case 'unsupported':
        return { kind: 'unsupported', text: 'Voice input ' + (inApp ? notInApp : 'isn’t available in this browser — ' + typeAll) };
    case 'start-failed':
        return { kind: 'retry', text: 'The microphone couldn’t start. Tap 🎤 to try again' + orType };
    case 'no-response':
        return { kind: 'retry', text: 'Voice input didn’t respond. Try again; if it keeps failing, check Settings → General → Keyboard → Enable Dictation' + orType };
    }
    return { kind: 'retry', text: 'Voice input stopped' + (code ? ' (' + code + ')' : '') + '. Try again' + orType };
}

// localStorage 'speech-check' = { at, tts: 'ok'|'silent'|'unsupported',
// stt: 'ok'|'unsupported'|'blocked'|'no-mic'|'error', voice, mode, ios }.
// mode is 'app' (home screen) or 'browser': the two can differ on iOS, so
// a result only counts in the mode it was taken in.
var SPEECH_CHECK_KEY = 'speech-check';

function speechRunMode() { return speechIsStandalone() ? 'app' : 'browser'; }

function speechCheckLoad() {
    try {
        var r = JSON.parse(localStorage.getItem(SPEECH_CHECK_KEY) || 'null');
        return r && typeof r === 'object' ? r : null;
    } catch (e) { return null; }
}

function speechCheckCurrent() {
    var r = speechCheckLoad();
    return r && (!r.mode || r.mode === speechRunMode()) ? r : null;
}

function speechCheckSave(patch) {
    var r = speechCheckCurrent() || { tts: null, stt: null, voice: null };
    for (var k in patch) r[k] = patch[k];
    var ios = speechIosVersion();
    r.at = Date.now();
    r.mode = speechRunMode();
    r.ios = ios ? ios.join('.') : null;
    try { localStorage.setItem(SPEECH_CHECK_KEY, JSON.stringify(r)); } catch (e) {}
    speechAdaptRefresh();
    return r;
}

// Voice input didn't work in the Speech check: Speak and exam Sprechen start
// in typing mode.
function speechVoiceInputOff() {
    var r = speechCheckCurrent();
    return !!r && (r.stt === 'blocked' || r.stt === 'unsupported');
}

function speechTtsSilent() {
    var r = speechCheckCurrent();
    return !!r && r.tts === 'silent';
}

// Recognition just worked somewhere: an older "blocked" verdict is out of date.
function speechNoteVoiceWorked() {
    var r = speechCheckCurrent();
    if (r && r.stt && r.stt !== 'ok') speechCheckSave({ stt: 'ok' });
}

var SPEECH_OFF_NOTE = 'Voice input didn’t work in your Speech check, so type your answer (Settings → Speech check to test again).';
var SPEECH_SILENT_NOTE = '🔇 The German voice was silent in your Speech check — check the silent switch and volume, then test again in ';

function speechHintHtml(text) {
    return appEscape(text) + '<button type="button" class="link-btn" onclick="speechOpenCheck()">Settings → Speech check</button>.';
}

function speechOpenCheck() {
    switchTab('settings');
    var card = document.getElementById('speech-check-card');
    if (card && card.scrollIntoView) card.scrollIntoView({ block: 'start' });
}

// Hints where the Speech check result matters (Test, Scenes). The Speak tab
// and exam Sprechen read the result whenever they render.
function speechAdaptRefresh() {
    var bar = document.getElementById('hands-free-bar');
    if (bar && bar.parentNode) {
        var hint = document.getElementById('hf-speech-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'hf-speech-hint';
            hint.className = 'speech-hint hidden';
            bar.parentNode.insertBefore(hint, bar.nextSibling);
        }
        var silent = speechTtsSilent(), off = speechVoiceInputOff();
        hint.innerHTML = silent ? speechHintHtml(SPEECH_SILENT_NOTE) :
            (off ? speechHintHtml('⌨️ Voice answers didn’t work in your Speech check — tap the answers (questions are still read aloud). Test again in ') : '');
        hint.classList.toggle('hidden', !(silent || off) || bar.classList.contains('hidden'));
    }
    var scenes = document.getElementById('scenes-content');
    if (scenes) {
        var sh = document.getElementById('scenes-speech-hint');
        if (!sh) {
            sh = document.createElement('div');
            sh.id = 'scenes-speech-hint';
            sh.className = 'speech-hint hidden';
            scenes.insertBefore(sh, scenes.firstChild);
        }
        sh.innerHTML = speechTtsSilent() ? speechHintHtml(SPEECH_SILENT_NOTE) : '';
        sh.classList.toggle('hidden', !speechTtsSilent());
    }
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

// fromTap: the note's 🎤 button (a tap; also clears a "voice off" verdict).
// Otherwise this runs after the question was read, outside any tap.
function startHFListening(fromTap) {
    if (!hfSpeechSupported || !hfCanRun()) return;
    var q = testQuestions[testCurrentIndex];
    if (!q || q.answered) return;
    if (fromTap === true) {
        hfVoiceOff = '';
        hfVoiceTried = true;
    } else {
        var off = hfVoiceOff || (!hfVoiceTried && speechVoiceInputOff() ? 'Tap an answer — or 🎤 to try voice anyway.' : '');
        if (off || hfNeedTap) { hfShowMicNote(off || 'Tap 🎤 to answer by voice — or tap an answer.', true); return; }
    }
    var lang = q.direction === 'de_to_en' ? 'en-US' : 'de-DE';
    var session = hfSession;
    hfShowMicNote('');
    var mic = document.getElementById('mic-indicator');
    mic.classList.remove('hidden');
    mic.querySelector('.mic-status').textContent = 'Listening…';
    hfListening = true;

    function go(tries, inTap) {
        if (session !== hfSession || !hfListening || !hfCanRun() || q.answered) return;
        hfRecognition.lang = lang;
        hfFromTap = inTap;
        try { hfRecognition.start(); }
        catch (e) {
            // Usually still closing from the last answer: try again shortly.
            if (tries < 2) { setTimeout(function() { go(tries + 1, false); }, 400); return; }
            hfMicFailed('start-failed');
            return;
        }
        clearTimeout(hfListenTimer);
        hfListenTimer = setTimeout(function() {
            try { hfRecognition.abort(); } catch (e2) {}
            if (hfListening) hfHandleNoMatch();
        }, 7000);
    }
    // Not over the voice that just read the question (iOS audio session).
    speechThenListen(function(inTap) { go(0, inTap); }, fromTap === true);
}

function stopHFListening() {
    hfListening = false;
    clearTimeout(hfListenTimer);
    hfShowMicNote('');
    var mic = document.getElementById('mic-indicator');
    if (mic) mic.classList.add('hidden');
    if (hfRecognition) { try { hfRecognition.abort(); } catch(e) {} }
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
        // A short gap after the mic before the voice comes back (iOS).
        setTimeout(function() {
            if (session !== hfSession || q.answered) return;
            speakText('Bitte nochmal', 'de-DE', function() {
                if (session === hfSession) startHFListening();
            });
        }, 250);
    }
}

// ── Speech check (a card in Settings) ──────────────────────────
// A one-minute test on the phone itself: does the German voice start, end
// and get heard, and does German voice input work here (home-screen app or
// Safari)? The result is saved (speechCheckSave) and the app adapts: Speak
// and exam Sprechen start in typing mode when voice input is off, and Test,
// Scenes and Speak say so when the voice was silent. Nothing is recorded
// or sent anywhere: recognition is the phone's own.

var SPEECH_CHECK_LINE = 'Guten Morgen! Das ist ein Test.';
var speechCheckTts = null;   // { phase: 'speaking'|'ask'|'done', started, how, ms, heard }
var speechCheckMic = null;   // { phase: 'listening'|'done', text, error, stt, rec, timer, started }

// Called by renderSettings: appends the card and paints it from the saved
// result plus any test in progress.
function speechCheckMount(el) {
    var card = document.createElement('div');
    card.className = 'settings-card speech-check';
    card.id = 'speech-check-card';
    el.appendChild(card);
    speechCheckPaint();
}

function settingsOnLeave() {
    speechCheckMicAbort();
}

function speechCheckRow(label, value) {
    return '<div class="settings-row"><span>' + appEscape(label) + '</span><span>' + appEscape(value) + '</span></div>';
}

function speechCheckWhen(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' ' + d.toTimeString().slice(0, 5);
}

var SPEECH_TTS_LABEL = { ok: 'works', silent: 'silent', unsupported: 'not available' };
var SPEECH_STT_LABEL = { ok: 'works', unsupported: 'not available', blocked: 'blocked by a setting', 'no-mic': 'no microphone', error: 'didn’t work' };

function speechCheckPaint() {
    var card = document.getElementById('speech-check-card');
    if (!card) return;
    var tts = speechTtsSupported();
    var SR = speechRecCtor();
    var ios = speechIosVersion();
    var app = speechIsStandalone();
    var de = tts ? speechGermanVoices() : [];
    var v = tts ? speechPickVoice() : null;
    var t = speechCheckTts, m = speechCheckMic;
    var html = '<div class="settings-title">Speech check</div>' +
        '<p class="settings-note">Run this once on the iPhone, in the home-screen app: it tests the German voice and the microphone, ' +
        'and Speak, Exam and Test adapt to the result.</p>' +
        speechCheckRow('Running as', app ? 'home-screen app' : 'browser tab' + (ios ? ' (the home-screen app can differ: test there too)' : '')) +
        speechCheckRow('System', ios ? 'iOS ' + ios[0] + '.' + ios[1] + (ios[0] === 18 && ios[1] === 6 && app ? ' or later' : '') : 'not an iPhone') +
        speechCheckRow('Voice output', tts ? 'available' : 'not available') +
        speechCheckRow('German voices', !tts ? '—' : (de.length ? String(de.length) : 'none listed yet (iOS lists them after the first test)')) +
        speechCheckRow('Voice', v ? v.name + ' · ' + v.lang : (tts ? 'default German voice' : '—')) +
        speechCheckRow('Voice input', SR ? 'available' : 'not available');

    html += '<button type="button" class="btn btn-good" id="speech-check-voice-btn" onclick="speechCheckVoice()"' +
        (t && t.phase === 'speaking' ? ' disabled' : '') + '>▶ Test German voice</button>';
    if (t) {
        var res = '', cls = '';
        if (t.phase === 'speaking') res = '🔊 Speaking „' + SPEECH_CHECK_LINE + '“ … ' + (t.started ? 'started ✓' : 'waiting for it to start');
        else if (t.result === 'unsupported') { res = 'This browser has no voice output, so read the texts on screen.'; cls = ' warn'; }
        else if (!t.started && t.how !== 'end') {
            res = '🔇 The voice didn’t start (' + (t.how === 'error' ? 'speech error' :
                t.how === 'interrupted' ? 'the system cut it off — another app may be using the sound' : 'no sound after ' + Math.round(t.ms / 1000) + ' s') +
                '). Check the silent switch and the volume, and download a German voice in Settings → Accessibility → Spoken Content → Voices → German.';
            cls = ' warn';
        } else {
            res = 'Started ✓ · ' + (t.how === 'end' ? 'ended ✓' :
                t.how === 'interrupted' ? 'cut off by the system before the end (another app may have taken the sound — test again)' :
                'no end signal (normal on some iPhones — the app moves on by itself)') +
                ' · ' + (t.ms / 1000).toFixed(1) + ' s';
            if (t.phase === 'done') {
                res += t.heard ? ' · you heard it ✓' : ' · not heard: check the silent switch and volume, then test again.';
                cls = t.heard ? ' ok' : ' warn';
            }
        }
        html += '<div class="speech-check-result' + cls + '" id="speech-check-voice-result">' + appEscape(res) + '</div>';
        if (t.phase === 'ask') {
            html += '<div class="speech-check-ask"><span>Did you hear it?</span>' +
                '<button type="button" class="btn btn-known" onclick="speechCheckHeard(true)">Yes</button>' +
                '<button type="button" class="btn btn-learning" onclick="speechCheckHeard(false)">No</button></div>';
        }
    }

    var listening = m && m.phase === 'listening';
    html += '<button type="button" class="btn btn-good" id="speech-check-mic-btn" onclick="speechCheckMicTest()">' +
        (listening ? '⏹ Stop' : '🎤 Test microphone') + '</button>';
    if (m) {
        var mres = '', mcls = '';
        if (listening) mres = m.text ? '🎤 „' + m.text + '“' : '🎤 Listening… say „Guten Morgen“.';
        else if (m.stt === 'ok') {
            mres = '✓ Heard: „' + m.text + '“' + (/guten\s*morgen/i.test(m.text) ? '' : ' (not quite „Guten Morgen“, but voice input works)');
            mcls = ' ok';
        } else if (m.stt === 'retap') {
            mres = 'Tap 🎤 Test microphone once more (the voice was still speaking).';
        } else {
            mres = speechRecError(m.error).text;
            mcls = ' warn';
        }
        html += '<div class="speech-check-result' + mcls + '" id="speech-check-mic-result">' + appEscape(mres) + '</div>';
    }

    var r = speechCheckCurrent();
    if (r && r.at) {
        html += '<p class="settings-note" id="speech-check-saved">Saved ' + appEscape(speechCheckWhen(r.at)) +
            ' · voice: ' + appEscape(SPEECH_TTS_LABEL[r.tts] || 'not tested') +
            ' · voice input: ' + appEscape(SPEECH_STT_LABEL[r.stt] || 'not tested') +
            (speechVoiceInputOff() ? ' — Speak and Exam start in typing mode.' : '') + '</p>';
    }
    card.innerHTML = html;
}

function speechCheckVoice() {
    if (speechCheckTts && speechCheckTts.phase === 'speaking') return;
    speechCheckMicAbort();
    if (!speechTtsSupported()) {
        speechCheckTts = { phase: 'done', result: 'unsupported' };
        speechCheckSave({ tts: 'unsupported', voice: null });
        speechCheckPaint();
        return;
    }
    var st = { phase: 'speaking', started: false, t0: Date.now() };
    speechCheckTts = st;
    // onstart is not reliable either: also count the engine reporting "speaking".
    var poll = setInterval(function() {
        if (st.phase !== 'speaking') { clearInterval(poll); return; }
        try { if (window.speechSynthesis.speaking && !st.started) { st.started = true; speechCheckPaint(); } } catch (e) {}
    }, 200);
    var line = speechSay(SPEECH_CHECK_LINE, {
        lang: 'de-DE',
        onStart: function() { if (!st.started) { st.started = true; speechCheckPaint(); } }
    }, function(how) {
        clearInterval(poll);
        if (speechCheckTts !== st) return;
        if (how === 'stopped') { speechCheckTts = null; speechCheckPaint(); return; } // left Settings, app hidden
        st.how = how;
        st.ms = Date.now() - st.t0;
        st.started = st.started || line.started;
        var ok = st.started || how === 'end';
        st.phase = ok ? 'ask' : 'done';
        var v = speechPickVoice();
        speechCheckSave({ tts: ok ? 'ok' : 'silent', voice: v ? v.name + ' (' + v.lang + ')' : null });
        speechCheckPaint();
    });
    speechCheckPaint();
}

function speechCheckHeard(yes) {
    var st = speechCheckTts;
    if (!st || st.phase !== 'ask') return;
    st.phase = 'done';
    st.heard = !!yes;
    speechCheckSave({ tts: yes ? 'ok' : 'silent' });
    speechCheckPaint();
}

// 🎤 Test microphone (a second tap stops listening).
function speechCheckMicTest() {
    var cur = speechCheckMic;
    if (cur && cur.phase === 'listening') {
        if (cur.rec) { try { cur.rec.stop(); } catch (e) {} }
        clearTimeout(cur.timer);
        cur.timer = setTimeout(function() { speechCheckMicEnd(cur); }, 1500);
        return;
    }
    var SR = speechRecCtor();
    var st = { phase: 'listening', text: '', error: null, rec: null, timer: null, started: false };
    speechCheckMic = st;
    if (!SR) { speechCheckMicEnd(st, 'unsupported'); return; }
    if (speechCheckTts && speechCheckTts.phase === 'speaking') speechCheckTts = null;
    speechCheckPaint();
    speechThenListen(function(inTap) {
        if (speechCheckMic !== st || st.phase !== 'listening') return;
        st.inTap = inTap;
        var rec;
        try { rec = new SR(); } catch (e) { speechCheckMicEnd(st, 'start-failed'); return; }
        st.rec = rec;
        rec.lang = 'de-DE';
        rec.continuous = false;
        rec.interimResults = true;
        rec.onstart = function() { st.started = true; };
        rec.onaudiostart = function() { st.started = true; };
        rec.onresult = function(e) {
            if (speechCheckMic !== st) return;
            var text = '';
            var list = (e && e.results) || [];
            for (var i = 0; i < list.length; i++) {
                var tr = list[i] && list[i][0] ? String(list[i][0].transcript || '').trim() : '';
                if (tr) text = text ? text + ' ' + tr : tr;
            }
            if (!text) return;
            st.started = true;
            st.text = text;
            var el = document.getElementById('speech-check-mic-result');
            if (el) el.textContent = '🎤 „' + text + '“';
        };
        rec.onerror = function(e) { st.error = (e && e.error) || 'error'; };
        rec.onend = function() { speechCheckMicEnd(st); };
        clearTimeout(st.timer);
        st.timer = setTimeout(function() {
            try { rec.abort(); } catch (e) {}
            speechCheckMicEnd(st, st.started ? null : 'no-response');
        }, 10000);
        try { rec.start(); } catch (e) { speechCheckMicEnd(st, 'start-failed'); }
    }, true);
}

function speechCheckMicEnd(st, err) {
    if (speechCheckMic !== st || st.phase !== 'listening') return;
    clearTimeout(st.timer);
    st.phase = 'done';
    if (err) st.error = err;
    if (!st.text && st.error === 'not-allowed' && !st.inTap) {
        // Started after the voice test had to stop, outside the tap: iOS may
        // refuse that, so it says nothing about the settings. Not saved.
        st.stt = 'retap';
        speechCheckPaint();
        return;
    }
    var stt = 'ok';
    if (!st.text) {
        if (!st.error || st.error === 'aborted') st.error = 'no-speech';
        var kind = speechRecError(st.error).kind;
        stt = kind === 'blocked' || kind === 'no-mic' || kind === 'unsupported' ? kind : 'error';
    } else {
        st.error = null;
    }
    st.stt = stt;
    speechCheckSave({ stt: stt });
    speechCheckPaint();
}

// Leaving Settings or the app going to the background: drop a running mic
// test without saving anything.
function speechCheckMicAbort() {
    var st = speechCheckMic;
    if (!st || st.phase !== 'listening') return;
    clearTimeout(st.timer);
    speechCheckMic = null;
    if (st.rec) { try { st.rec.abort(); } catch (e) {} }
    speechCheckPaint();
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
    speechStop();
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

        // speechSay ends a line even when iOS never fires onend (watchdog).
        speechSay(lines[lineIndex].de, { lang: 'de-DE' }, function(how) {
            if (playId !== scenePlayId) return;
            if (how === 'stopped') { stopConversation(); return; } // app hidden, other audio
            lineIndex++;
            sceneGapTimer = setTimeout(speakNext, 800);
        });
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
