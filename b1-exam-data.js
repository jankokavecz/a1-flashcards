// b1-exam-data.js — everything the Exam tab needs to run at B1 level:
// the official format of each module, the 60-point tactics, the writing
// templates, the speaking Redemittel, and the prompt skeletons used to
// generate and grade practice.
//
// Source: Goethe-Zertifikat B1 Durchführungsbestimmungen (1 Sep 2025) as
// summarised in the "B1 by March" plan, 7 September 2026.
// Loaded via <script> tag — all variables are global. ES5 only.
//
// THE TARGET IS 60, NOT 80. Every tactic below banks the easy points first.

var B1_EXAM_SECTIONS = {
  hoeren: {
    id: 'hoeren', emoji: '🎧', titleDe: 'Hören', titleEn: 'Listening',
    minutes: 40, items: 30, passItems: 18, passPoints: 60,
    teile: [
      { n: 1, items: 10, plays: 2, format: 'Five short texts (announcements, voicemails), multiple choice + true/false' },
      { n: 2, items: 5,  plays: 1, format: 'A talk or guided tour, multiple choice' },
      { n: 3, items: 7,  plays: 1, format: 'An everyday conversation, multiple choice' },
      { n: 4, items: 8,  plays: 2, format: 'Radio discussion with three voices (Moderator, A, B): who says what' }
    ],
    tactics: [
      'Teil 1 (10 items) and Teil 4 (8 items) are played twice. Together they are 18 items — the pass mark on their own. Teile 2 and 3 are bonus.',
      'Use every pause to read the next questions and underline the keyword: number, weekday, place, who.',
      'First hearing: answer. Second hearing: confirm. Do not switch an answer on a hunch.',
      'Teil 4: note who is speaking in the margin while they speak, then decide who said what.',
      'From January: hear the test audio at the gym in the morning, answer the questions that evening.'
    ]
  },
  lesen: {
    id: 'lesen', emoji: '📖', titleDe: 'Lesen', titleEn: 'Reading',
    minutes: 65, items: 30, passItems: 18, passPoints: 60,
    teile: [
      { n: 1, items: 6, minutes: 10, format: 'A blog post, true/false' },
      { n: 2, items: 6, minutes: 20, format: 'Two press texts, multiple choice' },
      { n: 3, items: 7, minutes: 10, format: 'Match 7 situations to 10 small ads (an answer may be "0" — no fitting ad)' },
      { n: 4, items: 7, minutes: 15, format: "Readers' opinions: for or against" },
      { n: 5, items: 4, minutes: 10, format: 'House rules or regulations, multiple choice' }
    ],
    tactics: [
      'Order: Teil 3 (10 min) → Teil 4 (15) → Teil 1 (10) → Teil 5 (10) → Teil 2 last (20). Teile 3 and 4 are 14 items of matching and for/against — take 10 of them and you are most of the way to 18.',
      'Teil 3: read the seven situations first, underline the one deciding condition in each (day, price, place, group size), then scan the ads.',
      'Teil 4: per person, one question — für oder gegen? Find the verdict sentence (usually first or last) and the negation words: nicht, kein, gegen, dagegen, leider.',
      'Never leave a blank — there is no penalty for guessing. When a part runs over its minutes, guess and move on.'
    ]
  },
  schreiben: {
    id: 'schreiben', emoji: '✍️', titleDe: 'Schreiben', titleEn: 'Writing',
    minutes: 60, items: 3, passPoints: 60,
    teile: [
      { n: 1, points: 40, words: 80, minutes: 20, format: 'Personal e-mail to a friend, 3 content points', criteria: ['Erfüllung', 'Kohärenz', 'Wortschatz', 'Strukturen'], criteriaMax: [10, 10, 10, 10] },
      { n: 2, points: 40, words: 80, minutes: 25, format: 'Opinion post for an online forum', criteria: ['Erfüllung', 'Kohärenz', 'Wortschatz', 'Strukturen'], criteriaMax: [10, 10, 10, 10] },
      { n: 3, points: 20, words: 40, minutes: 10, format: 'Formal or semi-formal e-mail', criteria: ['Erfüllung', 'Kohärenz', 'Wortschatz', 'Strukturen'], criteriaMax: [4, 4, 6, 6] }
    ],
    tactics: [
      'Order: Aufgabe 1 (20 min) → Aufgabe 3 (10) → Aufgabe 2 (25) → 5 minutes to count words and tick every content point.',
      'The Erfüllung rule: a task that misses the content points scores 0 in total. Tick each point in the margin before writing; one sentence per point is enough.',
      'Simple sentences, one idea each. Every text gets at least one weil-clause and one dass-clause with the verb at the end — those are the Strukturen points.',
      'Same opening and closing lines every time. Never improvise grammar under pressure.',
      'Digital exam: you type — practise ä ö ü ß. Paper: write legibly, blank line between paragraphs.'
    ]
  },
  sprechen: {
    id: 'sprechen', emoji: '🗣️', titleDe: 'Sprechen', titleEn: 'Speaking',
    minutes: 15, prepMinutes: 15, items: 3, passPoints: 60,
    teile: [
      { n: 1, points: 28, minutes: 3, format: 'Plan something together with your partner' },
      { n: 2, points: 40, minutes: 3, format: 'A presentation on one of two topics, built on five fixed slides' },
      { n: 3, points: 16, minutes: 2, format: "Feedback and questions on your partner's talk" },
      { n: 0, points: 16, minutes: 0, format: 'Pronunciation, assessed across all parts' }
    ],
    tactics: [
      'Teil 2 is 40 points and is prepared at home: eight canned presentations on the five-slide skeleton. In the 15-minute prep, pick the topic closest to your set and write keywords on the sheet.',
      'Teil 1 is interaction: suggest, ask your partner, agree or disagree with a reason, summarise the decision at the end. Say something every 20 seconds.',
      'If your partner is weak, ask them questions — that counts for you.',
      'Teil 3: two stock feedback sentences, two stock questions, and "Das ist eine gute Frage. Ich glaube, dass …" for answering.',
      'Pronunciation is 16 points: slow, clear, short sentences, finished sentences. Silence costs more than mistakes.'
    ]
  }
};

// ── Schreiben templates ─────────────────────────────────────────
// Blue parts (marked {{...}}) change with the task; everything else is
// written from memory. Word counts are met by adding one concrete detail
// per content point.

var B1_SCHREIBEN_TEMPLATES = [
  { id: 'aufgabe1', title: 'Aufgabe 1 · persönliche E-Mail', words: 80, points: 40,
    subtitle: '3 Inhaltspunkte — react, suggest, offer',
    lines: [
      { de: 'Liebe {{Anna}}, / Lieber {{Tom}},', gloss: '' },
      { de: 'vielen Dank für deine E-Mail. Ich habe mich sehr gefreut.', gloss: '' },
      { de: '{{Leider kann ich am Samstag nicht kommen, weil ich arbeiten muss.}}', gloss: 'Punkt 1: reagieren + Grund' },
      { de: '{{Wie wäre es mit Sonntag? Wir könnten uns um 15 Uhr im Café treffen.}}', gloss: 'Punkt 2: Vorschlag' },
      { de: '{{Soll ich etwas mitbringen? Ich kann einen Kuchen backen.}}', gloss: 'Punkt 3: Frage / Angebot' },
      { de: 'Ich freue mich auf deine Antwort.', gloss: '' },
      { de: 'Liebe Grüße', gloss: '' },
      { de: 'János', gloss: '' }
    ]},
  { id: 'aufgabe2', title: 'Aufgabe 2 · Meinung im Forum', words: 80, points: 40,
    subtitle: 'Opinion, reason, own experience, counter-point, conclusion',
    lines: [
      { de: 'Ich habe den Beitrag über {{„Handys in der Schule“}} gelesen und finde das Thema sehr interessant.', gloss: '' },
      { de: 'Meiner Meinung nach {{sind Handys in der Schule ein Problem}}, weil {{die Kinder sich nicht konzentrieren können}}.', gloss: 'Meinung + weil-Satz' },
      { de: 'Ich habe selbst die Erfahrung gemacht, dass {{…}}.', gloss: 'dass-Satz' },
      { de: 'Natürlich gibt es auch Vorteile: {{Die Kinder können schnell Informationen finden}}.', gloss: 'Gegenseite' },
      { de: 'Trotzdem denke ich, dass {{…}}.', gloss: '' },
      { de: 'Deshalb finde ich es wichtig, dass {{…}}.', gloss: 'Schluss' }
    ]},
  { id: 'aufgabe3', title: 'Aufgabe 3 · formelle E-Mail', words: 40, points: 20,
    subtitle: 'Thanks, cancel with a reason, ask for an alternative',
    lines: [
      { de: 'Sehr geehrte Frau {{Müller}}, / Sehr geehrter Herr {{Schmidt}},', gloss: '' },
      { de: 'vielen Dank für Ihre {{Einladung}}.', gloss: '' },
      { de: 'Leider kann ich am {{Montag}} nicht {{kommen}}, weil ich {{einen wichtigen Termin habe}}.', gloss: 'weil-Satz' },
      { de: 'Könnten wir einen anderen Termin vereinbaren? Ich bitte um Ihr Verständnis.', gloss: '' },
      { de: 'Mit freundlichen Grüßen', gloss: '' },
      { de: 'János Kokavecz', gloss: '' }
    ]}
];

// ── Sprechen Redemittel ─────────────────────────────────────────

var B1_SPRECHEN_REDEMITTEL = [
  { id: 'teil1', title: 'Teil 1 · gemeinsam etwas planen', groups: [
    { label: 'Start',      items: ['Wir sollen {{eine Party für unseren Kollegen}} planen. Hast du schon eine Idee?'] },
    { label: 'Vorschlag',  items: ['Ich schlage vor, dass wir …', 'Wie wäre es, wenn wir … ?', 'Wollen wir … ?'] },
    { label: 'Zustimmen',  items: ['Das ist eine gute Idee.', 'Einverstanden.', 'Da hast du recht.'] },
    { label: 'Ablehnen',   items: ['Das finde ich nicht so gut, weil …', 'Ich glaube, das ist zu teuer / zu weit.'] },
    { label: 'Nachfragen', items: ['Was meinst du?', 'Wann treffen wir uns?', 'Wer bringt … mit?'] },
    { label: 'Abschluss',  items: ['Gut, dann machen wir das so.', 'Also: Wir treffen uns am Samstag um zehn Uhr am Bahnhof.'] }
  ]},
  { id: 'teil2', title: 'Teil 2 · Präsentation · die fünf Folien', groups: [
    { label: '1 · Thema',              items: ['Ich möchte heute über das Thema {{„…“}} sprechen. Zuerst erzähle ich von meiner persönlichen Erfahrung, dann beschreibe ich die Situation in meinem Heimatland, danach nenne ich Vor- und Nachteile, und am Ende sage ich meine Meinung.'] },
    { label: '2 · Meine Erfahrung',    items: ['Ich habe selbst …', 'In meiner Familie …', 'Bei uns zu Hause …'] },
    { label: '3 · Mein Heimatland',    items: ['In {{Ungarn}} ist das so: Viele Leute …', 'Früher …, heute …'] },
    { label: '4 · Vor- und Nachteile', items: ['Ein großer Vorteil ist, dass …', 'Ein Nachteil ist aber, dass …', 'Einerseits …, andererseits …'] },
    { label: '5 · Meinung und Schluss',items: ['Ich persönlich finde, dass …, weil …', 'Ich bin am Ende meiner Präsentation. Vielen Dank fürs Zuhören. Haben Sie noch Fragen?'] }
  ]},
  { id: 'teil3', title: 'Teil 3 · Feedback und Fragen', groups: [
    { label: 'Feedback',  items: ['Vielen Dank für deine Präsentation. Ich fand sie sehr interessant, besonders den Teil über …'] },
    { label: 'Fragen',    items: ['Ich habe eine Frage: Wie ist das bei dir persönlich?', 'Was denkst du: Wird sich das in Zukunft ändern?'] },
    { label: 'Antworten', items: ['Das ist eine gute Frage. Ich glaube, dass …', 'Das kann ich nicht genau sagen, aber …'] }
  ]}
];

// Slides 2 and 5 are the same in all of them; only the topic words change.
// Draft eight of these from December, simplify, then make audio with the
// phone's read-aloud and shadow them on the scooter.
var B1_PRESENTATION_TOPICS = [
  { id: 'handys',      de: 'Handys für Kinder',            en: 'Mobile phones for children' },
  { id: 'fernsehen',   de: 'Fernsehen und Streaming',      en: 'Television and streaming' },
  { id: 'ernaehrung',  de: 'Fast Food und Ernährung',      en: 'Fast food and nutrition' },
  { id: 'sport',       de: 'Sport im Alltag',              en: 'Sport in everyday life' },
  { id: 'shopping',    de: 'Online-Shopping',              en: 'Online shopping' },
  { id: 'auto',        de: 'Auto in der Stadt',            en: 'Cars in the city' },
  { id: 'urlaub',      de: 'Urlaub im Ausland',            en: 'Holidays abroad' },
  { id: 'haustiere',   de: 'Haustiere',                    en: 'Pets' },
  { id: 'stadt_land',  de: 'Leben in der Stadt oder auf dem Land', en: 'City or country living' },
  { id: 'homeoffice',  de: 'Arbeiten von zu Hause',        en: 'Working from home' },
  { id: 'sprachen',    de: 'Fremdsprachen lernen',         en: 'Learning foreign languages' },
  { id: 'umwelt',      de: 'Umwelt und Müll',              en: 'Environment and waste' }
];

// ── The structures that earn the Strukturen points ──────────────

var B1_CONNECTORS = {
  own_by_december: ['weil', 'dass', 'wenn', 'deshalb', 'aber', 'außerdem', 'trotzdem', 'zuerst / dann / danach', 'zum Beispiel'],
  polite_requests: ['Könnten Sie … ?', 'Ich würde gern …', 'Wäre es möglich, … ?']
};

// ── Grammar chapters worth doing (Grammatik aktiv A1–B1) ────────
// 85 chapters in the book; these ~30 are the ones the exam pays for.

var B1_GRAMMAR_PRIORITIES = [
  'Verb endings, present tense (regular and irregular)',
  'Perfekt: haben or sein, participle forms',
  'Modal verbs: können, müssen, dürfen, sollen, wollen, mögen',
  'Word order: verb second, and the Satzklammer',
  'Nebensätze: weil, dass, wenn — verb to the end',
  'Nebensätze: obwohl, damit, als / wenn',
  'Articles and cases: Nominativ, Akkusativ, Dativ',
  'Possessives and personal pronouns in all three cases',
  'Prepositions with Akkusativ, with Dativ, and the two-way ones',
  'Konjunktiv II for politeness: würde, könnte, hätte, wäre',
  'Comparison: gut / besser / am besten, so … wie, als',
  'Präteritum of sein, haben and the modal verbs',
  'Adjective endings after der / ein / no article',
  'Reflexive verbs and verbs with fixed prepositions',
  'Passive with werden (recognition is enough)',
  'Relative clauses with der / die / das',
  'Infinitive with zu, um … zu',
  'Negation: nicht and kein, and where they go'
];

// ── Official practice material ──────────────────────────────────

var B1_OFFICIAL_SETS = [
  { id: 'modellsatz', name: 'Modellsatz (Erwachsene)', kind: 'pdf',
    url: 'https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf',
    audio: 'https://goethemp4s.akamaized.net/resources/files/mp468/pruefungstraining_1_hoeren_b1_erwachsene.mp4' },
  { id: 'uebungssatz', name: 'Übungssatz (Erwachsene)', kind: 'pdf',
    url: 'https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf',
    audio: 'https://goethemp4s.akamaized.net/resources/files/mp468/pruefungstraining_2_hoeren_b1_erwachsene.mp4' },
  { id: 'interaktiv', name: 'Interactive Modellsatz (in the browser)', kind: 'web',
    url: 'https://bfu.goethe.de/b1_mod/index.php', audio: '' },
  { id: 'wortliste', name: 'Goethe B1 Wortliste (the source for the word deck)', kind: 'pdf',
    url: 'https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf', audio: '' },
  { id: 'frankfurt', name: 'Goethe-Institut Frankfurt — B1 dates (dates load in a browser only)', kind: 'web',
    url: 'https://www.goethe.de/ins/de/de/prf/ort/fra/gzb1.cfm', audio: '' }
];

// ── Prompt skeletons for the in-app Exam tab ────────────────────
// Used with the existing examChatJson() helper (gpt-4o-mini, JSON mode).
// {{n}} and {{teil}} are substituted at call time. Every prompt must state
// the JSON shape, because the helper JSON.parses the reply.

var B1_EXAM_PROMPTS = {
  hoeren: 'Generate Teil {{teil}} of the Hören module of the Goethe-Zertifikat B1 exam for adults, at exactly B1 level (CEFR), in German. Follow the official format: {{format}}. Produce {{n}} items. Return JSON: {"items":[{"audioText":"the German text to be spoken, 40-90 words, natural spoken register","speakers":["nova"|"onyx"],"question":"the question in German","options":["A","B","C"],"answer":0,"transcriptNote":"the sentence that contains the answer"}]}. Use everyday topics of the kind the real exam uses: work, housing, travel, health, media, environment. Do not use words above B1.',
  lesen: 'Generate Teil {{teil}} of the Lesen module of the Goethe-Zertifikat B1 exam for adults, at exactly B1 level (CEFR), in German. Follow the official format: {{format}}. Produce {{n}} items. Return JSON: {"text":"the reading text","items":[{"question":"...","options":["A","B","C"],"answer":0,"evidence":"the sentence in the text that decides it"}]}.',
  schreiben: 'Generate Aufgabe {{teil}} of the Schreiben module of the Goethe-Zertifikat B1 exam for adults. Format: {{format}}. Return JSON: {"situation":"the situation in German, 2-3 sentences","inhaltspunkte":["point 1","point 2","point 3"],"wordTarget":{{words}},"register":"du"|"Sie"}.',
  schreiben_grade: 'You are an assessor for the Goethe-Zertifikat B1 Schreiben module. Task: {{task}}. Content points that had to be covered: {{points}}. The candidate wrote: """{{text}}""". Assess strictly by the official criteria. Return JSON: {"wordCount":0,"pointsCovered":[true,true,true],"erfuellung":0,"kohaerenz":0,"wortschatz":0,"strukturen":0,"total":0,"maxTotal":{{max}},"corrected":"the text with corrections marked in **bold**, keeping the candidate\'s simple sentences","topErrors":[{"error":"...","rule":"one line"}],"phrases":["three B1 Redemittel to reuse"]}. If any content point is not addressed, Erfüllung is 0 and the total for the task is 0 — say so in topErrors.',
  sprechen: 'Generate Teil {{teil}} of the Sprechen module of the Goethe-Zertifikat B1 exam for adults. Format: {{format}}. Return JSON: {"aufgabe":"the task in German","stichpunkte":["4 bullet points to cover"],"partnerOpener":"what the partner says first, in German"}.',
  sprechen_grade: 'You are an examiner for the Goethe-Zertifikat B1 Sprechen module. The task was: {{task}}. The candidate said: """{{transcript}}""". Assess by the official criteria. Return JSON: {"erfuellung":0,"interaktion":0,"wortschatz":0,"strukturen":0,"aussprache":0,"total":0,"maxTotal":100,"feedback":"two sentences in English","repeatedMistakes":["three"],"missingPhrases":["three B1 phrases that should have been used"]}. Remember the speech-to-text transcript cannot show pronunciation reliably — score Aussprache on word choice and sentence completeness only, and say so in the feedback.'
};

// ── The two long-form coach prompts (for Claude voice mode) ─────
// These live in the plan, not in the app's API calls. The Exam tab shows
// them with a copy button for the Friday speaking slot and Saturday writing.

var B1_COACH_PROMPTS = [
  { id: 'examiner', title: 'AI examiner — Friday Sprechen', text:
'You are an examiner for the Goethe-Zertifikat B1 speaking module (Sprechen). Speak only German, at B1 level, slowly, in short sentences. Run the exam in three parts and keep the timing.\n' +
'Teil 1 (gemeinsam etwas planen, about 3 minutes): give me a planning task with four points to discuss (for example: plan a farewell party for a colleague — when, where, food, gift). You are my partner: make suggestions, react to mine, ask me questions.\n' +
'Teil 2 (Präsentation, about 3 minutes): give me one topic in the form "Thema: …", then let me deliver my five-part presentation without interrupting.\n' +
'Teil 3 (about 2 minutes): give short feedback on my presentation and ask me two questions about it. Then swap: you give a one-minute presentation and I give feedback and ask questions.\n' +
'At the end switch to English and score me on the Goethe criteria — Erfüllung, Interaktion, Wortschatz, Strukturen, Aussprache — with an estimated total out of 100 (pass is 60), my three most repeated mistakes, and three B1 phrases I should have used. Start now with Teil 1.' },
  { id: 'corrector', title: 'AI corrector — Saturday Schreiben', text:
'Act as an assessor for the Goethe-Zertifikat B1 writing module (Schreiben). I will paste the task and my text.\n' +
'1. Count the words.\n' +
'2. Check that every content point (Inhaltspunkt) is addressed. If one is missing, say so first — a missing point means Erfüllung 0 and 0 points for the whole task.\n' +
'3. Score Erfüllung, Kohärenz, Wortschatz and Strukturen (each out of 10 for Aufgabe 1 and 2; 4, 4, 6 and 6 for Aufgabe 3) and give the total.\n' +
'4. Show my text with corrections in bold. Keep my sentences simple — do not rewrite them at a higher level.\n' +
'5. List my three most important errors, one line of rule each.\n' +
'6. Give me three B1-level phrases (Redemittel) I should reuse next time.\n' +
'Reply in English; corrections and phrases in German.' }
];
