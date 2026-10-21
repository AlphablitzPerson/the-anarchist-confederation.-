const menuButton = document.getElementById('menu');
const nav = document.getElementById('nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute(
    'aria-label',
    open ? 'Close navigation' : 'Open navigation'
  );
});

nav?.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  })
);

// Honest multilingual fallback.
// Keep the visitor's selection visible until reviewed translations
// are actually published. All page content remains in English.
const languageSelect = document.getElementById('language');
const languageStatus = document.getElementById('languageStatus');

const languageNames = {
  mt: 'Maltese',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  de: 'German',
  vi: 'Vietnamese',
  hi: 'Hindi',
  zh: 'Chinese',
  ru: 'Russian',
  ar: 'Arabic',
  pt: 'Portuguese',
  nl: 'Dutch',
  el: 'Greek',
  ko: 'Korean',
  ja: 'Japanese',
  af: 'Afrikaans',
  zu: 'isiZulu',
  mn: 'Mongolian',
  lo: 'Lao'
};

function updateLanguageNotice() {
  const languageSelect = document.getElementById('language');
  const languageStatus = document.getElementById('languageStatus');

  if (!languageSelect || !languageStatus) return;

  const chosen = languageSelect.value;

  // The published website content is currently English.
  document.documentElement.lang = 'en';

  languageStatus.hidden = false;
  languageStatus.setAttribute('role', 'status');
  languageStatus.setAttribute('aria-live', 'polite');

  if (chosen === 'en') {
    languageStatus.textContent =
      'English is the current published website language.';
    return;
  }

  const languageNames = {
    mt: 'Maltese',
    es: 'Spanish',
    fr: 'French',
    it: 'Italian',
    de: 'German',
    vi: 'Vietnamese',
    hi: 'Hindi',
    zh: 'Chinese',
    ru: 'Russian',
    ar: 'Arabic',
    pt: 'Portuguese',
    nl: 'Dutch',
    el: 'Greek',
    ko: 'Korean',
    ja: 'Japanese',
    af: 'Afrikaans',
    zu: 'isiZulu',
    mn: 'Mongolian',
    lo: 'Lao'
  };

  const languageName = languageNames[chosen];

  languageStatus.textContent = languageName
    ? The ${languageName} translation is not yet published and reviewed. The website content remains in English. Your selection has been kept.
    : 'This language option is not recognised. The website content remains in English.';
}


  const languageName = languageNames[chosen];

  if (!languageName) {
    languageStatus.textContent =
      'This language option is not recognised. ' +
      'The website content remains in English.';
    return;
  }

  languageStatus.textContent =
    Translation in progress: ${languageName}.  +
    'This translation has not yet been published and reviewed. ' +
    'The website content remains in English. ' +
    'Your language selection has been kept.';
}

languageSelect?.addEventListener('change', updateLanguageNotice);

// Show the correct notice on initial page load too.
if (languageSelect && languageSelect.value !== 'en') {
  updateLanguageNotice();
} else if (languageSelect && languageStatus) {
  languageStatus.textContent =
    'English is the current published website language.';
}

// Directory controls are prepared for future verified CMS entries;
// no fictional entries are created.
const search = document.getElementById('nodeSearch');
const type = document.getElementById('nodeType');

function directoryNotice() {
  const empty = document.querySelector('#directory .empty-state');
  if (empty) empty.setAttribute('aria-live', 'polite');
}

search?.addEventListener('input', directoryNotice);
type?.addEventListener('change', directoryNotice);
