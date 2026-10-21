(() => {
  "use strict";

  // TAC website: navigation, language selection and directory controls.
  // Automatic translation is provided by Google's external widget.
  // No API key or server-side code is required by this script.

  const menuButton = document.getElementById("menu");
  const nav = document.getElementById("nav");
  const languageSelect = document.getElementById("language");
  const languageStatus = document.getElementById("languageStatus");
  const nodeSearch = document.getElementById("nodeSearch");
  const nodeType = document.getElementById("nodeType");

  const supportedLanguages = [
    "en", "mt", "es", "fr", "it", "de", "vi", "hi", "zh",
    "ru", "ar", "pt", "nl", "el", "ko", "ja", "af", "zu",
    "mn", "lo"
  ];

  const languageNames = {
    en: "English",
    mt: "Malti",
    es: "Español",
    fr: "Français",
    it: "Italiano",
    de: "Deutsch",
    vi: "Tiếng Việt",
    hi: "हिन्दी",
    zh: "中文",
    ru: "Русский",
    ar: "العربية",
    pt: "Português",
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

  // --------------------------------------------------
  // Mobile navigation
  // --------------------------------------------------

  function closeMenu() {
    if (!menuButton || !nav) return;

    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");

    const srLabel = menuButton.querySelector(".sr");
    if (srLabel) srLabel.textContent = "Open navigation";

    menuButton.setAttribute("aria-label", "Open navigation");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

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
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // --------------------------------------------------
  // Translation status
  // --------------------------------------------------

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

  function setPageLanguage(language, translated) {
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
      // Translation still works if browser storage is unavailable.
    }
  }

  // --------------------------------------------------
  // Load Google's translation widget
  // --------------------------------------------------

  function createTranslationWidget() {
    if (document.getElementById("google_translate_element")) return;

    const widget = document.createElement("div");
    widget.id = "google_translate_element";

    // Keep the secondary widget out of the visible layout.
    // The site's existing language selector remains the user control.
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

  function applyGoogleLanguage(language) {
    if (language === "en") {
      pendingLanguage = null;

      const combo = getGoogleLanguageSelector();

      if (combo) {
        combo.value = "en";
        combo.dispatchEvent(new Event("change", { bubbles: true }));
      }

      setPageLanguage("en", false);
      hideStatus();
      return;
    }

    if (translateFailed) {
      setPageLanguage("en", false);
      showStatus(
        "Automatic translation is unavailable. The website remains in English."
      );
      return;
    }

    const combo = getGoogleLanguageSelector();

    if (!translateReady || !combo) {
      pendingLanguage = language;
      setPageLanguage("en", false);
      showStatus(
        "Preparing automatic translation into " +
        languageNames[language] +
        ". The page may remain in English while it loads."
      );
      return;
    }

    const optionExists = Array.from(combo.options).some(
      (option) => option.value === language
    );

    if (!optionExists) {
      pendingLanguage = null;
      setPageLanguage("en", false);
      showStatus(
        "Automatic translation into " +
        languageNames[language] +
        " is unavailable. The page remains in English."
      );
      return;
    }

    pendingLanguage = null;
    setPageLanguage(language, true);

    showStatus(
      "Automatic translation into " +
      languageNames[language] +
      " requested. Some wording may be inaccurate."
    );

    combo.value = language;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Google's script calls this named global function after loading.
  window.googleTranslateElementInit = function () {
    try {
      if (
        !window.google ||
        !window.google.translate ||
        !window.google.translate.TranslateElement
      ) {
        throw new Error("Translation widget unavailable");
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

      // The widget's language dropdown can appear after initialisation.
      let attempts = 0;

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

        if (attempts >= 40) {
          window.clearInterval(waitForSelector);
        }
      }, 250);
    } catch {
      translateFailed = true;
      setPageLanguage("en", false);
      showStatus(
        "Automatic translation could not be started. The website remains in English."
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
      setPageLanguage("en", false);

      if (languageSelect && languageSelect.value !== "en") {
        showStatus(
          "Automatic translation could not load. Check your internet connection; the website remains in English."
        );
      }
    };

    document.head.appendChild(script);
  }

  // --------------------------------------------------
  // Language selector
  // --------------------------------------------------

  if (languageSelect) {
    const initialLanguage = getSavedLanguage();
    languageSelect.value = initialLanguage;

    languageSelect.addEventListener("change", () => {
      const language = supportedLanguages.includes(languageSelect.value)
        ? languageSelect.value
        : "en";

      languageSelect.value = language;
      saveLanguage(language);

      if (language === "en") {
        applyGoogleLanguage("en");
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
    }
  }

  loadTranslationScript();

  // --------------------------------------------------
  // Directory controls
  // --------------------------------------------------

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
