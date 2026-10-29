// b1-tracks-2.js — Scooter Tracks Seasons 2-4 (tracks 11-55): the rest of the
// audio course the plan schedules from week 7 ("Scooter Tracks 11-15" ...
// "51-55"). Same format as b1-tracks.js (see its header for the section
// types); loaded right after it, this file only adds seasons and tracks.
// One addition: every dialogue says who the partner (speaker A) is --
// partner: "f" or "m" -- so the audio gives a female partner a female voice
// (Season 1 has no such field; there the generator guesses from the intro).
// Audio: audio/<id>.mp3, generated from these transcripts by
// scripts/generate_audio.py (macOS `say` + ffmpeg).
//
// Loaded via <script> tag -- all variables are global. ES5 only.

B1_TRACK_SEASONS.s2 = {
  id: 's2', name: 'Season 2 — Build the engine', count: 15,
  slot: 'scooter', weeks: 'W7–W9',
  note: 'Five new tracks a week on the scooter. They run about 20 minutes, so a track fills the morning and the evening ride together — the audiobook and the player remember where you stopped. Tomorrow’s warm-up brings it back; the gym replays the week’s hardest three.'
};
B1_TRACK_SEASONS.s3 = {
  id: 's3', name: 'Season 3 — Speaking and writing for the exam', count: 25,
  slot: 'scooter', weeks: 'W10–W14',
  note: 'Five tracks a week: the Sprechen and Schreiben phrases of the exam, plus the B1 grammar that carries them. About 20 minutes each — the morning and evening ride together; the gym replays the hardest.'
};
B1_TRACK_SEASONS.s4 = {
  id: 's4', name: 'Season 4 — Exam ready', count: 5,
  slot: 'scooter', weeks: 'W15',
  note: 'The last five: listening for numbers and announcements, connectors, the three letters, the three speaking parts and the final hundred sentences.'
};

B1_TRACKS.push(

{
  id: "s2-11",
  season: "s2",
  n: 11,
  title: "What I did at the weekend",
  minutes: 13,
  audio: "audio/s2-11.mp3",
  intro: "To talk about the past, German mostly uses the Perfekt: a form of haben in second place and the past participle at the very end. This track gives you a whole weekend in the Perfekt with haben, with regular forms like gemacht and irregular ones like gelesen; the verbs that take sein come in the next track. You need it in the e-mail to a friend, which often asks what happened, and when you talk about your own experience in the presentation.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Was hast du am Wochenende gemacht?", en: "What did you do at the weekend?", note: "The past in two parts: hast in second place, gemacht at the very end." },
      { de: "Ich habe nichts Besonderes gemacht.", en: "I did not do anything special.", note: "" },
      { de: "Am Samstag habe ich lange geschlafen.", en: "On Saturday I slept late.", note: "Many irregular verbs end in en, not t: schlafen, geschlafen. Learn these by heart." },
      { de: "Dann habe ich in Ruhe gefrühstückt.", en: "Then I had a relaxed breakfast.", note: "Regular verbs: ge, the stem, then t. frühstücken becomes gefrühstückt." },
      { de: "Am Vormittag habe ich die Wohnung aufgeräumt.", en: "In the morning I tidied the flat.", note: "Split verbs like aufräumen put ge in the middle: aufgeräumt." },
      { de: "Danach haben wir eingekauft.", en: "After that we did the shopping.", note: "einkaufen splits like aufräumen: eingekauft." },
      { de: "Ich habe mit meinen Kindern gespielt.", en: "I played with my children.", note: "" },
      { de: "Ich habe mit meiner Mutter in Ungarn telefoniert.", en: "I phoned my mother in Hungary.", note: "Verbs ending in ieren take no ge: telefoniert, trainiert." },
      { de: "Am Sonntag habe ich im Fitnessstudio trainiert.", en: "On Sunday I worked out at the gym.", note: "" },
      { de: "Am Sonntagabend habe ich einen Film gesehen.", en: "On Sunday evening I watched a film.", note: "sehen becomes gesehen. fernsehen, to watch television, splits: ferngesehen." },
      { de: "Wir haben Freunde zum Essen eingeladen.", en: "We invited friends for a meal.", note: "einladen splits and is irregular: eingeladen." },
      { de: "Am Abend haben wir zusammen gekocht.", en: "In the evening we cooked together.", note: "" },
      { de: "Wir haben gegessen, getrunken und viel gelacht.", en: "We ate, drank and laughed a lot.", note: "gegessen and getrunken are irregular, gelacht is regular." },
      { de: "Ich habe ein Buch gelesen.", en: "I read a book.", note: "More irregular forms you will need: geschrieben, gefunden, getroffen." },
      { de: "Das hat viel Spaß gemacht.", en: "That was a lot of fun.", note: "Literally: that made a lot of fun. It ends any story about your weekend." },
      { de: "Und du? Was hast du gemacht?", en: "And you? What did you do?", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Am Samstag habe ich lange geschlafen und dann in Ruhe gefrühstückt.", en: "On Saturday I slept late and then had a relaxed breakfast." },
      { de: "Am Vormittag habe ich die Wohnung aufgeräumt, und am Nachmittag haben wir eingekauft.", en: "In the morning I tidied the flat, and in the afternoon we did the shopping." },
      { de: "Am Sonntag habe ich im Fitnessstudio trainiert und mit meiner Mutter telefoniert.", en: "On Sunday I worked out at the gym and phoned my mother." },
      { de: "Am Abend haben wir Freunde eingeladen und zusammen gekocht. Das hat viel Spaß gemacht.", en: "In the evening we invited friends and cooked together. That was a lot of fun." },
      { de: "Ich habe am Wochenende nichts Besonderes gemacht, aber ich habe endlich ein Buch gelesen.", en: "I did not do anything special at the weekend, but I finally read a book." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Monday morning: your friend Jonas asks what you did at the weekend. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Hallo János! Was hast du am Wochenende gemacht?", you: false },
      { speaker: "B", de: "Nichts Besonderes. Am Samstag habe ich lange geschlafen und die Wohnung aufgeräumt.", you: true },
      { speaker: "A", de: "Und am Sonntag?", you: false },
      { speaker: "B", de: "Am Sonntag habe ich im Fitnessstudio trainiert. Am Abend haben wir Freunde zum Essen eingeladen.", you: true },
      { speaker: "A", de: "Schön! Was habt ihr gekocht?", you: false },
      { speaker: "B", de: "Wir haben Gulasch gekocht. Das hat viel Spaß gemacht. Und du? Was hast du gemacht?", you: true },
      { speaker: "A", de: "Ich habe den ganzen Sonntag ferngesehen.", you: false },
      { speaker: "B", de: "Das muss auch mal sein!", you: true }
    ] }
  ]
},

{
  id: "s2-12",
  season: "s2",
  n: 12,
  title: "Where I went",
  minutes: 13,
  audio: "audio/s2-12.mp3",
  intro: "Verbs of movement from one place to another, like gehen, fahren, kommen and fliegen, form the Perfekt with sein instead of haben: ich bin gefahren. Two verbs where nobody moves, bleiben and passieren, also take sein. You need them whenever you tell someone where you went, in an e-mail about a trip or when you talk about your own experience in the speaking exam.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Wohin bist du am Wochenende gefahren?", en: "Where did you go at the weekend?", note: "Movement from one place to another takes sein, not haben: bist, and gefahren at the end." },
      { de: "Ich bin nach Heidelberg gefahren.", en: "I went to Heidelberg.", note: "nach before cities and countries." },
      { de: "Wir sind mit dem Zug gefahren.", en: "We went by train.", note: "" },
      { de: "Ich bin um sechs Uhr aufgestanden.", en: "I got up at six.", note: "aufstehen takes sein too, because your position changes: aufgestanden." },
      { de: "Wir sind um zehn Uhr angekommen.", en: "We arrived at ten.", note: "ankommen, to arrive, is a split verb: angekommen." },
      { de: "Wir sind in der Altstadt spazieren gegangen.", en: "We went for a walk in the old town.", note: "gehen is irregular: gegangen." },
      { de: "Wir haben das Schloss besichtigt.", en: "We visited the castle.", note: "With an object, like the castle, you use haben. Verbs starting with be take no ge: besichtigt." },
      { de: "Wir sind bis Sonntag dort geblieben.", en: "We stayed there until Sunday.", note: "bleiben takes sein, although you do not move. Just learn it." },
      { de: "Ich bin zu Hause geblieben.", en: "I stayed at home.", note: "" },
      { de: "Wann bist du zurückgekommen?", en: "When did you come back?", note: "" },
      { de: "Ich bin gestern Abend zurückgekommen.", en: "I came back yesterday evening.", note: "" },
      { de: "Bist du gut nach Hause gekommen?", en: "Did you get home safely?", note: "The friendly question the day after a party. kommen takes sein: bist gekommen." },
      { de: "Im Sommer sind wir nach Ungarn geflogen.", en: "In the summer we flew to Hungary.", note: "fliegen becomes geflogen, also with sein." },
      { de: "Wir haben meine Eltern in Budapest besucht.", en: "We visited my parents in Budapest.", note: "besuchen has an object, so it takes haben: besucht." },
      { de: "Was ist passiert?", en: "What happened?", note: "passieren takes sein, and no ge because it ends in ieren: ist passiert." },
      { de: "Zum Glück ist nichts passiert.", en: "Luckily nothing happened.", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Am Samstag bin ich um sechs Uhr aufgestanden und mit dem Zug nach Heidelberg gefahren.", en: "On Saturday I got up at six and went to Heidelberg by train." },
      { de: "Wir sind um zehn Uhr angekommen und in der Altstadt spazieren gegangen.", en: "We arrived at ten and went for a walk in the old town." },
      { de: "Danach haben wir das Schloss besichtigt. Das hat viel Spaß gemacht.", en: "After that we visited the castle. That was a lot of fun." },
      { de: "Wir sind bis Sonntag dort geblieben und erst am Abend zurückgekommen.", en: "We stayed there until Sunday and only came back in the evening." },
      { de: "Im Sommer sind wir nach Ungarn geflogen und haben meine Eltern in Budapest besucht.", en: "In the summer we flew to Hungary and visited my parents in Budapest." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Monday morning on the stairs: your neighbour, Frau Weber, asks about your weekend trip. Formal Sie. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Guten Morgen! Ich habe Sie am Wochenende gar nicht gesehen.", you: false },
      { speaker: "B", de: "Guten Morgen, Frau Weber. Wir sind nach Heidelberg gefahren.", you: true },
      { speaker: "A", de: "Ach, wie schön! Sind Sie mit dem Auto gefahren?", you: false },
      { speaker: "B", de: "Nein, wir sind mit dem Zug gefahren.", you: true },
      { speaker: "A", de: "Und was haben Sie dort gemacht?", you: false },
      { speaker: "B", de: "Wir sind in der Altstadt spazieren gegangen und haben das Schloss besichtigt.", you: true },
      { speaker: "A", de: "Wie lange sind Sie geblieben?", you: false },
      { speaker: "B", de: "Bis Sonntag. Wir sind gestern Abend zurückgekommen. Ist hier im Haus etwas passiert?", you: true },
      { speaker: "A", de: "Nein, zum Glück ist nichts passiert.", you: false }
    ] }
  ]
},

{
  id: "s2-13",
  season: "s2",
  n: 13,
  title: "It was great",
  minutes: 12,
  audio: "audio/s2-13.mp3",
  intro: "With sein and haben, Germans usually skip the Perfekt and simply say war and hatte. Together with es gab, there was, these words describe any past event: how it was, what you had and what there was. They turn up in every e-mail about a party or a trip, and all the time in the listening exam.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Wie war die Party?", en: "How was the party?", note: "war is the past of ist. Instead of ist gewesen, Germans usually just say war." },
      { de: "Die Party war super.", en: "The party was great.", note: "" },
      { de: "Es war ein schöner Abend.", en: "It was a lovely evening.", note: "" },
      { de: "Am Samstag war ich bei Marco.", en: "On Saturday I was at Marco’s place.", note: "bei with a person means at their home." },
      { de: "Warst du auch da?", en: "Were you there too?", note: "du warst, with st at the end, just like du hast." },
      { de: "Wir waren ungefähr zwanzig Leute.", en: "There were about twenty of us.", note: "Literally: we were about twenty people. That is how Germans say it." },
      { de: "Es gab viel zu essen.", en: "There was a lot to eat.", note: "es gab is the past of es gibt, there is. It stays the same for one thing or many." },
      { de: "Es gab Salate und einen großen Kuchen.", en: "There were salads and a big cake.", note: "Like es gibt, it takes the accusative: einen großen Kuchen." },
      { de: "Leider gab es keinen Parkplatz.", en: "Unfortunately there was no parking space.", note: "leider takes the first place, so the verb comes next and es follows it: gab es." },
      { de: "Das Essen war sehr lecker.", en: "The food was delicious.", note: "" },
      { de: "Die Musik war ein bisschen zu laut.", en: "The music was a bit too loud.", note: "" },
      { de: "Das Wetter war leider nicht so schön.", en: "Unfortunately the weather was not so nice.", note: "The weather comes up in almost every holiday e-mail and in many listening texts." },
      { de: "Wir hatten viel Spaß.", en: "We had a lot of fun.", note: "hatte is the past of hat: ich hatte, du hattest, wir hatten." },
      { de: "Ich hatte einen langen Tag.", en: "I had a long day.", note: "" },
      { de: "Ich hatte leider keine Zeit.", en: "Unfortunately I had no time.", note: "" },
      { de: "Wir haben bis Mitternacht getanzt. Es war toll.", en: "We danced until midnight. It was great.", note: "Mix them freely: the Perfekt for most verbs, war and hatte for sein and haben." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Am Samstag war ich bei Marco. Er hatte Geburtstag.", en: "On Saturday I was at Marco’s. It was his birthday." },
      { de: "Wir waren ungefähr zwanzig Leute, und es gab viel zu essen.", en: "There were about twenty of us, and there was a lot to eat." },
      { de: "Das Essen war sehr lecker, aber die Musik war ein bisschen zu laut.", en: "The food was delicious, but the music was a bit too loud." },
      { de: "Wir haben lange einen Parkplatz gesucht, aber es gab keinen.", en: "We looked for a parking space for a long time, but there was none." },
      { de: "Ich hatte einen langen Tag, aber es war ein schöner Abend. Wir hatten viel Spaß.", en: "I had a long day, but it was a lovely evening. We had a lot of fun." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Your friend Aylin could not come to Marco’s birthday party and asks you how it was. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Hallo János! Wie war die Party bei Marco?", you: false },
      { speaker: "B", de: "Die Party war super! Warum warst du nicht da?", you: true },
      { speaker: "A", de: "Ich hatte leider keine Zeit. Wie viele Leute waren da?", you: false },
      { speaker: "B", de: "Wir waren ungefähr zwanzig Leute.", you: true },
      { speaker: "A", de: "Gab es auch etwas zu essen?", you: false },
      { speaker: "B", de: "Ja, es gab Salate und einen großen Kuchen. Das Essen war sehr lecker.", you: true },
      { speaker: "A", de: "Wie lange bist du geblieben?", you: false },
      { speaker: "B", de: "Bis Mitternacht. Wir hatten viel Spaß.", you: true }
    ] }
  ]
},

{
  id: "s2-14",
  season: "s2",
  n: 14,
  title: "I had to, I wanted to",
  minutes: 13,
  audio: "audio/s2-14.mp3",
  intro: "Modal verbs, like müssen and können, are almost never used in the Perfekt; in the past, Germans say musste, konnte, wollte, durfte and sollte. These are the words of every excuse: I wanted to come, but I had to work. You need them in the e-mail tasks, where you often explain why something did not happen.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich musste arbeiten.", en: "I had to work.", note: "musste is the past of muss. The umlaut disappears: müssen, musste." },
      { de: "Ich musste lange im Büro bleiben.", en: "I had to stay late at the office.", note: "ich musste and er musste are the same, with no ending." },
      { de: "Warum konntest du nicht kommen?", en: "Why could you not come?", note: "For du, add st: du konntest, du musstest." },
      { de: "Leider konnte ich nicht zur Party kommen.", en: "Unfortunately I could not come to the party.", note: "The modal verb comes second, the other verb goes to the end: kommen." },
      { de: "Ich wollte kommen, aber ich konnte nicht.", en: "I wanted to come, but I could not.", note: "When the meaning is clear, konnte can stand alone." },
      { de: "Ich wollte eigentlich ins Kino gehen.", en: "I actually wanted to go to the cinema.", note: "eigentlich, actually, tells the listener: but it did not happen." },
      { de: "Ich wollte dich anrufen, aber mein Handy war leer.", en: "I wanted to call you, but my phone was dead.", note: "" },
      { de: "Ich konnte dich leider nicht erreichen.", en: "Unfortunately I could not reach you.", note: "konnte, without dots, is the past: I could. könnte, with dots, is the polite could from track seven." },
      { de: "Mein Sohn war krank, deshalb musste ich zu Hause bleiben.", en: "My son was ill, so I had to stay at home.", note: "After deshalb the verb comes next: deshalb musste ich." },
      { de: "Wir mussten eine Stunde warten.", en: "We had to wait for an hour.", note: "For we and they, add en: wir mussten, sie konnten." },
      { de: "Ich sollte um acht Uhr im Büro sein.", en: "I was supposed to be at the office at eight.", note: "sollte means was supposed to: someone else expected it." },
      { de: "Was sollte ich mitbringen?", en: "What was I supposed to bring?", note: "Ask this when you have forgotten what someone told you to do." },
      { de: "Die Kinder durften bis neun Uhr fernsehen.", en: "The children were allowed to watch television until nine.", note: "durfte, was allowed to. dürfen loses its umlaut too." },
      { de: "Man durfte dort nicht parken.", en: "You were not allowed to park there.", note: "" },
      { de: "Entschuldigung, das wollte ich nicht.", en: "Sorry, I did not mean to.", note: "A quick apology when something went wrong by accident." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich wollte am Samstag zur Party kommen, aber ich musste leider arbeiten.", en: "I wanted to come to the party on Saturday, but unfortunately I had to work." },
      { de: "Es tut mir leid, ich konnte dich nicht anrufen, weil mein Handy leer war.", en: "I am sorry, I could not call you, because my phone was dead." },
      { de: "Mein Sohn war krank, deshalb musste ich zu Hause bleiben und konnte nicht kommen.", en: "My son was ill, so I had to stay at home and could not come." },
      { de: "Ich sollte um acht Uhr im Büro sein, aber ich musste noch die Kinder zur Schule bringen.", en: "I was supposed to be at the office at eight, but first I had to take the children to school." },
      { de: "Ich wollte eigentlich ins Kino gehen, aber ich hatte keine Zeit.", en: "I actually wanted to go to the cinema, but I had no time." },
      { de: "Liebe Lena, leider konnte ich gestern nicht kommen, weil ich lange im Büro bleiben musste.", en: "Dear Lena, unfortunately I could not come yesterday, because I had to stay late at the office." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Your friend Lena asks why you did not come to dinner with friends yesterday evening. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Hallo János! Wo warst du gestern Abend? Wir haben auf dich gewartet.", you: false },
      { speaker: "B", de: "Es tut mir leid, Lena. Ich wollte kommen, aber ich musste lange im Büro bleiben.", you: true },
      { speaker: "A", de: "Schade! Konntest du nicht wenigstens anrufen?", you: false },
      { speaker: "B", de: "Ich wollte dich anrufen, aber mein Handy war leer.", you: true },
      { speaker: "A", de: "Ach so. Und was war im Büro los?", you: false },
      { speaker: "B", de: "Ich sollte einen Bericht schreiben, und mein Chef wollte ihn sofort haben.", you: true },
      { speaker: "A", de: "Das klingt stressig. Schade, es war ein toller Abend. Du hast wirklich etwas verpasst!", you: false },
      { speaker: "B", de: "Das glaube ich dir. Wollen wir uns am Samstag treffen? Ich lade dich auf einen Kaffee ein.", you: true },
      { speaker: "A", de: "Gern! Bis Samstag.", you: false },
      { speaker: "B", de: "Bis Samstag!", you: true }
    ] }
  ]
},

{
  id: "s2-15",
  season: "s2",
  n: 15,
  title: "Because and that",
  minutes: 13,
  audio: "audio/s2-15.mp3",
  intro: "Two small words, weil and dass, send the verb to the very end of the sentence, and the examiners listen for exactly that. With weil you give a reason; with dass you report what someone said, thinks or knows. This track also shows what happens after them to the Perfekt, to split verbs and to modal verbs.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Warum fährst du mit dem Roller? Weil es schneller geht.", en: "Why do you ride the scooter? Because it is quicker.", note: "In speech, a weil sentence can stand alone as the answer." },
      { de: "Ich bin müde, weil ich schlecht geschlafen habe.", en: "I am tired, because I slept badly.", note: "With the Perfekt, the participle comes first and habe goes last: geschlafen habe." },
      { de: "weil ich gestern lange gearbeitet habe.", en: "Because I worked late yesterday.", note: "" },
      { de: "weil ich jeden Tag um sechs Uhr aufstehe.", en: "Because I get up at six every day.", note: "Split verbs join up again at the end: aufstehe." },
      { de: "Ich komme später, weil ich meine Tochter zum Arzt bringen muss.", en: "I will come in later, because I have to take my daughter to the doctor.", note: "With a modal verb, the modal goes last: bringen muss." },
      { de: "Ich lerne Deutsch, weil ich im Februar die Prüfung mache.", en: "I am learning German, because I am taking the exam in February.", note: "" },
      { de: "Ich bleibe zu Hause, denn ich bin krank.", en: "I am staying at home, because I am ill.", note: "denn also means because, but the order stays normal: denn ich bin krank." },
      { de: "Ich glaube, dass er recht hat.", en: "I think that he is right.", note: "dass works like weil: the verb goes to the end." },
      { de: "Marco meint, dass man mit dem Fahrrad schneller ist.", en: "Marco thinks that you are quicker by bike.", note: "meinen means to think, to be of the opinion. It works just like glauben." },
      { de: "Ich weiß, dass du viel zu tun hast.", en: "I know that you have a lot to do.", note: "" },
      { de: "Lena hat gesagt, dass sie später kommt.", en: "Lena said that she is coming later.", note: "To report what someone said: hat gesagt, dass, then the verb at the end." },
      { de: "Die Nachbarin hat gesagt, dass sie unser Paket angenommen hat.", en: "The neighbour said that she took in our parcel.", note: "" },
      { de: "Hast du gehört, dass Marco eine neue Stelle hat?", en: "Have you heard that Marco has a new job?", note: "" },
      { de: "Ich hoffe, dass es dir bald besser geht.", en: "I hope that you feel better soon.", note: "A ready-made line for an e-mail to a friend who is ill." },
      { de: "Schade, dass du gestern nicht kommen konntest.", en: "What a pity that you could not come yesterday.", note: "" },
      { de: "Ich bin froh, dass alles geklappt hat.", en: "I am glad that everything worked out.", note: "klappen, to work out, is everyday spoken German." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich bin heute sehr müde, weil ich gestern lange gearbeitet habe.", en: "I am very tired today, because I worked late yesterday." },
      { de: "Lena hat gesagt, dass sie später kommt, weil sie noch einkaufen muss.", en: "Lena said that she is coming later, because she still has to do the shopping." },
      { de: "Ich glaube, dass Marco recht hat, denn mit dem Fahrrad ist man in Frankfurt schneller.", en: "I think that Marco is right, because in Frankfurt you are quicker by bike." },
      { de: "Hast du gehört, dass Marco eine neue Stelle hat? Ich bin froh, dass alles geklappt hat.", en: "Have you heard that Marco has a new job? I am glad that everything worked out." },
      { de: "Liebe Aylin, schade, dass du nicht kommen konntest. Ich hoffe, dass es dir bald besser geht.", en: "Dear Aylin, what a pity that you could not come. I hope that you feel better soon." },
      { de: "Ich lerne jeden Tag Deutsch, weil ich im Februar die Prüfung mache und sie bestehen möchte.", en: "I study German every day, because I am taking the exam in February and want to pass it." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "At the office: your colleague Herr Yılmaz asks where Frau Becker is. She phoned you earlier, and you pass on what she said. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Morgen! Ist Frau Becker heute nicht da?", you: false },
      { speaker: "B", de: "Guten Morgen, Herr Yılmaz. Sie hat angerufen und gesagt, dass sie später kommt.", you: true },
      { speaker: "A", de: "Ach so. Warum denn?", you: false },
      { speaker: "B", de: "Weil sie ihre Tochter zum Arzt bringen muss.", you: true },
      { speaker: "A", de: "Hoffentlich ist es nichts Schlimmes.", you: false },
      { speaker: "B", de: "Ich glaube nicht. Sie hat gesagt, dass sie gegen elf Uhr da ist.", you: true },
      { speaker: "A", de: "Gut. Dann machen wir die Besprechung erst um zwölf Uhr.", you: false },
      { speaker: "B", de: "In Ordnung. Ich schreibe ihr, dass die Besprechung erst um zwölf Uhr ist.", you: true }
    ] }
  ]
},

{
  id: "s2-16",
  season: "s2",
  n: 16,
  title: "If and whether",
  minutes: 13,
  audio: "audio/s2-16.mp3",
  intro: "English if has two German partners: wenn for conditions, and ob for whether. Both send the verb to the end, and so do polite questions that start with Können Sie mir sagen or Wissen Sie. These indirect questions are how you ask for information politely at an office, on the phone and in the formal e-mail, and the examiners listen for them.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Entschuldigung, darf ich Sie etwas fragen?", en: "Excuse me, may I ask you something?", note: "The polite way to start talking to a stranger." },
      { de: "Können Sie mir sagen, wann der Kurs anfängt?", en: "Can you tell me when the course starts?", note: "A question inside a sentence: the question word stays, the verb goes to the very end. Split verbs join up again: anfängt." },
      { de: "Wissen Sie zufällig, wo hier die Anmeldung ist?", en: "Do you happen to know where the registration desk is?", note: "zufällig, by any chance, makes the question even softer." },
      { de: "Ich möchte gern wissen, wie viel der Kurs kostet.", en: "I would like to know how much the course costs.", note: "Polite and safe in the formal e-mail, too." },
      { de: "Darf ich fragen, wie lange der Kurs dauert?", en: "May I ask how long the course lasts?", note: "" },
      { de: "Können Sie mir sagen, ob es noch freie Plätze gibt?", en: "Can you tell me whether there are any places left?", note: "English if has two jobs. When it means whether, German says ob. The verb still goes to the end: gibt." },
      { de: "Wissen Sie, ob man auch mit Karte bezahlen kann?", en: "Do you know whether you can also pay by card?", note: "With a modal verb, the modal goes last: bezahlen kann. Worth asking, because some places in Germany take only cash." },
      { de: "Könnten Sie mir bitte mitteilen, ob ich mich auch online anmelden kann?", en: "Could you please let me know whether I can also register online?", note: "A line for the formal e-mail. mitteilen means to let someone know, and könnten is extra polite." },
      { de: "Ich weiß nicht, ob ich am Dienstag Zeit habe.", en: "I do not know whether I have time on Tuesday.", note: "English often says I do not know if, but German needs ob here, never wenn." },
      { de: "Ich bin mir nicht sicher, ob ich Sie richtig verstanden habe.", en: "I am not sure whether I understood you correctly.", note: "With the Perfekt, habe goes last: verstanden habe." },
      { de: "Können Sie das bitte wiederholen?", en: "Could you repeat that, please?", note: "Asking someone to repeat is fine in the speaking exam, too." },
      { de: "Wenn Sie Fragen haben, rufen Sie mich einfach an.", en: "If you have any questions, just call me.", note: "When if means on condition that, German says wenn. It also sends the verb to the end: haben." },
      { de: "Wenn ich Zeit habe, komme ich gern.", en: "If I have time, I will be happy to come.", note: "After the wenn part, the next part starts with its verb: habe, comma, komme. You will hear this rhythm all the time." },
      { de: "Wenn es regnet, fahre ich nicht mit dem Roller.", en: "If it rains, I do not ride the scooter.", note: "" },
      { de: "Wenn der Kurs voll ist, kommen Sie auf die Warteliste.", en: "If the course is full, you go on the waiting list.", note: "You may hear this at the Volkshochschule. die Warteliste is the waiting list." },
      { de: "Wenn ich die Prüfung bestehe, feiern wir.", en: "If I pass the exam, we will celebrate.", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Entschuldigung, darf ich Sie etwas fragen? Können Sie mir sagen, wann der nächste Deutschkurs anfängt?", en: "Excuse me, may I ask you something? Can you tell me when the next German course starts?" },
      { de: "Ich möchte gern wissen, wie viel der Kurs kostet und ob man auch mit Karte bezahlen kann.", en: "I would like to know how much the course costs and whether you can also pay by card." },
      { de: "Ich weiß noch nicht, ob ich am Dienstag Zeit habe, weil ich manchmal lange arbeiten muss.", en: "I do not know yet whether I have time on Tuesday, because I sometimes have to work late." },
      { de: "Wenn der Kurs schon voll ist, können Sie mich bitte auf die Warteliste setzen?", en: "If the course is already full, could you please put me on the waiting list?" },
      { de: "Ich bin mir nicht sicher, ob ich Sie richtig verstanden habe. Können Sie das bitte wiederholen?", en: "I am not sure whether I understood you correctly. Could you repeat that, please?" },
      { de: "Sehr geehrte Frau Müller, könnten Sie mir bitte mitteilen, ob es im Februar noch einen Prüfungstermin gibt?", en: "Dear Ms Müller, could you please let me know whether there is still an exam date in February?" }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "At the front desk of the Volkshochschule, the adult education centre, you ask about an evening German course. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Tag! Was kann ich für Sie tun?", you: false },
      { speaker: "B", de: "Guten Tag. Ich suche einen Deutschkurs am Abend. Können Sie mir sagen, wann der nächste Kurs anfängt?", you: true },
      { speaker: "A", de: "Der nächste Abendkurs fängt am Montag, dem neunten November, an.", you: false },
      { speaker: "B", de: "Wissen Sie, ob es noch freie Plätze gibt?", you: true },
      { speaker: "A", de: "Ja, es sind noch drei Plätze frei.", you: false },
      { speaker: "B", de: "Schön. Darf ich noch fragen, wie viel der Kurs kostet?", you: true },
      { speaker: "A", de: "Zweihundertvierzig Euro für zwölf Wochen.", you: false },
      { speaker: "B", de: "Und können Sie mir sagen, ob man auch mit Karte bezahlen kann?", you: true },
      { speaker: "A", de: "Ja, natürlich. Wenn Sie sich gleich anmelden möchten, füllen Sie bitte dieses Formular aus.", you: false },
      { speaker: "B", de: "Gern. Und wenn ich noch Fragen habe, rufe ich Sie an. Vielen Dank für die Auskunft!", you: true }
    ] }
  ]
},

{
  id: "s2-17",
  season: "s2",
  n: 17,
  title: "Although and so that",
  minutes: 13,
  audio: "audio/s2-17.mp3",
  intro: "This track gives you three new connectors. With um and zu, or with damit, you say what something is for; with obwohl you say although. They let you explain your plans in the speaking exam and in every e-mail, and they show the examiners that you can do more than weil.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich lerne jeden Tag Deutsch, um die Prüfung zu bestehen.", en: "I study German every day to pass the exam.", note: "um at the start, zu and the verb at the very end. It means in order to." },
      { de: "Ich stehe früh auf, um ins Fitnessstudio zu gehen.", en: "I get up early to go to the gym.", note: "Use um and zu when it is the same person in both parts: I get up, I go." },
      { de: "Ich fahre mit dem Roller, um Zeit zu sparen.", en: "I ride the scooter to save time.", note: "" },
      { de: "Ich muss jetzt los, um noch schnell einzukaufen.", en: "I have to go now to do some quick shopping.", note: "With split verbs, zu goes in the middle: einzukaufen, anzurufen, aufzustehen." },
      { de: "Ich spare Geld, um im Sommer nach Ungarn zu fliegen.", en: "I am saving money to fly to Hungary in the summer.", note: "" },
      { de: "Ich schreibe Ihnen, um mich für den Kurs anzumelden.", en: "I am writing to register for the course.", note: "A strong first line for the formal e-mail. With sich anmelden, zu goes in the middle: mich anzumelden." },
      { de: "Wozu brauchst du das?", en: "What do you need that for?", note: "wozu asks what for. Answer with um and zu, or with damit." },
      { de: "Ich erkläre es noch einmal, damit es alle verstehen.", en: "I will explain it again so that everyone understands.", note: "When the person changes, use damit: I explain, everyone understands. The verb goes to the end." },
      { de: "Ich schicke dir die Adresse, damit du sie nicht suchen musst.", en: "I will send you the address so that you do not have to look for it.", note: "With a modal verb, the modal goes last: suchen musst." },
      { de: "Ich rufe dich heute Abend an, damit wir alles besprechen können.", en: "I will call you this evening so that we can talk everything through.", note: "" },
      { de: "Ich bringe die Kinder früh ins Bett, damit sie genug schlafen.", en: "I put the children to bed early so that they get enough sleep.", note: "" },
      { de: "Obwohl ich müde bin, gehe ich ins Fitnessstudio.", en: "Although I am tired, I go to the gym.", note: "obwohl, although, sends the verb to the end, like weil. Then the next part starts with its verb: gehe ich." },
      { de: "Ich fahre mit dem Roller, obwohl es kalt ist.", en: "I ride the scooter, although it is cold.", note: "" },
      { de: "Es ist kalt. Trotzdem fahre ich mit dem Roller.", en: "It is cold. I still ride the scooter.", note: "trotzdem, from season one, says the same thing, but the verb stays in second place: trotzdem fahre ich." },
      { de: "Obwohl ich wenig Zeit habe, lerne ich jeden Tag zwanzig Minuten.", en: "Although I have little time, I study for twenty minutes every day.", note: "" },
      { de: "Mein Kollege ist ins Büro gekommen, obwohl er Fieber hatte.", en: "My colleague came to the office, although he had a temperature.", note: "In the past it works the same way: hatte goes to the end." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Obwohl ich viel arbeite, lerne ich jeden Tag zwanzig Minuten Deutsch, um im Februar die Prüfung zu bestehen.", en: "Although I work a lot, I study German for twenty minutes every day to pass the exam in February." },
      { de: "Ich stehe um sechs Uhr auf, um vor der Arbeit ins Fitnessstudio zu gehen.", en: "I get up at six to go to the gym before work." },
      { de: "Ich fahre mit dem Roller, obwohl es kalt ist, weil es einfach schneller geht.", en: "I ride the scooter, although it is cold, because it is simply quicker." },
      { de: "Wir sparen Geld, damit die Kinder im Sommer ihre Großeltern in Ungarn besuchen können.", en: "We are saving money so that the children can visit their grandparents in Hungary in the summer." },
      { de: "Komm doch schon um sieben Uhr, damit wir vor dem Essen noch in Ruhe reden können.", en: "Do come at seven, so that we can talk in peace before dinner." },
      { de: "Ich muss jetzt los, um noch einzukaufen. Ich rufe dich heute Abend an, damit wir alles besprechen können.", en: "I have to go now to do the shopping. I will call you this evening so that we can talk everything through." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Half past six in the morning at the gym: your friend Nina asks why you are always there so early. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Hallo János! Schon wieder so früh hier?", you: false },
      { speaker: "B", de: "Ja, ich stehe um sechs Uhr auf, um vor der Arbeit zu trainieren.", you: true },
      { speaker: "A", de: "Und das, obwohl du so viel arbeitest? Respekt!", you: false },
      { speaker: "B", de: "Obwohl ich wenig Zeit habe, mache ich jeden Tag ein bisschen Sport. Das ist gesund.", you: true },
      { speaker: "A", de: "Und wann lernst du Deutsch? Du hast doch bald die Prüfung.", you: false },
      { speaker: "B", de: "Auf dem Roller. Ich höre jeden Morgen einen Audiokurs, um mich auf die Prüfung vorzubereiten.", you: true },
      { speaker: "A", de: "Auf dem Roller? Auch wenn es so kalt ist?", you: false },
      { speaker: "B", de: "Ja, ich fahre mit dem Roller, obwohl es kalt ist. Es geht einfach schneller.", you: true },
      { speaker: "A", de: "Wozu brauchst du eigentlich das Zertifikat?", you: false },
      { speaker: "B", de: "Für die Arbeit. Und ich lerne, damit meine Kinder nicht immer für mich übersetzen müssen.", you: true }
    ] }
  ]
},

{
  id: "s2-18",
  season: "s2",
  n: 18,
  title: "When I was a child",
  minutes: 14,
  audio: "audio/s2-18.mp3",
  intro: "To tell a story about the past, German has two words for when: als for one moment or one period, and wenn for things that happened again and again. Written stories also use the simple past, like wohnten, fuhren and spielten. Childhood and life stories come up in the speaking exam, and the reading texts are full of this past tense.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich bin in Ungarn aufgewachsen.", en: "I grew up in Hungary.", note: "aufwachsen, to grow up, takes sein in the Perfekt: ich bin aufgewachsen." },
      { de: "Als ich ein Kind war, wohnten wir in einer kleinen Stadt.", en: "When I was a child, we lived in a small town.", note: "als, when, for one time or one period in the past. The verb goes to the end: war." },
      { de: "Meine Eltern arbeiteten beide.", en: "Both my parents worked.", note: "The simple past of regular verbs adds te: spielen, spielte. If the stem ends in t, add ete: arbeitete." },
      { de: "Wir spielten den ganzen Tag draußen.", en: "We played outside all day.", note: "Written stories use this form. In speaking, the Perfekt is fine too: wir haben gespielt." },
      { de: "Ich ging gern zur Schule.", en: "I liked going to school.", note: "Irregular verbs change the vowel instead: gehen, ich ging; fahren, ich fuhr." },
      { de: "Mit sechs Jahren kam ich in die Schule.", en: "I started school at six.", note: "kommen becomes kam. in die Schule kommen means to start school." },
      { de: "Jeden Sommer fuhren wir an den Plattensee.", en: "Every summer we went to Lake Balaton.", note: "Germans call Lake Balaton der Plattensee." },
      { de: "Wenn wir bei meiner Oma waren, backte sie immer einen Kuchen.", en: "Whenever we were at my grandma’s, she always baked a cake.", note: "wenn in the past means every time, whenever. The word immer often comes with it." },
      { de: "Wenn es im Winter schneite, bauten wir einen Schneemann.", en: "Whenever it snowed in winter, we built a snowman.", note: "Every winter, again and again, so wenn." },
      { de: "Wir hatten einen Hund. Er hieß Bodri.", en: "We had a dog. He was called Bodri.", note: "heißen becomes hieß." },
      { de: "Damals gab es noch keine Handys.", en: "Back then there were no mobile phones yet.", note: "damals, back then, is the key word of every childhood story." },
      { de: "Als Kind durfte ich nicht lange fernsehen.", en: "As a child I was not allowed to watch television for long.", note: "als Kind, with no verb, simply means as a child." },
      { de: "Als ich zehn Jahre alt war, zogen wir nach Budapest.", en: "When I was ten, we moved to Budapest.", note: "ziehen nach, to move to a town. Simple past: wir zogen. Perfekt with sein: wir sind gezogen." },
      { de: "Als ich nach Deutschland kam, konnte ich nur ein paar Wörter Deutsch.", en: "When I came to Germany, I only knew a few words of German.", note: "One moment in your life, so als. In a question, when is wann: Wann bist du nach Deutschland gekommen?" },
      { de: "Ich erinnere mich gern an meine Kindheit.", en: "I have fond memories of my childhood.", note: "sich erinnern an, to remember." },
      { de: "Das war eine schöne Zeit.", en: "That was a lovely time.", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich bin in Ungarn aufgewachsen. Als ich ein Kind war, wohnten wir in einer kleinen Stadt.", en: "I grew up in Hungary. When I was a child, we lived in a small town." },
      { de: "Wenn wir bei meiner Oma waren, backte sie immer einen Kuchen, und wir spielten im Garten.", en: "Whenever we were at my grandma’s, she always baked a cake, and we played in the garden." },
      { de: "Damals gab es noch keine Handys, deshalb spielten wir den ganzen Tag draußen.", en: "Back then there were no mobile phones yet, so we played outside all day." },
      { de: "Als ich zehn Jahre alt war, zogen wir nach Budapest, und ich kam in eine neue Schule.", en: "When I was ten, we moved to Budapest, and I started at a new school." },
      { de: "Als ich nach Deutschland kam, konnte ich nur ein paar Wörter Deutsch. Heute lerne ich jeden Tag.", en: "When I came to Germany, I only knew a few words of German. Today I study every day." }
    ] },
    { type: "text", heading: "My childhood", intro: "A short text about your childhood, the kind you could write in a forum post or tell in the exam: where you lived, what happened every time, and what happened once.", lines: [
      "Ich bin in Ungarn aufgewachsen.",
      "Als ich ein Kind war, wohnten wir in einer kleinen Stadt.",
      "Meine Eltern arbeiteten beide, deshalb war ich oft bei meiner Oma.",
      "Wenn ich bei ihr war, backte sie immer einen Kuchen.",
      "Jeden Sommer fuhren wir an den Plattensee.",
      "Damals gab es noch keine Handys, und wir spielten den ganzen Tag draußen.",
      "Als ich zehn Jahre alt war, zogen wir nach Budapest. Am Anfang war das schwer, aber bald hatte ich neue Freunde.",
      "Ich erinnere mich gern an diese Zeit."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Over coffee, your friend Sophie asks where you grew up and what your childhood was like. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Sag mal, wo bist du eigentlich aufgewachsen?", you: false },
      { speaker: "B", de: "In Ungarn. Als ich ein Kind war, wohnten wir in einer kleinen Stadt.", you: true },
      { speaker: "A", de: "Und was hast du als Kind gern gemacht?", you: false },
      { speaker: "B", de: "Wir haben den ganzen Tag draußen gespielt. Damals gab es noch keine Handys.", you: true },
      { speaker: "A", de: "Seid ihr im Sommer verreist?", you: false },
      { speaker: "B", de: "Ja, jeden Sommer fuhren wir an den Plattensee. Das war eine schöne Zeit.", you: true },
      { speaker: "A", de: "Und deine Großeltern? Hast du sie oft besucht?", you: false },
      { speaker: "B", de: "Ja, sehr oft. Wenn wir bei meiner Oma waren, backte sie immer einen Kuchen.", you: true },
      { speaker: "A", de: "Wie schön! Und als du nach Deutschland gekommen bist, konntest du schon Deutsch?", you: false },
      { speaker: "B", de: "Nein, als ich nach Deutschland kam, konnte ich nur ein paar Wörter. Aber jetzt lerne ich jeden Tag.", you: true }
    ] }
  ]
},

{
  id: "s2-19",
  season: "s2",
  n: 19,
  title: "At the doctor’s",
  minutes: 13,
  audio: "audio/s2-19.mp3",
  intro: "At the doctor’s, German often turns English around: not my head hurts, but to me the head hurts, mir tut der Kopf weh. That little word mir is the dative, and together with sollte for advice it gives you everything you need for a visit to the doctor. Health is a favourite topic in the listening exam, and these are lines you will need in real life in Frankfurt.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Was fehlt Ihnen denn?", en: "What seems to be the problem?", note: "The doctor’s classic first question. Literally: what is missing to you. Ihnen is the dative of Sie." },
      { de: "Mir tut der Kopf weh.", en: "My head hurts.", note: "Literally: to me the head hurts. mir is the dative of ich." },
      { de: "Mir tut der Rücken seit drei Tagen weh.", en: "My back has been hurting for three days.", note: "seit with the present tense, where English says has been." },
      { de: "Nach dem Training tun mir die Beine weh.", en: "After training my legs hurt.", note: "More than one thing hurts, so tun instead of tut." },
      { de: "weil mir der Kopf wehtut.", en: "Because my head hurts.", note: "After weil, weh and tut join up at the end: wehtut." },
      { de: "Mir ist schlecht und ein bisschen schwindlig.", en: "I feel sick and a bit dizzy.", note: "No ich here: mir ist schlecht, mir ist kalt, mir ist schwindlig." },
      { de: "Ich habe Halsschmerzen und Husten.", en: "I have a sore throat and a cough.", note: "Any pain works like this: Kopfschmerzen, Bauchschmerzen, Zahnschmerzen." },
      { de: "Ich habe seit gestern Fieber.", en: "I have had a temperature since yesterday.", note: "" },
      { de: "Meiner Tochter geht es nicht gut.", en: "My daughter is not well.", note: "The dative with a person: meiner Tochter, meinem Sohn. Just like Wie geht es Ihnen?" },
      { de: "Haben Sie Ihre Versichertenkarte dabei?", en: "Do you have your health insurance card with you?", note: "You hear this at the reception desk, before anything else." },
      { de: "Seit wann haben Sie die Beschwerden?", en: "How long have you had these symptoms?", note: "die Beschwerden is the doctor’s word for your symptoms." },
      { de: "Sie sollten viel trinken und im Bett bleiben.", en: "You should drink a lot and stay in bed.", note: "sollte, should, is the polite way to give advice. The other verbs go to the end." },
      { de: "Du solltest zum Arzt gehen.", en: "You should go to the doctor.", note: "To a friend: du solltest." },
      { de: "Nehmen Sie die Tabletten dreimal täglich nach dem Essen.", en: "Take the tablets three times a day after meals.", note: "You will hear this at the doctor’s and in the pharmacy, die Apotheke." },
      { de: "Ich schreibe Sie bis Freitag krank.", en: "I will sign you off sick until Friday.", note: "krankschreiben, to sign someone off sick. Your employer then gets the sick note." },
      { de: "Gute Besserung!", en: "Get well soon!", note: "Say it to anyone who is ill, in person or at the end of an e-mail." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Mir tut seit drei Tagen der Kopf weh, und mir ist ein bisschen schlecht.", en: "My head has been hurting for three days, and I feel a bit sick." },
      { de: "Ich kann heute leider nicht zur Arbeit kommen, weil ich Fieber habe und mir alles wehtut.", en: "Unfortunately I cannot come to work today, because I have a temperature and everything hurts." },
      { de: "Der Arzt hat gesagt, dass ich viel trinken und im Bett bleiben soll.", en: "The doctor said that I should drink a lot and stay in bed." },
      { de: "Du siehst nicht gut aus. Du solltest zum Arzt gehen und ein paar Tage zu Hause bleiben.", en: "You do not look well. You should go to the doctor and stay at home for a few days." },
      { de: "Guten Morgen, ich habe um halb neun einen Termin. Hier ist meine Versichertenkarte.", en: "Good morning, I have an appointment at half past eight. Here is my health insurance card." },
      { de: "Meiner Tochter geht es nicht gut. Sie hat seit gestern Fieber und Halsschmerzen.", en: "My daughter is not well. She has had a temperature and a sore throat since yesterday." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "At your family doctor’s in Frankfurt: you have had a sore throat and a cough since Monday. Formal Sie with the doctor, Frau Doktor Lehmann. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Guten Morgen. Bitte nehmen Sie Platz. Was fehlt Ihnen denn?", you: false },
      { speaker: "B", de: "Guten Morgen, Frau Doktor Lehmann. Mir tut der Hals weh, und ich habe Husten.", you: true },
      { speaker: "A", de: "Seit wann haben Sie die Beschwerden?", you: false },
      { speaker: "B", de: "Seit Montag. Und seit gestern habe ich auch Fieber.", you: true },
      { speaker: "A", de: "Tut Ihnen auch der Kopf weh?", you: false },
      { speaker: "B", de: "Ja, und mir ist ein bisschen schwindlig.", you: true },
      { speaker: "A", de: "Sie haben eine starke Erkältung. Ich verschreibe Ihnen etwas gegen den Husten, und Sie sollten viel trinken.", you: false },
      { speaker: "B", de: "Sollte ich besser zu Hause bleiben? Eigentlich muss ich morgen arbeiten.", you: true },
      { speaker: "A", de: "Ja, ich schreibe Sie bis Freitag krank. Bleiben Sie im Bett. Gute Besserung!", you: false },
      { speaker: "B", de: "Vielen Dank. Auf Wiedersehen!", you: true }
    ] }
  ]
},

{
  id: "s2-20",
  season: "s2",
  n: 20,
  title: "Appointments on the phone",
  minutes: 14,
  audio: "audio/s2-20.mp3",
  intro: "Phone calls are listening part one of the exam, and everyday life in Frankfurt: making, moving and cancelling an appointment, spelling your name, giving your number and repeating the time back. The three key verbs are vereinbaren, verschieben and absagen. In the exam you hear short phone messages and must catch the new day, the time or the number.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich möchte gern einen Termin vereinbaren.", en: "I would like to make an appointment.", note: "vereinbaren, to arrange. You know it from the formal e-mail." },
      { de: "Haben Sie nächste Woche noch einen Termin frei?", en: "Do you still have an appointment free next week?", note: "" },
      { de: "Passt Ihnen Dienstag um Viertel nach zehn?", en: "Does Tuesday at quarter past ten suit you?", note: "passen, to suit, takes the dative: passt Ihnen, passt dir." },
      { de: "Da kann ich leider nicht. Geht es auch etwas später?", en: "Unfortunately I cannot make that. Does a bit later work?", note: "Geht es is the short way to ask whether a time works." },
      { de: "Ja, das passt mir gut.", en: "Yes, that suits me fine.", note: "" },
      { de: "Ich rufe an, weil ich meinen Termin verschieben muss.", en: "I am calling because I have to move my appointment.", note: "verschieben, to move to another time." },
      { de: "Könnten wir den Termin auf Freitag verschieben?", en: "Could we move the appointment to Friday?", note: "verschieben auf, to move to: auf Freitag, auf nächste Woche." },
      { de: "Leider muss ich meinen Termin am Donnerstag absagen.", en: "Unfortunately I have to cancel my appointment on Thursday.", note: "absagen, to cancel, is a split verb: ich sage den Termin ab." },
      { de: "Auf welchen Namen, bitte?", en: "What name is it under, please?", note: "At the hairdresser or in a restaurant: whose name the booking is under." },
      { de: "Können Sie das bitte buchstabieren?", en: "Could you spell that, please?", note: "" },
      { de: "Ich buchstabiere: Jot, A, En, O, Es.", en: "Let me spell it: J, A, N, O, S.", note: "German letter names: jot for J, en for N, es for S. On the phone people add a word for each letter: Jot wie Julius, A wie Anton." },
      { de: "Unter welcher Nummer kann ich Sie erreichen?", en: "What number can I reach you on?", note: "" },
      { de: "Meine Nummer ist null sechs neun, zweiundvierzig, achtzehn, dreiunddreißig.", en: "My number is zero six nine, forty-two, eighteen, thirty-three.", note: "Germans often read phone numbers in pairs: zweiundvierzig, achtzehn. Listen for this in the exam." },
      { de: "Ich wiederhole: am Mittwoch, dem elften November, um Viertel vor neun.", en: "Let me repeat: on Wednesday the eleventh of November, at quarter to nine.", note: "Repeating the day and time back is the safest way to avoid mistakes." },
      { de: "Können Sie mich bitte zurückrufen?", en: "Could you call me back, please?", note: "" },
      { de: "Vielen Dank, auf Wiederhören!", en: "Thank you very much, goodbye!", note: "On the phone, Germans say auf Wiederhören, until we hear each other again." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Guten Tag, hier ist János. Ich möchte gern einen Termin vereinbaren. Haben Sie nächste Woche noch etwas frei?", en: "Good day, this is János. I would like to make an appointment. Do you have anything free next week?" },
      { de: "Ich rufe an, weil ich meinen Termin am Donnerstag leider verschieben muss.", en: "I am calling because unfortunately I have to move my appointment on Thursday." },
      { de: "Am Dienstag kann ich leider nicht, weil ich arbeiten muss. Geht es auch am Mittwoch?", en: "Unfortunately I cannot make Tuesday, because I have to work. Would Wednesday work?" },
      { de: "Können Sie mir sagen, ob ich etwas mitbringen muss?", en: "Can you tell me whether I need to bring anything?" },
      { de: "Ich buchstabiere: Jot wie Julius, A wie Anton, En wie Nordpol, O wie Otto, Es wie Samuel.", en: "Let me spell it: J as in Julius, A as in Anton, N as in Nordpol, O as in Otto, S as in Samuel." },
      { de: "Ich wiederhole: am Mittwoch um Viertel vor neun. Vielen Dank, auf Wiederhören!", en: "Let me repeat: on Wednesday at quarter to nine. Thank you very much, goodbye!" }
    ] },
    { type: "text", heading: "A message on your voicemail", intro: "Listening part one style: the dentist’s practice calls about your appointment. Listen for who is calling, what has changed, the new day and time, and the number to call back.", lines: [
      "Guten Tag, hier ist die Zahnarztpraxis Doktor Krüger.",
      "Wir rufen wegen Ihres Termins am Donnerstag an.",
      "Leider müssen wir den Termin absagen, weil Doktor Krüger krank ist.",
      "Wir können Ihnen einen neuen Termin am Montag, dem sechzehnten November, um zehn nach acht anbieten.",
      "Wenn Ihnen das nicht passt, rufen Sie uns bitte zurück.",
      "Unsere Nummer ist null sechs neun, fünfundfünfzig, zwölf, achtzig.",
      "Vielen Dank und auf Wiederhören."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "You phone a hairdresser’s to book a haircut, find a time that works, spell your name and give your number. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Salon Schneider, guten Tag!", you: false },
      { speaker: "B", de: "Guten Tag. Ich möchte gern einen Termin zum Haareschneiden vereinbaren.", you: true },
      { speaker: "A", de: "Gern. Passt Ihnen Dienstag um Viertel nach zehn?", you: false },
      { speaker: "B", de: "Da kann ich leider nicht, weil ich arbeiten muss. Geht es auch am Abend?", you: true },
      { speaker: "A", de: "Am Mittwoch um halb sieben ist noch ein Termin frei.", you: false },
      { speaker: "B", de: "Ja, das passt mir gut.", you: true },
      { speaker: "A", de: "Schön. Auf welchen Namen, bitte?", you: false },
      { speaker: "B", de: "Auf den Namen János. Ich buchstabiere: Jot wie Julius, A wie Anton, En wie Nordpol, O wie Otto, Es wie Samuel. Das A hat einen Akzent.", you: true },
      { speaker: "A", de: "Danke. Und unter welcher Nummer kann ich Sie erreichen?", you: false },
      { speaker: "B", de: "Null sechs neun, zweiundvierzig, achtzehn, dreiunddreißig. Also bis Mittwoch um halb sieben. Auf Wiederhören!", you: true }
    ] }
  ]
},

{
  id: "s2-21",
  season: "s2",
  n: 21,
  title: "Where is it?",
  minutes: 13,
  audio: "audio/s2-21.mp3",
  intro: "Nine small words, among them in, auf, an, neben and zwischen, can take two different cases. Ask wo, where, and you get the dative with stehen, liegen and hängen; ask wohin, where to, and you get the accusative with stellen, legen and hängen. You need this to describe your new flat in the e-mail to a friend, a favourite writing topic, and to say where things are in the listening and speaking parts.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Wo steht das Sofa?", en: "Where is the sofa?", note: "wo asks where something is. Furniture that stands upright uses stehen." },
      { de: "Das Sofa steht im Wohnzimmer.", en: "The sofa is in the living room.", note: "The answer to wo takes the dative. im is short for in dem." },
      { de: "Wohin stellen wir das Sofa?", en: "Where shall we put the sofa?", note: "wohin asks where to. stellen means to put something upright." },
      { de: "Wir stellen das Sofa ins Wohnzimmer.", en: "We will put the sofa in the living room.", note: "The answer to wohin takes the accusative. ins is short for in das." },
      { de: "Stell den Tisch bitte an die Wand.", en: "Please put the table against the wall.", note: "Movement to a place, so accusative: an die Wand." },
      { de: "Jetzt steht der Tisch an der Wand.", en: "Now the table is against the wall.", note: "No movement, so dative: die Wand becomes der Wand." },
      { de: "Ich lege das Buch auf den Tisch.", en: "I am putting the book on the table.", note: "legen means to lay something down flat. der Tisch becomes den Tisch." },
      { de: "Das Buch liegt auf dem Tisch.", en: "The book is lying on the table.", note: "liegen is the result of legen. Now it is dem Tisch." },
      { de: "Ich hänge das Bild über das Sofa.", en: "I am hanging the picture above the sofa.", note: "hängen is both the action and the result: ich hänge das Bild, das Bild hängt." },
      { de: "Das Bild hängt über dem Sofa.", en: "The picture is hanging above the sofa.", note: "" },
      { de: "Der Teppich liegt unter dem Tisch.", en: "The rug is under the table.", note: "" },
      { de: "Die Lampe steht neben dem Bett.", en: "The lamp is next to the bed.", note: "" },
      { de: "Der Schrank steht zwischen dem Fenster und der Tür.", en: "The wardrobe is between the window and the door.", note: "zwischen means between. Both things after it take the dative here." },
      { de: "Mein Roller steht vor dem Haus.", en: "My scooter is in front of the house.", note: "vor means in front of, hinter means behind." },
      { de: "Die Bücher stehen im Regal.", en: "The books are on the shelf.", note: "Books on a shelf stand in German, because they are upright." },
      { de: "Wohin hast du meine Schlüssel gelegt?", en: "Where did you put my keys?", note: "In the Perfekt the putting verbs are gestellt, gelegt and gehängt." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Wir stellen das Sofa an die Wand und den Tisch vor das Sofa.", en: "We will put the sofa against the wall and the table in front of the sofa." },
      { de: "Das Bett steht zwischen dem Fenster und dem Schrank, und daneben steht eine Lampe.", en: "The bed is between the window and the wardrobe, and next to it there is a lamp." },
      { de: "Kannst du mir helfen? Ich möchte das Bild über das Sofa hängen.", en: "Can you help me? I would like to hang the picture above the sofa." },
      { de: "Ich habe die Schlüssel auf den Tisch gelegt, aber jetzt liegen sie nicht mehr da.", en: "I put the keys on the table, but now they are not there any more." },
      { de: "Im Kinderzimmer steht ein Schreibtisch am Fenster, und über dem Bett hängt ein Poster.", en: "In the children’s room there is a desk by the window, and above the bed there is a poster." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Moving day: your friend Tobias helps you carry the new furniture into the flat and asks where everything goes. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Das Sofa ist ganz schön schwer! Wohin stellen wir es?", you: false },
      { speaker: "B", de: "Ins Wohnzimmer, bitte. Wir stellen es an die Wand, neben das Fenster.", you: true },
      { speaker: "A", de: "Gut. Und der Tisch? Kommt der vor das Sofa?", you: false },
      { speaker: "B", de: "Ja, genau. Und der Teppich kommt unter den Tisch.", you: true },
      { speaker: "A", de: "Und wohin hängen wir das große Bild?", you: false },
      { speaker: "B", de: "Über das Sofa. Kannst du mir kurz helfen?", you: true },
      { speaker: "A", de: "Klar. So, jetzt hängt es über dem Sofa. Sieht toll aus!", you: false },
      { speaker: "B", de: "Super, vielen Dank! Die Getränke stehen im Kühlschrank.", you: true },
      { speaker: "A", de: "Prima. Und wo liegt der Flaschenöffner?", you: false },
      { speaker: "B", de: "Der liegt in der Küche auf dem Tisch.", you: true }
    ] }
  ]
},

{
  id: "s2-22",
  season: "s2",
  n: 22,
  title: "Finding a flat",
  minutes: 14,
  audio: "audio/s2-22.mp3",
  intro: "Housing comes up all over the exam: flat adverts in the reading part, calls about a flat in the listening part, and questions to a landlord in the formal e-mail. This track gives you the words every advert uses, like Miete, Nebenkosten and Kaution, the questions you ask before a viewing, and a first look at comparisons: größer als, bigger than.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich habe Ihre Anzeige im Internet gelesen.", en: "I read your advert on the internet.", note: "A good first line for any call about a flat. eine Anzeige is an advert." },
      { de: "Ist die Wohnung noch frei?", en: "Is the flat still available?", note: "" },
      { de: "Wir suchen eine Wohnung mit drei Zimmern.", en: "We are looking for a flat with three rooms.", note: "Germans count the rooms without kitchen and bathroom. After mit, Zimmer becomes Zimmern: dative plural." },
      { de: "Wie hoch ist die Miete?", en: "How much is the rent?", note: "For rents and costs, Germans ask how high: wie hoch." },
      { de: "Die Kaltmiete beträgt neunhundert Euro im Monat.", en: "The basic rent is nine hundred euros a month.", note: "Kaltmiete is the rent without heating and other costs. beträgt is the formal word for is, with amounts." },
      { de: "Sind die Nebenkosten in der Miete enthalten?", en: "Are the extra costs included in the rent?", note: "Nebenkosten are the extra costs, like heating, water and rubbish. Kaltmiete plus Nebenkosten is the Warmmiete." },
      { de: "Wie hoch ist die Kaution?", en: "How much is the deposit?", note: "The Kaution is usually two or three months of basic rent, never more than three. You get it back when you move out." },
      { de: "Ab wann ist die Wohnung frei?", en: "When is the flat available from?", note: "" },
      { de: "Die Wohnung ist ab dem ersten Dezember frei.", en: "The flat is available from the first of December.", note: "Dates use ordinal numbers: der erste, der zweite, der dritte. After ab dem, they end in en." },
      { de: "Wann kann ich die Wohnung besichtigen?", en: "When can I view the flat?", note: "besichtigen means to view. The viewing itself is die Besichtigung." },
      { de: "Die Wohnung ist achtzig Quadratmeter groß, hell und ruhig.", en: "The flat is eighty square metres, bright and quiet.", note: "Flats are measured in Quadratmeter, square metres. The question is: Wie groß ist die Wohnung?" },
      { de: "Die neue Wohnung ist größer als unsere alte.", en: "The new flat is bigger than our old one.", note: "To compare, add er and use als: hell, heller als. Short words often add an umlaut: groß, größer." },
      { de: "Hier ist es ruhiger als in der Innenstadt.", en: "It is quieter here than in the city centre.", note: "" },
      { de: "Wie weit ist es bis zur nächsten Haltestelle?", en: "How far is it to the nearest stop?", note: "" },
      { de: "Ich habe gestern mit dem Vermieter telefoniert.", en: "I spoke to the landlord on the phone yesterday.", note: "der Vermieter rents the flat out, der Mieter pays the rent. A woman is die Vermieterin." },
      { de: "Wir möchten die Wohnung gern nehmen.", en: "We would like to take the flat.", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Guten Tag, ich habe Ihre Anzeige im Internet gelesen. Ist die Wohnung noch frei?", en: "Good day, I read your advert on the internet. Is the flat still available?" },
      { de: "Wir suchen eine helle Wohnung mit drei Zimmern, weil unsere alte Wohnung zu klein ist.", en: "We are looking for a bright flat with three rooms, because our old flat is too small." },
      { de: "Die Kaltmiete beträgt neunhundert Euro, dazu kommen zweihundert Euro Nebenkosten.", en: "The basic rent is nine hundred euros, plus two hundred euros in extra costs." },
      { de: "Die Wohnung hat einen Balkon und ist viel ruhiger als unsere alte Wohnung.", en: "The flat has a balcony and is much quieter than our old flat." },
      { de: "Könnten wir einen Termin für die Besichtigung vereinbaren? Am Samstag habe ich Zeit.", en: "Could we arrange an appointment for the viewing? I have time on Saturday." }
    ] },
    { type: "text", heading: "The advert", intro: "A flat advert from a Frankfurt website, read aloud. In the reading exam, adverts like this are full of short forms; here everything is written out.", lines: [
      "Helle Dreizimmerwohnung in Frankfurt zu vermieten.",
      "Achtzig Quadratmeter im dritten Stock, mit Aufzug und Balkon.",
      "Ruhige Lage, nur fünf Minuten bis zur nächsten Haltestelle.",
      "Kaltmiete neunhundert Euro, Nebenkosten zweihundert Euro.",
      "Die Kaution beträgt drei Monatsmieten.",
      "Die Wohnung ist ab dem ersten Dezember frei.",
      "Besichtigung am Samstag. Bitte rufen Sie Frau Hoffmann an."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "A phone call: you have read the advert and you call the landlady, Frau Hoffmann. Formal Sie. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Hoffmann, guten Tag.", you: false },
      { speaker: "B", de: "Guten Tag, Frau Hoffmann, hier ist János. Ich habe Ihre Anzeige im Internet gelesen. Ist die Wohnung noch frei?", you: true },
      { speaker: "A", de: "Ja, die Wohnung ist ab dem ersten Dezember frei.", you: false },
      { speaker: "B", de: "Wunderbar. Wie hoch ist die Miete, und sind die Nebenkosten schon enthalten?", you: true },
      { speaker: "A", de: "Die Kaltmiete beträgt neunhundert Euro, dazu kommen zweihundert Euro Nebenkosten.", you: false },
      { speaker: "B", de: "Und wie hoch ist die Kaution?", you: true },
      { speaker: "A", de: "Drei Monatsmieten, also zweitausendsiebenhundert Euro.", you: false },
      { speaker: "B", de: "Gut. Wann kann ich die Wohnung besichtigen?", you: true },
      { speaker: "A", de: "Am Samstag um elf Uhr. Passt Ihnen das?", you: false },
      { speaker: "B", de: "Ja, das passt sehr gut. Vielen Dank und auf Wiederhören!", you: true }
    ] }
  ]
},

{
  id: "s2-23",
  season: "s2",
  n: 23,
  title: "Better, best",
  minutes: 13,
  audio: "audio/s2-23.mp3",
  intro: "Whenever you choose between things, you compare: German adds er for more, as in billiger als, cheaper than, and puts am before the ending sten for the most, as in am billigsten, the cheapest. For equal things you say so warm wie, as warm as, and for what you like more or most, lieber and am liebsten. You need comparisons when you weigh up two ideas in the planning task and whenever you talk about pros and cons.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Welches Handy ist besser?", en: "Which phone is better?", note: "gut, besser, am besten: irregular, just like good, better, best." },
      { de: "Das blaue Handy ist billiger als das schwarze.", en: "The blue phone is cheaper than the black one.", note: "To compare, add er and use als: billig, billiger als." },
      { de: "Das schwarze ist teurer, aber es ist auch besser.", en: "The black one is more expensive, but it is also better.", note: "teuer drops an e: teurer." },
      { de: "Die Jacke ist genauso warm wie der Mantel.", en: "The jacket is just as warm as the coat.", note: "Equal things: so warm wie, as warm as. genauso means just as." },
      { de: "Die Schuhe sind nicht so bequem wie die anderen.", en: "The shoes are not as comfortable as the other ones.", note: "" },
      { de: "Dieser Fernseher ist am billigsten.", en: "This television is the cheapest.", note: "The most: am, then the adjective with sten. am billigsten, am schönsten." },
      { de: "Im Internet ist es oft am günstigsten.", en: "It is often cheapest on the internet.", note: "günstig means good value. billig can also mean cheap and poor quality." },
      { de: "Das ist das beste Angebot.", en: "That is the best offer.", note: "Before a noun, the superlative gets an ending: der beste Preis, das beste Angebot." },
      { de: "Ich trinke lieber Tee als Kaffee.", en: "I prefer tea to coffee.", note: "gern, lieber, am liebsten: to like, to prefer, to like most of all." },
      { de: "Am liebsten kaufe ich auf dem Markt ein.", en: "Best of all, I like shopping at the market.", note: "am liebsten starts the sentence, so the verb comes straight after it." },
      { de: "Welches Kleid gefällt dir besser, das rote oder das blaue?", en: "Which dress do you like better, the red one or the blue one?", note: "gefallen works the other way round: the dress is the subject, and the person is in the dative, dir or mir." },
      { de: "Diese Waschmaschine verbraucht weniger Strom.", en: "This washing machine uses less electricity.", note: "viel, mehr, am meisten. wenig, weniger, am wenigsten." },
      { de: "Das kostet mehr, als ich dachte.", en: "That costs more than I thought.", note: "dachte is the past of denken." },
      { de: "Das ist mir zu teuer.", en: "That is too expensive for me.", note: "" },
      { de: "Ich nehme das günstigere Modell.", en: "I will take the cheaper model.", note: "Before a noun, the comparative gets an ending too: das günstigere Modell." },
      { de: "Größer ist nicht immer besser.", en: "Bigger is not always better.", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Das schwarze Handy ist teurer als das blaue, aber die Kamera ist viel besser.", en: "The black phone is more expensive than the blue one, but the camera is much better." },
      { de: "Im Internet ist der Fernseher am günstigsten, aber im Geschäft kann man ihn sehen.", en: "The television is cheapest on the internet, but in the shop you can see it." },
      { de: "Ich kaufe lieber im Geschäft ein, weil ich die Sachen sehen möchte.", en: "I prefer to shop in a real shop, because I want to see the things." },
      { de: "Die Jacke ist genauso warm wie der Mantel, aber sie ist nicht so schwer.", en: "The jacket is just as warm as the coat, but it is not as heavy." },
      { de: "Meiner Meinung nach ist das günstigere Modell am besten, weil es weniger Strom verbraucht.", en: "In my opinion the cheaper model is the best, because it uses less electricity." },
      { de: "Ich finde ein Restaurant besser als eine Party zu Hause, weil wir dann weniger Arbeit haben.", en: "I think a restaurant is better than a party at home, because then we have less work." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "In an electronics shop: three phones on the shelf, and your friend Felix helps you choose. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Und? Welches Handy gefällt dir am besten?", you: false },
      { speaker: "B", de: "Das schwarze gefällt mir am besten. Es hat die beste Kamera.", you: true },
      { speaker: "A", de: "Aber es ist auch am teuersten. Das blaue ist hundert Euro billiger.", you: false },
      { speaker: "B", de: "Das stimmt, aber das blaue ist nicht so schnell wie das schwarze.", you: true },
      { speaker: "A", de: "Vielleicht ist das schwarze im Internet günstiger. Wollen wir mal schauen?", you: false },
      { speaker: "B", de: "Eigentlich kaufe ich lieber im Geschäft ein, weil ich hier Fragen stellen kann.", you: true },
      { speaker: "A", de: "Schau mal, im Internet kostet es achtzig Euro weniger!", you: false },
      { speaker: "B", de: "Achtzig Euro weniger? Dann bestelle ich es doch im Internet.", you: true }
    ] }
  ]
},

{
  id: "s2-24",
  season: "s2",
  n: 24,
  title: "Complaints and returns",
  minutes: 13,
  audio: "audio/s2-24.mp3",
  intro: "When something you bought is broken, politeness gets you further, and in German it lives in three small words: hätte, könnte and würde. Ich hätte gern sounds friendlier than ich will, and könnten Sie or würden Sie turns an order into a polite request. You need these forms in the formal e-mail and the speaking exam, and the listening exam often has a customer complaining in a shop.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Guten Tag, ich möchte etwas reklamieren.", en: "Good day, I would like to make a complaint.", note: "reklamieren means to complain about something you bought. In a letter you can also write: Ich möchte mich beschweren." },
      { de: "Ich habe diese Kaffeemaschine letzte Woche hier gekauft.", en: "I bought this coffee machine here last week.", note: "" },
      { de: "Leider funktioniert sie nicht.", en: "Unfortunately it does not work.", note: "die Kaffeemaschine is feminine, so it becomes sie." },
      { de: "Hier ist der Kassenbon.", en: "Here is the receipt.", note: "Always keep the Kassenbon. Without it, many shops will not take anything back." },
      { de: "Könnten Sie die Maschine bitte umtauschen?", en: "Could you exchange the machine, please?", note: "könnten is the polite form of können. It turns a demand into a request." },
      { de: "Ich hätte gern eine neue Maschine.", en: "I would like a new machine.", note: "hätte gern is a polite way to say what you want, like I would like." },
      { de: "Ich hätte lieber mein Geld zurück.", en: "I would rather have my money back.", note: "hätte lieber means would rather have." },
      { de: "Die Hose ist mir zu klein.", en: "The trousers are too small for me.", note: "die Hose is singular in German: die Hose ist, not sind." },
      { de: "Könnte ich sie umtauschen?", en: "Could I exchange them?", note: "könnte ich is more polite than kann ich. umtauschen splits: Ich tausche die Hose um." },
      { de: "Haben Sie die Hose auch eine Nummer größer?", en: "Do you have the trousers one size bigger?", note: "" },
      { de: "Ich möchte die Jacke zurückgeben.", en: "I would like to return the jacket.", note: "zurückgeben, to give back, splits too: Ich gebe die Jacke zurück." },
      { de: "Würden Sie bitte nachsehen, ob Sie noch eine Maschine im Lager haben?", en: "Would you please check whether you still have a machine in stock?", note: "würden Sie plus a verb in its basic form, here nachsehen, is a very polite way to ask. After ob, the verb goes to the end." },
      { de: "Das Gerät ist kaputt, aber es hat noch Garantie.", en: "The appliance is broken, but it is still under guarantee.", note: "das Gerät is any machine or device: a phone, a kettle, a coffee machine." },
      { de: "Ich bin mit der Qualität nicht zufrieden.", en: "I am not happy with the quality.", note: "zufrieden mit takes the dative: mit der Qualität, mit dem Service." },
      { de: "Das ist leider schon das zweite Mal.", en: "Unfortunately this is already the second time.", note: "" },
      { de: "Wir können Ihnen einen Gutschein geben.", en: "We can give you a voucher.", note: "What you may hear in the shop. A Gutschein is a voucher for the same shop." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Guten Tag, ich habe diese Kaffeemaschine letzte Woche hier gekauft, aber leider funktioniert sie nicht.", en: "Good day, I bought this coffee machine here last week, but unfortunately it does not work." },
      { de: "Hier ist der Kassenbon. Könnten Sie die Maschine bitte umtauschen?", en: "Here is the receipt. Could you exchange the machine, please?" },
      { de: "Die Hose ist mir zu klein. Haben Sie sie auch eine Nummer größer?", en: "The trousers are too small for me. Do you have them one size bigger?" },
      { de: "Vielen Dank für das Angebot, aber ich hätte lieber mein Geld zurück.", en: "Thank you very much for the offer, but I would rather have my money back." },
      { de: "Ich bin mit der Qualität nicht zufrieden, weil das Gerät schon zweimal kaputt war.", en: "I am not happy with the quality, because the appliance has already been broken twice." },
      { de: "Sehr geehrte Damen und Herren, ich würde mich freuen, wenn Sie mir das Geld zurückzahlen könnten.", en: "Dear Sir or Madam, I would be grateful if you could refund the money." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "At the customer service desk of an electronics shop: the coffee machine you bought last week is already broken. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Tag. Was kann ich für Sie tun?", you: false },
      { speaker: "B", de: "Guten Tag. Ich habe diese Kaffeemaschine letzte Woche hier gekauft. Leider ist sie schon kaputt.", you: true },
      { speaker: "A", de: "Oh, das tut mir leid. Haben Sie den Kassenbon dabei?", you: false },
      { speaker: "B", de: "Ja, hier ist der Kassenbon. Könnten Sie die Maschine bitte umtauschen?", you: true },
      { speaker: "A", de: "Leider haben wir dieses Modell im Moment nicht da.", you: false },
      { speaker: "B", de: "Würden Sie bitte nachsehen, ob Sie noch eine Maschine im Lager haben?", you: true },
      { speaker: "A", de: "Ich habe schon nachgesehen, leider nicht. Wir können Ihnen aber einen Gutschein geben.", you: false },
      { speaker: "B", de: "Vielen Dank, aber ich hätte lieber mein Geld zurück.", you: true },
      { speaker: "A", de: "Natürlich, kein Problem. Würden Sie hier bitte unterschreiben?", you: false },
      { speaker: "B", de: "Ja, gern. Vielen Dank für Ihre Hilfe.", you: true }
    ] }
  ]
},

{
  id: "s2-25",
  season: "s2",
  n: 25,
  title: "Season 2 review",
  minutes: 15,
  audio: "audio/s2-25.mp3",
  intro: "The test for Season Two: a short story in the past, then a quick check of every big point of the season, from the Perfekt to weil, wenn, obwohl, um zu and the polite forms with könnten and hätte. Try to say each sentence before you hear it. If one feels hard, replay its track before you start Season Three, because the exam tasks there are built on all of them.",
  sections: [
    { type: "text", heading: "A weekend in Cologne", intro: "A short story in the past. Listen first, then tell it again in your own words.", lines: [
      "Letztes Wochenende sind wir mit dem Zug nach Köln gefahren.",
      "Wir wollten unseren Freund Mehmet besuchen. Er ist im Sommer nach Köln gezogen.",
      "Als wir ankamen, hat es stark geregnet.",
      "Obwohl das Wetter schlecht war, sind wir in die Altstadt gegangen.",
      "Es gab viele Touristen, aber der Dom war wunderschön.",
      "Am Abend haben wir bei Mehmet gekocht. Seine Wohnung ist viel größer als unsere.",
      "Am Sonntag mussten wir leider früh zurückfahren, weil die Kinder am Montag Schule hatten.",
      "Wenn wir das nächste Mal mehr Zeit haben, bleiben wir länger."
    ] },
    { type: "phrases", heading: "Test yourself", rows: [
      { de: "Am Wochenende habe ich mit den Kindern einen Kuchen gebacken.", en: "At the weekend I baked a cake with the children.", note: "Perfekt with haben: the participle goes to the end." },
      { de: "Ich wollte länger bleiben, aber ich musste am Montag arbeiten.", en: "I wanted to stay longer, but I had to work on Monday.", note: "Modal verbs in the past: wollte, musste, konnte." },
      { de: "Ich bin zu spät gekommen, weil ich den Bus verpasst habe.", en: "I was late, because I missed the bus.", note: "kommen takes sein. After weil, habe goes to the very end." },
      { de: "Mein Kollege hat gesagt, dass er heute nicht kommen kann.", en: "My colleague said that he cannot come today.", note: "After dass, the modal verb goes last: kommen kann." },
      { de: "Wenn es morgen regnet, nehme ich die Straßenbahn.", en: "If it rains tomorrow, I will take the tram.", note: "After the wenn part, the next part starts with its verb: nehme ich." },
      { de: "Können Sie mir sagen, wann der nächste Zug nach Köln abfährt?", en: "Can you tell me when the next train to Cologne leaves?", note: "In an indirect question the verb goes to the end, and a split verb joins up again: abfährt." },
      { de: "Weißt du, ob Lena am Samstag auch kommt?", en: "Do you know whether Lena is coming on Saturday too?", note: "ob means whether, for yes or no questions. The verb goes to the end: kommt." },
      { de: "Obwohl ich müde war, bin ich ins Fitnessstudio gegangen.", en: "Although I was tired, I went to the gym.", note: "obwohl sends the verb to the end, and the next part starts with its verb: bin ich." },
      { de: "Ich stehe früher auf, um vor der Arbeit Deutsch zu lernen.", en: "I get up earlier in order to study German before work.", note: "um and zu with the verb at the end, when it is the same person in both parts." },
      { de: "Ich spreche langsam, damit du mich verstehst.", en: "I am speaking slowly so that you understand me.", note: "damit means so that. You need it when the two parts have different people." },
      { de: "Als ich ein Kind war, habe ich viel Fußball gespielt.", en: "When I was a child, I played a lot of football.", note: "als for one time or one period in the past, wenn for things that happened again and again." },
      { de: "Seit gestern tut mir der Hals weh.", en: "My throat has been hurting since yesterday.", note: "Dative: mir tut der Hals weh, literally the throat hurts to me." },
      { de: "Könnten wir den Termin auf Donnerstag verschieben?", en: "Could we move the appointment to Thursday?", note: "verschieben means to move to another time. absagen means to cancel." },
      { de: "Stell die Getränke bitte in den Kühlschrank.", en: "Please put the drinks in the fridge.", note: "Where to takes the accusative: in den Kühlschrank. Where takes the dative: Die Getränke stehen im Kühlschrank." },
      { de: "Ich fahre lieber mit dem Roller als mit dem Auto.", en: "I prefer riding the scooter to driving the car.", note: "lieber als: to prefer one thing to another." },
      { de: "Könnten Sie das bitte wiederholen?", en: "Could you repeat that, please?", note: "The most useful polite request in the exam. Use it whenever you did not understand." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Wenn ich morgen Zeit habe, rufe ich Sie an, um einen Termin zu vereinbaren.", en: "If I have time tomorrow, I will call you to arrange an appointment." },
      { de: "Obwohl die Wohnung teurer ist, nehmen wir sie, weil sie näher an meinem Arbeitsplatz liegt.", en: "Although the flat is more expensive, we will take it, because it is closer to where I work." },
      { de: "Als ich gestern beim Arzt war, musste ich eine Stunde warten.", en: "When I was at the doctor’s yesterday, I had to wait for an hour." },
      { de: "Könnten Sie mir bitte sagen, ob ich die Hose umtauschen kann?", en: "Could you please tell me whether I can exchange the trousers?" },
      { de: "Ich habe das Bild über das Sofa gehängt, damit man es gut sehen kann.", en: "I hung the picture above the sofa so that you can see it well." },
      { de: "Mein Arzt hat gesagt, dass ich mehr schlafen sollte.", en: "My doctor said that I should sleep more." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "In the courtyard: your neighbour Herr Krause asks about your trip to Cologne and invites you to a barbecue, and you ask him a favour. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Abend! Na, wie war es in Köln?", you: false },
      { speaker: "B", de: "Sehr schön, danke. Wir haben unseren Freund Mehmet besucht.", you: true },
      { speaker: "A", de: "Und das Wetter? Hier hat es ja das ganze Wochenende geregnet.", you: false },
      { speaker: "B", de: "In Köln auch. Obwohl das Wetter schlecht war, haben wir den Dom besichtigt.", you: true },
      { speaker: "A", de: "Schön. Übrigens, nächsten Samstag grillen wir im Hof. Kommen Sie auch?", you: false },
      { speaker: "B", de: "Ich weiß noch nicht, ob ich Zeit habe. Wenn ich nicht arbeiten muss, komme ich gern.", you: true },
      { speaker: "A", de: "Sagen Sie mir einfach bis Freitag Bescheid.", you: false },
      { speaker: "B", de: "Das mache ich. Ich hätte noch eine Bitte. Könnten Sie am Mittwoch ein Paket für uns annehmen?", you: true },
      { speaker: "A", de: "Ja, natürlich. Ich bin den ganzen Tag zu Hause.", you: false },
      { speaker: "B", de: "Vielen Dank, das ist sehr nett von Ihnen.", you: true }
    ] }
  ]
},

{
  id: "s3-26",
  season: "s3",
  n: 26,
  title: "Planning together I: suggesting",
  minutes: 13,
  audio: "audio/s3-26.mp3",
  intro: "Speaking part one is planning something with your partner, and the examiners listen for your suggestions and your questions. This track gives you six ways to suggest, from Wollen wir to Wir könnten, plus the questions that ask your partner for ideas and a time. The topic is a classic exam task: a surprise for a colleague’s birthday.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Unsere Kollegin Petra hat nächsten Freitag Geburtstag.", en: "Our colleague Petra has her birthday next Friday.", note: "German says she has birthday, with no article: Sie hat Geburtstag." },
      { de: "Wollen wir ihr eine kleine Überraschung machen?", en: "Shall we plan a little surprise for her?", note: "Wollen wir is the friendly way to suggest something. The second verb, machen, goes to the very end." },
      { de: "Wollen wir Geld sammeln und zusammen ein Geschenk kaufen?", en: "Shall we collect money and buy a present together?", note: "In German offices everyone often puts in a few euros for a present." },
      { de: "Was schlägst du vor?", en: "What do you suggest?", note: "vorschlagen splits: schlägst near the front, vor at the end." },
      { de: "Wie wäre es mit einem Gutschein?", en: "How about a voucher?", note: "After mit, ein becomes einem and eine becomes einer. mit always takes the dative." },
      { de: "Wie wäre es mit einer kleinen Feier in der Mittagspause?", en: "How about a small party in the lunch break?", note: "" },
      { de: "Wie wäre es, wenn wir einen Kuchen bestellen?", en: "How about ordering a cake?", note: "With wenn, the verb goes to the end: bestellen." },
      { de: "Ich schlage vor, dass wir im Besprechungsraum feiern.", en: "I suggest that we celebrate in the meeting room.", note: "dass sends the verb to the end: feiern." },
      { de: "Ich schlage vor, wir feiern am Freitagmorgen.", en: "I suggest we celebrate on Friday morning.", note: "Without dass, the normal word order stays: wir feiern. Both are correct." },
      { de: "Wir könnten ihr Blumen schenken.", en: "We could give her flowers.", note: "könnten plus a verb at the end is the softest way to suggest. Examiners like to hear it." },
      { de: "Lass uns doch etwas Persönliches für sie aussuchen.", en: "Let’s choose something personal for her.", note: "Lass uns works like let’s. Use it with someone you call du." },
      { de: "Ich habe eine Idee: Petra geht doch gern ins Theater.", en: "I have an idea: Petra likes going to the theatre, you know.", note: "doch here means as you know. It reminds your partner of something you both know." },
      { de: "Was hältst du davon, wenn wir das ganze Team einladen?", en: "What do you think about inviting the whole team?", note: "Was hältst du davon asks your partner what they think of your idea." },
      { de: "Hast du am Donnerstag nach der Arbeit Zeit?", en: "Do you have time on Thursday after work?", note: "Always ask your partner questions too. The examiners want to hear them." },
      { de: "Wann passt es dir am besten?", en: "When suits you best?", note: "passen means to suit, and it takes the dative: Passt es dir? Does it suit you?" },
      { de: "Dann können wir das Geschenk zusammen besorgen.", en: "Then we can get the present together.", note: "besorgen means to go and get something. You hear it every day." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Petra hat nächsten Freitag Geburtstag. Wollen wir Geld sammeln und ihr etwas schenken?", en: "Petra has her birthday next Friday. Shall we collect money and give her something?" },
      { de: "Ich schlage vor, dass wir ihr einen Gutschein schenken. Was meinst du?", en: "I suggest that we give her a voucher. What do you think?" },
      { de: "Wie wäre es mit einer kleinen Feier im Besprechungsraum? Ich kann einen Kuchen backen.", en: "How about a small party in the meeting room? I can bake a cake." },
      { de: "Wir könnten ihr Theaterkarten schenken, weil sie so gern ins Theater geht.", en: "We could give her theatre tickets, because she likes going to the theatre so much." },
      { de: "Hast du am Donnerstag nach der Arbeit Zeit? Dann können wir die Karten zusammen besorgen.", en: "Do you have time on Thursday after work? Then we can get the tickets together." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Exam style, speaking part one: you and Daniel work together, and you plan a surprise for your colleague Petra’s birthday. Informal du, as between partners in the exam. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Petra hat nächsten Freitag Geburtstag. Wollen wir etwas für sie organisieren?", you: false },
      { speaker: "B", de: "Ja, gern. Ich schlage vor, dass wir Geld sammeln und ihr ein Geschenk kaufen.", you: true },
      { speaker: "A", de: "Das ist eine gute Idee. Aber was schenken wir ihr? Was schlägst du vor?", you: false },
      { speaker: "B", de: "Wie wäre es mit Theaterkarten? Petra geht doch so gern ins Theater.", you: true },
      { speaker: "A", de: "Super. Und wollen wir auch im Büro feiern?", you: false },
      { speaker: "B", de: "Wir könnten in der Mittagspause im Besprechungsraum feiern. Ich kann einen Kuchen backen.", you: true },
      { speaker: "A", de: "Prima. Und wann kaufen wir die Karten?", you: false },
      { speaker: "B", de: "Hast du am Donnerstag nach der Arbeit Zeit? Dann können wir sie zusammen besorgen.", you: true },
      { speaker: "A", de: "Ja, Donnerstag passt mir gut.", you: false },
      { speaker: "B", de: "Gut, dann machen wir das so. Petra freut sich bestimmt!", you: true }
    ] }
  ]
},

{
  id: "s3-27",
  season: "s3",
  n: 27,
  title: "Planning together II: agreeing and disagreeing",
  minutes: 13,
  audio: "audio/s3-27.mp3",
  intro: "In speaking part one you should not just say yes to everything: the examiners want to hear you react, agree, disagree politely and give a reason. This track gives you a strong yes, a soft no and the middle ground, always with weil or aber. The task: you and a friend plan a visit to someone in hospital.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Karim liegt seit Montag im Krankenhaus.", en: "Karim has been in hospital since Monday.", note: "im Krankenhaus liegen means to be in hospital. With seit, German uses the present tense." },
      { de: "Gute Idee!", en: "Good idea!", note: "" },
      { de: "Ja, das finde ich auch.", en: "Yes, I think so too.", note: "" },
      { de: "Da bin ich ganz deiner Meinung.", en: "I completely agree with you.", note: "A strong yes. Literally: there I am completely of your opinion." },
      { de: "Einverstanden, das klingt gut.", en: "Agreed, that sounds good.", note: "" },
      { de: "Das stimmt, aber ein Buch wäre vielleicht besser.", en: "That is true, but a book might be better.", note: "Agree first, then bring your own idea. That sounds polite, not rude." },
      { de: "Das finde ich nicht so gut, weil er noch sehr müde ist.", en: "I don’t think that is such a good idea, because he is still very tired.", note: "Never just say no. Give a reason with weil, and send the verb to the end." },
      { de: "Ich sehe das ein bisschen anders.", en: "I see that a bit differently.", note: "A soft way to disagree. Then say why." },
      { de: "Ich bin mir nicht sicher, ob das eine gute Idee ist.", en: "I am not sure whether that is a good idea.", note: "With mir it sounds more natural: ich bin mir nicht sicher. ob, whether, sends the verb to the end: ist." },
      { de: "Mittwoch geht bei mir leider nicht, weil ich bis sieben Uhr arbeite.", en: "Unfortunately Wednesday does not work for me, because I work until seven.", note: "" },
      { de: "Ich würde lieber am Samstagnachmittag hingehen.", en: "I would rather go on Saturday afternoon.", note: "lieber means rather. Ich würde lieber is the polite way to say: I have another idea." },
      { de: "Lieber nicht, das ist zu viel für ihn.", en: "Better not, that is too much for him.", note: "Lieber nicht means better not. A short and friendly no." },
      { de: "Wie findest du die Idee?", en: "What do you think of the idea?", note: "" },
      { de: "Du hast recht, daran habe ich nicht gedacht.", en: "You are right, I had not thought of that.", note: "Use it when your partner has the better idea. It sounds very natural." },
      { de: "Na gut, das ist auch in Ordnung.", en: "All right, that is fine too.", note: "Na gut means all right then. You give in, but in a friendly way." },
      { de: "Wir könnten ihm Obst und eine Zeitschrift mitbringen.", en: "We could bring him some fruit and a magazine.", note: "ihm, to him, is the dative: you bring something to someone." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Karim liegt seit Montag im Krankenhaus. Wollen wir ihn zusammen besuchen?", en: "Karim has been in hospital since Monday. Shall we visit him together?" },
      { de: "Am Freitagabend? Das finde ich nicht so gut, weil er abends oft sehr müde ist.", en: "On Friday evening? I don’t think that is such a good idea, because he is often very tired in the evening." },
      { de: "Ich würde lieber am Samstagnachmittag hingehen. Wie findest du die Idee?", en: "I would rather go on Saturday afternoon. What do you think of the idea?" },
      { de: "Das stimmt, aber Blumen hat er schon. Wir könnten ihm stattdessen ein Buch mitbringen.", en: "That is true, but he already has flowers. We could bring him a book instead." },
      { de: "Du hast recht, daran habe ich nicht gedacht. Einverstanden, das klingt gut.", en: "You are right, I had not thought of that. Agreed, that sounds good." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Exam style, speaking part one: Karim from your German course has been in hospital since Monday, and you and Julia plan a visit. She makes suggestions; you agree or disagree and always give a reason. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Karim liegt seit Montag im Krankenhaus. Wollen wir ihn am Freitagabend besuchen?", you: false },
      { speaker: "B", de: "Das finde ich nicht so gut, weil ich am Freitag bis sieben Uhr arbeite. Ich würde lieber am Samstagnachmittag hingehen.", you: true },
      { speaker: "A", de: "Gute Idee, am Samstag habe ich auch Zeit. Sollen wir ihm Blumen mitbringen?", you: false },
      { speaker: "B", de: "Ich bin mir nicht sicher, ob das eine gute Idee ist. Seine Frau hat gesagt, dass er schon viele Blumen hat. Wie wäre es mit einem Buch?", you: true },
      { speaker: "A", de: "Ja, ein Buch ist besser als Blumen. Er liest doch so gern Krimis.", you: false },
      { speaker: "B", de: "Da bin ich ganz deiner Meinung. Wir könnten ihm auch Obst mitbringen.", you: true },
      { speaker: "A", de: "Und wollen wir mit dem Auto fahren?", you: false },
      { speaker: "B", de: "Lieber nicht, weil man am Krankenhaus kaum einen Parkplatz findet. Wir könnten doch die Straßenbahn nehmen.", you: true },
      { speaker: "A", de: "Du hast recht, daran habe ich nicht gedacht. Einverstanden.", you: false },
      { speaker: "B", de: "Super. Dann treffen wir uns am Samstag um vierzehn Uhr an der Haltestelle.", you: true }
    ] }
  ]
},

{
  id: "s3-28",
  season: "s3",
  n: 28,
  title: "Planning together III: tasks and summing up",
  minutes: 13,
  audio: "audio/s3-28.mp3",
  intro: "Every planning conversation ends with two jobs: deciding who does what, and summing up the result. The examiners listen for exactly that, and many candidates forget it. This track gives you the lines for sharing out tasks and for the closing summary, in a classic task: the party at the end of your German course.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Unser Kurs ist in zwei Wochen zu Ende.", en: "Our course ends in two weeks.", note: "zu Ende sein means to be over." },
      { de: "Wir möchten eine Abschlussparty feiern.", en: "We would like to have an end-of-course party.", note: "Abschluss means the end or the finish. The Abschlussparty is the party on the last day." },
      { de: "Was müssen wir alles organisieren?", en: "What do we need to organise?", note: "alles in a question asks for the whole list." },
      { de: "Wer macht was?", en: "Who does what?", note: "The key question for sharing out the tasks." },
      { de: "Wer kümmert sich um das Essen?", en: "Who will take care of the food?", note: "sich kümmern um: to take care of. um takes the accusative: um das Essen, um den Raum, um die Musik." },
      { de: "Ich kümmere mich um die Getränke.", en: "I will take care of the drinks.", note: "ich kümmere mich, du kümmerst dich, wir kümmern uns. The whole pattern comes in the next track." },
      { de: "Kannst du dich um die Musik kümmern?", en: "Can you take care of the music?", note: "" },
      { de: "Ich übernehme die Einladungen.", en: "I will do the invitations.", note: "übernehmen means to take on a job. It does not split: ich übernehme." },
      { de: "Kannst du das übernehmen?", en: "Can you take that on?", note: "" },
      { de: "Das mache ich gern.", en: "I am happy to do that.", note: "Das comes first for emphasis, so the verb comes next: Das mache ich." },
      { de: "Soll ich Teller und Gläser mitbringen?", en: "Shall I bring plates and glasses?", note: "" },
      { de: "Wir müssen noch Frau Schneider fragen, ob wir den Kursraum benutzen dürfen.", en: "We still have to ask Ms Schneider whether we may use the classroom.", note: "After ob, whether, the verb goes to the very end: dürfen." },
      { de: "Dann machen wir es so.", en: "Then let’s do it like this.", note: "Say it when you reach a decision, then list the plan. The examiners want to hear a clear result." },
      { de: "Also, ich fasse kurz zusammen.", en: "So, let me sum up briefly.", note: "zusammenfassen splits: ich fasse kurz zusammen." },
      { de: "Haben wir noch etwas vergessen?", en: "Have we forgotten anything?", note: "" },
      { de: "Gut, dann ist alles klar.", en: "Good, then everything is clear.", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Unser Kurs ist in zwei Wochen zu Ende. Was müssen wir für die Party alles organisieren?", en: "Our course ends in two weeks. What do we need to organise for the party?" },
      { de: "Wer kümmert sich um das Essen? Ich schlage vor, jeder bringt etwas mit.", en: "Who will take care of the food? I suggest everyone brings something." },
      { de: "Ich kümmere mich um die Getränke. Kannst du die Einladungen übernehmen?", en: "I will take care of the drinks. Can you do the invitations?" },
      { de: "Dann machen wir es so: Die Party ist am Freitag um achtzehn Uhr im Kursraum.", en: "Then let’s do it like this: the party is on Friday at six in the evening in the classroom." },
      { de: "Also, ich fasse kurz zusammen: Du kümmerst dich um die Musik, und ich übernehme die Getränke.", en: "So, let me sum up briefly: you take care of the music, and I will do the drinks." },
      { de: "Haben wir noch etwas vergessen? Nein? Gut, dann ist alles klar.", en: "Have we forgotten anything? No? Good, then everything is clear." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Exam style, speaking part one: your German course ends in two weeks, and you and Elif from your class plan the party. You share out the tasks and sum up at the end. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Unser Kurs ist bald zu Ende. Wollen wir eine Abschlussparty machen?", you: false },
      { speaker: "B", de: "Ja, gern! Wie wäre es mit dem letzten Kurstag? Wir könnten im Kursraum feiern.", you: true },
      { speaker: "A", de: "Gute Idee. Aber dann müssen wir zuerst Frau Schneider fragen, ob wir den Raum benutzen dürfen.", you: false },
      { speaker: "B", de: "Das übernehme ich. Ich frage sie morgen nach dem Unterricht.", you: true },
      { speaker: "A", de: "Super. Und wer kümmert sich um das Essen?", you: false },
      { speaker: "B", de: "Ich schlage vor, jeder bringt etwas mit. Kannst du allen eine Nachricht schreiben?", you: true },
      { speaker: "A", de: "Ja, das mache ich gern. Und die Getränke?", you: false },
      { speaker: "B", de: "Um die Getränke kümmere ich mich. Kannst du dich um die Musik kümmern?", you: true },
      { speaker: "A", de: "Klar, ich bringe meinen Lautsprecher mit. Haben wir noch etwas vergessen?", you: false },
      { speaker: "B", de: "Ich glaube nicht. Also, ich fasse kurz zusammen: Ich frage Frau Schneider und kaufe die Getränke. Du schreibst allen eine Nachricht und kümmerst dich um die Musik.", you: true }
    ] }
  ]
},

{
  id: "s3-29",
  season: "s3",
  n: 29,
  title: "Reflexive verbs",
  minutes: 13,
  audio: "audio/s3-29.mp3",
  intro: "Many German verbs about feelings and daily routine need a little extra word: mich, dich, sich, uns. This track teaches the most common ones, many with a fixed preposition, like sich freuen auf and sich interessieren für. They come up in every e-mail and every conversation about your life, so they are easy points in writing and speaking.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich freue mich auf das Wochenende.", en: "I am looking forward to the weekend.", note: "sich freuen auf: to look forward to something that is still to come. auf takes the accusative." },
      { de: "Die Kinder freuen sich schon auf Weihnachten.", en: "The children are already looking forward to Christmas.", note: "For they, the little word is sich: die Kinder freuen sich." },
      { de: "Ich habe mich sehr über dein Geschenk gefreut.", en: "I was very pleased about your present.", note: "sich freuen über: to be pleased about something you already have. In the past: ich habe mich gefreut." },
      { de: "Freust du dich auf den Urlaub?", en: "Are you looking forward to the holiday?", note: "The little word changes with the person: ich freue mich, du freust dich, er freut sich." },
      { de: "Ich interessiere mich für Geschichte.", en: "I am interested in history.", note: "sich interessieren für: für takes the accusative." },
      { de: "Interessierst du dich für Fußball?", en: "Are you interested in football?", note: "" },
      { de: "Ich ärgere mich jeden Morgen über den Verkehr.", en: "Every morning I get annoyed about the traffic.", note: "sich ärgern über: to be annoyed about. über takes the accusative here." },
      { de: "Ärgere dich nicht!", en: "Don’t let it annoy you!", note: "In a command with du, the little word stays: Ärgere dich nicht!" },
      { de: "Am Wochenende kümmere ich mich um die Kinder.", en: "At the weekend I look after the children.", note: "sich kümmern um, from the last track: here it means to look after." },
      { de: "Ich muss mich beeilen, sonst komme ich zu spät.", en: "I have to hurry, otherwise I will be late.", note: "With muss, mich stays near the front and beeilen goes to the end." },
      { de: "Beeil dich, der Bus kommt gleich!", en: "Hurry up, the bus is about to come!", note: "" },
      { de: "Wir treffen uns um halb acht vor dem Kino.", en: "We are meeting at half past seven outside the cinema.", note: "For we, the little word is uns: wir treffen uns." },
      { de: "Ich fühle mich heute nicht so gut.", en: "I don’t feel so well today.", note: "" },
      { de: "Am Abend ruhe ich mich ein bisschen aus.", en: "In the evening I rest a little.", note: "sich ausruhen splits: ich ruhe mich aus." },
      { de: "Ich mache mir Sorgen um meine Mutter.", en: "I am worried about my mother.", note: "Here it is mir, not mich, because Sorgen is already the object." },
      { de: "Ich habe mich erkältet.", en: "I have caught a cold.", note: "In the past, reflexive verbs take haben: ich habe mich erkältet." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich freue mich schon auf das Wochenende, weil wir Freunde in Mainz besuchen.", en: "I am already looking forward to the weekend, because we are visiting friends in Mainz." },
      { de: "Vielen Dank für deine E-Mail. Ich habe mich sehr über deine Einladung gefreut.", en: "Thank you very much for your e-mail. I was very pleased about your invitation." },
      { de: "Ich interessiere mich für Geschichte, deshalb gehe ich gern ins Museum.", en: "I am interested in history, that is why I like going to museums." },
      { de: "Ich ärgere mich jeden Morgen über den Verkehr, aber mit dem Roller bin ich schneller.", en: "Every morning I get annoyed about the traffic, but on the scooter I am faster." },
      { de: "Am Wochenende kümmere ich mich um die Kinder, und am Abend ruhe ich mich aus.", en: "At the weekend I look after the children, and in the evening I rest." },
      { de: "Ich muss mich beeilen, weil ich mich um halb acht mit Lukas treffe.", en: "I have to hurry, because I am meeting Lukas at half past seven." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Friday evening, on the phone with your friend Katrin: how your week was, and what you are looking forward to. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Hallo! Na, wie war deine Woche?", you: false },
      { speaker: "B", de: "Ehrlich gesagt ein bisschen stressig. Ich habe mich jeden Tag über den Verkehr geärgert.", you: true },
      { speaker: "A", de: "Ärgere dich nicht, jetzt ist Wochenende! Freust du dich auf die freien Tage?", you: false },
      { speaker: "B", de: "Ja, sehr. Am Samstag kümmere ich mich um die Kinder, und am Abend ruhe ich mich aus.", you: true },
      { speaker: "A", de: "Am Sonntag gehe ich ins Museum. Es gibt eine Ausstellung über das alte Ägypten. Interessierst du dich für Geschichte?", you: false },
      { speaker: "B", de: "Ja, ich interessiere mich sehr für Geschichte. Kann ich mitkommen?", you: true },
      { speaker: "A", de: "Klar, gern! Treffen wir uns um elf Uhr vor dem Museum?", you: false },
      { speaker: "B", de: "Einverstanden. Ich freue mich schon darauf. Bis Sonntag!", you: true }
    ] }
  ]
},

{
  id: "s3-30",
  season: "s3",
  n: 30,
  title: "Verbs with prepositions",
  minutes: 14,
  audio: "audio/s3-30.mp3",
  intro: "Many German verbs come with a fixed preposition: warten auf, denken an, träumen von. You learn them as a pair, and this track also shows how to ask about them with worauf and woran, and how to give a short answer with darauf and daran. These pairs are everywhere in the reading and listening texts, and using them yourself sounds natural.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich warte auf den Bus.", en: "I am waiting for the bus.", note: "warten auf: to wait for. Learn the verb and the preposition as one pair. Here auf takes the accusative: auf den Bus." },
      { de: "Worauf wartest du?", en: "What are you waiting for?", note: "To ask about a thing, put wo in front of the preposition: worauf. An r goes in when the preposition starts with a vowel." },
      { de: "Auf wen wartest du?", en: "Who are you waiting for?", note: "For a person, keep the preposition and add wen: auf wen? Wo plus preposition is only for things." },
      { de: "Wartest du noch auf eine Antwort? Ja, ich warte noch darauf.", en: "Are you still waiting for an answer? Yes, I am still waiting for it.", note: "For a short answer about a thing, put da in front of the preposition: darauf replaces auf eine Antwort." },
      { de: "Ich denke oft an meine Familie in Ungarn.", en: "I often think of my family in Hungary.", note: "denken an: to think of. an takes the accusative: an meine Familie." },
      { de: "Woran denkst du gerade?", en: "What are you thinking about right now?", note: "" },
      { de: "Denk bitte an den Termin morgen!", en: "Please remember the appointment tomorrow!", note: "denken an also means to remember, to not forget." },
      { de: "Keine Sorge, ich denke daran.", en: "Don’t worry, I will remember.", note: "daran works the same way: it replaces an den Termin. Again an r goes in before a vowel." },
      { de: "Wir haben lange über das Thema gesprochen.", en: "We talked about the topic for a long time.", note: "sprechen über: to talk about. über takes the accusative." },
      { de: "Worüber habt ihr gesprochen?", en: "What did you talk about?", note: "" },
      { de: "Darüber möchte ich nicht sprechen.", en: "I would rather not talk about that.", note: "darüber replaces über das Thema. Starting with it puts the focus on the topic." },
      { de: "Ich träume von einem Haus mit Garten.", en: "I dream of a house with a garden.", note: "träumen von: von always takes the dative: von einem Haus." },
      { de: "Wovon träumst du?", en: "What do you dream of?", note: "" },
      { de: "Ich habe ein bisschen Angst vor der Prüfung.", en: "I am a little afraid of the exam.", note: "Angst haben vor: to be afraid of. vor takes the dative here: vor der Prüfung, vor dem Hund." },
      { de: "Davor musst du keine Angst haben.", en: "You don’t need to be afraid of that.", note: "davor replaces vor der Prüfung." },
      { de: "Erinnerst du dich an unsere erste Deutschstunde?", en: "Do you remember our first German lesson?", note: "sich erinnern an: a reflexive verb with a preposition, like the ones in the last track." }
    ] },
    { type: "list", heading: "Verb, question, short answer", items: [
      "warten auf, worauf, darauf",
      "denken an, woran, daran",
      "sprechen über, worüber, darüber",
      "träumen von, wovon, davon",
      "Angst haben vor, wovor, davor",
      "sich freuen auf, worauf, darauf",
      "sich erinnern an, woran, daran"
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich warte schon seit zwanzig Minuten auf dich. Wo bist du denn?", en: "I have been waiting for you for twenty minutes. Where are you?" },
      { de: "Woran denkst du? An die Prüfung? Davor musst du keine Angst haben.", en: "What are you thinking about? The exam? You don’t need to be afraid of it." },
      { de: "Ich denke oft an meine Familie in Ungarn und telefoniere jeden Sonntag mit meiner Mutter.", en: "I often think of my family in Hungary and phone my mother every Sunday." },
      { de: "Wir haben gestern lange über unsere Pläne für den Sommer gesprochen.", en: "Yesterday we talked for a long time about our plans for the summer." },
      { de: "Ich träume von einem Haus mit Garten, aber in Frankfurt ist das sehr teuer.", en: "I dream of a house with a garden, but in Frankfurt that is very expensive." },
      { de: "Meine Tochter hat Angst vor Hunden, aber sie träumt trotzdem von einer Katze.", en: "My daughter is afraid of dogs, but she still dreams of having a cat." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "In a café: your friend Paul arrives late, and you talk about the exam and your dreams. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Entschuldige, die Straßenbahn hatte Verspätung. Wartest du schon lange auf mich?", you: false },
      { speaker: "B", de: "Nein, nur zehn Minuten, kein Problem. Aber du bist so still heute. Woran denkst du?", you: true },
      { speaker: "A", de: "An die Prüfung im Februar. Ich habe ein bisschen Angst davor.", you: false },
      { speaker: "B", de: "Davor musst du keine Angst haben. Du lernst doch jeden Tag.", you: true },
      { speaker: "A", de: "Das stimmt. Und du? Wovon träumst du, wenn die Prüfung vorbei ist?", you: false },
      { speaker: "B", de: "Ich träume von einer Reise mit der ganzen Familie. Darüber haben wir gestern lange gesprochen.", you: true },
      { speaker: "A", de: "Schön! Übrigens, denk bitte an unser Treffen am Freitag.", you: false },
      { speaker: "B", de: "Keine Sorge, ich denke daran. Es steht schon in meinem Kalender.", you: true }
    ] }
  ]
},

{
  id: "s3-31",
  season: "s3",
  n: 31,
  title: "The presentation I: the topic and your experience",
  minutes: 14,
  audio: "audio/s3-31.mp3",
  intro: "Speaking part two is a presentation on five slides, and the first two always ask the same things: introduce your topic and say how your talk is structured, then talk about your own experience. This track builds both slides for the topic mobile phones for children, with the Perfekt for what happened and the verb in second place after zuerst, dann and danach. A clear structure and a real example from your own life count towards both the task mark and the coherence mark.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich möchte heute über das Thema Handys für Kinder sprechen.", en: "Today I would like to talk about the topic mobile phones for children.", note: "You know this line from track ten. Only the topic changes." },
      { de: "Meine Präsentation besteht aus fünf Teilen.", en: "My presentation has five parts.", note: "aus always takes the dative, and nouns in the dative plural add an n: aus fünf Teilen." },
      { de: "Zuerst erzähle ich von meinen eigenen Erfahrungen.", en: "First I will tell you about my own experiences.", note: "After zuerst, dann and danach the verb comes straight away, in second place." },
      { de: "Dann spreche ich über die Situation in meinem Heimatland.", en: "Then I will talk about the situation in my home country.", note: "" },
      { de: "Danach nenne ich Vorteile und Nachteile und sage meine Meinung.", en: "After that I will name advantages and disadvantages and give my opinion.", note: "" },
      { de: "Zum Schluss fasse ich alles kurz zusammen.", en: "At the end I will briefly sum everything up.", note: "zusammenfassen splits: fasse near the front, zusammen at the very end." },
      { de: "Ich komme jetzt zu meinen persönlichen Erfahrungen.", en: "Now I come to my personal experiences.", note: "Ich komme jetzt zu moves you on to the next slide. Use it every time." },
      { de: "Das Thema ist für mich wichtig, weil ich selbst zwei Kinder habe.", en: "The topic is important to me because I have two children myself.", note: "A strong first line for slide two: say why the topic matters to you. weil sends habe to the end." },
      { de: "Ich habe damit folgende Erfahrungen gemacht.", en: "I have had the following experiences with it.", note: "Erfahrungen machen means to have experiences. damit means with it, with this topic." },
      { de: "Als ich ein Kind war, hatte ich kein Handy.", en: "When I was a child, I did not have a mobile phone.", note: "From season two: als for one time or one period in the past, and hatte, the past of haben." },
      { de: "Meine Tochter hat letztes Jahr ihr erstes Handy bekommen.", en: "My daughter got her first mobile phone last year.", note: "bekommen means to get, not to become. Its participle has no ge: bekommen." },
      { de: "Am Anfang war sie jeden Abend stundenlang online.", en: "At first she was online for hours every evening.", note: "" },
      { de: "Deshalb haben wir zusammen klare Regeln vereinbart.", en: "So we agreed on clear rules together.", note: "Verbs that start with ver, be or er take no ge in the Perfekt: vereinbart." },
      { de: "Beim Essen liegt das Handy nicht auf dem Tisch.", en: "During meals the phone is not on the table.", note: "liegen with auf and the dative, as in track twenty-one: auf dem Tisch." },
      { de: "Ich habe gemerkt, dass sie jetzt besser schläft.", en: "I have noticed that she sleeps better now.", note: "dass sends the verb to the end: besser schläft." },
      { de: "Ich habe gute und schlechte Erfahrungen gemacht.", en: "I have had good and bad experiences.", note: "A simple way to finish slide two." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich möchte heute über das Thema Handys für Kinder sprechen. Meine Präsentation besteht aus fünf Teilen.", en: "Today I would like to talk about the topic mobile phones for children. My presentation has five parts." },
      { de: "Zuerst erzähle ich von meinen Erfahrungen, dann spreche ich über die Situation in meinem Heimatland.", en: "First I will tell you about my experiences, then I will talk about the situation in my home country." },
      { de: "Als ich ein Kind war, hatte ich kein Handy. Wir haben jeden Nachmittag draußen gespielt.", en: "When I was a child, I did not have a mobile phone. We played outside every afternoon." },
      { de: "Meine Tochter hat letztes Jahr ihr erstes Handy bekommen, und am Anfang war sie jeden Abend online.", en: "My daughter got her first phone last year, and at first she was online every evening." },
      { de: "Deshalb haben wir klare Regeln vereinbart: Beim Essen liegt das Handy nicht auf dem Tisch.", en: "So we agreed on clear rules: during meals the phone is not on the table." },
      { de: "Ich habe gemerkt, dass meine Tochter jetzt besser schläft und mehr liest.", en: "I have noticed that my daughter sleeps better now and reads more." }
    ] },
    { type: "text", heading: "Slides one and two", intro: "The first two slides as you would say them in the exam: the topic, the structure, then your own experience.", lines: [
      "Ich möchte heute über das Thema Handys für Kinder sprechen. Meine Präsentation besteht aus fünf Teilen.",
      "Zuerst erzähle ich von meinen eigenen Erfahrungen. Dann spreche ich über die Situation in meinem Heimatland.",
      "Danach nenne ich Vorteile und Nachteile und sage meine Meinung. Zum Schluss fasse ich alles kurz zusammen.",
      "Ich komme jetzt zu meinen persönlichen Erfahrungen. Das Thema ist für mich wichtig, weil ich selbst zwei Kinder habe.",
      "Als ich ein Kind war, hatte ich kein Handy. Meine Tochter hat letztes Jahr ihr erstes Handy bekommen.",
      "Am Anfang war sie jeden Abend stundenlang online. Deshalb haben wir zusammen klare Regeln vereinbart.",
      "Beim Essen liegt das Handy nicht auf dem Tisch. Ich habe gemerkt, dass sie jetzt besser schläft.",
      "Ich habe also gute und schlechte Erfahrungen gemacht."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "In your exam preparation course, the teacher, Frau Schulz, asks you to practise the first two slides and asks you a few questions along the way. Formal Sie. You are B.", partner: "f", lines: [
      { speaker: "A", de: "So, János, jetzt sind Sie dran. Bitte stellen Sie Ihr Thema vor.", you: false },
      { speaker: "B", de: "Gern. Ich möchte heute über das Thema Handys für Kinder sprechen. Meine Präsentation besteht aus fünf Teilen.", you: true },
      { speaker: "A", de: "Sehr gut. Und wie ist Ihre Präsentation aufgebaut?", you: false },
      { speaker: "B", de: "Zuerst erzähle ich von meinen eigenen Erfahrungen, dann spreche ich über die Situation in meinem Heimatland. Danach nenne ich Vorteile und Nachteile und sage meine Meinung.", you: true },
      { speaker: "A", de: "Prima. Dann kommen Sie jetzt bitte zur zweiten Folie.", you: false },
      { speaker: "B", de: "Ich komme jetzt zu meinen persönlichen Erfahrungen. Das Thema ist für mich wichtig, weil ich selbst zwei Kinder habe.", you: true },
      { speaker: "A", de: "Haben Ihre Kinder denn schon ein Handy?", you: false },
      { speaker: "B", de: "Meine Tochter hat letztes Jahr ihr erstes Handy bekommen. Am Anfang war sie jeden Abend stundenlang online.", you: true },
      { speaker: "A", de: "Und was haben Sie dann gemacht?", you: false },
      { speaker: "B", de: "Wir haben zusammen klare Regeln vereinbart. Beim Essen liegt das Handy nicht auf dem Tisch, und ich habe gemerkt, dass sie jetzt besser schläft.", you: true }
    ] }
  ]
},

{
  id: "s3-32",
  season: "s3",
  n: 32,
  title: "The presentation II: the situation in your country",
  minutes: 14,
  audio: "audio/s3-32.mp3",
  intro: "Slide three of the presentation asks how things are in your home country, with examples. This track gives you the frames In meinem Heimatland ist es so, dass and Bei uns in Ungarn, plus man, die meisten and immer mehr for general statements, all on the topic fast food and healthy eating. Comparing your country with Germany shows the examiners that you can do more than list facts.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich komme jetzt zur Situation in meinem Heimatland.", en: "Now I come to the situation in my home country.", note: "zur is zu plus der in one word. This line opens slide three." },
      { de: "In meinem Heimatland ist es so, dass viele Leute sehr gern Fleisch essen.", en: "In my home country, many people really like eating meat.", note: "The frame for slide three. After dass, the verb goes to the end: essen." },
      { de: "Bei uns in Ungarn isst man mittags meistens warm.", en: "In Hungary we usually eat a hot meal at lunchtime.", note: "man means people in general. It takes the same verb form as er: man isst." },
      { de: "Die meisten Familien kochen am Wochenende zu Hause.", en: "Most families cook at home at the weekend.", note: "die meisten means most. Unlike English, German needs the article: die meisten Familien." },
      { de: "Fast Food ist bei uns auch sehr beliebt.", en: "Fast food is very popular in my country too.", note: "bei uns means in my country, or at our place. beliebt means popular." },
      { de: "Vor allem junge Leute essen oft unterwegs.", en: "Young people in particular often eat on the go.", note: "" },
      { de: "Immer mehr Menschen bestellen ihr Essen im Internet.", en: "More and more people order their food online.", note: "immer mehr means more and more." },
      { de: "Typisch für Ungarn ist Lángos, ein frittiertes Brot mit Käse.", en: "Typical of Hungary is lángos, a fried bread with cheese.", note: "Typisch für is a good start: what is typical for your country?" },
      { de: "In Deutschland ist das ein bisschen anders.", en: "In Germany it is a bit different.", note: "anders means different. Comparing two countries is what slide three is really about." },
      { de: "Hier essen viele Leute mittags in der Kantine.", en: "Here many people eat in the canteen at lunchtime.", note: "" },
      { de: "In Frankfurt gibt es an jeder Ecke einen Dönerladen.", en: "In Frankfurt there is a kebab shop on every corner.", note: "es gibt takes the accusative: einen Dönerladen." },
      { de: "Im Vergleich zu Ungarn gibt es hier mehr vegetarisches Essen.", en: "Compared with Hungary, there is more vegetarian food here.", note: "im Vergleich zu, compared with, takes the dative: im Vergleich zu meinem Heimatland." },
      { de: "Früher hat man bei uns mehr zu Hause gekocht als heute.", en: "In my country people used to cook at home more than they do today.", note: "Comparisons use als: mehr als, weniger als." },
      { de: "Viele Menschen haben einfach keine Zeit zum Kochen.", en: "Many people simply have no time for cooking.", note: "zum plus a verb with a capital letter: zum Kochen, zum Essen." },
      { de: "Gesunde Ernährung wird bei uns immer wichtiger.", en: "Healthy eating is becoming more and more important in my country.", note: "immer with a comparative means more and more: immer wichtiger, immer teurer." },
      { de: "Ich glaube, das ist in vielen Ländern ähnlich.", en: "I think it is similar in many countries.", note: "ähnlich means similar. A good last line for slide three." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich komme jetzt zur Situation in meinem Heimatland. Bei uns in Ungarn isst man mittags meistens warm.", en: "Now I come to the situation in my home country. In Hungary we usually eat a hot meal at lunchtime." },
      { de: "In meinem Heimatland ist es so, dass die meisten Familien am Wochenende zu Hause kochen.", en: "In my home country, most families cook at home at the weekend." },
      { de: "Fast Food ist bei uns auch sehr beliebt, vor allem bei jungen Leuten.", en: "Fast food is very popular in my country too, especially with young people." },
      { de: "Früher hat man mehr zu Hause gekocht, aber heute bestellen immer mehr Menschen ihr Essen im Internet.", en: "In the past people cooked at home more, but today more and more people order their food online." },
      { de: "In Deutschland ist das ein bisschen anders, weil viele Leute mittags in der Kantine essen.", en: "In Germany it is a bit different, because many people eat in the canteen at lunchtime." },
      { de: "Im Vergleich zu Ungarn gibt es hier mehr vegetarisches Essen, und gesunde Ernährung wird immer wichtiger.", en: "Compared with Hungary, there is more vegetarian food here, and healthy eating is becoming more and more important." }
    ] },
    { type: "text", heading: "Slide three", intro: "Slide three as you would say it in the exam: how people eat in Hungary, what has changed, and how Germany compares.", lines: [
      "Ich komme jetzt zur Situation in meinem Heimatland.",
      "In meinem Heimatland ist es so, dass man mittags meistens warm isst.",
      "Die meisten Familien kochen am Wochenende zu Hause, zum Beispiel Gulaschsuppe oder Hühnersuppe.",
      "Trotzdem ist Fast Food auch bei uns sehr beliebt, vor allem bei jungen Leuten.",
      "Typisch für Ungarn ist Lángos, ein frittiertes Brot mit Käse.",
      "Früher hat man mehr zu Hause gekocht, aber heute haben viele Menschen keine Zeit zum Kochen.",
      "In Deutschland ist das ein bisschen anders. Hier essen viele Leute mittags in der Kantine.",
      "Aber in beiden Ländern wird gesunde Ernährung immer wichtiger. Ich glaube, das ist in vielen Ländern ähnlich."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Lunch in the canteen: your colleague and friend Katrin asks how people eat in Hungary. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Sag mal, wie isst man eigentlich in Ungarn?", you: false },
      { speaker: "B", de: "Bei uns in Ungarn isst man mittags meistens warm. Die meisten Familien kochen am Wochenende zu Hause.", you: true },
      { speaker: "A", de: "Und Fast Food? Ist das bei euch auch so beliebt wie hier?", you: false },
      { speaker: "B", de: "Ja, vor allem bei jungen Leuten. Typisch für Ungarn ist Lángos, ein frittiertes Brot mit Käse.", you: true },
      { speaker: "A", de: "Lecker! Und was ist in Deutschland anders?", you: false },
      { speaker: "B", de: "Hier essen viele Leute mittags in der Kantine, so wie wir. Außerdem gibt es mehr vegetarisches Essen.", you: true },
      { speaker: "A", de: "Kochst du selbst noch oft?", you: false },
      { speaker: "B", de: "Leider nicht so oft wie früher, weil ich wenig Zeit habe. Aber am Sonntag koche ich immer.", you: true },
      { speaker: "A", de: "Dann musst du mich mal zum Gulasch einladen!", you: false },
      { speaker: "B", de: "Gern! Wie wäre es mit nächstem Sonntag?", you: true }
    ] }
  ]
},

{
  id: "s3-33",
  season: "s3",
  n: 33,
  title: "The presentation III: pros, cons, opinion, ending",
  minutes: 14,
  audio: "audio/s3-33.mp3",
  intro: "Slides four and five finish the presentation: advantages and disadvantages, your own opinion, and a clean ending. This track builds them on the topic working from home, with dass and the verb at the end, and the verb in second place after openers like Meiner Meinung nach. A clear opinion and a polite last sentence are among the easiest points in speaking part two.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich komme jetzt zu den Vorteilen und Nachteilen.", en: "Now I come to the advantages and disadvantages.", note: "zu takes the dative, so the plural gets an extra n: den Vorteilen." },
      { de: "Ein großer Vorteil ist, dass man keinen langen Arbeitsweg hat.", en: "A big advantage is that you do not have a long commute.", note: "You know this frame from track nine. After dass, the verb goes last: hat." },
      { de: "Ein weiterer Vorteil ist, dass man flexibler arbeiten kann.", en: "Another advantage is that you can work more flexibly.", note: "With two verbs after dass, the modal verb goes last: arbeiten kann." },
      { de: "Man kann Familie und Beruf besser verbinden.", en: "You can combine family and work better.", note: "" },
      { de: "Ein Nachteil ist aber, dass man oft allein ist.", en: "A disadvantage, though, is that you are often alone.", note: "" },
      { de: "Man hat weniger Kontakt zu den Kollegen.", en: "You have less contact with your colleagues.", note: "Kontakt zu, with the dative: zu den Kollegen." },
      { de: "Zu Hause kann man sich nicht immer gut konzentrieren.", en: "At home you cannot always concentrate well.", note: "sich konzentrieren is reflexive: ich konzentriere mich, man konzentriert sich." },
      { de: "Außerdem ist die Grenze zwischen Arbeit und Freizeit nicht so klar.", en: "Besides, the line between work and free time is not so clear.", note: "After außerdem the verb comes next: ist." },
      { de: "Meiner Meinung nach ist eine Mischung am besten.", en: "In my opinion a mix is best.", note: "After Meiner Meinung nach the verb comes straight away: ist." },
      { de: "Ich bin der Meinung, dass man nicht jeden Tag zu Hause arbeiten sollte.", en: "I believe that you should not work from home every day.", note: "Ich bin der Meinung, dass is a more formal way of saying ich finde, dass." },
      { de: "Ich persönlich mache gern zwei Tage pro Woche Homeoffice.", en: "Personally, I like working from home two days a week.", note: "Germans say Homeoffice machen, or im Homeoffice arbeiten." },
      { de: "Zum Schluss möchte ich das Wichtigste kurz zusammenfassen.", en: "Finally, I would like to briefly sum up the main points.", note: "This line opens slide five. After möchte, zusammenfassen stays in one piece at the end. Then give one sentence that sums up your talk." },
      { de: "Homeoffice hat viele Vorteile, aber auch einige Nachteile.", en: "Working from home has many advantages, but also some disadvantages.", note: "" },
      { de: "Damit bin ich am Ende meiner Präsentation.", en: "That brings me to the end of my presentation.", note: "Damit stands at the front, so the verb bin comes next." },
      { de: "Vielen Dank für Ihre Aufmerksamkeit.", en: "Thank you for your attention.", note: "Ihre, the formal your, because you are thanking the examiners." },
      { de: "Ich freue mich auf Ihre Fragen.", en: "I look forward to your questions.", note: "sich freuen auf, as in the last line of an e-mail: Ich freue mich auf deine Antwort." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ein großer Vorteil ist, dass man keinen langen Arbeitsweg hat. So spart man viel Zeit.", en: "A big advantage is that you do not have a long commute. That way you save a lot of time." },
      { de: "Ein weiterer Vorteil ist, dass man Familie und Beruf besser verbinden kann.", en: "Another advantage is that you can combine family and work better." },
      { de: "Ein Nachteil ist aber, dass man oft allein ist und weniger Kontakt zu den Kollegen hat.", en: "A disadvantage, though, is that you are often alone and have less contact with your colleagues." },
      { de: "Einerseits ist Homeoffice sehr praktisch, andererseits kann man sich zu Hause nicht immer gut konzentrieren.", en: "On the one hand working from home is very practical, on the other hand you cannot always concentrate well at home." },
      { de: "Meiner Meinung nach ist eine Mischung am besten, deshalb mache ich zwei Tage pro Woche Homeoffice.", en: "In my opinion a mix is best, so I work from home two days a week." },
      { de: "Damit bin ich am Ende meiner Präsentation. Vielen Dank für Ihre Aufmerksamkeit. Ich freue mich auf Ihre Fragen.", en: "That brings me to the end of my presentation. Thank you for your attention. I look forward to your questions." }
    ] },
    { type: "text", heading: "Slides four and five", intro: "The last two slides as you would say them in the exam: advantages, disadvantages, your opinion, the summary and the thanks.", lines: [
      "Ich komme jetzt zu den Vorteilen und Nachteilen.",
      "Ein großer Vorteil ist, dass man keinen langen Arbeitsweg hat. So spart man viel Zeit.",
      "Ein weiterer Vorteil ist, dass man Familie und Beruf besser verbinden kann.",
      "Ein Nachteil ist aber, dass man oft allein ist und weniger Kontakt zu den Kollegen hat.",
      "Außerdem ist die Grenze zwischen Arbeit und Freizeit nicht so klar.",
      "Meiner Meinung nach ist eine Mischung am besten. Ich persönlich mache gern zwei Tage pro Woche Homeoffice.",
      "Zum Schluss möchte ich das Wichtigste kurz zusammenfassen: Homeoffice hat viele Vorteile, aber auch einige Nachteile.",
      "Damit bin ich am Ende meiner Präsentation. Vielen Dank für Ihre Aufmerksamkeit. Ich freue mich auf Ihre Fragen."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Your friend Sebastian now works from home every day and asks what you think about it. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Ich arbeite jetzt jeden Tag im Homeoffice. Wie findest du das?", you: false },
      { speaker: "B", de: "Ein großer Vorteil ist, dass du keinen langen Arbeitsweg hast. So sparst du viel Zeit.", you: true },
      { speaker: "A", de: "Genau! Und morgens kann ich die Kinder zur Schule bringen.", you: false },
      { speaker: "B", de: "Stimmt, so kann man Familie und Beruf besser verbinden. Aber fühlst du dich manchmal allein?", you: true },
      { speaker: "A", de: "Ja, das stimmt. Manchmal vermisse ich meine Kollegen.", you: false },
      { speaker: "B", de: "Das verstehe ich. Ein Nachteil ist, dass man weniger Kontakt zu den Kollegen hat.", you: true },
      { speaker: "A", de: "Und was meinst du? Was ist am besten?", you: false },
      { speaker: "B", de: "Meiner Meinung nach ist eine Mischung am besten. Ich persönlich mache gern zwei Tage pro Woche Homeoffice.", you: true },
      { speaker: "A", de: "Vielleicht frage ich meine Chefin, ob das bei uns auch geht.", you: false },
      { speaker: "B", de: "Gute Idee! Ich drücke dir die Daumen.", you: true }
    ] }
  ]
},

{
  id: "s3-34",
  season: "s3",
  n: 34,
  title: "Feedback and questions",
  minutes: 13,
  audio: "audio/s3-34.mp3",
  intro: "Speaking part three comes straight after the presentations: you thank your partner, say what you liked and ask a question, and then you answer questions about your own talk. This track gives you ready lines for both sides, built on Mir hat gut gefallen, dass, where mir is the dative because the thing pleases you. It is a short part of the exam, but every line here can be learned word for word.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Vielen Dank für deinen interessanten Vortrag.", en: "Thank you for your interesting talk.", note: "Vortrag is masculine, so deinen. If your partner says Sie, it is Ihren interessanten Vortrag." },
      { de: "Dein Vortrag war klar und gut strukturiert.", en: "Your talk was clear and well structured.", note: "" },
      { de: "Mir hat gut gefallen, dass du von deinen eigenen Erfahrungen erzählt hast.", en: "I really liked that you told us about your own experiences.", note: "gefallen works backwards: the thing pleases me, so it is mir, the dative. After dass, the verb goes last: erzählt hast." },
      { de: "Mir hat auch gefallen, dass du viele Beispiele genannt hast.", en: "I also liked that you gave a lot of examples.", note: "nennen, genannt: an irregular participle." },
      { de: "Besonders interessant fand ich die Situation in deinem Heimatland.", en: "I found the situation in your home country particularly interesting.", note: "fand is the past of finden. Besonders interessant comes first, so the verb comes next." },
      { de: "Neu für mich war, dass Kinder in deinem Land so früh Englisch lernen.", en: "What was new to me was that children in your country learn English so early.", note: "This line shows the examiners that you really listened." },
      { de: "Ich habe eine Frage an dich.", en: "I have a question for you.", note: "eine Frage an, with the accusative: an dich, or formally an Sie." },
      { de: "Könntest du das bitte noch etwas genauer erklären?", en: "Could you explain that in a bit more detail, please?", note: "Könntest du is the polite could. It works for any topic." },
      { de: "Vielen Dank für deine Rückmeldung.", en: "Thank you for your feedback.", note: "Rückmeldung is the word the exam uses for feedback." },
      { de: "Das ist eine gute Frage.", en: "That is a good question.", note: "From track ten. It also gives you two seconds to think." },
      { de: "Darüber habe ich noch nicht nachgedacht.", en: "I have not thought about that yet.", note: "nachdenken über means to think about. darüber means about that." },
      { de: "Da bin ich mir nicht ganz sicher, aber ich glaube schon.", en: "I am not completely sure about that, but I think so.", note: "Germans say sich sicher sein: ich bin mir sicher, with mir." },
      { de: "Wie ich schon gesagt habe, ist eine Mischung am besten.", en: "As I already said, a mix is best.", note: "The first part counts as one position, so the verb ist comes right after the comma." },
      { de: "Ich kann Ihnen ein Beispiel geben.", en: "I can give you an example.", note: "Ihnen is the dative of Sie: you give something to someone. Use it when an examiner asks you." },
      { de: "Entschuldigung, könnten Sie die Frage bitte wiederholen?", en: "Sorry, could you repeat the question, please?", note: "Always allowed in the exam. Asking is better than guessing." },
      { de: "Habe ich Ihre Frage beantwortet?", en: "Have I answered your question?", note: "beantworten starts with be, so there is no ge: beantwortet." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Vielen Dank für deinen interessanten Vortrag. Mir hat gut gefallen, dass du viele Beispiele genannt hast.", en: "Thank you for your interesting talk. I really liked that you gave a lot of examples." },
      { de: "Dein Vortrag war klar und gut strukturiert, und besonders interessant fand ich die Situation in deinem Heimatland.", en: "Your talk was clear and well structured, and I found the situation in your home country particularly interesting." },
      { de: "Ich habe eine Frage an dich: Wie viele Sprachen sprechen deine Kinder?", en: "I have a question for you: how many languages do your children speak?" },
      { de: "Das ist eine gute Frage. Ich kann Ihnen ein Beispiel geben: Ich arbeite montags und freitags zu Hause.", en: "That is a good question. I can give you an example: I work at home on Mondays and Fridays." },
      { de: "Wie ich schon gesagt habe, ist eine Mischung am besten. Habe ich Ihre Frage beantwortet?", en: "As I already said, a mix is best. Have I answered your question?" },
      { de: "Könntest du bitte noch etwas genauer erklären, wie das in deinem Land funktioniert?", en: "Could you explain in a bit more detail how that works in your country?" }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Speaking part three: you gave your talk on working from home, and your partner Derya gave hers on learning foreign languages. First she gives you feedback and asks you questions, then it is your turn. You and your partner say du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Vielen Dank für deinen interessanten Vortrag. Mir hat gut gefallen, dass du von deinen eigenen Erfahrungen erzählt hast.", you: false },
      { speaker: "B", de: "Vielen Dank für deine Rückmeldung.", you: true },
      { speaker: "A", de: "Ich habe eine Frage an dich: Wie oft arbeitest du selbst im Homeoffice?", you: false },
      { speaker: "B", de: "Das ist eine gute Frage. Wie ich schon gesagt habe, ist eine Mischung am besten. Ich arbeite zwei Tage pro Woche zu Hause.", you: true },
      { speaker: "A", de: "Und vermisst du an diesen Tagen deine Kollegen?", you: false },
      { speaker: "B", de: "Darüber habe ich noch nicht nachgedacht. Ich glaube, ein bisschen schon, aber wir telefonieren oft.", you: true },
      { speaker: "A", de: "Danke. Und wie fandest du meinen Vortrag?", you: false },
      { speaker: "B", de: "Vielen Dank für deinen Vortrag. Er war klar und gut strukturiert. Besonders interessant fand ich die Situation in deinem Heimatland.", you: true },
      { speaker: "A", de: "Das freut mich. Hast du auch eine Frage an mich?", you: false },
      { speaker: "B", de: "Ja. Neu für mich war, dass Kinder in deinem Land so früh Englisch lernen. Wie viele Sprachen sprechen deine Kinder?", you: true }
    ] }
  ]
},

{
  id: "s3-35",
  season: "s3",
  n: 35,
  title: "Relative clauses",
  minutes: 13,
  audio: "audio/s3-35.mp3",
  intro: "A relative clause tells your listener exactly which person or thing you mean: the teacher who teaches maths, the cake that I baked yesterday. The little word at the start, der, die, das, den, dem, denen or deren, follows the gender of the noun and its job in the clause, and the verb goes to the end, just as after weil and dass. It also rescues you in the exam when you forget a word, because you can describe it instead: a machine that you use to make coffee.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Das ist der Lehrer, der Mathe unterrichtet.", en: "That is the teacher who teaches maths.", note: "The second der starts the relative clause, and the verb goes to the end: unterrichtet." },
      { de: "Das ist die Klassenlehrerin, die immer so freundlich ist.", en: "That is the class teacher who is always so friendly.", note: "For a woman, die. The relative word has the same gender as the person." },
      { de: "Das ist das Mädchen, das neben meiner Tochter sitzt.", en: "That is the girl who sits next to my daughter.", note: "das Mädchen is neuter, so the relative word is das too." },
      { de: "Das sind die Kinder, die mit meinem Sohn Fußball spielen.", en: "Those are the children who play football with my son.", note: "In the plural it is die for the subject and the object, but denen in the dative." },
      { de: "Wer ist die Frau, die dort am Fenster steht?", en: "Who is the woman standing over there by the window?", note: "" },
      { de: "Der Mann, den Sie dort sehen, ist unser Hausmeister.", en: "The man you can see over there is our caretaker.", note: "den, because the man is the object: Sie sehen den Mann. The clause sits in the middle, between two commas." },
      { de: "Das ist der Kuchen, den ich gestern gebacken habe.", en: "That is the cake I baked yesterday.", note: "In the Perfekt, habe goes to the very end of the relative clause." },
      { de: "Das ist der Kollege, dem ich beim Umzug geholfen habe.", en: "That is the colleague I helped with his move.", note: "helfen takes the dative, so it is dem." },
      { de: "Die Frau, der ich das Buch geliehen habe, ist meine Nachbarin.", en: "The woman I lent the book to is my neighbour.", note: "A woman in the dative gets der. Think: ich habe der Frau das Buch geliehen." },
      { de: "Das ist Frau Schäfer, deren Tochter mit meiner Tochter befreundet ist.", en: "That is Frau Schäfer, whose daughter is friends with my daughter.", note: "deren means whose, for a woman or for more than one person." },
      { de: "Das sind die Eltern, mit denen ich das Fest organisiert habe.", en: "Those are the parents I organised the party with.", note: "After mit comes the dative. In the plural the relative word is denen." },
      { de: "Das ist das Café, von dem ich Ihnen erzählt habe.", en: "That is the café I told you about.", note: "The preposition comes first: von dem. English often puts it at the end." },
      { de: "Mir fällt das Wort gerade nicht ein.", en: "I cannot think of the word right now.", note: "einfallen works like gefallen: the word comes to me, so it is mir. ein goes to the end." },
      { de: "Es ist ein Gerät, mit dem man Kaffee macht.", en: "It is a machine you use to make coffee.", note: "Forgot a word in the exam? Describe it with a relative clause and keep talking." },
      { de: "Das ist jemand, der im Krankenhaus arbeitet.", en: "That is someone who works in a hospital.", note: "jemand, someone, takes der." },
      { de: "Das ist ein Ort, an dem man Bücher ausleihen kann.", en: "That is a place where you can borrow books.", note: "With a modal verb, the modal goes last: ausleihen kann." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Das ist die Klassenlehrerin, die immer so freundlich ist, und das ist der Lehrer, der Mathe unterrichtet.", en: "That is the class teacher who is always so friendly, and that is the teacher who teaches maths." },
      { de: "Das Mädchen, das neben meiner Tochter sitzt, heißt Mia.", en: "The girl who sits next to my daughter is called Mia." },
      { de: "Der Kuchen, den ich gestern gebacken habe, ist leider schon fast weg.", en: "Sadly, the cake I baked yesterday is almost gone already." },
      { de: "Das ist Frau Schäfer, deren Tochter mit meiner Tochter befreundet ist. Mit ihr habe ich das Fest organisiert.", en: "That is Frau Schäfer, whose daughter is friends with my daughter. I organised the party with her." },
      { de: "Die Eltern, mit denen ich das Fest organisiert habe, sind alle sehr nett.", en: "The parents I organised the party with are all very nice." },
      { de: "Mir fällt das Wort gerade nicht ein. Es ist ein Gerät, mit dem man Kaffee macht.", en: "I cannot think of the word right now. It is a machine you use to make coffee." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "The summer party at your children’s school: Herr Kaya, a new father, does not know anyone yet and asks you who is who. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Entschuldigung, ich bin neu hier. Wer ist denn die Frau, die dort am Fenster steht?", you: false },
      { speaker: "B", de: "Das ist Frau Schäfer, deren Tochter mit meiner Tochter befreundet ist. Mit ihr habe ich das Fest organisiert.", you: true },
      { speaker: "A", de: "Und wer ist der Mann, der gerade die Stühle trägt?", you: false },
      { speaker: "B", de: "Das ist unser Hausmeister, der uns bei jedem Schulfest hilft.", you: true },
      { speaker: "A", de: "Ich suche auch die Klassenlehrerin meines Sohnes. Er ist in der dritten Klasse.", you: false },
      { speaker: "B", de: "Das ist bestimmt Frau Neumann, die dort drüben den Kaffee verkauft.", you: true },
      { speaker: "A", de: "Vielen Dank! Und dieser Kuchen ist wirklich lecker. Ist der von Ihnen?", you: false },
      { speaker: "B", de: "Ja, den habe ich gestern gebacken. Das ist ein Rezept, das ich von meiner Mutter habe.", you: true },
      { speaker: "A", de: "Ist das schwer? Was braucht man dafür?", you: false },
      { speaker: "B", de: "Gar nicht. Man braucht nur ein Gerät, mit dem man Sahne schlägt. Mir fällt das Wort gerade nicht ein.", you: true }
    ] }
  ]
},

{
  id: "s3-36",
  season: "s3",
  n: 36,
  title: "Adjective endings",
  minutes: 13,
  audio: "audio/s3-36.mp3",
  intro: "German adjectives change their ending to fit the word they describe: der neue Chef, ein neuer Job, frisches Brot. This track gives you the three patterns, after der, after ein and with no article at all, in sentences about work and shopping. The right endings are one of the things examiners notice in writing and speaking, and they make every description sound natural.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Der neue Chef ist sehr nett.", en: "The new boss is very nice.", note: "As the subject, after der, die or das, the adjective just adds e: der neue Chef, die neue Kollegin, das neue Büro." },
      { de: "Die neue Kollegin kommt aus Italien.", en: "The new colleague comes from Italy.", note: "" },
      { de: "Wie ist dein neuer Job?", en: "How is your new job?", note: "After ein, mein or dein, nothing shows that Job is a der word, so the adjective does it: neuer." },
      { de: "Ich habe ein neues Büro mit einem großen Fenster.", en: "I have a new office with a big window.", note: "Büro is a das word, so after ein it is neues. After mit einem, the ending is en: einem großen Fenster." },
      { de: "Ich arbeite seit Oktober in einer neuen Abteilung.", en: "I have been working in a new department since October.", note: "After dem, einer or any other dative article, the adjective ends in en." },
      { de: "Mittags gehe ich mit dem neuen Kollegen in die Kantine.", en: "At lunchtime I go to the canteen with the new colleague.", note: "Kollege adds an n here too: mit dem neuen Kollegen." },
      { de: "Ich verstehe mich sehr gut mit meinen neuen Kollegen.", en: "I get on very well with my new colleagues.", note: "In the plural, after die, den, meine or meinen, the adjective always ends in en." },
      { de: "Ich suche einen warmen Pullover für den Winter.", en: "I am looking for a warm jumper for the winter.", note: "After den or einen, the adjective ends in en: einen warmen Pullover." },
      { de: "Wie viel kostet der schwarze Mantel im Schaufenster?", en: "How much is the black coat in the shop window?", note: "" },
      { de: "Ich habe eine kleine schwarze Tasche verloren.", en: "I have lost a small black bag.", note: "Two adjectives in a row get the same ending: eine kleine schwarze Tasche." },
      { de: "Wir könnten ihr ein schönes Buch zum Geburtstag schenken.", en: "We could give her a nice book for her birthday.", note: "A typical line for planning a present in speaking part one. Buch is a das word, so after ein it is schönes." },
      { de: "Frisches Brot vom Bäcker schmeckt am besten.", en: "Fresh bread from the baker’s tastes best.", note: "With no article, the adjective takes the article’s ending: das Brot becomes frisches Brot." },
      { de: "Ich trinke morgens gern starken Kaffee.", en: "In the morning I like to drink strong coffee.", note: "The same with a der word: den Kaffee becomes starken Kaffee." },
      { de: "Auf dem Markt kaufe ich frisches Obst und Gemüse.", en: "At the market I buy fresh fruit and vegetables.", note: "" },
      { de: "Ich hätte gern ein Kilo rote Äpfel.", en: "I would like a kilo of red apples.", note: "In the plural with no article, the ending is e: rote Äpfel." },
      { de: "Schönes Wochenende!", en: "Have a nice weekend!", note: "Good wishes have no article, so the adjective carries the ending: schönes Wochenende, schönen Abend, gute Reise." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Liebe Julia, stell dir vor: Ich arbeite jetzt in einer neuen Abteilung mit sehr netten Kollegen.", en: "Dear Julia, guess what: I now work in a new department with very nice colleagues." },
      { de: "Der neue Chef ist sehr nett, und ich habe ein neues Büro mit einem großen Fenster.", en: "The new boss is very nice, and I have a new office with a big window." },
      { de: "Am Samstag kaufe ich auf dem Markt frisches Brot, frischen Käse und rote Äpfel.", en: "On Saturday I buy fresh bread, fresh cheese and red apples at the market." },
      { de: "Ich suche einen warmen Pullover, weil mein alter Pullover kaputt ist.", en: "I am looking for a warm jumper, because my old jumper is worn out." },
      { de: "Gestern habe ich im Bus eine kleine schwarze Tasche verloren. Mein neues Handy war drin.", en: "Yesterday I lost a small black bag on the bus. My new phone was in it." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Saturday morning at the farmers’ market at Konstablerwache in Frankfurt: you buy apples, and vegetables for a soup, at Frau Weber’s stall. Formal Sie with the stallholder. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Guten Morgen! Was darf es sein?", you: false },
      { speaker: "B", de: "Guten Morgen. Ich hätte gern ein Kilo rote Äpfel, bitte.", you: true },
      { speaker: "A", de: "Gern. Wir haben heute auch ganz frische Pilze aus der Region.", you: false },
      { speaker: "B", de: "Die sehen sehr gut aus. Dann nehme ich ein halbes Kilo.", you: true },
      { speaker: "A", de: "Sonst noch etwas?", you: false },
      { speaker: "B", de: "Ja, ich brauche noch große Kartoffeln für eine leckere Suppe.", you: true },
      { speaker: "A", de: "Die großen Kartoffeln hier kosten einen Euro fünfzig das Kilo.", you: false },
      { speaker: "B", de: "Gut, dann nehme ich zwei Kilo.", you: true },
      { speaker: "A", de: "Sehr gern. Das macht zusammen genau zehn Euro. Brauchen Sie eine Tüte?", you: false },
      { speaker: "B", de: "Nein danke, ich habe meine eigene Tasche dabei. Hier sind zehn Euro. Schönes Wochenende!", you: true }
    ] }
  ]
},

{
  id: "s3-37",
  season: "s3",
  n: 37,
  title: "The passive",
  minutes: 13,
  audio: "audio/s3-37.mp3",
  intro: "The passive says what happens, not who does it: a form of werden plus a participle, as in wird repariert, is being repaired, and wurde gebaut, was built. It is everywhere in the news, in announcements and at work, so you will hear it in the listening exam and read it in texts about history or about how things are done. This track also gives you the very useful form with müssen: muss repariert werden.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Das Büro wird jeden Abend geputzt.", en: "The office is cleaned every evening.", note: "The passive is wird plus a participle at the end: wird geputzt. Use it when the action matters more than the person." },
      { de: "Die Rechnungen werden am Ende des Monats bezahlt.", en: "The bills are paid at the end of the month.", note: "With a plural, wird becomes werden: die Rechnungen werden bezahlt." },
      { de: "Ihre Bestellung wird morgen verschickt.", en: "Your order will be sent out tomorrow.", note: "The present passive often points to the future: wird morgen verschickt, will be sent tomorrow." },
      { de: "Hier wird nicht geraucht.", en: "There is no smoking here.", note: "Sometimes the passive has no subject at all. You hear this one as a house rule." },
      { de: "Wie wird das gemacht?", en: "How is that done?", note: "A good question at work when someone shows you something new." },
      { de: "Kann das bis morgen erledigt werden?", en: "Can that be done by tomorrow?", note: "With können, müssen or sollen, the passive ends in two words: erledigt werden." },
      { de: "Der Drucker ist kaputt und muss repariert werden.", en: "The printer is broken and has to be repaired.", note: "" },
      { de: "Der Bericht muss bis Freitag geschrieben werden.", en: "The report has to be written by Friday.", note: "" },
      { de: "Die Besprechung wurde auf Donnerstag verschoben.", en: "The meeting was moved to Thursday.", note: "For the past, wird becomes wurde: wurde verschoben, was moved." },
      { de: "Das Paket wurde gestern geliefert.", en: "The parcel was delivered yesterday.", note: "" },
      { de: "Die Alte Oper wurde im neunzehnten Jahrhundert gebaut.", en: "The Old Opera House was built in the nineteenth century.", note: "Typical for history and sightseeing: wurde gebaut, was built, wurde zerstört, was destroyed." },
      { de: "Das Fest wird jedes Jahr von der Stadt organisiert.", en: "The festival is organised by the city every year.", note: "To say who does it, add von with the dative: von der Stadt, by the city." },
      { de: "Ich komme etwas später, weil die Straße gesperrt wurde.", en: "I will be a bit late, because the road was closed.", note: "After weil or dass, wurde goes to the very end: weil die Straße gesperrt wurde." },
      { de: "Bei dem Unfall wurde zum Glück niemand verletzt.", en: "Luckily, nobody was hurt in the accident.", note: "A classic line in the radio news after an accident." },
      { de: "In Ungarn wird zu Weihnachten oft Fischsuppe gegessen.", en: "In Hungary, fish soup is often eaten at Christmas.", note: "The passive is also good for customs, what people in your country usually do." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Der Drucker ist schon wieder kaputt und muss bis morgen repariert werden.", en: "The printer is broken again and has to be repaired by tomorrow." },
      { de: "Die Besprechung wurde auf Donnerstag verschoben, weil Herr Becker krank ist.", en: "The meeting was moved to Thursday, because Mr Becker is ill." },
      { de: "Kann der Bericht bis Freitag geschrieben werden, oder brauchen Sie noch mehr Zeit?", en: "Can the report be written by Friday, or do you need more time?" },
      { de: "Die Alte Oper wurde im Krieg zerstört und später wieder aufgebaut.", en: "The Old Opera House was destroyed in the war and rebuilt later." },
      { de: "Entschuldigung, ich komme etwas später, weil die Straße wegen eines Unfalls gesperrt wurde.", en: "Sorry, I will be a bit late, because the road was closed after an accident." },
      { de: "In Ungarn wird Weihnachten am vierundzwanzigsten Dezember gefeiert, und es wird oft Fischsuppe gegessen.", en: "In Hungary, Christmas is celebrated on the twenty-fourth of December, and fish soup is often eaten." }
    ] },
    { type: "text", heading: "The news", intro: "A short local news report, the kind you hear in listening part one: an accident, a festival and what it means for traffic. Listen for wird, werden and wurde.", lines: [
      "Und nun die Nachrichten aus Frankfurt und der Region.",
      "Heute Morgen gab es auf der Autobahn bei Frankfurt einen Unfall mit drei Autos.",
      "Die Autobahn wurde für zwei Stunden gesperrt.",
      "Zum Glück wurde niemand schwer verletzt.",
      "Am Samstag wird in der Innenstadt das große Stadtfest eröffnet.",
      "Das Fest wird von der Stadt organisiert, und der Eintritt ist frei.",
      "Wegen des Festes werden am Wochenende mehrere Straßen gesperrt.",
      "Einige Buslinien werden umgeleitet."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Monday morning in the office: your colleague Frau Schneider tells you what has changed this week, and you talk about a report, some documents and the broken printer. Formal Sie. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Guten Morgen! Wissen Sie schon, dass die Besprechung verschoben wurde?", you: false },
      { speaker: "B", de: "Guten Morgen, Frau Schneider. Nein, das wusste ich nicht. Auf wann wurde sie verschoben?", you: true },
      { speaker: "A", de: "Auf Donnerstag um zehn Uhr. Herr Becker ist leider krank.", you: false },
      { speaker: "B", de: "Ach so. Muss der Bericht trotzdem bis Mittwoch geschrieben werden?", you: true },
      { speaker: "A", de: "Ja, leider. Und heute müssen noch die Unterlagen für die Kunden ausgedruckt werden.", you: false },
      { speaker: "B", de: "Das geht leider nicht. Der Drucker ist kaputt und muss repariert werden.", you: true },
      { speaker: "A", de: "Schon wieder? Wurde der Techniker schon angerufen?", you: false },
      { speaker: "B", de: "Ja, ich habe ihn heute Morgen angerufen. Der Drucker wird morgen früh repariert.", you: true },
      { speaker: "A", de: "Gut. Dann schicken Sie mir die Unterlagen bitte per E-Mail. Ich drucke sie im dritten Stock aus.", you: false },
      { speaker: "B", de: "Gern. Sie bekommen sie in zehn Minuten.", you: true }
    ] }
  ]
},

{
  id: "s3-38",
  season: "s3",
  n: 38,
  title: "Infinitive with zu",
  minutes: 13,
  audio: "audio/s3-38.mp3",
  intro: "After phrases like keine Lust, keine Zeit or es ist wichtig, German adds a second verb with zu at the very end: Ich habe keine Zeit, jeden Tag zu trainieren. This track teaches that pattern, plus ohne zu, anfangen and aufhören, with your hobbies and goals as the topic. It gives you longer, more natural sentences for the e-mail and the presentation, which is exactly what the examiners want to hear.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich habe keine Lust, bei diesem Wetter mit dem Roller zu fahren.", en: "I do not feel like riding the scooter in this weather.", note: "After Lust, Zeit or Angst, the second verb goes to the very end with zu in front: zu fahren." },
      { de: "Hast du Lust, am Samstag im Taunus zu wandern?", en: "Do you feel like going hiking in the Taunus on Saturday?", note: "The Taunus is the range of hills just outside Frankfurt." },
      { de: "Leider habe ich keine Zeit, jeden Tag zu trainieren.", en: "Unfortunately I do not have time to train every day.", note: "" },
      { de: "Es ist wichtig, jeden Tag ein bisschen zu üben.", en: "It is important to practise a little every day.", note: "Es ist wichtig, es ist leicht, es macht Spaß: all of them are followed by zu and the verb at the end." },
      { de: "Es ist nicht leicht, neben der Arbeit eine Sprache zu lernen.", en: "It is not easy to learn a language alongside work.", note: "" },
      { de: "Es macht mir Spaß, mit den Kindern Fußball zu spielen.", en: "I enjoy playing football with the children.", note: "" },
      { de: "Ich versuche, jeden Abend zwanzig Minuten Deutsch zu lernen.", en: "I try to study German for twenty minutes every evening.", note: "" },
      { de: "Ich habe vor, nächstes Jahr beim Marathon in Frankfurt mitzulaufen.", en: "I plan to run in the Frankfurt Marathon next year.", note: "Ich habe vor means I plan to. With a verb that splits, like mitlaufen, zu goes into the middle: mitzulaufen." },
      { de: "Ich habe letztes Jahr angefangen, Gitarre zu spielen.", en: "I started playing the guitar last year.", note: "anfangen and aufhören work the same way: angefangen, Gitarre zu spielen." },
      { de: "Mein Bruder hat vor einem Jahr aufgehört zu rauchen.", en: "My brother stopped smoking a year ago.", note: "" },
      { de: "Es fängt gleich an zu regnen.", en: "It is about to start raining.", note: "" },
      { de: "Ich vergesse oft, mein Handy aufzuladen.", en: "I often forget to charge my phone.", note: "aufladen splits, so zu goes into the middle: aufzuladen." },
      { de: "Ich fahre oft zur Arbeit, ohne zu frühstücken.", en: "I often go to work without having breakfast.", note: "ohne zu means without doing something. English uses ing, German uses zu and the verb at the end." },
      { de: "Ich kann nicht einschlafen, ohne ein bisschen zu lesen.", en: "I cannot fall asleep without reading a little.", note: "" },
      { de: "Mein Ziel ist es, im Februar die Prüfung zu bestehen.", en: "My goal is to pass the exam in February.", note: "Mein Ziel ist es, or mein Plan ist es: the clearest way to name a goal." },
      { de: "Ich freue mich darauf, dich bald wiederzusehen.", en: "I am looking forward to seeing you again soon.", note: "darauf points forward to the part with zu. A good last line for an e-mail to a friend." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Heute habe ich keine Lust, mit dem Roller zu fahren, weil es gleich anfängt zu regnen.", en: "Today I do not feel like riding the scooter, because it is about to start raining." },
      { de: "Es ist nicht leicht, neben der Arbeit Deutsch zu lernen, aber ich versuche, jeden Abend zu üben.", en: "It is not easy to learn German alongside work, but I try to practise every evening." },
      { de: "Ich habe letztes Jahr angefangen, Gitarre zu spielen, und es macht mir sehr viel Spaß.", en: "I started playing the guitar last year, and I enjoy it a lot." },
      { de: "Mein Ziel ist es, im Februar die Prüfung zu bestehen und danach beim Marathon mitzulaufen.", en: "My goal is to pass the exam in February and then to run in the marathon." },
      { de: "Ich fahre oft zur Arbeit, ohne zu frühstücken, deshalb kaufe ich mir unterwegs ein Brötchen.", en: "I often go to work without having breakfast, so I buy myself a bread roll on the way." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Thursday evening, a phone call with your friend Marco: he wants to go hiking, and you talk about your hobbies and goals. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Hallo, hier ist Marco! Hast du Lust, am Samstag im Taunus zu wandern?", you: false },
      { speaker: "B", de: "Hallo Marco! Lust habe ich schon, aber am Samstag habe ich leider keine Zeit. Wie wäre es mit Sonntag?", you: true },
      { speaker: "A", de: "Sonntag passt auch. Was machst du eigentlich sonst in deiner Freizeit?", you: false },
      { speaker: "B", de: "Ich habe letztes Jahr angefangen, Gitarre zu spielen. Es macht mir viel Spaß.", you: true },
      { speaker: "A", de: "Toll! Und lernst du immer noch jeden Tag Deutsch?", you: false },
      { speaker: "B", de: "Ja, ich versuche, jeden Abend zwanzig Minuten zu üben. Mein Ziel ist es, im Februar die Prüfung zu bestehen.", you: true },
      { speaker: "A", de: "Das schaffst du! Ich habe übrigens aufgehört zu rauchen.", you: false },
      { speaker: "B", de: "Super! Es ist bestimmt nicht leicht, damit aufzuhören.", you: true },
      { speaker: "A", de: "Nein, wirklich nicht. Aber jetzt habe ich viel mehr Energie. Also, Sonntag um neun am Hauptbahnhof?", you: false },
      { speaker: "B", de: "Abgemacht. Ich freue mich darauf, mal wieder zu wandern.", you: true }
    ] }
  ]
},

{
  id: "s3-39",
  season: "s3",
  n: 39,
  title: "Wishes and advice",
  minutes: 14,
  audio: "audio/s3-39.mp3",
  intro: "For wishes and advice German uses würde, hätte, wäre and sollte: An deiner Stelle würde ich, if I were you, I would, Wenn ich mehr Zeit hätte, if I had more time, and Du solltest, you should. This track teaches these forms through an online forum where people ask for advice and get it. They are among the most useful forms at this level: you need them in e-mails to friends, when you plan with your partner in the speaking exam, and whenever someone in the listening exam gives a tip.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich würde gern mehr reisen.", en: "I would like to travel more.", note: "würde plus a verb at the end is the German would: ich würde reisen. With gern, it becomes a wish." },
      { de: "Wenn ich mehr Zeit hätte, würde ich öfter Freunde treffen.", en: "If I had more time, I would meet friends more often.", note: "hätte means would have. After wenn the verb goes to the end, and the next part starts with würde: würde ich." },
      { de: "Wenn ich reich wäre, würde ich eine Weltreise machen.", en: "If I were rich, I would travel around the world.", note: "wäre means would be: wenn ich reich wäre, if I were rich." },
      { de: "Es wäre schön, wenn wir uns öfter sehen könnten.", en: "It would be nice if we could see each other more often.", note: "könnten means could. A friendly line for the end of an e-mail." },
      { de: "Was würdest du an meiner Stelle machen?", en: "What would you do in my place?", note: "" },
      { de: "Hättest du vielleicht einen Tipp für mich?", en: "Would you have a tip for me?", note: "hättest is the would form of hast. Asking for advice like this sounds polite and natural." },
      { de: "An deiner Stelle würde ich mir einen Sportverein suchen.", en: "If I were you, I would look for a sports club.", note: "An deiner Stelle means in your place. To someone you call Sie, say an Ihrer Stelle." },
      { de: "Du solltest mal mit deinem Chef sprechen.", en: "You should talk to your boss.", note: "solltest means should. It is much softer than musst, you must." },
      { de: "Du könntest zum Beispiel einen Kurs an der Volkshochschule machen.", en: "You could, for example, take a course at the adult education centre.", note: "könntest gives a gentle idea. Almost every German town has a Volkshochschule with cheap evening courses." },
      { de: "Ich würde nicht so lange warten.", en: "I would not wait so long.", note: "" },
      { de: "Hast du schon mal versucht, über eine App Leute kennenzulernen?", en: "Have you ever tried meeting people through an app?", note: "A soft way to give advice. Notice the zu from the last track: kennenzulernen." },
      { de: "Wie wäre es, wenn du einen Tandempartner suchst?", en: "How about looking for a language exchange partner?", note: "After wie wäre es, wenn, the verb can simply stay in the present: suchst." },
      { de: "Mir hat es sehr geholfen, in einem Chor zu singen.", en: "Singing in a choir helped me a lot.", note: "In a forum reply, your own experience makes the advice stronger." },
      { de: "Das würde ich dir auch empfehlen.", en: "I would recommend that to you too.", note: "" },
      { de: "Ich hoffe, das hilft dir ein bisschen.", en: "I hope this helps you a little.", note: "A typical last line of a forum reply." },
      { de: "Ich drücke dir die Daumen!", en: "I will keep my fingers crossed for you!", note: "Literally: I press my thumbs for you. Germans say it where English says fingers crossed." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Wenn ich nicht so viel arbeiten müsste, würde ich öfter Freunde treffen.", en: "If I did not have to work so much, I would meet friends more often." },
      { de: "An deiner Stelle würde ich mir einen Sportverein suchen, weil man dort schnell Leute kennenlernt.", en: "If I were you, I would look for a sports club, because you meet people quickly there." },
      { de: "Du könntest zum Beispiel einen Kurs an der Volkshochschule machen. Mir hat das sehr geholfen.", en: "You could, for example, take a course at the adult education centre. That helped me a lot." },
      { de: "Du solltest nicht so lange warten. Ich würde gleich nächste Woche anfangen.", en: "You should not wait so long. I would start as early as next week." },
      { de: "Ich hoffe, das hilft dir ein bisschen. Es wäre schön, wenn wir uns bald sehen könnten.", en: "I hope this helps you a little. It would be nice if we could see each other soon." }
    ] },
    { type: "text", heading: "The forum", intro: "A question in an online forum for people who are new in Frankfurt, and one reply full of advice. Listen for würde, könntest and solltest.", lines: [
      "Tobias schreibt: Ich wohne seit drei Monaten in Frankfurt und kenne hier fast niemanden.",
      "Ich arbeite viel, und abends bin ich oft allein. Was würdet ihr an meiner Stelle machen?",
      "Aylin antwortet: Hallo Tobias, das kenne ich gut. Am Anfang ging es mir genauso.",
      "An deiner Stelle würde ich mir einen Sportverein suchen. Dort lernt man schnell Leute kennen.",
      "Du könntest auch einen Kurs an der Volkshochschule machen, zum Beispiel Kochen oder Tanzen.",
      "Und du solltest mal deine Kollegen fragen, ob sie nach der Arbeit mit dir etwas trinken gehen.",
      "Ich würde nicht zu lange warten. Ich drücke dir die Daumen! Viele Grüße, Aylin"
    ] },
    { type: "dialogue", heading: "Conversation", intro: "In a café after work: your friend Lena has a job offer in Hamburg and cannot decide what to do. You give her advice. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Ich brauche deinen Rat. Ich habe ein Jobangebot von einer Firma in Hamburg bekommen.", you: false },
      { speaker: "B", de: "Herzlichen Glückwunsch! Aber warum klingst du so unsicher?", you: true },
      { speaker: "A", de: "Die Stelle ist super, aber meine Familie und meine Freunde wohnen alle hier.", you: false },
      { speaker: "B", de: "Das verstehe ich. Was würdest du denn am liebsten machen?", you: true },
      { speaker: "A", de: "Ich weiß es nicht. Was würdest du an meiner Stelle machen?", you: false },
      { speaker: "B", de: "An deiner Stelle würde ich erst mal nach Hamburg fahren und mir die Firma ansehen.", you: true },
      { speaker: "A", de: "Gute Idee. Aber was mache ich, wenn es mir dort nicht gefällt?", you: false },
      { speaker: "B", de: "Dann bleibst du einfach hier. Aber du solltest auf jeden Fall mit deinem Chef sprechen. Vielleicht bekommst du hier mehr Geld.", you: true },
      { speaker: "A", de: "Stimmt, daran habe ich noch gar nicht gedacht.", you: false },
      { speaker: "B", de: "Ich drücke dir die Daumen! Wenn ich mehr Zeit hätte, würde ich mit dir nach Hamburg fahren.", you: true }
    ] }
  ]
},

{
  id: "s3-40",
  season: "s3",
  n: 40,
  title: "The forum post",
  minutes: 14,
  audio: "audio/s3-40.mp3",
  intro: "Writing task two is a post in an online forum: someone has given an opinion on a topic, and you answer with yours in about eighty words. This track gives you a fixed frame for it, from the first line to Zum Schluss, and the connectors that hold it together: deshalb, trotzdem, außerdem, and einerseits, andererseits. Learn the frame by heart, and in the exam you only fill in the topic; here the topics are sport on television, and children and media.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich habe gestern die Sendung zum Thema Sport im Fernsehen gesehen.", en: "Yesterday I watched the programme on the topic of sport on television.", note: "The task starts with a TV discussion programme and its online guest book. Your first line says what you saw. You need no greeting." },
      { de: "Ich möchte auch meine Meinung dazu schreiben.", en: "I would like to write my opinion on it too.", note: "" },
      { de: "Stefan schreibt, dass es zu viel Sport im Fernsehen gibt.", en: "Stefan writes that there is too much sport on television.", note: "Someone in the task has already given an opinion. Name it with schreibt, dass, and the verb goes to the end: gibt." },
      { de: "Da bin ich anderer Meinung.", en: "I disagree with that.", note: "This disagrees politely. To agree, say the next line." },
      { de: "Ich sehe das genauso.", en: "I see it the same way.", note: "" },
      { de: "Meiner Meinung nach zeigt das Fernsehen zu viel Fußball.", en: "In my opinion, television shows too much football.", note: "After meiner Meinung nach, the verb comes straight away: zeigt." },
      { de: "Ich finde, dass Sportsendungen viele Menschen motivieren.", en: "I think that sports programmes motivate a lot of people.", note: "" },
      { de: "Einerseits ist Fußball im Fernsehen spannend, andererseits läuft er fast jeden Tag.", en: "On the one hand, football on television is exciting; on the other hand, it is on almost every day.", note: "After einerseits and andererseits, the verb comes next: ist, läuft. Here läuft means is on." },
      { de: "Außerdem gibt es viele Sportarten, die man nie im Fernsehen sieht.", en: "Besides, there are many sports that you never see on television.", note: "außerdem adds one more point, with the verb straight after it." },
      { de: "Deshalb sollte das Fernsehen auch andere Sportarten zeigen.", en: "That is why television should show other sports too.", note: "deshalb, that is why, gives the result. Again the verb comes next: sollte." },
      { de: "Trotzdem sehe ich am Wochenende gern Fußball.", en: "Even so, I like watching football at the weekend.", note: "trotzdem means even so. It shows the examiner that you can weigh both sides." },
      { de: "Das Problem ist, dass viele Kinder zu lange vor dem Fernseher sitzen.", en: "The problem is that many children sit in front of the television for too long.", note: "Das Problem ist, dass works for any topic, just like ein Vorteil ist, dass." },
      { de: "Kinder sollten nicht mehr als eine Stunde am Tag fernsehen.", en: "Children should not watch television for more than an hour a day.", note: "" },
      { de: "Aus eigener Erfahrung weiß ich, dass Sport mit Freunden mehr Spaß macht.", en: "From my own experience I know that sport with friends is more fun.", note: "A personal example makes your post stronger." },
      { de: "Zum Schluss möchte ich sagen, dass Sport im Fernsehen kein Problem ist.", en: "Finally, I would like to say that sport on television is not a problem.", note: "Zum Schluss marks your last sentence: your opinion once more, in one line." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich habe gestern die Sendung zum Thema Sport im Fernsehen gesehen und möchte meine Meinung dazu schreiben.", en: "Yesterday I watched the programme on sport on television, and I would like to write my opinion on it." },
      { de: "Stefan schreibt, dass es zu viel Sport im Fernsehen gibt. Da bin ich anderer Meinung.", en: "Stefan writes that there is too much sport on television. I disagree with that." },
      { de: "Einerseits läuft im Fernsehen fast jeden Tag Fußball, andererseits motivieren Sportsendungen viele Menschen.", en: "On the one hand, there is football on television almost every day; on the other hand, sports programmes motivate a lot of people." },
      { de: "Außerdem gibt es viele Sportarten, die man nie im Fernsehen sieht. Deshalb sollte das Fernsehen auch weniger bekannte Sportarten zeigen.", en: "Besides, there are many sports that you never see on television. That is why television should also show less well-known sports." },
      { de: "Kinder sollten nicht zu lange fernsehen. Trotzdem finde ich, dass Sportsendungen für sie gut sein können.", en: "Children should not watch television for too long. Even so, I think that sports programmes can be good for them." },
      { de: "Zum Schluss möchte ich sagen, dass Sport im Fernsehen kein Problem ist, wenn man selbst aktiv bleibt.", en: "Finally, I would like to say that sport on television is not a problem, as long as you stay active yourself." }
    ] },
    { type: "text", heading: "The text", intro: "The whole forum post as you would write it in the exam: what you saw, the other opinion, your opinion with two reasons, the other side, and a last sentence.", lines: [
      "Ich habe gestern die Sendung zum Thema Sport im Fernsehen gesehen und möchte meine Meinung dazu schreiben.",
      "Stefan schreibt, dass es zu viel Sport im Fernsehen gibt. Da bin ich anderer Meinung.",
      "Ich finde, dass Sportsendungen viele Menschen motivieren, selbst aktiv zu werden.",
      "Außerdem kann man so Sportarten kennenlernen, die man vorher nicht kannte.",
      "Einerseits ist das gut, andererseits sehen manche Leute nur zu und machen selbst keinen Sport.",
      "Trotzdem sehe ich am Wochenende gern Fußball, und danach gehe ich oft selbst joggen.",
      "Zum Schluss möchte ich sagen, dass Sport im Fernsehen kein Problem ist, wenn man selbst aktiv bleibt."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "The second exam topic, children and media, as a conversation: your friend Sabine has read a forum discussion and asks what you think. Answer the way you would write it. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Hast du die Diskussion im Forum gelesen? Es geht um Kinder und Medien.", you: false },
      { speaker: "B", de: "Ja, gestern Abend. Ich möchte auch meine Meinung dazu schreiben.", you: true },
      { speaker: "A", de: "Eine Mutter schreibt, dass Kinder unter zehn Jahren kein Tablet haben sollten. Was meinst du?", you: false },
      { speaker: "B", de: "Da bin ich anderer Meinung. Ich finde, dass Kinder mit einem Tablet viel lernen können. Außerdem macht es ihnen Spaß.", you: true },
      { speaker: "A", de: "Aber viele Kinder sitzen stundenlang davor.", you: false },
      { speaker: "B", de: "Das stimmt. Einerseits ist ein Tablet praktisch, andererseits brauchen Kinder Bewegung. Deshalb sollte es feste Zeiten geben.", you: true },
      { speaker: "A", de: "Und wie ist das bei deinen Kindern?", you: false },
      { speaker: "B", de: "Sie dürfen am Wochenende eine Stunde mit dem Tablet spielen. Trotzdem sind sie am liebsten draußen im Park.", you: true },
      { speaker: "A", de: "Und wie würdest du deinen Text beenden?", you: false },
      { speaker: "B", de: "Zum Schluss möchte ich sagen, dass Medien kein Problem sind, wenn es feste Regeln gibt.", you: true }
    ] }
  ]
},

{
  id: "s3-41",
  season: "s3",
  n: 41,
  title: "Formal e-mail II: apologising and declining",
  minutes: 13,
  audio: "audio/s3-41.mp3",
  intro: "Writing task three is a short formal e-mail of about forty words, and very often you must say sorry and explain why you cannot come. Track seven gave you the frame; this track adds polite apologies with dass, sich entschuldigen für, and requests with könnten, in an e-mail to your boss and one to your course leader.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Sehr geehrter Herr Brandt,", en: "Dear Mr Brandt,", note: "Your boss. geehrter for a man, geehrte for a woman, as in track seven." },
      { de: "vielen Dank für Ihre Einladung zur Weihnachtsfeier.", en: "thank you very much for your invitation to the Christmas party.", note: "After the comma of the greeting, the next line starts with a small letter: vielen." },
      { de: "Leider kann ich an der Feier nicht teilnehmen.", en: "Unfortunately I cannot attend the party.", note: "teilnehmen an, to take part in, with the dative: an der Feier. It sounds more formal than kommen." },
      { de: "Ich muss Ihnen leider absagen.", en: "Unfortunately I have to decline.", note: "absagen from track twenty: here it means saying no to an invitation. Ihnen, to you, is formal and has a capital I." },
      { de: "Es tut mir sehr leid, dass ich nicht kommen kann.", en: "I am very sorry that I cannot come.", note: "After dass, the verbs go to the end, and kann comes last: nicht kommen kann." },
      { de: "An diesem Abend besucht uns meine Mutter aus Ungarn.", en: "That evening my mother is visiting us from Hungary.", note: "One short, concrete reason is all the exam needs." },
      { de: "Entschuldigen Sie bitte, dass ich so spät antworte.", en: "Please excuse me for replying so late.", note: "Entschuldigen Sie, dass: the same verb at the end rule as with weil." },
      { de: "Ich möchte mich für meine späte Antwort entschuldigen.", en: "I would like to apologise for my late reply.", note: "sich entschuldigen für plus accusative: you apologise for something. Do not forget mich. After möchte, entschuldigen goes to the end." },
      { de: "Ich hoffe auf Ihr Verständnis.", en: "I hope you will understand.", note: "A twin of Ich bitte um Ihr Verständnis from track seven. Pick one and use it every time." },
      { de: "Beim nächsten Mal bin ich gern dabei.", en: "Next time I will be happy to join in.", note: "dabei sein, to be there, to join in. Ending on a positive note is polite." },
      { de: "Ich wünsche Ihnen und dem ganzen Team eine schöne Feier.", en: "I hope you and the whole team have a lovely party.", note: "wünschen takes the dative for the person: Ihnen, dem Team." },
      { de: "Leider kann ich am Donnerstag nicht zum Kurs kommen.", en: "Unfortunately I cannot come to class on Thursday.", note: "Now to your course leader. zum is zu plus dem: to the course." },
      { de: "Ich muss an diesem Tag geschäftlich nach Hamburg fahren.", en: "That day I have to travel to Hamburg on business.", note: "geschäftlich, on business. After muss, the infinitive fahren goes to the end." },
      { de: "Könnten Sie mir bitte die Hausaufgaben schicken?", en: "Could you please send me the homework?", note: "Könnten, as in track twenty-four: the polite form of können. It turns an order into a request." },
      { de: "Vielen Dank im Voraus.", en: "Thank you in advance.", note: "Use it after you have asked for something." },
      { de: "Mit freundlichen Grüßen", en: "Kind regards", note: "In a letter there is no comma after it. Your name goes on the next line." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Sehr geehrter Herr Brandt, vielen Dank für Ihre Einladung zur Weihnachtsfeier am zwölften Dezember.", en: "Dear Mr Brandt, thank you very much for your invitation to the Christmas party on the twelfth of December." },
      { de: "Es tut mir sehr leid, dass ich nicht kommen kann, weil meine Mutter uns an diesem Abend besucht.", en: "I am very sorry that I cannot come, because my mother is visiting us that evening." },
      { de: "Ich hoffe auf Ihr Verständnis. Beim nächsten Mal bin ich gern dabei.", en: "I hope you will understand. Next time I will be happy to join in." },
      { de: "Sehr geehrte Frau Koch, entschuldigen Sie bitte, dass ich so spät antworte.", en: "Dear Ms Koch, please excuse me for replying so late." },
      { de: "Leider kann ich am Donnerstag nicht zum Kurs kommen, weil ich geschäftlich nach Hamburg fahren muss.", en: "Unfortunately I cannot come to class on Thursday, because I have to travel to Hamburg on business." },
      { de: "Könnten Sie mir bitte die Hausaufgaben schicken? Vielen Dank im Voraus.", en: "Could you please send me the homework? Thank you in advance." }
    ] },
    { type: "text", heading: "The e-mail", intro: "The whole e-mail to Mr Brandt, as you would write it in the exam: thanks, the reason, the apology, understanding, a friendly ending. It is a little longer than forty words, and that is fine.", lines: [
      "Sehr geehrter Herr Brandt,",
      "vielen Dank für Ihre Einladung zur Weihnachtsfeier am zwölften Dezember.",
      "Leider kann ich an der Feier nicht teilnehmen, weil meine Mutter uns an diesem Abend besucht.",
      "Es tut mir sehr leid.",
      "Ich hoffe auf Ihr Verständnis. Beim nächsten Mal bin ich gern dabei.",
      "Ich wünsche Ihnen und dem ganzen Team eine schöne Feier.",
      "Mit freundlichen Grüßen",
      "János"
    ] },
    { type: "dialogue", heading: "Conversation", intro: "The next morning your boss, Mr Brandt, has read your e-mail and stops you in the corridor. You say sorry in person. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Morgen! Ich habe Ihre E-Mail gelesen. Schade, dass Sie nicht zur Weihnachtsfeier kommen können.", you: false },
      { speaker: "B", de: "Guten Morgen, Herr Brandt. Ja, es tut mir wirklich leid. An diesem Abend besucht uns meine Mutter aus Ungarn.", you: true },
      { speaker: "A", de: "Das verstehe ich natürlich. Bleibt sie länger?", you: false },
      { speaker: "B", de: "Ja, eine Woche. Wir haben sie seit dem Sommer nicht mehr gesehen.", you: true },
      { speaker: "A", de: "Dann wünsche ich Ihnen eine schöne Zeit mit Ihrer Familie.", you: false },
      { speaker: "B", de: "Vielen Dank. Und entschuldigen Sie bitte, dass ich so spät geantwortet habe.", you: true },
      { speaker: "A", de: "Kein Problem. Beim nächsten Mal sind Sie hoffentlich dabei.", you: false },
      { speaker: "B", de: "Ja, ganz bestimmt. Ich wünsche Ihnen und dem ganzen Team viel Spaß bei der Feier.", you: true }
    ] }
  ]
},

{
  id: "s3-42",
  season: "s3",
  n: 42,
  title: "Work and applications",
  minutes: 13,
  audio: "audio/s3-42.mp3",
  intro: "Work is a favourite exam topic: job adverts in reading, your job in speaking, sometimes an application in writing. This track gives you the words of a job search, sich bewerben with um, bei and als, and seit with the present tense for your experience, and it ends with a real job interview.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich suche eine neue Stelle.", en: "I am looking for a new job.", note: "die Stelle, the position. You will also hear der Job and die Arbeitsstelle." },
      { de: "Ich habe die Stellenanzeige im Internet gefunden.", en: "I found the job advert online.", note: "die Stellenanzeige is die Stelle plus die Anzeige, the advert from track twenty-two." },
      { de: "Ich möchte mich um die Stelle als Teamleiter bewerben.", en: "I would like to apply for the position of team leader.", note: "sich bewerben um plus accusative: for the job. als plus the job title, with no article." },
      { de: "Ich habe mich bei drei Firmen beworben.", en: "I have applied to three companies.", note: "bei plus dative for the company. The past participle is beworben." },
      { de: "Im Anhang finden Sie meinen Lebenslauf und meine Zeugnisse.", en: "Attached you will find my CV and my certificates.", note: "Im Anhang, in the attachment: the standard line in an application e-mail. das Zeugnis, a school or work certificate." },
      { de: "Ich habe in Budapest Wirtschaft studiert.", en: "I studied economics in Budapest.", note: "Perfekt with haben, as in track eleven. In an interview you tell your story in the Perfekt." },
      { de: "Im Studium habe ich ein Praktikum bei einer Versicherung gemacht.", en: "During my studies I did an internship at an insurance company.", note: "ein Praktikum machen, to do an internship." },
      { de: "Seit acht Jahren arbeite ich bei einer Bank in Frankfurt.", en: "I have been working at a bank in Frankfurt for eight years.", note: "seit with the present tense, for something that is still going on: arbeite, not habe gearbeitet." },
      { de: "Ich habe viel Erfahrung in der Kundenberatung.", en: "I have a lot of experience in advising customers.", note: "Erfahrung in plus dative for a field, Erfahrung mit for a thing or a tool." },
      { de: "Ungarisch ist meine Muttersprache, und ich spreche fließend Englisch.", en: "Hungarian is my native language, and I speak fluent English.", note: "die Muttersprache, your first language. You do not say fließend about your own language." },
      { de: "Ich arbeite gern im Team.", en: "I like working in a team.", note: "" },
      { de: "Ich habe eine Einladung zum Vorstellungsgespräch bekommen.", en: "I have been invited to a job interview.", note: "das Vorstellungsgespräch, literally the introduce yourself conversation." },
      { de: "Warum möchten Sie bei uns arbeiten?", en: "Why would you like to work for us?", note: "The first question in almost every interview. Answer with weil." },
      { de: "Was sind Ihre Stärken?", en: "What are your strengths?", note: "die Stärke, plural die Stärken. The opposite is die Schwäche, a weakness." },
      { de: "Ab wann könnten Sie bei uns anfangen?", en: "When could you start with us?", note: "Ab wann, from when, as in track twenty-two for the flat." },
      { de: "Auf meine Bewerbung habe ich gestern eine Zusage bekommen.", en: "Yesterday I got a positive answer to my application.", note: "die Bewerbung, the application, from sich bewerben. die Zusage is a yes, die Absage is a no. They come from zusagen and absagen." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich habe Ihre Stellenanzeige im Internet gefunden und möchte mich um die Stelle als Teamleiter bewerben.", en: "I found your job advert online and would like to apply for the position of team leader." },
      { de: "Seit acht Jahren arbeite ich bei einer Bank, deshalb habe ich viel Erfahrung in der Kundenberatung.", en: "I have been working at a bank for eight years, so I have a lot of experience in advising customers." },
      { de: "Ich habe in Budapest Wirtschaft studiert und im Studium ein Praktikum bei einer Versicherung gemacht.", en: "I studied economics in Budapest and did an internship at an insurance company during my studies." },
      { de: "Ich möchte bei Ihnen arbeiten, weil ich eine neue Aufgabe suche und gern im Team arbeite.", en: "I would like to work for you because I am looking for a new challenge and I like working in a team." },
      { de: "Im Anhang finden Sie meinen Lebenslauf. Ich freue mich auf eine Einladung zu einem persönlichen Gespräch.", en: "Attached you will find my CV. I look forward to an invitation to an interview." },
      { de: "Ich könnte ab dem ersten Februar anfangen. Vorher muss ich noch bei meinem jetzigen Arbeitgeber kündigen.", en: "I could start from the first of February. Before that I still have to hand in my notice to my current employer." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "A job interview at an insurance company in Frankfurt. Ms Lehmann from human resources asks the usual questions. Formal Sie. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Guten Tag, schön, dass Sie da sind. Erzählen Sie doch bitte etwas über sich.", you: false },
      { speaker: "B", de: "Gern. Ich habe in Budapest Wirtschaft studiert. Seit acht Jahren arbeite ich bei einer Bank in Frankfurt.", you: true },
      { speaker: "A", de: "Warum möchten Sie bei uns arbeiten?", you: false },
      { speaker: "B", de: "Ich möchte bei Ihnen arbeiten, weil ich eine neue Aufgabe suche. Außerdem habe ich viel Gutes über Ihre Firma gehört.", you: true },
      { speaker: "A", de: "Was sind Ihre Stärken?", you: false },
      { speaker: "B", de: "Ich arbeite gern im Team, und ich habe viel Erfahrung in der Kundenberatung.", you: true },
      { speaker: "A", de: "Sprechen Sie auch Fremdsprachen?", you: false },
      { speaker: "B", de: "Ja. Ungarisch ist meine Muttersprache, und ich spreche fließend Englisch. Mein Deutsch wird jeden Tag besser.", you: true },
      { speaker: "A", de: "Sehr gut. Ab wann könnten Sie bei uns anfangen?", you: false },
      { speaker: "B", de: "Ab dem ersten Februar. Vorher muss ich noch bei meinem jetzigen Arbeitgeber kündigen.", you: true }
    ] }
  ]
},

{
  id: "s3-43",
  season: "s3",
  n: 43,
  title: "At work",
  minutes: 13,
  audio: "audio/s3-43.mp3",
  intro: "Office life turns up in every part of the exam: phone messages about meetings in listening, an e-mail to your boss in writing, your working day in speaking. This track gives you the office words and the small time words that hold them together, um, bis, ab, vor and nach, plus vom and bis zum for dates.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich habe heute den ganzen Vormittag Besprechungen.", en: "I have meetings all morning today.", note: "die Besprechung, the meeting. den ganzen Vormittag, all morning, is in the accusative." },
      { de: "Die Besprechung fängt um halb zehn an.", en: "The meeting starts at half past nine.", note: "halb zehn is half past nine: half way to ten. anfangen splits: fängt near the front, an at the end." },
      { de: "Wir haben die Besprechung auf Donnerstag verschoben.", en: "We have moved the meeting to Thursday.", note: "verschieben auf plus accusative: to a new day." },
      { de: "Der Bericht muss bis Freitag fertig sein.", en: "The report has to be finished by Friday.", note: "bis Freitag, by Friday: the deadline." },
      { de: "Vor dem Kundentermin muss ich noch die Präsentation vorbereiten.", en: "Before the client meeting I still have to prepare the presentation.", note: "vor plus dative: vor dem Termin. vorbereiten splits too: ich bereite die Präsentation vor." },
      { de: "Ab Montag arbeite ich wieder im Büro.", en: "From Monday I will be working in the office again.", note: "ab, from a point in time onwards." },
      { de: "Ich möchte Urlaub vom dritten bis zum vierzehnten August beantragen.", en: "I would like to request leave from the third to the fourteenth of August.", note: "vom and bis zum, from and to, with dates. Urlaub beantragen, to apply for leave." },
      { de: "Ich habe diese Woche schon fünf Überstunden gemacht.", en: "I have already done five hours of overtime this week.", note: "die Überstunde, an extra hour at work. Überstunden machen, to work overtime." },
      { de: "Kann ich dafür am Freitag früher gehen?", en: "Can I leave earlier on Friday to make up for it?", note: "dafür here means in return for it." },
      { de: "Ich melde mich für heute krank.", en: "I am calling in sick for today.", note: "sich krankmelden, to call in sick: you do it on the first morning, before work starts. It splits: ich melde mich krank." },
      { de: "Der Arzt hat mich bis Mittwoch krankgeschrieben.", en: "The doctor has signed me off sick until Wednesday.", note: "krankschreiben is what the doctor does, as in track nineteen." },
      { de: "Kannst du mich bitte vertreten?", en: "Can you please cover for me?", note: "vertreten, to stand in for someone. Many colleagues in Germany say du to each other." },
      { de: "Ein Kunde hat angerufen. Er bittet um Rückruf.", en: "A customer called. He is asking for a call back.", note: "anrufen splits, and its participle is angerufen. der Rückruf, a call back." },
      { de: "Ich rufe ihn nach der Mittagspause zurück.", en: "I will call him back after the lunch break.", note: "nach plus dative: nach der Pause." },
      { de: "Ich verstehe mich gut mit meinen Kollegen.", en: "I get on well with my colleagues.", note: "sich verstehen mit, to get on with someone. der Kollege, die Kollegin, plural die Kollegen." },
      { de: "Schönen Feierabend!", en: "Have a nice evening!", note: "Feierabend is the end of the working day. Colleagues say this when someone goes home." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Die Besprechung fängt um halb zehn an, deshalb muss ich vorher noch die Präsentation vorbereiten.", en: "The meeting starts at half past nine, so before that I still have to prepare the presentation." },
      { de: "Guten Morgen, Herr Brandt. Leider habe ich Fieber und melde mich für heute krank.", en: "Good morning, Mr Brandt. Unfortunately I have a temperature and I am calling in sick for today." },
      { de: "Der Arzt hat mich bis Mittwoch krankgeschrieben. Kannst du mich bitte in der Besprechung vertreten?", en: "The doctor has signed me off sick until Wednesday. Can you please cover for me in the meeting?" },
      { de: "Ich möchte gern Urlaub vom dritten bis zum vierzehnten August beantragen, wenn das möglich ist.", en: "I would like to request leave from the third to the fourteenth of August, if that is possible." },
      { de: "Ich habe diese Woche schon fünf Überstunden gemacht. Kann ich dafür am Freitag früher gehen?", en: "I have already done five hours of overtime this week. Can I leave earlier on Friday to make up for it?" },
      { de: "Ein Kunde hat angerufen, aber ich rufe ihn erst nach der Mittagspause zurück.", en: "A customer called, but I will only call him back after the lunch break." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Late afternoon in the office. Your colleague Jonas tells you about a moved meeting and a customer call, and asks about your holiday. Colleagues, so du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Hallo János! Wir haben die Besprechung mit dem Kunden auf Donnerstag verschoben. Passt dir das?", you: false },
      { speaker: "B", de: "Ja, am Donnerstag passt es mir gut. Um wie viel Uhr fängt sie an?", you: true },
      { speaker: "A", de: "Um halb zehn. Ach ja, und ein Kunde, Herr Fischer, hat angerufen. Er bittet um Rückruf.", you: false },
      { speaker: "B", de: "Danke. Dann rufe ich ihn morgen früh zurück.", you: true },
      { speaker: "A", de: "Sag mal, du hast doch im August Urlaub, oder?", you: false },
      { speaker: "B", de: "Ja, ich habe Urlaub vom dritten bis zum vierzehnten August beantragt. Kannst du mich in dieser Zeit vertreten?", you: true },
      { speaker: "A", de: "Klar, kein Problem. Machst du heute wieder Überstunden?", you: false },
      { speaker: "B", de: "Nein, heute nicht. Ich habe diese Woche schon fünf Überstunden gemacht.", you: true },
      { speaker: "A", de: "Na dann, schönen Feierabend!", you: false },
      { speaker: "B", de: "Danke, dir auch! Bis morgen.", you: true }
    ] }
  ]
},

{
  id: "s3-44",
  season: "s3",
  n: 44,
  title: "Authorities and forms",
  minutes: 13,
  audio: "audio/s3-44.mp3",
  intro: "Offices and forms are part of life in Germany and a classic in the exam: instructions in reading and listening, a question to an office in writing. This track teaches the polite command with Sie and the split verbs of every office, like anmelden, mitbringen and ausfüllen, and it takes you through a visit to the Bürgeramt in Frankfurt.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich bin umgezogen und möchte mich anmelden.", en: "I have moved and would like to register my new address.", note: "sich anmelden, to register where you live. In Germany you must do it at the Bürgeramt within two weeks of moving. umziehen takes sein: ich bin umgezogen." },
      { de: "Haben Sie einen Termin?", en: "Do you have an appointment?", note: "In Frankfurt you usually book the appointment online first." },
      { de: "Welche Unterlagen muss ich mitbringen?", en: "Which documents do I have to bring?", note: "die Unterlagen, the documents, is almost always plural." },
      { de: "Bringen Sie bitte Ihren Ausweis oder Ihren Reisepass mit.", en: "Please bring your identity card or your passport.", note: "The polite command: verb first, then Sie. The small part of a split verb still goes to the end: mit." },
      { de: "Sie brauchen auch die Bestätigung vom Vermieter.", en: "You also need the confirmation from your landlord.", note: "der Vermieter, the landlord, from track twenty-two. He confirms that you live in the flat." },
      { de: "Füllen Sie bitte zuerst dieses Formular aus.", en: "Please fill in this form first.", note: "ausfüllen, to fill in, splits the same way: Füllen Sie das Formular aus." },
      { de: "Was muss ich hier eintragen?", en: "What do I have to write here?", note: "eintragen, to write something into a box or a line." },
      { de: "Tragen Sie hier Ihr Geburtsdatum und Ihren Geburtsort ein.", en: "Enter your date of birth and your place of birth here.", note: "eintragen splits like ausfüllen: Tragen Sie hier Ihren Namen ein." },
      { de: "Was bedeutet hier das Wort Familienstand?", en: "What does the word Familienstand mean here?", note: "Familienstand is your marital status: ledig, verheiratet or geschieden, single, married or divorced." },
      { de: "Unterschreiben Sie bitte hier unten.", en: "Please sign down here.", note: "unterschreiben does not split: Unterschreiben Sie, ich unterschreibe." },
      { de: "Ich möchte einen Antrag auf Kindergeld stellen.", en: "I would like to apply for child benefit.", note: "einen Antrag stellen, to put in an application. Antrag auf plus accusative: an application for something." },
      { de: "Bei welchem Amt bekomme ich das Formular?", en: "Which office do I get the form from?", note: "das Amt, a public office: das Bürgeramt for your address, das Finanzamt for taxes. bei plus dative: bei welchem Amt." },
      { de: "Wie lange dauert die Bearbeitung?", en: "How long does it take to process?", note: "die Bearbeitung, from bearbeiten, to deal with a case. Listen for the answer in days or weeks." },
      { de: "Ihr Antrag ist leider noch nicht vollständig.", en: "Unfortunately your application is not complete yet.", note: "vollständig, complete: nothing is missing." },
      { de: "Es fehlt noch eine Unterschrift.", en: "A signature is still missing.", note: "fehlen, to be missing: es fehlt, it is missing." },
      { de: "Sie bekommen die Antwort in ungefähr vier Wochen per Post.", en: "You will get the answer by post in about four weeks.", note: "Listen for the time: in vier Wochen means four weeks from now." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Guten Tag, ich bin letzte Woche umgezogen und möchte mich unter meiner neuen Adresse anmelden.", en: "Good day, I moved last week and would like to register my new address." },
      { de: "Können Sie mir sagen, welche Unterlagen ich mitbringen muss?", en: "Can you tell me which documents I have to bring?" },
      { de: "Bringen Sie bitte Ihren Ausweis und die Bestätigung vom Vermieter mit.", en: "Please bring your identity card and the confirmation from your landlord." },
      { de: "Füllen Sie zuerst das Formular aus und unterschreiben Sie dann hier unten.", en: "First fill in the form, and then sign down here." },
      { de: "Ich möchte einen Antrag auf Kindergeld stellen. Wie lange dauert die Bearbeitung?", en: "I would like to apply for child benefit. How long does it take to process?" },
      { de: "Ihr Antrag ist leider noch nicht vollständig, weil noch eine Unterschrift fehlt.", en: "Unfortunately your application is not complete yet, because a signature is still missing." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "At the Bürgeramt in Frankfurt: you have moved and register your new address. The clerk checks your documents and helps you with the form. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Tag. Haben Sie einen Termin?", you: false },
      { speaker: "B", de: "Ja, um zehn nach neun. Ich bin umgezogen und möchte mich anmelden.", you: true },
      { speaker: "A", de: "Haben Sie Ihren Ausweis und die Bestätigung vom Vermieter dabei?", you: false },
      { speaker: "B", de: "Ja, hier ist mein Reisepass, und hier ist die Bestätigung.", you: true },
      { speaker: "A", de: "Danke. Füllen Sie bitte noch dieses Formular aus.", you: false },
      { speaker: "B", de: "Entschuldigung, was muss ich hier eintragen?", you: true },
      { speaker: "A", de: "Hier tragen Sie Ihren Familienstand ein, also ledig, verheiratet oder geschieden.", you: false },
      { speaker: "B", de: "Ah, verstehe. Ich bin verheiratet. Muss ich auch unterschreiben?", you: true },
      { speaker: "A", de: "Ja, bitte hier unten. So, hier ist Ihre Meldebestätigung.", you: false },
      { speaker: "B", de: "Vielen Dank für Ihre Hilfe. Auf Wiedersehen!", you: true }
    ] }
  ]
},

{
  id: "s3-45",
  season: "s3",
  n: 45,
  title: "Travel problems",
  minutes: 14,
  audio: "audio/s3-45.mp3",
  intro: "Trains in Germany are often late, and the listening exam loves station announcements. This track teaches the words you hear on the platform, wegen with the genitive as in wegen eines Unfalls, and what to say when you miss a connection or your hotel room is not right.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Mein Zug hat zwanzig Minuten Verspätung.", en: "My train is twenty minutes late.", note: "Verspätung haben, to be late: for trains, buses and planes." },
      { de: "Der Zug nach Hamburg fällt heute aus.", en: "The train to Hamburg is cancelled today.", note: "ausfallen, to be cancelled, splits: fällt near the front, aus at the end." },
      { de: "Wegen eines Unfalls hat der Zug Verspätung.", en: "Because of an accident the train is delayed.", note: "wegen, because of, takes the genitive in announcements and in writing: wegen eines Unfalls. In everyday speech many people use the dative: wegen dem Unfall." },
      { de: "Wegen des Streiks fahren heute nur wenige Züge.", en: "Because of the strike only a few trains are running today.", note: "des Streiks is the genitive of der Streik. Rail strikes are big news in Germany." },
      { de: "Hast du die Durchsage verstanden?", en: "Did you understand the announcement?", note: "die Durchsage, an announcement over the loudspeaker." },
      { de: "Der Zug fährt heute ausnahmsweise von Gleis neun ab.", en: "Today, as an exception, the train leaves from platform nine.", note: "ausnahmsweise tells you that something has changed. Listen for the new platform number." },
      { de: "Ich habe meinen Anschluss verpasst.", en: "I have missed my connection.", note: "der Anschluss, the connecting train. verpassen, to miss." },
      { de: "Wann fährt der nächste Zug nach München?", en: "When does the next train to Munich leave?", note: "" },
      { de: "Muss ich umsteigen?", en: "Do I have to change trains?", note: "umsteigen, to change trains, splits: Sie steigen in Mannheim um." },
      { de: "Kann ich mit meiner Fahrkarte auch einen anderen Zug nehmen?", en: "Can I take a different train with my ticket?", note: "die Fahrkarte, the ticket. Many people also say das Ticket." },
      { de: "Ab einer Stunde Verspätung bekommt man Geld zurück.", en: "If the train is an hour late or more, you get money back.", note: "ab plus dative: from that point on. So keep your ticket." },
      { de: "Ich möchte mich über mein Zimmer beschweren.", en: "I would like to complain about my room.", note: "sich beschweren über plus accusative, like the verbs with prepositions in track thirty." },
      { de: "Ich habe ein ruhiges Doppelzimmer mit Bad gebucht.", en: "I booked a quiet double room with a bathroom.", note: "" },
      { de: "Das Zimmer liegt direkt an der Straße und ist sehr laut.", en: "The room is right on the street and it is very loud.", note: "" },
      { de: "Könnten Sie mir bitte ein anderes Zimmer geben?", en: "Could you please give me a different room?", note: "Könnten for polite requests, as in track twenty-four." },
      { de: "Es tut uns leid. Wir kümmern uns sofort darum.", en: "We are sorry. We will deal with it right away.", note: "sich kümmern um from track twenty-nine. darum stands for um das Problem: about it." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Wegen eines Unfalls hatte mein Zug vierzig Minuten Verspätung, deshalb habe ich meinen Anschluss verpasst.", en: "Because of an accident my train was forty minutes late, so I missed my connection." },
      { de: "Entschuldigung, wann fährt der nächste Zug nach München, und wo muss ich umsteigen?", en: "Excuse me, when does the next train to Munich leave, and where do I have to change?" },
      { de: "Hast du die Durchsage verstanden? Der Zug nach Hamburg fällt heute aus.", en: "Did you understand the announcement? The train to Hamburg is cancelled today." },
      { de: "Guten Abend, ich möchte mich über mein Zimmer beschweren. Die Heizung funktioniert nicht.", en: "Good evening, I would like to complain about my room. The heating does not work." },
      { de: "Ich habe ein ruhiges Zimmer gebucht, aber dieses Zimmer liegt direkt an der Straße und ist sehr laut.", en: "I booked a quiet room, but this room is right on the street and it is very loud." },
      { de: "Ich behalte meine Fahrkarte, weil man ab einer Stunde Verspätung Geld zurückbekommt.", en: "I am keeping my ticket, because if the train is an hour late or more, you get money back." }
    ] },
    { type: "text", heading: "Announcements at the station", intro: "Two announcements at Frankfurt main station, as in the listening exam. Listen for three things: what the problem is, which platform, and what passengers should do.", lines: [
      "Meine Damen und Herren, eine Information zum Zug nach Köln, Abfahrt zehn Uhr fünfzehn.",
      "Wegen einer Störung hat dieser Zug heute etwa dreißig Minuten Verspätung.",
      "Bitte beachten Sie: Der Zug fährt heute ausnahmsweise von Gleis neun ab.",
      "Und nun eine Information für Reisende nach Hamburg.",
      "Der Zug nach Hamburg um zehn Uhr zwanzig fällt heute leider aus.",
      "Bitte nehmen Sie den nächsten Zug um elf Uhr zwanzig. Ihre Fahrkarte gilt auch für diesen Zug.",
      "Wir bitten um Ihr Verständnis."
    ] },
    { type: "dialogue", heading: "Conversation", intro: "You are travelling from Frankfurt to Munich. Your train was late and you missed your connection in Mannheim, so you go to the information desk. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Tag, wie kann ich Ihnen helfen?", you: false },
      { speaker: "B", de: "Guten Tag. Mein Zug hatte vierzig Minuten Verspätung, und ich habe meinen Anschluss nach München verpasst.", you: true },
      { speaker: "A", de: "Das tut mir leid. Darf ich bitte Ihre Fahrkarte sehen?", you: false },
      { speaker: "B", de: "Ja, hier, bitte. Wann fährt der nächste Zug nach München?", you: true },
      { speaker: "A", de: "Um vierzehn Uhr zwölf, von Gleis drei.", you: false },
      { speaker: "B", de: "Kann ich mit meiner Fahrkarte auch diesen Zug nehmen?", you: true },
      { speaker: "A", de: "Ja, natürlich. Ihre Fahrkarte gilt auch für diesen Zug.", you: false },
      { speaker: "B", de: "Gut. Muss ich noch einmal umsteigen?", you: true },
      { speaker: "A", de: "Nein, der Zug fährt direkt. Und wenn Sie eine Stunde oder mehr zu spät ankommen, bekommen Sie Geld zurück.", you: false },
      { speaker: "B", de: "Super, das ist gut zu wissen. Vielen Dank für Ihre Hilfe!", you: true }
    ] }
  ]
},

{
  id: "s3-46",
  season: "s3",
  n: 46,
  title: "Media and technology",
  minutes: 13,
  audio: "audio/s3-46.mp3",
  intro: "Media and technology are among the most common exam topics: in the reading texts, in the forum post and in the discussion. This track gives you the words for social networks, data protection and being online all the time, plus two new lines for a discussion. The grammar is the genitive after three prepositions: wegen, which you met in the last track, plus trotz and während.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich habe mein Handy fast immer dabei.", en: "I almost always have my phone with me.", note: "dabeihaben means to have something on you. dabei goes to the end." },
      { de: "Viele Leute sind heute ständig online.", en: "Many people today are online all the time.", note: "ständig means constantly, and it usually sounds a little critical." },
      { de: "Ich nutze soziale Netzwerke vor allem, um mit Freunden in Kontakt zu bleiben.", en: "I use social networks mainly to stay in touch with friends.", note: "Review: um with zu says what something is for. zu and the verb go to the end." },
      { de: "Mit meiner Familie in Ungarn telefoniere ich oft per Video.", en: "I often talk to my family in Hungary by video call.", note: "Start with what matters most. The verb still stays in second place." },
      { de: "Während der Arbeit schaue ich nur selten aufs Handy.", en: "During work I only rarely look at my phone.", note: "während, during, takes the genitive: die Arbeit becomes während der Arbeit." },
      { de: "Wegen der vielen Nachrichten kann ich mich schlecht konzentrieren.", en: "Because of all the messages, I find it hard to concentrate.", note: "Review from the last track: wegen, because of, takes the genitive. In the plural, die becomes der." },
      { de: "Trotz der Nachteile nutze ich soziale Netzwerke jeden Tag.", en: "Despite the disadvantages, I use social networks every day.", note: "trotz, despite, is the third genitive word. Learn the three together: wegen, trotz, während." },
      { de: "Der Datenschutz ist mir sehr wichtig.", en: "Data protection is very important to me.", note: "mir is the dative: important to me." },
      { de: "Viele wissen nicht, was mit ihren Daten passiert.", en: "Many people do not know what happens to their data.", note: "An indirect question: after was, the verb goes to the end, just like after ob and wann." },
      { de: "Ich benutze für jedes Konto ein anderes Passwort.", en: "I use a different password for every account.", note: "das Konto is an account, at the bank and online." },
      { de: "Ich poste keine Fotos von meinen Kindern im Internet.", en: "I do not post any photos of my children on the internet.", note: "posten works like any regular German verb: ich poste, ich habe gepostet." },
      { de: "Ich lese die Nachrichten meistens auf dem Handy.", en: "I mostly read the news on my phone.", note: "die Nachrichten means the news, and also messages. The context tells you which." },
      { de: "Man darf nicht alles glauben, was im Internet steht.", en: "You must not believe everything that is on the internet.", note: "Written things stehen somewhere in German: Was steht in der Zeitung? What does the paper say?" },
      { de: "Ich bin der Meinung, dass man öfter offline sein sollte.", en: "I am of the opinion that people should be offline more often.", note: "A strong opinion opener. dass sends both verbs to the end, and sollte comes last." },
      { de: "Da stimme ich dir zu.", en: "I agree with you there.", note: "zustimmen, to agree, takes the dative: dir. For a polite no, use Ich sehe das ein bisschen anders, from track twenty-seven." },
      { de: "Es kommt darauf an, wie man das Internet nutzt.", en: "It depends on how you use the internet.", note: "The perfect answer when you do not want to say just yes or no." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Trotz der Nachteile nutze ich soziale Netzwerke, um mit meiner Familie in Kontakt zu bleiben.", en: "Despite the disadvantages, I use social networks to stay in touch with my family." },
      { de: "Ein großer Vorteil ist, dass man im Internet schnell Informationen findet.", en: "A big advantage is that you find information quickly on the internet." },
      { de: "Ein Nachteil ist aber, dass viele nicht wissen, was mit ihren Daten passiert.", en: "A disadvantage, though, is that many people do not know what happens to their data." },
      { de: "Wegen der vielen Nachrichten schalte ich mein Handy während des Abendessens aus.", en: "Because of all the messages, I switch my phone off during dinner." },
      { de: "Ich sehe das ein bisschen anders. Es kommt darauf an, wie man das Internet nutzt, und nicht, wie lange.", en: "I see that a little differently. It depends on how you use the internet, not on how long." },
      { de: "Ich bin der Meinung, dass man öfter offline sein sollte, weil das Leben nicht nur im Internet stattfindet.", en: "I am of the opinion that people should be offline more often, because life does not only happen on the internet." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Lunch break at the bank: your colleague Moritz loves social networks and asks what you think about them. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Sag mal, bist du eigentlich in sozialen Netzwerken aktiv?", you: false },
      { speaker: "B", de: "Ja, aber nicht besonders. Ich nutze sie vor allem, um mit meiner Familie in Ungarn in Kontakt zu bleiben.", you: true },
      { speaker: "A", de: "Ich finde soziale Netzwerke super. Da ist man immer gut informiert.", you: false },
      { speaker: "B", de: "Ich sehe das ein bisschen anders. Viele Leute sind heute ständig online, und das finde ich nicht gesund.", you: true },
      { speaker: "A", de: "Und was ist mit dem Datenschutz?", you: false },
      { speaker: "B", de: "Der Datenschutz ist mir sehr wichtig. Deshalb poste ich keine Fotos von meinen Kindern.", you: true },
      { speaker: "A", de: "Ich lese die Nachrichten nur noch auf dem Handy. Das ist doch praktisch.", you: false },
      { speaker: "B", de: "Ja, aber man darf nicht alles glauben, was im Internet steht.", you: true },
      { speaker: "A", de: "Da stimme ich dir zu. Bist du abends auch noch online?", you: false },
      { speaker: "B", de: "Meistens nicht. Wegen der vielen Nachrichten schalte ich mein Handy abends um neun aus.", you: true }
    ] }
  ]
},

{
  id: "s3-47",
  season: "s3",
  n: 47,
  title: "Environment",
  minutes: 13,
  audio: "audio/s3-47.mp3",
  intro: "The environment is a favourite topic for the forum post and for discussions, and in Germany it starts at the bin. This track gives you the everyday words, from separating rubbish to saving energy, and two grammar points: the future with werden for plans and predictions, and statt, instead of, as in by bike instead of by car.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "In Deutschland trennt man den Müll.", en: "In Germany you separate your rubbish.", note: "man means people in general. Separating rubbish is the first rule every newcomer learns." },
      { de: "Papier kommt in die blaue Tonne, Plastik in die gelbe.", en: "Paper goes in the blue bin, plastic in the yellow one.", note: "Review: in die Tonne answers wohin, where to, so it takes the accusative. In Frankfurt all packaging goes in the yellow bin, not only plastic." },
      { de: "Ich versuche, Plastik zu vermeiden.", en: "I try to avoid plastic.", note: "versuchen takes zu, and zu with the verb goes to the end." },
      { de: "Zum Einkaufen nehme ich immer eine Tasche mit.", en: "I always take a bag with me for shopping.", note: "mitnehmen splits: nehme near the front, mit at the very end." },
      { de: "Wir sollten mehr Energie sparen.", en: "We should save more energy.", note: "" },
      { de: "Wenn ich das Zimmer verlasse, mache ich das Licht aus.", en: "When I leave the room, I switch off the light.", note: "After the wenn part, the main part starts with its verb: mache ich." },
      { de: "Plastik schadet der Umwelt.", en: "Plastic harms the environment.", note: "schaden takes the dative: der Umwelt." },
      { de: "Am Wochenende fahren wir mit dem Fahrrad statt mit dem Auto.", en: "At the weekend we go by bike instead of by car.", note: "statt means instead of. Here it simply stands between the two options." },
      { de: "Statt mit dem Auto zu fahren, nehme ich die Straßenbahn.", en: "Instead of driving, I take the tram.", note: "statt with zu works like um with zu: zu and the verb go to the end of that part." },
      { de: "Das Klima ändert sich.", en: "The climate is changing.", note: "sich ändern, to change, is reflexive in German." },
      { de: "In Zukunft wird es mehr heiße Sommer geben.", en: "In the future there will be more hot summers.", note: "The future: wird in second place, the infinitive at the very end. With es and geben it means there will be." },
      { de: "Ich werde weniger Fleisch essen.", en: "I am going to eat less meat.", note: "ich werde makes a plan sound like a promise. For simple plans Germans often just use the present: Morgen fahre ich mit dem Fahrrad." },
      { de: "Die Politik muss mehr für die Umwelt tun.", en: "Politicians have to do more for the environment.", note: "die Politik means politics, and also the politicians as a group." },
      { de: "Jeder kann etwas für die Umwelt tun.", en: "Everyone can do something for the environment.", note: "" },
      { de: "Ich glaube nicht, dass das allein reicht.", en: "I do not think that this alone is enough.", note: "reichen means to be enough. You will hear Das reicht! all the time." },
      { de: "Wir werden sehen.", en: "We will see.", note: "Probably the most common future sentence in German. In everyday speech you also hear Mal sehen." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich trenne den Müll und versuche, Plastik zu vermeiden.", en: "I separate my rubbish and try to avoid plastic." },
      { de: "Statt mit dem Auto zu fahren, nehme ich die Straßenbahn, weil das besser für die Umwelt ist.", en: "Instead of driving, I take the tram, because it is better for the environment." },
      { de: "Wenn wir nichts ändern, wird es in Zukunft mehr heiße Sommer geben.", en: "If we do not change anything, there will be more hot summers in the future." },
      { de: "Meiner Meinung nach kann jeder etwas für die Umwelt tun, zum Beispiel Energie sparen.", en: "In my opinion everyone can do something for the environment, for example save energy." },
      { de: "Ich werde weniger Fleisch essen und am Wochenende öfter mit dem Fahrrad fahren.", en: "I am going to eat less meat and ride my bike more often at the weekend." },
      { de: "Das ist ein guter Anfang, aber ich glaube nicht, dass das allein reicht.", en: "That is a good start, but I do not think that this alone is enough." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "In the office kitchen your colleague Hannah asks what you do for the environment, and you discuss whether it helps. Informal du. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Trennst du zu Hause eigentlich den Müll?", you: false },
      { speaker: "B", de: "Ja, natürlich. Papier kommt in die blaue Tonne, Plastik in die gelbe.", you: true },
      { speaker: "A", de: "Und was machst du sonst noch für die Umwelt?", you: false },
      { speaker: "B", de: "Ich versuche, Plastik zu vermeiden. Zum Einkaufen nehme ich immer eine Tasche mit.", you: true },
      { speaker: "A", de: "Ehrlich gesagt glaube ich, dass das nicht viel bringt. Die Politik muss mehr tun.", you: false },
      { speaker: "B", de: "Da hast du zum Teil recht. Trotzdem kann jeder etwas für die Umwelt tun.", you: true },
      { speaker: "A", de: "Und wie kommst du zur Arbeit? Mit dem Auto?", you: false },
      { speaker: "B", de: "Nein, mit dem Roller. Und am Wochenende fahren wir oft mit dem Fahrrad statt mit dem Auto.", you: true },
      { speaker: "A", de: "Ich will auch etwas ändern. Ab Januar werde ich mit der Straßenbahn fahren.", you: false },
      { speaker: "B", de: "Gute Idee! Und ich werde weniger Fleisch essen. Wir werden sehen, ob wir es schaffen.", you: true }
    ] }
  ]
},

{
  id: "s3-48",
  season: "s3",
  n: 48,
  title: "Health and sport",
  minutes: 13,
  audio: "audio/s3-48.mp3",
  intro: "Health comes up all over the exam: in the discussion, in the forum post, and when you give a friend advice. This track gives you the words for eating well, exercise, stress and sleep, and four time words that send the verb to the end: bevor, nachdem, seitdem and sobald. With them you can describe your routine and how it has changed.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Ich versuche, gesund zu leben.", en: "I try to live a healthy life.", note: "Review: versuchen with zu, as in the last track." },
      { de: "Ich achte auf meine Ernährung.", en: "I watch my diet.", note: "achten auf, to pay attention to, is a verb with a fixed preposition, like warten auf." },
      { de: "Ich esse viel Gemüse und wenig Zucker.", en: "I eat a lot of vegetables and little sugar.", note: "" },
      { de: "Zweimal pro Woche gehe ich morgens ins Fitnessstudio, bevor ich zur Arbeit fahre.", en: "Twice a week I go to the gym in the morning, before I go to work.", note: "bevor, before, sends the verb to the end: fahre." },
      { de: "Nachdem ich trainiert habe, frühstücke ich in Ruhe.", en: "After I have worked out, I have breakfast without rushing.", note: "nachdem, after: that action is already finished, so it takes the Perfekt, trainiert habe. The main part then starts with its verb." },
      { de: "Seitdem ich regelmäßig Sport mache, schlafe ich besser.", en: "Since I started doing sport regularly, I have been sleeping better.", note: "seitdem, since: German uses the present tense where English says I have been." },
      { de: "Sobald die Kinder im Bett sind, habe ich endlich Zeit für mich.", en: "As soon as the children are in bed, I finally have time for myself.", note: "sobald, as soon as, works like wenn: the verb goes to the end." },
      { de: "In letzter Zeit habe ich viel Stress bei der Arbeit.", en: "Lately I have had a lot of stress at work.", note: "in letzter Zeit means lately. German uses the present tense here too." },
      { de: "Gegen Stress hilft mir Bewegung an der frischen Luft.", en: "Exercise in the fresh air helps me against stress.", note: "helfen takes the dative: mir. Bewegung means any kind of exercise, even walking." },
      { de: "Ich schlafe zu wenig, meistens nur sechs Stunden.", en: "I sleep too little, usually only six hours.", note: "" },
      { de: "Man sollte mindestens sieben Stunden schlafen.", en: "You should sleep at least seven hours.", note: "man sollte gives advice to everyone, without pointing at anyone." },
      { de: "Im Büro nehme ich immer die Treppe.", en: "At the office I always take the stairs.", note: "die Treppe, the stairs, is singular in German." },
      { de: "Du solltest mehr Pausen machen.", en: "You should take more breaks.", note: "German makes a break: eine Pause machen." },
      { de: "An deiner Stelle würde ich zum Arzt gehen.", en: "If I were you, I would go to the doctor.", note: "Review: an deiner Stelle with würde is the classic line for advice." },
      { de: "Hast du schon mal probiert, abends spazieren zu gehen?", en: "Have you ever tried going for a walk in the evening?", note: "Advice as a friendly question. With spazieren gehen, zu goes before the last verb: spazieren zu gehen." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Seitdem ich auf meine Ernährung achte, fühle ich mich viel fitter.", en: "Since I have been watching my diet, I feel much fitter." },
      { de: "Bevor ich ins Bett gehe, lege ich das Handy weg, weil ich dann besser schlafe.", en: "Before I go to bed, I put my phone away, because then I sleep better." },
      { de: "Nachdem ich trainiert habe, frühstücke ich und fahre mit dem Roller zur Arbeit.", en: "After I have worked out, I have breakfast and ride my scooter to work." },
      { de: "Wenn du so viel Stress hast, solltest du mehr Pausen machen.", en: "If you have so much stress, you should take more breaks." },
      { de: "An deiner Stelle würde ich abends spazieren gehen, statt so lange am Computer zu sitzen.", en: "If I were you, I would go for a walk in the evening instead of sitting at the computer for so long." },
      { de: "Sobald die Kinder im Bett sind, gehe ich eine halbe Stunde spazieren, weil das gegen Stress hilft.", en: "As soon as the children are in bed, I go for a walk for half an hour, because it helps against stress." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Your friend Florian is always tired and asks how you stay so fit. You tell him your routine and give him some advice. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Du siehst richtig fit aus. Wie machst du das?", you: false },
      { speaker: "B", de: "Danke! Zweimal pro Woche gehe ich morgens ins Fitnessstudio, bevor ich zur Arbeit fahre.", you: true },
      { speaker: "A", de: "So früh? Ich bin morgens immer total müde.", you: false },
      { speaker: "B", de: "Wie viele Stunden schläfst du denn?", you: true },
      { speaker: "A", de: "Meistens nur fünf oder sechs. In letzter Zeit habe ich viel Stress bei der Arbeit.", you: false },
      { speaker: "B", de: "Das ist zu wenig. Man sollte mindestens sieben Stunden schlafen.", you: true },
      { speaker: "A", de: "Ich weiß. Aber abends sitze ich oft noch lange am Computer.", you: false },
      { speaker: "B", de: "Hast du schon mal probiert, abends spazieren zu gehen? Gegen Stress hilft mir Bewegung an der frischen Luft.", you: true },
      { speaker: "A", de: "Und das hilft wirklich?", you: false },
      { speaker: "B", de: "Bei mir schon. Seitdem ich regelmäßig Sport mache, schlafe ich viel besser.", you: true }
    ] }
  ]
},

{
  id: "s3-49",
  season: "s3",
  n: 49,
  title: "Living together",
  minutes: 14,
  audio: "audio/s3-49.mp3",
  intro: "Neighbours, flatmates, family: wherever people live together there are rules, and sometimes conflicts. This track gives you the words of the house rules and the polite lines to complain, to apologise and to agree. The grammar is a classic trap: nicht dürfen means you must not, but nicht müssen only means you do not have to.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "In unserem Haus gibt es eine Hausordnung.", en: "In our building there are house rules.", note: "Almost every German block of flats has a Hausordnung, a list of rules for all tenants." },
      { de: "Ab zweiundzwanzig Uhr ist Nachtruhe.", en: "Quiet hours begin at ten at night.", note: "Nachtruhe usually lasts from ten at night until six in the morning." },
      { de: "Nach zweiundzwanzig Uhr darf man keine laute Musik machen.", en: "After ten at night you are not allowed to play loud music.", note: "nicht dürfen, or kein with dürfen, means it is not allowed." },
      { de: "Wir müssen das Treppenhaus nicht putzen, das macht eine Firma.", en: "We do not have to clean the stairwell, a company does that.", note: "The trap: nicht müssen means you do not have to. For must not, German says nicht dürfen." },
      { de: "Haustiere sind in unserem Haus erlaubt.", en: "Pets are allowed in our building.", note: "erlaubt, allowed, and verboten, forbidden, are on every sign." },
      { de: "Darf man auf dem Balkon grillen?", en: "Are you allowed to have a barbecue on the balcony?", note: "Darf man asks about a rule." },
      { de: "Nein, auf dem Balkon ist Grillen leider verboten.", en: "No, unfortunately barbecuing is forbidden on the balcony.", note: "" },
      { de: "Als Student habe ich in einer Wohngemeinschaft gewohnt.", en: "As a student I lived in a shared flat.", note: "A Wohngemeinschaft is a flat that friends or students share. In everyday German people shorten it to its first letters, W and G." },
      { de: "Bei uns zu Hause hat jeder eine Aufgabe im Haushalt.", en: "At home, everyone in our family has a household chore.", note: "der Haushalt is the household. im Haushalt helfen means to help with the housework." },
      { de: "Die Nachbarn über uns machen manchmal viel Lärm.", en: "The neighbours above us sometimes make a lot of noise.", note: "der Lärm, noise. Review: über answers wo, where, so it takes the dative, as in die Wohnung über mir." },
      { de: "Es stört mich, wenn der Hund den ganzen Tag bellt.", en: "It bothers me when the dog barks all day.", note: "stören means to bother or disturb. With wenn, the verb goes to the end: bellt." },
      { de: "Entschuldigen Sie, dass ich störe.", en: "Sorry to disturb you.", note: "The polite way to start when you ring a neighbour’s doorbell." },
      { de: "Könnten Sie die Musik bitte etwas leiser machen?", en: "Could you please turn the music down a little?", note: "Review: könnten makes a request polite." },
      { de: "Das tut mir leid, das wusste ich nicht.", en: "I am sorry, I did not know that.", note: "wusste is the past of wissen. Like war and hatte, Germans prefer it to the Perfekt." },
      { de: "Können wir uns darauf einigen, dass die Kinder bis acht Uhr spielen dürfen?", en: "Can we agree that the children may play until eight o’clock?", note: "sich einigen auf, to agree on. After dass, both verbs go to the end, and dürfen comes last." },
      { de: "Wir müssen alle Rücksicht aufeinander nehmen.", en: "We all have to be considerate of each other.", note: "Rücksicht nehmen auf, to be considerate of: the key phrase for living together in Germany." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Nach zweiundzwanzig Uhr darf man keine laute Musik machen, weil dann Nachtruhe ist.", en: "After ten at night you are not allowed to play loud music, because then it is quiet time." },
      { de: "Haustiere sind erlaubt, aber es stört mich, wenn der Hund den ganzen Tag bellt.", en: "Pets are allowed, but it bothers me when the dog barks all day." },
      { de: "Entschuldigen Sie, dass ich störe. Es ist schon nach zehn. Könnten Sie die Musik bitte etwas leiser machen?", en: "Sorry to disturb you. It is already after ten. Could you please turn the music down a little?" },
      { de: "Als Student habe ich in einer Wohngemeinschaft gewohnt, und jeder hatte eine Aufgabe im Haushalt.", en: "As a student I lived in a shared flat, and everyone had a job in the household." },
      { de: "Das tut mir leid, das wusste ich nicht. Wir legen gleich morgen einen Teppich ins Kinderzimmer.", en: "I am sorry, I did not know that. We will put a rug in the children’s room first thing tomorrow." },
      { de: "Wir müssen das Treppenhaus nicht putzen, aber wir müssen den Müll richtig trennen.", en: "We do not have to clean the stairwell, but we do have to separate the rubbish properly." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "One evening your downstairs neighbour, Frau Wagner, rings your doorbell: your children are too loud. You apologise and find an agreement with her. Formal Sie. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Guten Abend. Entschuldigen Sie, dass ich störe. Mein Name ist Wagner, ich wohne direkt unter Ihnen.", you: false },
      { speaker: "B", de: "Guten Abend, Frau Wagner. Kein Problem. Was kann ich für Sie tun?", you: true },
      { speaker: "A", de: "Ihre Kinder laufen abends oft durch die Wohnung. Das ist bei mir unten sehr laut.", you: false },
      { speaker: "B", de: "Oh, das tut mir leid, das wusste ich nicht. Wann stört es Sie denn besonders?", you: true },
      { speaker: "A", de: "Vor allem spät am Abend. Ich muss morgens sehr früh aufstehen.", you: false },
      { speaker: "B", de: "Ich verstehe. Können wir uns darauf einigen, dass die Kinder nach acht Uhr nicht mehr herumlaufen?", you: true },
      { speaker: "A", de: "Das wäre sehr nett. Am Wochenende dürfen sie natürlich auch mal länger spielen.", you: false },
      { speaker: "B", de: "Danke, das ist sehr freundlich. Außerdem legen wir einen Teppich ins Kinderzimmer.", you: true },
      { speaker: "A", de: "Das ist eine gute Idee. Vielen Dank für Ihr Verständnis.", you: false },
      { speaker: "B", de: "Gern. Wir müssen ja alle Rücksicht aufeinander nehmen. Einen schönen Abend noch!", you: true }
    ] }
  ]
},

{
  id: "s3-50",
  season: "s3",
  n: 50,
  title: "Season 3 review",
  minutes: 15,
  audio: "audio/s3-50.mp3",
  intro: "The test for Season Three: the lines that carry every part of the speaking and writing exam, in exam order. First a map of the six parts, then the key lines for each part, then your teacher tests you. Say every sentence again in the pause after the English, without looking. If one feels hard, replay its track before you start Season Four.",
  sections: [
    { type: "list", heading: "The six parts", items: [
      "Sprechen, Teil eins: gemeinsam etwas planen.",
      "Sprechen, Teil zwei: ein Thema präsentieren, mit fünf Folien.",
      "Sprechen, Teil drei: eine Rückmeldung geben, eine Frage stellen und Fragen beantworten.",
      "Schreiben, Aufgabe eins: eine E-Mail an einen Freund, ungefähr achtzig Wörter.",
      "Schreiben, Aufgabe zwei: Ihre Meinung in einem Forum, ungefähr achtzig Wörter.",
      "Schreiben, Aufgabe drei: eine formelle E-Mail, ungefähr vierzig Wörter."
    ] },
    { type: "phrases", heading: "Test yourself", rows: [
      { de: "Wie wäre es, wenn wir am Samstagnachmittag feiern?", en: "How about celebrating on Saturday afternoon?", note: "Speaking part one: make a suggestion. With wenn, the verb goes to the end." },
      { de: "Das finde ich nicht so gut, weil es zu teuer ist.", en: "I do not think that is such a good idea, because it is too expensive.", note: "Speaking part one: disagree politely, and always give a reason." },
      { de: "Wer kümmert sich um die Getränke?", en: "Who will take care of the drinks?", note: "Speaking part one: share out the tasks. sich kümmern um means to take care of." },
      { de: "Dann machen wir es so: Ich übernehme das Essen, du die Getränke.", en: "Then let’s do it like this: I will take care of the food, you the drinks.", note: "Speaking part one: sum up at the end. Many candidates forget it." },
      { de: "Ich möchte heute über das Thema Einkaufen im Internet sprechen.", en: "Today I would like to talk about the topic of shopping on the internet.", note: "Speaking part two, slide one: the topic." },
      { de: "Ich habe damit folgende Erfahrungen gemacht: Ich habe schon oft Bücher online bestellt.", en: "I have had the following experiences with it: I have often ordered books online.", note: "Slide two: your own experience, in the Perfekt." },
      { de: "In meinem Heimatland ist es so, dass viele Leute im Internet bestellen.", en: "In my home country it is like this: many people order on the internet.", note: "Slide three: the situation in your country. dass sends the verb to the end." },
      { de: "Ein Nachteil ist, dass man sehr viel Verpackung wegwerfen muss.", en: "A disadvantage is that you have to throw away a lot of packaging.", note: "Slide four: advantages and disadvantages. After dass, the modal verb goes last." },
      { de: "Vielen Dank für Ihre Aufmerksamkeit.", en: "Thank you for your attention.", note: "Slide five: the last line of every presentation." },
      { de: "Mir hat gut gefallen, dass du viele Beispiele genannt hast.", en: "I liked that you gave a lot of examples.", note: "Speaking part three: feedback for your partner. Both verbs go to the end: genannt hast." },
      { de: "Ich habe eine Frage: Gibt es Dinge, die du nie online kaufen würdest?", en: "I have a question: are there things that you would never buy online?", note: "Speaking part three: one real question, with a relative clause and würde in one line." },
      { de: "Lieber Jonas, vielen Dank für deine Einladung. Ich habe mich sehr gefreut.", en: "Dear Jonas, thank you very much for your invitation. I was very pleased.", note: "Writing task one: the opening of the e-mail to a friend. After the comma, carry on with a small letter." },
      { de: "Einerseits spart man Zeit, andererseits kauft man oft zu viel.", en: "On the one hand you save time, on the other hand you often buy too much.", note: "Writing task two, the forum post: show both sides before your opinion." },
      { de: "Zum Schluss möchte ich sagen, dass ich trotzdem gern online einkaufe.", en: "To finish, I would like to say that I still like shopping online.", note: "Writing task two: the last sentence, with your opinion." },
      { de: "Sehr geehrte Frau Schulz, leider kann ich am Freitag nicht am Kurs teilnehmen.", en: "Dear Ms Schulz, unfortunately I cannot attend the course on Friday.", note: "Writing task three, the formal e-mail: the greeting, then straight to the point." },
      { de: "Es tut mir sehr leid. Ich bitte um Ihr Verständnis.", en: "I am very sorry. I ask for your understanding.", note: "Writing task three: the polite end, just before Mit freundlichen Grüßen." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich schlage vor, dass wir im Park feiern. Wer kümmert sich um die Getränke?", en: "I suggest that we celebrate in the park. Who will take care of the drinks?" },
      { de: "Ein großer Vorteil ist, dass es Zeit spart. Ein Nachteil ist aber, dass man viel Verpackung wegwerfen muss.", en: "A big advantage is that it saves time. A disadvantage, though, is that you have to throw away a lot of packaging." },
      { de: "Vielen Dank für deinen interessanten Vortrag. Ich habe eine Frage: Wie ist das bei dir persönlich?", en: "Thank you for your interesting talk. I have a question: how is it for you personally?" },
      { de: "Lieber Jonas, leider kann ich am Samstag nicht kommen, weil ich arbeiten muss. Ich freue mich auf deine Antwort.", en: "Dear Jonas, unfortunately I cannot come on Saturday, because I have to work. I look forward to your reply." },
      { de: "Ich finde Einkaufen im Internet praktisch. Trotzdem kaufe ich Kleidung lieber im Geschäft, weil ich sie anprobieren möchte.", en: "I find shopping on the internet practical. Nevertheless, I prefer to buy clothes in a shop, because I want to try them on." },
      { de: "Leider kann ich am Freitag nicht kommen, weil ich krank bin. Könnten Sie mir bitte die Unterlagen schicken?", en: "Unfortunately I cannot come on Friday, because I am ill. Could you please send me the materials?" }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Your teacher, Frau Schulz, tests you before the exam: she names a part of the exam, and you give the line. She says Sie to you; in your answers you say du to your partner and Sie in the formal e-mail. You are B.", partner: "f", lines: [
      { speaker: "A", de: "Sprechen, Teil eins: Sie planen eine Feier. Ihre Partnerin möchte in ein teures Restaurant gehen. Was sagen Sie?", you: false },
      { speaker: "B", de: "Das finde ich nicht so gut, weil es zu teuer ist. Wie wäre es, wenn wir im Park feiern? Was meinst du?", you: true },
      { speaker: "A", de: "Gut. Und wie beenden Sie Teil eins?", you: false },
      { speaker: "B", de: "Dann machen wir es so: Wir feiern am Samstag im Park, und ich übernehme das Essen.", you: true },
      { speaker: "A", de: "Teil zwei: Wie beginnen Sie Ihre Präsentation?", you: false },
      { speaker: "B", de: "Ich möchte heute über das Thema Einkaufen im Internet sprechen. Zuerst erzähle ich von meiner persönlichen Erfahrung.", you: true },
      { speaker: "A", de: "Teil drei: Ihre Partnerin hat gerade ihre Präsentation beendet. Was sagen Sie?", you: false },
      { speaker: "B", de: "Vielen Dank für deinen interessanten Vortrag. Mir hat gut gefallen, dass du viele Beispiele genannt hast.", you: true },
      { speaker: "A", de: "Sehr gut. Zum Schluss Schreiben, Aufgabe drei. Wie endet Ihre E-Mail an Ihren Chef?", you: false },
      { speaker: "B", de: "Es tut mir sehr leid. Ich bitte um Ihr Verständnis. Mit freundlichen Grüßen.", you: true }
    ] }
  ]
},

{
  id: "s4-51",
  season: "s4",
  n: 51,
  title: "Numbers, dates and announcements",
  minutes: 14,
  audio: "audio/s4-51.mp3",
  intro: "In the listening exam the answer is very often a number: a time, a date, a price, a platform or a room. This track trains your ear for dates like the third or the twenty-second, for the twenty-four hour clock, for prices, and for the small signal words like statt and ab sofort that tell you something has changed. It ends with an announcement and a voicemail, just like listening parts one and two.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Der Wievielte ist heute?", en: "What is the date today?", note: "Literally: the how-manyth is today? The answer is an ordinal number, like first or third." },
      { de: "Heute ist der achtundzwanzigste Oktober.", en: "Today is the twenty-eighth of October.", note: "After der, the ordinal ends in e: der erste, der dritte, der achtundzwanzigste." },
      { de: "Der Kurs beginnt am dritten Dezember.", en: "The course starts on the third of December.", note: "After am, it ends in en: am zweiten, am vierten. Up to nineteen you add t, from twenty st. Watch the exceptions: am ersten, am dritten, am siebten." },
      { de: "Meine Prüfung ist am zweiundzwanzigsten Februar.", en: "My exam is on the twenty-second of February.", note: "From twenty upwards: am zwanzigsten, am zweiundzwanzigsten, am einunddreißigsten." },
      { de: "Das Schwimmbad ist vom zehnten bis zum vierzehnten Januar geschlossen.", en: "The swimming pool is closed from the tenth to the fourteenth of January.", note: "vom and bis zum, from and until, both with en." },
      { de: "Das Konzert wird auf den zwölften März verschoben.", en: "The concert is being moved to the twelfth of March.", note: "auf den plus a date gives you the new date. Listen for it after verschoben." },
      { de: "Die Führung beginnt um vierzehn Uhr dreißig.", en: "The guided tour starts at half past two in the afternoon.", note: "Announcements and timetables use the twenty-four hour clock. In everyday speech the same time is halb drei." },
      { de: "Die Praxis ist montags bis freitags von acht bis zwölf Uhr geöffnet.", en: "The doctor’s practice is open Monday to Friday from eight until twelve.", note: "montags with an s means every Monday." },
      { de: "Leider rufen Sie außerhalb unserer Sprechzeiten an.", en: "Unfortunately you are calling outside our office hours.", note: "die Sprechzeiten, the hours when a doctor or an office takes calls and visitors." },
      { de: "Bitte hinterlassen Sie eine Nachricht nach dem Signalton.", en: "Please leave a message after the tone.", note: "hinterlassen, to leave behind. The standard line on every answering machine." },
      { de: "Das kostet neunzehn Euro neunundneunzig.", en: "That costs nineteen euros ninety-nine.", note: "Prices: first the euros, then the cents. Most people leave out the word Cent." },
      { de: "Für Kinder unter sechs Jahren ist der Eintritt frei.", en: "For children under six, admission is free.", note: "der Eintritt, admission. Here frei means free of charge." },
      { de: "Haben Sie dreizehn oder dreißig gesagt?", en: "Did you say thirteen or thirty?", note: "The classic trap: zehn at the end is teen, ig at the end is ty. If you are not sure, ask." },
      { de: "Der Zug zum Flughafen fährt heute von Gleis vier statt von Gleis zwei.", en: "Today the train to the airport leaves from platform four instead of platform two.", note: "statt, instead of. The new information comes first, the old one after statt." },
      { de: "Ab sofort ist die Bibliothek auch samstags geöffnet.", en: "From now on the library is also open on Saturdays.", note: "ab sofort, from now on, signals a change. In the exam the change is often the answer." },
      { de: "Das Museum gibt es seit neunzehnhundertachtundneunzig.", en: "The museum has been there since nineteen ninety-eight.", note: "Years up to nineteen ninety-nine are said in hundreds: neunzehnhundert. From two thousand on you say zweitausend, zweitausendzwölf." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Guten Tag, Sie haben die Praxis Doktor Lehmann erreicht. Leider rufen Sie außerhalb unserer Sprechzeiten an.", en: "Good day, you have reached Doctor Lehmann’s practice. Unfortunately you are calling outside our office hours." },
      { de: "Unsere Praxis ist montags bis freitags von acht bis zwölf und donnerstags auch nachmittags geöffnet.", en: "Our practice is open Monday to Friday from eight until twelve, and on Thursdays in the afternoon as well." },
      { de: "Wegen Reparaturarbeiten ist das Schwimmbad vom zehnten bis zum vierzehnten Januar geschlossen.", en: "Because of repair work, the swimming pool is closed from the tenth to the fourteenth of January." },
      { de: "Das Konzert am Freitag wird auf den zwölften März verschoben. Die Karten bleiben gültig.", en: "Friday’s concert is being moved to the twelfth of March. The tickets remain valid." },
      { de: "Entschuldigung, haben Sie dreizehn oder dreißig gesagt? Könnten Sie das bitte wiederholen?", en: "Excuse me, did you say thirteen or thirty? Could you repeat that, please?" },
      { de: "Ich wiederhole: Der Kurs beginnt am dritten Dezember um neunzehn Uhr und kostet hundertneunzig Euro.", en: "Let me repeat: the course starts on the third of December at seven in the evening and costs one hundred and ninety euros." }
    ] },
    { type: "text", heading: "An announcement and a voicemail", intro: "Listening part one style: first an announcement in a department store, then a message from your friend Lena on your voicemail. For each one, listen for the day, the time, the price and the place.", lines: [
      "Liebe Kundinnen und Kunden, heute gibt es in unserer Sportabteilung im dritten Stock alle Laufschuhe für nur neunundvierzig Euro neunzig.",
      "Im Erdgeschoss sind bis Samstag alle Taschen zwanzig Prozent günstiger.",
      "Bitte beachten Sie: Heute schließt unser Haus schon um achtzehn Uhr statt um zwanzig Uhr.",
      "Hallo, hier ist Lena. Ich rufe wegen Samstag an.",
      "Der Film um acht ist leider ausverkauft, aber um Viertel nach zehn gibt es noch Karten.",
      "Die Karten kosten elf Euro fünfzig. Ich kann sie heute Abend online kaufen.",
      "Wollen wir uns um zehn vor zehn am Eingang treffen?",
      "Ruf mich bitte bis morgen Mittag zurück. Meine Nummer ist null eins sieben sechs, achtundvierzig, dreiundneunzig, zwölf. Tschüss!"
    ] },
    { type: "dialogue", heading: "Conversation", intro: "You phone the adult education centre about an evening course for the exam, and you check every number you hear. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Volkshochschule, Anmeldung, guten Tag!", you: false },
      { speaker: "B", de: "Guten Tag. Ich interessiere mich für den Abendkurs zur Prüfungsvorbereitung. Wann beginnt er?", you: true },
      { speaker: "A", de: "Der Kurs beginnt am Donnerstag, dem dritten Dezember, um neunzehn Uhr.", you: false },
      { speaker: "B", de: "Entschuldigung, am dritten oder am dreizehnten Dezember?", you: true },
      { speaker: "A", de: "Am dritten. Danach findet der Kurs immer dienstags und donnerstags statt, bis zum elften Februar.", you: false },
      { speaker: "B", de: "Und wie viel kostet der Kurs?", you: true },
      { speaker: "A", de: "Hundertneunzig Euro. Das Buch kostet extra.", you: false },
      { speaker: "B", de: "Haben Sie hundertneunzig oder hundertneunzehn gesagt?", you: true },
      { speaker: "A", de: "Hundertneunzig. Bitte melden Sie sich bis zum zwanzigsten November an.", you: false },
      { speaker: "B", de: "Ich wiederhole: am dritten Dezember um neunzehn Uhr, hundertneunzig Euro, Anmeldung bis zum zwanzigsten November. Vielen Dank, auf Wiederhören!", you: true }
    ] }
  ]
},

{
  id: "s4-52",
  season: "s4",
  n: 52,
  title: "Connectors that hold a text together",
  minutes: 13,
  audio: "audio/s4-52.mp3",
  intro: "Reading texts are held together by small words like deshalb, trotzdem, nämlich and sondern, and by pairs like zwar and aber, or je and desto. If you know what each one signals — a result, a contrast, a reason or a correction — you find the answers in the reading tasks much faster. They also make your own e-mails and your presentation sound connected and natural.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Der Bus ist ausgefallen, deshalb bin ich zu Fuß gegangen.", en: "The bus was cancelled, so I walked.", note: "deshalb gives the result. It takes the first place, so the verb comes straight after it: deshalb bin ich." },
      { de: "Es hat den ganzen Tag geregnet. Trotzdem sind wir spazieren gegangen.", en: "It rained all day. We went for a walk anyway.", note: "trotzdem, still or anyway, works like deshalb. With obwohl the verb would go to the end instead." },
      { de: "Der Kurs ist günstig. Außerdem sind die Lehrer sehr nett.", en: "The course is cheap. Besides, the teachers are very nice.", note: "außerdem adds one more point, and the verb comes right after it." },
      { de: "Ich kann heute nicht kommen. Ich bin nämlich krank.", en: "I cannot come today. I am ill, you see.", note: "nämlich gives the reason for the sentence before. It never comes first: put it after the verb." },
      { de: "Ich lerne jeden Abend, denn im Februar ist meine Prüfung.", en: "I study every evening, because my exam is in February.", note: "denn also means because, but it does not move the verb, just like und and aber." },
      { de: "Der Kurs ist nicht am Montag, sondern am Mittwoch.", en: "The course is not on Monday but on Wednesday.", note: "sondern, but, comes only after nicht or kein. In a reading task the right answer is often after sondern." },
      { de: "Marco spricht nicht nur Italienisch, sondern auch sehr gut Deutsch.", en: "Marco speaks not only Italian but also very good German.", note: "nicht nur and sondern auch: not only, but also." },
      { de: "Sowohl die Kinder als auch die Eltern hatten viel Spaß.", en: "Both the children and the parents had a lot of fun.", note: "sowohl and als auch: both, and. The verb is plural because there are two subjects." },
      { de: "Ich hatte weder Zeit noch Lust.", en: "I had neither the time nor the desire.", note: "weder and noch: neither, nor. Do not add nicht or kein, because weder already means no." },
      { de: "Das Restaurant ist weder billig noch besonders gut.", en: "The restaurant is neither cheap nor particularly good.", note: "" },
      { de: "Je mehr ich lese, desto besser verstehe ich.", en: "The more I read, the better I understand.", note: "After je the verb goes to the end. After desto and its word, the verb comes next: desto besser verstehe ich." },
      { de: "Je früher wir losfahren, desto weniger Verkehr gibt es.", en: "The earlier we set off, the less traffic there is.", note: "" },
      { de: "Das Hotel war zwar teuer, aber das Frühstück war sehr gut.", en: "Admittedly the hotel was expensive, but the breakfast was very good.", note: "zwar and aber: you admit one point, then make a stronger one. The part after aber is what the writer really means." },
      { de: "Lena liebt Fußball. Ihr Mann dagegen liest lieber.", en: "Lena loves football. Her husband, on the other hand, prefers reading.", note: "dagegen, on the other hand, compares two people. Reading part four, where people are for or against something, is full of it." },
      { de: "Das Konzert fällt aus. Stattdessen gibt es einen Filmabend.", en: "The concert is cancelled. Instead there is a film evening.", note: "stattdessen, instead: one thing replaces another. Again the verb comes straight after it." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Ich habe schlecht geschlafen, deshalb bin ich heute müde. Trotzdem gehe ich ins Fitnessstudio.", en: "I slept badly, so I am tired today. I am going to the gym anyway." },
      { de: "Es hat zwar geregnet, aber wir sind trotzdem spazieren gegangen.", en: "It did rain, but we went for a walk anyway." },
      { de: "Der Kurs ist nicht nur günstig, sondern auch gut. Außerdem ist er ganz in der Nähe.", en: "The course is not only cheap but also good. Besides, it is very close by." },
      { de: "Leider kann ich am Samstag nicht kommen. Ich muss nämlich arbeiten.", en: "Unfortunately I cannot come on Saturday. I have to work, you see." },
      { de: "Sowohl meine Frau als auch ich arbeiten bis siebzehn Uhr, deshalb essen die Kinder mittags in der Schule.", en: "Both my wife and I work until five, so the children have lunch at school." },
      { de: "Je mehr ich auf Deutsch lese, desto schneller finde ich die Antworten in der Prüfung.", en: "The more I read in German, the faster I find the answers in the exam." }
    ] },
    { type: "text", heading: "A blog post", intro: "Reading part one style: Aylin writes on her blog about the choir she joined. Listen for the connectors. Each one tells you how the next idea fits the one before.", lines: [
      "Seit einem Jahr singe ich in einem Chor hier in Frankfurt.",
      "Am Anfang hatte ich Angst. Ich konnte nämlich weder Noten lesen noch besonders gut singen.",
      "Trotzdem bin ich jede Woche wieder hingegangen.",
      "Die anderen waren zwar alle viel besser als ich, aber sie waren sehr freundlich.",
      "Im Chor singen sowohl Studenten als auch Rentner, und alle helfen sich gegenseitig.",
      "Je öfter wir üben, desto besser klingen wir.",
      "Außerdem habe ich dort viele neue Freunde gefunden, deshalb fühle ich mich in Frankfurt jetzt richtig zu Hause.",
      "Unser Konzert ist nicht im Sommer, sondern schon am zwölften Dezember. Kommt doch vorbei!"
    ] },
    { type: "dialogue", heading: "Conversation", intro: "Your friend Jonas asks whether you are coming to Aylin’s choir concert. Use the connectors as you answer. Informal du. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Kommst du am zwölften Dezember mit zu Aylins Konzert?", you: false },
      { speaker: "B", de: "Ich würde gern kommen, aber ich habe im Moment wenig Zeit. Ich lerne nämlich für meine Prüfung.", you: true },
      { speaker: "A", de: "Das Konzert ist aber nicht am Abend, sondern schon um vier Uhr nachmittags.", you: false },
      { speaker: "B", de: "Ach so! Dann kann ich zwar nicht lange bleiben, aber ich komme gern.", you: true },
      { speaker: "A", de: "Super. Die Karten kosten nur acht Euro. Außerdem gibt es danach Kaffee und Kuchen.", you: false },
      { speaker: "B", de: "Je billiger, desto besser! Kann ich auch meine Frau und die Kinder mitbringen?", you: true },
      { speaker: "A", de: "Klar! Sowohl Kinder als auch Erwachsene sind herzlich willkommen.", you: false },
      { speaker: "B", de: "Toll. Die letzten Wochen waren sehr stressig, deshalb freue ich mich wirklich darauf.", you: true },
      { speaker: "A", de: "Und trotzdem lernst du jeden Tag Deutsch?", you: false },
      { speaker: "B", de: "Ja, jeden Tag ein bisschen. Je mehr ich übe, desto leichter wird es.", you: true }
    ] }
  ]
},

{
  id: "s4-53",
  season: "s4",
  n: 53,
  title: "All three letters",
  minutes: 14,
  audio: "audio/s4-53.mp3",
  intro: "The writing exam has three tasks: an e-mail to a friend, a post for the online guest book of a TV programme — the forum post from track forty — and a short formal e-mail. Each one starts and ends with fixed lines, so if you learn them once, you only have to think about the middle. This track also gives you the small rules that cost points: the comma after the greeting, a small letter after it, and Sie and Ihnen with a capital letter.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Betreff: Neuigkeiten aus Frankfurt", en: "Subject: news from Frankfurt.", note: "der Betreff, the subject line: a few words, no full sentence." },
      { de: "Liebe Aylin, wie geht es dir?", en: "Dear Aylin, how are you?", note: "After the greeting comes a comma, and the next line starts with a small letter, because it continues the same sentence." },
      { de: "Ich hoffe, dir und deiner Familie geht es gut.", en: "I hope you and your family are well.", note: "es geht takes the dative: dir, deiner Familie, Ihnen." },
      { de: "Entschuldige, dass ich mich so lange nicht gemeldet habe.", en: "Sorry I have not been in touch for so long.", note: "sich melden, to get in touch. A friendly first line when you have not written for a while." },
      { de: "Ich schreibe dir, weil ich eine Bitte habe.", en: "I am writing to you because I have a favour to ask.", note: "Say right at the start why you are writing." },
      { de: "Grüß bitte deine Familie von mir und melde dich bald!", en: "Please say hello to your family from me, and get in touch soon!", note: "Two commands with du: grüß and melde dich. Take the du form and drop the st: du grüßt becomes grüß, du meldest dich becomes melde dich." },
      { de: "Viele Grüße, dein János", en: "Best wishes, yours, János.", note: "A man signs with dein, a woman with deine: deine Aylin. On paper the name goes on its own line under Viele Grüße, with no comma." },
      { de: "Im Gästebuch habe ich die Meinung von Marion gelesen.", en: "In the guest book I read Marion’s opinion.", note: "In writing task two you answer one opinion from the guest book. Name the person." },
      { de: "Ich stimme Marion nur teilweise zu.", en: "I only partly agree with Marion.", note: "zustimmen, to agree with someone, takes the dative and splits: ich stimme dir zu, ich stimme ihr nicht zu." },
      { de: "Dafür gibt es zwei Gründe: Erstens funktioniert Bargeld immer, zweitens behält man den Überblick.", en: "There are two reasons for that: first, cash always works, and second, you keep track of your money.", note: "Here the topic is cash or card. erstens and zweitens take the first place, so the verb comes straight after them." },
      { de: "Zusammenfassend kann man sagen, dass beide Seiten recht haben.", en: "To sum up, you could say that both sides have a point.", note: "A strong last sentence for the guest book post." },
      { de: "Betreff: Bitte um einen Gesprächstermin", en: "Subject: request for a meeting.", note: "A formal subject line is a short noun phrase: Bitte um, Frage zu, Anmeldung zum Kurs." },
      { de: "Sehr geehrte Damen und Herren,", en: "Dear Sir or Madam,", note: "For when you do not know the name. If you know it: Sehr geehrte Frau Krüger, Sehr geehrter Herr Yılmaz." },
      { de: "ich wende mich an Sie, weil ich eine Frage habe.", en: "I am contacting you because I have a question.", note: "sich wenden an, to turn to someone. When they mean the formal you, Sie, Ihnen and Ihr always take a capital letter." },
      { de: "Hätten Sie nächste Woche Zeit für ein kurzes Gespräch?", en: "Would you have time for a short meeting next week?", note: "hätten makes the question polite, as in the complaints track." },
      { de: "Für eine kurze Antwort wäre ich Ihnen sehr dankbar.", en: "I would be very grateful for a short reply.", note: "The polite last sentence before Mit freundlichen Grüßen." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Liebe Aylin, wie geht es dir? Entschuldige, dass ich mich so lange nicht gemeldet habe.", en: "Dear Aylin, how are you? Sorry I have not been in touch for so long." },
      { de: "Ich schreibe dir, weil ich eine Bitte habe: Könntest du mir am Samstag dein Auto leihen?", en: "I am writing to you because I have a favour to ask: could you lend me your car on Saturday?" },
      { de: "Grüß bitte deine Familie von mir und melde dich bald! Viele Grüße, dein János", en: "Please say hello to your family from me, and get in touch soon! Best wishes, yours, János." },
      { de: "Im Gästebuch habe ich die Meinung von Marion gelesen. Ich stimme ihr nur teilweise zu.", en: "In the guest book I read Marion’s opinion. I only partly agree with her." },
      { de: "Zusammenfassend kann man sagen, dass wir Bargeld noch brauchen, auch wenn das Bezahlen mit Karte praktischer ist.", en: "To sum up, you could say that we still need cash, even if paying by card is more practical." },
      { de: "Sehr geehrte Frau Krüger, ich wende mich an Sie, weil ich mir Sorgen um meinen Sohn mache.", en: "Dear Ms Krüger, I am contacting you because I am worried about my son." }
    ] },
    { type: "text", heading: "The formal e-mail", intro: "Task three as you would write it in the exam: the subject line, the greeting, why you are writing, your request, and the polite ending. The task asks for about forty words; a little more is fine. Here you write to your son’s class teacher.", lines: [
      "Betreff: Bitte um einen Gesprächstermin",
      "Sehr geehrte Frau Krüger,",
      "mein Sohn ist seit September in Ihrer Klasse.",
      "Ich wende mich an Sie, weil ich mir Sorgen um seine Noten in Mathematik mache.",
      "Hätten Sie nächste Woche Zeit für ein kurzes Gespräch? Am Dienstag und am Donnerstag kann ich ab sechzehn Uhr in die Schule kommen.",
      "Für eine kurze Antwort wäre ich Ihnen sehr dankbar.",
      "Mit freundlichen Grüßen",
      "János"
    ] },
    { type: "dialogue", heading: "Conversation", intro: "In your exam preparation course, your teacher Frau Schulz checks the fixed lines for all three letters before the mock exam. Formal Sie with the teacher. You are B.", partner: "f", lines: [
      { speaker: "A", de: "So, János, morgen schreiben wir die Probeprüfung. Wie beginnen Sie die E-Mail an eine Freundin?", you: false },
      { speaker: "B", de: "Zuerst schreibe ich einen kurzen Betreff. Dann: Liebe Aylin, wie geht es dir? Entschuldige, dass ich mich so lange nicht gemeldet habe.", you: true },
      { speaker: "A", de: "Sehr schön. Und wie beenden Sie die E-Mail?", you: false },
      { speaker: "B", de: "Am Ende schreibe ich: Grüß bitte deine Familie von mir und melde dich bald! Viele Grüße, dein János.", you: true },
      { speaker: "A", de: "Richtig. Jetzt der Beitrag im Gästebuch. Wie fangen Sie da an?", you: false },
      { speaker: "B", de: "Im Gästebuch habe ich die Meinung von Marion gelesen. Ich stimme ihr nur teilweise zu.", you: true },
      { speaker: "A", de: "Und wie hört der Beitrag auf?", you: false },
      { speaker: "B", de: "Zusammenfassend kann man sagen, dass beide Seiten recht haben.", you: true },
      { speaker: "A", de: "Gut. Und zum Schluss die E-Mail an die Lehrerin Ihres Sohnes?", you: false },
      { speaker: "B", de: "Sehr geehrte Frau Krüger, ich wende mich an Sie, weil ich eine Frage habe. Und am Ende: Mit freundlichen Grüßen.", you: true }
    ] }
  ]
},

{
  id: "s4-54",
  season: "s4",
  n: 54,
  title: "All three speaking parts",
  minutes: 15,
  audio: "audio/s4-54.mp3",
  intro: "The speaking exam takes about fifteen minutes for two candidates, in three parts: planning something together, a short presentation, and feedback with questions. This track runs all three in one go, with a new task and a new topic, so you practise moving from one part to the next without losing your rhythm. If a line does not come, replay the planning and presentation tracks of Season Three.",
  sections: [
    { type: "phrases", heading: "New phrases", rows: [
      { de: "Unser Freund Lukas zieht nächsten Samstag um.", en: "Our friend Lukas is moving house next Saturday.", note: "umziehen, to move house, splits: er zieht um. In the past it takes sein: er ist umgezogen." },
      { de: "Wir wollen ihm beim Umzug helfen. Was müssen wir planen?", en: "We want to help him with the move. What do we need to plan?", note: "helfen takes the dative: ihm, him." },
      { de: "Wollen wir zuerst überlegen, wann wir uns treffen?", en: "Shall we first think about when to meet?", note: "Open part one with a question to your partner. It shows that you are working together." },
      { de: "Was hältst du davon, wenn wir einen Transporter mieten?", en: "What do you think about renting a van?", note: "" },
      { de: "Ich finde die Idee gut, aber wir brauchen auch genug Leute.", en: "I like the idea, but we also need enough people.", note: "Agree, then add a but. The examiners want to hear you react, not only make suggestions." },
      { de: "Ich kann am Freitag Kartons besorgen.", en: "I can get boxes on Friday.", note: "besorgen, to get or organise something." },
      { de: "Wer kümmert sich um das Essen für die Helfer?", en: "Who will take care of food for the helpers?", note: "" },
      { de: "Dann sind wir uns einig.", en: "Then we are agreed.", note: "A good last line for part one, after you have summed up." },
      { de: "Mein Thema heißt: Schuluniform, ja oder nein?", en: "My topic is: school uniform, yes or no?", note: "" },
      { de: "In meiner Schulzeit mussten wir keine Uniform tragen.", en: "When I was at school, we did not have to wear a uniform.", note: "Your experience is in the past, so use mussten, konnten, war and hatte." },
      { de: "In Ungarn tragen die meisten Schüler nur bei Schulfeiern ein weißes Hemd.", en: "In Hungary, most pupils wear a white shirt only for school ceremonies.", note: "" },
      { de: "Ein Vorteil ist, dass man nicht sieht, wer reich oder arm ist.", en: "One advantage is that you cannot tell who is rich or poor.", note: "Two small clauses, two verbs at the end: sieht, then ist." },
      { de: "Ein Nachteil ist, dass die Kinder ihren eigenen Stil nicht zeigen können.", en: "One disadvantage is that the children cannot show their own style.", note: "" },
      { de: "Ich bin also eher gegen eine Schuluniform.", en: "So I tend to be against school uniforms.", note: "eher, rather, makes your opinion sound careful and polite." },
      { de: "Danke für deinen Vortrag. Eine Frage hätte ich noch.", en: "Thanks for your talk. I would have one more question.", note: "hätte makes the question polite, even with du." },
      { de: "Das kommt darauf an, wie alt die Kinder sind.", en: "It depends on how old the children are.", note: "Das kommt darauf an gives you a moment to think. After wie the verb goes to the end." }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Lukas zieht nächsten Samstag um. Wollen wir zuerst überlegen, wann wir uns treffen?", en: "Lukas is moving next Saturday. Shall we first think about when to meet?" },
      { de: "Was hältst du davon, wenn wir einen Transporter mieten? Ich kann am Freitag Kartons besorgen.", en: "What do you think about renting a van? I can get boxes on Friday." },
      { de: "Ich schlage vor, dass wir um acht Uhr anfangen. Dann sind wir am Nachmittag fertig.", en: "I suggest that we start at eight. Then we will be finished in the afternoon." },
      { de: "Mein Thema heißt: Schuluniform, ja oder nein? Zuerst erzähle ich von meinen eigenen Erfahrungen.", en: "My topic is: school uniform, yes or no? First I will tell you about my own experiences." },
      { de: "Ein Vorteil ist, dass man nicht sieht, wer reich oder arm ist. Trotzdem bin ich eher dagegen.", en: "One advantage is that you cannot tell who is rich or poor. Even so, I tend to be against it." },
      { de: "Das kommt darauf an, wie alt die Kinder sind. Habe ich deine Frage beantwortet?", en: "It depends on how old the children are. Have I answered your question?" }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "The whole speaking exam in miniature with your partner Tobias: you plan Lukas’s move together, then you give a very short version of your presentation, and Tobias gives feedback and asks a question. Informal du with your partner, Sie to the examiners. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Lukas zieht nächsten Samstag um. Wollen wir ihm helfen?", you: false },
      { speaker: "B", de: "Ja, klar. Was hältst du davon, wenn wir einen Transporter mieten? Ich kann am Freitag Kartons besorgen.", you: true },
      { speaker: "A", de: "Gute Idee. Und wann fangen wir an?", you: false },
      { speaker: "B", de: "Ich schlage vor, dass wir um acht Uhr anfangen. Wer kümmert sich um das Essen für die Helfer?", you: true },
      { speaker: "A", de: "Das übernehme ich. Ich bestelle mittags Pizza für alle, und den Transporter kann ich auch mieten.", you: false },
      { speaker: "B", de: "Super. Also: Wir treffen uns am Samstag um acht Uhr bei Lukas, und ich bringe die Kartons mit. Dann sind wir uns einig.", you: true },
      { speaker: "A", de: "Prima. Und jetzt bist du mit deiner Präsentation dran.", you: false },
      { speaker: "B", de: "Mein Thema heißt: Schuluniform, ja oder nein? In meiner Schulzeit mussten wir keine Uniform tragen. In Ungarn tragen die meisten Schüler nur bei Schulfeiern ein weißes Hemd. Ein Vorteil ist, dass man nicht sieht, wer reich oder arm ist. Ein Nachteil ist, dass die Kinder ihren eigenen Stil nicht zeigen können. Ich bin also eher gegen eine Schuluniform. Vielen Dank für Ihre Aufmerksamkeit.", you: true },
      { speaker: "A", de: "Danke für deinen Vortrag. Mir hat gut gefallen, dass du von deiner Schulzeit erzählt hast. Eine Frage hätte ich noch: Sollen deine eigenen Kinder eine Uniform tragen?", you: false },
      { speaker: "B", de: "Das kommt darauf an, wie alt die Kinder sind. Bei kleinen Kindern finde ich eine Uniform praktisch, weil die Eltern morgens weniger Stress haben. Habe ich deine Frage beantwortet?", you: true }
    ] }
  ]
},

{
  id: "s4-55",
  season: "s4",
  n: 55,
  title: "The final 100",
  minutes: 15,
  audio: "audio/s4-55.mp3",
  intro: "The last track: one hundred sentences, the best of all four seasons, from who you are to the last line of a formal e-mail. Say each one with the voice the first time you listen, and before the voice the second time. Any sentence that does not come easily tells you which track to replay before the exam.",
  sections: [
    { type: "phrases", heading: "You and your story", rows: [
      { de: "Ich heiße János und komme aus Ungarn.", en: "My name is János and I come from Hungary.", note: "" },
      { de: "Ich wohne in Frankfurt und arbeite bei einer Bank.", en: "I live in Frankfurt and work at a bank.", note: "" },
      { de: "Ich bin verheiratet und habe einen Sohn und eine Tochter.", en: "I am married and have a son and a daughter.", note: "" },
      { de: "Ich lerne Deutsch, weil ich im Februar die Prüfung mache.", en: "I am learning German because I am taking the exam in February.", note: "After weil, the verb goes to the end." },
      { de: "Am Wochenende habe ich mit meinen Kindern gespielt.", en: "At the weekend I played with my children.", note: "Perfekt: haben in second place, the participle at the end." },
      { de: "Wir sind mit dem Zug nach Heidelberg gefahren.", en: "We went to Heidelberg by train.", note: "Verbs of movement from one place to another take sein." },
      { de: "Die Party war super. Es gab viel zu essen.", en: "The party was great. There was a lot to eat.", note: "" },
      { de: "Leider konnte ich nicht kommen, weil ich arbeiten musste.", en: "Unfortunately I could not come, because I had to work.", note: "" },
      { de: "Als ich ein Kind war, wohnten wir in einer kleinen Stadt.", en: "When I was a child, we lived in a small town.", note: "als for one time or one period in the past." },
      { de: "Ich freue mich schon auf das Wochenende.", en: "I am already looking forward to the weekend.", note: "sich freuen auf, to look forward to. sich freuen über, to be pleased about." },
      { de: "Ich habe ein bisschen Angst vor der Prüfung.", en: "I am a bit scared of the exam.", note: "" },
      { de: "Seit drei Tagen tut mir der Rücken weh.", en: "My back has been hurting for three days.", note: "" },
      { de: "Ich fahre mit dem Roller, obwohl es kalt ist.", en: "I ride the scooter although it is cold.", note: "" },
      { de: "Ich versuche, jeden Abend zwanzig Minuten Deutsch zu lernen.", en: "I try to study German for twenty minutes every evening.", note: "" }
    ] },
    { type: "phrases", heading: "Getting things done", rows: [
      { de: "Können Sie das bitte wiederholen?", en: "Can you repeat that, please?", note: "The most useful sentence in the whole exam." },
      { de: "Könnten Sie bitte etwas langsamer sprechen?", en: "Could you speak a little more slowly, please?", note: "" },
      { de: "Können Sie mir sagen, wann der Kurs anfängt?", en: "Can you tell me when the course starts?", note: "" },
      { de: "Ich bin nicht sicher, ob ich Sie richtig verstanden habe.", en: "I am not sure whether I understood you correctly.", note: "" },
      { de: "Ich möchte gern einen Termin vereinbaren.", en: "I would like to make an appointment.", note: "" },
      { de: "Könnten wir den Termin auf Donnerstag verschieben?", en: "Could we move the appointment to Thursday?", note: "" },
      { de: "Leider muss ich meinen Termin absagen.", en: "Unfortunately I have to cancel my appointment.", note: "" },
      { de: "Haben Sie dreizehn oder dreißig gesagt?", en: "Did you say thirteen or thirty?", note: "" },
      { de: "Ich wiederhole: am Mittwoch um Viertel vor neun.", en: "Let me repeat: on Wednesday at quarter to nine.", note: "" },
      { de: "Ich möchte die Jacke umtauschen. Hier ist der Kassenbon.", en: "I would like to exchange the jacket. Here is the receipt.", note: "" },
      { de: "Wann fährt der nächste Zug nach München?", en: "When does the next train to Munich leave?", note: "" },
      { de: "Welche Unterlagen muss ich mitbringen?", en: "Which documents do I need to bring?", note: "" },
      { de: "Ich melde mich für heute krank.", en: "I am calling in sick for today.", note: "" },
      { de: "Könnten Sie die Musik bitte etwas leiser machen?", en: "Could you turn the music down a little, please?", note: "" }
    ] },
    { type: "phrases", heading: "Grammar that scores", rows: [
      { de: "Es ist ein Gerät, mit dem man Kaffee macht.", en: "It is a machine that you make coffee with.", note: "When you do not know a word, describe it with a relative clause." },
      { de: "Das ist die Kollegin, die mir am meisten geholfen hat.", en: "That is the colleague who helped me the most.", note: "" },
      { de: "Der Drucker ist kaputt und muss repariert werden.", en: "The printer is broken and needs to be repaired.", note: "" },
      { de: "Die Besprechung wurde auf Donnerstag verschoben.", en: "The meeting was moved to Thursday.", note: "" },
      { de: "Ich habe ein neues Büro mit einem großen Fenster.", en: "I have a new office with a big window.", note: "" },
      { de: "Ich trinke lieber Tee als Kaffee.", en: "I prefer tea to coffee.", note: "" },
      { de: "Ich habe die Schlüssel auf den Tisch gelegt.", en: "I put the keys on the table.", note: "A movement to a place takes the accusative: auf den Tisch. A position takes the dative: auf dem Tisch." },
      { de: "Wenn ich mehr Zeit hätte, würde ich öfter Freunde treffen.", en: "If I had more time, I would meet friends more often.", note: "" },
      { de: "An deiner Stelle würde ich zum Arzt gehen.", en: "If I were you, I would go to the doctor.", note: "" },
      { de: "Es ist wichtig, jeden Tag ein bisschen zu üben.", en: "It is important to practise a little every day.", note: "" },
      { de: "Ich spreche langsam und deutlich, damit mich alle gut verstehen.", en: "I speak slowly and clearly so that everyone can understand me well.", note: "damit, so that: the verb goes to the end. Use it when the second part has a new subject." },
      { de: "Das Hotel war zwar teuer, aber das Frühstück war sehr gut.", en: "Admittedly the hotel was expensive, but the breakfast was very good.", note: "" },
      { de: "Mein Zug hatte Verspätung, deshalb bin ich zu spät gekommen.", en: "My train was delayed, so I was late.", note: "" },
      { de: "Es hat geregnet. Trotzdem sind wir spazieren gegangen.", en: "It rained. We went for a walk anyway.", note: "" }
    ] },
    { type: "phrases", heading: "Speaking part one: planning together", rows: [
      { de: "Hast du am Samstag Zeit?", en: "Do you have time on Saturday?", note: "" },
      { de: "Wie wäre es mit Sonntag um drei?", en: "How about Sunday at three?", note: "" },
      { de: "Ich schlage vor, dass wir uns am Wochenende treffen.", en: "I suggest that we meet at the weekend.", note: "" },
      { de: "Was hältst du davon, wenn wir das ganze Team einladen?", en: "What do you think about inviting the whole team?", note: "" },
      { de: "Wir könnten zusammen ein Geschenk kaufen.", en: "We could buy a present together.", note: "" },
      { de: "Das ist eine gute Idee.", en: "That is a good idea.", note: "" },
      { de: "Da bin ich ganz deiner Meinung.", en: "I completely agree with you.", note: "" },
      { de: "Das finde ich nicht so gut, weil es zu teuer ist.", en: "I do not think that is such a good idea, because it is too expensive.", note: "Disagree politely, and always give a reason." },
      { de: "Ich würde lieber am Nachmittag hingehen.", en: "I would rather go in the afternoon.", note: "" },
      { de: "Wer kümmert sich um das Essen?", en: "Who will take care of the food?", note: "" },
      { de: "Ich übernehme die Getränke.", en: "I will do the drinks.", note: "" },
      { de: "Was meinst du? Wie findest du die Idee?", en: "What do you think? How do you feel about the idea?", note: "" },
      { de: "Also, ich fasse kurz zusammen.", en: "So, let me sum up briefly.", note: "" },
      { de: "Gut, dann machen wir es so.", en: "Good, then that is what we will do.", note: "" }
    ] },
    { type: "phrases", heading: "Speaking parts two and three", rows: [
      { de: "Ich möchte heute über das Thema Handys für Kinder sprechen.", en: "Today I would like to talk about the topic mobile phones for children.", note: "" },
      { de: "Meine Präsentation besteht aus fünf Teilen.", en: "My presentation has five parts.", note: "" },
      { de: "Zuerst erzähle ich von meinen eigenen Erfahrungen.", en: "First I will tell you about my own experiences.", note: "" },
      { de: "Ich komme jetzt zur Situation in meinem Heimatland.", en: "Now I come to the situation in my home country.", note: "" },
      { de: "Bei uns in Ungarn ist das ein bisschen anders.", en: "In Hungary, where I come from, it is a bit different.", note: "" },
      { de: "Ein großer Vorteil ist, dass man viel Zeit spart.", en: "A big advantage is that you save a lot of time.", note: "" },
      { de: "Ein Nachteil ist aber, dass es viel Geld kostet.", en: "A disadvantage, though, is that it costs a lot of money.", note: "" },
      { de: "Meiner Meinung nach ist eine Mischung am besten.", en: "In my opinion a mix is best.", note: "" },
      { de: "Damit bin ich am Ende meiner Präsentation. Vielen Dank für Ihre Aufmerksamkeit.", en: "That brings me to the end of my presentation. Thank you for your attention.", note: "" },
      { de: "Vielen Dank für deinen interessanten Vortrag.", en: "Thank you for your interesting talk.", note: "" },
      { de: "Mir hat gut gefallen, dass du viele Beispiele genannt hast.", en: "I liked that you gave a lot of examples.", note: "" },
      { de: "Ich habe eine Frage an dich: Wie ist das bei dir persönlich?", en: "I have a question for you: how is it for you personally?", note: "" },
      { de: "Das ist eine gute Frage. Das kommt darauf an.", en: "That is a good question. It depends.", note: "" },
      { de: "Habe ich Ihre Frage beantwortet?", en: "Have I answered your question?", note: "To the examiner. To your partner you say: Habe ich deine Frage beantwortet?" }
    ] },
    { type: "phrases", heading: "Writing: the three letters", rows: [
      { de: "Liebe Aylin, vielen Dank für deine E-Mail.", en: "Dear Aylin, thank you very much for your e-mail.", note: "" },
      { de: "Ich habe mich sehr über deine Einladung gefreut.", en: "I was very pleased about your invitation.", note: "" },
      { de: "Leider kann ich am Samstag nicht kommen, weil ich arbeiten muss.", en: "Unfortunately I cannot come on Saturday, because I have to work.", note: "" },
      { de: "Soll ich etwas mitbringen? Ich kann einen Kuchen backen.", en: "Shall I bring something? I can bake a cake.", note: "" },
      { de: "Ich freue mich auf deine Antwort. Liebe Grüße, János", en: "I look forward to your reply. Best wishes, János.", note: "" },
      { de: "Im Gästebuch habe ich die Meinung von Marion gelesen.", en: "In the guest book I read Marion’s opinion.", note: "" },
      { de: "Da bin ich anderer Meinung.", en: "I see that differently.", note: "" },
      { de: "Einerseits spart man Zeit, andererseits kauft man oft zu viel.", en: "On the one hand you save time, on the other hand you often buy too much.", note: "" },
      { de: "Aus eigener Erfahrung weiß ich, dass Sport mit Freunden mehr Spaß macht.", en: "From my own experience I know that sport with friends is more fun.", note: "" },
      { de: "Zusammenfassend kann man sagen, dass beide Seiten recht haben.", en: "To sum up, you could say that both sides have a point.", note: "" },
      { de: "Sehr geehrte Frau Weber, vielen Dank für Ihre Nachricht.", en: "Dear Ms Weber, thank you very much for your message.", note: "" },
      { de: "Leider kann ich an der Besprechung nicht teilnehmen.", en: "Unfortunately I cannot attend the meeting.", note: "" },
      { de: "Ich bitte um Ihr Verständnis.", en: "I ask for your understanding.", note: "" },
      { de: "Mit freundlichen Grüßen", en: "Kind regards.", note: "" }
    ] },
    { type: "builds", heading: "Put it together", rows: [
      { de: "Obwohl ich wenig Zeit habe, lerne ich jeden Tag, um im Februar die Prüfung zu bestehen.", en: "Although I have little time, I study every day in order to pass the exam in February." },
      { de: "Als ich nach Deutschland kam, konnte ich nur ein paar Wörter Deutsch. Heute kann ich schon viel mehr sagen.", en: "When I came to Germany, I knew only a few words of German. Today I can already say a lot more." },
      { de: "Wenn ich die Prüfung bestehe, feiern wir mit allen Freunden, die mir geholfen haben.", en: "If I pass the exam, we will celebrate with all the friends who helped me." },
      { de: "Ich schlage vor, dass wir uns am Samstag treffen. Wer kümmert sich um die Getränke?", en: "I suggest that we meet on Saturday. Who will take care of the drinks?" },
      { de: "Einerseits ist das Handy sehr praktisch, andererseits sollte man öfter offline sein.", en: "On the one hand the mobile phone is very practical, on the other hand you should be offline more often." },
      { de: "Je mehr ich übe, desto leichter wird es. Jeden Tag ein bisschen besser.", en: "The more I practise, the easier it gets. Every day a little better." }
    ] },
    { type: "dialogue", heading: "Conversation", intro: "The exam day: the examiner welcomes you and asks a few warm-up questions before part one. Formal Sie. You are B.", partner: "m", lines: [
      { speaker: "A", de: "Guten Morgen! Bitte nehmen Sie Platz. Wie heißen Sie?", you: false },
      { speaker: "B", de: "Guten Morgen. Ich heiße János. Ich komme aus Ungarn und wohne mit meiner Familie in Frankfurt.", you: true },
      { speaker: "A", de: "Was machen Sie beruflich?", you: false },
      { speaker: "B", de: "Ich arbeite bei einer Bank. Dort habe ich viel Kontakt mit Kunden.", you: true },
      { speaker: "A", de: "Und warum lernen Sie Deutsch?", you: false },
      { speaker: "B", de: "Ich lerne Deutsch, weil ich hier lebe und arbeite. Außerdem möchte ich mit den Lehrern meiner Kinder Deutsch sprechen.", you: true },
      { speaker: "A", de: "Wie haben Sie sich auf die Prüfung vorbereitet?", you: false },
      { speaker: "B", de: "Ich habe jeden Tag ein bisschen gelernt, vor allem mit Hörtexten auf dem Weg zur Arbeit.", you: true },
      { speaker: "A", de: "Sehr gut. Sind Sie nervös?", you: false },
      { speaker: "B", de: "Ein bisschen, aber ich bin gut vorbereitet. Ich schaffe das!", you: true }
    ] }
  ]
}

);
