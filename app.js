const menuButton = document.getElementById('menu');
const nav = document.getElementById('nav');
const languageSelect = document.getElementById('language');
const languageStatus = document.getElementById('languageStatus');
const search = document.getElementById('nodeSearch');
const type = document.getElementById('nodeType');

// Remember original English content so it can always be restored.
const originalHTML = new Map();
const originalAttributes = new Map();

const maltese = {
  '#nav a': [
    'Dwar',
    'Dokumenti',
    'Direttorju tan-nodi',
    'Membri U Partners Offiċjali',
    'Governanza',
    'Għajnuna reċiproka',
    'Aħbarijiet',
    'Kuntatti',
    'Applika biex tingħaqad'
  ],
  '.lang-label': 'Lingwa',

  '#home .eyebrow': 'AWTONOMIJA · SOLIDARJETÀ · FEDERAZZJONI',
  '#home h1':
    'Ebda Alla. Ebda Sidien.<br><em>Għajnuna Reċiproka. Assoċjazzjoni Ħielsa.</em>',
  '#home .lede':
    'Il-Konfederazzjoni Anarkista tgħaqqad komunitajiet awtonomi, kollettivi, trejdjunjins u individwi permezz tal-kooperazzjoni volontarja, il-parteċipazzjoni diretta u l-għajnuna reċiproka.',
  '#home .actions a': [
    'Aqra l-karta ↗',
    'Sir af kif tipparteċipa →'
  ],
  '#home .note':
    'Konfederazzjoni ta’ parteċipanti awtonomi — mhux korp ċentralizzat li jmexxi lil kulħadd.',
  '#home .hero-art > span': 'EMBLEMA UFFIĊJALI TAL-KONFEDERAZZJONI',
  '#home .hero-foot span': [
    'Organizza lokalment. Iffedera volontarjament.',
    '01 / TAC'
  ],

  '#about .kicker': '01 / MIN AĦNA',
  '#about h2':
    'Il-libertà tikber permezz tal-<em>kooperazzjoni,</em> mhux tal-kmand.',
  '#about .two > div p': [
    'It-TAC hija assoċjazzjoni volontarja u deċentralizzata ta’ komunitajiet diġitali indipendenti, kollettivi fiżiċi, trejdjunjins u individwi impenjati għas-soċjaliżmu libertarju, għall-anti-awtoritarjaniżmu u għall-għajnuna reċiproka.',
    'Il-konfederazzjoni tippermetti l-konnessjoni u l-azzjoni kollettiva filwaqt li tirrispetta l-awtonomija tan-nodi parteċipanti u tal-membri tagħha.'
  ],

  '#charter .kicker': '02 / DOKUMENTI FUNDAMENTALI',
  '#charter .section-head h2':
    'Prinċipji komuni.<br><em>Dokumentati b’mod miftuħ.</em>',
  '#charter .section-head p':
    'Il-karta u l-manifest adottati huma d-dokumenti fundamentali awtorevoli tat-TAC. Din il-paġna hija introduzzjoni, mhux sostitut għal dawk id-dokumenti.',
  '#charter .tile-no': [
    'DOKUMENT 01',
    'DOKUMENT 02',
    'DOKUMENT 03',
    'DOKUMENT 04'
  ],
  '#charter .tile h3': [
    'Karta Fundamentali',
    'Manifest',
    'Proċeduri Operattivi Standard tal-Kunsill ta’ Sorveljanza',
    'Viżjoni, Missjoni u Valuri Ewlenin'
  ],
  '#charter .tile p': [
    'L-għan, is-sħubija, l-istruttura konfederali, il-prinċipji komuni u d-drittijiet u r-responsabbiltajiet tal-parteċipanti.',
    'L-għanijiet politiċi u l-impenji tal-moviment, ippubblikati fl-istess fajl tas-sors bħall-karta fundamentali.',
    'Gwida proċedurali għad-dmirijiet definiti tal-Kunsill, mingħajr ma dan isir awtorità ta’ kmand fuq in-nodi awtonomi.',
    'Is-sommarju pprovdut tal-viżjoni, il-missjoni u l-valuri ewlenin tat-TAC.'
  ],
  '#charter .document-actions a': [
    'Aqra l-PDF ↗',
    'Niżżel il-PDF ↓',
    'Aqra l-PDF tas-sors ↗',
    'Niżżel il-PDF ↓',
    'Aqra l-PDF ↗',
    'Niżżel il-PDF ↓',
    'Aqra l-PDF ↗',
    'Niżżel il-PDF ↓'
  ],
  '#charter .tile .status': [
    'Fajl tas-sors uffiċjali · karta u manifest magħqudin',
    'Fajl tas-sors uffiċjali · dokument magħqud',
    'Dokument proċedurali uffiċjali pprovdut',
    'Dokument ta’ referenza pprovdut'
  ],
  '#charter .document-note':
    'Dawn il-links jiftħu direttament il-PDFs ipprovduti. Ikkonferma l-verżjonijiet uffiċjali, id-dati tal-adozzjoni u kwalunkwe restrizzjoni fuq il-pubblikazzjoni qabel ma tqis din il-paġna bħala reġistru formali tad-dokumenti.',

  '.principles .kicker': '03 / IL-PRINĊIPJI FIL-PRATTIKA',
  '.principles .principle-grid h3': [
    'Awtonomija',
    'Assoċjazzjoni volontarja',
    'Għajnuna reċiproka',
    'Responsabbiltà'
  ],
  '.principles .principle-grid p': [
    'In-nodi parteċipanti jżommu l-awto-organizzazzjoni u t-teħid tad-deċiżjonijiet interni tagħhom.',
    'Il-kooperazzjoni tinbena permezz tal-kunsens, impenji komuni u ftehimiet innegozjati.',
    'Ir-riżorsi, l-għarfien, ix-xogħol u l-appoġġ prattiku jinqasmu biex jintlaħqu l-ħtiġijiet kollettivi.',
    'Ir-responsabbiltajiet delegati huma limitati mill-mandat tagħhom u soġġetti għal reviżjoni trasparenti.'
  ],

  '#network .kicker': '04 / KONNESSI, MHUX IKKONTROLLATI',
  '#network h2':
    'Ħafna komunitajiet.<br><em>Konfederazzjoni waħda.</em>',
  '#network .network > div:first-child p':
    'Skopri n-nodi parteċipanti, il-kollettivi, it-trejdjunjins u l-proġetti msieħba. Kull entrata fid-direttorju għandha tiddeskrivi x-xogħol tal-grupp innifsu u l-preferenzi tiegħu għall-kuntatt; m’għandhiex timplika li l-konfederazzjoni tikkmandah.',
  '#network .network > div:first-child a': 'Esplora d-direttorju ↓',
  '#network .network-graphic .node': [
    'KOMUNITÀ',
    'TREJDJUNJIN',
    'KOLLETTIV',
    'NODU DIĠITALI',
    'TAC'
  ],
  '#network .network-graphic small': 'KOORDINAZZJONI MINGĦAJR KMAND',

  '#directory .kicker': '05 / DIRETTORJU PUBBLIKU TAN-NODI',
  '#directory .section-head h2':
    'Sib il-<em>konnessjonijiet</em> tiegħek.',
  '#directory .section-head p':
    'L-istruttura tad-direttorju hija lesta għal entrati verifikati. Dan il-prototip ma fihx gruppi jew dettalji ta’ kuntatt ivvintati.',
  '#directory .filter-row label': [
    'Fittex entrati',
    'Tip'
  ],
  '#directory .empty-state > span': 'DIRETTORJU / 00 ENTRATA',
  '#directory .empty-state h3': 'Nibnu d-direttorju flimkien.',
  '#directory .empty-state p':
    'L-entrati jiżdiedu wara li l-grupp parteċipanti jikkonferma l-informazzjoni tiegħu u dak li jixtieq jagħmel pubbliku.',

  '#members .kicker': '06 / IN-NETWORK TAL-KONFEDERAZZJONI',
  '#members .section-head h2':
    'Membri uffiċjali<br><em>u affiljati.</em>',
  '#members .section-head p':
    'Dawn il-listi jiddistingwu s-sħubija uffiċjali mir-relazzjonijiet ta’ affiljazzjoni. Kull organizzazzjoni tibqa’ awtonoma; il-lista ma timplikax kmand, sjieda jew kontroll mit-TAC.',
  '#members .member-label': [
    'MEMBRU UFFIĊJALI',
    'MEMBRU AFFILJAT'
  ],
  '#members .member-card h3': [
    'Kroptkin European International',
    'Radical Secularist International'
  ],
  '#members .member-card p': [
    'Organizzazzjoni membru uffiċjali tal-Konfederazzjoni Anarkista.',
    'Organizzazzjoni affiljata permezz tal-kooperazzjoni, filwaqt li żżomm l-awtonomija tagħha.'
  ],
  '#members .member-card a': [
    'Żur Discord ↗',
    'Żur Discord ↗'
  ],
  '#members .members-note':
    'L-entrati għandhom jinżammu bil-kunsens ta’ kull organizzazzjoni u jiġu aġġornati meta jinbidel l-istatus tal-affiljazzjoni tagħha.',

  '#contacts .kicker': '07 / KUNTATTI UFFIĊJALI',
  '#contacts .section-head h2':
    'Ikkuntattja lit-<em>TAC.</em>',
  '#contacts .section-head p':
    'Uża dawn il-kanali biex issegwi l-aġġornamenti, tikkuntattja lill-moviment jew tistaqsi dwar is-sħubija u l-affiljazzjoni.',
  '#contacts .contact-platform': [
    'YOUTUBE',
    'TIKTOK',
    'INSTAGRAM',
    'EMAIL'
  ],
  '#contacts .contact-card > span:last-child': [
    'Ara u segwi l-aġġornamenti bil-vidjo ↗',
    'Segwi l-aġġornamenti qosra ↗',
    'Segwi l-posts u t-tħabbiriet ↗',
    'Mistoqsijiet ġenerali u applikazzjonijiet għas-sħubija ↗'
  ],

  '#governance .kicker': '06 / KIF NORGANIŻŻAW RUĦNA',
  '#governance h2':
    'Delegazzjoni hija kompitu,<br><em>mhux tron.</em>',
  '#governance .two > div p':
    'L-Assemblea Ġenerali hija l-forum ta’ deliberazzjoni tal-federazzjoni kollha għas-sħubija attiva. In-nodi awtonomi jżommu l-awto-organizzazzjoni tagħhom. Il-Kunsill ta’ Sorveljanza jwettaq id-dmirijiet proċedurali u ta’ kollegament definiti fil-karta; mhuwiex kmand ċentrali fuq in-nodi.',
  '#governance .underlink': 'Ara l-prinċipji tat-trasparenza →',
  '#governance .diagram-box b': [
    'Assemblea Ġenerali',
    'Nodi awtonomi',
    'Kunsill ta’ Sorveljanza'
  ],
  '#governance .diagram-box small': [
    'Sħubija attiva · deliberazzjoni fil-livell tal-konfederazzjoni',
    'Awto-organizzazzjoni lokali',
    'Rwol proċedurali definit · mingħajr awtorità ta’ kmand'
  ],
  '#governance .connector':
    'mandati · koordinazzjoni · responsabbiltà',
  '#governance .governance-diagram .caption':
    'Relazzjoni kunċettwali, mhux ġerarkija ta’ kmand.',

  '.flags .kicker': '07 / SIMBOLI UFFIĊJALI',
  '.flags .section-head h2':
    'Simboli rikonoxxibbli.<br><em>Impenji komuni.</em>',
  '.flags .section-head p':
    'L-arti uffiċjali pprovduta tintuża kif inhi. Il-varjant tad-difiża reċiproka jidher bħala varjant distint tal-bandiera, mhux bħala sostitut għall-bandiera ewlenija.',
  '.flags figcaption b': [
    'Bandiera Anarkosindikalista bl-Irkaptu',
    'Varjant tal-Bandiera bl-Ilqugħ tad-Difiża Reċiproka'
  ],
  '.flags figcaption span': [
    'Trejdjunjins immexxija mill-ħaddiema, organizzazzjoni tax-xogħol u kollettivi tekniċi.',
    'Difiża federata tal-moderazzjoni, sigurtà, reżiljenza u protezzjoni tal-pjattaforma.'
  ],

  '#projects .kicker': '08 / GĦAJNUNA REĊIPROKA U KOLLABORAZZJONI',
  '#projects .section-head h2':
    'Solidarjetà fil-<em>prattika.</em>',
  '#projects .section-head p':
    'Uża dan l-ispazju biex issib kollaboraturi, taqsam ir-riżorsi u tipproponi proġetti mingħajr ma tiċċentralizza l-kontroll fuq ix-xogħol lokali.',
  '#projects .tile-no': [
    'PROĠETTI',
    'RIŻORSI',
    'PARTEĊIPAZZJONI'
  ],
  '#projects .tile h3': [
    'Inizjattivi kollaborattivi',
    'Riżorsi ta’ għajnuna reċiproka',
    'Ibda proposta'
  ],
  '#projects .tile p': [
    'Xogħol komuni propost u miżmum min-nies u l-gruppi involuti.',
    'Ħiliet, materjali, gwidi u offerti ta’ appoġġ mogħtija volontarjament.',
    'Ressaq idea lill-grupp awtonomu rilevanti jew permezz tal-proċess konfederali miftiehem.'
  ],
  '#projects > .status':
    'Il-listi tal-proġetti u s-sottomissjonijiet se jkunu attivati wara li jiġi kkonfigurat il-fluss tax-xogħol tas-CMS.',

  '#news .kicker': '09 / AĦBARIJIET U TĦABBIRIET',
  '#news .section-head h2':
    'Aġġornamenti min-<em>network.</em>',
  '#news .section-head p':
    'Hawnhekk se jidhru biss tħabbiriet approvati. Dan il-prototip ma fihx aħbarijiet jew rekords ta’ deċiżjonijiet ivvintati.',
  '#news .empty-state > span': 'AĦBARIJIET / L-EWWEL PUBBLIKAZZJONI GĦADHA PENDENTI',
  '#news .empty-state h3': 'Spazju għall-pubblikazzjoni lest.',
  '#news .empty-state p':
    'Is-CMS għandu jappoġġa abbozzi, reviżjoni, approvazzjoni u storja tal-korrezzjonijiet, bi rwoli tal-awturi definiti bi ftehim kollettiv.',

  '#transparency .kicker': '10 / TRASPARENZA U REKORDS',
  '#transparency h2':
    'Deċiżjonijiet miftuħa.<br><em>Ħarsien responsabbli.</em>',
  '#transparency .two > div > p':
    'Ippubblika deċiżjonijiet u rekords amministrattivi li huma maħtura bħala pubbliċi skont ir-regoli tat-TAC. Ipproteġi l-informazzjoni personali, il-korrispondenza privata u d-dettalji sensittivi għas-sigurtà.',
  '#transparency .record b': [
    'Reġistru tad-deċiżjonijiet pubbliċi',
    'Storja tal-emendi'
  ],
  '#transparency .record span:not(.dot)': [
    'Qed jistennew rekords approvati',
    'Il-fluss tax-xogħol tas-CMS għad irid jiġi kkonfigurat'
  ],

  '#join .kicker': '13 / IPPARTEĊIPA',
  '#join h2':
    'Organizza lokalment.<br><em>Ikkomunika orizzontalment.</em>',
  '#join .join-panel > div:first-child p':
    'Interessat li tingħaqad mat-TAC jew tissieħeb magħha? Ibda billi taqra l-karta u kkuntattja lill-konfederazzjoni. L-applikazzjonijiet formali għandhom jiġu ttrattati permezz ta’ proċess miftiehem, bi kriterji ċari u rekord tad-deċiżjonijiet.',
  '#join .join-actions a': [
    'Ikkuntattja lit-TAC ↗',
    'Staqsi dwar is-sħubija →'
  ],

  'footer .footer-main p':
    'Ebda Alla. Ebda Sidien. Għajnuna Reċiproka. Assoċjazzjoni Ħielsa.',
  'footer .footer-brand b': 'IL-KONFEDERAZZJONI ANARKISTA',
  'footer .footer-brand small': 'TAC · FEDERAZZJONI VOLONTARJA',
  'footer .footer-bottom > span':
    'Prototip pubbliku · © TAC',
  'footer .footer-bottom div a': [
    'Karta',
    'Membri u affiljati',
    'Governanza',
    'Trasparenza',
    'Kuntatti'
  ]
};

// Remember all translated elements before changing any text.
Object.keys(maltese).forEach(selector => {
  document.querySelectorAll(selector).forEach(element => {
    if (!originalHTML.has(element)) {
      originalHTML.set(element, element.innerHTML);
    }
  });
});

// Preserve original search placeholder and directory option text.
if (search) {
  originalAttributes.set(search, search.getAttribute('placeholder'));
}
if (type) {
  originalHTML.set(
    type,
    Array.from(type.options).map(option => option.textContent)
  );
}

function restoreEnglish() {
  originalHTML.forEach((html, element) => {
    if (element === type) {
      html.forEach((text, index) => {
        if (type.options[index]) {
          type.options[index].textContent = text;
        }
      });
    } else {
      element.innerHTML = html;
    }
  });

  if (search && originalAttributes.has(search)) {
    search.setAttribute('placeholder', originalAttributes.get(search));
  }
}

function applyMaltese() {
  Object.entries(maltese).forEach(([selector, translation]) => {
    const elements = document.querySelectorAll(selector);
    const values = Array.isArray(translation)
      ? translation
      : [translation];

    elements.forEach((element, index) => {
      if (values[index] !== undefined) {
        element.innerHTML = values[index];
      }
    });
  });

  if (search) {
    search.setAttribute(
      'placeholder',
      'Fittex skont l-isem, il-post jew il-qasam'
    );
  }

  if (type) {
    const labels = [
      'It-tipi kollha',
      'Komunità',
      'Kollettiv',
      'Trejdjunjin',
      'Nodu diġitali',
      'Sieħeb assoċjat'
    ];

    Array.from(type.options).forEach((option, index) => {
      if (labels[index]) option.textContent = labels[index];
    });
  }
}

// Mobile navigation.
menuButton?.addEventListener('click', () => {
  if (!nav) return;

  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute(
    'aria-label',
    open ? 'Close navigation' : 'Open navigation'
  );
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

// Language selection.
function setLanguage(language) {
  restoreEnglish();

  if (language === 'mt') {
    applyMaltese();
    document.documentElement.lang = 'mt';

    if (languageStatus) {
      languageStatus.textContent =
        'Il-paġna hija tradotta bil-Malti. Xi dokumenti uffiċjali u kontenut estern għadhom bl-Ingliż.';
    }
  } else {
    document.documentElement.lang = 'en';

    if (languageStatus) {
      languageStatus.textContent = language === 'en'
        ? 'English is the current website language.'
        : 'This language has not yet been translated. The website is displayed in English.';
    }
  }

  if (languageStatus) {
    languageStatus.hidden = false;
    languageStatus.setAttribute('role', 'status');
    languageStatus.setAttribute('aria-live', 'polite');
  }
}

languageSelect?.addEventListener('change', () => {
  setLanguage(languageSelect.value);
});

if (languageSelect) {
  setLanguage(languageSelect.value);
}

// Preserve the existing directory behaviour.
function directoryNotice() {
  const empty = document.querySelector('#directory .empty-state');

  if (empty) {
    empty.setAttribute('aria-live', 'polite');
  }
}

search?.addEventListener('input', directoryNotice);
type?.addEventListener('change', directoryNotice);
