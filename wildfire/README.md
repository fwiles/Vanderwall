# Wildfire landing pages

New routes: `/instant-wf/` and `/es/instant-wf/`. Built by `scripts/wildfire-pages.mjs` during the normal build, from the existing instant templates. Only the build entry point changes among existing files. Current page HTML, scripts, forms, tracking and URLs are untouched.

Baseline: `cf83839`, fetched from origin/main November 2, 2026. Isolated working copy branch: `wildfire-draft`. Original desktop checkout is untouched, including its pre-existing deleted `.aws` entry.

English headline, subhead, CTA, form heading and intro follow Samuel's November 2 email. Spanish is a faithful adaptation for review. Source content: `wildfire/content.mjs`.

The five existing qualification questions and screening rules are preserved. Qualified visitors then see the supplied Wildfire Lawmatics embed. Qualification answers stay in browser memory and are not sent to the original `/api/instant`, Lawmatics, URLs or analytics. The supplied embed has no documented mapping for those answers. Contact details and booking are handled by Lawmatics. No conversion is emitted merely for reaching the embed. Existing GTM/CallRail and phone-click behavior are inherited; external container/number configuration was not changed.

## Items for Samuel to confirm

- The user deferred the new phone number. Existing `(503) 206-8414` is unchanged, **not a new Wildfire tracking number**. The added “Prefer to talk now? Call NEW NUMBER” CTA was omitted. Existing source-page phone links remain.
- Both supplied Google Doc tabs use `2dea1e18-5ad9-4988-aa79-493af577f8c0`. This exact ID is used on both new pages pending clarification.
- Read-only inspection of the hosted form rendered **4.0 - ES Wildfire AOS LP Form**: English contact labels, a Spanish immigration-help question, an English appointment calendar and SUBMIT button. The English page therefore currently reaches that same mixed-language form. Its appointment-booking behavior conflicts with the requested callback copy. Embedded headings/button text require a Lawmatics-side change; no account settings were changed.
- Review Spanish adaptation and clarify whether the five local answers should be mapped into a corrected Wildfire form. No undocumented mapping was invented.

## QA and deployment

Run `npm test` and `npm run build`. Local preview: serve `dist/`, then visit the two new routes. Existing output files are compared byte-for-byte against the pre-change build; only two page routes and `/wildfire/wildfire.js` are added.

Browser QA traversed all five English questions using synthetic selections, verified the supplied embed loads, and checked Back preserves the selected answer. No embedded contact fields were entered and no lead was submitted. Automated checks cover routes, bilingual metadata/links, original phone/tracking retention and absence of the old intake endpoint on the new pages.

No push, deployment, or email has been performed. Parent thread handles email and form/phone clarification. Prospective production URLs are `https://go.vanderwallimmigration.com/instant-wf/` and `https://go.vanderwallimmigration.com/es/instant-wf/`; do not describe these as deployed until a deployment is completed and checked.
