/**
 * berechneVarianten - Automatische Section-Varianten basierend auf Content
 *
 * Wird aufgerufen bei: Generierung, Import, Portal-Save
 * Ergebnis wird in varianten_cache (jsonb) gespeichert
 */

function berechneVarianten(data) {
  const d = data || {};
  const stil = d.stil || "klassisch";

  // ── Hero ──
  // url_hero (Upload/Import) oder hero_image (Legacy)
  // fullscreen = Default fuer alle Stile (wenn eigenes Bild da)
  // minimal   = wenn kein Bild ODER Bild ist Platzhalter (verhindert "billig wirkende"
  //             Stock-Fotos als Fullscreen-Hero)
  // split     = nur via hero_override (Opt-in im Portal)
  const hatEigenesHeroBild = !!(d.url_hero || d.hero_image) && !d.hero_is_placeholder;
  let hero = d.hero_override || null;
  if (!hero) {
    hero = hatEigenesHeroBild ? "fullscreen" : "minimal";
  }

  // ── Leistungen ──
  // leistungen ist ein String-Array ["Cocktails", ...]. Die Fotos liegen separat
  // in leistungen_fotos: { "Cocktails": "url", ... }. Vorher wurde l.foto auf
  // Strings geprueft — immer undefined — editorial-Variante war dead code.
  const leistAnzahl = Array.isArray(d.leistungen) ? d.leistungen.length : 0;
  const leistMitFoto = d.leistungen_fotos && typeof d.leistungen_fotos === 'object'
    ? Object.values(d.leistungen_fotos).filter(Boolean).length
    : 0;
  const fotoAnteil = leistAnzahl > 0 ? leistMitFoto / leistAnzahl : 0;
  const leist = fotoAnteil >= 0.5 ? 'editorial' : 'grid';

  // ── Ablauf ──
  // Bei Gastro + Kosmetik ergibt "Anfrage → Beratung → Umsetzung" keinen Sinn
  // (man kommt einfach vorbei). Default off — User kann im Portal aktivieren.
  const GRUPPE = {
    restaurant:"gastro",cafe:"gastro",bar:"gastro",heuriger:"gastro",imbiss:"gastro",
    pizzeria:"gastro",eissalon:"gastro",baeckerei:"gastro",fleischerei:"gastro",
    vinothek:"gastro",winzer:"gastro",catering:"gastro",
    friseur:"kosmetik",kosmetik:"kosmetik",nagel:"kosmetik",massage:"kosmetik",
    tattoo:"kosmetik",fusspflege:"kosmetik",permanent_makeup:"kosmetik",
    hundesalon:"kosmetik",barbershop:"kosmetik",spa:"kosmetik",
  };
  const gruppe = GRUPPE[d.branche] || null;
  const ablauf = (gruppe === 'gastro' || gruppe === 'kosmetik') ? null : 'horizontal';

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
