/* ═══ Social Media Helper ═══ */
export const SOCIAL_BASES = {
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/company/',
  tiktok: 'https://tiktok.com/@',
};

export function normalizeSocial(platform, val) {
  if (!val) return '';
  val = val.trim();
  if (!val) return '';
  // Schon eine URL → so lassen
  if (val.startsWith('http://') || val.startsWith('https://') || val.includes('.com/')) return val;
  // @ am Anfang entfernen
  val = val.replace(/^@/, '');
  if (!val) return '';
  return (SOCIAL_BASES[platform] || 'https://') + val;
}

/* ═══ DATA ═══ */
export const FT_ALLGEMEIN = [
  'buchungslink',
  'terminvereinbarung',
  'erstgespraech_gratis',
  'online_beratung',
  'hausbesuche',
  'barrierefrei',
  'parkplaetze',
  'kartenzahlung',
  'preisliste',
  'ratenzahlung',
  'gutscheine',
  'zertifiziert',
];
export const FT_HANDWERK = ['notdienst', 'meisterbetrieb', 'kostenvoranschlag', 'foerderungsberatung'];
export const FT_GASTRO = ['gastgarten', 'takeaway', 'lieferservice'];
export const FT_GESUNDHEIT = ['kassenvertrag', 'notdienst'];
export const FT_DIENSTLEISTUNG = ['kostenvoranschlag'];

export const BRANCHEN_GRUPPEN = {
  handwerk: { label: 'Handwerk', features: FT_HANDWERK },
  kosmetik: { label: 'Kosmetik & Körperpflege', features: [] },
  gastro: { label: 'Gastronomie', features: FT_GASTRO },
  gesundheit: { label: 'Gesundheit', features: FT_GESUNDHEIT },
  dienstleistung: { label: 'Dienstleistungen', features: FT_DIENSTLEISTUNG },
  bildung: { label: 'Bildung & Training', features: [] },
};

// Farbpaletten pro Branchengruppe (Ref: echte Premium-Websites + Stilkategorien)
export const GRUPPEN_PALETTEN = {
  handwerk:      { custom_color: '#1a1a1a', custom_accent: '#b08d57', custom_bg: '#f4f4f2', custom_text: '#1a1a1a', custom_text_muted: '#6b6b6b', custom_sep: '#e5e5e3' },
  kosmetik:      { custom_color: '#2d3b2d', custom_accent: '#c4917a', custom_bg: '#f5f0ea', custom_text: '#1c1917', custom_text_muted: '#8a8278', custom_sep: '#e6e0d6' },
  gastro:        { custom_color: '#2d1215', custom_accent: '#a0522d', custom_bg: '#f9f5ee', custom_text: '#2c1810', custom_text_muted: '#7a7068', custom_sep: '#ece5d8' },
  gesundheit:    { custom_color: '#0f2b3c', custom_accent: '#15779b', custom_bg: '#ffffff', custom_text: '#1e1e1e', custom_text_muted: '#757575', custom_sep: '#e8e8e8' },
  dienstleistung:{ custom_color: '#2f3529', custom_accent: '#8a7e5a', custom_bg: '#f2f2ef', custom_text: '#2f3529', custom_text_muted: '#7a7a72', custom_sep: '#e0e0db' },
  bildung:       { custom_color: '#1a1a2e', custom_accent: '#5642e8', custom_bg: '#f8f8fa', custom_text: '#1a1a2e', custom_text_muted: '#6b6b80', custom_sep: '#e2e2ea' },
};

export const BRANCHEN = [
  // Handwerk
  { value: 'elektro',          label: 'Elektroinstallationen',            gruppe: 'handwerk', leistungen: ['Elektroinstallationen','Störungsbehebung & Reparatur','Smart Home Systeme','Photovoltaik & Speicher','Beleuchtungstechnik','Notdienst 24/7'], stil: 'klassisch' },
  { value: 'installateur',     label: 'Installateur / Heizung / Sanitär', gruppe: 'handwerk', leistungen: ['Heizungsinstallation & Wartung','Sanitärinstallationen','Rohrreinigung','Badsanierung','Wärmepumpen','Notdienst 24/7'], stil: 'klassisch' },
  { value: 'maler',            label: 'Malerei & Anstrich',               gruppe: 'handwerk', leistungen: ['Innenmalerei','Fassadenanstrich','Tapezierarbeiten','Lackierarbeiten','Schimmelbehandlung','Farbberatung'], stil: 'modern' },
  { value: 'tischler',         label: 'Tischlerei',                       gruppe: 'handwerk', leistungen: ['Möbel nach Maß','Küchenbau','Innenausbau','Fenster & Türen','Reparaturen','Restaurierung'], stil: 'elegant' },
  { value: 'fliesenleger',     label: 'Fliesenleger / Plattenleger',      gruppe: 'handwerk', leistungen: ['Fliesenverlegung','Badsanierung','Natursteinarbeiten','Terrassenplatten','Abdichtungen','Reparaturen'], stil: 'modern' },
  { value: 'schlosser',        label: 'Schlosserei / Metallbau',          gruppe: 'handwerk', leistungen: ['Stahl- & Metallbau','Geländer & Zäune','Tore & Türen','Schweißarbeiten','Aufsperrdienst','Sonderanfertigungen'], stil: 'klassisch' },
  { value: 'dachdecker',       label: 'Dachdecker / Spengler',            gruppe: 'handwerk', leistungen: ['Dachsanierung','Dachdämmung','Flachdach','Dachrinnen & Spenglerarbeiten','Dachfenster','Notdienst'], stil: 'elegant' },
  { value: 'zimmerei',         label: 'Zimmerei',                         gruppe: 'handwerk', leistungen: ['Dachstühle & Holzbau','Carports & Terrassen','Aufstockungen','Holzfassaden','Sanierung & Altholz','Sonderanfertigungen'], stil: 'elegant' },
  { value: 'maurer',           label: 'Maurer / Baumeister',              gruppe: 'handwerk', leistungen: ['Rohbau & Mauerwerk','Zu- & Umbauten','Sanierung & Renovierung','Fassadenarbeiten','Estricharbeiten','Abbrucharbeiten'], stil: 'klassisch' },
  { value: 'bodenleger',       label: 'Bodenleger / Parkett',             gruppe: 'handwerk', leistungen: ['Parkettverlegung','Laminat & Vinyl','Schleifen & Versiegeln','Teppichboden','Reparaturen','Bodenberatung'], stil: 'modern' },
  { value: 'glaser',           label: 'Glaser',                           gruppe: 'handwerk', leistungen: ['Glasreparaturen','Isolierglas','Spiegel & Glasmöbel','Duschwände','Glasfassaden','Notdienst'], stil: 'modern' },
  { value: 'gaertner',         label: 'Gärtner / Landschaftsbau',         gruppe: 'handwerk', leistungen: ['Gartengestaltung','Pflasterarbeiten','Bepflanzung & Pflege','Bewässerungssysteme','Zaunbau','Baumschnitt & Pflege'], stil: 'modern' },
  { value: 'klima',            label: 'Klimatechnik / Lüftung',           gruppe: 'handwerk', leistungen: ['Klimaanlagen Installation','Lüftungsanlagen','Wartung & Service','Wärmepumpen','Kühltechnik','Notdienst'], stil: 'klassisch' },
  { value: 'reinigung',        label: 'Reinigung / Gebäudeservice',       gruppe: 'handwerk', leistungen: ['Gebäudereinigung','Fensterreinigung','Grundreinigung','Teppichreinigung','Fassadenreinigung','Winterdienst'], stil: 'modern' },
  { value: 'kfz',              label: 'KFZ-Werkstatt / Mechaniker',       gruppe: 'handwerk', leistungen: ['KFZ-Service & Inspektion','Reparaturen','Pickerl (§57a)','Reifenservice','Klimaanlagen-Service','Lackierung & Karosserie'], stil: 'klassisch' },
  { value: 'aufsperrdienst',   label: 'Aufsperrdienst / Schlüsseldienst', gruppe: 'handwerk', leistungen: ['Türöffnung','Schlossaustausch','Schließanlagen','Sicherheitsberatung','Tresoröffnung','Notdienst 24/7'], stil: 'klassisch' },
  { value: 'hafner',           label: 'Hafner / Ofenbau',                 gruppe: 'handwerk', leistungen: ['Kachelofenbau','Kaminbau','Ofensanierung','Fliesenarbeiten','Ofenplanung & Beratung','Wartung & Reinigung'], stil: 'elegant' },
  { value: 'raumausstatter',   label: 'Raumausstatter / Polsterer',       gruppe: 'handwerk', leistungen: ['Polsterarbeiten','Vorhänge & Gardinen','Sonnenschutz','Bodenbeläge','Wandgestaltung','Raumplanung'], stil: 'modern' },
  { value: 'goldschmied',      label: 'Goldschmied / Juwelier',           gruppe: 'handwerk', leistungen: ['Schmuckherstellung','Reparaturen','Gravuren','Trauringe','Edelsteinarbeiten','Beratung'], stil: 'elegant' },
  { value: 'schneider',        label: 'Schneider / Änderungsschneiderei', gruppe: 'handwerk', leistungen: ['Änderungen & Reparaturen','Maßanfertigungen','Hochzeitsmode','Lederarbeiten','Vorhänge & Textilien','Beratung'], stil: 'elegant' },
  { value: 'rauchfangkehrer',  label: 'Rauchfangkehrer',                  gruppe: 'handwerk', leistungen: ['Kehrung & Überprüfung','Abgasmessung','Feuerstättenbescheid','Brandschutzberatung','Kamininspektion','Gutachten'], stil: 'klassisch' },
  { value: 'schaedlingsbekaempfung', label: 'Schädlingsbekämpfung',       gruppe: 'handwerk', leistungen: ['Insektenbekämpfung','Nagetierbekämpfung','Taubenabwehr','Holzschutz','Desinfektion','Beratung & Prävention'], stil: 'klassisch' },
  { value: 'fahrradwerkstatt', label: 'Fahrradwerkstatt',                 gruppe: 'handwerk', leistungen: ['Reparatur & Service','E-Bike-Service','Fahrradcheck','Ersatzteile','Reifenwechsel','Individuelle Beratung'], stil: 'modern' },
  { value: 'erdbau',           label: 'Erdbau / Baggerungen',             gruppe: 'handwerk', leistungen: ['Baggerarbeiten','Aushubarbeiten','Planierungen','Kanalbau','Wegebau','Transporte'], stil: 'klassisch' },
  // Kosmetik & Körperpflege
  { value: 'kosmetik',         label: 'Kosmetikstudio',                   gruppe: 'kosmetik', leistungen: ['Gesichtsbehandlungen','Körperpflege & Peeling','Waxing & Haarentfernung','Anti-Aging-Behandlungen','Augenbrauen & Wimpern','Beratung & Pflegeroutine'], stil: 'modern' },
  { value: 'friseur',          label: 'Friseursalon',                     gruppe: 'kosmetik', leistungen: ['Haarschnitt Damen & Herren','Färben & Strähnchen','Hochzeitsstyling','Haarbehandlungen','Kinder-Haarschnitt','Bartpflege'], stil: 'modern' },
  { value: 'nagel',            label: 'Nagelstudio',                      gruppe: 'kosmetik', leistungen: ['Gel-Nägel & Shellac','Nagelverlängerung','Nail Art & Design','Nagelreparatur','Fußpflege & Nagellack','Beratung'], stil: 'modern' },
  { value: 'massage',          label: 'Massage & Wellness',               gruppe: 'kosmetik', leistungen: ['Klassische Massage','Sportmassage','Entspannungsmassage','Hot-Stone-Massage','Triggerpunkt-Therapie','Lymphdrainage'], stil: 'modern' },
  { value: 'tattoo',           label: 'Tattoo & Piercing',                gruppe: 'kosmetik', leistungen: ['Custom Tattoos','Cover-ups & Korrekturen','Piercing','Beratung & Design','Pflege & Nachsorge','Laser-Entfernung'], stil: 'klassisch' },
  { value: 'fusspflege',       label: 'Fußpflege',                        gruppe: 'kosmetik', leistungen: ['Medizinische Fußpflege','Nagelpflege & Korrektur','Hornhautentfernung','Fußpeeling & Entspannungsbad','Diabetische Fußpflege','Beratung'], stil: 'klassisch' },
  { value: 'permanent_makeup', label: 'Permanent Make-up & Wimpern',      gruppe: 'kosmetik', leistungen: ['Microblading','Permanent Make-up Lippen','Wimpernverlängerung','Wimpernlifting','Augenbrauen-Styling','Touch-up & Nachbehandlung'], stil: 'modern' },
  { value: 'hundesalon',       label: 'Hundesalon / Tierbetreuung',       gruppe: 'kosmetik', leistungen: ['Hundefrisur & Pflege','Baden & Föhnen','Krallenpflege','Tierbetreuung','Gassi-Service','Hundetraining'], stil: 'modern' },
  // Gastronomie
  { value: 'restaurant',       label: 'Restaurant / Gasthaus',            gruppe: 'gastro', leistungen: ['Speisekarte','Tagesmenü','Catering','Reservierung','Veranstaltungen','Lieferservice'], stil: 'elegant' },
  { value: 'cafe',             label: 'Café / Konditorei',                gruppe: 'gastro', leistungen: ['Frühstück','Kuchen & Torten','Kaffeespezialitäten','Catering','Veranstaltungen','Take-away'], stil: 'modern' },
  { value: 'bar',              label: 'Bar / Lounge',                     gruppe: 'gastro', leistungen: ['Cocktails & Drinks','Events & Partys','DJ & Live-Musik','Private Feiern','Afterwork','Catering'], stil: 'klassisch' },
  { value: 'heuriger',         label: 'Heuriger / Buschenschank',         gruppe: 'gastro', leistungen: ['Eigenbauweine','Kalte Jause','Saisonale Schmankerl','Gartenbereich','Weinverkostung','Veranstaltungen'], stil: 'elegant' },
  { value: 'imbiss',           label: 'Imbiss / Foodtruck',               gruppe: 'gastro', leistungen: ['Speisekarte','Mittagsmenü','Lieferservice','Catering','Take-away','Events'], stil: 'modern' },
  { value: 'catering',         label: 'Catering / Partyservice',          gruppe: 'gastro', leistungen: ['Firmenevents','Hochzeiten','Buffets','Menü-Planung','Getränkeservice','Dekoration'], stil: 'klassisch' },
  { value: 'baeckerei',        label: 'Bäckerei / Konditor',              gruppe: 'gastro', leistungen: ['Brot & Gebäck','Torten & Kuchen','Frühstück','Catering','Saisongebäck','Bestellung & Vorbestellung'], stil: 'elegant' },
  { value: 'fleischerei',      label: 'Fleischerei / Metzger',            gruppe: 'gastro', leistungen: ['Frischfleisch','Wurst & Aufschnitt','Catering & Partyplatten','Grillspezialitäten','Regionale Produkte','Vorbestellung'], stil: 'klassisch' },
  { value: 'winzer',           label: 'Winzer / Weinbau',                 gruppe: 'gastro', leistungen: ['Eigenbauweine','Ab-Hof-Verkauf','Weinverkostung','Kellerführung','Feste & Events','Online-Shop'], stil: 'elegant' },
  // Gesundheit
  { value: 'physiotherapie',   label: 'Physiotherapie',                   gruppe: 'gesundheit', leistungen: ['Manuelle Therapie','Bewegungstherapie','Sportphysiotherapie','Lymphdrainage','Elektrotherapie','Hausbesuche'], stil: 'klassisch' },
  { value: 'arzt',             label: 'Arztpraxis / Ordination',          gruppe: 'gesundheit', leistungen: ['Allgemeinmedizin','Vorsorgeuntersuchung','Gesundenuntersuchung','Impfungen','Hausbesuche','Akutversorgung'], stil: 'klassisch' },
  { value: 'zahnarzt',         label: 'Zahnarztpraxis',                   gruppe: 'gesundheit', leistungen: ['Zahnreinigung','Füllungen','Zahnersatz','Implantate','Kieferorthopädie','Ästhetische Zahnmedizin'], stil: 'klassisch' },
  { value: 'tierarzt',         label: 'Tierarztpraxis',                   gruppe: 'gesundheit', leistungen: ['Vorsorge & Impfungen','Chirurgie','Zahnmedizin','Notfallversorgung','Hausbesuche','Ernährungsberatung'], stil: 'klassisch' },
  { value: 'apotheke',         label: 'Apotheke',                         gruppe: 'gesundheit', leistungen: ['Rezepteinlösung','Beratung','Naturheilmittel','Kosmetik','Vorbestellung','Lieferservice'], stil: 'klassisch' },
  { value: 'optiker',          label: 'Optiker',                          gruppe: 'gesundheit', leistungen: ['Sehtest','Brillen','Kontaktlinsen','Sonnenbrillen','Reparaturen','Beratung'], stil: 'modern' },
  { value: 'psychotherapie',   label: 'Psychotherapie',                   gruppe: 'gesundheit', leistungen: ['Einzeltherapie','Paartherapie','Kinder- & Jugendtherapie','Krisenintervention','Online-Therapie','Erstgespräch'], stil: 'klassisch' },
  { value: 'ergotherapie',     label: 'Ergotherapie',                     gruppe: 'gesundheit', leistungen: ['Handtherapie','Kinder-Ergotherapie','Neurologische Therapie','Arbeitsplatzberatung','Hilfsmittelberatung','Hausbesuche'], stil: 'klassisch' },
  { value: 'logopaedie',       label: 'Logopädie',                        gruppe: 'gesundheit', leistungen: ['Sprachtherapie','Stimmtherapie','Schlucktherapie','Kinder-Sprachförderung','Stotterbehandlung','Hausbesuche'], stil: 'klassisch' },
  { value: 'energetiker',      label: 'Energetiker / Humanenergetiker',   gruppe: 'gesundheit', leistungen: ['Energetische Körperarbeit','Meridianarbeit','Aromatherapie','Kinesiologie','Klangschalentherapie','Beratung'], stil: 'modern' },
  { value: 'hebamme',          label: 'Hebamme',                          gruppe: 'gesundheit', leistungen: ['Schwangerschaftsbetreuung','Geburtsvorbereitung','Nachsorge','Stillberatung','Rückbildung','Hausbesuche'], stil: 'klassisch' },
  { value: 'diaetologe',       label: 'Diätologe / Ernährungsberatung',   gruppe: 'gesundheit', leistungen: ['Ernährungsberatung','Diätplanung','Stoffwechselanalyse','Gewichtsmanagement','Sporternährung','Erstgespräch'], stil: 'modern' },
  { value: 'hoerakustiker',    label: 'Hörakustiker',                     gruppe: 'gesundheit', leistungen: ['Hörtest','Hörgeräte-Anpassung','Service & Reparatur','Gehörschutz','Tinnitus-Beratung','Erstberatung'], stil: 'klassisch' },
  { value: 'zahntechnik',      label: 'Zahntechnik',                      gruppe: 'gesundheit', leistungen: ['Kronen & Brücken','Prothesen','Implantatsuprakonstruktion','Veneers','Schienen','Reparaturen'], stil: 'klassisch' },
  { value: 'heilmasseur',      label: 'Heilmasseur',                      gruppe: 'gesundheit', leistungen: ['Heilmassage','Lymphdrainage','Reflexzonenmassage','Bindegewebsmassage','Sportmassage','Hausbesuche'], stil: 'klassisch' },
  { value: 'osteopath',        label: 'Osteopath',                        gruppe: 'gesundheit', leistungen: ['Osteopathische Behandlung','Cranio-Sacral-Therapie','Viszerale Osteopathie','Kinderosteopathie','Sportosteopathie','Erstanamnese'], stil: 'modern' },
  { value: 'lebensberater',    label: 'Lebens- und Sozialberater',        gruppe: 'gesundheit', leistungen: ['Lebensberatung','Paarberatung','Stressbewältigung','Konfliktlösung','Krisenbegleitung','Erstgespräch'], stil: 'modern' },
  // Dienstleistungen
  { value: 'steuerberater',    label: 'Steuerberater / Buchhaltung',      gruppe: 'dienstleistung', leistungen: ['Buchhaltung','Jahresabschluss','Steuererklärung','Lohnverrechnung','Gründungsberatung','Unternehmensberatung'], stil: 'klassisch' },
  { value: 'rechtsanwalt',     label: 'Rechtsanwalt / Kanzlei',           gruppe: 'dienstleistung', leistungen: ['Vertragsrecht','Arbeitsrecht','Familienrecht','Mietrecht','Strafrecht','Erstberatung'], stil: 'klassisch' },
  { value: 'versicherung',     label: 'Versicherungsmakler',              gruppe: 'dienstleistung', leistungen: ['Versicherungsvergleich','Beratung','Schadensabwicklung','Vorsorge','Firmenversicherung','Erstgespräch'], stil: 'klassisch' },
  { value: 'immobilien',       label: 'Immobilienmakler',                 gruppe: 'dienstleistung', leistungen: ['Verkauf','Vermietung','Bewertung','Beratung','Besichtigungen','Verwaltung'], stil: 'klassisch' },
  { value: 'hausverwaltung',   label: 'Hausverwaltung',                   gruppe: 'dienstleistung', leistungen: ['Objektverwaltung','Betriebskostenabrechnung','Eigentümervertretung','Mieterverwaltung','Instandhaltung','Sanierungsbetreuung'], stil: 'klassisch' },
  { value: 'umzug',            label: 'Umzug / Transport',                gruppe: 'dienstleistung', leistungen: ['Privatumzüge','Firmenumzüge','Entrümpelung','Möbelmontage','Lagerung','Verpackungsservice'], stil: 'modern' },
  { value: 'eventplanung',     label: 'Eventplanung / DJ',                gruppe: 'dienstleistung', leistungen: ['Hochzeiten','Firmenfeiern','Geburtstage','DJ-Service','Dekoration','Technikverleih'], stil: 'modern' },
  { value: 'fotograf',         label: 'Fotograf / Videograf',             gruppe: 'dienstleistung', leistungen: ['Hochzeitsfotografie','Businessfotos','Produktfotografie','Eventfotografie','Videoproduktion','Bildbearbeitung'], stil: 'modern' },
  { value: 'florist',          label: 'Florist / Blumenladen',            gruppe: 'dienstleistung', leistungen: ['Sträuße & Gestecke','Hochzeitsfloristik','Trauerfloristik','Dekoration','Zimmerpflanzen','Lieferservice'], stil: 'elegant' },
  { value: 'architekt',        label: 'Architekt / Planungsbüro',         gruppe: 'dienstleistung', leistungen: ['Entwurfsplanung','Einreichplanung','Ausführungsplanung','Bauleitung','Sanierungsplanung','Beratung'], stil: 'elegant' },
  { value: 'it_service',       label: 'IT-Service / EDV-Betreuung',       gruppe: 'dienstleistung', leistungen: ['IT-Support','Netzwerk & Server','Cloud-Lösungen','Datensicherung','Software-Beratung','Wartungsverträge'], stil: 'modern' },
  { value: 'werbeagentur',     label: 'Werbeagentur / Grafik & Design',   gruppe: 'dienstleistung', leistungen: ['Corporate Design','Webdesign','Print & Drucksorten','Social Media','Fotografie','Kampagnenplanung'], stil: 'modern' },
  { value: 'bestattung',       label: 'Bestattung',                       gruppe: 'dienstleistung', leistungen: ['Erdbestattung','Feuerbestattung','Trauerfeier','Überführung','Vorsorge','Beratung & Begleitung'], stil: 'elegant' },
  { value: 'notar',            label: 'Notar',                            gruppe: 'dienstleistung', leistungen: ['Kaufverträge','Gesellschaftsverträge','Beglaubigungen','Verlassenschaften','Eheverträge','Vorsorgevollmacht'], stil: 'klassisch' },
  { value: 'finanzberater',    label: 'Finanzberater / Vermögensberatung',gruppe: 'dienstleistung', leistungen: ['Vermögensaufbau','Altersvorsorge','Finanzplanung','Kreditberatung','Veranlagung','Erstgespräch'], stil: 'klassisch' },
  { value: 'reisebuero',       label: 'Reisebüro',                        gruppe: 'dienstleistung', leistungen: ['Pauschalreisen','Individualreisen','Flugbuchung','Kreuzfahrten','Gruppenreisen','Reiseversicherung'], stil: 'modern' },
  { value: 'innenarchitekt',   label: 'Innenarchitekt / Raumdesign',      gruppe: 'dienstleistung', leistungen: ['Raumkonzepte','Farbberatung','Möbelplanung','Lichtplanung','Materialberatung','Umbauplanung'], stil: 'elegant' },
  { value: 'textilreinigung',  label: 'Textilreinigung / Wäscherei',      gruppe: 'dienstleistung', leistungen: ['Chemische Reinigung','Hemdenservice','Lederreinigung','Teppichreinigung','Expressservice','Abhol- & Lieferservice'], stil: 'klassisch' },
  { value: 'unternehmensberater', label: 'Unternehmensberater',           gruppe: 'dienstleistung', leistungen: ['Strategieberatung','Organisationsentwicklung','Gründungsberatung','Fördermanagement','Prozessoptimierung','Coaching'], stil: 'klassisch' },
  { value: 'dolmetscher',      label: 'Dolmetscher / Übersetzer',         gruppe: 'dienstleistung', leistungen: ['Dolmetschen','Fachübersetzungen','Beglaubigte Übersetzungen','Konferenzdolmetschen','Gerichtsdolmetschen','Lektorat'], stil: 'elegant' },
  { value: 'druckerei',        label: 'Druckerei / Copyshop',             gruppe: 'dienstleistung', leistungen: ['Digitaldruck','Offsetdruck','Großformatdruck','Visitenkarten & Drucksorten','Bindung & Veredelung','Expressservice'], stil: 'modern' },
  { value: 'sicherheitsdienst',label: 'Sicherheitsdienst / Detektei',     gruppe: 'dienstleistung', leistungen: ['Objektbewachung','Veranstaltungsschutz','Alarmservice','Ermittlungen','Personenschutz','Beratung'], stil: 'klassisch' },
  // Bildung & Training
  { value: 'fahrschule',       label: 'Fahrschule',                       gruppe: 'bildung', leistungen: ['Führerschein B','Führerschein A','Auffrischungskurs','Erste-Hilfe-Kurs','Theoriekurs','Intensivkurs'], stil: 'klassisch' },
  { value: 'nachhilfe',        label: 'Nachhilfe / Lernhilfe',            gruppe: 'bildung', leistungen: ['Mathematik','Deutsch','Englisch','Physik','Prüfungsvorbereitung','Online-Nachhilfe'], stil: 'modern' },
  { value: 'musikschule',      label: 'Musikschule / Musiklehrer',        gruppe: 'bildung', leistungen: ['Klavierunterricht','Gitarrenunterricht','Gesangsunterricht','Schlagzeugunterricht','Musiktheorie','Bandcoaching'], stil: 'modern' },
  { value: 'trainer',          label: 'Personal Trainer / Fitness',       gruppe: 'bildung', leistungen: ['Personal Training','Gruppentraining','Ernährungsberatung','Online-Coaching','Firmenfitness','Reha-Training'], stil: 'modern' },
  { value: 'yoga',             label: 'Yoga / Pilates Studio',            gruppe: 'bildung', leistungen: ['Hatha Yoga','Vinyasa Yoga','Pilates','Meditation','Workshops','Online-Kurse'], stil: 'modern' },
  { value: 'hundeschule',      label: 'Hundeschule / Hundetrainer',       gruppe: 'bildung', leistungen: ['Welpenkurs','Grundgehorsam','Verhaltensberatung','Agility','Einzeltraining','Gruppenkurse'], stil: 'modern' },
  { value: 'tanzschule',       label: 'Tanzschule',                       gruppe: 'bildung', leistungen: ['Standardtänze','Lateintänze','Hochzeitstanz','Kindertanzen','Workshops','Privatstunden'], stil: 'elegant' },
  { value: 'reitschule',       label: 'Reitschule / Reitstall',           gruppe: 'bildung', leistungen: ['Reitunterricht','Longierstunden','Ausritte','Ferienkurse','Pferdeeinstellung','Beritt'], stil: 'elegant' },
  { value: 'schwimmschule',    label: 'Schwimmschule',                    gruppe: 'bildung', leistungen: ['Babyschwimmen','Kinderschwimmkurse','Erwachsenenkurse','Techniktraining','Aquafitness','Einzelunterricht'], stil: 'modern' },
  { value: 'coach',            label: 'Coach / Trainer (Business & Life)',gruppe: 'bildung', leistungen: ['Business Coaching','Life Coaching','Karriereberatung','Teamentwicklung','Workshops & Seminare','Online-Coaching'], stil: 'modern' },
  // Sonstige
  { value: 'sonstige',         label: 'Anderer Beruf (nicht in der Liste)', gruppe: 'sonstige', leistungen: [], stil: 'klassisch' },
];

export const getBrancheFeatures = (b) => {
  const br = BRANCHEN.find((x) => x.value === b);
  if (!br) return [];
  const g = BRANCHEN_GRUPPEN[br.gruppe];
  return [...FT_ALLGEMEIN, ...(g?.features || [])];
};

export const getBrancheGruppe = (b) => {
  const br = BRANCHEN.find((x) => x.value === b);
  return br?.gruppe ? BRANCHEN_GRUPPEN[br.gruppe] : null;
};

export const BUNDESLAENDER = [
  { value: 'wien', label: 'Wien' },
  { value: 'noe', label: 'Niederösterreich' },
  { value: 'ooe', label: 'Oberösterreich' },
  { value: 'stmk', label: 'Steiermark' },
  { value: 'sbg', label: 'Salzburg' },
  { value: 'tirol', label: 'Tirol' },
  { value: 'ktn', label: 'Kärnten' },
  { value: 'vbg', label: 'Vorarlberg' },
  { value: 'bgld', label: 'Burgenland' },
];

export const OEFFNUNGSZEITEN = [
  { value: 'mo-fr-8-17', label: 'Mo-Fr: 08:00-17:00' },
  { value: 'mo-fr-7-16', label: 'Mo-Fr: 07:00-16:00' },
  { value: 'mo-fr-8-18', label: 'Mo-Fr: 08:00-18:00' },
  { value: 'mo-sa-8-17', label: 'Mo-Sa: 08:00-17:00' },
  { value: 'mo-sa-8-12', label: 'Mo-Fr: 08:00-17:00, Sa: 08:00-12:00' },
  { value: 'vereinbarung', label: 'Nach Vereinbarung' },
  { value: 'custom', label: 'Eigene Zeiten eingeben' },
];

export const UNTERNEHMENSFORMEN = [
  { value: 'eu', label: 'Einzelunternehmen (e.U.)' },
  { value: 'einzelunternehmen', label: 'Einzelunternehmen (nicht eingetragen)' },
  { value: 'gmbh', label: 'GmbH' },
  { value: 'og', label: 'OG' },
  { value: 'kg', label: 'KG' },
  { value: 'ag', label: 'AG' },
  { value: 'verein', label: 'Verein' },
  { value: 'gesnbr', label: 'GesbR' },
];

export const STYLES_MAP = {
  klassisch: { label: 'Klassisch', desc: 'Seriös, klar strukturiert', primary: '#094067', accent: '#0369a1', accentSoft: 'rgba(3,105,161,0.07)', bg: '#f4f7fa', cardBg: '#fff', text: '#1e293b', textMuted: '#475569', textLight: '#90b4ce', borderColor: '#d8eefe', font: "'Inter',system-ui,sans-serif", radius: '4px', radiusLg: '6px', heroGradient: 'linear-gradient(160deg,#094067 0%,#062b44 50%,#0a1f42 100%)', heroOverlay: 'radial-gradient(circle at 70% 20%,rgba(3,105,161,0.08) 0%,transparent 60%)', shadow: 'none', badgeBg: '#d8eefe', badgeText: '#094067', btnRadius: '4px', cardBorder: true, cardShadow: false, badgeRadius: '4px', sectionDivider: true, spacing: 'compact' },
  modern:    { label: 'Modern', desc: 'Dynamisch, frisch, mit Akzenten', primary: '#18181b', accent: '#4f46e5', accentSoft: 'rgba(79,70,229,0.07)', bg: '#fafafa', cardBg: '#fff', text: '#18181b', textMuted: '#71717a', textLight: '#a1a1aa', borderColor: '#e4e4e7', font: "'Plus Jakarta Sans',system-ui,sans-serif", radius: '12px', radiusLg: '16px', heroGradient: 'linear-gradient(135deg,#18181b 0%,#1e1b4b 50%,#4f46e5 100%)', heroOverlay: 'radial-gradient(ellipse at 80% 30%,rgba(79,70,229,0.15) 0%,transparent 50%)', shadow: '0 2px 8px rgba(0,0,0,0.06)', badgeBg: '#eef2ff', badgeText: '#4338ca', btnRadius: '100px', cardBorder: false, cardShadow: true, badgeRadius: '100px', sectionDivider: false, spacing: 'airy' },
  elegant:   { label: 'Elegant', desc: 'Hochwertig, ruhig, Premium', primary: '#020826', accent: '#7a6844', accentSoft: 'rgba(122,104,68,0.06)', bg: '#f9f4ef', cardBg: '#fff', text: '#2c2620', textMuted: '#6b6058', textLight: '#a89a84', borderColor: '#eaddcf', font: "'Inter',system-ui,sans-serif", fontHeading: "'Cormorant Garamond',Georgia,serif", radius: '2px', radiusLg: '4px', heroGradient: 'linear-gradient(160deg,#020826 0%,#0a1628 50%,#1a1510 100%)', heroOverlay: 'none', shadow: 'none', badgeBg: '#eaddcf', badgeText: '#020826', btnRadius: '2px', cardBorder: true, cardShadow: false, badgeRadius: '2px', sectionDivider: true, spacing: 'airy' },
};

/* 7 WCAG-geprueft Accent-Presets (alle 4.5:1+ auf weiss UND allen 3 Stil-Bgs) */
export const ACCENT_PRESETS = [
  { value: '#0369A1', label: 'Blau' },
  { value: '#2563EB', label: 'Königsblau' },
  { value: '#0E7490', label: 'Teal' },
  { value: '#047857', label: 'Grün' },
  { value: '#B91C1C', label: 'Rot' },
  { value: '#B45309', label: 'Bernstein' },
  { value: '#A16207', label: 'Gold' },
];

/* Default-Accent pro Branche (variiert innerhalb jeder Branchengruppe) */
export const BRANCHEN_ACCENTS = {
  elektro:'#0369A1',installateur:'#0E7490',maler:'#2563EB',tischler:'#A16207',fliesenleger:'#0E7490',schlosser:'#0369A1',dachdecker:'#B45309',zimmerei:'#B45309',maurer:'#0369A1',bodenleger:'#0E7490',glaser:'#2563EB',gaertner:'#047857',klima:'#0E7490',reinigung:'#0369A1',kfz:'#B91C1C',aufsperrdienst:'#B91C1C',hafner:'#B45309',raumausstatter:'#A16207',goldschmied:'#A16207',schneider:'#A16207',rauchfangkehrer:'#0369A1',schaedlingsbekaempfung:'#047857',fahrradwerkstatt:'#047857',erdbau:'#B45309',kosmetik:'#B45309',friseur:'#B91C1C',nagel:'#B91C1C',massage:'#047857',tattoo:'#0369A1',fusspflege:'#0E7490',permanent_makeup:'#A16207',hundesalon:'#B45309',restaurant:'#A16207',cafe:'#B45309',bar:'#B91C1C',heuriger:'#047857',imbiss:'#B91C1C',catering:'#A16207',baeckerei:'#B45309',fleischerei:'#B91C1C',winzer:'#047857',physiotherapie:'#0E7490',arzt:'#0369A1',zahnarzt:'#0369A1',tierarzt:'#047857',apotheke:'#047857',optiker:'#2563EB',psychotherapie:'#0E7490',ergotherapie:'#0E7490',logopaedie:'#2563EB',energetiker:'#047857',hebamme:'#B45309',diaetologe:'#047857',hoerakustiker:'#0369A1',zahntechnik:'#0369A1',heilmasseur:'#0E7490',osteopath:'#0E7490',lebensberater:'#B45309',steuerberater:'#0369A1',rechtsanwalt:'#0369A1',versicherung:'#2563EB',immobilien:'#A16207',hausverwaltung:'#0E7490',umzug:'#B45309',eventplanung:'#B91C1C',fotograf:'#A16207',florist:'#047857',architekt:'#0369A1',it_service:'#2563EB',werbeagentur:'#B91C1C',bestattung:'#0369A1',notar:'#0369A1',finanzberater:'#047857',reisebuero:'#0E7490',innenarchitekt:'#A16207',textilreinigung:'#0E7490',unternehmensberater:'#2563EB',dolmetscher:'#0E7490',druckerei:'#B91C1C',sicherheitsdienst:'#0369A1',fahrschule:'#B91C1C',nachhilfe:'#2563EB',musikschule:'#B91C1C',trainer:'#047857',yoga:'#047857',hundeschule:'#B45309',tanzschule:'#A16207',reitschule:'#B45309',schwimmschule:'#0E7490',coach:'#2563EB',sonstige:'#0369A1',
};

/* Kontrast-Check: zu helle Farben automatisch abdunkeln fuer weissen Text */
export function ensureContrast(hex, minRatio = 4.5) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const lum = (c) => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const L = (h) => {
    const r = lum(h.slice(1, 3)),
      g = lum(h.slice(3, 5)),
      b = lum(h.slice(5, 7));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  let color = hex;
  for (let i = 0; i < 20; i++) {
    if (ratio(1, L(color)) >= minRatio) return color;
    const r = Math.max(0, parseInt(color.slice(1, 3), 16) - 10);
    const g = Math.max(0, parseInt(color.slice(3, 5), 16) - 10);
    const b = Math.max(0, parseInt(color.slice(5, 7), 16) - 10);
    color = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  }
  return color;
}

/* Automatische Farbpalette aus Akzentfarbe: leitet Primary, BG, Borders harmonisch vom Accent-Hue ab */
export function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255,
    g = parseInt(hex.slice(3, 5), 16) / 255,
    b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (d > 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return '#' + f(0) + f(8) + f(4);
}

export function buildPaletteFromAccent(accent, stil) {
  const [h, s] = hexToHsl(accent);
  const es = Math.min(s, 80);
  const n = s < 10;
  if (stil === 'modern')
    return {
      custom_color: n ? '#18181b' : hslToHex(h, Math.min(es * 0.2, 12), 11),
      custom_bg: n ? '#fafafa' : hslToHex(h, Math.min(es * 0.12, 8), 98),
      custom_sep: n ? '#e4e4e7' : hslToHex(h, Math.min(es * 0.1, 6), 91),
      custom_text: '#18181b',
      custom_text_muted: '#71717a',
    };
  if (stil === 'elegant')
    return {
      custom_color: n ? '#020826' : hslToHex(h, Math.min(es * 0.7, 50), 10),
      custom_bg: n ? '#f9f4ef' : hslToHex(h, Math.min(es * 0.18, 14), 97),
      custom_sep: n ? '#eaddcf' : hslToHex(h, Math.min(es * 0.15, 12), 89),
      custom_text: '#2c2620',
      custom_text_muted: '#6b6058',
    };
  return {
    custom_color: n ? '#094067' : hslToHex(h, Math.min(es * 0.85, 65), 17),
    custom_bg: n ? '#f4f7fa' : hslToHex(h, Math.min(es * 0.15, 14), 97),
    custom_sep: n ? '#d8eefe' : hslToHex(h, Math.min(es * 0.2, 18), 90),
    custom_text: '#1e293b',
    custom_text_muted: '#475569',
  };
}

export const STEPS = [
  { id: 'basics', title: 'Grunddaten', num: '01' },
  { id: 'services', title: 'Leistungen', num: '02' },
  { id: 'contact', title: 'Kontakt', num: '03' },
  { id: 'firma', title: 'Unternehmen', num: '04' },
  { id: 'style', title: 'Design', num: '05' },
];

export const INIT = {
  firmenname:'',branche:'',brancheLabel:'',brancheCustom:'',leistungen:[],extraLeistung:'',adresse:'',plz:'',ort:'',bundesland:'',telefon:'',email:'',uid:'',oeffnungszeiten:'',oeffnungszeitenCustom:'',einsatzgebiet:'',kurzbeschreibung:'',unternehmensform:'',vorname:'',nachname:'',firmenbuchnummer:'',gisazahl:'',firmenbuchgericht:'',geschaeftsfuehrer:'',vorstand:'',aufsichtsrat:'',zvr_zahl:'',vertretungsorgane:'',gesellschafter:'',unternehmensgegenstand:'',liquidation:'',kammer_berufsrecht:'',aufsichtsbehoerde:'',facebook:'',instagram:'',linkedin:'',tiktok:'',notdienst:false,meisterbetrieb:false,kostenvoranschlag:false,buchungslink:'',hausbesuche:false,terminvereinbarung:false,foerderungsberatung:false,lieferservice:false,barrierefrei:false,parkplaetze:false,kassenvertrag:'',erstgespraech_gratis:false,online_beratung:false,ratenzahlung:false,fotos:true,stil:'klassisch',layout:'standard',accentColor:'',customFont:'',
};
