var SCENARIO_THEMES = {
  daily_life: { name: "Daily Life", emoji: "🏠" },
  shopping: { name: "Shopping", emoji: "🛒" },
  travel: { name: "Travel", emoji: "✈️" },
  social: { name: "Social", emoji: "👋" },
  work_school: { name: "Work & School", emoji: "💼" },
  health: { name: "Health", emoji: "🏥" },
  official: { name: "Official", emoji: "🏛️" }
};

var SCENARIOS = [
  // ===== DAILY LIFE (10) =====
  {
    id: 0,
    title: "Morning Routine",
    titleDe: "Die Morgenroutine",
    theme: "daily_life",
    lines: [
      { speaker: "Anna", de: "Guten Morgen! Wie spät ist es?", en: "Good morning! What time is it?" },
      { speaker: "Tom", de: "Es ist sieben Uhr. Steh auf!", en: "It's seven o'clock. Get up!" },
      { speaker: "Anna", de: "Okay. Ich gehe zuerst ins Bad.", en: "Okay. I'll go to the bathroom first." },
      { speaker: "Tom", de: "Das Frühstück ist in zehn Minuten fertig.", en: "Breakfast will be ready in ten minutes." }
    ]
  },
  {
    id: 1,
    title: "Making Breakfast",
    titleDe: "Frühstück machen",
    theme: "daily_life",
    lines: [
      { speaker: "Maria", de: "Was möchtest du zum Frühstück?", en: "What would you like for breakfast?" },
      { speaker: "Paul", de: "Ich nehme Brot mit Käse und ein Ei.", en: "I'll have bread with cheese and an egg." },
      { speaker: "Maria", de: "Möchtest du auch Kaffee?", en: "Would you also like coffee?" },
      { speaker: "Paul", de: "Ja, bitte. Mit Milch, ohne Zucker.", en: "Yes, please. With milk, no sugar." }
    ]
  },
  {
    id: 2,
    title: "Cleaning the Apartment",
    titleDe: "Die Wohnung putzen",
    theme: "daily_life",
    lines: [
      { speaker: "Lisa", de: "Heute müssen wir die Wohnung putzen.", en: "Today we have to clean the apartment." },
      { speaker: "Jan", de: "Okay. Ich mache das Bad.", en: "Okay. I'll do the bathroom." },
      { speaker: "Lisa", de: "Gut. Ich sauge die Zimmer.", en: "Good. I'll vacuum the rooms." },
      { speaker: "Jan", de: "Können wir danach einkaufen gehen?", en: "Can we go shopping afterwards?" },
      { speaker: "Lisa", de: "Ja, natürlich.", en: "Yes, of course." }
    ]
  },
  {
    id: 3,
    title: "Getting Dressed",
    titleDe: "Sich anziehen",
    theme: "daily_life",
    lines: [
      { speaker: "Mutter", de: "Was ziehst du heute an?", en: "What are you wearing today?" },
      { speaker: "Kind", de: "Meine Jeans und das blaue T-Shirt.", en: "My jeans and the blue T-shirt." },
      { speaker: "Mutter", de: "Es ist kalt draußen. Nimm eine Jacke mit!", en: "It's cold outside. Take a jacket!" },
      { speaker: "Kind", de: "Okay, Mama.", en: "Okay, Mom." }
    ]
  },
  {
    id: 4,
    title: "Cooking Dinner",
    titleDe: "Abendessen kochen",
    theme: "daily_life",
    lines: [
      { speaker: "Eva", de: "Was kochen wir heute Abend?", en: "What are we cooking tonight?" },
      { speaker: "Max", de: "Vielleicht Nudeln mit Tomatensoße?", en: "Maybe pasta with tomato sauce?" },
      { speaker: "Eva", de: "Gute Idee! Haben wir Tomaten?", en: "Good idea! Do we have tomatoes?" },
      { speaker: "Max", de: "Ja, sie sind im Kühlschrank.", en: "Yes, they are in the fridge." },
      { speaker: "Eva", de: "Dann fangen wir an!", en: "Then let's start!" }
    ]
  },
  {
    id: 5,
    title: "Doing Laundry",
    titleDe: "Wäsche waschen",
    theme: "daily_life",
    lines: [
      { speaker: "Tina", de: "Ich muss heute Wäsche waschen.", en: "I have to do laundry today." },
      { speaker: "Mark", de: "Meine Hemden sind auch schmutzig.", en: "My shirts are dirty too." },
      { speaker: "Tina", de: "Leg sie in den Wäschekorb.", en: "Put them in the laundry basket." },
      { speaker: "Mark", de: "Danke! Wann ist die Wäsche fertig?", en: "Thanks! When will the laundry be done?" },
      { speaker: "Tina", de: "In zwei Stunden.", en: "In two hours." }
    ]
  },
  {
    id: 6,
    title: "Setting the Table",
    titleDe: "Den Tisch decken",
    theme: "daily_life",
    lines: [
      { speaker: "Vater", de: "Kannst du bitte den Tisch decken?", en: "Can you please set the table?" },
      { speaker: "Kind", de: "Wie viele Teller brauchen wir?", en: "How many plates do we need?" },
      { speaker: "Vater", de: "Vier. Oma und Opa kommen auch.", en: "Four. Grandma and Grandpa are coming too." },
      { speaker: "Kind", de: "Soll ich auch Gläser holen?", en: "Should I also get glasses?" },
      { speaker: "Vater", de: "Ja, bitte. Und Servietten.", en: "Yes, please. And napkins." }
    ]
  },
  {
    id: 7,
    title: "Taking Out the Trash",
    titleDe: "Den Müll rausbringen",
    theme: "daily_life",
    lines: [
      { speaker: "Mutter", de: "Kannst du bitte den Müll rausbringen?", en: "Can you please take out the trash?" },
      { speaker: "Sohn", de: "Jetzt? Es regnet draußen.", en: "Now? It's raining outside." },
      { speaker: "Mutter", de: "Ja, die Tonne ist voll.", en: "Yes, the bin is full." },
      { speaker: "Sohn", de: "Okay, ich mache das schnell.", en: "Okay, I'll do it quickly." }
    ]
  },
  {
    id: 8,
    title: "Watching TV in the Evening",
    titleDe: "Abends fernsehen",
    theme: "daily_life",
    lines: [
      { speaker: "Peter", de: "Was kommt heute im Fernsehen?", en: "What's on TV today?" },
      { speaker: "Klara", de: "Um acht gibt es einen Film.", en: "There's a movie at eight." },
      { speaker: "Peter", de: "Was für ein Film?", en: "What kind of movie?" },
      { speaker: "Klara", de: "Eine Komödie. Möchtest du ihn sehen?", en: "A comedy. Do you want to watch it?" },
      { speaker: "Peter", de: "Ja, gerne!", en: "Yes, gladly!" }
    ]
  },
  {
    id: 9,
    title: "Going to Bed",
    titleDe: "Ins Bett gehen",
    theme: "daily_life",
    lines: [
      { speaker: "Vater", de: "Es ist schon spät. Zeit fürs Bett!", en: "It's late already. Time for bed!" },
      { speaker: "Kind", de: "Noch fünf Minuten, bitte!", en: "Five more minutes, please!" },
      { speaker: "Vater", de: "Nein, du musst morgen früh aufstehen.", en: "No, you have to get up early tomorrow." },
      { speaker: "Kind", de: "Okay. Gute Nacht, Papa!", en: "Okay. Good night, Dad!" },
      { speaker: "Vater", de: "Gute Nacht! Schlaf gut!", en: "Good night! Sleep well!" }
    ]
  },

  // ===== SHOPPING (8) =====
  {
    id: 10,
    title: "At the Bakery",
    titleDe: "In der Bäckerei",
    theme: "shopping",
    lines: [
      { speaker: "Verkäufer", de: "Guten Morgen! Was möchten Sie?", en: "Good morning! What would you like?" },
      { speaker: "Kunde", de: "Ich möchte zwei Brötchen und ein Brot, bitte.", en: "I would like two rolls and a bread, please." },
      { speaker: "Verkäufer", de: "Das macht drei Euro zwanzig.", en: "That will be three euros twenty." },
      { speaker: "Kunde", de: "Hier, bitte. Danke!", en: "Here you go. Thanks!" },
      { speaker: "Verkäufer", de: "Danke! Einen schönen Tag!", en: "Thanks! Have a nice day!" }
    ]
  },
  {
    id: 11,
    title: "At the Supermarket",
    titleDe: "Im Supermarkt",
    theme: "shopping",
    lines: [
      { speaker: "Kunde", de: "Entschuldigung, wo finde ich die Milch?", en: "Excuse me, where can I find the milk?" },
      { speaker: "Mitarbeiter", de: "Die Milch ist im Gang drei, links.", en: "The milk is in aisle three, on the left." },
      { speaker: "Kunde", de: "Und wo ist der Käse?", en: "And where is the cheese?" },
      { speaker: "Mitarbeiter", de: "Auch im Gang drei, am Ende.", en: "Also in aisle three, at the end." },
      { speaker: "Kunde", de: "Vielen Dank!", en: "Thank you very much!" }
    ]
  },
  {
    id: 12,
    title: "At the Clothing Store",
    titleDe: "Im Kleidungsgeschäft",
    theme: "shopping",
    lines: [
      { speaker: "Verkäuferin", de: "Kann ich Ihnen helfen?", en: "Can I help you?" },
      { speaker: "Kundin", de: "Ja, ich suche eine Hose in Größe 38.", en: "Yes, I'm looking for pants in size 38." },
      { speaker: "Verkäuferin", de: "Hier haben wir diese in Blau und Schwarz.", en: "Here we have these in blue and black." },
      { speaker: "Kundin", de: "Kann ich die schwarze anprobieren?", en: "Can I try on the black one?" },
      { speaker: "Verkäuferin", de: "Natürlich! Die Umkleidekabine ist dort hinten.", en: "Of course! The fitting room is back there." }
    ]
  },
  {
    id: 13,
    title: "At the Market",
    titleDe: "Auf dem Markt",
    theme: "shopping",
    lines: [
      { speaker: "Verkäufer", de: "Frisches Obst und Gemüse! Was darf es sein?", en: "Fresh fruit and vegetables! What can I get you?" },
      { speaker: "Kundin", de: "Ein Kilo Äpfel und ein Kilo Kartoffeln, bitte.", en: "One kilo of apples and one kilo of potatoes, please." },
      { speaker: "Verkäufer", de: "Sonst noch etwas?", en: "Anything else?" },
      { speaker: "Kundin", de: "Nein, danke. Was kostet das?", en: "No, thanks. How much is that?" },
      { speaker: "Verkäufer", de: "Zusammen vier Euro fünfzig.", en: "Together four euros fifty." }
    ]
  },
  {
    id: 14,
    title: "At the Electronics Store",
    titleDe: "Im Elektronikgeschäft",
    theme: "shopping",
    lines: [
      { speaker: "Kunde", de: "Ich brauche ein Ladekabel für mein Handy.", en: "I need a charging cable for my phone." },
      { speaker: "Verkäufer", de: "Was für ein Handy haben Sie?", en: "What kind of phone do you have?" },
      { speaker: "Kunde", de: "Ein Samsung.", en: "A Samsung." },
      { speaker: "Verkäufer", de: "Dann brauchen Sie dieses Kabel. Es kostet zwölf Euro.", en: "Then you need this cable. It costs twelve euros." },
      { speaker: "Kunde", de: "Gut, ich nehme es.", en: "Good, I'll take it." }
    ]
  },
  {
    id: 15,
    title: "Returning an Item",
    titleDe: "Etwas zurückgeben",
    theme: "shopping",
    lines: [
      { speaker: "Kundin", de: "Ich möchte dieses Kleid zurückgeben.", en: "I would like to return this dress." },
      { speaker: "Verkäuferin", de: "Was ist das Problem?", en: "What is the problem?" },
      { speaker: "Kundin", de: "Es ist zu groß.", en: "It is too big." },
      { speaker: "Verkäuferin", de: "Haben Sie den Kassenbon?", en: "Do you have the receipt?" },
      { speaker: "Kundin", de: "Ja, hier bitte.", en: "Yes, here you go." },
      { speaker: "Verkäuferin", de: "Kein Problem. Möchten Sie eine andere Größe?", en: "No problem. Would you like a different size?" }
    ]
  },
  {
    id: 16,
    title: "At the Shoe Store",
    titleDe: "Im Schuhgeschäft",
    theme: "shopping",
    lines: [
      { speaker: "Verkäufer", de: "Welche Größe brauchen Sie?", en: "What size do you need?" },
      { speaker: "Kunde", de: "Größe 43. Haben Sie diese Schuhe in Braun?", en: "Size 43. Do you have these shoes in brown?" },
      { speaker: "Verkäufer", de: "Ja, einen Moment bitte.", en: "Yes, one moment please." },
      { speaker: "Kunde", de: "Die passen gut. Was kosten sie?", en: "They fit well. How much are they?" },
      { speaker: "Verkäufer", de: "Neunundfünfzig Euro.", en: "Fifty-nine euros." }
    ]
  },
  {
    id: 17,
    title: "Paying at the Checkout",
    titleDe: "An der Kasse bezahlen",
    theme: "shopping",
    lines: [
      { speaker: "Kassiererin", de: "Das macht fünfzehn Euro dreißig.", en: "That will be fifteen euros thirty." },
      { speaker: "Kunde", de: "Kann ich mit Karte bezahlen?", en: "Can I pay by card?" },
      { speaker: "Kassiererin", de: "Ja, natürlich. Bitte hier.", en: "Yes, of course. Please here." },
      { speaker: "Kunde", de: "Brauche ich eine Tüte?", en: "Do I need a bag?" },
      { speaker: "Kassiererin", de: "Eine Tüte kostet zwanzig Cent.", en: "A bag costs twenty cents." },
      { speaker: "Kunde", de: "Nein, danke. Ich habe eine.", en: "No, thanks. I have one." }
    ]
  },

  // ===== TRAVEL (8) =====
  {
    id: 18,
    title: "At the Train Station",
    titleDe: "Am Bahnhof",
    theme: "travel",
    lines: [
      { speaker: "Reisender", de: "Wann fährt der nächste Zug nach Berlin?", en: "When does the next train to Berlin leave?" },
      { speaker: "Mitarbeiter", de: "Um vierzehn Uhr dreißig, Gleis fünf.", en: "At two thirty, platform five." },
      { speaker: "Reisender", de: "Eine Fahrkarte, bitte. Hin und zurück.", en: "One ticket, please. Round trip." },
      { speaker: "Mitarbeiter", de: "Das macht fünfundvierzig Euro.", en: "That will be forty-five euros." }
    ]
  },
  {
    id: 19,
    title: "At the Airport",
    titleDe: "Am Flughafen",
    theme: "travel",
    lines: [
      { speaker: "Mitarbeiterin", de: "Ihren Pass und Ihre Bordkarte, bitte.", en: "Your passport and boarding pass, please." },
      { speaker: "Reisender", de: "Hier, bitte.", en: "Here you go." },
      { speaker: "Mitarbeiterin", de: "Haben Sie nur Handgepäck?", en: "Do you only have carry-on luggage?" },
      { speaker: "Reisender", de: "Nein, ich habe auch einen Koffer.", en: "No, I also have a suitcase." },
      { speaker: "Mitarbeiterin", de: "Bitte stellen Sie ihn auf das Band.", en: "Please put it on the belt." }
    ]
  },
  {
    id: 20,
    title: "Asking for Directions",
    titleDe: "Nach dem Weg fragen",
    theme: "travel",
    lines: [
      { speaker: "Tourist", de: "Entschuldigung, wie komme ich zum Bahnhof?", en: "Excuse me, how do I get to the train station?" },
      { speaker: "Passant", de: "Gehen Sie geradeaus und dann links.", en: "Go straight ahead and then left." },
      { speaker: "Tourist", de: "Ist es weit?", en: "Is it far?" },
      { speaker: "Passant", de: "Nein, ungefähr fünf Minuten zu Fuß.", en: "No, about five minutes on foot." },
      { speaker: "Tourist", de: "Vielen Dank!", en: "Thank you very much!" }
    ]
  },
  {
    id: 21,
    title: "Hotel Check-in",
    titleDe: "Im Hotel einchecken",
    theme: "travel",
    lines: [
      { speaker: "Gast", de: "Guten Abend. Ich habe ein Zimmer reserviert.", en: "Good evening. I have a room reserved." },
      { speaker: "Rezeptionist", de: "Wie ist Ihr Name, bitte?", en: "What is your name, please?" },
      { speaker: "Gast", de: "Müller. Anna Müller.", en: "Müller. Anna Müller." },
      { speaker: "Rezeptionist", de: "Ja, ein Einzelzimmer für drei Nächte. Hier ist Ihr Schlüssel.", en: "Yes, a single room for three nights. Here is your key." },
      { speaker: "Gast", de: "Wann gibt es Frühstück?", en: "When is breakfast?" },
      { speaker: "Rezeptionist", de: "Von sieben bis zehn Uhr im Erdgeschoss.", en: "From seven to ten o'clock on the ground floor." }
    ]
  },
  {
    id: 22,
    title: "Taking a Taxi",
    titleDe: "Ein Taxi nehmen",
    theme: "travel",
    lines: [
      { speaker: "Fahrgast", de: "Zum Hauptbahnhof, bitte.", en: "To the main train station, please." },
      { speaker: "Taxifahrer", de: "In Ordnung. Das dauert ungefähr zwanzig Minuten.", en: "All right. That will take about twenty minutes." },
      { speaker: "Fahrgast", de: "Was kostet das?", en: "How much does it cost?" },
      { speaker: "Taxifahrer", de: "Ungefähr fünfzehn Euro.", en: "About fifteen euros." },
      { speaker: "Fahrgast", de: "Können Sie hier bitte anhalten?", en: "Can you please stop here?" }
    ]
  },
  {
    id: 23,
    title: "On the Bus",
    titleDe: "Im Bus",
    theme: "travel",
    lines: [
      { speaker: "Fahrgast", de: "Entschuldigung, fährt dieser Bus zum Stadtzentrum?", en: "Excuse me, does this bus go to the city center?" },
      { speaker: "Busfahrer", de: "Ja, steigen Sie ein.", en: "Yes, get on." },
      { speaker: "Fahrgast", de: "Wo muss ich aussteigen?", en: "Where do I have to get off?" },
      { speaker: "Busfahrer", de: "An der fünften Haltestelle. Ich sage Ihnen Bescheid.", en: "At the fifth stop. I'll let you know." },
      { speaker: "Fahrgast", de: "Danke schön!", en: "Thank you!" }
    ]
  },
  {
    id: 24,
    title: "Renting a Bicycle",
    titleDe: "Ein Fahrrad mieten",
    theme: "travel",
    lines: [
      { speaker: "Kunde", de: "Ich möchte ein Fahrrad mieten.", en: "I would like to rent a bicycle." },
      { speaker: "Mitarbeiter", de: "Für wie lange?", en: "For how long?" },
      { speaker: "Kunde", de: "Für einen Tag.", en: "For one day." },
      { speaker: "Mitarbeiter", de: "Das kostet zehn Euro pro Tag. Brauchen Sie einen Helm?", en: "That costs ten euros per day. Do you need a helmet?" },
      { speaker: "Kunde", de: "Ja, bitte.", en: "Yes, please." }
    ]
  },
  {
    id: 25,
    title: "At the Tourist Information",
    titleDe: "Bei der Touristeninformation",
    theme: "travel",
    lines: [
      { speaker: "Tourist", de: "Haben Sie einen Stadtplan?", en: "Do you have a city map?" },
      { speaker: "Mitarbeiterin", de: "Ja, hier bitte. Er ist kostenlos.", en: "Yes, here you go. It's free." },
      { speaker: "Tourist", de: "Was kann man hier sehen?", en: "What can you see here?" },
      { speaker: "Mitarbeiterin", de: "Das Museum und die Kirche sind sehr schön.", en: "The museum and the church are very nice." },
      { speaker: "Tourist", de: "Wann öffnet das Museum?", en: "When does the museum open?" },
      { speaker: "Mitarbeiterin", de: "Um zehn Uhr.", en: "At ten o'clock." }
    ]
  },

  // ===== SOCIAL (8) =====
  {
    id: 26,
    title: "Meeting Someone New",
    titleDe: "Jemanden kennenlernen",
    theme: "social",
    lines: [
      { speaker: "Lena", de: "Hallo! Ich bin Lena. Wie heißt du?", en: "Hello! I'm Lena. What's your name?" },
      { speaker: "Carlos", de: "Hallo, ich heiße Carlos. Ich komme aus Spanien.", en: "Hello, my name is Carlos. I come from Spain." },
      { speaker: "Lena", de: "Oh, cool! Seit wann bist du in Deutschland?", en: "Oh, cool! Since when have you been in Germany?" },
      { speaker: "Carlos", de: "Seit drei Monaten. Ich lerne Deutsch.", en: "For three months. I'm learning German." },
      { speaker: "Lena", de: "Dein Deutsch ist schon gut!", en: "Your German is already good!" }
    ]
  },
  {
    id: 27,
    title: "At a Birthday Party",
    titleDe: "Auf einer Geburtstagsfeier",
    theme: "social",
    lines: [
      { speaker: "Gast", de: "Herzlichen Glückwunsch zum Geburtstag!", en: "Happy birthday!" },
      { speaker: "Sara", de: "Danke! Schön, dass du da bist!", en: "Thanks! Nice that you're here!" },
      { speaker: "Gast", de: "Hier, ein Geschenk für dich.", en: "Here, a present for you." },
      { speaker: "Sara", de: "Oh, danke! Soll ich es jetzt öffnen?", en: "Oh, thanks! Should I open it now?" },
      { speaker: "Gast", de: "Ja, bitte!", en: "Yes, please!" },
      { speaker: "Sara", de: "Ein Buch! Das ist toll! Danke!", en: "A book! That's great! Thanks!" }
    ]
  },
  {
    id: 28,
    title: "A Phone Call",
    titleDe: "Ein Telefonat",
    theme: "social",
    lines: [
      { speaker: "Nina", de: "Hallo? Hier ist Nina.", en: "Hello? This is Nina." },
      { speaker: "Sophie", de: "Hallo Nina! Hier ist Sophie. Wie geht es dir?", en: "Hello Nina! This is Sophie. How are you?" },
      { speaker: "Nina", de: "Gut, danke! Und dir?", en: "Good, thanks! And you?" },
      { speaker: "Sophie", de: "Auch gut. Hast du morgen Zeit?", en: "Also good. Do you have time tomorrow?" },
      { speaker: "Nina", de: "Ja, am Nachmittag. Was möchtest du machen?", en: "Yes, in the afternoon. What would you like to do?" },
      { speaker: "Sophie", de: "Vielleicht ins Kino gehen?", en: "Maybe go to the cinema?" }
    ]
  },
  {
    id: 29,
    title: "Making Plans",
    titleDe: "Etwas planen",
    theme: "social",
    lines: [
      { speaker: "Felix", de: "Was machst du am Wochenende?", en: "What are you doing this weekend?" },
      { speaker: "Julia", de: "Ich habe noch keine Pläne. Und du?", en: "I don't have plans yet. And you?" },
      { speaker: "Felix", de: "Wollen wir zusammen grillen?", en: "Do we want to have a barbecue together?" },
      { speaker: "Julia", de: "Ja, gerne! Wann und wo?", en: "Yes, gladly! When and where?" },
      { speaker: "Felix", de: "Am Samstag, bei mir. Um fünf Uhr.", en: "On Saturday, at my place. At five o'clock." },
      { speaker: "Julia", de: "Super! Ich bringe einen Salat mit.", en: "Great! I'll bring a salad." }
    ]
  },
  {
    id: 30,
    title: "At a Cafe",
    titleDe: "Im Café",
    theme: "social",
    lines: [
      { speaker: "Kellner", de: "Was möchten Sie trinken?", en: "What would you like to drink?" },
      { speaker: "Gast", de: "Einen Cappuccino, bitte.", en: "A cappuccino, please." },
      { speaker: "Kellner", de: "Möchten Sie auch etwas essen?", en: "Would you also like something to eat?" },
      { speaker: "Gast", de: "Ja, ein Stück Kuchen bitte.", en: "Yes, a piece of cake please." },
      { speaker: "Kellner", de: "Gerne. Kommt sofort.", en: "With pleasure. Coming right away." }
    ]
  },
  {
    id: 31,
    title: "Inviting Friends for Dinner",
    titleDe: "Freunde zum Essen einladen",
    theme: "social",
    lines: [
      { speaker: "David", de: "Hast du am Freitag Abend Zeit?", en: "Do you have time on Friday evening?" },
      { speaker: "Luisa", de: "Ja, warum?", en: "Yes, why?" },
      { speaker: "David", de: "Ich möchte kochen. Kommst du zum Essen?", en: "I want to cook. Would you come for dinner?" },
      { speaker: "Luisa", de: "Ja, sehr gerne! Was kochst du?", en: "Yes, very gladly! What are you cooking?" },
      { speaker: "David", de: "Ich mache Pizza.", en: "I'm making pizza." },
      { speaker: "Luisa", de: "Lecker! Ich freue mich!", en: "Yummy! I'm looking forward to it!" }
    ]
  },
  {
    id: 32,
    title: "At a Restaurant",
    titleDe: "Im Restaurant",
    theme: "social",
    lines: [
      { speaker: "Kellnerin", de: "Haben Sie schon gewählt?", en: "Have you already chosen?" },
      { speaker: "Gast", de: "Ja, ich nehme die Suppe und den Fisch.", en: "Yes, I'll have the soup and the fish." },
      { speaker: "Kellnerin", de: "Und was möchten Sie trinken?", en: "And what would you like to drink?" },
      { speaker: "Gast", de: "Ein Wasser, bitte.", en: "A water, please." },
      { speaker: "Kellnerin", de: "Mit oder ohne Kohlensäure?", en: "Sparkling or still?" },
      { speaker: "Gast", de: "Ohne, bitte.", en: "Still, please." }
    ]
  },
  {
    id: 33,
    title: "Talking About Hobbies",
    titleDe: "Über Hobbys sprechen",
    theme: "social",
    lines: [
      { speaker: "Maria", de: "Was sind deine Hobbys?", en: "What are your hobbies?" },
      { speaker: "Tim", de: "Ich spiele gern Fußball und lese Bücher.", en: "I like to play soccer and read books." },
      { speaker: "Maria", de: "Ich auch! Welche Bücher magst du?", en: "Me too! Which books do you like?" },
      { speaker: "Tim", de: "Ich mag Krimis. Und du?", en: "I like crime novels. And you?" },
      { speaker: "Maria", de: "Ich lese gern Romane.", en: "I like to read novels." }
    ]
  },

  // ===== WORK & SCHOOL (8) =====
  {
    id: 34,
    title: "First Day at Work",
    titleDe: "Der erste Arbeitstag",
    theme: "work_school",
    lines: [
      { speaker: "Chef", de: "Willkommen! Ich bin Herr Weber, Ihr Chef.", en: "Welcome! I'm Mr. Weber, your boss." },
      { speaker: "Neue Mitarbeiterin", de: "Freut mich! Ich bin Frau Schmidt.", en: "Nice to meet you! I'm Mrs. Schmidt." },
      { speaker: "Chef", de: "Ihr Büro ist hier. Der Computer ist schon da.", en: "Your office is here. The computer is already there." },
      { speaker: "Neue Mitarbeiterin", de: "Danke! Wann beginnt die Arbeitszeit?", en: "Thanks! When does work time start?" },
      { speaker: "Chef", de: "Um acht Uhr. Die Mittagspause ist von zwölf bis eins.", en: "At eight o'clock. The lunch break is from twelve to one." }
    ]
  },
  {
    id: 35,
    title: "In the German Class",
    titleDe: "Im Deutschkurs",
    theme: "work_school",
    lines: [
      { speaker: "Lehrerin", de: "Guten Morgen! Bitte öffnen Sie das Buch auf Seite 24.", en: "Good morning! Please open the book to page 24." },
      { speaker: "Schüler", de: "Entschuldigung, können Sie das wiederholen?", en: "Excuse me, can you repeat that?" },
      { speaker: "Lehrerin", de: "Natürlich. Seite vierundzwanzig.", en: "Of course. Page twenty-four." },
      { speaker: "Schüler", de: "Danke. Ich verstehe.", en: "Thanks. I understand." }
    ]
  },
  {
    id: 36,
    title: "Talking to the Teacher",
    titleDe: "Mit der Lehrerin sprechen",
    theme: "work_school",
    lines: [
      { speaker: "Schülerin", de: "Frau Bauer, ich habe eine Frage.", en: "Mrs. Bauer, I have a question." },
      { speaker: "Lehrerin", de: "Ja, bitte?", en: "Yes, please?" },
      { speaker: "Schülerin", de: "Ich verstehe diese Übung nicht.", en: "I don't understand this exercise." },
      { speaker: "Lehrerin", de: "Kein Problem. Ich erkläre es noch einmal.", en: "No problem. I'll explain it once more." },
      { speaker: "Schülerin", de: "Danke, jetzt verstehe ich es!", en: "Thanks, now I understand it!" }
    ]
  },
  {
    id: 37,
    title: "Job Interview",
    titleDe: "Das Vorstellungsgespräch",
    theme: "work_school",
    lines: [
      { speaker: "Chefin", de: "Erzählen Sie etwas über sich.", en: "Tell us something about yourself." },
      { speaker: "Bewerber", de: "Ich bin dreißig Jahre alt und komme aus der Türkei.", en: "I am thirty years old and come from Turkey." },
      { speaker: "Chefin", de: "Welche Sprachen sprechen Sie?", en: "Which languages do you speak?" },
      { speaker: "Bewerber", de: "Türkisch, Englisch und ein bisschen Deutsch.", en: "Turkish, English and a little German." },
      { speaker: "Chefin", de: "Wann können Sie anfangen?", en: "When can you start?" },
      { speaker: "Bewerber", de: "Ab nächsten Monat.", en: "From next month." }
    ]
  },
  {
    id: 38,
    title: "Calling in Sick",
    titleDe: "Sich krankmelden",
    theme: "work_school",
    lines: [
      { speaker: "Mitarbeiter", de: "Guten Morgen, Herr Weber. Hier ist Thomas.", en: "Good morning, Mr. Weber. This is Thomas." },
      { speaker: "Chef", de: "Guten Morgen, Thomas. Was gibt es?", en: "Good morning, Thomas. What is it?" },
      { speaker: "Mitarbeiter", de: "Ich bin krank. Ich kann heute nicht kommen.", en: "I'm sick. I can't come today." },
      { speaker: "Chef", de: "Gute Besserung! Gehen Sie zum Arzt?", en: "Get well soon! Are you going to the doctor?" },
      { speaker: "Mitarbeiter", de: "Ja, ich habe um zehn einen Termin.", en: "Yes, I have an appointment at ten." }
    ]
  },
  {
    id: 39,
    title: "In the School Cafeteria",
    titleDe: "In der Mensa",
    theme: "work_school",
    lines: [
      { speaker: "Studentin", de: "Was gibt es heute zu essen?", en: "What is there to eat today?" },
      { speaker: "Mitarbeiter", de: "Heute haben wir Schnitzel oder Gemüsesuppe.", en: "Today we have schnitzel or vegetable soup." },
      { speaker: "Studentin", de: "Ich nehme die Suppe, bitte.", en: "I'll have the soup, please." },
      { speaker: "Mitarbeiter", de: "Möchten Sie auch Brot dazu?", en: "Would you also like bread with it?" },
      { speaker: "Studentin", de: "Ja, bitte.", en: "Yes, please." }
    ]
  },
  {
    id: 40,
    title: "Asking About Homework",
    titleDe: "Nach den Hausaufgaben fragen",
    theme: "work_school",
    lines: [
      { speaker: "Schüler", de: "Was sind die Hausaufgaben für morgen?", en: "What is the homework for tomorrow?" },
      { speaker: "Mitschülerin", de: "Wir müssen die Übungen auf Seite 30 machen.", en: "We have to do the exercises on page 30." },
      { speaker: "Schüler", de: "Alles? Das ist viel!", en: "All of it? That's a lot!" },
      { speaker: "Mitschülerin", de: "Nein, nur Übung eins bis drei.", en: "No, only exercises one to three." },
      { speaker: "Schüler", de: "Okay, danke!", en: "Okay, thanks!" }
    ]
  },
  {
    id: 41,
    title: "Meeting a Colleague",
    titleDe: "Eine Kollegin treffen",
    theme: "work_school",
    lines: [
      { speaker: "Klaus", de: "Hallo, ich bin Klaus. Ich bin neu hier.", en: "Hello, I'm Klaus. I'm new here." },
      { speaker: "Petra", de: "Hallo Klaus! Ich bin Petra. Willkommen!", en: "Hello Klaus! I'm Petra. Welcome!" },
      { speaker: "Klaus", de: "Danke! In welcher Abteilung arbeitest du?", en: "Thanks! In which department do you work?" },
      { speaker: "Petra", de: "Im Marketing. Und du?", en: "In marketing. And you?" },
      { speaker: "Klaus", de: "Ich bin im Verkauf.", en: "I'm in sales." },
      { speaker: "Petra", de: "Schön! Wenn du Fragen hast, frag mich einfach.", en: "Nice! If you have questions, just ask me." }
    ]
  },

  // ===== HEALTH (4) =====
  {
    id: 42,
    title: "At the Doctor",
    titleDe: "Beim Arzt",
    theme: "health",
    lines: [
      { speaker: "Arzt", de: "Was fehlt Ihnen?", en: "What's wrong?" },
      { speaker: "Patient", de: "Ich habe Kopfschmerzen und Fieber.", en: "I have a headache and fever." },
      { speaker: "Arzt", de: "Seit wann?", en: "Since when?" },
      { speaker: "Patient", de: "Seit zwei Tagen.", en: "For two days." },
      { speaker: "Arzt", de: "Ich schreibe Ihnen ein Rezept. Nehmen Sie die Tabletten dreimal am Tag.", en: "I'll write you a prescription. Take the tablets three times a day." },
      { speaker: "Patient", de: "Danke, Herr Doktor.", en: "Thank you, Doctor." }
    ]
  },
  {
    id: 43,
    title: "At the Pharmacy",
    titleDe: "In der Apotheke",
    theme: "health",
    lines: [
      { speaker: "Kunde", de: "Guten Tag. Ich habe ein Rezept.", en: "Good day. I have a prescription." },
      { speaker: "Apothekerin", de: "Ja, einen Moment bitte. Hier ist Ihr Medikament.", en: "Yes, one moment please. Here is your medication." },
      { speaker: "Kunde", de: "Wie oft muss ich es nehmen?", en: "How often do I have to take it?" },
      { speaker: "Apothekerin", de: "Morgens und abends, nach dem Essen.", en: "Morning and evening, after eating." },
      { speaker: "Kunde", de: "Vielen Dank!", en: "Thank you very much!" }
    ]
  },
  {
    id: 44,
    title: "Feeling Sick",
    titleDe: "Sich krank fühlen",
    theme: "health",
    lines: [
      { speaker: "Freund", de: "Du siehst nicht gut aus. Was ist los?", en: "You don't look well. What's wrong?" },
      { speaker: "Mia", de: "Mir ist schlecht und ich habe Halsschmerzen.", en: "I feel nauseous and I have a sore throat." },
      { speaker: "Freund", de: "Du solltest zum Arzt gehen.", en: "You should go to the doctor." },
      { speaker: "Mia", de: "Ja, du hast recht. Ich rufe dort an.", en: "Yes, you're right. I'll call there." },
      { speaker: "Freund", de: "Soll ich dich hinfahren?", en: "Should I drive you there?" },
      { speaker: "Mia", de: "Ja, das wäre nett. Danke!", en: "Yes, that would be nice. Thanks!" }
    ]
  },
  {
    id: 45,
    title: "An Emergency",
    titleDe: "Ein Notfall",
    theme: "health",
    lines: [
      { speaker: "Anrufer", de: "Hallo! Ich brauche einen Krankenwagen!", en: "Hello! I need an ambulance!" },
      { speaker: "Leitstelle", de: "Was ist passiert?", en: "What happened?" },
      { speaker: "Anrufer", de: "Ein Mann ist auf der Straße gefallen.", en: "A man fell on the street." },
      { speaker: "Leitstelle", de: "Wo sind Sie?", en: "Where are you?" },
      { speaker: "Anrufer", de: "In der Berliner Straße, Nummer zwölf.", en: "On Berliner Strasse, number twelve." },
      { speaker: "Leitstelle", de: "Wir kommen sofort. Bleiben Sie dort!", en: "We're coming right away. Stay there!" }
    ]
  },

  // ===== OFFICIAL (4) =====
  {
    id: 46,
    title: "At the Post Office",
    titleDe: "Bei der Post",
    theme: "official",
    lines: [
      { speaker: "Kunde", de: "Ich möchte dieses Paket nach Frankreich schicken.", en: "I would like to send this package to France." },
      { speaker: "Mitarbeiterin", de: "Bitte stellen Sie es auf die Waage.", en: "Please put it on the scale." },
      { speaker: "Kunde", de: "Was kostet das?", en: "How much does it cost?" },
      { speaker: "Mitarbeiterin", de: "Acht Euro fünfzig. Es kommt in drei bis fünf Tagen an.", en: "Eight euros fifty. It will arrive in three to five days." },
      { speaker: "Kunde", de: "Gut, ich bezahle mit Karte.", en: "Good, I'll pay by card." }
    ]
  },
  {
    id: 47,
    title: "At the Bank",
    titleDe: "Bei der Bank",
    theme: "official",
    lines: [
      { speaker: "Kundin", de: "Ich möchte ein Konto eröffnen.", en: "I would like to open an account." },
      { speaker: "Berater", de: "Haben Sie Ihren Ausweis dabei?", en: "Do you have your ID with you?" },
      { speaker: "Kundin", de: "Ja, hier ist mein Reisepass.", en: "Yes, here is my passport." },
      { speaker: "Berater", de: "Und Ihre Meldebescheinigung, bitte.", en: "And your registration certificate, please." },
      { speaker: "Kundin", de: "Hier, bitte.", en: "Here you go." },
      { speaker: "Berater", de: "Danke. Bitte füllen Sie dieses Formular aus.", en: "Thanks. Please fill out this form." }
    ]
  },
  {
    id: 48,
    title: "At the Registration Office",
    titleDe: "Im Bürgeramt",
    theme: "official",
    lines: [
      { speaker: "Mitarbeiter", de: "Haben Sie einen Termin?", en: "Do you have an appointment?" },
      { speaker: "Bürgerin", de: "Ja, um elf Uhr. Mein Name ist Kim.", en: "Yes, at eleven o'clock. My name is Kim." },
      { speaker: "Mitarbeiter", de: "Was möchten Sie machen?", en: "What would you like to do?" },
      { speaker: "Bürgerin", de: "Ich möchte mich anmelden. Ich bin neu in der Stadt.", en: "I would like to register. I'm new in the city." },
      { speaker: "Mitarbeiter", de: "Bitte bringen Sie Ihren Mietvertrag und Ihren Pass mit.", en: "Please bring your rental contract and your passport." },
      { speaker: "Bürgerin", de: "Ich habe alles dabei.", en: "I have everything with me." }
    ]
  },
  {
    id: 49,
    title: "Renting an Apartment",
    titleDe: "Eine Wohnung mieten",
    theme: "official",
    lines: [
      { speaker: "Mieterin", de: "Ist die Wohnung noch frei?", en: "Is the apartment still available?" },
      { speaker: "Vermieter", de: "Ja. Sie hat zwei Zimmer, eine Küche und ein Bad.", en: "Yes. It has two rooms, a kitchen and a bathroom." },
      { speaker: "Mieterin", de: "Wie hoch ist die Miete?", en: "How much is the rent?" },
      { speaker: "Vermieter", de: "Fünfhundert Euro warm.", en: "Five hundred euros including utilities." },
      { speaker: "Mieterin", de: "Kann ich die Wohnung sehen?", en: "Can I see the apartment?" },
      { speaker: "Vermieter", de: "Ja, morgen um drei Uhr. Passt das?", en: "Yes, tomorrow at three o'clock. Does that work?" }
    ]
  }
];
