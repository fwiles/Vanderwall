# Instant landing page source and integration

English variant: `/instant/`. Original `/` and `/es/` pages remain separate.

## Form source

User-provided `/home/fwiles/Downloads/ENGLISH - META FORM.pdf`, read September 25, 2026. Three pages; several question labels and the first two consultation options are visibly truncated. The reconstructed display labels are in `lib/instant-schema.js`. All five custom-field names and all 21 option IDs match the PDF; no qualification option is excluded from submission.

Order: immigration service, person needing help, their location, hiring intent, willingness to pay for a consultation, then contact details. The $150 consultation fee is taken from option 1799610. The form collects no payment and books no appointment.

The PDF's Name field is mapped to the standard `first_name` key per Lawmatics documentation, plus `phone` and `email`. Only first name is requested, rather than sending a full name to a first-name field. All eight source fields are required. The PDF does not specify field requiredness; requiring these fields is an implementation choice to deliver a complete intake.

Reconstructed labels (not recoverable verbatim from the PDF):
- What type of immigration help do you need?
- Where is the person who needs immigration help?
- Are you looking to hire an immigration attorney?
- Would you be willing to invest $150 in a consultation?
- Yes, I’m ready to invest $150 to speak directly with an immigration attorney.
- I’m open to a paid consultation, but I’m not ready to schedule yet.

## Delivery

Browser submits to `/api/instant`; server validates and POSTs JSON to the PDF endpoint:
`https://api.lawmatics.com/v1/forms/38523386-dfcf-4408-932e-aaca2901fd97/submit`.

Custom-field option IDs are sent as strings, not display labels. No OAuth credentials are needed for the public custom-form submit endpoint. This route is independent of the original landing page's `INTAKE_WEBHOOK_URL`.

Supported optional attribution: utm_source, utm_medium, utm_campaign, utm_content, utm_term, referring_url. Values come from the current landing URL, without persistent storage; referring_url excludes query and fragment. Only allowlisted fields are forwarded. Case answers and contact information are not sent to analytics. `generate_lead` fires once after confirmed acceptance; failed requests preserve answers and emit no conversion.

The server rejects malformed/oversized input, invalid option IDs, cross-origin browser requests, and honeypot submissions. It rejects upstream HTTP errors, explicit JSON failure/error bodies, and timeouts. There is no automatic retry or server-side storage. A network timeout can occur after delivery, so a manual retry may duplicate a submission.

Automated validation uses mocked upstream requests. On September 25, 2026, the user authorized one live test submission (“TEST — DELETE”, test@example.com, reserved number (202) 555-0100). The request through localhost:3001 was accepted by Lawmatics and the local API returned HTTP 200 with ok:true. No payment or appointment was created. A controlled delivery check in Lawmatics remains a launch check; it must verify CRM field values and downstream automations.

Documentation:
- https://help.lawmatics.com/en/articles/15939438-core-objects-endpoints-reference
- https://help.lawmatics.com/en/articles/10699870-connecting-your-webform-to-lawmatics-via-api

## Supporting copy

Existing sourced testimonials and collage are reused from the main landing page; the eight reviews remain in a single-column layout with four expandable. See `copy/review-sources.md` and `copy/copy-en.md`.

Founder dates and background: https://www.vanderwallimmigration.com/about-us/candace-vanderwall/ (checked September 25, 2026).
Office and language support: existing project copy and https://www.vanderwallimmigration.com/.
The new page avoids the old unverified aggregate review count and rating.

## Live metadata verification

On September 25, 2026, the public read-only endpoint `/v1/forms/38523386-dfcf-4408-932e-aaca2901fd97?fields=all` confirmed that the form is active and all simplified field names and option IDs match. The live form requires `first_name` and `phone`; email and screening questions are optional upstream (this landing page currently requires all eight). The full consultation question specifies $150 for 45 minutes. Its exact options are “Yes, I’m ready to invest $150 to speak directly with an immigration attorney about my case.” and “I’m open to a paid consultation, but I’m not ready to book yet.” The source PDF clipped those endings.

The documented success response is HTTP 201 with a JSON `data` object. Server diagnostics log only error categories and HTTP status, never submitted values or upstream response bodies. The browser receives a diagnostic code on upstream failure for troubleshooting.

The browser success screen was checked using the captured successful API response, without submitting a second lead. An email-validation mismatch (native browser acceptance of addresses such as test@test versus the server requiring a full domain) was corrected, and server validation errors now produce specific visitor feedback. The original user-reported failure was not reproduced, so its exact cause is not established. The local server was restarted with no-store caching for current assets.
