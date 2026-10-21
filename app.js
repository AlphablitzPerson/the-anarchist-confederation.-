const menuButton = document.getElementById('menu');
const nav = document.getElementById('nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

// Honest multilingual fallback: no language is presented as translated until reviewed copy exists.
const languageSelect = document.getElementById('language');
const languageStatus = document.getElementById('languageStatus');
const languageNames = {
  mt: 'Maltese', es: 'Spanish', fr: 'French', it: 'Italian', de: 'German',
  vi: 'Vietnamese', hi: 'Hindi', zh: 'Chinese', ru: 'Russian', ar: 'Arabic',
  pt: 'Portuguese', nl: 'Dutch', el: 'Greek', ko: 'Korean', ja: 'Japanese',
  af: 'Afrikaans', zu: 'isiZulu', mn: 'Mongolian', lo: 'Lao'
};
languageSelect?.addEventListener('change', () => {
  const chosen = languageSelect.value;
  if (chosen === 'en') {
    if (languageStatus) {
      languageStatus.textContent = 'English is the current published website language.';
      languageStatus.hidden = false;
    }
    document.documentElement.lang = 'en';
    return;
  }
  if (languageStatus) {
    languageStatus.textContent = `${languageNames[chosen] || 'This language'} translation is not yet published or reviewed. The website remains in English; no incomplete translation is presented as official.`;
    languageStatus.hidden = false;
  }
  languageSelect.value = 'en';
  document.documentElement.lang = 'en';
});

// Directory controls are prepared for future verified CMS entries; no fictional entries are created.
const search = document.getElementById('nodeSearch');
const type = document.getElementById('nodeType');
function directoryNotice() {
  const empty = document.querySelector('#directory .empty-state');
  if (empty) empty.setAttribute('aria-live', 'polite');
}
search?.addEventListener('input', directoryNotice);
type?.addEventListener('change', directoryNotice);
