var GRAMMAR_SECTIONS = [
  // ============================================================
  // 1. Articles & Noun Genders
  // ============================================================
  {
    id: "articles",
    title: "Articles & Noun Genders",
    emoji: "\ud83d\udcdd",
    content: [
      { type: "text", value: "German has three grammatical genders: masculine (der), feminine (die), and neuter (das). Every noun has a fixed gender that must be memorized. The plural article is always 'die' regardless of gender." },
      { type: "heading", value: "Definite Articles (the)" },
      {
        type: "table",
        headers: ["Gender", "Article", "Example"],
        rows: [
          ["Masculine", "der", "der Tisch (the table)"],
          ["Feminine", "die", "die Lampe (the lamp)"],
          ["Neuter", "das", "das Buch (the book)"],
          ["Plural", "die", "die Tische (the tables)"]
        ]
      },
      { type: "heading", value: "Indefinite Articles (a/an)" },
      {
        type: "table",
        headers: ["Gender", "Article", "Example"],
        rows: [
          ["Masculine", "ein", "ein Tisch (a table)"],
          ["Feminine", "eine", "eine Lampe (a lamp)"],
          ["Neuter", "ein", "ein Buch (a book)"],
          ["Plural", "\u2014 (keine)", "keine Tische (no tables)"]
        ]
      },
      { type: "heading", value: "Gender Rules & Tips" },
      { type: "tip", value: "Masculine: days (der Montag), months (der Januar), seasons (der Sommer), male persons (der Mann)." },
      { type: "tip", value: "Feminine: nouns ending in -ung (die Zeitung), -heit (die Freiheit), -keit (die M\u00f6glichkeit), -tion (die Nation), -ie (die Energie)." },
      { type: "tip", value: "Neuter: nouns ending in -chen (das M\u00e4dchen), -lein (das B\u00fcchlein), -ment (das Dokument), -um (das Museum). Also infinitives used as nouns (das Essen)." },
      { type: "example", de: "Der Tisch ist gro\u00df.", en: "The table is big." },
      { type: "example", de: "Ich habe eine Katze.", en: "I have a cat." },
      { type: "example", de: "Das M\u00e4dchen spielt drau\u00dfen.", en: "The girl is playing outside." }
    ]
  },

  // ============================================================
  // 2. Plural Formation
  // ============================================================
  {
    id: "plurals",
    title: "Plural Formation",
    emoji: "\ud83d\udd22",
    content: [
      { type: "text", value: "German has five main plural patterns. Unlike English, there is no single universal plural ending. The plural must often be learned together with each noun." },
      {
        type: "table",
        headers: ["Pattern", "Singular", "Plural", "Notes"],
        rows: [
          ["-e", "der Tisch", "die Tische", "Common for masculine nouns"],
          ["-e + umlaut", "der Stuhl", "die St\u00fchle", "Vowel gets umlaut"],
          ["-er", "das Kind", "die Kinder", "Common for neuter nouns"],
          ["-er + umlaut", "das Buch", "die B\u00fccher", "Vowel gets umlaut"],
          ["-(e)n", "die Lampe", "die Lampen", "Common for feminine nouns"],
          ["-nen", "die Lehrerin", "die Lehrerinnen", "Feminine -in endings"],
          ["-s", "das Auto", "die Autos", "Foreign words, words ending in vowel"],
          ["no change", "das Zimmer", "die Zimmer", "Nouns ending in -er, -el, -en"],
          ["umlaut only", "der Vater", "die V\u00e4ter", "Some -er/-el nouns add umlaut"]
        ]
      },
      { type: "tip", value: "Most feminine nouns form the plural with -(e)n: die Blume \u2192 die Blumen, die Frau \u2192 die Frauen." },
      { type: "tip", value: "Nouns ending in -chen or -lein never change in the plural: das M\u00e4dchen \u2192 die M\u00e4dchen." },
      { type: "tip", value: "Always learn a new noun together with its article AND plural form!" },
      { type: "example", de: "Ich habe zwei Br\u00fcder.", en: "I have two brothers." },
      { type: "example", de: "Die Kinder spielen im Garten.", en: "The children are playing in the garden." }
    ]
  },

  // ============================================================
  // 3. Present Tense \u2014 Regular Verbs
  // ============================================================
  {
    id: "present_tense",
    title: "Present Tense \u2014 Regular Verbs",
    emoji: "\u23f0",
    content: [
      { type: "text", value: "Regular (weak) verbs in German follow a predictable pattern. Remove the -en infinitive ending to find the stem, then add the personal endings." },
      { type: "heading", value: "Conjugation Endings" },
      {
        type: "table",
        headers: ["Person", "Ending", "Example (machen)"],
        rows: [
          ["ich", "-e", "ich mache"],
          ["du", "-st", "du machst"],
          ["er/sie/es", "-t", "er macht"],
          ["wir", "-en", "wir machen"],
          ["ihr", "-t", "ihr macht"],
          ["sie/Sie", "-en", "sie machen"]
        ]
      },
      { type: "heading", value: "Full Conjugation: spielen (to play)" },
      {
        type: "table",
        headers: ["Person", "spielen"],
        rows: [
          ["ich", "spiele"],
          ["du", "spielst"],
          ["er/sie/es", "spielt"],
          ["wir", "spielen"],
          ["ihr", "spielt"],
          ["sie/Sie", "spielen"]
        ]
      },
      { type: "tip", value: "When the stem ends in -t or -d (arbeiten, finden), add an extra -e- before -st and -t: du arbeitest, er arbeitet, ihr arbeitet." },
      { type: "tip", value: "When the stem ends in -s, -\u00df, -z, or -x, the du-form ending is just -t: du tanzt (not tanzsst)." },
      { type: "example", de: "Ich lerne Deutsch.", en: "I am learning German." },
      { type: "example", de: "Was machst du heute?", en: "What are you doing today?" },
      { type: "example", de: "Sie arbeitet in Berlin.", en: "She works in Berlin." }
    ]
  },

  // ============================================================
  // 4. Irregular Verbs
  // ============================================================
  {
    id: "irregular_verbs",
    title: "Irregular Verbs",
    emoji: "\u26a1",
    content: [
      { type: "text", value: "The most important irregular verbs at A1 level are sein (to be), haben (to have), and werden (to become). Additionally, several common verbs have stem-vowel changes in the du and er/sie/es forms." },
      { type: "heading", value: "sein (to be)" },
      {
        type: "table",
        headers: ["Person", "sein"],
        rows: [
          ["ich", "bin"],
          ["du", "bist"],
          ["er/sie/es", "ist"],
          ["wir", "sind"],
          ["ihr", "seid"],
          ["sie/Sie", "sind"]
        ]
      },
      { type: "heading", value: "haben (to have)" },
      {
        type: "table",
        headers: ["Person", "haben"],
        rows: [
          ["ich", "habe"],
          ["du", "hast"],
          ["er/sie/es", "hat"],
          ["wir", "haben"],
          ["ihr", "habt"],
          ["sie/Sie", "haben"]
        ]
      },
      { type: "heading", value: "werden (to become)" },
      {
        type: "table",
        headers: ["Person", "werden"],
        rows: [
          ["ich", "werde"],
          ["du", "wirst"],
          ["er/sie/es", "wird"],
          ["wir", "werden"],
          ["ihr", "werdet"],
          ["sie/Sie", "werden"]
        ]
      },
      { type: "heading", value: "Stem-Changing Verbs" },
      { type: "text", value: "Some strong verbs change their stem vowel in the du and er/sie/es forms only. The other forms are regular." },
      {
        type: "table",
        headers: ["Verb", "Change", "ich", "du", "er/sie/es"],
        rows: [
          ["sprechen (to speak)", "e \u2192 i", "spreche", "sprichst", "spricht"],
          ["essen (to eat)", "e \u2192 i", "esse", "isst", "isst"],
          ["geben (to give)", "e \u2192 i", "gebe", "gibst", "gibt"],
          ["nehmen (to take)", "e \u2192 i", "nehme", "nimmst", "nimmt"],
          ["fahren (to drive)", "a \u2192 \u00e4", "fahre", "f\u00e4hrst", "f\u00e4hrt"],
          ["schlafen (to sleep)", "a \u2192 \u00e4", "schlafe", "schl\u00e4fst", "schl\u00e4ft"],
          ["laufen (to run)", "au \u2192 \u00e4u", "laufe", "l\u00e4ufst", "l\u00e4uft"],
          ["lesen (to read)", "e \u2192 ie", "lese", "liest", "liest"],
          ["sehen (to see)", "e \u2192 ie", "sehe", "siehst", "sieht"]
        ]
      },
      { type: "example", de: "Ich bin M\u00fcde. Er ist Student.", en: "I am tired. He is a student." },
      { type: "example", de: "Hast du Zeit?", en: "Do you have time?" },
      { type: "example", de: "Er spricht Deutsch und Englisch.", en: "He speaks German and English." }
    ]
  },

  // ============================================================
  // 5. Separable Verbs
  // ============================================================
  {
    id: "separable_verbs",
    title: "Separable Verbs",
    emoji: "\u2702\ufe0f",
    content: [
      { type: "text", value: "Many German verbs have a separable prefix. In the present tense, the prefix detaches from the verb and moves to the end of the sentence. In the infinitive and past participle, the prefix stays attached." },
      { type: "heading", value: "Common Separable Prefixes" },
      {
        type: "table",
        headers: ["Prefix", "Meaning", "Example Verb"],
        rows: [
          ["an-", "on, at", "anrufen (to call)"],
          ["auf-", "up, open", "aufstehen (to get up)"],
          ["aus-", "out, off", "ausgehen (to go out)"],
          ["ein-", "in, into", "einkaufen (to shop)"],
          ["mit-", "with, along", "mitkommen (to come along)"],
          ["vor-", "before, forward", "vorstellen (to introduce)"],
          ["zu-", "to, closed", "zumachen (to close)"],
          ["ab-", "off, away", "abfahren (to depart)"],
          ["zur\u00fcck-", "back", "zur\u00fcckkommen (to come back)"],
          ["fern-", "far, remote", "fernsehen (to watch TV)"]
        ]
      },
      { type: "heading", value: "How Separation Works" },
      { type: "text", value: "The conjugated verb stays in position 2, and the prefix goes to the very end of the sentence." },
      { type: "example", de: "aufstehen \u2192 Ich stehe um 7 Uhr auf.", en: "I get up at 7 o'clock." },
      { type: "example", de: "einkaufen \u2192 Wir kaufen im Supermarkt ein.", en: "We shop at the supermarket." },
      { type: "example", de: "anrufen \u2192 Er ruft seine Mutter an.", en: "He calls his mother." },
      { type: "example", de: "fernsehen \u2192 Die Kinder sehen abends fern.", en: "The children watch TV in the evening." },
      { type: "tip", value: "With modal verbs, the separable verb stays together as an infinitive at the end: Ich muss um 7 Uhr aufstehen." },
      { type: "tip", value: "Inseparable prefixes (be-, emp-, ent-, er-, ge-, miss-, ver-, zer-) never separate: Ich verstehe das. (NOT: Ich stehe das ver.)" }
    ]
  },

  // ============================================================
  // 6. Modal Verbs
  // ============================================================
  {
    id: "modal_verbs",
    title: "Modal Verbs",
    emoji: "\ud83d\udcaa",
    content: [
      { type: "text", value: "Modal verbs modify the meaning of another verb. In a sentence, the modal verb is conjugated and placed in position 2, while the main verb goes to the end of the sentence in its infinitive form." },
      { type: "heading", value: "k\u00f6nnen (can, to be able to)" },
      {
        type: "table",
        headers: ["Person", "k\u00f6nnen"],
        rows: [
          ["ich", "kann"],
          ["du", "kannst"],
          ["er/sie/es", "kann"],
          ["wir", "k\u00f6nnen"],
          ["ihr", "k\u00f6nnt"],
          ["sie/Sie", "k\u00f6nnen"]
        ]
      },
      { type: "heading", value: "m\u00fcssen (must, to have to)" },
      {
        type: "table",
        headers: ["Person", "m\u00fcssen"],
        rows: [
          ["ich", "muss"],
          ["du", "musst"],
          ["er/sie/es", "muss"],
          ["wir", "m\u00fcssen"],
          ["ihr", "m\u00fcsst"],
          ["sie/Sie", "m\u00fcssen"]
        ]
      },
      { type: "heading", value: "wollen (to want)" },
      {
        type: "table",
        headers: ["Person", "wollen"],
        rows: [
          ["ich", "will"],
          ["du", "willst"],
          ["er/sie/es", "will"],
          ["wir", "wollen"],
          ["ihr", "wollt"],
          ["sie/Sie", "wollen"]
        ]
      },
      { type: "heading", value: "d\u00fcrfen (may, to be allowed to)" },
      {
        type: "table",
        headers: ["Person", "d\u00fcrfen"],
        rows: [
          ["ich", "darf"],
          ["du", "darfst"],
          ["er/sie/es", "darf"],
          ["wir", "d\u00fcrfen"],
          ["ihr", "d\u00fcrft"],
          ["sie/Sie", "d\u00fcrfen"]
        ]
      },
      { type: "heading", value: "sollen (should, to be supposed to)" },
      {
        type: "table",
        headers: ["Person", "sollen"],
        rows: [
          ["ich", "soll"],
          ["du", "sollst"],
          ["er/sie/es", "soll"],
          ["wir", "sollen"],
          ["ihr", "sollt"],
          ["sie/Sie", "sollen"]
        ]
      },
      { type: "heading", value: "m\u00f6chten (would like to)" },
      {
        type: "table",
        headers: ["Person", "m\u00f6chten"],
        rows: [
          ["ich", "m\u00f6chte"],
          ["du", "m\u00f6chtest"],
          ["er/sie/es", "m\u00f6chte"],
          ["wir", "m\u00f6chten"],
          ["ihr", "m\u00f6chtet"],
          ["sie/Sie", "m\u00f6chten"]
        ]
      },
      { type: "heading", value: "Sentence Structure with Modals" },
      { type: "text", value: "Modal verb (conjugated) in position 2 + main verb (infinitive) at the end." },
      { type: "example", de: "Ich kann Deutsch sprechen.", en: "I can speak German." },
      { type: "example", de: "Du musst jetzt gehen.", en: "You have to go now." },
      { type: "example", de: "Wir m\u00f6chten ein Eis essen.", en: "We would like to eat an ice cream." },
      { type: "tip", value: "Modal verbs have no endings for ich and er/sie/es: ich kann, er kann (not *er kannt)." },
      { type: "tip", value: "m\u00f6chten is the subjunctive form of m\u00f6gen and is used much more often at A1 level. It is more polite than wollen." }
    ]
  },

  // ============================================================
  // 7. Negation
  // ============================================================
  {
    id: "negation",
    title: "Negation",
    emoji: "\u274c",
    content: [
      { type: "text", value: "German uses two main words for negation: nicht (not) and kein (no/not a). The choice depends on what is being negated." },
      { type: "heading", value: "nicht (not)" },
      { type: "text", value: "Use 'nicht' to negate verbs, adjectives, adverbs, and nouns with a definite article." },
      {
        type: "table",
        headers: ["Rule", "Example"],
        rows: [
          ["After the conjugated verb", "Ich schlafe nicht."],
          ["Before an adjective", "Das ist nicht gut."],
          ["Before an adverb", "Er l\u00e4uft nicht schnell."],
          ["Before a prepositional phrase", "Ich gehe nicht in die Schule."],
          ["Before a specific part to negate", "Ich trinke nicht Kaffee (, sondern Tee)."],
          ["At the end (general negation)", "Ich verstehe das nicht."]
        ]
      },
      { type: "heading", value: "kein (no / not a)" },
      { type: "text", value: "Use 'kein' to negate nouns that would have an indefinite article (ein/eine) or no article at all. 'Kein' takes the same endings as 'ein'." },
      {
        type: "table",
        headers: ["Gender", "Nominative", "Accusative"],
        rows: [
          ["Masculine", "kein", "keinen"],
          ["Feminine", "keine", "keine"],
          ["Neuter", "kein", "kein"],
          ["Plural", "keine", "keine"]
        ]
      },
      { type: "heading", value: "nicht vs. kein" },
      {
        type: "table",
        headers: ["With ein/eine \u2192 kein", "Otherwise \u2192 nicht"],
        rows: [
          ["Ich habe kein Auto.", "Ich fahre nicht."],
          ["Das ist keine Katze.", "Das ist nicht meine Katze."],
          ["Er hat keinen Bruder.", "Er kommt nicht aus Berlin."]
        ]
      },
      { type: "example", de: "Ich trinke keinen Kaffee.", en: "I don't drink coffee." },
      { type: "example", de: "Sie ist nicht m\u00fcde.", en: "She is not tired." },
      { type: "example", de: "Wir haben keine Kinder.", en: "We don't have children." },
      { type: "tip", value: "Rule of thumb: if you could replace the article with 'kein', use kein. Otherwise use nicht." }
    ]
  },

  // ============================================================
  // 8. Accusative Case
  // ============================================================
  {
    id: "accusative",
    title: "Accusative Case",
    emoji: "\ud83c\udfaf",
    content: [
      { type: "text", value: "The accusative case (Akkusativ) is used for the direct object of a verb \u2014 the thing being acted upon. Only masculine articles change in the accusative; feminine, neuter, and plural stay the same as in the nominative." },
      { type: "heading", value: "Definite Articles" },
      {
        type: "table",
        headers: ["Gender", "Nominative", "Accusative"],
        rows: [
          ["Masculine", "der", "den"],
          ["Feminine", "die", "die"],
          ["Neuter", "das", "das"],
          ["Plural", "die", "die"]
        ]
      },
      { type: "heading", value: "Indefinite Articles" },
      {
        type: "table",
        headers: ["Gender", "Nominative", "Accusative"],
        rows: [
          ["Masculine", "ein", "einen"],
          ["Feminine", "eine", "eine"],
          ["Neuter", "ein", "ein"],
          ["\u2014", "\u2014", "\u2014"]
        ]
      },
      { type: "heading", value: "Accusative Prepositions" },
      { type: "text", value: "These prepositions always require the accusative case:" },
      {
        type: "table",
        headers: ["Preposition", "Meaning", "Example"],
        rows: [
          ["f\u00fcr", "for", "Das ist f\u00fcr den Mann."],
          ["durch", "through", "Wir gehen durch den Park."],
          ["gegen", "against", "Er ist gegen den Plan."],
          ["ohne", "without", "Ich gehe ohne meinen Bruder."],
          ["um", "around, at (time)", "Wir laufen um den See."]
        ]
      },
      { type: "tip", value: "Remember: only masculine changes! der \u2192 den, ein \u2192 einen. Everything else stays the same." },
      { type: "example", de: "Ich sehe den Mann.", en: "I see the man." },
      { type: "example", de: "Sie kauft einen Kuchen.", en: "She buys a cake." },
      { type: "example", de: "Hast du das Buch?", en: "Do you have the book?" },
      { type: "example", de: "Das Geschenk ist f\u00fcr die Lehrerin.", en: "The gift is for the teacher." }
    ]
  },

  // ============================================================
  // 9. Dative Case
  // ============================================================
  {
    id: "dative",
    title: "Dative Case",
    emoji: "\ud83c\udf81",
    content: [
      { type: "text", value: "The dative case (Dativ) is used for the indirect object \u2014 the person or thing that receives something. It is also required after certain prepositions and verbs." },
      { type: "heading", value: "Definite Articles" },
      {
        type: "table",
        headers: ["Gender", "Nominative", "Dative"],
        rows: [
          ["Masculine", "der", "dem"],
          ["Feminine", "die", "der"],
          ["Neuter", "das", "dem"],
          ["Plural", "die", "den (+n)"]
        ]
      },
      { type: "heading", value: "Indefinite Articles" },
      {
        type: "table",
        headers: ["Gender", "Nominative", "Dative"],
        rows: [
          ["Masculine", "ein", "einem"],
          ["Feminine", "eine", "einer"],
          ["Neuter", "ein", "einem"],
          ["\u2014", "\u2014", "\u2014"]
        ]
      },
      { type: "heading", value: "Dative Prepositions" },
      { type: "text", value: "These prepositions always require the dative case:" },
      {
        type: "table",
        headers: ["Preposition", "Meaning", "Example"],
        rows: [
          ["mit", "with", "Ich fahre mit dem Bus."],
          ["bei", "at, near", "Ich wohne bei meinen Eltern."],
          ["nach", "after, to (cities/countries)", "Nach dem Essen gehe ich."],
          ["von", "from, of", "Das Buch ist von dem Lehrer."],
          ["zu", "to", "Ich gehe zum Arzt."],
          ["aus", "from, out of", "Er kommt aus der Schweiz."],
          ["seit", "since, for (time)", "Ich lerne seit einem Jahr."]
        ]
      },
      { type: "tip", value: "Mnemonic for dative prepositions: 'Mit bei nach von, zu aus seit \u2014 Dativ ist hier bereit!'" },
      { type: "heading", value: "Personal Pronouns in the Dative" },
      {
        type: "table",
        headers: ["Nominative", "Dative"],
        rows: [
          ["ich", "mir"],
          ["du", "dir"],
          ["er", "ihm"],
          ["sie (she)", "ihr"],
          ["es", "ihm"],
          ["wir", "uns"],
          ["ihr", "euch"],
          ["sie/Sie", "ihnen/Ihnen"]
        ]
      },
      { type: "tip", value: "In the dative plural, nouns that don't already end in -n or -s get an extra -n: die Kinder \u2192 den Kindern." },
      { type: "example", de: "Ich gebe dem Kind ein Buch.", en: "I give the child a book." },
      { type: "example", de: "Sie hilft ihrer Mutter.", en: "She helps her mother." },
      { type: "example", de: "Kannst du mir helfen?", en: "Can you help me?" },
      { type: "example", de: "Ich fahre mit dem Zug nach Berlin.", en: "I'm going to Berlin by train." }
    ]
  },

  // ============================================================
  // 10. Prepositions
  // ============================================================
  {
    id: "prepositions",
    title: "Prepositions",
    emoji: "\ud83d\udccd",
    content: [
      { type: "text", value: "German prepositions govern a specific case. Some always take the accusative, some always the dative, and a special group (two-way prepositions) takes either depending on meaning." },
      { type: "heading", value: "Accusative Prepositions" },
      {
        type: "table",
        headers: ["Preposition", "Meaning"],
        rows: [
          ["f\u00fcr", "for"],
          ["durch", "through"],
          ["gegen", "against, around (time)"],
          ["ohne", "without"],
          ["um", "around, at (time)"]
        ]
      },
      { type: "example", de: "Das Geschenk ist f\u00fcr meinen Vater.", en: "The gift is for my father." },
      { type: "example", de: "Wir gehen durch den Wald.", en: "We walk through the forest." },
      { type: "example", de: "Sie geht ohne ihren Freund.", en: "She goes without her boyfriend." },
      { type: "heading", value: "Dative Prepositions" },
      {
        type: "table",
        headers: ["Preposition", "Meaning"],
        rows: [
          ["mit", "with"],
          ["bei", "at, near, at someone's place"],
          ["nach", "after, to (cities/countries)"],
          ["von", "from, of"],
          ["zu", "to (people, places)"],
          ["aus", "from, out of"],
          ["seit", "since, for (time)"]
        ]
      },
      { type: "example", de: "Ich wohne seit drei Jahren in Wien.", en: "I have been living in Vienna for three years." },
      { type: "example", de: "Er kommt aus der T\u00fcrkei.", en: "He comes from Turkey." },
      { type: "example", de: "Ich gehe zu meiner Freundin.", en: "I'm going to my friend's place." },
      { type: "heading", value: "Two-Way Prepositions (Wechselpr\u00e4positionen)" },
      { type: "text", value: "These prepositions take the accusative when expressing movement/direction (Wohin?) and the dative when expressing location (Wo?)." },
      {
        type: "table",
        headers: ["Preposition", "Meaning"],
        rows: [
          ["in", "in, into"],
          ["an", "at, on (vertical)"],
          ["auf", "on (horizontal)"],
          ["\u00fcber", "over, above"],
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
          ["Wohin? (Where to?)", "Accusative", "Ich gehe in den Park."],
          ["Wo? (Where?)", "Dative", "Ich bin im (= in dem) Park."]
        ]
      },
      { type: "example", de: "Ich stelle die Tasse auf den Tisch. (movement)", en: "I put the cup on the table." },
      { type: "example", de: "Die Tasse steht auf dem Tisch. (location)", en: "The cup is on the table." },
      { type: "tip", value: "Contractions: in + dem = im, in + das = ins, an + dem = am, an + das = ans, zu + dem = zum, zu + der = zur." }
    ]
  },

  // ============================================================
  // 11. Sentence Structure
  // ============================================================
  {
    id: "sentence_structure",
    title: "Sentence Structure",
    emoji: "\ud83e\udde9",
    content: [
      { type: "text", value: "German word order follows strict rules. The most important is the verb-second (V2) rule: in a main clause, the conjugated verb is always in the second position." },
      { type: "heading", value: "Statements (V2 Rule)" },
      { type: "text", value: "The conjugated verb is always in position 2. Position 1 can be the subject or another element (time, place, etc.). If a non-subject is in position 1, the subject moves after the verb." },
      {
        type: "table",
        headers: ["Position 1", "Verb (Pos. 2)", "Rest"],
        rows: [
          ["Ich", "lerne", "Deutsch."],
          ["Heute", "lerne", "ich Deutsch."],
          ["In Berlin", "wohnt", "meine Schwester."],
          ["Am Montag", "habe", "ich frei."]
        ]
      },
      { type: "heading", value: "Yes/No Questions (Verb First)" },
      { type: "text", value: "The conjugated verb comes first, followed by the subject." },
      { type: "example", de: "Sprichst du Deutsch?", en: "Do you speak German?" },
      { type: "example", de: "Hast du Geschwister?", en: "Do you have siblings?" },
      { type: "heading", value: "W-Questions (Question Word + Verb)" },
      { type: "text", value: "The W-word is in position 1, the verb in position 2, then the subject." },
      {
        type: "table",
        headers: ["W-Word", "Verb", "Subject", "Rest"],
        rows: [
          ["Wo", "wohnst", "du", "?"],
          ["Was", "machst", "du", "heute?"],
          ["Wann", "beginnt", "der Kurs", "?"],
          ["Wie", "hei\u00dft", "du", "?"],
          ["Warum", "lernst", "du", "Deutsch?"],
          ["Wer", "ist", "das", "?"]
        ]
      },
      { type: "heading", value: "Time \u2014 Manner \u2014 Place (TeKaMoLo)" },
      { type: "text", value: "When multiple details appear in a sentence, the standard order is: Temporal (when) \u2014 Kausal (why) \u2014 Modal (how) \u2014 Lokal (where)." },
      { type: "example", de: "Ich fahre morgen mit dem Zug nach Hamburg.", en: "I am going to Hamburg by train tomorrow." },
      { type: "tip", value: "The verb is always in position 2 in main clauses \u2014 not necessarily the second word, but the second grammatical element." },
      { type: "tip", value: "With modal verbs or separable verbs, the second verb/prefix goes to the very end: Ich will morgen nach Berlin fahren." }
    ]
  },

  // ============================================================
  // 12. Possessive Pronouns
  // ============================================================
  {
    id: "possessive",
    title: "Possessive Pronouns",
    emoji: "\ud83d\udc64",
    content: [
      { type: "text", value: "Possessive pronouns (possessive articles) show ownership. They follow the same endings as the indefinite article 'ein'." },
      { type: "heading", value: "Possessive Pronouns by Person" },
      {
        type: "table",
        headers: ["Person", "Possessive", "Meaning"],
        rows: [
          ["ich", "mein", "my"],
          ["du", "dein", "your (informal)"],
          ["er", "sein", "his"],
          ["sie (she)", "ihr", "her"],
          ["es", "sein", "its"],
          ["wir", "unser", "our"],
          ["ihr", "euer", "your (informal plural)"],
          ["sie (they)", "ihr", "their"],
          ["Sie (formal)", "Ihr", "your (formal)"]
        ]
      },
      { type: "heading", value: "Endings (follow ein-pattern)" },
      {
        type: "table",
        headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
        rows: [
          ["Nominative", "mein", "meine", "mein", "meine"],
          ["Accusative", "meinen", "meine", "mein", "meine"],
          ["Dative", "meinem", "meiner", "meinem", "meinen"]
        ]
      },
      { type: "tip", value: "All possessive pronouns use these same endings. Just replace 'mein' with dein, sein, ihr, unser, euer, etc." },
      { type: "tip", value: "'euer' drops the second -e- when an ending is added: euer \u2192 eure (not *euere), euer \u2192 eurem, euren." },
      { type: "example", de: "Das ist mein Hund.", en: "That is my dog." },
      { type: "example", de: "Wo ist deine Tasche?", en: "Where is your bag?" },
      { type: "example", de: "Ich besuche meinen Bruder.", en: "I'm visiting my brother." },
      { type: "example", de: "Sie spielt mit ihrem Kind.", en: "She is playing with her child." }
    ]
  },

  // ============================================================
  // 13. Personal Pronouns
  // ============================================================
  {
    id: "personal_pronouns",
    title: "Personal Pronouns",
    emoji: "\ud83d\ude4b",
    content: [
      { type: "text", value: "Personal pronouns replace nouns and change form depending on the grammatical case (nominative, accusative, dative). German also distinguishes between informal (du/ihr) and formal (Sie) address." },
      { type: "heading", value: "Full Pronoun Table" },
      {
        type: "table",
        headers: ["Person", "Nominative", "Accusative", "Dative"],
        rows: [
          ["1st sg.", "ich (I)", "mich (me)", "mir (to me)"],
          ["2nd sg. informal", "du (you)", "dich (you)", "dir (to you)"],
          ["3rd sg. masc.", "er (he)", "ihn (him)", "ihm (to him)"],
          ["3rd sg. fem.", "sie (she)", "sie (her)", "ihr (to her)"],
          ["3rd sg. neut.", "es (it)", "es (it)", "ihm (to it)"],
          ["1st pl.", "wir (we)", "uns (us)", "uns (to us)"],
          ["2nd pl. informal", "ihr (you all)", "euch (you all)", "euch (to you all)"],
          ["3rd pl.", "sie (they)", "sie (them)", "ihnen (to them)"],
          ["2nd formal", "Sie (you)", "Sie (you)", "Ihnen (to you)"]
        ]
      },
      { type: "tip", value: "'Sie' (formal you) is always capitalized, whether at the start of a sentence or not. 'sie' (she/they) is lowercase." },
      { type: "tip", value: "The 3rd person pronouns match the gender of the noun they replace: der Tisch \u2192 er, die Lampe \u2192 sie, das Buch \u2192 es." },
      { type: "example", de: "Ich liebe dich.", en: "I love you." },
      { type: "example", de: "Kannst du mir bitte helfen?", en: "Can you please help me?" },
      { type: "example", de: "Ich gebe es ihm.", en: "I give it to him." },
      { type: "example", de: "Wie geht es Ihnen?", en: "How are you? (formal)" }
    ]
  },

  // ============================================================
  // 14. Numbers, Time & Dates
  // ============================================================
  {
    id: "numbers_time",
    title: "Numbers, Time & Dates",
    emoji: "\ud83d\udd52",
    content: [
      { type: "text", value: "Numbers, telling time, and dates are essential everyday skills. German number words are straightforward but follow a different pattern from English for numbers above 20." },
      { type: "heading", value: "Cardinal Numbers (0\u201320)" },
      {
        type: "table",
        headers: ["Number", "German", "Number", "German"],
        rows: [
          ["0", "null", "11", "elf"],
          ["1", "eins", "12", "zw\u00f6lf"],
          ["2", "zwei", "13", "dreizehn"],
          ["3", "drei", "14", "vierzehn"],
          ["4", "vier", "15", "f\u00fcnfzehn"],
          ["5", "f\u00fcnf", "16", "sechzehn"],
          ["6", "sechs", "17", "siebzehn"],
          ["7", "sieben", "18", "achtzehn"],
          ["8", "acht", "19", "neunzehn"],
          ["9", "neun", "20", "zwanzig"],
          ["10", "zehn", "", ""]
        ]
      },
      { type: "heading", value: "Numbers 21\u2013100" },
      { type: "text", value: "From 21 onward, the ones digit comes first, connected with 'und' (and), then the tens digit. This is opposite to English." },
      {
        type: "table",
        headers: ["Number", "German", "Pattern"],
        rows: [
          ["21", "einundzwanzig", "one-and-twenty"],
          ["32", "zweiunddrei\u00dfig", "two-and-thirty"],
          ["45", "f\u00fcnfundvierzig", "five-and-forty"],
          ["67", "siebenundsechzig", "seven-and-sixty"],
          ["83", "dreiundachtzig", "three-and-eighty"],
          ["99", "neunundneunzig", "nine-and-ninety"],
          ["100", "(ein)hundert", "one hundred"]
        ]
      },
      { type: "tip", value: "Tens: 30 = drei\u00dfig (note the \u00df!), 40 = vierzig, 50 = f\u00fcnfzig, 60 = sechzig (not sechszig), 70 = siebzig (not siebenzig), 80 = achtzig, 90 = neunzig." },
      { type: "heading", value: "Ordinal Numbers" },
      {
        type: "table",
        headers: ["Number", "Ordinal", "Number", "Ordinal"],
        rows: [
          ["1st", "erste", "6th", "sechste"],
          ["2nd", "zweite", "7th", "sieb(en)te"],
          ["3rd", "dritte", "8th", "achte"],
          ["4th", "vierte", "9th", "neunte"],
          ["5th", "f\u00fcnfte", "10th", "zehnte"]
        ]
      },
      { type: "tip", value: "1\u201319: add -te to the number (except erste, dritte, siebte, achte). 20+: add -ste (zwanzigste, drei\u00dfigste)." },
      { type: "heading", value: "Telling Time" },
      {
        type: "table",
        headers: ["Time", "German", "Literal"],
        rows: [
          ["3:00", "Es ist drei Uhr.", "It is three o'clock."],
          ["3:15", "Es ist Viertel nach drei.", "Quarter past three."],
          ["3:30", "Es ist halb vier.", "Half four (= half to four)."],
          ["3:45", "Es ist Viertel vor vier.", "Quarter to four."],
          ["3:10", "Es ist zehn nach drei.", "Ten past three."],
          ["3:50", "Es ist zehn vor vier.", "Ten to four."]
        ]
      },
      { type: "tip", value: "'halb vier' means 3:30 (NOT 4:30)! It refers to halfway TO the next hour. This is one of the trickiest points for English speakers." },
      { type: "heading", value: "Days of the Week" },
      {
        type: "table",
        headers: ["German", "English"],
        rows: [
          ["Montag", "Monday"],
          ["Dienstag", "Tuesday"],
          ["Mittwoch", "Wednesday"],
          ["Donnerstag", "Thursday"],
          ["Freitag", "Friday"],
          ["Samstag", "Saturday"],
          ["Sonntag", "Sunday"]
        ]
      },
      { type: "heading", value: "Months" },
      {
        type: "table",
        headers: ["German", "English", "German", "English"],
        rows: [
          ["Januar", "January", "Juli", "July"],
          ["Februar", "February", "August", "August"],
          ["M\u00e4rz", "March", "September", "September"],
          ["April", "April", "Oktober", "October"],
          ["Mai", "May", "November", "November"],
          ["Juni", "June", "Dezember", "December"]
        ]
      },
      { type: "heading", value: "Dates" },
      { type: "text", value: "Dates use ordinal numbers with a period after the number. The format is: Am + ordinal + month." },
      { type: "example", de: "Heute ist der 5. Mai.", en: "Today is the 5th of May." },
      { type: "example", de: "Ich habe am 12. Oktober Geburtstag.", en: "My birthday is on the 12th of October." },
      { type: "example", de: "Wir kommen am Montag.", en: "We are coming on Monday." },
      { type: "tip", value: "Days and months are all masculine: der Montag, der Januar. Use 'am' (= an + dem) for 'on' with days and dates: am Freitag, am 3. Juni." }
    ]
  }
];
