// a1-verb-forms.js — past forms for the 100 A1 verbs in words.js (which itself is never
// edited: its conjugation tables show only the present tense).
// Keyed by the permanent word id. "präteritum" is the 3rd person singular Präteritum
// (separable verbs split: "stand auf"), "perfekt" is auxiliary + participle
// ("ist aufgestanden") -- the same two keys the B1 verbs in b1-words.js carry.
// Source: the official Goethe-Zertifikat B1 Wortliste (2016), which lists all of these
// verbs; forms are as given there, including "ist/hat" where it names both auxiliaries
// and the modal-verb Perfekt ("hat … können"). Two notes go beyond the Wortliste: the
// Perfekt of lassen + infinitive ("hat … lassen") and of passive werden ("ist … worden").
// üben is listed without forms (regular, Duden). Reflexive "sich" appears only where
// the Wortliste puts it in the forms (sich freuen); "(sich) waschen" etc. are listed
// with plain forms.
// Loaded via <script> tag before app.js -- all variables are global. ES5 only.

var A1_VERB_FORMS = {
    // basic verbs and modal verbs
    306: { "präteritum": "war", "perfekt": "ist gewesen" },              // sein
    307: { "präteritum": "hatte", "perfekt": "hat gehabt" },             // haben
    308: { "präteritum": "wurde", "perfekt": "ist geworden (im Passiv: ist … worden)" },   // werden
    309: { "präteritum": "konnte", "perfekt": "hat gekonnt (als Modalverb: hat … können)" },   // können
    310: { "präteritum": "musste", "perfekt": "hat gemusst (als Modalverb: hat … müssen)" },   // müssen
    311: { "präteritum": "wollte", "perfekt": "hat gewollt (als Modalverb: hat … wollen)" },   // wollen
    312: { "präteritum": "sollte", "perfekt": "hat gesollt (als Modalverb: hat … sollen)" },   // sollen
    313: { "präteritum": "durfte", "perfekt": "hat gedurft (als Modalverb: hat … dürfen)" },   // dürfen
    314: { "präteritum": "mochte", "perfekt": "hat gemocht" },            // mögen
    // möchten has no past of its own meaning "would like"; in that sense one says "wollte"
    315: { "präteritum": "mochte (meist: wollte)", "perfekt": "hat gemocht (meist: hat gewollt)" },   // möchten

    // daily verbs
    316: { "präteritum": "machte", "perfekt": "hat gemacht" },           // machen
    317: { "präteritum": "ging", "perfekt": "ist gegangen" },            // gehen
    318: { "präteritum": "kam", "perfekt": "ist gekommen" },             // kommen
    319: { "präteritum": "sagte", "perfekt": "hat gesagt" },             // sagen
    320: { "präteritum": "gab", "perfekt": "hat gegeben" },              // geben
    321: { "präteritum": "nahm", "perfekt": "hat genommen" },            // nehmen
    322: { "präteritum": "fand", "perfekt": "hat gefunden" },            // finden
    323: { "präteritum": "stand", "perfekt": "hat/ist gestanden" },      // stehen
    324: { "präteritum": "ließ", "perfekt": "hat gelassen (mit Infinitiv: hat … lassen)" },   // lassen
    325: { "präteritum": "sah", "perfekt": "hat gesehen" },              // sehen

    // communication verbs
    326: { "präteritum": "sprach", "perfekt": "hat gesprochen" },        // sprechen
    327: { "präteritum": "hörte", "perfekt": "hat gehört" },             // hören
    328: { "präteritum": "las", "perfekt": "hat gelesen" },              // lesen
    329: { "präteritum": "schrieb", "perfekt": "hat geschrieben" },      // schreiben
    330: { "präteritum": "fragte", "perfekt": "hat gefragt" },           // fragen
    331: { "präteritum": "antwortete", "perfekt": "hat geantwortet" },   // antworten
    332: { "präteritum": "verstand", "perfekt": "hat verstanden" },      // verstehen
    333: { "präteritum": "erklärte", "perfekt": "hat erklärt" },         // erklären
    334: { "präteritum": "meinte", "perfekt": "hat gemeint" },           // meinen
    335: { "präteritum": "erzählte", "perfekt": "hat erzählt" },         // erzählen
    336: { "präteritum": "rief", "perfekt": "hat gerufen" },             // rufen
    337: { "präteritum": "hieß", "perfekt": "hat geheißen" },            // heißen

    // movement verbs
    338: { "präteritum": "fuhr", "perfekt": "ist/hat gefahren" },        // fahren
    339: { "präteritum": "lief", "perfekt": "ist gelaufen" },            // laufen
    340: { "präteritum": "flog", "perfekt": "ist geflogen" },            // fliegen
    341: { "präteritum": "brachte", "perfekt": "hat gebracht" },         // bringen
    342: { "präteritum": "trug", "perfekt": "hat getragen" },            // tragen
    343: { "präteritum": "zog", "perfekt": "hat/ist gezogen" },          // ziehen
    344: { "präteritum": "fiel", "perfekt": "ist gefallen" },            // fallen
    345: { "präteritum": "stieg", "perfekt": "ist gestiegen" },          // steigen
    346: { "präteritum": "kam an", "perfekt": "ist angekommen" },        // ankommen
    347: { "präteritum": "fuhr ab", "perfekt": "ist abgefahren" },       // abfahren
    348: { "präteritum": "stieg um", "perfekt": "ist umgestiegen" },     // umsteigen

    // daily life verbs
    349: { "präteritum": "aß", "perfekt": "hat gegessen" },              // essen
    350: { "präteritum": "trank", "perfekt": "hat getrunken" },          // trinken
    351: { "präteritum": "kochte", "perfekt": "hat gekocht" },           // kochen
    352: { "präteritum": "schlief", "perfekt": "hat geschlafen" },       // schlafen
    353: { "präteritum": "stand auf", "perfekt": "ist aufgestanden" },   // aufstehen
    354: { "präteritum": "wusch", "perfekt": "hat gewaschen" },          // waschen
    355: { "präteritum": "zog an", "perfekt": "hat angezogen" },         // anziehen
    356: { "präteritum": "duschte", "perfekt": "hat geduscht" },         // duschen
    357: { "präteritum": "putzte", "perfekt": "hat geputzt" },           // putzen
    358: { "präteritum": "kaufte", "perfekt": "hat gekauft" },           // kaufen
    359: { "präteritum": "verkaufte", "perfekt": "hat verkauft" },       // verkaufen
    360: { "präteritum": "bezahlte", "perfekt": "hat bezahlt" },         // bezahlen
    361: { "präteritum": "kostete", "perfekt": "hat gekostet" },         // kosten
    362: { "präteritum": "brauchte", "perfekt": "hat gebraucht" },       // brauchen
    363: { "präteritum": "bekam", "perfekt": "hat bekommen" },           // bekommen

    // work and study verbs
    364: { "präteritum": "arbeitete", "perfekt": "hat gearbeitet" },     // arbeiten
    365: { "präteritum": "lernte", "perfekt": "hat gelernt" },           // lernen
    366: { "präteritum": "studierte", "perfekt": "hat studiert" },       // studieren
    367: { "präteritum": "übte", "perfekt": "hat geübt" },               // üben
    368: { "präteritum": "begann", "perfekt": "hat begonnen" },          // beginnen
    369: { "präteritum": "fing an", "perfekt": "hat angefangen" },       // anfangen
    370: { "präteritum": "hörte auf", "perfekt": "hat aufgehört" },      // aufhören

    // thinking, feeling and social verbs
    371: { "präteritum": "wusste", "perfekt": "hat gewusst" },           // wissen
    372: { "präteritum": "kannte", "perfekt": "hat gekannt" },           // kennen
    373: { "präteritum": "dachte", "perfekt": "hat gedacht" },           // denken
    374: { "präteritum": "glaubte", "perfekt": "hat geglaubt" },         // glauben
    375: { "präteritum": "hoffte", "perfekt": "hat gehofft" },           // hoffen
    376: { "präteritum": "liebte", "perfekt": "hat geliebt" },           // lieben
    377: { "präteritum": "freute sich", "perfekt": "hat sich gefreut" }, // (sich) freuen
    378: { "präteritum": "gefiel", "perfekt": "hat gefallen" },          // gefallen
    379: { "präteritum": "lebte", "perfekt": "hat gelebt" },             // leben
    380: { "präteritum": "wohnte", "perfekt": "hat gewohnt" },           // wohnen
    381: { "präteritum": "half", "perfekt": "hat geholfen" },            // helfen
    382: { "präteritum": "spielte", "perfekt": "hat gespielt" },         // spielen
    383: { "präteritum": "wartete", "perfekt": "hat gewartet" },         // warten
    384: { "präteritum": "suchte", "perfekt": "hat gesucht" },           // suchen
    385: { "präteritum": "besuchte", "perfekt": "hat besucht" },         // besuchen
    386: { "präteritum": "traf", "perfekt": "hat getroffen" },           // treffen
    387: { "präteritum": "lud ein", "perfekt": "hat eingeladen" },       // einladen
    388: { "präteritum": "dankte", "perfekt": "hat gedankt" },           // danken
    389: { "präteritum": "entschuldigte", "perfekt": "hat entschuldigt" },   // entschuldigen
    390: { "präteritum": "stimmte", "perfekt": "hat gestimmt" },         // stimmen
    391: { "präteritum": "passte", "perfekt": "hat gepasst" },           // passen
    392: { "präteritum": "fehlte", "perfekt": "hat gefehlt" },           // fehlen

    // other verbs (regnen and schneien are used only with "es")
    393: { "präteritum": "öffnete", "perfekt": "hat geöffnet" },         // öffnen
    394: { "präteritum": "schloss", "perfekt": "hat geschlossen" },      // schließen
    395: { "präteritum": "zeigte", "perfekt": "hat gezeigt" },           // zeigen
    396: { "präteritum": "rauchte", "perfekt": "hat geraucht" },         // rauchen
    397: { "präteritum": "regnete", "perfekt": "hat geregnet" },         // regnen
    398: { "präteritum": "schien", "perfekt": "hat geschienen" },        // scheinen
    399: { "präteritum": "schneite", "perfekt": "hat geschneit" },       // schneien
    400: { "präteritum": "telefonierte", "perfekt": "hat telefoniert" }, // telefonieren
    401: { "präteritum": "fotografierte", "perfekt": "hat fotografiert" },   // fotografieren
    402: { "präteritum": "reparierte", "perfekt": "hat repariert" },     // reparieren
    403: { "präteritum": "funktionierte", "perfekt": "hat funktioniert" },   // funktionieren
    404: { "präteritum": "bedeutete", "perfekt": "hat bedeutet" },       // bedeuten
    405: { "präteritum": "versuchte", "perfekt": "hat versucht" }        // versuchen
};
