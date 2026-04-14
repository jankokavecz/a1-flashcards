// Goethe A1 Flashcard App — Core Logic
// Depends on globals from words.js (WORDS, CATEGORIES) and grammar.js (GRAMMAR_SECTIONS)

var knownWords = new Set();
var currentDeck = [];
var currentIndex = 0;
var isFlipped = false;

// ── Initialization ──────────────────────────────────────────────

function init() {
    loadProgress();
    populateCategoryFilter();
    startSession('all');
    renderWordList();
    renderGrammar();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
}

document.addEventListener('DOMContentLoaded', init);

// ── Navigation ──────────────────────────────────────────────────

function switchTab(tabName) {
    document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
    });
    document.getElementById(tabName + '-screen').classList.add('active');

    document.querySelectorAll('.tab').forEach(function(t) {
        t.classList.remove('active');
    });
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');

    if (tabName === 'words') renderWordList();
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
    currentDeck = shuffle(words);
    currentIndex = 0;
    isFlipped = false;
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
        document.getElementById('card-front-word').textContent = 'No cards!';
        document.getElementById('card-hint').textContent = 'Select a category';
        document.getElementById('card-counter').textContent = '0 / 0';
        document.getElementById('session-progress').style.width = '0%';
        return;
    }

    if (currentIndex >= currentDeck.length) {
        document.getElementById('card-front-word').textContent = '\uD83C\uDF89 Done!';
        document.getElementById('card-hint').textContent = 'All cards reviewed! Tap to restart.';
        document.getElementById('card-counter').textContent = currentDeck.length + ' / ' + currentDeck.length;
        document.getElementById('session-progress').style.width = '100%';
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

    // Front side
    document.getElementById('card-type').textContent = word.type;
    document.getElementById('card-type').className = 'card-type-badge type-' + word.type;
    document.getElementById('card-front-word').textContent = word.de;
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

    // Counter and progress bar
    document.getElementById('card-counter').textContent = (currentIndex + 1) + ' / ' + currentDeck.length;
    document.getElementById('session-progress').style.width = ((currentIndex + 1) / currentDeck.length * 100) + '%';
}

function flipCard() {
    isFlipped = !isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped');
}

function markKnown() {
    if (currentDeck.length === 0 || currentIndex >= currentDeck.length) return;
    var word = currentDeck[currentIndex];
    knownWords.add(word.id);
    saveProgress();
    currentIndex++;
    showCurrentCard();
}

function markLearning() {
    if (currentDeck.length === 0 || currentIndex >= currentDeck.length) return;
    var word = currentDeck[currentIndex];
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
    document.getElementById('words-learned').textContent = knownWords.size;
    document.getElementById('words-total').textContent = WORDS.length;
    document.getElementById('words-progress').style.width = (knownWords.size / WORDS.length * 100) + '%';

    // Group by category, sorted alphabetically
    var catIds = Object.keys(CATEGORIES).sort(function(a, b) {
        return CATEGORIES[a].name.localeCompare(CATEGORIES[b].name);
    });

    catIds.forEach(function(catId) {
        var catWords = WORDS.filter(function(w) { return w.category === catId; });
        if (catWords.length === 0) return;

        var group = document.createElement('div');
        group.className = 'category-group';

        var learnedCount = catWords.filter(function(w) { return knownWords.has(w.id); }).length;

        var header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = '<span>' + CATEGORIES[catId].emoji + ' ' + CATEGORIES[catId].name +
            '</span><span class="category-count">' + learnedCount + '/' + catWords.length + '</span>';
        group.appendChild(header);

        catWords.forEach(function(word) {
            var item = document.createElement('div');
            item.className = 'word-item' + (knownWords.has(word.id) ? ' learned' : '');

            var main = document.createElement('div');
            main.className = 'word-main';
            main.innerHTML = '<div><span class="word-de">' + word.de +
                '</span> <span class="word-type-badge type-' + word.type + '">' + word.type +
                '</span></div><span class="word-en">' + word.en + '</span>';

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

            item.appendChild(main);
            item.appendChild(expanded);

            item.addEventListener('click', function() {
                item.classList.toggle('expanded');
            });

            group.appendChild(item);
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

// ── Progress / Storage ──────────────────────────────────────────

function loadProgress() {
    try {
        var saved = localStorage.getItem('a1-known-words');
        if (saved) {
            knownWords = new Set(JSON.parse(saved));
        }
    } catch (e) {
        knownWords = new Set();
    }
}

function saveProgress() {
    try {
        localStorage.setItem('a1-known-words', JSON.stringify(Array.from(knownWords)));
    } catch (e) {}
}

function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
        knownWords = new Set();
        saveProgress();
        renderWordList();
        startSession(document.getElementById('category-filter').value);
    }
}
