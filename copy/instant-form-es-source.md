# Spanish instant form

Page: `/es/instant/`. Source: `/home/fwiles/Downloads/SPANISH - META FORM.pdf`.

The PDF's active `ES - META FORM` was verified against public Lawmatics metadata on 2026-09-25. Full labels from metadata recover text clipped in the PDF. The five questions and all 21 options are stored verbatim in `spanishQuestions` in `lib/instant-schema.js`.

Spanish destination: `https://api.lawmatics.com/v1/forms/763da8f0-71d6-4400-9942-15a3a003bb56/submit`.

| Question | Field | Option IDs |
| --- | --- | --- |
| Type of immigration help | custom_field_944054 | 1799615–1799622 |
| Person needing help | custom_field_944055 | 1799623–1799627 |
| Current location | custom_field_944056 | 1799628–1799629 |
| Intent to hire | custom_field_944057 | 1799630–1799632 |
| $150 / 45-minute consultation | custom_field_944059 | 1799719, 1799718, 1799717 |

Contact fields are `first_name`, `phone`, and `email`. This landing page requires all screening answers and all three contact fields, consistent with its English counterpart. Lawmatics itself marks first name and phone required. All consultation choices are accepted, including the free/pro bono choice; none silently disqualifies the visitor. Submission requests contact; it does not book or charge for a consultation.

Both language variants POST to `/api/instant`. The server validates `lang`, picks that language's field mapping and fixed upstream URL, and forwards only supported fields. `lang` is not forwarded to Lawmatics. The Spanish form uses Spanish validation, navigation, review/edit, failure/retry, and success text. Links switch between the two instant variants.

Six testimonials use the Spanish wording published at https://www.vanderwallimmigration.com/es/ (Mayra Salinas, Lyra Starlight, Nevaeh Buen, Jacki Winter, Karla, Artessia House). The other two retain original English and are visibly labeled as such. Bold emphasis is editorial. The collage and experience sections reuse existing site content.

Validation: automated tests exercise every Spanish option, the separate endpoint, invalid/missing/cross-language fields, localized responses, native POST, and built output. Browser checks intercept submissions. No live Spanish lead has been sent; the earlier approved live test was for the English form only.
