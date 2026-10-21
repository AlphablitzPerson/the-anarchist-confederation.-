
(() => {
  "use strict";

  // The Anarchist Confederation (TAC)
  // Language selector, mobile navigation and directory hooks.

  const menuButton = document.getElementById("menu");
  const nav = document.getElementById("nav");
  const languageSelect = document.getElementById("language");
  const languageStatus = document.getElementById("languageStatus");
  const nodeSearch = document.getElementById("nodeSearch");
  const nodeType = document.getElementById("nodeType");

  const supportedLanguages = [
    "en", "mt", "es", "fr", "it", "de", "vi", "hi",
    "zh-CN", "ru", "ar", "pt", "nl", "el", "ko", "ja",
    "af", "zu", "mn", "lo"
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
    lo: "ລາວ"
  };

  const STORAGE_KEY = "tac-preferred-language";

  let translateReady = false;
  let translateFailed = false;
  let pendingLanguage = null;
  let englishReloadStarted = false;

  // MOBILE NAVIGATION

  function setMenuState(isOpen) {
    if (!menuButton || !nav) return;

    nav.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    const srLabel = menuButton.querySelector(".sr");
    if (srLabel) {
      srLabel.textContent = isOpen
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

  // LANGUAGE STATUS AND PREFERENCES

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

  function setDocumentLanguage(language, translated) {
    document.documentElement.lang = translated ? language : "en";
    document.documentElement.dir =
      translated && language === "ar" ? "rtl" : "ltr";
  }

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return supportedLanguages.includes(saved) ? saved : "en";
    } catch {
      return "en";
    }
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The site remains usable if browser storage is unavailable.
    }
  }

  // GOOGLE TRANSLATE WIDGET

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
    if (!combo) return false;

    return Array.from(combo.options).some(
      (option) => option.value === language
    );
  }

  // English must undo the translated DOM, not merely change the selector.
  // Clear the common Google translation cookie and reload the original page.
  function resetToEnglish() {
    pendingLanguage = null;
    saveLanguage("en");
    setDocumentLanguage("en", false);

    if (englishReloadStarted) return;
    englishReloadStarted = true;

    try {
      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
        window.location.hostname;

      const parts = window.location.hostname.split(".");
      if (parts.length >= 2) {
        const parentDomain = "." + parts.slice(-2).join(".");
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
          parentDomain;
      }
    } catch {
      // Reload even if browser cookie access is restricted.
    }

    showStatus("Returning to the original English page…");
    window.location.reload();
  }

  function applyGoogleLanguage(language) {
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
    setDocumentLanguage(language, true);

    showStatus(
      "Requesting automatic translation into " +
        languageNames[language] +
        ". Some wording may be inaccurate or may not use the requested regional variant."
    );

    combo.value = language;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Google calls this global function when its script loads.
  window.googleTranslateElementInit = function () {
    try {
      if (
        !window.google ||
        !window.google.translate ||
        !window.google.translate.TranslateElement
      ) {
        throw new Error("Google Translate widget is unavailable");
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: supportedLanguages
            .filter((language) => language !== "en")
            .join(","),
          autoDisplay: false
        },
        "google_translate_element"
      );

      let attempts = 0;
      const maxAttempts = 40;

      const waitForSelector = window.setInterval(() => {
        attempts += 1;

        const combo = getGoogleLanguageSelector();

        if (combo) {
          window.clearInterval(waitForSelector);
          translateReady = true;

          if (pendingLanguage) {
            applyGoogleLanguage(pendingLanguage);
          } else if (
            languageSelect &&
            languageSelect.value !== "en"
          ) {
            applyGoogleLanguage(languageSelect.value);
          }

          return;
        }

        if (attempts >= maxAttempts) {
          window.clearInterval(waitForSelector);
          translateFailed = true;

          if (languageSelect && languageSelect.value !== "en") {
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

    languageSelect.addEventListener("change", () => {
      const selected = languageSelect.value;
      const language = supportedLanguages.includes(selected)
        ? selected
        : "en";

      languageSelect.value = language;
      saveLanguage(language);

      if (language === "en") {
        resetToEnglish();
      } else {
        applyGoogleLanguage(language);
      }
    });

    if (initialLanguage !== "en") {
      pendingLanguage = initialLanguage;
      showStatus(
        "Preparing automatic translation into " +
          languageNames[initialLanguage] +
          "."
      );
    } else {
      setDocumentLanguage("en", false);
    }
  }

  loadTranslationScript();

  // DIRECTORY PROTOTYPE HOOKS

  function directoryNotice() {
    const emptyState = document.querySelector("#directory .empty-state");

    if (emptyState) {
      emptyState.setAttribute("aria-live", "polite");
    }

    // This prototype has no directory database yet.
    // Do not invent entries or imply that filtering is operational.
  }

  if (nodeSearch) {
    nodeSearch.addEventListener("input", directoryNotice);
  }

  if (nodeType) {
    nodeType.addEventListener("change", directoryNotice);
  }

  directoryNotice();
})();
