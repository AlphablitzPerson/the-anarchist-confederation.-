
(() => {
  "use strict";

  // The Anarchist Confederation (TAC)
  // Preserves mobile navigation, language preferences and directory hooks.
  // Coptic wording remains provisional until reviewed by a Sahidic specialist.

  const menuButton = document.getElementById("menu");
  const nav = document.getElementById("nav");
  const languageSelect = document.getElementById("language");
  const languageStatus = document.getElementById("languageStatus");
  const nodeSearch = document.getElementById("nodeSearch");
  const nodeType = document.getElementById("nodeType");

  const STORAGE_KEY = "tac-preferred-language";

  const supportedLanguages = [
    "en", "mt", "es", "fr", "it", "de", "vi", "hi", "ur",
    "zh-CN", "ru", "ar", "pt", "nl", "el", "ko", "ja",
    "af", "zu", "mn", "lo", "tr", "cop", "la", "eo"
  ];

  const languageNames = {
    en: "English",
    mt: "Malti",
    es: "Español (España)",
    fr: "Français",
    it: "Italiano",
    de: "Deutsch",
    vi: "Tiếng Việt",
    hi: "हिन्दी",
    ur: "اردو",
    "zh-CN": "简体中文（普通话）",
    ru: "Русский",
    ar: "العربية",
    pt: "Português (Portugal)",
    nl: "Nederlands",
    el: "Ελληνικά",
    ko: "한국어",
    ja: "日本語",
    af: "Afrikaans",
    zu: "isiZulu",
    mn: "Монгол",
    lo: "ລາວ",
    tr: "Türkçe",
    cop: "Sahidic Coptic",
    la: "Classical Latin",
    eo: "Esperanto"
  };

  /*
   * PROVISIONAL COPTIC GLOSSARY
   *
   * Keys must match the original English wording exactly.
   * Existing entries are retained from the previous app.js.
   * Have all translations reviewed before presenting them as authoritative.
   *
   * Add a complete, reviewed translation for each website sentence here.
   */

  const copticGlossary = {
    "About": "Ⲉⲑⲃⲉ",
    "Language": "Ⲁⲥⲡⲉ",
    "Contacts": "Ⲛⲉⲥⲙⲟⲩ",
    "Autonomy": "Ⲙⲉⲧⲁⲩⲧⲟⲛⲟⲙⲓⲁ",
    "Mutual aid": "Ⲙⲉⲧⲃⲟⲏⲑⲓⲁ",
    "News": "Ⲛⲉⲛⲉⲩⲁϣ",
    "Governance": "Ⲙⲉⲧⲟⲩⲉⲣϩⲏⲅⲉⲙⲱⲛ",
    "Members & affiliates": "Ⲛⲉⲙⲃⲣⲟⲥ ⲛⲉⲙ ⲛⲉⲙⲙⲉⲧⲟⲭⲟⲥ",
    "Node directory": "Ⲡⲓⲕⲁⲧⲁⲗⲟⲅⲟⲥ ⲛ̀ⲛⲓⲕⲟⲓⲛⲟⲛⲓⲁ",
    "Foundational Charter": "Ⲡⲓⲭⲁⲣⲧⲏⲥ ⲛ̀ⲧⲉ ⲡⲓⲥⲉⲙⲛⲓ",
    "Manifesto": "Ⲡⲓⲙⲁⲛⲓϩⲟⲩⲧ",
    "Search entries": "Ⲥⲱϣ ⲛ̀ⲛⲓⲅⲣⲁⲫⲏ",
    "All types": "Ⲛⲓⲧⲏⲣⲟⲩ",
    "Community": "Ⲕⲟⲓⲛⲟⲛⲓⲁ",
    "Collective": "Ⲕⲟⲗⲗⲉⲕⲧⲓⲃ",
    "Labour union": "Ⲥⲩⲛⲇⲓⲕⲁⲧⲟⲥ",
    "Digital node": "Ⲛⲟⲇⲟⲥ ⲛ̀ⲇⲓⲅⲓⲧⲁⲗ",
    "Official member": "Ⲙⲉⲙⲃⲣⲟⲥ ⲛ̀ⲉⲡⲓⲥⲙⲟⲩ",
    "Read PDF ↗": "Ⲱϣ ⲛ̀ⲡⲓ PDF ↗",
    "Read source PDF ↗": "Ⲱϣ ⲛ̀ⲡⲓ PDF ↗",
    "Download PDF ↓": "Ϫⲓ ⲛ̀ⲡⲓ PDF ↓",
    "Visit Discord ↗": "Ϫⲓ ⲙ̀ⲙⲟⲕ ⲉ Discord ↗",
    "Contact TAC ↗": "Ⲥⲙⲟⲩ ⲛ̀TAC ↗",
    "Open the anthem file": "Ⲟⲩⲱⲛ ⲛ̀ⲡⲓϫⲱⲙ ⲛ̀ϩⲏⲧ",

    "Skip to content": null,
    "Open navigation": null,
    "Close navigation": null,
    "Select language": null,
    "Preparing automatic translation": null
  };

  // Preserve original text and attribute values for reliable restoration.
  const originalText = new Map();
  const originalAttributes = new Map();

  let translateReady = false;
  let translateFailed = false;
  let pendingLanguage = null;
  let englishReloadStarted = false;
  let observer = null;
  let applyingCoptic = false;

  function showStatus(message) {
    if (!languageStatus) return;
    languageStatus.textContent = message;
    languageStatus.hidden = false;
  }

  function hideStatus() {
    if (!languageStatus) return;
    languageStatus.textContent = "";
    languageStatus.hidden = true;
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Storage may be disabled by the browser.
    }
  }

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return supportedLanguages.includes(saved) ? saved : "en";
    } catch {
      return "en";
    }
  }

  function setDocumentLanguage(language, translated) {
    document.documentElement.lang = translated ? language : "en";
    document.documentElement.dir =
      translated && ["ar", "ur"].includes(language) ? "rtl" : "ltr";
  }

  // MOBILE NAVIGATION

  function setMenuState(isOpen) {
    if (!menuButton || !nav) return;

    nav.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    const label = menuButton.querySelector(".sr");
    if (label) {
      label.textContent = isOpen
        ? "Close navigation"
        : "Open navigation";
    }
  }

  function closeMenu() {
    setMenuState(false);
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      setMenuState(!nav.classList.contains("open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  /*
   * COPTIC TEXT TRANSLATION
   *
   * This engine:
   * - handles text split across inline HTML elements;
   * - preserves the original text for restoration;
   * - translates supported placeholders and accessibility attributes;
   * - watches for later DOM changes;
   * - never edits script, style, form-entry values or the language selector.
   */

  const translatableAttributes = [
    "placeholder",
    "aria-label",
    "title",
    "alt"
  ];

  function isExcludedTextNode(node) {
    const parent = node.parentElement;

    if (!parent) return true;

    return Boolean(parent.closest(
      "script, style, textarea, input, select, option, noscript, " +
      "audio, video, #languageStatus, #google_translate_element"
    ));
  }

  function translateTextNode(node, translatedCounter) {
    if (isExcludedTextNode(node)) return;

    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const original = originalText.get(node);
    const trimmed = original.trim();

    if (!trimmed || !Object.prototype.hasOwnProperty.call(copticGlossary, trimmed)) {
      node.nodeValue = original;
      return;
    }

    const translated = copticGlossary[trimmed];

    if (typeof translated !== "string" || !translated) {
      node.nodeValue = original;
      return;
    }

    const leading = original.match(/^\s*/)?.[0] ?? "";
    const trailing = original.match(/\s*$/)?.[0] ?? "";

    node.nodeValue = leading + translated + trailing;
    translatedCounter.count++;
  }

  function translateAttributes(root, translatedCounter) {
    const elements = [];

    if (root.nodeType === Node.ELEMENT_NODE) {
      elements.push(root);
    }

    if (root.querySelectorAll) {
      elements.push(...root.querySelectorAll("*"));
    }

    for (const element of elements) {
      if (element.closest("#languageStatus, #google_translate_element")) {
        continue;
      }

      for (const attribute of translatableAttributes) {
        if (!element.hasAttribute(attribute)) continue;

        // Do not alter branding or URLs in image alternative text unless
        // a reviewed translation for the complete original value exists.
        const key = `${attribute}:${element.tagName}:${attribute}`;
        let saved = originalAttributes.get(element);

        if (!saved) {
          saved = new Map();
          originalAttributes.set(element, saved);
        }

        if (!saved.has(attribute)) {
          saved.set(attribute, element.getAttribute(attribute));
        }

        const original = saved.get(attribute);

        if (Object.prototype.hasOwnProperty.call(copticGlossary, original)) {
          const translated = copticGlossary[original];

          if (typeof translated === "string" && translated) {
            element.setAttribute(attribute, translated);
            translatedCounter.count++;
          } else {
            element.setAttribute(attribute, original);
          }
        } else {
          element.setAttribute(attribute, original);
        }
      }
    }
  }

  function translateCopticPage() {
    applyingCoptic = true;

    if (observer) observer.disconnect();

    const translatedCounter = { count: 0 };
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];
    let node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    for (const textNode of nodes) {
      translateTextNode(textNode, translatedCounter);
    }

    translateAttributes(document.body, translatedCounter);

    setDocumentLanguage("cop", true);

    showStatus(
      "Sahidic Coptic selected. " +
      translatedCounter.count +
      " text items or attributes matched the provisional glossary. " +
      "Untranslated text remains in English."
    );

    startObserver();
    applyingCoptic = false;
  }

  function restoreCopticOriginalText() {
    if (observer) observer.disconnect();

    for (const [node, original] of originalText) {
      if (node.isConnected) node.nodeValue = original;
    }
    originalText.clear();

    for (const [element, attributes] of originalAttributes) {
      if (!element.isConnected) continue;

      for (const [attribute, original] of attributes) {
        element.setAttribute(attribute, original);
      }
    }
    originalAttributes.clear();
  }

  function startObserver() {
    if (!("MutationObserver" in window)) return;

    if (!observer) {
      observer = new MutationObserver((mutations) => {
        if (applyingCoptic) return;

        applyingCoptic = true;
        observer.disconnect();

        const counter = { count: 0 };

        for (const mutation of mutations) {
          if (mutation.type === "characterData") {
            translateTextNode(mutation.target, counter);
          }

          for (const addedNode of mutation.addedNodes || []) {
            if (addedNode.nodeType === Node.TEXT_NODE) {
              translateTextNode(addedNode, counter);
            } else if (addedNode.nodeType === Node.ELEMENT_NODE) {
              const walker = document.createTreeWalker(
                addedNode,
                NodeFilter.SHOW_TEXT
              );

              let child;
              while ((child = walker.nextNode())) {
                translateTextNode(child, counter);
              }

              translateAttributes(addedNode, counter);
            }
          }
        }

        observer.observe(document.body, {
          subtree: true,
          childList: true,
          characterData: true
        });

        applyingCoptic = false;
      });
    }

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  function applyCopticLanguage() {
    pendingLanguage = null;
    saveLanguage("cop");
    restoreCopticOriginalText();
    translateCopticPage();
  }

  // GOOGLE TRANSLATE WIDGET FOR LANGUAGES OTHER THAN COPTIC

  function createTranslationWidget() {
    if (document.getElementById("google_translate_element")) return;

    const widget = document.createElement("div");
    widget.id = "google_translate_element";
    widget.setAttribute("aria-hidden", "true");

    Object.assign(widget.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: "1px",
      height: "1px",
      overflow: "hidden"
    });

    document.body.appendChild(widget);
  }

  function getGoogleLanguageSelector() {
    return document.querySelector(
      "#google_translate_element select.goog-te-combo"
    );
  }

  function hasGoogleLanguage(language) {
    const combo = getGoogleLanguageSelector();

    return Boolean(
      combo &&
      Array.from(combo.options).some((option) => option.value === language)
    );
  }

  function resetToEnglish() {
    pendingLanguage = null;
    saveLanguage("en");
    restoreCopticOriginalText();
    setDocumentLanguage("en", false);

    if (englishReloadStarted) return;
    englishReloadStarted = true;

    try {
      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
        window.location.hostname;
    } catch {
      // Reload still restores the original English page where possible.
    }

    showStatus("Returning to the original English page…");
    window.location.reload();
  }

  function applyGoogleLanguage(language) {
    if (!supportedLanguages.includes(language) || language === "cop") {
      return;
    }

    if (language === "en") {
      resetToEnglish();
      return;
    }

    if (translateFailed) {
      setDocumentLanguage("en", false);
      showStatus(
        "Automatic translation is unavailable. The website remains in English."
      );
      return;
    }

    const combo = getGoogleLanguageSelector();

    if (!translateReady || !combo) {
      pendingLanguage = language;
      setDocumentLanguage("en", false);
      showStatus(
        "Preparing automatic translation into " +
        languageNames[language] +
        ". The page may remain in English while the service loads."
      );
      return;
    }

    if (!hasGoogleLanguage(language)) {
      pendingLanguage = null;
      setDocumentLanguage("en", false);
      showStatus(
        "The translation service does not offer " +
        languageNames[language] +
        " in this session. The website remains in English."
      );
      return;
    }

    pendingLanguage = null;
    showStatus(
      "Requesting automatic translation into " +
      languageNames[language] +
      ". Some wording may be inaccurate or may not use the requested regional variant."
    );

    combo.value = language;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    setDocumentLanguage(language, true);
  }

  window.googleTranslateElementInit = function () {
    // Do not initialise Google Translate for a Coptic session.
    if (getSavedLanguage() === "cop") return;

    try {
      if (!window.google?.translate?.TranslateElement) {
        throw new Error("Google Translate widget is unavailable");
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: supportedLanguages
            .filter((language) => !["en", "cop"].includes(language))
            .join(","),
          autoDisplay: false
        },
        "google_translate_element"
      );

      let attempts = 0;

      const timer = window.setInterval(() => {
        attempts++;

        const combo = getGoogleLanguageSelector();

        if (combo) {
          window.clearInterval(timer);
          translateReady = true;

          if (pendingLanguage) {
            applyGoogleLanguage(pendingLanguage);
          }

          return;
        }

        if (attempts >= 40) {
          window.clearInterval(timer);
          translateFailed = true;

          if (languageSelect && languageSelect.value !== "en") {
            setDocumentLanguage("en", false);
            showStatus(
              "The translation widget did not finish loading. The website remains in English."
            );
          }
        }
      }, 250);
    } catch {
      translateFailed = true;
      setDocumentLanguage("en", false);
      showStatus(
        "Automatic translation could not start. The website remains in English."
      );
    }
  };

  function loadTranslationScript() {
    // Coptic is manual and must not depend on Google Translate.
    if (getSavedLanguage() === "cop") return;

    createTranslationWidget();

    if (document.getElementById("google-translate-script")) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    script.onerror = () => {
      translateFailed = true;
      translateReady = false;
      pendingLanguage = null;
      setDocumentLanguage("en", false);

      if (languageSelect && languageSelect.value !== "en") {
        showStatus(
          "Automatic translation could not load. Check your internet connection; the website remains in English."
        );
      }
    };

    document.head.appendChild(script);
  }

  // LANGUAGE SELECTOR

  if (languageSelect) {
    const initialLanguage = getSavedLanguage();

    languageSelect.value = initialLanguage;

    if (languageSelect.value !== initialLanguage) {
      languageSelect.value = "en";
      saveLanguage("en");
    }

    languageSelect.addEventListener("change", () => {
      const language = supportedLanguages.includes(languageSelect.value)
        ? languageSelect.value
        : "en";

      languageSelect.value = language;
      saveLanguage(language);

      if (language === "cop") {
        applyCopticLanguage();
      } else if (language === "en") {
        resetToEnglish();
      } else {
        restoreCopticOriginalText();
        applyGoogleLanguage(language);
      }
    });

    if (initialLanguage === "cop") {
      applyCopticLanguage();
    } else if (initialLanguage !== "en") {
      pendingLanguage = initialLanguage;
      showStatus(
        "Preparing automatic translation into " +
        languageNames[initialLanguage] +
        "."
      );
    } else {
      setDocumentLanguage("en", false);
      hideStatus();
    }
  }

  loadTranslationScript();

  // DIRECTORY PROTOTYPE HOOKS

  function directoryNotice() {
    const emptyState = document.querySelector("#directory .empty-state");

    if (emptyState) {
      emptyState.setAttribute("aria-live", "polite");
    }

    // No directory database is connected yet.
  }

  if (nodeSearch) {
    nodeSearch.addEventListener("input", directoryNotice);
  }

  if (nodeType) {
    nodeType.addEventListener("change", directoryNotice);
  }

  directoryNotice();
})();
