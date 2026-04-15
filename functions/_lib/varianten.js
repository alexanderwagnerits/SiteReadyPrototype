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
  const stil = d.stil || "klassisch";
  const gruppe = BRANCHE_GRUPPE[d.branche] || "";

  // ── Hero ──
  // url_hero (Upload/Import) oder hero_image (Legacy)
  const hatHeroBild = !!(d.url_hero || d.hero_image);
  let hero = d.hero_override || null;
  if (!hero) {
    if (!hatHeroBild) {
      hero = "minimal";
    } else if (stil === "elegant") {
      hero = "fullscreen";
    } else if (stil === "modern") {
      hero = "split";
    } else {
      hero = "fullscreen";
    }
  }

  // ── Leistungen ──
  const leistungen = Array.isArray(d.leistungen) ? d.leistungen : [];
  const leistAnzahl = leistungen.length;
  const leistMitFoto = leistungen.filter(l => l && l.foto).length;
  const fotoAnteil = leistAnzahl > 0 ? leistMitFoto / leistAnzahl : 0;
  const leist = fotoAnteil >= 0.5 ? 'editorial' : 'grid';

  // ── Ablauf ──
  const ablaufSteps = Array.isArray(d.ablauf) ? d.ablauf.length : 0;
  // Vertikal wirkt bei Handwerk/Gesundheit/DL professioneller
  // Horizontal nur bei genau 3 Steps und Bildungs-/Gastro-Branchen
  const ablauf = ablaufSteps > 4 ? 'vertikal'
    : ablaufSteps === 3 && (gruppe === "bildung" || gruppe === "gastro") ? 'horizontal'
    : 'vertikal';

  // ── Bewertungen ──
  const bewAnzahl = Array.isArray(d.bewertungen) ? d.bewertungen.length : 0;
  // 1-3: Blockquote (Hauptbewertung groß, Rest als kleine Cards)
  // 4+: Grid Cards (zu viele fuer Blockquote)
  const bewertungen = bewAnzahl <= 3 ? 'blockquote' : 'cards';

  // ── Team ──
  const teamAnzahl = Array.isArray(d.team) ? d.team.length : 0;
  const team = teamAnzahl === 1 ? 'single'
    : teamAnzahl <= 3 ? 'grid-3'
    : 'grid-4';

  // ── FAQ ──
  const faqAnzahl = Array.isArray(d.faq) ? d.faq.length : 0;
  // Einspaltig wirkt ruhiger bei wenig Fragen, zweispaltig nutzt Platz bei vielen
  const faq = faqAnzahl <= 4 ? 'einspaltig' : 'zweispaltig';

  // ── Galerie ──
  const galerieAnzahl = Array.isArray(d.galerie) ? d.galerie.length : 0;
  const galerie = galerieAnzahl <= 4 ? 'grid-2x2' : 'grid-3x2';

  // ── Partner/Referenzen (nur mit Logos sichtbar) ──
  const partnerMitLogo = Array.isArray(d.partner) ? d.partner.filter(p => p && p.url_logo).length : 0;
  // gross: 1-2 Logos groß zentriert
  // einzeilig: 3-4 Logos normal in einer Zeile
  // zweizeilig: 5-8 Logos in 2 Zeilen (Grid 4er)
  const partner = partnerMitLogo <= 2 ? 'gross'
    : partnerMitLogo <= 4 ? 'einzeilig'
    : 'zweizeilig';

  // ── Kontakt ──
  const kontakt = d.adresse || d.plz ? 'mit-map' : 'ohne-map';

  return { hero, leistungen: leist, ablauf, bewertungen, team, faq, galerie, partner, kontakt };
}

export { berechneVarianten };
