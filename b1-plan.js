// b1-plan.js — the 30-week Goethe B1 plan that drives the Plan tab
// Source: the "B1 by March" plan, written 7 September 2026 for the
// Goethe-Zertifikat B1 regulations dated 1 September 2025.
// Loaded via <script> tag — all variables are global. ES5 only, no build step.

// ── The exam and the deadline ───────────────────────────────────

var B1_KEY_DATES = {
  planStart:     '2026-09-07',  // W1 Monday
  planEnd:       '2027-04-04',  // W30 Sunday
  sittingWindow: '2027-02-22',  // earliest Frankfurt date to book
  hardDeadline:  '2027-03-31',
  newCardsTo5:   '2027-02-01',  // new cards 10/day -> 5/day
  newCardsTo0:   '2027-02-15'   // new cards -> 0, reviews only
};

// ── The three study slots ───────────────────────────────────────

var B1_SLOTS = {
  scooter: {
    id: 'scooter', name: 'Scooter', emoji: '🛴', color: '#5b8def',
    pattern: '2 x 12 min, Mon-Fri', minutesPerWeek: 120,
    note: 'Hands-free, eyes-free audio. Speak quietly in every pause. Carries the whole grammar and speaking curriculum.'
  },
  gym: {
    id: 'gym', name: 'Gym', emoji: '🏋️', color: '#e08a4a',
    pattern: '2 x ~40 min, 6am', minutesPerWeek: 80,
    note: 'Audio with split attention. Drill-style repetition only — nothing that needs questions on a page.'
  },
  evening: {
    id: 'evening', name: 'Evening', emoji: '🌙', color: '#9b7ede',
    pattern: '7 x 20 min', minutesPerWeek: 140,
    note: 'The only screen time. 10 min Cards — this app is the SRS — then one task set by the weekday.'
  }
};

// ── Five phases ─────────────────────────────────────────────────

var B1_PHASES = [
  { id: 0, name: 'Setup',            weeks: [1, 1],   from: '2026-09-07', to: '2026-09-13',
    summary: 'Get every tool in place and the exam booked. Audio and the card deck start immediately.' },
  { id: 1, name: 'Ears first',       weeks: [2, 6],   from: '2026-09-14', to: '2026-10-18',
    summary: 'Language Transfer on the scooter, Scooter Tracks Season 1 at the gym, Cards every evening.' },
  { id: 2, name: 'Build the engine', weeks: [7, 17],  from: '2026-10-19', to: '2027-01-03',
    summary: 'Scooter Tracks take over both audio slots. Grammar, reading, speaking, writing by weekday.' },
  { id: 3, name: 'Exam mode',        weeks: [18, 24], from: '2027-01-04', to: '2027-02-21',
    summary: 'Every evening is one exam part, timed, from the Cornelsen then the Klett book.' },
  { id: 4, name: 'Sit and retake',   weeks: [25, 30], from: '2027-02-22', to: '2027-04-04',
    summary: 'First sitting from 22 February, all four modules. A failed module gets every evening until the March retake.' }
];

// ── The evening rhythm, by weekday ──────────────────────────────
// Minutes 0-10 are always Cards (reviews first, then new). These are minutes 10-20.
// day: 0 = Monday ... 6 = Sunday

var B1_RHYTHMS = {
  phase12: {
    id: 'phase12', name: 'Phases 1-2 (14 Sep - 20 Dec)',
    days: [
      { day: 0, label: 'Grammar',   task: 'Grammatik aktiv, one two-page chapter' },
      { day: 1, label: 'Reading',   task: 'DW Nicos Weg, as far as you get in ten minutes' },
      { day: 2, label: 'Grammar',   task: 'Grammatik aktiv, one two-page chapter' },
      { day: 3, label: 'Reading',   task: 'DW Nicos Weg' },
      { day: 4, label: 'Speaking',  task: 'Ten minutes of German with Claude voice mode' },
      { day: 5, label: 'Writing',   task: 'One template task with AI correction' },
      { day: 6, label: 'Listening', task: 'One Teil of the official Modellsatz/Übungssatz Hören, questions in front of you' }
    ]
  },
  phase3: {
    id: 'phase3', name: 'Phase 3 and the retake weeks (4 Jan onwards)',
    days: [
      { day: 0, label: 'Lesen',     task: 'One Teil, timed (Teil 3 in 10 min, Teil 2 in 20)' },
      { day: 1, label: 'Schreiben', task: 'One Aufgabe, then the AI corrector' },
      { day: 2, label: 'Hören',    task: 'One Teil' },
      { day: 3, label: 'Lesen',     task: 'One Teil, timed' },
      { day: 4, label: 'Sprechen',  task: 'The AI examiner' },
      { day: 5, label: 'Schreiben', task: 'One Aufgabe' },
      { day: 6, label: 'Hören',    task: 'One Teil, then go through the errors' }
    ]
  },
  holiday: {
    id: 'holiday', name: 'Holiday mode',
    days: [
      { day: 0, label: 'Cards', task: 'Reviews only — five minutes counts as the day' },
      { day: 1, label: 'Cards', task: 'Reviews only' },
      { day: 2, label: 'Cards', task: 'Reviews only' },
      { day: 3, label: 'Cards', task: 'Reviews only' },
      { day: 4, label: 'Cards', task: 'Reviews only' },
      { day: 5, label: 'Cards', task: 'Reviews only' },
      { day: 6, label: 'Cards', task: 'Reviews only' }
    ]
  }
};

// ── The 30 weeks ────────────────────────────────────────────────
// n        week number, 1-30
// from     Monday, ISO date. The week runs from + 6 days.
// label    human range, as printed in the plan
// phase    B1_PHASES id
// rhythm   B1_RHYTHMS key for the evening slot
// scooter  what plays on the scooter that week ('' = nothing scheduled)
// gym      what plays at the gym ('' = nothing scheduled)
// evening  the week's specific evening work, on top of the daily rhythm
// milestone  the exit test / checkpoint that closes the week ('' = none)

var B1_WEEKS = [
  { n: 1, from: '2026-09-07', label: '7-13 Sep', phase: 0, rhythm: 'phase12',
    scooter: 'Language Transfer tracks 1-8 (start tomorrow)',
    gym: 'Wed: Gym Session 1 · Fri: Scooter Tracks 1-2, first pass',
    evening: 'Setup week — Mo: check Frankfurt B1 dates and book, order the two books · Di: import the B1 word list, new cards to 10/day · Mi: Language Transfer, Scooter Tracks into Books, headphones · Do: download Modellsatz, Übungssatz, Wortliste · Fr: baseline Lesen Teil 3 · Sa: prompts into a Claude Project · So: Cards',
    milestone: 'Exam booked (or Monday-check started) · card streak day 1' },

  { n: 2, from: '2026-09-14', label: '14-20 Sep', phase: 1, rhythm: 'phase12',
    scooter: 'LT tracks 9-18',
    gym: 'Scooter Tracks 1-2 (+ replays)',
    evening: 'Cards 10 new/day · grammar ch. 1-2 · Nicos Weg reading · Fr: 5 min Claude voice (Ich heiße ...) · Sa: write 3 sentences about your day · So: Modellsatz Hören Teil 1, listen and read along',
    milestone: '' },

  { n: 3, from: '2026-09-21', label: '21-27 Sep', phase: 1, rhythm: 'phase12',
    scooter: 'LT 19-28',
    gym: 'Scooter Tracks 3-4',
    evening: 'grammar 3-4 · reading · Fr: Claude voice (family, work) · Sa: 5 sentences · So: Hören Teil 1 with answers',
    milestone: '' },

  { n: 4, from: '2026-09-28', label: '28 Sep - 4 Oct', phase: 1, rhythm: 'phase12',
    scooter: 'LT 29-38',
    gym: 'Scooter Tracks 5-6',
    evening: 'grammar 5-6 · reading · Fr: Claude voice · Sa: first Aufgabe 3 from the template, corrected · So: Hören Teil 1 (Übungssatz)',
    milestone: '≈250 words learned' },

  { n: 5, from: '2026-10-05', label: '5-11 Oct', phase: 1, rhythm: 'phase12',
    scooter: 'LT 39-48',
    gym: 'Scooter Tracks 7-8',
    evening: 'grammar 7-8 · reading · Fr: Claude voice · Sa: Aufgabe 3, new prompt · So: Hören Teil 4, listen and read along',
    milestone: '' },

  { n: 6, from: '2026-10-12', label: '12-18 Oct', phase: 1, rhythm: 'phase12',
    scooter: 'LT 49-50, then re-ride the hard tracks',
    gym: 'Scooter Tracks 9-10',
    evening: 'grammar 9-10 · reading · Fr: record your 1-minute self-introduction · Sa: Aufgabe 3 · So: Hören Teil 1 timed',
    milestone: 'Exit test 18 Oct: LT done · ≥400 words · intro recorded · Aufgabe 3 ×2' },

  { n: 7, from: '2026-10-19', label: '19-25 Oct', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 11-15 (new in the morning, replay in the evening)',
    gym: "replay the week's hardest three",
    evening: 'grammar 11-12 · reading · Fr: Claude voice · Sa: first Aufgabe 1 (informal e-mail) from the template · So: Modellsatz Lesen Teil 3, timed 10 min',
    milestone: '' },

  { n: 8, from: '2026-10-26', label: '26 Oct - 1 Nov', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 16-20',
    gym: 'replay',
    evening: 'grammar 13-14 · reading · Fr: Claude voice · Sa: Aufgabe 1 · So: Lesen Teil 4, timed 15 min',
    milestone: '' },

  { n: 9, from: '2026-11-02', label: '2-8 Nov', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 21-25',
    gym: 'replay',
    evening: 'grammar 15-16 · reading · Fr: Claude voice · Sa: Aufgabe 3 · So: Hören Teil 4 with answers',
    milestone: 'Season 2 done' },

  { n: 10, from: '2026-11-09', label: '9-15 Nov', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 26-30',
    gym: 'replay',
    evening: 'grammar 17-18 · reading · Fr: first Teil 1 planning role-play with Claude voice · Sa: Aufgabe 1 · So: Übungssatz Lesen Teil 3',
    milestone: '' },

  { n: 11, from: '2026-11-16', label: '16-22 Nov', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 31-35',
    gym: 'replay',
    evening: 'grammar 19-20 · reading · Fr: Teil 1 role-play · Sa: Aufgabe 3 · So: Lesen Teil 4',
    milestone: '' },

  { n: 12, from: '2026-11-23', label: '23-29 Nov', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 36-40',
    gym: 'replay',
    evening: 'grammar 21-22 · reading · Fr: Teil 1 role-play · Sa: Aufgabe 1 · So: Modellsatz Lesen Teil 3+4 together, timed',
    milestone: 'Checkpoint 29 Nov: ≥800 words · Lesen T3+T4 ≥ 8/14 · Aufgabe 1 and 3 ×3 each' },

  { n: 13, from: '2026-11-30', label: '30 Nov - 6 Dec', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 41-45',
    gym: 'replay',
    evening: 'grammar 23-24 · reading · Fr: Teil 1 role-play · Sa: first Aufgabe 2 (forum post) · So: Hören Teil 1',
    milestone: '' },

  { n: 14, from: '2026-12-07', label: '7-13 Dec', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 46-50',
    gym: 'replay',
    evening: 'grammar 25-26 · reading · Fr: draft presentation #1 (Handys für Kinder) with Claude, make the audio · Sa: Aufgabe 2 · So: Hören Teil 4',
    milestone: 'Season 3 done' },

  { n: 15, from: '2026-12-14', label: '14-20 Dec', phase: 2, rhythm: 'phase12',
    scooter: 'Scooter Tracks 51-55',
    gym: 'replay',
    evening: 'grammar 27-28 · reading · Fr: presentations #2-3 drafted -> audio · Sa: Aufgabe 1 · So: Übungssatz Hören Teil 1 timed',
    milestone: 'Exit test 20 Dec: ≥1,000 words · Hören T1 ≥ 6/10 · 3 presentations as audio' },

  { n: 16, from: '2026-12-21', label: '21-27 Dec', phase: 2, rhythm: 'holiday',
    scooter: 'Holiday mode: replay favourite tracks on any ride',
    gym: '',
    evening: 'Cards every day, even 5 minutes. No evening tasks required.',
    milestone: '' },

  { n: 17, from: '2026-12-28', label: '28 Dec - 3 Jan', phase: 2, rhythm: 'holiday',
    scooter: 'Holiday mode: replay tracks on any ride',
    gym: '',
    evening: 'Cards every day · Sa 2 Jan: one Aufgabe 1 to restart the hand · order the Klett Testbuch',
    milestone: '' },

  { n: 18, from: '2027-01-04', label: '4-10 Jan', phase: 3, rhythm: 'phase3',
    scooter: 'presentation audio #1-3 (shadow) + DW Top-Thema',
    gym: 'replay the hardest tracks',
    evening: 'Cornelsen Test 1 in parts — Mo: Lesen T1-2 · Di: Aufgabe 1 · Mi: Hören T1 · Do: Lesen T3-5 · Fr: Sprechen Teil 1 with the AI examiner · Sa: Aufgabe 2 · So: Hören T2-4',
    milestone: '' },

  { n: 19, from: '2027-01-11', label: '11-17 Jan', phase: 3, rhythm: 'phase3',
    scooter: 'presentations #4-5 drafted -> audio, shadow',
    gym: 'replay the hardest tracks',
    evening: 'Cornelsen Test 2 in parts · Fr: Teil 2 presentation to the AI examiner',
    milestone: '' },

  { n: 20, from: '2027-01-18', label: '18-24 Jan', phase: 3, rhythm: 'phase3',
    scooter: 'presentations + Top-Thema',
    gym: 'Cornelsen Hören audio (pre-listen)',
    evening: 'Cornelsen Test 3 in parts · Fr: Teil 3 feedback and questions',
    milestone: '' },

  { n: 21, from: '2027-01-25', label: '25-31 Jan', phase: 3, rhythm: 'phase3',
    scooter: 'presentation #6 -> audio',
    gym: 'Cornelsen Hören audio',
    evening: 'Cornelsen Test 4 + Übungssatz Lesen and Hören in parts · Fr: full Teil 1-3 with the AI examiner',
    milestone: 'Checkpoint 31 Jan: Lesen ≥ 18/30 · Hören ≥ 18/30 · Aufgabe 1/2 ≥ 24/40 · 6 presentations memorised · new cards -> 5/day' },

  { n: 22, from: '2027-02-01', label: '1-7 Feb', phase: 3, rhythm: 'phase3',
    scooter: 'presentations #7-8 -> audio',
    gym: 'Klett Hören audio, Test 1',
    evening: 'Klett Test 1 in parts · Fr: full three-part Sprechen mock',
    milestone: '' },

  { n: 23, from: '2027-02-08', label: '8-14 Feb', phase: 3, rhythm: 'phase3',
    scooter: 'all 8 presentations, shuffled',
    gym: 'Klett Hören audio, Tests 2-3 (pre-listen)',
    evening: 'Klett Tests 2-3 in parts · Certium mock (optional) · new cards -> 0 from 15 Feb',
    milestone: '' },

  { n: 24, from: '2027-02-15', label: '15-21 Feb', phase: 3, rhythm: 'phase3',
    scooter: 'presentations + Hören audio you have done',
    gym: 'Klett Hören audio, Tests 4-5',
    evening: 'Klett Tests 4-5 in parts · Fr: Sprechen mock',
    milestone: 'Exit test 21 Feb: every part ≥ 60% · logistics written down: ID, Bleichstraße 1, times' },

  { n: 25, from: '2027-02-22', label: '22-28 Feb', phase: 4, rhythm: 'phase3',
    scooter: 'presentations only',
    gym: 'Hören audio you have done',
    evening: 'First-sitting window opens. Klett Test 6 in parts; the last five days before the exam are reviews and presentations only.',
    milestone: '' },

  { n: 26, from: '2027-03-01', label: '1-7 Mar', phase: 4, rhythm: 'phase3',
    scooter: 'presentations only',
    gym: 'Hören audio',
    evening: 'Exam, if this is your date — otherwise Klett Tests 7-8 in parts. After the exam: two days off, then reviews continue.',
    milestone: '' },

  { n: 27, from: '2027-03-08', label: '8-14 Mar', phase: 4, rhythm: 'phase3',
    scooter: "the weak module's audio",
    gym: 'Hören audio',
    evening: 'Results arrive about two weeks after the exam. If a module failed: that module every evening from now on.',
    milestone: '' },

  { n: 28, from: '2027-03-15', label: '15-21 Mar', phase: 4, rhythm: 'phase3',
    scooter: "the weak module's audio",
    gym: 'Hören audio',
    evening: 'Retake drill: one part of the weak module per evening (Klett 9-10 for Lesen/Hören · two writings a week · a daily five-minute Teil 2 talk for Sprechen).',
    milestone: '' },

  { n: 29, from: '2027-03-22', label: '22-28 Mar', phase: 4, rhythm: 'phase3',
    scooter: 'presentations',
    gym: 'Hören audio',
    evening: 'Retake window — the March date you booked. Taper: reviews and presentations only.',
    milestone: '' },

  { n: 30, from: '2027-03-29', label: '29 Mar - 4 Apr', phase: 4, rhythm: 'phase3',
    scooter: '',
    gym: '',
    evening: 'Deadline week: the last retake date, if Frankfurt offers one. Certificates download from Mein Goethe.de about two weeks later.',
    milestone: '' }
];

// ── If it slips ─────────────────────────────────────────────────
// Shown at the bottom of the Plan tab. Missing a week is normal; these are
// the only recoveries that matter.

var B1_RECOVERIES = [
  { when: 'Reviews pass 10 minutes',                 then: 'New cards to 7, then 5. Reviews are never skipped; new cards are the only lever.' },
  { when: 'Rain, illness, a missed ride',            then: 'Nothing to catch up. The audio continues from the same track tomorrow.' },
  { when: 'The evening collapses',                   then: 'Five minutes of reviews counts as the day. Two days without reviews is the only thing that actually damages the plan.' },
  { when: 'Behind on the Scooter Tracks on 3 Jan',   then: 'Stop where you are. Exam mode starts on schedule; the format drills matter more than the last season.' },
  { when: '31 Jan checkpoint missed (under 15/30)',  then: 'Keep the February date and sit all four modules. Passed modules stay passed and March is the retake.' },
  { when: 'Sprechen feels hopeless in February',     then: 'Move Saturday to Sprechen as well; the writing templates are stable by then.' },
  { when: 'No fitting Frankfurt date',               then: 'Goethe-Institut Mannheim-Heidelberg or Bonn. Modules and scoring are identical everywhere.' },
  { when: 'Winter puts you on the U-Bahn',           then: 'Better, not worse: same audio, and you can finally look at Hören questions on the way.' }
];
