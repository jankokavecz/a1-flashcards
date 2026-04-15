// Comics — 20 illustrated scenes with Katze (cat) and Hund (dog)
// Characters are drawn by shared helper functions for consistency

var COMIC_SHARED_DEFS =
  '<filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.18"/></filter>' +
  '<filter id="shSm"><feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.15"/></filter>' +
  '<linearGradient id="catFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFB347"/><stop offset="100%" stop-color="#E07B00"/></linearGradient>' +
  '<linearGradient id="dogFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D4AA30"/><stop offset="100%" stop-color="#957018"/></linearGradient>' +
  '<linearGradient id="dogBelly" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#EED070"/><stop offset="100%" stop-color="#D4B040"/></linearGradient>';

function drawCat(cx, cy, opts) {
  opts = opts || {};
  var s = '';
  // Ground shadow
  s += '<ellipse cx="' + cx + '" cy="' + (cy + 62) + '" rx="22" ry="5" fill="rgba(0,0,0,0.10)"/>';
  // Tail
  s += '<path d="M ' + (cx - 14) + ',' + (cy + 48) + ' C ' + (cx - 32) + ',' + (cy + 48) + ' ' + (cx - 42) + ',' + (cy + 20) + ' ' + (cx - 32) + ',' + (cy + 10) + '" fill="none" stroke="url(#catFur)" stroke-width="6" stroke-linecap="round"/>';
  s += '<path d="M ' + (cx - 35) + ',' + (cy + 12) + ' L ' + (cx - 30) + ',' + (cy + 8) + '" fill="none" stroke="#FF8C00" stroke-width="5" stroke-linecap="round"/>';
  // Body
  s += '<ellipse cx="' + cx + '" cy="' + (cy + 35) + '" rx="18" ry="24" fill="url(#catFur)" filter="url(#sh)"/>';
  // Body stripes
  s += '<path d="M ' + (cx - 7) + ',' + (cy + 20) + ' Q ' + cx + ',' + (cy + 17) + ' ' + (cx + 7) + ',' + (cy + 20) + '" fill="none" stroke="#D06800" stroke-width="1.5" opacity="0.5"/>';
  s += '<path d="M ' + (cx - 9) + ',' + (cy + 28) + ' Q ' + cx + ',' + (cy + 25) + ' ' + (cx + 9) + ',' + (cy + 28) + '" fill="none" stroke="#D06800" stroke-width="1.5" opacity="0.5"/>';
  s += '<path d="M ' + (cx - 8) + ',' + (cy + 36) + ' Q ' + cx + ',' + (cy + 33) + ' ' + (cx + 8) + ',' + (cy + 36) + '" fill="none" stroke="#D06800" stroke-width="1.5" opacity="0.5"/>';
  // Paws
  s += '<ellipse cx="' + (cx - 8) + '" cy="' + (cy + 57) + '" rx="6" ry="4" fill="#FF9F40"/>';
  s += '<ellipse cx="' + (cx + 8) + '" cy="' + (cy + 57) + '" rx="6" ry="4" fill="#FF9F40"/>';
  // Paw detail
  s += '<circle cx="' + (cx - 10) + '" cy="' + (cy + 56) + '" r="1.2" fill="#E08030"/>';
  s += '<circle cx="' + (cx - 7) + '" cy="' + (cy + 55) + '" r="1.2" fill="#E08030"/>';
  s += '<circle cx="' + (cx + 6) + '" cy="' + (cy + 55) + '" r="1.2" fill="#E08030"/>';
  s += '<circle cx="' + (cx + 9) + '" cy="' + (cy + 56) + '" r="1.2" fill="#E08030"/>';
  // Head
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="url(#catFur)" filter="url(#sh)"/>';
  // Head stripe
  s += '<path d="M ' + cx + ',' + (cy - 22) + ' L ' + cx + ',' + (cy - 8) + '" stroke="#D06800" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>';
  // Ears outer
  s += '<polygon points="' + (cx - 16) + ',' + (cy - 14) + ' ' + (cx - 8) + ',' + (cy - 38) + ' ' + (cx - 1) + ',' + (cy - 14) + '" fill="#FF9020"/>';
  s += '<polygon points="' + (cx + 1) + ',' + (cy - 14) + ' ' + (cx + 8) + ',' + (cy - 38) + ' ' + (cx + 16) + ',' + (cy - 14) + '" fill="#FF9020"/>';
  // Ears inner
  s += '<polygon points="' + (cx - 13) + ',' + (cy - 16) + ' ' + (cx - 8) + ',' + (cy - 33) + ' ' + (cx - 4) + ',' + (cy - 16) + '" fill="#FFB6C1"/>';
  s += '<polygon points="' + (cx + 4) + ',' + (cy - 16) + ' ' + (cx + 8) + ',' + (cy - 33) + ' ' + (cx + 13) + ',' + (cy - 16) + '" fill="#FFB6C1"/>';
  // Eyes white
  s += '<ellipse cx="' + (cx - 8) + '" cy="' + (cy - 2) + '" rx="6.5" ry="7.5" fill="white" filter="url(#shSm)"/>';
  s += '<ellipse cx="' + (cx + 8) + '" cy="' + (cy - 2) + '" rx="6.5" ry="7.5" fill="white" filter="url(#shSm)"/>';
  // Iris
  s += '<circle cx="' + (cx - 7) + '" cy="' + (cy - 1) + '" r="4.5" fill="#43A047"/>';
  s += '<circle cx="' + (cx + 9) + '" cy="' + (cy - 1) + '" r="4.5" fill="#43A047"/>';
  // Iris detail
  s += '<circle cx="' + (cx - 7) + '" cy="' + (cy - 1) + '" r="3.5" fill="#2E7D32"/>';
  s += '<circle cx="' + (cx + 9) + '" cy="' + (cy - 1) + '" r="3.5" fill="#2E7D32"/>';
  // Pupil
  s += '<ellipse cx="' + (cx - 7) + '" cy="' + (cy - 1) + '" rx="1.8" ry="3" fill="#111"/>';
  s += '<ellipse cx="' + (cx + 9) + '" cy="' + (cy - 1) + '" rx="1.8" ry="3" fill="#111"/>';
  // Eye highlight
  s += '<circle cx="' + (cx - 5) + '" cy="' + (cy - 3.5) + '" r="1.8" fill="white" opacity="0.95"/>';
  s += '<circle cx="' + (cx + 11) + '" cy="' + (cy - 3.5) + '" r="1.8" fill="white" opacity="0.95"/>';
  s += '<circle cx="' + (cx - 8.5) + '" cy="' + (cy + 1) + '" r="1" fill="white" opacity="0.6"/>';
  s += '<circle cx="' + (cx + 7.5) + '" cy="' + (cy + 1) + '" r="1" fill="white" opacity="0.6"/>';
  // Nose
  s += '<path d="M ' + (cx - 2.5) + ',' + (cy + 6) + ' L ' + cx + ',' + (cy + 4) + ' L ' + (cx + 2.5) + ',' + (cy + 6) + ' Z" fill="#FF69B4"/>';
  s += '<ellipse cx="' + (cx - 0.5) + '" cy="' + (cy + 4.8) + '" rx="0.8" ry="0.5" fill="rgba(255,255,255,0.4)"/>';
  // Mouth
  s += '<path d="M ' + cx + ',' + (cy + 6) + ' L ' + cx + ',' + (cy + 8) + '" fill="none" stroke="#8D6E63" stroke-width="1"/>';
  s += '<path d="M ' + (cx - 4) + ',' + (cy + 9) + ' Q ' + cx + ',' + (cy + 12) + ' ' + (cx + 4) + ',' + (cy + 9) + '" fill="none" stroke="#8D6E63" stroke-width="1.2"/>';
  // Whiskers
  s += '<g stroke="#C8B898" stroke-width="0.7" opacity="0.7">';
  s += '<line x1="' + (cx - 22) + '" y1="' + (cy + 3) + '" x2="' + (cx - 10) + '" y2="' + (cy + 5) + '"/>';
  s += '<line x1="' + (cx - 23) + '" y1="' + (cy + 7) + '" x2="' + (cx - 10) + '" y2="' + (cy + 7) + '"/>';
  s += '<line x1="' + (cx - 21) + '" y1="' + (cy - 1) + '" x2="' + (cx - 10) + '" y2="' + (cy + 3) + '"/>';
  s += '<line x1="' + (cx + 10) + '" y1="' + (cy + 5) + '" x2="' + (cx + 22) + '" y2="' + (cy + 3) + '"/>';
  s += '<line x1="' + (cx + 10) + '" y1="' + (cy + 7) + '" x2="' + (cx + 23) + '" y2="' + (cy + 7) + '"/>';
  s += '<line x1="' + (cx + 10) + '" y1="' + (cy + 3) + '" x2="' + (cx + 21) + '" y2="' + (cy - 1) + '"/>';
  s += '</g>';
  // Cheeks
  s += '<circle cx="' + (cx - 13) + '" cy="' + (cy + 5) + '" r="4" fill="#FF8A65" opacity="0.25"/>';
  s += '<circle cx="' + (cx + 13) + '" cy="' + (cy + 5) + '" r="4" fill="#FF8A65" opacity="0.25"/>';
  return s;
}

function drawDog(cx, cy, opts) {
  opts = opts || {};
  var s = '';
  // Ground shadow
  s += '<ellipse cx="' + cx + '" cy="' + (cy + 62) + '" rx="24" ry="5" fill="rgba(0,0,0,0.10)"/>';
  // Tail
  s += '<path d="M ' + (cx + 14) + ',' + (cy + 22) + ' C ' + (cx + 26) + ',' + (cy + 14) + ' ' + (cx + 34) + ',' + (cy + 8) + ' ' + (cx + 30) + ',' + (cy) + '" fill="none" stroke="url(#dogFur)" stroke-width="6" stroke-linecap="round"/>';
  // Body
  s += '<ellipse cx="' + cx + '" cy="' + (cy + 34) + '" rx="20" ry="25" fill="url(#dogFur)" filter="url(#sh)"/>';
  // Belly
  s += '<ellipse cx="' + cx + '" cy="' + (cy + 40) + '" rx="12" ry="15" fill="url(#dogBelly)"/>';
  // Paws
  s += '<ellipse cx="' + (cx - 9) + '" cy="' + (cy + 57) + '" rx="7" ry="5" fill="#C8A020"/>';
  s += '<ellipse cx="' + (cx + 9) + '" cy="' + (cy + 57) + '" rx="7" ry="5" fill="#C8A020"/>';
  // Paw pads
  s += '<ellipse cx="' + (cx - 9) + '" cy="' + (cy + 58) + '" rx="3.5" ry="2" fill="#B08818"/>';
  s += '<ellipse cx="' + (cx + 9) + '" cy="' + (cy + 58) + '" rx="3.5" ry="2" fill="#B08818"/>';
  // Head
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="24" fill="url(#dogFur)" filter="url(#sh)"/>';
  // Floppy ears
  s += '<ellipse cx="' + (cx - 21) + '" cy="' + (cy + 8) + '" rx="9" ry="18" fill="#A07818" transform="rotate(-10,' + (cx - 21) + ',' + (cy + 8) + ')" filter="url(#shSm)"/>';
  s += '<ellipse cx="' + (cx + 21) + '" cy="' + (cy + 8) + '" rx="9" ry="18" fill="#A07818" transform="rotate(10,' + (cx + 21) + ',' + (cy + 8) + ')" filter="url(#shSm)"/>';
  // Ear inner
  s += '<ellipse cx="' + (cx - 21) + '" cy="' + (cy + 10) + '" rx="5" ry="12" fill="#C09828" transform="rotate(-10,' + (cx - 21) + ',' + (cy + 10) + ')"/>';
  s += '<ellipse cx="' + (cx + 21) + '" cy="' + (cy + 10) + '" rx="5" ry="12" fill="#C09828" transform="rotate(10,' + (cx + 21) + ',' + (cy + 10) + ')"/>';
  // Muzzle
  s += '<ellipse cx="' + cx + '" cy="' + (cy + 8) + '" rx="13" ry="10" fill="url(#dogBelly)"/>';
  // Eyes white
  s += '<ellipse cx="' + (cx - 8) + '" cy="' + (cy - 4) + '" rx="6.5" ry="7.5" fill="white" filter="url(#shSm)"/>';
  s += '<ellipse cx="' + (cx + 8) + '" cy="' + (cy - 4) + '" rx="6.5" ry="7.5" fill="white" filter="url(#shSm)"/>';
  // Iris
  s += '<circle cx="' + (cx - 7) + '" cy="' + (cy - 3) + '" r="4.5" fill="#795548"/>';
  s += '<circle cx="' + (cx + 9) + '" cy="' + (cy - 3) + '" r="4.5" fill="#795548"/>';
  // Iris inner
  s += '<circle cx="' + (cx - 7) + '" cy="' + (cy - 3) + '" r="3.5" fill="#5D4037"/>';
  s += '<circle cx="' + (cx + 9) + '" cy="' + (cy - 3) + '" r="3.5" fill="#5D4037"/>';
  // Pupil
  s += '<circle cx="' + (cx - 7) + '" cy="' + (cy - 3) + '" r="2.2" fill="#111"/>';
  s += '<circle cx="' + (cx + 9) + '" cy="' + (cy - 3) + '" r="2.2" fill="#111"/>';
  // Eye highlight
  s += '<circle cx="' + (cx - 5) + '" cy="' + (cy - 5.5) + '" r="1.8" fill="white" opacity="0.95"/>';
  s += '<circle cx="' + (cx + 11) + '" cy="' + (cy - 5.5) + '" r="1.8" fill="white" opacity="0.95"/>';
  s += '<circle cx="' + (cx - 8.5) + '" cy="' + (cy - 1) + '" r="1" fill="white" opacity="0.5"/>';
  s += '<circle cx="' + (cx + 7.5) + '" cy="' + (cy - 1) + '" r="1" fill="white" opacity="0.5"/>';
  // Eyebrows
  s += '<path d="M ' + (cx - 13) + ',' + (cy - 11) + ' Q ' + (cx - 8) + ',' + (cy - 14) + ' ' + (cx - 3) + ',' + (cy - 11) + '" fill="none" stroke="#8D6E63" stroke-width="1.5" stroke-linecap="round"/>';
  s += '<path d="M ' + (cx + 3) + ',' + (cy - 11) + ' Q ' + (cx + 8) + ',' + (cy - 14) + ' ' + (cx + 13) + ',' + (cy - 11) + '" fill="none" stroke="#8D6E63" stroke-width="1.5" stroke-linecap="round"/>';
  // Nose
  s += '<ellipse cx="' + cx + '" cy="' + (cy + 4) + '" rx="5" ry="3.5" fill="#3E2723" filter="url(#shSm)"/>';
  s += '<ellipse cx="' + (cx - 1) + '" cy="' + (cy + 3) + '" rx="1.5" ry="1" fill="rgba(255,255,255,0.35)"/>';
  // Mouth
  s += '<path d="M ' + cx + ',' + (cy + 7.5) + ' L ' + cx + ',' + (cy + 10) + '" fill="none" stroke="#5D4037" stroke-width="1.2"/>';
  s += '<path d="M ' + (cx - 6) + ',' + (cy + 10) + ' Q ' + cx + ',' + (cy + 14) + ' ' + (cx + 6) + ',' + (cy + 10) + '" fill="none" stroke="#5D4037" stroke-width="1.2"/>';
  // Tongue
  s += '<ellipse cx="' + (cx + 2) + '" cy="' + (cy + 13) + '" rx="3" ry="3.5" fill="#E57373"/>';
  s += '<line x1="' + (cx + 2) + '" y1="' + (cy + 10.5) + '" x2="' + (cx + 2) + '" y2="' + (cy + 15) + '" stroke="#EF9A9A" stroke-width="0.5"/>';
  // Collar
  s += '<path d="M ' + (cx - 16) + ',' + (cy + 18) + ' Q ' + cx + ',' + (cy + 23) + ' ' + (cx + 16) + ',' + (cy + 18) + '" fill="none" stroke="#D32F2F" stroke-width="4" stroke-linecap="round"/>';
  // Collar tag
  s += '<circle cx="' + cx + '" cy="' + (cy + 22) + '" r="3.5" fill="#FFD700" stroke="#DAA520" stroke-width="0.8" filter="url(#shSm)"/>';
  s += '<circle cx="' + cx + '" cy="' + (cy + 21.5) + '" r="1" fill="rgba(255,255,255,0.4)"/>';
  // Cheeks
  s += '<circle cx="' + (cx - 14) + '" cy="' + (cy + 5) + '" r="4" fill="#FFAB91" opacity="0.2"/>';
  s += '<circle cx="' + (cx + 14) + '" cy="' + (cy + 5) + '" r="4" fill="#FFAB91" opacity="0.2"/>';
  return s;
}

function buildComicSvg(comic) {
  return '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' + COMIC_SHARED_DEFS + (comic.defs || '') + '</defs>' +
    (comic.bg || '') +
    drawCat(comic.catPos[0], comic.catPos[1]) +
    drawDog(comic.dogPos[0], comic.dogPos[1]) +
    (comic.fg || '') +
    '</svg>';
}

var COMICS = [
  {
    id: 1,
    title: "At the Bakery",
    titleDe: "In der B\u00e4ckerei",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF3E0"/><stop offset="100%" stop-color="#FFE0B2"/></linearGradient>' +
      '<linearGradient id="counter" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#A0522D"/><stop offset="100%" stop-color="#6D3A1F"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="210" width="400" height="90" fill="url(#counter)" rx="4"/>' +
      '<rect x="0" y="205" width="400" height="12" fill="#C07040" rx="2"/>' +
      // Shelf
      '<rect x="30" y="50" width="340" height="8" fill="#8B6040"/>' +
      '<rect x="30" y="120" width="340" height="8" fill="#8B6040"/>' +
      // Bread items on shelves
      '<ellipse cx="70" cy="44" rx="18" ry="10" fill="#DEB887"/><ellipse cx="70" cy="42" rx="14" ry="7" fill="#E8C888"/>' +
      '<ellipse cx="120" cy="44" rx="15" ry="12" fill="#D2B48C"/><path d="M108,40 Q120,30 132,40" fill="#C8A070"/>' +
      '<rect x="155" y="34" width="30" height="18" fill="#DEB887" rx="4"/><line x1="162" y1="34" x2="162" y2="52" stroke="#C8A060" stroke-width="0.5"/><line x1="170" y1="34" x2="170" y2="52" stroke="#C8A060" stroke-width="0.5"/><line x1="178" y1="34" x2="178" y2="52" stroke="#C8A060" stroke-width="0.5"/>' +
      '<circle cx="220" cy="42" r="12" fill="#F4A460"/><circle cx="220" cy="38" r="3" fill="#D4944E" opacity="0.6"/>' +
      '<ellipse cx="275" cy="44" rx="20" ry="10" fill="#DEB887"/><path d="M258,42 L262,36 L268,42 L272,36 L278,42 L282,36 L288,42" fill="none" stroke="#C8A060" stroke-width="1"/>' +
      '<ellipse cx="340" cy="44" rx="16" ry="11" fill="#E8C070"/>' +
      // Lower shelf items
      '<ellipse cx="60" cy="114" rx="14" ry="10" fill="#F4A460"/><ellipse cx="100" cy="114" rx="14" ry="10" fill="#F4A460"/><ellipse cx="140" cy="114" rx="14" ry="10" fill="#F4A460"/>' +
      '<rect x="170" y="104" width="50" height="18" fill="#DEB887" rx="3"/>' +
      '<circle cx="260" cy="112" r="11" fill="#E8C070"/><circle cx="290" cy="112" r="11" fill="#E8C070"/><circle cx="320" cy="112" r="11" fill="#E8C070"/>' +
      // Warm glow
      '<circle cx="200" cy="20" r="60" fill="#FFAB40" opacity="0.08"/>' +
      // Sign
      '<rect x="150" y="4" width="100" height="22" fill="#8B4513" rx="4"/>' +
      '<text x="200" y="19" text-anchor="middle" fill="#FFE0B2" font-size="11" font-weight="bold" font-family="serif">B\u00c4CKEREI</text>',
    catPos: [110, 155],
    dogPos: [290, 155],
    bubbles: [
      { speaker: "cat", de: "Zehn Br\u00f6tchen, bitte!", en: "Ten rolls, please!" },
      { speaker: "dog", de: "Zehn?! Du bist eine Katze!", en: "Ten?! You are a cat!" },
      { speaker: "cat", de: "Ich habe Hunger.", en: "I am hungry." }
    ]
  },
  {
    id: 2,
    title: "At the Doctor",
    titleDe: "Beim Arzt",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E3F2FD"/><stop offset="100%" stop-color="#BBDEFB"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="240" width="400" height="60" fill="#E0E0E0"/>' +
      // Exam table
      '<rect x="60" y="170" width="280" height="65" fill="white" rx="8" filter="url(#sh)"/>' +
      '<rect x="60" y="170" width="280" height="12" fill="#90CAF9" rx="8 8 0 0"/>' +
      // Medical cross on wall
      '<rect x="175" y="30" width="50" height="50" fill="white" rx="8" filter="url(#shSm)"/>' +
      '<rect x="193" y="38" width="14" height="34" fill="#EF5350" rx="2"/>' +
      '<rect x="183" y="48" width="34" height="14" fill="#EF5350" rx="2"/>' +
      // Cabinet
      '<rect x="320" y="40" width="60" height="120" fill="white" rx="4" filter="url(#shSm)"/>' +
      '<line x1="320" y1="80" x2="380" y2="80" stroke="#E0E0E0" stroke-width="1"/>' +
      '<line x1="320" y1="120" x2="380" y2="120" stroke="#E0E0E0" stroke-width="1"/>' +
      '<circle cx="370" cy="60" r="3" fill="#BDBDBD"/><circle cx="370" cy="100" r="3" fill="#BDBDBD"/><circle cx="370" cy="140" r="3" fill="#BDBDBD"/>' +
      // Clock
      '<circle cx="60" cy="50" r="18" fill="white" stroke="#BDBDBD" stroke-width="2"/>' +
      '<line x1="60" y1="50" x2="60" y2="38" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="60" y1="50" x2="70" y2="54" stroke="#333" stroke-width="1" stroke-linecap="round"/>' +
      '<circle cx="60" cy="50" r="2" fill="#333"/>' +
      // Light
      '<rect x="180" y="0" width="40" height="15" fill="#E0E0E0" rx="0 0 4 4"/>' +
      '<rect x="185" y="12" width="30" height="5" fill="#FFF9C4" rx="2"/>',
    catPos: [140, 130],
    dogPos: [280, 130],
    fg: '<rect x="265" y="120" width="30" height="40" fill="white" rx="4" filter="url(#shSm)"/>' +
      '<rect x="273" y="128" width="14" height="5" fill="#EF5350" rx="1"/>' +
      '<rect x="277" y="124" width="6" height="13" fill="#EF5350" rx="1"/>',
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
    defs: '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#64B5F6"/><stop offset="70%" stop-color="#90CAF9"/><stop offset="100%" stop-color="#BBDEFB"/></linearGradient>' +
      '<linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#78909C"/><stop offset="100%" stop-color="#607D8B"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#sky)"/>' +
      '<rect x="0" y="210" width="400" height="90" fill="url(#road)"/>' +
      '<rect x="190" y="210" width="20" height="90" fill="#FFF176" opacity="0.3"/>' +
      // Buildings
      '<rect x="10" y="80" width="70" height="130" fill="#FFCC80" rx="2" filter="url(#sh)"/>' +
      '<rect x="20" y="95" width="20" height="25" fill="#81D4FA" rx="2"/><rect x="50" y="95" width="20" height="25" fill="#81D4FA" rx="2"/>' +
      '<rect x="20" y="135" width="20" height="25" fill="#81D4FA" rx="2"/><rect x="50" y="135" width="20" height="25" fill="#81D4FA" rx="2"/>' +
      '<rect x="35" y="170" width="20" height="40" fill="#8D6E63" rx="2"/>' +
      '<rect x="90" y="100" width="60" height="110" fill="#EF9A9A" rx="2" filter="url(#sh)"/>' +
      '<rect x="100" y="115" width="16" height="20" fill="#81D4FA" rx="2"/><rect x="124" y="115" width="16" height="20" fill="#81D4FA" rx="2"/>' +
      '<rect x="108" y="170" width="22" height="40" fill="#8D6E63" rx="2"/>' +
      // Sign post
      '<rect x="310" y="100" width="6" height="110" fill="#757575" rx="1"/>' +
      '<rect x="288" y="95" width="55" height="22" fill="#2E7D32" rx="3" filter="url(#shSm)"/>' +
      '<text x="315" y="109" text-anchor="middle" fill="white" font-size="9" font-weight="bold">PARK \u2192</text>' +
      // Tree
      '<rect x="255" y="140" width="8" height="70" fill="#795548"/>' +
      '<circle cx="259" cy="120" r="25" fill="#4CAF50" filter="url(#shSm)"/>' +
      '<circle cx="245" cy="130" r="18" fill="#388E3C"/>' +
      '<circle cx="272" cy="128" r="16" fill="#43A047"/>' +
      // Sun
      '<circle cx="360" cy="40" r="22" fill="#FFF176" opacity="0.7"/>' +
      '<circle cx="360" cy="40" r="16" fill="#FFEE58"/>',
    catPos: [170, 158],
    dogPos: [350, 158],
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
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FAFAFA"/><stop offset="100%" stop-color="#F5F5F5"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="245" width="400" height="55" fill="#ECEFF1"/>' +
      // Shelves
      '<rect x="20" y="40" width="360" height="90" fill="white" rx="4" filter="url(#sh)"/>' +
      '<rect x="20" y="80" width="360" height="3" fill="#E0E0E0"/>' +
      // Products top shelf
      '<rect x="30" y="46" width="22" height="30" fill="#F44336" rx="2"/><rect x="30" y="46" width="22" height="8" fill="#E53935" rx="2 2 0 0"/>' +
      '<rect x="58" y="46" width="22" height="30" fill="#F44336" rx="2"/>' +
      '<rect x="90" y="50" width="18" height="26" fill="#FFC107" rx="2"/><rect x="90" y="50" width="18" height="6" fill="#FFB300" rx="2 2 0 0"/>' +
      '<rect x="115" y="50" width="18" height="26" fill="#FFC107" rx="2"/>' +
      '<circle cx="155" cy="62" r="12" fill="#FF9800"/><circle cx="175" cy="62" r="12" fill="#FF9800"/><circle cx="195" cy="62" r="12" fill="#FF9800"/>' +
      '<rect x="220" y="46" width="25" height="30" fill="#4CAF50" rx="2"/><text x="232" y="66" text-anchor="middle" fill="white" font-size="7">TEE</text>' +
      '<rect x="250" y="46" width="25" height="30" fill="#4CAF50" rx="2"/>' +
      '<rect x="285" y="48" width="30" height="28" fill="#2196F3" rx="3"/><text x="300" y="67" text-anchor="middle" fill="white" font-size="7">Milch</text>' +
      '<rect x="320" y="48" width="30" height="28" fill="#2196F3" rx="3"/>' +
      // Products bottom shelf
      '<rect x="30" y="86" width="50" height="20" fill="#FFE082" rx="2"/><text x="55" y="100" text-anchor="middle" fill="#5D4037" font-size="7" font-weight="bold">K\u00c4SE</text>' +
      '<circle cx="110" cy="96" r="10" fill="#F44336"/><circle cx="132" cy="96" r="10" fill="#F44336"/><circle cx="154" cy="96" r="10" fill="#F44336"/>' +
      '<ellipse cx="200" cy="96" rx="20" ry="10" fill="#66BB6A"/>' +
      '<rect x="235" y="86" width="50" height="20" fill="#FF8A65" rx="2"/><text x="260" y="100" text-anchor="middle" fill="white" font-size="7" font-weight="bold">BROT</text>' +
      '<rect x="295" y="86" width="20" height="20" fill="#CE93D8" rx="2"/><rect x="320" y="86" width="20" height="20" fill="#CE93D8" rx="2"/><rect x="345" y="86" width="20" height="20" fill="#CE93D8" rx="2"/>' +
      // Cart
      '<path d="M 150,250 L 155,225 L 245,225 L 250,250" fill="none" stroke="#9E9E9E" stroke-width="2.5"/>' +
      '<rect x="157" y="225" width="86" height="20" fill="#EEEEEE" rx="2" stroke="#BDBDBD" stroke-width="1"/>' +
      '<circle cx="165" cy="255" r="6" fill="#757575"/><circle cx="165" cy="255" r="2.5" fill="#9E9E9E"/>' +
      '<circle cx="240" cy="255" r="6" fill="#757575"/><circle cx="240" cy="255" r="2.5" fill="#9E9E9E"/>' +
      // Sign
      '<rect x="130" y="0" width="140" height="26" fill="#4CAF50" rx="4"/>' +
      '<text x="200" y="18" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SUPERMARKT</text>',
    catPos: [80, 168],
    dogPos: [320, 168],
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
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1A237E"/><stop offset="60%" stop-color="#283593"/><stop offset="100%" stop-color="#3949AB"/></linearGradient>' +
      '<radialGradient id="sunGlow" cx="0.8" cy="0.3"><stop offset="0%" stop-color="#FFE082" stop-opacity="0.4"/><stop offset="100%" stop-color="#FFE082" stop-opacity="0"/></radialGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect width="400" height="300" fill="url(#sunGlow)"/>' +
      '<rect x="0" y="220" width="400" height="80" fill="#37474F"/>' +
      // Window with sunrise
      '<rect x="240" y="30" width="120" height="90" fill="#1A237E" rx="4" stroke="#546E7A" stroke-width="3"/>' +
      '<rect x="245" y="35" width="110" height="80" fill="#FF8A65" rx="2"/>' +
      '<rect x="245" y="75" width="110" height="40" rx="0 0 2 2" fill="#66BB6A"/>' +
      '<circle cx="320" cy="60" r="18" fill="#FFF176"/>' +
      '<line x1="300" y1="35" x2="300" y2="115" stroke="#546E7A" stroke-width="2"/>' +
      '<line x1="245" y1="75" x2="355" y2="75" stroke="#546E7A" stroke-width="2"/>' +
      // Table
      '<rect x="40" y="170" width="180" height="8" fill="#5D4037" rx="2" filter="url(#sh)"/>' +
      '<rect x="55" y="178" width="8" height="50" fill="#4E342E"/>' +
      '<rect x="197" y="178" width="8" height="50" fill="#4E342E"/>' +
      // Coffee mug
      '<rect x="100" y="148" width="28" height="24" fill="#ECEFF1" rx="3" filter="url(#shSm)"/>' +
      '<path d="M 128,155 Q 138,155 138,163 Q 138,170 128,170" fill="none" stroke="#ECEFF1" stroke-width="3"/>' +
      '<rect x="103" y="151" width="22" height="5" fill="#795548" rx="1"/>' +
      // Steam
      '<path d="M 108,143 Q 110,135 112,143" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>' +
      '<path d="M 116,140 Q 118,130 120,140" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>' +
      // Alarm clock
      '<circle cx="62" cy="155" r="14" fill="#E53935" filter="url(#shSm)"/>' +
      '<circle cx="62" cy="155" r="11" fill="white"/>' +
      '<line x1="62" y1="155" x2="62" y2="148" stroke="#333" stroke-width="1.2" stroke-linecap="round"/>' +
      '<line x1="62" y1="155" x2="68" y2="158" stroke="#333" stroke-width="1" stroke-linecap="round"/>' +
      '<circle cx="62" cy="155" r="1.2" fill="#333"/>' +
      '<circle cx="52" cy="142" r="4" fill="#C62828"/><circle cx="72" cy="142" r="4" fill="#C62828"/>' +
      '<rect x="58" y="138" width="8" height="3" fill="#C62828" rx="1"/>',
    catPos: [160, 155],
    dogPos: [310, 155],
    bubbles: [
      { speaker: "dog", de: "Guten Morgen! Es ist sechs Uhr.", en: "Good morning! It's six o'clock." },
      { speaker: "cat", de: "Sechs Uhr?! Das ist mitten in der Nacht!", en: "Six o'clock?! That's the middle of the night!" },
      { speaker: "dog", de: "M\u00f6chtest du Kaffee?", en: "Would you like coffee?" },
      { speaker: "cat", de: "Ich m\u00f6chte schlafen.", en: "I want to sleep." }
    ]
  },
  {
    id: 6,
    title: "At the Train Station",
    titleDe: "Am Bahnhof",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#CFD8DC"/><stop offset="100%" stop-color="#B0BEC5"/></linearGradient>' +
      '<linearGradient id="train" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#0D47A1"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="200" width="400" height="100" fill="#78909C"/>' +
      '<rect x="0" y="195" width="400" height="8" fill="#90A4AE"/>' +
      // Train
      '<rect x="20" y="100" width="360" height="90" fill="url(#train)" rx="8" filter="url(#sh)"/>' +
      '<rect x="20" y="100" width="360" height="15" fill="#1976D2" rx="8 8 0 0"/>' +
      '<rect x="40" y="120" width="55" height="50" fill="#BBDEFB" rx="4"/><rect x="110" y="120" width="55" height="50" fill="#BBDEFB" rx="4"/><rect x="180" y="120" width="55" height="50" fill="#BBDEFB" rx="4"/><rect x="250" y="120" width="55" height="50" fill="#BBDEFB" rx="4"/><rect x="320" y="120" width="45" height="50" fill="#BBDEFB" rx="4"/>' +
      '<line x1="67" y1="120" x2="67" y2="170" stroke="#0D47A1" stroke-width="1.5"/>' +
      '<line x1="137" y1="120" x2="137" y2="170" stroke="#0D47A1" stroke-width="1.5"/>' +
      '<line x1="207" y1="120" x2="207" y2="170" stroke="#0D47A1" stroke-width="1.5"/>' +
      '<line x1="277" y1="120" x2="277" y2="170" stroke="#0D47A1" stroke-width="1.5"/>' +
      // Wheels
      '<circle cx="70" cy="195" r="10" fill="#37474F"/><circle cx="70" cy="195" r="4" fill="#546E7A"/>' +
      '<circle cx="140" cy="195" r="10" fill="#37474F"/><circle cx="140" cy="195" r="4" fill="#546E7A"/>' +
      '<circle cx="260" cy="195" r="10" fill="#37474F"/><circle cx="260" cy="195" r="4" fill="#546E7A"/>' +
      '<circle cx="330" cy="195" r="10" fill="#37474F"/><circle cx="330" cy="195" r="4" fill="#546E7A"/>' +
      // Platform sign
      '<rect x="120" y="20" width="160" height="40" fill="#263238" rx="4" filter="url(#sh)"/>' +
      '<text x="200" y="45" text-anchor="middle" fill="#FFC107" font-size="16" font-weight="bold">Gleis 3</text>' +
      // ICE text on train
      '<text x="35" y="113" fill="white" font-size="10" font-weight="bold">ICE</text>' +
      // Roof structure
      '<path d="M 0,0 L 0,50 Q 200,30 400,50 L 400,0 Z" fill="#455A64" opacity="0.3"/>',
    catPos: [80, 235],
    dogPos: [320, 235],
    bubbles: [
      { speaker: "cat", de: "Wann f\u00e4hrt der Zug nach Berlin?", en: "When does the train to Berlin leave?" },
      { speaker: "dog", de: "Um halb zehn, Gleis drei.", en: "At half past nine, platform three." },
      { speaker: "cat", de: "Ist das der richtige Zug?", en: "Is that the right train?" },
      { speaker: "dog", de: "Nein, das ist ein Zug nach Hamburg.", en: "No, that's a train to Hamburg." }
    ]
  },
  {
    id: 7,
    title: "At the Restaurant",
    titleDe: "Im Restaurant",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3E2723"/><stop offset="100%" stop-color="#2C1810"/></linearGradient>' +
      '<radialGradient id="candleGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#FFE082" stop-opacity="0.3"/><stop offset="100%" stop-color="#FFE082" stop-opacity="0"/></radialGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      // Warm ambient glow
      '<circle cx="200" cy="120" r="120" fill="url(#candleGlow)"/>' +
      // Table
      '<ellipse cx="200" cy="180" rx="140" ry="16" fill="#5D4037" filter="url(#sh)"/>' +
      '<rect x="170" y="190" width="8" height="80" fill="#4E342E"/>' +
      '<rect x="222" y="190" width="8" height="80" fill="#4E342E"/>' +
      // Tablecloth edge
      '<path d="M 60,180 Q 80,170 100,180 Q 120,190 140,180 Q 160,170 180,180 Q 200,190 220,180 Q 240,170 260,180 Q 280,190 300,180 Q 320,170 340,180" fill="none" stroke="#C62828" stroke-width="1.5" opacity="0.5"/>' +
      // Plates
      '<ellipse cx="140" cy="170" rx="28" ry="8" fill="white" filter="url(#shSm)"/><ellipse cx="140" cy="170" rx="22" ry="6" fill="#FAFAFA"/><circle cx="140" cy="170" r="3" fill="#EF5350"/>' +
      '<ellipse cx="260" cy="170" rx="28" ry="8" fill="white" filter="url(#shSm)"/><ellipse cx="260" cy="170" rx="22" ry="6" fill="#FAFAFA"/><circle cx="260" cy="170" r="3" fill="#8D6E63"/>' +
      // Candle
      '<rect x="196" y="140" width="8" height="24" fill="#FFF9C4" rx="2"/>' +
      '<ellipse cx="200" cy="138" rx="3" ry="5" fill="#FF9800"/>' +
      '<ellipse cx="200" cy="136" rx="1.5" ry="3" fill="#FFC107"/>' +
      // Utensils
      '<line x1="108" y1="165" x2="108" y2="182" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="172" y1="165" x2="172" y2="182" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round"/>' +
      // Wine glass
      '<path d="M 305,148 L 305,168" stroke="#E0E0E0" stroke-width="1.5"/>' +
      '<ellipse cx="305" cy="145" rx="8" ry="12" fill="none" stroke="#E0E0E0" stroke-width="1"/>' +
      '<ellipse cx="305" cy="145" rx="6" ry="8" fill="#C62828" opacity="0.3"/>' +
      '<line x1="298" y1="170" x2="312" y2="170" stroke="#E0E0E0" stroke-width="1.5"/>' +
      // Stars outside window
      '<rect x="320" y="10" width="70" height="60" fill="#1A237E" rx="4" stroke="#5D4037" stroke-width="3"/>' +
      '<circle cx="335" cy="30" r="1.5" fill="#FFF"/><circle cx="355" cy="22" r="1" fill="#FFF"/><circle cx="370" cy="40" r="1.5" fill="#FFF"/><circle cx="345" cy="50" r="1" fill="#FFF"/>',
    catPos: [110, 118],
    dogPos: [290, 118],
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
    defs: '<linearGradient id="board" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2E7D32"/><stop offset="100%" stop-color="#1B5E20"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="#FFF8E1"/>' +
      '<rect x="0" y="230" width="400" height="70" fill="#EFEBE9"/>' +
      // Blackboard
      '<rect x="40" y="20" width="320" height="170" fill="#5D4037" rx="4" filter="url(#sh)"/>' +
      '<rect x="48" y="28" width="304" height="154" fill="url(#board)" rx="2"/>' +
      // Chalk tray
      '<rect x="48" y="180" width="304" height="8" fill="#795548" rx="1"/>' +
      '<rect x="60" y="179" width="30" height="5" fill="white" rx="1" opacity="0.7"/>' +
      '<rect x="100" y="179" width="15" height="5" fill="#FFC107" rx="1" opacity="0.7"/>' +
      // Board content
      '<text x="200" y="80" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="36" font-weight="bold" font-family="serif">1 + 1 = ?</text>' +
      '<text x="100" y="125" fill="#FFF176" font-size="20" font-weight="bold">A) 2</text>' +
      '<text x="240" y="125" fill="#FFF176" font-size="20" font-weight="bold">B) 11</text>' +
      '<text x="100" y="165" fill="#FFF176" font-size="20" font-weight="bold">C) 3</text>' +
      '<text x="240" y="165" fill="#FFF176" font-size="20" font-weight="bold">D) Fisch</text>' +
      // Desk
      '<rect x="20" y="200" width="160" height="30" fill="#8D6E63" rx="3" filter="url(#shSm)"/>' +
      '<rect x="220" y="200" width="160" height="30" fill="#8D6E63" rx="3" filter="url(#shSm)"/>',
    catPos: [100, 168],
    dogPos: [300, 168],
    bubbles: [
      { speaker: "dog", de: "Was ist eins plus eins?", en: "What is one plus one?" },
      { speaker: "cat", de: "Elf!", en: "Eleven!" },
      { speaker: "dog", de: "Nein! Die Antwort ist zwei.", en: "No! The answer is two." },
      { speaker: "cat", de: "F\u00fcr Katzen ist es elf.", en: "For cats it's eleven." }
    ]
  },
  {
    id: 9,
    title: "The Weather",
    titleDe: "Das Wetter",
    defs: '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#546E7A"/><stop offset="50%" stop-color="#78909C"/><stop offset="100%" stop-color="#90A4AE"/></linearGradient>' +
      '<linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#43A047"/><stop offset="100%" stop-color="#2E7D32"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#sky)"/>' +
      '<rect x="0" y="200" width="400" height="100" fill="url(#grass)"/>' +
      // Clouds
      '<g opacity="0.9">' +
      '<ellipse cx="100" cy="50" rx="50" ry="22" fill="#B0BEC5"/><ellipse cx="70" cy="45" rx="30" ry="20" fill="#B0BEC5"/><ellipse cx="130" cy="42" rx="35" ry="18" fill="#CFD8DC"/>' +
      '<ellipse cx="280" cy="40" rx="40" ry="18" fill="#B0BEC5"/><ellipse cx="255" cy="35" rx="25" ry="16" fill="#CFD8DC"/><ellipse cx="305" cy="32" rx="28" ry="15" fill="#CFD8DC"/>' +
      '</g>' +
      // Rain drops
      '<g stroke="#64B5F6" stroke-width="1.5" stroke-linecap="round" opacity="0.6">' +
      '<line x1="80" y1="70" x2="75" y2="90"/><line x1="100" y1="75" x2="95" y2="95"/><line x1="120" y1="72" x2="115" y2="92"/>' +
      '<line x1="85" y1="100" x2="80" y2="120"/><line x1="105" y1="95" x2="100" y2="115"/><line x1="125" y1="100" x2="120" y2="120"/>' +
      '<line x1="260" y1="60" x2="255" y2="80"/><line x1="280" y1="65" x2="275" y2="85"/><line x1="300" y1="58" x2="295" y2="78"/>' +
      '<line x1="265" y1="90" x2="260" y2="110"/><line x1="285" y1="85" x2="280" y2="105"/><line x1="305" y1="88" x2="300" y2="108"/>' +
      '</g>' +
      // Puddle
      '<ellipse cx="200" cy="260" rx="40" ry="8" fill="#64B5F6" opacity="0.3"/>' +
      // Flowers
      '<g>' +
      '<line x1="40" y1="200" x2="40" y2="220" stroke="#388E3C" stroke-width="2"/><circle cx="40" cy="196" r="5" fill="#F44336"/><circle cx="40" cy="196" r="2" fill="#FFC107"/>' +
      '<line x1="360" y1="200" x2="360" y2="218" stroke="#388E3C" stroke-width="2"/><circle cx="360" cy="196" r="5" fill="#E040FB"/><circle cx="360" cy="196" r="2" fill="#FFC107"/>' +
      '</g>',
    catPos: [140, 148],
    dogPos: [280, 148],
    bubbles: [
      { speaker: "dog", de: "Heute regnet es.", en: "It's raining today." },
      { speaker: "cat", de: "Ich hasse Regen.", en: "I hate rain." },
      { speaker: "dog", de: "Aber die Blumen brauchen Wasser!", en: "But the flowers need water!" },
      { speaker: "cat", de: "Die Blumen k\u00f6nnen warten.", en: "The flowers can wait." }
    ]
  },
  {
    id: 10,
    title: "At School",
    titleDe: "In der Schule",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF8E1"/><stop offset="100%" stop-color="#FFF3E0"/></linearGradient>' +
      '<linearGradient id="board" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2E7D32"/><stop offset="100%" stop-color="#1B5E20"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="240" width="400" height="60" fill="#EFEBE9"/>' +
      // Blackboard
      '<rect x="60" y="20" width="280" height="130" fill="#5D4037" rx="4" filter="url(#sh)"/>' +
      '<rect x="68" y="28" width="264" height="114" fill="url(#board)" rx="2"/>' +
      '<text x="200" y="65" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="16">Deutsch ist</text>' +
      '<text x="200" y="100" text-anchor="middle" fill="#FFF176" font-size="28" font-weight="bold" font-family="serif">wunderbar!</text>' +
      '<text x="200" y="130" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">= wonderful</text>' +
      // Desks
      '<rect x="30" y="195" width="140" height="40" fill="#8D6E63" rx="4" filter="url(#shSm)"/>' +
      '<rect x="230" y="195" width="140" height="40" fill="#8D6E63" rx="4" filter="url(#shSm)"/>' +
      // Books on desk
      '<rect x="45" y="188" width="20" height="10" fill="#F44336" rx="1"/>' +
      '<rect x="68" y="186" width="22" height="12" fill="#2196F3" rx="1"/>' +
      '<rect x="255" y="188" width="18" height="10" fill="#4CAF50" rx="1"/>' +
      // Apple
      '<circle cx="350" cy="188" r="7" fill="#F44336"/>' +
      '<path d="M 350,181 L 352,177" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round"/>' +
      '<ellipse cx="352" cy="177" rx="3" ry="2" fill="#4CAF50"/>',
    catPos: [100, 160],
    dogPos: [300, 160],
    bubbles: [
      { speaker: "dog", de: "Heute lernen wir Deutsch.", en: "Today we are learning German." },
      { speaker: "cat", de: "Ich spreche schon Deutsch.", en: "I already speak German." },
      { speaker: "dog", de: "Du sprichst nur \u2018Miau\u2019.", en: "You only say 'Meow'." },
      { speaker: "cat", de: "Das ist Deutsch f\u00fcr Katzen.", en: "That's German for cats." }
    ]
  },
  {
    id: 11,
    title: "Phone Call",
    titleDe: "Das Telefonat",
    defs: '<linearGradient id="bgL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8EAF6"/><stop offset="100%" stop-color="#C5CAE9"/></linearGradient>' +
      '<linearGradient id="bgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF3E0"/><stop offset="100%" stop-color="#FFE0B2"/></linearGradient>',
    bg: '<rect x="0" y="0" width="200" height="300" fill="url(#bgL)"/>' +
      '<rect x="200" y="0" width="200" height="300" fill="url(#bgR)"/>' +
      // Divider
      '<line x1="200" y1="0" x2="200" y2="300" stroke="#9FA8DA" stroke-width="3" stroke-dasharray="8,4"/>' +
      // Floor
      '<rect x="0" y="230" width="200" height="70" fill="#D1C4E9"/>' +
      '<rect x="200" y="230" width="200" height="70" fill="#FFE0B2"/>' +
      // Furniture left
      '<rect x="20" y="160" width="60" height="70" fill="#7986CB" rx="4"/>' +
      '<rect x="25" y="165" width="50" height="10" fill="#9FA8DA" rx="2"/>' +
      // Furniture right
      '<rect x="320" y="160" width="60" height="70" fill="#FFCC80" rx="4"/>' +
      '<rect x="325" y="165" width="50" height="10" fill="#FFE0B2" rx="2"/>' +
      // Signal waves
      '<path d="M 170,100 Q 185,90 190,95" fill="none" stroke="#7986CB" stroke-width="1.5" opacity="0.4"/>' +
      '<path d="M 165,90 Q 185,78 195,85" fill="none" stroke="#7986CB" stroke-width="1.5" opacity="0.3"/>' +
      '<path d="M 210,95 Q 215,90 230,100" fill="none" stroke="#FFB74D" stroke-width="1.5" opacity="0.4"/>' +
      '<path d="M 205,85 Q 215,78 235,90" fill="none" stroke="#FFB74D" stroke-width="1.5" opacity="0.3"/>',
    catPos: [110, 148],
    dogPos: [300, 148],
    fg: // Phones
      '<rect x="135" y="155" width="12" height="22" fill="#37474F" rx="2" filter="url(#shSm)"/>' +
      '<rect x="137" y="158" width="8" height="14" fill="#455A64" rx="1"/>' +
      '<circle cx="141" cy="175" r="1.5" fill="#4CAF50"/>' +
      '<rect x="263" y="155" width="12" height="22" fill="#37474F" rx="2" filter="url(#shSm)"/>' +
      '<rect x="265" y="158" width="8" height="14" fill="#455A64" rx="1"/>' +
      '<circle cx="269" cy="175" r="1.5" fill="#4CAF50"/>',
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
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF9C4"/><stop offset="100%" stop-color="#FFF3E0"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="240" width="400" height="60" fill="#F5F5F5"/>' +
      // Post sign
      '<rect x="100" y="15" width="200" height="35" fill="#F9A825" rx="4" filter="url(#sh)"/>' +
      '<text x="200" y="38" text-anchor="middle" fill="white" font-size="18" font-weight="bold">DEUTSCHE POST</text>' +
      // Counter
      '<rect x="40" y="140" width="320" height="95" fill="white" rx="6" filter="url(#sh)"/>' +
      '<rect x="40" y="140" width="320" height="15" fill="#F9A825" rx="6 6 0 0"/>' +
      // Letter
      '<rect x="80" y="170" width="80" height="50" fill="#FFF9C4" rx="2" stroke="#F9A825" stroke-width="1.5"/>' +
      '<path d="M 80,170 L 120,200 L 160,170" fill="none" stroke="#F9A825" stroke-width="1.5"/>' +
      // Stamp
      '<rect x="140" y="175" width="16" height="12" fill="#E53935" rx="1"/><text x="148" y="184" text-anchor="middle" fill="white" font-size="6" font-weight="bold">1\u20ac</text>' +
      // Packages
      '<rect x="220" y="180" width="35" height="30" fill="#D7CCC8" rx="2" stroke="#8D6E63" stroke-width="1"/>' +
      '<line x1="237" y1="180" x2="237" y2="210" stroke="#8D6E63" stroke-width="0.5"/><line x1="220" y1="195" x2="255" y2="195" stroke="#8D6E63" stroke-width="0.5"/>' +
      '<rect x="265" y="185" width="30" height="25" fill="#BCAAA4" rx="2" stroke="#8D6E63" stroke-width="1"/>' +
      // Scale
      '<rect x="310" y="190" width="30" height="5" fill="#BDBDBD" rx="1"/>' +
      '<rect x="322" y="170" width="6" height="20" fill="#9E9E9E" rx="1"/>' +
      '<rect x="315" y="168" width="20" height="4" fill="#BDBDBD" rx="1"/>',
    catPos: [100, 82],
    dogPos: [300, 82],
    bubbles: [
      { speaker: "cat", de: "Ich m\u00f6chte einen Brief nach Wien schicken.", en: "I would like to send a letter to Vienna." },
      { speaker: "dog", de: "Was steht in dem Brief?", en: "What's in the letter?" },
      { speaker: "cat", de: "Das ist ein Geheimnis.", en: "That's a secret." },
      { speaker: "dog", de: "Du kannst nicht schreiben!", en: "You can't write!" }
    ]
  },
  {
    id: 13,
    title: "Cooking Together",
    titleDe: "Zusammen kochen",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FAFAFA"/><stop offset="100%" stop-color="#F5F5F5"/></linearGradient>' +
      '<linearGradient id="pot" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B0BEC5"/><stop offset="100%" stop-color="#78909C"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      // Kitchen counter
      '<rect x="0" y="190" width="400" height="110" fill="#795548" rx="0"/>' +
      '<rect x="0" y="185" width="400" height="10" fill="#8D6E63" rx="2"/>' +
      // Backsplash tiles
      '<g opacity="0.15">' +
      '<rect x="10" y="80" width="380" height="100" fill="#E0E0E0" rx="2"/>' +
      '<g stroke="#BDBDBD" stroke-width="0.5"><line x1="10" y1="100" x2="390" y2="100"/><line x1="10" y1="120" x2="390" y2="120"/><line x1="10" y1="140" x2="390" y2="140"/><line x1="10" y1="160" x2="390" y2="160"/></g>' +
      '</g>' +
      // Pot
      '<rect x="140" y="130" width="120" height="55" fill="url(#pot)" rx="8" filter="url(#sh)"/>' +
      '<rect x="135" y="126" width="130" height="10" fill="#90A4AE" rx="3"/>' +
      '<rect x="125" y="150" width="15" height="8" fill="#78909C" rx="2"/><rect x="260" y="150" width="15" height="8" fill="#78909C" rx="2"/>' +
      // Lid
      '<ellipse cx="200" cy="126" rx="55" ry="6" fill="#B0BEC5"/>' +
      '<circle cx="200" cy="122" r="5" fill="#546E7A"/>' +
      // Steam
      '<g opacity="0.4" fill="none" stroke="white" stroke-width="1.5">' +
      '<path d="M 175,115 Q 177,100 179,115"/>' +
      '<path d="M 195,112 Q 197,95 199,112"/>' +
      '<path d="M 215,115 Q 217,98 219,115"/>' +
      '</g>' +
      // Cutting board with vegetables
      '<rect x="20" y="165" width="80" height="18" fill="#D7CCC8" rx="3" filter="url(#shSm)"/>' +
      '<circle cx="40" cy="164" r="6" fill="#F44336"/><circle cx="55" cy="164" r="4" fill="#FF9800"/>' +
      '<ellipse cx="75" cy="164" rx="8" ry="4" fill="#4CAF50"/>' +
      // Spoon
      '<line x1="310" y1="140" x2="330" y2="180" stroke="#BDBDBD" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="308" cy="138" rx="6" ry="8" fill="#BDBDBD"/>',
    catPos: [80, 118],
    dogPos: [320, 118],
    bubbles: [
      { speaker: "dog", de: "Heute kochen wir Pasta!", en: "Today we're cooking pasta!" },
      { speaker: "cat", de: "Ich kann nicht kochen.", en: "I can't cook." },
      { speaker: "dog", de: "Du musst nur das Wasser kochen.", en: "You just have to boil the water." },
      { speaker: "cat", de: "Das Wasser ist zu hei\u00df!", en: "The water is too hot!" }
    ]
  },
  {
    id: 14,
    title: "Clothes Shopping",
    titleDe: "Kleidung kaufen",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FCE4EC"/><stop offset="100%" stop-color="#F8BBD0"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="240" width="400" height="60" fill="#F5F5F5"/>' +
      // Store sign
      '<rect x="100" y="10" width="200" height="30" fill="white" rx="4" filter="url(#sh)"/>' +
      '<text x="200" y="30" text-anchor="middle" fill="#E91E63" font-size="14" font-weight="bold" font-family="serif">KLEIDUNG</text>' +
      // Clothing rack
      '<line x1="60" y1="55" x2="340" y2="55" stroke="#9E9E9E" stroke-width="3"/>' +
      '<line x1="60" y1="55" x2="60" y2="195" stroke="#9E9E9E" stroke-width="3"/>' +
      '<line x1="340" y1="55" x2="340" y2="195" stroke="#9E9E9E" stroke-width="3"/>' +
      // Hangers and clothes
      '<path d="M 90,55 L 100,48 L 110,55" fill="none" stroke="#BDBDBD" stroke-width="1.5"/>' +
      '<path d="M 85,60 L 100,55 L 115,60 L 112,60 L 112,100 L 88,100 L 88,60 Z" fill="#42A5F5"/>' +
      '<path d="M 140,55 L 150,48 L 160,55" fill="none" stroke="#BDBDBD" stroke-width="1.5"/>' +
      '<path d="M 135,60 L 150,55 L 165,60 L 162,60 L 162,105 L 138,105 L 138,60 Z" fill="#EF5350"/>' +
      '<path d="M 190,55 L 200,48 L 210,55" fill="none" stroke="#BDBDBD" stroke-width="1.5"/>' +
      '<path d="M 185,60 L 200,55 L 215,60 L 212,60 L 212,95 L 188,95 L 188,60 Z" fill="#66BB6A"/>' +
      '<path d="M 240,55 L 250,48 L 260,55" fill="none" stroke="#BDBDBD" stroke-width="1.5"/>' +
      '<path d="M 235,60 L 250,55 L 265,60 L 262,60 L 262,108 L 238,108 L 238,60 Z" fill="#FFB74D"/>' +
      '<path d="M 290,55 L 300,48 L 310,55" fill="none" stroke="#BDBDBD" stroke-width="1.5"/>' +
      '<path d="M 285,60 L 300,55 L 315,60 L 312,60 L 312,98 L 288,98 L 288,60 Z" fill="#CE93D8"/>' +
      // Price tags
      '<rect x="105" y="75" width="14" height="10" fill="white" rx="1"/><text x="112" y="83" text-anchor="middle" fill="#333" font-size="6">29\u20ac</text>' +
      '<rect x="155" y="80" width="14" height="10" fill="white" rx="1"/><text x="162" y="88" text-anchor="middle" fill="#E53935" font-size="6">19\u20ac</text>' +
      // Shoes at bottom
      '<ellipse cx="80" cy="210" rx="14" ry="6" fill="#5D4037"/><ellipse cx="100" cy="210" rx="14" ry="6" fill="#5D4037"/>' +
      '<ellipse cx="300" cy="210" rx="14" ry="6" fill="#E91E63"/><ellipse cx="320" cy="210" rx="14" ry="6" fill="#E91E63"/>',
    catPos: [90, 155],
    dogPos: [310, 155],
    bubbles: [
      { speaker: "cat", de: "Dieses Kleid ist sehr sch\u00f6n!", en: "This dress is very beautiful!" },
      { speaker: "dog", de: "Du bist eine Katze. Du brauchst kein Kleid.", en: "You're a cat. You don't need a dress." },
      { speaker: "cat", de: "Ich brauche auch keine Schuhe. Aber ich will!", en: "I don't need shoes either. But I want them!" }
    ]
  },
  {
    id: 15,
    title: "At the Hotel",
    titleDe: "Im Hotel",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E3F2FD"/><stop offset="100%" stop-color="#BBDEFB"/></linearGradient>' +
      '<linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#90A4AE"/><stop offset="100%" stop-color="#78909C"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="250" width="400" height="50" fill="#ECEFF1"/>' +
      // Hotel building
      '<rect x="80" y="30" width="240" height="220" fill="url(#bldg)" rx="4" filter="url(#sh)"/>' +
      '<rect x="80" y="30" width="240" height="30" fill="#607D8B" rx="4 4 0 0"/>' +
      '<text x="200" y="50" text-anchor="middle" fill="#FFC107" font-size="16" font-weight="bold" font-family="serif">HOTEL</text>' +
      // Windows
      '<g fill="#BBDEFB" stroke="#546E7A" stroke-width="1">' +
      '<rect x="100" y="75" width="30" height="25" rx="2"/><rect x="145" y="75" width="30" height="25" rx="2"/><rect x="225" y="75" width="30" height="25" rx="2"/><rect x="270" y="75" width="30" height="25" rx="2"/>' +
      '<rect x="100" y="115" width="30" height="25" rx="2"/><rect x="145" y="115" width="30" height="25" rx="2"/><rect x="225" y="115" width="30" height="25" rx="2"/><rect x="270" y="115" width="30" height="25" rx="2"/>' +
      '</g>' +
      // Lit window
      '<rect x="190" y="75" width="30" height="25" fill="#FFF176" rx="2" stroke="#546E7A" stroke-width="1"/>' +
      '<rect x="190" y="115" width="30" height="25" fill="#BBDEFB" rx="2" stroke="#546E7A" stroke-width="1"/>' +
      // Door
      '<rect x="175" y="185" width="50" height="65" fill="#5D4037" rx="4"/>' +
      '<circle cx="218" cy="220" r="3" fill="#FFC107"/>' +
      // Awning
      '<path d="M 165,185 L 235,185 L 240,175 L 160,175 Z" fill="#B71C1C"/>' +
      // Doorman area
      '<rect x="155" y="235" width="90" height="15" fill="#CFD8DC" rx="2"/>' +
      // Stars
      '<g fill="#FFC107"><circle cx="180" cy="62" r="3"/><circle cx="192" cy="62" r="3"/><circle cx="204" cy="62" r="3"/><circle cx="216" cy="62" r="3"/></g>',
    catPos: [55, 182],
    dogPos: [345, 182],
    bubbles: [
      { speaker: "cat", de: "Haben Sie ein Zimmer frei?", en: "Do you have a room available?" },
      { speaker: "dog", de: "Ja, Zimmer 404. Dritter Stock.", en: "Yes, room 404. Third floor." },
      { speaker: "cat", de: "Hat das Zimmer ein Bett?", en: "Does the room have a bed?" },
      { speaker: "dog", de: "Nat\u00fcrlich! Was erwartest du?", en: "Of course! What do you expect?" },
      { speaker: "cat", de: "Einen Kratzbaum.", en: "A scratching post." }
    ]
  },
  {
    id: 16,
    title: "At the Park",
    titleDe: "Im Park",
    defs: '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#64B5F6"/><stop offset="60%" stop-color="#90CAF9"/><stop offset="100%" stop-color="#BBDEFB"/></linearGradient>' +
      '<linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#66BB6A"/><stop offset="100%" stop-color="#388E3C"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#sky)"/>' +
      '<rect x="0" y="180" width="400" height="120" fill="url(#grass)"/>' +
      // Sun
      '<circle cx="340" cy="45" r="25" fill="#FFF176" opacity="0.6"/><circle cx="340" cy="45" r="18" fill="#FFEE58"/>' +
      // Trees
      '<rect x="55" y="100" width="10" height="80" fill="#795548"/>' +
      '<circle cx="60" cy="80" r="30" fill="#388E3C" filter="url(#shSm)"/><circle cx="42" cy="90" r="22" fill="#2E7D32"/><circle cx="78" cy="88" r="20" fill="#43A047"/>' +
      '<rect x="325" y="90" width="10" height="90" fill="#795548"/>' +
      '<circle cx="330" cy="70" r="28" fill="#388E3C" filter="url(#shSm)"/><circle cx="310" cy="78" r="20" fill="#2E7D32"/><circle cx="348" cy="76" r="18" fill="#43A047"/>' +
      // Bench
      '<rect x="150" y="200" width="100" height="8" fill="#8D6E63" rx="2" filter="url(#shSm)"/>' +
      '<rect x="150" y="195" width="100" height="8" fill="#A1887F" rx="2"/>' +
      '<rect x="155" y="208" width="6" height="20" fill="#6D4C41"/><rect x="239" y="208" width="6" height="20" fill="#6D4C41"/>' +
      // Flowers in grass
      '<g>' +
      '<circle cx="30" cy="200" r="3" fill="#F44336"/><circle cx="30" cy="200" r="1.2" fill="#FFC107"/>' +
      '<circle cx="120" cy="210" r="3" fill="#E040FB"/><circle cx="120" cy="210" r="1.2" fill="#FFC107"/>' +
      '<circle cx="280" cy="205" r="3" fill="#FF9800"/><circle cx="280" cy="205" r="1.2" fill="#FFC107"/>' +
      '<circle cx="380" cy="195" r="3" fill="#F44336"/><circle cx="380" cy="195" r="1.2" fill="#FFC107"/>' +
      '</g>' +
      // Ball
      '<circle cx="260" cy="220" r="8" fill="#F44336" filter="url(#shSm)"/>' +
      '<path d="M 254,217 Q 260,213 266,217" fill="none" stroke="white" stroke-width="1" opacity="0.4"/>' +
      // Path
      '<path d="M 0,260 Q 100,240 200,260 Q 300,280 400,260" fill="none" stroke="#A5D6A7" stroke-width="20" opacity="0.4"/>',
    catPos: [150, 148],
    dogPos: [310, 148],
    bubbles: [
      { speaker: "dog", de: "Lass uns spielen! Wirf den Ball!", en: "Let's play! Throw the ball!" },
      { speaker: "cat", de: "Ich werfe keine B\u00e4lle.", en: "I don't throw balls." },
      { speaker: "dog", de: "Was machst du dann im Park?", en: "What do you do in the park then?" },
      { speaker: "cat", de: "Ich sitze in der Sonne und schlafe.", en: "I sit in the sun and sleep." }
    ]
  },
  {
    id: 17,
    title: "Job Interview",
    titleDe: "Das Vorstellungsgespr\u00e4ch",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ECEFF1"/><stop offset="100%" stop-color="#CFD8DC"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="240" width="400" height="60" fill="#B0BEC5"/>' +
      // Office desk
      '<rect x="80" y="155" width="240" height="70" fill="#5D4037" rx="4" filter="url(#sh)"/>' +
      '<rect x="80" y="150" width="240" height="10" fill="#795548" rx="4 4 0 0"/>' +
      // Papers on desk
      '<rect x="160" y="162" width="35" height="45" fill="white" rx="1" transform="rotate(-5,177,184)"/>' +
      '<rect x="200" y="165" width="35" height="45" fill="white" rx="1" transform="rotate(3,217,187)"/>' +
      '<line x1="166" y1="175" x2="188" y2="174" stroke="#E0E0E0" stroke-width="1"/><line x1="167" y1="182" x2="186" y2="181" stroke="#E0E0E0" stroke-width="1"/><line x1="168" y1="189" x2="185" y2="188" stroke="#E0E0E0" stroke-width="1"/>' +
      // Pen
      '<line x1="240" y1="165" x2="260" y2="200" stroke="#1565C0" stroke-width="2.5" stroke-linecap="round"/>' +
      // Name plate
      '<rect x="105" y="160" width="45" height="12" fill="#37474F" rx="2"/>' +
      '<text x="127" y="169" text-anchor="middle" fill="white" font-size="6">HR HUND</text>' +
      // Diploma on wall
      '<rect x="155" y="30" width="90" height="65" fill="white" rx="2" filter="url(#shSm)"/>' +
      '<rect x="160" y="35" width="80" height="55" fill="#FAFAFA" rx="1" stroke="#CFD8DC" stroke-width="1"/>' +
      '<text x="200" y="55" text-anchor="middle" fill="#37474F" font-size="8" font-weight="bold">DIPLOM</text>' +
      '<line x1="175" y1="65" x2="225" y2="65" stroke="#E0E0E0" stroke-width="0.5"/>' +
      '<line x1="180" y1="72" x2="220" y2="72" stroke="#E0E0E0" stroke-width="0.5"/>' +
      // Plant
      '<rect x="330" y="130" width="25" height="30" fill="#795548" rx="3"/>' +
      '<circle cx="342" cy="118" r="15" fill="#4CAF50"/><circle cx="335" cy="110" r="10" fill="#388E3C"/><circle cx="350" cy="112" r="10" fill="#43A047"/>',
    catPos: [120, 105],
    dogPos: [280, 105],
    fg: // Suits/ties
      '<line x1="120" y1="125" x2="120" y2="145" stroke="#37474F" stroke-width="3"/>' +
      '<line x1="280" y1="125" x2="280" y2="145" stroke="#37474F" stroke-width="3"/>',
    bubbles: [
      { speaker: "dog", de: "Was sind Ihre St\u00e4rken?", en: "What are your strengths?" },
      { speaker: "cat", de: "Ich kann achtzehn Stunden am Tag schlafen.", en: "I can sleep eighteen hours a day." },
      { speaker: "dog", de: "Das ist keine St\u00e4rke.", en: "That's not a strength." },
      { speaker: "cat", de: "Doch. Ich bin sehr effizient.", en: "Yes it is. I am very efficient." }
    ]
  },
  {
    id: 18,
    title: "Birthday Party",
    titleDe: "Die Geburtstagsfeier",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F3E5F5"/><stop offset="100%" stop-color="#E1BEE7"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="240" width="400" height="60" fill="#E8EAF6"/>' +
      // Banner
      '<text x="200" y="35" text-anchor="middle" fill="#E91E63" font-size="20" font-weight="bold" font-family="serif">Alles Gute!</text>' +
      // Confetti
      '<g opacity="0.7">' +
      '<circle cx="40" cy="50" r="4" fill="#FF5722"/><circle cx="80" cy="30" r="3" fill="#2196F3"/><circle cx="130" cy="45" r="3.5" fill="#4CAF50"/>' +
      '<circle cx="270" cy="35" r="3" fill="#FFC107"/><circle cx="320" cy="50" r="4" fill="#9C27B0"/><circle cx="360" cy="30" r="3.5" fill="#FF5722"/>' +
      '<rect x="55" y="55" width="6" height="3" fill="#E91E63" transform="rotate(30,58,56)"/>' +
      '<rect x="180" y="25" width="6" height="3" fill="#2196F3" transform="rotate(-20,183,26)"/>' +
      '<rect x="300" y="60" width="6" height="3" fill="#4CAF50" transform="rotate(45,303,61)"/>' +
      '</g>' +
      // Bunting
      '<line x1="30" y1="60" x2="370" y2="60" stroke="#E0E0E0" stroke-width="1"/>' +
      '<polygon points="50,60 60,60 55,75" fill="#F44336"/><polygon points="80,60 90,60 85,75" fill="#2196F3"/><polygon points="110,60 120,60 115,75" fill="#FFC107"/><polygon points="140,60 150,60 145,75" fill="#4CAF50"/><polygon points="170,60 180,60 175,75" fill="#E91E63"/><polygon points="200,60 210,60 205,75" fill="#9C27B0"/><polygon points="230,60 240,60 235,75" fill="#FF9800"/><polygon points="260,60 270,60 265,75" fill="#2196F3"/><polygon points="290,60 300,60 295,75" fill="#F44336"/><polygon points="320,60 330,60 325,75" fill="#4CAF50"/><polygon points="350,60 360,60 355,75" fill="#FFC107"/>' +
      // Table
      '<rect x="120" y="180" width="160" height="10" fill="#8D6E63" rx="2" filter="url(#sh)"/>' +
      '<rect x="150" y="190" width="8" height="50" fill="#6D4C41"/><rect x="242" y="190" width="8" height="50" fill="#6D4C41"/>' +
      // Cake
      '<rect x="160" y="130" width="80" height="50" fill="#FFCC80" rx="6" stroke="#FF9800" stroke-width="2"/>' +
      '<rect x="160" y="130" width="80" height="15" fill="#FF9800" rx="6 6 0 0"/>' +
      '<path d="M 160,155 Q 180,150 200,155 Q 220,160 240,155" fill="none" stroke="#E91E63" stroke-width="2"/>' +
      // Candles
      '<rect x="185" y="108" width="4" height="24" fill="#FFF9C4" rx="1"/>' +
      '<rect x="200" y="105" width="4" height="27" fill="#BBDEFB" rx="1"/>' +
      '<rect x="215" y="108" width="4" height="24" fill="#C8E6C9" rx="1"/>' +
      // Flames
      '<ellipse cx="187" cy="105" rx="2.5" ry="4" fill="#FF9800"/><ellipse cx="187" cy="104" rx="1.2" ry="2.5" fill="#FFC107"/>' +
      '<ellipse cx="202" cy="102" rx="2.5" ry="4" fill="#FF9800"/><ellipse cx="202" cy="101" rx="1.2" ry="2.5" fill="#FFC107"/>' +
      '<ellipse cx="217" cy="105" rx="2.5" ry="4" fill="#FF9800"/><ellipse cx="217" cy="104" rx="1.2" ry="2.5" fill="#FFC107"/>' +
      // Present
      '<rect x="310" y="195" width="35" height="30" fill="#E8EAF6" rx="3" stroke="#9C27B0" stroke-width="1.5"/>' +
      '<line x1="327" y1="195" x2="327" y2="225" stroke="#9C27B0" stroke-width="1.5"/>' +
      '<path d="M 320,195 Q 327,188 334,195" fill="none" stroke="#9C27B0" stroke-width="1.5"/>' +
      // Balloons
      '<ellipse cx="55" cy="120" rx="15" ry="20" fill="#F44336" opacity="0.8"/><line x1="55" y1="140" x2="55" y2="180" stroke="#F44336" stroke-width="0.5"/>' +
      '<ellipse cx="350" cy="110" rx="15" ry="20" fill="#2196F3" opacity="0.8"/><line x1="350" y1="130" x2="350" y2="180" stroke="#2196F3" stroke-width="0.5"/>',
    catPos: [100, 140],
    dogPos: [300, 140],
    bubbles: [
      { speaker: "dog", de: "Alles Gute zum Geburtstag!", en: "Happy birthday!" },
      { speaker: "cat", de: "Danke! Wo ist mein Geschenk?", en: "Thanks! Where is my present?" },
      { speaker: "dog", de: "Hier! Es ist ein Ball.", en: "Here! It's a ball." },
      { speaker: "cat", de: "Ein Ball ist ein Geschenk f\u00fcr Hunde, nicht f\u00fcr Katzen.", en: "A ball is a present for dogs, not for cats." },
      { speaker: "dog", de: "Oh... M\u00f6chtest du einen Fisch?", en: "Oh... Would you like a fish?" }
    ]
  },
  {
    id: 19,
    title: "At the Bank",
    titleDe: "Bei der Bank",
    defs: '<linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8EAF6"/><stop offset="100%" stop-color="#C5CAE9"/></linearGradient>',
    bg: '<rect width="400" height="300" fill="url(#bgG)"/>' +
      '<rect x="0" y="245" width="400" height="55" fill="#ECEFF1"/>' +
      // Bank building facade
      '<rect x="60" y="20" width="280" height="30" fill="#1565C0" rx="4 4 0 0" filter="url(#sh)"/>' +
      '<text x="200" y="40" text-anchor="middle" fill="white" font-size="16" font-weight="bold">BANK</text>' +
      // Columns
      '<rect x="75" y="50" width="16" height="130" fill="#E0E0E0"/><rect x="73" y="48" width="20" height="8" fill="#BDBDBD" rx="1"/><rect x="73" y="175" width="20" height="8" fill="#BDBDBD" rx="1"/>' +
      '<rect x="309" y="50" width="16" height="130" fill="#E0E0E0"/><rect x="307" y="48" width="20" height="8" fill="#BDBDBD" rx="1"/><rect x="307" y="175" width="20" height="8" fill="#BDBDBD" rx="1"/>' +
      // Interior wall
      '<rect x="95" y="50" width="210" height="135" fill="#F5F5F5"/>' +
      // Counter
      '<rect x="100" y="140" width="200" height="50" fill="white" rx="4" filter="url(#sh)"/>' +
      '<rect x="100" y="140" width="200" height="10" fill="#1565C0" rx="4 4 0 0"/>' +
      // Money display
      '<rect x="120" y="160" width="65" height="25" fill="#E3F2FD" rx="3"/>' +
      '<text x="152" y="178" text-anchor="middle" fill="#1565C0" font-size="16" font-weight="bold">\u20ac\u20ac\u20ac</text>' +
      // Computer screen
      '<rect x="220" y="155" width="40" height="30" fill="#263238" rx="2"/>' +
      '<rect x="223" y="158" width="34" height="20" fill="#4CAF50" rx="1"/>' +
      '<rect x="235" y="185" width="16" height="5" fill="#9E9E9E" rx="1"/>' +
      // Safe icon on wall
      '<rect x="170" y="65" width="60" height="55" fill="#78909C" rx="4" filter="url(#shSm)"/>' +
      '<circle cx="200" cy="92" r="10" fill="#546E7A" stroke="#90A4AE" stroke-width="1.5"/>' +
      '<line x1="200" y1="85" x2="200" y2="99" stroke="#90A4AE" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="200" cy="92" r="3" fill="#455A64"/>',
    catPos: [100, 185],
    dogPos: [300, 185],
    bubbles: [
      { speaker: "cat", de: "Ich m\u00f6chte ein Konto er\u00f6ffnen.", en: "I would like to open an account." },
      { speaker: "dog", de: "Haben Sie einen Ausweis?", en: "Do you have an ID?" },
      { speaker: "cat", de: "Ich habe einen Impfpass.", en: "I have a vaccination card." },
      { speaker: "dog", de: "Das ist kein Ausweis!", en: "That's not an ID!" }
    ]
  },
  {
    id: 20,
    title: "Saying Goodbye",
    titleDe: "Abschied nehmen",
    defs: '<linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF7043"/><stop offset="30%" stop-color="#FF8A65"/><stop offset="60%" stop-color="#FFAB91"/><stop offset="100%" stop-color="#FFE0B2"/></linearGradient>' +
      '<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5D4037"/><stop offset="100%" stop-color="#3E2723"/></linearGradient>' +
      '<radialGradient id="sunG" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#FFF176"/><stop offset="60%" stop-color="#FFE082"/><stop offset="100%" stop-color="#FF8A65" stop-opacity="0"/></radialGradient>',
    bg: '<rect width="400" height="300" fill="url(#sunset)"/>' +
      // Sun
      '<circle cx="200" cy="100" r="70" fill="url(#sunG)"/>' +
      '<circle cx="200" cy="100" r="30" fill="#FFF176" opacity="0.7"/>' +
      '<circle cx="200" cy="100" r="22" fill="#FFEE58"/>' +
      // Ground
      '<path d="M 0,200 Q 100,185 200,200 Q 300,215 400,200 L 400,300 L 0,300 Z" fill="url(#ground)"/>' +
      // Silhouette trees
      '<circle cx="40" cy="170" r="25" fill="#4E342E" opacity="0.5"/><rect x="37" y="185" width="6" height="30" fill="#4E342E" opacity="0.5"/>' +
      '<circle cx="370" cy="165" r="22" fill="#4E342E" opacity="0.5"/><rect x="367" y="180" width="6" height="30" fill="#4E342E" opacity="0.5"/>' +
      // Path
      '<path d="M 150,300 Q 200,230 250,300" fill="#3E2723" opacity="0.3"/>' +
      // Birds in sky
      '<path d="M 100,50 Q 105,45 110,50 Q 115,45 120,50" fill="none" stroke="#5D4037" stroke-width="1.2" opacity="0.5"/>' +
      '<path d="M 280,40 Q 284,36 288,40 Q 292,36 296,40" fill="none" stroke="#5D4037" stroke-width="1" opacity="0.4"/>' +
      '<path d="M 150,65 Q 153,62 156,65 Q 159,62 162,65" fill="none" stroke="#5D4037" stroke-width="0.8" opacity="0.3"/>',
    catPos: [140, 148],
    dogPos: [270, 148],
    fg: // Waving paws
      '<line x1="' + (140 + 18) + '" y1="' + (148 + 20) + '" x2="' + (140 + 30) + '" y2="' + (148 + 8) + '" stroke="#FF8C00" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="' + (270 - 18) + '" y1="' + (148 + 20) + '" x2="' + (270 - 30) + '" y2="' + (148 + 8) + '" stroke="#C8A020" stroke-width="5" stroke-linecap="round"/>',
    bubbles: [
      { speaker: "cat", de: "Ich muss jetzt gehen.", en: "I have to go now." },
      { speaker: "dog", de: "Schon? Es ist noch fr\u00fch!", en: "Already? It's still early!" },
      { speaker: "cat", de: "Ich muss schlafen. Ich schlafe sechzehn Stunden.", en: "I have to sleep. I sleep sixteen hours." },
      { speaker: "dog", de: "Tsch\u00fcss! Bis morgen!", en: "Bye! See you tomorrow!" },
      { speaker: "cat", de: "Tsch\u00fcss! Vergiss den Fisch nicht!", en: "Bye! Don't forget the fish!" }
    ]
  }
];
