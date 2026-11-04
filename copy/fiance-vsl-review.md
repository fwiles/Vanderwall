# Fiancé visa VSL — local review, November 4, 2026

Route: /fiance-visas/vsl/ (separate from the existing paid-search /fiance-visas/).
Local preview: http://localhost:3047/fiance-visas/vsl/

Source provenance supplied and verified by the parent research thread:
- Samuel’s Nov 4 email, “Fiancé Visa LP VSL and Form.”
- Landing Page Forms, tab t.3tj1brblix8k: https://docs.google.com/document/d/1OVcbN6KXn58cqy_GX7oTIoSOSPAoEDEjnSigVa642Is/edit?tab=t.3tj1brblix8k
- Script landing-page tab t.l2vzibs38yce: https://docs.google.com/document/d/1VbnAfYokAGYZfvQhUzWD8Z8ULpSVYHuULxq-_h17yT4/edit?tab=t.l2vzibs38yce
- Format reference: /vsl/index.html, /vsl/vsl.css and /vsl/vsl.js at origin/main 64be723.

Uses the source headline, subhead, CTA and support copy. No new legal claims, promises, video duration or free attorney consultation claim. Video ID huvcGAfeK4JoHBrx rendered successfully in browser and showed K-1 educational material. Speaker credit remains neutral (Vanderwall Immigration), pending definitive identity confirmation beyond the supplied script.

New page preserves the VSL design and hide/reveal progression: video hero and collage hide, video pauses, focus moves to the questionnaire card. Pending questions are represented by an explicit non-submitting screen. Back/Escape restore the CTA; browser Back/Forward restore the view. There is no modal.

Lawmatics 9c9f0d5f-c64c-4b61-94d4-fb4ebb771220 is staged exactly in an inert template. The preview runtime has no live loading/submission path. No spouse question schema, live spouse booking link, or spouse embed is reused. Questions remain empty and unapproved in the separate schema. Once Samuel supplies wording/options/order and any screening rules, implement the one-question radio auto-advance renderer using those approved questions, then explicitly enable the lazy calendar loader and verify the intended calendar/confirmation destination. Do not activate based on array length alone. Page and production publication approval remain required.

QA: existing 17 tests passed (child-process sandbox restriction resolved with authorized execution); additional isolated intake-safety test passed; node syntax and git whitespace checks passed. No lint/type scripts are configured. All 37 pre-existing generated files compared byte-identical. Actual video rendered and paused on CTA. Desktop repeated CTA/double click, pending heading focus, Escape restoration, Back button and browser Back/Forward passed. No live Lawmatics script/iframe appeared. Desktop and 390px mobile overflow checks passed. No real leads submitted. No push/deployment/email.
