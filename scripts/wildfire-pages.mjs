import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { wildfireCopy } from '../wildfire/content.mjs';
import { instantFields } from './instant-fields.mjs';
import { disqualificationMessages } from '../lib/instant-schema.js';

export async function buildWildfirePages(output, origin = '') {
  await mkdir(new URL('wildfire/', output), { recursive: true });
  await cp(new URL('../wildfire/wildfire.js', import.meta.url), new URL('wildfire/wildfire.js', output));
  // Keep the Spanish runtime byte-identical; the corrected English embed gets its own asset.
  const englishFormId = '00183874-c318-4b52-a528-f86368b354c3';
  const spanishFormId = '2dea1e18-5ad9-4988-aa79-493af577f8c0';
  const runtime = await readFile(new URL('../wildfire/wildfire.js', import.meta.url), 'utf8');
  await writeFile(new URL('wildfire/wildfire-en.js', output), runtime.replaceAll(spanishFormId, englishFormId));
  for (const language of ['en', 'es']) {
    const prefix = language === 'es' ? 'es/' : '';
    const copy = wildfireCopy[language];
    const formId = language === 'en' ? englishFormId : spanishFormId;
    let html = await readFile(new URL(`../${prefix}instant/index.html`, import.meta.url), 'utf8');
    html = html.replace('/instant/instant.js', language === 'en' ? '/wildfire/wildfire-en.js' : '/wildfire/wildfire.js');
    html = html.replace(/<h1 id="instant-title">[\s\S]*?<\/h1>/, `<h1 id="instant-title">${copy.title}</h1>`);
    html = html.replace(/(<h1 id="instant-title">[\s\S]*?<\/h1>\s*)<p>[\s\S]*?<\/p>/, `$1<p>${copy.subtitle}</p>\n<a class="btn btn--primary" href="#consult">${copy.cta}</a>\n<p class="wf-hero-call">${copy.call} <a data-call="" href="tel:+13605640763" style="color: inherit;">${language === 'es' ? 'Llame al' : 'Call'} 360-564-0763</a></p>`);
    html = html.replace(/(<a class="instant-nav-link"[^>]*>)[\s\S]*?<\/a>/, `$1${copy.cta}</a>`);
    html = html.replace(/>Request Appointment<|>Solicitar cita</g, `>${copy.cta}<`);
    html = html.replace('<section class="instant-hero"', '<section id="top" class="instant-hero"');
    const back = language === 'es' ? 'Atrás' : 'Back';
    const nojs = language === 'es' ? 'Active JavaScript para completar el formulario o llame al (503) 206-8414.' : 'Enable JavaScript to complete the form or call (503) 206-8414.';
    const fallback = language === 'es' ? 'Si el formulario no aparece, ábralo en una nueva pestaña.' : 'If the form does not appear, open it in a new tab.';
    html = html.replace(/<form id="instant-form"[\s\S]*?<\/form>\s*<div class="instant-success"[\s\S]*?<\/div>/, `<h2 id="wf-heading">${copy.heading}</h2><p>${copy.intro}</p>
<noscript><p>${nojs}</p></noscript>
<form id="wf-form" hidden>
<p id="wf-progress" aria-live="polite"></p>
${instantFields(language)}
<div class="instant-actions"><button type="button" id="wf-back" class="btn btn--ghost-light">${back}</button><button type="submit" class="btn btn--primary">${copy.cta}</button></div>
</form>
<p id="wf-screening" role="alert" tabindex="-1" hidden>${disqualificationMessages[language]}</p>
<section id="wf-embed" aria-labelledby="wf-embed-title" hidden>
<h3 id="wf-embed-title" tabindex="-1">${language === 'es' ? 'Datos de contacto' : 'Contact details'}</h3>
<div id="lm-embedded-script"></div>
<p><a href="https://app.lawmatics.com/forms/embedded/${formId}" target="_blank" rel="noopener">${fallback}</a></p>
<button type="button" id="wf-edit" class="btn btn--primary">${back}</button>
</section>`);
    html = html.replace(/href="\/(es\/)?instant\/"/g, (_, es) => `href="/${es || ''}instant-wf/"`);
    html = html.replace(/(class="site-header__logo" href=")[^"]+/, '$1#top');
    const path = `${prefix}instant-wf/`;
    const metadata = origin ? `<link rel="canonical" href="${origin}/${path}">\n<link rel="alternate" hreflang="en" href="${origin}/instant-wf/">\n<link rel="alternate" hreflang="es" href="${origin}/es/instant-wf/">` : '';
    html = html.replace('<!-- DEPLOY_METADATA -->', metadata);
    // The supplied CallRail number belongs only to the two Wildfire routes.
    html = html.replaceAll('(503) 206-8414', '360-564-0763').replaceAll('+15032068414', '+13605640763');
    await mkdir(new URL(path, output), { recursive: true });
    await writeFile(new URL(`${path}index.html`, output), html);
  }
}
