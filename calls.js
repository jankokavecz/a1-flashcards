// calls.js — Conversation Practice Scenarios + Logic
// Depends on: app.js (for stopHFListening, speechSynthesis patterns)

var CALLS_SCENARIOS = [
  {
    id: 'restaurant',
    emoji: '🍽️',
    title: 'Einen Tisch reservieren',
    goalEn: 'Book a table for 2 people this Saturday at 7pm',
    type: 'phone',
    role: 'a friendly restaurant host at a German restaurant',
    firstLine: 'Guten Tag, Restaurant Zur Linde, was kann ich für Sie tun?'
  },
  {
    id: 'hotel',
    emoji: '🏨',
    title: 'Ein Hotelzimmer buchen',
    goalEn: 'Book a single room for 3 nights from next Monday',
    type: 'phone',
    role: 'a hotel receptionist at a small German hotel',
    firstLine: 'Guten Tag, Hotel Bergblick, wie kann ich Ihnen helfen?'
  },
  {
    id: 'arzt',
    emoji: '🩺',
    title: 'Einen Arzttermin machen',
    goalEn: 'Make a doctor\'s appointment for a sore throat, as soon as possible',
    type: 'phone',
    role: 'a medical receptionist at a German doctor\'s practice (Arztpraxis)',
    firstLine: 'Praxis Dr. Müller, guten Tag, was kann ich für Sie tun?'
  },
  {
    id: 'krank',
    emoji: '🤒',
    title: 'Sich krankmelden',
    goalEn: 'Call in sick to your boss — you have a fever and can\'t come in today',
    type: 'phone',
    role: 'a friendly German boss or office colleague',
    firstLine: 'Hallo?'
  },
  {
    id: 'taxi',
    emoji: '🚕',
    title: 'Ein Taxi bestellen',
    goalEn: 'Order a taxi to the train station for 8am tomorrow',
    type: 'phone',
    role: 'a taxi dispatcher at a German taxi company',
    firstLine: 'Taxizentrale, guten Tag!'
  },
  {
    id: 'wohnung',
    emoji: '🏠',
    title: 'Eine Wohnung anfragen',
    goalEn: 'Enquire about a 2-room flat you saw advertised — ask about price and when you can view it',
    type: 'phone',
    role: 'a German landlord who has a flat to rent',
    firstLine: 'Hallo?'
  },
  {
    id: 'kurs',
    emoji: '📚',
    title: 'Einen Kurs anmelden',
    goalEn: 'Register for a German language course starting next month',
    type: 'phone',
    role: 'a receptionist at a German language school (Sprachschule)',
    firstLine: 'Sprachschule Berlin, guten Tag, wie kann ich helfen?'
  },
  {
    id: 'absagen',
    emoji: '❌',
    title: 'Einen Termin absagen',
    goalEn: 'Cancel a dentist appointment and reschedule for next week',
    type: 'phone',
    role: 'a receptionist at a German dentist\'s practice',
    firstLine: 'Zahnarztpraxis Schmidt, guten Tag!'
  },
  {
    id: 'fundburo',
    emoji: '🧳',
    title: 'Fundbüro anrufen',
    goalEn: 'Report a lost bag at the train station — describe it and ask if it was found',
    type: 'phone',
    role: 'a helpful staff member at a German lost and found office (Fundbüro)',
    firstLine: 'Fundbüro Hauptbahnhof, guten Tag!'
  },
  {
    id: 'supermarkt',
    emoji: '🛒',
    title: 'Im Supermarkt anrufen',
    goalEn: 'Call a supermarket to ask if they have a specific product and what the opening hours are',
    type: 'phone',
    role: 'a friendly supermarket employee in Germany',
    firstLine: 'REWE Markt, hallo!'
  },
  {
    id: 'erzieherin',
    emoji: '👩‍🏫',
    title: 'Gespräch mit der Erzieherin',
    goalEn: 'Talk to your child\'s kindergarten teacher about how your child is doing',
    type: 'face',
    role: 'a warm kindergarten teacher (Erzieherin) in Germany',
    firstLine: 'Guten Morgen! Wie geht es Ihnen heute?'
  },
  {
    id: 'kinder',
    emoji: '🧒',
    title: 'Gespräch mit Kindergartenkindern',
    goalEn: 'Chat with a group of 5-year-olds at kindergarten — ask about their favourite things',
    type: 'face',
    role: 'a curious and enthusiastic 5-year-old German child at kindergarten. Use very simple German, short sentences, childlike vocabulary. Be playful and ask back.',
    firstLine: 'Hallo! Wie heißt du?'
  },
  {
    id: 'eltern',
    emoji: '👪',
    title: 'Gespräch mit anderen Eltern',
    goalEn: 'Make small talk with another parent at kindergarten drop-off',
    type: 'face',
    role: 'a friendly German parent at a kindergarten',
    firstLine: 'Guten Morgen! Ihr Kind ist auch neu hier, oder?'
  }
];

// ── Calls State ────────────────────────────────────────────────
var callsCurrentScenario = null;    // active scenario object
var callsConversation = [];         // [{role, content}] for OpenAI
var callsRecognition = null;        // SpeechRecognition instance
var callsListening = false;
var callsEnded = false;

function initCalls() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        callsRecognition = new SpeechRecognition();
        callsRecognition.continuous = false;
        callsRecognition.interimResults = false;
        callsRecognition.lang = 'de-DE';

        callsRecognition.onresult = function(event) {
            var transcript = event.results[0][0].transcript;
            callsHandleUserSpeech(transcript);
        };

        callsRecognition.onerror = function(e) {
            if (e.error === 'no-speech' || e.error === 'aborted') return;
            callsSetMicStatus('Tap to speak');
            callsListening = false;
        };

        callsRecognition.onend = function() {
            callsListening = false;
        };
    }

    renderCallsScreen();
}

function callsGetApiKey() {
    return localStorage.getItem('openai_api_key') || '';
}

function callsSaveApiKey(key) {
    localStorage.setItem('openai_api_key', key.trim());
}

function callsGetCompletedCount() {
    return parseInt(localStorage.getItem('calls_completed') || '0', 10);
}

function callsIncrementCompleted() {
    localStorage.setItem('calls_completed', callsGetCompletedCount() + 1);
}

function callsDifficultyInstructions() {
    var n = callsGetCompletedCount();
    if (n <= 3) return 'Speak slowly and clearly. If the user makes a grammar mistake, understand them anyway and keep the conversation going. Use only simple A1 vocabulary.';
    if (n <= 8) return 'Speak at a natural pace. Occasionally ask the user to repeat if something is unclear. Use A1-A2 vocabulary.';
    return 'Speak naturally. Do not simplify your language. If you do not understand, say so in German. Use natural conversational German.';
}
