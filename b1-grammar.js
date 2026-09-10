// B1 grammar content — 18 chapters, loaded via <script src="b1-grammar.js"> as a plain global; ES5 only (var, no arrow functions/const/let/template literals).
var B1_GRAMMAR_SECTIONS = [
  // ============================================================
  // 1. Verb Endings in the Present Tense
  // ============================================================
  {
    id: "b1_verb_endings",
    title: "Verb Endings in the Present Tense",
    emoji: "🔡",
    content: [
      { type: "text", value: "At B1 level you should be able to conjugate almost any verb correctly, including the trickier patterns that A1 only touches on. This chapter reviews the basic endings and then adds the patterns that regularly cause mistakes: stem changes, verbs ending in -eln/-ern, and verbs whose stem already ends in a vowel or sibilant." },
      { type: "heading", value: "The Basic Endings (Review)" },
      {
        type: "table",
        headers: ["Person", "Ending", "lernen"],
        rows: [
          ["ich", "-e", "lerne"],
          ["du", "-st", "lernst"],
          ["er/sie/es", "-t", "lernt"],
          ["wir", "-en", "lernen"],
          ["ihr", "-t", "lernt"],
          ["sie/Sie", "-en", "lernen"]
        ]
      },
      { type: "heading", value: "Stem-Changing Verbs (e→i, e→ie, a→ä)" },
      { type: "text", value: "A large group of strong verbs change their stem vowel only in the du- and er/sie/es-forms. Learning these by heart is essential for B1, since they appear constantly in speech." },
      {
        type: "table",
        headers: ["Verb", "Change", "du", "er/sie/es"],
        rows: [
          ["helfen (to help)", "e → i", "hilfst", "hilft"],
          ["treffen (to meet)", "e → i", "triffst", "trifft"],
          ["vergessen (to forget)", "e → i", "vergisst", "vergisst"],
          ["empfehlen (to recommend)", "e → ie", "empfiehlst", "empfiehlt"],
          ["tragen (to carry/wear)", "a → ä", "trägst", "trägt"],
          ["halten (to hold/stop)", "a → ä", "hältst", "hält"],
          ["raten (to advise/guess)", "a → ä", "rätst", "rät"],
          ["waschen (to wash)", "a → ä", "wäschst", "wäscht"]
        ]
      },
      { type: "heading", value: "Verbs Ending in -eln and -ern" },
      { type: "text", value: "Verbs whose infinitive ends in -eln usually drop the extra -e- in the ich-form. Verbs ending in -ern normally stay regular." },
      {
        type: "table",
        headers: ["Infinitive", "ich-form", "wir-form", "Note"],
        rows: [
          ["sammeln (to collect)", "ich sammle", "wir sammeln", "drop the -e- before -le"],
          ["lächeln (to smile)", "ich lächle", "wir lächeln", "drop the -e- before -le"],
          ["handeln (to act/trade)", "ich handle", "wir handeln", "drop the -e- before -le"],
          ["wandern (to hike)", "ich wandere", "wir wandern", "-ern verbs keep the -e-"],
          ["ändern (to change)", "ich ändere", "wir ändern", "-ern verbs keep the -e-"]
        ]
      },
      { type: "tip", value: "If the stem already ends in -s, -ß, -z, or -x, the du-form does not add another -s: du tanzt, du heißt, du sitzt (never *tanzsst)." },
      { type: "tip", value: "If the stem ends in -t or -d, insert an extra -e- before -st and -t: du arbeitest, er findet, ihr redet." },
      { type: "tip", value: "Stem-vowel changes (e→i, e→ie, a→ä) never appear in the wir- or sie/Sie-forms — those always look like the infinitive plus -en: wir helfen, sie tragen." },
      { type: "example", de: "Er empfiehlt mir ein gutes Restaurant.", en: "He recommends a good restaurant to me." },
      { type: "example", de: "Ich sammle seit Jahren Briefmarken.", en: "I have been collecting stamps for years." },
      { type: "example", de: "Wäschst du dir vor dem Essen die Hände?", en: "Do you wash your hands before eating?" },
      { type: "example", de: "Wir wandern jedes Wochenende in den Bergen.", en: "We hike in the mountains every weekend." }
    ]
  },

  // ============================================================
  // 2. Perfekt: haben oder sein, Partizip-Formen
  // ============================================================
  {
    id: "b1_perfekt",
    title: "Perfekt: haben oder sein?",
    emoji: "⌛",
    content: [
      { type: "text", value: "The Perfekt is the tense native speakers use most often to talk about the past in conversation. It is built from a conjugated auxiliary verb (haben or sein) in position 2 and the Partizip II (past participle) at the very end of the sentence — the classic Satzklammer pattern." },
      { type: "heading", value: "Forming the Partizip II — Regular (weak) Verbs" },
      {
        type: "table",
        headers: ["Infinitive", "Partizip II", "Pattern"],
        rows: [
          ["machen", "gemacht", "ge- + stem + -t"],
          ["spielen", "gespielt", "ge- + stem + -t"],
          ["arbeiten", "gearbeitet", "ge- + stem + -et (stem ends in -t)"],
          ["kaufen", "gekauft", "ge- + stem + -t"]
        ]
      },
      { type: "heading", value: "Forming the Partizip II — Irregular (strong) Verbs" },
      { type: "text", value: "Strong verbs often change their stem vowel and end in -en instead of -t. These simply have to be memorized, but the most common ones repeat constantly, so they become automatic quickly." },
      {
        type: "table",
        headers: ["Infinitive", "Partizip II", "Infinitive", "Partizip II"],
        rows: [
          ["gehen", "gegangen", "kommen", "gekommen"],
          ["essen", "gegessen", "trinken", "getrunken"],
          ["sehen", "gesehen", "nehmen", "genommen"],
          ["lesen", "gelesen", "schreiben", "geschrieben"],
          ["sprechen", "gesprochen", "finden", "gefunden"],
          ["helfen", "geholfen", "fahren", "gefahren"],
          ["sein", "gewesen", "bleiben", "geblieben"],
          ["werden", "geworden", "tun", "getan"]
        ]
      },
      { type: "heading", value: "When There Is No ge- Prefix" },
      {
        type: "table",
        headers: ["Verb type", "Example", "Partizip II"],
        rows: [
          ["Verbs ending in -ieren", "studieren", "studiert"],
          ["Inseparable prefixes: be-, ver-, ent-, er-, ge-, emp-, zer-, miss-", "besuchen", "besucht"],
          ["Inseparable prefixes", "verstehen", "verstanden"],
          ["Inseparable prefixes", "erzählen", "erzählt"]
        ]
      },
      { type: "heading", value: "Separable Verbs: ge- Goes in the Middle" },
      {
        type: "table",
        headers: ["Infinitive", "Partizip II"],
        rows: [
          ["aufstehen", "aufgestanden"],
          ["einkaufen", "eingekauft"],
          ["anrufen", "angerufen"],
          ["fernsehen", "ferngesehen"]
        ]
      },
      { type: "heading", value: "Choosing haben or sein" },
      { type: "text", value: "Most verbs — including all reflexive verbs and every verb with an accusative object — take haben. A smaller but very common group takes sein instead." },
      {
        type: "table",
        headers: ["Use sein when the verb expresses...", "Examples"],
        rows: [
          ["Movement from one place to another", "gehen, fahren, fliegen, laufen, kommen"],
          ["A change of state or condition", "aufwachen, einschlafen, sterben, wachsen"],
          ["sein, bleiben, werden and a few others", "sein, bleiben, werden, passieren, gelingen"]
        ]
      },
      { type: "tip", value: "Ask yourself: does the subject move or change, or is there no accusative object? If yes, it is probably a sein-verb." },
      { type: "tip", value: "A few verbs of motion (schwimmen, fliegen, fahren) can take haben when you focus on the activity itself rather than the destination — but sein is by far the more common choice at B1." },
      { type: "tip", value: "Reflexive verbs (sich freuen, sich waschen) always take haben, even though they may feel like 'change' verbs." },
      { type: "example", de: "Ich habe gestern den ganzen Tag gearbeitet.", en: "I worked all day yesterday." },
      { type: "example", de: "Wir sind letztes Jahr nach Italien gefahren.", en: "We drove to Italy last year." },
      { type: "example", de: "Sie ist um sechs Uhr aufgewacht.", en: "She woke up at six o'clock." },
      { type: "example", de: "Hast du das Buch schon gelesen?", en: "Have you already read the book?" },
      { type: "example", de: "Er ist letzte Woche krank geworden.", en: "He became ill last week." }
    ]
  },

  // ============================================================
  // 3. Modalverben: können, müssen, dürfen, sollen, wollen, mögen
  // ============================================================
  {
    id: "b1_modal_verbs",
    title: "Modalverben: können, müssen, dürfen, sollen, wollen, mögen",
    emoji: "🛠️",
    content: [
      { type: "text", value: "Modal verbs are conjugated irregularly and add meaning (ability, necessity, permission, obligation, desire, or liking) to a main verb. The modal takes position 2, and the main verb appears as an infinitive at the very end of the sentence." },
      { type: "heading", value: "Full Conjugation of All Six Modal Verbs" },
      {
        type: "table",
        headers: ["Person", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"],
        rows: [
          ["ich", "kann", "muss", "darf", "soll", "will", "mag"],
          ["du", "kannst", "musst", "darfst", "sollst", "willst", "magst"],
          ["er/sie/es", "kann", "muss", "darf", "soll", "will", "mag"],
          ["wir", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"],
          ["ihr", "könnt", "müsst", "dürft", "sollt", "wollt", "mögt"],
          ["sie/Sie", "können", "müssen", "dürfen", "sollen", "wollen", "mögen"]
        ]
      },
      { type: "heading", value: "What Each Modal Verb Means" },
      {
        type: "table",
        headers: ["Modal", "Core meaning", "Example"],
        rows: [
          ["können", "ability, possibility", "Ich kann schwimmen."],
          ["müssen", "necessity, obligation", "Ich muss arbeiten."],
          ["dürfen", "permission", "Ich darf hier parken."],
          ["sollen", "external expectation, advice from someone else", "Ich soll mehr Sport machen."],
          ["wollen", "wish, intention", "Ich will nach Hause gehen."],
          ["mögen", "liking (usually + noun, not + infinitive)", "Ich mag klassische Musik."]
        ]
      },
      { type: "heading", value: "The Trap: nicht müssen vs. nicht dürfen" },
      { type: "text", value: "This is one of the most common B1 mistakes. 'nicht müssen' means something is not necessary; 'nicht dürfen' means something is forbidden." },
      {
        type: "table",
        headers: ["German", "Meaning"],
        rows: [
          ["Du musst das nicht machen.", "You don't have to do that. (it's optional)"],
          ["Du darfst das nicht machen.", "You must not do that. (it's forbidden)"]
        ]
      },
      { type: "tip", value: "Modal verbs never take an ending in the ich- and er/sie/es-forms: ich kann, er kann — not *er kannt." },
      { type: "tip", value: "mögen is mostly used with a noun (Ich mag Kaffee), while wanting to do something is expressed with möchten: Ich möchte einen Kaffee trinken." },
      { type: "tip", value: "sollen often reports someone else's advice or expectation, not the speaker's own opinion: Der Arzt sagt, ich soll mehr schlafen." },
      { type: "example", de: "Wir müssen morgen früh aufstehen.", en: "We have to get up early tomorrow." },
      { type: "example", de: "Darf ich hier rauchen?", en: "Am I allowed to smoke here?" },
      { type: "example", de: "Ich mag ihn sehr.", en: "I like him a lot." },
      { type: "example", de: "Du sollst deine Eltern anrufen.", en: "You are supposed to call your parents." }
    ]
  },

  // ============================================================
  // 4. Word Order: Verb Second and the Satzklammer
  // ============================================================
  {
    id: "b1_word_order_satzklammer",
    title: "Word Order: Verb Second and the Satzklammer",
    emoji: "🖼️",
    content: [
      { type: "text", value: "German main clauses are built around a verbal bracket called the Satzklammer ('sentence frame'). The conjugated verb forms the linke Klammer (left bracket) in position 2, and any second verb part — an infinitive, a participle, or a separable prefix — forms the rechte Klammer (right bracket) at the very end. Everything in between is called the Mittelfeld (middle field)." },
      { type: "heading", value: "The Satzklammer in Different Tenses" },
      {
        type: "table",
        headers: ["Vorfeld", "Linke Klammer", "Mittelfeld", "Rechte Klammer"],
        rows: [
          ["Ich", "kann", "am Wochenende nicht", "kommen."],
          ["Er", "hat", "das Buch schon", "gelesen."],
          ["Wir", "stehen", "jeden Tag um sechs Uhr", "auf."],
          ["Sie", "wird", "nächstes Jahr in Berlin", "studieren."]
        ]
      },
      { type: "heading", value: "One Slot, Many Fillers" },
      { type: "text", value: "The Vorfeld (position 1, before the verb) can hold exactly one grammatical unit — but that unit can be long: a subject, a time expression, a whole subordinate clause, or a prepositional phrase. Whatever occupies it, the conjugated verb must still follow immediately in position 2." },
      { type: "example", de: "Nach der Arbeit gehe ich meistens direkt nach Hause.", en: "After work, I usually go straight home." },
      { type: "example", de: "Weil es regnet, bleiben wir heute zu Hause.", en: "Because it's raining, we're staying home today." },
      { type: "heading", value: "Common Mistake: Two Verbs in Position 2" },
      { type: "text", value: "Learners sometimes try to put both verb parts together. Remember: only the conjugated verb stays in position 2 — the rest is always pushed to the end, no matter how long the sentence gets." },
      { type: "tip", value: "In a yes/no question or a command, the linke Klammer moves to position 1 and the Vorfeld disappears: Kannst du mir helfen? Steh bitte auf!" },
      { type: "tip", value: "If a subordinate clause fills the Vorfeld, it counts as one unit, so the main clause's verb comes directly after the comma: Wenn ich Zeit habe, rufe ich dich an." },
      { type: "tip", value: "The rechte Klammer is what makes German feel 'backwards' to English speakers — train yourself to listen for it, since it often carries the most important information." },
      { type: "example", de: "Ich habe meiner Schwester zum Geburtstag ein schönes Buch geschenkt.", en: "I gave my sister a nice book for her birthday." },
      { type: "example", de: "Er will nächstes Jahr mit seiner Familie nach Kanada auswandern.", en: "He wants to emigrate to Canada with his family next year." }
    ]
  },

  // ============================================================
  // 5. Nebensätze: weil, dass, wenn
  // ============================================================
  {
    id: "b1_nebensaetze_weil_dass_wenn",
    title: "Nebensätze: weil, dass, wenn",
    emoji: "🔗",
    content: [
      { type: "text", value: "A subordinate clause (Nebensatz) is introduced by a subordinating conjunction and cannot stand alone. Its most important rule: the conjugated verb moves all the way to the end of the clause (Verbendstellung). A comma always separates the main clause from the Nebensatz." },
      { type: "heading", value: "Three Essential Conjunctions" },
      {
        type: "table",
        headers: ["Conjunction", "Meaning", "Example"],
        rows: [
          ["weil", "because", "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte."],
          ["dass", "that", "Ich glaube, dass er heute krank ist."],
          ["wenn", "if / whenever", "Wenn du Zeit hast, komm doch vorbei."]
        ]
      },
      { type: "heading", value: "Nebensatz First: Verb, Comma, Verb" },
      { type: "text", value: "When the subordinate clause comes before the main clause, it occupies the whole Vorfeld. The main clause's verb then follows directly after the comma, creating a 'verb — comma — verb' rhythm." },
      {
        type: "table",
        headers: ["Nebensatz (verb at the end)", ",", "Main clause (verb right after comma)"],
        rows: [
          ["Weil es heute regnet", ",", "bleibe ich zu Hause."],
          ["Wenn ich Geld hätte", ",", "würde ich reisen."],
          ["Dass er nicht gekommen ist", ",", "hat mich überrascht."]
        ]
      },
      { type: "tip", value: "In the Perfekt, both verb parts of the Nebensatz cluster together at the very end, with the auxiliary last: ..., weil ich das Buch schon gelesen habe." },
      { type: "tip", value: "With modal verbs in a Nebensatz, the modal also moves to the end, after the infinitive: ..., weil ich morgen arbeiten muss." },
      { type: "tip", value: "Don't confuse dass (conjunction 'that') with das (article/pronoun 'the/that'): Ich weiß, dass das Auto rot ist." },
      { type: "example", de: "Er ist müde, weil er wenig geschlafen hat.", en: "He is tired because he slept little." },
      { type: "example", de: "Ich hoffe, dass du bald gesund wirst.", en: "I hope that you get well soon." },
      { type: "example", de: "Wenn das Wetter schön ist, gehen wir spazieren.", en: "If/whenever the weather is nice, we go for a walk." },
      { type: "example", de: "Weißt du, ob er heute kommt?", en: "Do you know if he is coming today?" }
    ]
  },

  // ============================================================
  // 6. Nebensätze: obwohl, damit, als / wenn
  // ============================================================
  {
    id: "b1_nebensaetze_obwohl_damit_als",
    title: "Nebensätze: obwohl, damit, als / wenn",
    emoji: "🔀",
    content: [
      { type: "text", value: "These three conjunctions add more nuance to B1 sentences: contrast, purpose, and a precise distinction between past and repeated time. Like weil/dass/wenn, they all send the conjugated verb to the end of the clause." },
      { type: "heading", value: "obwohl (although, even though)" },
      { type: "text", value: "obwohl introduces a contrast — the main clause happens despite what the Nebensatz says." },
      { type: "example", de: "Ich gehe joggen, obwohl es kalt ist.", en: "I'm going jogging, although it's cold." },
      { type: "heading", value: "damit (so that)" },
      { type: "text", value: "damit expresses purpose when the subject of the main clause and the subordinate clause are different people." },
      { type: "example", de: "Ich spreche langsam, damit du mich verstehst.", en: "I speak slowly so that you understand me." },
      { type: "heading", value: "als vs. wenn — Both Mean 'When', But Not Interchangeably" },
      {
        type: "table",
        headers: ["Conjunction", "Used for", "Example"],
        rows: [
          ["als", "One single event in the past", "Als ich 18 war, habe ich meinen Führerschein gemacht."],
          ["wenn", "Repeated events in the past ('whenever')", "Wenn ich Zeit hatte, bin ich schwimmen gegangen."],
          ["wenn", "Any event in the present or future", "Wenn ich Zeit habe, gehe ich schwimmen."]
        ]
      },
      { type: "tip", value: "Quick test: if you can replace 'when' with 'the time when...' and it refers to one moment in the past, use als. If you could say 'whenever', use wenn." },
      { type: "tip", value: "damit (different subjects) contrasts with um ... zu (same subject) — see the infinitive-clause chapter for the comparison." },
      { type: "tip", value: "obwohl can be replaced in spoken German by trotzdem in a separate main clause: Es ist kalt, trotzdem gehe ich joggen." },
      { type: "example", de: "Obwohl er wenig Geld hat, ist er sehr großzügig.", en: "Although he has little money, he is very generous." },
      { type: "example", de: "Sie lernt jeden Abend Vokabeln, damit sie die Prüfung besteht.", en: "She studies vocabulary every evening so that she passes the exam." },
      { type: "example", de: "Als wir Kinder waren, hatten wir keinen Fernseher.", en: "When we were children, we didn't have a TV." },
      { type: "example", de: "Immer wenn es regnet, nehme ich den Bus.", en: "Whenever it rains, I take the bus." }
    ]
  },

  // ============================================================
  // 7. Articles and Cases: Nominativ, Akkusativ, Dativ
  // ============================================================
  {
    id: "b1_cases_nominativ_akkusativ_dativ",
    title: "Articles and Cases: Nominativ, Akkusativ, Dativ",
    emoji: "🧩",
    content: [
      { type: "text", value: "By B1 you need to move confidently between all three cases at once, not just memorize them one at a time. This chapter puts the definite and indefinite articles side by side across all three cases so you can see the whole pattern together." },
      { type: "heading", value: "Definite Articles Across All Three Cases" },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
        rows: [
          ["Nominativ", "der", "die", "das", "die"],
          ["Akkusativ", "den", "die", "das", "die"],
          ["Dativ", "dem", "der", "dem", "den (+n)"]
        ]
      },
      { type: "heading", value: "Indefinite Articles Across All Three Cases" },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter"],
        rows: [
          ["Nominativ", "ein", "eine", "ein"],
          ["Akkusativ", "einen", "eine", "ein"],
          ["Dativ", "einem", "einer", "einem"]
        ]
      },
      { type: "heading", value: "Question Words for Each Case" },
      {
        type: "table",
        headers: ["Case", "Question word", "Example"],
        rows: [
          ["Nominativ", "wer? / was?", "Wer ist das? — Das ist mein Bruder."],
          ["Akkusativ", "wen? / was?", "Wen siehst du? — Ich sehe meinen Bruder."],
          ["Dativ", "wem?", "Wem hilfst du? — Ich helfe meinem Bruder."]
        ]
      },
      { type: "heading", value: "Verbs That Always Take the Dative" },
      { type: "text", value: "A small group of very common verbs takes a dative object even though there is no preposition — these simply have to be learned as a set." },
      {
        type: "table",
        headers: ["Verb", "Meaning", "Example"],
        rows: [
          ["helfen", "to help", "Ich helfe meiner Mutter."],
          ["danken", "to thank", "Er dankt dem Lehrer."],
          ["gefallen", "to please/like", "Das Kleid gefällt mir."],
          ["gehören", "to belong to", "Das Auto gehört meinem Vater."],
          ["glauben", "to believe (a person)", "Ich glaube dir."],
          ["antworten", "to answer", "Sie antwortet ihrer Chefin."]
        ]
      },
      { type: "tip", value: "When a sentence has both a dative and an accusative object as nouns, the dative usually comes first: Ich gebe dem Kind das Buch." },
      { type: "tip", value: "When one object is a pronoun, the pronoun jumps ahead of the noun: Ich gebe es dem Kind. / Ich gebe ihm das Buch." },
      { type: "example", de: "Der Kellner bringt dem Gast die Rechnung.", en: "The waiter brings the guest the bill." },
      { type: "example", de: "Ich glaube meinem Freund nicht.", en: "I don't believe my friend." },
      { type: "example", de: "Wem gehört diese Tasche?", en: "Who does this bag belong to?" }
    ]
  },

  // ============================================================
  // 8. Possessives and Personal Pronouns in All Three Cases
  // ============================================================
  {
    id: "b1_possessive_personal_pronouns",
    title: "Possessives and Personal Pronouns in All Three Cases",
    emoji: "👪",
    content: [
      { type: "text", value: "Possessive articles (mein, dein, sein...) follow exactly the same ending pattern as 'ein' across all three cases. Personal pronouns, on the other hand, change their entire form. Knowing both tables side by side lets you build complex sentences with objects and ownership fluently." },
      { type: "heading", value: "Possessive Article Endings (using 'mein' as the model)" },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
        rows: [
          ["Nominativ", "mein", "meine", "mein", "meine"],
          ["Akkusativ", "meinen", "meine", "mein", "meine"],
          ["Dativ", "meinem", "meiner", "meinem", "meinen"]
        ]
      },
      { type: "text", value: "Every other possessive article (dein, sein, ihr, unser, euer, ihr, Ihr) takes exactly the same endings — only the stem changes." },
      { type: "heading", value: "Personal Pronouns in All Three Cases" },
      {
        type: "table",
        headers: ["Nominativ", "Akkusativ", "Dativ"],
        rows: [
          ["ich", "mich", "mir"],
          ["du", "dich", "dir"],
          ["er", "ihn", "ihm"],
          ["sie (she)", "sie", "ihr"],
          ["es", "es", "ihm"],
          ["wir", "uns", "uns"],
          ["ihr", "euch", "euch"],
          ["sie/Sie", "sie/Sie", "ihnen/Ihnen"]
        ]
      },
      { type: "heading", value: "Combining Possessives and Pronouns in One Sentence" },
      { type: "text", value: "A typical B1 sentence often uses a possessive article for one noun and a personal pronoun to avoid repeating another noun." },
      { type: "example", de: "Meine Schwester hat einen neuen Job. Ich freue mich für sie.", en: "My sister has a new job. I'm happy for her." },
      { type: "example", de: "Er hat mir seine Telefonnummer gegeben.", en: "He gave me his phone number." },
      { type: "tip", value: "euer drops its second -e- whenever an ending is added: euer → eure, eurem, euren (never *euere)." },
      { type: "tip", value: "Once a noun has already been mentioned, German strongly prefers replacing it with a pronoun rather than repeating it — this is what makes fluent German sound natural." },
      { type: "tip", value: "3rd-person pronouns always match the grammatical gender of the noun, not its natural meaning: das Mädchen (neuter) is replaced by es, not sie." },
      { type: "example", de: "Kannst du mir deinen Regenschirm leihen? Ich habe meinen zu Hause vergessen.", en: "Can you lend me your umbrella? I forgot mine at home." },
      { type: "example", de: "Wir haben unseren Nachbarn geholfen, weil sie umgezogen sind.", en: "We helped our neighbors because they moved." }
    ]
  },

  // ============================================================
  // 9. Prepositions: Akkusativ, Dativ, and the Two-Way Ones
  // ============================================================
  {
    id: "b1_prepositions",
    title: "Prepositions: Akkusativ, Dativ, and the Two-Way Ones",
    emoji: "🧭",
    content: [
      { type: "text", value: "At B1, you are expected to know the full set of common prepositions and to use the two-way (Wechsel-) prepositions correctly depending on whether you are describing movement or location." },
      { type: "heading", value: "Accusative Prepositions" },
      {
        type: "table",
        headers: ["Preposition", "Meaning", "Example"],
        rows: [
          ["für", "for", "Das Geschenk ist für dich."],
          ["durch", "through", "Wir fahren durch die Stadt."],
          ["gegen", "against, around (time)", "Er ist gegen 8 Uhr angekommen."],
          ["ohne", "without", "Ich trinke Kaffee ohne Zucker."],
          ["um", "around, at (time)", "Der Zug fährt um 9 Uhr ab."],
          ["bis", "until, as far as", "Ich bleibe bis Freitag."],
          ["entlang", "along (follows the noun)", "Wir gehen den Fluss entlang."]
        ]
      },
      { type: "heading", value: "Dative Prepositions" },
      {
        type: "table",
        headers: ["Preposition", "Meaning", "Example"],
        rows: [
          ["mit", "with", "Ich fahre mit dem Fahrrad."],
          ["bei", "at, near", "Sie arbeitet bei einer Bank."],
          ["nach", "after, to (places)", "Nach der Arbeit gehe ich einkaufen."],
          ["von", "from, of", "Das Geschenk ist von meiner Oma."],
          ["zu", "to (people, places)", "Ich gehe zum Arzt."],
          ["aus", "from, out of", "Er kommt aus Spanien."],
          ["seit", "since, for (time)", "Ich wohne seit zwei Jahren hier."],
          ["außer", "except for", "Alle außer mir waren da."],
          ["gegenüber", "opposite, across from", "Die Bäckerei ist der Schule gegenüber."]
        ]
      },
      { type: "heading", value: "Two-Way Prepositions (Wechselpräpositionen)" },
      { type: "text", value: "These nine prepositions take the accusative for movement/direction (Wohin?) and the dative for a fixed location (Wo?)." },
      {
        type: "table",
        headers: ["Preposition", "Meaning"],
        rows: [
          ["in", "in, into"],
          ["an", "at, on (vertical surface)"],
          ["auf", "on (horizontal surface)"],
          ["über", "over, above"],
          ["unter", "under, below"],
          ["vor", "in front of, before"],
          ["hinter", "behind"],
          ["neben", "next to"],
          ["zwischen", "between"]
        ]
      },
      {
        type: "table",
        headers: ["Question", "Case", "Example"],
        rows: [
          ["Wohin? (movement)", "Akkusativ", "Ich hänge das Bild an die Wand."],
          ["Wo? (location)", "Dativ", "Das Bild hängt an der Wand."]
        ]
      },
      { type: "tip", value: "Contractions to memorize: in + dem = im, in + das = ins, an + dem = am, an + das = ans, zu + dem = zum, zu + der = zur, bei + dem = beim, von + dem = vom." },
      { type: "tip", value: "entlang usually comes after its noun with the accusative (den Fluss entlang), unlike almost every other preposition in German." },
      { type: "example", de: "Ich lege das Buch auf den Tisch.", en: "I put the book on the table." },
      { type: "example", de: "Das Buch liegt auf dem Tisch.", en: "The book is lying on the table." },
      { type: "example", de: "Wir treffen uns gegenüber vom Bahnhof.", en: "We're meeting across from the train station." }
    ]
  },

  // ============================================================
  // 10. Konjunktiv II for Politeness: würde, könnte, hätte, wäre
  // ============================================================
  {
    id: "b1_konjunktiv_ii",
    title: "Konjunktiv II für Höflichkeit: würde, könnte, hätte, wäre",
    emoji: "🙇",
    content: [
      { type: "text", value: "Konjunktiv II is used to make requests sound polite, to express wishes, and to talk about unreal or hypothetical situations. At B1 level, four forms cover almost everything you need: würde + infinitive, könnte, hätte, and wäre." },
      { type: "heading", value: "würde + Infinitiv (all-purpose polite form)" },
      {
        type: "table",
        headers: ["Person", "würde"],
        rows: [
          ["ich", "würde"],
          ["du", "würdest"],
          ["er/sie/es", "würde"],
          ["wir", "würden"],
          ["ihr", "würdet"],
          ["sie/Sie", "würden"]
        ]
      },
      { type: "heading", value: "könnte, hätte, wäre" },
      {
        type: "table",
        headers: ["Person", "könnte (können)", "hätte (haben)", "wäre (sein)"],
        rows: [
          ["ich", "könnte", "hätte", "wäre"],
          ["du", "könntest", "hättest", "wärst"],
          ["er/sie/es", "könnte", "hätte", "wäre"],
          ["wir", "könnten", "hätten", "wären"],
          ["ihr", "könntet", "hättet", "wärt"],
          ["sie/Sie", "könnten", "hätten", "wären"]
        ]
      },
      { type: "heading", value: "Polite Requests" },
      {
        type: "table",
        headers: ["Direct (sounds blunt)", "Polite (Konjunktiv II)"],
        rows: [
          ["Ich will einen Kaffee.", "Ich hätte gern einen Kaffee."],
          ["Kannst du das Fenster schließen?", "Könntest du das Fenster schließen?"],
          ["Ich brauche Hilfe.", "Würden Sie mir bitte helfen?"]
        ]
      },
      { type: "heading", value: "Unreal Conditions: wenn ... , würde/hätte/wäre ..." },
      { type: "text", value: "Konjunktiv II also describes situations that are not (or were not) true — hypotheticals and wishes." },
      { type: "example", de: "Wenn ich Zeit hätte, würde ich mehr reisen.", en: "If I had time, I would travel more." },
      { type: "example", de: "Wenn ich reich wäre, würde ich ein Haus kaufen.", en: "If I were rich, I would buy a house." },
      { type: "tip", value: "haben and sein almost always use their own short Konjunktiv II forms (hätte, wäre) rather than würde + haben/sein." },
      { type: "tip", value: "For most other verbs, spoken German prefers würde + infinitive over the 'real' Konjunktiv II form (e.g. würde gehen instead of ginge)." },
      { type: "tip", value: "Ich hätte gern... / Ich möchte... are the two most useful polite phrases for ordering, shopping, and requesting anything." },
      { type: "example", de: "Könnten Sie mir bitte sagen, wo der Bahnhof ist?", en: "Could you please tell me where the train station is?" },
      { type: "example", de: "Ich würde gern mit Ihnen einen Termin vereinbaren.", en: "I would like to arrange an appointment with you." }
    ]
  },

  // ============================================================
  // 11. Comparison: gut / besser / am besten
  // ============================================================
  {
    id: "b1_comparison",
    title: "Comparison: gut / besser / am besten",
    emoji: "📈",
    content: [
      { type: "text", value: "German forms the comparative and superlative with regular endings in most cases, but a handful of very frequent adjectives and adverbs are irregular and must be memorized separately." },
      { type: "heading", value: "Regular Comparison" },
      {
        type: "table",
        headers: ["Positive", "Komparativ (+er)", "Superlativ (am +sten)"],
        rows: [
          ["klein", "kleiner", "am kleinsten"],
          ["schnell", "schneller", "am schnellsten"],
          ["billig", "billiger", "am billigsten"],
          ["interessant", "interessanter", "am interessantesten"]
        ]
      },
      { type: "heading", value: "One-Syllable Adjectives Often Add an Umlaut" },
      {
        type: "table",
        headers: ["Positive", "Komparativ", "Superlativ"],
        rows: [
          ["alt", "älter", "am ältesten"],
          ["jung", "jünger", "am jüngsten"],
          ["groß", "größer", "am größten"],
          ["lang", "länger", "am längsten"],
          ["kurz", "kürzer", "am kürzesten"]
        ]
      },
      { type: "heading", value: "Irregular Comparison" },
      {
        type: "table",
        headers: ["Positive", "Komparativ", "Superlativ"],
        rows: [
          ["gut", "besser", "am besten"],
          ["viel", "mehr", "am meisten"],
          ["gern", "lieber", "am liebsten"],
          ["hoch", "höher", "am höchsten"],
          ["nah", "näher", "am nächsten"]
        ]
      },
      { type: "heading", value: "Comparing Two Things: so ... wie / als" },
      {
        type: "table",
        headers: ["Comparison type", "Structure", "Example"],
        rows: [
          ["Equal (as ... as)", "so + adjective + wie", "Er ist so groß wie sein Vater."],
          ["Unequal (than)", "Komparativ + als", "Sie ist größer als ich."]
        ]
      },
      { type: "tip", value: "'als' is always used with the comparative, never with 'wie': richtig — schneller als; falsch — *schneller wie." },
      { type: "tip", value: "When a comparative or superlative adjective stands directly before a noun, it still needs a normal adjective ending: das bessere Buch, der schnellste Läufer." },
      { type: "tip", value: "immer + comparative expresses a growing trend: Es wird immer kälter. (It's getting colder and colder.)" },
      { type: "example", de: "Mein Bruder ist älter als ich, aber ich bin größer als er.", en: "My brother is older than me, but I am taller than him." },
      { type: "example", de: "Am liebsten trinke ich Tee, aber ich mag auch Kaffee.", en: "I like tea best, but I also like coffee." },
      { type: "example", de: "Diese Wohnung ist genauso teuer wie die andere.", en: "This apartment is just as expensive as the other one." }
    ]
  },

  // ============================================================
  // 12. Präteritum of sein, haben, and the Modal Verbs
  // ============================================================
  {
    id: "b1_praeteritum",
    title: "Präteritum von sein, haben und den Modalverben",
    emoji: "🕰️",
    content: [
      { type: "text", value: "While the Perfekt is used for most verbs in spoken German, sein, haben, and the modal verbs are the big exception: even in everyday conversation, Germans almost always use their Präteritum (simple past) forms instead of the Perfekt." },
      { type: "heading", value: "sein and haben in the Präteritum" },
      {
        type: "table",
        headers: ["Person", "sein (war)", "haben (hatte)"],
        rows: [
          ["ich", "war", "hatte"],
          ["du", "warst", "hattest"],
          ["er/sie/es", "war", "hatte"],
          ["wir", "waren", "hatten"],
          ["ihr", "wart", "hattet"],
          ["sie/Sie", "waren", "hatten"]
        ]
      },
      { type: "heading", value: "Modal Verbs in the Präteritum" },
      {
        type: "table",
        headers: ["Person", "können", "müssen", "dürfen", "sollen", "wollen"],
        rows: [
          ["ich", "konnte", "musste", "durfte", "sollte", "wollte"],
          ["du", "konntest", "musstest", "durftest", "solltest", "wolltest"],
          ["er/sie/es", "konnte", "musste", "durfte", "sollte", "wollte"],
          ["wir", "konnten", "mussten", "durften", "sollten", "wollten"],
          ["ihr", "konntet", "musstet", "durftet", "solltet", "wolltet"],
          ["sie/Sie", "konnten", "mussten", "durften", "sollten", "wollten"]
        ]
      },
      { type: "tip", value: "Notice that modal verbs in the Präteritum lose their umlaut: können → konnte (not *könnte, which is Konjunktiv II), müssen → musste, dürfen → durfte." },
      { type: "tip", value: "Like all Präteritum forms, ich and er/sie/es always take the same ending — there is no extra -t or -e to add." },
      { type: "tip", value: "For almost every other verb, prefer the Perfekt in speech (ich habe gemacht) and save the Präteritum mainly for written narratives and stories." },
      { type: "example", de: "Ich hatte gestern keine Zeit, weil ich viel arbeiten musste.", en: "I had no time yesterday because I had to work a lot." },
      { type: "example", de: "Als Kind konnte ich sehr gut klettern.", en: "As a child I could climb very well." },
      { type: "example", de: "Sie war früher Lehrerin, aber jetzt ist sie Ärztin.", en: "She used to be a teacher, but now she is a doctor." },
      { type: "example", de: "Wir wollten ins Kino gehen, aber es gab keine Karten mehr.", en: "We wanted to go to the movies, but there were no tickets left." }
    ]
  },

  // ============================================================
  // 13. Adjective Endings after der / ein / No Article
  // ============================================================
  {
    id: "b1_adjective_endings",
    title: "Adjective Endings after der / ein / No Article",
    emoji: "🎨",
    content: [
      { type: "text", value: "When an adjective stands directly before a noun, it needs an ending. Which ending depends on three things: the case, the gender/number of the noun, and — crucially — what kind of article (if any) comes before the adjective." },
      { type: "heading", value: "After der-words (weak declension)" },
      { type: "text", value: "Since the article itself already shows the case and gender clearly, the adjective ending is weak: mostly -e or -en." },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
        rows: [
          ["Nominativ", "der neue Tisch", "die neue Lampe", "das neue Buch", "die neuen Bücher"],
          ["Akkusativ", "den neuen Tisch", "die neue Lampe", "das neue Buch", "die neuen Bücher"],
          ["Dativ", "dem neuen Tisch", "der neuen Lampe", "dem neuen Buch", "den neuen Büchern"]
        ]
      },
      { type: "heading", value: "After ein-words (mixed declension)" },
      { type: "text", value: "ein/kein/mein etc. do not always show gender clearly (ein Tisch and ein Buch look alike), so the adjective sometimes has to do that job itself." },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
        rows: [
          ["Nominativ", "ein neuer Tisch", "eine neue Lampe", "ein neues Buch", "keine neuen Bücher"],
          ["Akkusativ", "einen neuen Tisch", "eine neue Lampe", "ein neues Buch", "keine neuen Bücher"],
          ["Dativ", "einem neuen Tisch", "einer neuen Lampe", "einem neuen Buch", "keinen neuen Büchern"]
        ]
      },
      { type: "heading", value: "With No Article at All (strong declension)" },
      { type: "text", value: "With no article present, the adjective itself takes on almost the same endings the definite article would have had." },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
        rows: [
          ["Nominativ", "guter Wein", "frische Milch", "kaltes Wasser", "frische Blumen"],
          ["Akkusativ", "guten Wein", "frische Milch", "kaltes Wasser", "frische Blumen"],
          ["Dativ", "gutem Wein", "frischer Milch", "kaltem Wasser", "frischen Blumen"]
        ]
      },
      { type: "tip", value: "Shortcut: in the weak declension (after der-words), almost every ending is -e or -en — much simpler than it looks." },
      { type: "tip", value: "Only in masculine Nominativ and neuter Nominativ/Akkusativ does the ein-word fail to show the gender — that's exactly where the adjective ending 'compensates' with -er or -es." },
      { type: "tip", value: "The plural Dativ always ends in -en on the adjective (and adds -n to the noun if it doesn't already end in -n or -s)." },
      { type: "example", de: "Ich trinke gern kalten Kaffee.", en: "I like drinking cold coffee." },
      { type: "example", de: "Er hat mir sein altes Fahrrad gegeben.", en: "He gave me his old bicycle." },
      { type: "example", de: "Wir wohnen in einer kleinen, gemütlichen Wohnung.", en: "We live in a small, cozy apartment." }
    ]
  },

  // ============================================================
  // 14. Reflexive Verbs and Verbs with Fixed Prepositions
  // ============================================================
  {
    id: "b1_reflexive_prepositions",
    title: "Reflexive Verbs and Verbs with Fixed Prepositions",
    emoji: "🔄",
    content: [
      { type: "text", value: "Reflexive verbs use a pronoun that refers back to the subject. Many everyday German verbs are also permanently paired with a specific preposition whose case is fixed and must be learned along with the verb." },
      { type: "heading", value: "Reflexive Pronouns" },
      {
        type: "table",
        headers: ["Person", "Akkusativ", "Dativ"],
        rows: [
          ["ich", "mich", "mir"],
          ["du", "dich", "dir"],
          ["er/sie/es", "sich", "sich"],
          ["wir", "uns", "uns"],
          ["ihr", "euch", "euch"],
          ["sie/Sie", "sich", "sich"]
        ]
      },
      { type: "heading", value: "Common Reflexive Verbs" },
      {
        type: "table",
        headers: ["Verb", "Meaning"],
        rows: [
          ["sich freuen (auf/über)", "to look forward to / to be happy about"],
          ["sich interessieren für", "to be interested in"],
          ["sich erinnern an", "to remember"],
          ["sich fühlen", "to feel"],
          ["sich beeilen", "to hurry"],
          ["sich ärgern über", "to be annoyed about"],
          ["sich verabreden mit", "to arrange to meet"]
        ]
      },
      { type: "heading", value: "Verbs with a Fixed Preposition" },
      { type: "text", value: "The preposition itself is part of the verb's meaning and always requires the same case — this combination has to be memorized as a single unit." },
      {
        type: "table",
        headers: ["Verb + Preposition", "Case", "Example"],
        rows: [
          ["warten auf", "Akkusativ", "Ich warte auf den Bus."],
          ["sich freuen auf", "Akkusativ (future event)", "Ich freue mich auf die Ferien."],
          ["sich freuen über", "Akkusativ (something that happened)", "Ich freue mich über das Geschenk."],
          ["Angst haben vor", "Dativ", "Sie hat Angst vor Spinnen."],
          ["denken an", "Akkusativ", "Ich denke oft an dich."],
          ["sprechen über", "Akkusativ", "Wir sprechen über das Wetter."],
          ["sich interessieren für", "Akkusativ", "Er interessiert sich für Musik."],
          ["teilnehmen an", "Dativ", "Ich nehme an dem Kurs teil."]
        ]
      },
      { type: "tip", value: "A da(r)- + preposition (darauf, darüber, daran) replaces a whole prepositional phrase referring to a thing: Ich freue mich darauf. (not *auf es)." },
      { type: "tip", value: "For a question about the object of one of these verbs, use wo(r)- + preposition: Worauf wartest du? Woran denkst du?" },
      { type: "tip", value: "The reflexive pronoun goes right after the conjugated verb (or the subject, if it's inverted): Ich freue mich. / Freust du dich?" },
      { type: "example", de: "Ich muss mich beeilen, sonst komme ich zu spät.", en: "I have to hurry, otherwise I'll be late." },
      { type: "example", de: "Worüber ärgerst du dich so?", en: "What are you so annoyed about?" },
      { type: "example", de: "Wir freuen uns schon sehr auf den Urlaub.", en: "We are already really looking forward to the vacation." }
    ]
  },

  // ============================================================
  // 15. Passive with werden (Recognition)
  // ============================================================
  {
    id: "b1_passive",
    title: "Passiv mit werden (Erkennen genügt)",
    emoji: "⚙️",
    content: [
      { type: "text", value: "The passive voice shifts focus away from who performs an action and onto what happens to something or someone. At B1 you mainly need to recognize and understand it in texts and listening — being able to produce it occasionally is a bonus." },
      { type: "heading", value: "How the Passive Is Built" },
      { type: "text", value: "werden (conjugated) + Partizip II at the end of the sentence — the same Satzklammer pattern as always." },
      {
        type: "table",
        headers: ["Tense", "Structure", "Example"],
        rows: [
          ["Präsens", "werden + Partizip II", "Das Auto wird repariert."],
          ["Präteritum", "wurde(n) + Partizip II", "Das Auto wurde repariert."],
          ["Perfekt", "ist/sind + Partizip II + worden", "Das Auto ist repariert worden."]
        ]
      },
      { type: "heading", value: "Active vs. Passive" },
      {
        type: "table",
        headers: ["Aktiv (who does it)", "Passiv (what happens)"],
        rows: [
          ["Der Mechaniker repariert das Auto.", "Das Auto wird repariert."],
          ["Die Firma stellt viele Leute ein.", "Viele Leute werden eingestellt."],
          ["Man spricht hier Deutsch.", "Hier wird Deutsch gesprochen."]
        ]
      },
      { type: "heading", value: "Mentioning Who Did It: von + Dativ" },
      { type: "text", value: "If the agent is mentioned at all, it appears with 'von' (a person/organization) or 'durch' (a cause/means), followed by the dative." },
      { type: "example", de: "Das Buch wurde von einem berühmten Autor geschrieben.", en: "The book was written by a famous author." },
      { type: "tip", value: "Don't confuse this werden with the future tense (werden + infinitive) or with 'werden' meaning 'to become' — context and the second verb form tell them apart." },
      { type: "tip", value: "Sentences with 'man' as the subject in active voice often correspond to a passive sentence with no subject at all: Man baut hier ein neues Haus. = Hier wird ein neues Haus gebaut." },
      { type: "tip", value: "A passive sentence does not need an agent at all — most real passive sentences simply leave it out, since the focus is on the action, not the doer." },
      { type: "example", de: "In diesem Restaurant wird nur frisches Gemüse verwendet.", en: "In this restaurant, only fresh vegetables are used." },
      { type: "example", de: "Die neue Brücke wurde letztes Jahr gebaut.", en: "The new bridge was built last year." }
    ]
  },

  // ============================================================
  // 16. Relative Clauses with der / die / das
  // ============================================================
  {
    id: "b1_relative_clauses",
    title: "Relativsätze mit der / die / das",
    emoji: "🔍",
    content: [
      { type: "text", value: "A relative clause gives more information about a noun without starting a new sentence. The relative pronoun looks like the definite article, and — like every subordinate clause — it sends the verb to the end." },
      { type: "heading", value: "Relative Pronouns by Case" },
      { type: "text", value: "The gender and number of the relative pronoun match the noun it refers back to; its case depends on its own role inside the relative clause." },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
        rows: [
          ["Nominativ", "der", "die", "das", "die"],
          ["Akkusativ", "den", "die", "das", "die"],
          ["Dativ", "dem", "der", "dem", "denen"]
        ]
      },
      { type: "heading", value: "Choosing the Right Case" },
      { type: "text", value: "Ask what role the pronoun plays inside its own clause — subject, direct object, or indirect object/prepositional object." },
      {
        type: "table",
        headers: ["Role in the relative clause", "Case", "Example"],
        rows: [
          ["Subject", "Nominativ", "Das ist der Mann, der neben mir wohnt."],
          ["Direct object", "Akkusativ", "Das ist der Mann, den ich gestern gesehen habe."],
          ["Indirect object / after a preposition", "Dativ", "Das ist der Mann, dem ich geholfen habe."]
        ]
      },
      { type: "tip", value: "A preposition before the relative pronoun determines its case, exactly like with any other noun phrase: Das ist die Frau, mit der ich arbeite." },
      { type: "tip", value: "A relative clause is always set off with commas, and it can appear right in the middle of the main sentence, not only at the end." },
      { type: "tip", value: "Don't confuse the relative pronoun 'die' (which) with the article 'die' (the) — only word order and context tell them apart." },
      { type: "example", de: "Ich habe ein Buch gelesen, das sehr spannend war.", en: "I read a book that was very exciting." },
      { type: "example", de: "Die Frau, die dort steht, ist meine Chefin.", en: "The woman who is standing there is my boss." },
      { type: "example", de: "Das sind die Kollegen, mit denen ich jeden Tag arbeite.", en: "Those are the colleagues I work with every day." },
      { type: "example", de: "Der Film, den wir gestern gesehen haben, war fantastisch.", en: "The movie we watched yesterday was fantastic." }
    ]
  },

  // ============================================================
  // 17. Infinitive with zu, um … zu
  // ============================================================
  {
    id: "b1_infinitive_zu",
    title: "Infinitiv mit zu, um … zu",
    emoji: "➡️",
    content: [
      { type: "text", value: "Many verbs and expressions are followed by a second, dependent action expressed as an infinitive with 'zu'. This whole infinitive phrase behaves like the right bracket of the Satzklammer — it goes to the end." },
      { type: "heading", value: "Verbs Commonly Followed by zu + Infinitiv" },
      {
        type: "table",
        headers: ["Expression", "Example"],
        rows: [
          ["versuchen, ... zu", "Ich versuche, pünktlich zu kommen."],
          ["hoffen, ... zu", "Wir hoffen, dich bald zu sehen."],
          ["vergessen, ... zu", "Vergiss nicht, das Licht auszumachen."],
          ["anfangen/aufhören, ... zu", "Es hat angefangen zu regnen."],
          ["Lust/Zeit haben, ... zu", "Hast du Lust, ins Kino zu gehen?"]
        ]
      },
      { type: "heading", value: "Separable Verbs: zu Goes in the Middle" },
      { type: "text", value: "With a separable verb, 'zu' is inserted between the prefix and the stem, and the whole thing is written as one word." },
      { type: "example", de: "Er hat vergessen, mich anzurufen.", en: "He forgot to call me." },
      { type: "example", de: "Sie hat vor, nächstes Jahr auszuwandern.", en: "She plans to emigrate next year." },
      { type: "heading", value: "um ... zu vs. damit" },
      { type: "text", value: "Both express purpose ('in order to'), but um ... zu is only possible when the subject of both clauses is the same person." },
      {
        type: "table",
        headers: ["Same subject → um ... zu", "Different subjects → damit"],
        rows: [
          ["Ich lerne Deutsch, um in Deutschland zu arbeiten.", "Ich spreche langsam, damit du mich verstehst."],
          ["Er spart Geld, um ein Auto zu kaufen.", "Er gibt mir sein Auto, damit ich zur Arbeit fahren kann."]
        ]
      },
      { type: "heading", value: "ohne ... zu and (an)statt ... zu" },
      { type: "example", de: "Er ist gegangen, ohne sich zu verabschieden.", en: "He left without saying goodbye." },
      { type: "example", de: "Statt zu arbeiten, hat er den ganzen Tag ferngesehen.", en: "Instead of working, he watched TV all day." },
      { type: "tip", value: "A comma always separates the main clause from the zu-infinitive phrase once the phrase has more than just the bare verb." },
      { type: "tip", value: "After modal verbs, no 'zu' is used: Ich kann schwimmen (not *zu schwimmen)." },
      { type: "tip", value: "es is often added as a placeholder subject when the infinitive clause comes first: Es macht Spaß, Deutsch zu lernen." }
    ]
  },

  // ============================================================
  // 18. Negation: nicht and kein, and Where They Go
  // ============================================================
  {
    id: "b1_negation",
    title: "Negation: nicht und kein — und wo sie stehen",
    emoji: "🚫",
    content: [
      { type: "text", value: "At B1, the basic nicht/kein distinction from A1 becomes more demanding because sentences are longer and contain modal verbs, the Perfekt, separable prefixes, and subordinate clauses — all of which affect exactly where 'nicht' goes." },
      { type: "heading", value: "kein — Negating Nouns" },
      { type: "text", value: "Use kein wherever the noun would otherwise have an indefinite article (ein/eine) or no article at all. It takes the same endings as 'ein'." },
      { type: "example", de: "Ich habe kein Auto und keine Zeit.", en: "I have no car and no time." },
      { type: "heading", value: "nicht — Negating Everything Else" },
      { type: "text", value: "Use nicht for verbs, adjectives, adverbs, and nouns that already have a definite article or a possessive." },
      { type: "heading", value: "Where nicht Goes in Longer Sentences" },
      {
        type: "table",
        headers: ["Sentence type", "Position of nicht", "Example"],
        rows: [
          ["Simple verb", "After the conjugated verb", "Ich verstehe das nicht."],
          ["Modal + infinitive", "Right before the infinitive", "Ich kann heute nicht kommen."],
          ["Perfekt", "Right before the participle", "Ich habe das Buch nicht gelesen."],
          ["Separable verb", "Right before the prefix", "Ich rufe dich heute nicht an."],
          ["Subordinate clause", "Right before the final verb(s)", "..., weil ich heute nicht arbeiten kann."]
        ]
      },
      { type: "heading", value: "nicht mehr vs. kein ... mehr" },
      {
        type: "table",
        headers: ["Expression", "Meaning", "Example"],
        rows: [
          ["nicht mehr", "not anymore (verb/adjective)", "Er raucht nicht mehr."],
          ["kein ... mehr", "no more (noun)", "Wir haben kein Brot mehr."],
          ["noch nicht", "not yet (verb/adjective)", "Sie ist noch nicht angekommen."],
          ["noch kein", "not yet a/any (noun)", "Ich habe noch keine Antwort bekommen."]
        ]
      },
      { type: "tip", value: "General rule of thumb: nicht goes as late as possible in the sentence, but always before the 'right bracket' (infinitive, participle, or prefix) if there is one." },
      { type: "tip", value: "To negate just one specific word rather than the whole sentence, put nicht directly before it: Ich trinke nicht Kaffee, sondern Tee." },
      { type: "tip", value: "Quick check: could the noun take 'ein/eine' or no article at all? Then use kein. Otherwise, use nicht." },
      { type: "example", de: "Er hat mich gestern nicht angerufen.", en: "He didn't call me yesterday." },
      { type: "example", de: "Wir haben leider keine Karten mehr für das Konzert.", en: "Unfortunately we don't have any tickets left for the concert." },
      { type: "example", de: "Ich glaube nicht, dass er heute kommt.", en: "I don't think he's coming today." }
    ]
  }
];
