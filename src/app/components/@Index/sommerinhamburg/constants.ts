const sommerBannerTexts = {
  spring: {
    title: "Die warmen Tage rücken näher",
    text: "Bereitet euch auf den Sommer vor – wir zeigen euch schon jetzt tolle Orte für sonnige Ausflüge!",
  },
  seasonStart: {
    title: "Der Sommer ist bald da",
    text: "Hier findet ihr praktische Tipps und schöne Orte, an denen ihr den Sommer so richtig genießen könnt!",
  },
  summerSeason: {
    title: "Sommerzeit ist Ausflugszeit",
    text: "Die Sonne lacht! Entdeckt jetzt unsere besten Empfehlungen für heiße Tage, Abkühlung und Sommerabenteuer.",
  },
  endSeason: {
    title: "Nutze die letzten Sommertage",
    text: "Der Sommer geht langsam zu Ende – entdecke jetzt nochmal unsere schönsten Tipps für warme Tage!",
  },
  startOffseason: {
    title: "Spätsommer-Vibes genießen",
    text: "Es wird ruhiger, aber die Sonne zeigt sich noch – hier sind Orte, die auch jetzt noch einen Besuch wert sind.",
  },
  offSeason: {
    title: "Vorfreude auf den nächsten Sommer",
    text: "Der Sommer ist vorbei – aber wir sammeln schon neue Tipps für warme Tage im nächsten Jahr!",
  },
};
const seasonMap: string[] = [
  "offSeason", // January
  "offSeason", // February
  "offSeason", // March
  "spring", // April
  "spring", // May
  "seasonStart", // June
  "summerSeason", // July
  "summerSeason", // August
  "endSeason", // September
  "startOffseason", // October
  "offSeason", // November
  "offSeason", // December
];
export function getBannerContentByMonth() {
  const month = new Date().getMonth();
  type SeasonKey = keyof typeof sommerBannerTexts;
  const seasonKey: SeasonKey = seasonMap[month] as SeasonKey;

  return sommerBannerTexts[seasonKey];
}
