// b1-tracks.js — the Scooter Tracks audio companion: every track with its
// full transcript, so listening can be followed, repeated and ticked off.
// Source: the "Scooter Tracks" booklet, generated from the season scripts
// on 8 September 2026. Neural voices: Piper (German main, English coach)
// and Meta MMS (German partner).
//
// Loaded via <script> tag — all variables are global. ES5 only.
//
// AUDIO FILES are not in git. Drop the MP3s into flashcard-app/audio/ using
// the `audio` filename on each track. A track with no file still shows its
// transcript; the player area shows "audio not added yet".
//
// Section block types mirror grammar.js's content blocks:
//   { type:'phrases',  heading, rows:[{de,en,note}] }
//   { type:'builds',   heading, rows:[{de,en}] }
//   { type:'dialogue', heading, intro, lines:[{speaker,de,you}] }
//   { type:'text',     heading, intro, lines:[...] }
//   { type:'list',     heading, items:[...] }

var B1_TRACK_SEASONS = {
  s1: {
    id: 's1', name: 'Season 1 — Foundations', count: 10,
    slot: 'gym', weeks: 'W2–W6',
    note: 'Two new tracks a week at the gym while Language Transfer runs on the scooter. A 40-minute session is one new track plus two replays.'
  },
  gym: {
    id: 'gym', name: 'Gym Sessions', count: 1,
    slot: 'gym', weeks: 'W1',
    note: 'Longer, easier, paced with quiet minutes for your sets. Listen during the set, say it back between sets.'
  }
};

// How to use them — shown at the top of the Tracks tab.
var B1_TRACK_HOWTO = [
  'Load the audiobook. Open the .m4b on your iPhone, tap Share, choose Books. It plays with the screen locked and remembers where you stopped.',
  'One track per slot, twice. New track in the morning or at the gym, the same track again on the evening ride. Move on the next day.',
  'Never skip the warm-up. It brings back the previous tracks — that is the review built into the season.',
  'Speak in every pause. Out loud, quietly. If you say nothing, the track is a podcast; if you speak, it is a lesson.'
];

var B1_TRACKS = [

// ── Season 1 ────────────────────────────────────────────────────

{
  id: 's1-01', season: 's1', n: 1, title: 'Who you are', minutes: 12,
  audio: 'audio/s1-01.mp3',
  intro: 'Everything in this track is a sentence you will say in the speaking exam and hear in the listening exam: your name, where you are from, where you live, your work, your family. Every track has the same shape: a warm-up from earlier tracks, new phrases with quick checks, putting it together, a conversation, and a recap. A short tone marks each section.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'Hallo.', en: 'Hello.', note: '' },
      { de: 'Guten Tag.', en: 'Good day.', note: 'The formal hello. Use it with the examiners.' },
      { de: 'Ich heiße János.', en: 'My name is János.', note: 'The sound at the end of the first word is soft, like a whispered hue: ich.' },
      { de: 'Ich komme aus Ungarn.', en: 'I come from Hungary.', note: '' },
      { de: 'Ich wohne in Frankfurt.', en: 'I live in Frankfurt.', note: '' },
      { de: 'Ich arbeite bei einer Bank.', en: 'I work at a bank.', note: '' },
      { de: 'Ich bin verheiratet.', en: 'I am married.', note: '' },
      { de: 'Ich habe zwei Kinder.', en: 'I have two children.', note: '' },
      { de: 'Ich habe einen Sohn und eine Tochter.', en: 'I have a son and a daughter.', note: '' },
      { de: 'Ich lerne Deutsch.', en: 'I am learning German.', note: '' },
      { de: 'Ich spreche Englisch und Ungarisch.', en: 'I speak English and Hungarian.', note: '' },
      { de: 'Wie geht es Ihnen?', en: 'How are you? — formal.', note: '' },
      { de: 'Gut, danke.', en: 'Fine, thank you.', note: '' },
      { de: 'Danke.', en: 'Thank you.', note: '' },
      { de: 'Bitte.', en: 'You are welcome, or please.', note: '' },
      { de: 'Auf Wiedersehen.', en: 'Goodbye.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Ich komme aus Ungarn und ich wohne in Frankfurt.', en: 'I come from Hungary and I live in Frankfurt.' },
      { de: 'Ich bin verheiratet und ich habe zwei Kinder.', en: 'I am married and I have two children.' },
      { de: 'Guten Tag. Ich heiße János. Ich arbeite bei einer Bank.', en: 'Good day. My name is János. I work at a bank.' },
      { de: 'Ich wohne in Frankfurt und ich lerne Deutsch.', en: 'I live in Frankfurt and I am learning German.' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'A woman asks: what is your name, where are you from, what do you do for a living, and do you have children. You are B.',
      lines: [
        { speaker: 'A', de: 'Guten Tag! Wie heißen Sie?', you: false },
        { speaker: 'B', de: 'Guten Tag. Ich heiße János.', you: true },
        { speaker: 'A', de: 'Woher kommen Sie?', you: false },
        { speaker: 'B', de: 'Ich komme aus Ungarn. Ich wohne in Frankfurt.', you: true },
        { speaker: 'A', de: 'Was machen Sie beruflich?', you: false },
        { speaker: 'B', de: 'Ich arbeite bei einer Bank.', you: true },
        { speaker: 'A', de: 'Haben Sie Kinder?', you: false },
        { speaker: 'B', de: 'Ja, ich habe zwei Kinder.', you: true }
      ]}
  ]
},

{
  id: 's1-02', season: 's1', n: 2, title: 'Days and times', minutes: 12,
  audio: 'audio/s1-02.mp3',
  intro: 'In the speaking exam you plan something with a partner, and in every e-mail you say when. This track gives you the days, the hours, and the two questions that go with them.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'am Montag.', en: 'On Monday.', note: 'The little word am means on, with days.' },
      { de: 'am Dienstag.', en: 'On Tuesday.', note: '' },
      { de: 'am Mittwoch.', en: 'On Wednesday.', note: '' },
      { de: 'am Donnerstag.', en: 'On Thursday.', note: '' },
      { de: 'am Freitag.', en: 'On Friday.', note: '' },
      { de: 'am Samstag.', en: 'On Saturday.', note: '' },
      { de: 'am Sonntag.', en: 'On Sunday.', note: '' },
      { de: 'am Wochenende.', en: 'At the weekend.', note: '' },
      { de: 'heute.', en: 'Today.', note: '' },
      { de: 'morgen.', en: 'Tomorrow.', note: '' },
      { de: 'eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf', en: 'Numbers one to twelve. Listen and count along.', note: '' },
      { de: 'um zehn Uhr.', en: 'At ten o’clock.', note: 'um means at, with times.' },
      { de: 'um fünfzehn Uhr.', en: 'At three in the afternoon — Germans say fifteen.', note: '' },
      { de: 'um achtzehn Uhr.', en: 'At six in the evening — eighteen.', note: '' },
      { de: 'Hast du am Samstag Zeit?', en: 'Do you have time on Saturday?', note: '' },
      { de: 'Ja, am Samstag habe ich Zeit.', en: 'Yes, on Saturday I have time.', note: 'The sentence starts with on Saturday, so the verb comes next and the word for I moves after it.' },
      { de: 'Nein, am Samstag habe ich keine Zeit.', en: 'No, on Saturday I have no time.', note: '' },
      { de: 'Wann treffen wir uns?', en: 'When shall we meet?', note: '' },
      { de: 'Wir treffen uns am Samstag um zehn Uhr.', en: 'We will meet on Saturday at ten.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Hast du am Sonntag Zeit?', en: 'Do you have time on Sunday?' },
      { de: 'Wir treffen uns am Freitag um achtzehn Uhr.', en: 'We will meet on Friday at six in the evening.' },
      { de: 'Morgen um fünfzehn Uhr.', en: 'Tomorrow at three in the afternoon.' },
      { de: 'Nein, am Wochenende habe ich keine Zeit.', en: 'No, at the weekend I have no time.' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'A friend asks whether you have time on Saturday, and you fix a time. You are B.',
      lines: [
        { speaker: 'A', de: 'Hast du am Samstag Zeit?', you: false },
        { speaker: 'B', de: 'Ja, am Samstag habe ich Zeit. Wann treffen wir uns?', you: true },
        { speaker: 'A', de: 'Um zehn Uhr?', you: false },
        { speaker: 'B', de: 'Gut. Wir treffen uns am Samstag um zehn Uhr.', you: true },
        { speaker: 'A', de: 'Super, bis Samstag!', you: false },
        { speaker: 'B', de: 'Bis Samstag!', you: true }
      ]}
  ]
},

{
  id: 's1-03', season: 's1', n: 3, title: 'Sorry, I can’t — because', minutes: 13,
  audio: 'audio/s1-03.mp3',
  intro: 'This one sentence appears in almost every writing task and every planning conversation. It also teaches the most important rule of German word order: after the word for because, the verb goes to the end.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'leider.', en: 'Unfortunately.', note: '' },
      { de: 'Leider kann ich nicht kommen.', en: 'Unfortunately I cannot come.', note: 'The word for can, kann, is the second word; the verb come, kommen, goes to the end.' },
      { de: 'Leider kann ich am Samstag nicht kommen.', en: 'Unfortunately I cannot come on Saturday.', note: '' },
      { de: 'Ich muss arbeiten.', en: 'I have to work.', note: '' },
      { de: 'weil ich arbeiten muss.', en: 'Because I have to work.', note: 'After weil the order flips: arbeiten muss — the changing verb goes last.' },
      { de: 'Leider kann ich am Samstag nicht kommen, weil ich arbeiten muss.', en: 'Unfortunately I cannot come on Saturday, because I have to work.', note: '' },
      { de: 'Ich bin krank.', en: 'I am ill.', note: '' },
      { de: 'weil ich krank bin.', en: 'Because I am ill.', note: '' },
      { de: 'Ich habe einen wichtigen Termin.', en: 'I have an important appointment.', note: '' },
      { de: 'weil ich einen wichtigen Termin habe.', en: 'Because I have an important appointment.', note: '' },
      { de: 'Meine Kinder sind krank.', en: 'My children are ill.', note: '' },
      { de: 'weil meine Kinder krank sind.', en: 'Because my children are ill.', note: '' },
      { de: 'Es tut mir leid.', en: 'I am sorry.', note: '' },
      { de: 'Schade!', en: 'What a pity!', note: '' },
      { de: 'Vielleicht am Sonntag?', en: 'Maybe on Sunday?', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Leider kann ich am Montag nicht kommen, weil ich krank bin.', en: 'Unfortunately I cannot come on Monday, because I am ill.' },
      { de: 'Es tut mir leid. Leider habe ich heute keine Zeit, weil ich einen wichtigen Termin habe.', en: 'I am sorry. Unfortunately I have no time today, because I have an important appointment.' },
      { de: 'Leider kann ich am Wochenende nicht kommen, weil meine Kinder krank sind.', en: 'Unfortunately I cannot come at the weekend, because my children are ill.' },
      { de: 'Schade! Vielleicht am Freitag?', en: 'What a pity! Maybe on Friday?' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'A friend asks whether you are coming to the party on Saturday. You cannot, and you say why. You are B.',
      lines: [
        { speaker: 'A', de: 'Kommst du am Samstag zur Party?', you: false },
        { speaker: 'B', de: 'Es tut mir leid. Leider kann ich am Samstag nicht kommen, weil ich arbeiten muss.', you: true },
        { speaker: 'A', de: 'Schade! Vielleicht am Sonntag?', you: false },
        { speaker: 'B', de: 'Ja, am Sonntag habe ich Zeit.', you: true },
        { speaker: 'A', de: 'Super! Bis Sonntag.', you: false },
        { speaker: 'B', de: 'Bis Sonntag!', you: true }
      ]}
  ]
},

{
  id: 's1-04', season: 's1', n: 4, title: 'Let’s make a plan', minutes: 12,
  audio: 'audio/s1-04.mp3',
  intro: 'Speaking part one of the exam is you and a partner planning something together — a party, a trip, a visit. The examiners want to hear four things: a suggestion, a question to your partner, agreement or disagreement, and a decision at the end.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'Wie wäre es mit Sonntag?', en: 'How about Sunday?', note: '' },
      { de: 'Wir könnten uns um fünfzehn Uhr im Café treffen.', en: 'We could meet at three in the afternoon in the café.', note: '' },
      { de: 'Ich schlage vor, dass wir ins Kino gehen.', en: 'I suggest that we go to the cinema.', note: 'The word for that, dass, also sends the verb to the end: gehen.' },
      { de: 'Wollen wir zusammen essen gehen?', en: 'Shall we go out to eat together?', note: '' },
      { de: 'Das ist eine gute Idee.', en: 'That is a good idea.', note: '' },
      { de: 'Einverstanden.', en: 'Agreed.', note: '' },
      { de: 'Da hast du recht.', en: 'You are right.', note: '' },
      { de: 'Was meinst du?', en: 'What do you think?', note: '' },
      { de: 'Gut, dann machen wir das so.', en: 'Good, then that is what we will do.', note: '' },
      { de: 'Also: Wir treffen uns am Samstag um zehn Uhr am Bahnhof.', en: 'So: we will meet on Saturday at ten at the station.', note: '' },
      { de: 'Wir sollen eine Party planen.', en: 'We are supposed to plan a party.', note: '' },
      { de: 'feiern.', en: 'To celebrate.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Wie wäre es mit Freitag? Wir könnten uns um achtzehn Uhr treffen.', en: 'How about Friday? We could meet at six in the evening.' },
      { de: 'Ich schlage vor, dass wir uns am Wochenende treffen.', en: 'I suggest that we meet at the weekend.' },
      { de: 'Das ist eine gute Idee. Was meinst du?', en: 'That is a good idea. What do you think?' },
      { de: 'Einverstanden. Also: Wir treffen uns morgen um zehn Uhr am Bahnhof.', en: 'Agreed. So: we will meet tomorrow at ten at the station.' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'Exam style: you and a partner plan a party. She opens; you suggest, she agrees, you close. You are B.',
      lines: [
        { speaker: 'A', de: 'Wir sollen eine Party planen. Wann feiern wir?', you: false },
        { speaker: 'B', de: 'Ich schlage vor, dass wir am Samstag feiern. Was meinst du?', you: true },
        { speaker: 'A', de: 'Das ist eine gute Idee. Und wann treffen wir uns?', you: false },
        { speaker: 'B', de: 'Wie wäre es mit achtzehn Uhr?', you: true },
        { speaker: 'A', de: 'Einverstanden.', you: false },
        { speaker: 'B', de: 'Gut, dann machen wir das so.', you: true }
      ]}
  ]
},

{
  id: 's1-05', season: 's1', n: 5, title: 'Questions and offers', minutes: 12,
  audio: 'audio/s1-05.mp3',
  intro: 'A plan needs questions: who, what, when, where, why. And an e-mail needs an offer: shall I bring something? I can bake a cake. Both are cheap points in the exam.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'wer, was, wann, wo, warum, wie, woher', en: 'The question words: who, what, when, where, why, how, where from.', note: '' },
      { de: 'wer?', en: 'Who?', note: '' },
      { de: 'warum?', en: 'Why?', note: '' },
      { de: 'Wo treffen wir uns?', en: 'Where shall we meet?', note: '' },
      { de: 'Wer bringt das Essen mit?', en: 'Who is bringing the food?', note: 'Bring along is a verb that splits: bringt near the front, mit at the end.' },
      { de: 'Soll ich etwas mitbringen?', en: 'Shall I bring something?', note: '' },
      { de: 'Ich kann einen Kuchen backen.', en: 'I can bake a cake.', note: '' },
      { de: 'die Getränke.', en: 'The drinks.', note: '' },
      { de: 'Kannst du mir helfen?', en: 'Can you help me?', note: '' },
      { de: 'Ja, natürlich.', en: 'Yes, of course.', note: '' },
      { de: 'Kein Problem.', en: 'No problem.', note: '' },
      { de: 'Ich habe eine Frage.', en: 'I have a question.', note: '' },
      { de: 'bei mir zu Hause.', en: 'At my place, at home.', note: '' },
      { de: 'Ich freue mich.', en: 'I am looking forward to it.', note: '' },
      { de: 'Ich freue mich auf deine Antwort.', en: 'I look forward to your reply.', note: 'The last line of every informal e-mail.' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Soll ich einen Kuchen mitbringen?', en: 'Shall I bring a cake?' },
      { de: 'Wer bringt die Getränke mit?', en: 'Who is bringing the drinks?' },
      { de: 'Wo und wann treffen wir uns?', en: 'Where and when shall we meet?' },
      { de: 'Kannst du mir helfen? Ich habe eine Frage.', en: 'Can you help me? I have a question.' },
      { de: 'Wir treffen uns bei mir zu Hause. Ich freue mich.', en: 'We will meet at my place. I am looking forward to it.' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'Planning the food for the party: a friend offers to bring something, you organise who brings what and where you meet. You are B.',
      lines: [
        { speaker: 'A', de: 'Soll ich etwas mitbringen?', you: false },
        { speaker: 'B', de: 'Ja, gern. Kannst du einen Kuchen backen?', you: true },
        { speaker: 'A', de: 'Ja, natürlich. Und wer bringt die Getränke mit?', you: false },
        { speaker: 'B', de: 'Ich bringe die Getränke mit.', you: true },
        { speaker: 'A', de: 'Super. Wo treffen wir uns?', you: false },
        { speaker: 'B', de: 'Bei mir zu Hause, um achtzehn Uhr.', you: true },
        { speaker: 'A', de: 'Gut, ich freue mich!', you: false },
        { speaker: 'B', de: 'Ich freue mich auch. Bis Samstag!', you: true }
      ]}
  ]
},

{
  id: 's1-06', season: 's1', n: 6, title: 'The informal e-mail', minutes: 11,
  audio: 'audio/s1-06.mp3',
  intro: 'Writing task one is an e-mail to a friend, about eighty words, with three points you must cover. You already know the middle. This track adds the opening and closing lines — the same ones every time — and then builds the whole e-mail with you.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'Liebe Anna,', en: 'Dear Anna, — to a woman.', note: 'Liebe for a woman, Lieber for a man.' },
      { de: 'Lieber Tom,', en: 'Dear Tom, — to a man.', note: '' },
      { de: 'Vielen Dank für deine E-Mail.', en: 'Thank you very much for your e-mail.', note: '' },
      { de: 'Vielen Dank für deine Einladung.', en: 'Thank you very much for your invitation.', note: '' },
      { de: 'Ich habe mich sehr gefreut.', en: 'I was very pleased.', note: '' },
      { de: 'Ich möchte gern kommen.', en: 'I would like to come.', note: '' },
      { de: 'Das wäre schön.', en: 'That would be nice.', note: '' },
      { de: 'Liebe Grüße', en: 'Best wishes — the informal sign-off.', note: '' },
      { de: 'Bis bald!', en: 'See you soon!', note: '' },
      { de: 'auch.', en: 'Also.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Liebe Anna, vielen Dank für deine Einladung.', en: 'Dear Anna, thank you very much for your invitation.' },
      { de: 'Ich habe mich sehr gefreut.', en: 'I was very pleased.' },
      { de: 'Leider kann ich am Samstag nicht kommen, weil ich arbeiten muss.', en: 'Unfortunately I cannot come on Saturday, because I have to work.' },
      { de: 'Wie wäre es mit Sonntag? Wir könnten uns um fünfzehn Uhr im Café treffen.', en: 'How about Sunday? We could meet at three in the afternoon in the café.' },
      { de: 'Soll ich etwas mitbringen? Ich kann einen Kuchen backen.', en: 'Shall I bring something? I can bake a cake.' },
      { de: 'Ich freue mich auf deine Antwort. Liebe Grüße, János.', en: 'I look forward to your reply. Best wishes, János.' }
    ]},
    { type: 'text', heading: 'The text',
      intro: 'The whole e-mail to Anna, as you would write it in the exam: thanks, why you cannot come, an alternative, an offer, the closing line.',
      lines: [
        'Liebe Anna,',
        'vielen Dank für deine Einladung. Ich habe mich sehr gefreut.',
        'Leider kann ich am Samstag nicht kommen, weil ich arbeiten muss.',
        'Wie wäre es mit Sonntag? Wir könnten uns um fünfzehn Uhr im Café treffen.',
        'Soll ich etwas mitbringen? Ich kann einen Kuchen backen.',
        'Ich freue mich auf deine Antwort.',
        'Liebe Grüße, János'
      ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'A second e-mail, this time to Tom, as a conversation: he invites you, you accept and fix the details. You are B.',
      lines: [
        { speaker: 'A', de: 'Hallo János! Kommst du am Freitag zur Party?', you: false },
        { speaker: 'B', de: 'Vielen Dank für die Einladung. Ich möchte gern kommen.', you: true },
        { speaker: 'A', de: 'Super! Wann treffen wir uns?', you: false },
        { speaker: 'B', de: 'Wie wäre es mit Freitag um achtzehn Uhr? Ich bringe die Getränke mit.', you: true },
        { speaker: 'A', de: 'Das wäre schön. Bis Freitag!', you: false },
        { speaker: 'B', de: 'Bis Freitag! Ich freue mich.', you: true }
      ]}
  ]
},

{
  id: 's1-07', season: 's1', n: 7, title: 'The formal e-mail', minutes: 12,
  audio: 'audio/s1-07.mp3',
  intro: 'Writing task three is a short, polite e-mail — about forty words — to someone you do not know well: a teacher, a landlord, an office. It uses the formal you. This track gives you the whole thing.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'Sehr geehrte Frau Müller,', en: 'Dear Ms Müller, — formal, to a woman.', note: 'geehrte for a woman, geehrter for a man — the same pattern as before.' },
      { de: 'Sehr geehrter Herr Schmidt,', en: 'Dear Mr Schmidt, — formal, to a man.', note: '' },
      { de: 'Vielen Dank für Ihre Nachricht.', en: 'Thank you very much for your message.', note: 'Ihre is the formal your. In writing it always starts with a capital letter.' },
      { de: 'Vielen Dank für Ihre Einladung.', en: 'Thank you very much for your invitation. — formal.', note: '' },
      { de: 'Leider kann ich am Montag nicht kommen.', en: 'Unfortunately I cannot come on Monday.', note: '' },
      { de: 'Könnten wir einen anderen Termin vereinbaren?', en: 'Could we arrange another appointment?', note: '' },
      { de: 'Ich bitte um Ihr Verständnis.', en: 'I ask for your understanding.', note: '' },
      { de: 'Mit freundlichen Grüßen', en: 'Kind regards — the formal sign-off.', note: '' },
      { de: 'Könnten Sie mir bitte helfen?', en: 'Could you please help me?', note: '' },
      { de: 'Ich möchte mich für den Kurs anmelden.', en: 'I would like to register for the course.', note: '' },
      { de: 'Haben Sie am Mittwoch Zeit?', en: 'Do you have time on Wednesday? — formal.', note: '' },
      { de: 'Hier ist János.', en: 'Here is János. — on the phone.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Sehr geehrte Frau Müller, vielen Dank für Ihre Einladung.', en: 'Dear Ms Müller, thank you very much for your invitation.' },
      { de: 'Leider kann ich am Montag nicht kommen, weil ich einen wichtigen Termin habe.', en: 'Unfortunately I cannot come on Monday, because I have an important appointment.' },
      { de: 'Könnten wir einen anderen Termin vereinbaren?', en: 'Could we arrange another appointment?' },
      { de: 'Ich bitte um Ihr Verständnis. Mit freundlichen Grüßen, János.', en: 'I ask for your understanding. Kind regards, János.' },
      { de: 'Sehr geehrter Herr Schmidt, ich möchte mich für den Kurs anmelden. Könnten Sie mir bitte helfen?', en: 'Dear Mr Schmidt, I would like to register for the course. Could you please help me?' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'A phone call with Ms Müller: you cannot come on Monday and ask for another appointment. Formal you throughout. You are B.',
      lines: [
        { speaker: 'A', de: 'Guten Tag, hier ist Frau Müller.', you: false },
        { speaker: 'B', de: 'Guten Tag, Frau Müller. Hier ist János. Leider kann ich am Montag nicht kommen. Könnten wir einen anderen Termin vereinbaren?', you: true },
        { speaker: 'A', de: 'Ja, natürlich. Haben Sie am Mittwoch Zeit?', you: false },
        { speaker: 'B', de: 'Ja, am Mittwoch habe ich Zeit.', you: true },
        { speaker: 'A', de: 'Gut, dann um zehn Uhr.', you: false },
        { speaker: 'B', de: 'Vielen Dank. Auf Wiedersehen!', you: true },
        { speaker: 'A', de: 'Auf Wiedersehen!', you: false }
      ]}
  ]
},

{
  id: 's1-08', season: 's1', n: 8, title: 'Your opinion', minutes: 12,
  audio: 'audio/s1-08.mp3',
  intro: 'Writing task two asks what you think about a topic; the presentation ends with your opinion; and reading part four is all about who is for and who is against. These frames do all three.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'Meiner Meinung nach.', en: 'In my opinion.', note: '' },
      { de: 'Meiner Meinung nach ist das gut.', en: 'In my opinion that is good.', note: 'After this opener the verb comes straight away.' },
      { de: 'Ich finde, dass Sport wichtig ist.', en: 'I think that sport is important.', note: 'dass — verb to the end: wichtig ist.' },
      { de: 'Ich denke, dass das zu teuer ist.', en: 'I think that it is too expensive.', note: '' },
      { de: 'Ich persönlich finde das nicht so gut.', en: 'Personally, I do not find that so good.', note: '' },
      { de: 'Das Thema ist sehr interessant.', en: 'The topic is very interesting.', note: '' },
      { de: 'Ich bin dafür.', en: 'I am for it.', note: '' },
      { de: 'Ich bin dagegen.', en: 'I am against it.', note: '' },
      { de: 'Deshalb finde ich es wichtig.', en: 'That is why I find it important.', note: '' },
      { de: 'zum Beispiel.', en: 'For example.', note: '' },
      { de: 'Das stimmt, aber.', en: 'That is true, but.', note: '' },
      { de: 'Handys für Kinder.', en: 'Mobile phones for children.', note: '' },
      { de: 'zu viel.', en: 'Too much.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Meiner Meinung nach ist das zu teuer.', en: 'In my opinion that is too expensive.' },
      { de: 'Ich finde, dass das Thema sehr interessant ist.', en: 'I think that the topic is very interesting.' },
      { de: 'Ich bin dagegen, weil es zu teuer ist.', en: 'I am against it, because it is too expensive.' },
      { de: 'Deshalb bin ich dafür.', en: 'That is why I am for it.' },
      { de: 'Das stimmt, aber ich finde, dass Kinder zu viel am Handy sind.', en: 'That is true, but I think that children are too much on the phone.' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'A discussion: mobile phones for children. She asks what you think; you are against, she is for. You are B.',
      lines: [
        { speaker: 'A', de: 'Was denkst du über Handys für Kinder?', you: false },
        { speaker: 'B', de: 'Meiner Meinung nach ist das ein Problem. Ich finde, dass Kinder zu viel am Handy sind.', you: true },
        { speaker: 'A', de: 'Ich bin dafür. Kinder können schnell Informationen finden.', you: false },
        { speaker: 'B', de: 'Das stimmt, aber ich bin dagegen.', you: true },
        { speaker: 'A', de: 'Warum?', you: false },
        { speaker: 'B', de: 'Deshalb finde ich es wichtig, dass Kinder wenig am Handy sind. Das ist gesund.', you: true }
      ]}
  ]
},

{
  id: 's1-09', season: 's1', n: 9, title: 'Pros and cons', minutes: 12,
  audio: 'audio/s1-09.mp3',
  intro: 'Slide four of the presentation, and the middle of writing task two. Two frames, two connectors, and you can talk about any topic for a minute.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'ein Vorteil.', en: 'An advantage.', note: '' },
      { de: 'ein Nachteil.', en: 'A disadvantage.', note: '' },
      { de: 'Ein großer Vorteil ist, dass es schnell geht.', en: 'A big advantage is that it is fast.', note: '' },
      { de: 'Ein Nachteil ist aber, dass es teuer ist.', en: 'A disadvantage, though, is that it is expensive.', note: '' },
      { de: 'Natürlich gibt es auch Nachteile.', en: 'Of course there are also disadvantages.', note: '' },
      { de: 'Einerseits, andererseits.', en: 'On the one hand, on the other hand.', note: '' },
      { de: 'Außerdem.', en: 'Besides, or moreover.', note: '' },
      { de: 'Trotzdem.', en: 'Nevertheless.', note: '' },
      { de: 'Das spart Zeit.', en: 'It saves time.', note: '' },
      { de: 'Das kostet viel Geld.', en: 'It costs a lot of money.', note: '' },
      { de: 'Einkaufen im Internet.', en: 'Shopping on the internet.', note: '' },
      { de: 'Man kann die Sachen nicht sehen.', en: 'You cannot see the things.', note: 'man is the general you — people in general.' },
      { de: 'gesund.', en: 'Healthy.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Ein großer Vorteil ist, dass es Zeit spart.', en: 'A big advantage is that it saves time.' },
      { de: 'Ein Nachteil ist aber, dass es viel Geld kostet.', en: 'A disadvantage, though, is that it costs a lot of money.' },
      { de: 'Trotzdem finde ich, dass es gut ist.', en: 'Nevertheless, I think that it is good.' },
      { de: 'Einerseits ist es schnell, andererseits ist es teuer.', en: 'On the one hand it is fast, on the other hand it is expensive.' },
      { de: 'Außerdem ist es gesund.', en: 'Besides, it is healthy.' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'Shopping on the internet: she asks what you think; you give an advantage and a disadvantage. You are B.',
      lines: [
        { speaker: 'A', de: 'Einkaufen im Internet — was meinst du?', you: false },
        { speaker: 'B', de: 'Ein großer Vorteil ist, dass es schnell geht und Zeit spart.', you: true },
        { speaker: 'A', de: 'Und die Nachteile?', you: false },
        { speaker: 'B', de: 'Ein Nachteil ist aber, dass man die Sachen nicht sehen kann.', you: true },
        { speaker: 'A', de: 'Das stimmt.', you: false },
        { speaker: 'B', de: 'Trotzdem kaufe ich oft im Internet.', you: true }
      ]}
  ]
},

{
  id: 's1-10', season: 's1', n: 10, title: 'Your presentation', minutes: 14,
  audio: 'audio/s1-10.mp3',
  intro: 'Speaking part two is a three-minute presentation on five fixed slides. The first and the last slide are the same for every topic — so you can learn them now, word for word, and never think about them again. This track also gives you the feedback lines for part three.',
  sections: [
    { type: 'phrases', heading: 'New phrases', rows: [
      { de: 'Ich möchte heute über das Thema Sport sprechen.', en: 'Today I would like to talk about the topic sport.', note: '' },
      { de: 'Zuerst erzähle ich von meiner persönlichen Erfahrung.', en: 'First I will talk about my personal experience.', note: '' },
      { de: 'Dann beschreibe ich die Situation in meinem Heimatland.', en: 'Then I will describe the situation in my home country.', note: '' },
      { de: 'Danach nenne ich Vor- und Nachteile.', en: 'After that I will name advantages and disadvantages.', note: '' },
      { de: 'Und am Ende sage ich meine Meinung.', en: 'And at the end I will give my opinion.', note: '' },
      { de: 'In Ungarn ist das so:', en: 'In Hungary it is like this:', note: '' },
      { de: 'Viele Leute machen Sport.', en: 'Many people do sport.', note: '' },
      { de: 'zweimal pro Woche.', en: 'Twice a week.', note: '' },
      { de: 'Ich bin am Ende meiner Präsentation.', en: 'I have reached the end of my presentation.', note: '' },
      { de: 'Vielen Dank fürs Zuhören.', en: 'Thank you for listening.', note: '' },
      { de: 'Haben Sie noch Fragen?', en: 'Do you have any questions?', note: 'To the examiners you use the formal you; to your partner the informal one.' },
      { de: 'Vielen Dank für deine Präsentation. Ich fand sie sehr interessant.', en: 'Thank you for your presentation. I found it very interesting.', note: '' },
      { de: 'Ich habe eine Frage: Wie ist das bei dir persönlich?', en: 'I have a question: how is it for you personally?', note: '' },
      { de: 'Das ist eine gute Frage.', en: 'That is a good question.', note: '' }
    ]},
    { type: 'builds', heading: 'Put it together', rows: [
      { de: 'Ich möchte heute über das Thema Handys für Kinder sprechen. Zuerst erzähle ich von meiner persönlichen Erfahrung, dann beschreibe ich die Situation in meinem Heimatland, danach nenne ich Vor- und Nachteile, und am Ende sage ich meine Meinung.', en: 'The whole opening, for the topic mobile phones for children.' },
      { de: 'Ich bin am Ende meiner Präsentation. Vielen Dank fürs Zuhören. Haben Sie noch Fragen?', en: 'The whole closing.' },
      { de: 'Ich persönlich finde, dass Sport sehr wichtig ist, weil es gesund ist.', en: 'Personally, I think that sport is very important, because it is healthy.' }
    ]},
    { type: 'dialogue', heading: 'Conversation',
      intro: 'A complete mini presentation on sport — one sentence per slide — then your partner gives feedback and asks a question, and you answer. You are B.',
      lines: [
        { speaker: 'B', de: 'Ich möchte heute über das Thema Sport sprechen. Zuerst erzähle ich von meiner persönlichen Erfahrung. Ich mache zweimal pro Woche Sport.', you: true },
        { speaker: 'B', de: 'In Ungarn ist das so: Viele Leute machen Sport, zum Beispiel Fußball. Ein großer Vorteil ist, dass Sport gesund ist. Ein Nachteil ist aber, dass es Zeit kostet.', you: true },
        { speaker: 'B', de: 'Ich persönlich finde, dass Sport sehr wichtig ist. Ich bin am Ende meiner Präsentation. Vielen Dank fürs Zuhören. Haben Sie noch Fragen?', you: true },
        { speaker: 'A', de: 'Vielen Dank für deine Präsentation. Ich fand sie sehr interessant. Ich habe eine Frage: Wie ist das bei dir persönlich?', you: false },
        { speaker: 'B', de: 'Das ist eine gute Frage. Ich gehe zweimal pro Woche ins Fitnessstudio.', you: true }
      ]}
  ]
},

// ── Gym sessions ────────────────────────────────────────────────

{
  id: 'gym-01', season: 'gym', n: 1, title: 'Los geht’s', minutes: 27,
  audio: 'audio/gym-01.mp3',
  intro: '27 minutes, nine blocks, a quiet minute between blocks for your set. Easy on purpose: listen during the set, say it back between sets, nothing to memorise. The only test is the last block.',
  sections: [
    { type: 'phrases', heading: 'Eight phrases for the gym', rows: [
      { de: 'Los geht’s!', en: 'Let’s go!', note: '' },
      { de: 'Ich schaffe das.', en: 'I can do this.', note: '' },
      { de: 'Weiter so!', en: 'Keep it up!', note: '' },
      { de: 'Noch einmal.', en: 'Once more.', note: '' },
      { de: 'Nicht aufgeben.', en: 'Don’t give up.', note: '' },
      { de: 'Ich bin müde, aber ich mache weiter.', en: 'I am tired, but I keep going.', note: '' },
      { de: 'Jeden Tag ein bisschen besser.', en: 'Every day a little better.', note: '' },
      { de: 'Fertig! Sehr gut.', en: 'Done! Very good.', note: '' }
    ]},
    { type: 'list', heading: 'Count your reps', items: [
      'eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf, dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn, zwanzig'
    ]},
    { type: 'phrases', heading: 'Days, greetings, the clock', rows: [
      { de: 'am Montag', en: 'Monday', note: '' },
      { de: 'am Dienstag', en: 'Tuesday', note: '' },
      { de: 'am Mittwoch', en: 'Wednesday', note: '' },
      { de: 'am Donnerstag', en: 'Thursday', note: '' },
      { de: 'am Freitag', en: 'Friday', note: '' },
      { de: 'am Samstag', en: 'Saturday', note: '' },
      { de: 'am Sonntag', en: 'Sunday', note: '' },
      { de: 'Guten Morgen.', en: 'Good morning.', note: '' },
      { de: 'Guten Tag.', en: 'Good day.', note: '' },
      { de: 'Guten Abend.', en: 'Good evening.', note: '' },
      { de: 'Gute Nacht.', en: 'Good night.', note: '' },
      { de: 'Tschüss.', en: 'Bye — informal.', note: '' },
      { de: 'Bis später.', en: 'See you later.', note: '' },
      { de: 'Schönen Tag!', en: 'Have a nice day!', note: '' },
      { de: 'Wie geht’s?', en: 'How are you? — informal.', note: '' },
      { de: 'Gut, danke. Und dir?', en: 'Good, thanks. And you?', note: '' },
      { de: 'Es ist sechs Uhr.', en: 'It is six o’clock.', note: '' },
      { de: 'um sieben Uhr.', en: 'At seven o’clock.', note: '' },
      { de: 'um acht Uhr.', en: 'At eight o’clock.', note: '' },
      { de: 'halb sieben.', en: 'Half past six — Germans say half seven.', note: '' },
      { de: 'am Morgen.', en: 'In the morning.', note: '' },
      { de: 'am Abend.', en: 'In the evening.', note: '' }
    ]},
    { type: 'dialogue', heading: 'Five questions, five answers', intro: '', lines: [
      { speaker: 'A', de: 'Wie heißen Sie?', you: false },
      { speaker: 'B', de: 'Ich heiße János.', you: true },
      { speaker: 'A', de: 'Woher kommen Sie?', you: false },
      { speaker: 'B', de: 'Ich komme aus Ungarn.', you: true },
      { speaker: 'A', de: 'Wo wohnen Sie?', you: false },
      { speaker: 'B', de: 'Ich wohne in Frankfurt.', you: true },
      { speaker: 'A', de: 'Was machen Sie beruflich?', you: false },
      { speaker: 'B', de: 'Ich arbeite bei einer Bank.', you: true },
      { speaker: 'A', de: 'Haben Sie Kinder?', you: false },
      { speaker: 'B', de: 'Ja, ich habe zwei Kinder.', you: true }
    ]},
    { type: 'phrases', heading: 'Gym words', rows: [
      { de: 'das Fitnessstudio.', en: 'The gym.', note: '' },
      { de: 'trainieren.', en: 'To train, to work out.', note: '' },
      { de: 'Ich trainiere zweimal pro Woche.', en: 'I train twice a week.', note: '' },
      { de: 'stark.', en: 'Strong.', note: '' },
      { de: 'müde.', en: 'Tired.', note: '' },
      { de: 'eine Pause.', en: 'A break.', note: '' },
      { de: 'Wasser. Wasser trinken.', en: 'Water. Drink water.', note: '' },
      { de: 'gesund.', en: 'Healthy.', note: '' },
      { de: 'Sport ist gesund.', en: 'Sport is healthy.', note: '' }
    ]},
    { type: 'text', heading: 'A morning in Frankfurt', intro: '', lines: [
      'Es ist sechs Uhr morgens.',
      'János ist im Fitnessstudio.',
      'Er trainiert und er hört Deutsch.',
      'Er hat zwei Kinder. Sie schlafen noch.',
      'Um acht Uhr fährt er mit dem Roller zur Arbeit.',
      'Er arbeitet bei einer Bank in Frankfurt.',
      'Am Abend lernt er zwanzig Minuten Deutsch.',
      'Im März macht er die Prüfung.',
      'Er ist müde, aber er macht weiter.',
      'Er schafft das.'
    ]},
    { type: 'text', heading: 'The plan, in German', intro: '', lines: [
      'Im September lernt János die ersten Wörter.',
      'Im Oktober kann er sich vorstellen.',
      'Im November schreibt er seine erste E-Mail auf Deutsch.',
      'Im Dezember spricht er ein bisschen Deutsch mit den Kindern.',
      'Im Januar übt er die Prüfung.',
      'Im Februar ist er bereit.',
      'Im März macht er die Prüfung – und besteht sie.',
      'Jeden Tag ein bisschen besser.'
    ]}
  ]
}

];
