const menuButton = document.getElementById('menu');
const nav = document.getElementById('nav');
const languageSelect = document.getElementById('language');
const languageStatus = document.getElementById('languageStatus');
const search = document.getElementById('nodeSearch');
const type = document.getElementById('nodeType');

// Keep a copy of the original English text and markup.
const originalContent = new Map();

function remember(selector) {
  document.querySelectorAll(selector).forEach(element => {
    if (!originalContent.has(element)) {
      originalContent.set(element, element.innerHTML);
    }
  });
}

// Only elements listed here are translated in this first stage.
const translatedSelectors = [
  '#nav a',
  '.lang-label',
  '#home .eyebrow',
  '#home h1',
  '#home .lede',
  '#home .actions a',
  '#home .note',
  '#about .kicker',
  '#about h2',
  '#about .two > div p'
];

translatedSelectors.forEach(remember);

// Navigation menu.
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

// Reviewed first-stage Maltese interface and homepage translations.
const maltese = {
  '#nav a': [
    'Dwar',
    'Karta u manifest',
    'Direttorju tan-nodi',
    'Membri u affiljati',
    'Governanza',
    'Għajnuna reċiproka',
    'Aħbarijiet',
    'Kuntatti',
    'Applika biex tingħaqad'
  ],
  '.lang-label': 'Lingwa',
  '#home .eyebrow': 'AWTONOMIJA · SOLIDARJETÀ · FEDERAZZJONI',
  '#home h1':
    'Ebda Allat. Ebda Sidien.<br><em>Għajnuna Reċiproka. Assoċjazzjoni Ħielsa.</em>',
  '#home .lede':
    'Il-Konfederazzjoni Anarkista tgħaqqad komunitajiet awtonomi, kollettivi, trejdjunjins u individwi permezz tal-kooperazzjoni volontarja, il-parteċipazzjoni diretta u l-għajnuna reċiproka.',
  '#home .actions a': [
    'Aqra l-karta ↗',
    'Sir taf kif tipparteċipa →'
  ],
  '#home .note':
    'Konfederazzjoni ta’ parteċipanti awtonomi — mhux korp ċentralizzat li jmexxi lil kulħadd.',
  '#about .kicker': '01 / MIN AĦNA',
  '#about h2':
    'Il-libertà tikber permezz tal-<em>kooperazzjoni,</em> mhux tal-kmand.',
  '#about .two > div p': [
    'It-TAC hija assoċjazzjoni volontarja u deċentralizzata ta’ komunitajiet diġitali indipendenti, kollettivi fiżiċi, trejdjunjins u individwi impenjati għas-soċjaliżmu libertarju, għall-anti-awtoritarjaniżmu u għall-għajnuna reċiproka.',
    'Il-konfederazzjoni tippermetti l-konnessjoni u l-azzjoni kollettiva filwaqt li tirrispetta l-awtonomija tan-nodi parteċipanti u tal-membri tagħha.'
  ]
};

function setLanguage(language) {
  const isMaltese = language === 'mt';

  // Restore English before applying another language.
  originalContent.forEach((html, element) => {
    element.innerHTML = html;
  });

  if (isMaltese) {
    Object.entries(maltese).forEach(([selector, value]) => {
      const elements = document.querySelectorAll(selector);
      const values = Array.isArray(value) ? value : [value];

      elements.forEach((element, index) => {
        if (values[index] !== undefined) {
          element.innerHTML = values[index];
        }
      });
    });
  }

  // The selected option stays selected.
  document.documentElement.lang = isMaltese ? 'mt' : 'en';

  if (languageStatus) {
    languageStatus.hidden = false;
    languageStatus.setAttribute('role', 'status');
    languageStatus.setAttribute('aria-live', 'polite');

    if (isMaltese) {
      languageStatus.textContent =
        'Il-paġna ewlenija u n-navigazzjoni huma tradotti parzjalment bil-Malti. It-taqsimiet l-oħra u d-dokumenti uffiċjali għadhom bl-Ingliż.';
    } else if (language === 'en') {
      languageStatus.textContent =
        'English is the current website language.';
    } else {
      languageStatus.textContent =
        'This language has not yet been translated. The website is displayed in English.';
    }
  }
}

languageSelect?.addEventListener('change', () => {
  setLanguage(languageSelect.value);
});

// Set the correct content on initial load.
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
