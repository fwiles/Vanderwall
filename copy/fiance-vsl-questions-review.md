# English fiancé VSL question revision — local only

Supersedes the pending-question implementation notes in fiance-vsl-review.md. Based on upstream 311f6c955b39df8e9fd074a8c4f2baed3fc9a600, preserving the corrected Spanish AOS calendar. No production changes in this revision.

Source: Landing Page Forms, EN FIance Visa LP tab t.3tj1brblix8k, independently read by parent research thread:
https://docs.google.com/document/d/1OVcbN6KXn58cqy_GX7oTIoSOSPAoEDEjnSigVa642Is/edit?tab=t.3tj1brblix8k
Source heading: “Qualifying Questions (All answers Qualify for this form)”. The five questions and all options are staged verbatim, including A/B/C option labels. Supplied is not user-approved; questionsApproved remains false.

Local URL: http://localhost:3047/fiance-visas/vsl/
Flow: video → five radio auto-advance questions with Back/progress → inactive booking review. All 243 combinations proceed, including noncitizen, married, no meeting and free/pro bono responses. No legal eligibility determination, payment authorization, answer transmission/storage or live calendar loading. Answers stay in page memory. Escape/browser Back return to the video; reopening/browser Forward resume the current step. Back within the questionnaire preserves answers for editing. Double-clicks cannot skip the next question.

Preserved English mappings:
- Lawmatics: 9c9f0d5f-c64c-4b61-94d4-fb4ebb771220, inert template only.
- Vidalytics: huvcGAfeK4JoHBrx, account e24TCOvn.
Spanish source provenance ONLY (no new route): ES FIance Visa LP tab t.4t199yylhd7j; Lawmatics a0860595-7233-408e-989e-fde9fbd1d926; Vidalytics SjeCq22yzIFJF0xC.

Approval-dependent work: obtain explicit user go-ahead before activating the English Lawmatics loader and publishing this question revision. Verify the booking form and confirmation destination when activation is authorized; no lead submission has been tested. Keep the optional $150/45-minute attorney consultation distinct from free team intake. The source email does not authorize publication or intake activation.

QA: 243 option combinations exercised in pure routing tests; exact labels/order, invalid choices, no disqualification, English/Spanish embed separation and inert Lawmatics guarded by regression tests. Browser: CTA double-click (caught and corrected click-through), answer Back/change, noncitizen/uncertain/married/no meeting/free-help path, terminal inactive state, Escape, browser Back/Forward, reopen and focus restoration checked. Desktop/mobile pixel/overflow checks performed. All unrelated generated files remain byte-identical. No screenshots uploaded, email sent, push or deployment.
