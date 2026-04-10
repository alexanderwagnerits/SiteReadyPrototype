/**
 * berechneVarianten - Automatische Section-Varianten basierend auf Content
 *
 * Wird aufgerufen bei: Generierung, Import, Portal-Save
 * Ergebnis wird in varianten_cache (jsonb) gespeichert
 */

// Branche → Gruppe Mapping (synchron mit BRANCHEN in App.js)
const BRANCHE_GRUPPE = {
  elektro:"handwerk",installateur:"handwerk",maler:"handwerk",tischler:"handwerk",fliesenleger:"handwerk",schlosser:"handwerk",dachdecker:"handwerk",zimmerei:"handwerk",maurer:"handwerk",bodenleger:"handwerk",glaser:"handwerk",gaertner:"handwerk",klima:"handwerk",reinigung:"handwerk",baumeister:"handwerk",kfz:"handwerk",aufsperrdienst:"handwerk",hafner:"handwerk",raumausstatter:"handwerk",goldschmied:"handwerk",schneider:"handwerk",rauchfangkehrer:"handwerk",schaedlingsbekaempfung:"handwerk",
  friseur:"kosmetik",kosmetik:"kosmetik",nagel:"kosmetik",massage:"kosmetik",tattoo:"kosmetik",fusspflege:"kosmetik",permanent_makeup:"kosmetik",hundesalon:"kosmetik",
  restaurant:"gastro",cafe:"gastro",baeckerei:"gastro",catering:"gastro",bar:"gastro",heuriger:"gastro",imbiss:"gastro",fleischerei:"gastro",
  arzt:"gesundheit",zahnarzt:"gesundheit",physiotherapie:"gesundheit",psychotherapie:"gesundheit",tierarzt:"gesundheit",apotheke:"gesundheit",optiker:"gesundheit",heilpraktiker:"gesundheit",ergotherapie:"gesundheit",logopaedie:"gesundheit",energetiker:"gesundheit",hebamme:"gesundheit",diaetologe:"gesundheit",hoerakustiker:"gesundheit",zahntechnik:"gesundheit",heilmasseur:"gesundheit",
  steuerberater:"dienstleistung",rechtsanwalt:"dienstleistung",fotograf:"dienstleistung",versicherung:"dienstleistung",immobilien:"dienstleistung",hausverwaltung:"dienstleistung",umzug:"dienstleistung",eventplanung:"dienstleistung",florist:"dienstleistung",architekt:"dienstleistung",it_service:"dienstleistung",werbeagentur:"dienstleistung",bestattung:"dienstleistung",notar:"dienstleistung",finanzberater:"dienstleistung",reisebuero:"dienstleistung",innenarchitekt:"dienstleistung",textilreinigung:"dienstleistung",
  fahrschule:"bildung",nachhilfe:"bildung",musikschule:"bildung",trainer:"bildung",yoga:"bildung",hundeschule:"bildung",tanzschule:"bildung",reitschule:"bildung",schwimmschule:"bildung",
};

function berechneVarianten(data) {
  const d = data || {};

  // Hero: Stil bestimmt Default, Kunde kann im Portal überschreiben
  const hatHeroBild = !!(d.hero_image);
  const stil = d.stil || "klassisch";

  // Wenn Kunde manuell gewählt hat (Portal) → beibehalten
  let hero = d.hero_override || null;
  if (!hero) {
    // Auto-Default nach Stil
    if (!hatHeroBild) {
      hero = "minimal"; // Kein Bild → zentriert, kein Bild
    } else if (stil === "elegant") {
      hero = "fullscreen"; // Immersiv, Premium
    } else if (stil === "modern") {
      hero = "split"; // Clean, Bild als eigenständiges Element
    } else {
      hero = "fullscreen"; // Klassisch + Custom → bewährt, seriös
    }
  }

  // Leistungen: Anzahl + Foto-Anteil
  const leistungen = Array.isArray(d.leistungen) ? d.leistungen : [];
  const leistAnzahl = leistungen.length;
  const leistMitFoto = leistungen.filter(l => l && l.foto).length;
  const fotoAnteil = leistAnzahl > 0 ? leistMitFoto / leistAnzahl : 0;
  const leist = leistAnzahl > 5 ? 'grid'
    : fotoAnteil >= 0.5 ? 'editorial'
    : 'grid';

  // Ablauf: Step-Anzahl
  const ablaufSteps = Array.isArray(d.ablauf) ? d.ablauf.length : 0;
  const ablauf = ablaufSteps > 4 ? 'vertikal' : 'horizontal';

  // Bewertungen: Anzahl
  const bewAnzahl = Array.isArray(d.bewertungen) ? d.bewertungen.length : 0;
  const bewertungen = bewAnzahl === 1 ? 'blockquote' : 'cards';

  // Team: Anzahl
  const teamAnzahl = Array.isArray(d.team) ? d.team.length : 0;
  const team = teamAnzahl === 1 ? 'single'
    : teamAnzahl <= 3 ? 'grid-3'
    : 'grid-4';

  // FAQ: Anzahl
  const faqAnzahl = Array.isArray(d.faq) ? d.faq.length : 0;
  const faq = faqAnzahl <= 2 ? 'einspaltig' : 'zweispaltig';

  // Galerie: Anzahl
  const galerieAnzahl = Array.isArray(d.galerie) ? d.galerie.length : 0;
  const galerie = galerieAnzahl <= 4 ? 'grid-2x2' : 'grid-3x2';

  // Kontakt: Map vorhanden
  const kontakt = d.adresse || d.plz ? 'mit-map' : 'ohne-map';

  return {
    hero,
    leistungen: leist,
    ablauf,
    bewertungen,
    team,
    faq,
    galerie,
    kontakt
  };
}

export { berechneVarianten };
