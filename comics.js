// Comics data — 20 cartoon scenes with cat (Katze) and dog (Hund)
// Each scene has an SVG illustration, German speech bubbles, and English translations

var COMICS = [
  {
    id: 1,
    title: "At the Bakery",
    titleDe: "In der Bäckerei",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#FFF8E7"/><rect x="0" y="200" width="400" height="100" fill="#8B4513" rx="0"/><rect x="20" y="180" width="360" height="30" fill="#A0522D" rx="4"/><rect x="40" y="120" width="120" height="60" fill="#DEB887" rx="8" stroke="#8B4513" stroke-width="2"/><ellipse cx="70" cy="140" rx="15" ry="12" fill="#F4A460"/><ellipse cx="100" cy="140" rx="15" ry="12" fill="#F4A460"/><ellipse cx="130" cy="140" rx="15" ry="12" fill="#F4A460"/><circle cx="100" cy="80" r="30" fill="#FF8C00"/><circle cx="85" cy="72" r="5" fill="white"/><circle cx="85" cy="72" r="2.5" fill="#333"/><circle cx="107" cy="72" r="5" fill="white"/><circle cx="107" cy="72" r="2.5" fill="#333"/><path d="M92 82 Q100 90 108 82" fill="none" stroke="#333" stroke-width="2"/><polygon points="78,55 70,35 85,50" fill="#FF8C00"/><polygon points="122,55 130,35 115,50" fill="#FF8C00"/><rect x="80" y="108" width="40" height="50" fill="#FF8C00" rx="10"/><circle cx="300" cy="90" r="28" fill="#8B6914"/><circle cx="287" cy="82" r="5" fill="white"/><circle cx="287" cy="82" r="2.5" fill="#333"/><circle cx="308" cy="82" r="5" fill="white"/><circle cx="308" cy="82" r="2.5" fill="#333"/><ellipse cx="297" cy="92" rx="8" ry="5" fill="#5C4033"/><path d="M290 98 Q297 105 305 98" fill="none" stroke="#333" stroke-width="2"/><ellipse cx="275" cy="65" rx="12" ry="18" fill="#8B6914"/><ellipse cx="320" cy="65" rx="12" ry="18" fill="#8B6914"/><rect x="280" y="116" width="40" height="55" fill="#8B6914" rx="10"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Zehn Brötchen, bitte!", en: "Ten rolls, please!" },
      { speaker: "dog", de: "Zehn?! Du bist eine Katze!", en: "Ten?! You are a cat!" },
      { speaker: "cat", de: "Ich habe Hunger.", en: "I am hungry." }
    ]
  },
  {
    id: 2,
    title: "At the Doctor",
    titleDe: "Beim Arzt",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#E8F4FD"/><rect x="0" y="220" width="400" height="80" fill="#B0C4DE"/><rect x="50" y="150" width="300" height="70" fill="#fff" rx="8" stroke="#ccc" stroke-width="2"/><circle cx="120" cy="100" r="30" fill="#FF8C00"/><circle cx="105" cy="92" r="5" fill="white"/><circle cx="105" cy="92" r="2.5" fill="#333"/><circle cx="130" cy="92" r="5" fill="white"/><circle cx="130" cy="92" r="2.5" fill="#333"/><path d="M112 105 Q120 110 128 105" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="98,75 90,55 105,70" fill="#FF8C00"/><polygon points="142,75 150,55 135,70" fill="#FF8C00"/><rect x="100" y="128" width="40" height="40" fill="#FF8C00" rx="10"/><line x1="115" y1="165" x2="110" y2="195" stroke="#FF8C00" stroke-width="6" stroke-linecap="round"/><line x1="125" y1="165" x2="130" y2="195" stroke="#FF8C00" stroke-width="6" stroke-linecap="round"/><circle cx="290" cy="100" r="28" fill="#8B6914"/><circle cx="277" cy="92" r="5" fill="white"/><circle cx="277" cy="92" r="2.5" fill="#333"/><circle cx="300" cy="92" r="5" fill="white"/><circle cx="300" cy="92" r="2.5" fill="#333"/><ellipse cx="288" cy="102" rx="8" ry="5" fill="#5C4033"/><ellipse cx="267" cy="75" rx="12" ry="18" fill="#8B6914"/><ellipse cx="310" cy="75" rx="12" ry="18" fill="#8B6914"/><rect x="270" y="126" width="40" height="45" fill="white" rx="8" stroke="#ccc" stroke-width="1"/><line x1="290" y1="135" x2="290" y2="160" stroke="red" stroke-width="3"/><line x1="278" y1="148" x2="302" y2="148" stroke="red" stroke-width="3"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Mein Kopf tut weh.", en: "My head hurts." },
      { speaker: "dog", de: "Wie lange schon?", en: "For how long?" },
      { speaker: "cat", de: "Seit ich dich kenne.", en: "Since I've known you." }
    ]
  },
  {
    id: 3,
    title: "Asking for Directions",
    titleDe: "Nach dem Weg fragen",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#87CEEB"/><rect x="0" y="200" width="400" height="100" fill="#808080"/><rect x="0" y="195" width="400" height="10" fill="#696969"/><rect x="160" y="80" width="80" height="120" fill="#CD853F" rx="0"/><rect x="175" y="95" width="20" height="25" fill="#87CEEB" stroke="#8B7355" stroke-width="2"/><rect x="205" y="95" width="20" height="25" fill="#87CEEB" stroke="#8B7355" stroke-width="2"/><rect x="185" y="150" width="25" height="50" fill="#8B4513" rx="2"/><rect x="300" y="100" width="15" height="100" fill="#666"/><rect x="280" y="90" width="55" height="30" fill="#228B22" rx="4"/><text x="307" y="110" text-anchor="middle" fill="white" font-size="10" font-weight="bold">PARK</text><text x="307" y="120" fill="white" font-size="6" text-anchor="middle">→</text><circle cx="80" cy="150" r="28" fill="#FF8C00"/><circle cx="66" cy="142" r="4.5" fill="white"/><circle cx="66" cy="142" r="2" fill="#333"/><circle cx="88" cy="142" r="4.5" fill="white"/><circle cx="88" cy="142" r="2" fill="#333"/><path d="M73 155 Q80 160 87 155" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="60,128 53,110 68,123" fill="#FF8C00"/><polygon points="100,128 107,110 93,123" fill="#FF8C00"/><rect x="60" y="176" width="40" height="40" fill="#FF8C00" rx="10"/><circle cx="80" cy="170" r="0" fill="none"/><circle cx="240" cy="155" r="26" fill="#8B6914"/><circle cx="228" cy="148" r="4.5" fill="white"/><circle cx="228" cy="148" r="2" fill="#333"/><circle cx="250" cy="148" r="4.5" fill="white"/><circle cx="250" cy="148" r="2" fill="#333"/><ellipse cx="239" cy="158" rx="7" ry="4.5" fill="#5C4033"/><ellipse cx="218" cy="133" rx="11" ry="16" fill="#8B6914"/><ellipse cx="258" cy="133" rx="11" ry="16" fill="#8B6914"/><rect x="220" y="179" width="38" height="35" fill="#8B6914" rx="10"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Entschuldigung, wo ist der Park?", en: "Excuse me, where is the park?" },
      { speaker: "dog", de: "Gehen Sie geradeaus und dann links.", en: "Go straight ahead and then left." },
      { speaker: "cat", de: "Ich gehe lieber rechts. Ich bin eine Katze.", en: "I prefer going right. I am a cat." }
    ]
  },
  {
    id: 4,
    title: "At the Supermarket",
    titleDe: "Im Supermarkt",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#F5F5DC"/><rect x="20" y="100" width="360" height="120" fill="#fff" rx="4" stroke="#ddd" stroke-width="2"/><rect x="30" y="110" width="80" height="50" fill="#FFD700" rx="4"/><rect x="120" y="110" width="80" height="50" fill="#FF6347" rx="4"/><rect x="210" y="110" width="80" height="50" fill="#32CD32" rx="4"/><rect x="300" y="110" width="70" height="50" fill="#FF8C00" rx="4"/><text x="70" y="140" text-anchor="middle" fill="#333" font-size="10" font-weight="bold">Käse</text><text x="160" y="140" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Tomaten</text><text x="250" y="140" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Salat</text><text x="335" y="140" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Brot</text><circle cx="100" cy="60" r="25" fill="#FF8C00"/><circle cx="88" cy="53" r="4" fill="white"/><circle cx="88" cy="53" r="2" fill="#333"/><circle cx="108" cy="53" r="4" fill="white"/><circle cx="108" cy="53" r="2" fill="#333"/><path d="M94 65 Q100 70 106 65" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="80,38 74,22 87,34" fill="#FF8C00"/><polygon points="120,38 126,22 113,34" fill="#FF8C00"/><rect x="80" y="83" width="40" height="35" fill="#FF8C00" rx="8"/><circle cx="300" cy="60" r="24" fill="#8B6914"/><circle cx="289" cy="53" r="4" fill="white"/><circle cx="289" cy="53" r="2" fill="#333"/><circle cx="309" cy="53" r="4" fill="white"/><circle cx="309" cy="53" r="2" fill="#333"/><ellipse cx="299" cy="63" rx="7" ry="4" fill="#5C4033"/><ellipse cx="280" cy="40" rx="10" ry="15" fill="#8B6914"/><ellipse cx="318" cy="40" rx="10" ry="15" fill="#8B6914"/><rect x="280" y="82" width="38" height="35" fill="#8B6914" rx="8"/><rect x="130" y="230" width="140" height="50" fill="#ccc" rx="6" stroke="#999" stroke-width="2"/><circle cx="160" cy="280" r="10" fill="#666"/><circle cx="240" cy="280" r="10" fill="#666"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Wir brauchen Milch und Eier.", en: "We need milk and eggs." },
      { speaker: "cat", de: "Und Fisch! Wir brauchen Fisch!", en: "And fish! We need fish!" },
      { speaker: "dog", de: "Fisch steht nicht auf der Liste.", en: "Fish is not on the list." },
      { speaker: "cat", de: "Dann ist die Liste falsch.", en: "Then the list is wrong." }
    ]
  },
  {
    id: 5,
    title: "Morning Routine",
    titleDe: "Die Morgenroutine",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#2C3E50"/><rect x="50" y="100" width="300" height="150" fill="#34495E" rx="8"/><rect x="70" y="130" width="120" height="80" fill="#1a1a2e" rx="4"/><circle cx="320" cy="60" r="40" fill="#F1C40F"/><line x1="320" y1="20" x2="320" y2="5" stroke="#F1C40F" stroke-width="3"/><line x1="355" y1="30" x2="365" y2="20" stroke="#F1C40F" stroke-width="3"/><line x1="360" y1="60" x2="375" y2="60" stroke="#F1C40F" stroke-width="3"/><circle cx="130" cy="170" r="25" fill="#FF8C00"/><circle cx="118" cy="163" r="4" fill="white"/><circle cx="118" cy="165" r="2" fill="#333"/><circle cx="138" cy="163" r="4" fill="white"/><circle cx="138" cy="165" r="2" fill="#333"/><path d="M125 175 Q130 172 135 175" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="110,148 104,132 117,144" fill="#FF8C00"/><polygon points="150,148 156,132 143,144" fill="#FF8C00"/><rect x="110" y="193" width="40" height="40" fill="#FF8C00" rx="8"/><circle cx="290" cy="170" r="24" fill="#8B6914"/><circle cx="278" cy="163" r="4" fill="white"/><circle cx="278" cy="163" r="2" fill="#333"/><circle cx="298" cy="163" r="4" fill="white"/><circle cx="298" cy="163" r="2" fill="#333"/><ellipse cx="288" cy="173" rx="7" ry="4" fill="#5C4033"/><path d="M282 178 Q288 184 295 178" fill="none" stroke="#333" stroke-width="1.5"/><ellipse cx="270" cy="150" rx="10" ry="15" fill="#8B6914"/><ellipse cx="308" cy="150" rx="10" ry="15" fill="#8B6914"/><rect x="270" y="192" width="38" height="35" fill="#8B6914" rx="8"/><rect x="200" y="145" width="50" height="70" fill="#6F4E37" rx="4"/><path d="M250 170 Q265 170 265 185 Q265 195 250 195" fill="none" stroke="#6F4E37" stroke-width="4"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Guten Morgen! Es ist sechs Uhr.", en: "Good morning! It's six o'clock." },
      { speaker: "cat", de: "Sechs Uhr?! Das ist mitten in der Nacht!", en: "Six o'clock?! That's the middle of the night!" },
      { speaker: "dog", de: "Möchtest du Kaffee?", en: "Would you like coffee?" },
      { speaker: "cat", de: "Ich möchte schlafen.", en: "I want to sleep." }
    ]
  },
  {
    id: 6,
    title: "At the Train Station",
    titleDe: "Am Bahnhof",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#D4E6F1"/><rect x="0" y="180" width="400" height="20" fill="#95A5A6"/><rect x="0" y="200" width="400" height="100" fill="#7F8C8D"/><rect x="50" y="100" width="300" height="80" fill="#2C3E50" rx="8"/><rect x="60" y="110" width="60" height="50" fill="#85C1E9" rx="4"/><rect x="130" y="110" width="60" height="50" fill="#85C1E9" rx="4"/><rect x="200" y="110" width="60" height="50" fill="#85C1E9" rx="4"/><rect x="270" y="110" width="60" height="50" fill="#85C1E9" rx="4"/><circle cx="90" cy="185" r="12" fill="#333"/><circle cx="170" cy="185" r="12" fill="#333"/><circle cx="250" cy="185" r="12" fill="#333"/><circle cx="330" cy="185" r="12" fill="#333"/><rect x="100" y="20" width="100" height="40" fill="#2C3E50" rx="4"/><text x="150" y="45" text-anchor="middle" fill="#F1C40F" font-size="14" font-weight="bold">Gleis 3</text><circle cx="80" cy="240" r="22" fill="#FF8C00"/><circle cx="69" cy="233" r="3.5" fill="white"/><circle cx="69" cy="233" r="1.8" fill="#333"/><circle cx="87" cy="233" r="3.5" fill="white"/><circle cx="87" cy="233" r="1.8" fill="#333"/><path d="M74 245 Q80 250 86 245" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="62,218 56,204 69,214" fill="#FF8C00"/><polygon points="98,218 104,204 91,214" fill="#FF8C00"/><rect x="62" y="260" width="36" height="30" fill="#FF8C00" rx="8"/><circle cx="330" cy="240" r="22" fill="#8B6914"/><circle cx="319" cy="233" r="3.5" fill="white"/><circle cx="319" cy="233" r="1.8" fill="#333"/><circle cx="339" cy="233" r="3.5" fill="white"/><circle cx="339" cy="233" r="1.8" fill="#333"/><ellipse cx="329" cy="243" rx="6" ry="3.5" fill="#5C4033"/><ellipse cx="312" cy="222" rx="9" ry="13" fill="#8B6914"/><ellipse cx="346" cy="222" rx="9" ry="13" fill="#8B6914"/><rect x="312" y="260" width="34" height="30" fill="#8B6914" rx="8"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Wann fährt der Zug nach Berlin?", en: "When does the train to Berlin leave?" },
      { speaker: "dog", de: "Um halb zehn, Gleis drei.", en: "At half past nine, platform three." },
      { speaker: "cat", de: "Ist das der richtige Zug?", en: "Is that the right train?" },
      { speaker: "dog", de: "Nein, das ist ein Zug nach Hamburg.", en: "No, that's a train to Hamburg." }
    ]
  },
  {
    id: 7,
    title: "At the Restaurant",
    titleDe: "Im Restaurant",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#2C1810"/><rect x="50" y="140" width="300" height="20" fill="#8B4513" rx="2"/><rect x="100" y="160" width="10" height="100" fill="#5C3317"/><rect x="290" y="160" width="10" height="100" fill="#5C3317"/><circle cx="150" cy="130" r="30" fill="white" stroke="#ddd" stroke-width="2"/><circle cx="250" cy="130" r="30" fill="white" stroke="#ddd" stroke-width="2"/><circle cx="150" cy="130" r="5" fill="#FF6347"/><circle cx="250" cy="130" r="5" fill="#8B4513"/><circle cx="100" cy="80" r="25" fill="#FF8C00"/><circle cx="89" cy="73" r="4" fill="white"/><circle cx="89" cy="73" r="2" fill="#333"/><circle cx="108" cy="73" r="4" fill="white"/><circle cx="108" cy="73" r="2" fill="#333"/><path d="M94 85 Q100 92 106 85" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="80,58 74,42 87,54" fill="#FF8C00"/><polygon points="120,58 126,42 113,54" fill="#FF8C00"/><rect x="82" y="103" width="36" height="30" fill="#FF8C00" rx="8"/><circle cx="300" cy="80" r="24" fill="#8B6914"/><circle cx="289" cy="73" r="4" fill="white"/><circle cx="289" cy="73" r="2" fill="#333"/><circle cx="309" cy="73" r="4" fill="white"/><circle cx="309" cy="73" r="2" fill="#333"/><ellipse cx="299" cy="83" rx="7" ry="4" fill="#5C4033"/><path d="M293 88 Q299 94 306 88" fill="none" stroke="#333" stroke-width="1.5"/><ellipse cx="281" cy="60" rx="10" ry="15" fill="#8B6914"/><ellipse cx="318" cy="60" rx="10" ry="15" fill="#8B6914"/><rect x="281" y="102" width="36" height="30" fill="#8B6914" rx="8"/><rect x="170" y="110" width="3" height="25" fill="#888"/><rect x="165" y="108" width="13" height="4" fill="#888" rx="1"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Ich nehme die Suppe, bitte.", en: "I'll have the soup, please." },
      { speaker: "cat", de: "Haben Sie Fisch?", en: "Do you have fish?" },
      { speaker: "dog", de: "Du bestellst immer Fisch!", en: "You always order fish!" },
      { speaker: "cat", de: "Und du bestellst immer Suppe. Wir sind gleich.", en: "And you always order soup. We are the same." }
    ]
  },
  {
    id: 8,
    title: "Learning Numbers",
    titleDe: "Zahlen lernen",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#E8F5E9"/><rect x="60" y="40" width="280" height="180" fill="#2E7D32" rx="8"/><text x="200" y="90" text-anchor="middle" fill="white" font-size="40" font-weight="bold">1 + 1 = ?</text><text x="100" y="150" fill="#FFD700" font-size="24" font-weight="bold">A) 2</text><text x="220" y="150" fill="#FFD700" font-size="24" font-weight="bold">B) 11</text><text x="100" y="190" fill="#FFD700" font-size="24" font-weight="bold">C) 3</text><text x="220" y="190" fill="#FFD700" font-size="24" font-weight="bold">D) Fisch</text><circle cx="100" cy="260" r="22" fill="#FF8C00"/><circle cx="89" cy="253" r="3.5" fill="white"/><circle cx="89" cy="253" r="1.8" fill="#333"/><circle cx="108" cy="253" r="3.5" fill="white"/><circle cx="108" cy="253" r="1.8" fill="#333"/><path d="M94 265 Q100 272 106 265" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="82,238 76,224 89,234" fill="#FF8C00"/><polygon points="118,238 124,224 111,234" fill="#FF8C00"/><circle cx="300" cy="260" r="22" fill="#8B6914"/><circle cx="289" cy="253" r="3.5" fill="white"/><circle cx="289" cy="253" r="1.8" fill="#333"/><circle cx="309" cy="253" r="3.5" fill="white"/><circle cx="309" cy="253" r="1.8" fill="#333"/><ellipse cx="299" cy="263" rx="6" ry="3.5" fill="#5C4033"/><ellipse cx="282" cy="242" rx="9" ry="13" fill="#8B6914"/><ellipse cx="316" cy="242" rx="9" ry="13" fill="#8B6914"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Was ist eins plus eins?", en: "What is one plus one?" },
      { speaker: "cat", de: "Elf!", en: "Eleven!" },
      { speaker: "dog", de: "Nein! Die Antwort ist zwei.", en: "No! The answer is two." },
      { speaker: "cat", de: "Für Katzen ist es elf.", en: "For cats it's eleven." }
    ]
  },
  {
    id: 9,
    title: "The Weather",
    titleDe: "Das Wetter",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#87CEEB"/><circle cx="320" cy="60" r="35" fill="#F1C40F"/><ellipse cx="120" cy="50" rx="50" ry="25" fill="white"/><ellipse cx="90" cy="45" rx="30" ry="20" fill="white"/><ellipse cx="150" cy="45" rx="30" ry="20" fill="white"/><line x1="100" y1="75" x2="95" y2="100" stroke="#5DADE2" stroke-width="2"/><line x1="115" y1="75" x2="110" y2="100" stroke="#5DADE2" stroke-width="2"/><line x1="130" y1="75" x2="125" y2="100" stroke="#5DADE2" stroke-width="2"/><rect x="0" y="220" width="400" height="80" fill="#27AE60"/><circle cx="100" cy="180" r="25" fill="#FF8C00"/><circle cx="89" cy="173" r="4" fill="white"/><circle cx="89" cy="173" r="2" fill="#333"/><circle cx="108" cy="173" r="4" fill="white"/><circle cx="108" cy="173" r="2" fill="#333"/><path d="M95 188 Q100 185 105 188" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="82,158 76,142 89,154" fill="#FF8C00"/><polygon points="118,158 124,142 111,154" fill="#FF8C00"/><rect x="82" y="203" width="36" height="30" fill="#FF8C00" rx="8"/><circle cx="300" cy="180" r="24" fill="#8B6914"/><circle cx="289" cy="173" r="4" fill="white"/><circle cx="289" cy="173" r="2" fill="#333"/><circle cx="309" cy="173" r="4" fill="white"/><circle cx="309" cy="173" r="2" fill="#333"/><ellipse cx="299" cy="183" rx="7" ry="4" fill="#5C4033"/><path d="M293 188 Q299 194 306 188" fill="none" stroke="#333" stroke-width="1.5"/><ellipse cx="281" cy="160" rx="10" ry="15" fill="#8B6914"/><ellipse cx="318" cy="160" rx="10" ry="15" fill="#8B6914"/><rect x="281" y="202" width="36" height="30" fill="#8B6914" rx="8"/><ellipse cx="305" cy="215" rx="15" ry="5" fill="#3498DB" opacity="0.5"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Heute regnet es.", en: "It's raining today." },
      { speaker: "cat", de: "Ich hasse Regen.", en: "I hate rain." },
      { speaker: "dog", de: "Aber die Blumen brauchen Wasser!", en: "But the flowers need water!" },
      { speaker: "cat", de: "Die Blumen können warten.", en: "The flowers can wait." }
    ]
  },
  {
    id: 10,
    title: "At School",
    titleDe: "In der Schule",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#FFF3E0"/><rect x="50" y="30" width="300" height="150" fill="#2E7D32" rx="4"/><rect x="45" y="25" width="310" height="10" fill="#5C3317" rx="2"/><text x="200" y="80" text-anchor="middle" fill="white" font-size="16">Deutsch ist</text><text x="200" y="110" text-anchor="middle" fill="#FFD700" font-size="28" font-weight="bold">wunderbar!</text><rect x="50" y="200" width="120" height="60" fill="#8D6E63" rx="4"/><rect x="230" y="200" width="120" height="60" fill="#8D6E63" rx="4"/><circle cx="110" cy="170" r="22" fill="#FF8C00"/><circle cx="100" cy="163" r="3.5" fill="white"/><circle cx="100" cy="163" r="1.8" fill="#333"/><circle cx="118" cy="163" r="3.5" fill="white"/><circle cx="118" cy="163" r="1.8" fill="#333"/><path d="M104 175 Q110 170 116 175" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="92,150 87,136 99,146" fill="#FF8C00"/><polygon points="128,150 133,136 121,146" fill="#FF8C00"/><circle cx="290" cy="170" r="22" fill="#8B6914"/><circle cx="280" cy="163" r="3.5" fill="white"/><circle cx="280" cy="163" r="1.8" fill="#333"/><circle cx="298" cy="163" r="3.5" fill="white"/><circle cx="298" cy="163" r="1.8" fill="#333"/><ellipse cx="289" cy="173" rx="6" ry="3.5" fill="#5C4033"/><path d="M283 178 Q289 184 296 178" fill="none" stroke="#333" stroke-width="1.5"/><ellipse cx="272" cy="152" rx="9" ry="13" fill="#8B6914"/><ellipse cx="306" cy="152" rx="9" ry="13" fill="#8B6914"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Heute lernen wir Deutsch.", en: "Today we are learning German." },
      { speaker: "cat", de: "Ich spreche schon Deutsch.", en: "I already speak German." },
      { speaker: "dog", de: "Du sprichst nur 'Miau'.", en: "You only say 'Meow'." },
      { speaker: "cat", de: "Das ist Deutsch für Katzen.", en: "That's German for cats." }
    ]
  },
  {
    id: 11,
    title: "Phone Call",
    titleDe: "Das Telefonat",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#E8EAF6"/><rect x="0" y="230" width="400" height="70" fill="#C5CAE9"/><line x1="200" y1="0" x2="200" y2="300" stroke="#9FA8DA" stroke-width="2" stroke-dasharray="10,5"/><circle cx="100" cy="140" r="28" fill="#FF8C00"/><circle cx="87" cy="132" r="4.5" fill="white"/><circle cx="87" cy="132" r="2" fill="#333"/><circle cx="109" cy="132" r="4.5" fill="white"/><circle cx="109" cy="132" r="2" fill="#333"/><path d="M93 147 Q100 153 107 147" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="80,117 73,100 87,113" fill="#FF8C00"/><polygon points="120,117 127,100 113,113" fill="#FF8C00"/><rect x="80" y="166" width="40" height="40" fill="#FF8C00" rx="10"/><rect x="125" y="145" width="15" height="25" fill="#333" rx="3"/><circle cx="132" cy="150" r="2" fill="#4CAF50"/><circle cx="300" cy="140" r="26" fill="#8B6914"/><circle cx="289" cy="132" r="4" fill="white"/><circle cx="289" cy="132" r="2" fill="#333"/><circle cx="309" cy="132" r="4" fill="white"/><circle cx="309" cy="132" r="2" fill="#333"/><ellipse cx="299" cy="142" rx="7" ry="4" fill="#5C4033"/><path d="M293 147 Q299 153 306 147" fill="none" stroke="#333" stroke-width="1.5"/><ellipse cx="281" cy="118" rx="10" ry="15" fill="#8B6914"/><ellipse cx="318" cy="118" rx="10" ry="15" fill="#8B6914"/><rect x="280" y="164" width="38" height="38" fill="#8B6914" rx="10"/><rect x="260" y="143" width="15" height="25" fill="#333" rx="3"/><circle cx="267" cy="148" r="2" fill="#4CAF50"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Hallo? Wer ist da?", en: "Hello? Who's there?" },
      { speaker: "dog", de: "Ich bin es, dein Freund!", en: "It's me, your friend!" },
      { speaker: "cat", de: "Ich habe keine Freunde. Ich bin eine Katze.", en: "I have no friends. I am a cat." },
      { speaker: "dog", de: "Aber ich rufe dich jeden Tag an!", en: "But I call you every day!" }
    ]
  },
  {
    id: 12,
    title: "At the Post Office",
    titleDe: "Auf der Post",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#FFF9C4"/><rect x="50" y="60" width="300" height="40" fill="#F57F17" rx="4"/><text x="200" y="87" text-anchor="middle" fill="white" font-size="18" font-weight="bold">POST</text><rect x="80" y="120" width="240" height="100" fill="#fff" rx="4" stroke="#ccc" stroke-width="2"/><rect x="100" y="140" width="80" height="55" fill="#FFF9C4" rx="2" stroke="#F57F17" stroke-width="2"/><path d="M100 140 L140 170 L180 140" fill="none" stroke="#F57F17" stroke-width="2"/><rect x="220" y="145" width="30" height="25" fill="#E57373" rx="2"/><text x="235" y="162" text-anchor="middle" fill="white" font-size="10" font-weight="bold">1€</text><circle cx="100" cy="260" r="22" fill="#FF8C00"/><circle cx="89" cy="253" r="3.5" fill="white"/><circle cx="89" cy="253" r="1.8" fill="#333"/><circle cx="108" cy="253" r="3.5" fill="white"/><circle cx="108" cy="253" r="1.8" fill="#333"/><path d="M94 265 Q100 272 106 265" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="82,238 76,224 89,234" fill="#FF8C00"/><polygon points="118,238 124,224 111,234" fill="#FF8C00"/><rect x="82" y="280" width="36" height="18" fill="#FF8C00" rx="6"/><circle cx="300" cy="260" r="22" fill="#8B6914"/><circle cx="289" cy="253" r="3.5" fill="white"/><circle cx="289" cy="253" r="1.8" fill="#333"/><circle cx="309" cy="253" r="3.5" fill="white"/><circle cx="309" cy="253" r="1.8" fill="#333"/><ellipse cx="299" cy="263" rx="6" ry="3.5" fill="#5C4033"/><ellipse cx="282" cy="242" rx="9" ry="13" fill="#8B6914"/><ellipse cx="316" cy="242" rx="9" ry="13" fill="#8B6914"/><rect x="282" y="280" width="34" height="18" fill="#8B6914" rx="6"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Ich möchte einen Brief nach Wien schicken.", en: "I would like to send a letter to Vienna." },
      { speaker: "dog", de: "Was steht in dem Brief?", en: "What's in the letter?" },
      { speaker: "cat", de: "Das ist ein Geheimnis.", en: "That's a secret." },
      { speaker: "dog", de: "Du kannst nicht schreiben!", en: "You can't write!" }
    ]
  },
  {
    id: 13,
    title: "Cooking Together",
    titleDe: "Zusammen kochen",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#FAFAFA"/><rect x="50" y="180" width="300" height="80" fill="#795548" rx="4"/><rect x="100" y="120" width="200" height="65" fill="#9E9E9E" rx="8" stroke="#757575" stroke-width="2"/><ellipse cx="200" cy="120" rx="80" ry="10" fill="#BDBDBD"/><path d="M160 105 Q165 85 170 105" fill="none" stroke="#ccc" stroke-width="2"/><path d="M190 100 Q195 80 200 100" fill="none" stroke="#ccc" stroke-width="2"/><path d="M220 105 Q225 85 230 105" fill="none" stroke="#ccc" stroke-width="2"/><circle cx="100" cy="80" r="24" fill="#FF8C00"/><circle cx="89" cy="73" r="4" fill="white"/><circle cx="89" cy="73" r="2" fill="#333"/><circle cx="108" cy="73" r="4" fill="white"/><circle cx="108" cy="73" r="2" fill="#333"/><path d="M95 86 Q100 92 105 86" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="80,58 74,42 87,54" fill="#FF8C00"/><polygon points="120,58 126,42 113,54" fill="#FF8C00"/><rect x="82" y="102" width="36" height="30" fill="#FF8C00" rx="8"/><rect x="60" y="100" width="25" height="4" fill="white" rx="2"/><circle cx="300" cy="80" r="24" fill="#8B6914"/><circle cx="289" cy="73" r="4" fill="white"/><circle cx="289" cy="73" r="2" fill="#333"/><circle cx="309" cy="73" r="4" fill="white"/><circle cx="309" cy="73" r="2" fill="#333"/><ellipse cx="299" cy="83" rx="7" ry="4" fill="#5C4033"/><ellipse cx="281" cy="60" rx="10" ry="15" fill="#8B6914"/><ellipse cx="318" cy="60" rx="10" ry="15" fill="#8B6914"/><rect x="281" y="102" width="36" height="30" fill="#8B6914" rx="8"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Heute kochen wir Pasta!", en: "Today we're cooking pasta!" },
      { speaker: "cat", de: "Ich kann nicht kochen.", en: "I can't cook." },
      { speaker: "dog", de: "Du musst nur das Wasser kochen.", en: "You just have to boil the water." },
      { speaker: "cat", de: "Das Wasser ist zu heiß!", en: "The water is too hot!" }
    ]
  },
  {
    id: 14,
    title: "Clothes Shopping",
    titleDe: "Kleidung kaufen",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#FCE4EC"/><rect x="80" y="30" width="240" height="180" fill="#fff" rx="8" stroke="#E91E63" stroke-width="2"/><line x1="80" y1="60" x2="320" y2="60" stroke="#E91E63" stroke-width="1"/><text x="200" y="52" text-anchor="middle" fill="#E91E63" font-size="14" font-weight="bold">KLEIDUNG</text><path d="M120 90 L140 75 L160 90 L155 90 L155 140 L125 140 L125 90 Z" fill="#42A5F5"/><path d="M200 90 L220 75 L240 90 L235 90 L235 140 L205 140 L205 90 Z" fill="#EF5350"/><rect x="270" y="80" width="30" height="60" fill="#66BB6A" rx="4"/><text x="285" y="115" text-anchor="middle" fill="white" font-size="8">XL</text><circle cx="100" cy="250" r="22" fill="#FF8C00"/><circle cx="89" cy="243" r="3.5" fill="white"/><circle cx="89" cy="243" r="1.8" fill="#333"/><circle cx="108" cy="243" r="3.5" fill="white"/><circle cx="108" cy="243" r="1.8" fill="#333"/><path d="M94 256 Q100 262 106 256" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="82,228 76,214 89,224" fill="#FF8C00"/><polygon points="118,228 124,214 111,224" fill="#FF8C00"/><rect x="82" y="270" width="36" height="25" fill="#FF8C00" rx="6"/><circle cx="300" cy="250" r="22" fill="#8B6914"/><circle cx="289" cy="243" r="3.5" fill="white"/><circle cx="289" cy="243" r="1.8" fill="#333"/><circle cx="309" cy="243" r="3.5" fill="white"/><circle cx="309" cy="243" r="1.8" fill="#333"/><ellipse cx="299" cy="253" rx="6" ry="3.5" fill="#5C4033"/><ellipse cx="282" cy="232" rx="9" ry="13" fill="#8B6914"/><ellipse cx="316" cy="232" rx="9" ry="13" fill="#8B6914"/><rect x="282" y="270" width="34" height="25" fill="#8B6914" rx="6"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Dieses Kleid ist sehr schön!", en: "This dress is very beautiful!" },
      { speaker: "dog", de: "Du bist eine Katze. Du brauchst kein Kleid.", en: "You're a cat. You don't need a dress." },
      { speaker: "cat", de: "Ich brauche auch keine Schuhe. Aber ich will!", en: "I don't need shoes either. But I want them!" }
    ]
  },
  {
    id: 15,
    title: "At the Hotel",
    titleDe: "Im Hotel",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#E3F2FD"/><rect x="100" y="40" width="200" height="200" fill="#78909C" rx="4"/><rect x="100" y="40" width="200" height="30" fill="#546E7A" rx="4 4 0 0"/><text x="200" y="60" text-anchor="middle" fill="white" font-size="14" font-weight="bold">HOTEL</text><rect x="120" y="85" width="35" height="30" fill="#BBDEFB" rx="2"/><rect x="165" y="85" width="35" height="30" fill="#BBDEFB" rx="2"/><rect x="210" y="85" width="35" height="30" fill="#BBDEFB" rx="2"/><rect x="260" y="85" width="25" height="30" fill="#FFF176" rx="2"/><rect x="120" y="130" width="35" height="30" fill="#BBDEFB" rx="2"/><rect x="165" y="130" width="35" height="30" fill="#BBDEFB" rx="2"/><rect x="210" y="130" width="35" height="30" fill="#BBDEFB" rx="2"/><rect x="260" y="130" width="25" height="30" fill="#BBDEFB" rx="2"/><rect x="175" y="185" width="50" height="55" fill="#5D4037" rx="4"/><circle cx="219" cy="215" r="3" fill="#FFC107"/><circle cx="100" cy="270" r="22" fill="#FF8C00"/><circle cx="89" cy="263" r="3.5" fill="white"/><circle cx="89" cy="263" r="1.8" fill="#333"/><circle cx="108" cy="263" r="3.5" fill="white"/><circle cx="108" cy="263" r="1.8" fill="#333"/><path d="M94 275 Q100 280 106 275" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="82,248 76,234 89,244" fill="#FF8C00"/><polygon points="118,248 124,234 111,244" fill="#FF8C00"/><circle cx="300" cy="270" r="22" fill="#8B6914"/><circle cx="289" cy="263" r="3.5" fill="white"/><circle cx="289" cy="263" r="1.8" fill="#333"/><circle cx="309" cy="263" r="3.5" fill="white"/><circle cx="309" cy="263" r="1.8" fill="#333"/><ellipse cx="299" cy="273" rx="6" ry="3.5" fill="#5C4033"/><ellipse cx="282" cy="252" rx="9" ry="13" fill="#8B6914"/><ellipse cx="316" cy="252" rx="9" ry="13" fill="#8B6914"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Haben Sie ein Zimmer frei?", en: "Do you have a room available?" },
      { speaker: "dog", de: "Ja, Zimmer 404. Dritter Stock.", en: "Yes, room 404. Third floor." },
      { speaker: "cat", de: "Hat das Zimmer ein Bett?", en: "Does the room have a bed?" },
      { speaker: "dog", de: "Natürlich! Was erwartest du?", en: "Of course! What do you expect?" },
      { speaker: "cat", de: "Einen Kratzbaum.", en: "A scratching post." }
    ]
  },
  {
    id: 16,
    title: "At the Park",
    titleDe: "Im Park",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#81C784"/><rect x="0" y="200" width="400" height="100" fill="#4CAF50"/><circle cx="80" cy="100" r="40" fill="#2E7D32"/><rect x="75" y="130" width="10" height="70" fill="#5D4037"/><circle cx="320" cy="80" r="35" fill="#2E7D32"/><rect x="315" y="110" width="10" height="90" fill="#5D4037"/><circle cx="200" cy="60" r="30" fill="#F1C40F"/><ellipse cx="200" cy="230" rx="40" ry="6" fill="#388E3C"/><circle cx="140" cy="180" r="25" fill="#FF8C00"/><circle cx="128" cy="173" r="4" fill="white"/><circle cx="128" cy="173" r="2" fill="#333"/><circle cx="148" cy="173" r="4" fill="white"/><circle cx="148" cy="173" r="2" fill="#333"/><path d="M134 188 Q140 195 146 188" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="122,158 116,142 129,154" fill="#FF8C00"/><polygon points="158,158 164,142 151,154" fill="#FF8C00"/><rect x="122" y="203" width="36" height="30" fill="#FF8C00" rx="8"/><circle cx="270" cy="180" r="24" fill="#8B6914"/><circle cx="259" cy="173" r="4" fill="white"/><circle cx="259" cy="173" r="2" fill="#333"/><circle cx="279" cy="173" r="4" fill="white"/><circle cx="279" cy="173" r="2" fill="#333"/><ellipse cx="269" cy="183" rx="7" ry="4" fill="#5C4033"/><path d="M263 188 Q269 195 276 188" fill="none" stroke="#333" stroke-width="1.5"/><ellipse cx="252" cy="160" rx="10" ry="15" fill="#8B6914"/><ellipse cx="288" cy="160" rx="10" ry="15" fill="#8B6914"/><rect x="252" y="202" width="36" height="30" fill="#8B6914" rx="8"/><ellipse cx="310" cy="220" rx="20" ry="8" fill="#E53935" rx="4"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Lass uns spielen! Wirf den Ball!", en: "Let's play! Throw the ball!" },
      { speaker: "cat", de: "Ich werfe keine Bälle.", en: "I don't throw balls." },
      { speaker: "dog", de: "Was machst du dann im Park?", en: "What do you do in the park then?" },
      { speaker: "cat", de: "Ich sitze in der Sonne und schlafe.", en: "I sit in the sun and sleep." }
    ]
  },
  {
    id: 17,
    title: "Job Interview",
    titleDe: "Das Vorstellungsgespräch",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#ECEFF1"/><rect x="80" y="120" width="240" height="100" fill="#795548" rx="4"/><rect x="80" y="110" width="240" height="15" fill="#5D4037" rx="4 4 0 0"/><rect x="100" y="140" width="60" height="40" fill="white" rx="2"/><rect x="170" y="140" width="60" height="40" fill="white" rx="2"/><rect x="240" y="140" width="60" height="40" fill="white" rx="2"/><circle cx="120" cy="70" r="25" fill="#FF8C00"/><circle cx="108" cy="63" r="4" fill="white"/><circle cx="108" cy="63" r="2" fill="#333"/><circle cx="128" cy="63" r="4" fill="white"/><circle cx="128" cy="63" r="2" fill="#333"/><path d="M114 76 Q120 80 126 76" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="100,48 94,34 107,44" fill="#FF8C00"/><polygon points="140,48 146,34 133,44" fill="#FF8C00"/><rect x="102" y="93" width="36" height="25" fill="#333" rx="6"/><line x1="120" y1="105" x2="120" y2="118" stroke="#333" stroke-width="6"/><circle cx="280" cy="70" r="24" fill="#8B6914"/><circle cx="269" cy="63" r="4" fill="white"/><circle cx="269" cy="63" r="2" fill="#333"/><circle cx="289" cy="63" r="4" fill="white"/><circle cx="289" cy="63" r="2" fill="#333"/><ellipse cx="279" cy="73" rx="7" ry="4" fill="#5C4033"/><ellipse cx="262" cy="50" rx="10" ry="15" fill="#8B6914"/><ellipse cx="296" cy="50" rx="10" ry="15" fill="#8B6914"/><rect x="262" y="92" width="36" height="25" fill="#37474F" rx="6"/><line x1="280" y1="105" x2="280" y2="118" stroke="#37474F" stroke-width="6"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Was sind Ihre Stärken?", en: "What are your strengths?" },
      { speaker: "cat", de: "Ich kann achtzehn Stunden am Tag schlafen.", en: "I can sleep eighteen hours a day." },
      { speaker: "dog", de: "Das ist keine Stärke.", en: "That's not a strength." },
      { speaker: "cat", de: "Doch. Ich bin sehr effizient.", en: "Yes it is. I am very efficient." }
    ]
  },
  {
    id: 18,
    title: "Birthday Party",
    titleDe: "Die Geburtstagsfeier",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#F3E5F5"/><text x="200" y="40" text-anchor="middle" fill="#E91E63" font-size="22" font-weight="bold">Alles Gute!</text><circle cx="120" cy="50" r="8" fill="#FF5722"/><circle cx="280" cy="45" r="8" fill="#2196F3"/><circle cx="200" cy="35" r="6" fill="#4CAF50"/><circle cx="60" cy="60" r="5" fill="#FFC107"/><circle cx="340" cy="55" r="5" fill="#9C27B0"/><rect x="130" y="160" width="140" height="80" fill="#FFCC80" rx="8" stroke="#FF9800" stroke-width="2"/><rect x="130" y="160" width="140" height="20" fill="#FF9800" rx="8 8 0 0"/><rect x="195" y="130" width="10" height="35" fill="#FFE082"/><circle cx="200" cy="125" r="6" fill="#FF5722"/><path d="M197 119 Q200 110 203 119" fill="#FFC107"/><circle cx="100" cy="250" r="24" fill="#FF8C00"/><circle cx="88" cy="243" r="4" fill="white"/><circle cx="88" cy="243" r="2" fill="#333"/><circle cx="108" cy="243" r="4" fill="white"/><circle cx="108" cy="243" r="2" fill="#333"/><path d="M94 256 Q100 263 106 256" fill="none" stroke="#333" stroke-width="2"/><polygon points="82,228 76,212 89,224" fill="#FF8C00"/><polygon points="118,228 124,212 111,224" fill="#FF8C00"/><rect x="82" y="272" width="36" height="22" fill="#FF8C00" rx="6"/><rect x="70" y="258" width="20" height="8" fill="#E91E63" rx="2"/><circle cx="300" cy="250" r="24" fill="#8B6914"/><circle cx="288" cy="243" r="4" fill="white"/><circle cx="288" cy="243" r="2" fill="#333"/><circle cx="308" cy="243" r="4" fill="white"/><circle cx="308" cy="243" r="2" fill="#333"/><ellipse cx="298" cy="253" rx="7" ry="4" fill="#5C4033"/><path d="M292 258 Q298 265 305 258" fill="none" stroke="#333" stroke-width="2"/><ellipse cx="281" cy="230" rx="10" ry="15" fill="#8B6914"/><ellipse cx="316" cy="230" rx="10" ry="15" fill="#8B6914"/><rect x="280" y="272" width="36" height="22" fill="#8B6914" rx="6"/><rect x="325" y="240" width="25" height="20" fill="#E8EAF6" rx="2" stroke="#9C27B0" stroke-width="1"/></svg>',
    bubbles: [
      { speaker: "dog", de: "Alles Gute zum Geburtstag!", en: "Happy birthday!" },
      { speaker: "cat", de: "Danke! Wo ist mein Geschenk?", en: "Thanks! Where is my present?" },
      { speaker: "dog", de: "Hier! Es ist ein Ball.", en: "Here! It's a ball." },
      { speaker: "cat", de: "Ein Ball ist ein Geschenk für Hunde, nicht für Katzen.", en: "A ball is a present for dogs, not for cats." },
      { speaker: "dog", de: "Oh... Möchtest du einen Fisch?", en: "Oh... Would you like a fish?" }
    ]
  },
  {
    id: 19,
    title: "At the Bank",
    titleDe: "Bei der Bank",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#E8EAF6"/><rect x="80" y="40" width="240" height="30" fill="#1565C0" rx="4 4 0 0"/><text x="200" y="62" text-anchor="middle" fill="white" font-size="16" font-weight="bold">BANK</text><rect x="80" y="70" width="240" height="140" fill="#fff" rx="0 0 4 4" stroke="#ccc" stroke-width="2"/><rect x="100" y="90" width="200" height="60" fill="#E3F2FD" rx="4"/><text x="200" y="125" text-anchor="middle" fill="#1565C0" font-size="24" font-weight="bold">€€€</text><line x1="100" y1="170" x2="300" y2="170" stroke="#ddd" stroke-width="1"/><circle cx="100" cy="260" r="22" fill="#FF8C00"/><circle cx="89" cy="253" r="3.5" fill="white"/><circle cx="89" cy="253" r="1.8" fill="#333"/><circle cx="108" cy="253" r="3.5" fill="white"/><circle cx="108" cy="253" r="1.8" fill="#333"/><path d="M94 265 Q100 272 106 265" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="82,238 76,224 89,234" fill="#FF8C00"/><polygon points="118,238 124,224 111,234" fill="#FF8C00"/><rect x="82" y="280" width="36" height="18" fill="#FF8C00" rx="6"/><circle cx="300" cy="260" r="22" fill="#8B6914"/><circle cx="289" cy="253" r="3.5" fill="white"/><circle cx="289" cy="253" r="1.8" fill="#333"/><circle cx="309" cy="253" r="3.5" fill="white"/><circle cx="309" cy="253" r="1.8" fill="#333"/><ellipse cx="299" cy="263" rx="6" ry="3.5" fill="#5C4033"/><ellipse cx="282" cy="242" rx="9" ry="13" fill="#8B6914"/><ellipse cx="316" cy="242" rx="9" ry="13" fill="#8B6914"/><rect x="282" y="280" width="34" height="18" fill="#8B6914" rx="6"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Ich möchte ein Konto eröffnen.", en: "I would like to open an account." },
      { speaker: "dog", de: "Haben Sie einen Ausweis?", en: "Do you have an ID?" },
      { speaker: "cat", de: "Ich habe einen Impfpass.", en: "I have a vaccination card." },
      { speaker: "dog", de: "Das ist kein Ausweis!", en: "That's not an ID!" }
    ]
  },
  {
    id: 20,
    title: "Saying Goodbye",
    titleDe: "Abschied nehmen",
    svg: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#FF7043" opacity="0.15"/><rect width="400" height="300" fill="url(#sunset)"/><defs><linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF7043" stop-opacity="0.3"/><stop offset="50%" stop-color="#FF8A65" stop-opacity="0.2"/><stop offset="100%" stop-color="#FFE0B2"/></linearGradient></defs><circle cx="200" cy="80" r="45" fill="#FF7043" opacity="0.6"/><rect x="0" y="200" width="400" height="100" fill="#5D4037"/><path d="M0 200 Q100 180 200 200 Q300 220 400 200 L400 300 L0 300 Z" fill="#4E342E"/><circle cx="140" cy="170" r="28" fill="#FF8C00"/><circle cx="127" cy="162" r="4.5" fill="white"/><circle cx="127" cy="162" r="2" fill="#333"/><circle cx="148" cy="162" r="4.5" fill="white"/><circle cx="148" cy="162" r="2" fill="#333"/><path d="M133 176 Q140 182 147 176" fill="none" stroke="#333" stroke-width="1.5"/><polygon points="120,147 114,131 127,143" fill="#FF8C00"/><polygon points="160,147 166,131 153,143" fill="#FF8C00"/><rect x="120" y="196" width="40" height="40" fill="#FF8C00" rx="10"/><line x1="160" y1="200" x2="175" y2="185" stroke="#FF8C00" stroke-width="5" stroke-linecap="round"/><circle cx="270" cy="170" r="26" fill="#8B6914"/><circle cx="258" cy="162" r="4" fill="white"/><circle cx="258" cy="162" r="2" fill="#333"/><circle cx="278" cy="162" r="4" fill="white"/><circle cx="278" cy="162" r="2" fill="#333"/><ellipse cx="268" cy="172" rx="7" ry="4" fill="#5C4033"/><path d="M262 177 Q268 183 275 177" fill="none" stroke="#333" stroke-width="1.5"/><ellipse cx="252" cy="148" rx="10" ry="15" fill="#8B6914"/><ellipse cx="288" cy="148" rx="10" ry="15" fill="#8B6914"/><rect x="252" y="194" width="36" height="38" fill="#8B6914" rx="10"/><line x1="252" y1="198" x2="237" y2="183" stroke="#8B6914" stroke-width="5" stroke-linecap="round"/></svg>',
    bubbles: [
      { speaker: "cat", de: "Ich muss jetzt gehen.", en: "I have to go now." },
      { speaker: "dog", de: "Schon? Es ist noch früh!", en: "Already? It's still early!" },
      { speaker: "cat", de: "Ich muss schlafen. Ich schlafe sechzehn Stunden.", en: "I have to sleep. I sleep sixteen hours." },
      { speaker: "dog", de: "Tschüss! Bis morgen!", en: "Bye! See you tomorrow!" },
      { speaker: "cat", de: "Tschüss! Vergiss den Fisch nicht!", en: "Bye! Don't forget the fish!" }
    ]
  }
];
