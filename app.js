// Goethe A1 Flashcard App — Core Logic
// Depends on globals from words.js (WORDS, CATEGORIES) and grammar.js (GRAMMAR_SECTIONS)

// Spaced repetition intervals in days per level
var SRS_INTERVALS = [0, 1, 3, 7, 14, 30];
var LEARNED_THRESHOLD = 1; // level >= 1 counts as "learned" (seen at least once)

var wordProgress = {}; // { wordId: { level: 0, nextReview: timestamp } }
var currentDeck = [];
var currentIndex = 0;
var isFlipped = false;

// ── Initialization ──────────────────────────────────────────────

function init() {
    loadProgress();
    populateCategoryFilter();
    populateTestCategoryFilter();
    startSession('all');
    renderWordList();
    renderGrammar();
    renderScenes();
    renderComics();
    initHandsFree();
    initCalls();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
}

document.addEventListener('DOMContentLoaded', init);

// ── Navigation ──────────────────────────────────────────────────

function switchTab(tabName) {
    // Stop hands-free and calls speech when switching away
    window.speechSynthesis.cancel();
    if (tabName !== 'test') stopHFListening();
    if (tabName !== 'calls') callsStopAll();

    document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
    });
    document.getElementById(tabName + '-screen').classList.add('active');

    document.querySelectorAll('.tab').forEach(function(t) {
        t.classList.remove('active');
    });
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');

    if (tabName === 'words') renderWordList();
    if (tabName === 'test' && testQuestions.length === 0) startTest();
    if (tabName === 'calls') renderCallsScreen();
}

// ── Cards Logic ─────────────────────────────────────────────────

function populateCategoryFilter() {
    var select = document.getElementById('category-filter');
    var cats = Object.keys(CATEGORIES).sort();
    cats.forEach(function(catId) {
        var opt = document.createElement('option');
        opt.value = catId;
        opt.textContent = CATEGORIES[catId].emoji + ' ' + CATEGORIES[catId].name;
        select.appendChild(opt);
    });
    select.addEventListener('change', function() {
        startSession(this.value);
    });
}

function startSession(category) {
    var words;
    if (category === 'all') {
        words = WORDS.slice();
    } else {
        words = WORDS.filter(function(w) { return w.category === category; });
    }

    var now = Date.now();

    // Split into due (overdue) and new cards
    var due = [];
    var newCards = [];
    words.forEach(function(w) {
        var prog = wordProgress[w.id];
        if (!prog) {
            newCards.push(w);
        } else if (prog.nextReview <= now) {
            due.push(w);
        }
        // Skip cards not yet due
    });

    // Sort due cards: most overdue first
    due.sort(function(a, b) {
        return (wordProgress[a.id].nextReview || 0) - (wordProgress[b.id].nextReview || 0);
    });

    // Combine: due cards first, then shuffled new cards
    currentDeck = due.concat(shuffle(newCards));
    currentIndex = 0;
    isFlipped = false;

    // Update session info
    var counterEl = document.getElementById('card-counter');
    if (currentDeck.length === 0) {
        counterEl.textContent = 'All reviewed!';
    } else {
        var dueCount = due.length;
        var newCount = newCards.length;
        counterEl.textContent = dueCount + ' due, ' + newCount + ' new';
    }

    showCurrentCard();
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
}

function markKnown() {
    if (currentDeck.length === 0 || currentIndex >= currentDeck.length) return;
    var word = currentDeck[currentIndex];

    // Increase SRS level
    var prog = wordProgress[word.id] || { level: 0, nextReview: 0 };
    prog.level = Math.min(prog.level + 1, 5);
    var intervalDays = SRS_INTERVALS[prog.level];
    prog.nextReview = Date.now() + intervalDays * 24 * 60 * 60 * 1000;
    wordProgress[word.id] = prog;

    saveProgress();
    currentIndex++;
    showCurrentCard();
}

function markLearning() {
    if (currentDeck.length === 0 || currentIndex >= currentDeck.length) return;
    var word = currentDeck[currentIndex];

    // Reset SRS level to 0
    wordProgress[word.id] = { level: 0, nextReview: 0 };
    saveProgress();

    // Re-insert card later in deck
    currentDeck.splice(currentIndex, 1);
    var insertAt = currentIndex + Math.floor(Math.random() * Math.max(1, currentDeck.length - currentIndex)) + 1;
    if (insertAt > currentDeck.length) insertAt = currentDeck.length;
    currentDeck.splice(insertAt, 0, word);
    showCurrentCard();
}

// ── Words Screen ────────────────────────────────────────────────

function renderWordList() {
    var container = document.getElementById('word-list');
    container.innerHTML = '';

    // Update progress stats
    var learnedTotal = getLearnedCount();
    document.getElementById('words-learned').textContent = learnedTotal;
    document.getElementById('words-total').textContent = WORDS.length;
    document.getElementById('words-progress').style.width = (learnedTotal / WORDS.length * 100) + '%';

    // Group by category, sorted alphabetically
    var catIds = Object.keys(CATEGORIES).sort(function(a, b) {
        return CATEGORIES[a].name.localeCompare(CATEGORIES[b].name);
    });

    catIds.forEach(function(catId) {
        var catWords = WORDS.filter(function(w) { return w.category === catId; });
        if (catWords.length === 0) return;

        var group = document.createElement('div');
        group.className = 'category-group';

        var learnedCount = catWords.filter(function(w) { return isWordLearned(w.id); }).length;

        var header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = '<span>' + CATEGORIES[catId].emoji + ' ' + CATEGORIES[catId].name +
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
                        // Mark as learned: set level 1
                        wordProgress[w.id] = { level: 1, nextReview: Date.now() + 1 * 24 * 60 * 60 * 1000 };
                        cb.classList.add('checked');
                        cb.innerHTML = '&#10003;';
                        it.classList.add('learned');
                    }
                    saveProgress();
                    // Update counters
                    var newLearnedTotal = getLearnedCount();
                    document.getElementById('words-learned').textContent = newLearnedTotal;
                    document.getElementById('words-progress').style.width = (newLearnedTotal / WORDS.length * 100) + '%';
                    var catLearned = catWords.filter(function(cw) { return isWordLearned(cw.id); }).length;
                    header.innerHTML = '<span>' + CATEGORIES[catId].emoji + ' ' + CATEGORIES[catId].name +
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
            main.innerHTML = '<div><span class="' + deClass + '">' + word.de +
                '</span> <span class="word-type-badge type-' + word.type + '">' + word.type +
                '</span></div><span class="word-en">' + word.en + '</span>';
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
    var cats = Object.keys(CATEGORIES).sort();
    cats.forEach(function(catId) {
        var opt = document.createElement('option');
        opt.value = catId;
        opt.textContent = CATEGORIES[catId].emoji + ' ' + CATEGORIES[catId].name;
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
        pool = WORDS.slice();
    } else {
        pool = WORDS.filter(function(w) { return w.category === category; });
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

        // Get distractors from same category
        var sameCategory = pool.filter(function(w) { return w.id !== word.id && w.category === word.category; });
        if (sameCategory.length < 3) {
            // Fall back to random if category too small
            sameCategory = pool.filter(function(w) { return w.id !== word.id; });
        }
        var distractors = shuffle(sameCategory).slice(0, 3);

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

    var themeIds = Object.keys(SCENARIO_THEMES);

    themeIds.forEach(function(themeId) {
        var themeScenarios = SCENARIOS.filter(function(s) { return s.theme === themeId; });
        if (themeScenarios.length === 0) return;

        var group = document.createElement('div');
        group.className = 'scene-theme-group';

        var header = document.createElement('div');
        header.className = 'scene-theme-header';
        header.textContent = SCENARIO_THEMES[themeId].emoji + ' ' + SCENARIO_THEMES[themeId].name;
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

function renderGrammar() {
    var container = document.getElementById('grammar-content');
    container.innerHTML = '';

    GRAMMAR_SECTIONS.forEach(function(section) {
        var sec = document.createElement('div');
        sec.className = 'grammar-section';

        var header = document.createElement('div');
        header.className = 'grammar-section-header';
        header.innerHTML = '<span class="emoji">' + section.emoji +
            '</span><span>' + section.title + '</span><span class="chevron">&#9654;</span>';
        header.addEventListener('click', function() {
            sec.classList.toggle('open');
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

// ── Comics Screen ──────────────────────────────────────────────

function renderComics() {
    var container = document.getElementById('comics-content');
    container.innerHTML = '';

    COMICS.forEach(function(comic) {
        var card = document.createElement('div');
        card.className = 'comic-card';

        var header = document.createElement('div');
        header.className = 'comic-header';
        header.innerHTML =
            '<div><div class="comic-title">' + comic.title + '</div>' +
            '<div class="comic-title-de">' + comic.titleDe + '</div></div>' +
            '<span class="comic-chevron">&#9654;</span>';
        header.addEventListener('click', function() {
            card.classList.toggle('open');
        });
        card.appendChild(header);

        var body = document.createElement('div');
        body.className = 'comic-body';

        // SVG illustration (composed from character helpers + scene background)
        var illustration = document.createElement('div');
        illustration.className = 'comic-illustration';
        illustration.innerHTML = buildComicSvg(comic);
        body.appendChild(illustration);

        // Speech bubbles
        var bubblesContainer = document.createElement('div');
        bubblesContainer.className = 'comic-bubbles';

        comic.bubbles.forEach(function(bubble) {
            var bubbleEl = document.createElement('div');
            bubbleEl.className = 'comic-bubble ' + (bubble.speaker === 'cat' ? 'bubble-cat' : 'bubble-dog');

            var speakerLabel = bubble.speaker === 'cat' ? 'Katze' : 'Hund';
            bubbleEl.innerHTML =
                '<div class="bubble-speaker">' + speakerLabel + '</div>' +
                '<div class="bubble-de">' + bubble.de + '</div>' +
                '<div class="bubble-en">' + bubble.en + '</div>';

            bubbleEl.addEventListener('click', function() {
                bubbleEl.classList.toggle('show-translation');
            });

            bubblesContainer.appendChild(bubbleEl);
        });

        body.appendChild(bubblesContainer);

        var hint = document.createElement('div');
        hint.className = 'comic-hint';
        hint.textContent = 'Tap bubbles to reveal English';
        body.appendChild(hint);

        card.appendChild(body);
        container.appendChild(card);
    });
}

// ── Progress / Storage ──────────────────────────────────────────

function loadProgress() {
    try {
        var saved = localStorage.getItem('a1-word-progress');
        if (saved) {
            wordProgress = JSON.parse(saved);
        } else {
            // Migrate from old knownWords format
            var oldSaved = localStorage.getItem('a1-known-words');
            if (oldSaved) {
                var oldIds = JSON.parse(oldSaved);
                oldIds.forEach(function(id) {
                    wordProgress[id] = { level: 3, nextReview: Date.now() + 7 * 24 * 60 * 60 * 1000 };
                });
                saveProgress();
                localStorage.removeItem('a1-known-words');
            }
        }
    } catch (e) {
        wordProgress = {};
    }
}

function saveProgress() {
    try {
        localStorage.setItem('a1-word-progress', JSON.stringify(wordProgress));
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
