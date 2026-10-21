# The Anarchist Confederation (TAC) — website foundation

A polished, responsive public-site prototype designed around TAC's supplied insignia, flag artwork and charter-grounded decentralised governance. This is a **front-end foundation**, not a deployed CMS or authenticated member platform.

## Included
- `index.html` — public homepage with charter/manifesto section, node directory, governance explanation, mutual-aid/projects, news, transparency records, contact and membership entry points.
- `styles.css` — responsive visual system, mobile navigation, keyboard focus support and reduced-motion handling.
- `app.js` — mobile navigation and an accessible language-status message. Languages without reviewed translations fall back clearly to English; the script does not pretend translations exist.
- `assets/tac-official-round-insignia.jpg` — the exact supplied round insignia.
- `assets/tac-anarcho-syndicalist-cog-flag.jpg` — the supplied plain cog flag.
- `assets/tac-mutual-defense-shield-flag.jpg` — the supplied shield-variant flag.
- `docs/CMS_IMPLEMENTATION_PLAN.md` — proposed content types, roles, publication workflow and security boundaries.
- `documents/TAC_Foundational_Charter_and_Manifesto.pdf` — supplied combined charter and manifesto PDF, with read and download links.
- `documents/TAC_Supervision_Council_SOP.pdf` — supplied SOP PDF, with read and download links.
- `documents/TAC_Vision_Mission_and_Core_Values.pdf` — supplied vision, mission and core values PDF, with read and download links.

## Contact
`secularperspective@outlook.com`

## Local preview
Open `index.html` in a modern browser, or run `python -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Important limits before launch
- This is not yet connected to a content-management system, database, membership application backend, email service or authentication provider.
- Membership links open an email draft; they do not submit or store applications.
- Directory, news and transparency sections intentionally contain no invented entries.
- The 20-language selector remains a translation-status fallback, not a full translation system. English is the currently published language; professionally reviewed translations and right-to-left layout testing are required before live switching can be enabled.
- Confirm the official version numbers, adoption dates, and amendment history for each linked document before treating this as the formal register.
- Configure server-side permissions, HTTPS, backups, anti-spam controls, data minimisation, privacy notices and retention rules before collecting applications or publishing private content.

## Governance guardrail
The website is a tool for communication and coordination, not a central authority. Keep the General Assembly's role, the Supervision Council's limited procedural and liaison functions, and the autonomy of nodes consistent with the adopted charter and any valid amendments. CMS permissions should enable agreed publication processes without granting the site administrator political command over the confederation.


## Official network listings and contacts

The public site includes separate **Official Members** and **Affiliate Members** listings, with the provided Discord invite links, and an **Official Contacts** section for the YouTube, TikTok, Instagram and email channels supplied by TAC. These are public links; the site does not authenticate or verify the third-party accounts.


## Changes in this package
- Added direct read/download links for the three supplied TAC PDFs (the charter and manifesto are in one combined source PDF).
- Replaced the browser alert for untranslated languages with an inline accessible status message and a clear English fallback.
- Preserved the supplied insignia, both flags, member links, social links and autonomy guardrails.
- The CMS, authenticated member area, live directory submissions, news publishing and application storage are still not connected. Those require a selected/configured service and should not be advertised as operational.

  Testing
