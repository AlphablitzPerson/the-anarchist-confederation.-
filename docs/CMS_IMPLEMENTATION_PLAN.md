# TAC CMS implementation plan

## 1. Public information architecture
- Home and introduction
- Official charter and manifesto (canonical documents, version/date, translations)
- Principles and governance
- Public node directory (only entries approved for public display)
- Mutual-aid resources and collaborative projects
- News and announcements
- Public decisions and transparency records
- Membership and associate-partnership information
- Contact, privacy notice, accessibility and language pages

## 2. Proposed content types
- **Foundational document:** title, document type, official version, adoption date, language, file, accessible HTML text, translation status, supersedes/version history.
- **Node/partner listing:** group name, category, public description, regions/languages, public contact route, links, verification/consent status, last-confirmed date. Do not publish private member identities by default.
- **Project/resource:** purpose, participating groups, resource needs/offers, contact route, status, review date and consent for publication.
- **News/announcement:** headline, body, language, author/byline policy, draft/review/published state, publication date and correction history.
- **Public decision record:** decision text, relevant body/process, date, scope, outcome and public rationale where approved. Exclude private deliberations and personal data unless publication is authorised and safe.
- **Membership enquiry/application:** submitted data, consent, access-restricted review state, responsible agreed process, retention/deletion date and applicant communication history.

## 3. Suggested permission model
- **Public visitor:** read published public content and submit contact/application forms.
- **Applicant:** view their own application status and messages only if a secure applicant portal is later implemented.
- **Member:** access authenticated member resources and discussions according to the collectively agreed membership rules.
- **Node editor:** edit that node's own listing and content; cannot edit another node's private data by default.
- **Content editor/translator:** prepare drafts or translations, not silently rewrite the adopted charter.
- **Publisher/review group:** publish within a mandate established by TAC's agreed process; retain review and correction history.
- **Technical administrator:** maintain infrastructure; technical access must not be represented as political authority.
- **Supervision Council:** permissions only for the specific procedural/liaison tasks granted by the charter and SOP; no automatic global command or moderation power.

These are proposed technical roles, not claims that TAC has adopted this precise role system. Ratify the permission model through the appropriate process before launch.

## 4. Publication workflow
1. Author creates a draft.
2. Relevant node or authorised review process checks accuracy, consent, accessibility and privacy.
3. An authorised publisher releases the content within the scope of their mandate.
4. The CMS records the publication date, version and any correction.
5. Withdrawals and corrections are logged where appropriate without retaining unnecessary personal data.

Translations must be marked as draft, reviewed or official. The adopted source document remains identifiable and must not be silently replaced by a translation.

## 5. Member-only areas
Use server-side authentication and authorisation. Enforce access at the backend and data layer; hiding links or pages in JavaScript is not security. Use secure sessions, MFA for privileged roles where practical, rate limiting, anti-spam measures, encryption in transit, backups, logging with minimal personal data, and a documented incident-response process.

Do not put private member data, unpublished applications, private discussion content or security-sensitive records into public caches, public search indexes or front-end source files.

## 6. Multilingual foundation
The current UI lists the 20 language options specified for this project: English, Maltese, Spanish, French, Italian, German, Vietnamese, Hindi, Chinese, Russian, Arabic, Portuguese, Dutch, Greek, Korean, Japanese, Afrikaans, isiZulu, Mongolian and Lao. This is a planned language set, not evidence that translations exist. Use language-specific URLs, a translation status field, reviewed copy, accessible language labels and right-to-left layout support for Arabic. Do not machine-publish unreviewed translations as official charter text.

## 7. CMS decision criteria
Select a CMS only after checking: self-hosting/control options; accessibility; multilingual content and translation workflow; role-based permissions; audit history; export/backup portability; security maintenance; privacy/data residency needs; anti-spam support; and ability to prevent technical administrators from being mistaken for political decision-makers.

## 8. Launch checklist
- Confirm adopted public text and exact document versions.
- Approve public contact address and privacy notice.
- Confirm application eligibility, reviewing body, process, response expectations and retention period.
- Approve directory consent and verification rules.
- Agree publication and correction procedures.
- Configure and test language workflow.
- Implement backend authentication before member-only content goes live.
- Test keyboard access, mobile layout, screen readers, contrast and low-bandwidth performance.
- Set up HTTPS, backups, software updates, security monitoring and an incident contact route.
