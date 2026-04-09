/**
 * berechneVarianten - Automatische Section-Varianten basierend auf Content
 *
 * Wird aufgerufen bei: Generierung, Import, Portal-Save
 * Ergebnis wird in varianten_cache (jsonb) gespeichert
 */

function berechneVarianten(data) {
  const d = data || {};

  // Hero: Bildformat bestimmt Variante
  const heroRatio = parseFloat(d.hero_image_ratio) || 0;
  const hatHeroBild = !!(d.hero_image);
  const hero = !hatHeroBild ? 'minimal'
    : heroRatio <= 1.2 ? 'split'
    : 'fullscreen';

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
