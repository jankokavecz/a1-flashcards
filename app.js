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

// Spaced repetition intervals in days per level
var SRS_INTERVALS = [0, 1, 3, 7, 14, 30];
var LEARNED_THRESHOLD = 3; // level >= 3 counts as "learned" (survives 3 correct recalls)

var wordProgress = {}; // { wordId: { level: 0, nextReview: timestamp } }
var currentDeck = [];
var currentIndex = 0;
var isFlipped = false;

// ── Initialization ──────────────────────────────────────────────

function init() {
    rebuildTabBar();
    loadProgress();
    populateCategoryFilter();
    populateTestCategoryFilter();
    var coreToggle = document.getElementById('core-only-toggle');
    if (coreToggle) coreToggle.checked = coreOnlyEnabled();
    var speakToggle = document.getElementById('speak-on-flip-toggle');
    if (speakToggle) speakToggle.checked = speakOnFlipEnabled();
    startSession('all');
    renderWordList();
    renderGrammar();
    renderScenes();
    initExam();
    initHandsFree();
    initCalls();
    if (typeof renderPlanScreen === 'function') renderPlanScreen();
    if (typeof renderTracksScreen === 'function') renderTracksScreen();
    switchTab('plan');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            reg.update(); // check for a new version right away, don't wait for the browser's own throttled schedule
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') reg.update();
            });
        });
        // sw.js's skipWaiting()+clients.claim() means a newly-installed worker
        // takes control immediately -- reload once so the page's own JS
        // actually matches what's now being served, instead of leaving the
        // update stuck until the next manual reload.
        var swRefreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            if (swRefreshing) return;
            swRefreshing = true;
            window.location.reload();
        });
    }
}

document.addEventListener('DOMContentLoaded', init);

// ── Navigation ──────────────────────────────────────────────────
// A single tab bar for everyone: 4 primary slots plus a "More" sheet for
// the rest, since the full tab set (9 screens) doesn't fit one row.

var TAB_META = {
    plan:    { icon: '🗓️', label: 'Plan' },
    cards:   { icon: '🃏', label: 'Cards' },
    words:   { icon: '📖', label: 'Words' },
    test:    { icon: '✅', label: 'Test' },
    tracks:  { icon: '🎧', label: 'Tracks' },
    scenes:  { icon: '💬', label: 'Scenes' },
    grammar: { icon: '📐', label: 'Grammar' },
    exam:    { icon: '🎓', label: 'Exam' },
    calls:   { icon: '🗣️', label: 'Speak' },
    log:     { icon: '📋', label: 'Log' }
};
var PRIMARY_TABS = ['plan', 'cards', 'test', 'tracks'];
var ALL_TAB_IDS = ['plan', 'cards', 'words', 'test', 'tracks', 'scenes', 'grammar', 'exam', 'calls', 'log'];

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
        item.className = 'more-sheet-item';
        item.innerHTML = '<span class="tab-icon">' + meta.icon + '</span><span>' + meta.label + '</span>';
        item.addEventListener('click', function() { closeMoreSheet(); switchTab(id); });
        list.appendChild(item);
    });
    sheet.classList.add('open');
}

function closeMoreSheet() {
    var sheet = document.getElementById('more-sheet');
    if (sheet) sheet.classList.remove('open');
}

function switchTab(tabName) {
    // Stop hands-free and calls speech when switching away
    window.speechSynthesis.cancel();
    if (tabName !== 'test') stopHFListening();
    if (tabName !== 'calls') callsStopAll();
    if (tabName !== 'exam' && typeof examExit === 'function') {
        if (typeof examActiveAudio !== 'undefined' && examActiveAudio) { try { examActiveAudio.pause(); } catch(e) {} }
        if (typeof examRecognition !== 'undefined' && examRecognition) { try { examRecognition.stop(); } catch(e) {} }
    }
    closeMoreSheet();

    var screenEl = document.getElementById(tabName + '-screen');
    if (!screenEl) return;
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

    if (tabName === 'words') renderWordList();
    if (tabName === 'grammar') renderGrammar();
    if (tabName === 'test' && testQuestions.length === 0) startTest();
    if (tabName === 'calls') renderCallsScreen();
    if (tabName === 'exam') renderExamScreen();
    if (tabName === 'plan' && typeof renderPlanScreen === 'function') renderPlanScreen();
    if (tabName === 'tracks' && typeof renderTracksScreen === 'function') renderTracksScreen();
    if (tabName === 'log' && typeof renderLogScreen === 'function') renderLogScreen();
}

// ── Cards Logic ─────────────────────────────────────────────────

function populateCategoryFilter() {
    var select = document.getElementById('category-filter');
    var cats = Object.keys(ALL_CATEGORIES).sort();
    cats.forEach(function(catId) {
        var opt = document.createElement('option');
        opt.value = catId;
        opt.textContent = ALL_CATEGORIES[catId].emoji + ' ' + ALL_CATEGORIES[catId].name;
        select.appendChild(opt);
    });
    select.addEventListener('change', function() {
        startSession(this.value);
    });
}

function startSession(category) {
    if (category === 'mydeck') {
        startMyDeckSession();
        return;
    }
    var words;
    if (category === 'all') {
        words = ALL_WORDS.slice();
    } else {
        words = ALL_WORDS.filter(function(w) { return w.category === category; });
    }
    if (coreOnlyEnabled()) {
        words = words.filter(function(w) { return w.freq !== 2; });
    }

    var now = Date.now();

    // Split into due (overdue) and new cards; migrate any old-schema progress
    var due = [];
    var newCards = [];
    var migrated = false;
    words.forEach(function(w) {
        var prog = wordProgress[w.id];
        if (!prog) {
            newCards.push(w);
            return;
        }
        var migratedProg = srsMigrateCard(prog);
        if (migratedProg !== prog) { wordProgress[w.id] = migratedProg; migrated = true; }
        if (migratedProg.due <= now) due.push(w);
    });
    if (migrated) saveProgress();

    // Sort due cards: most overdue first
    due.sort(function(a, b) {
        return (wordProgress[a.id].due || 0) - (wordProgress[b.id].due || 0);
    });

    // Respect the daily review cap and the date-stepped new-card budget
    var todayCounts = srsTodayCounts();
    var reviewsLeft = Math.max(0, srsReviewCap() - todayCounts.reviews);
    due = due.slice(0, reviewsLeft);

    var newLeft = Math.max(0, srsNewPerDay() - todayCounts.new);
    var newSlice = shuffle(newCards).slice(0, newLeft);

    // Combine: due cards first, then shuffled new cards
    currentDeck = due.concat(newSlice);
    currentIndex = 0;
    isFlipped = false;

    // Update session info
    var counterEl = document.getElementById('card-counter');
    if (currentDeck.length === 0) {
        counterEl.textContent = 'All reviewed!';
    } else {
        counterEl.textContent = due.length + ' due, ' + newSlice.length + ' new';
    }

    updateIntroducedCounter();
    showCurrentCard();
}

// "My Deck": every word ever introduced, all in one flippable session --
// grows day by day as gradeCard() adds new entries to wordProgress, never
// resets, never mixes in brand-new not-yet-seen words. Not gated by SRS due
// dates or the daily budget, since the point here is browsing/reviewing
// everything learned so far, not paced daily practice (that's "All Categories").
function startMyDeckSession() {
    var introduced = ALL_WORDS.filter(function(w) { return !!wordProgress[w.id]; });
    currentDeck = shuffle(introduced);
    currentIndex = 0;
    isFlipped = false;

    var counterEl = document.getElementById('card-counter');
    counterEl.textContent = currentDeck.length === 0 ? 'Nothing learned yet' : currentDeck.length + ' in your deck';

    updateIntroducedCounter();
    showCurrentCard();
}

function updateIntroducedCounter() {
    var introducedEl = document.getElementById('cards-introduced-counter');
    if (!introducedEl) return;
    var introducedTotal = 0;
    for (var id in wordProgress) introducedTotal++;
    var coreTotal = ALL_WORDS.filter(function(w) { return w.freq === 1; }).length;
    if (coreTotal > 0) {
        var coreIntroduced = 0;
        ALL_WORDS.forEach(function(w) { if (w.freq === 1 && wordProgress[w.id]) coreIntroduced++; });
        introducedEl.textContent = introducedTotal + ' / ' + ALL_WORDS.length + ' introduced · Core 800: ' + coreIntroduced + ' / ' + coreTotal;
    } else {
        introducedEl.textContent = introducedTotal + ' / ' + ALL_WORDS.length + ' introduced';
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

function showCurrentCard() {
    if (currentDeck.length === 0) {
        document.getElementById('card-front-word').textContent = 'All caught up!';
        document.getElementById('card-hint').textContent = 'No cards due. Come back later!';
        document.getElementById('card-counter').textContent = 'Nothing due';
        document.getElementById('session-progress').style.width = '0%';
        var cardFront = document.getElementById('flashcard').querySelector('.card-front');
        cardFront.classList.remove('gender-m', 'gender-f', 'gender-n');
        return;
    }

    if (currentIndex >= currentDeck.length) {
        document.getElementById('card-front-word').textContent = '\uD83C\uDF89 Done!';
        document.getElementById('card-hint').textContent = 'Session complete! Tap to restart.';
        document.getElementById('card-counter').textContent = 'Session done';
        document.getElementById('session-progress').style.width = '100%';
        var cardFront2 = document.getElementById('flashcard').querySelector('.card-front');
        cardFront2.classList.remove('gender-m', 'gender-f', 'gender-n');
        document.getElementById('flashcard').onclick = function() {
            document.getElementById('flashcard').onclick = flipCard;
            startSession(document.getElementById('category-filter').value);
        };
        return;
    }

    var word = currentDeck[currentIndex];

    // Reset flip state
    isFlipped = false;
    document.getElementById('flashcard').classList.remove('flipped');

    // Gender coloring for nouns
    var cardFront = document.getElementById('flashcard').querySelector('.card-front');
    cardFront.classList.remove('gender-m', 'gender-f', 'gender-n');
    if (word.type === 'noun' && word.gender) {
        cardFront.classList.add('gender-' + word.gender);
    }

    // Front side
    document.getElementById('card-type').textContent = word.type;
    document.getElementById('card-type').className = 'card-type-badge type-' + word.type;
    document.getElementById('card-front-word').textContent = word.de;

    // Level indicator
    var prog = wordProgress[word.id];
    var level = prog ? prog.level : 0;
    var levelEl = document.getElementById('card-level');
    if (levelEl) {
        var dots = '';
        for (var i = 0; i < 5; i++) {
            dots += i < level ? '●' : '○';
        }
        levelEl.textContent = dots;
        levelEl.className = 'card-level level-' + level;
    }

    document.getElementById('card-hint').textContent = 'Tap to flip';

    // Back side
    document.getElementById('card-translation').textContent = word.en;
    document.getElementById('card-example-de').textContent = word.example.de;
    document.getElementById('card-example-en').textContent = word.example.en;

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

    // Progress bar (counter is set by startSession)
    document.getElementById('session-progress').style.width = ((currentIndex + 1) / currentDeck.length * 100) + '%';
}

function flipCard() {
    isFlipped = !isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped');
    if (isFlipped && speakOnFlipEnabled()) speakCurrentWord();
}

function speakCurrentWord() {
    if (currentDeck.length === 0 || currentIndex >= currentDeck.length) return;
    var word = currentDeck[currentIndex];
    var text = isFlipped && word.example && word.example.de ? word.example.de : word.de;
    speakText(text, 'de-DE', null);
}

// ── SRS: SM-2-style scheduling ────────────────────────────────────
// Per-card state: { level, ease, due, reps, lapses, intervalDays, leech }.
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

function srsNext(card, grade) {
    if (grade === 'again') {
        card.lapses = (card.lapses || 0) + 1;
        card.level = 0;
        card.ease = Math.max(1.3, card.ease - 0.2);
        card.intervalDays = 0;
        card.due = Date.now() + 10 * 60 * 1000; // retry within this session
        if (card.lapses >= LEECH_LAPSES) card.leech = true;
        return card;
    }
    card.reps = (card.reps || 0) + 1;
    var days;
    if (card.level === 0) days = 1;
    else if (card.level === 1) days = 3;
    else days = Math.round((card.intervalDays || 1) * card.ease);
    if (grade === 'easy') {
        days = Math.round(days * 1.3);
        card.ease = card.ease + 0.15;
    }
    days = Math.min(days, 180);
    card.intervalDays = days;
    card.level = (card.level || 0) + 1;
    card.due = Date.now() + days * 24 * 60 * 60 * 1000;
    return card;
}

function srsToday() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

function srsDailyLoad() {
    try { return JSON.parse(localStorage.getItem(SRS_DAILY_KEY) || '{}'); }
    catch (e) { return {}; }
}

function srsDailySave(data) {
    try { localStorage.setItem(SRS_DAILY_KEY, JSON.stringify(data)); } catch (e) {}
}

function srsTodayCounts() {
    return srsDailyLoad()[srsToday()] || { new: 0, reviews: 0 };
}

function srsBumpToday(field) {
    var data = srsDailyLoad();
    var key = srsToday();
    if (!data[key]) data[key] = { new: 0, reviews: 0 };
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
    startSession(document.getElementById('category-filter').value);
}

function speakOnFlipEnabled() {
    var v = localStorage.getItem(SPEAK_ON_FLIP_KEY);
    return v === null ? true : v === '1'; // default ON
}

function toggleSpeakOnFlip() {
    localStorage.setItem(SPEAK_ON_FLIP_KEY, speakOnFlipEnabled() ? '0' : '1');
}

function gradeCard(grade) {
    if (currentDeck.length === 0 || currentIndex >= currentDeck.length) return;
    var word = currentDeck[currentIndex];
    var wasNew = !wordProgress[word.id];
    var prog = srsMigrateCard(wordProgress[word.id] || { level: 0, nextReview: 0 });
    prog = srsNext(prog, grade);
    wordProgress[word.id] = prog;
    saveProgress();
    srsBumpToday(wasNew ? 'new' : 'reviews');
    if (typeof dailyLogRecord === 'function') dailyLogRecord(wasNew ? 'wordsNew' : 'wordsReview', word.id);
    updateIntroducedCounter();

    if (grade === 'again') {
        // Re-insert the card later in this session for another attempt
        currentDeck.splice(currentIndex, 1);
        var insertAt = currentIndex + Math.floor(Math.random() * Math.max(1, currentDeck.length - currentIndex)) + 1;
        if (insertAt > currentDeck.length) insertAt = currentDeck.length;
        currentDeck.splice(insertAt, 0, word);
        showCurrentCard();
    } else {
        currentIndex++;
        showCurrentCard();
    }
}

// ── Words Screen ────────────────────────────────────────────────

var wordsFilterMode = 'all'; // 'all' | 'learned' -- a combined tracker of already-learned words for quick review

function setWordsFilter(mode) {
    wordsFilterMode = mode;
    var allBtn = document.getElementById('words-filter-all');
    var learnedBtn = document.getElementById('words-filter-learned');
    if (allBtn) allBtn.classList.toggle('active', mode === 'all');
    if (learnedBtn) learnedBtn.classList.toggle('active', mode === 'learned');
    renderWordList();
}

function renderWordList() {
    var container = document.getElementById('word-list');
    container.innerHTML = '';

    // Update progress stats
    var learnedTotal = getLearnedCount();
    document.getElementById('words-learned').textContent = learnedTotal;
    document.getElementById('words-total').textContent = ALL_WORDS.length;
    document.getElementById('words-progress').style.width = (learnedTotal / ALL_WORDS.length * 100) + '%';

    // Group by category, sorted alphabetically
    var catIds = Object.keys(ALL_CATEGORIES).sort(function(a, b) {
        return ALL_CATEGORIES[a].name.localeCompare(ALL_CATEGORIES[b].name);
    });

    if (wordsFilterMode === 'learned' && learnedTotal === 0) {
        container.innerHTML = '<div class="plan-empty-state">No learned words yet — grade a few cards in Cards first.</div>';
        return;
    }

    catIds.forEach(function(catId) {
        var catWords = ALL_WORDS.filter(function(w) { return w.category === catId; });
        if (wordsFilterMode === 'learned') {
            catWords = catWords.filter(function(w) { return isWordLearned(w.id); });
        }
        if (catWords.length === 0) return;

        var group = document.createElement('div');
        group.className = 'category-group';

        var learnedCount = catWords.filter(function(w) { return isWordLearned(w.id); }).length;

        var header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = '<span>' + ALL_CATEGORIES[catId].emoji + ' ' + ALL_CATEGORIES[catId].name +
            '</span><span class="category-count">' + learnedCount + '/' + catWords.length + '</span>';
        group.appendChild(header);

        catWords.forEach(function(word) {
            var learned = isWordLearned(word.id);
            var item = document.createElement('div');
            item.className = 'word-item' + (learned ? ' learned' : '');

            // Gender class for nouns
            if (word.type === 'noun' && word.gender) {
                item.classList.add('word-gender-' + word.gender);
            }

            var row = document.createElement('div');
            row.className = 'word-row';

            // Checkbox
            var checkbox = document.createElement('div');
            checkbox.className = 'word-checkbox' + (learned ? ' checked' : '');
            checkbox.innerHTML = learned ? '&#10003;' : '';
            (function(w, cb, it) {
                cb.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var isLearned = isWordLearned(w.id);
                    if (isLearned) {
                        // Unmark: reset to level 0
                        wordProgress[w.id] = { level: 0, nextReview: 0 };
                        cb.classList.remove('checked');
                        cb.innerHTML = '';
                        it.classList.remove('learned');
                    } else {
                        // Mark as learned: set to the level that actually counts as learned
                        wordProgress[w.id] = { level: LEARNED_THRESHOLD, nextReview: Date.now() + 1 * 24 * 60 * 60 * 1000 };
                        cb.classList.add('checked');
                        cb.innerHTML = '&#10003;';
                        it.classList.add('learned');
                    }
                    saveProgress();
                    // Update counters
                    var newLearnedTotal = getLearnedCount();
                    document.getElementById('words-learned').textContent = newLearnedTotal;
                    document.getElementById('words-progress').style.width = (newLearnedTotal / ALL_WORDS.length * 100) + '%';
                    var catLearned = catWords.filter(function(cw) { return isWordLearned(cw.id); }).length;
                    header.innerHTML = '<span>' + ALL_CATEGORIES[catId].emoji + ' ' + ALL_CATEGORIES[catId].name +
                        '</span><span class="category-count">' + catLearned + '/' + catWords.length + '</span>';
                });
            })(word, checkbox, item);
            row.appendChild(checkbox);

            var main = document.createElement('div');
            main.className = 'word-main';
            // Add gender color to noun text
            var deClass = 'word-de';
            if (word.type === 'noun' && word.gender) {
                deClass += ' word-de-gender-' + word.gender;
            }
            var isLeech = wordProgress[word.id] && wordProgress[word.id].leech;
            main.innerHTML = '<div><span class="' + deClass + '">' + word.de +
                '</span> <span class="word-type-badge type-' + word.type + '">' + word.type +
                '</span>' + (isLeech ? ' <span title="Leech: 8+ lapses">🚩</span>' : '') +
                '</div><span class="word-en">' + word.en + '</span>';
            row.appendChild(main);

            var expanded = document.createElement('div');
            expanded.className = 'word-expanded';
            var expandedHtml = '<div class="word-example">"' + word.example.de +
                '"</div><div class="word-example-en">' + word.example.en + '</div>';
            if (word.plural) {
                expandedHtml += '<div>Plural: ' + word.plural + '</div>';
            }
            if (word.conjugation) {
                expandedHtml += '<div class="word-conjugation">';
                Object.keys(word.conjugation).forEach(function(k) {
                    expandedHtml += '<span>' + k + ': ' + word.conjugation[k] + '</span> ';
                });
                expandedHtml += '</div>';
            }
            expanded.innerHTML = expandedHtml;

            item.appendChild(row);
            item.appendChild(expanded);

            item.addEventListener('click', function(e) {
                if (e.target.closest && e.target.closest('.word-checkbox')) return;
                item.classList.toggle('expanded');
            });

            group.appendChild(item);
        });

        container.appendChild(group);
    });
}

// ── Test Screen ────────────────────────────────────────────────

var testQuestions = [];
var testCurrentIndex = 0;
var testCorrectCount = 0;
var testTotalQuestions = 10;

// ── Hands-Free State ───────────────────────────────────────────
var handsFreeModeActive = false;  // toggled before test starts
var hfRecognition = null;         // single SpeechRecognition instance
var hfListenTimer = null;         // timeout for no-speech
var hfRetryCount = 0;             // retries per question (max 2)
var hfSpeechSupported = false;

function populateTestCategoryFilter() {
    var select = document.getElementById('test-category-filter');
    var cats = Object.keys(ALL_CATEGORIES).sort();
    cats.forEach(function(catId) {
        var opt = document.createElement('option');
        opt.value = catId;
        opt.textContent = ALL_CATEGORIES[catId].emoji + ' ' + ALL_CATEGORIES[catId].name;
        select.appendChild(opt);
    });
    select.addEventListener('change', function() {
        startTest();
    });
}

function startTest() {
    var category = document.getElementById('test-category-filter').value;
    var pool;
    if (category === 'all') {
        pool = ALL_WORDS.slice();
    } else {
        pool = ALL_WORDS.filter(function(w) { return w.category === category; });
    }

    if (pool.length < 4) {
        document.getElementById('test-prompt').textContent = 'Not enough words in this category';
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

function generateQuestions(pool, count) {
    var shuffled = shuffle(pool);
    var questions = [];

    for (var i = 0; i < count; i++) {
        var word = shuffled[i];
        // Randomly choose direction: de->en or en->de
        var direction = Math.random() < 0.5 ? 'de_to_en' : 'en_to_de';

        // Distractors: prefer same type AND category, then same category, then the whole pool
        var pick = pool.filter(function(w) { return w.id !== word.id && w.category === word.category && w.type === word.type; });
        if (pick.length < 3) {
            pick = pool.filter(function(w) { return w.id !== word.id && w.category === word.category; });
        }
        if (pick.length < 3) {
            pick = pool.filter(function(w) { return w.id !== word.id; });
        }
        var distractors = shuffle(pick).slice(0, 3);

        var options;
        if (direction === 'de_to_en') {
            options = distractors.map(function(d) { return { text: d.en, correct: false }; });
            options.push({ text: word.en, correct: true });
        } else {
            options = distractors.map(function(d) { return { text: d.de, correct: false }; });
            options.push({ text: word.de, correct: true });
        }
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
        '<span class="test-direction">' + q.directionLabel + '</span>' + q.prompt;

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

    if (handsFreeModeActive) {
        hfRetryCount = 0;
        speakQuestion(q, function() {
            startHFListening();
        });
    }
}

function handleTestAnswer(isCorrect, clickedBtn, container) {
    // Disable all options
    var allBtns = container.querySelectorAll('.test-option');
    allBtns.forEach(function(b) { b.classList.add('disabled'); });

    if (isCorrect) {
        testCorrectCount++;
        clickedBtn.classList.add('correct');
    } else {
        clickedBtn.classList.add('wrong');
        // Highlight the correct answer
        var q = testQuestions[testCurrentIndex];
        allBtns.forEach(function(b, idx) {
            if (q.options[idx].correct) b.classList.add('correct');
        });
    }

    updateTestScore();

    // Auto-advance after delay
    setTimeout(function() {
        testCurrentIndex++;
        showTestQuestion();
    }, 1200);
}

function updateTestScore() {
    document.getElementById('test-correct').textContent = testCorrectCount;
    document.getElementById('test-total').textContent = testQuestions.length;
    document.getElementById('test-progress').style.width =
        ((testCurrentIndex) / testQuestions.length * 100) + '%';
}

function showTestResult() {
    document.getElementById('test-question').style.display = 'none';
    document.getElementById('test-result').style.display = 'flex';

    var pct = Math.round(testCorrectCount / testQuestions.length * 100);
    var icon, message;
    if (pct >= 90) { icon = '\uD83C\uDF1F'; message = 'Excellent! Ausgezeichnet!'; }
    else if (pct >= 70) { icon = '\uD83D\uDC4D'; message = 'Good job! Gut gemacht!'; }
    else if (pct >= 50) { icon = '\uD83D\uDCAA'; message = 'Keep practicing! Weiter so!'; }
    else { icon = '\uD83D\uDCDA'; message = 'Keep studying! Weiter lernen!'; }

    document.getElementById('test-result-icon').textContent = icon;
    document.getElementById('test-result-score').textContent = testCorrectCount + ' / ' + testQuestions.length + ' (' + pct + '%)';
    document.getElementById('test-result-message').textContent = message;
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
    });

    hfRecognition = new SpeechRecognition();
    hfRecognition.continuous = false;
    hfRecognition.interimResults = false;

    hfRecognition.onresult = function(event) {
        clearTimeout(hfListenTimer);
        var transcript = event.results[0][0].transcript;
        hfProcessVoiceInput(transcript);
    };

    hfRecognition.onerror = function(event) {
        if (event.error === 'no-speech' || event.error === 'aborted') return;
        clearTimeout(hfListenTimer);
        hfHandleNoMatch();
    };

    hfRecognition.onend = function() {
        // handled via onresult or timeout
    };
}

// TTS helpers

function speakText(text, lang, onDone) {
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
        if (chainFired) return;
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
    return str.toLowerCase().trim().replace(/[^a-z0-9äöüß\s]/g, '');
}

function matchVoiceToOption(transcript, q) {
    var norm = hfNormalize(transcript);
    var matched = null;
    q.options.forEach(function(opt, idx) {
        var optNorm = hfNormalize(opt.text);
        if (norm === optNorm || norm.indexOf(optNorm) !== -1 || optNorm.indexOf(norm) !== -1) {
            matched = idx;
        }
    });
    return matched; // index into q.options, or null
}

function startHFListening() {
    if (!hfSpeechSupported || !handsFreeModeActive) return;
    var q = testQuestions[testCurrentIndex];
    var lang = q.direction === 'de_to_en' ? 'en-US' : 'de-DE';
    hfRecognition.lang = lang;

    var mic = document.getElementById('mic-indicator');
    mic.classList.remove('hidden');
    document.getElementById('mic-indicator').querySelector('.mic-status').textContent = 'Listening…';

    try { hfRecognition.start(); } catch(e) { /* already started */ }

    hfListenTimer = setTimeout(function() {
        try { hfRecognition.stop(); } catch(e) {}
        hfHandleNoMatch();
    }, 7000);
}

function stopHFListening() {
    clearTimeout(hfListenTimer);
    document.getElementById('mic-indicator').classList.add('hidden');
    try { hfRecognition.stop(); } catch(e) {}
}

function hfProcessVoiceInput(transcript) {
    stopHFListening();
    var q = testQuestions[testCurrentIndex];
    var matchIdx = matchVoiceToOption(transcript, q);
    var optionsContainer = document.getElementById('test-options');
    var btns = optionsContainer.querySelectorAll('.test-option');

    if (matchIdx !== null) {
        hfRetryCount = 0;
        handleTestAnswer(q.options[matchIdx].correct, btns[matchIdx], optionsContainer);

        var resultText = q.options[matchIdx].correct ? 'Richtig!' : 'Falsch — die Antwort ist ' + q.options.filter(function(o){return o.correct;})[0].text;
        var resultLang = 'de-DE';
        setTimeout(function() {
            speakText(resultText, resultLang, null);
        }, 300);
    } else {
        hfHandleNoMatch();
    }
}

function hfHandleNoMatch() {
    hfRetryCount++;
    if (hfRetryCount > 2) {
        // Auto-skip
        hfRetryCount = 0;
        stopHFListening();
        var q = testQuestions[testCurrentIndex];
        var optionsContainer = document.getElementById('test-options');
        var btns = optionsContainer.querySelectorAll('.test-option');
        var correctIdx = 0;
        q.options.forEach(function(o, i) { if (o.correct) correctIdx = i; });
        handleTestAnswer(false, btns[correctIdx], optionsContainer);
        speakText('Übersprungen — die Antwort ist ' + q.options[correctIdx].text, 'de-DE', null);
    } else {
        speakText('Bitte nochmal', 'de-DE', function() {
            startHFListening();
        });
    }
}

// ── Scenes Screen ──────────────────────────────────────────────

var currentSpeechCard = null; // track which card is currently playing

function playConversation(scenario, btn, card) {
    // If already playing this one, stop
    if (currentSpeechCard === card) {
        window.speechSynthesis.cancel();
        currentSpeechCard = null;
        btn.textContent = '\uD83D\uDD0A Play Conversation';
        btn.classList.remove('playing');
        return;
    }

    // Stop any other playing
    if (currentSpeechCard) {
        window.speechSynthesis.cancel();
        var oldBtn = currentSpeechCard.querySelector('.scene-play-btn');
        if (oldBtn) {
            oldBtn.textContent = '\uD83D\uDD0A Play Conversation';
            oldBtn.classList.remove('playing');
        }
    }

    currentSpeechCard = card;
    btn.textContent = '\u23F9 Stop';
    btn.classList.add('playing');
    if (typeof dailyLogRecord === 'function') dailyLogRecord('scenes', scenario.title);

    var lines = scenario.lines.slice();
    var lineIndex = 0;

    function speakNext() {
        if (lineIndex >= lines.length || currentSpeechCard !== card) {
            currentSpeechCard = null;
            btn.textContent = '\uD83D\uDD0A Play Conversation';
            btn.classList.remove('playing');
            return;
        }

        var utterance = new SpeechSynthesisUtterance(lines[lineIndex].de);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;

        utterance.onend = function() {
            lineIndex++;
            if (lineIndex < lines.length && currentSpeechCard === card) {
                setTimeout(speakNext, 1000);
            } else {
                currentSpeechCard = null;
                btn.textContent = '\uD83D\uDD0A Play Conversation';
                btn.classList.remove('playing');
            }
        };

        utterance.onerror = function() {
            currentSpeechCard = null;
            btn.textContent = '\uD83D\uDD0A Play Conversation';
            btn.classList.remove('playing');
        };

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
                '<span class="scene-chevron">\u25B6</span>';
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
                playBtn.textContent = '\uD83D\uDD0A Play Conversation';
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

function renderGrammar() {
    var container = document.getElementById('grammar-content');
    container.innerHTML = '';

    var viewedCount = grammarViewedIds().length;
    var progressEl = document.createElement('div');
    progressEl.className = 'progress-summary grammar-progress-summary';
    progressEl.innerHTML = '<span>' + viewedCount + '</span> / ' + ALL_GRAMMAR.length + ' chapters reviewed';
    container.appendChild(progressEl);

    var progressBarWrap = document.createElement('div');
    progressBarWrap.className = 'progress-bar-container';
    var progressBar = document.createElement('div');
    progressBar.className = 'progress-fill';
    progressBar.style.width = (ALL_GRAMMAR.length ? (viewedCount / ALL_GRAMMAR.length * 100) : 0) + '%';
    progressBarWrap.appendChild(progressBar);
    container.appendChild(progressBarWrap);

    var viewedIds = grammarViewedIds();

    ALL_GRAMMAR.forEach(function(section) {
        var sec = document.createElement('div');
        sec.className = 'grammar-section';

        var header = document.createElement('div');
        header.className = 'grammar-section-header';
        var reviewedBadge = viewedIds.indexOf(section.id) !== -1 ? '<span class="grammar-reviewed-badge" title="Reviewed">&#10003;</span>' : '';
        header.innerHTML = '<span class="emoji">' + section.emoji +
            '</span><span>' + section.title + '</span>' + reviewedBadge + '<span class="chevron">&#9654;</span>';
        header.addEventListener('click', function() {
            sec.classList.toggle('open');
            if (sec.classList.contains('open')) {
                grammarMarkViewed(section.id);
                if (!header.querySelector('.grammar-reviewed-badge')) {
                    header.insertAdjacentHTML('beforeend', '');
                    var badge = document.createElement('span');
                    badge.className = 'grammar-reviewed-badge';
                    badge.title = 'Reviewed';
                    badge.innerHTML = '&#10003;';
                    header.insertBefore(badge, header.querySelector('.chevron'));
                }
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
                    el.textContent = '\uD83D\uDCA1 ' + item.value;
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
}

// ── Progress / Storage ──────────────────────────────────────────
// 'word-progress' is the single live key for the unified deck. The old
// 'a1-word-progress' is seeded from once, then never written to again --
// it stays on disk untouched, byte-for-byte, as a permanent backup.

var WORD_PROGRESS_KEY = 'word-progress';

function loadProgress() {
    try {
        var saved = localStorage.getItem(WORD_PROGRESS_KEY);
        if (saved) {
            wordProgress = JSON.parse(saved);
            return;
        }
        var legacy = localStorage.getItem('a1-word-progress');
        if (legacy) {
            wordProgress = JSON.parse(legacy);
            saveProgress();
            return;
        }
        // Migrate from the even older pre-SRS knownWords format
        var oldSaved = localStorage.getItem('a1-known-words');
        if (oldSaved) {
            var oldIds = JSON.parse(oldSaved);
            oldIds.forEach(function(id) {
                wordProgress[id] = { level: 3, nextReview: Date.now() + 7 * 24 * 60 * 60 * 1000 };
            });
            saveProgress();
            localStorage.removeItem('a1-known-words');
        }
    } catch (e) {
        wordProgress = {};
    }
}

function saveProgress() {
    try {
        localStorage.setItem(WORD_PROGRESS_KEY, JSON.stringify(wordProgress));
    } catch (e) {}
}

function isWordLearned(wordId) {
    var prog = wordProgress[wordId];
    return prog && prog.level >= LEARNED_THRESHOLD;
}

function getLearnedCount() {
    var count = 0;
    for (var id in wordProgress) {
        if (wordProgress[id].level >= LEARNED_THRESHOLD) count++;
    }
    return count;
}

function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
        wordProgress = {};
        saveProgress();
        renderWordList();
        startSession(document.getElementById('category-filter').value);
    }
}
