# Vanderwall Immigration landing pages

English at `/`, Spanish at `/es/`. Preserves the supplied navy/teal design and responsive layout. Static HTML/CSS with a small progressive-enhancement script and a Vercel Node function for intake; no runtime package dependencies.

## Deploy to Vercel

1. Import this repository. Use the **repository root** as Root Directory.
2. Framework Preset: **Other**. The checked-in `vercel.json` sets `npm run build`, output `dist`, and Node 22 is selected by `package.json`.
3. Set `SITE_URL` to the final HTTPS origin, e.g. `https://immigration.example.com`. Without it, Vercel's production hostname is used if available; local builds omit canonical links.
4. Deploy. The form stays visible, with submission disabled and a call instruction until the intake webhook exists.
5. When ready, add `INTAKE_WEBHOOK_URL` and optionally `INTAKE_WEBHOOK_TOKEN` to the project's environment variables, then **redeploy**. Use a test destination in Preview and the live destination in Production.
6. Submit one controlled test request to verify delivery in the receiving system before sending paid traffic. Local checks use a mocked receiver; no real intake was submitted.

`dist` contains only public page assets. Copy decks, design references, tests and secrets are not copied into the static output. `/api/consultation` is deployed as a Vercel Function from the root `api` folder. The site is deliberately `noindex, follow`, including an HTTP header, for paid traffic. No production deployment has been performed.

## Webhook contract

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

Without `INTAKE_WEBHOOK_URL` at build time, the form remains visible, its submit button is disabled, and a call instruction explains that online requests are not yet available; the API returns 503 rather than accepting undeliverable leads.

## Tracking

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

Open `http://localhost:3000` and `/es/`. For a configured local form, copy `.env.example` to `.env.local`, set a test webhook, and restart `npm run dev`. Build: `npm run build`. No third-party package dependencies are needed.

Tests cover bilingual output, anchors/assets, deployment configuration, validation, spam, unsupported requests, native form submissions, webhook acceptance and failure. Browser checks were performed separately at 360, 390, 768, 1024 and 1440px; see the task handoff for results.

## Content handoff

The supplied source copy is retained; business details, fees, ratings and legal-service claims have not been independently re-approved for launch. The desktop/mobile HTML artboards remain in `reference/`.

The Spanish deck explicitly requests approved Spanish legal text and original Spanish testimonials. Until supplied, `/es/` retains the provided **English disclaimer, founder quotation and authentic English testimonials**, with `lang="en"`; testimonials are visibly labeled as English. The linked Spanish testimonial source was unavailable during preparation. Replace these with approved Spanish originals when available. No translated client quotes or legal disclaimers were invented.

Mock staff initial avatars and the unverified `+18` chip were removed. The founder photo has a smaller 400px WebP source. No new staff photographs or award claims were added.

## Source files

- `index.html`: English page.
- `es/index.html`: Spanish page, adapted from the supplied Spanish copy deck.
- `styles.css`: shared responsive design.
- `app.js`: progressive form handling and conversion events.
- `assets/`: supplied images and an optimized founder image.
- `copy/`: original copy decks and source notes.
- `reference/`: original desktop and mobile artboards.

Run `npm run dev` from the repository root rather than opening the HTML directly: shared assets use root-relative URLs. Production output is generated in `dist/`.

## Instant-form variant

`/instant/` is a separate English, single-column landing page with six form steps, review/edit/back controls, existing testimonials, and founder/experience callouts. It is built from `instant/index.html`, `instant/instant.css`, `instant/instant.js`, and the field mapping in `lib/instant-schema.js`.

`/api/instant` validates the five PDF screening answers plus first name, phone, and email, then submits directly to the provided Lawmatics public form endpoint. It does not use `INTAKE_WEBHOOK_URL`, collect the $150 consultation payment, or book an appointment. Optional UTM attribution is passed without retaining answers in browser storage. A successful delivery uses the existing `generate_lead` tracking event; failed requests retain inputs and allow retry.

See `copy/instant-form-source.md` for exact source details, reconstructed labels, field mapping, and delivery limitations. Automated tests mock Lawmatics. One explicitly approved live test lead was accepted during troubleshooting; see the source notes. The existing `/` and `/es/` intake flow is unchanged. Run `npm run dev` again after changing server routes to pick up the new `/api/instant` handler.
