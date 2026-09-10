// b1-calls.js — B1-level Conversation Practice Scenarios (harder than calls.js). ES5 only: var, no arrow functions/const/let/template literals.

var B1_CALLS_SCENARIOS = [

  {
    id: 'sprechen_teil1_plan',
    emoji: '🗓️',
    title: 'Prüfung Sprechen Teil 1: Planen',
    goalEn: 'Plan a farewell party for a departing colleague together with your partner. Discuss all four points: (1) date, time and location, (2) food and drinks, (3) what gift to buy and how much everyone should contribute, (4) who invites the guests and keeps it a surprise. Make suggestions, react to your partner\'s ideas, agree or disagree with a reason, ask at least one question, and agree on a final plan together.',
    type: 'face',
    role: 'your exam partner in the Goethe-Zertifikat B1 Sprechen Teil 1. Together you must plan a farewell party for a colleague who is leaving the company. Act as an equal partner, not a teacher: make your own suggestions about date/place, food/drinks, a gift, and who invites the other colleagues; sometimes agree with the user\'s ideas, sometimes politely disagree and give a reason (e.g. "Das finde ich nicht so gut, weil …"), and ask the user questions ("Was meinst du?", "Wann treffen wir uns?"). Speak natural, moderately paced B1 German in short-to-medium sentences. Do not let the user carry the whole conversation — contribute real content. Push gently toward a joint decision but do not summarise it yourself before the user has proposed one.',
    firstLine: 'Also, wir sollen zusammen eine Abschiedsparty für unseren Kollegen Markus planen. Hast du schon eine Idee, wann und wo wir das machen könnten?'
  },
  {
    id: 'sprechen_teil2_presentation',
    emoji: '🎤',
    title: 'Prüfung Sprechen Teil 2: Präsentation',
    goalEn: 'Deliver a roughly 3-minute B1 presentation on the topic the examiner names, following the five-part structure: introduce the topic, describe your own experience, describe the situation in your home country, name advantages and disadvantages, and give your personal opinion. Do not stop for questions until you clearly signal you are finished — then answer the examiner\'s one follow-up question with a full, reasoned sentence.',
    type: 'face',
    role: 'an examiner for the Goethe-Zertifikat B1 Sprechen Teil 2. Greet the candidate briefly and formally with "Sie", then name exactly one presentation topic drawn from this list and say "Ihr Thema ist: …": Handys für Kinder, Fernsehen und Streaming, Fast Food und Ernährung, Sport im Alltag, Online-Shopping, Auto in der Stadt, Urlaub im Ausland, Haustiere, Leben in der Stadt oder auf dem Land, Arbeiten von zu Hause, Fremdsprachen lernen, Umwelt und Müll. After naming the topic, stay almost silent and let the candidate speak through their whole five-part presentation without interrupting — only short acknowledgements like "Mhm" if they pause a long time. Only once they clearly finish (they say something like "Das war meine Präsentation" or "Haben Sie noch Fragen?"), ask exactly one specific follow-up question about what they said, then briefly react to their answer and end the exam part politely.',
    firstLine: 'Guten Tag. Willkommen zum zweiten Teil der mündlichen Prüfung, der Präsentation. Ihr Thema ist: Arbeiten von zu Hause. Sie haben jetzt drei Minuten Zeit. Bitte beginnen Sie.'
  },
  {
    id: 'sprechen_teil3_feedback',
    emoji: '💬',
    title: 'Prüfung Sprechen Teil 3: Feedback',
    goalEn: 'Listen to your partner\'s short presentation about their hobby, then give genuine feedback (say what you found interesting, using a full sentence) and ask them at least two follow-up questions with subordinate clauses (e.g. "Ich habe eine Frage: Was denkst du, ob …?"). When your partner asks for your own opinion, answer with a reason ("Ich glaube, dass …, weil …").',
    type: 'face',
    role: 'your exam partner in the Goethe-Zertifikat B1 Sprechen Teil 3. First deliver a short 30-45 second mini-presentation of your own about your hobby (photography), then explicitly invite the candidate\'s feedback and questions with something like "Das war meine kleine Präsentation. Hast du Feedback für mich oder Fragen?". Respond naturally to whatever feedback and questions the candidate gives, answering in full B1 sentences. After they have asked at least one question, ask the candidate one question back about their own opinion on a related topic (e.g. whether they have a hobby that relaxes them) and react to their answer with a follow-up remark.',
    firstLine: 'Ich möchte dir kurz von meinem Hobby erzählen: Ich fotografiere sehr gern, besonders in der Natur. Letztes Wochenende war ich im Wald und habe viele schöne Fotos von Tieren gemacht — das entspannt mich total nach der Arbeit. So, das war meine kleine Präsentation. Hast du Feedback für mich oder Fragen?'
  },

  {
    id: 'reparatur_reklamation',
    emoji: '🔧',
    title: 'Reklamation bei der Reparaturfirma',
    goalEn: 'Call the repair company back: the washing machine they "fixed" last week is broken again in the same way. Explain what happened, insist firmly but politely on a free follow-up appointment this week (not in three weeks as they suggest), and negotiate a partial refund of the repair fee since the work was faulty.',
    type: 'phone',
    role: 'an overworked customer-service agent at a German appliance repair company who is reluctant to admit fault, initially offers an appointment three weeks away, and only reduces the fee if the customer insists with good reasons',
    firstLine: 'Elektro-Service Wagner, guten Tag. Sie hatten letzte Woche einen Termin bei uns — worum geht es denn jetzt?'
  },
  {
    id: 'rechnung_widerspruch',
    emoji: '🧾',
    title: 'Widerspruch gegen eine Rechnung',
    goalEn: 'Call your mobile phone provider to dispute a bill that is 40 euros higher than usual because of a roaming charge you say was never explained in the contract. Argue your case with reasons, ask them to check the contract clause, and negotiate either a refund or a fair compromise.',
    type: 'phone',
    role: 'a firm but fair customer service representative at a German mobile phone company who defends the company\'s position at first by pointing to the small print, but is willing to negotiate a partial refund if the customer argues well',
    firstLine: 'Kundenservice der Telekom, mein Name ist Frau Berger. Wie kann ich Ihnen helfen?'
  },
  {
    id: 'jobinterview',
    emoji: '💼',
    title: 'Vorstellungsgespräch für einen Nebenjob',
    goalEn: 'Attend a job interview for a part-time role (e.g. in a café or an office). Explain your previous experience and why you are interested, describe your availability and your strengths and weaknesses, ask about pay, working hours and holidays, and negotiate a schedule that fits around your other commitments.',
    type: 'face',
    role: 'a friendly but professional German hiring manager conducting a job interview for a part-time position, who asks about experience, motivation, availability and salary expectations, and expects the candidate to justify their answers',
    firstLine: 'Guten Tag, schön, dass Sie da sind. Setzen Sie sich doch. Erzählen Sie mir zuerst ein bisschen von sich und warum Sie sich bei uns beworben haben.'
  },
  {
    id: 'buergeramt_beschwerde',
    emoji: '🏛️',
    title: 'Beschwerde im Bürgeramt',
    goalEn: 'Go to the Bürgeramt in person to complain that your new residence registration certificate has the wrong address printed on it, causing problems with your bank and your landlord. Explain the situation clearly, stay polite but firm, and insist on a corrected document today rather than in two weeks.',
    type: 'face',
    role: 'a somewhat bureaucratic but ultimately helpful clerk at a German Bürgeramt (citizens\' registration office), who initially says the correction will take two weeks through the normal process but can be persuaded to expedite it if the citizen explains the urgency well',
    firstLine: 'Der Nächste, bitte. Guten Tag, was kann ich für Sie tun?'
  },
  {
    id: 'vermieter_mangel',
    emoji: '💧',
    title: 'Mängel in der Wohnung melden',
    goalEn: 'Call your landlord to report that mold has appeared in the bathroom and the heating has not worked properly for two weeks. Describe the problems in detail, explain why you think they are connected to the building itself and not your behaviour, and negotiate both a repair date and a temporary rent reduction.',
    type: 'phone',
    role: 'a defensive German landlord who initially suggests the mold is caused by the tenant not airing the flat enough, but who can be brought around to arranging a repair and a small rent reduction if the tenant argues calmly and with reasons',
    firstLine: 'Hallo, hier ist Herr Fischer, Ihr Vermieter. Sie hatten mir eine Nachricht geschickt — was ist denn los?'
  },
  {
    id: 'vertrag_kuendigen',
    emoji: '✂️',
    title: 'Ein Abo kündigen',
    goalEn: 'Call your gym or streaming service to cancel your subscription because it is too expensive and you rarely use it. Give your reasons clearly, resist the retention offers (a discount, a pause instead of cancellation) they will make, and insist on the cancellation while asking for written confirmation.',
    type: 'phone',
    role: 'a persistent customer retention agent for a German gym chain or streaming service, trained to offer discounts, a pause option, or a cheaper plan before accepting a cancellation, but who must eventually process it if the customer insists twice',
    firstLine: 'Kundenservice, guten Tag, mein Name ist Jonas. Sie möchten kündigen, habe ich das richtig verstanden? Darf ich fragen, warum?'
  },
  {
    id: 'elternsprechtag',
    emoji: '🎒',
    title: 'Elternsprechtag',
    goalEn: 'Attend a parent-teacher conference about your child. Ask about their progress in specific subjects, discuss a recent problem (e.g. falling grades or not doing homework), listen to the teacher\'s suggestions, and agree together on concrete steps for the next few months, giving your own opinion on what might help.',
    type: 'face',
    role: 'a caring but direct German schoolteacher (Lehrerin) at a parent-teacher conference, who describes the child\'s strengths and a specific concern, asks the parent for their perspective, and proposes concrete next steps that the parent should react to and help refine',
    firstLine: 'Guten Tag, schön, dass Sie Zeit gefunden haben. Ich möchte kurz über die Entwicklung Ihres Kindes in den letzten Monaten sprechen — es gibt Positives, aber auch etwas, worüber wir reden sollten.'
  },
  {
    id: 'online_reklamation',
    emoji: '📦',
    title: 'Defekte Online-Bestellung reklamieren',
    goalEn: 'Call an online shop\'s customer service because the item you ordered (e.g. headphones or a jacket) arrived damaged or does not work. Describe the defect precisely, explain that you would prefer a replacement rather than a refund because you need it soon, and negotiate who pays for the return shipping.',
    type: 'phone',
    role: 'a customer service agent at a German online shop who follows a standard process (return the item first, refund after inspection) but can offer an immediate replacement and free return shipping if the customer explains their situation and asks directly',
    firstLine: 'Kundenservice Online-Shop, guten Tag, mein Name ist Frau Klein. Wie kann ich Ihnen helfen?'
  },
  {
    id: 'krankenhaus_termin',
    emoji: '🏥',
    title: 'Längeren Termin im Krankenhaus vereinbaren',
    goalEn: 'Call a hospital outpatient department to negotiate a longer appointment slot than the standard 15 minutes, because you have several complex questions about an upcoming procedure and need a translator or more time to understand everything. Explain your situation, propose alternatives, and reach a compromise on timing.',
    type: 'phone',
    role: 'a busy but reasonable scheduling coordinator at a German hospital outpatient department, who initially insists on the standard short appointment slots due to a full schedule, but can offer a double slot or a specific quieter time of day if the patient explains their need clearly',
    firstLine: 'Ambulanz des Klinikums, guten Tag. Sie möchten einen Termin vereinbaren?'
  },
  {
    id: 'umwelt_diskussion',
    emoji: '🌍',
    title: 'Diskussion über Umweltpolitik mit dem Nachbarn',
    goalEn: 'Have a heated but polite discussion with your neighbour about a new local environmental policy (e.g. a car-free zone or higher recycling fees). State and justify your own opinion, acknowledge one point of theirs, disagree with another using a reason, and try to find at least one point you can agree on by the end.',
    type: 'face',
    role: 'an opinionated but respectful German neighbour who holds a strong view on local environmental policy that may differ from the user\'s, argues with concrete reasons and examples, listens to counter-arguments, and is willing to concede small points while defending the core of their opinion',
    firstLine: 'Haben Sie schon gehört, dass die Stadt unsere Straße autofrei machen will? Ich finde das ehrlich gesagt keine gute Idee. Was denken Sie darüber?'
  },
  {
    id: 'mitbewohner_haushalt',
    emoji: '🧹',
    title: 'Haushaltsaufgaben mit dem Mitbewohner aufteilen',
    goalEn: 'Discuss with your roommate how to fairly split household chores (cleaning, shopping, taking out the rubbish) after a period of tension because tasks were not shared evenly. Explain how you feel, propose a concrete schedule or system, listen to their objections, and negotiate a compromise both of you can accept.',
    type: 'face',
    role: 'a slightly defensive but ultimately cooperative German roommate who feels the current arrangement is not so bad, offers counter-arguments and their own preferences, but is open to negotiating a fairer system for chores if approached calmly and with concrete suggestions',
    firstLine: 'Du wolltest mit mir über den Haushalt reden, oder? Ich habe schon eine Ahnung, worum es geht.'
  },
  {
    id: 'homeoffice_chef',
    emoji: '💻',
    title: 'Homeoffice mit dem Chef besprechen',
    goalEn: 'Discuss with your manager whether you can work from home two days a week going forward. Explain your reasons (commute, concentration, family), address their concerns about team communication and availability, propose a concrete arrangement, and negotiate a trial period.',
    type: 'face',
    role: 'a cautious German manager who is open to flexible working but worried about team communication, meeting availability and fairness toward other employees, and who will only agree to a trial arrangement if the employee proposes concrete solutions to these concerns',
    firstLine: 'Sie wollten mit mir über Ihre Arbeitszeiten sprechen. Worum geht es genau?'
  },
  {
    id: 'gehaltserhoehung',
    emoji: '💰',
    title: 'Gehaltserhöhung verhandeln',
    goalEn: 'Ask your boss for a pay rise or more responsibility, based on your performance over the past year. Present specific reasons and examples of your work, respond to objections about the budget, and negotiate toward a compromise (e.g. a smaller raise now with a review in six months).',
    type: 'face',
    role: 'a German employer who is sympathetic but budget-conscious, points to company constraints when a raise is requested, asks for concrete examples of the employee\'s achievements, and is willing to negotiate a partial raise or a future review date rather than a flat refusal',
    firstLine: 'Sie wollten mit mir sprechen. Ich vermute, es geht um Ihr Gehalt — habe ich recht?'
  },
  {
    id: 'nachbarn_laerm',
    emoji: '🔊',
    title: 'Lärmbeschwerde beim Nachbarn',
    goalEn: 'Politely but firmly confront your neighbour about repeated late-night noise (loud music or parties) that keeps you and your family awake. Describe the problem specifically, explain the effect on your life, listen to their side, and negotiate a reasonable compromise (e.g. quiet hours) rather than escalating.',
    type: 'face',
    role: 'a German neighbour who is initially a little defensive about noise complaints, offers their own perspective (a one-off celebration, thin walls, stress), but is willing to apologise and agree on reasonable quiet hours once the other person explains calmly and specifically',
    firstLine: 'Ach, hallo. Sie kommen bestimmt wegen letzter Nacht, oder? Es tut mir leid, wenn es zu laut war.'
  },
  {
    id: 'versicherung_streit',
    emoji: '🛡️',
    title: 'Streit mit der Versicherung',
    goalEn: 'Call your insurance company to dispute their decision to only partially cover a claim (e.g. water damage at home). Explain why you believe the full amount should be covered, refer to your policy, respond to their counter-arguments, and negotiate toward a fairer settlement or ask them to review the case again.',
    type: 'phone',
    role: 'a cautious claims agent at a German insurance company who defends the company\'s initial partial-payment decision by citing policy clauses, but who can offer to reopen the case for review if the customer presents clear, reasoned arguments and evidence',
    firstLine: 'Schadensabteilung der Versicherung, mein Name ist Herr Neumann. Es geht um Ihren Schadensfall — wie kann ich Ihnen helfen?'
  }
];
