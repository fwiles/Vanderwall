# Vanderwall Immigration landing pages

English at `/`, Spanish at `/es/`. Preserves the supplied navy/teal design and responsive layout. Static HTML/CSS with a small progressive-enhancement script and a Vercel Node function for intake; no runtime package dependencies.

## Deploy to Vercel

1. Import this repository. Use the **repository root** as Root Directory.
2. Framework Preset: **Other**. The checked-in `vercel.json` sets `npm run build`, output `dist`, and Node 22 is selected by `package.json`.
3. Set `SITE_URL` to the final HTTPS origin, e.g. `https://immigration.example.com`. Without it, Vercel's production hostname is used if available; local builds omit canonical links.
4. Deploy. The main English and Spanish pages lead to `/book/` and `/es/book/`, which load the supplied language-specific Lawmatics booking embeds. No intake webhook is required for this flow.
5. Verify the live embeds and booking configuration before sending paid traffic.

## Two-question booking flow

Booking confirmation pages are available at `/thank-you/` (English) and `/es/thank-you/` (Spanish). They include the call button and pull the matching landing page's existing reviews and footer at build time. After deployment, configure each Lawmatics calendar's successful-booking redirect to the matching absolute URL on the live site. The redirect is managed in Lawmatics and is not configured by this repository. Visits to these pages do not automatically emit a lead conversion.

The main landing pages ask only what the visitor needs help with and a brief description. Both questions are required to continue. These introductory answers are deliberately not saved, transmitted, included in URLs, or passed to Lawmatics. The controls have no `name` attributes, so native GET navigation also excludes their values when JavaScript is unavailable. The booking embed itself requires JavaScript and includes a phone fallback.

Booking pages use the full content width and the requested free intake appointment heading, translated on the Spanish page. Continuing to booking does not emit a lead conversion; completion tracking must be configured with Lawmatics. The `/instant/` variants retain their separate existing intake flow.

`dist` contains only public page assets. Copy decks, design references, tests and secrets are not copied into the static output. `/api/consultation` is deployed as a Vercel Function from the root `api` folder. The site is deliberately `noindex, follow`, including an HTTP header, for paid traffic. No production deployment has been performed.

## Legacy consultation API contract

The function POSTs JSON to your HTTPS endpoint. If set, `INTAKE_WEBHOOK_TOKEN` is sent as `Authorization: Bearer <token>`. It never reaches the browser.

```json
{
  "lang": "en",
  "name": "Test Visitor",
  "phone": "(503) 555-0100",
  "email": "test@example.com",
  "case_type": "Green card / family petition",
  "message": "Visitor's optional message",
  "source": "vanderwall-landing-page",
  "submitted_at": "2026-09-24T18:00:00.000Z"
}
```

`lang` is `en` or `es`; case types use the page's language. The receiver must return **2xx only after accepting the lead**. Redirects, errors and responses taking over 10 seconds are failures; the page retains the visitor's input and offers retry/call. A timeout can occur after the receiver accepts a request, so the receiving system should deduplicate repeated requests. There is no server-side storage or automatic retry queue here.

Required name, phone and email are validated server-side. Payload/field limits, an offscreen honeypot and same-origin browser checks are included. Never log case details or credentials. Native form POST works without JavaScript; inline feedback and conversion events require JavaScript.

The legacy `/api/consultation` endpoint is no longer used by the main landing pages. It still requires `INTAKE_WEBHOOK_URL` and returns 503 when unconfigured.

## Tracking

The supplied CallRail script for company `256727770` is installed immediately before `</body>` on all nine public HTML pages, including the 404 page, following CallRail’s manual installation instructions. It is included in local, preview, and production builds. Tracking-number configuration and live number-swapping verification are managed in CallRail.

The supplied Google Tag Manager container `GTM-KJ9SMN3` is installed in the head of both landing pages and loads in all environments. Existing `dataLayer` events are available for GTM triggers. Configure tags and publish changes in Google Tag Manager.

Optional direct Google tag environment variables are documented in `.env.example`. Leave these unset when the same tags are managed through GTM to avoid duplicate tracking:

- `GA4_ID`: `G-…`
- `GOOGLE_ADS_ID`: `AW-…`
- `GOOGLE_ADS_FORM_LABEL` / `GOOGLE_ADS_CALL_LABEL`: the labels for the two conversion actions.

The optional direct Google tags load only for Vercel Production builds; the installed GTM snippet loads on both pages in all environments. A confirmed form delivery emits `generate_lead`; phone clicks emit `click_to_call`. Both include page language and never include form fields. A phone click measures intent to call, not a completed call. A native submission without JavaScript is delivered but does not emit the browser conversion. Direct GA4/Ads IDs remain unset; tags within GTM are controlled by the container configuration. Configure consent handling to match the client's chosen analytics setup before enabling tags if required by that setup.

## Local preview and verification

```sh
npm install
npm test
npm run dev
```

Open `http://localhost:3000` and `/es/`. The main booking flow needs no local webhook configuration. Build: `npm run build`. No third-party package dependencies are needed.

Tests cover bilingual output, anchors/assets, deployment configuration, validation, spam, unsupported requests, native form submissions, webhook acceptance and failure. Browser checks were performed separately at 360, 390, 768, 1024 and 1440px; see the task handoff for results.

## Content handoff

The supplied source copy is retained; business details, fees, ratings and legal-service claims have not been independently re-approved for launch. The desktop/mobile HTML artboards remain in `reference/`.

The Spanish deck explicitly requests approved Spanish legal text and original Spanish testimonials. Until supplied, `/es/` retains the provided **English disclaimer, founder quotation and authentic English testimonials**, with `lang="en"`; testimonials are visibly labeled as English. The linked Spanish testimonial source was unavailable during preparation. Replace these with approved Spanish originals when available. No translated client quotes or legal disclaimers were invented.

Mock staff initial avatars and the unverified `+18` chip were removed. The founder photo has a smaller 400px WebP source. No new staff photographs or award claims were added.

## Source files

- `index.html`: English page.
- `es/index.html`: Spanish page, adapted from the supplied Spanish copy deck.
- `styles.css`: shared responsive design.
- `app.js`: phone/instant-form conversion events and mobile call controls.
- `book/index.html` and `es/book/index.html`: language-specific Lawmatics booking pages.
- `assets/`: supplied images and an optimized founder image.
- `copy/`: original copy decks and source notes.
- `reference/`: original desktop and mobile artboards.

Run `npm run dev` from the repository root rather than opening the HTML directly: shared assets use root-relative URLs. Production output is generated in `dist/`.

## Instant-form variant

`/instant/` is the English variant and `/es/instant/` is its Spanish counterpart. Each is a separate, single-column landing page with six form steps, review/edit/back controls, existing testimonials, and founder/experience callouts. It is built from `instant/index.html`, `instant/instant.css`, `instant/instant.js`, and the field mapping in `lib/instant-schema.js`.

`/api/instant` validates the five screening answers plus first name, phone, and email, then submits directly to the appropriate English or Spanish Lawmatics public form endpoint, selected from the validated `lang` field. It does not use `INTAKE_WEBHOOK_URL`, collect the $150 consultation payment, or book an appointment. Optional UTM attribution is passed without retaining answers in browser storage. Client disqualification rules apply in both languages: deportation/court/detention, employment/business/investment visas, student/tourist/J-1 visas, agricultural/seasonal visas, and free/pro bono requests stop the form and are not delivered to Lawmatics. All other listed choices qualify, including either location and all hiring-intent choices. Disqualified visitors immediately reach a terminal step inside the form, with questions and all back/edit/continue controls removed; the API also enforces screening for native POST and direct requests. Affirmative Asylum is displayed separately and maps to the existing Asylum CRM option because the public forms have no separate ID. A successful qualified delivery uses the existing `generate_lead` tracking event; failed requests retain inputs and allow retry.

See `copy/instant-form-source.md` and `copy/instant-form-es-source.md` for exact source details, reconstructed labels, field mapping, and delivery limitations. Automated tests mock Lawmatics. One explicitly approved live test lead was accepted during troubleshooting; see the source notes. The `/` and `/es/` pages use the separate two-question booking flow described above. Run `npm run dev` again after changing server routes to pick up the new `/api/instant` handler.

## Spouse green card VSL preview

`/vsl/` follows PLG’s centered video hero and step-by-step questionnaire structure, using Vanderwall branding and the client’s supplied copy. The captioned portrait video is served as H.264/AAC with fast-start metadata, a poster frame, native controls, and no automatic video download. Source: `AOS_VSL_captioned_review.mp4`; the optimized copy is in `assets/video/`.

The six questions and service-fit rules live in `lib/vsl-schema.js`. Disqualifying answers immediately end the questionnaire. All other answers, including “Not sure,” “Another way,” and willingness to pay without readiness to book, continue to the six contact fields. Back navigation preserves answers while the page remains open.

**Intentionally local-only at the client’s request:** this preview does not transmit or store answers/contact details, create a CRM lead, book an appointment, or emit a lead conversion. The contact step and completion screen identify this limitation. Existing GTM/CallRail page scripts are retained, but questionnaire data is not added to analytics. Before accepting live leads, supply a VSL-specific intake destination, enforce the same validation/screening on the server, and connect confirmed delivery to the appropriate scheduling flow. Do not reuse the old Lawmatics field IDs for these different questions.

Preview: `npm run dev`, then open `http://localhost:3000/vsl/`. The development server supports byte-range requests for video playback and seeking.

## K-1 and adjustment-of-status search landings

Four additional paid-search routes use the existing bilingual design and calendars:

| Service | English | Spanish |
| --- | --- | --- |
| K-1 / fiancé / partner visa options | `/fiance-visas/` | `/es/fiance-visas/` |
| I-485 / adjustment of status | `/adjustment-of-status/` | `/es/adjustment-of-status/` |

Edit service copy in `services/content.mjs`. `scripts/service-pages.mjs` renders these pages from the existing language templates during the normal build, retaining the header, founder, reviews, footer, GTM, CallRail and responsive CSS. Language switches preserve the service; canonical/hreflang URLs use `SITE_URL`. Existing general, instant and VSL pages are unchanged.

Each service form has two required selections: relationship or case stage, then applicant location. All choices continue to the same `/book/` or `/es/book/` calendar, with no screening or eligibility determination. Answers are not saved, transmitted, or added to URLs/analytics. The form explains this and distinguishes the free intake appointment from an attorney consultation. Existing Lawmatics embed IDs and confirmation setup are unchanged.

Research, official sources and copy rationale are in `copy/service-landing-research.html` (internal only). FAQs include relevant official-source links. These pages retain the site's paid-traffic `noindex` policy. Build checks cover all four routes, localized calendar destinations, metadata, anchors, assets and tracking snippets.
