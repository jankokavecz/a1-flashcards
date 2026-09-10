// B1 scenes content (dialogues for B1-level learners) — ES5 only: var declarations, no arrow functions, no const/let, no template literals.

var B1_SCENARIO_THEMES = {
  opinions_debate: { name: "Opinions & Debate", emoji: "💬" },
  environment_society: { name: "Environment & Society", emoji: "🌍" },
  technology_media: { name: "Technology & Media", emoji: "📱" },
  complaints_problems: { name: "Complaints & Problems", emoji: "😤" },
  work_career: { name: "Work & Career", emoji: "💼" },
  planning_events: { name: "Planning Events", emoji: "📅" },
  formal_situations: { name: "Formal Situations", emoji: "🏛️" },
  culture_leisure: { name: "Culture & Leisure", emoji: "🎭" }
};

var B1_SCENARIOS = [
  // ===== OPINIONS & DEBATE (6) =====
  {
    id: 0,
    title: "Meat or Vegetarian?",
    titleDe: "Fleisch oder vegetarisch?",
    theme: "opinions_debate",
    lines: [
      { speaker: "Julia", de: "Ich finde, dass wir alle weniger Fleisch essen sollten.", en: "I think we should all eat less meat." },
      { speaker: "Ben", de: "Das sehe ich anders. Ich esse gern Fleisch, obwohl ich weiß, dass es nicht gut für die Umwelt ist.", en: "I see it differently. I like eating meat, although I know it is not good for the environment." },
      { speaker: "Julia", de: "Aber es gibt so viele leckere vegetarische Gerichte!", en: "But there are so many delicious vegetarian dishes!" },
      { speaker: "Ben", de: "Das stimmt, aber ich glaube nicht, dass ich ganz auf Fleisch verzichten kann.", en: "That is true, but I do not think I can give up meat completely." },
      { speaker: "Julia", de: "Man muss ja nicht sofort aufhören. Man könnte zum Beispiel nur am Wochenende Fleisch essen.", en: "You do not have to stop right away. You could, for example, only eat meat on weekends." },
      { speaker: "Ben", de: "Das klingt vernünftig. Vielleicht probiere ich das mal aus.", en: "That sounds reasonable. Maybe I will try that." },
      { speaker: "Julia", de: "Super! Ich schicke dir ein paar vegetarische Rezepte.", en: "Great! I will send you a few vegetarian recipes." },
      { speaker: "Ben", de: "Danke, das wäre nett.", en: "Thanks, that would be nice." }
    ]
  },
  {
    id: 1,
    title: "Social Media: Good or Bad?",
    titleDe: "Soziale Medien: gut oder schlecht?",
    theme: "opinions_debate",
    lines: [
      { speaker: "Nora", de: "Ich finde, dass soziale Medien uns eher schaden als nützen.", en: "I think social media does us more harm than good." },
      { speaker: "Felix", de: "Wie kommst du darauf? Ich finde sie sehr praktisch, um mit Freunden in Kontakt zu bleiben.", en: "What makes you think that? I find them very useful for staying in touch with friends." },
      { speaker: "Nora", de: "Klar, aber viele Leute vergleichen sich ständig mit anderen und fühlen sich deshalb schlecht.", en: "Sure, but many people constantly compare themselves to others and feel bad because of it." },
      { speaker: "Felix", de: "Das kann sein, aber das liegt doch an der Person, nicht an der Technologie selbst.", en: "That may be, but that depends on the person, not on the technology itself." },
      { speaker: "Nora", de: "Trotzdem denke ich, dass man weniger Zeit am Handy verbringen sollte.", en: "Still, I think one should spend less time on the phone." },
      { speaker: "Felix", de: "Da hast du wahrscheinlich recht. Ich schaue auch zu oft auf mein Handy.", en: "You are probably right about that. I also look at my phone too often." },
      { speaker: "Nora", de: "Vielleicht sollten wir beide einen Tag pro Woche ohne Handy verbringen.", en: "Maybe we should both spend one day a week without a phone." },
      { speaker: "Felix", de: "Einverstanden, aber nur wenn wir uns dann persönlich treffen!", en: "Agreed, but only if we meet in person then!" }
    ]
  },
  {
    id: 2,
    title: "Home Office or Office?",
    titleDe: "Homeoffice oder Büro?",
    theme: "opinions_debate",
    lines: [
      { speaker: "Herr Vogel", de: "Ich arbeite viel lieber im Homeoffice als im Büro.", en: "I much prefer working from home than in the office." },
      { speaker: "Frau Klein", de: "Wirklich? Ich vermisse den Kontakt zu den Kollegen, wenn ich zu Hause arbeite.", en: "Really? I miss contact with colleagues when I work at home." },
      { speaker: "Herr Vogel", de: "Das verstehe ich, aber ich bin zu Hause viel konzentrierter, weil es ruhiger ist.", en: "I understand that, but I am much more focused at home because it is quieter." },
      { speaker: "Frau Klein", de: "Andererseits verliert man vielleicht wichtige Informationen, die man nur im Büro erfährt.", en: "On the other hand, you might miss important information that you only learn about in the office." },
      { speaker: "Herr Vogel", de: "Deshalb finde ich ein Modell mit zwei Tagen im Büro und drei Tagen zu Hause am besten.", en: "That is why I think a model with two days in the office and three days at home is best." },
      { speaker: "Frau Klein", de: "Das klingt nach einem guten Kompromiss.", en: "That sounds like a good compromise." },
      { speaker: "Herr Vogel", de: "Vielleicht sollten wir das dem Chef vorschlagen.", en: "Maybe we should suggest that to the boss." },
      { speaker: "Frau Klein", de: "Gute Idee, das mache ich in der nächsten Teamsitzung.", en: "Good idea, I will do that at the next team meeting." }
    ]
  },
  {
    id: 3,
    title: "Do You Need a University Degree?",
    titleDe: "Braucht man ein Studium?",
    theme: "opinions_debate",
    lines: [
      { speaker: "Leon", de: "Papa, ich glaube nicht, dass ich studieren möchte.", en: "Dad, I do not think I want to go to university." },
      { speaker: "Papa", de: "Aber ohne Studium hast du es später vielleicht schwerer, einen guten Job zu finden.", en: "But without a degree, you might have a harder time finding a good job later." },
      { speaker: "Leon", de: "Das stimmt nicht immer. Viele erfolgreiche Leute haben eine Ausbildung gemacht statt zu studieren.", en: "That is not always true. Many successful people did an apprenticeship instead of studying." },
      { speaker: "Papa", de: "Das ist richtig, aber eine Ausbildung passt nicht zu jedem Beruf.", en: "That is right, but an apprenticeship does not suit every profession." },
      { speaker: "Leon", de: "Ich interessiere mich für Handwerk. Deshalb möchte ich eine Ausbildung als Elektriker machen.", en: "I am interested in trade work. That is why I want to do an apprenticeship as an electrician." },
      { speaker: "Papa", de: "Wenn du das wirklich willst, unterstütze ich dich natürlich.", en: "If you really want that, I will of course support you." },
      { speaker: "Leon", de: "Danke, Papa. Ich wusste, dass du das verstehen würdest.", en: "Thanks, Dad. I knew you would understand that." }
    ]
  },
  {
    id: 4,
    title: "City or Countryside?",
    titleDe: "Stadt oder Land?",
    theme: "opinions_debate",
    lines: [
      { speaker: "Sina", de: "Ich könnte nie auf dem Land leben, weil es mir dort zu langweilig wäre.", en: "I could never live in the countryside because it would be too boring for me there." },
      { speaker: "Robert", de: "Das finde ich nicht. Auf dem Land ist es ruhiger und die Luft ist besser als in der Stadt.", en: "I do not think so. In the countryside it is quieter and the air is better than in the city." },
      { speaker: "Sina", de: "Aber in der Stadt gibt es mehr Kultur, mehr Restaurants und bessere öffentliche Verkehrsmittel.", en: "But in the city there is more culture, more restaurants and better public transport." },
      { speaker: "Robert", de: "Dafür sind die Mieten auf dem Land viel günstiger als in der Stadt.", en: "On the other hand, rents in the countryside are much cheaper than in the city." },
      { speaker: "Sina", de: "Das ist ein guter Punkt. Trotzdem würde ich die Nähe zu allem vermissen.", en: "That is a good point. Still, I would miss having everything nearby." },
      { speaker: "Robert", de: "Vielleicht ist ein Vorort ein guter Kompromiss zwischen beiden.", en: "Maybe a suburb is a good compromise between the two." },
      { speaker: "Sina", de: "Ja, das könnte tatsächlich passen.", en: "Yes, that could actually work." }
    ]
  },
  {
    id: 5,
    title: "Phone Ban at School?",
    titleDe: "Handyverbot in der Schule?",
    theme: "opinions_debate",
    lines: [
      { speaker: "Frau Berger", de: "Ich bin dafür, dass Handys in der Schule komplett verboten werden.", en: "I am in favor of phones being completely banned in school." },
      { speaker: "Herr Otto", de: "Ich bin nicht sicher, ob ein totales Verbot die beste Lösung ist.", en: "I am not sure whether a total ban is the best solution." },
      { speaker: "Frau Berger", de: "Die Schüler lassen sich ständig ablenken, obwohl das Handy im Unterricht verboten ist.", en: "The students constantly get distracted, even though phones are banned during class." },
      { speaker: "Herr Otto", de: "Das stimmt, aber Handys können auch nützlich sein, wenn man sie im Unterricht sinnvoll einsetzt.", en: "That is true, but phones can also be useful when they are used sensibly in class." },
      { speaker: "Frau Berger", de: "Meinst du zum Beispiel, um im Internet zu recherchieren?", en: "Do you mean, for example, to research on the internet?" },
      { speaker: "Herr Otto", de: "Genau. Deshalb finde ich klare Regeln besser als ein komplettes Verbot.", en: "Exactly. That is why I think clear rules are better than a complete ban." },
      { speaker: "Frau Berger", de: "Vielleicht sollten wir das im nächsten Lehrerkollegium diskutieren.", en: "Maybe we should discuss that at the next staff meeting." },
      { speaker: "Herr Otto", de: "Einverstanden.", en: "Agreed." }
    ]
  },

  // ===== ENVIRONMENT & SOCIETY (6) =====
  {
    id: 6,
    title: "Avoiding Plastic",
    titleDe: "Plastik vermeiden",
    theme: "environment_society",
    lines: [
      { speaker: "Mira", de: "Ich versuche, im Alltag weniger Plastik zu benutzen.", en: "I am trying to use less plastic in everyday life." },
      { speaker: "Jonas", de: "Das ist nicht so einfach, weil fast alles im Supermarkt in Plastik verpackt ist.", en: "That is not so easy, because almost everything in the supermarket is wrapped in plastic." },
      { speaker: "Mira", de: "Deshalb kaufe ich Obst und Gemüse jetzt lieber auf dem Wochenmarkt.", en: "That is why I now prefer to buy fruit and vegetables at the weekly market." },
      { speaker: "Jonas", de: "Nimmst du dann deine eigenen Taschen mit?", en: "Do you bring your own bags then?" },
      { speaker: "Mira", de: "Ja, und auch Stoffbeutel für loses Gemüse.", en: "Yes, and also cloth bags for loose vegetables." },
      { speaker: "Jonas", de: "Das ist eine gute Idee. Ich sollte auch damit anfangen, obwohl es am Anfang etwas Aufwand ist.", en: "That is a good idea. I should also start doing that, even though it is a bit of effort at first." },
      { speaker: "Mira", de: "Man gewöhnt sich schnell daran, und man spart sogar Geld.", en: "You get used to it quickly, and you even save money." },
      { speaker: "Jonas", de: "Dann probiere ich es ab nächster Woche aus.", en: "Then I will try it starting next week." }
    ]
  },
  {
    id: 7,
    title: "Climate Change and Everyday Life",
    titleDe: "Klimawandel und der Alltag",
    theme: "environment_society",
    lines: [
      { speaker: "Frau Neumann", de: "Haben Sie gehört, dass der Sommer dieses Jahr wieder so trocken war?", en: "Did you hear that summer was so dry again this year?" },
      { speaker: "Tobias", de: "Ja, das liegt sicher am Klimawandel. Ich mache mir wirklich Sorgen um die Zukunft.", en: "Yes, that is surely because of climate change. I am really worried about the future." },
      { speaker: "Frau Neumann", de: "Ich auch, obwohl ich manchmal denke, dass eine einzelne Person wenig ändern kann.", en: "Me too, although I sometimes think that a single person can change little." },
      { speaker: "Tobias", de: "Das stimmt, aber wenn viele Menschen ihr Verhalten ändern, macht das schon einen Unterschied.", en: "That is true, but if many people change their behavior, that does make a difference." },
      { speaker: "Frau Neumann", de: "Was machen Sie denn konkret, um Energie zu sparen?", en: "So what do you specifically do to save energy?" },
      { speaker: "Tobias", de: "Ich fahre öfter mit dem Fahrrad und dusche kürzer als früher.", en: "I ride my bike more often and shower shorter than before." },
      { speaker: "Frau Neumann", de: "Das mache ich auch. Außerdem habe ich Solarpanele auf dem Dach installieren lassen.", en: "I do that too. I also had solar panels installed on the roof." },
      { speaker: "Tobias", de: "Das ist eine tolle Investition, auch wenn es zuerst teuer war.", en: "That is a great investment, even if it was expensive at first." }
    ]
  },
  {
    id: 8,
    title: "Car or Bicycle?",
    titleDe: "Auto oder Fahrrad?",
    theme: "environment_society",
    lines: [
      { speaker: "Katja", de: "Warum fährst du eigentlich immer mit dem Fahrrad zur Arbeit?", en: "Why do you actually always ride your bike to work?" },
      { speaker: "Simon", de: "Weil es gesünder ist und ich damit auch etwas für die Umwelt tue.", en: "Because it is healthier and I am also doing something for the environment by doing so." },
      { speaker: "Katja", de: "Aber bei Regen muss das doch unangenehm sein, oder?", en: "But in the rain that must be unpleasant, right?" },
      { speaker: "Simon", de: "Manchmal schon, aber ich habe eine gute Regenjacke, und außerdem dauert es nicht viel länger als mit dem Auto.", en: "Sometimes it is, but I have a good rain jacket, and besides, it does not take much longer than by car." },
      { speaker: "Katja", de: "Ich nehme immer das Auto, weil ich es bequemer finde.", en: "I always take the car because I find it more comfortable." },
      { speaker: "Simon", de: "Das verstehe ich, aber mit dem Auto stehst du doch jeden Morgen im Stau.", en: "I understand that, but with the car you are stuck in traffic every morning." },
      { speaker: "Katja", de: "Das ist wahr. Vielleicht sollte ich es wenigstens im Sommer mit dem Fahrrad versuchen.", en: "That is true. Maybe I should at least try it by bike in the summer." },
      { speaker: "Simon", de: "Das würde ich dir wirklich empfehlen!", en: "I would really recommend that to you!" }
    ]
  },
  {
    id: 9,
    title: "Sorting the Trash",
    titleDe: "Mülltrennung",
    theme: "environment_society",
    lines: [
      { speaker: "Frau Sommer", de: "Herr Kaya, ich habe bemerkt, dass Sie den Müll nicht richtig trennen.", en: "Mr. Kaya, I noticed that you are not separating your trash correctly." },
      { speaker: "Herr Kaya", de: "Oh, entschuldigen Sie. Ich bin mir nicht immer sicher, was in welche Tonne gehört.", en: "Oh, sorry. I am not always sure what goes in which bin." },
      { speaker: "Frau Sommer", de: "Papier kommt in die blaue Tonne, und Verpackungen kommen in die gelbe.", en: "Paper goes in the blue bin, and packaging goes in the yellow one." },
      { speaker: "Herr Kaya", de: "Und was ist mit Glas?", en: "And what about glass?" },
      { speaker: "Frau Sommer", de: "Glas bringen Sie bitte zum Glascontainer an der Ecke.", en: "Please take glass to the glass container on the corner." },
      { speaker: "Herr Kaya", de: "Verstanden. Ich wusste nicht, dass es so genaue Regeln gibt.", en: "Understood. I did not know there were such precise rules." },
      { speaker: "Frau Sommer", de: "Das ist wichtig, damit der Müll richtig recycelt werden kann.", en: "That is important so that the trash can be properly recycled." },
      { speaker: "Herr Kaya", de: "Danke für die Erklärung, ich werde ab jetzt besser aufpassen.", en: "Thanks for the explanation, I will pay better attention from now on." }
    ]
  },
  {
    id: 10,
    title: "Fast Fashion",
    titleDe: "Fast Fashion",
    theme: "environment_society",
    lines: [
      { speaker: "Emma", de: "Ich habe gehört, dass Fast Fashion sehr schlecht für die Umwelt ist.", en: "I heard that fast fashion is very bad for the environment." },
      { speaker: "Paula", de: "Ja, aber die Kleidung ist so billig, dass es schwer ist zu widerstehen.", en: "Yes, but the clothes are so cheap that it is hard to resist." },
      { speaker: "Emma", de: "Das verstehe ich, aber die Qualität ist oft schlecht, sodass man die Sachen nach kurzer Zeit wegwirft.", en: "I understand that, but the quality is often bad, so you throw the things away after a short time." },
      { speaker: "Paula", de: "Stimmt. Vielleicht sollte ich lieber weniger, aber dafür bessere Kleidung kaufen.", en: "True. Maybe I should buy less clothing, but better quality instead." },
      { speaker: "Emma", de: "Genau, und Second-Hand-Läden haben mittlerweile auch tolle Sachen.", en: "Exactly, and second-hand shops now also have great things." },
      { speaker: "Paula", de: "Warst du schon mal in dem neuen Vintage-Laden in der Innenstadt?", en: "Have you already been to the new vintage shop downtown?" },
      { speaker: "Emma", de: "Ja, dort habe ich letzte Woche eine wunderschöne Jacke gefunden.", en: "Yes, I found a beautiful jacket there last week." },
      { speaker: "Paula", de: "Dann gehen wir doch am Wochenende zusammen dorthin!", en: "Then let us go there together this weekend!" }
    ]
  },
  {
    id: 11,
    title: "Renewable Energy",
    titleDe: "Erneuerbare Energien",
    theme: "environment_society",
    lines: [
      { speaker: "Opa", de: "Lea, was hältst du von Windkraftanlagen in unserer Gegend?", en: "Lea, what do you think of wind turbines in our area?" },
      { speaker: "Lea", de: "Ich finde sie gut, weil sie sauberen Strom produzieren, ohne die Umwelt zu belasten.", en: "I think they are good because they produce clean electricity without harming the environment." },
      { speaker: "Opa", de: "Manche Nachbarn beschweren sich aber über den Lärm und dass die Anlagen die Landschaft verändern.", en: "But some neighbors complain about the noise and that the turbines change the landscape." },
      { speaker: "Lea", de: "Das kann ich verstehen, aber ich glaube, dass wir langfristig keine andere Wahl haben.", en: "I can understand that, but I believe that in the long run we have no other choice." },
      { speaker: "Opa", de: "Du hast wahrscheinlich recht. Als ich jung war, hat sich niemand für solche Themen interessiert.", en: "You are probably right. When I was young, nobody was interested in such topics." },
      { speaker: "Lea", de: "Heute ist es zum Glück anders, weil die Menschen mehr über den Klimawandel wissen.", en: "Fortunately, today it is different because people know more about climate change." },
      { speaker: "Opa", de: "Ich bin froh, dass eure Generation sich so sehr dafür einsetzt.", en: "I am glad that your generation is so committed to this." }
    ]
  },

  // ===== TECHNOLOGY & MEDIA (6) =====
  {
    id: 12,
    title: "Too Much Screen Time?",
    titleDe: "Zu viel Bildschirmzeit?",
    theme: "technology_media",
    lines: [
      { speaker: "Mutter", de: "Mia, du sitzt schon wieder seit Stunden vor dem Handy.", en: "Mia, you have been sitting in front of your phone for hours again." },
      { speaker: "Mia", de: "Ich weiß, aber ich chatte gerade mit meinen Freundinnen über die Hausaufgaben.", en: "I know, but I am just chatting with my friends about homework." },
      { speaker: "Mutter", de: "Das mag sein, aber ich mache mir Sorgen, dass du zu viel Zeit am Bildschirm verbringst.", en: "That may be, but I am worried that you spend too much time on the screen." },
      { speaker: "Mia", de: "Andere Kinder in meiner Klasse benutzen ihr Handy noch viel mehr als ich.", en: "Other kids in my class use their phone even more than I do." },
      { speaker: "Mutter", de: "Das ist kein gutes Argument. Wie wäre es, wenn du abends eine Stunde ohne Handy liest?", en: "That is not a good argument. How about you read for an hour in the evening without your phone?" },
      { speaker: "Mia", de: "Na gut, ich probiere es aus, obwohl es mir schwerfallen wird.", en: "Fine, I will try it, even though it will be hard for me." },
      { speaker: "Mutter", de: "Danke, das freut mich zu hören.", en: "Thanks, I am glad to hear that." }
    ]
  },
  {
    id: 13,
    title: "Streaming vs Television",
    titleDe: "Streaming vs Fernsehen",
    theme: "technology_media",
    lines: [
      { speaker: "Opa", de: "Früher haben wir immer zusammen ferngesehen, was heute niemand mehr macht.", en: "In the past we always watched TV together, which nobody does anymore today." },
      { speaker: "Finn", de: "Das stimmt, weil wir jetzt jeder unsere eigenen Serien auf dem Handy oder Laptop streamen.", en: "That is true, because now each of us streams our own shows on our phone or laptop." },
      { speaker: "Opa", de: "Vermisst du es nicht, dass die ganze Familie zusammen vor dem Fernseher sitzt?", en: "Don't you miss the whole family sitting together in front of the TV?" },
      { speaker: "Finn", de: "Manchmal schon, aber ich finde es auch praktisch, dass ich schauen kann, wann ich will.", en: "Sometimes I do, but I also find it practical that I can watch whenever I want." },
      { speaker: "Opa", de: "Das verstehe ich. Trotzdem finde ich, dass ein gemeinsamer Filmabend etwas Besonderes ist.", en: "I understand that. Still, I think a shared movie night is something special." },
      { speaker: "Finn", de: "Da hast du recht! Sollen wir heute Abend einen Film zusammen schauen?", en: "You are right about that! Should we watch a movie together tonight?" },
      { speaker: "Opa", de: "Sehr gerne, dann suche ich uns etwas Spannendes aus.", en: "I would love that, then I will pick out something exciting for us." }
    ]
  },
  {
    id: 14,
    title: "Artificial Intelligence in Everyday Life",
    titleDe: "Künstliche Intelligenz im Alltag",
    theme: "technology_media",
    lines: [
      { speaker: "Herr Fischer", de: "Glauben Sie, dass künstliche Intelligenz unsere Arbeit in Zukunft übernehmen wird?", en: "Do you think artificial intelligence will take over our work in the future?" },
      { speaker: "Frau Ahmadi", de: "Teilweise bestimmt, aber ich denke, dass Menschen für kreative Aufgaben trotzdem wichtig bleiben.", en: "Partly for sure, but I think humans will still remain important for creative tasks." },
      { speaker: "Herr Fischer", de: "Ich habe Angst, dass viele Jobs verschwinden werden, wenn die Technik sich so schnell weiterentwickelt.", en: "I am afraid that many jobs will disappear if the technology keeps developing so quickly." },
      { speaker: "Frau Ahmadi", de: "Das ist möglich, aber gleichzeitig entstehen auch neue Berufe, die es vorher nicht gab.", en: "That is possible, but at the same time new jobs are also emerging that did not exist before." },
      { speaker: "Herr Fischer", de: "Das stimmt, meine Nichte arbeitet zum Beispiel als KI-Trainerin, was es vor zehn Jahren noch gar nicht gab.", en: "That is true, my niece works as an AI trainer, for example, which did not even exist ten years ago." },
      { speaker: "Frau Ahmadi", de: "Genau deshalb finde ich es wichtig, dass wir uns ständig weiterbilden.", en: "That is exactly why I think it is important that we keep educating ourselves." },
      { speaker: "Herr Fischer", de: "Da stimme ich Ihnen voll zu.", en: "I fully agree with you there." }
    ]
  },
  {
    id: 15,
    title: "Online Shopping vs. Stores",
    titleDe: "Online-Shopping vs. Laden",
    theme: "technology_media",
    lines: [
      { speaker: "Nadine", de: "Ich bestelle mittlerweile fast alles online, weil es so bequem ist.", en: "I now order almost everything online because it is so convenient." },
      { speaker: "Oliver", de: "Ich kaufe lieber im Laden ein, damit ich die Sachen vorher anfassen und anprobieren kann.", en: "I prefer shopping in stores so that I can touch and try things on beforehand." },
      { speaker: "Nadine", de: "Das verstehe ich, aber online spart man oft Zeit und findet günstigere Preise.", en: "I understand that, but online you often save time and find cheaper prices." },
      { speaker: "Oliver", de: "Stimmt, allerdings schließen dadurch immer mehr kleine Geschäfte in der Innenstadt.", en: "True, but because of that more and more small shops in the city center are closing." },
      { speaker: "Nadine", de: "Das ist wirklich schade, weil ich die Innenstadt früher gern besucht habe.", en: "That is really a shame, because I used to enjoy visiting the city center." },
      { speaker: "Oliver", de: "Vielleicht sollten wir öfter bewusst in lokalen Geschäften einkaufen, um sie zu unterstützen.", en: "Maybe we should consciously shop in local stores more often to support them." },
      { speaker: "Nadine", de: "Das ist ein guter Vorsatz. Lass uns das am Samstag ausprobieren.", en: "That is a good resolution. Let us try that on Saturday." }
    ]
  },
  {
    id: 16,
    title: "Recognizing Fake News",
    titleDe: "Fake News erkennen",
    theme: "technology_media",
    lines: [
      { speaker: "Herr Braun", de: "Habt ihr schon einmal eine Nachricht geteilt, die sich später als falsch herausgestellt hat?", en: "Have any of you ever shared a news story that later turned out to be false?" },
      { speaker: "Zoe", de: "Ja, letztens habe ich einen Artikel geteilt, ohne zu prüfen, ob er wirklich stimmt.", en: "Yes, recently I shared an article without checking whether it was really true." },
      { speaker: "Herr Braun", de: "Das passiert vielen, weil solche Nachrichten oft besonders spannend klingen.", en: "That happens to many people because such news often sounds particularly exciting." },
      { speaker: "Zoe", de: "Wie kann man denn erkennen, ob eine Quelle vertrauenswürdig ist?", en: "So how can you tell if a source is trustworthy?" },
      { speaker: "Herr Braun", de: "Man sollte prüfen, wer den Artikel geschrieben hat und ob andere seriöse Medien darüber berichten.", en: "You should check who wrote the article and whether other serious media are reporting on it." },
      { speaker: "Zoe", de: "Das werde ich ab jetzt machen, bevor ich etwas weiterleite.", en: "I will do that from now on before I forward anything." },
      { speaker: "Herr Braun", de: "Sehr gut, denn Falschinformationen können großen Schaden anrichten.", en: "Very good, because false information can cause great harm." }
    ]
  },
  {
    id: 17,
    title: "Buying a New Smartphone",
    titleDe: "Ein neues Smartphone kaufen",
    theme: "technology_media",
    lines: [
      { speaker: "Herr Diaz", de: "Ich suche ein neues Smartphone, aber ich weiß nicht, welches Modell ich nehmen soll.", en: "I am looking for a new smartphone, but I do not know which model to get." },
      { speaker: "Verkäufer", de: "Was ist Ihnen wichtiger, eine gute Kamera oder ein günstiger Preis?", en: "What is more important to you, a good camera or a low price?" },
      { speaker: "Herr Diaz", de: "Eigentlich beides, aber wenn ich wählen müsste, wäre mir die Kamera wichtiger.", en: "Actually both, but if I had to choose, the camera would be more important to me." },
      { speaker: "Verkäufer", de: "Dann empfehle ich Ihnen dieses Modell. Es hat eine bessere Kamera als das günstigere, kostet aber auch mehr.", en: "Then I recommend this model. It has a better camera than the cheaper one, but it also costs more." },
      { speaker: "Herr Diaz", de: "Wie viel teurer ist es denn genau?", en: "So how much more expensive is it exactly?" },
      { speaker: "Verkäufer", de: "Etwa hundertfünfzig Euro, obwohl es momentan einen Rabatt gibt.", en: "About a hundred fifty euros more, although there is currently a discount." },
      { speaker: "Herr Diaz", de: "Gut, dann nehme ich das teurere Modell, weil mir gute Fotos wirklich wichtig sind.", en: "Okay, then I will take the more expensive model, because good photos are really important to me." }
    ]
  },

  // ===== COMPLAINTS & PROBLEMS (6) =====
  {
    id: 18,
    title: "Returning a Broken Phone",
    titleDe: "Kaputtes Handy reklamieren",
    theme: "complaints_problems",
    lines: [
      { speaker: "Frau Roth", de: "Ich habe dieses Handy letzte Woche gekauft, aber der Akku funktioniert nicht richtig.", en: "I bought this phone last week, but the battery does not work properly." },
      { speaker: "Verkäufer", de: "Das tut mir leid. Können Sie mir genauer beschreiben, was das Problem ist?", en: "I am sorry to hear that. Can you describe more precisely what the problem is?" },
      { speaker: "Frau Roth", de: "Der Akku ist nach zwei Stunden schon leer, obwohl ich das Handy kaum benutzt habe.", en: "The battery is already empty after two hours, even though I hardly used the phone." },
      { speaker: "Verkäufer", de: "Haben Sie den Kassenbon noch?", en: "Do you still have the receipt?" },
      { speaker: "Frau Roth", de: "Ja, hier ist er. Ich möchte entweder ein neues Gerät oder mein Geld zurück.", en: "Yes, here it is. I would like either a new device or my money back." },
      { speaker: "Verkäufer", de: "Da das Gerät noch Garantie hat, können wir es Ihnen kostenlos reparieren oder austauschen.", en: "Since the device is still under warranty, we can repair or exchange it for you free of charge." },
      { speaker: "Frau Roth", de: "Dann hätte ich gern ein neues Gerät, damit ich nicht wieder Probleme habe.", en: "Then I would like a new device, so that I do not have problems again." },
      { speaker: "Verkäufer", de: "Kein Problem, ich hole Ihnen sofort ein Ersatzgerät.", en: "No problem, I will get you a replacement device right away." }
    ]
  },
  {
    id: 19,
    title: "A Delayed Delivery",
    titleDe: "Verspätete Lieferung",
    theme: "complaints_problems",
    lines: [
      { speaker: "Frau Lange", de: "Guten Tag, ich warte seit zwei Wochen auf meine Bestellung, die eigentlich schon vor zehn Tagen ankommen sollte.", en: "Hello, I have been waiting two weeks for my order, which was actually supposed to arrive ten days ago." },
      { speaker: "Kundenservice", de: "Das tut mir leid. Könnten Sie mir bitte Ihre Bestellnummer geben?", en: "I am sorry about that. Could you please give me your order number?" },
      { speaker: "Frau Lange", de: "Ja, die Nummer ist 48291.", en: "Yes, the number is 48291." },
      { speaker: "Kundenservice", de: "Einen Moment, ich schaue nach... Es tut mir leid, aber das Paket ist wohl beim Transport verloren gegangen.", en: "One moment, let me check... I am sorry, but the package seems to have gotten lost during shipping." },
      { speaker: "Frau Lange", de: "Das kann doch nicht sein! Ich brauche das Geschenk unbedingt bis zum Wochenende.", en: "That cannot be true! I really need the gift by the weekend." },
      { speaker: "Kundenservice", de: "Ich verstehe Ihren Ärger. Wir schicken Ihnen sofort ein neues Paket mit Express-Versand, kostenlos.", en: "I understand your frustration. We will send you a new package immediately with express shipping, free of charge." },
      { speaker: "Frau Lange", de: "Gut, dann hoffe ich, dass es diesmal pünktlich ankommt.", en: "Fine, then I hope it arrives on time this time." },
      { speaker: "Kundenservice", de: "Das garantiere ich Ihnen. Es tut mir wirklich leid für die Unannehmlichkeiten.", en: "I guarantee that. I am really sorry for the inconvenience." }
    ]
  },
  {
    id: 20,
    title: "A Noisy Neighbor",
    titleDe: "Lauter Nachbar",
    theme: "complaints_problems",
    lines: [
      { speaker: "Frau Meier", de: "Entschuldigung, könnten Sie bitte etwas leiser sein? Die Musik ist schon seit Stunden sehr laut.", en: "Excuse me, could you please be a bit quieter? The music has been very loud for hours now." },
      { speaker: "Herr Petrov", de: "Oh, entschuldigen Sie, ich habe nicht gemerkt, dass es so spät geworden ist.", en: "Oh, I am sorry, I did not notice it had gotten so late." },
      { speaker: "Frau Meier", de: "Ich muss morgen früh arbeiten, deshalb wäre ich Ihnen dankbar, wenn Sie die Musik leiser machen könnten.", en: "I have to work early tomorrow, so I would be grateful if you could turn the music down." },
      { speaker: "Herr Petrov", de: "Natürlich, das mache ich sofort. Es tut mir wirklich leid für die Störung.", en: "Of course, I will do that right away. I am really sorry for the disturbance." },
      { speaker: "Frau Meier", de: "Kein Problem, so etwas kann passieren.", en: "No problem, that can happen." },
      { speaker: "Herr Petrov", de: "Falls es noch mal zu laut wird, klopfen Sie bitte einfach an meine Tür.", en: "If it gets too loud again, please just knock on my door." },
      { speaker: "Frau Meier", de: "Das mache ich. Danke für Ihr Verständnis!", en: "I will do that. Thanks for your understanding!" }
    ]
  },
  {
    id: 21,
    title: "Poor Service at a Restaurant",
    titleDe: "Schlechter Service im Restaurant",
    theme: "complaints_problems",
    lines: [
      { speaker: "Herr Wolf", de: "Entschuldigung, wir warten schon seit vierzig Minuten auf unser Essen.", en: "Excuse me, we have been waiting forty minutes for our food already." },
      { speaker: "Kellnerin", de: "Das tut mir sehr leid. Ich frage sofort in der Küche nach, was los ist.", en: "I am very sorry about that. I will ask the kitchen right away what is going on." },
      { speaker: "Herr Wolf", de: "Außerdem war die Suppe, die wir vorher bekommen haben, schon kalt.", en: "Also, the soup we got earlier was already cold." },
      { speaker: "Kellnerin", de: "Das ist wirklich nicht in Ordnung. Ich bringe Ihnen eine neue Suppe, ohne dass Sie dafür bezahlen müssen.", en: "That is really not okay. I will bring you a new soup, without you having to pay for it." },
      { speaker: "Herr Wolf", de: "Das ist nett, aber wir hätten trotzdem gern bald unser Hauptgericht.", en: "That is kind, but we would still like our main course soon." },
      { speaker: "Kellnerin", de: "Ich verstehe. Ich kümmere mich sofort persönlich darum.", en: "I understand. I will personally take care of it right away." },
      { speaker: "Herr Wolf", de: "Danke, das weiß ich zu schätzen.", en: "Thanks, I appreciate that." }
    ]
  },
  {
    id: 22,
    title: "An Error on the Bill",
    titleDe: "Fehler auf der Rechnung",
    theme: "complaints_problems",
    lines: [
      { speaker: "Herr Schulz", de: "Guten Tag, auf meiner Rechnung steht ein Betrag, den ich nicht verstehe.", en: "Hello, there is an amount on my bill that I do not understand." },
      { speaker: "Mitarbeiterin", de: "Können Sie mir sagen, um welchen Posten es sich handelt?", en: "Can you tell me which item it concerns?" },
      { speaker: "Herr Schulz", de: "Da steht eine zusätzliche Gebühr von zwanzig Euro, obwohl ich meinen Vertrag nicht geändert habe.", en: "There is an additional fee of twenty euros, even though I did not change my contract." },
      { speaker: "Mitarbeiterin", de: "Einen Moment, ich schaue mir das an... Das scheint tatsächlich ein Fehler unseres Systems zu sein.", en: "One moment, let me look into that... That actually seems to be an error in our system." },
      { speaker: "Herr Schulz", de: "Können Sie den Betrag bitte korrigieren?", en: "Can you please correct the amount?" },
      { speaker: "Mitarbeiterin", de: "Selbstverständlich. Ich buche Ihnen den Betrag noch heute zurück.", en: "Of course. I will refund you the amount today." },
      { speaker: "Herr Schulz", de: "Vielen Dank, dass Sie sich so schnell darum kümmern.", en: "Thank you very much for taking care of it so quickly." },
      { speaker: "Mitarbeiterin", de: "Gern geschehen, und entschuldigen Sie den Fehler.", en: "You are welcome, and I apologize for the mistake." }
    ]
  },
  {
    id: 23,
    title: "A Complaint at the Hotel",
    titleDe: "Reklamation im Hotel",
    theme: "complaints_problems",
    lines: [
      { speaker: "Frau Adler", de: "Entschuldigung, in meinem Zimmer funktioniert die Heizung nicht, obwohl es draußen sehr kalt ist.", en: "Excuse me, the heating in my room is not working, even though it is very cold outside." },
      { speaker: "Rezeptionist", de: "Das tut mir leid. Möchten Sie ein anderes Zimmer, oder soll ich jemanden schicken, der die Heizung repariert?", en: "I am sorry about that. Would you like a different room, or should I send someone to fix the heating?" },
      { speaker: "Frau Adler", de: "Eine Reparatur wäre gut, wenn das schnell möglich ist.", en: "A repair would be good, if that is possible quickly." },
      { speaker: "Rezeptionist", de: "Ich schicke sofort jemanden vom technischen Dienst hoch. Das sollte in zwanzig Minuten erledigt sein.", en: "I will send someone from technical service up right away. That should be done in twenty minutes." },
      { speaker: "Frau Adler", de: "Gut, und könnte ich in der Zwischenzeit vielleicht einen Tee bekommen?", en: "Good, and could I maybe get a tea in the meantime?" },
      { speaker: "Rezeptionist", de: "Natürlich, ich lasse Ihnen sofort einen ins Zimmer bringen.", en: "Of course, I will have one brought to your room right away." },
      { speaker: "Frau Adler", de: "Vielen Dank für die schnelle Hilfe.", en: "Thank you very much for the quick help." }
    ]
  },

  // ===== WORK & CAREER (6) =====
  {
    id: 24,
    title: "The Job Interview",
    titleDe: "Das Vorstellungsgespräch",
    theme: "work_career",
    lines: [
      { speaker: "Frau Hahn", de: "Warum haben Sie sich für unsere Firma beworben?", en: "Why did you apply to our company?" },
      { speaker: "Frau Ilić", de: "Weil ich schon lange in einem internationalen Team arbeiten wollte und Ihre Firma dafür bekannt ist.", en: "Because I have wanted to work in an international team for a long time, and your company is known for that." },
      { speaker: "Frau Hahn", de: "Was würden Sie sagen, sind Ihre größten Stärken?", en: "What would you say are your greatest strengths?" },
      { speaker: "Frau Ilić", de: "Ich bin sehr organisiert, und obwohl ich manchmal ungeduldig bin, arbeite ich stets zuverlässig.", en: "I am very organized, and although I am sometimes impatient, I always work reliably." },
      { speaker: "Frau Hahn", de: "Wie gehen Sie mit Stress um, wenn mehrere Aufgaben gleichzeitig anstehen?", en: "How do you deal with stress when several tasks come up at the same time?" },
      { speaker: "Frau Ilić", de: "Ich versuche, Prioritäten zu setzen, damit ich die wichtigsten Aufgaben zuerst erledige.", en: "I try to set priorities so that I complete the most important tasks first." },
      { speaker: "Frau Hahn", de: "Das klingt gut. Haben Sie noch Fragen an uns?", en: "That sounds good. Do you have any questions for us?" },
      { speaker: "Frau Ilić", de: "Ja, wie sieht die Einarbeitung für neue Mitarbeiter üblicherweise aus?", en: "Yes, what does the onboarding for new employees usually look like?" }
    ]
  },
  {
    id: 25,
    title: "Salary Negotiation",
    titleDe: "Gehaltsverhandlung",
    theme: "work_career",
    lines: [
      { speaker: "Herr Keller", de: "Ich wollte mit Ihnen über mein Gehalt sprechen, weil ich seit zwei Jahren mehr Verantwortung übernehme, ohne mehr zu verdienen.", en: "I wanted to talk to you about my salary, because for two years I have been taking on more responsibility without earning more." },
      { speaker: "Frau Brandt", de: "Das verstehe ich. Welche Gehaltserhöhung schwebt Ihnen denn vor?", en: "I understand that. What salary increase do you have in mind?" },
      { speaker: "Herr Keller", de: "Ich hätte gern zehn Prozent mehr, da ich in den letzten Monaten zwei große Projekte erfolgreich geleitet habe.", en: "I would like ten percent more, since I have successfully led two big projects in the last few months." },
      { speaker: "Frau Brandt", de: "Das ist eine berechtigte Forderung, obwohl das Budget dieses Jahr etwas knapp ist.", en: "That is a legitimate request, although the budget is a bit tight this year." },
      { speaker: "Herr Keller", de: "Vielleicht könnten wir uns auf sieben Prozent einigen?", en: "Maybe we could agree on seven percent?" },
      { speaker: "Frau Brandt", de: "Das klingt fair. Ich bespreche das mit der Geschäftsführung und gebe Ihnen bis Freitag Bescheid.", en: "That sounds fair. I will discuss it with management and let you know by Friday." },
      { speaker: "Herr Keller", de: "Vielen Dank, dass Sie sich die Zeit genommen haben.", en: "Thank you very much for taking the time." }
    ]
  },
  {
    id: 26,
    title: "Announcing a Resignation",
    titleDe: "Kündigung ankündigen",
    theme: "work_career",
    lines: [
      { speaker: "Frau Toth", de: "Herr Baumann, ich möchte Ihnen mitteilen, dass ich das Unternehmen zum Monatsende verlassen werde.", en: "Mr. Baumann, I would like to tell you that I will be leaving the company at the end of the month." },
      { speaker: "Herr Baumann", de: "Das überrascht mich. Darf ich fragen, warum Sie sich dazu entschieden haben?", en: "That surprises me. May I ask why you decided to do that?" },
      { speaker: "Frau Toth", de: "Ich habe ein Angebot bekommen, das besser zu meinen beruflichen Zielen passt.", en: "I received an offer that fits my career goals better." },
      { speaker: "Herr Baumann", de: "Das kann ich verstehen, auch wenn es mir leidtut, Sie zu verlieren.", en: "I can understand that, even though I am sorry to lose you." },
      { speaker: "Frau Toth", de: "Ich habe hier wirklich viel gelernt und bin dankbar für die Zeit.", en: "I really learned a lot here and am grateful for the time." },
      { speaker: "Herr Baumann", de: "Wir werden natürlich eine ordentliche Übergabe organisieren, damit alles reibungslos läuft.", en: "We will of course organize a proper handover so that everything runs smoothly." },
      { speaker: "Frau Toth", de: "Das ist mir auch wichtig. Ich stehe für alle Fragen zur Verfügung.", en: "That is important to me too. I am available for any questions." }
    ]
  },
  {
    id: 27,
    title: "A Conflict with a Colleague",
    titleDe: "Konflikt mit einem Kollegen",
    theme: "work_career",
    lines: [
      { speaker: "Herr Novak", de: "Kann ich kurz mit dir sprechen? Mir ist aufgefallen, dass du meine Ideen in Meetings oft unterbrichst.", en: "Can I talk to you for a moment? I have noticed that you often interrupt my ideas in meetings." },
      { speaker: "Frau Duman", de: "Das tut mir leid, das war nicht meine Absicht. Manchmal bin ich einfach zu ungeduldig.", en: "I am sorry, that was not my intention. Sometimes I am just too impatient." },
      { speaker: "Herr Novak", de: "Ich verstehe das, aber es fällt mir schwer, meine Gedanken zu Ende zu bringen, wenn das passiert.", en: "I understand that, but it is hard for me to finish my thoughts when that happens." },
      { speaker: "Frau Duman", de: "Danke, dass du es mir sagst. Ich werde in Zukunft mehr darauf achten.", en: "Thanks for telling me. I will pay more attention to that in the future." },
      { speaker: "Herr Novak", de: "Das würde ich sehr schätzen, weil ich gern gut mit dir zusammenarbeiten möchte.", en: "I would really appreciate that, because I want to work well together with you." },
      { speaker: "Frau Duman", de: "Ich auch. Vielleicht sollten wir uns in Meetings einfach gegenseitig ausreden lassen.", en: "Me too. Maybe we should just let each other finish speaking in meetings." },
      { speaker: "Herr Novak", de: "Guter Vorschlag, das machen wir so.", en: "Good suggestion, let us do that." }
    ]
  },
  {
    id: 28,
    title: "Planning Further Training",
    titleDe: "Weiterbildung planen",
    theme: "work_career",
    lines: [
      { speaker: "Frau Yilmaz", de: "Ich überlege, einen Kurs in Projektmanagement zu machen, um meine Karrierechancen zu verbessern.", en: "I am considering taking a course in project management to improve my career chances." },
      { speaker: "Herr Krause", de: "Das finde ich eine gute Idee, zumal solche Zertifikate bei uns im Unternehmen sehr geschätzt werden.", en: "I think that is a good idea, especially since such certificates are highly valued in our company." },
      { speaker: "Frau Yilmaz", de: "Wissen Sie, ob die Firma die Kosten für solche Weiterbildungen übernimmt?", en: "Do you know if the company covers the costs for such further training?" },
      { speaker: "Herr Krause", de: "Ja, solange der Kurs mit Ihrer Position zu tun hat, übernehmen wir bis zu achtzig Prozent der Kosten.", en: "Yes, as long as the course is relevant to your position, we cover up to eighty percent of the costs." },
      { speaker: "Frau Yilmaz", de: "Das ist großzügig. Dann werde ich mich gleich morgen anmelden.", en: "That is generous. Then I will sign up tomorrow." },
      { speaker: "Herr Krause", de: "Melden Sie sich gern bei mir, falls Sie Unterstützung bei der Anmeldung brauchen.", en: "Feel free to contact me if you need support with the registration." },
      { speaker: "Frau Yilmaz", de: "Vielen Dank, das werde ich tun.", en: "Thank you very much, I will do that." }
    ]
  },
  {
    id: 29,
    title: "A Team Meeting",
    titleDe: "Team-Meeting",
    theme: "work_career",
    lines: [
      { speaker: "Frau Sander", de: "Wir liegen leider hinter dem Zeitplan, weil die Lieferung der Materialien sich verzögert hat.", en: "We are unfortunately behind schedule because the delivery of materials has been delayed." },
      { speaker: "Herr Weiss", de: "Das ist ärgerlich. Was schlagen Sie vor, damit wir den Termin trotzdem einhalten können?", en: "That is annoying. What do you suggest so that we can still meet the deadline?" },
      { speaker: "Frau Sander", de: "Ich denke, wir sollten die Aufgaben neu verteilen, damit die wichtigsten Teile zuerst fertig werden.", en: "I think we should redistribute the tasks so that the most important parts get finished first." },
      { speaker: "Herr Weiss", de: "Einverstanden, ich könnte zusätzlich noch am Wochenende daran arbeiten, wenn es nötig ist.", en: "Agreed, I could also work on it on the weekend if necessary." },
      { speaker: "Frau Sander", de: "Das wäre großartig, obwohl ich nicht möchte, dass du dich überarbeitest.", en: "That would be great, although I do not want you to overwork yourself." },
      { speaker: "Herr Weiss", de: "Keine Sorge, ein Wochenende schaffe ich locker.", en: "No worries, I can easily manage one weekend." },
      { speaker: "Frau Sander", de: "Danke für dein Engagement. Ich informiere den Kunden über den neuen Zeitplan.", en: "Thanks for your commitment. I will inform the client about the new schedule." }
    ]
  },

  // ===== PLANNING EVENTS (6) =====
  {
    id: 30,
    title: "Planning a Birthday Party",
    titleDe: "Eine Geburtstagsparty planen",
    theme: "planning_events",
    lines: [
      { speaker: "Sofie", de: "Lasst uns endlich die Geburtstagsparty für Anna planen!", en: "Let us finally plan Anna's birthday party!" },
      { speaker: "Ben", de: "Ich finde, wir sollten sie in einem Restaurant feiern, damit wir uns um nichts kümmern müssen.", en: "I think we should celebrate it at a restaurant so that we do not have to worry about anything." },
      { speaker: "Clara", de: "Das ist mir zu teuer. Ich schlage vor, dass wir bei mir zu Hause feiern und alle etwas mitbringen.", en: "That is too expensive for me. I suggest we celebrate at my place and everyone brings something." },
      { speaker: "Ben", de: "Das könnte funktionieren, obwohl es bei dir nicht so viel Platz gibt.", en: "That could work, although there is not much space at your place." },
      { speaker: "Sofie", de: "Wir könnten auch in den Park gehen, wenn das Wetter mitspielt.", en: "We could also go to the park if the weather cooperates." },
      { speaker: "Clara", de: "Das ist riskant, weil man das Wetter im September nicht vorhersagen kann.", en: "That is risky because you cannot predict the weather in September." },
      { speaker: "Ben", de: "Dann machen wir es doch einfach bei Clara, aber mit einem Plan B für draußen.", en: "Then let us just do it at Clara's, but with a plan B for outside." },
      { speaker: "Sofie", de: "Gute Idee! Ich kümmere mich um den Kuchen.", en: "Good idea! I will take care of the cake." },
      { speaker: "Clara", de: "Und ich schreibe die Einladungen.", en: "And I will write the invitations." }
    ]
  },
  {
    id: 31,
    title: "Organizing a Wedding",
    titleDe: "Hochzeit organisieren",
    theme: "planning_events",
    lines: [
      { speaker: "Nina", de: "Ich möchte, dass wir im Sommer draußen heiraten, weil das romantischer wäre.", en: "I want us to get married outside in the summer because it would be more romantic." },
      { speaker: "Sam", de: "Das klingt schön, aber was machen wir, falls es regnet?", en: "That sounds nice, but what do we do if it rains?" },
      { speaker: "Nina", de: "Wir könnten ein Zelt mieten, damit wir auf jeden Fall geschützt sind.", en: "We could rent a tent so that we are protected no matter what." },
      { speaker: "Sam", de: "Das ist eine gute Idee, obwohl das sicher zusätzliches Geld kostet.", en: "That is a good idea, although it will certainly cost extra money." },
      { speaker: "Nina", de: "Dafür sparen wir vielleicht bei der Anzahl der Gäste.", en: "In return, maybe we can save on the number of guests." },
      { speaker: "Sam", de: "Meine Eltern möchten aber unbedingt die ganze Verwandtschaft einladen.", en: "But my parents really want to invite the whole extended family." },
      { speaker: "Nina", de: "Dann sollten wir mit ihnen sprechen und gemeinsam eine Lösung finden.", en: "Then we should talk to them and find a solution together." },
      { speaker: "Sam", de: "Einverstanden. Lass uns dieses Wochenende mit meinen Eltern telefonieren.", en: "Agreed. Let us call my parents this weekend." }
    ]
  },
  {
    id: 32,
    title: "Planning a Move",
    titleDe: "Umzug planen",
    theme: "planning_events",
    lines: [
      { speaker: "Timo", de: "Danke, dass du mir beim Umzug hilfst! Ich glaube, wir brauchen mindestens zwei Autos.", en: "Thanks for helping me move! I think we need at least two cars." },
      { speaker: "Basti", de: "Kein Problem. Hast du schon einen Transporter organisiert, oder reichen unsere Autos?", en: "No problem. Have you already organized a van, or will our cars be enough?" },
      { speaker: "Timo", de: "Ich denke, dass wir wegen des Sofas einen kleinen Transporter mieten sollten.", en: "I think we should rent a small van because of the sofa." },
      { speaker: "Basti", de: "Gute Idee. Wann genau soll der Umzug stattfinden?", en: "Good idea. When exactly should the move take place?" },
      { speaker: "Timo", de: "Am Samstag, wenn es dir passt. Ich möchte, dass wir früh anfangen, damit wir vor Sonnenuntergang fertig sind.", en: "On Saturday, if that works for you. I want us to start early so that we are done before sunset." },
      { speaker: "Basti", de: "Das passt mir gut. Soll ich noch jemanden zum Helfen fragen?", en: "That works for me. Should I ask someone else to help?" },
      { speaker: "Timo", de: "Ja, gern, weil die Kartons ziemlich schwer sind.", en: "Yes, please, because the boxes are quite heavy." },
      { speaker: "Basti", de: "Ich frage meinen Bruder, ob er auch Zeit hat.", en: "I will ask my brother if he also has time." }
    ]
  },
  {
    id: 33,
    title: "Organizing a Class Reunion",
    titleDe: "Klassentreffen organisieren",
    theme: "planning_events",
    lines: [
      { speaker: "Petra", de: "Sollen wir nach zwanzig Jahren nicht endlich ein Klassentreffen organisieren?", en: "Should we not finally organize a class reunion after twenty years?" },
      { speaker: "Georg", de: "Gute Idee! Wo könnten wir uns treffen, damit möglichst viele kommen können?", en: "Good idea! Where could we meet so that as many people as possible can come?" },
      { speaker: "Petra", de: "Vielleicht in unserer alten Schule, falls das erlaubt ist.", en: "Maybe at our old school, if that is allowed." },
      { speaker: "Georg", de: "Das wäre schön, aber ich glaube, ein Restaurant wäre einfacher zu organisieren.", en: "That would be nice, but I think a restaurant would be easier to organize." },
      { speaker: "Petra", de: "Da hast du recht. Sollen wir eine Gruppe im Internet erstellen, um alle zu kontaktieren?", en: "You are right about that. Should we create an online group to contact everyone?" },
      { speaker: "Georg", de: "Ja, das wäre praktisch, obwohl wir bestimmt nicht alle Adressen finden werden.", en: "Yes, that would be practical, although we surely will not find everyone's contact info." },
      { speaker: "Petra", de: "Wir können ja fragen, ob jemand noch Kontakt zu den anderen hat.", en: "We can ask if anyone still has contact with the others." },
      { speaker: "Georg", de: "Gute Idee. Ich fange gleich heute Abend damit an.", en: "Good idea. I will start with that tonight." }
    ]
  },
  {
    id: 34,
    title: "A Company Party",
    titleDe: "Firmenfeier",
    theme: "planning_events",
    lines: [
      { speaker: "Frau Lindner", de: "Für die Weihnachtsfeier müssen wir uns bald entscheiden, ob wir ein Restaurant buchen oder im Büro feiern.", en: "For the Christmas party, we need to decide soon whether to book a restaurant or celebrate in the office." },
      { speaker: "Herr Cohen", de: "Ich bin für ein Restaurant, damit sich niemand um Aufräumen kümmern muss.", en: "I am in favor of a restaurant so that nobody has to worry about cleaning up." },
      { speaker: "Frau Lindner", de: "Das stimmt, allerdings ist das Budget dieses Jahr kleiner als sonst.", en: "That is true, but the budget is smaller than usual this year." },
      { speaker: "Herr Cohen", de: "Vielleicht finden wir ein Restaurant, das ein günstigeres Menü anbietet.", en: "Maybe we can find a restaurant that offers a cheaper menu." },
      { speaker: "Frau Lindner", de: "Gute Idee. Sollen wir auch die Praktikanten einladen?", en: "Good idea. Should we also invite the interns?" },
      { speaker: "Herr Cohen", de: "Auf jeden Fall, weil sie das ganze Jahr über hart gearbeitet haben.", en: "Definitely, because they worked hard all year." },
      { speaker: "Frau Lindner", de: "Einverstanden. Ich suche diese Woche nach passenden Restaurants.", en: "Agreed. I will look for suitable restaurants this week." }
    ]
  },
  {
    id: 35,
    title: "A Weekend Trip",
    titleDe: "Wochenendausflug",
    theme: "planning_events",
    lines: [
      { speaker: "Marie", de: "Ich würde gern an den See fahren, weil ich mich nach etwas Ruhe sehne.", en: "I would like to go to the lake because I am longing for some peace and quiet." },
      { speaker: "Jonathan", de: "Ich hätte eigentlich lieber eine Wanderung in den Bergen gemacht.", en: "I would have actually preferred to go hiking in the mountains." },
      { speaker: "Marie", de: "Das verstehe ich, aber nach dieser stressigen Woche möchte ich mich einfach nur entspannen.", en: "I understand that, but after this stressful week I just want to relax." },
      { speaker: "Jonathan", de: "Wie wäre es, wenn wir am Samstag zum See fahren und am Sonntag eine kurze Wanderung machen?", en: "How about we go to the lake on Saturday and do a short hike on Sunday?" },
      { speaker: "Marie", de: "Das klingt nach einem guten Kompromiss, solange die Wanderung nicht zu anstrengend wird.", en: "That sounds like a good compromise, as long as the hike does not get too strenuous." },
      { speaker: "Jonathan", de: "Keine Sorge, ich suche eine leichte Route aus.", en: "No worries, I will pick out an easy route." },
      { speaker: "Marie", de: "Perfekt! Dann packe ich schon mal die Badesachen ein.", en: "Perfect! Then I will pack the swimming gear." }
    ]
  },

  // ===== FORMAL SITUATIONS (6) =====
  {
    id: 36,
    title: "A Complaint to the Office",
    titleDe: "Beschwerde beim Amt",
    theme: "formal_situations",
    lines: [
      { speaker: "Herr Ateş", de: "Guten Tag, ich möchte mich beschweren, weil ich seit drei Monaten auf einen Bescheid warte.", en: "Hello, I would like to file a complaint because I have been waiting three months for a decision." },
      { speaker: "Frau Grimm", de: "Das tut mir leid zu hören. Haben Sie Ihre Antragsnummer dabei?", en: "I am sorry to hear that. Do you have your application number with you?" },
      { speaker: "Herr Ateş", de: "Ja, hier ist sie. Ich habe schon zweimal angerufen, ohne eine klare Antwort zu bekommen.", en: "Yes, here it is. I have already called twice without getting a clear answer." },
      { speaker: "Frau Grimm", de: "Einen Moment, ich prüfe den Status Ihres Antrags... Es tut mir leid, aber es gab tatsächlich eine Verzögerung.", en: "One moment, let me check the status of your application... I am sorry, but there was indeed a delay." },
      { speaker: "Herr Ateş", de: "Wann kann ich denn nun endlich mit einer Antwort rechnen?", en: "So when can I finally expect an answer now?" },
      { speaker: "Frau Grimm", de: "Ich kümmere mich persönlich darum, damit Sie spätestens in zwei Wochen Bescheid bekommen.", en: "I will personally take care of it so that you get a decision within two weeks at the latest." },
      { speaker: "Herr Ateş", de: "Das hoffe ich sehr, denn ich brauche den Bescheid dringend.", en: "I really hope so, because I urgently need the decision." },
      { speaker: "Frau Grimm", de: "Ich verstehe Ihre Situation und werde mein Bestes tun.", en: "I understand your situation and will do my best." }
    ]
  },
  {
    id: 37,
    title: "At the Lawyer's Office",
    titleDe: "Beim Anwalt",
    theme: "formal_situations",
    lines: [
      { speaker: "Herr Vural", de: "Ich habe ein Problem mit meinem Vermieter, weil er die Kaution nicht zurückzahlen will.", en: "I have a problem with my landlord because he does not want to pay back the deposit." },
      { speaker: "Frau Keller", de: "Verstehe. Hat er Ihnen einen Grund genannt, warum er das Geld einbehält?", en: "I see. Did he give you a reason why he is withholding the money?" },
      { speaker: "Herr Vural", de: "Er behauptet, dass es Schäden in der Wohnung gab, obwohl ich alles ordentlich hinterlassen habe.", en: "He claims there was damage in the apartment, even though I left everything in order." },
      { speaker: "Frau Keller", de: "Haben Sie Fotos gemacht, bevor Sie ausgezogen sind?", en: "Did you take photos before you moved out?" },
      { speaker: "Herr Vural", de: "Ja, ich habe alles fotografiert, für den Fall, dass es Probleme gibt.", en: "Yes, I photographed everything, in case there were problems." },
      { speaker: "Frau Keller", de: "Das ist sehr hilfreich. Damit haben wir gute Chancen, dass Sie die Kaution zurückbekommen.", en: "That is very helpful. With that we have a good chance that you will get the deposit back." },
      { speaker: "Herr Vural", de: "Was muss ich als Nächstes tun?", en: "What do I need to do next?" },
      { speaker: "Frau Keller", de: "Ich schreibe ihm zunächst einen Brief und setze eine Frist von zwei Wochen.", en: "First I will write him a letter and set a deadline of two weeks." }
    ]
  },
  {
    id: 38,
    title: "Applying for an Extension",
    titleDe: "Antrag auf Verlängerung",
    theme: "formal_situations",
    lines: [
      { speaker: "Frau Kowalski", de: "Guten Tag, ich möchte meine Aufenthaltserlaubnis verlängern lassen, da sie nächsten Monat abläuft.", en: "Hello, I would like to have my residence permit extended, since it expires next month." },
      { speaker: "Herr Lutz", de: "Haben Sie alle notwendigen Unterlagen dabei, wie den Arbeitsvertrag und den Nachweis über die Krankenversicherung?", en: "Do you have all the necessary documents with you, such as the employment contract and proof of health insurance?" },
      { speaker: "Frau Kowalski", de: "Ja, ich habe alles mitgebracht, damit nichts fehlt.", en: "Yes, I brought everything so that nothing is missing." },
      { speaker: "Herr Lutz", de: "Sehr gut. Ich sehe, dass Sie seit zwei Jahren bei derselben Firma arbeiten.", en: "Very good. I see that you have been working at the same company for two years." },
      { speaker: "Frau Kowalski", de: "Genau, und mein Vertrag wurde gerade um weitere drei Jahre verlängert.", en: "Exactly, and my contract was just extended for another three years." },
      { speaker: "Herr Lutz", de: "Das ist positiv für Ihren Antrag. Sie erhalten die Entscheidung innerhalb von vier Wochen per Post.", en: "That is positive for your application. You will receive the decision by mail within four weeks." },
      { speaker: "Frau Kowalski", de: "Vielen Dank für Ihre Hilfe.", en: "Thank you very much for your help." }
    ]
  },
  {
    id: 39,
    title: "A Complaint to the Transit Authority",
    titleDe: "Beschwerde bei den Verkehrsbetrieben",
    theme: "formal_situations",
    lines: [
      { speaker: "Frau Özdemir", de: "Ich rufe an, weil meine Monatskarte seit einer Woche nicht mehr funktioniert, obwohl ich pünktlich bezahlt habe.", en: "I am calling because my monthly pass has not been working for a week, even though I paid on time." },
      { speaker: "Kundenberater", de: "Das tut mir leid. Können Sie mir Ihre Kundennummer nennen, damit ich das prüfen kann?", en: "I am sorry about that. Can you give me your customer number so I can check that?" },
      { speaker: "Frau Özdemir", de: "Ja, die Nummer ist 77531. Ich musste deshalb jeden Tag ein neues Ticket kaufen.", en: "Yes, the number is 77531. Because of that I had to buy a new ticket every day." },
      { speaker: "Kundenberater", de: "Ich sehe hier, dass es ein technisches Problem mit Ihrer Karte gab, das wir leider erst jetzt bemerkt haben.", en: "I see here that there was a technical problem with your card, which unfortunately we only noticed now." },
      { speaker: "Frau Özdemir", de: "Ich möchte, dass mir die zusätzlichen Kosten erstattet werden.", en: "I would like the extra costs to be reimbursed." },
      { speaker: "Kundenberater", de: "Das ist völlig gerechtfertigt. Schicken Sie uns bitte die Belege, dann erstatten wir Ihnen den Betrag.", en: "That is completely justified. Please send us the receipts, and we will reimburse you the amount." },
      { speaker: "Frau Özdemir", de: "In Ordnung, das mache ich noch heute.", en: "All right, I will do that today." },
      { speaker: "Kundenberater", de: "Vielen Dank für Ihre Geduld, und entschuldigen Sie die Unannehmlichkeiten.", en: "Thank you very much for your patience, and I apologize for the inconvenience." }
    ]
  },
  {
    id: 40,
    title: "Filing an Objection",
    titleDe: "Widerspruch einlegen",
    theme: "formal_situations",
    lines: [
      { speaker: "Frau Sanchez", de: "Ich möchte gegen den Bescheid Widerspruch einlegen, weil ich glaube, dass ein Fehler gemacht wurde.", en: "I would like to file an objection against the decision because I believe a mistake was made." },
      { speaker: "Herr Möller", de: "Verstehe. Welchen Teil des Bescheids möchten Sie denn anfechten?", en: "I understand. Which part of the decision would you like to challenge?" },
      { speaker: "Frau Sanchez", de: "Die Berechnung meines Einkommens ist falsch, denn es wurden Ausgaben nicht berücksichtigt, die ich eingereicht hatte.", en: "The calculation of my income is wrong, because expenses that I had submitted were not taken into account." },
      { speaker: "Herr Möller", de: "Haben Sie die entsprechenden Belege noch, um das zu beweisen?", en: "Do you still have the relevant documents to prove that?" },
      { speaker: "Frau Sanchez", de: "Ja, ich habe alle Kopien aufgehoben, seit ich den Antrag gestellt habe.", en: "Yes, I kept all the copies since I submitted the application." },
      { speaker: "Herr Möller", de: "Gut, dann reichen Sie bitte einen schriftlichen Widerspruch mit den Belegen innerhalb eines Monats ein.", en: "Good, then please submit a written objection with the documents within one month." },
      { speaker: "Frau Sanchez", de: "Das werde ich sofort erledigen, damit es keine weitere Verzögerung gibt.", en: "I will do that right away, so that there is no further delay." },
      { speaker: "Herr Möller", de: "Sehr gut. Wir melden uns, sobald wir Ihren Widerspruch geprüft haben.", en: "Very good. We will contact you as soon as we have reviewed your objection." }
    ]
  },
  {
    id: 41,
    title: "An Appointment at the Tax Office",
    titleDe: "Termin beim Finanzamt",
    theme: "formal_situations",
    lines: [
      { speaker: "Herr Costa", de: "Guten Tag, ich habe Fragen zu meiner Steuererklärung, weil ich nicht sicher bin, welche Kosten ich absetzen kann.", en: "Hello, I have questions about my tax return because I am not sure which expenses I can deduct." },
      { speaker: "Frau Reuter", de: "Gerne helfe ich Ihnen. Arbeiten Sie im Homeoffice?", en: "I am happy to help you. Do you work from home?" },
      { speaker: "Herr Costa", de: "Ja, seit letztem Jahr arbeite ich hauptsächlich von zu Hause aus.", en: "Yes, since last year I have been working mainly from home." },
      { speaker: "Frau Reuter", de: "Dann können Sie einen Teil der Miete und der Stromkosten absetzen, sofern Sie ein separates Arbeitszimmer haben.", en: "Then you can deduct part of the rent and electricity costs, provided you have a separate home office room." },
      { speaker: "Herr Costa", de: "Das wusste ich nicht. Was brauche ich, um das nachzuweisen?", en: "I did not know that. What do I need to prove that?" },
      { speaker: "Frau Reuter", de: "Am besten reichen Sie die Rechnungen und einen Grundriss der Wohnung ein.", en: "It is best to submit the invoices and a floor plan of the apartment." },
      { speaker: "Herr Costa", de: "Vielen Dank, das erklärt einiges.", en: "Thank you very much, that explains a lot." },
      { speaker: "Frau Reuter", de: "Gern geschehen. Falls Sie noch Fragen haben, können Sie mich jederzeit anrufen.", en: "You are welcome. If you have any more questions, you can call me anytime." }
    ]
  },

  // ===== CULTURE & LEISURE (6) =====
  {
    id: 42,
    title: "Going to the Theater",
    titleDe: "Ins Theater gehen",
    theme: "culture_leisure",
    lines: [
      { speaker: "Hanna", de: "Wie hat dir das Theaterstück gestern gefallen?", en: "How did you like the play yesterday?" },
      { speaker: "Malte", de: "Ehrlich gesagt war ich etwas enttäuscht, obwohl die Schauspieler wirklich talentiert waren.", en: "Honestly, I was a bit disappointed, even though the actors were really talented." },
      { speaker: "Hanna", de: "Wirklich? Ich fand die Geschichte sehr berührend.", en: "Really? I found the story very touching." },
      { speaker: "Malte", de: "Das Ende war mir zu vorhersehbar, deshalb hat es mich nicht überrascht.", en: "The ending was too predictable for me, so it did not surprise me." },
      { speaker: "Hanna", de: "Das kann ich verstehen, aber die Bühnenbilder waren doch beeindruckend, oder?", en: "I can understand that, but the stage sets were impressive, weren't they?" },
      { speaker: "Malte", de: "Da hast du recht, die waren wirklich außergewöhnlich gestaltet.", en: "You are right about that, they were really exceptionally designed." },
      { speaker: "Hanna", de: "Vielleicht sollten wir nächstes Mal ein anderes Genre ausprobieren.", en: "Maybe next time we should try a different genre." },
      { speaker: "Malte", de: "Gute Idee, wie wäre es mit einer Komödie?", en: "Good idea, how about a comedy?" }
    ]
  },
  {
    id: 43,
    title: "A Museum Visit",
    titleDe: "Museumsbesuch",
    theme: "culture_leisure",
    lines: [
      { speaker: "Elif", de: "Was denkst du über moderne Kunst? Ich verstehe manche Werke einfach nicht.", en: "What do you think about modern art? I just do not understand some of the works." },
      { speaker: "Robin", de: "Ich finde, dass man moderne Kunst nicht immer verstehen muss, um sie zu genießen.", en: "I think you do not always have to understand modern art to enjoy it." },
      { speaker: "Elif", de: "Das mag sein, aber ich bevorzuge Bilder, bei denen ich erkenne, was dargestellt wird.", en: "That may be, but I prefer paintings where I can recognize what is depicted." },
      { speaker: "Robin", de: "Interessant, ich mag gerade die Bilder, die viel Raum für eigene Interpretation lassen.", en: "Interesting, I actually like the paintings that leave a lot of room for one's own interpretation." },
      { speaker: "Elif", de: "Vielleicht sollten wir uns die klassische Abteilung anschauen, damit wir beide etwas finden, das uns gefällt.", en: "Maybe we should look at the classical section, so that we both find something we like." },
      { speaker: "Robin", de: "Einverstanden, und danach können wir in der Cafeteria darüber diskutieren.", en: "Agreed, and afterward we can discuss it in the cafeteria." },
      { speaker: "Elif", de: "Klingt gut, ich bin gespannt auf deine Meinung.", en: "Sounds good, I am curious about your opinion." }
    ]
  },
  {
    id: 44,
    title: "Planning a Concert",
    titleDe: "Ein Konzert planen",
    theme: "culture_leisure",
    lines: [
      { speaker: "Leo", de: "Hast du Lust, nächsten Monat auf das Konzert unserer Lieblingsband zu gehen?", en: "Do you feel like going to our favorite band's concert next month?" },
      { speaker: "Vanessa", de: "Auf jeden Fall! Aber die Tickets sind bestimmt schon ziemlich teuer.", en: "Definitely! But the tickets are probably already quite expensive." },
      { speaker: "Leo", de: "Stimmt, allerdings gibt es günstigere Stehplätze, wenn wir früh genug buchen.", en: "True, but there are cheaper standing tickets if we book early enough." },
      { speaker: "Vanessa", de: "Dann sollten wir das am besten heute noch machen, bevor sie ausverkauft sind.", en: "Then we should best do that today, before they are sold out." },
      { speaker: "Leo", de: "Einverstanden. Sollen wir auch ein paar andere Freunde fragen, ob sie mitkommen wollen?", en: "Agreed. Should we also ask a few other friends if they want to come along?" },
      { speaker: "Vanessa", de: "Ja, gute Idee, so wird es noch schöner.", en: "Yes, good idea, that will make it even nicer." },
      { speaker: "Leo", de: "Ich schreibe gleich in die Gruppe, damit alle Bescheid wissen.", en: "I will write in the group chat right away so that everyone knows." },
      { speaker: "Vanessa", de: "Perfekt, ich freue mich schon riesig!", en: "Perfect, I am already really looking forward to it!" }
    ]
  },
  {
    id: 45,
    title: "Book Club",
    titleDe: "Buchclub",
    theme: "culture_leisure",
    lines: [
      { speaker: "Rosa", de: "Was hast du von dem Roman gehalten, den wir diesen Monat gelesen haben?", en: "What did you think of the novel we read this month?" },
      { speaker: "Tarek", de: "Mir hat er gut gefallen, obwohl mir die Hauptfigur manchmal zu passiv war.", en: "I liked it, although I found the main character sometimes too passive." },
      { speaker: "Rosa", de: "Das sehe ich anders. Ich fand gerade interessant, wie sie sich langsam verändert hat.", en: "I see it differently. I actually found it interesting how she gradually changed." },
      { speaker: "Tarek", de: "Vielleicht habe ich das Ende einfach zu schnell gelesen und deshalb einiges übersehen.", en: "Maybe I just read the ending too quickly and therefore missed some things." },
      { speaker: "Rosa", de: "Das kann sein. Sollen wir das nächste Buch von derselben Autorin lesen?", en: "That could be. Should we read the next book by the same author?" },
      { speaker: "Tarek", de: "Gern, wenn es genauso spannend geschrieben ist wie dieses.", en: "Gladly, if it is written just as excitingly as this one." },
      { speaker: "Rosa", de: "Ich schlage vor, dass jeder bis zum nächsten Treffen ein Kapitel zusammenfasst.", en: "I suggest that everyone summarize one chapter before the next meeting." },
      { speaker: "Tarek", de: "Guter Plan, so können wir gezielter diskutieren.", en: "Good plan, that way we can discuss more specifically." }
    ]
  },
  {
    id: 46,
    title: "A Film Review",
    titleDe: "Filmkritik",
    theme: "culture_leisure",
    lines: [
      { speaker: "Damian", de: "Was hältst du von dem neuen Film? Ich fand ihn ehrlich gesagt zu lang.", en: "What do you think of the new movie? Honestly, I found it too long." },
      { speaker: "Ines", de: "Das verstehe ich, aber ich fand die Geschichte so fesselnd, dass mir die Zeit gar nicht aufgefallen ist.", en: "I understand that, but I found the story so gripping that I did not even notice the time." },
      { speaker: "Damian", de: "Die Spezialeffekte waren beeindruckend, das muss ich zugeben.", en: "The special effects were impressive, I have to admit that." },
      { speaker: "Ines", de: "Genau, und die Musik hat die Atmosphäre perfekt unterstützt.", en: "Exactly, and the music supported the atmosphere perfectly." },
      { speaker: "Damian", de: "Trotzdem hätte man die Handlung etwas straffen können, damit sie nicht so langatmig wirkt.", en: "Still, they could have tightened the plot a bit so that it does not feel so long-winded." },
      { speaker: "Ines", de: "Da hast du vielleicht recht, obwohl mich das persönlich nicht gestört hat.", en: "You might be right about that, although it did not bother me personally." },
      { speaker: "Damian", de: "Würdest du den Film trotzdem weiterempfehlen?", en: "Would you still recommend the movie?" },
      { speaker: "Ines", de: "Auf jeden Fall, besonders Leuten, die Science-Fiction mögen.", en: "Definitely, especially to people who like science fiction." }
    ]
  },
  {
    id: 47,
    title: "Hiking vs. Relaxing",
    titleDe: "Wandern vs. Faulenzen",
    theme: "culture_leisure",
    lines: [
      { speaker: "Nick", de: "Im Urlaub möchte ich unbedingt jeden Tag wandern gehen.", en: "On vacation, I really want to go hiking every day." },
      { speaker: "Franzi", de: "Ich dagegen möchte einfach am Strand liegen und mich entspannen.", en: "I, on the other hand, just want to lie on the beach and relax." },
      { speaker: "Nick", de: "Aber wenn wir nur am Strand liegen, verpassen wir doch die schöne Landschaft in den Bergen.", en: "But if we just lie on the beach, we will miss the beautiful landscape in the mountains." },
      { speaker: "Franzi", de: "Das stimmt, aber nach einem stressigen Jahr brauche ich vor allem Ruhe.", en: "That is true, but after a stressful year I mostly need rest." },
      { speaker: "Nick", de: "Wie wäre es, wenn wir die Woche aufteilen, sodass wir beides machen können?", en: "How about we split the week so that we can do both?" },
      { speaker: "Franzi", de: "Das klingt fair. Drei Tage Strand und drei Tage Wandern?", en: "That sounds fair. Three days at the beach and three days hiking?" },
      { speaker: "Nick", de: "Perfekt, dann sind wir beide zufrieden.", en: "Perfect, then we will both be happy." },
      { speaker: "Franzi", de: "Ich freue mich schon auf den Urlaub!", en: "I am already looking forward to the vacation!" }
    ]
  }
];
