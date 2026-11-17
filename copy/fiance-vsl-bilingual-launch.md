# Bilingual fiancé VSL launch

Supersedes inactive/local-only status in earlier review notes. User explicitly approved publishing both English and Spanish fiancé VSLs and activating their respective booking forms. No lead submission, booking or account configuration change authorized/performed.

Source: Landing Page Forms document 1OVcbN6KXn58cqy_GX7oTIoSOSPAoEDEjnSigVa642Is, parent verified at 19:31 UTC. EN tab t.3tj1brblix8k, ES tab t.4t199yylhd7j. Exact source questions retained; Q2 has four separate choices in each language. All 324 combinations per language proceed; no legal eligibility determination.

Routes and mappings:
- /fiance-visas/vsl/: Lawmatics 9c9f0d5f-c64c-4b61-94d4-fb4ebb771220; video huvcGAfeK4JoHBrx.
- /es/fiance-visas/vsl/: Lawmatics a0860595-7233-408e-989e-fde9fbd1d926; video SjeCq22yzIFJF0xC.
- Both videos use account e24TCOvn. Neutral speaker credits; no inferred attorney status for Spanish presenter.

Each language has isolated schema/runtime and corresponding inert HTML template, activated only after five questions. Single-load guard preserves the iframe on Back/re-entry. Answers stay in page memory; no answers are sent to Lawmatics, dataLayer, API, URLs or persistent storage. Contact information/booking belong to the supplied Lawmatics form. Existing GTM/CallRail installation remains unchanged; no new answer tracking was added. Free team intake remains distinct from optional $150/45-minute attorney consultation; answering does not authorize payment.

QA: 23 tests pass, including exact EN/ES source wording and all 324 paths in each language. Build/syntax/whitespace checks pass. Browser checks include actual video playback, pause on CTA, double-click protection, Back/change answer, selection preservation, Escape and focus restoration, history Back/Forward and reopen, reciprocal language links, no early calendar load and a single correct iframe on completion/re-entry. Desktop and 390px mobile layouts inspected without horizontal overflow. Some Spanish Lawmatics calendar/SMS text remains English; preserved as supplied, no account changes.

37 unrelated generated files remain byte-identical to the pre-question baseline, including Spanish AOS correction. Three new Spanish files increase generated total from 40 to 43. Only the three English fiancé files and three new Spanish files differ from the baseline. Existing build behavior is additive. No submissions, personal information or payment data entered.
